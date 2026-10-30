/** Deterministic ambient choreography. Seconds are supplied by the visibility-aware owner;
 * scroll changes the current gradually, never the sign of a whale's heading. */
import type { V3 } from './whale3dAnatomy.ts';
import { articulate, orientWhale, qRotate, vSub, vScale, vLen, vNorm, vDot, X_AXIS, Y_AXIS, type WhalePose } from './whale3dPose.ts';

export interface AmbientComposition {
  width: number;
  height: number;
  scroll: number;
  weight: number;
  lanes: readonly { x: number; y: number }[];
  surfaceY: number;
}
export const AMBIENT_CAMERA_Z = 12;
export const AMBIENT_FOV = 30;
const TAU = Math.PI * 2;
// C2 easing: acceleration is continuous too, so curvature-driven banking never snaps at a
// behavior boundary (a cubic smoothstep only preserves position and velocity).
const smooth = (x: number) => { const t = Math.max(0, Math.min(1, x)); return t * t * t * (t * (t * 6 - 15) + 10); };
const windowAt = (t: number, a: number, b: number, fade: number) => smooth((t - a) / fade) * (1 - smooth((t - b) / fade));
export const socialAt = (t: number) => windowAt(((t % 263) + 263) % 263, 115, 166, 18);
export const rollAt = (i: number, t: number) => TAU * smooth((((t + i * 79) % 317 + 317) % 317 - 224) / 24);

/** World-space curves, bounded inside the ocean. Different periods prevent lockstep repetition. */
function rawPath(i: number, t: number, c: AmbientComposition): V3 {
  const a = t * TAU / (i === 0 ? 112 : 87) + (i === 0 ? 0.55 : 3.1);
  const halfH = AMBIENT_CAMERA_Z * Math.tan(AMBIENT_FOV * Math.PI / 360);
  const halfW = halfH * c.width / Math.max(1, c.height);
  const lane = c.lanes[i];
  // Editorial holds move the centre of the habitat, but never flatten its depth or stop turns.
  const hold = c.weight * 0.68;
  const cx = 0.5 + (lane.x - 0.5) * hold;
  const cy = (i === 0 ? 0.64 : 0.37) * (1 - hold) + lane.y * hold;
  const x = cx + (0.28 - 0.12 * hold) * Math.sin(a) + 0.025 * Math.sin(t * 0.021 + i);
  const y = cy + (i === 0 ? 0.09 : 0.14) * Math.sin(a * 0.73 + i * 1.7)
    + 0.025 * Math.sin(c.scroll * 0.38 + i);
  const surface = Number.isFinite(c.surfaceY) ? c.surfaceY / c.height + 0.12 : 0.1;
  // Smooth maximum keeps the back beneath the composed surface without a hard stop.
  const submergedY = surface + Math.log1p(Math.exp((y - surface) * 24)) / 24;
  const boundedY = 0.89 - Math.log1p(Math.exp((0.89 - submergedY) * 30)) / 30;
  return [(x - 0.5) * 2 * halfW, (0.5 - boundedY) * 2 * halfH,
    (i === 0 ? -0.3 : -2.1) + (i === 0 ? 1.65 : 1.9) * Math.cos(a) + 0.2 * Math.sin(c.scroll * 0.3)];
}

export function ambientPath(i: number, t: number, c: AmbientComposition): V3 {
  const p = rawPath(i, t, c);
  if (i === 0) return p;
  const lead = rawPath(0, t, c);
  const follow = rawPath(0, t - 9, c);
  const social = socialAt(t);
  // A brief curved approach and follow, then separation. Never the cinematic paired orbit.
  // The weave scales with the habitat: in absolute units it outpaced the lead's own drift on a
  // phone, so the follower reversed on the spot.
  const halfW = AMBIENT_CAMERA_Z * Math.tan(AMBIENT_FOV * Math.PI / 360) * c.width / Math.max(1, c.height);
  p[0] += (follow[0] + 0.08 * halfW * Math.sin(t * 0.12) - p[0]) * social;
  p[1] += (follow[1] + 0.75 - p[1]) * social;
  p[2] += (follow[2] - 2.4 - p[2]) * social;
  const d = vSub(p, lead);
  const distance = vLen(d);
  const clearance = ambientLength(c);
  // Smooth repulsion has no discontinuity at a collision boundary. Offset in depth is always
  // preferred to moving across an editorial column. The paths never share their centre.
  // A soft ramp: a sharp one acted as a wall and swung the follower round within a second.
  const push = Math.log1p(Math.exp((clearance - distance) * 2)) / 2;
  const away = vNorm([d[0], d[1], d[2] - 0.3]);
  return [p[0] + away[0] * push, p[1] + away[1] * push, p[2] + away[2] * push];
}

export function ambientLength(c: AmbientComposition) {
  const halfH = AMBIENT_CAMERA_Z * Math.tan(AMBIENT_FOV * Math.PI / 360);
  return 2 * halfH * Math.min(c.width, c.height) / c.height * 0.51;
}

export function sampleAmbientWhale(i: number, seconds: number, c: AmbientComposition): WhalePose {
  // Heading and curvature from a symmetric chord over 2.4 s: on a smooth arc it is the tangent,
  // and where the path slows almost to a stop the whale pivots instead of spinning on the spot.
  const h = 1.2;
  const p = ambientPath(i, seconds, c);
  const before = ambientPath(i, seconds - h, c);
  const after = ambientPath(i, seconds + h, c);
  const vel = vScale(vSub(after, before), 1 / (2 * h));
  const speed = Math.max(0.01, vLen(vel));
  const acceleration = vScale([after[0] + before[0] - p[0] * 2, after[1] + before[1] - p[1] * 2, after[2] + before[2] - p[2] * 2], 1 / (h * h));
  const forward = vNorm(vel);
  const level = orientWhale(forward, Y_AXIS);
  const scale = ambientLength(c) * (i === 0 ? 1 : 0.86);
  // A slow whale banks less, rather than saturating as the speed in the denominator vanishes
  const speed2 = speed * speed + (0.08 * scale) ** 2;
  const turn = Math.max(-0.65, Math.min(0.65, vDot(acceleration, qRotate(level, X_AXIS)) * scale / speed2));
  const climb = Math.max(-0.3, Math.min(0.3, vDot(acceleration, qRotate(level, Y_AXIS)) * scale / speed2));
  const bank = turn * 0.45 + rollAt(i, seconds);
  const glide = windowAt(((seconds + i * 23) % 67 + 67) % 67, 35, 49, 7);
  const effort = (0.45 + Math.min(0.45, speed / Math.max(0.1, scale) * 2.8)) * (1 - 0.94 * glide);
  return { position: p, quaternion: orientWhale(forward, Y_AXIS, bank), scale, bank,
    articulation: articulate({ distance: seconds * (i === 0 ? 0.115 : 0.139), effort, turn, climb, bank: turn * 0.45, phase: i * 2.3, stride: i === 0 ? 0.95 : 0.88 }) };
}
