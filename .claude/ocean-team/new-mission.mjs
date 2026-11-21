#!/usr/bin/env node
// Ocean Team mission launcher: one isolated worktree + readable feature branch per mission.
//
//   npm run ocean -- scroll-improvements     new mission ocean/scroll-improvements (from main)
//   npm run ocean -- "Portfolio v2"          names are turned into slugs: ocean/portfolio-v2
//   npm run ocean -- <existing name>         resume: reattaches the existing ocean/<name> branch
//   npm run ocean -- <name> --base <ref>     start from another ref (default: main)
//   npm run ocean -- --list                  list mission worktrees
//
// Creates .claude/worktrees/ocean-<name>/ on branch ocean/<name>, links node_modules from the main
// checkout (a directory junction on Windows), opens .claude/ocean-team/runs/<name>/ for the plan and
// reports (worktree.json there keeps a unique internal id), and makes it the current mission that
// `npm run ocean:preview` shows. The main checkout and its uncommitted files are never touched;
// main itself only changes through a Pull Request the owner merges.

import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, symlinkSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { listMissions, newInternalId, repoRoot, runsDir, slugify, writeCurrent } from './missions.mjs';

const git = (args, opts = {}) => String(execFileSync('git', args, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'], ...opts }) ?? '').trim();
const tryGit = (args) => { try { return git(args); } catch { return null; } };

const root = repoRoot();
const argv = process.argv.slice(2);

if (argv.includes('--list')) {
  const ms = listMissions(root);
  if (!ms.length) console.log('No mission worktrees.');
  for (const m of ms) console.log(`${m.name.padEnd(32)} ${m.branch.padEnd(40)} ${m.title || ''}`);
  process.exit(0);
}

const baseIdx = argv.indexOf('--base');
const explicitBase = baseIdx >= 0 ? argv[baseIdx + 1] : null;
const raw = argv.filter((a, i) => !a.startsWith('-') && (baseIdx < 0 || i !== baseIdx + 1)).join(' ');
const name = slugify(raw);
if (!name) {
  console.error(`Give the mission a short readable name, for example:

  npm run ocean -- scroll-improvements
  npm run ocean -- "Portfolio v2"

It becomes the branch ocean/<name> and the worktree .claude/worktrees/ocean-<name>/.
To resume a mission, use its existing name (npm run ocean -- --list shows them).`);
  process.exit(1);
}

const branch = `ocean/${name}`;
if (tryGit(['check-ref-format', '--branch', branch]) === null) { console.error(`"${branch}" is not a valid branch name.`); process.exit(1); }
const rel = `.claude/worktrees/ocean-${name}`;
const wt = path.join(root, rel);

// The base must already carry the autonomous Ocean Team workflow, or the mission would run under
// an older configuration. Fall back to the main checkout's HEAD (with a notice) until main has it.
const hasWorkflow = (ref) => tryGit(['-C', root, 'cat-file', '-e', `${ref}:.claude/hooks/protect-main.mjs`]) !== null;
let base = explicitBase || 'main';
if (!explicitBase && !hasWorkflow(base)) {
  base = git(['-C', root, 'rev-parse', '--abbrev-ref', 'HEAD']);
  console.log(`note: main does not have the Ocean Team workflow yet (its PR is not merged); basing on ${base}.`);
}

let resumed = true;
if (existsSync(wt)) {
  console.log(`Mission worktree already exists: ${wt}`);
} else if (tryGit(['-C', root, 'rev-parse', '--verify', '--quiet', `refs/heads/${branch}`])) {
  git(['-C', root, 'worktree', 'add', rel, branch], { stdio: 'inherit' });
} else {
  resumed = false;
  git(['-C', root, 'worktree', 'add', rel, '-b', branch, base], { stdio: 'inherit' });
}

const nm = path.join(wt, 'node_modules');
if (!existsSync(nm) && existsSync(path.join(root, 'node_modules'))) {
  symlinkSync(path.join(root, 'node_modules'), nm, process.platform === 'win32' ? 'junction' : 'dir');
}

const runs = runsDir(root, name);
mkdirSync(runs, { recursive: true });
const meta = path.join(runs, 'worktree.json');
let uid;
if (existsSync(meta)) {
  try { const m = JSON.parse(readFileSync(meta, 'utf8')); uid = m.uid || m.id; } catch {}
} else {
  uid = newInternalId();
  writeFileSync(meta, JSON.stringify({ name, uid, branch, worktree: rel, base, createdAt: new Date().toISOString() }, null, 2) + '\n');
}

writeCurrent(root, { name, branch, worktree: wt });

console.log(`
Ocean mission "${name}"${resumed ? ' (resumed)' : ''}
  branch       ${branch}${resumed ? '' : `  (from ${base})`}
  worktree     ${wt}
  run notes    ${runs}
  internal id  ${uid || name}

Next:
  in Claude Code (main checkout):  /ocean-team <mission>   or   /ocean-team continue ${name}
  see it in the browser:           npm run ocean:preview   (Ocean Preview, http://localhost:5181)
  publish for review:              git -C "${wt}" push -u origin ${branch}   then open a PR to main
`);
