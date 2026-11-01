/**
 * The two humpbacks' rig: one source of truth for their relative proportions and how their bodies
 * swim, read by the ambient scene (ambientWhaleScene.ts) and the convergence (convergenceScene.ts).
 * Both drive the same mesh (whale3dAnatomy.ts) through the same articulation (whale3dPose.ts); with
 * these shared too, the whales that circle into the Earth are the very animals the page showed.
 */
import { qAxisAngle, qMul, qNorm, qRotate, X_AXIS, Y_AXIS, type Articulation, type Quat } from './whale3dPose.ts';
import type { V3 } from './whale3dAnatomy.ts';

export const WHALE_RIG = {
  /** Relative body sizes: A the larger, majestic animal, B a little smaller. */
  scale: [1, 0.9],
  /** Body lengths per tail beat. */
  stride: [0.62, 0.55],
  /** Stroke phase offsets (radians), so the two never beat in unison. */
  phase: [0, 2.3],
  /** Asymmetry of a powered stroke: a stronger downstroke, a slower recovery. */
  powerStroke: 0.18,
  /** The most a body bends into a turn and into a climb (radians per body length). */
  maxTurn: 0.65,
  maxClimb: 0.42,
  /** How long the tail stock takes to follow the body's bend (s). */
  tailLag: [0.85, 0.65],
  /** How long a lean into a turn takes to build or reverse (s), where a film plays a path: a heavy
   * body rolls into a curve over most of a second, never at the instant the path bends. */
  leanWindow: 0.5,
  /**
   * The fastest tail beat (Hz). However fast a film runs, the flukes keep a stroke the eye can
   * follow: a quicker swim lengthens each beat's reach instead of blurring the beat.
   */
  maxBeatHz: 1.2,
  /** Body lengths of stroke per second a film's whale beats even while it barely moves (gathering
   * from rest, the flukes are already working rather than frozen). */
  cadence: 0.3,
  /** Body heave (body lengths) and rock (radians) each beat of the flukes drives through the body. */
  heave: 0.013,
  rock: 0.028
} as const;

/**
 * What each beat of the flukes does to the whole body: the downstroke lifts the chest and dips the
 * head, the upstroke lets it settle. Returns the heave offset (world units, along the whale's back)
 * and the orientation rocked about its centre of mass.
 */
export function beatBody(level: Quat, a: Articulation, scale: number): { offset: V3; quaternion: Quat } {
  const heave = WHALE_RIG.heave * scale * a.amplitude * Math.sin(a.stroke - 2.4);
  const rock = WHALE_RIG.rock * a.amplitude * Math.sin(a.stroke - 1.2);
  const lift = qRotate(level, Y_AXIS);
  return {
    offset: [lift[0] * heave, lift[1] * heave, lift[2] * heave],
    quaternion: qNorm(qMul(qAxisAngle(qRotate(level, X_AXIS), rock), level))
  };
}
