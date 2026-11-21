#!/usr/bin/env node
// Lightweight main-branch protection for Claude Code (PreToolUse on Bash and PowerShell).
//
// Refuses, from any Claude session or agent in this project:
//   - git commit / merge / rebase / cherry-pick / revert / am / pull while the target checkout is on main
//   - git push that targets main (explicit refspec, HEAD:main, --all, --mirror, or a bare push from main)
//   - any force push (--force, -f, --force-with-lease, +refspec)
//   - moving main by hand (git branch -f main, git update-ref refs/heads/main)
//   - gh pr merge, wrangler deploy/publish, npm publish
// Everything else passes untouched: feature-branch commits and pushes, worktrees, builds, tests.
// Main changes only through a reviewed Pull Request that the owner merges on GitHub.
//
// `node .claude/hooks/protect-main.mjs --self-test` checks the rules.

import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const PROTECTED = new Set(['main', 'master']);
const ON_MAIN_REFUSED = /^(commit|merge|rebase|cherry-pick|revert|am|pull)$/;

/** Split a shell line into simple commands (words), honouring quotes. Good enough for a guard. */
export function segments(command) {
  const out = [];
  let words = [], cur = '', q = null, has = false;
  const flushWord = () => { if (has) words.push(cur); cur = ''; has = false; };
  const flushSeg = () => { flushWord(); if (words.length) out.push(words); words = []; };
  const s = String(command || '');
  for (let i = 0; i < s.length; i++) {
    const c = s[i];
    if (q) {
      if (c === q) q = null;
      else if (c === '\\' && q === '"' && i + 1 < s.length) { cur += s[++i]; }
      else cur += c;
      continue;
    }
    if (c === '"' || c === "'") { q = c; has = true; continue; }
    if (c === '\\' && i + 1 < s.length && s[i + 1] !== '\n') { cur += s[++i]; has = true; continue; }
    if (c === ';' || c === '\n' || c === '|' || c === '&' || c === '(' || c === ')' || c === '{' || c === '}') { flushSeg(); continue; }
    if (c === ' ' || c === '\t' || c === '\r') { flushWord(); continue; }
    cur += c; has = true;
  }
  flushSeg();
  return out;
}

function currentBranch(dir) {
  try {
    return execFileSync('git', ['-C', dir, 'symbolic-ref', '--short', '-q', 'HEAD'], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim();
  } catch { return ''; }
}

const isProtectedRef = (ref) => {
  const r = String(ref).replace(/^\+/, '');
  const dst = r.includes(':') ? r.slice(r.lastIndexOf(':') + 1) : r;
  return PROTECTED.has(dst.replace(/^refs\/heads\//, ''));
};

/** Returns a refusal reason, or null. `branchOf(dir)` is injectable for the self-test. */
export function check(command, cwd, branchOf = currentBranch) {
  let dir = cwd;
  let assumed = null; // branch switched to earlier in the same line
  for (const raw of segments(command)) {
    const w = raw.filter((x) => !/^[A-Za-z_][A-Za-z0-9_]*=/.test(x));
    if (!w.length) continue;
    const head = w[0].toLowerCase();
    if ((head === 'cd' || head === 'set-location' || head === 'pushd') && w[1]) { dir = path.resolve(dir, w[1].replace(/^~(?=\/|$)/, process.env.USERPROFILE || process.env.HOME || '~')); assumed = null; continue; }
    if (head === 'gh' && w[1] === 'pr' && w[2] === 'merge') return 'merging a Pull Request is the owner\'s decision; ask them to merge it on GitHub.';
    if (/(^|[\\/])wrangler(\.cmd)?$/.test(head) || (head === 'npx' && /^wrangler/.test(w[1] || ''))) {
      if (w.some((x) => x === 'deploy' || x === 'publish')) return 'production deploys need the owner\'s explicit approval (Cloudflare deploys main).';
    }
    if (head === 'npm' && w[1] === 'publish') return 'npm publish is not allowed.';
    if (head !== 'git' && head !== 'git.exe') continue;

    let i = 1, gdir = dir;
    while (i < w.length && w[i].startsWith('-')) {
      if (w[i] === '-C') { gdir = path.resolve(gdir, w[i + 1] || '.'); i += 2; }
      else if (w[i] === '-c' || w[i] === '--git-dir' || w[i] === '--work-tree') i += 2;
      else i += 1;
    }
    const sub = w[i] || '';
    const args = w.slice(i + 1);
    const branch = () => (gdir === dir && assumed) || branchOf(gdir);

    if ((sub === 'checkout' || sub === 'switch') && args.length) {
      const nb = args.findIndex((a) => /^-[bBcC]$/.test(a));
      const target = nb >= 0 ? args[nb + 1] : args.filter((a) => !a.startsWith('-')).at(-1);
      if (target && !args.includes('--')) assumed = target;
      continue;
    }
    if (ON_MAIN_REFUSED.test(sub) && PROTECTED.has(branch())) {
      return `"git ${sub}" on ${branch()} is refused: work on a feature branch (ocean/<id>) in a worktree and open a Pull Request.`;
    }
    if (sub === 'push') {
      if (args.some((a) => /^(--force|--force-with-lease|--force-if-includes)(=|$)/.test(a) || /^-[a-zA-Z]*f[a-zA-Z]*$/.test(a))) return 'force pushes are not allowed.';
      if (args.includes('--all') || args.includes('--mirror')) return 'pushing all branches would include main; push the feature branch by name.';
      const refs = args.filter((a) => !a.startsWith('-'));
      if (refs.some((r) => r.startsWith('+'))) return 'force pushes (+refspec) are not allowed.';
      if (refs.slice(1).some(isProtectedRef)) return 'pushing to main is refused: push the feature branch and open a Pull Request.';
      if (refs.length <= 1 && PROTECTED.has(branch())) return 'a bare push from main would update main: push the feature branch by name.';
      if (refs.slice(1).some((r) => /^HEAD$/i.test(r)) && PROTECTED.has(branch())) return 'pushing HEAD from main would update main.';
      continue;
    }
    if (sub === 'branch' && args.some((a) => /^(-f|--force|-M|-m|-D|-d)$/.test(a)) && args.some((a) => PROTECTED.has(a))) {
      return 'moving, renaming or deleting main is refused.';
    }
    if (sub === 'update-ref' && args.some((a) => /^refs\/heads\/(main|master)$/.test(a))) return 'moving main by hand is refused.';
  }
  return null;
}

function selfTest() {
  const br = (map) => (dir) => map[path.basename(dir)] ?? 'ocean/x';
  const B = br({ repo: 'main', wt: 'ocean/x' });
  const cases = [
    ['git commit -m x', 'repo', true],
    ['git commit -m x', 'wt', false],
    ['cd ../wt && git commit -am "x"', 'repo', false],
    ['git -C ../wt commit -m x', 'repo', false],
    ['git -C ../repo commit -m x', 'wt', true],
    ['git merge ocean/x', 'repo', true],
    ['git checkout main && git merge ocean/x', 'wt', true],
    ['git checkout -b ocean/y && git commit -m x', 'repo', false],
    ['git pull', 'repo', true],
    ['git fetch origin', 'repo', false],
    ['git push -u origin ocean/x', 'wt', false],
    ['git push origin main', 'wt', true],
    ['git push origin HEAD:main', 'wt', true],
    ['git push origin ocean/x:refs/heads/main', 'wt', true],
    ['git push', 'repo', true],
    ['git push', 'wt', false],
    ['git push --force origin ocean/x', 'wt', true],
    ['git push -f origin ocean/x', 'wt', true],
    ['git push origin +ocean/x', 'wt', true],
    ['git push --all', 'wt', true],
    ['git branch -f main HEAD', 'wt', true],
    ['git update-ref refs/heads/main abc', 'wt', true],
    ['gh pr merge 12', 'wt', true],
    ['gh pr create --base main', 'wt', false],
    ['npx wrangler deploy', 'wt', true],
    ['npx vite build --outDir /tmp/x', 'repo', false],
    ['git log --oneline main', 'repo', false],
    ['git diff main...HEAD', 'wt', false],
    ['echo "git push origin main"', 'wt', false]
  ];
  let failed = 0;
  for (const [cmd, where, expect] of cases) {
    const r = check(cmd, path.resolve('/x', where), B);
    if (!!r !== expect) { failed++; console.log(`FAIL [${where}] ${cmd}: ${r || 'allowed'}`); }
  }
  console.log(`${cases.length - failed}/${cases.length} protect-main cases passed`);
  process.exit(failed ? 1 : 0);
}

const isMain = process.argv[1] && path.resolve(process.argv[1]).toLowerCase() === path.resolve(fileURLToPath(import.meta.url)).toLowerCase();
if (isMain) {
  if (process.argv.includes('--self-test')) selfTest();
  let input = {};
  try { input = JSON.parse(readFileSync(0, 'utf8') || '{}'); } catch { process.exit(0); }
  const command = input?.tool_input?.command;
  if (!command) process.exit(0);
  const reason = check(command, input.cwd || process.env.CLAUDE_PROJECT_DIR || process.cwd());
  if (reason) {
    process.stderr.write(`protect-main: ${reason}\n`);
    process.exit(2);
  }
  process.exit(0);
}
