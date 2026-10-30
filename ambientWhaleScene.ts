/**
 * The two background humpbacks. Each swims a deterministic wander path in time; the scroll adds a
 * vertical travel that the visibility-aware owner integrates (stepTravel, ambientWhaleRuntime.ts),
 * so scrolling down sends the whales diving down the page and scrolling up lets them rise.
 *
 * Units are Whale A's body length. The camera looks down -Z from (0, 0, AMBIENT_DISTANCE), close
 * enough for real perspective, its field of view solved from the viewport so that Whale A spans
 * most of a desktop screen and a little more than a phone's width.
 *
 * Heading always follows the whale's total velocity (wander + travel), and the travel only ever
 * tilts that velocity up or down within a capped pitch. A reversal of the scroll therefore turns
 * the whale through level swimming in a curved 3D arc: it never mirrors or flips.
 */
import type { V3 } from './whale3dAnatomy.ts';
import { articulate, orientWhale, qRotate, vAdd, vCross, vSub, vScale, vLen, vNorm, vDot, X_AXIS, Y_AXIS, Z_AXIS, type WhalePose } from './whale3dPose.ts';

export interface AmbientComposition {
  width: number;
  height: number;
  scroll: number;
  weight: number;
  lanes: readonly { x: number; y: number }[];
  surfaceY: number;
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
const TAU = Math.PI * 2;
const mod = (x: number, m: number) => ((x % m) + m) % m;
const clamp = (x: number, a: number, b: number) => Math.max(a, Math.min(b, x));

/** The framing: monumental on every screen, a whale never smaller than its anatomy can carry. */
export function ambientCamera(width: number, height: number): AmbientCamera {
  const W = Math.max(1, width);
  const H = Math.max(1, height);
  const px = Math.min(1.15 * W, 1.25 * H, Math.max(0.7 * W, 0.62 * H));
  const halfH = H / (2 * px);
  return { z: AMBIENT_DISTANCE, fov: (2 * Math.atan(halfH / AMBIENT_DISTANCE) * 180) / Math.PI, halfW: W / (2 * px), halfH, px };
}
/** Half the visible height at depth z (perspective: deeper water shows more of the ocean). */
const halfHAt = (cam: AmbientCamera, z: number) => (cam.halfH * (cam.z - z)) / cam.z;

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
export const rollAt = (i: number, clock: number) => TAU * smooth((mod(clock + i * 79, ROLL_PERIOD[i]) - ROLL_START[i]) / 20);

/** Relative body sizes: A the larger, majestic animal, B a little smaller. */
export const WHALE_SCALE = [1, 0.9];
/** Body lengths per tail beat. */
const STRIDE = [0.62, 0.55];
/** tan(dive angle) and tan(climb angle): B dives more steeply, both rise more gently. */
const K_DOWN = [1.05, 1.3];
const K_UP = [0.8, 0.95];
/**
 * The steepest a heading may tilt, as tan(pitch): about 35° at rest (restrained, unhurried),
 * opening to about 61° while the visitor scrolls. The whale is still seen from the side.
 */
const pitchCap = (s: number) => 0.7 + 1.1 * Math.min(1, Math.abs(s));
/** The fastest each whale turns (rad/s): A unhurried, B a little nimbler. */
const MAX_TURN = [0.7, 0.95];
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
    // A: one slow, broad ellipse; long passes, turns that show the whole flank, a deep dive now and then
    const a = (t * TAU) / 78 + 0.55;
    const dive = deepDiveAt(t);
    x = cx + ax * Math.sin(a) + 0.04 * Math.sin(t * 0.021);
    y = cy + 0.22 * cam.halfH * Math.sin(a * 0.61 + 0.4) - 0.5 * dive;
    z = -0.05 + 0.5 * Math.cos(a) - 0.3 * dive;
  } else {
    // B: quicker and more exploratory, its loop folded by secondary curves
    const a = (t * TAU) / 54 + 3.1;
    x = cx + 0.85 * ax * Math.sin(a) + 0.18 * Math.sin(a * 2.2 + 0.7);
    y = cy + 0.34 * cam.halfH * Math.sin(a * 0.73 + 1.7) + 0.06 * Math.sin(a * 2.9);
    z = -0.8 + 0.4 * Math.cos(a) + 0.15 * Math.sin(a * 1.6 + 0.3);
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
  p[2] += (follow[2] - 0.8 - p[2]) * social;
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
  s: number;
  sv: number;
  /** Per whale: vertical offset from the wander path, its rate and acceleration. */
  drift: [number, number];
  dv: [number, number];
  da: [number, number];
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
}
export const newTravel = (seconds = 0): TravelState => ({
  s: 0, sv: 0, drift: [0, 0], dv: [0, 0], da: [0, 0], roll: [seconds, seconds], swim: [0, 0], fwd: [null, null], spin: [[0, 0, 0], [0, 0, 0]], up: [[0, 1, 0], [0, 1, 0]], bend: [[0, 0], [0, 0]], att: [[0, 0, 0, 0], [0, 0, 0, 0]]
});
/** a made perpendicular to the unit vector f (b if a is parallel to f). */
const perpTo = (a: V3, f: V3, b: V3 = Z_AXIS): V3 => {
  let u = vSub(a, vScale(f, vDot(a, f)));
  if (vLen(u) < 1e-5) u = vSub(b, vScale(f, vDot(b, f)));
  return vNorm(u);
};

/** The path's velocity (wander + travel) with the pitch capped: where the whale wants to head. */
function pathVelocity(i: number, seconds: number, c: AmbientComposition, dv: number, s: number): V3 {
  const h = 1.2;
  const before = ambientPath(i, seconds - h, c);
  const after = ambientPath(i, seconds + h, c);
  const vel = vScale(vSub(after, before), 1 / (2 * h));
  vel[1] += dv;
  const level = Math.hypot(vel[0], vel[2]);
  const cap = pitchCap(s);
  if (Math.abs(vel[1]) > cap * level) vel[1] = Math.sign(vel[1]) * cap * level;
  return vel;
}

/**
 * Turn a held heading toward the wanted one: a critically damped spring in yaw and pitch whose
 * rate is capped. Where a path slows almost to a stop its tangent can swing at any speed; the
 * animal instead pivots at its own pace, with the anticipation and follow-through of a heavy
 * body. Big turns are made in yaw about the vertical, as a whale turns, never by looping over
 * the top; pitch only ever moves between where the whale points and where it wants to.
 */
function steer(st: TravelState, i: number, want: V3, dt: number) {
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
  const k = 2.2;
  const eYaw = Math.atan2(Math.sin(wantYaw - a[0]), Math.cos(wantYaw - a[0]));
  const ePitch = wantPitch - a[1];
  let wy = a[2] + (k * k * eYaw - 2 * k * a[2]) * dt;
  let wp = a[3] + (k * k * ePitch - 2 * k * a[3]) * dt;
  // The rate cap applies to the true angular speed (a yaw turn is shorter near the poles)
  const rate = Math.hypot(wy * Math.cos(a[1]), wp);
  if (rate > MAX_TURN[i]) { wy *= MAX_TURN[i] / rate; wp *= MAX_TURN[i] / rate; }
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
 * vertical component stays continuous; a whale carried out of view re-enters from the far edge,
 * and at rest each one drifts home into the frame.
 */
export function stepTravel(st: TravelState, target: number, dt: number, seconds: number, c: AmbientComposition) {
  if (!(dt > 0)) return;
  const cam = ambientCamera(c.width, c.height);
  const w = 1.6;
  st.sv += (w * w * (clamp(target, -1, 1) - st.s) - 2 * w * st.sv) * dt;
  st.s += st.sv * dt;
  const s = st.s;
  for (let i = 0; i < 2; i++) {
    const a = ambientPath(i, seconds - 0.6, c);
    const b = ambientPath(i, seconds + 0.6, c);
    const p = ambientPath(i, seconds, c);
    const vh = Math.hypot(b[0] - a[0], b[2] - a[2]) / 1.2;
    const vy = (b[1] - a[1]) / 1.2;
    const k = s >= 0 ? K_DOWN[i] : K_UP[i];
    let cmd = -s * k * Math.max(vh, 0.04) * (1 + 0.5 * Math.abs(s));
    const vis = halfHAt(cam, p[2]) + 0.75;
    const span = 2 * vis;
    const rest = st.drift[i] - span * Math.round(st.drift[i] / span);
    const calm = 1 - Math.min(1, Math.abs(s) / 0.2);
    cmd -= clamp(rest * 0.1, -0.03, 0.03) * calm;
    const da = (cmd - st.dv[i]) / 0.9;
    st.dv[i] += da * dt;
    st.da[i] = da;
    st.drift[i] += st.dv[i] * dt;
    const y = p[1] + st.drift[i];
    if (y < -vis) st.drift[i] += span;
    else if (y > vis) st.drift[i] -= span;
    st.roll[i] += dt * (1 + 1.4 * Math.max(0, s) - 0.45 * Math.max(0, -s));
    st.swim[i] += (dt * Math.hypot(vh, vy + st.dv[i])) / WHALE_SCALE[i];
    steer(st, i, vNorm(pathVelocity(i, seconds, c, st.dv[i], st.s)), dt);
    // Banking and body flex follow the turning with a lag: a 30-tonne animal leans into a turn
    const [turn, climb] = curvature(i, seconds, c, st);
    const lag = 1 - Math.exp(-dt / 0.7);
    st.bend[i] = [st.bend[i][0] + (turn - st.bend[i][0]) * lag, st.bend[i][1] + (climb - st.bend[i][1]) * lag];
  }
}

/** Instantaneous swim curvature per body length (turn toward the right flank, climb toward the back). */
function curvature(i: number, seconds: number, c: AmbientComposition, travel?: TravelState): [number, number] {
  const h = 1.2;
  const p = ambientPath(i, seconds, c);
  const before = ambientPath(i, seconds - h, c);
  const after = ambientPath(i, seconds + h, c);
  const vel = pathVelocity(i, seconds, c, travel?.dv[i] ?? 0, travel?.s ?? 0);
  const acceleration = vScale([after[0] + before[0] - p[0] * 2, after[1] + before[1] - p[1] * 2, after[2] + before[2] - p[2] * 2], 1 / (h * h));
  acceleration[1] += travel?.da[i] ?? 0;
  const speed = Math.max(0.005, vLen(vel));
  const forward = travel?.fwd[i] ?? vNorm(vel);
  const level = orientWhale(forward, travel ? travel.up[i] : Y_AXIS);
  const scale = WHALE_SCALE[i];
  // A slow whale banks less, rather than saturating as the speed in the denominator vanishes
  const speed2 = speed * speed + (0.08 * scale) ** 2;
  // From the whale's own steering when it is integrated, else from the path's acceleration
  const spin = travel?.spin[i];
  const bend: V3 = spin ? vScale(vCross(spin, forward), Math.sqrt(speed2)) : acceleration;
  return [
    clamp((vDot(bend, qRotate(level, X_AXIS)) * scale) / speed2, -0.65, 0.65),
    clamp((vDot(bend, qRotate(level, Y_AXIS)) * scale) / speed2, -0.3, 0.3)
  ];
}

export function sampleAmbientWhale(i: number, seconds: number, c: AmbientComposition, travel?: TravelState): WhalePose {
  // Heading and curvature come from a symmetric chord over 2.4 s: on a smooth arc it is the
  // tangent. With travel state the heading, back and curvature are the integrated ones.
  const p = ambientPath(i, seconds, c);
  const s = travel?.s ?? 0;
  // Capped pitch: a dive keeps the whale's side to the camera and its basis well defined
  const vel = pathVelocity(i, seconds, c, travel?.dv[i] ?? 0, travel?.s ?? 0);
  const speed = Math.max(0.005, vLen(vel));
  // The heading the whale holds (steered), or the path's own tangent for a stateless sample
  const forward = travel?.fwd[i] ?? vNorm(vel);
  const back = travel ? travel.up[i] : Y_AXIS;
  const scale = WHALE_SCALE[i];
  const [turn, climb] = travel ? travel.bend[i] : curvature(i, seconds, c);
  // Diving: wider banking; rising: restrained
  const gain = 0.45 + 0.3 * Math.max(0, s) - 0.15 * Math.max(0, -s);
  const bank = turn * gain + rollAt(i, travel?.roll[i] ?? seconds);
  // A glides longer and more often; effort rises while the visitor drives the descent or climb
  const glide = i === 0 ? windowAt(mod(seconds, 71), 28, 52, 8) : windowAt(mod(seconds + 23, 53), 30, 41, 6);
  const effort = (0.45 + Math.min(0.45, (speed / scale) * 2.8)) * (1 - 0.92 * glide) + 0.4 * Math.abs(s);
  const position: V3 = [p[0], p[1] + (travel?.drift[i] ?? 0), p[2]];
  return {
    position,
    quaternion: orientWhale(forward, back, bank),
    scale,
    bank,
    articulation: articulate({ distance: travel ? travel.swim[i] : seconds * (i === 0 ? 0.09 : 0.12), effort, turn, climb, bank: turn * gain, phase: i * 2.3, stride: STRIDE[i] })
  };
}
