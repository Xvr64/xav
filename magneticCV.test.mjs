import test from 'node:test';
import assert from 'node:assert/strict';
import {
  parseMagneticCV,
  magneticCV,
  easedPhase,
  depthGlideEase,
  outSweepPhase,
  inSweepPhase,
  readingEnd,
  READING_BREATH,
  TRANSITION_DURATION_MS,
  MAGNETIC_IDLE_GAP_MS,
  MAGNETIC_DRAIN_REFIRE_MS,
  createMagneticGestureMachine
} from './magneticCVState.ts';

test('the magnetic CV is a development preview behind ?magneticCV=1 only', () => {
  assert.equal(parseMagneticCV('?magneticCV=1', true), true);
  assert.equal(parseMagneticCV('?ocean=all&magneticCV=1', true), true);
  assert.equal(parseMagneticCV('', true), false);
  assert.equal(parseMagneticCV('?magneticCV=0', true), false);
  assert.equal(parseMagneticCV('?magneticCV=true', true), false);
  // Production never enables it, whatever the URL says.
  assert.equal(parseMagneticCV('?magneticCV=1', false), false);
  // Outside a browser (tests, SSR) the flag is off and nothing touches location.
  assert.equal(magneticCV, false);
});

test('transition duration sits inside the 550–650 ms cinematic target', () => {
  assert.ok(TRANSITION_DURATION_MS >= 550 && TRANSITION_DURATION_MS <= 650);
});

test('passage phases ease in and out and clamp outside their window', () => {
  assert.equal(easedPhase(0, .2, .6), 0);
  assert.equal(easedPhase(.2, .2, .6), 0);
  assert.equal(easedPhase(.6, .2, .6), 1);
  assert.equal(easedPhase(1, .2, .6), 1);
  assert.ok(Math.abs(easedPhase(.4, .2, .6) - .5) < 1e-9);
  let last = -1;
  for (let t = 0; t <= 1; t += .01) {
    const p = easedPhase(t, .2, .6);
    assert.ok(p >= last, 'monotonic');
    last = p;
  }
});

test('depthGlideEase is strictly monotonic with zero overshoot and responsive launch', () => {
  assert.equal(depthGlideEase(0), 0);
  assert.equal(depthGlideEase(1), 1);
  let prev = -1;
  for (let i = 0; i <= 100; i++) {
    const v = depthGlideEase(i / 100);
    assert.ok(v >= 0 && v <= 1, 'no bounce or overshoot');
    assert.ok(v >= prev - 1e-9, 'monotonic');
    prev = v;
  }
  // Responsive initial motion and smooth deceleration toward arrival.
  assert.ok(depthGlideEase(0.25) > 0.15);
  assert.ok(depthGlideEase(0.75) > 0.85);
});

test('outgoing clip sweep finishes cleanly ahead of incoming readability', () => {
  assert.equal(outSweepPhase(0), 0);
  assert.ok(outSweepPhase(0.28) > 0.5, 'outgoing has already swept past the upper viewport before incoming opens');
  assert.equal(inSweepPhase(0.28), 0);
  assert.equal(outSweepPhase(0.50), 1);
  assert.ok(inSweepPhase(0.50) < 0.32, 'outgoing is 100% gone while incoming is still reconstructing near the top');
  assert.equal(inSweepPhase(0.88), 1);
});

test('a chapter that fits the screen ends where it starts', () => {
  assert.equal(readingEnd(1000, 1900, 60, 900), 1000);
});

test('overflow that is only bottom padding never costs a gesture', () => {
  // Mobile: 880px chapter on an 844px screen, 59px of padding below the last line.
  assert.equal(readingEnd(9288, 9288 + 880, 59, 844), 9288);
  assert.equal(readingEnd(0, 960, 60, 900), 0);
});

test('even a partially clipped last line has a reachable reading edge', () => {
  assert.equal(readingEnd(0, 967, 60, 900), 7 + READING_BREATH);
});

test('a long chapter ends once its last line, with breathing room, meets the viewport foot', () => {
  const top = 5000, bottom = 5000 + 2400, pad = 80, viewport = 800;
  const end = readingEnd(top, bottom, pad, viewport);
  assert.equal(end, bottom - pad + READING_BREATH - viewport);
  // The last line (at bottom - pad) is on screen at the reading edge, the padding beyond is not needed.
  assert.ok(bottom - pad <= end + viewport);
  assert.ok(end < bottom - viewport);
});

test('the reading edge never exceeds the chapter bottom, even with no padding', () => {
  assert.equal(readingEnd(0, 3000, 0, 800), 2200);
});

// ============================================================================
// ONE-GESTURE-ONE-SECTION STATE MACHINE TESTS
// ============================================================================

const atBoundary = () => ({ room: 0, hasTarget: true });

test('one massive wheel delta triggers strictly one section snap', () => {
  const m = createMagneticGestureMachine();
  const a1 = m.feedWheel(5000, 1000, atBoundary);
  assert.deepEqual(a1, { kind: 'snap', dir: 1 });
  m.beginTransition(1, 1000);
  // Extra events during transition are consumed without queueing.
  assert.deepEqual(m.feedWheel(3000, 1200, atBoundary), { kind: 'consume' });
  m.endTransition(1600, false);
  assert.equal(m.state, 'idle', 'single old burst already quiet when transition finishes');
});

test('aggressive free-spinning mouse wheel burst across 3.2s triggers strictly one snap', () => {
  const m = createMagneticGestureMachine();
  let snaps = 0;
  let t = 1000;
  for (let i = 0; i < 200; i++) {
    t += 16;
    if (m.state === 'transitioning' && t >= 1016 + TRANSITION_DURATION_MS) {
      m.endTransition(t, false);
    }
    const action = m.feedWheel(120, t, atBoundary);
    if (action.kind === 'snap') {
      snaps++;
      m.beginTransition(action.dir, t);
    }
  }
  assert.equal(snaps, 1, 'spinning wheel must never skip a second section');
  assert.equal(m.state, 'draining');
});

test('3.5s trackpad momentum tail with packet coalescing and sign bounces triggers strictly one snap', () => {
  const m = createMagneticGestureMachine();
  let snaps = 0;
  let t = 1000;
  let transitionEnd = Infinity;
  // Initial stroke (8 frames)
  for (let k = 0; k < 8; k++) {
    t += 16;
    const action = m.feedWheel(12 + k * 5, t, atBoundary);
    if (action.kind === 'snap') {
      snaps++;
      m.beginTransition(action.dir, t);
      transitionEnd = t + TRANSITION_DURATION_MS;
    }
  }
  // 220 frames (~3.5s) of fading momentum with 1-vs-2 packet coalescing and occasional -1px sign bounce
  for (let i = 0; i < 220; i++) {
    t += 16;
    if (m.state === 'transitioning' && t >= transitionEnd) {
      m.endTransition(t, false);
    }
    const base = Math.max(1, 40 * Math.exp(-i / 35));
    const delta = i % 17 === 0 ? -1 : (i % 2 === 0 ? base : base * 1.6);
    const action = m.feedWheel(delta, t, atBoundary);
    if (action.kind === 'snap') {
      snaps++;
      m.beginTransition(action.dir, t);
      transitionEnd = t + TRANSITION_DURATION_MS;
    }
  }
  assert.equal(snaps, 1, 'long trackpad momentum with coalescing and sign jitter stays on one section');
});

test('two distinct crisp gestures after transition finish immediately with no artificial wait', () => {
  const m = createMagneticGestureMachine();
  // Gesture 1 at t = 1000
  const a1 = m.feedWheel(100, 1000, atBoundary);
  assert.deepEqual(a1, { kind: 'snap', dir: 1 });
  m.beginTransition(1, 1000);
  // Transition finishes at t = 1600 (600ms after the single notch -> already quiet!)
  m.endTransition(1600, false);
  assert.equal(m.state, 'idle');
  // Gesture 2 arrives immediately at t = 1620
  const a2 = m.feedWheel(100, 1620, atBoundary);
  assert.deepEqual(a2, { kind: 'snap', dir: 1 });
});

test('a deliberate fresh flick on a clearly faded tail re-arms responsively', () => {
  const m = createMagneticGestureMachine();
  let t = 1000;
  assert.deepEqual(m.feedWheel(80, t, atBoundary), { kind: 'snap', dir: 1 });
  m.beginTransition(1, t);
  for (let i = 0; i < 38; i++) {
    t += 16;
    m.feedWheel(Math.max(2, 30 * Math.exp(-i / 10)), t, atBoundary);
  }
  m.endTransition(t, false);
  assert.equal(m.state, 'draining');
  // Tail decays to tiny 2px..1px ticks past MAGNETIC_DRAIN_REFIRE_MS
  const tailFrames = Math.ceil(MAGNETIC_DRAIN_REFIRE_MS / 16) + 2;
  for (let i = 0; i < tailFrames; i++) {
    t += 16;
    assert.deepEqual(m.feedWheel(2, t, atBoundary), { kind: 'consume' });
  }
  // Now user places fingers down and delivers a crisp 48px flick
  t += 16;
  assert.deepEqual(m.feedWheel(48, t, atBoundary), { kind: 'snap', dir: 1 });
});

test('deliberate opposite-direction reversal unlocks draining while tiny sign bounce does not', () => {
  const m = createMagneticGestureMachine();
  assert.deepEqual(m.feedWheel(100, 1000, atBoundary), { kind: 'snap', dir: 1 });
  m.beginTransition(1, 1000);
  m.feedWheel(40, 1550, atBoundary);
  m.endTransition(1600, false);
  assert.equal(m.state, 'draining');
  // Tiny sign bounce stays consumed
  assert.deepEqual(m.feedWheel(-3, 1620, atBoundary), { kind: 'consume' });
  // Strong opposite gesture reverses immediately
  assert.deepEqual(m.feedWheel(-60, 1640, atBoundary), { kind: 'snap', dir: -1 });
});

test('external wheel momentum from the Globe never auto-launches Shanghai -> Profile', () => {
  const m = createMagneticGestureMachine();
  // Globe is playing while wheel momentum continues
  for (let i = 0; i < 10; i++) m.noteExternalWheel(35, 1000 + i * 16);
  // Globe finishes at t = 1160; leftover momentum ticks arrive at Shanghai
  assert.deepEqual(m.feedWheel(25, 1176, atBoundary), { kind: 'consume' });
  assert.deepEqual(m.feedWheel(15, 1192, atBoundary), { kind: 'consume' });
  // After a genuine pause (new deliberate gesture), Shanghai -> Profile snaps cleanly
  assert.deepEqual(m.feedWheel(60, 1192 + MAGNETIC_IDLE_GAP_MS + 20, atBoundary), { kind: 'snap', dir: 1 });
});

test('upward gesture at Shanghai passes through to Globe only after reverse momentum drains', () => {
  const m = createMagneticGestureMachine();
  const shanghaiQuery = (dir) => ({ room: 0, hasTarget: dir > 0 });
  // Profile -> Shanghai reverse transition lands with active upward momentum
  m.beginTransition(-1, 1000);
  m.feedWheel(-40, 1560, shanghaiQuery);
  m.endTransition(1600, false);
  assert.equal(m.state, 'draining');
  // Residual upward momentum at Shanghai is consumed (must NOT start reversing Globe!)
  assert.deepEqual(m.feedWheel(-30, 1620, shanghaiQuery), { kind: 'consume' });
  assert.deepEqual(m.feedWheel(-12, 1640, shanghaiQuery), { kind: 'consume' });
  // After idle gap, a new deliberate upward gesture passes through to Globe's reverse behavior
  assert.deepEqual(m.feedWheel(-80, 1640 + MAGNETIC_IDLE_GAP_MS + 20, shanghaiQuery), { kind: 'passthrough' });
});

test('long section reads natively to its boundary, clamps without snapping, then next gesture snaps', () => {
  const m = createMagneticGestureMachine();
  let room = 220;
  const query = () => ({ room, hasTarget: true });
  // Scroll inside long section
  assert.deepEqual(m.feedWheel(100, 1000, query), { kind: 'read' });
  room -= 100; // 120 left
  assert.deepEqual(m.feedWheel(100, 1016, query), { kind: 'read' });
  room -= 100; // 20 left
  // Crossing the edge on the same gesture clamps at boundary and drains (never jumps to next chapter!)
  assert.deepEqual(m.feedWheel(100, 1032, query), { kind: 'clamp', dir: 1 });
  room = 0;
  assert.deepEqual(m.feedWheel(100, 1048, query), { kind: 'consume' });
  assert.deepEqual(m.feedWheel(100, 1064, query), { kind: 'consume' });
  // Next deliberate gesture after pause snaps cleanly to the adjacent chapter
  assert.deepEqual(m.feedWheel(80, 1064 + MAGNETIC_IDLE_GAP_MS + 20, query), { kind: 'snap', dir: 1 });
});
