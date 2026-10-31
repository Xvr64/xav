/**
 * The two background humpbacks. Each swims a deterministic wander path in time; the scroll adds a
 * vertical travel that the visibility-aware owner integrates (stepTravel, ambientWhaleRuntime.ts),
 * so scrolling down sends the whales diving down the page and scrolling up lets them rise.
 *
 * Units are Whale A's body length. The camera looks down -Z from (0, 0, AMBIENT_DISTANCE), close
 * enough for real perspective, its field of view solved from the viewport so that Whale A spans
 * close to a desktop screen's width and well past a phone's.
 *
 * Heading always follows the whale's total velocity (wander + travel), and the travel only ever
 * tilts that velocity up or down within a capped pitch. A reversal of the scroll therefore turns
 * the whale through level swimming in a curved 3D arc: it never mirrors or flips. Scrolling also
 * quickens the swim itself, so the animal powers along its heading rather than sliding.
 *
 * Weight: turns build and ease under an angular-acceleration limit and settle into the water's
 * drag; the lean into a turn is a sprung roll that leads into, carries through and settles out of
 * it, with a twist whenever the whale pitches; each fluke beat heaves and rocks the whole body.
 *
 * The camera travels with the visitor: the travel is camera-relative and softly framed by each
 * whale's projected hull (head, flippers, flukes), so the animals descend and rise with the page
 * and ease along the frame's edges instead of leaving it.
 */
import { PART_BODY, PART_FIN, SPINE_NODES, buildWhaleGeometry, type V3 } from './whale3dAnatomy.ts';
import { articulate, orientWhale, qRotate, skinFrames, skinVertex, vAdd, vCross, vSub, vScale, vLen, vNorm, vDot, X_AXIS, Y_AXIS, Z_AXIS, type WhalePose } from './whale3dPose.ts';
import { WHALE_RIG, beatBody } from './whaleRig.ts';

export interface AmbientComposition {
  width: number;
  height: number;
  scroll: number;
  weight: number;
  lanes: readonly { x: number; y: number }[];
  surfaceY: number;
  /**
   * Per whale, a gentle vertical swim (body lengths/s, + up) toward open water when its torso has
   * settled over a block of reading text. Composition, not masking: applied only while the page
   * holds still, so the copy reads beside the animal instead of through it.
   */
  avoid?: readonly number[];
}

export interface AmbientCamera {
  /** Camera distance from the focal plane z = 0, in body lengths. */
  z: number;
  /** Vertical field of view, degrees. */
  fov: number;
  /** Visible half extents at the focal plane, in body lengths. */
  halfW: number;
  halfH: number;
  /** Whale A's projected length at the focal plane, CSS px. */
  px: number;
}

export const AMBIENT_DISTANCE = 2.4;
/** Drawn size relative to the original monumental framing: a touch smaller, so the frame holds them. */
export const AMBIENT_SIZE = 0.9;
const TAU = Math.PI * 2;
const mod = (x: number, m: number) => ((x % m) + m) % m;
const clamp = (x: number, a: number, b: number) => Math.max(a, Math.min(b, x));

/** The framing: monumental on every screen, a whale never smaller than its anatomy can carry. */
export function ambientCamera(width: number, height: number): AmbientCamera {
  const W = Math.max(1, width);
  const H = Math.max(1, height);
  const px = AMBIENT_SIZE * Math.min(1.45 * W, 1.7 * H, Math.max(1.12 * W, 0.95 * H));
  const halfH = H / (2 * px);
  return { z: AMBIENT_DISTANCE, fov: (2 * Math.atan(halfH / AMBIENT_DISTANCE) * 180) / Math.PI, halfW: W / (2 * px), halfH, px };
}
/** Half the visible height at depth z (perspective: deeper water shows more of the ocean). */
const halfHAt = (cam: AmbientCamera, z: number) => (cam.halfH * (cam.z - z)) / cam.z;

/**
 * Silhouette candidates of the mesh: per stretch of the body its outermost vertices across and up
 * and down, per flipper and the flukes their extremes along every axis and diagonal. Skinned with
 * the live articulation they bound the whole animal, tips included, at a fraction of the vertices.
 */
let hullCache: number[] | null = null;
function hullVertices(): number[] {
  if (hullCache) return hullCache;
  const g = buildWhaleGeometry();
  const groups = new Map<string, number[]>();
  for (let v = 0; v < g.vertexCount; v++) {
    const part = g.info[v * 4];
    const key = part === PART_BODY || part === PART_FIN ? `b${Math.floor((g.spine[v] / SPINE_NODES) * 14)}` : `p${part}`;
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key)!.push(v);
  }
  const dirs: V3[] = [];
  for (const x of [-1, 0, 1]) for (const y of [-1, 0, 1]) for (const z of [-1, 0, 1]) if (x || y || z) dirs.push([x, y, z]);
  const picked = new Set<number>();
  for (const [key, verts] of groups) {
    const use = key[0] === 'b' ? dirs.filter((d) => d[2] === 0) : dirs;
    for (const d of use) {
      let best = verts[0], bestDot = -Infinity;
      for (const v of verts) {
        const dot = g.rest[v * 3] * d[0] + g.rest[v * 3 + 1] * d[1] + g.rest[v * 3 + 2] * d[2];
        if (dot > bestDot) { bestDot = dot; best = v; }
      }
      picked.add(best);
    }
  }
  return (hullCache = [...picked]);
}

/**
 * The whale's projected extent as the ambient camera frames it: [left, right, bottom, top] in
 * normalised device units (−1 … 1 is the viewport), from its skinned hull, flippers and flukes included.
 */
export function projectedBounds(pose: Pick<WhalePose, 'position' | 'quaternion' | 'scale' | 'articulation'>, cam: AmbientCamera): [number, number, number, number] {
  const g = buildWhaleGeometry();
  const frames = skinFrames(pose.articulation);
  let x0 = Infinity, x1 = -Infinity, y0 = Infinity, y1 = -Infinity;
  for (const v of hullVertices()) {
    const local = skinVertex(frames, g, v);
    const w = qRotate(pose.quaternion, [local[0] * pose.scale, local[1] * pose.scale, local[2] * pose.scale]);
    const depth = Math.max(0.2, cam.z - (w[2] + pose.position[2]));
    const x = ((w[0] + pose.position[0]) * cam.z) / (depth * cam.halfW);
    const y = ((w[1] + pose.position[1]) * cam.z) / (depth * cam.halfH);
    if (x < x0) x0 = x;
    if (x > x1) x1 = x;
    if (y < y0) y0 = y;
    if (y > y1) y1 = y;
  }
  return [x0, x1, y0, y1];
}

/** Edge margin of the soft frame (device units) and the depth of its easing band. */
const FRAME_MARGIN = 0.05;
const FRAME_BAND = 0.3;
/**
 * How much of its span a whale may let the frame crop while it passes through: at the sides a
 * cinematic cut through the head or flukes (a side-on whale is nearly as wide as a desktop
 * screen, and two of them share it), at the top and bottom only a fluke tip or a flipper of a
 * steeply pitched animal (on a wide screen a pitched whale is taller than the frame itself).
 */
const SIDE_CROP = 0.42;
const END_CROP = 0.12;
/**
 * While the visitor scrolls, the whale may lead the way a little further out of the frame on the
 * side it is heading for (its head below the frame on a dive): the descent still reads on a wide
 * screen, where a diving whale is as tall as the frame and would otherwise be held mid-screen.
 */
const LEAD_CROP = 0.2;
/** And while the two pass close, one may rise above the other with a little more of it cropped. */
const PASS_CROP = 0.12;
/**
 * How far each whale leads the camera while the visitor scrolls (its frame-centre, device units):
 * down the page A sinks lower than B, up the page B rises higher than A, as they rest. They
 * spread over the screen instead of gathering at the same edge, and a reversal never crosses them.
 */
const LEAD_DOWN = [-0.42, -0.12];
const LEAD_UP = [0.12, 0.42];
/**
 * Where a whale's frame-centre may sit along one axis, given its projected span, the frame's
 * edges (lo, hi) and how much of the span each edge may crop: its whole extent inside the margin
 * when that fits, else held between the two.
 */
function frameRange(span: number, lo: number, hi: number, cropLo: number, cropHi = cropLo): [number, number] {
  const min = lo + FRAME_MARGIN + span * (0.5 - cropLo);
  const max = hi - FRAME_MARGIN - span * (0.5 - cropHi);
  // Too tall to fit: centred, shifted toward the edge that may crop more
  return min <= max ? [min, max] : [(min + max) / 2, (min + max) / 2];
}
/**
 * A soft frame for one axis. `v` is the whale's wanted on-screen velocity (scene units/s); it
 * returns the velocity it may actually have: heading outward it is eased away as the hull nears
 * the frame (never a wall: a smooth taper through the band), and past the frame a gentle inward
 * swim brings it back. `c` and the range are in device units, `unit` converts them to scene units.
 */
function softFrame(v: number, c: number, range: [number, number], unit: number): number {
  const [lo, hi] = range;
  const toHi = (hi - c) / FRAME_BAND;
  const toLo = (c - lo) / FRAME_BAND;
  if (v > 0) v *= smooth(toHi);
  else if (v < 0) v *= smooth(toLo);
  const past = Math.max(0, c - hi) - Math.max(0, lo - c);
  // Inward, with a soft start and a capped pace: an animal swimming back into frame, not a snap
  return v - clamp(past * unit * 1.6, -0.3, 0.3) * smooth(Math.abs(past) / 0.05);
}

// C2 easing: acceleration is continuous too, so curvature-driven banking never snaps at a
// behavior boundary (a cubic smoothstep only preserves position and velocity).
const smooth = (x: number) => { const t = clamp(x, 0, 1); return t * t * t * (t * (t * 6 - 15) + 10); };
const windowAt = (t: number, a: number, b: number, fade: number) => smooth((t - a) / fade) * (1 - smooth((t - b) / fade));
export const socialAt = (t: number) => windowAt(mod(t, 263), 115, 166, 18);
/** Whale A's occasional deep dive: it sinks and recedes into the blue, then climbs back. */
export const deepDiveAt = (t: number) => windowAt(mod(t, 211), 60, 96, 16);
const ROLL_PERIOD = [290, 230];
const ROLL_START = [200, 150];
/** One full, unhurried roll about the body axis (20 s of the whale's own roll clock). */
const rollRateAt = (i: number, clock: number) => {
  const u = clamp((mod(clock + i * 79, ROLL_PERIOD[i]) - ROLL_START[i]) / 20, 0, 1);
  return TAU * 30 * u * u * (1 - u) * (1 - u) / 20;
};
export const rollAt = (i: number, clock: number) => TAU * smooth((mod(clock + i * 79, ROLL_PERIOD[i]) - ROLL_START[i]) / 20);

/** Relative body sizes (the shared rig, whaleRig.ts). */
export const WHALE_SCALE = WHALE_RIG.scale;
/**
 * The swimming the wander alone does not show (body lengths/s, eased while gliding): the whales
 * hold their place against the water, so even a slow drift is carried by a living stroke, about
 * one beat every 5.5 s for A and 4.5 s for B at rest, never a body sliding with its tail still.
 */
const CADENCE = [0.065, 0.028];
/** Stretches where each whale stops beating and coasts on its momentum. */
const glideAt = (i: number, t: number) => (i === 0 ? windowAt(mod(t, 71), 28, 52, 8) : windowAt(mod(t + 23, 53), 30, 41, 6));
/** tan(dive angle) and tan(climb angle): B dives more steeply, both rise a little more gently. */
const K_DOWN = [1.6, 1.9];
const K_UP = [1.4, 1.6];
/**
 * The steepest a heading may tilt, as tan(pitch): about 35° at rest (restrained, unhurried),
 * opening to about 64° while the visitor scrolls. The whale is still seen from the side.
 */
const pitchCap = (s: number) => 0.7 + 1.45 * Math.min(1, Math.abs(s));
/** The fastest each whale turns (rad/s): A unhurried, B a little nimbler. */
const MAX_TURN = [0.7, 0.95];
/** How fast each can build up or ease out of a turn (rad/s²): the inertia of 30 tonnes. */
const MAX_TURN_ACCEL = [0.9, 1.25];
/**
 * How much faster the whales swim while the visitor scrolls: the wander's clock runs this much
 * faster at a full signal, so the animals speed up along their heading (and beat their flukes
 * faster) instead of sliding down the page.
 */
const PACE = 1.6;
/** Radians of roll per rad/s of pitching: a pull-up or push-over is carved with a twist, not hinged. */
const TWIST = [0.42, -0.5];
/**
 * The roll a held dive or climb carries (radians at a full signal): diving, the whale rolls its
 * back toward the viewer as it pushes over; climbing, it shows its pale throat and belly. Both
 * whales do it, so the descent reads as a turn of the whole animal, not a tilt of a cut-out.
 */
const DIVE_LEAN = [0.42, 0.5];
/** Radians of lean per rad/s of turning, and the steepest lean a turn may ask for (about 45°). */
const BANK_PER_TURN = 2.2;
const MAX_BANK = 0.8;
/** No held heading is ever steeper than this (the wanted one is capped lower still). */
const MAX_PITCH = (65 * Math.PI) / 180;

/** World-space wander, wider than the frame so the animals pass through it rather than circle in it. */
function rawPath(i: number, t: number, c: AmbientComposition): V3 {
  const cam = ambientCamera(c.width, c.height);
  const lane = c.lanes[i] ?? { x: 0.5, y: 0.5 };
  // Editorial holds move the centre of the habitat (and narrow it), never flatten its depth
  const hold = clamp(c.weight, 0, 1) * 0.68;
  const cx = (lane.x - 0.5) * 2 * cam.halfW * hold;
  const cy = ((0.5 - (i === 0 ? 0.6 : 0.38)) * (1 - hold) + (0.5 - lane.y) * hold) * 2 * cam.halfH;
  const ax = (cam.halfW * 0.78 + 0.1) * (1 - 0.45 * hold);
  let x: number, y: number, z: number;
  if (i === 0) {
    // A: one slow, broad ellipse, long in x so the flank is what the camera mostly sees; turns at
    // its ends carry the whale toward and away from the camera; a deep dive now and then
    const a = (t * TAU) / 70 + 0.55;
    const dive = deepDiveAt(t);
    x = cx + ax * Math.sin(a) + 0.04 * Math.sin(t * 0.021);
    y = cy + 0.22 * cam.halfH * Math.sin(a * 0.61 + 0.4) - 0.5 * dive;
    z = -0.05 + 0.4 * Math.cos(a) - 0.3 * dive;
  } else {
    // B: quicker and more exploratory, its loop folded by secondary curves; near enough to share
    // the foreground with A
    const a = (t * TAU) / 50 + 3.1;
    x = cx + 0.85 * ax * Math.sin(a) + 0.18 * Math.sin(a * 2.2 + 0.7);
    y = cy + 0.34 * cam.halfH * Math.sin(a * 0.73 + 1.7) + 0.06 * Math.sin(a * 2.9);
    z = -0.45 + 0.32 * Math.cos(a) + 0.12 * Math.sin(a * 1.6 + 0.3);
  }
  // Stay beneath the composed surface (a smooth minimum: no hard stop)
  if (Number.isFinite(c.surfaceY)) {
    const top = (0.5 - c.surfaceY / Math.max(1, c.height)) * 2 * cam.halfH - 0.16;
    y = top - Math.log1p(Math.exp((top - y) * 12)) / 12;
  }
  return [x, y, z];
}

export function ambientPath(i: number, t: number, c: AmbientComposition): V3 {
  const p = rawPath(i, t, c);
  if (i === 0) return p;
  const cam = ambientCamera(c.width, c.height);
  const lead = rawPath(0, t, c);
  const follow = rawPath(0, t - 9, c);
  const social = socialAt(t);
  // A brief curved approach, following above and behind A, then separation. Never the
  // cinematic paired orbit. The weave scales with the habitat so it never outpaces the lead.
  p[0] += (follow[0] + 0.2 * cam.halfW * Math.sin(t * 0.12) - p[0]) * social;
  p[1] += (follow[1] + 0.24 - p[1]) * social;
  p[2] += (follow[2] - 0.6 - p[2]) * social;
  const d = vSub(p, lead);
  const distance = vLen(d);
  // Smooth repulsion has no discontinuity at a collision boundary; offset in depth is preferred
  // to moving across an editorial column. A soft ramp, so it steers rather than bounces.
  const push = Math.log1p(Math.exp((0.95 - distance) * 4)) / 4;
  const away = vNorm([d[0], d[1], d[2] - 0.1]);
  return [p[0] + away[0] * push, p[1] + away[1] * push, p[2] + away[2] * push];
}

/** The scroll's influence on the whales, integrated by their owner at a fixed or frame step. */
export interface TravelState {
  /** Smoothed scroll signal: + scrolling down, − up (about ±1 at a brisk scroll). */
  /** Water-space trajectory, integrated along the held heading; framing is separate. */
  /** Fast directional intent, separate from the slow activity/speed signal. */
  intent: number;
  intentLife: number;
  intentPixels: number;
  position: [V3 | null, V3 | null];
  speed: [number, number];
  tailBend: [[number, number], [number, number]];
  s: number;
  sv: number;
  /** Per whale: vertical offset from the wander path, its rate and acceleration. */
  drift: [number, number];
  dv: [number, number];
  da: [number, number];
  /**
   * Per whale: the vertical rate the scroll asks for before the frame eases it. The heading keeps
   * most of it, so held at the frame's edge the whale still reads as diving (or climbing) with the
   * page sliding past it: the camera, not the animal, has stopped.
   */
  di: [number, number];
  /** Per whale: sideways offset the frame's sides have eased into the path, and its rate. */
  side: [number, number];
  sideV: [number, number];
  /** Per whale: depth offset taken to pass the other (one slips behind), and its rate. */
  deep: [number, number];
  deepV: [number, number];
  /** Per whale: roll clock (s) and distance swum (body lengths, sets the tail beat). */
  roll: [number, number];
  swim: [number, number];
  /** Per whale: the heading the animal actually holds, and how fast it is turning (rad/s vector). */
  fwd: [V3 | null, V3 | null];
  spin: [V3, V3];
  /** Per whale: its back, carried along by its own turning (no twist), slowly righted. */
  up: [V3, V3];
  /** Per whale: body curvature (turn, climb) with the inertia of a heavy animal. */
  bend: [[number, number], [number, number]];
  /** Per whale: held yaw, pitch and their rates (the steering spring's state). */
  att: [number[], number[]];
  /** Per whale: bank angle and roll rate (a softly underdamped spring: the lean settles, it never snaps). */
  bank: [[number, number], [number, number]];
  /** How far the wander's clock has run ahead of real time while the visitor scrolled (s). */
  ahead: number;
  /** The push of a gathering (+) or easing (−) scroll, felt through the water (smoothed). */
  surge: number;
}
export const newTravel = (seconds = 0): TravelState => ({
  intent: 0, intentLife: 0, intentPixels: 0, position: [null, null], speed: [0, 0], tailBend: [[0, 0], [0, 0]], s: 0, sv: 0, drift: [0, 0], dv: [0, 0], da: [0, 0], di: [0, 0], side: [0, 0], sideV: [0, 0], deep: [0, 0], deepV: [0, 0], roll: [seconds, seconds], swim: [0, 0], fwd: [null, null], spin: [[0, 0, 0], [0, 0, 0]], up: [[0, 1, 0], [0, 1, 0]], bend: [[0, 0], [0, 0]], att: [[0, 0, 0, 0], [0, 0, 0, 0]], bank: [[0, 0], [0, 0]], ahead: 0, surge: 0
});
/** Accumulate real document movement: tiny direction noise never starts a maneuver.
 * This only changes intent. Pose, velocity and stroke phase remain continuous. */
export function noteScrollIntent(st: TravelState, pixels: number) {
  if (!Number.isFinite(pixels) || pixels === 0) return;
  if (Math.sign(pixels) !== Math.sign(st.intentPixels)) st.intentPixels = 0;
  st.intentPixels += pixels;
  if (Math.abs(st.intentPixels) < 6) return;
  st.intent = Math.sign(st.intentPixels);
  st.intentLife = 1.1;
  st.intentPixels = st.intent * 6;
}

/**
 * How much of the frame's easing the heading follows. The rest is the camera reframing: held at
 * the edge the whale still points and beats along the scroll's dive (or climb) with the page
 * sliding past it, and a slow animal is never swung about by its own framing (a heading that
 * followed it fully would pitch the whale taller, which the frame would then answer again).
 */
const FRAME_FOLLOW = 0.2;
/** The vertical rate a whale's heading follows: the scroll's intent, partly eased by the frame. */
const headingRise = (st: TravelState, i: number) => st.di[i] + (st.dv[i] - st.di[i]) * FRAME_FOLLOW;
/** The swim pace under a scroll signal (1 at rest). */
const paceAt = (s: number) => 1 + PACE * Math.min(1, Math.abs(s));
/**
 * The lean a turn asks for: proportional to how fast the whale is turning about its own back
 * (a right turn rolls the back toward the right), wider while diving, restrained while rising.
 * A slow, sweeping loop leans a little; a quick turn lies the animal well over.
 */
const leanFor = (spin: V3, back: V3, s: number) =>
  clamp(-vDot(spin, back) * BANK_PER_TURN * (1 + 0.35 * Math.max(0, s) - 0.15 * Math.max(0, -s)), -MAX_BANK, MAX_BANK);
/** a made perpendicular to the unit vector f (b if a is parallel to f). */
const perpTo = (a: V3, f: V3, b: V3 = Z_AXIS): V3 => {
  let u = vSub(a, vScale(f, vDot(a, f)));
  if (vLen(u) < 1e-5) u = vSub(b, vScale(f, vDot(b, f)));
  return vNorm(u);
};

/**
 * The path's velocity in real time (wander at the scroll's pace + travel) with the pitch capped:
 * where the whale wants to head. `t` is the wander's own clock.
 */
function pathVelocity(i: number, t: number, c: AmbientComposition, dv: number, s: number): V3 {
  const h = 1.2;
  const before = ambientPath(i, t - h, c);
  const after = ambientPath(i, t + h, c);
  const vel = vScale(vSub(after, before), paceAt(s) / (2 * h));
  // While the visitor scrolls, the whale turns its flank to the camera: a dive or climb toward or
  // away from the viewer would read end-on, its direction lost. Depth still drifts, unseen but
  // for a slow change of size.
  vel[2] *= 1 - 0.55 * Math.min(1, Math.abs(s));
  vel[1] += dv;
  const level = Math.hypot(vel[0], vel[2]);
  const cap = pitchCap(s);
  if (Math.abs(vel[1]) > cap * level) vel[1] = Math.sign(vel[1]) * cap * level;
  return vel;
}

/**
 * Turn a held heading toward the wanted one: a critically damped spring in yaw and pitch whose
 * angular acceleration and rate are both limited. Where a path slows almost to a stop its tangent
 * can swing at any speed; the animal instead swims a wider arc at its own pace: it eases into a turn, sweeps
 * through it and eases out with a little follow-through, as a heavy body must. The rate limit is
 * a soft saturation, so no turn ever runs at a machine-constant speed. Big turns are made in yaw
 * about the vertical, as a whale turns, never by looping over the top; pitch only ever moves
 * between where the whale points and where it wants to.
 */
function steer(st: TravelState, i: number, want: V3, dt: number, s: number) {
  const wantYaw = Math.atan2(want[0], -want[2]);
  const wantPitch = Math.asin(clamp(want[1], -1, 1));
  const a = st.att[i];
  if (!st.fwd[i]) {
    a[0] = wantYaw; a[1] = wantPitch; a[2] = 0; a[3] = 0;
    st.fwd[i] = want;
    st.spin[i] = [0, 0, 0];
    st.up[i] = perpTo(Y_AXIS, want);
    return;
  }
  const f = st.fwd[i]!;
  // A scroll asks for a deliberate manoeuvre: the animal commits to it more briskly, still with
  // the inertia of its mass
  const urge = Math.min(1, Math.abs(s));
  const k = 2.2 * (1 + 0.4 * urge);
  // Minimum turning radius grows with speed: never rotate in place at a slow path cusp.
  const maxTurn = Math.min(MAX_TURN[i] * (1 + 0.2 * urge),
    Math.max(0.65, st.speed[i] / (WHALE_SCALE[i] * 0.25)));
  const maxAccel = MAX_TURN_ACCEL[i] * (1 + 0.5 * urge);
  const eYaw = Math.atan2(Math.sin(wantYaw - a[0]), Math.cos(wantYaw - a[0]));
  const ePitch = wantPitch - a[1];
  // Both limits apply to true angular quantities (a yaw turn is shorter near the poles)
  const c0 = Math.cos(a[1]);
  let ay = k * k * eYaw - 2 * k * a[2];
  let ap = k * k * ePitch - 2 * k * a[3];
  const accel = Math.hypot(ay * c0, ap);
  if (accel > maxAccel) { ay *= maxAccel / accel; ap *= maxAccel / accel; }
  // The water resists a fast turn more and more steeply, so a sweeping turn settles into the
  // animal's own speed instead of running into a stop
  const drag = 2 * (Math.hypot(a[2] * c0, a[3]) / maxTurn) ** 2;
  ay -= drag * a[2]; ap -= drag * a[3];
  let wy = a[2] + ay * dt;
  let wp = a[3] + ap * dt;
  const rate = Math.hypot(wy * c0, wp);
  if (rate > maxTurn) { wy *= maxTurn / rate; wp *= maxTurn / rate; }
  a[0] += wy * dt;
  a[1] = clamp(a[1] + wp * dt, -MAX_PITCH, MAX_PITCH);
  a[2] = wy; a[3] = wp;
  const cp = Math.cos(a[1]), sp = Math.sin(a[1]), cy = Math.cos(a[0]), sy = Math.sin(a[0]);
  const nf: V3 = [cp * sy, sp, -cp * cy];
  // Angular velocity: df/dt from the yaw and pitch rates, as the vector w with w × f = df/dt
  const dfdt: V3 = [cp * cy * wy - sp * sy * wp, cp * wp, cp * sy * wy + sp * cy * wp];
  const wv = vCross(nf, dfdt);
  // The same rotation carries the back with the heading (parallel transport: no twist)
  let up = st.up[i];
  const th = vLen(wv) * dt;
  if (th > 0) {
    const u = vNorm(wv);
    const ct = Math.cos(th);
    const sn = Math.sin(th);
    up = vAdd(vAdd(vScale(up, ct), vScale(vCross(u, up), sn)), vScale(u, vDot(u, up) * (1 - ct)));
  }
  st.fwd[i] = nf;
  st.spin[i] = wv;
  // Right the back toward world up, unhurriedly, and only as far as the heading allows
  up = perpTo(up, nf, Y_AXIS);
  const target = perpTo(Y_AXIS, nf, up);
  const tilt = Math.atan2(vDot(vCross(up, target), nf), vDot(up, target));
  const r = clamp(tilt, -1, 1) * 0.6 * cp * dt;
  const cr = Math.cos(r), sr = Math.sin(r);
  st.up[i] = vNorm(vAdd(vScale(up, cr), vScale(vCross(nf, up), sr)));
  void f;
}

/**
 * Advance the travel by dt toward a scroll target (−1 … 1). The signal follows critically damped,
 * so a reversal eases through zero; the drift rate follows that with a lag, so the heading's
 * vertical component stays continuous. The travel is the camera's as much as the whale's: the
 * camera follows the visitor down (or up) the page, so each whale's on-screen motion is softly
 * framed by its own projected hull. Nearing an edge it eases off and runs along it, and at rest
 * it drifts home into its composed place. While the visitor scrolls, the wander's clock runs
 * ahead (PACE): the whales swim faster, so the descent or climb is carried by their own swimming,
 * never by sliding.
 */
export function stepTravel(st: TravelState, target: number, dt: number, seconds: number, c: AmbientComposition) {
  if (!(dt > 0)) return;
  // Bounded integration steps keep steering stable across refresh rates and delayed frames.
  if (dt > 1 / 60 + 1e-8) {
    const n = Math.ceil(dt * 60), h = dt / n;
    for (let k = 0; k < n; k++) stepTravel(st, target, h, seconds - dt + (k + 1) * h, c);
    return;
  }
  const cam = ambientCamera(c.width, c.height);
  st.intentLife = Math.max(0, st.intentLife - dt);
  const goal = clamp(target, -1, 1);
  // A scroll is answered within a beat; when the visitor slows or stops, the whales carry the
  // dive (or climb) on as a glide and ease out of it over a couple of seconds, never snapping back
  const easing = goal * st.s >= 0 && Math.abs(goal) < Math.abs(st.s);
  const w = easing ? 1.3 : 3.4;
  st.sv += (w * w * (goal - st.s) - 2 * w * st.sv) * dt;
  st.s += st.sv * dt;
  const s = st.s;
  // d|s|/dt, faded through s = 0 so that a reversal never jumps the stroke, and carried by the
  // water with a lag so a sudden scroll builds the effort over a beat
  const push = clamp(Math.tanh(s / 0.15) * st.sv, -1, 1);
  st.surge += (push - st.surge) * (1 - Math.exp(-dt / 0.35));
  const pace = paceAt(s);
  st.ahead += (pace - 1) * dt;
  const t = seconds + st.ahead;
  // The frame's top: the viewport's, or the composed sea surface where the cover shows one
  const top = Number.isFinite(c.surfaceY) ? clamp(1 - (2 * c.surfaceY) / Math.max(1, c.height), -0.2, 1) : 1;
  // The two keep their distance as framed, not only along their paths: the frame can herd both
  // toward the same band (on a wide screen two diving whales each fill its height), so they swim
  // clear of each other (B the more, A the calmer yielding a little), with a soft ramp that
  // steers, not bounces. Side by side or one slipping behind the other rather than stacked: the
  // frame has room across and in depth, while stacking would push one out of the top or bottom
  const framed = [0, 1].map((i) => vAdd(st.position[i] ?? ambientPath(i, t, c), [st.side[i], st.drift[i], st.deep[i]]));
  const gap = vSub(framed[1], framed[0]);
  const weighted: V3 = [2.5 * gap[0], gap[1], 2 * gap[2]];
  const apart: V3 = vLen(weighted) > 1e-4 ? vNorm(weighted) : [0, 0, -1];
  const clear = Math.min(0.5, (2.2 * Math.log1p(Math.exp((0.95 - vLen(gap)) * 5))) / 5);
  for (let i = 0; i < 2; i++) {
    const yieldTo = (i === 0 ? -0.6 : 1) * clear;
    const a = ambientPath(i, t - 0.6, c);
    const b = ambientPath(i, t + 0.6, c);
    const reference = ambientPath(i, t, c);
    const p = st.position[i] ?? reference;
    const vh = (Math.hypot(b[0] - a[0], b[2] - a[2]) / 1.2) * pace;
    const pathY = ((b[1] - a[1]) / 1.2) * pace;
    const wanted = pathVelocity(i, t, c, st.di[i], s);
    // A bounded pursuit correction rejoins the habitat curve by swimming toward it.
    // Vertical scroll travel belongs to the swim; only horizontal/depth wander is homed.
    // Direction takes the fast route; propulsion still uses the heavy, smoothed speed response.
    // Fade the request at its end so a short wheel notch flows back into ambient swimming.
    const intentWeight = smooth(st.intentLife / 0.45);
    const steering = s + (st.intent * 0.85 - s) * intentWeight;
    const turnVertical = -steering * (steering >= 0 ? K_DOWN[i] : K_UP[i]);
    wanted[1] += (turnVertical * Math.hypot(wanted[0], wanted[2]) - wanted[1]) * intentWeight;
    const horizontal = Math.max(1e-5, Math.hypot(wanted[0], wanted[2]));
    for (const axis of [0, 2]) wanted[axis] += 0.055 * Math.tanh((reference[axis] - p[axis]) * 2);
    wanted[1] *= Math.hypot(wanted[0], wanted[2]) / horizontal;
    const desiredSpeed = Math.max(0.035 + Math.abs(c.avoid?.[i] ?? 0) * (1 - Math.min(1, Math.abs(s) / 0.2)), vLen(wanted));
    st.speed[i] += (desiredSpeed - st.speed[i]) * (1 - Math.exp(-dt / (i === 0 ? 1.1 : 0.8)));
    steer(st, i, vNorm(wanted), dt, s);
    const velocity = vScale(st.fwd[i]!, st.speed[i]);
    const vx = velocity[0], vy = velocity[1];
    st.position[i] = vAdd(p, vScale(velocity, dt));
    // Where the camera sees the whole animal now, and how many body lengths one device unit spans
    // at its depth
    const [x0, x1, y0, y1] = projectedBounds(sampleAmbientWhale(i, seconds, c, st), cam);
    const unitY = halfHAt(cam, p[2] + st.deep[i]);
    const unitX = (unitY * cam.halfW) / cam.halfH;
    const k = s >= 0 ? K_DOWN[i] : K_UP[i];
    // While the visitor scrolls, the scroll owns the vertical: the whale gives up its own climb or
    // descent and dives (or rises) with it, so the direction always reads
    let cmd = -s * k * Math.max(vh, 0.05) * (1 + 0.5 * Math.abs(s)) - pathY * Math.min(1, 1.8 * Math.abs(s));
    const calm = 1 - Math.min(1, Math.abs(s) / 0.2);
    cmd -= clamp(st.drift[i] * 0.1, -0.03, 0.03) * calm;
    cmd += clamp(c.avoid?.[i] ?? 0, -0.07, 0.07) * calm;
    cmd += apart[1] * yieldTo;
    const intent = (cmd - st.di[i]) / 0.45;
    st.di[i] += intent * dt;
    // The camera keeps the animal in frame: what it may actually travel on screen (path + drift),
    // eased toward the edges from its whole projected height, flukes and flippers included
    const urge = Math.min(1, Math.abs(s));
    const lead = LEAD_CROP * urge;
    const crop = END_CROP + PASS_CROP * Math.min(1, clear / 0.25);
    const rangeY = frameRange(y1 - y0, -1, top, crop + (s > 0 ? lead : 0), crop + (s < 0 ? lead : 0));
    // While scrolling, each whale's own lead: it follows the page down (or up) as far as its level
    const level = smooth(urge / 0.6);
    if (s > 0 && LEAD_DOWN[i] > rangeY[0]) rangeY[0] = Math.min(rangeY[1], rangeY[0] + (LEAD_DOWN[i] - rangeY[0]) * level);
    if (s < 0 && LEAD_UP[i] < rangeY[1]) rangeY[1] = Math.max(rangeY[0], rangeY[1] + (LEAD_UP[i] - rangeY[1]) * level);
    const dv = softFrame(vy, (y0 + y1) / 2, rangeY, unitY) - vy;
    st.da[i] = (dv - st.dv[i]) / dt;
    st.dv[i] = dv;
    st.drift[i] += dv * dt;
    // The sides frame it the same way, though there it may pass through with its head or flukes
    // cropped. This is the camera panning, slowly, so it never swings the heading; the offset
    // drifts home to the composed path whenever the frame allows
    const home = -clamp(st.side[i] * 0.2, -0.035, 0.035);
    const side = softFrame(vx + home + apart[0] * yieldTo, (x0 + x1) / 2, frameRange(x1 - x0, -1, 1, SIDE_CROP), unitX) - vx;
    st.sideV[i] += (side - st.sideV[i]) * (1 - Math.exp(-dt / 0.3));
    st.side[i] += st.sideV[i] * dt;
    // Depth: the one behind slips further back to pass (neither is drawn toward the camera), and
    // while the visitor scrolls a whale near the camera eases back, as the camera draws away, so
    // it is never too tall to travel down (or up) the frame; at rest the offset drifts home
    const back = Math.min(0, 0.05 - p[2]) * urge;
    let deep = Math.min(0, apart[2] * yieldTo) - clamp((st.deep[i] - back) * 0.25, -0.06, 0.06);
    if (deep > 0) deep *= smooth((0.45 - p[2] - st.deep[i]) / 0.25);
    st.deepV[i] += (deep - st.deepV[i]) * (1 - Math.exp(-dt / 0.4));
    st.deep[i] += st.deepV[i] * dt;
    st.roll[i] += dt * (1 + 1.4 * Math.max(0, s) - 0.45 * Math.max(0, -s));
    // The stroke follows the water swum through, never quicker than the rig's fastest beat
    st.swim[i] += Math.min((dt * (CADENCE[i] * (1 - 0.65 * glideAt(i, t)) + st.speed[i])) / WHALE_SCALE[i], WHALE_RIG.maxBeatHz * WHALE_RIG.stride[i] * dt);

    // Body flex follows the turning with a lag: a 30-tonne animal bends into a turn
    let [turn, climb] = curvature(i, t, c, st);
    // The head anticipates the same desired trajectory that steering is following. The body
    // bends before the centre has finished turning, then releases as the heading aligns.
    const desired = vNorm(wanted);
    const bodyFrame = orientWhale(st.fwd[i]!, st.up[i], st.bank[i][0]);
    turn = clamp(turn + intentWeight * 1.1 * vDot(desired, qRotate(bodyFrame, X_AXIS)), -1.05, 1.05);
    climb = clamp(climb + intentWeight * 1.1 * vDot(desired, qRotate(bodyFrame, Y_AXIS)), -1.05, 1.05);
    const lag = 1 - Math.exp(-dt / (intentWeight > 0 ? 0.09 : 0.28));
    st.bend[i] = [st.bend[i][0] + (turn - st.bend[i][0]) * lag, st.bend[i][1] + (climb - st.bend[i][1]) * lag];
    const tailLag = 1 - Math.exp(-dt / WHALE_RIG.tailLag[i]);
    for (let axis = 0; axis < 2; axis++) st.tailBend[i][axis] += (st.bend[i][axis] - st.tailBend[i][axis]) * tailLag;
    // The lean is a spring a little under critical damping: the whale rolls into a turn, carries
    // the lean through it and settles back level with a breath of overshoot. Pitching adds a
    // twist, so a pull-up from a dive (or a push-over into one) is carved, spiralling, in 3D.
    const bk = st.bank[i];
    // Held dive or climb: roll the back (diving) or the belly (climbing) toward the viewer, by
    // which flank faces the camera (continuous through a head-on heading)
    const f = st.fwd[i]!;
    const facing = clamp(vCross(f, st.up[i])[2] * 3, -1, 1);
    const want = leanFor(st.spin[i], st.up[i], s) + TWIST[i] * st.att[i][3] + DIVE_LEAN[i] * s * facing;
    const wb = 1.5, zb = 0.75;
    bk[1] += (wb * wb * (want - bk[0]) - 2 * zb * wb * bk[1]) * dt;
    bk[0] += bk[1] * dt;
  }
}

/** Instantaneous swim curvature per body length (turn toward the right flank, climb toward the back). */
function curvature(i: number, seconds: number, c: AmbientComposition, travel?: TravelState): [number, number] {
  const h = 1.2;
  const p = ambientPath(i, seconds, c);
  const before = ambientPath(i, seconds - h, c);
  const after = ambientPath(i, seconds + h, c);
  const vel = travel ? pathVelocity(i, seconds, c, headingRise(travel, i), travel.s) : pathVelocity(i, seconds, c, 0, 0);
  const acceleration = vScale([after[0] + before[0] - p[0] * 2, after[1] + before[1] - p[1] * 2, after[2] + before[2] - p[2] * 2], 1 / (h * h));
  acceleration[1] += travel?.da[i] ?? 0;
  const speed = Math.max(0.005, travel ? travel.speed[i] : vLen(vel));
  const forward = travel?.fwd[i] ?? vNorm(vel);
  const level = orientWhale(forward, travel ? travel.up[i] : Y_AXIS);
  const scale = WHALE_SCALE[i];
  // A slow whale banks less, rather than saturating as the speed in the denominator vanishes
  const speed2 = speed * speed + (0.08 * scale) ** 2;
  // From the whale's own steering when it is integrated, else from the path's acceleration
  const spin = travel?.spin[i];
  const bend: V3 = spin ? vScale(vCross(spin, forward), Math.sqrt(speed2)) : acceleration;
  return [
    clamp((vDot(bend, qRotate(level, X_AXIS)) * scale) / speed2, -WHALE_RIG.maxTurn, WHALE_RIG.maxTurn),
    clamp((vDot(bend, qRotate(level, Y_AXIS)) * scale) / speed2, -WHALE_RIG.maxClimb, WHALE_RIG.maxClimb)
  ];
}

export function sampleAmbientWhale(i: number, seconds: number, c: AmbientComposition, travel?: TravelState): WhalePose {
  // Heading and curvature come from a symmetric chord over 2.4 s: on a smooth arc it is the
  // tangent. With travel state the heading, back, curvature and lean are the integrated ones.
  const t = seconds + (travel?.ahead ?? 0);
  const p = travel?.position[i] ?? ambientPath(i, t, c);
  const s = travel?.s ?? 0;
  // Capped pitch: a dive keeps the whale's side to the camera and its basis well defined
  const vel = travel ? pathVelocity(i, t, c, headingRise(travel, i), s) : pathVelocity(i, t, c, 0, 0);
  const speed = Math.max(0.005, travel ? travel.speed[i] : vLen(vel));
  // The heading the whale holds (steered), or the path's own tangent for a stateless sample
  const forward = travel?.fwd[i] ?? vNorm(vel);
  const back = travel ? travel.up[i] : Y_AXIS;
  const scale = WHALE_SCALE[i];
  const [turn, climb] = travel ? travel.bend[i] : curvature(i, t, c);
  // Stateless: the path's curvature times its speed is the turn rate
  const lean = travel ? travel.bank[i][0] : clamp(turn * (speed / scale) * BANK_PER_TURN, -MAX_BANK, MAX_BANK);
  const bank = lean + rollAt(i, travel?.roll[i] ?? seconds);
  // A glides longer and more often; effort rises while the visitor drives the descent or climb.
  // Gathering speed takes power strokes; easing off is a glide.
  const glide = glideAt(i, t);
  const surge = travel ? travel.surge : 0;
  const effort = (travel ? Math.min(0.35, Math.hypot(...travel.bend[i]) * 0.32) : 0) + ((0.45 + Math.min(0.45, (speed / scale) * 2.8)) * (1 - 0.92 * glide) + 0.4 * Math.abs(s)) * (1 + 0.45 * Math.min(0, surge)) + 0.55 * Math.max(0, surge);
  const articulation = articulate({ distance: travel ? travel.swim[i] : seconds * (i === 0 ? 0.115 : 0.135), effort, powerStroke: WHALE_RIG.powerStroke * (1 - glide), turn, climb, tailTurn: travel?.tailBend[i][0], tailClimb: travel?.tailBend[i][1], bank: lean, rollRate: rollRateAt(i, travel?.roll[i] ?? seconds), phase: WHALE_RIG.phase[i], stride: WHALE_RIG.stride[i] });
  // Each beat of the flukes heaves the whole body and rocks it about its centre of mass
  const beat = beatBody(orientWhale(forward, back, bank), articulation, scale);
  const position: V3 = [p[0] + (travel?.side[i] ?? 0) + beat.offset[0], p[1] + (travel?.drift[i] ?? 0) + beat.offset[1], p[2] + (travel?.deep[i] ?? 0) + beat.offset[2]];
  return {
    position,
    quaternion: beat.quaternion,
    scale,
    bank,
    articulation
  };
}
