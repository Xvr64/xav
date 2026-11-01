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
  FILM_HANDOFF_SECONDS,
  FILM_SECONDS,
  FILM_STOPS,
  FILM_TOTAL_SECONDS,
  PHASE,
  WHALE_LEN,
  earthDistance,
  filmSeconds,
  orbitAngle,
  prepareConvergence,
  sampleConvergence,
  whaleLength
} from './convergenceScene.ts';
import { ambientCamera, sampleAmbientWhale } from './ambientWhaleScene.ts';
import { WHALE_RIG } from './whaleRig.ts';
import { CINEMATIC_SPEED, timelineTimes, timelineY } from './cinematicScroll.ts';

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
  assert.ok(bodyW > 0.17 && bodyW < 0.27, `body width ${bodyW}`);
  assert.ok(bodyTop - bodyBottom > 0.17 && bodyTop - bodyBottom < 0.28, `body depth ${bodyTop - bodyBottom}`);
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

test('swimming: the whole body rides one wave, head to flukes', () => {
  const at = [0, 0.51, 0.68, 0.81, 1].map((s) => Math.round(s * (SPINE_NODES - 1)));
  const lo = at.map(() => Infinity);
  const hi = at.map(() => -Infinity);
  for (let k = 0; k < 64; k++) {
    const f = skinFrames(articulate({ distance: (k / 64) * 0.95, effort: 1 }));
    at.forEach((n, j) => {
      lo[j] = Math.min(lo[j], f.p[n * 4 + 1]);
      hi[j] = Math.max(hi[j], f.p[n * 4 + 1]);
    });
  }
  const [head, back, stock, peduncle, flukes] = at.map((_, j) => hi[j] - lo[j]);
  // The head nods, the back and the tail stock bend visibly, and the excursion grows to the flukes
  assert.ok(head > 0.01 && head < flukes / 5, `head ${head}`);
  assert.ok(back > 0.012, `back ${back}`);
  assert.ok(stock > 0.045, `tail stock ${stock}`);
  assert.ok(back < stock && stock < peduncle && peduncle < flukes, 'grows toward the tail');
  assert.ok(flukes > 0.16, `flukes ${flukes}`);
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

test('convergence: the whales circle each other once, unhurried, before they dissolve', () => {
  // One even circle around the shared centre between the approach and the unravelling, and
  // little more while they unravel: never the repeated spinning of the first cut
  const turns = (orbitAngle(PHASE.dissolve) - orbitAngle(PHASE.orbit)) / (2 * Math.PI);
  assert.ok(turns >= 0.9 && turns <= 1.5, `${turns.toFixed(2)} turns`);
  const total = (orbitAngle(1) - orbitAngle(0)) / (2 * Math.PI);
  assert.ok(total <= 2.2, `${total.toFixed(2)} turns in all`);
  let fastest = 0;
  for (let k = 1; k <= 200; k++) {
    assert.ok(orbitAngle(k / 200) > orbitAngle((k - 1) / 200), 'always forward');
    // Degrees per second of the film as it plays: a slow sweep that eases (never spins up) as they unravel
    const rate = ((orbitAngle(k / 200) - orbitAngle((k - 1) / 200)) / (filmSeconds(k / 200) - filmSeconds((k - 1) / 200))) * 57.3;
    if (k / 200 > PHASE.sphere + 0.05) assert.ok(rate <= fastest + 1e-6, `circling sped up at ${k / 200}`);
    fastest = Math.max(fastest, rate);
  }
  assert.ok(fastest < 240, `${fastest.toFixed(0)} deg/s`);
  const g = buildWhaleGeometry();
  const skin = (w) => {
    const fr = skinFrames(w.articulation);
    const out = [];
    for (let v = 0; v < g.vertexCount; v += 11) {
      const l = skinVertex(fr, g, v);
      const q = qRotate(w.quaternion, [l[0] * w.scale, l[1] * w.scale, l[2] * w.scale]);
      out.push([q[0] + w.position[0], q[1] + w.position[1], q[2] + w.position[2]]);
    }
    return out;
  };
  for (let k = 0; k <= 84; k++) {
    const f = sampleConvergence(k / 100, VIEWS[0]);
    if (!f.whales[0].visible || !f.whales[1].visible) continue;
    const d = vlen(vsub(f.whales[0].position, f.whales[1].position));
    // While their bodies show, centres more than a body length apart, and the skinned bodies
    // themselves well clear
    assert.ok(d > WHALE_LEN, `whales too close at ${k / 100}: ${d}`);
    if (k % 3 === 0) {
      const a = skin(f.whales[0]);
      const b = skin(f.whales[1]);
      let clear = Infinity;
      for (const x of a) for (const y of b) clear = Math.min(clear, vlen(vsub(x, y)));
      assert.ok(clear > 0.3 * WHALE_LEN, `bodies ${clear.toFixed(3)} apart at ${k / 100}`);
    }
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

// ---- The film begins from the ambient whales ----------------------------------------------------

/** The ambient whales and camera at time t, as the page would hand them to the convergence. */
const entryAt = (t, view) => {
  const comp = { width: view.width, height: view.height, scroll: 0, weight: 0, lanes: [{ x: 0.79, y: 0.8 }, { x: 0.15, y: 0.9 }], surfaceY: -Infinity, avoid: [0, 0] };
  const cam = ambientCamera(view.width, view.height);
  return { whales: [0, 1].map((i) => sampleAmbientWhale(i, t, comp)), camera: { position: [0, 0, cam.z], target: [0, 0, 0], fov: cam.fov } };
};
/** Screen px of a world point under a camera that looks at the origin (the convergence's). */
const projectFilm = (c, view, x) => {
  const back = vnorm(c.position);
  const right = vnorm(cross([0, 1, 0], back));
  const up = cross(back, right);
  const f = view.height / 2 / Math.tan((c.fov * Math.PI) / 360);
  const d = vsub(x, c.position);
  const z = -dot(d, back);
  return [c.centerX + (dot(d, right) / z) * f, c.centerY - (dot(d, up) / z) * f];
};
/** Screen px of an ambient-scene point under the ambient camera (looking down -Z). */
const projectAmbient = (view, x) => {
  const cam = ambientCamera(view.width, view.height);
  const f = view.height / 2 / Math.tan((cam.fov * Math.PI) / 360);
  const z = cam.z - x[2];
  return [view.width / 2 + (x[0] / z) * f, view.height / 2 - (x[1] / z) * f];
};
const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const vnorm = (a) => { const l = vlen(a); return [a[0] / l, a[1] / l, a[2] / l]; };
const ENTRY_TIMES = [7, 48, 95, 133, 171, 222, 260, 301, 349, 402];

test('convergence entry: the first frame is the ambient picture, every whale where and as it was', () => {
  for (const view of [{ width: 1024, height: 768, globeX: 587, globeY: 361, globeR: 268 }, ...VIEWS]) {
    for (const t of ENTRY_TIMES) {
      const entry = entryAt(t, view);
      const start = prepareConvergence(entry, view);
      const f = sampleConvergence(0, view, start);
      for (let i = 0; i < 2; i++) {
        const a = entry.whales[i];
        const w = f.whales[i];
        // Snout, flukes, back and flank land on the same pixels: same place, size and attitude
        for (const local of [[0, 0, -0.5], [0, 0, 0.45], [0, 0.1, 0], [0.12, 0, 0]]) {
          const pa = qRotate(a.quaternion, local.map((c) => c * a.scale));
          const pw = qRotate(w.quaternion, local.map((c) => c * w.scale));
          const sa = projectAmbient(view, [a.position[0] + pa[0], a.position[1] + pa[1], a.position[2] + pa[2]]);
          const sw = projectFilm(f.camera, view, [w.position[0] + pw[0], w.position[1] + pw[1], w.position[2] + pw[2]]);
          assert.ok(Math.hypot(sa[0] - sw[0], sa[1] - sw[1]) < 0.01, `whale ${i} at t ${t}: ${sa} vs ${sw}`);
        }
        // ... and the same pose of the body: stroke, bend, flippers, flukes
        for (const key of ['stroke', 'amplitude', 'bendYaw', 'bendPitch', 'fluke', 'flukeFlex']) {
          assert.ok(near(w.articulation[key], a.articulation[key], 1e-6), `${key}: ${w.articulation[key]} vs ${a.articulation[key]}`);
        }
        assert.ok(near(w.articulation.flipperL.dihedral, a.articulation.flipperL.dihedral, 1e-9));
      }
    }
  }
});

test('convergence entry: the bodies never change size, only the camera draws back', () => {
  const view = VIEWS[0];
  for (const t of ENTRY_TIMES.slice(0, 4)) {
    const start = prepareConvergence(entryAt(t, view), view);
    let reach = Infinity;
    for (let k = 0; k <= 64; k++) {
      const f = sampleConvergence((k / 64) * PHASE.dissolve, view, start);
      // The shared rig's proportions, A's body exactly its world length, from the first frame on
      assert.equal(f.whales[0].scale, whaleLength(0));
      assert.ok(near(f.whales[1].scale / f.whales[0].scale, WHALE_RIG.scale[1] / WHALE_RIG.scale[0], 1e-12));
      // The camera only ever draws back (or holds) while the whales come together, over most of
      // their approach (as it ends, the framing follows the orbit as that slowly tightens)
      const r = vlen(f.camera.position) * Math.tan((f.camera.fov * Math.PI) / 360);
      if (filmSeconds(f.p) <= 1.8) {
        assert.ok(r >= reach * 0.9999 || reach === Infinity, `camera closed in at ${f.p}`);
        reach = r;
      }
    }
  }
});

test('convergence entry: the whales swim from their places into the orbit without a snap or a spin', () => {
  const view = VIEWS[0];
  // Film time → progress, as JourneyGlobe plays it
  const pAt = (s) => {
    let lo = 0, hi = 1;
    for (let k = 0; k < 40; k++) { const m = (lo + hi) / 2; if (filmSeconds(m) < s) lo = m; else hi = m; }
    return lo;
  };
  for (const t of ENTRY_TIMES) {
    const start = prepareConvergence(entryAt(t, view), view);
    let prev = null;
    let prevSpeed = null;
    for (let s = 0; s <= filmSeconds(PHASE.dissolve + 0.1); s += 1 / 60) {
      const f = sampleConvergence(pAt(s), view, start);
      if (prev) {
        const speed = [0, 1].map((i) => (vlen(vsub(prev[i].position, f.whales[i].position)) * 60) / WHALE_LEN);
        for (let i = 0; i < 2; i++) {
          // The whole body (heading, bank and the beat's rock together) turns no faster than a
          // heavy animal's sweep, in degrees per second of film; the first cut spun them at 600 to 900
          const rate = (qAngle(prev[i].quaternion, f.whales[i].quaternion) * 57.3) * 60;
          assert.ok(rate < 400, `t ${t} whale ${i} turned ${rate.toFixed(0)} deg/s at ${s.toFixed(2)} s`);
          // An unhurried swim (body lengths per second; the first cut reached 9) that gathers and
          // eases without a surge (under 8.4 BL/s², where the first cut's clock jolted at 240)
          assert.ok(speed[i] < 5, `t ${t} whale ${i} swam ${speed[i].toFixed(2)} BL/s at ${s.toFixed(2)} s`);
          if (prevSpeed) assert.ok(Math.abs(speed[i] - prevSpeed[i]) < 0.14, `t ${t} whale ${i} lurched at ${s.toFixed(2)} s`);
        }
        prevSpeed = speed;
      }
      prev = f.whales;
    }
    // Before the first glyph leaves them they circle half a turn apart about the shared centre
    const f = sampleConvergence(PHASE.dissolve - 0.01, view, start);
    const az = f.whales.map((w) => Math.atan2(w.position[2], w.position[0]));
    assert.ok(Math.abs(Math.cos(az[1] - az[0]) + 1) < 0.02, `not half a turn apart: ${az}`);
  }
});

test('convergence pacing: the scene keeps the film clock JourneyGlobe plays', () => {
  assert.equal(FILM_STOPS[0], 0);
  assert.equal(FILM_STOPS[FILM_STOPS.length - 1], 1);
  // The same length as the first cut: 5.5 s of whales and 2.6 s onto the first city, at 1x
  assert.equal(FILM_TOTAL_SECONDS, 5.5 + 2.6);
  assert.ok(near(FILM_SECONDS.reduce((a, b) => a + b, 0) + FILM_HANDOFF_SECONDS, FILM_TOTAL_SECONDS, 1e-9));
  assert.ok(near(filmSeconds(1), FILM_SECONDS.reduce((a, b) => a + b, 0) / CINEMATIC_SPEED, 1e-9));
  let t = 0;
  FILM_STOPS.forEach((p, k) => {
    assert.ok(near(filmSeconds(p), t / CINEMATIC_SPEED, 1e-6), `knot ${k}`);
    t += FILM_SECONDS[k] ?? 0;
  });
  for (let k = 1; k <= 100; k++) assert.ok(filmSeconds(k / 100) > filmSeconds((k - 1) / 100));
});

test('convergence pacing: played as JourneyGlobe plays it, one steady pace that gathers and eases', () => {
  // The lead and the hold onto the first city, as the page lays them out (px)
  const lead = 1536, hold = 0.062 * lead;
  const y = [...FILM_STOPS.map((p) => p * lead), lead + hold, lead + hold + 2000];
  const st = { y, dur: [...FILM_SECONDS, FILM_HANDOFF_SECONDS, 2].map((s) => s / CINEMATIC_SPEED), earth: FILM_STOPS.length };
  const times = timelineTimes(st);
  assert.ok(near(times[st.earth], FILM_TOTAL_SECONDS / CINEMATIC_SPEED, 1e-9), 'the first film keeps its 5.4 s');
  const dt = 1 / 120;
  const pace = [];
  for (let s = 0; s <= times[st.earth]; s += dt) pace.push((timelineY(st, s + dt / 2) - timelineY(st, Math.max(0, s - dt / 2))) / dt / lead);
  const cruise = Math.max(...pace);
  // The page's clock and the scene's agree wherever the whales swim
  for (let s = 0.5; s < filmSeconds(1); s += 0.25) assert.ok(Math.abs(timelineY(st, s) / lead - pAt(s)) < 0.006, `clock drift at ${s} s`);
  let peak = 0;
  for (let k = 1; k < pace.length; k++) {
    // Never a jolt: the pace changes by less than a twentieth of its cruise per 1/120 s
    assert.ok(Math.abs(pace[k] - pace[k - 1]) < cruise * 0.05, `pace jumps at ${(k * dt).toFixed(2)} s`);
    if (pace[k] >= cruise * 0.999 && !peak) peak = k;
  }
  // It gathers from rest, holds a long cruise and eases out
  assert.ok(pace[0] < cruise * 0.02);
  assert.ok(pace.filter((v) => v > cruise * 0.95).length * dt > 2.2, 'a long steady cruise');
  assert.ok(peak * dt > 0.8 && peak * dt < 3.6, `cruise reached at ${peak * dt} s`);
});

/** Film time -> progress, as the scene's clock runs. */
function pAt(s) {
  let lo = 0, hi = 1;
  for (let k = 0; k < 50; k++) {
    const m = (lo + hi) / 2;
    if (filmSeconds(m) < s) lo = m;
    else hi = m;
  }
  return lo;
}
