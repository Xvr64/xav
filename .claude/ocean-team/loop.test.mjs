// Tests for the Ocean Team loop runner. Run with: node --test ".claude/ocean-team/*.test.mjs"
// (plain `node --test` skips the .claude folder). The integration tests build a throwaway git repo
// with a real mission worktree; only the expensive commands (tsc, tests, build, harness) are faked,
// so scope, main protection, fingerprints, retries and routing run for real.

import test from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync, spawnSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, readFileSync, writeFileSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  MAX_ATTEMPTS, checksFor, context, final, init, laneOf, lessonCandidates, lessonsFor, lintLessons, main as cli,
  nextUnits, overlapWarnings, reset, review, start, status, validatePlan, verify, brief
} from './loop.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));

// The previous mission's plan (2026-11-21-a3451d) as units, with the dependencies its plan stated.
const A3451D = {
  units: [
    { id: 'S0', owner: 'builder', files: ['dev/record-magnetic-cv.mjs', 'dev/phase2-verify.mjs'], accept: [{ check: 'cmd', run: ['node', 'dev/record-magnetic-cv.mjs', '--pacing'], criterion: 'pacing runs through the Profile' }] },
    { id: 'A', owner: 'builder', after: ['S0'], files: ['magneticCV.ts', 'magneticCV.test.mjs'], accept: [{ check: 'tests', files: ['magneticCV.test.mjs'], criterion: 'hidden mid-glide lands at the destination' }] },
    { id: 'A2', owner: 'builder', after: ['A'], files: ['magneticCV.ts', 'abyssalCipher.ts'], accept: [{ check: 'harness', args: ['verify', 'cv'], criterion: 'every word on the last screen is set' }] },
    { id: 'C', owner: 'builder', after: ['A2'], files: ['magneticCV.ts', 'abyssalCipher.ts'], accept: [{ check: 'cmd', run: ['node', 'dev/record-magnetic-cv.mjs', '--pacing'], criterion: 'no forced recalc on frame 0' }] },
    { id: 'D1', owner: 'builder', after: ['C'], files: ['magneticCV.ts', 'magneticCVState.ts', 'profileMemories.ts', 'ProfileItinerary.tsx', 'profileItinerary.test.mjs'], accept: [{ check: 'tests', files: ['profileItinerary.test.mjs'], criterion: 'one city per step' }] },
    { id: 'D2', owner: 'builder-2', after: ['S0'], files: ['TerminalEditorial.tsx', 'terminal.css', 'magneticCV.css', 'whaleVeil.ts'], accept: [{ check: 'review', by: 'director', criterion: 'reads like Languages' }] }
  ]
};
const clone = (x) => JSON.parse(JSON.stringify(x));

test('the graph: real dependencies give parallel waves, and D2 can run beside A', () => {
  const v = validatePlan(A3451D);
  assert.deepEqual(v.errors, []);
  assert.deepEqual(v.waves, [['S0'], ['A', 'D2'], ['A2'], ['C'], ['D1']]);
  assert.equal(v.lanes.S0, 1, 'harness-only work is contained');
  assert.equal(v.lanes.A, 2, 'Magnetic CV is a shared system');
});

test('the graph: two units that can run at once may not edit the same file', () => {
  const p = clone(A3451D);
  p.units.find((u) => u.id === 'A2').after = ['S0'];
  const v = validatePlan(p);
  assert.ok(v.errors.some((e) => /A and A2 can run at the same time but both edit magneticCV\.ts/.test(e)), v.errors.join('\n'));
});

test('the graph: cycles, missing criteria, lane 3 and non-node commands are rejected', () => {
  const p = clone(A3451D);
  p.units.find((u) => u.id === 'S0').after = ['D1'];
  assert.ok(validatePlan(p).errors.some((e) => e.startsWith('dependency cycle')));
  const q = { units: [
    { id: 'X', owner: 'b', files: ['x.ts'], accept: [] },
    { id: 'Y', owner: 'b', files: ['y.ts'], lane: 3, accept: [{ check: 'cmd', run: ['git', 'push', 'origin', 'main'], criterion: 'c' }] },
    { id: 'Z', owner: 'b', files: ['z.ts'], accept: [{ check: 'cmd', run: ['node', 'x.mjs', '&&', 'git', 'push', 'origin', 'main'], criterion: 'c' }] }
  ] };
  const e = validatePlan(q).errors.join('\n');
  assert.match(e, /X: no acceptance criteria/);
  assert.match(e, /Y: lane 3/);
  assert.match(e, /Y criterion .*starts with "node"/);
  assert.match(e, /Z criterion .*refused by protect-main/);
});

test('lanes and automatic checks follow blast radius, not declared confidence', () => {
  assert.equal(laneOf({ files: ['dev/phase2-verify.mjs'] }), 1);
  assert.equal(laneOf({ files: ['terminal.css'], lane: 1 }), 2);
  const lane1 = checksFor({ id: 'u', files: ['cvData.ts'], accept: [{ id: 'u-1', check: 'tests', files: ['sections.test.mjs'], criterion: 'c' }] }).map((c) => c.id);
  assert.deepEqual(lane1, ['auto:main', 'auto:scope', 'auto:tsc', 'u-1']);
  const lane2 = checksFor({ id: 'u', files: ['magneticCV.ts'], accept: [] }).map((c) => c.id);
  assert.ok(lane2.includes('auto:tests-all') && lane2.includes('auto:build') && lane2.includes('auto:review'));
  const tooling = checksFor({ id: 'u', files: ['.claude/ocean-team/loop.mjs'], accept: [] }).map((c) => c.id);
  assert.ok(tooling.includes('auto:team-tests') && tooling.includes('auto:protect-main'));
});

test('cross-mission overlap is reported before anyone edits', () => {
  const w = overlapWarnings(['magneticCV.ts', 'cvData.ts'], [{ name: 'other', files: ['magneticCV.ts'] }, { name: 'quiet', files: ['x.ts'] }]);
  assert.equal(w.length, 1);
  assert.match(w[0], /mission other has also changed magneticCV\.ts/);
});

// ---------------------------------------------------------------------------------------------
// Integration fixture: a repo on main, a mission worktree on ocean/t, a fake runner for slow checks.

function fixture(units) {
  const dir = mkdtempSync(path.join(os.tmpdir(), 'ocean-loop-'));
  const g = (cwd, ...a) => execFileSync('git', ['-C', cwd, '-c', 'user.name=t', '-c', 'user.email=t@t', '-c', 'core.autocrlf=false', ...a], { encoding: 'utf8' }).trim();
  const put = (root, f, s) => { mkdirSync(path.dirname(path.join(root, f)), { recursive: true }); writeFileSync(path.join(root, f), s); };
  g(dir, 'init', '-q', '-b', 'main');
  for (const f of ['a.ts', 'b.ts', 'c.ts', 'magneticCV.ts', 'a.test.mjs', 'b.test.mjs']) put(dir, f, `// ${f}\n`);
  put(dir, '.gitignore', '.claude/worktrees/\n.claude/ocean-team/runs/\n');
  g(dir, 'add', '-A'); g(dir, 'commit', '-q', '-m', 'init');
  g(dir, 'worktree', 'add', '-q', '.claude/worktrees/ocean-t', '-b', 'ocean/t');
  const wt = path.join(dir, '.claude/worktrees/ocean-t');
  const runs = path.join(dir, '.claude/ocean-team/runs/t');
  mkdirSync(runs, { recursive: true });
  writeFileSync(path.join(runs, 'worktree.json'), JSON.stringify({ worktree: '.claude/worktrees/ocean-t' }));
  const writeUnits = (u) => writeFileSync(path.join(runs, 'units.json'), JSON.stringify({ units: u }, null, 2));
  writeUnits(units);
  // Outcomes of the slow commands; tests flip them to simulate failures.
  const world = { tsc: { code: 0, out: '' }, all: { code: 0, out: 'ℹ tests 3\nℹ pass 3\nℹ fail 0' }, tests: {}, harness: { code: 0, out: 'VERIFY PASS' } };
  const calls = [];
  const exec = (argv) => {
    const s = argv.join(' ');
    calls.push(s);
    if (s.includes('typescript/bin/tsc')) return world.tsc;
    if (s === 'node --test') return world.all;
    if (argv[1] === '--test') return world.tests[argv[2]] || { code: 0, out: `ok ${argv[2]}` };
    if (s.includes('dev/phase2.mjs')) return world.harness;
    if (s.includes('vite.js build')) return { code: 0, out: 'built' };
    return { code: 0, out: 'ok' };
  };
  const ctx = context({ mission: 't', root: dir, exec, validation: mkdtempSync(path.join(os.tmpdir(), 'ocean-val-')) });
  const edit = (f, s) => put(wt, f, s);
  return { dir, wt, runs, ctx, world, calls, edit, writeUnits, g, put };
}

const U1 = { id: 'U1', title: 'contained change', owner: 'builder', files: ['a.ts', 'a.test.mjs'], accept: [{ id: 'U1-1', check: 'tests', files: ['a.test.mjs'], criterion: 'a works' }] };
const U2 = { id: 'U2', title: 'shared scroll change', owner: 'builder-2', files: ['magneticCV.ts'], accept: [{ id: 'U2-1', check: 'harness', args: ['verify', 'cv'], expect: 'VERIFY PASS', criterion: 'every word is set' }] };
const U3 = { id: 'U3', title: 'stubborn unit', owner: 'builder', files: ['b.ts', 'b.test.mjs'], accept: [{ id: 'U3-1', check: 'tests', files: ['b.test.mjs'], criterion: 'b works' }] };
const U4 = { id: 'U4', title: 'depends on U3', owner: 'builder', after: ['U3'], files: ['c.ts'], accept: [{ id: 'U4-1', check: 'tests', files: ['a.test.mjs'], criterion: 'c works' }] };

test('success: a contained unit passes on focused checks only, and the result is recorded', () => {
  const f = fixture([U1]);
  assert.equal(init(f.ctx).code, 0);
  assert.equal(start(f.ctx, 'U1').code, 0);
  f.edit('a.ts', 'export const a = 1;\n');
  const r = verify(f.ctx, 'U1');
  assert.equal(r.code, 0, r.text);
  assert.match(r.text, /U1 PASSED/);
  assert.ok(f.calls.some((c) => c.includes('tsc')) && f.calls.includes('node --test a.test.mjs'));
  assert.ok(!f.calls.includes('node --test') && !f.calls.some((c) => c.includes('vite')), 'lane 1 does not run the full suite or a build');
  const l = JSON.parse(readFileSync(f.ctx.ledgerFile, 'utf8'));
  assert.equal(l.units.U1.state, 'passed');
  assert.ok(l.units.U1.commit && l.units.U1.fingerprint);
  assert.equal(verify(f.ctx, 'U1').code, 0, 'unchanged passed code is not re-run');
});

test('failed validation: a packet with criterion, evidence, location, scope and budget; cheap failure skips slow checks', () => {
  const f = fixture([U1, U2]);
  init(f.ctx);
  f.edit('magneticCV.ts', 'export const x: number = "y";\n');
  f.world.tsc = { code: 2, out: "magneticCV.ts(12,5): error TS2322: Type 'string' is not assignable to type 'number'." };
  const r = verify(f.ctx, 'U2');
  assert.equal(r.code, 1);
  for (const want of [/unit U2 "shared scroll change"/, /attempt 1 of 3 failed; 2 correction\(s\) left/, /Owner: builder-2/, /\[auto:tsc\] TypeScript compiles/, /error TS2322/, /at: magneticCV\.ts:12/, /Scope: fix only the failed criteria, editing only magneticCV\.ts/]) assert.match(r.text, want);
  assert.ok(!f.calls.some((c) => c.includes('phase2.mjs') || c.includes('vite') || c === 'node --test'), 'harness, build and full suite never ran after a type error');
  // Re-verifying without a correction is refused and costs nothing.
  const again = verify(f.ctx, 'U2');
  assert.equal(again.code, 3);
  assert.equal(JSON.parse(readFileSync(f.ctx.ledgerFile, 'utf8')).units.U2.attempts, 1);
});

test('targeted retry: only the failing unit goes back; a passed unit stays passed and untouched', () => {
  const f = fixture([U1, U2]);
  init(f.ctx);
  f.edit('a.ts', 'export const a = 1;\n');
  assert.equal(verify(f.ctx, 'U1').code, 0);
  const passedBefore = JSON.parse(readFileSync(f.ctx.ledgerFile, 'utf8')).units.U1;
  f.edit('magneticCV.ts', 'export const x = 1;\n');
  f.world.harness = { code: 1, out: 'AssertionError: every word on the last screen is set\n18 !== 0\n at dev/phase2-verify.mjs:193' };
  const fail = verify(f.ctx, 'U2');
  assert.equal(fail.code, 1);
  assert.match(fail.text, /\[U2-1\] every word is set/);
  assert.match(fail.text, /18 !== 0/);
  assert.match(fail.text, /Do not touch passed units' files: a\.ts, a\.test\.mjs/);
  // Correction, then machine checks pass and the guardian review is still owed (lane 2).
  f.world.harness = { code: 0, out: 'VERIFY PASS' };
  f.edit('magneticCV.ts', 'export const x = 2;\n');
  const pending = verify(f.ctx, 'U2');
  assert.equal(pending.code, 5, pending.text);
  assert.match(pending.text, /Review pending from guardian/);
  const done = review(f.ctx, 'U2', { by: 'guardian', pass: true, evidence: 'diff read; verify cv and tab-hide checked at 1440 and 390' });
  assert.equal(done.code, 0, done.text);
  const l = JSON.parse(readFileSync(f.ctx.ledgerFile, 'utf8'));
  assert.equal(l.units.U2.state, 'passed');
  assert.deepEqual(l.units.U1, passedBefore, 'U1 was not re-run or changed');
});

test('a review recorded on older code does not count after the code changes', () => {
  const f = fixture([U2]);
  init(f.ctx);
  f.edit('magneticCV.ts', 'export const x = 1;\n');
  assert.equal(verify(f.ctx, 'U2').code, 5);
  assert.equal(review(f.ctx, 'U2', { by: 'guardian', pass: true, evidence: 'ok' }).code, 0);
  f.edit('magneticCV.ts', 'export const x = 3;\n');
  assert.equal(verify(f.ctx, 'U2').code, 5, 'changed code needs a fresh review');
});

test('a failed review is a failed attempt, with the reviewer\'s evidence in the packet', () => {
  const f = fixture([U2]);
  init(f.ctx);
  f.edit('magneticCV.ts', 'export const x = 1;\n');
  verify(f.ctx, 'U2');
  const r = review(f.ctx, 'U2', { by: 'guardian', pass: false, evidence: 'Profile step skips a city after a 3.8 s momentum tail', files: ['magneticCV.ts:406'] });
  assert.equal(r.code, 1);
  assert.match(r.text, /by guardian/);
  assert.match(r.text, /momentum tail/);
  assert.match(r.text, /magneticCV\.ts:406/);
});

test('retry exhaustion: three failed corrections escalate to the lead, and only a changed plan resets', () => {
  const f = fixture([U3]);
  init(f.ctx);
  f.world.tests['b.test.mjs'] = { code: 1, out: '✖ b works\n  AssertionError: 1 !== 2\n  at b.test.mjs:4' };
  const codes = [];
  let last;
  for (let i = 1; i <= MAX_ATTEMPTS; i++) { f.edit('b.ts', `export const b = ${i};\n`); last = verify(f.ctx, 'U3'); codes.push(last.code); }
  assert.deepEqual(codes, [1, 1, 4]);
  assert.match(last.text, /ESCALATE TO LEAD/);
  assert.match(last.text, /attempt 1: \[U3-1\]/);
  f.edit('b.ts', 'export const b = 99;\n');
  assert.equal(verify(f.ctx, 'U3').code, 4, 'no fourth attempt');
  assert.equal(reset(f.ctx, 'U3', { reason: 'try again' }).code, 2, 'same plan, no reset');
  f.writeUnits([{ ...U3, accept: [{ id: 'U3-1', check: 'tests', files: ['b.test.mjs'], criterion: 'b works (split: parsing only)' }] }]);
  assert.equal(reset(f.ctx, 'U3', { reason: 'split the unit: parsing first' }).code, 0);
  f.world.tests['b.test.mjs'] = { code: 0, out: 'ok' };
  f.edit('b.ts', 'export const b = 2;\n');
  assert.equal(verify(f.ctx, 'U3').code, 0);
  const cands = lessonCandidates(f.ctx);
  assert.equal(cands[0].unit, 'U3', 'a failure that was resolved becomes a lesson candidate');
});

test('repeated identical failures are flagged as no progress', () => {
  const f = fixture([U3]);
  init(f.ctx);
  f.world.tests['b.test.mjs'] = { code: 1, out: '✖ b works\n  AssertionError: 1 !== 2' };
  f.edit('b.ts', 'export const b = 1;\n'); verify(f.ctx, 'U3');
  f.edit('b.ts', 'export const b = 1; // tweak\n');
  assert.match(verify(f.ctx, 'U3').text, /same failure as the previous attempt/);
});

test('dependencies: a unit waits for the units it really depends on', () => {
  const f = fixture([U1, U3, U4]);
  init(f.ctx);
  assert.deepEqual(nextUnits(f.ctx), ['U1', 'U3']);
  assert.equal(start(f.ctx, 'U4').code, 2);
  assert.equal(verify(f.ctx, 'U4').code, 2);
  f.edit('b.ts', 'export const b = 2;\n');
  assert.equal(verify(f.ctx, 'U3').code, 0);
  assert.ok(nextUnits(f.ctx).includes('U4'));
  assert.equal(start(f.ctx, 'U4').code, 0);
});

test('agent conflicts: a file outside every unit fails scope, before any slow check, and goes to the lead', () => {
  const f = fixture([U1]);
  init(f.ctx);
  f.edit('a.ts', 'export const a = 1;\n');
  f.edit('stray.ts', 'oops\n');
  const r = verify(f.ctx, 'U1');
  assert.equal(r.code, 1);
  assert.match(r.text, /files changed that no unit owns/);
  assert.match(r.text, /stray\.ts/);
  assert.match(r.text, /the lead decides/);
  assert.ok(!f.calls.some((c) => c.includes('tsc')), 'tsc never ran');
});

test('git safety: main moving, or mission files edited in the owner\'s checkout, fails the main check', () => {
  const f = fixture([U1]);
  init(f.ctx);
  f.edit('a.ts', 'export const a = 1;\n');
  f.put(f.dir, 'a.ts', 'edited in the main checkout\n');
  const r = verify(f.ctx, 'U1');
  assert.equal(r.code, 1);
  assert.match(r.text, /edited in the owner's main checkout instead of the worktree: a\.ts/);
  f.g(f.dir, 'checkout', '-q', '--', 'a.ts');
  f.put(f.dir, 'new.txt', 'x');
  f.g(f.dir, 'add', 'new.txt'); f.g(f.dir, 'commit', '-q', '-m', 'someone committed to main');
  f.edit('a.ts', 'export const a = 2;\n');
  assert.match(verify(f.ctx, 'U1').text, /refs\/heads\/main moved/);
});

test('git safety: the protect-main hook still refuses pushes to main, force pushes, merges and deploys', () => {
  const r = spawnSync(process.execPath, [path.join(HERE, '..', 'hooks', 'protect-main.mjs'), '--self-test'], { encoding: 'utf8' });
  assert.equal(r.status, 0, r.stdout + r.stderr);
  assert.match(r.stdout, /protect-main cases passed/);
});

test('final verification routes a combined failure to the unit whose own tests now fail', () => {
  const f = fixture([U1, U3]);
  init(f.ctx);
  f.edit('a.ts', 'export const a = 1;\n'); f.edit('b.ts', 'export const b = 1;\n');
  assert.equal(verify(f.ctx, 'U1').code, 0);
  assert.equal(verify(f.ctx, 'U3').code, 0);
  f.world.all = { code: 1, out: '✖ b works\nℹ tests 3\nℹ pass 2\nℹ fail 1' };
  f.world.tests['b.test.mjs'] = { code: 1, out: '✖ b works\n  AssertionError' };
  const r = final(f.ctx);
  assert.equal(r.code, 1);
  assert.match(r.text, /Returned to their owners: U3\. Every other unit stays passed/);
  const l = JSON.parse(readFileSync(f.ctx.ledgerFile, 'utf8'));
  assert.equal(l.units.U1.state, 'passed');
  assert.equal(l.units.U3.state, 'failed');
  f.world.all = { code: 0, out: 'ℹ tests 3\nℹ pass 3\nℹ fail 0' };
  f.world.tests['b.test.mjs'] = { code: 0, out: 'ok' };
  f.edit('b.ts', 'export const b = 2;\n');
  assert.equal(verify(f.ctx, 'U3').code, 0);
  assert.equal(final(f.ctx).code, 0);
  assert.match(status(f.ctx).text, /Final verification: PASS/);
});

test('status shows owner, lane, state, attempts, blockers and last failed checks', () => {
  const f = fixture([U1, U3, U4]);
  init(f.ctx);
  f.world.tests['b.test.mjs'] = { code: 1, out: '✖ b works' };
  f.edit('b.ts', 'x\n'); verify(f.ctx, 'U3');
  const s = status(f.ctx).text;
  assert.match(s, /\| U3 \| builder \| 1 \| failed \| 1\/3 \| - \| U3-1 \|/);
  assert.match(s, /\| U4 \| builder \| 1 \| pending \| 0\/3 \| U3 \|/);
  assert.match(s, /not recorded here: the tools do not expose them reliably/);
});

test('lessons: the real file passes its checks; malformed and oversized lessons fail', () => {
  const md = readFileSync(path.join(HERE, 'lessons.md'), 'utf8');
  assert.deepEqual(lintLessons(md).errors, []);
  const bad = '## Missing id\n- Rule: x\n\n## L-001 ok\n- Rule: r\n- Evidence: e\n- Verified: yesterday\n- Applies to: all\n\n## L-001 dup\n- Rule: ' + 'x'.repeat(800) + '\n- Evidence: e\n- Verified: 2026-11-21 t\n- Applies to: all\n';
  const e = lintLessons(bad).errors.join('\n');
  assert.match(e, /heading must be/);
  assert.match(e, /L-001 is used twice/);
  assert.match(e, /needs the date/);
  assert.match(e, /keep a lesson under/);
});

test('lessons reach owners by file; coordination lessons stay with the lead', () => {
  const md = readFileSync(path.join(HERE, 'lessons.md'), 'utf8');
  const forCV = lessonsFor(md, ['magneticCV.ts']).map((l) => l.id);
  assert.ok(forCV.includes('L-003') && forCV.includes('L-004'));
  assert.ok(!forCV.includes('L-002'), 'team-only lesson not in a builder brief');
  assert.ok(lessonsFor(md, ['magneticCV.ts'], { lead: true }).some((l) => l.id === 'L-002'));
});

test('brief: the owner gets scope, criteria and the relevant lessons, generated from units.json', () => {
  const f = fixture([U2]);
  init(f.ctx);
  const t = brief(f.ctx, 'U2').text;
  assert.match(t, /Files you own \(edit only these\): magneticCV\.ts/);
  assert.match(t, /\[U2-1\] every word is set/);
  assert.match(t, /\[auto:review\] independent guardian review/);
  assert.match(t, /L-003/);
});

test('CLI: lessons --check passes and unknown missions fail cleanly', () => {
  assert.equal(cli(['lessons', '--check']).code, 0);
  assert.throws(() => cli(['verify']), /usage/);
});
