/**
 * The migration: the cinematic interval between the cover's name and the introduction.
 *
 * One scroll value p ∈ [0, 1] yields everything: a perspective camera, the two whales' swim
 * across one ocean, the wakes they leave and the turn of the planet beneath them. Every
 * function here is pure: the same p always produces the same frame, so stopping holds one
 * exact frame and scrolling back replays the same frames in reverse.
 *
 * The planet is a real sphere of radius PLANET_R (one unit is the main whale's length) whose
 * surface is the ocean. It has two frames:
 *   - the Earth's own: x toward 0°N 0°E, z the north pole. The water, its swell and its chart
 *     lines are fixed here, and so are the whales' positions (latitude and longitude);
 *   - the world, in which the camera sits: world = spin(p) · earth, a turn about the pole.
 * The whales swim a great circle from the South Atlantic, past the Cape and through the
 * Roaring Forties, into the Indian Ocean: about 110° of the globe. Their lanes are written in
 * route coordinates (y the distance along the route, x the offset to its right, z the depth)
 * and laneToEarth places them on the sphere. The Earth's spin is the whales' own progress in
 * longitude, so the planet turns beneath a camera that holds its meridian of the world while
 * the whales cross it. The camera stays low, in the ocean's local frame, looking down: every
 * ray from it meets the water, so there is no rim, no horizon and no planet to see — only sea.
 *
 * Storyboard (p):
 *   01  0.00–0.15  the name leaves; the camera settles above the two whales, already swimming
 *   02  0.15–0.40  overhead tracking: the water moves past them, wakes open behind them
 *   03  0.40–0.75  the long migration: faster, a little higher; the sea changes as they go
 *   04  0.75–0.90  the final shot: the camera lowers and reframes them, ocean edge to edge
 *   05  0.90–1.00  they glide; the introduction follows as the scene leaves with the page
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
export const TRAVEL = 52;
/**
 * Swim speed through the storyboard: a gradual start, a steady cruise, the long migration at
 * more than twice the pace (the camera is a little higher, so it reads as the same stroke over
 * more ocean), easing for the final shot and a glide as the introduction arrives.
 */
const swimSpeed = (p: number) =>
  ease(p, 0, 0.15) * (1 + 1.3 * ease(p, 0.38, 0.6)) * (1 - 0.45 * ease(p, 0.74, 0.9)) * (1 - 0.6 * ease(p, 0.9, 1));
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
// The two whales: one lane each, written as x (and depth) along y, in route coordinates
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
    // A little wider apart over the long migration, where the camera is higher
    x: (y: number) => mainX(y) - 0.66 - 0.3 * ease(y, 14, 26) + 0.17 * Math.sin(y / 4.3 + 2.3),
    dx: (y: number) => mainDx(y) - 0.3 * easeSlope(y, 14, 26) + (0.17 / 4.3) * Math.cos(y / 4.3 + 2.3),
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

/** Trails begin where the whales were as the tracking begins */
export const TRAIL_FROM = travelAt(0.12);

// ---------------------------------------------------------------------------------------------
// The planet and the route
// ---------------------------------------------------------------------------------------------

/** The ocean's radius, in whale lengths */
export const PLANET_R = 27;

const unitLatLon = (lat: number, lon: number): V3 => [
  Math.cos(lat * DEG) * Math.cos(lon * DEG),
  Math.cos(lat * DEG) * Math.sin(lon * DEG),
  Math.sin(lat * DEG)
];
/** The route's southernmost point, south of the Cape of Good Hope, where it heads due east */
const ROUTE_A = unitLatLon(-38, 25);
const ROUTE_B: V3 = [-Math.sin(25 * DEG), Math.cos(25 * DEG), 0];
/** To the whales' right (ahead × up): the route's pole */
const ROUTE_N: V3 = [
  ROUTE_B[1] * ROUTE_A[2] - ROUTE_B[2] * ROUTE_A[1],
  ROUTE_B[2] * ROUTE_A[0] - ROUTE_B[0] * ROUTE_A[2],
  ROUTE_B[0] * ROUTE_A[1] - ROUTE_B[1] * ROUTE_A[0]
];
/** Route angle at y = 0: the journey is centred on the vertex */
const S0 = -TRAVEL / 2 / PLANET_R;

/** A point given in route coordinates (x right, y along, z up from the surface), in the Earth's frame */
export function laneToEarth(x: number, y: number, z: number, out: V3): V3 {
  const s = S0 + y / PLANET_R;
  const q = x / PLANET_R;
  const rad = PLANET_R + z;
  const cs = Math.cos(s);
  const ss = Math.sin(s);
  const cq = Math.cos(q) * rad;
  const sq = Math.sin(q) * rad;
  out[0] = cq * (cs * ROUTE_A[0] + ss * ROUTE_B[0]) + sq * ROUTE_N[0];
  out[1] = cq * (cs * ROUTE_A[1] + ss * ROUTE_B[1]) + sq * ROUTE_N[1];
  out[2] = cq * (cs * ROUTE_A[2] + ss * ROUTE_B[2]) + sq * ROUTE_N[2];
  return out;
}

/** Route coordinates (x across, y along) of a point given in the Earth's frame */
export function earthToLane(X: number, Y: number, Z: number, out: [number, number]): [number, number] {
  const len = Math.sqrt(X * X + Y * Y + Z * Z);
  const a = X * ROUTE_A[0] + Y * ROUTE_A[1] + Z * ROUTE_A[2];
  const b = X * ROUTE_B[0] + Y * ROUTE_B[1] + Z * ROUTE_B[2];
  const n = X * ROUTE_N[0] + Y * ROUTE_N[1] + Z * ROUTE_N[2];
  out[0] = Math.asin(Math.max(-1, Math.min(1, n / len))) * PLANET_R;
  out[1] = (Math.atan2(b, a) - S0) * PLANET_R;
  return out;
}

/** Latitude and longitude (degrees) of a point given in the Earth's frame */
export function latLonOf(X: number, Y: number, Z: number) {
  return { lat: Math.asin(Z / Math.sqrt(X * X + Y * Y + Z * Z)) / DEG, lon: Math.atan2(Y, X) / DEG };
}

/** The point the camera frames, between the two whales, in route coordinates */
const MID_Z = -0.12;
function anchorAt(travel: number) {
  const y = travel - 0.42;
  return { x: (WHALES[0].x(y) + WHALES[1].x(y)) * 0.5, y };
}
const anchorScratch: V3 = [0, 0, 0];
const anchorLon = (travel: number) => {
  const a = anchorAt(travel);
  laneToEarth(a.x, a.y, MID_Z, anchorScratch);
  return Math.atan2(anchorScratch[1], anchorScratch[0]);
};
const LON0 = anchorLon(0);

/**
 * The Earth's turn about its pole at p (radians): exactly the whales' progress in longitude,
 * so it is tied to their swim (still when they are, reversed when they are) and never spins
 * on its own. About 120° over the journey.
 */
export const spinAt = (p: number) => LON0 - anchorLon(travelAt(p));

const rotZ = (v: V3, c: number, s: number): V3 => [v[0] * c - v[1] * s, v[0] * s + v[1] * c, v[2]];

// ---------------------------------------------------------------------------------------------
// The camera
// ---------------------------------------------------------------------------------------------

/** A camera pose: position, right / up / forward unit vectors */
export interface Pose {
  x: number;
  y: number;
  z: number;
  r: V3;
  u: V3;
  f: V3;
}

export interface Camera extends Pose {
  /** Focal length in px, and the screen point the view axis passes through */
  focal: number;
  ox: number;
  oy: number;
  /** The Earth's spin (radians) this frame */
  spin: number;
  /** The same camera in the Earth's frame, where the ocean and the whales are */
  e: Pose;
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
 * sit in the frame and how far it tilts ahead of straight down (4°–16°, never toward a
 * horizon). It is built in the ocean's local frame at the point between the two whales, so it
 * rides the curve of the planet with them; a slight yaw follows their turns, late, like a
 * camera operator: never a spin.
 */
export function cameraAt(p: number, vp: SceneViewport): Camera {
  const focal = focalFor(vp.h);
  // Distance at which one whale length is `whalePx` on screen
  const base = focal / Math.max(1, vp.whalePx);

  const travel = travelAt(p);
  const lead = WHALES[0];
  const mid = anchorAt(travel);

  const mobile = vp.w < 768 || vp.w / vp.h < 1.15;
  // A little higher for the long migration, lower again for the final shot
  const dist = base * (1 + 0.16 * ease(p, 0.12, 0.4) + (mobile ? 0.2 : 0.34) * ease(p, 0.4, 0.68) - (mobile ? 0.08 : 0.16) * ease(p, 0.74, 0.9));
  const pitch = DEG * (4 + 6 * ease(p, 0.12, 0.4) + 6 * ease(p, 0.4, 0.66) - 8 * ease(p, 0.74, 0.92));
  // Screen height of the anchor (fraction of the viewport): the whales rise a little above the
  // middle while tracking, so the wakes they leave are in frame, and settle for the final shot
  const anchorY = mix(mix(0.57, 0.47, ease(p, 0.14, 0.42)), 0.52, ease(p, 0.74, 0.92));
  const yaw = -0.32 * Math.atan(lead.dx(mid.y - 3)) * (1 - 0.7 * ease(p, 0.74, 0.95));

  // The ocean's local frame at the anchor, in the Earth's frame
  const M = laneToEarth(mid.x, mid.y, MID_Z, [0, 0, 0]);
  const mLen = Math.hypot(M[0], M[1], M[2]);
  const up: V3 = [M[0] / mLen, M[1] / mLen, M[2] / mLen];
  const s = S0 + mid.y / PLANET_R;
  // Along the route: perpendicular to the anchor, wherever it sits across the lane
  const ahead: V3 = [
    -Math.sin(s) * ROUTE_A[0] + Math.cos(s) * ROUTE_B[0],
    -Math.sin(s) * ROUTE_A[1] + Math.cos(s) * ROUTE_B[1],
    -Math.sin(s) * ROUTE_A[2] + Math.cos(s) * ROUTE_B[2]
  ];
  const right: V3 = [
    ahead[1] * up[2] - ahead[2] * up[1],
    ahead[2] * up[0] - ahead[0] * up[2],
    ahead[0] * up[1] - ahead[1] * up[0]
  ];
  const cy = Math.cos(yaw);
  const sy = Math.sin(yaw);
  const sp = Math.sin(pitch);
  const cp = Math.cos(pitch);
  const H: V3 = [0, 0, 0];
  const r: V3 = [0, 0, 0];
  const f: V3 = [0, 0, 0];
  const u: V3 = [0, 0, 0];
  for (let k = 0; k < 3; k++) {
    H[k] = cy * ahead[k] - sy * right[k];
    r[k] = cy * right[k] + sy * ahead[k];
    f[k] = H[k] * sp - up[k] * cp;
    u[k] = H[k] * cp + up[k] * sp;
  }
  const oy = vp.h * 0.47;
  // The ray to the anchor leaves the camera this far below the view axis
  const below = Math.atan((vp.h * anchorY - oy) / focal);
  const down = Math.PI / 2 - pitch + below;
  const back = dist * Math.cos(down);
  const lift = dist * Math.sin(down);
  const e: Pose = {
    x: M[0] - H[0] * back + up[0] * lift,
    y: M[1] - H[1] * back + up[1] * lift,
    z: M[2] - H[2] * back + up[2] * lift,
    r,
    u,
    f
  };

  // Into the world: the Earth turned by its spin
  const spin = spinAt(p);
  const c = Math.cos(spin);
  const sn = Math.sin(spin);
  const pos = rotZ([e.x, e.y, e.z], c, sn);
  return {
    x: pos[0],
    y: pos[1],
    z: pos[2],
    r: rotZ(r, c, sn),
    u: rotZ(u, c, sn),
    f: rotZ(f, c, sn),
    focal,
    ox: vp.w * 0.5,
    oy,
    spin,
    e
  };
}

/** Screen projection of a point: px position, px per world unit, and depth */
export interface Projected {
  x: number;
  y: number;
  scale: number;
  depth: number;
}
function projectPose(cam: Camera, o: Pose, X: number, Y: number, Z: number, out: Projected): Projected {
  const dx = X - o.x;
  const dy = Y - o.y;
  const dz = Z - o.z;
  const depth = Math.max(1e-3, dx * o.f[0] + dy * o.f[1] + dz * o.f[2]);
  const k = cam.focal / depth;
  out.x = cam.ox + (dx * o.r[0] + dy * o.r[1] + dz * o.r[2]) * k;
  out.y = cam.oy - (dx * o.u[0] + dy * o.u[1] + dz * o.u[2]) * k;
  out.scale = k;
  out.depth = depth;
  return out;
}
/** A point given in the world frame */
export const project = (cam: Camera, X: number, Y: number, Z: number, out: Projected) => projectPose(cam, cam, X, Y, Z, out);
/** A point given in the Earth's frame */
export const projectEarth = (cam: Camera, X: number, Y: number, Z: number, out: Projected) => projectPose(cam, cam.e, X, Y, Z, out);
const laneScratch: V3 = [0, 0, 0];
/** A point given in route coordinates */
export function projectLane(cam: Camera, x: number, y: number, z: number, out: Projected): Projected {
  laneToEarth(x, y, z, laneScratch);
  return projectPose(cam, cam.e, laneScratch[0], laneScratch[1], laneScratch[2], out);
}

/**
 * Where the ray through screen point (sx, sy) meets the sphere of radius `radius` (the ocean's
 * surface, or a shell beneath it), in the Earth's frame. Returns the depth along the view axis
 * and writes the point to `out`; −1 when the ray would pass the sphere's rim.
 */
export function oceanHit(cam: Camera, sx: number, sy: number, radius: number, out: V3): number {
  const o = cam.e;
  const a = (sx - cam.ox) / cam.focal;
  const b = (sy - cam.oy) / cam.focal;
  const dx = o.f[0] + a * o.r[0] - b * o.u[0];
  const dy = o.f[1] + a * o.r[1] - b * o.u[1];
  const dz = o.f[2] + a * o.r[2] - b * o.u[2];
  const dd = dx * dx + dy * dy + dz * dz;
  const cd = o.x * dx + o.y * dy + o.z * dz;
  const disc = cd * cd - dd * (o.x * o.x + o.y * o.y + o.z * o.z - radius * radius);
  if (disc < 0) return -1;
  // The near intersection; d's forward component is 1, so t is also the depth
  const t = (-cd - Math.sqrt(disc)) / dd;
  if (t <= 0) return -1;
  out[0] = o.x + t * dx;
  out[1] = o.y + t * dy;
  out[2] = o.z + t * dz;
  return t;
}

/** A single normalized clock includes the visual story and the page's transition into copy. */
export function migrationAt(scrollY: number, top: number, height: number, viewportH: number) {
  const total = Math.max(1, height + viewportH);
  const progress = clamp01((scrollY - (top - viewportH)) / total);
  const storyEnd = height / total;
  return {
    progress,
    p: clamp01(progress / Math.max(0.001, storyEnd)),
    handoff: clamp01((progress - storyEnd) / Math.max(0.001, 1 - storyEnd))
  };
}

// ---------------------------------------------------------------------------------------------
// The ocean, fixed to the Earth
// ---------------------------------------------------------------------------------------------

/**
 * How rough the sea is at a latitude: 0 in the subtropics, 1 in the Roaring Forties, which the
 * route crosses south of the Cape. The swell changes with where the whales are, not with time.
 */
export const seaStateAt = (latDeg: number) => ease(-latDeg, 25, 35);

/**
 * The slow part of the sea at a point (route coordinates): how strongly the long swell groups
 * the ripples into bands (0.36..1), and how far the current bends their crests (radians).
 * Smooth over many cells, so a renderer may sample it sparsely and interpolate.
 */
export function seaBaseAt(X: number, Y: number, p: number, out: [number, number]): [number, number] {
  const swell = 0.6 * Math.sin(0.56 * X + 2.17 * Y - 9 * p) + 0.4 * Math.sin(-1.3 * X + 1.9 * Y + 6 * p + 1.3);
  out[0] = 0.68 + 0.32 * swell;
  out[1] = 1.6 * Math.sin(0.9 * X - 0.55 * Y + 0.8) + 0.9 * Math.sin(1.7 * Y + 0.4 * X + 2.1) + 0.7 * Math.sin(3.1 * X + 1.2 * Y);
  return out;
}

/**
 * The sea's surface as crest lines for ASCII, given its slow part: positive within a crest line,
 * up to about 0.4 at the heart of a strong one. Wind ripples a third of a whale length apart
 * whose crests meander with the current and rise and fall along their length (crests of every
 * length, thicker where the wave is strong, never a ruled grid), a finer train for texture and,
 * in the southern ocean (`storm`), a second set of crests crossing them: a confused sea. Each
 * runs its own way as p advances. `fine` (0..1) fades the finest train where a cell covers too
 * much water to resolve it.
 */
export function crestsAt(X: number, Y: number, p: number, fine: number, storm: number, group: number, bend: number): number {
  const a = Math.sin(20 * (0.34 * X + 0.94 * Y) + bend - 16 * p);
  const along = 0.5 + 0.5 * Math.sin(9.5 * X - 2.2 * Y + 0.6 * bend + 5 * p);
  // Rough water: heavier crests
  let v = a - 1 + 0.42 * group * along * (1 + 0.25 * storm);
  if (fine > 0) v += 0.05 * fine * Math.sin(33 * (-0.42 * X + 0.91 * Y) + 1.3 * bend + 2.4 + 27 * p);
  if (storm > 0) {
    const c = Math.sin(15 * (-0.38 * X + 0.92 * Y) - 0.7 * bend + 13 * p + 1.1);
    const cross = 0.5 + 0.5 * Math.sin(5.5 * X + 2.4 * Y + 1.7);
    v = Math.max(v, c - 1 + 0.36 * storm * group * cross);
  }
  return v;
}

const baseScratch: [number, number] = [0, 0];
/** The sea's surface at a point (route coordinates): crestsAt with its slow part evaluated there */
export function swellAt(X: number, Y: number, p: number, fine: number, storm = 0): number {
  seaBaseAt(X, Y, p, baseScratch);
  return crestsAt(X, Y, p, fine, storm, baseScratch[0], baseScratch[1]);
}

/**
 * The water's depth variations, 0..1: broad patches where the sea reads denser or more open.
 * Fixed in the water, so they pass beneath the whales as they swim.
 */
export function densityAt(X: number, Y: number): number {
  const v = 0.6 * Math.sin(0.7 * X + 0.38 * Y + 0.6) * Math.sin(0.3 * X - 0.52 * Y + 2.1) + 0.4 * Math.sin(0.27 * Y + 0.2 * X + 0.9);
  return 0.5 + 0.5 * v;
}

/**
 * Whale `i`'s disturbance of the water, 0..1, at `off` across from its lane and `Y` along it,
 * its head at `head`: water parting along its flanks and at the head, and behind the flukes a
 * Kelvin wake (two arms opening at about 19°) around a churned centre line, all fading with
 * distance behind it.
 */
export function whaleWake(i: number, off: number, Y: number, head: number): number {
  const L = WHALES[i].length;
  const tail = head - L * 1.02;
  if (Y > head + 0.18 * L || Y < tail - 5.5 * L) return 0;
  const dx = Math.abs(off) / L;
  if (Y >= head - 0.05 * L) {
    // The bow: a crescent just ahead of the head
    const r = Math.hypot(dx, (Y - head) / L);
    return Math.exp(-(((r - 0.1) / 0.035) ** 2)) * 0.75;
  }
  if (Y >= tail) {
    // The flanks: a thin band just outside the body, widest abreast of the flippers
    const u = (head - Y) / (L * 1.02);
    const half = 0.03 + 0.09 * Math.sin(Math.PI * Math.min(1, (u + 0.06) / 1.06));
    return Math.exp(-(((dx - half * 1.55 - 0.03) / 0.035) ** 2)) * 0.55 * (1 - 0.6 * u);
  }
  const age = (tail - Y) / L;
  if (dx > 0.2 + age * 0.45) return 0;
  const arm = 0.07 + age * 0.354;
  const armW = 0.035 + 0.022 * age;
  const arms = Math.exp(-(((dx - arm) / armW) ** 2)) * Math.exp(-age / 2.6);
  const churnW = 0.045 + 0.035 * age;
  const churn = Math.exp(-((dx / churnW) ** 2)) * Math.exp(-age / 1.3) * (0.55 + 0.45 * Math.sin(Y * 23 + off * 17 + i * 2));
  return Math.max(arms * 0.9, churn);
}

/** Both whales' disturbance of the water at a point (route coordinates) when the main whale has swum `travel` */
export function wakeAt(X: number, Y: number, travel: number): number {
  let w = 0;
  for (let i = 0; i < 2; i++) w = Math.max(w, whaleWake(i, X - WHALES[i].x(Y), Y, headY(i, travel)));
  return w;
}

// ---------------------------------------------------------------------------------------------
// Stage weights: what is on screen, and how strongly
// ---------------------------------------------------------------------------------------------

/**
 * `engage` hands the whales from their own swim to the scene (and back after the handoff);
 * `water` brings in the Earth-anchored ocean; `snow` the deep particles that give the tracking
 * shots their parallax; `wake` the water the whales disturb; `trails` the long traces left
 * behind them; `chart` the faint meridians and parallels that pass beneath them during the
 * long migration (the planet turning, never seen whole). `handoff` ∈ [0, 1] runs over the
 * viewport of scrolling after the stage releases, while the introduction rises.
 */
export function stagesAt(p: number, handoff = 0) {
  const leave = ease(handoff, 0.05, 0.65);
  return {
    // Keep the tracked pose during the exit; blending back into ambient swimming here
    // would turn and enlarge the whales just as the paragraph comes into view.
    engage: ease(p, 0.02, 0.14) * (handoff < 1 ? 1 : 0),
    whales: 1 - ease(handoff, 0.08, 0.65),
    water: ease(p, 0.03, 0.16) * (1 - ease(handoff, 0, 0.5)),
    snow: ease(p, 0.08, 0.2) * (1 - leave),
    wake: ease(p, 0.08, 0.2) * (1 - leave),
    trails: ease(p, 0.16, 0.3) * (1 - leave),
    chart: ease(p, 0.36, 0.48) * (1 - ease(p, 0.8, 0.92))
  };
}
