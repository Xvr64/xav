#!/usr/bin/env node
// Ocean Team mission launcher: one isolated worktree + feature branch per mission.
//
//   npm run ocean                      new mission id (YYYY-MM-DD-xxxxxx) from main
//   npm run ocean -- 2026-11-21-a3451d reuse an id (attaches the existing ocean/<id> branch if any)
//   npm run ocean -- --base <ref>      start from another ref (default: main)
//   npm run ocean -- --list            list mission worktrees
//
// Creates .claude/worktrees/ocean-<id>/ on branch ocean/<id>, links node_modules from the main
// checkout (a directory junction on Windows), and opens .claude/ocean-team/runs/<id>/ for the plan
// and reports. The main checkout and its uncommitted files are never touched; main itself only
// changes through a Pull Request the owner merges.

import { execFileSync } from 'node:child_process';
import { randomBytes } from 'node:crypto';
import { existsSync, mkdirSync, symlinkSync, writeFileSync } from 'node:fs';
import path from 'node:path';

const git = (args, opts = {}) => String(execFileSync('git', args, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'], ...opts }) ?? '').trim();
const tryGit = (args) => { try { return git(args); } catch { return null; } };

// Always resolve the main checkout, also when run from inside a worktree.
const common = path.resolve(git(['rev-parse', '--git-common-dir']));
const root = path.dirname(common);

const argv = process.argv.slice(2);
if (argv.includes('--list')) {
  console.log(git(['-C', root, 'worktree', 'list']).split('\n').filter((l) => l.includes('ocean-')).join('\n') || 'No mission worktrees.');
  process.exit(0);
}
const baseIdx = argv.indexOf('--base');
const explicitBase = baseIdx >= 0 ? argv[baseIdx + 1] : null;
const idArg = argv.find((a, i) => !a.startsWith('-') && (baseIdx < 0 || i !== baseIdx + 1));
const id = idArg || `${new Date().toISOString().slice(0, 10)}-${randomBytes(3).toString('hex')}`;
if (!/^[A-Za-z0-9-]+$/.test(id)) { console.error(`Invalid mission id "${id}".`); process.exit(1); }

const branch = `ocean/${id}`;
const rel = `.claude/worktrees/ocean-${id}`;
const wt = path.join(root, rel);

// The base must already carry the autonomous Ocean Team workflow, or the mission would run under
// an older configuration. Fall back to the main checkout's HEAD (with a notice) until main has it.
const hasWorkflow = (ref) => tryGit(['-C', root, 'cat-file', '-e', `${ref}:.claude/hooks/protect-main.mjs`]) !== null;
let base = explicitBase || 'main';
if (!explicitBase && !hasWorkflow(base)) {
  base = git(['-C', root, 'rev-parse', '--abbrev-ref', 'HEAD']);
  console.log(`note: main does not have the Ocean Team workflow yet (its PR is not merged); basing on ${base}.`);
}

if (existsSync(wt)) {
  console.log(`Worktree already exists: ${wt}`);
} else if (tryGit(['-C', root, 'rev-parse', '--verify', '--quiet', `refs/heads/${branch}`])) {
  git(['-C', root, 'worktree', 'add', rel, branch], { stdio: 'inherit' });
} else {
  git(['-C', root, 'worktree', 'add', rel, '-b', branch, base], { stdio: 'inherit' });
}

const nm = path.join(wt, 'node_modules');
if (!existsSync(nm) && existsSync(path.join(root, 'node_modules'))) {
  symlinkSync(path.join(root, 'node_modules'), nm, process.platform === 'win32' ? 'junction' : 'dir');
}

const runs = path.join(root, '.claude', 'ocean-team', 'runs', id);
mkdirSync(runs, { recursive: true });
const meta = path.join(runs, 'worktree.json');
if (!existsSync(meta)) {
  writeFileSync(meta, JSON.stringify({ id, branch, worktree: rel, base, createdAt: new Date().toISOString() }, null, 2) + '\n');
}

console.log(`
Ocean mission ${id}
  branch    ${branch}  (from ${base})
  worktree  ${wt}
  run notes ${runs}

Next:
  in Claude Code (main checkout):  /ocean-team <mission>   (the lead works in the worktree above)
  dev server from the worktree:    cd "${wt}" && npx vite --port 5181 --strictPort
  publish for review:              git -C "${wt}" push -u origin ${branch}   then open a PR to main
`);
