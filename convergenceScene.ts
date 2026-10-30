/**
 * The convergence: two humpbacks circle each other and become the Earth that the Global section's
 * journey then travels. A pure function of one progress value p ∈ [0, 1] (the scroll interval
 * that leads into the Globe's pinned stage): scrolling back plays every part of it in reverse,
 * stopping freezes it, and any p can be sampled directly.
 *
 *   0.00–0.15  approach   the whales swim in from either side on an inward spiral
 *   0.15–0.45  orbit      a slow, wide, banked circle around a shared centre, half a turn apart
 *   0.45–0.65  sphere     each orbit tilts away from the other, so together they trace a sphere;
 *                         the first glyphs stream off the flukes
 *   0.64–0.84  transform  the whales unravel tail-first into glyph streams that wrap the sphere
 *                         and settle as the continents and the graticule
 *   0.84–1.00  Earth      the spin settles on the journey's first city; the camera arrives at
 *                         the Globe's own framing and the stage hands over to it
 *
 * World: the Earth's centre is the origin, its radius 1; +Y is up. Whale conventions follow
 * whale3dPose.ts.
 */
import { sampleWhalePose, vCross, vNorm, type WhaleMotion, type WhalePose } from './whale3dPose.ts';
import type { V3 } from './whale3dAnatomy.ts';

export const EARTH_R = 1;
/** World units per whale body length. */
export const WHALE_LEN = 1.55;

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

export const clamp01 = (x: number) => Math.max(0, Math.min(1, x));
export const smoothstep = (a: number, b: number, x: number) => {
  const t = clamp01((x - a) / (b - a));
  return t * t * (3 - 2 * t);
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

/** Whale i's centre on its orbit at p (i = 1 swims half a turn ahead, a little lower). */
export function orbitPosition(i: number, p: number): V3 {
  const r = orbitRadius(p);
  const th = orbitAngle(p) + (i === 0 ? 0 : Math.PI);
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

/** Whale i's swim along its orbit; `size` scales the animal (larger on narrow, portrait stages). */
export function whaleMotion(i: number, size = 1): WhaleMotion {
  return {
    path: (u) => orbitPosition(i, u),
    up: (u) => orbitNormal(i, u),
    length: WHALE_LEN * size * (i === 0 ? 1 : 0.94),
    effort: (u) => effortAt(i, u),
    phase: i === 0 ? 0 : 2.3,
    stride: i === 0 ? 0.95 : 0.88,
    bankGain: 0.5,
    maxBank: 0.5
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
}

const FOV_ORBIT = 30;
const FOV_EARTH = 16;

/** Camera distance that shows the Earth (radius 1) at `rPx` on a stage `h` px tall. */
export function earthDistance(rPx: number, h: number, fovDeg: number): number {
  const t = Math.tan(((fovDeg / 2) * Math.PI) / 180);
  const k = (2 * rPx) / h; // projected radius in units of half-height
  // Silhouette of a sphere at distance d: 1 / sqrt(d² − 1) / tan(fov/2) half-heights
  return Math.sqrt(1 + 1 / (k * t) ** 2);
}

export function sampleConvergence(progress: number, view: ConvergenceView): ConvergenceFrame {
  const p = clamp01(progress);
  const aspect = view.width / Math.max(1, view.height);
  const portrait = aspect < 0.9;

  // ---- Whales ----
  const size = portrait ? 1.3 : 1;
  const whales = [0, 1].map((i) => {
    const pose = sampleWhalePose(p, whaleMotion(i, size));
    const dissolve = clamp01((p - PHASE.dissolve) / PHASE.dissolveSpan) * 1.06;
    return { ...pose, dissolve, visible: dissolve < 1.05 };
  });

  // ---- Camera ----
  const toEarth = smoothstep(0.6, 0.9, p);
  const fov = lerp(FOV_ORBIT, FOV_EARTH, toEarth);
  const half = Math.tan(((FOV_ORBIT / 2) * Math.PI) / 180);
  // Frame the orbit: its diameter plus a body length across the narrow side of the stage
  const r = orbitRadius(p);
  const extent = r + WHALE_LEN * size * (portrait ? 0.3 : 0.36);
  const fitW = extent / (half * aspect * (portrait ? 1.0 : 0.94));
  const fitH = (extent * 0.62) / (half * 0.86);
  const dOrbit = Math.max(fitW, fitH);
  const dEarth = earthDistance(view.globeR, view.height, FOV_EARTH);
  const dist = lerp(dOrbit, dEarth, toEarth);
  // Elevation: from just above the water line, up over the orbit, then level with the Earth
  const el = (lerp(10, portrait ? 40 : 26, smoothstep(0, 0.3, p)) * (1 - smoothstep(0.5, 0.9, p)) * Math.PI) / 180;
  // Azimuth: a slow drift against the swimmers, returning to face the Earth's first city
  const az = ((-34 * smoothstep(0.05, 0.42, p) * (1 - smoothstep(0.5, 0.88, p))) * Math.PI) / 180;
  const position: V3 = [dist * Math.cos(el) * Math.sin(az), dist * Math.sin(el), dist * Math.cos(el) * Math.cos(az)];
  const shift = smoothstep(0.55, 0.88, p);
  const camera: ConvergenceCamera = {
    position,
    up: [0, 1, 0],
    fov,
    centerX: lerp(view.width / 2, view.globeX, shift),
    centerY: lerp(view.height * (portrait ? 0.46 : 0.5), view.globeY, shift)
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
    omega: orbitOmega(p)
  };
}
