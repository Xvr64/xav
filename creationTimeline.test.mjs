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
  WHALE_FADE_SPAN,
  HERO_WAKES_AT,
  COSMIC_ACCELERATED_SPEED,
  ARRIVAL_NATURAL_SPEED,
  targetPlaybackSpeed,
  creationProgramAt,
  creationProgress,
  creationStage,
  arrivalOffset,
  creation,
  advanceCreation,
  triggerCreationGesture,
  reopenCreationInReverse,
  scrubCreation,
  seekCreation,
  finishCreation,
  shouldPlayCreation
} from './creationTimeline.ts';

test('all original worlds and every arrival phase occur once, with canonical 0..91 boundaries', () => {
  assert.deepEqual(CREATION_STAGES.slice(0, 5).map(s => s[0]), ['EYE', 'CREATION', 'BIG_BANG', 'GALAXY', 'BLACK_HOLE']);
  assert.deepEqual(CREATION_STAGES.slice(5).map(s => s[0]), ['SPACE_EXIT', 'EARTH_APPROACH', 'ATMOSPHERIC_DESCENT', 'OCEAN_ENTRY', 'WHALE_HANDOFF']);
  assert.equal(CREATION_DURATION, 91, 'canonical duration is 91s');
  assert.equal(OCEAN_HANDOFF_AT, 81, 'native ocean handoff occurs at 81s');
  assert.equal(HERO_WAKES_AT, 87, 'hero starts waking at 87s');
  CREATION_STAGES.forEach(([name, start, end], i) => {
    assert.equal(creationStage(start), name);
    assert.equal(creationStage(end - 0.00001), name);
    assert.equal(end, CREATION_STAGES[i + 1]?.[1] ?? CREATION_DURATION);
  });
  assert.equal(creationStage(CREATION_DURATION), 'COMPLETE');
  assert.equal(creationStage(1e8), 'COMPLETE');
});

test('playback speed accelerates earlier cosmos but strictly preserves natural 1.0x arrival timing', () => {
  // Earlier cosmos scenes (0..48) run accelerated (~3.6x)
  assert.equal(targetPlaybackSpeed(0), COSMIC_ACCELERATED_SPEED);
  assert.equal(targetPlaybackSpeed(12), COSMIC_ACCELERATED_SPEED);
  assert.equal(targetPlaybackSpeed(25), COSMIC_ACCELERATED_SPEED);
  assert.equal(targetPlaybackSpeed(33), COSMIC_ACCELERATED_SPEED);
  assert.equal(targetPlaybackSpeed(48), COSMIC_ACCELERATED_SPEED);

  // Smooth deceleration window between black hole exit and Earth approach (48..60)
  const speedAt54 = targetPlaybackSpeed(54);
  assert.ok(speedAt54 < COSMIC_ACCELERATED_SPEED && speedAt54 > ARRIVAL_NATURAL_SPEED, 'smooth hermite deceleration');

  // Peninsula approach, atmospheric descent, ocean entry, and CV arrival (60..91) are strictly 1.0x natural speed
  assert.equal(targetPlaybackSpeed(60), ARRIVAL_NATURAL_SPEED);
  assert.equal(targetPlaybackSpeed(68), ARRIVAL_NATURAL_SPEED);
  assert.equal(targetPlaybackSpeed(76), ARRIVAL_NATURAL_SPEED);
  assert.equal(targetPlaybackSpeed(81), ARRIVAL_NATURAL_SPEED);
  assert.equal(targetPlaybackSpeed(87), ARRIVAL_NATURAL_SPEED);
  assert.equal(targetPlaybackSpeed(91), ARRIVAL_NATURAL_SPEED);
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
    [0, 11.9, 12, 24.9, 25, 32.9, 33, 42.9, 43, 53.9, 54, 75, 90].map(creationProgramAt),
    [0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 5]
  );
  assert.equal(CREATION_PROGRAMS, 6);
});

test('no automatic playback: timeline stays at first frame until the visitor scrolls, while ambient motion ticks', () => {
  Object.assign(creation, { active: true, ready: true, paused: false, held: false, time: 0, target: 0, rate: 0, state: 'PAUSED', ambient: 0 });
  for (let i = 0; i < 120; i++) advanceCreation(1 / 60);
  assert.equal(creation.time, 0, 'timeline does not advance automatically');
  assert.equal(creationProgress(), 0);
  assert.ok(creation.ambient > 0.5, 'subtle ambient motion still advances at rest');
  Object.assign(creation, { active: false });
});

test('one downward scroll gesture triggers complete animation forward; repeated scrolling does not change speed', () => {
  let wokenValue = 0;
  Object.assign(creation, {
    active: true,
    ready: true,
    paused: false,
    held: false,
    state: 'PAUSED',
    time: 0,
    target: 0,
    rate: 0,
    ambient: 0,
    onHero: w => { wokenValue = w; }
  });

  // At start, intro is paused on first frame
  advanceCreation(0.1);
  assert.equal(creation.time, 0, 'remains paused on first frame until gesture');

  // ONE downward gesture triggers playback
  triggerCreationGesture(1, 'wheel');
  assert.equal(creation.state, 'PLAYING_FORWARD');
  assert.equal(creation.target, CREATION_DURATION);

  // Advance 1 second: rate ramps up toward accelerated speed (~3.6)
  for (let i = 0; i < 60; i++) advanceCreation(1 / 60);
  const timeAfterOneSec = creation.time;
  assert.ok(timeAfterOneSec > 2.8 && timeAfterOneSec < 3.8, `expected ~3.3 units after 1s, got ${timeAfterOneSec}`);

  // Repeated downward scrolling 10 times in a row MUST NOT accelerate, restart, or skip
  for (let i = 0; i < 10; i++) triggerCreationGesture(1, 'wheel');
  for (let i = 0; i < 60; i++) advanceCreation(1 / 60);
  const timeAfterTwoSec = creation.time;
  const deltaSec2 = timeAfterTwoSec - timeAfterOneSec;
  // Speed during second second should match COSMIC_ACCELERATED_SPEED (~3.6 units/sec)
  assert.ok(Math.abs(deltaSec2 - COSMIC_ACCELERATED_SPEED) < 0.15, `expected accelerated progression rate ${COSMIC_ACCELERATED_SPEED}, got ${deltaSec2}`);

  Object.assign(creation, { active: false, onHero: null });
});

test('peninsula approach and CV arrival run strictly at 1.0x natural cinematic speed', () => {
  Object.assign(creation, {
    active: true,
    ready: true,
    paused: false,
    held: false,
    state: 'PLAYING_FORWARD',
    time: 62.0, // During Earth / Peninsula approach
    target: CREATION_DURATION,
    rate: ARRIVAL_NATURAL_SPEED,
    ambient: 0
  });

  // Advance 1 full second (60 frames at 60fps)
  for (let i = 0; i < 60; i++) advanceCreation(1 / 60);
  const deltaSec = creation.time - 62.0;
  assert.ok(Math.abs(deltaSec - 1.0) < 0.05, `expected strictly 1.0s delta during peninsula approach, got ${deltaSec}`);

  // Additional downward scrolls do not accelerate it
  for (let i = 0; i < 10; i++) triggerCreationGesture(1, 'wheel');
  for (let i = 0; i < 60; i++) advanceCreation(1 / 60);
  const deltaSec2 = creation.time - (62.0 + deltaSec);
  assert.ok(Math.abs(deltaSec2 - 1.0) < 0.05, `expected strictly 1.0s delta despite repeated scrolls, got ${deltaSec2}`);

  Object.assign(creation, { active: false });
});

test('scrolling upward reverses animation smoothly from current position; scrolling downward resumes forward', () => {
  let wokenValue = 0;
  Object.assign(creation, {
    active: true,
    ready: true,
    paused: false,
    held: false,
    state: 'PLAYING_FORWARD',
    time: 65.0,
    target: CREATION_DURATION,
    rate: ARRIVAL_NATURAL_SPEED,
    ambient: 0,
    onHero: w => { wokenValue = w; }
  });

  // Scrolling upward switches immediately to PLAYING_REVERSE from current position
  triggerCreationGesture(-1, 'wheel');
  assert.equal(creation.state, 'PLAYING_REVERSE');
  assert.equal(creation.target, 0);

  // Reverses smoothly
  for (let i = 0; i < 60; i++) advanceCreation(1 / 60);
  assert.ok(creation.time < 65.0, 'time decreases smoothly in reverse');
  const timeWhileReversing = creation.time;

  // Multiple repeated upward scrolls do not accelerate reverse playback
  for (let i = 0; i < 5; i++) triggerCreationGesture(-1, 'wheel');
  for (let i = 0; i < 60; i++) advanceCreation(1 / 60);
  const deltaRev = timeWhileReversing - creation.time;
  assert.ok(Math.abs(deltaRev - ARRIVAL_NATURAL_SPEED) < 0.15, `expected fixed reverse rate ${ARRIVAL_NATURAL_SPEED} in arrival zone, got ${deltaRev}`);

  // Scrolling downward again resumes forward from current position without restarting
  const resumeFrom = creation.time;
  triggerCreationGesture(1, 'wheel');
  assert.equal(creation.state, 'PLAYING_FORWARD');
  for (let i = 0; i < 60; i++) advanceCreation(1 / 60);
  assert.ok(creation.time > resumeFrom, 'resumed forward from current position');

  Object.assign(creation, { active: false, onHero: null });
});

test('reversing all the way to start settles in paused state on first frame; completing forward hands off naturally', () => {
  Object.assign(creation, {
    active: true,
    ready: true,
    paused: false,
    held: false,
    state: 'PLAYING_REVERSE',
    time: 0.8,
    target: 0,
    rate: -COSMIC_ACCELERATED_SPEED,
    ambient: 0
  });

  // Reverse runs into 0
  for (let i = 0; i < 60; i++) advanceCreation(1 / 60);
  assert.equal(creation.time, 0, 'settles at 0');
  assert.equal(creation.state, 'PAUSED', 'switches to PAUSED state');
  assert.equal(creation.rate, 0);

  // Test completing forward at 91s
  let woken = 0;
  Object.assign(creation, {
    active: true,
    ready: true,
    paused: false,
    held: false,
    state: 'PLAYING_FORWARD',
    time: 90.5,
    target: CREATION_DURATION,
    rate: ARRIVAL_NATURAL_SPEED,
    ambient: 0,
    onHero: w => { woken = w; }
  });
  for (let i = 0; i < 60; i++) advanceCreation(1 / 60);
  assert.equal(creation.active, false, 'intro completed');
  assert.equal(creation.state, 'COMPLETED');
  assert.equal(creation.time, CREATION_DURATION);
  assert.equal(woken, 1, 'hero wake fully completed at 100%');

  // Test re-entering in reverse at top of page
  reopenCreationInReverse();
  assert.equal(creation.active, true, 'reopened in reverse');
  assert.equal(creation.state, 'PLAYING_REVERSE');
  assert.equal(creation.time, CREATION_DURATION);
  assert.equal(creation.target, 0);

  Object.assign(creation, { active: false, onHero: null });
});

test('a transition still compiling holds forward progress without blocking reverse scrubbing', () => {
  Object.assign(creation, { active: true, ready: true, paused: false, held: true, state: 'PLAYING_FORWARD', time: 14.4, target: CREATION_DURATION, rate: COSMIC_ACCELERATED_SPEED });
  advanceCreation(0.05);
  assert.ok(Math.abs(creation.time - 14.4) < 0.05, 'holds forward progress at uncompiled seam');
  // Reverse scrubbing still works while held
  triggerCreationGesture(-1, 'wheel');
  assert.equal(creation.state, 'PLAYING_REVERSE');
  advanceCreation(0.05);
  advanceCreation(0.05);
  assert.ok(creation.time < 14.4, 'reverse playback is never trapped by held state');
  creation.held = false;
  triggerCreationGesture(1, 'wheel');
  advanceCreation(0.05);
  advanceCreation(0.05);
  advanceCreation(0.05);
  assert.ok(creation.time > 14.2);
  Object.assign(creation, { active: false });
});

test('each whale arrives along its own heading: the head leads, never the tail', () => {
  for (const forward of [[-1, 0, 0], [1, 0, 0], [0.9, 0.1, -0.42], [-0.8, -0.2, 0.56]]) for (let whale = 0; whale < 2; whale++) {
    const a = arrivalOffset(82, whale, forward), b = arrivalOffset(85, whale, forward);
    const travel = [b[0] - a[0], b[1] - a[1], b[2] - a[2]];
    assert.ok(travel[0] * forward[0] + travel[1] * forward[1] + travel[2] * forward[2] > 0);
  }
});

test('the whales hold off until the water has passed the camera', () => {
  assert.ok(WHALES_ARRIVE_AT >= CREATION_STAGES.find(s => s[0] === 'OCEAN_ENTRY')[1] + 3.0);
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
