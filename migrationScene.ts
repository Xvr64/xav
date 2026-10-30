/**
 * The migration: the cinematic interval between the cover's name and the introduction.
 *
 * One scroll value p ∈ [0, 1] yields everything: a perspective camera, the two whales' swim
 * through one ocean, the trails they leave and a separate, rotating Earth ahead of them.
 * Every function here is pure: the same p always produces the same frame, so stopping holds
 * one exact frame and scrolling back replays the same frames in reverse.
 *
 * World: the ocean surface is the plane z = 0, x runs east, y ahead (the way the whales swim),
 * z up. One unit is the main whale's length. The whales keep their own bodies throughout: the
 * Earth is its own object, a sphere ahead of them that they swim toward and never reach.
 *
 * Storyboard (p):
 *   01  0.00–0.12  the name leaves; the camera settles above the water
 *   02  0.12–0.35  overhead tracking, the ocean moving past the whales
 *   03  0.35–0.60  the long migration, thin trails left in the water
 *   04  0.60–0.80  the camera pulls back and tilts toward the horizon; the Earth appears on it
 *   05  0.80–0.93  wide: the camera tilts back down onto the Earth, the whales small before it
 *   06  0.93–1.00  the camera settles; the introduction follows
 */

export type V3 = [number, number, number];

const clamp01 = (v: number) => Math.max(0, Math.min(1, v));
/** Smoothstep of v over [a, b] */
export const ease = (v: number, a: number, b: number) => {
  if (b <= a) return v >= b ? 1 : 0;
  const t = clamp01((v - a) / (b - a));
  return t * t * (3 - 2 * t);
};
const mix = (a: number, b: number, t: number) => a + (b - a) * t;
/** Derivative of ease(v, a, b) with respect to v */
const easeSlope = (v: number, a: number, b: number) => {
  if (v <= a || v >= b) return 0;
  const t = (v - a) / (b - a);
  return (6 * t * (1 - t)) / (b - a);
};
const DEG = Math.PI / 180;

// ---------------------------------------------------------------------------------------------
// The swim: distance covered as a function of p
// ---------------------------------------------------------------------------------------------

/** Whale lengths covered over the whole migration */
export const TRAVEL = 46;
/**
 * Swim speed through the storyboard: a gradual start, a steady cruise, faster in world terms
 * once the camera has pulled back (the same pace on screen covers more ocean), and a glide to
 * rest as the camera settles.
 */
const swimSpeed = (p: number) => ease(p, 0, 0.16) * (1 + 1.5 * ease(p, 0.5, 0.84)) * (1 - 0.8 * ease(p, 0.88, 1));
const TRAVEL_SAMPLES = 1024;
const travelTable = (() => {
  const table = new Float64Array(TRAVEL_SAMPLES + 1);
  for (let i = 1; i <= TRAVEL_SAMPLES; i++) table[i] = table[i - 1] + swimSpeed((i - 0.5) / TRAVEL_SAMPLES);
  const total = table[TRAVEL_SAMPLES];
  for (let i = 0; i <= TRAVEL_SAMPLES; i++) table[i] = (table[i] / total) * TRAVEL;
  return table;
})();
/** Distance the main whale's head has swum at p (monotonic, 0 at p = 0, TRAVEL at p = 1) */
export function travelAt(p: number): number {
  const f = clamp01(p) * TRAVEL_SAMPLES;
  const i = Math.min(TRAVEL_SAMPLES - 1, Math.floor(f));
  return travelTable[i] + (travelTable[i + 1] - travelTable[i]) * (f - i);
}

// ---------------------------------------------------------------------------------------------
// The two whales: one lane each, written as x (and depth) along y
// ---------------------------------------------------------------------------------------------

const mainX = (y: number) => 0.95 * Math.sin(y / 7.2 + 0.5) + 0.32 * Math.sin(y / 3.4 + 1.9);
const mainDx = (y: number) => (0.95 / 7.2) * Math.cos(y / 7.2 + 0.5) + (0.32 / 3.4) * Math.cos(y / 3.4 + 1.9);

/**
 * Each whale's lane: x(y) with its slope, and the depth it swims at. The main whale drifts in
 * long, slightly irregular curves; the calf keeps to its left and a little behind, with its own
 * slower sway, surging up beside it and falling back: a formation, never a copy.
 */
export const WHALES = [
  {
    length: 1,
    x: mainX,
    dx: mainDx,
    z: (y: number) => -0.12 - 0.05 * Math.sin(y / 6.1),
    /** Tail beats per whale length swum */
    beat: 1 / 1.7,
    phase: 0
  },
  {
    length: 0.58,
    // Wider apart in the last stretch, where the camera is far and they would read as one
    x: (y: number) => mainX(y) - 0.66 - 0.5 * ease(y, 24, 40) + 0.17 * Math.sin(y / 4.3 + 2.3),
    dx: (y: number) => mainDx(y) - 0.5 * easeSlope(y, 24, 40) + (0.17 / 4.3) * Math.cos(y / 4.3 + 2.3),
    z: (y: number) => -0.1 - 0.06 * Math.sin(y / 3.9 + 1),
    beat: 1 / 1.05,
    phase: 1.7
  }
] as const;

/** Where whale `i`'s head is along its lane (y) when the main whale has swum `travel` */
export function headY(i: number, travel: number): number {
  if (i === 0) return travel;
  return travel - 0.36 + 0.22 * Math.sin(travel / 5.3 + 0.8);
}

/**
 * Body nodes of whale `i` from the head back, spaced by arc length along its own lane, so the
 * body follows the exact path the head took. Writes `count` nodes into xs / ys / zs.
 */
export function spineAlongLane(
  i: number,
  head: number,
  count: number,
  xs: Float64Array | Float32Array,
  ys: Float64Array | Float32Array,
  zs: Float64Array | Float32Array
) {
  const lane = WHALES[i];
  const ds = lane.length / (count - 1);
  let y = head;
  for (let k = 0; k < count; k++) {
    xs[k] = lane.x(y);
    ys[k] = y;
    zs[k] = lane.z(y);
    const slope = lane.dx(y);
    y -= ds / Math.sqrt(1 + slope * slope);
  }
}

/** Swim stroke phase (radians): tail beats advance with distance swum, so they stop with the scroll */
export const strokeAt = (i: number, travel: number) => WHALES[i].phase + headY(i, travel) * WHALES[i].beat * Math.PI * 2;

/** Trails begin where the whales were as the long migration starts */
export const TRAIL_FROM = travelAt(0.3);

// ---------------------------------------------------------------------------------------------
// The camera
// ---------------------------------------------------------------------------------------------

export interface Camera {
  /** Position in world units */
  x: number;
  y: number;
  z: number;
  /** Right, up and forward unit vectors */
  r: V3;
  u: V3;
  f: V3;
  /** Focal length in px, and the screen point the view axis passes through */
  focal: number;
  ox: number;
  oy: number;
}

/** Viewport the frame is composed for; `whalePx` is the main whale's length in px at the start */
export interface SceneViewport {
  w: number;
  h: number;
  whalePx: number;
}

/** Lens: a moderate vertical field of view (about 44°) on every screen */
export const focalFor = (h: number) => h / (2 * Math.tan(22 * DEG));

/**
 * Camera at p, set from the whales: how far it is from them (their size on screen), where they
 * sit in the frame, and its pitch (how far ahead it looks). Straight down while tracking; then
 * it pulls back and tilts up toward the horizon, where the Earth appears small and far; as the
 * whales close in it tilts back down onto the Earth (an orbital reframing) and settles. A
 * slight yaw follows the whales' turns, late, like a camera operator: never a spin.
 * `earthX` lets the frame drift toward the Earth as it is revealed.
 */
export function cameraAt(p: number, vp: SceneViewport, earthX = 0): Camera {
  const focal = focalFor(vp.h);
  // Distance at which one whale length is `whalePx` on screen
  const base = focal / Math.max(1, vp.whalePx);

  const travel = travelAt(p);
  const lead = WHALES[0];
  // The anchor: a point between the two whales
  const midY = travel - 0.42;
  const midX = (lead.x(midY) + WHALES[1].x(midY)) * 0.5;
  const midZ = -0.12;

  const reveal = ease(p, 0.58, 0.9);
  // Phones pull back less, so the whales stay legible on the small screen
  const pull = vp.w < 768 ? 0.55 : 1;
  const dist =
    base *
    (1 +
      0.18 * ease(p, 0.1, 0.35) +
      (vp.w < 768 ? 0.55 : 0.95) * ease(p, 0.33, 0.62) +
      pull * (1.0 * ease(p, 0.58, 0.74) + 1.25 * ease(p, 0.7, 0.95)));
  const pitch = DEG * (5 * ease(p, 0.14, 0.4) + 9 * ease(p, 0.36, 0.62) + 60 * ease(p, 0.58, 0.72) - 14 * ease(p, 0.72, 0.95));
  // Screen height of the anchor (fraction of the viewport): the whales rise into the upper
  // middle for the long migration, so the water they leave behind (and their trails) is in
  // frame, then settle low, with the Earth ahead of them
  const anchorY = mix(mix(0.58, 0.4, ease(p, 0.16, 0.42)), 0.77, ease(p, 0.6, 0.88));

  // The yaw leans gently into the lane's turns, a few whale lengths late, and settles at the end
  const yaw = -0.32 * Math.atan(lead.dx(midY - 3)) * (1 - 0.7 * ease(p, 0.7, 0.95));

  const hx = -Math.sin(yaw);
  const hy = Math.cos(yaw);
  const sp = Math.sin(pitch);
  const cp = Math.cos(pitch);
  const f: V3 = [hx * sp, hy * sp, -cp];
  const u: V3 = [hx * cp, hy * cp, sp];
  const r: V3 = [Math.cos(yaw), Math.sin(yaw), 0];
  const oy = vp.h * 0.47;
  // The ray to the anchor leaves the camera this far below the view axis
  const below = Math.atan((vp.h * anchorY - oy) / focal);
  const down = Math.PI / 2 - pitch + below;
  const back = dist * Math.cos(down);
  return {
    x: mix(midX, (midX + earthX) * 0.5, reveal * 0.5) - hx * back,
    y: midY - hy * back,
    z: midZ + dist * Math.sin(down),
    r,
    u,
    f,
    focal,
    ox: vp.w * 0.5,
    oy
  };
}

/** Screen projection of a world point: px position, px per world unit, and depth */
export interface Projected {
  x: number;
  y: number;
  scale: number;
  depth: number;
}
export function project(cam: Camera, X: number, Y: number, Z: number, out: Projected): Projected {
  const dx = X - cam.x;
  const dy = Y - cam.y;
  const dz = Z - cam.z;
  const depth = Math.max(1e-3, dx * cam.f[0] + dy * cam.f[1] + dz * cam.f[2]);
  const k = cam.focal / depth;
  out.x = cam.ox + (dx * cam.r[0] + dy * cam.r[1] + dz * cam.r[2]) * k;
  out.y = cam.oy - (dx * cam.u[0] + dy * cam.u[1] + dz * cam.u[2]) * k;
  out.scale = k;
  out.depth = depth;
  return out;
}

/** Screen y of the horizon (−Infinity while the camera looks too steeply down to see it) */
export function horizonY(cam: Camera): number {
  const up = Math.PI / 2 - Math.acos(Math.max(-1, Math.min(1, -cam.f[2])));
  return up <= 0.02 ? -Infinity : cam.oy - cam.focal * Math.tan(up);
}

// ---------------------------------------------------------------------------------------------
// The Earth, ahead of the whales
// ---------------------------------------------------------------------------------------------

/** The Earth in world units: radius and centre */
export interface Earth {
  r: number;
  x: number;
  y: number;
  z: number;
}

/** Where the Earth sits in the final frame: centre (viewport fractions) and radius (px) */
export const earthFrame = (w: number, h: number) =>
  w < 768 ? { x: 0.5, y: 0.31, r: Math.min(h * 0.19, w * 0.4) } : { x: 0.57, y: 0.3, r: h * 0.22 };

/**
 * The Earth's place in the world for this viewport: on the ray through its spot in the final
 * frame, at the water's level, sized to its final radius. Placed once per viewport, it then
 * stays put while the camera and the whales move toward it.
 */
export function earthFor(vp: SceneViewport): Earth {
  const spot = earthFrame(vp.w, vp.h);
  const z = 0.2;
  // The final frame drifts toward the Earth, so placing it moves the camera a quarter as far:
  // a few passes settle it to a fraction of a pixel
  let earth: Earth = { x: 0, y: 0, z, r: 1 };
  for (let pass = 0; pass < 6; pass++) {
    const cam = cameraAt(1, vp, earth.x);
    const a = (spot.x * vp.w - cam.ox) / cam.focal;
    const b = (spot.y * vp.h - cam.oy) / cam.focal;
    const dx = cam.f[0] + a * cam.r[0] - b * cam.u[0];
    const dy = cam.f[1] + a * cam.r[1] - b * cam.u[1];
    const dz = cam.f[2] + a * cam.r[2] - b * cam.u[2];
    // The ray's forward component is 1, so its parameter is the depth along the view axis
    const t = (z - cam.z) / Math.min(-1e-3, dz);
    earth = { x: cam.x + t * dx, y: cam.y + t * dy, z, r: (spot.r * t) / cam.focal };
  }
  return earth;
}

/** Longitude (degrees) at the centre of the Earth's face: the Atlantic → Europe & the Gulf → Asia */
export const EARTH_TURN = { from: -42, to: 104 };

/**
 * The Earth's rotation and tilt at p: one controlled arc of about 150° that runs while it is
 * on screen and comes to rest with the camera: never a decorative spin.
 */
export function earthView(p: number) {
  const turn = ease(p, 0.62, 0.99);
  return {
    lon: mix(EARTH_TURN.from, EARTH_TURN.to, turn),
    // Seen a little more from the north as the camera rises over it
    lat: 14 + 10 * ease(p, 0.72, 0.95)
  };
}

// ---------------------------------------------------------------------------------------------
// The ocean, anchored in the world
// ---------------------------------------------------------------------------------------------

/**
 * Swell height at a point on the water, −1..1: long swells, a crossing sea and a fine chop,
 * each running its own way as p advances. `fine` (0..1) fades the chop out where a screen cell
 * covers too much water to resolve it (far away), so the distance never aliases into noise.
 */
export function swellAt(X: number, Y: number, p: number, fine: number): number {
  const a = Math.sin(0.56 * X + 2.17 * Y - 9 * p);
  const b = Math.sin(-2.5 * X + 3.35 * Y + 6 * p + 1.3);
  const c = Math.sin(8.1 * X + 3.95 * Y - 14 * p + 0.4);
  return 0.56 * a + (0.28 + 0.06 * (1 - fine)) * b + 0.16 * fine * c;
}

// ---------------------------------------------------------------------------------------------
// Stage weights: what is on screen, and how strongly
// ---------------------------------------------------------------------------------------------

/**
 * `engage` hands the whales from their own swim to the scene (and back after the handoff);
 * `water` brings in the world-anchored ocean field; `snow` the deep particles that give the
 * tracking shots their parallax; `trails` the traces left behind the whales; `earth` the globe.
 * `handoff` ∈ [0, 1] runs over the viewport of scrolling after the stage releases, while the
 * introduction rises.
 */
export function stagesAt(p: number, handoff = 0) {
  const leave = ease(handoff, 0.05, 0.65);
  return {
    engage: ease(p, 0.02, 0.14) * (1 - leave),
    water: ease(p, 0.03, 0.16) * (1 - ease(handoff, 0, 0.5)),
    snow: ease(p, 0.08, 0.2) * (1 - ease(p, 0.6, 0.72)),
    trails: ease(p, 0.36, 0.46) * (1 - ease(p, 0.86, 0.97)),
    earth: ease(p, 0.62, 0.7) * (1 - ease(handoff, 0.18, 0.7))
  };
}
