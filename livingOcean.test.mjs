import test from 'node:test';
import assert from 'node:assert/strict';
import { OCEAN_EFFECTS, OCEAN_EFFECT_DEFAULTS, parseOceanEffects } from './oceanExperiments.ts';
import { WATER_INERTIA, newWaterInertia, stepWaterInertia, waterLag, waterSettling } from './waterInertia.ts';
import { SEA_MAX_EDGES, SEA_MAX_STATES, SEA_OPEN, SEA_STATES, layoutSea, packSea, seaAt } from './seaState.ts';
import { SNOW_LIMIT, WAKE, WAKE_BODIES, bodyFlow, driftSnow, newWakeTracker, trackWake, wakeFlowAt } from './oceanWake.ts';
import { CV_SECTIONS } from './sections.ts';

// --- The switches ---------------------------------------------------------------------------

test('the shipped ocean preserves inertia and whale wakes without global stroke bands or sea changes', () => {
  assert.deepEqual(OCEAN_EFFECT_DEFAULTS, { inertia: true, flow: false, wake: true, sea: false });
  for (const search of ['', '?other=1', '?ocean=', '?ocean=nonsense', '?ocean=nonsense,stuff']) {
    assert.deepEqual(parseOceanEffects(search), OCEAN_EFFECT_DEFAULTS);
  }
});

test('each behaviour can be compared alone, together, or taken out, from the address bar', () => {
  const none = { inertia: false, flow: false, wake: false, sea: false };
  for (const word of ['none', 'original', 'off', 'ORIGINAL']) assert.deepEqual(parseOceanEffects(`?ocean=${word}`), none);
  assert.deepEqual(parseOceanEffects('?ocean=all', none), { inertia: true, flow: true, wake: true, sea: true });
  for (const effect of OCEAN_EFFECTS) assert.deepEqual(parseOceanEffects(`?ocean=${effect}`), { ...none, [effect]: true });
  assert.deepEqual(parseOceanEffects('?ocean=inertia,flow'), { ...none, inertia: true, flow: true });
  // A typo beside a real name does not disturb the real name
  assert.deepEqual(parseOceanEffects('?ocean=flow,wak'), { ...none, flow: true });
  // Signed entries adjust whatever ships
  assert.deepEqual(parseOceanEffects('?ocean=-wake'), { ...OCEAN_EFFECT_DEFAULTS, wake: false });
  assert.deepEqual(parseOceanEffects('?ocean=-wake,-sea'), { ...OCEAN_EFFECT_DEFAULTS, wake: false, sea: false });
  assert.deepEqual(parseOceanEffects('?ocean=%2Bsea', none), { ...none, sea: true });
  assert.deepEqual(parseOceanEffects('?ocean=-wake', none), none);
});

// --- Water inertia --------------------------------------------------------------------------

/** Scroll at `speed` px/s for `seconds`, stop dead, and record the water's offset every frame. */
const stopFrom = (speed, seconds = 0.8, fps = 60, after = 2.5) => {
  const state = newWaterInertia();
  const dt = 1 / fps;
  let scroll = 1000;
  const during = [];
  const settle = [];
  stepWaterInertia(state, scroll, dt, 900);
  for (let i = 0; i < seconds * fps; i++) { scroll += speed * dt; during.push(stepWaterInertia(state, scroll, dt, 900)); }
  for (let i = 0; i < after * fps; i++) settle.push(stepWaterInertia(state, scroll, dt, 900));
  return { state, during, settle };
};

test('a steady scroll holds the water a steady way behind the page: it moves exactly as fast, so no parallax', () => {
  for (const speed of [300, 1200, 3000, -1500]) {
    const { during } = stopFrom(speed, 2.5);
    const late = during.slice(-30);
    assert.ok(Math.max(...late) - Math.min(...late) < 0.15, `${speed}: still drifting by ${Math.max(...late) - Math.min(...late)}`);
    assert.ok(Math.abs(late.at(-1) + waterLag(speed)) < 0.1, `${speed}: ${late.at(-1)} against ${-waterLag(speed)}`);
    assert.equal(Math.sign(late.at(-1)), -Math.sign(speed), 'behind the travel');
  }
});

test('when the page stops the water carries on the same way until it has caught up, and never runs past', () => {
  for (const speed of [600, 1500, 3000]) {
    const { state, during, settle } = stopFrom(speed, 2);
    const behind = -during.at(-1);
    // Enough to be seen: tens of pixels of glyphs still travelling after the copy has stopped
    assert.ok(behind > (speed >= 1500 ? 40 : 20) && behind <= WATER_INERTIA.limit, `${speed}: ${behind} px behind`);
    // One movement, one direction: every frame closer to the page, never beyond it
    for (let i = 1; i < settle.length; i++) assert.ok(settle[i] >= settle[i - 1] - 1e-9, `${speed}: turns back at frame ${i}`);
    assert.ok(Math.max(...settle) <= 0, `${speed}: runs past by ${Math.max(...settle)}`);
    // Still under way a third of a second after the stop, home within a second and a half
    assert.ok(-settle[Math.round(60 * 0.33)] > behind * 0.25, `${speed}: already home at 0.33 s`);
    assert.ok(Math.abs(settle[Math.round(60 * 1.5)]) < 1, `${speed}: ${settle[Math.round(60 * 1.5)]} at 1.5 s`);
    assert.equal(settle.at(-1), 0);
    assert.equal(waterSettling(state), false);
  }
  const up = stopFrom(-1500, 2);
  assert.ok(up.during.at(-1) > 40 && Math.min(...up.settle) >= 0, 'scrolling up, the water carries on upward');
});

test('a faster scroll leaves the water further behind, but never past the limit', () => {
  const behind = [400, 1200, 3000, 12000, 24000].map((speed) => -stopFrom(speed).during.at(-1));
  for (let i = 1; i < behind.length; i++) assert.ok(behind[i] >= behind[i - 1]);
  assert.ok(behind.at(-1) <= WATER_INERTIA.limit);
  assert.ok(waterLag(1e9) <= WATER_INERTIA.limit && waterLag(-1e9) >= -WATER_INERTIA.limit);
});

test('the water has no sudden starts of its own: setting off and stopping are both eased', () => {
  const { during, settle } = stopFrom(1500, 1.2);
  // The largest change of the water's offset in one frame, as a speed, is far below the page's own
  const steps = [...during, ...settle].map((v, i, all) => (i ? Math.abs(v - all[i - 1]) * 60 : 0));
  assert.ok(Math.max(...steps) < 420, `the water jumps at ${Math.max(...steps)} px/s`);
  // Speeding up and slowing down are treated alike: at a reading pace a start mirrors a stop
  // (a fast scroll nears the limit, which is approached softly and left as softly)
  const slow = stopFrom(300, 2.5);
  const start = slow.during.slice(0, 60).map((v) => -v);
  const stop = slow.settle.slice(0, 60).map((v) => -slow.during.at(-1) + v);
  for (let i = 0; i < 60; i++) assert.ok(Math.abs(start[i] - stop[i]) < 0.6, `frame ${i}: ${start[i]} against ${stop[i]}`);
});

test('uneven frames do not push the water: a steady scroll stays a steady scroll', () => {
  // The same steady 1500 px/s, sampled on frames of 8 to 28 ms as a busy page delivers them
  const state = newWaterInertia();
  let seed = 7;
  const random = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
  let t = 0;
  stepWaterInertia(state, 0, 1 / 60, 900);
  const leads = [];
  for (let i = 0; i < 500; i++) {
    const dt = 0.008 + random() * 0.02;
    t += dt;
    const lead = stepWaterInertia(state, t * 1500, dt, 900);
    if (t > 2.5) leads.push(lead);
  }
  const mean = leads.reduce((a, b) => a + b, 0) / leads.length;
  assert.ok(Math.abs(mean + waterLag(1500)) < 0.3, `mean ${mean}`);
  assert.ok(Math.max(...leads.map((v) => Math.abs(v - mean))) < 0.5, `wanders ${Math.max(...leads.map((v) => Math.abs(v - mean)))}`);
});

test('a jump is not a scroll, and the same motion gives the same water at any frame rate', () => {
  const state = newWaterInertia();
  stepWaterInertia(state, 0, 1 / 60, 900);
  assert.equal(stepWaterInertia(state, 5000, 1 / 60, 900), 0);
  assert.equal(waterSettling(state), false);
  const at = (fps) => { const run = stopFrom(1500, 0.8, fps); return [run.during.at(-1), run.settle[Math.round(fps * 0.4)]]; };
  const a = at(60), b = at(120), c = at(30);
  assert.ok(Math.abs(a[0] - b[0]) < 1 && Math.abs(a[0] - c[0]) < 1.5, `${a[0]} ${b[0]} ${c[0]}`);
  assert.ok(Math.abs(a[1] - b[1]) < 1.5 && Math.abs(a[1] - c[1]) < 3, `${a[1]} ${b[1]} ${c[1]}`);
  // A frozen frame (dt 0) or a missing scroll changes nothing
  assert.equal(stepWaterInertia(state, 5000, 0, 900), 0);
  assert.equal(stepWaterInertia(state, NaN, 1 / 60, 900), 0);
});

// --- Sea states -----------------------------------------------------------------------------

const PAGE = [
  { id: 'home', top: 0 }, { id: 'introduction', top: 8100 }, { id: 'experience', top: 8866 }, { id: 'skills', top: 9570 },
  { id: 'education', top: 10089 }, { id: 'languages', top: 10839 }, { id: 'interests', top: 11701 }, { id: 'contact', top: 12368 }
];

test('every section after the profile has its own sea, and nothing above it changes', () => {
  const ids = CV_SECTIONS.map((s) => s.id).filter((id) => id !== 'introduction');
  assert.deepEqual(Object.keys(SEA_STATES), ids);
  const sea = layoutSea(PAGE, 900);
  assert.equal(sea.states.length, 7);
  assert.equal(sea.states[0], SEA_OPEN);
  assert.ok(sea.states.length <= SEA_MAX_STATES && sea.edges.length <= SEA_MAX_EDGES);
  // The cover, the Globe's journey and the profile lie wholly in the ocean as it was
  for (const y of [0, 2700, 5000, 8100, 8400]) assert.deepEqual(seaAt(sea, y), { from: 0, to: 1, mix: 0 });
});

test('states meet over a wide stretch of water, never at a line, and never two meetings at once', () => {
  for (const viewport of [900, 844, 740, 1024]) {
    const sea = layoutSea(PAGE, viewport);
    for (let i = 0; i < sea.edges.length; i++) {
      assert.ok(sea.edges[i].half >= 150, `a meeting ${sea.edges[i].half * 2}px long`);
      if (i > 0) assert.ok(sea.edges[i].at - sea.edges[i].half > sea.edges[i - 1].at + sea.edges[i - 1].half, 'meetings do not overlap');
    }
    // Walking down the page the blend is continuous and each section's heart is wholly its own
    let last = null;
    for (let y = 8000; y < 13000; y += 4) {
      const here = seaAt(sea, y);
      const value = here.from + here.mix;
      if (last !== null) assert.ok(Math.abs(value - last) < 0.02, `a step at ${y}`);
      last = value;
    }
    assert.deepEqual(seaAt(sea, 12368 + 400), { from: 5, to: 6, mix: 1 });
  }
});

test('the shader takes every state and puts missing meetings out of reach', () => {
  const sea = layoutSea(PAGE.slice(0, 4), 900);
  const packed = packSea(sea, 1.5);
  assert.equal(packed.count, 2);
  assert.equal(packed.a.length, SEA_MAX_STATES * 4);
  assert.equal(packed.edges[0], 8866 * 1.5);
  assert.ok(packed.edges[2 * 2] > 1e8);
  // No sections at all: the open water everywhere
  assert.deepEqual(seaAt(layoutSea([], 900), 5000), { from: 0, to: 0, mix: 0 });
  assert.equal(Math.fround(packSea(layoutSea([], 900), 1).a[3]), Math.fround(SEA_OPEN.ripple));
});

test('sea states stay within what reads as water', () => {
  for (const [id, s] of Object.entries(SEA_STATES)) {
    assert.ok(s.grain >= 0.5 && s.grain <= 1.6, id);
    assert.ok(s.reach >= 0.6 && s.reach <= 2.4, id);
    assert.ok(s.pace > 0 && s.pace <= 1.7, id);
    assert.ok(s.ripple >= 0.1 && s.ripple <= 0.45, id);
    assert.ok(s.set >= 0.6, id);
  }
  assert.ok(SEA_STATES.contact.pace < 0.2, 'contact is nearly still');
  assert.ok(SEA_STATES.skills.pace > SEA_STATES.education.pace * 2, 'skills moves, education rolls');
  assert.ok(SEA_STATES.languages.cross > 0 && Object.values(SEA_STATES).filter((s) => s.cross > 0).length === 1);
});

test('each sea is told from its neighbours by how its lines of water move, not by a nuance', () => {
  const order = ['experience', 'skills', 'education', 'languages', 'interests', 'contact'];
  const seas = [SEA_OPEN, ...order.map((id) => SEA_STATES[id])];
  for (const s of seas) {
    assert.ok(s.run >= 0.4 && s.run <= 3, 'a line is between a short dash and most of a screen');
    assert.ok(s.lanes >= 0.5 && s.lanes <= 1.5);
    assert.ok(s.speed > 0 && s.speed <= 2);
  }
  // Walking down the page, each section's lines differ from the last one's by a good margin in
  // at least one of: their length, their speed, or the water turning (set, crossing)
  for (let i = 1; i < seas.length; i++) {
    const a = seas[i - 1], b = seas[i];
    const ratio = (x, y) => Math.max(x, y) / Math.min(x, y);
    const apart = Math.max(ratio(a.run, b.run), ratio(a.speed, b.speed), ratio(a.set, b.set), a.cross !== b.cross ? 2 : 1);
    assert.ok(apart >= 1.6, `${order[i - 1] ?? 'open'}: only ${apart} apart from the water above`);
  }
  assert.ok(SEA_STATES.skills.speed > SEA_STATES.education.speed * 3, 'skills is quick, education rolls');
  assert.ok(SEA_STATES.skills.run < SEA_STATES.experience.run / 2.5, 'skills is choppy, experience runs long');
  assert.ok(SEA_STATES.contact.speed < 0.1, 'contact barely moves');
  assert.ok(SEA_STATES.interests.set < 1, 'in interests the lines turn with the eddies');
  const packed = packSea(layoutSea(PAGE, 900), 1);
  assert.equal(packed.c.length, SEA_MAX_STATES * 4);
  assert.equal(Math.fround(packed.c[4]), Math.fround(SEA_STATES.experience.run));
  assert.equal(Math.fround(packed.c[4 + 2]), Math.fround(SEA_STATES.experience.speed));
});

// --- Wake -----------------------------------------------------------------------------------

/** A straight whale 960 px long, snout at `x`, heading along (dx, dy). */
const spine = (x, y, dx = 1, dy = 0) => {
  const s = new Float32Array(96);
  for (let n = 0; n < 48; n++) { s[n * 2] = x - dx * n * 20; s[n * 2 + 1] = y - dy * n * 20; }
  return s;
};

test('a swimming whale becomes four bodies along its spine, heading snout first', () => {
  const tracker = newWakeTracker();
  const out = { bodies: Array.from({ length: WAKE_BODIES }, () => ({ x: 0, y: 0, r: 1, ux: 0, uy: 0, strength: 0, churn: 0, spread: 1, wash: false, bow: 0, flank: 0 })), count: 0 };
  trackWake(tracker, [spine(1000, 400)], 1, 0, 1 / 30, 900, out);
  assert.equal(out.count, 0, 'no speed is known on the first step');
  trackWake(tracker, [spine(1004, 400)], 1, 0, 1 / 30, 900, out);
  assert.equal(out.count, 4);
  for (let i = 0; i < 4; i++) {
    const b = out.bodies[i];
    assert.ok(Math.abs(b.ux - 1) < 1e-6 && Math.abs(b.uy) < 1e-6);
    assert.ok(b.strength > 0.85, `an eighth of its length a second is a brisk whale: ${b.strength}`);
    assert.ok(b.r > 30 && b.r < 130);
  }
  assert.ok(out.bodies[1].r > out.bodies[0].r && out.bodies[1].r > out.bodies[3].r, 'the girth is widest behind the flippers');
  // The head and the girth part the water (a crescent off the bow, bands along the flanks);
  // the tail stock and the flukes drive the animal and throw their water astern
  assert.deepEqual(out.bodies.slice(0, 4).map((b) => b.wash), [false, false, true, true]);
  assert.ok(out.bodies[0].bow > 0.1 && out.bodies[0].flank > 0.1 && out.bodies[1].flank > 0.1 && out.bodies[1].bow === 0);
  assert.ok(out.bodies[0].bow < out.bodies[3].churn / 2, "what the head sheds is slight beside the flukes' trail");
  assert.equal(out.bodies[0].churn, 0);
  assert.ok(out.bodies[3].churn > 0.8 && out.bodies[3].churn > out.bodies[2].churn, 'the flukes stir the water most');
});

test('a whale at its usual cruise already moves the water well: the wake does not wait for a sprint', () => {
  // On the page a whale covers about a twentieth of its length a second (measured: 30 to 55 px/s
  // for an animal 740 to 940 px long). The first wake was scaled for 0.12 lengths a second and
  // never rose above a third of its strength.
  const tracker = newWakeTracker();
  const out = { bodies: Array.from({ length: WAKE_BODIES }, () => ({ x: 0, y: 0, r: 1, ux: 0, uy: 0, strength: 0, churn: 0, spread: 1, wash: false, bow: 0, flank: 0 })), count: 0 };
  trackWake(tracker, [spine(1000, 400)], 1, 0, 1 / 30, 900, out);
  trackWake(tracker, [spine(1000 + 45 / 30, 400)], 1, 0, 1 / 30, 900, out);
  assert.equal(out.count, 4);
  assert.ok(out.bodies[1].strength > 0.5 && out.bodies[1].strength < 0.75, `${out.bodies[1].strength}`);
  // And a whale that barely drifts leaves the water nearly alone
  trackWake(tracker, [spine(1000 + 49 / 30, 400)], 1, 0, 1 / 30, 900, out);
  assert.ok(out.count === 0 || out.bodies[1].strength < 0.1);
});

test('scroll alone emits no wake; real projected travel determines its direction even while scrolling', () => {
  const tracker = newWakeTracker();
  const out = { bodies: Array.from({ length: WAKE_BODIES }, () => ({ x: 0, y: 0, r: 1, ux: 0, uy: 0, strength: 0, churn: 0, spread: 1, wash: false, bow: 0, flank: 0 })), count: 0 };
  trackWake(tracker, [spine(1000, 400)], 1, 5000, 1 / 30, 900, out);
  trackWake(tracker, [spine(1000, 400)], 1, 5000, 1 / 30, 900, out);
  assert.equal(out.count, 0, 'a still whale in still water leaves it alone');
  trackWake(tracker, [spine(1000, 400)], 1, 5040, 1 / 30, 900, out);
  assert.equal(out.count, 0, 'scroll is not animal motion');
  const swum = { bodies: out.bodies.map((b) => ({ ...b })), count: 0 };
  const other = newWakeTracker();
  trackWake(other, [spine(1000, 400)], 1, 0, 1 / 30, 900, swum);
  trackWake(other, [spine(1000, 440)], 1, 0, 1 / 30, 900, swum);
  assert.ok(swum.bodies[0].strength > 0.99);
  assert.equal(swum.bodies[0].ux, 0);
  assert.equal(swum.bodies[0].uy, 1, 'the projected path, not the horizontal body axis');
  trackWake(other, [spine(1000, 480)], 1, 40, 1 / 30, 900, swum);
  assert.ok(swum.bodies[3].churn > 0.8, 'scrolling does not switch off an actually swimming whale');
  // A whale that has been moved rather than swum (a link, a resize), or that is not there, moves nothing
  trackWake(tracker, [spine(1000, 400)], 1, 9000, 1 / 30, 900, out);
  assert.equal(out.count, 0);
  trackWake(tracker, [spine(1000, 400)], 1, 9040, 1 / 30, 900, out);
  assert.equal(out.count, 0);
  trackWake(tracker, [spine(1000, 400)], 0, 9080, 1 / 30, 900, out);
  assert.equal(out.count, 0);
  trackWake(tracker, [new Float32Array(96).fill(NaN)], 1, 9120, 1 / 30, 900, out);
  assert.equal(out.count, 0);
});

test('two whales fill the eight bodies and never more', () => {
  const tracker = newWakeTracker();
  const out = { bodies: Array.from({ length: WAKE_BODIES }, () => ({ x: 0, y: 0, r: 1, ux: 0, uy: 0, strength: 0, churn: 0, spread: 1, wash: false, bow: 0, flank: 0 })), count: 0 };
  const whales = (x) => [spine(1000 + x, 300), spine(600 - x, 700, -1, 0), spine(0, 0)];
  trackWake(tracker, whales(0), 1, 0, 1 / 30, 900, out);
  trackWake(tracker, whales(5), 1, 0, 1 / 30, 900, out);
  assert.equal(out.count, 8);
  assert.ok(out.bodies[4].ux < -0.99, 'the second whale swims the other way');
});

test('water at a body\'s surface moves with it, water around it is pushed on and flares, and far water is left alone', () => {
  const body = { x: 0, y: 0, r: 100, ux: 1, uy: 0, strength: 1, churn: 0 };
  const at = (dx, dy) => bodyFlow(body, dx, dy, [0, 0]);
  // The middle of the body is the animal, not water: nothing is drawn moving there
  assert.deepEqual(at(0, 0), [0, 0]);
  assert.ok(at(60, -40)[0] > 0.4 && at(60, -40)[0] < 0.6 && at(60, -40)[1] === 0);
  assert.deepEqual(at(80, 60), [1, 0]);
  // Ahead and astern on the axis the water is pushed on; abeam it hardly moves (what slips back
  // and what is drawn along nearly cancel)
  assert.ok(at(150, 0)[0] > 0.3 && Math.abs(at(150, 0)[1]) < 1e-9);
  assert.ok(at(-150, 0)[0] > 0.3);
  assert.ok(Math.abs(at(0, 150)[0]) < 0.1 && Math.abs(at(0, 150)[1]) < 1e-9);
  // Off the bow it flares outward, still mostly forward
  assert.ok(at(120, 120)[1] > 0.1 && at(120, 120)[0] > at(120, 120)[1]);
  // It falls with distance and is gone by `reach` radii, with no step on the way
  let last = 1;
  for (let d = 100; d <= 320; d += 5) {
    const m = Math.hypot(...at(d, 0));
    assert.ok(m <= last + 1e-9 && last - m < 0.16, `at ${d}: ${m} after ${last}`);
    last = m;
  }
  assert.deepEqual(at(WAKE.reach * 100, 0), [0, 0]);
  assert.deepEqual(at(0, -400), [0, 0]);
});

test('the flow at a point adds every body by its strength', () => {
  const wake = { count: 2, bodies: [
    { x: 0, y: 0, r: 100, ux: 1, uy: 0, strength: 0.5, churn: 0 },
    { x: 0, y: 0, r: 100, ux: 0, uy: 1, strength: 0.25, churn: 0 }
  ] };
  assert.deepEqual(wakeFlowAt(80, 60, [0, 0], wake), [0.5, 0.25]);
  assert.deepEqual(wakeFlowAt(80, 60, [0, 0], { count: 0, bodies: wake.bodies }), [0, 0]);
});

test('marine snow is carried by a wake, never far, and drifts home when the water is still', () => {
  const offset = [0, 0];
  for (let i = 0; i < 120; i++) driftSnow(offset, 1, 0, 1 / 60);
  assert.ok(offset[0] > 20 && offset[0] <= SNOW_LIMIT + 1e-9 && offset[1] === 0);
  for (let i = 0; i < 6000; i++) driftSnow(offset, 5, -5, 1 / 60);
  assert.ok(Math.hypot(...offset) <= SNOW_LIMIT + 1e-9);
  for (let i = 0; i < 60 * 12; i++) driftSnow(offset, 0, 0, 1 / 60);
  assert.ok(Math.hypot(...offset) < 0.3);
});
