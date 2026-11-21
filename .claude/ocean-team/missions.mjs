// Ocean Team missions: shared helpers for the mission launcher (new-mission.mjs) and Ocean Preview
// (preview.mjs).
//
// A mission has a readable name (`scroll-improvements`) that is its branch (`ocean/<name>`), its
// worktree (`.claude/worktrees/ocean-<name>/`) and its run folder (`.ocean/runs/<name>/`).
// A unique internal id (`2026-11-21-a3451d`) is still recorded in `runs/<name>/worktree.json`.
// Missions created before readable names used the internal id as their name; they keep working.
//
// The "current mission" pointer lives in `.claude/ocean-team/state/current.json` (git-ignored, on
// disk, so it survives terminal closures and restarts). `npm run ocean` sets it; so does
// `npm run ocean:preview -- <name>`.

import { execFileSync } from 'node:child_process';
import { randomBytes } from 'node:crypto';
import { existsSync, mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import path from 'node:path';

export const PREVIEW_PORT = 5181;

const git = (args) => String(execFileSync('git', args, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }) ?? '').trim();

/** The main checkout, also when called from inside a worktree. */
export function repoRoot(cwd = process.cwd()) {
  const common = path.resolve(cwd, git(['-C', cwd, 'rev-parse', '--git-common-dir']));
  return path.dirname(common);
}

/** "Scroll improvements!" -> "scroll-improvements". Returns '' when nothing usable is left. */
export function slugify(text) {
  return String(text ?? '')
    .normalize('NFKD').replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 48)
    .replace(/-+$/g, '');
}

/** Unique internal id, e.g. 2026-11-21-a3451d. */
export function newInternalId(now = new Date()) {
  return `${now.toISOString().slice(0, 10)}-${randomBytes(3).toString('hex')}`;
}

export const stateDir = (root) => path.join(root, '.claude', 'ocean-team', 'state');
/**
 * A mission's run folder (plan, findings, units, ledger, reports): `.ocean/runs/<name>/`, git-ignored.
 * It is outside `.claude/` on purpose: Claude Code treats `.claude/` as a protected path, so every
 * Write/Edit there asks for approval (allow rules cannot pre-approve it), which stalls the lead.
 * Missions started before the move keep `.claude/ocean-team/runs/<name>/`; it is found here, never moved.
 */
export const runsDir = (root, name) => {
  const current = path.join(root, '.ocean', 'runs', name);
  const legacy = path.join(root, '.claude', 'ocean-team', 'runs', name);
  return !existsSync(current) && existsSync(legacy) ? legacy : current;
};

const readJson = (file) => { try { return JSON.parse(readFileSync(file, 'utf8')); } catch { return null; } };

/** Parse `git worktree list --porcelain` into [{ path, branch }]. */
export function parseWorktrees(porcelain) {
  const out = [];
  let cur = null;
  for (const line of String(porcelain).split(/\r?\n/)) {
    if (line.startsWith('worktree ')) { if (cur) out.push(cur); cur = { path: path.resolve(line.slice(9)), branch: null }; }
    else if (line.startsWith('branch ') && cur) cur.branch = line.slice(7).replace(/^refs\/heads\//, '');
  }
  if (cur) out.push(cur);
  return out;
}

/** The mission's title from its run folder (first heading of mission.json's text), or null. */
function missionTitle(root, name) {
  const m = readJson(path.join(runsDir(root, name), 'mission.json'));
  const first = String(m?.title || m?.mission || '').split(/\r?\n/).map((l) => l.replace(/^#+\s*/, '').trim()).find(Boolean);
  if (!first) return null;
  const t = first.replace(/^ocean team\s*[-—–:]\s*/i, '');
  return t === t.toUpperCase() ? t.toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase()) : t;
}

/** Most recent sign of work in a mission: its last commit or a file in its run folder. */
function lastActivity(root, wt, name) {
  let t = 0;
  try { t = Number(git(['-C', wt, 'log', '-1', '--format=%ct'])) * 1000 || 0; } catch {}
  const runs = runsDir(root, name);
  try { for (const f of readdirSync(runs)) t = Math.max(t, statSync(path.join(runs, f)).mtimeMs); } catch {}
  return t;
}

/** Every mission worktree that exists on disk: [{ name, branch, worktree, title, uid, activity }]. */
export function listMissions(root) {
  const wts = parseWorktrees(git(['-C', root, 'worktree', 'list', '--porcelain']));
  return wts
    .filter((w) => w.branch?.startsWith('ocean/') && existsSync(w.path))
    .map((w) => {
      const name = w.branch.slice('ocean/'.length);
      const meta = readJson(path.join(runsDir(root, name), 'worktree.json')) || {};
      return {
        name,
        branch: w.branch,
        worktree: w.path,
        title: meta.title || missionTitle(root, name),
        uid: meta.uid || meta.id || name,
        activity: lastActivity(root, w.path, name)
      };
    });
}

export const readCurrent = (root) => readJson(path.join(stateDir(root), 'current.json'));

export function writeCurrent(root, mission) {
  mkdirSync(stateDir(root), { recursive: true });
  writeFileSync(path.join(stateDir(root), 'current.json'),
    JSON.stringify({ name: mission.name, branch: mission.branch, worktree: mission.worktree, setAt: new Date().toISOString() }, null, 2) + '\n');
}

/**
 * Pick the mission to preview. Pure, so it can be unit-tested.
 *   selector  optional text the owner typed (name, branch, id or a fragment of the title)
 *   current   the pointer from state/current.json, or null
 * Order: explicit selector, then the only mission, then the current pointer, then most recent activity.
 * Returns { mission, why } or { error }.
 */
export function pickMission(missions, { selector = null, current = null } = {}) {
  if (!missions.length) return { error: 'No Ocean Team mission worktree exists yet. Start one with: npm run ocean -- <name>' };
  if (selector) {
    const s = String(selector).toLowerCase().replace(/^ocean\//, '').replace(/^ocean-/, '');
    const exact = missions.filter((m) => m.name.toLowerCase() === s || String(m.uid).toLowerCase() === s);
    const loose = exact.length ? exact : missions.filter((m) =>
      m.name.toLowerCase().includes(s) || String(m.uid).toLowerCase().includes(s) || (m.title || '').toLowerCase().includes(s) || slugify(m.title || '').includes(slugify(s)));
    if (loose.length === 1) return { mission: loose[0], why: 'chosen by name' };
    if (!loose.length) return { error: `No mission matches "${selector}". Missions: ${missions.map((m) => m.name).join(', ')}` };
    return { error: `"${selector}" matches several missions: ${loose.map((m) => m.name).join(', ')}. Type more of the name.` };
  }
  if (missions.length === 1) return { mission: missions[0], why: 'the only active mission' };
  const cur = current && missions.find((m) => m.name === current.name);
  if (cur) return { mission: cur, why: 'the current mission' };
  const latest = [...missions].sort((a, b) => b.activity - a.activity)[0];
  return { mission: latest, why: 'the most recently active mission' };
}
