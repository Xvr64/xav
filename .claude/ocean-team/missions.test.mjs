import assert from 'node:assert/strict';
import path from 'node:path';
import test from 'node:test';
import { mkdirSync, mkdtempSync } from 'node:fs';
import os from 'node:os';
import { newInternalId, parseWorktrees, pickMission, runsDir, slugify } from './missions.mjs';

test('run notes live outside .claude/ (a protected path); older missions keep their folder', () => {
  const root = mkdtempSync(path.join(os.tmpdir(), 'ocean-runs-'));
  assert.equal(runsDir(root, 'new-one'), path.join(root, '.ocean', 'runs', 'new-one'));
  assert.ok(!runsDir(root, 'new-one').includes(`${path.sep}.claude${path.sep}`));
  mkdirSync(path.join(root, '.claude', 'ocean-team', 'runs', 'old-one'), { recursive: true });
  assert.equal(runsDir(root, 'old-one'), path.join(root, '.claude', 'ocean-team', 'runs', 'old-one'), 'legacy folder is found, not moved');
  mkdirSync(path.join(root, '.ocean', 'runs', 'old-one'), { recursive: true });
  assert.equal(runsDir(root, 'old-one'), path.join(root, '.ocean', 'runs', 'old-one'), 'once moved by the owner, the new folder wins');
});

test('slugify turns free text into readable branch names', () => {
  assert.equal(slugify('Portfolio v2'), 'portfolio-v2');
  assert.equal(slugify('  Scroll improvements!! '), 'scroll-improvements');
  assert.equal(slugify('Récif — été'), 'recif-ete');
  assert.equal(slugify('2026-11-21-a3451d'), '2026-11-21-a3451d');
  assert.equal(slugify('---'), '');
  assert.ok(slugify('x'.repeat(80)).length <= 48);
});

test('internal ids stay unique and date-stamped', () => {
  const a = newInternalId(new Date('2026-11-21T10:00:00Z'));
  assert.match(a, /^2026-11-21-[0-9a-f]{6}$/);
  assert.notEqual(newInternalId(), newInternalId());
});

test('parseWorktrees reads branches from porcelain output', () => {
  const out = 'worktree C:/repo\nHEAD abc\nbranch refs/heads/chore/x\n\nworktree C:/repo/.claude/worktrees/ocean-a\nHEAD def\nbranch refs/heads/ocean/a\n\nworktree C:/tmp/base\nHEAD 123\ndetached\n';
  const w = parseWorktrees(out);
  assert.equal(w.length, 3);
  assert.equal(w[1].branch, 'ocean/a');
  assert.equal(w[1].path, path.resolve('C:/repo/.claude/worktrees/ocean-a'));
  assert.equal(w[2].branch, null);
});

const M = (name, activity, title = null) => ({ name, branch: `ocean/${name}`, worktree: `/wt/ocean-${name}`, uid: name, title, activity });
const legacy = M('2026-11-21-a3451d', 100, 'Premium Portfolio Transformation');
const scroll = M('scroll-improvements', 300);
const v2 = M('portfolio-v2', 200);

test('no missions gives a helpful error', () => {
  assert.match(pickMission([]).error, /npm run ocean -- <name>/);
});

test('a single mission is picked without any input', () => {
  assert.equal(pickMission([legacy]).mission, legacy);
  assert.equal(pickMission([legacy], { current: { name: 'gone' } }).mission, legacy);
});

test('the current pointer wins over recency, recency is the fallback', () => {
  assert.equal(pickMission([legacy, scroll, v2], { current: { name: 'portfolio-v2' } }).mission, v2);
  assert.equal(pickMission([legacy, scroll, v2], { current: { name: 'removed' } }).mission, scroll);
  assert.equal(pickMission([legacy, scroll, v2]).mission, scroll);
});

test('selectors match name, branch, folder, id fragment or title', () => {
  const all = [legacy, scroll, v2];
  assert.equal(pickMission(all, { selector: 'portfolio-v2' }).mission, v2);
  assert.equal(pickMission(all, { selector: 'ocean/scroll-improvements' }).mission, scroll);
  assert.equal(pickMission(all, { selector: 'ocean-scroll-improvements' }).mission, scroll);
  assert.equal(pickMission(all, { selector: 'scroll' }).mission, scroll);
  assert.equal(pickMission(all, { selector: 'a3451d' }).mission, legacy);
  assert.equal(pickMission(all, { selector: 'Premium portfolio' }).mission, legacy);
  assert.match(pickMission(all, { selector: 'portfolio' }).error, /several missions/);
  assert.match(pickMission(all, { selector: 'nothing' }).error, /No mission matches/);
});
