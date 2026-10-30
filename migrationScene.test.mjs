import test from 'node:test';
import assert from 'node:assert/strict';
import {
  PLANET_R,
  TRAVEL,
  WHALES,
  cameraAt,
  earthToLane,
  headY,
  laneToEarth,
  latLonOf,
  migrationAt,
  oceanHit,
  project,
  projectEarth,
  projectLane,
  spinAt,
  spineAlongLane,
  stagesAt,
  strokeAt,
  swellAt,
  travelAt,
  wakeAt
} from './migrationScene.ts';

const VIEWPORTS = [
  { w: 1440, h: 900, whalePx: 522 },
  { w: 390, h: 844, whalePx: 226 },
  { w: 768, h: 1024, whalePx: 445 },
  { w: 1920, h: 1080, whalePx: 626 },
  { w: 2560, h: 1080, whalePx: 626 }
];
const samples = Array.from({ length: 401 }, (_, i) => i / 400);
const frame = (p, vp) => JSON.stringify({ cam: cameraAt(p, vp), spin: spinAt(p), stages: stagesAt(p), travel: travelAt(p) });

test('the swim: starts still, only moves forward, ends at its full distance', () => {
  assert.equal(travelAt(0), 0);
  assert.ok(Math.abs(travelAt(1) - TRAVEL) < 1e-9);
  let prev = travelAt(0);
  for (const p of samples.slice(1)) {
    const t = travelAt(p);
    assert.ok(t >= prev, `travel at ${p}`);
    prev = t;
  }
  // The long migration is the longest stretch of the journey
  assert.ok(travelAt(0.75) - travelAt(0.4) > 0.5 * TRAVEL);
});

test('same progress, same frame: scrolling back replays every frame exactly', () => {
  for (const vp of VIEWPORTS.slice(0, 2)) {
    const down = samples.map((p) => frame(p, vp));
    const up = [...samples].reverse().map((p) => frame(p, vp)).reverse();
    assert.deepEqual(down, up);
  }
});

test('route coordinates round-trip through the sphere', () => {
  const e = [0, 0, 0];
  const l = [0, 0];
  for (const [x, y] of [[0, 0], [0.8, 12], [-1.3, 40], [0.2, -3]]) {
    laneToEarth(x, y, 0, e);
    assert.ok(Math.abs(Math.hypot(...e) - PLANET_R) < 1e-9);
    earthToLane(e[0], e[1], e[2], l);
    assert.ok(Math.abs(l[0] - x) < 1e-9 && Math.abs(l[1] - y) < 1e-9);
  }
});

test('the whales really cross the planet: from the South Atlantic to the Indian Ocean', () => {
  const e = [0, 0, 0];
  const at = (p) => {
    const y = headY(0, travelAt(p));
    laneToEarth(WHALES[0].x(y), y, 0, e);
    return latLonOf(...e);
  };
  const start = at(0);
  const end = at(1);
  assert.ok(start.lon < -25 && start.lat < -15, `start ${JSON.stringify(start)}`);
  assert.ok(end.lon > 70 && end.lat < -15, `end ${JSON.stringify(end)}`);
  // South of the Cape mid-journey
  assert.ok(at(0.55).lat < -33);
});

test('the Earth turns with the migration: tied to the swim, reversible, about a third of a turn', () => {
  assert.equal(spinAt(0), 0);
  let prev = 0;
  for (const p of samples.slice(1)) {
    const s = spinAt(p);
    assert.ok(s <= prev + 1e-12, `spin reverses at ${p}`);
    prev = s;
  }
  const arc = (-spinAt(1) * 180) / Math.PI;
  assert.ok(arc > 90 && arc < 150, `arc ${arc}`);
  // The camera holds its meridian of the world while the planet turns beneath it
  const lon = (c) => Math.atan2(c.y, c.x);
  const vp = VIEWPORTS[0];
  const ref = lon(cameraAt(0, vp));
  for (const p of samples) assert.ok(Math.abs(lon(cameraAt(p, vp)) - ref) < 0.05, `camera drifts in longitude at ${p}`);
});

test('one coherent frame: the world view and the Earth view of a whale agree', () => {
  const e = [0, 0, 0];
  for (const p of [0.2, 0.5, 0.8]) {
    const cam = cameraAt(p, VIEWPORTS[0]);
    const y = headY(0, travelAt(p));
    laneToEarth(WHALES[0].x(y), y, -0.12, e);
    const c = Math.cos(cam.spin);
    const s = Math.sin(cam.spin);
    const a = project(cam, e[0] * c - e[1] * s, e[0] * s + e[1] * c, e[2], {});
    const b = projectEarth(cam, e[0], e[1], e[2], {});
    assert.ok(Math.abs(a.x - b.x) < 1e-6 && Math.abs(a.y - b.y) < 1e-6);
  }
});

test('whales remain submerged, keep their body length and swim in distinct lanes', () => {
  const xs = new Float64Array(64);
  const ys = new Float64Array(64);
  const zs = new Float64Array(64);
  for (const p of samples) {
    const travel = travelAt(p);
    const heads = [];
    for (let i = 0; i < 2; i++) {
      spineAlongLane(i, headY(i, travel), 64, xs, ys, zs);
      let len = 0;
      for (let k = 1; k < 64; k++) len += Math.hypot(xs[k] - xs[k - 1], ys[k] - ys[k - 1]);
      assert.ok(Math.abs(len - WHALES[i].length) < 0.01 * WHALES[i].length, `length of whale ${i} at ${p}`);
      heads.push([xs[0], ys[0]]);
      assert.ok(zs.every((z) => z < 0), `whale ${i} leaves the water at ${p}`);
    }
    assert.ok(Math.hypot(heads[0][0] - heads[1][0], heads[0][1] - heads[1][1]) > 0.3, `whales merge at ${p}`);
  }
});

test('only ocean in frame: every edge ray meets the water well inside the rim, never a horizon', () => {
  const out = [0, 0, 0];
  for (const vp of VIEWPORTS) {
    for (const p of samples) {
      const cam = cameraAt(p, vp);
      for (let i = 0; i <= 8; i++) {
        const fx = (i / 8) * vp.w;
        const fy = (i / 8) * vp.h;
        for (const [sx, sy] of [[fx, 0], [fx, vp.h], [0, fy], [vp.w, fy]]) {
          // A shell 3% below the surface still catches the ray: the rim is far out of frame
          assert.ok(oceanHit(cam, sx, sy, PLANET_R * 0.97, out) > 0, `rim in frame at ${p}, ${vp.w}×${vp.h}, (${sx}, ${sy})`);
        }
      }
      // Overhead: the view axis stays within 20° of straight down
      const len = Math.hypot(cam.e.x, cam.e.y, cam.e.z);
      const nadir = -(cam.e.f[0] * cam.e.x + cam.e.f[1] * cam.e.y + cam.e.f[2] * cam.e.z) / len;
      assert.ok(nadir > Math.cos((20 * Math.PI) / 180), `camera tilts toward the horizon at ${p}`);
    }
  }
});

test('overhead tracking keeps both whales large, in frame and the camera steady', () => {
  for (const vp of VIEWPORTS) {
    let previous;
    for (const p of samples.filter((p) => p >= 0.14)) {
      const cam = cameraAt(p, vp);
      const t = travelAt(p);
      for (let i = 0; i < 2; i++) {
        const y = headY(i, t);
        const head = projectLane(cam, WHALES[i].x(y), y, WHALES[i].z(y), {});
        assert.ok(head.scale * WHALES[i].length > (i ? 75 : 135), `whale ${i} too small at ${p}`);
        assert.ok(head.x > vp.w * 0.08 && head.x < vp.w * 0.92, `whale ${i} leaves the frame sideways at ${p}`);
        assert.ok(head.y > vp.h * 0.12 && head.y < vp.h * 0.8, `whale ${i} leaves the frame at ${p}`);
      }
      if (previous) {
        const step = Math.hypot(cam.e.x - previous.e.x, cam.e.y - previous.e.y, cam.e.z - previous.e.z);
        assert.ok(step < 0.6, `camera jump at ${p}`);
      }
      previous = cam;
    }
  }
});

test('the water is alive around the whales: wakes behind them, open sea far away', () => {
  const travel = travelAt(0.5);
  const lane = WHALES[0];
  const tail = travel - 1.02;
  // The churned line right behind the flukes and an arm of the wake further back
  const churn = Math.max(...[0.1, 0.15, 0.2, 0.25, 0.3].map((a) => wakeAt(lane.x(tail - a), tail - a, travel)));
  assert.ok(churn > 0.3);
  const y = tail - 2;
  assert.ok(wakeAt(lane.x(y) + 0.07 + 2 * 0.354, y, travel) > 0.3);
  assert.equal(wakeAt(lane.x(travel) + 4, travel, travel), 0);
  assert.equal(wakeAt(0, travel + 5, travel), 0);
  // The swell moves only with p
  assert.equal(swellAt(0.3, 4, 0.5, 1, 0.4), swellAt(0.3, 4, 0.5, 1, 0.4));
  assert.notEqual(swellAt(0.3, 4, 0.5, 1, 0), swellAt(0.3, 4, 0.51, 1, 0));
});

test('storyboard order: ocean and wakes first, the chart only through the long migration', () => {
  assert.equal(stagesAt(0).engage, 0);
  assert.equal(stagesAt(0.14).engage, 1);
  assert.equal(stagesAt(0.1).trails, 0);
  assert.equal(stagesAt(0.5).trails, 1);
  assert.equal(stagesAt(1).water, 1);
  assert.equal(stagesAt(0.3).chart, 0);
  assert.equal(stagesAt(0.6).chart, 1);
  assert.equal(stagesAt(0.95).chart, 0);
  assert.equal(stagesAt(1, 1).engage, 0);
  assert.equal(stagesAt(1, 1).water, 0);
  assert.equal(stagesAt(1, 0.5).engage, 1, 'exit must keep the tracked pose');
  assert.ok(stagesAt(1, 0.5).whales < 0.25, 'whales fade before the copy settles');
});

test('one normalized scroll clock finishes the visual journey before the text handoff', () => {
  for (const vp of VIEWPORTS.slice(0, 2)) {
    const top = vp.h * 3;
    const height = vp.h * (vp.w < 768 ? 4 : 4.6);
    const end = top + height - vp.h;
    assert.deepEqual(migrationAt(top - vp.h, top, height, vp.h), { progress: 0, p: 0, handoff: 0 });
    const final = migrationAt(end, top, height, vp.h);
    assert.equal(final.p, 1);
    assert.equal(final.handoff, 0);
    const outgoing = migrationAt(end + vp.h * 0.5, top, height, vp.h);
    assert.equal(outgoing.p, 1);
    assert.ok(Math.abs(outgoing.handoff - 0.5) < 1e-9);
    assert.equal(migrationAt(end + vp.h, top, height, vp.h).progress, 1);
  }
});

test('tail beats follow the distance swum, so they stop with the scroll', () => {
  assert.equal(strokeAt(0, travelAt(0.4)), strokeAt(0, travelAt(0.4)));
  assert.ok(strokeAt(0, travelAt(0.5)) > strokeAt(0, travelAt(0.4)));
});
