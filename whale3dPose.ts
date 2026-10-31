/**
 * Whale articulation and orientation: pure functions of their inputs (no state, no clock), so any
 * scroll position, seek or resize reconstructs exactly the same pose.
 *
 * A humpback swims by beating its horizontal flukes up and down. The stroke is a travelling wave
 * of vertical heave that runs the whole body: the head nods gently, the back rolls over the
 * still point by the flippers, the tail stock drives and the flukes whip a quarter cycle behind
 * it; the flippers ride the wave. Turns flex the body laterally into the arc it swims along,
 * dives flex it vertically, the flippers trim against both, and the whole animal banks into a
 * turn. The spine is sampled at SPINE_NODES frames (position + quaternion) that the shader and
 * skinVertex() below interpolate per vertex; the stroke phase follows the distance swum (for the
 * ambient whales, the water swum through as well), so it quickens and eases with the swim.
 *
 * Orientation always lives in quaternions (x, y, z, w), built from a basis or composed from axis
 * rotations, so yaw, pitch and roll combine freely through full turns without gimbal lock.
 */
import {
  PART_FLIPPER_L,
  PART_FLIPPER_R,
  PART_FLUKE,
  SPINE_NODES,
  type V3,
  type WhaleGeometry
} from './whale3dAnatomy.ts';

export type Quat = [number, number, number, number];

// ---- Vector & quaternion helpers --------------------------------------------------------------

export const v3 = (x = 0, y = 0, z = 0): V3 => [x, y, z];
export const vAdd = (a: V3, b: V3): V3 => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
export const vSub = (a: V3, b: V3): V3 => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
export const vScale = (a: V3, k: number): V3 => [a[0] * k, a[1] * k, a[2] * k];
export const vDot = (a: V3, b: V3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
export const vCross = (a: V3, b: V3): V3 => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
export const vLen = (a: V3) => Math.hypot(a[0], a[1], a[2]);
export const vNorm = (a: V3): V3 => {
  const l = vLen(a) || 1;
  return [a[0] / l, a[1] / l, a[2] / l];
};
export const vLerp = (a: V3, b: V3, t: number): V3 => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];

export const qIdentity = (): Quat => [0, 0, 0, 1];
export const qAxisAngle = (axis: V3, angle: number): Quat => {
  const a = vNorm(axis);
  const s = Math.sin(angle / 2);
  return [a[0] * s, a[1] * s, a[2] * s, Math.cos(angle / 2)];
};
export const qMul = (a: Quat, b: Quat): Quat => [
  a[3] * b[0] + a[0] * b[3] + a[1] * b[2] - a[2] * b[1],
  a[3] * b[1] - a[0] * b[2] + a[1] * b[3] + a[2] * b[0],
  a[3] * b[2] + a[0] * b[1] - a[1] * b[0] + a[2] * b[3],
  a[3] * b[3] - a[0] * b[0] - a[1] * b[1] - a[2] * b[2]
];
export const qNorm = (q: Quat): Quat => {
  const l = Math.hypot(q[0], q[1], q[2], q[3]) || 1;
  return [q[0] / l, q[1] / l, q[2] / l, q[3] / l];
};
export const qConj = (q: Quat): Quat => [-q[0], -q[1], -q[2], q[3]];
/** Rotate v by unit quaternion q. */
export const qRotate = (q: Quat, v: V3): V3 => {
  const [qx, qy, qz, qw] = q;
  const tx = 2 * (qy * v[2] - qz * v[1]);
  const ty = 2 * (qz * v[0] - qx * v[2]);
  const tz = 2 * (qx * v[1] - qy * v[0]);
  return [v[0] + qw * tx + (qy * tz - qz * ty), v[1] + qw * ty + (qz * tx - qx * tz), v[2] + qw * tz + (qx * ty - qy * tx)];
};
/** Shortest-path spherical interpolation. */
export const qSlerp = (a: Quat, b: Quat, t: number): Quat => {
  let d = a[0] * b[0] + a[1] * b[1] + a[2] * b[2] + a[3] * b[3];
  let bb = b;
  if (d < 0) {
    d = -d;
    bb = [-b[0], -b[1], -b[2], -b[3]];
  }
  if (d > 0.9995) return qNorm([a[0] + (bb[0] - a[0]) * t, a[1] + (bb[1] - a[1]) * t, a[2] + (bb[2] - a[2]) * t, a[3] + (bb[3] - a[3]) * t]);
  const th = Math.acos(d);
  const s = Math.sin(th);
  const ka = Math.sin((1 - t) * th) / s;
  const kb = Math.sin(t * th) / s;
  return [a[0] * ka + bb[0] * kb, a[1] * ka + bb[1] * kb, a[2] * ka + bb[2] * kb, a[3] * ka + bb[3] * kb];
};
/** Rotation whose columns are the orthonormal basis X, Y, Z. */
export const qFromBasis = (X: V3, Y: V3, Z: V3): Quat => {
  const m00 = X[0], m10 = X[1], m20 = X[2];
  const m01 = Y[0], m11 = Y[1], m21 = Y[2];
  const m02 = Z[0], m12 = Z[1], m22 = Z[2];
  const tr = m00 + m11 + m22;
  if (tr > 0) {
    const s = Math.sqrt(tr + 1) * 2;
    return qNorm([(m21 - m12) / s, (m02 - m20) / s, (m10 - m01) / s, 0.25 * s]);
  }
  if (m00 > m11 && m00 > m22) {
    const s = Math.sqrt(1 + m00 - m11 - m22) * 2;
    return qNorm([0.25 * s, (m01 + m10) / s, (m02 + m20) / s, (m21 - m12) / s]);
  }
  if (m11 > m22) {
    const s = Math.sqrt(1 + m11 - m00 - m22) * 2;
    return qNorm([(m01 + m10) / s, 0.25 * s, (m12 + m21) / s, (m02 - m20) / s]);
  }
  const s = Math.sqrt(1 + m22 - m00 - m11) * 2;
  return qNorm([(m02 + m20) / s, (m12 + m21) / s, 0.25 * s, (m10 - m01) / s]);
};
export const X_AXIS: V3 = [1, 0, 0];
export const Y_AXIS: V3 = [0, 1, 0];
export const Z_AXIS: V3 = [0, 0, 1];

/**
 * Orientation of a whale heading along `forward` with its back toward `up` (made orthogonal),
 * then rolled by `bank` about the heading (positive rolls the back toward the whale's right).
 * Local -Z maps to forward, +Y to the back, +X to the right flank.
 */
export function orientWhale(forward: V3, up: V3, bank = 0): Quat {
  const f = vNorm(forward);
  let u = vSub(up, vScale(f, vDot(up, f)));
  if (vLen(u) < 1e-5) {
    // Heading straight along the up hint: borrow any perpendicular so the basis stays defined
    u = vSub(Z_AXIS, vScale(f, vDot(Z_AXIS, f)));
    if (vLen(u) < 1e-5) u = vSub(X_AXIS, vScale(f, vDot(X_AXIS, f)));
  }
  u = vNorm(u);
  const right = vCross(f, u);
  const q = qFromBasis(right, u, vScale(f, -1));
  return bank === 0 ? q : qMul(qAxisAngle(f, bank), q);
}

/** Yaw (about +Y), then pitch (nose up, about the whale's +X), then roll (about its heading). */
export function yawPitchRoll(yaw: number, pitch: number, roll: number): Quat {
  return qMul(qMul(qAxisAngle(Y_AXIS, yaw), qAxisAngle(X_AXIS, pitch)), qAxisAngle(Z_AXIS, -roll));
}

// ---- Articulation -----------------------------------------------------------------------------

export interface FlipperPose {
  /** Rotation of the flipper from its rest attitude: sweep (back +), dihedral (up +), twist (leading edge up +). */
  sweep: number;
  dihedral: number;
  twist: number;
}

export interface Articulation {
  /** Stroke phase (radians) — advances with the distance swum. */
  stroke: number;
  /** 0 glide … 1 cruise … 1.5 hard acceleration. */
  amplitude: number;
  /** Body curvature toward the whale's +X (right) and +Y (back), per body length. */
  bendYaw: number;
  bendPitch: number;
  /** Optional delayed caudal steering; absent for deterministic cinematic poses. */
  tailYaw?: number;
  tailPitch?: number;
  flipperL: FlipperPose;
  flipperR: FlipperPose;
  /** Extra pitch of the flukes on the peduncle (trailing edge down +), and their spanwise flex. */
  fluke: number;
  flukeFlex: number;
}

export interface SwimInput {
  /** Distance swum in body lengths (any monotone measure; it only sets the stroke phase). */
  distance: number;
  /** Swimming effort: 0 glide, 1 cruise, up to 1.5 accelerating. */
  effort: number;
  /** Path curvature in the whale's frame, per body length: + toward its right / its back. */
  turn?: number;
  tailTurn?: number;
  tailClimb?: number;
  rollRate?: number;
  /** Smooth phase asymmetry for a stronger power stroke and slower recovery. */
  powerStroke?: number;
  climb?: number;
  /** Current bank angle (radians), used to trim the flippers. */
  bank?: number;
  /** Phase offset (radians) so two whales never beat in unison. */
  phase?: number;
  /** Body lengths per stroke cycle. */
  stride?: number;
}

/** The pose of the body and appendages for a moment of swimming. */
export function articulate(input: SwimInput): Articulation {
  const effort = Math.max(0, Math.min(1.6, input.effort));
  const stride = input.stride ?? 0.95;
  const phase = (input.distance / stride) * Math.PI * 2 + (input.phase ?? 0);
  const stroke = phase + Math.max(0, Math.min(0.25, input.powerStroke ?? 0)) * Math.sin(phase);
  // Glide keeps a residual undulation; the stroke deepens with effort
  const amplitude = 0.16 + 0.84 * effort;
  const turn = input.turn ?? 0;
  const climb = input.climb ?? 0;
  const bank = input.bank ?? 0;
  const beat = Math.sin(stroke + 0.9);
  const sway = Math.cos(stroke + 0.9);
  // Flippers: spread for gliding, trimmed against a turn (the inside one lowered and swept back),
  // and carried by the stroke: they lift and fall as the body wave passes under them, sweep back
  // on the downstroke and feather their leading edge, so the long wings ride the swim
  const trim = Math.max(-0.5, Math.min(0.5, turn * 0.35 + bank * 0.25 + (input.rollRate ?? 0) * 0.28));
  const glide = 1 - Math.min(1, effort);
  const base = { sweep: 0.05 - 0.12 * glide, dihedral: 0.1 * glide - 0.04 * climb, twist: -0.06 * climb };
  const lift = 0.13 * amplitude * beat;
  const fold = 0.06 * amplitude * sway;
  const feather = 0.09 * amplitude * sway;
  // The flukes follow the tail stock a quarter beat behind (the whip of the stroke) and flex
  // across their span, the tips trailing the centre
  return {
    stroke,
    amplitude,
    bendYaw: turn,
    bendPitch: climb,
    tailYaw: input.tailTurn,
    tailPitch: input.tailClimb,
    flipperL: { sweep: base.sweep - trim * 0.4 + fold, dihedral: base.dihedral + trim + lift, twist: base.twist + feather },
    flipperR: { sweep: base.sweep + trim * 0.4 + fold, dihedral: base.dihedral - trim + lift * 0.88 + 0.015 * amplitude * Math.sin(stroke + 0.3), twist: base.twist + feather * 0.9 },
    fluke: 0.5 * amplitude * Math.cos(stroke - 2 * Math.PI * 0.9 - 0.98),
    flukeFlex: 0.09 * amplitude * Math.sin(stroke - 2 * Math.PI * 0.95 - 0.98)
  };
}

/** Blend two articulations (t = 0 → a, 1 → b); the stroke takes the short way round. */
export function blendArticulation(a: Articulation, b: Articulation, t: number): Articulation {
  const mix = (x: number, y: number) => x + (y - x) * t;
  const fin = (x: FlipperPose, y: FlipperPose) => ({ sweep: mix(x.sweep, y.sweep), dihedral: mix(x.dihedral, y.dihedral), twist: mix(x.twist, y.twist) });
  const strokeDelta = Math.atan2(Math.sin(b.stroke - a.stroke), Math.cos(b.stroke - a.stroke));
  return {
    stroke: a.stroke + strokeDelta * t,
    amplitude: mix(a.amplitude, b.amplitude),
    bendYaw: mix(a.bendYaw, b.bendYaw),
    bendPitch: mix(a.bendPitch, b.bendPitch),
    tailYaw: mix(a.tailYaw ?? a.bendYaw, b.tailYaw ?? b.bendYaw),
    tailPitch: mix(a.tailPitch ?? a.bendPitch, b.tailPitch ?? b.bendPitch),
    flipperL: fin(a.flipperL, b.flipperL),
    flipperR: fin(a.flipperR, b.flipperR),
    fluke: mix(a.fluke, b.fluke),
    flukeFlex: mix(a.flukeFlex, b.flukeFlex)
  };
}

const PIVOT_S = 0.38;
/** Wave number of the stroke along the body (just under one wavelength per body length). */
const WAVE_K = (2 * Math.PI) / 1.25;

/**
 * Heave envelope of the body wave (body lengths at cruise): the head nods a little, the motion
 * all but vanishes over the flippers (the centre of mass), then swells through the back and the
 * tail stock to the flukes, which sweep about a fifth of a body length peak to peak.
 */
const heaveEnv = (s: number) => 0.8 * (0.012 - 0.06 * s + 0.09 * s * s + 0.075 * s * s * s);
const heaveEnvSlope = (s: number) => 0.8 * (-0.06 + 0.18 * s + 0.225 * s * s);

/**
 * Vertical bend angle of the spine at s from the stroke: the slope of a travelling wave of
 * heave h(s, t) = A(s) sin(stroke - k s). Every station bends as part of one wave running from
 * the head to the flukes, so the nod of the head, the roll of the back over the flippers and the
 * drive of the tail stock are one continuous motion rather than a hinged tail.
 */
export function strokeAngle(a: Articulation, s: number): number {
  const phase = a.stroke - WAVE_K * s;
  return a.amplitude * Math.atan(heaveEnvSlope(s) * Math.sin(phase) - WAVE_K * heaveEnv(s) * Math.cos(phase));
}

/**
 * Spine frames for an articulation: SPINE_NODES samples from snout (s = 0) to notch (s = 1),
 * integrated outward from a pivot behind the flippers (the centre of mass, which stays put).
 * Writes xyz positions (w = s) into outP and quaternions into outQ, 4 floats per node.
 */
export function spineFrames(a: Articulation, outP: Float32Array, outQ: Float32Array, offset = 0) {
  const n = SPINE_NODES;
  const ds = 1 / (n - 1);
  const pivot = Math.round(PIVOT_S * (n - 1));
  const tan: V3[] = [];
  for (let i = 0; i < n; i++) {
    const s = i * ds;
    // Delayed curvature grows continuously behind the shoulders: the head initiates a turn,
    // the torso carries it and the caudal stock follows through after the head straightens.
    const rear = Math.max(0, (s - PIVOT_S) / (1 - PIVOT_S));
    const lagWeight = rear * rear * (3 - 2 * rear);
    const yawBend = a.bendYaw + ((a.tailYaw ?? a.bendYaw) - a.bendYaw) * lagWeight;
    const pitchBend = a.bendPitch + ((a.tailPitch ?? a.bendPitch) - a.bendPitch) * lagWeight;
    const yaw = yawBend * (s - PIVOT_S);
    const pitch = -pitchBend * (s - PIVOT_S) + strokeAngle(a, s);
    const q = qMul(qAxisAngle(Y_AXIS, yaw), qAxisAngle(X_AXIS, pitch));
    outQ.set(q, offset + i * 4);
    tan.push(qRotate(q, Z_AXIS));
  }
  const pos: V3[] = new Array(n);
  pos[pivot] = [0, 0, pivot * ds - 0.5];
  for (let i = pivot + 1; i < n; i++) pos[i] = vAdd(pos[i - 1], vScale(vAdd(tan[i - 1], tan[i]), ds / 2));
  for (let i = pivot - 1; i >= 0; i--) pos[i] = vSub(pos[i + 1], vScale(vAdd(tan[i + 1], tan[i]), ds / 2));
  for (let i = 0; i < n; i++) outP.set([pos[i][0], pos[i][1], pos[i][2], i * ds], offset + i * 4);
}

/** Rest attitude of the right flipper: out, swept back and angled down from the flank. */
const FLIPPER_REST = { sweep: 0.74, dihedral: 0.3, twist: 0.12 };

/** Quaternion of a flipper (span axis +X for the right one, mirrored for the left). */
export function flipperQuat(pose: FlipperPose, left: boolean): Quat {
  const sweep = FLIPPER_REST.sweep + pose.sweep;
  const dihedral = FLIPPER_REST.dihedral - pose.dihedral;
  const twist = FLIPPER_REST.twist + pose.twist;
  // Right flipper: twist about its span, droop about the body axis, sweep about the vertical
  const q = qMul(qMul(qAxisAngle(Y_AXIS, -sweep), qAxisAngle(Z_AXIS, -dihedral)), qAxisAngle(X_AXIS, -twist));
  // Mirror through the median plane for the left flipper
  return left ? [q[0], -q[1], -q[2], q[3]] : q;
}
export const flukeQuat = (a: Articulation): Quat => qAxisAngle(X_AXIS, a.fluke);

/** Per-whale skinning inputs packed for the GPU: 3 texture rows of SPINE_NODES RGBA texels. */
export const SKIN_ROWS = 3;
/**
 * Pack a pose into rows [positions, quaternions, extras] at `row`: the extras row holds the left
 * and right flipper quaternions, the fluke quaternion, then (flukeFlex, dissolve, 0, 0).
 */
export function packSkin(a: Articulation, data: Float32Array, row: number, dissolve = 0) {
  const w = SPINE_NODES * 4;
  const base = row * SKIN_ROWS * w;
  const p = data.subarray(base, base + w);
  const q = data.subarray(base + w, base + 2 * w);
  spineFrames(a, p, q, 0);
  const e = data.subarray(base + 2 * w, base + 3 * w);
  e.set(flipperQuat(a.flipperL, true), 0);
  e.set(flipperQuat(a.flipperR, false), 4);
  e.set(flukeQuat(a), 8);
  e.set([a.flukeFlex, dissolve, 0, 0], 12);
}

// ---- CPU skinning (mirrors the shader; used for tests, bounds and sampling) -------------------

export interface SkinnedFrames {
  p: Float32Array;
  q: Float32Array;
  flipL: Quat;
  flipR: Quat;
  fluke: Quat;
  flukeFlex: number;
}

export function skinFrames(a: Articulation): SkinnedFrames {
  const p = new Float32Array(SPINE_NODES * 4);
  const q = new Float32Array(SPINE_NODES * 4);
  spineFrames(a, p, q);
  return { p, q, flipL: flipperQuat(a.flipperL, true), flipR: flipperQuat(a.flipperR, false), fluke: flukeQuat(a), flukeFlex: a.flukeFlex };
}

/** Whale-local position of one vertex under a pose (same maths as the vertex shader). */
export function skinVertex(f: SkinnedFrames, g: WhaleGeometry, v: number): V3 {
  const idx = g.spine[v];
  const i0 = Math.min(SPINE_NODES - 2, Math.floor(idx));
  const t = idx - i0;
  const P: V3 = vLerp([f.p[i0 * 4], f.p[i0 * 4 + 1], f.p[i0 * 4 + 2]], [f.p[i0 * 4 + 4], f.p[i0 * 4 + 5], f.p[i0 * 4 + 6]], t);
  const Q = qNorm([
    f.q[i0 * 4] + (f.q[i0 * 4 + 4] - f.q[i0 * 4]) * t,
    f.q[i0 * 4 + 1] + (f.q[i0 * 4 + 5] - f.q[i0 * 4 + 1]) * t,
    f.q[i0 * 4 + 2] + (f.q[i0 * 4 + 6] - f.q[i0 * 4 + 2]) * t,
    f.q[i0 * 4 + 3] + (f.q[i0 * 4 + 7] - f.q[i0 * 4 + 3]) * t
  ]);
  const part = g.info[v * 4];
  let off: V3 = [g.offset[v * 3], g.offset[v * 3 + 1], g.offset[v * 3 + 2]];
  const sz = g.spine[v] / (SPINE_NODES - 1) - 0.5;
  if (part === PART_FLIPPER_L || part === PART_FLIPPER_R) {
    const pv = part === PART_FLIPPER_L ? g.pivots.flipperL : g.pivots.flipperR;
    off = vAdd([pv[0], pv[1], pv[2] - sz], qRotate(part === PART_FLIPPER_L ? f.flipL : f.flipR, off));
  } else if (part === PART_FLUKE) {
    const pv = g.pivots.fluke;
    const flexed: V3 = [off[0], off[1] + f.flukeFlex * (off[0] / 0.168) ** 2, off[2]];
    off = vAdd([pv[0], pv[1], pv[2] - sz], qRotate(f.fluke, flexed));
  }
  return vAdd(P, qRotate(Q, off));
}

// ---- Path following ----------------------------------------------------------------------------

export interface WhalePose {
  position: V3;
  quaternion: Quat;
  /** World units per body length. */
  scale: number;
  articulation: Articulation;
  bank: number;
}

export interface WhaleMotion {
  /** World position of the whale's centre at path parameter u ∈ [0, 1] (pure). */
  path: (u: number) => V3;
  /** Back direction hint at u (defaults to world up). */
  up?: (u: number) => V3;
  /** World units per body length. */
  length: number;
  /** Swimming effort along the path (defaults to cruise). */
  effort?: (u: number) => number;
  phase?: number;
  stride?: number;
  /** Bank gain: radians of roll per unit of lateral curvature (per body length). */
  bankGain?: number;
  maxBank?: number;
  /**
   * The shared rig (whaleRig.ts) and the film's clock (real seconds at u), when the path is played
   * as a film: the body then bends within the rig's limits, the tail stock lags the bend by the
   * rig's time, the flippers trim against the roll rate and the beat keeps the rig's tempo.
   */
  rig?: MotionRig;
  seconds?: (u: number) => number;
}

export interface MotionRig {
  powerStroke: number;
  maxTurn: number;
  maxClimb: number;
  /** Seconds. */
  tailLag: number;
  /** Seconds of film the lean into a turn is taken over (each side). */
  leanWindow: number;
  maxBeatHz: number;
}

const DIST_STEPS = 64;
/** Arc length of the path from 0 to u, in body lengths (fixed-step, deterministic). */
export function distanceAlong(m: WhaleMotion, u: number): number {
  let d = 0;
  let prev = m.path(0);
  const steps = Math.max(1, Math.ceil(DIST_STEPS * Math.abs(u)));
  for (let i = 1; i <= steps; i++) {
    const p = m.path((u * i) / steps);
    d += vLen(vSub(p, prev));
    prev = p;
  }
  return d / m.length;
}

/**
 * The stroke's measure of distance under a film clock: body lengths swum, but never faster than
 * the rig's fastest beat allows (stride × beats per second of the film's real time).
 */
function strokeDistance(m: WhaleMotion, u: number): number {
  if (!m.rig || !m.seconds) return distanceAlong(m, u);
  const cap = m.rig.maxBeatHz * (m.stride ?? 0.95);
  const steps = Math.max(1, Math.ceil(DIST_STEPS * Math.abs(u)));
  let d = 0;
  let prev = m.path(0);
  let prevT = m.seconds(0);
  for (let i = 1; i <= steps; i++) {
    const v = (u * i) / steps;
    const p = m.path(v);
    const t = m.seconds(v);
    d += Math.min(vLen(vSub(p, prev)) / m.length, cap * Math.abs(t - prevT));
    prev = p;
    prevT = t;
  }
  return Math.sign(u) * d;
}

/** Heading, curvature (per body length, in the whale's frame) and bank at u. */
function pathFrame(m: WhaleMotion, u: number) {
  const h = 1e-3;
  const p0 = m.path(u - h);
  const p1 = m.path(u);
  const p2 = m.path(u + h);
  const vel = vScale(vSub(p2, p0), 1 / (2 * h));
  const acc = vScale(vAdd(vSub(p2, vScale(p1, 2)), p0), 1 / (h * h));
  const speed = Math.max(1e-6, vLen(vel));
  const fwd = vScale(vel, 1 / speed);
  const upHint = m.up ? m.up(u) : Y_AXIS;
  const level = orientWhale(fwd, upHint, 0);
  // Curvature vector (per world unit) → per body length in the whale's own frame
  const aPerp = vSub(acc, vScale(fwd, vDot(acc, fwd)));
  const kappa = vScale(aPerp, 1 / (speed * speed));
  let turn = vDot(kappa, qRotate(level, X_AXIS)) * m.length;
  let climb = vDot(kappa, qRotate(level, Y_AXIS)) * m.length;
  const maxBank = m.maxBank ?? 0.55;
  // Bank into the turn: a right turn rolls the back toward the right
  const bank = Math.max(-maxBank, Math.min(maxBank, turn * (m.bankGain ?? 0.55)));
  if (m.rig) {
    turn = Math.max(-m.rig.maxTurn, Math.min(m.rig.maxTurn, turn));
    climb = Math.max(-m.rig.maxClimb, Math.min(m.rig.maxClimb, climb));
  }
  return { position: p1, fwd, upHint, turn, climb, bank };
}

/**
 * The lean into a turn, taken over a window of the film (±w in u, triangle-weighted): a heavy
 * body rolls into a turn and out of it, never flipping its lean from one side to the other at
 * the instant the path's curvature does.
 */
function leanAt(m: WhaleMotion, u: number, w: number): number {
  const K = 4;
  let sum = 0;
  let weight = 0;
  for (let k = -K; k <= K; k++) {
    const c = K + 1 - Math.abs(k);
    sum += c * pathFrame(m, u + (k / K) * w).bank;
    weight += c;
  }
  return sum / weight;
}

/**
 * The pure pose sampler: the whale's transform and articulation at progress u along its motion.
 * Heading follows the path tangent; the body flexes into the path's curvature; the whale banks
 * into turns; the stroke phase follows the distance swum.
 */
export function sampleWhalePose(progress: number, m: WhaleMotion): WhalePose {
  const u = progress;
  const frame = pathFrame(m, u);
  const { position, fwd, upHint, turn, climb } = frame;
  let bank = frame.bank;
  let rig: Partial<SwimInput> = {};
  if (m.rig && m.seconds) {
    // Film seconds per unit of u here: turns the rig's times into path parameter and back
    const h = 1e-3;
    const rate = Math.max(1e-6, (m.seconds(u + h) - m.seconds(u - h)) / (2 * h));
    const lean = (v: number) => leanAt(m, v, m.rig!.leanWindow / rate);
    bank = lean(u);
    const tail = pathFrame(m, u - m.rig.tailLag / rate);
    const rollRate = (lean(u + h) - lean(u - h)) / (2 * h) / rate;
    rig = { powerStroke: m.rig.powerStroke, tailTurn: tail.turn, tailClimb: tail.climb, rollRate };
  }
  const quaternion = orientWhale(fwd, upHint, bank);
  const articulation = articulate({
    distance: strokeDistance(m, u),
    effort: m.effort ? m.effort(u) : 1,
    turn,
    climb,
    bank,
    phase: m.phase,
    stride: m.stride,
    ...rig
  });
  return { position, quaternion, scale: m.length, articulation, bank };
}
