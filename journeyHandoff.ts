import type { JourneyId } from './creationTimeline.ts';

/**
 * THE HANDOFF — "Choose your journey" becoming the journey.
 *
 * One clock, read by the two layers that already exist, so nothing is hidden or shown on its own:
 *   outgoing  the arrival's 2D ASCII canvas (arrivalDissolve.ts): the letters decode into glyphs
 *             and flow, cell by cell, into the shape the destination will open from
 *   incoming  the opening's own WebGL screen pass (creationRenderer.ts, uReveal): the destination's
 *             real first frame resolves out of the dark along that same shape, glyph by glyph
 * The eye (Passage, Odyssey) opens from a horizontal slit along its own lid curve; Earth (Direct)
 * gathers from its silhouette. The destination is never drawn before it can be: the reveal waits
 * for the opening's first frame, and only the timing of the handoff lives here.
 */
/**
 * The handoff's pace: every moment of it (these timings, the letters' decode cadence and fades, the
 * sky's rush, the reveal's flicker, the veil's CSS) is written at pace 1 and stretched by this one
 * factor, so the whole choreography slows together and nothing drifts out of step. At 5 the
 * decode, the flight and the recomposition each take their time.
 */
export const HANDOFF_PACE = 5;
/** A moment of the choreography (ms at pace 1), at the handoff's pace */
export const paced = (ms: number) => ms * HANDOFF_PACE;

export const HANDOFF = {
  /** A letter starts to decode between these (ms); the chosen journey's own letters go last */
  dissolveFrom: paced(30),
  dissolveTo: paced(200),
  chosenFrom: paced(190),
  chosenTo: paced(270),
  /** A letter's own decode before it lets go */
  scramble: paced(150),
  /** Its flight into the destination's shape */
  flowMin: paced(400),
  flowMax: paced(560),
  /** The destination begins to emerge no sooner than this, and only once it can draw */
  revealAfter: paced(240),
  /** ...and takes this long */
  reveal: paced(820),
  /**
   * Safety only: a destination still compiling is waited for (the letters hold their shape), never
   * revealed over nothing and then cut in. Past this, or with no opening left to enter, it goes ahead.
   */
  revealLatest: 10000
} as const;

export type RevealShape = 'eye' | 'planet';
export const revealShapeFor = (journey: JourneyId | null): RevealShape => (journey === 'direct' ? 'planet' : 'eye');

export const handoff = {
  journey: null as JourneyId | null,
  /** performance.now() at the choice; 0 when no handoff is running */
  startedAt: 0,
  /** When the destination began to emerge; 0 until it can */
  revealAt: 0
};

const smooth = (x: number) => {
  const t = Math.max(0, Math.min(1, x));
  return t * t * (3 - 2 * t);
};

export function beginHandoff(journey: JourneyId, now = performance.now()) {
  handoff.journey = journey;
  handoff.startedAt = now || 1;
  handoff.revealAt = 0;
  if (typeof document !== 'undefined') document.documentElement.dataset.handoff = journey;
  trace.startedAt = handoff.startedAt;
  trace.revealAt = 0;
  // Dev QA: the browser checks read the handoff's own timestamps
  if ((import.meta as any).env?.DEV && typeof window !== 'undefined') (window as any).__handoff = trace;
}
/** The last handoff's timestamps, kept after it ends (QA). */
export const trace = { startedAt: 0, revealAt: 0 };

export function endHandoff() {
  handoff.startedAt = 0;
  handoff.revealAt = 0;
  if (typeof document !== 'undefined') delete document.documentElement.dataset.handoff;
}

export const handoffRunning = () => handoff.startedAt > 0;

/** Seconds since the choice at pace 1 (the reveal's decode flicker keeps step), 0 when idle. */
export const handoffClock = (now = performance.now()) => (handoff.startedAt ? (now - handoff.startedAt) / paced(1000) : 0);

/**
 * Called on the opening's frame: starts the reveal once the letters have begun to go and the
 * destination's first frame can actually be drawn. Returns whether the handoff is animating.
 * `openingAlive` false (the opening gave up: no WebGL, a failed compile) lets it go ahead at once.
 */
export function tickHandoff(now: number, destinationDrawable: boolean, openingAlive = true) {
  if (!handoff.startedAt) return false;
  const elapsed = now - handoff.startedAt;
  const ready = destinationDrawable || !openingAlive || elapsed >= HANDOFF.revealLatest;
  if (!handoff.revealAt && elapsed >= HANDOFF.revealAfter && ready) handoff.revealAt = trace.revealAt = now;
  return true;
}

/** The destination's emergence, eased 0..1; exactly 1 whenever no handoff is running. */
export function handoffReveal(now = performance.now()) {
  if (!handoff.startedAt) return 1;
  if (!handoff.revealAt) return 0;
  return smooth((now - handoff.revealAt) / HANDOFF.reveal);
}
