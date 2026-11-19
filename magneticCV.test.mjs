import test from 'node:test';
import assert from 'node:assert/strict';
import {
  parseMagneticCV,
  magneticCV,
  easedPhase,
  cinematicPhase,
  depthGlideEase,
  focusLockPhase,
  outSweepPhase,
  depthPassagePhase,
  inSweepPhase,
  titleArrivePhase,
  copyArrivePhase,
  oceanWaveY,
  readingEnd,
  READING_BREATH,
  TRANSITION_DURATION_MS,
  GLOBE_TRANSITION_DURATION_MS,
  MAGNETIC_IDLE_GAP_MS,
  MAGNETIC_DRAIN_IDLE_MS,
  createMagneticGestureMachine
} from './magneticCVState.ts';

test('the magnetic CV is opt-in behind ?magneticCV=1 in both development and production, off by default', () => {
  assert.equal(parseMagneticCV('?magneticCV=1'), true);
  assert.equal(parseMagneticCV('?ocean=all&magneticCV=1'), true);
  assert.equal(parseMagneticCV(''), false);
  assert.equal(parseMagneticCV('?ocean=all'), false);
  assert.equal(parseMagneticCV('?magneticCV=0'), false);
  assert.equal(parseMagneticCV('?magneticCV=true'), false);
  assert.equal(parseMagneticCV('?magneticcv=1'), false);
  // Outside a browser (tests, SSR) the flag is off and nothing touches location.
  assert.equal(magneticCV, false);
});

test('transition durations sit cleanly inside the 900–1200ms cinematic window', () => {
  assert.ok(TRANSITION_DURATION_MS >= 900 && TRANSITION_DURATION_MS <= 1200);
  assert.ok(GLOBE_TRANSITION_DURATION_MS >= 900 && GLOBE_TRANSITION_DURATION_MS <= 1200);
  assert.ok(GLOBE_TRANSITION_DURATION_MS >= TRANSITION_DURATION_MS, 'Shanghai <-> Profile gets equal or slightly grander breath');
});

test('passage phases ease in and out and clamp outside their window', () => {
  assert.equal(easedPhase(0, .2, .6), 0);
  assert.equal(easedPhase(.2, .2, .6), 0);
  assert.equal(easedPhase(.6, .2, .6), 1);
  assert.equal(easedPhase(1, .2, .6), 1);
  assert.ok(Math.abs(easedPhase(.4, .2, .6) - .5) < 1e-9);
  assert.ok(Math.abs(cinematicPhase(.4, .2, .6) - .5) < 1e-9);
  let last = -1;
  for (let t = 0; t <= 1; t += .01) {
    const p = easedPhase(t, .2, .6);
    assert.ok(p >= last, 'monotonic');
    last = p;
  }
});

test('depthGlideEase is strictly monotonic with zero overshoot, poised launch, and velvet settle', () => {
  assert.equal(depthGlideEase(0), 0);
  assert.equal(depthGlideEase(1), 1);
  let prev = -1;
  for (let i = 0; i <= 100; i++) {
    const v = depthGlideEase(i / 100);
    assert.ok(v >= 0 && v <= 1, 'no bounce or overshoot');
    assert.ok(v >= prev - 1e-9, 'monotonic');
    prev = v;
  }
  // Weighted launch during camera push-in, strong glide through depth passage, velvet deceleration into settle.
  assert.ok(depthGlideEase(0.15) < 0.16, 'poised initial camera departure');
  assert.ok(depthGlideEase(0.55) > 0.56, 'ocean carries momentum through depth passage');
  assert.ok(depthGlideEase(0.85) > 0.92, 'aristocratic deceleration before settle');
});

test('overlapping cinematic choreography guarantees push-in, non-colliding clip handoff, depth surge, and heading-first arrival', () => {
  // Stage A: Camera push-in locks focal subject while outgoing clip starts smoothly.
  assert.equal(focusLockPhase(0), 0);
  assert.ok(focusLockPhase(0.20) > 0.85, 'focus lock establishes clearly in Stage A');
  assert.equal(focusLockPhase(0.24), 1);
  assert.equal(outSweepPhase(0.10), 0, 'outgoing clip lets push-in establish first');

  // Stage B -> D handoff: outgoing reaches 100% at t=0.48 right as incoming opens (zero dual-text collision, zero dead gap).
  assert.equal(outSweepPhase(0.48), 1, 'outgoing section is 100% cleared by t=0.48');
  assert.equal(inSweepPhase(0.48), 0, 'incoming section has not opened while outgoing clears');
  assert.ok(inSweepPhase(0.54) > 0.10, 'incoming curved unveil opens fluidly without a dead blank pause');

  // Stage C: Ocean depth bridge peaks cleanly across the handoff.
  assert.equal(depthPassagePhase(0.15), 0);
  assert.ok(depthPassagePhase(0.49) > 0.95, 'depth passage peaks across the central ocean bridge');
  assert.equal(depthPassagePhase(0.85), 0);

  // Stage D: Hero heading reconstructs ahead of supporting copy cascade, settling crisply before end.
  assert.ok(titleArrivePhase(0.60) > copyArrivePhase(0.60), 'title begins reconstructing ahead of body copy');
  assert.ok(titleArrivePhase(0.72) > copyArrivePhase(0.72), 'title maintains clear lead during arrival');
  assert.equal(titleArrivePhase(0.86), 1, 'title settles crisply before transition end');
  assert.equal(inSweepPhase(0.90), 1, 'incoming unveil completes cleanly before final settle');
  assert.equal(copyArrivePhase(0.95), 1, 'supporting lines complete cleanly before final settle');
});

test('oceanWaveY produces a smooth, sculpted curved oceanic profile', () => {
  const ys = [];
  for (let i = 0; i <= 10; i++) {
    ys.push(oceanWaveY(i / 10, 400, -70, 30, 0.5));
  }
  assert.ok(ys.every(Number.isFinite));
  // Distinct curved oceanic meniscus rather than a rigid straight ruler line.
  const linearMid = (ys[0] + ys[10]) / 2;
  assert.ok(Math.abs(ys[5] - linearMid) > 10, 'sculpted curved oceanic arch');
  assert.ok(ys.every(y => Math.abs(y - 400) < 90), 'wave stays refined and bounded');
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
// ONE-GESTURE-ONE-SECTION & ZERO-LOCKUP STATE MACHINE TESTS
// ============================================================================

const atBoundary = () => ({ room: 0, hasTarget: true });

test('one massive wheel delta triggers strictly one section snap', () => {
  const m = createMagneticGestureMachine();
  const a1 = m.feedWheel(5000, 1000, atBoundary);
  assert.deepEqual(a1, { kind: 'snap', dir: 1 });
  m.beginTransition(1, 1000);
  // Extra events during transition are consumed without queueing.
  assert.deepEqual(m.feedWheel(3000, 1500, atBoundary), { kind: 'consume' });
  m.endTransition(1000 + TRANSITION_DURATION_MS, false);
  assert.equal(m.state, 'idle', 'single old burst already quiet when transition finishes');
});

test('consecutive separate scrolls advance every section cleanly with zero reset or click required', () => {
  const m = createMagneticGestureMachine();
  let t = 1000;
  for (let section = 0; section < 7; section++) {
    assert.deepEqual(m.feedWheel(100, t, atBoundary), { kind: 'snap', dir: 1 }, `forward step ${section}`);
    m.beginTransition(1, t);
    t += TRANSITION_DURATION_MS;
    m.endTransition(t, false);
    assert.equal(m.state, 'idle');
    t += 220;
  }
  for (let section = 0; section < 7; section++) {
    assert.deepEqual(m.feedWheel(-100, t, atBoundary), { kind: 'snap', dir: -1 }, `reverse step ${section}`);
    m.beginTransition(-1, t);
    t += TRANSITION_DURATION_MS;
    m.endTransition(t, false);
    assert.equal(m.state, 'idle');
    t += 220;
  }
});

test('precision touchpad and smooth-scroll small packets snap reliably without being wiped as crumbs', () => {
  const m = createMagneticGestureMachine();
  let t = 1000;
  // First gesture: crisp flick
  assert.deepEqual(m.feedWheel(100, t, atBoundary), { kind: 'snap', dir: 1 });
  m.beginTransition(1, t);
  t += TRANSITION_DURATION_MS;
  m.endTransition(t, false);
  t += 250;

  // Second gesture: Chromium smooth-scroll / precision wheel packets [3, 6, 7, 6, 7, 6, 7]
  let snapped = false;
  for (const dy of [3, 6, 7, 6, 7, 6, 7]) {
    t += 12;
    const a = m.feedWheel(dy, t, atBoundary);
    if (a.kind === 'snap') {
      snapped = true;
      m.beginTransition(a.dir, t);
      break;
    }
  }
  assert.equal(snapped, true, 'oscillating 3..7px smooth wheel packets must snap cleanly');
  t += TRANSITION_DURATION_MS;
  m.endTransition(t, false);
  t += 250;

  // Third gesture: gentle trackpad bell peaking at 12px (< 14px) [4, 8, 11, 12, 11, 9]
  snapped = false;
  for (const dy of [4, 8, 11, 12, 11, 9]) {
    t += 16;
    const a = m.feedWheel(dy, t, atBoundary);
    if (a.kind === 'snap') {
      snapped = true;
      m.beginTransition(a.dir, t);
      break;
    }
  }
  assert.equal(snapped, true, 'gentle trackpad stroke peaking at 12px must snap cleanly');
  t += TRANSITION_DURATION_MS;
  m.endTransition(t, false);
  t += 250;

  // Fourth gesture: steady slow scroll [7, 7, 7, 7]
  snapped = false;
  for (const dy of [7, 7, 7, 7]) {
    t += 16;
    const a = m.feedWheel(dy, t, atBoundary);
    if (a.kind === 'snap') {
      snapped = true;
      m.beginTransition(a.dir, t);
      break;
    }
  }
  assert.equal(snapped, true, 'steady slow scroll must snap cleanly');
});

test('proactive rearmIfQuiet transitions draining to idle without requiring a click or pointer event', () => {
  const m = createMagneticGestureMachine();
  let t = 1000;
  assert.deepEqual(m.feedWheel(80, t, atBoundary), { kind: 'snap', dir: 1 });
  m.beginTransition(1, t);
  // Momentum packet arrives near transition end
  m.feedWheel(6, t + TRANSITION_DURATION_MS - 30, atBoundary);
  m.endTransition(t + TRANSITION_DURATION_MS, false);
  assert.equal(m.state, 'draining');
  assert.equal(m.rearmIfQuiet(t + TRANSITION_DURATION_MS + 50), false, 'still within quiet window');
  assert.equal(m.state, 'draining');
  assert.equal(m.rearmIfQuiet(t + TRANSITION_DURATION_MS + MAGNETIC_DRAIN_IDLE_MS), true, 'rearms cleanly after quiet gap');
  assert.equal(m.state, 'idle');
});

test('fresh discrete scroll after a faded trackpad tail never locks up in draining', () => {
  const m = createMagneticGestureMachine();
  let t = 1000;
  assert.deepEqual(m.feedWheel(80, t, atBoundary), { kind: 'snap', dir: 1 });
  m.beginTransition(1, t);
  // Trackpad momentum fades all the way to 1-2px right up to transition end
  const frames = Math.ceil(TRANSITION_DURATION_MS / 16);
  for (let i = 0; i < frames; i++) {
    t += 16;
    m.feedWheel(Math.max(1, Math.round(28 * Math.exp(-i / 14))), t, atBoundary);
  }
  m.endTransition(t, false);
  assert.equal(m.state, 'draining');
  // User waits 160ms after landing and makes a fresh discrete scroll (100px)
  t += 160;
  assert.deepEqual(m.feedWheel(100, t, atBoundary), { kind: 'snap', dir: 1 }, 'fresh discrete scroll snaps immediately instead of locking in draining');
});

test('aggressive free-spinning mouse wheel burst across 3.8s triggers strictly one snap', () => {
  const m = createMagneticGestureMachine();
  let snaps = 0;
  let t = 1000;
  for (let i = 0; i < 240; i++) {
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

test('3.8s trackpad momentum tail with packet coalescing and sign bounces triggers strictly one snap', () => {
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
  // 240 frames (~3.8s) of fading momentum with 1-vs-2 packet coalescing and occasional -1px sign bounce
  for (let i = 0; i < 240; i++) {
    t += 16;
    if (m.state === 'transitioning' && t >= transitionEnd) {
      m.endTransition(t, false);
    }
    const base = Math.max(1, 42 * Math.exp(-i / 38));
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
  const a1 = m.feedWheel(100, 1000, atBoundary);
  assert.deepEqual(a1, { kind: 'snap', dir: 1 });
  m.beginTransition(1, 1000);
  const doneAt = 1000 + TRANSITION_DURATION_MS;
  m.endTransition(doneAt, false);
  assert.equal(m.state, 'idle');
  // Gesture 2 arrives immediately after landing
  const a2 = m.feedWheel(100, doneAt + 20, atBoundary);
  assert.deepEqual(a2, { kind: 'snap', dir: 1 });
});

test('coalesced momentum spikes during draining never skip a second section until a genuine quiet gap', () => {
  const m = createMagneticGestureMachine();
  let t = 1000;
  assert.deepEqual(m.feedWheel(80, t, atBoundary), { kind: 'snap', dir: 1 });
  m.beginTransition(1, t);
  const frames = Math.ceil(TRANSITION_DURATION_MS / 16);
  for (let i = 0; i < frames; i++) {
    t += 16;
    m.feedWheel(Math.max(2, 30 * Math.exp(-i / 18)), t, atBoundary);
  }
  m.endTransition(t, false);
  assert.equal(m.state, 'draining');
  for (let i = 0; i < 20; i++) {
    t += 16;
    assert.deepEqual(m.feedWheel(2, t, atBoundary), { kind: 'consume' });
  }
  // Massive coalesced spike + continuing flywheel bursts without a quiet gap must stay consumed
  t += 16;
  assert.deepEqual(m.feedWheel(480, t, atBoundary), { kind: 'consume' });
  t += 16;
  assert.deepEqual(m.feedWheel(60, t, atBoundary), { kind: 'consume' });
  // After a genuine quiet gap (new physical gesture), the next snap fires cleanly
  t += MAGNETIC_DRAIN_IDLE_MS + 20;
  assert.deepEqual(m.feedWheel(60, t, atBoundary), { kind: 'snap', dir: 1 });
});

test('dying momentum crumbs after a long frame stall never spontaneously snap a second section', () => {
  const m = createMagneticGestureMachine();
  let t = 1000;
  assert.deepEqual(m.feedWheel(65, t, atBoundary), { kind: 'snap', dir: 1 });
  m.beginTransition(1, t);
  m.endTransition(t + TRANSITION_DURATION_MS, false);
  t += TRANSITION_DURATION_MS + MAGNETIC_DRAIN_IDLE_MS + 50;
  // Simulate slow dying momentum crumbs (11, 10, 9, 8, 7, 6, 5) arriving after a frame stall
  for (const crumb of [11, 10, 9, 8, 7, 6, 5, 4]) {
    t += 16;
    assert.deepEqual(m.feedWheel(crumb, t, atBoundary), { kind: 'consume' });
  }
  // A genuine new finger stroke (10, 16, 22) snaps cleanly
  t += 160;
  assert.deepEqual(m.feedWheel(10, t, atBoundary), { kind: 'consume' });
  t += 16;
  assert.deepEqual(m.feedWheel(16, t, atBoundary), { kind: 'consume' });
  t += 16;
  assert.deepEqual(m.feedWheel(22, t, atBoundary), { kind: 'snap', dir: 1 });
});

test('flywheel recoil is ignored while deliberate opposite-direction reversal unlocks draining', () => {
  const m = createMagneticGestureMachine();
  assert.deepEqual(m.feedWheel(100, 1000, atBoundary), { kind: 'snap', dir: 1 });
  m.beginTransition(1, 1000);
  const doneAt = 1000 + TRANSITION_DURATION_MS;
  m.feedWheel(40, doneAt - 40, atBoundary);
  m.endTransition(doneAt, false);
  assert.equal(m.state, 'draining');
  // Tiny sign bounce and single-packet flywheel recoil stay consumed
  assert.deepEqual(m.feedWheel(-3, doneAt + 20, atBoundary), { kind: 'consume' });
  assert.deepEqual(m.feedWheel(-40, doneAt + 36, atBoundary), { kind: 'consume' });
  // Sustained deliberate opposite gesture reverses cleanly
  assert.deepEqual(m.feedWheel(-60, doneAt + 52, atBoundary), { kind: 'snap', dir: -1 });
});

test('external wheel momentum from the Globe never auto-launches Shanghai -> Profile', () => {
  const m = createMagneticGestureMachine();
  for (let i = 0; i < 10; i++) m.noteExternalWheel(35, 1000 + i * 16);
  assert.deepEqual(m.feedWheel(25, 1176, atBoundary), { kind: 'consume' });
  assert.deepEqual(m.feedWheel(15, 1192, atBoundary), { kind: 'consume' });
  assert.deepEqual(m.feedWheel(60, 1192 + MAGNETIC_DRAIN_IDLE_MS + 20, atBoundary), { kind: 'snap', dir: 1 });
});

test('upward gesture at Shanghai passes through to Globe only after reverse momentum drains', () => {
  const m = createMagneticGestureMachine();
  const shanghaiQuery = (dir) => ({ room: 0, hasTarget: dir > 0 });
  m.beginTransition(-1, 1000);
  const doneAt = 1000 + GLOBE_TRANSITION_DURATION_MS;
  m.feedWheel(-40, doneAt - 40, shanghaiQuery);
  m.endTransition(doneAt, false);
  assert.equal(m.state, 'draining');
  assert.deepEqual(m.feedWheel(-30, doneAt + 20, shanghaiQuery), { kind: 'consume' });
  assert.deepEqual(m.feedWheel(-12, doneAt + 40, shanghaiQuery), { kind: 'consume' });
  assert.deepEqual(m.feedWheel(-80, doneAt + 40 + MAGNETIC_DRAIN_IDLE_MS + 20, shanghaiQuery), { kind: 'passthrough' });
});

test('long section reads natively to its boundary, clamps without snapping, then next gesture snaps', () => {
  const m = createMagneticGestureMachine();
  let room = 220;
  const query = () => ({ room, hasTarget: true });
  assert.deepEqual(m.feedWheel(100, 1000, query), { kind: 'read' });
  room -= 100;
  assert.deepEqual(m.feedWheel(100, 1016, query), { kind: 'read' });
  room -= 100;
  assert.deepEqual(m.feedWheel(100, 1032, query), { kind: 'clamp', dir: 1 });
  room = 0;
  assert.deepEqual(m.feedWheel(100, 1048, query), { kind: 'consume' });
  assert.deepEqual(m.feedWheel(100, 1064, query), { kind: 'consume' });
  assert.deepEqual(m.feedWheel(80, 1064 + MAGNETIC_DRAIN_IDLE_MS + 20, query), { kind: 'snap', dir: 1 });
});

test('trackpad re-arming: coalesced, flat-start, and jittery gentle gestures snap cleanly right after a transition', () => {
  const gestures = [
    { label: 'coalesced start [13,11,10..1]', deltas: [13, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1], pauseMs: 320 },
    { label: 'flat-start gentle [8,8,7,6,5,4,3]', deltas: [8, 8, 7, 6, 5, 4, 3], pauseMs: 260 },
    { label: '1px-jitter gentle [6,5,6,5,4,3]', deltas: [6, 5, 6, 5, 4, 3], pauseMs: 260 },
    { label: 'slow trackpad with 165ms cadence [10,10,10]', deltas: [10, 10, 10], pauseMs: 260, gapMs: 165 }
  ];
  const m = createMagneticGestureMachine();
  let t = 1000;
  // Seed initial same-direction snap
  assert.deepEqual(m.feedWheel(80, t, atBoundary), { kind: 'snap', dir: 1 });
  m.beginTransition(1, t);
  t += TRANSITION_DURATION_MS;
  m.endTransition(t, false);

  for (const g of gestures) {
    t += g.pauseMs;
    let snapped = false;
    for (const dy of g.deltas) {
      t += g.gapMs ?? 16;
      const a = m.feedWheel(dy, t, atBoundary);
      if (a.kind === 'snap') {
        snapped = true;
        m.beginTransition(a.dir, t);
        break;
      }
    }
    assert.equal(snapped, true, `${g.label} must snap without waiting for cursor move or 2.5s timeout`);
    t += TRANSITION_DURATION_MS;
    m.endTransition(t, false);
  }
});

test('trackpad re-arming: fresh trackpad gesture on top of a faded draining tail snaps without a 200ms silence', () => {
  const cases = [
    { label: 'rising ramp 60ms after 1px tail', pauseMs: 60, deltas: [6, 16, 26, 34, 28, 18] },
    { label: 'immediate rising ramp (16ms gap) over 1px tail', pauseMs: 16, deltas: [4, 10, 18, 24, 20] },
    { label: 'fast 2-frame-peak flick 40ms after 2px tail', pauseMs: 40, deltas: [12, 24, 22, 16, 10] },
    { label: 'quantized plateau ramp [3,7,7,11,15] over 1px tail', pauseMs: 24, deltas: [3, 7, 7, 11, 15] },
    { label: 'gentle downward stroke 125ms after 1px tail', pauseMs: 125, deltas: [12, 11, 10, 9, 8] }
  ];

  for (const tc of cases) {
    const m = createMagneticGestureMachine();
    let t = 1000;
    assert.deepEqual(m.feedWheel(80, t, atBoundary), { kind: 'snap', dir: 1 });
    m.beginTransition(1, t);
    // Long momentum tail outlasting transition down to 1-2px
    const frames = Math.ceil(TRANSITION_DURATION_MS / 16) + 8;
    for (let i = 0; i < frames; i++) {
      t += 16;
      if (m.state === 'transitioning' && t >= 1000 + TRANSITION_DURATION_MS) {
        m.endTransition(t, false);
      }
      m.feedWheel(Math.max(1, Math.round(28 * Math.exp(-i / 14))), t, atBoundary);
    }
    assert.equal(m.state, 'draining', `${tc.label}: still draining on faded 1px tail`);

    t += tc.pauseMs;
    let snapped = false;
    for (let i = 0; i < tc.deltas.length; i++) {
      if (i > 0) t += 16;
      const a = m.feedWheel(tc.deltas[i], t, atBoundary);
      if (a.kind === 'snap') {
        snapped = true;
        m.beginTransition(a.dir, t);
        break;
      }
    }
    assert.equal(snapped, true, `${tc.label} must unlock draining and snap cleanly`);
  }
});

test('widening-gap dying momentum tail and quantized +1px tail jitter still trigger strictly one snap', () => {
  const m = createMagneticGestureMachine();
  let t = 1000;
  let snaps = 0;
  assert.deepEqual(m.feedWheel(60, t, atBoundary), { kind: 'snap', dir: 1 });
  snaps++;
  m.beginTransition(1, t);
  // Momentum decays to 1-2px across transition
  for (let i = 0; i < 72; i++) {
    t += 16;
    if (m.state === 'transitioning' && t >= 1000 + TRANSITION_DURATION_MS) m.endTransition(t, false);
    const a = m.feedWheel(Math.max(1, Math.round(24 * Math.exp(-i / 16))), t, atBoundary);
    if (a.kind === 'snap') snaps++;
  }
  assert.equal(m.state, 'draining');
  // Quantization jitter (+1px) and widening tail intervals (24ms -> 170ms) must remain consumed
  const jitterTail = [
    [3, 16], [4, 16], [3, 16], [2, 16], [3, 16], [2, 24], [1, 32],
    [2, 48], [1, 68], [1, 96], [1, 130], [1, 168]
  ];
  for (const [dy, dt] of jitterTail) {
    t += dt;
    const a = m.feedWheel(dy, t, atBoundary);
    if (a.kind === 'snap') snaps++;
  }
  assert.equal(snaps, 1, 'jittery and widening-gap momentum tail must never trigger a second snap');
});

test('chaotic coalesced spike followed by sustained flywheel bursts during draining never skips a section', () => {
  const m = createMagneticGestureMachine();
  let t = 1000;
  assert.deepEqual(m.feedWheel(80, t, atBoundary), { kind: 'snap', dir: 1 });
  m.beginTransition(1, t);
  const frames = Math.ceil(TRANSITION_DURATION_MS / 16);
  for (let i = 0; i < frames; i++) {
    t += 16;
    m.feedWheel(Math.max(2, 28 * Math.exp(-i / 14)), t, atBoundary);
  }
  m.endTransition(t, false);
  for (let i = 0; i < 12; i++) {
    t += 16;
    assert.deepEqual(m.feedWheel(2, t, atBoundary), { kind: 'consume' });
  }
  // Huge coalesced spike drops into noisy flywheel bursts — must stay 100% consumed
  for (const dy of [480, 60, 70, 80, 75, 90, 100]) {
    t += 16;
    assert.deepEqual(m.feedWheel(dy, t, atBoundary), { kind: 'consume' });
  }
});

test('consecutive trackpad gestures with overlapping tails traverse all 7 sections forward and reverse without cursor reset', () => {
  const m = createMagneticGestureMachine();
  let t = 1000;
  for (const dir of [1, -1]) {
    for (let step = 0; step < 7; step++) {
      let snaps = 0;
      let transitionEnd = Infinity;
      const stroke = [4, 10, 18, 26, 22, 16, 10, 6, 4, 2, 1, 1];
      for (const mag of stroke) {
        t += 16;
        if (m.state === 'transitioning' && t >= transitionEnd) m.endTransition(t, false);
        const a = m.feedWheel(dir * mag, t, atBoundary);
        if (a.kind === 'snap') {
          snaps++;
          assert.equal(a.dir, dir);
          m.beginTransition(a.dir, t);
          transitionEnd = t + TRANSITION_DURATION_MS;
        }
      }
      // Continue tail past transition end, then pause briefly (90ms < 200ms!) before next gesture
      while (t < transitionEnd + 80) {
        t += 16;
        if (m.state === 'transitioning' && t >= transitionEnd) m.endTransition(t, false);
        const a = m.feedWheel(dir * 1, t, atBoundary);
        if (a.kind === 'snap') snaps++;
      }
      assert.equal(snaps, 1, `dir=${dir} step=${step} must advance strictly 1 section`);
      t += 90; // short pause (< 200ms) while still in draining on 1px tail!
    }
    t += MAGNETIC_DRAIN_IDLE_MS + 40;
  }
});

test('sign bounce after a 145ms slow paint frame during transitioning/draining never poisons emaMag or skips a section', () => {
  const m = createMagneticGestureMachine();
  let t = 1000;
  assert.deepEqual(m.feedWheel(42, t, atBoundary), { kind: 'snap', dir: 1 });
  m.beginTransition(1, t);
  // Strong momentum continues across transition at slow ~130-150ms paint-frame cadence, with a -1px sign bounce
  for (const [dy, dt] of [[38, 130], [54, 145], [34, 135], [48, 145], [-1, 150], [44, 140], [28, 145], [40, 140]]) {
    t += dt;
    assert.deepEqual(m.feedWheel(dy, t, atBoundary), { kind: 'consume' });
  }
  m.endTransition(t + 10, false);
  assert.equal(m.state, 'draining');
  // Continuing coalesced momentum arriving at 135-150ms spacing must stay 100% consumed
  for (const [dy, dt] of [[42, 145], [26, 135], [-1, 150], [36, 140], [20, 130]]) {
    t += dt;
    assert.deepEqual(m.feedWheel(dy, t, atBoundary), { kind: 'consume' });
  }
  assert.equal(m.state, 'draining');
});
