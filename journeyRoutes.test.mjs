import test from 'node:test';
import assert from 'node:assert/strict';
import {
  CREATION_DURATION,
  DIRECT_START,
  HERO_WAKES_AT,
  PASSAGE_END,
  PASSAGE_PROGRAM,
  PASSAGE_RESUME,
  JOURNEY_ROUTES,
  advanceCreation,
  atJourneyStart,
  clockAtScene,
  creation,
  creationLookahead,
  creationProgramAt,
  creationStage,
  finishCreation,
  journeyLength,
  journeyProgramAt,
  journeyPrograms,
  journeyStage,
  reopenCreationInReverse,
  sceneAtClock,
  seekCreation,
  setCreationJourney,
  triggerCreationGesture
} from './creationTimeline.ts';

const reset = journey => {
  Object.assign(creation, { active: true, ready: true, paused: false, held: false, state: 'PAUSED', time: 0, target: 0, rate: 0, ambient: 0, reason: '', onHero: null, journey: null, choosing: false });
  if (journey) setCreationJourney(journey);
};

/** Plays a journey at 60 fps from its first frame, recording what it shows and when. */
function play(journey) {
  reset(journey);
  triggerCreationGesture(1, 'wheel');
  const stages = [], programs = new Set(), times = [];
  let seconds = 0;
  while (creation.active && seconds < 120) {
    advanceCreation(1 / 60);
    seconds += 1 / 60;
    const stage = journeyStage(creation.time);
    if (stages[stages.length - 1] !== stage) stages.push(stage);
    programs.add(journeyProgramAt(creation.time));
    times.push(creation.time);
  }
  return { stages, programs, times, seconds };
}

test('the Odyssey is the original clock: its route is the identity on 0..91', () => {
  for (const t of [0, 0.5, 11.99, 12, 43.2, 54, 60, 81, 87.5, 91]) {
    assert.equal(sceneAtClock(t, JOURNEY_ROUTES.odyssey), t);
    assert.equal(clockAtScene(t, JOURNEY_ROUTES.odyssey), t);
    assert.equal(journeyProgramAt(t, JOURNEY_ROUTES.odyssey), creationProgramAt(t));
    assert.equal(journeyStage(t, JOURNEY_ROUTES.odyssey), creationStage(t));
  }
  assert.equal(journeyLength(JOURNEY_ROUTES.odyssey), CREATION_DURATION);
});

test('no journey chosen plays the Odyssey route', () => {
  reset(null);
  assert.equal(journeyLength(), CREATION_DURATION);
  assert.deepEqual(journeyPrograms(), ['eye', 0, 1, 2, 3, 4, 5]);
  creation.active = false;
});

test('Direct: Earth -> ocean -> hero, nothing of the cosmos', () => {
  const run = play('direct');
  assert.deepEqual(run.stages, ['EARTH_APPROACH', 'ATMOSPHERIC_DESCENT', 'OCEAN_ENTRY', 'WHALE_HANDOFF', 'COMPLETE']);
  assert.deepEqual([...run.programs], [5]);
  assert.ok(run.times.every(t => t >= DIRECT_START), 'never before the Earth');
  assert.equal(creation.reason, 'complete');
});

test('The Passage: eye -> star tunnel -> Earth -> ocean -> hero, skipping the intermediate worlds', () => {
  const run = play('passage');
  assert.deepEqual(run.stages, ['EYE', 'STAR_TUNNEL', 'EARTH_APPROACH', 'ATMOSPHERIC_DESCENT', 'OCEAN_ENTRY', 'WHALE_HANDOFF', 'COMPLETE']);
  assert.deepEqual([...run.programs], [PASSAGE_PROGRAM, 5]);
  assert.ok(run.times.every(t => t <= PASSAGE_END || t >= PASSAGE_RESUME), 'no Creation, Big Bang, galaxy, black hole or space exit');
  // One continuous playhead: the seam is a single frame step, never a pause
  const seam = run.times.findIndex(t => t >= PASSAGE_RESUME);
  assert.ok(run.times[seam - 1] > PASSAGE_END - 0.1 && run.times[seam] < PASSAGE_RESUME + 0.1);
});

test('The Odyssey still visits every original stage in order', () => {
  const run = play('odyssey');
  assert.deepEqual(run.stages, ['EYE', 'CREATION', 'BIG_BANG', 'GALAXY', 'BLACK_HOLE', 'SPACE_EXIT', 'EARTH_APPROACH', 'ATMOSPHERIC_DESCENT', 'OCEAN_ENTRY', 'WHALE_HANDOFF', 'COMPLETE']);
  assert.deepEqual([...run.programs], [0, 1, 2, 3, 4, 5]);
});

test('Direct is the shortest, the Passage between, the Odyssey the full length', () => {
  const [direct, passage, odyssey] = ['direct', 'passage', 'odyssey'].map(j => play(j).seconds);
  assert.ok(direct < passage && passage < odyssey, `${direct} ${passage} ${odyssey}`);
  assert.ok(direct > 9 && direct < 16, `Direct still a cinematic journey, ${direct}s`);
  assert.ok(passage > 15 && passage < 22, `Passage ${passage}s`);
  assert.ok(odyssey > 27 && odyssey < 33, `Odyssey unchanged ~30s, ${odyssey}s`);
});

test('every journey: fast through Earth and ocean, natural speed only for the hero', () => {
  for (const journey of ['direct', 'passage', 'odyssey']) {
    reset(journey);
    seekCreation(70);
    triggerCreationGesture(1, 'wheel');
    for (let i = 0; i < 30; i++) advanceCreation(1 / 60);
    const before = creation.time;
    for (let i = 0; i < 30; i++) advanceCreation(1 / 60);
    assert.ok(Math.abs((creation.time - before) * 2 - 3.5) < 0.1, `${journey} descent fast`);
    seekCreation(HERO_WAKES_AT + 0.5);
    triggerCreationGesture(1, 'wheel');
    for (let i = 0; i < 30; i++) advanceCreation(1 / 60);
    const hero = creation.time;
    for (let i = 0; i < 60; i++) advanceCreation(1 / 60);
    assert.ok(Math.abs(creation.time - hero - 1) < 0.05, `${journey} hero at 1.0x`);
  }
  creation.active = false;
});

test('reversing walks the route backwards and rests on its own first frame', () => {
  for (const [journey, start] of [['direct', DIRECT_START], ['passage', 0], ['odyssey', 0]]) {
    reset(journey);
    seekCreation(84);
    triggerCreationGesture(-1, 'wheel');
    const seen = new Set();
    for (let i = 0; i < 60 * 40 && creation.state !== 'PAUSED'; i++) {
      advanceCreation(1 / 60);
      seen.add(journeyStage(creation.time));
      if (journey !== 'odyssey') assert.ok(JOURNEY_ROUTES[journey].segments.some(g => creation.time >= g.from && creation.time <= g.to), `${journey} left its route at ${creation.time}`);
    }
    assert.equal(creation.state, 'PAUSED');
    assert.equal(creation.time, start);
    assert.equal(atJourneyStart(), true, `${journey}: scroll-once cue back on the first frame`);
    if (journey === 'passage') assert.deepEqual([...seen].filter(s => ['CREATION', 'BIG_BANG', 'GALAXY', 'BLACK_HOLE', 'SPACE_EXIT'].includes(s)), []);
    // A further upward gesture at the start does nothing
    triggerCreationGesture(-1, 'wheel');
    assert.equal(creation.state, 'PAUSED');
  }
  creation.active = false;
});

test('the scroll-once cue sits on each journey\'s own first frame', () => {
  reset('direct');
  assert.equal(creation.time, DIRECT_START);
  assert.equal(atJourneyStart(), true);
  triggerCreationGesture(1, 'wheel');
  assert.equal(atJourneyStart(), false);
  seekCreation(0);
  assert.equal(creation.time, DIRECT_START, 'Home lands on Direct\'s first frame, not the eye');
  assert.equal(atJourneyStart(), true);
  creation.active = false;
});

test('Skip intro stays reversible into the chosen journey', () => {
  reset('passage');
  triggerCreationGesture(1, 'wheel');
  for (let i = 0; i < 60; i++) advanceCreation(1 / 60);
  finishCreation('skip');
  assert.equal(creation.active, false);
  reopenCreationInReverse();
  assert.equal(creation.journey, 'passage');
  assert.equal(creation.state, 'PLAYING_REVERSE');
  for (let i = 0; i < 60 * 30 && creation.state !== 'PAUSED'; i++) {
    advanceCreation(1 / 60);
    assert.ok(creation.time <= PASSAGE_END || creation.time >= PASSAGE_RESUME);
  }
  assert.equal(creation.time, 0);
  creation.active = false;
});

test('the compiling-ahead check looks across the Passage seam, both ways', () => {
  reset('passage');
  creation.time = PASSAGE_END - 0.04;
  creation.target = CREATION_DURATION;
  assert.ok(Math.abs(creationLookahead(0.08) - (PASSAGE_RESUME + 0.04)) < 1e-9);
  creation.time = PASSAGE_RESUME + 0.04;
  creation.target = 0;
  assert.ok(Math.abs(creationLookahead(0.08) - (PASSAGE_END - 0.04)) < 1e-9);
  creation.active = false;
});

test('the renderer compiles only what the chosen journey draws', () => {
  reset(null);
  creation.choosing = true;
  assert.deepEqual(journeyPrograms().slice(0, 3), ['eye', PASSAGE_PROGRAM, 5]);
  setCreationJourney('direct');
  assert.deepEqual(journeyPrograms(), [5]);
  setCreationJourney('passage');
  assert.deepEqual(journeyPrograms(), ['eye', PASSAGE_PROGRAM, 5]);
  creation.active = false;
});
