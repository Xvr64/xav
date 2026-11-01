/**
 * The convergence: two humpbacks circle each other and become the Earth that the Global section's
 * journey then travels. A pure function of one progress value p ∈ [0, 1] (the scroll interval
 * that leads into the Globe's pinned stage) and of where the film begins: scrolling back plays
 * every part of it in reverse, stopping freezes it, and any p can be sampled directly.
 *
 * It plays as one film on a steady clock (filmSeconds; 5.4 s with the hand-over onto the first
 * city), the same whatever the input that started it. Seconds as played:
 *
 *   0.00–0.20  approach   0.0–1.6 s  the ambient whales gather speed from wherever the viewer saw
 *                                    them along one planned curve each, onto the orbit, while the
 *                                    camera draws back over the whole approach
 *   0.20–0.45  orbit      1.6–2.3 s  one slow, wide, banked circle around a shared centre, settling
 *                                    half a turn apart (about one turn in all before they dissolve)
 *   0.45–0.60  sphere     2.3–2.8 s  each orbit tilts away from the other, so together they trace a
 *                                    sphere; the first glyphs stream off the flukes
 *   0.60–0.84  transform  2.8–3.7 s  the whales unravel tail-first into glyph ribbons that wrap the
 *                                    sphere at the whales' own pace and settle as the continents
 *                                    and the graticule, the circling easing all the while
 *   0.84–1.00  Earth      3.7–4.5 s  the spin settles on the journey's first city; the camera
 *                                    arrives at the Globe's own framing and the stage hands over
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
  dissolve: 0.6,
  dissolveSpan: 0.18,
  earth: 0.84,
  handoff: 0.955,
  handoffEnd: 0.99
} as const;

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

/**
 * The film's clock, in seconds at 1× (JourneyGlobe divides every duration by CINEMATIC_SPEED).
 * One gesture starts it; from then on it runs at one steady pace whatever the input: it gathers
 * from rest over `rise`, cruises, and eases over `fall` into the hand-over, still moving at `end`
 * of its cruise as the convergence completes; the Globe's segment (FILM_HANDOFF_SECONDS) then
 * brings it to rest on the first city. The whole film keeps the length of its first cut.
 */
export const FILM_TOTAL_SECONDS = 8.1;
export const FILM_HANDOFF_SECONDS = 1.35;
const PACE = { rise: 2.1, fall: 1.6, end: 0.5 };
const FILM_KNOTS = 24;
const PACE_N = 2400;
/** Progress at each step of the convergence's own seconds (1×), tabulated once. */
const PACE_P = new Float64Array(PACE_N + 1);
const WHALE_SECONDS = FILM_TOTAL_SECONDS - FILM_HANDOFF_SECONDS;
const paceShape = (s: number) => smoother(0, PACE.rise, s) * lerp(PACE.end, 1, smoother(WHALE_SECONDS, WHALE_SECONDS - PACE.fall, s));
for (let k = 1; k <= PACE_N; k++) PACE_P[k] = PACE_P[k - 1] + paceShape(((k - 0.5) / PACE_N) * WHALE_SECONDS);
for (let k = 1; k <= PACE_N; k++) PACE_P[k] /= PACE_P[PACE_N];
/** Progress per second (1×) at the convergence's end, where the hand-over takes the pace on. */
const PACE_END = (PACE_N * (PACE_P[PACE_N] - PACE_P[PACE_N - 1])) / WHALE_SECONDS;

/**
 * The pace as JourneyGlobe plays it: progress knots evenly spaced in time and the seconds between
 * them at 1×. Its timeline joins them smoothly, so the film follows the profile above.
 */
export const FILM_STOPS = Array.from({ length: FILM_KNOTS + 1 }, (_, k) => PACE_P[Math.round((k * PACE_N) / FILM_KNOTS)]);
export const FILM_SECONDS = Array.from({ length: FILM_KNOTS }, () => WHALE_SECONDS / FILM_KNOTS);

/** Real seconds into the film at progress p (the profile inverted; beyond it, its end pace). */
export function filmSeconds(p: number): number {
  const first = PACE_P[1] / (WHALE_SECONDS / PACE_N);
  if (p <= 0) return p / first / CINEMATIC_SPEED;
  if (p >= 1) return (WHALE_SECONDS + (p - 1) / PACE_END) / CINEMATIC_SPEED;
  let lo = 0, hi = PACE_N;
  while (hi - lo > 1) {
    const m = (lo + hi) >> 1;
    if (PACE_P[m] < p) lo = m; else hi = m;
  }
  const t = (p - PACE_P[lo]) / Math.max(1e-12, PACE_P[hi] - PACE_P[lo]);
  return ((lo + t) / PACE_N) * WHALE_SECONDS / CINEMATIC_SPEED;
}

/** Orbit radius: a spiral in from the sides, a wide orbit, then a tightening onto the sphere. */
export function orbitRadius(p: number): number {
  // C2 throughout, so the curve the whales swim never kinks where one stretch gives way to the next
  if (p < PHASE.orbit) return lerp(3.5, 1.82, smoother(0, PHASE.orbit, p));
  return 1.82 - 0.08 * smoother(PHASE.orbit, PHASE.sphere + 0.08, p) - 0.52 * smoother(PHASE.sphere - 0.05, PHASE.earth, p);
}

/** Turns the pair swims around their shared centre from joining the orbit to the first glyph. */
export const ORBIT_TURNS = 1.0;
/**
 * The circling's angular speed over film time, relative to its cruise: gathering on the approach,
 * one even, unhurried circle, then easing as the bodies unravel into the Earth (never spinning up).
 */
const omegaShape = (p: number) => lerp(0.45, 1, smoother(0, PHASE.orbit + 0.04, p)) * lerp(1, 0.55, smoother(PHASE.sphere + 0.05, PHASE.earth, p));

// Orbit angle: the integral of that angular speed over film seconds, tabulated once (monotone)
const TABLE_N = 4000;
const THETA = new Float64Array(TABLE_N + 1);
for (let i = 1; i <= TABLE_N; i++) {
  THETA[i] = THETA[i - 1] + omegaShape((i - 0.5) / TABLE_N) * (filmSeconds(i / TABLE_N) - filmSeconds((i - 1) / TABLE_N));
}
const OMEGA_CRUISE = (ORBIT_TURNS * 2 * Math.PI) / (THETA[Math.round(PHASE.dissolve * TABLE_N)] - THETA[Math.round(PHASE.orbit * TABLE_N)]);
for (let i = 1; i <= TABLE_N; i++) THETA[i] *= OMEGA_CRUISE;
/** Angular speed (radians per unit progress) at p: radians per second times seconds per unit progress. */
export const orbitOmega = (p: number) => {
  const q = clamp01(p);
  const h = 1e-3;
  return (OMEGA_CRUISE * omegaShape(q) * (filmSeconds(q + h) - filmSeconds(q - h))) / (2 * h);
};
/** Total angle swum around the centre by progress p (radians); whale B is half a turn ahead. */
export function orbitAngle(p: number): number {
  // Beyond the ends keep moving at the end speed, so a pose is defined for any p
  if (p < 0) return p * orbitOmega(0.002);
  if (p > 1) return THETA[TABLE_N] + (p - 1) * orbitOmega(1);
  const x = p * TABLE_N;
  const i = Math.min(TABLE_N - 1, Math.floor(x));
  return THETA[i] + (THETA[i + 1] - THETA[i]) * (x - i);
}

/** Tilt of each whale's orbit plane (radians, opposite signs): 0 while circling, then apart. */
export const orbitTilt = (p: number) => 0.66 * smoother(PHASE.sphere - 0.05, 0.68, p);
/** Slow precession of the line where the two orbit planes cross. */
const nodeAngle = (p: number) => 0.35 + 1.1 * smoother(PHASE.sphere - 0.03, PHASE.earth, p);

/** Unit normal of whale i's orbit plane at p: world up tilted about the line of nodes. */
export function orbitNormal(i: number, p: number): V3 {
  const t = (i === 0 ? 1 : -1) * orbitTilt(p);
  const a = nodeAngle(p);
  return [-Math.sin(a) * Math.sin(t), Math.cos(t), Math.cos(a) * Math.sin(t)];
}

/**
 * Whale i's centre on its orbit at p (i = 1 swims half a turn ahead, a little lower). `phase`
 * turns both places about the axis: where the orbit meets whales that swam in from the page; `dh`
 * raises it, where such a whale still settles onto the ring's height.
 */
export function orbitPosition(i: number, p: number, phase = 0, dh = 0): V3 {
  const r = orbitRadius(p);
  const th = orbitAngle(p) + phase + (i === 0 ? 0 : Math.PI);
  const a = nodeAngle(p);
  const n = orbitNormal(i, p);
  const e1: V3 = [Math.cos(a), 0, Math.sin(a)];
  const e2 = vNorm(vCross(n, e1));
  // A gentle helix: one whale rides a little above the other, and each rises and falls slowly
  // (a swell of the film's time, not of where on the circle: every phase is the same orbit)
  const lift = dh + (i === 0 ? 0.16 : -0.16) * (1 - smoothstep(0.55, 0.8, p)) + 0.07 * Math.sin(orbitAngle(p) * 0.5 + i * 1.7);
  return [
    r * (Math.cos(th) * e1[0] + Math.sin(th) * e2[0]) + lift * n[0],
    r * (Math.cos(th) * e1[1] + Math.sin(th) * e2[1]) + lift * n[1],
    r * (Math.cos(th) * e1[2] + Math.sin(th) * e2[2]) + lift * n[2]
  ];
}

/**
 * Swimming effort: strong strokes as they gather speed on the approach, an even cruise in the
 * orbit that swells and eases slowly (a breath every few seconds of film, never a flutter), and
 * long glides as they unravel.
 */
const effortAt = (i: number, p: number) =>
  lerp(1.2, 0.72, smoothstep(0.04, PHASE.orbit + 0.08, p)) + 0.12 * Math.sin(filmSeconds(p) * 1.9 + i * 2.4) * (1 - smoothstep(0.6, 0.8, p)) - 0.3 * smoothstep(0.66, 0.84, p);

/** Whale i's swim along its orbit with the shared rig; `size` scales the pair. */
export function whaleMotion(i: number, size = 1): WhaleMotion {
  return {
    path: (u) => orbitPosition(i, u),
    up: (u) => orbitNormal(i, u),
    length: whaleLength(i, size),
    effort: (u) => effortAt(i, u),
    phase: WHALE_RIG.phase[i],
    stride: WHALE_RIG.stride[i],
    bankGain: 0.42,
    maxBank: 0.36,
    rig: { powerStroke: WHALE_RIG.powerStroke, maxTurn: WHALE_RIG.maxTurn, maxClimb: WHALE_RIG.maxClimb, tailLag: WHALE_RIG.tailLag[i], leanWindow: WHALE_RIG.leanWindow, maxBeatHz: WHALE_RIG.maxBeatHz, cadence: WHALE_RIG.cadence },
    seconds: filmSeconds
  };
}

/** The Earth's remaining turn about its pole: it spins as it forms and settles on the first city. */
export const earthSpin = (p: number) => -1.2 * (1 - smoother(0.56, 0.955, p)) ** 2;

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
  /** Each whale's own orbit phase as it arrives, eased into `phase` over SPACING_SPAN. */
  offsets: [number, number];
  size: number;
  whales: {
    /** The approach from the entry to the orbit at PHASE.orbit: position and velocity per step. */
    track: Float64Array;
    /** Where it joins its orbit (progress). */
    join: number;
    /** How much higher than its ring it joins the orbit (eased away over SPACING_SPAN). */
    dh: number;
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
/** The camera's draw-back into the orbit's framing, in seconds of the film: it starts as the
 * whales set off and is spread over their whole approach, so they recede steadily, never in a rush. */
const PULL_SECONDS: [number, number] = [0.15, 2.1];
/** The entry's own lean, roll and articulation have given way to the swim by this progress. */
const SETTLE_END = 0.11;
/** The approach's opening pace along the whale's own heading, as a share of its orbit speed. */
const LAUNCH = 0.45;
/** Steps of the approach's table. */
const APPROACH_STEPS = 832;
/** Where a whale may join its orbit (progress): the earliest gives the camera's pull-back time to
 * frame the circle, the latest leaves a whole, unhurried circle before the glyphs leave them. */
const JOIN_EARLIEST = 0.2;
const JOIN_LATEST = 0.32;
/** Candidate places on the orbit a whale weighs joining at (per whale, per join time). */
const JOIN_CANDIDATES = 72;
/** The tightest comfortable curve of the approach (turning radius, body lengths), its steepest
 * climb or dive (radians), and the slowest it may ease to (share of its orbit pace). */
const TURN_RADIUS = 1.1;
const MAX_PITCH = 0.42;
const MIN_PACE = 0.4;
/** Share of the height between a whale's entry and its ring that it makes up on the approach
 * (the rest it gains slowly on the orbit). */
const CLIMB_SHARE = 0.55;
/** Progress after its join over which a whale makes up what is left of the half turn between the
 * two (and its height), and the most of it either may have to make up (radians): a gentle
 * quickening or easing of its swim, never a stall, so the two circle half a turn apart well before
 * any glyph leaves them. */
const SPACING_SPAN = 0.26;
const MAX_SPACING = 0.55;

/** Camera distance that shows the Earth (radius 1) at `rPx` on a stage `h` px tall. */
export function earthDistance(rPx: number, h: number, fovDeg: number): number {
  const t = Math.tan(((fovDeg / 2) * Math.PI) / 180);
  const k = (2 * rPx) / h; // projected radius in units of half-height
  // Silhouette of a sphere at distance d: 1 / sqrt(d² − 1) / tan(fov/2) half-heights
  return Math.sqrt(1 + 1 / (k * t) ** 2);
}

/**
 * Quintic Hermite through (p0, v0, a0) at t = 0 and (p1, v1, a1) at t = 1 (C2 at both ends), the
 * derivatives given per unit of the span T; `d` = 1 or 2 returns its velocity or acceleration
 * per unit of that span.
 */
function quintic(from: [V3, V3, V3], to: [V3, V3, V3], T: number, t: number, d = 0): V3 {
  const t2 = t * t, t3 = t2 * t, t4 = t3 * t, t5 = t4 * t;
  const h =
    d === 0
      ? [1 - 10 * t3 + 15 * t4 - 6 * t5, t - 6 * t3 + 8 * t4 - 3 * t5, 0.5 * t2 - 1.5 * t3 + 1.5 * t4 - 0.5 * t5, 0.5 * t3 - t4 + 0.5 * t5, -4 * t3 + 7 * t4 - 3 * t5, 10 * t3 - 15 * t4 + 6 * t5]
      : d === 1
        ? [-30 * t2 + 60 * t3 - 30 * t4, 1 - 18 * t2 + 32 * t3 - 15 * t4, t - 4.5 * t2 + 6 * t3 - 2.5 * t4, 1.5 * t2 - 4 * t3 + 2.5 * t4, -12 * t2 + 28 * t3 - 15 * t4, 30 * t2 - 60 * t3 + 30 * t4]
        : [-60 * t + 180 * t2 - 120 * t3, -36 * t + 96 * t2 - 60 * t3, 1 - 9 * t + 18 * t2 - 10 * t3, 3 * t - 12 * t2 + 10 * t3, -24 * t + 84 * t2 - 60 * t3, 60 * t - 180 * t2 + 120 * t3];
  const k = T ** -d;
  const out: V3 = [0, 0, 0];
  for (let c = 0; c < 3; c++) {
    out[c] = k * (h[0] * from[0][c] + h[1] * from[1][c] * T + h[2] * from[2][c] * T * T + h[3] * to[2][c] * T * T + h[4] * to[1][c] * T + h[5] * to[0][c]);
  }
  return out;
}

/** Position, velocity and acceleration of the orbit at p (per unit progress). */
function orbitJet(i: number, p: number, phase: number, dh = 0): [V3, V3, V3] {
  const h = 1e-3;
  const a = orbitPosition(i, p - h, phase, dh);
  const b = orbitPosition(i, p, phase, dh);
  const c = orbitPosition(i, p + h, phase, dh);
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

  const whales = entry.whales.slice(0, 2).map((w, i) => {
    const quaternion = qMul(qR, w.quaternion);
    const fwd = qRotate(quaternion, [0, 0, -1]);
    // Raw stroke phase whose power-stroke warp lands on the entry's stroke (Newton steps)
    const ps = WHALE_RIG.powerStroke;
    let x = w.articulation.stroke;
    for (let n = 0; n < 6; n++) x -= (x + ps * Math.sin(x) - w.articulation.stroke) / (1 + ps * Math.cos(x));
    return { position: toWorld(w.position), quaternion, fwd, strokePhase: x, articulation: w.articulation };
  });

  // Each whale swims on from its entry along one planned C2 curve onto its orbit: a quintic from
  // its place, heading and opening pace to the orbit's place, pace and curve where it joins. Of
  // every place and moment it could join, it takes the one its own heading leads to most
  // naturally: wide curves, a shallow climb, no slowing to turn on the spot and no turn it then
  // has to undo, clear of the other whale, the two arriving close to half a turn apart. Computed
  // once per entry, as a table the film plays (deterministic, so it plays the same in reverse).
  const L = whaleLength(0, size);
  const N = APPROACH_STEPS;
  const dp = JOIN_LATEST / N;
  const wrap = (a: number) => Math.atan2(Math.sin(a), Math.cos(a));
  const M = 24;
  type Plan = { k: number; phase: number; dh: number; from: [V3, V3, V3]; to: [V3, V3, V3]; cost: number };
  const curve = (pl: Plan, p: number) => quintic(pl.from, pl.to, pl.k * dp, Math.min(1, p / (pl.k * dp)));
  const plans = whales.map((w, i) => {
    // The best moment to join at each place on the orbit
    const out: Plan[] = [];
    const kStep = Math.round(0.03 / dp);
    for (let k = Math.round(JOIN_EARLIEST / dp); k <= N; k += kStep) {
      const J = k * dp;
      const n = orbitNormal(i, J);
      const cruise = vLen(orbitJet(i, J, 0)[1]);
      const from: [V3, V3, V3] = [w.position, vScale(w.fwd, LAUNCH * cruise), [0, 0, 0]];
      for (let c = 0; c < JOIN_CANDIDATES; c++) {
        const phase = (c / JOIN_CANDIDATES) * 2 * Math.PI;
        const dh = (vDot(w.position, n) - vDot(orbitPosition(i, J, phase), n)) * (1 - CLIMB_SHARE);
        const to = orbitJet(i, J, phase, dh);
        // Its curvature (against the comfortable turn), climb, pace and turning along the way
        let bend = 0, over = 0, turned = 0;
        let prev: V3 | null = null;
        for (let m = 0; m <= M; m++) {
          const v = quintic(from, to, J, m / M, 1);
          const acc = quintic(from, to, J, m / M, 2);
          const speed = Math.max(1e-6, vLen(v));
          const kappa = (vLen(vCross(v, acc)) / speed ** 3) * L * TURN_RADIUS;
          const tangent = vScale(v, 1 / speed);
          bend += (kappa * kappa) / (M + 1);
          over = Math.max(over, kappa - 1, (MIN_PACE - speed / cruise) / MIN_PACE, (Math.abs(vDot(tangent, n)) - Math.sin(MAX_PITCH)) * 4);
          if (prev) turned += Math.acos(Math.max(-1, Math.min(1, vDot(prev, tangent))));
          prev = tangent;
        }
        const net = Math.acos(Math.max(-1, Math.min(1, vDot(w.fwd, vNorm(to[1])))));
        const cost = bend + 6 * Math.max(0, over) + 0.8 * Math.max(0, turned - net) + 0.3 * (J - JOIN_EARLIEST) / (JOIN_LATEST - JOIN_EARLIEST);
        if (!out[c] || cost < out[c].cost) out[c] = { k, phase, dh, from, to, cost };
      }
    }
    return out.sort((x, y) => x.cost - y.cost);
  });
  // The pair: each its own best, unless they would crowd each other or arrive far from half a
  // turn apart (what spacing is left, the first part of the circle makes up)
  let pick: [Plan, Plan] = [plans[0][0], plans[1][0]];
  let bestCost = Infinity;
  const end = Math.max(...plans.flatMap((list) => list.map((pl) => pl.k))) * dp;
  const at = (pl: Plan, i: number, p: number) => (p < pl.k * dp ? curve(pl, p) : orbitPosition(i, p, pl.phase, pl.dh));
  for (const a of plans[0]) {
    if (a.cost + plans[1][0].cost >= bestCost) break;
    for (const b of plans[1]) {
      const spacing = Math.abs(wrap(b.phase - a.phase)) / 2;
      const known = a.cost + b.cost + 5 * spacing + 20 * Math.max(0, spacing - MAX_SPACING);
      if (known >= bestCost) continue;
      let gap = Infinity;
      for (let m = 1; m <= M; m++) gap = Math.min(gap, vLen(vSub(at(a, 0, (m / M) * end), at(b, 1, (m / M) * end))));
      const cost = known + 6 * Math.max(0, (1.3 * L - gap) / L);
      if (cost < bestCost) {
        bestCost = cost;
        pick = [a, b];
      }
    }
  }
  const phase = pick[0].phase + wrap(pick[1].phase - pick[0].phase) / 2;
  const offsets: [number, number] = [wrap(pick[0].phase - phase), wrap(pick[1].phase - phase)];
  const tracks = pick.map((pl) => {
    const tr = new Float64Array((N + 1) * 6);
    const J = pl.k * dp;
    for (let k = 0; k <= pl.k; k++) tr.set([...quintic(pl.from, pl.to, J, k / pl.k), ...quintic(pl.from, pl.to, J, k / pl.k, 1)], k * 6);
    return tr;
  });

  // The camera begins exactly where the ambient one stood: same view, scaled into the world
  return {
    phase,
    offsets,
    size,
    whales: whales.map((w, i) => ({ track: tracks[i], join: pick[i].k * dp, dh: pick[i].dh, up, strokePhase: w.strokePhase, articulation: w.articulation, position: w.position, quaternion: w.quaternion })),
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
    path: (u) => {
      if (u <= 0) return vAdd([w.track[0], w.track[1], w.track[2]], vScale(v0, u));
      if (u < J) return trackAt(w.track, u, last);
      const k = 1 - smoother(J, J + SPACING_SPAN, u);
      return orbitPosition(i, u, start.phase + start.offsets[i] * k, w.dh * k);
    },
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
  // Azimuth: a slow drift along with the swimmers (it calms their circling rather than adding to
  // it), returning to face the Earth's first city
  const az = 16 * smoother(0.05, 0.45, p) * (1 - smoother(0.5, 0.88, p));
  const shift = smoothstep(0.55, 0.88, p);
  let centerY = lerp(view.height * (portrait ? 0.46 : 0.5), view.globeY, shift);
  if (start) {
    // The pull-back: from the ambient camera's own view (its field and reach), drawing back
    // smoothly into the orbit's framing; the apparent size of the whales eases with it
    const pull = smoother(PULL_SECONDS[0], PULL_SECONDS[1], filmSeconds(p));
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
