/**
 * The convergence: two humpbacks circle each other and become the Earth that the Global section's
 * journey then travels. A pure function of one progress value p ∈ [0, 1] (the scroll interval
 * that leads into the Globe's pinned stage) and of where the film begins: scrolling back plays
 * every part of it in reverse, stopping freezes it, and any p can be sampled directly.
 *
 *   0.00–0.15  approach   the ambient whales swim on from wherever the viewer saw them, turn toward
 *                         each other and sweep into the orbit, while the camera draws back
 *   0.15–0.45  orbit      a slow, wide, banked circle around a shared centre, half a turn apart
 *   0.45–0.65  sphere     each orbit tilts away from the other, so together they trace a sphere;
 *                         the first glyphs stream off the flukes
 *   0.64–0.84  transform  the whales unravel tail-first into glyph streams that wrap the sphere
 *                         and settle as the continents and the graticule
 *   0.84–1.00  Earth      the spin settles on the journey's first city; the camera arrives at
 *                         the Globe's own framing and the stage hands over to it
 *
 * The film begins from a ConvergenceEntry: the ambient whales and camera exactly as the page last
 * drew them (ambientWhaleScene.ts). At p = 0 the frame is that very picture, the same two animals
 * at the same size, pose and stroke; their bodies never change size afterwards, only the camera
 * draws back. Without an entry the whales spiral in from either side.
 *
 * World: the Earth's centre is the origin, its radius 1; +Y is up. Whale conventions follow
 * whale3dPose.ts, and both whales are built and swum by the shared rig (whaleRig.ts).
 */
import {
  blendArticulation,
  qConj,
  qFromBasis,
  qIdentity,
  qMul,
  qRotate,
  qSlerp,
  sampleWhalePose,
  vAdd,
  vCross,
  vDot,
  vLen,
  vNorm,
  vScale,
  vSub,
  type Articulation,
  type Quat,
  type WhaleMotion,
  type WhalePose
} from './whale3dPose.ts';
import type { V3 } from './whale3dAnatomy.ts';
import { WHALE_RIG, beatBody } from './whaleRig.ts';
import { CINEMATIC_SPEED } from './cinematicScroll.ts';

export const EARTH_R = 1;
/** World units per body length of Whale A (Whale B is the rig's smaller animal). */
export const WHALE_LEN = 1.95;
/** Whale i's body length in the world; `size` scales the pair (larger on narrow, portrait stages). */
export const whaleLength = (i: number, size = 1) => WHALE_LEN * size * WHALE_RIG.scale[i];

/** Phase boundaries (progress). */
export const PHASE = {
  orbit: 0.15,
  sphere: 0.45,
  dissolve: 0.64,
  dissolveSpan: 0.19,
  earth: 0.84,
  handoff: 0.955,
  handoffEnd: 0.99
} as const;

/**
 * The film's pacing, as JourneyGlobe plays it: progress knots and the seconds between them at 1×
 * (the whales-to-Globe film runs twice as fast as its first cut), all scaled by CINEMATIC_SPEED.
 */
export const FILM_STOPS = [0, PHASE.orbit, 0.3, PHASE.sphere, PHASE.earth];
export const FILM_SECONDS = [2.0, 2.6, 2.6, 3.8].map((s) => s / 2);
/** Real seconds into the film at progress p (the knots joined linearly; beyond them, their pace). */
export function filmSeconds(p: number): number {
  const n = FILM_SECONDS.length;
  let t = 0;
  for (let k = 0; k < n; k++) {
    const a = FILM_STOPS[k];
    const b = FILM_STOPS[k + 1];
    const rate = FILM_SECONDS[k] / (b - a);
    if (k === 0 && p < a) return (p - a) * rate / CINEMATIC_SPEED;
    if (p <= b || k === n - 1) return (t + (p - a) * rate) / CINEMATIC_SPEED;
    t += FILM_SECONDS[k];
  }
  return t / CINEMATIC_SPEED;
}

export const clamp01 = (x: number) => Math.max(0, Math.min(1, x));
export const smoothstep = (a: number, b: number, x: number) => {
  const t = clamp01((x - a) / (b - a));
  return t * t * (3 - 2 * t);
};
/** C2 easing: acceleration stays continuous too, so the bend it drives never snaps. */
const smoother = (a: number, b: number, x: number) => {
  const t = clamp01((x - a) / (b - a));
  return t * t * t * (t * (t * 6 - 15) + 10);
};
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/** Orbit radius: a spiral in from the sides, a wide orbit, then a tightening onto the sphere. */
export function orbitRadius(p: number): number {
  if (p < PHASE.orbit) return lerp(3.5, 1.82, smoothstep(0, PHASE.orbit, p) ** 0.85);
  if (p < PHASE.sphere) return lerp(1.82, 1.74, (p - PHASE.orbit) / (PHASE.sphere - PHASE.orbit));
  return lerp(1.74, 1.22, smoothstep(PHASE.sphere, PHASE.earth, p));
}
/** Swimming speed along the orbit (world units per unit of progress), easing as they unravel. */
const orbitSpeed = (p: number) => lerp(58, 34, smoothstep(0.58, 0.84, p));

// Orbit angle: integral of speed / radius, tabulated once (deterministic, monotone)
const TABLE_N = 4000;
const THETA = new Float64Array(TABLE_N + 1);
for (let i = 1; i <= TABLE_N; i++) {
  const pm = (i - 0.5) / TABLE_N;
  THETA[i] = THETA[i - 1] + orbitSpeed(pm) / orbitRadius(pm) / TABLE_N;
}
/** Total angle swum around the centre by progress p (radians); whale B is half a turn ahead. */
export function orbitAngle(p: number): number {
  const x = clamp01(p) * TABLE_N;
  const i = Math.min(TABLE_N - 1, Math.floor(x));
  const base = THETA[i] + (THETA[i + 1] - THETA[i]) * (x - i);
  // Beyond the ends keep moving at the end speed, so a pose is defined for any p
  if (p < 0) return p * (orbitSpeed(0) / orbitRadius(0));
  if (p > 1) return THETA[TABLE_N] + (p - 1) * (orbitSpeed(1) / orbitRadius(1));
  return base;
}
/** Angular speed (radians per unit progress) at p. */
export const orbitOmega = (p: number) => orbitSpeed(clamp01(p)) / orbitRadius(clamp01(p));

/** Tilt of each whale's orbit plane (radians, opposite signs): 0 while circling, then apart. */
export const orbitTilt = (p: number) => 0.66 * smoothstep(PHASE.sphere - 0.03, 0.66, p);
/** Slow precession of the line where the two orbit planes cross. */
const nodeAngle = (p: number) => 0.35 + 1.1 * smoothstep(PHASE.sphere, PHASE.earth, p);

/** Unit normal of whale i's orbit plane at p: world up tilted about the line of nodes. */
export function orbitNormal(i: number, p: number): V3 {
  const t = (i === 0 ? 1 : -1) * orbitTilt(p);
  const a = nodeAngle(p);
  return [-Math.sin(a) * Math.sin(t), Math.cos(t), Math.cos(a) * Math.sin(t)];
}

/**
 * Whale i's centre on its orbit at p (i = 1 swims half a turn ahead, a little lower). `phase`
 * turns both places about the axis: where the orbit meets whales that swam in from the page.
 */
export function orbitPosition(i: number, p: number, phase = 0): V3 {
  const r = orbitRadius(p);
  const th = orbitAngle(p) + phase + (i === 0 ? 0 : Math.PI);
  const a = nodeAngle(p);
  const n = orbitNormal(i, p);
  const e1: V3 = [Math.cos(a), 0, Math.sin(a)];
  const e2 = vNorm(vCross(n, e1));
  // A gentle helix: one whale rides a little above the other, and each rises and falls slowly
  const lift = (i === 0 ? 0.16 : -0.16) * (1 - smoothstep(0.55, 0.8, p)) + 0.07 * Math.sin(th * 0.5 + i * 1.7);
  return [
    r * (Math.cos(th) * e1[0] + Math.sin(th) * e2[0]) + lift * n[0],
    r * (Math.cos(th) * e1[1] + Math.sin(th) * e2[1]) + lift * n[1],
    r * (Math.cos(th) * e1[2] + Math.sin(th) * e2[2]) + lift * n[2]
  ];
}

/** Swimming effort: strong strokes on the approach, a cruise in the orbit, glides as they unravel. */
const effortAt = (i: number, p: number) =>
  lerp(1.25, 0.7, smoothstep(0.05, PHASE.orbit + 0.05, p)) + 0.18 * Math.sin(p * 37 + i * 2.4) * (1 - smoothstep(0.6, 0.8, p)) - 0.3 * smoothstep(0.66, 0.84, p);

/** Whale i's swim along its orbit with the shared rig; `size` scales the pair. */
export function whaleMotion(i: number, size = 1): WhaleMotion {
  return {
    path: (u) => orbitPosition(i, u),
    up: (u) => orbitNormal(i, u),
    length: whaleLength(i, size),
    effort: (u) => effortAt(i, u),
    phase: WHALE_RIG.phase[i],
    stride: WHALE_RIG.stride[i],
    bankGain: 0.5,
    maxBank: 0.5,
    rig: { powerStroke: WHALE_RIG.powerStroke, maxTurn: WHALE_RIG.maxTurn, maxClimb: WHALE_RIG.maxClimb, tailLag: WHALE_RIG.tailLag[i], leanWindow: WHALE_RIG.leanWindow, maxBeatHz: WHALE_RIG.maxBeatHz },
    seconds: filmSeconds
  };
}

/** The Earth's remaining turn about its pole: it spins as it forms and settles on the first city. */
export const earthSpin = (p: number) => -1.9 * (1 - smoothstep(0.6, 0.955, p)) ** 2;

export interface ConvergenceView {
  /** Stage size in CSS px. */
  width: number;
  height: number;
  /** The Globe's centre and radius in the stage at the start of its journey (CSS px). */
  globeX: number;
  globeY: number;
  globeR: number;
}

export interface ConvergenceCamera {
  position: V3;
  up: V3;
  /** Vertical field of view (degrees). */
  fov: number;
  /** Where the world origin sits on the stage (CSS px). */
  centerX: number;
  centerY: number;
}

export interface ConvergenceFrame {
  p: number;
  whales: (WhalePose & { dissolve: number; visible: boolean })[];
  camera: ConvergenceCamera;
  /** Earth spin about its pole (radians; 0 = the Globe's starting view). */
  spin: number;
  /** Projection blend toward the Globe's orthographic framing for settled dots (0 … 1). */
  ortho: number;
  /** How strongly the forming sphere hides what passes behind it. */
  occlusion: number;
  /** The paper disc of the Earth fading in under the dots. */
  disc: number;
  /** The Globe's own canvas (0 hidden … 1 shown) and this layer's presence. */
  globeReveal: number;
  layer: number;
  orbitNormals: [V3, V3];
  omega: number;
  /** Orbit phase the whales met (radians): the particles' paths are built for it. */
  phase: number;
}

/**
 * Where the film begins: the ambient whales and camera as the page last drew them, in the ambient
 * scene's units (Whale A's body length). The camera's field of view is over the stage's height,
 * and it projects its look-at point to the stage's centre, as the ambient scene draws.
 */
export interface ConvergenceEntry {
  whales: Pick<WhalePose, 'position' | 'quaternion' | 'scale' | 'articulation'>[];
  camera: { position: V3; target: V3; fov: number };
}

/** The entry carried into the world: each whale's approach, and the camera it begins from. */
export interface ConvergenceStart {
  phase: number;
  /** Each whale's own orbit phase as it arrives, eased into `phase` by SPACING_END. */
  offsets: [number, number];
  size: number;
  whales: {
    /** The approach from the entry to the orbit at PHASE.orbit: position and velocity per step. */
    track: Float64Array;
    /** Where it joins its orbit (progress). */
    join: number;
    up: V3;
    strokePhase: number;
    articulation: Articulation;
    /** The entry's exact pose, as the approach's own frame at p = 0 differs from it. */
    position: V3;
    quaternion: Quat;
  }[];
  camera: { distance: number; fov: number };
}

const FOV_ORBIT = 30;
const FOV_EARTH = 16;
/** Where the camera's elevation and azimuth begin (degrees): just above the water line, ahead. */
const EL_START = 10;
/** The ambient camera's view axis meets the Earth's centre this far beyond its focal plane (body lengths). */
const ENTRY_DEPTH = 0.25;
/** The camera has drawn back into the orbit's framing by this progress. */
const PULL_END = 0.21;
/** The entry's own lean, roll and articulation have given way to the swim by this progress. */
const SETTLE_END = 0.11;
/** The approach's opening pace along the whale's own heading, as a share of its orbit speed. */
const LAUNCH = 0.45;
/** Steps of the integrated approach. */
const APPROACH_STEPS = 832;
/** How briskly a whale answers a new heading (per unit progress), and its tightest curve (1 / world units). */
const STEER_K = 30;
/** How quickly the turn rate answers (per unit progress). */
const STEER_EASE = 90;
const MAX_CURVE = 1.6;
/** Progress over which the steering opens up to its tightest curve. */
const TURN_IN = 0.045;
/** The steepest climb or dive of the approach (radians). */
const MAX_PITCH = 0.6;
/** Progress over which each approach is corrected onto its orbit exactly, before it joins. */
const CORRECT_SPAN = 0.035;
/** The latest a whale joins its orbit (the camera has drawn back by then). */
const JOIN_LATEST = 0.26;
/** By here the two circle exactly half a turn apart (well before any glyph leaves them). */
const SPACING_END = 0.38;

/** Camera distance that shows the Earth (radius 1) at `rPx` on a stage `h` px tall. */
export function earthDistance(rPx: number, h: number, fovDeg: number): number {
  const t = Math.tan(((fovDeg / 2) * Math.PI) / 180);
  const k = (2 * rPx) / h; // projected radius in units of half-height
  // Silhouette of a sphere at distance d: 1 / sqrt(d² − 1) / tan(fov/2) half-heights
  return Math.sqrt(1 + 1 / (k * t) ** 2);
}

/** Quintic Hermite through (p0, v0, a0) at t = 0 and (p1, v1, a1) at t = 1 (C2 at both ends). */
function quintic(from: [V3, V3, V3], to: [V3, V3, V3], T: number, t: number): V3 {
  const t2 = t * t, t3 = t2 * t, t4 = t3 * t, t5 = t4 * t;
  const h0 = 1 - 10 * t3 + 15 * t4 - 6 * t5;
  const h1 = t - 6 * t3 + 8 * t4 - 3 * t5;
  const h2 = 0.5 * t2 - 1.5 * t3 + 1.5 * t4 - 0.5 * t5;
  const h3 = 0.5 * t3 - t4 + 0.5 * t5;
  const h4 = -4 * t3 + 7 * t4 - 3 * t5;
  const h5 = 10 * t3 - 15 * t4 + 6 * t5;
  const out: V3 = [0, 0, 0];
  for (let k = 0; k < 3; k++) {
    out[k] = h0 * from[0][k] + h1 * from[1][k] * T + h2 * from[2][k] * T * T + h3 * to[2][k] * T * T + h4 * to[1][k] * T + h5 * to[0][k];
  }
  return out;
}

/** Position, velocity and acceleration of the orbit at p (per unit progress). */
function orbitJet(i: number, p: number, phase: number): [V3, V3, V3] {
  const h = 1e-3;
  const a = orbitPosition(i, p - h, phase);
  const b = orbitPosition(i, p, phase);
  const c = orbitPosition(i, p + h, phase);
  return [b, vScale(vSub(c, a), 1 / (2 * h)), vScale(vAdd(vSub(c, vScale(b, 2)), a), 1 / (h * h))];
}

/** The camera's direction from the Earth's centre: elevation and azimuth in degrees. */
const cameraDir = (el: number, az: number): V3 => {
  const e = (el * Math.PI) / 180, a = (az * Math.PI) / 180;
  return [Math.cos(e) * Math.sin(a), Math.sin(e), Math.cos(e) * Math.cos(a)];
};
/** Right, up and back of a camera looking along -back with world up. */
const cameraBasis = (back: V3): [V3, V3, V3] => {
  const right = vNorm(vCross([0, 1, 0], back));
  return [right, vCross(back, right), back];
};

const isPortrait = (view: ConvergenceView) => view.width / Math.max(1, view.height) < 0.9;

/**
 * Carry the entry into the world: a uniform scale (so Whale A's body is exactly its world length)
 * and a rotation that maps the ambient camera onto the film's opening camera. The picture is the
 * same; the whales are now where the orbit can reach them. Then pick the orbit's phase that each
 * whale reaches most naturally from its own heading, without the two crossing.
 */
export function prepareConvergence(entry: ConvergenceEntry, view: ConvergenceView): ConvergenceStart {
  const size = isPortrait(view) ? 1.3 : 1;
  const k = whaleLength(0, size) / Math.max(1e-6, entry.whales[0]?.scale ?? 1);
  const camA = entry.camera.position;
  const axis = vNorm(vSub(entry.camera.target, camA));
  const depth = Math.max(0.5, vDot(vScale(camA, -1), axis) + ENTRY_DEPTH);
  const origin = vAdd(camA, vScale(axis, depth));
  const [ra, ua, ba] = cameraBasis(vScale(axis, -1));
  const [rc, uc, bc] = cameraBasis(cameraDir(EL_START, 0));
  const qR = qMul(qFromBasis(rc, uc, bc), qConj(qFromBasis(ra, ua, ba)));
  const toWorld = (p: V3) => vScale(qRotate(qR, vSub(p, origin)), k);
  const up = qRotate(qR, [0, 1, 0]);

  const T = PHASE.orbit;
  const whales = entry.whales.slice(0, 2).map((w, i) => {
    const quaternion = qMul(qR, w.quaternion);
    const fwd = qRotate(quaternion, [0, 0, -1]);
    // Raw stroke phase whose power-stroke warp lands on the entry's stroke (Newton steps)
    const ps = WHALE_RIG.powerStroke;
    let x = w.articulation.stroke;
    for (let n = 0; n < 6; n++) x -= (x + ps * Math.sin(x) - w.articulation.stroke) / (1 + ps * Math.cos(x));
    return { position: toWorld(w.position), quaternion, fwd, strokePhase: x, articulation: w.articulation };
  });

  // Each whale swims on from its entry and turns onto the orbit's circle at a bounded rate, never
  // slower than its launch pace (so its heading can never swing round on the spot), steering clear
  // of the other, and joins the orbit once it is swimming along it. Integrated once, as a table
  // the film then plays (deterministic for this entry, so it plays the same in reverse).
  const L = whaleLength(0, size);
  const cruise = vLen(orbitJet(0, T, 0)[1]);
  const n = orbitNormal(0, T);
  const e1: V3 = [1, 0, 0];
  const e2 = vCross(n, e1);
  const azimuth = (x: V3) => Math.atan2(vDot(x, e2), vDot(x, e1));
  const wrap = (a: number) => Math.atan2(Math.sin(a), Math.cos(a));
  const lift = (i: number) => (i === 0 ? 0.16 : -0.16);
  const N = APPROACH_STEPS;
  const dp = JOIN_LATEST / N;
  const pos = whales.map((w) => w.position);
  const dir = whales.map((w) => w.fwd);
  const spin: V3[] = [[0, 0, 0], [0, 0, 0]];
  const angle = pos.map(azimuth);
  const tracks = [new Float64Array((N + 1) * 6), new Float64Array((N + 1) * 6)];
  // Where each is closest to swimming along its orbit (radius, height, heading), from PHASE.orbit
  const best = [{ k: N, miss: Infinity }, { k: N, miss: Infinity }];
  for (let k = 0; k <= N; k++) {
    const p = k * dp;
    const gather = lerp(LAUNCH, 1, smoother(0, T, p));
    // Pace themselves toward half a turn apart (what is left, the first lap makes up)
    const sync = 0.3 * Math.tanh(1.5 * wrap(angle[1] - angle[0] - Math.PI)) * smoother(0.15 * T, 0.75 * T, p);
    const next = pos.map((x, i) => {
      const speed = gather * cruise * (1 + (i === 0 ? sync : -sync));
      tracks[i].set([...x, ...vScale(dir[i], speed)], k * 6);
      // Along the circle in the orbit's sense, drawn onto its radius and its height
      const ring = orbitRadius(Math.max(p, T));
      const h = vDot(x, n);
      const flat = vSub(x, vScale(n, h));
      const rho = vLen(flat);
      const er = rho > 1e-4 ? vScale(flat, 1 / rho) : e1;
      const et = vCross(n, er);
      if (p >= T) {
        // A slight preference for joining early, so the whales circle as soon as they can
        const miss = Math.abs(rho - ring) / ring + 0.5 * Math.abs(h - lift(i)) + 3 * (1 - vDot(dir[i], et)) + 0.4 * (p - T);
        if (miss < best[i].miss) best[i] = { k, miss };
      }
      let want = vAdd(vAdd(et, vScale(er, -1.4 * Math.tanh((rho - ring) / (0.35 * ring)))), vScale(n, -1.2 * Math.tanh((h - lift(i)) / 0.5)));
      // ... and clear of the other whale, passing beside it rather than over or under
      const toOther = vSub(x, pos[1 - i]);
      const gap = vLen(toOther);
      const away = vSub(toOther, vScale(n, vDot(toOther, n)));
      if (gap < 1.4 * L) want = vAdd(want, vScale(away, (1.5 * (1.4 * L - gap)) / (0.4 * L) / Math.max(1e-4, vLen(away))));
      // Climbing or diving as a whale does, never steeper than MAX_PITCH (its back stays defined)
      want = vNorm(want);
      const rise = vDot(want, n);
      if (Math.abs(rise) > Math.sin(MAX_PITCH)) {
        const level = vNorm(vSub(want, vScale(n, rise)));
        want = vAdd(vScale(level, Math.cos(MAX_PITCH)), vScale(n, Math.sign(rise) * Math.sin(MAX_PITCH)));
      }
      // Turn toward it (with the circle's own turning fed forward, so it never swims wide of the
      // ring), the turn rate easing in like a heavy body's, no tighter than the swim's tightest curve
      const axis = vCross(dir[i], want);
      const turn = Math.atan2(vLen(axis), vDot(dir[i], want));
      const err = vLen(axis) > 1e-9 ? vScale(axis, turn / vLen(axis)) : vScale(n, turn);
      const follow = vScale(n, (speed / Math.max(0.5 * ring, rho)) * Math.max(0, vDot(dir[i], et)));
      spin[i] = vAdd(spin[i], vScale(vSub(vAdd(vScale(err, STEER_K), follow), spin[i]), 1 - Math.exp(-STEER_EASE * dp)));
      const rate = vLen(spin[i]);
      // The turn eases in: each first carries on along its own heading, then leans into the curve
      const cap = speed * MAX_CURVE * smoother(0, TURN_IN, p);
      if (rate > cap) spin[i] = vScale(spin[i], cap / rate);
      const th = Math.min(rate, cap) * dp;
      if (th > 0) {
        const u = vNorm(spin[i]);
        dir[i] = vNorm(vAdd(vAdd(vScale(dir[i], Math.cos(th)), vScale(vCross(u, dir[i]), Math.sin(th))), vScale(u, vDot(u, dir[i]) * (1 - Math.cos(th)))));
      }
      // Nor does the heading itself ever rear up past a whale's steepest climb or dive
      const pitch = vDot(dir[i], n);
      const limit = Math.sin(MAX_PITCH + 0.25);
      if (Math.abs(pitch) > limit) {
        const level = vNorm(vSub(dir[i], vScale(n, pitch)));
        dir[i] = vAdd(vScale(level, Math.sqrt(1 - limit * limit)), vScale(n, Math.sign(pitch) * limit));
      }
      return vAdd(x, vScale(dir[i], speed * dp));
    });
    next.forEach((x, i) => {
      angle[i] += wrap(azimuth(x) - azimuth(pos[i]));
      pos[i] = x;
    });
  }
  // Each joins its orbit where it arrived; the orbit's phase splits what is left of their half turn
  // apart, which they make up by SPACING_END. A short C2 correction before each join lands it
  // exactly on its orbit, at its pace and curve
  const joins = best.map((b) => b.k);
  const at = (tr: Float64Array, k: number): V3 => [tr[k * 6], tr[k * 6 + 1], tr[k * 6 + 2]];
  const vel = (tr: Float64Array, k: number): V3 => [tr[k * 6 + 3], tr[k * 6 + 4], tr[k * 6 + 5]];
  const own = [0, 1].map((i) => azimuth(at(tracks[i], joins[i])) - azimuth(orbitPosition(i, joins[i] * dp)));
  const phase = own[0] + wrap(own[1] - own[0]) / 2;
  const offsets: [number, number] = [wrap(own[0] - phase), wrap(own[1] - phase)];
  tracks.forEach((tr, i) => {
    const kj = joins[i];
    const from = Math.max(1, kj - Math.round(CORRECT_SPAN / dp));
    const span = (kj - from) * dp;
    const o = orbitJet(i, kj * dp, phase + offsets[i]);
    const zero: [V3, V3, V3] = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];
    const miss: [V3, V3, V3] = [vSub(o[0], at(tr, kj)), vSub(o[1], vel(tr, kj)), vSub(o[2], vScale(vSub(vel(tr, kj), vel(tr, kj - 1)), 1 / dp))];
    for (let k = from; k <= kj; k++) {
      const t = (k - from) / (kj - from);
      const a = Math.max(0, t - 1e-4), b = Math.min(1, t + 1e-4);
      const cv = vScale(vSub(quintic(zero, miss, span, b), quintic(zero, miss, span, a)), 1 / ((b - a) * span));
      tr.set([...vAdd(at(tr, k), quintic(zero, miss, span, t)), ...vAdd(vel(tr, k), cv)], k * 6);
    }
  });

  // The camera begins exactly where the ambient one stood: same view, scaled into the world
  return {
    phase,
    offsets,
    size,
    whales: whales.map((w, i) => ({ track: tracks[i], join: joins[i] * dp, up, strokePhase: w.strokePhase, articulation: w.articulation, position: w.position, quaternion: w.quaternion })),
    camera: { distance: depth * k, fov: entry.camera.fov }
  };
}

/** The approach table at u: cubic Hermite through each step's position and velocity. */
function trackAt(tr: Float64Array, u: number, last: number): V3 {
  const dp = JOIN_LATEST / APPROACH_STEPS;
  const x = Math.max(0, Math.min(last - 1e-9, u / dp));
  const k = Math.min(last - 1, Math.floor(x));
  const t = x - k;
  const t2 = t * t, t3 = t2 * t;
  const h00 = 2 * t3 - 3 * t2 + 1, h10 = t3 - 2 * t2 + t, h01 = -2 * t3 + 3 * t2, h11 = t3 - t2;
  const a = k * 6, b = a + 6;
  return [0, 1, 2].map((c) => h00 * tr[a + c] + h10 * dp * tr[a + 3 + c] + h01 * tr[b + c] + h11 * dp * tr[b + 3 + c]) as V3;
}

/** Whale i's swim: from its entry along the approach, then on its orbit. */
function enteredMotion(i: number, start: ConvergenceStart): WhaleMotion {
  const w = start.whales[i];
  const J = w.join;
  const last = Math.round(J / (JOIN_LATEST / APPROACH_STEPS));
  const base = whaleMotion(i, start.size);
  const v0: V3 = [w.track[3], w.track[4], w.track[5]];
  return {
    ...base,
    // Before the film the whale swims straight on along its heading (the approach starts at rest)
    path: (u) => (u >= J ? orbitPosition(i, u, start.phase + start.offsets[i] * (1 - smoother(J, SPACING_END, u))) : u <= 0 ? vAdd([w.track[0], w.track[1], w.track[2]], vScale(v0, u)) : trackAt(w.track, u, last)),
    up: (u) => (u >= J ? orbitNormal(i, u) : vNorm(vAdd(vScale(w.up, 1 - smoother(0, J, u)), vScale(orbitNormal(i, u), smoother(0, J, u))))),
    phase: w.strokePhase
  };
}

/** Whale i's pose at p, from the entry when there is one. */
function whalePose(i: number, p: number, size: number, start?: ConvergenceStart): WhalePose {
  if (!start) {
    const pose = sampleWhalePose(p, whaleMotion(i, size));
    const beat = beatBody(pose.quaternion, pose.articulation, pose.scale);
    return { ...pose, position: vAdd(pose.position, beat.offset), quaternion: beat.quaternion };
  }
  const w = start.whales[i];
  const pose = sampleWhalePose(p, enteredMotion(i, start));
  // The entry's lean, roll and articulation give way to the swim's: the stroke runs on unbroken
  const settle = smoother(0, SETTLE_END, p);
  const articulation = blendArticulation({ ...w.articulation, stroke: pose.articulation.stroke }, pose.articulation, settle);
  const beat = beatBody(pose.quaternion, articulation, pose.scale);
  // At p = 0 these corrections are exactly the difference to the entry's pose, then fade away
  const startPose = sampleWhalePose(0, enteredMotion(i, start));
  const startBeat = beatBody(startPose.quaternion, w.articulation, startPose.scale);
  const dq = qMul(w.quaternion, qConj(startBeat.quaternion));
  const dp = vSub(w.position, vAdd(startPose.position, startBeat.offset));
  return {
    ...pose,
    articulation,
    position: vAdd(vAdd(pose.position, beat.offset), vScale(dp, 1 - settle)),
    quaternion: qMul(qSlerp(dq, qIdentity(), settle), beat.quaternion)
  };
}

export function sampleConvergence(progress: number, view: ConvergenceView, start?: ConvergenceStart): ConvergenceFrame {
  const p = clamp01(progress);
  const aspect = view.width / Math.max(1, view.height);
  const portrait = isPortrait(view);

  // ---- Whales ----
  const size = start?.size ?? (portrait ? 1.3 : 1);
  const whales = [0, 1].map((i) => {
    const pose = whalePose(i, p, size, start);
    const dissolve = clamp01((p - PHASE.dissolve) / PHASE.dissolveSpan) * 1.06;
    return { ...pose, dissolve, visible: dissolve < 1.05 };
  });

  // ---- Camera ----
  const toEarth = smoothstep(0.6, 0.9, p);
  const half = Math.tan(((FOV_ORBIT / 2) * Math.PI) / 180);
  // Frame the orbit as large as the stage holds it: its diameter plus the bodies' reach past it,
  // a whale passing end-on at either side allowed to touch the frame's edge
  const r = orbitRadius(Math.max(p, start ? PHASE.orbit : 0));
  const extent = r + WHALE_LEN * size * (portrait ? 0.24 : 0.27);
  const fitW = extent / (half * aspect * (portrait ? 1.0 : 0.98));
  const fitH = (extent * 0.66) / (half * 0.88);
  const dOrbit = Math.max(fitW, fitH);
  const dEarth = earthDistance(view.globeR, view.height, FOV_EARTH);
  let dist = lerp(dOrbit, dEarth, toEarth);
  let fov = lerp(FOV_ORBIT, FOV_EARTH, toEarth);
  // Elevation: from just above the water line, up over the orbit, then level with the Earth
  const el = lerp(EL_START, portrait ? 40 : 26, smoothstep(0, 0.3, p)) * (1 - smoothstep(0.5, 0.9, p));
  // Azimuth: a slow drift against the swimmers, returning to face the Earth's first city
  const az = -34 * smoothstep(0.05, 0.42, p) * (1 - smoothstep(0.5, 0.88, p));
  const shift = smoothstep(0.55, 0.88, p);
  let centerY = lerp(view.height * (portrait ? 0.46 : 0.5), view.globeY, shift);
  if (start) {
    // The pull-back: from the ambient camera's own view (its field and reach), drawing back
    // smoothly into the orbit's framing; the apparent size of the whales eases with it
    const pull = smoother(0, PULL_END, p);
    const tanOf = (f: number) => Math.tan((f * Math.PI) / 360);
    const reach = Math.exp(lerp(Math.log(start.camera.distance * tanOf(start.camera.fov)), Math.log(dist * tanOf(fov)), pull));
    fov = lerp(start.camera.fov, fov, pull);
    dist = reach / tanOf(fov);
    centerY = lerp(view.height / 2, centerY, pull);
  }
  const camera: ConvergenceCamera = {
    position: vScale(cameraDir(el, az), dist),
    up: [0, 1, 0],
    fov,
    centerX: lerp(view.width / 2, view.globeX, shift),
    centerY
  };

  return {
    p,
    whales,
    camera,
    spin: earthSpin(p),
    ortho: smoothstep(0.86, 0.955, p),
    occlusion: 0.92 * smoothstep(0.6, 0.76, p),
    disc: smoothstep(0.78, 0.95, p),
    globeReveal: smoothstep(PHASE.handoff, PHASE.handoffEnd - 0.005, p),
    layer: 1 - smoothstep(PHASE.handoffEnd - 0.004, 1, p),
    orbitNormals: [orbitNormal(0, p), orbitNormal(1, p)],
    omega: orbitOmega(p),
    phase: start?.phase ?? 0
  };
}
