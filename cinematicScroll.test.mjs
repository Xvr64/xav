import test from 'node:test';
import assert from 'node:assert/strict';
import { createWheelGestures, glideAt, nextCheckpoint, GESTURE_GAP_MS } from './cinematicScroll.ts';

/** Feed a sequence of [delta, ms-after-previous] and count the gestures recognised. */
const gesturesIn = (events, g = createWheelGestures()) => {
  let t = 1000;
  const out = [];
  for (const [d, dt] of events) {
    t += dt;
    const r = g.feed(d, t);
    if (r) out.push(r);
  }
  return out;
};

test('one mouse-wheel notch is one gesture; notches spun together are still one', () => {
  assert.deepEqual(gesturesIn([[100, 0]]), [1]);
  assert.deepEqual(gesturesIn([[100, 0], [100, 40], [100, 40], [100, 40], [100, 40]]), [1]);
  // A pause between notches makes each a new, deliberate step
  assert.deepEqual(gesturesIn([[100, 0], [100, GESTURE_GAP_MS + 20], [100, GESTURE_GAP_MS + 20]]), [1, 1, 1]);
});

test('a trackpad stroke and its momentum tail are one gesture, however long the tail', () => {
  const stroke = [];
  for (let k = 0; k < 8; k++) stroke.push([4 + k * 3, 16]);
  for (let k = 0; k < 90; k++) stroke.push([Math.max(1, 30 * Math.exp(-k / 18)), 16]);
  assert.deepEqual(gesturesIn(stroke), [1]);
  // A tiny graze is not intentional
  assert.deepEqual(gesturesIn([[3, 0], [4, 16], [3, 16]]), []);
});

test('a fresh flick during a fading momentum tail, and any reversal, are new gestures', () => {
  const events = [];
  for (let k = 0; k < 6; k++) events.push([20, 16]);
  for (let k = 0; k < 30; k++) events.push([Math.max(1, 20 * Math.exp(-k / 6)), 16]);
  events.push([25, 16], [30, 16]);
  assert.deepEqual(gesturesIn(events), [1, 1]);
  assert.deepEqual(gesturesIn([[60, 0], [60, 16], [-40, 16]]), [1, -1]);
});

test('stepping: one checkpoint per gesture, a glide extends by at most one, reversal turns back', () => {
  const cps = [0, 100, 200, 300, 400];
  assert.equal(nextCheckpoint(cps, 0, 1, null), 1);
  assert.equal(nextCheckpoint(cps, 100, 1, null), 2);
  assert.equal(nextCheckpoint(cps, 400, 1, null), null);
  assert.equal(nextCheckpoint(cps, 0, -1, null), null);
  // Mid-glide from 100 toward 200: another gesture aims one further, never two
  assert.equal(nextCheckpoint(cps, 140, 1, 2), 3);
  assert.equal(nextCheckpoint(cps, 140, 1, 3), 3);
  // Reversing mid-glide returns to the checkpoint just behind the stage, not to the start
  assert.equal(nextCheckpoint(cps, 140, -1, 2), 1);
  // Between checkpoints with no glide (a scrollbar drag): onward or back to the neighbours
  assert.equal(nextCheckpoint(cps, 250, 1, null), 3);
  assert.equal(nextCheckpoint(cps, 250, -1, null), 2);
});

test('the glide starts where the stage is, at its speed, and comes to rest on the checkpoint', () => {
  const a = glideAt(100, 0, 200, 2, 0);
  assert.equal(a.y, 100);
  assert.equal(a.v, 0);
  const end = glideAt(100, 0, 200, 2, 2);
  assert.equal(end.y, 200);
  assert.equal(end.v, 0);
  // Velocity carried in is kept (no jolt on retargeting), and the path is monotone from rest
  assert.ok(Math.abs(glideAt(100, 80, 300, 2, 0).v - 80) < 1e-9);
  let prev = 100;
  for (let t = 0; t <= 2; t += 0.05) {
    const { y } = glideAt(100, 0, 200, 2, t);
    assert.ok(y >= prev - 1e-9);
    prev = y;
  }
  // Eased: slow at both ends, fastest in the middle
  assert.ok(glideAt(100, 0, 200, 2, 0.1).v < glideAt(100, 0, 200, 2, 1).v);
});
