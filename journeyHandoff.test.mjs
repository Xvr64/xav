import test from 'node:test';
import assert from 'node:assert/strict';
import { HANDOFF, HANDOFF_PACE, beginHandoff, endHandoff, handoff, handoffReveal, handoffRunning, revealShapeFor, tickHandoff } from './journeyHandoff.ts';
import { assignTargets, revealGeometry } from './arrivalDissolve.ts';

test('outside a handoff the opening is whole: reveal is exactly 1', () => {
  endHandoff();
  assert.equal(handoffRunning(), false);
  assert.equal(handoffReveal(123), 1);
  assert.equal(tickHandoff(123, true), false);
});

test('the destination never emerges before it can be drawn, then emerges smoothly', () => {
  beginHandoff('passage', 1000);
  assert.equal(handoffReveal(1000), 0, 'the opening holds the dark the arrival is lifting from');
  tickHandoff(1000 + HANDOFF.revealAfter - 1, true);
  assert.equal(handoff.revealAt, 0, 'not before the letters have begun to go');
  const ready = 1000 + HANDOFF.revealAfter + 800;
  tickHandoff(ready - 100, false);
  assert.equal(handoff.revealAt, 0, 'a destination still compiling is waited for, never revealed over nothing');
  tickHandoff(ready, true);
  assert.equal(handoff.revealAt, ready);
  let last = -1;
  for (let t = ready; t <= ready + HANDOFF.reveal; t += 16) {
    const r = handoffReveal(t);
    assert.ok(r >= last && r >= 0 && r <= 1);
    last = r;
  }
  assert.equal(handoffReveal(ready + HANDOFF.reveal), 1);
  endHandoff();
  assert.equal(handoffReveal(5000), 1);
});

test('the handoff is the original choreography at 5x: about 5.2 to 6.6 s when the destination is ready', () => {
  assert.equal(HANDOFF_PACE, 5);
  // Every moment scales together: the order of events is exactly the original's
  assert.equal(HANDOFF.revealAfter, 1200);
  assert.equal(HANDOFF.reveal, 4100);
  assert.equal(HANDOFF.scramble, 750);
  beginHandoff('direct', 1);
  tickHandoff(1 + HANDOFF.revealAfter, true);
  const done = handoff.revealAt + HANDOFF.reveal - 1;
  assert.ok(done >= 5200 && done <= 6600, `${done} ms`);
  const lastLetter = HANDOFF.chosenTo + HANDOFF.scramble + HANDOFF.flowMax;
  assert.ok(lastLetter <= done + 200, `last letter lands at ${lastLetter} ms`);
  endHandoff();
});

test('with no opening left to enter, it goes ahead rather than waiting', () => {
  beginHandoff('odyssey', 1);
  tickHandoff(1 + HANDOFF.revealAfter, false, false);
  assert.ok(handoff.revealAt > 0);
  endHandoff();
  beginHandoff('odyssey', 1);
  tickHandoff(1 + HANDOFF.revealLatest, false, true);
  assert.ok(handoff.revealAt > 0, 'safety cap');
  endHandoff();
});

test('each journey resolves from its own first frame\'s shape', () => {
  assert.equal(revealShapeFor('direct'), 'planet');
  assert.equal(revealShapeFor('passage'), 'eye');
  assert.equal(revealShapeFor('odyssey'), 'eye');
});

const letters = n => Array.from({ length: n }, (_, i) => ({ cx: (i * 97) % 1280, cy: 80 + ((i * 53) % 640), seed: i + 1, tx: 0, ty: 0, kx: 0, ky: 0 }));

test('letters land evenly all round the Earth\'s silhouette', () => {
  for (const [w, h] of [[1280, 800], [390, 844]]) {
    const ls = letters(300);
    assignTargets(ls, 'planet', w, h);
    const g = revealGeometry(w, h);
    const angles = ls.map(l => {
      assert.ok(Math.abs(Math.hypot(l.tx - g.cx, l.ty - g.cy) / g.earthRadius - 1) < 0.04, 'on the limb');
      return Math.atan2(l.ty - g.cy, l.tx - g.cx);
    }).sort((a, b) => a - b);
    const gaps = angles.map((a, i) => (i ? a - angles[i - 1] : a + 2 * Math.PI - angles[angles.length - 1]));
    assert.ok(Math.max(...gaps) < (2 * Math.PI / 300) * 3, 'no open arc');
  }
});

test('letters keep their left-to-right order along the eye\'s slit', () => {
  const ls = letters(200);
  assignTargets(ls, 'eye', 1280, 800);
  const g = revealGeometry(1280, 800);
  const byOrigin = [...ls].sort((a, b) => a.cx - b.cx);
  for (let i = 1; i < byOrigin.length; i++) assert.ok(byOrigin[i].tx >= byOrigin[i - 1].tx - 1e-9, 'no crossing flights');
  for (const l of ls) {
    assert.ok(Math.abs(l.tx - g.cx) <= g.eyeHalfWidth);
    assert.ok(Math.abs(l.ty - g.cy) < 0.03 * g.unit, 'on the slit');
  }
});
