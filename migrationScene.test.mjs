import test from 'node:test';
import assert from 'node:assert/strict';
import {
  TRAVEL,
  WHALES,
  cameraAt,
  earthFor,
  earthFrame,
  earthView,
  headY,
  project,
  spineAlongLane,
  stagesAt,
  strokeAt,
  travelAt
} from './migrationScene.ts';

const VIEWPORTS = [
  { w: 1440, h: 900, whalePx: 522 },
  { w: 390, h: 844, whalePx: 226 }
];
const samples = Array.from({ length: 401 }, (_, i) => i / 400);
const frame = (p, vp, earth) => JSON.stringify({ cam: cameraAt(p, vp, earth.x), view: earthView(p), stages: stagesAt(p), travel: travelAt(p) });

test('the swim: starts still, only moves forward, ends at its full distance', () => {
  assert.equal(travelAt(0), 0);
  assert.ok(Math.abs(travelAt(1) - TRAVEL) < 1e-9);
  let prev = travelAt(0);
  for (const p of samples.slice(1)) {
    const t = travelAt(p);
    assert.ok(t >= prev, `travel at ${p}`);
    prev = t;
  }
});

test('same progress, same frame: scrolling back replays every frame exactly', () => {
  for (const vp of VIEWPORTS) {
    const earth = earthFor(vp);
    const down = samples.map((p) => frame(p, vp, earth));
    const up = [...samples].reverse().map((p) => frame(p, vp, earth)).reverse();
    assert.deepEqual(down, up);
  }
});

test('storyboard order: whales first, trails in the long migration, the Earth only from shot 04', () => {
  assert.equal(stagesAt(0).engage, 0);
  assert.equal(stagesAt(0.14).engage, 1);
  assert.equal(stagesAt(0.3).trails, 0);
  assert.equal(stagesAt(0.5).trails, 1);
  assert.equal(stagesAt(1).trails, 0);
  for (const p of samples.filter((p) => p <= 0.62)) assert.equal(stagesAt(p).earth, 0, `earth at ${p}`);
  assert.equal(stagesAt(0.8).earth, 1);
  // The handoff hands the whales back and lets the Earth go with the page
  assert.equal(stagesAt(1, 1).engage, 0);
  assert.equal(stagesAt(1, 1).earth, 0);
  assert.equal(stagesAt(1, 1).water, 0);
});

test('the Earth turns through one controlled arc tied to progress, then rests', () => {
  assert.equal(earthView(0.5).lon, earthView(0.62).lon);
  let prev = earthView(0.62).lon;
  for (const p of samples.filter((p) => p > 0.62)) {
    const lon = earthView(p).lon;
    assert.ok(lon >= prev);
    prev = lon;
  }
  const arc = earthView(1).lon - earthView(0).lon;
  assert.ok(arc > 90 && arc < 200, `arc ${arc}`);
  assert.equal(earthView(0.995).lon, earthView(1).lon);
});

test('the whales stay whales: constant length, apart from each other, never reaching the Earth', () => {
  const xs = new Float64Array(64);
  const ys = new Float64Array(64);
  const zs = new Float64Array(64);
  for (const vp of VIEWPORTS) {
    const earth = earthFor(vp);
    for (const p of samples) {
      const travel = travelAt(p);
      const heads = [];
      for (let i = 0; i < 2; i++) {
        spineAlongLane(i, headY(i, travel), 64, xs, ys, zs);
        let len = 0;
        for (let k = 1; k < 64; k++) len += Math.hypot(xs[k] - xs[k - 1], ys[k] - ys[k - 1]);
        assert.ok(Math.abs(len - WHALES[i].length) < 0.01 * WHALES[i].length, `length of whale ${i} at ${p}`);
        heads.push([xs[0], ys[0]]);
        const toEarth = Math.hypot(xs[0] - earth.x, ys[0] - earth.y);
        assert.ok(toEarth > earth.r + 1, `whale ${i} reaches the Earth at ${p}`);
      }
      assert.ok(Math.hypot(heads[0][0] - heads[1][0], heads[0][1] - heads[1][1]) > 0.3, `whales merge at ${p}`);
    }
  }
});

test('framing: whales hold their size at the start, the Earth lands on its spot in the final frame', () => {
  for (const vp of VIEWPORTS) {
    const earth = earthFor(vp);
    const start = cameraAt(0, vp, earth.x);
    const head = project(start, WHALES[0].x(0), 0, WHALES[0].z(0), {});
    assert.ok(Math.abs(head.scale / vp.whalePx - 1) < 0.05);
    // The Earth is out of frame while the camera looks down at the whales
    for (const p of samples.filter((p) => p < 0.6)) {
      const e = project(cameraAt(p, vp, earth.x), earth.x, earth.y, earth.z, {});
      assert.ok(e.y + earth.r * e.scale < 0, `earth visible at ${p}`);
    }
    const end = project(cameraAt(1, vp, earth.x), earth.x, earth.y, earth.z, {});
    const spot = earthFrame(vp.w, vp.h);
    assert.ok(Math.abs(end.x - spot.x * vp.w) < 2 && Math.abs(end.y - spot.y * vp.h) < 2);
    assert.ok(Math.abs(earth.r * end.scale - spot.r) < 2);
  }
});

test('tail beats follow the distance swum, so they stop with the scroll', () => {
  assert.equal(strokeAt(0, travelAt(0.4)), strokeAt(0, travelAt(0.4)));
  assert.ok(strokeAt(0, travelAt(0.5)) > strokeAt(0, travelAt(0.4)));
});
