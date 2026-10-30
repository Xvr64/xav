import test from 'node:test';
import assert from 'node:assert/strict';
import {
  BODY_END,
  PART_BODY,
  PART_FLIPPER_R,
  PART_FLUKE,
  SPINE_NODES,
  buildWhaleGeometry,
  sampleWhaleSurface
} from './whale3dAnatomy.ts';
import {
  articulate,
  orientWhale,
  qRotate,
  sampleWhalePose,
  skinFrames,
  skinVertex,
  yawPitchRoll
} from './whale3dPose.ts';
import {
  PHASE,
  WHALE_LEN,
  earthDistance,
  orbitAngle,
  sampleConvergence
} from './convergenceScene.ts';

const near = (a, b, eps = 1e-6) => Math.abs(a - b) <= eps;
const vlen = (v) => Math.hypot(v[0], v[1], v[2]);
const vsub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
const qAngle = (a, b) => 2 * Math.acos(Math.min(1, Math.abs(a[0] * b[0] + a[1] * b[1] + a[2] * b[2] + a[3] * b[3])));
const VIEWS = [
  { width: 1376, height: 900, globeX: 880.6, globeY: 423, globeR: 351 * 1.08 },
  { width: 343, height: 812, globeX: 171.5, globeY: 276, globeR: 137 * 1.08 }
];

test('geometry: closed, finite, unit normals, indices in range', () => {
  const g = buildWhaleGeometry();
  assert.ok(g.vertexCount > 3000 && g.vertexCount < 12000, `vertex count ${g.vertexCount}`);
  for (const i of g.index) assert.ok(i < g.vertexCount);
  for (let v = 0; v < g.vertexCount; v++) {
    for (let c = 0; c < 3; c++) assert.ok(Number.isFinite(g.rest[v * 3 + c]) && Number.isFinite(g.offset[v * 3 + c]));
    const n = [g.normal[v * 3], g.normal[v * 3 + 1], g.normal[v * 3 + 2]];
    assert.ok(near(vlen(n), 1, 1e-3), `normal ${v} not unit`);
    assert.ok(g.spine[v] >= 0 && g.spine[v] <= SPINE_NODES - 1);
  }
});

test('geometry: body normals point outward from the spine', () => {
  const g = buildWhaleGeometry();
  let out = 0;
  let total = 0;
  for (let v = 0; v < g.vertexCount; v++) {
    if (g.info[v * 4] !== PART_BODY) continue;
    const s = g.rest[v * 3 + 2] + 0.5;
    if (s < 0.05 || s > BODY_END - 0.05) continue;
    total++;
    if (g.normal[v * 3] * g.rest[v * 3] + g.normal[v * 3 + 1] * g.rest[v * 3 + 1] > -0.002) out++;
  }
  assert.ok(out / total > 0.97, `${out}/${total} outward`);
});

test('anatomy: humpback proportions — long flippers, broad flukes, stout body', () => {
  const g = buildWhaleGeometry();
  const f = skinFrames(articulate({ distance: 0, effort: 0 }));
  let flipperReach = 0;
  let flukeMin = Infinity;
  let flukeMax = -Infinity;
  let bodyW = 0;
  let bodyTop = -Infinity;
  let bodyBottom = Infinity;
  const root = g.pivots.flipperR;
  for (let v = 0; v < g.vertexCount; v++) {
    const part = g.info[v * 4];
    const p = skinVertex(f, g, v);
    if (part === PART_FLIPPER_R) flipperReach = Math.max(flipperReach, vlen(vsub(p, root)));
    if (part === PART_FLUKE) {
      flukeMin = Math.min(flukeMin, p[0]);
      flukeMax = Math.max(flukeMax, p[0]);
    }
    if (part === PART_BODY) {
      bodyW = Math.max(bodyW, Math.abs(p[0]) * 2);
      bodyTop = Math.max(bodyTop, p[1]);
      bodyBottom = Math.min(bodyBottom, p[1]);
    }
  }
  // Pectoral flippers reach about a third of the body length; flukes span about a third
  assert.ok(flipperReach > 0.27 && flipperReach < 0.36, `flipper ${flipperReach}`);
  assert.ok(flukeMax - flukeMin > 0.29 && flukeMax - flukeMin < 0.38, `fluke span ${flukeMax - flukeMin}`);
  assert.ok(bodyW > 0.17 && bodyW < 0.25, `body width ${bodyW}`);
  assert.ok(bodyTop - bodyBottom > 0.17 && bodyTop - bodyBottom < 0.26, `body depth ${bodyTop - bodyBottom}`);
});

test('skinning: the rest pose reproduces the rest mesh exactly', () => {
  const g = buildWhaleGeometry();
  const a = articulate({ distance: 0, effort: 0 });
  a.amplitude = 0;
  a.flipperL = { sweep: 0, dihedral: 0, twist: 0 };
  a.flipperR = { sweep: 0, dihedral: 0, twist: 0 };
  a.fluke = 0;
  a.flukeFlex = 0;
  const f = skinFrames(a);
  for (let v = 0; v < g.vertexCount; v++) {
    const part = g.info[v * 4];
    if (part === 1 || part === 2) continue; // flippers carry their rest attitude
    const p = skinVertex(f, g, v);
    assert.ok(vlen(vsub(p, [g.rest[v * 3], g.rest[v * 3 + 1], g.rest[v * 3 + 2]])) < 1e-5);
  }
});

test('swimming: the flukes beat up and down, not side to side', () => {
  const g = buildWhaleGeometry();
  let tip = -1;
  for (let v = 0; v < g.vertexCount; v++) if (g.info[v * 4] === PART_FLUKE && (tip < 0 || g.rest[v * 3 + 2] > g.rest[tip * 3 + 2])) tip = v;
  let head = 0;
  let minY = Infinity;
  let maxY = -Infinity;
  let maxX = 0;
  let headMove = 0;
  for (let k = 0; k < 32; k++) {
    const f = skinFrames(articulate({ distance: k / 32, effort: 1 }));
    const p = skinVertex(f, g, tip);
    const h = skinVertex(f, g, head);
    minY = Math.min(minY, p[1]);
    maxY = Math.max(maxY, p[1]);
    maxX = Math.max(maxX, Math.abs(p[0] - g.rest[tip * 3]));
    headMove = Math.max(headMove, Math.abs(h[1] - g.rest[head * 3 + 1]));
  }
  assert.ok(maxY - minY > 0.08, `vertical stroke ${maxY - minY}`);
  assert.ok(maxX < 0.01, `lateral drift ${maxX}`);
  assert.ok(headMove < (maxY - minY) / 3, 'the head stays steadier than the flukes');
});

test('pose sampler is deterministic and pure', () => {
  const m = { path: (u) => [Math.sin(u * 6), 0.2 * u, -3 * u], length: 1.3, effort: (u) => 0.5 + u, phase: 1.1 };
  for (const u of [0, 0.13, 0.5, 0.999]) assert.deepEqual(sampleWhalePose(u, m), sampleWhalePose(u, m));
});

test('orientation: local -Z is the heading and +Y the back, with no flips through a full turn', () => {
  const turn = { path: (u) => [1.1 * (1 - Math.cos(2 * Math.PI * u)), 0, -1.1 * Math.sin(2 * Math.PI * u)], length: 1 };
  let prev = null;
  let heading = 0;
  let lastYaw = null;
  for (let k = 0; k <= 400; k++) {
    const u = k / 400;
    const pose = sampleWhalePose(u, turn);
    const fwd = qRotate(pose.quaternion, [0, 0, -1]);
    const back = qRotate(pose.quaternion, [0, 1, 0]);
    const h = 1e-3;
    const a = turn.path(u - h);
    const b = turn.path(u + h);
    const t = vsub(b, a);
    const tl = vlen(t);
    assert.ok(fwd[0] * t[0] / tl + fwd[1] * t[1] / tl + fwd[2] * t[2] / tl > 0.999, 'heads along the path');
    assert.ok(back[1] > 0.8, 'back stays up (banked, never inverted)');
    if (prev) assert.ok(qAngle(prev, pose.quaternion) < 0.05, `continuous at ${u}`);
    prev = pose.quaternion;
    const yaw = Math.atan2(-fwd[0], -fwd[2]);
    if (lastYaw !== null) {
      let d = yaw - lastYaw;
      if (d > Math.PI) d -= 2 * Math.PI;
      if (d < -Math.PI) d += 2 * Math.PI;
      heading += d;
    }
    lastYaw = yaw;
  }
  assert.ok(Math.abs(Math.abs(heading) - 2 * Math.PI) < 0.05, `turned ${heading} rad`);
});

test('quaternions: yaw, pitch and roll compose without gimbal lock', () => {
  const left = qRotate(yawPitchRoll(Math.PI / 2, 0, 0), [0, 0, -1]);
  assert.ok(near(left[0], -1, 1e-9), 'a quarter yaw turns the heading to -X');
  const up = qRotate(yawPitchRoll(0, Math.PI / 2, 0), [0, 0, -1]);
  assert.ok(near(up[1], 1, 1e-9), 'a quarter pitch points the nose up');
  // Straight up, yaw still changes the back direction (no lost degree of freedom)
  const b1 = qRotate(yawPitchRoll(0, Math.PI / 2, 0), [0, 1, 0]);
  const b2 = qRotate(yawPitchRoll(1, Math.PI / 2, 0), [0, 1, 0]);
  assert.ok(vlen(vsub(b1, b2)) > 0.5);
  // Banking rolls the back toward the right flank
  const q = orientWhale([0, 0, -1], [0, 1, 0], 0.4);
  assert.ok(qRotate(q, [0, 1, 0])[0] > 0.3);
  // A vertical heading keeps a defined basis
  const v = orientWhale([0, 1, 0], [0, 1, 0]);
  assert.ok(near(vlen(qRotate(v, [0, 1, 0])), 1, 1e-9));
});

test('convergence: deterministic and reversible (any order, same frames)', () => {
  const ps = Array.from({ length: 41 }, (_, i) => i / 40);
  const forward = ps.map((p) => sampleConvergence(p, VIEWS[0]));
  const backward = [...ps].reverse().map((p) => sampleConvergence(p, VIEWS[0])).reverse();
  assert.deepEqual(forward, backward);
  assert.deepEqual(sampleConvergence(-0.5, VIEWS[0]), sampleConvergence(0, VIEWS[0]));
  assert.deepEqual(sampleConvergence(7, VIEWS[0]), sampleConvergence(1, VIEWS[0]));
});

test('convergence: the whales circle each other repeatedly before they dissolve', () => {
  // At least two full turns around the shared centre between the approach and the unravelling
  const turns = (orbitAngle(PHASE.dissolve) - orbitAngle(PHASE.orbit)) / (2 * Math.PI);
  assert.ok(turns >= 2, `${turns.toFixed(2)} turns`);
  for (let k = 1; k <= 200; k++) assert.ok(orbitAngle(k / 200) > orbitAngle((k - 1) / 200), 'always forward');
  for (let k = 0; k <= 84; k++) {
    const f = sampleConvergence(k / 100, VIEWS[0]);
    const d = vlen(vsub(f.whales[0].position, f.whales[1].position));
    // Centres more than a body length apart: the two bodies can never touch
    assert.ok(d > WHALE_LEN * 1.15, `whales too close at ${k / 100}: ${d}`);
    if (k / 100 < PHASE.dissolve) assert.ok(f.whales[0].visible && f.whales[1].visible && f.whales[0].dissolve === 0);
  }
  // Their strokes are not in unison
  const f = sampleConvergence(0.3, VIEWS[0]);
  assert.ok(Math.abs(Math.sin(f.whales[0].articulation.stroke - f.whales[1].articulation.stroke)) > 0.2);
});

test('convergence: dissolves tail first, then hands the Earth to the Globe', () => {
  assert.equal(sampleConvergence(0.5, VIEWS[0]).globeReveal, 0);
  const end = sampleConvergence(1, VIEWS[0]);
  assert.equal(end.globeReveal, 1);
  assert.equal(end.layer, 0);
  assert.ok(end.spin === 0);
  assert.equal(end.ortho, 1);
  assert.ok(end.whales.every((w) => !w.visible));
  // The particles' departure key: the flukes leave before the head
  const s = sampleWhaleSurface(400, 3);
  let head = 0;
  let tail = 0;
  for (let i = 0; i < s.count; i++) {
    const key = s.info[i * 4 + 3];
    const z = s.spine[i] / (SPINE_NODES - 1);
    if (z < 0.2) head = Math.max(head, key);
    if (z > 0.85) tail = Math.max(tail, key);
  }
  assert.ok(tail > head + 0.5);
});

test('convergence: the final camera frames the Earth exactly where the Globe draws it', () => {
  for (const view of VIEWS) {
    const f = sampleConvergence(1, view);
    assert.ok(near(f.camera.centerX, view.globeX, 1e-6) && near(f.camera.centerY, view.globeY, 1e-6));
    const d = vlen(f.camera.position);
    assert.ok(near(d, earthDistance(view.globeR, view.height, f.camera.fov), 1e-9));
    const silhouettePx = view.height / 2 / Math.tan((f.camera.fov / 2) * (Math.PI / 180)) / Math.sqrt(d * d - 1);
    assert.ok(near(silhouettePx, view.globeR, 1e-6), `${silhouettePx} vs ${view.globeR}`);
    // Looking straight down -Z at the first city, north up
    assert.ok(near(f.camera.position[0], 0, 1e-9) && near(f.camera.position[1], 0, 1e-9));
  }
});
