import test from 'node:test';
import assert from 'node:assert/strict';
import {
  CREATION_PROGRAMS,
  CREATION_STAGES,
  CREATION_DURATION,
  OCEAN_HANDOFF_AT,
  WHALES_ARRIVE_AT,
  WHALE_SETTLE_AT,
  WHALE_SETTLE_STEP,
  HERO_WAKES_AT,
  MAX_TARGET_LEAD,
  MAX_SCRUB_SPEED,
  creationProgramAt,
  creationProgress,
  creationStage,
  arrivalOffset,
  creation,
  advanceCreation,
  scrubCreation,
  seekCreation,
  finishCreation,
  shouldPlayCreation
} from './creationTimeline.ts';

test('all original worlds and every arrival phase occur once, with contiguous boundaries (~3x faster timeline)', () => {
  assert.deepEqual(CREATION_STAGES.slice(0, 5).map(s => s[0]), ['EYE', 'CREATION', 'BIG_BANG', 'GALAXY', 'BLACK_HOLE']);
  assert.deepEqual(CREATION_STAGES.slice(5).map(s => s[0]), ['SPACE_EXIT', 'EARTH_APPROACH', 'ATMOSPHERIC_DESCENT', 'OCEAN_ENTRY', 'WHALE_HANDOFF']);
  assert.equal(CREATION_DURATION, 30, 'timeline is ~3x faster than the previous 91s duration');
  CREATION_STAGES.forEach(([name, start, end], i) => {
    assert.equal(creationStage(start), name);
    assert.equal(creationStage(end - 0.00001), name);
    assert.equal(end, CREATION_STAGES[i + 1]?.[1] ?? CREATION_DURATION);
  });
  // Earth-to-ocean sequence is compact (7.5 units vs 27 previously)
  const spaceStart = CREATION_STAGES.find(s => s[0] === 'SPACE_EXIT')[1];
  assert.ok(OCEAN_HANDOFF_AT - spaceStart <= 8, 'Earth approach and ocean entry are rapid and direct');
  assert.equal(creationStage(CREATION_DURATION), 'COMPLETE');
  assert.equal(creationStage(1e8), 'COMPLETE');
});

test('arrival converges to the actual ambient poses with zero offset velocity and acceleration', () => {
  for (let i = 0; i < 2; i++) {
    const end = WHALE_SETTLE_AT + i * WHALE_SETTLE_STEP;
    const dt = 0.001;
    assert.ok(arrivalOffset(end, i).every(v => v === 0));
    assert.ok(arrivalOffset(CREATION_DURATION, i).every(v => v === 0));
    const a = arrivalOffset(end - dt, i), b = arrivalOffset(end - 2 * dt, i);
    for (let axis = 0; axis < 3; axis++) {
      assert.ok(Math.abs(a[axis] / dt) < 0.0001);
      assert.ok(Math.abs((b[axis] - 2 * a[axis]) / (dt * dt)) < 0.01);
    }
  }
  assert.ok(arrivalOffset(OCEAN_HANDOFF_AT, 1)[2] < arrivalOffset(OCEAN_HANDOFF_AT, 0)[2], 'companion approaches from greater depth');
});

test('the renderer program follows the original worlds, then the arrival', () => {
  assert.deepEqual(
    [0, 3.99, 4, 8.49, 8.5, 11.49, 11.5, 14.99, 15, 18.49, 18.5, 23, 29].map(creationProgramAt),
    [0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 5]
  );
  assert.equal(CREATION_PROGRAMS, 6);
});

test('no automatic playback: timeline stays at first frame until the visitor scrolls, while ambient motion ticks', () => {
  Object.assign(creation, { active: true, ready: true, paused: false, held: false, time: 0, target: 0, ambient: 0 });
  for (let i = 0; i < 120; i++) advanceCreation(1 / 60);
  assert.equal(creation.time, 0, 'timeline does not advance automatically');
  assert.equal(creationProgress(), 0);
  assert.ok(creation.ambient > 0.5, 'subtle ambient motion still advances at rest');
  Object.assign(creation, { active: false });
});

test('scroll scrubbing advances proportionally (3-4x less sensitive), settles at current progress, and reverses deterministically', () => {
  let wokenValue = 0;
  Object.assign(creation, {
    active: true,
    ready: true,
    paused: false,
    held: false,
    time: 0,
    target: 0,
    ambient: 0,
    onHero: w => { wokenValue = w; }
  });
  seekCreation(0);

  // 1. One small mouse-wheel notch (100px) produces a small incremental step (~0.29 units, < 1% of intro)
  scrubCreation(100, 100, 'wheel');
  assert.ok(creation.target > 0.2 && creation.target < 0.4, `expected one notch to advance ~0.29u, got ${creation.target}`);
  assert.equal(creationStage(creation.target), 'EYE', 'one wheel notch stays well within the first EYE scene');

  // 2. Very slow scrolling (10px increments) advances gradually and linearly
  const beforeSlow = creation.target;
  scrubCreation(10, 350, 'wheel');
  const slowDelta = creation.target - beforeSlow;
  assert.ok(slowDelta > 0.045 && slowDelta < 0.07, `expected 10px slow scroll to advance ~0.055u, got ${slowDelta}`);

  // Advance frames until settled
  const targetAfterDown = creation.target;
  for (let i = 0; i < 60; i++) advanceCreation(1 / 60);
  assert.ok(Math.abs(creation.time - targetAfterDown) < 0.005, 'settles smoothly at target progress');
  const settledTime = creation.time;
  // Stopping scroll holds position
  for (let i = 0; i < 60; i++) advanceCreation(1 / 60);
  assert.equal(creation.time, settledTime, 'stopping scroll holds timeline progress');

  // 3. Scroll upward reverses immediately without waiting to unwind lead
  scrubCreation(100, 1000, 'wheel');
  assert.ok(creation.target > creation.time);
  scrubCreation(-100, 1020, 'wheel');
  assert.ok(creation.target < creation.time, 'reversal immediately moves target behind current time');
  for (let i = 0; i < 60; i++) advanceCreation(1 / 60);
  assert.ok(creation.time < settledTime, 'timeline reversed smoothly');

  // 4. Scrubbing into HERO_WAKES_AT wakes hero, reversing back hides it again
  seekCreation(HERO_WAKES_AT + 1);
  assert.ok(wokenValue > 0, 'hero wakes near the end');
  scrubCreation(-300, 2000, 'key');
  for (let i = 0; i < 60; i++) advanceCreation(1 / 60);
  assert.equal(wokenValue, 0, 'reversing before HERO_WAKES_AT resets hero opacity');
  Object.assign(creation, { active: false, onHero: null });
});

test('fast scroll bursts and momentum tails (including plateaus) are bounded and never skip major scenes', () => {
  Object.assign(creation, { active: true, ready: true, paused: false, held: false, time: 0, target: 0, ambient: 0 });
  seekCreation(0);
  // Simulate a violent trackpad flick + 40 decaying momentum events with integer plateaus
  scrubCreation(500, 1000, 'wheel');
  for (let k = 1; k <= 40; k++) {
    const plateauDelta = Math.round(60 * Math.exp(-Math.floor(k / 2) / 8));
    scrubCreation(plateauDelta, 1000 + k * 16, 'wheel');
  }
  assert.ok(creation.target <= MAX_TARGET_LEAD + 0.001, 'single flick + momentum tail cannot queue past MAX_TARGET_LEAD');
  assert.equal(creationStage(creation.target), 'EYE', 'single burst from 0 cannot skip the first scene');
  // Even with target at MAX_TARGET_LEAD, per-frame speed is bounded by MAX_SCRUB_SPEED
  advanceCreation(0.016);
  assert.ok(creation.time <= MAX_SCRUB_SPEED * 0.016 + 0.001, 'camera speed is bounded on fast scroll');
  Object.assign(creation, { active: false });
});

test('a transition still compiling holds forward progress without blocking reverse scrubbing', () => {
  Object.assign(creation, { active: true, ready: true, paused: false, held: true, time: 8.4, target: 10.0 });
  advanceCreation(0.05);
  assert.equal(creation.time, 8.4, 'holds forward progress at uncompiled seam');
  // Reverse scrubbing still works while held
  creation.target = 7.0;
  advanceCreation(0.05);
  assert.ok(creation.time < 8.4, 'reverse scrubbing is never trapped by held state');
  creation.held = false;
  creation.target = 10.0;
  advanceCreation(0.05);
  assert.ok(creation.time > 7.0);
  Object.assign(creation, { active: false });
});

test('each whale arrives along its own heading: the head leads, never the tail', () => {
  for (const forward of [[-1, 0, 0], [1, 0, 0], [0.9, 0.1, -0.42], [-0.8, -0.2, 0.56]]) for (let whale = 0; whale < 2; whale++) {
    const a = arrivalOffset(26.2, whale, forward), b = arrivalOffset(27.8, whale, forward);
    const travel = [b[0] - a[0], b[1] - a[1], b[2] - a[2]];
    assert.ok(travel[0] * forward[0] + travel[1] * forward[1] + travel[2] * forward[2] > 0);
  }
});

test('the whales hold off until the water has passed the camera', () => {
  assert.ok(WHALES_ARRIVE_AT >= CREATION_STAGES.find(s => s[0] === 'OCEAN_ENTRY')[1] + 1.0);
  for (let whale = 0; whale < 2; whale++) {
    const start = arrivalOffset(WHALES_ARRIVE_AT, whale, [1, 0, 0]);
    const end = arrivalOffset(WHALES_ARRIVE_AT + 0.001, whale, [1, 0, 0]);
    assert.ok(Math.abs(start[0] - end[0]) < 0.001, 'starts from rest, no jump');
  }
});

test('clock waits for resources, pauses, completes once on reaching end, and never loops', () => {
  globalThis.sessionStorage = { setItem() {} };
  Object.assign(creation, { active: true, ready: false, paused: false, held: false, time: 0, target: 5 });
  advanceCreation(10);
  assert.equal(creation.time, 0, 'waits until ready');
  creation.ready = true;
  advanceCreation(0.05);
  const afterOneStep = creation.time;
  assert.ok(afterOneStep > 0);
  creation.paused = true;
  advanceCreation(1);
  assert.equal(creation.time, afterOneStep, 'paused holds progress');
  creation.paused = false;
  let ends = 0;
  const listener = () => { if (!creation.active) ends++; };
  creation.listeners.add(listener);
  creation.time = CREATION_DURATION - 0.02;
  creation.target = CREATION_DURATION;
  advanceCreation(0.05);
  assert.equal(creation.active, false);
  assert.equal(ends, 1);
  advanceCreation(10);
  finishCreation();
  assert.equal(ends, 1);
  creation.listeners.delete(listener);
  delete globalThis.sessionStorage;
});

test('server/non-browser imports have a static fallback', () => assert.equal(shouldPlayCreation(), false));
