/** Opening only. The later two-gesture controller never reads or writes this clock. */
export const CREATION_STAGES = [
  ['EYE', 0, 12], ['CREATION', 12, 25], ['BIG_BANG', 25, 33],
  ['GALAXY', 33, 43], ['BLACK_HOLE', 43, 54], ['SPACE_EXIT', 54, 60],
  ['EARTH_APPROACH', 60, 68], ['ATMOSPHERIC_DESCENT', 68, 76],
  ['OCEAN_ENTRY', 76, 81], ['WHALE_HANDOFF', 81, 91]
] as const;
export const CREATION_DURATION = 91;
export const OCEAN_HANDOFF_AT = 81;
export const INTRO_STORAGE_KEY = 'xh-creation-seen-v1';
export const JOURNEY_STORAGE_KEY = 'xh-journey-v1';

export type CreationPlaybackState = 'PAUSED' | 'PLAYING_FORWARD' | 'PLAYING_REVERSE' | 'COMPLETED';

/**
 * PART A — FAST INTRO (0 <= t < HERO_WAKES_AT):
 * Fast, energetic progression (~3.5x speed) through the entire intro:
 * Eye of Creation worlds, black hole, space, Earth approach, atmospheric descent,
 * ocean surface, underwater entry, and whales swimming into position.
 * Approximately 3.5x faster than original speed.
 */
export const INTRO_FAST_SPEED = 3.5;

/**
 * PART B — ORIGINAL-SPEED HERO (HERO_WAKES_AT <= t <= CREATION_DURATION):
 * Strictly 1.0 unit/second to preserve the exact camera movement, easing, and dramatic pacing
 * of the CV Hero reveal and "A Journey Without Horizon" epigraph typography animation.
 */
export const HERO_NATURAL_SPEED = 1.0;

/** Blend boundary immediately before the actual CV Hero reveal (85.0s to 87.0s). */
export const HERO_BLEND_START = 85.0;

/** Backwards-compatible aliases for legacy imports. */
export const COSMIC_ACCELERATED_SPEED = INTRO_FAST_SPEED;
export const ARRIVAL_NATURAL_SPEED = HERO_NATURAL_SPEED;
export const PLAYBACK_SPEED = INTRO_FAST_SPEED;
export const REVERSE_PLAYBACK_SPEED = INTRO_FAST_SPEED;

/** Exponential rate easing time constant (seconds) for silky-smooth direction and speed blends. */
export const RATE_SMOOTH_TIME = 0.18;

/**
 * Target playback speed at timeline position `t`.
 * 
 * PART A: All pre-hero sequences (Eye, black hole, space, Earth approach, atmospheric descent,
 * ocean surface, underwater entry, and whales) remain FAST (3.5x speed).
 * 
 * PART B: Only at the exact moment the CV Hero begins waking (HERO_WAKES_AT = 87) does the speed
 * settle strictly at original natural cinematic speed (1.0x).
 * 
 * Eased smoothly between HERO_BLEND_START (85.0) and HERO_WAKES_AT (87.0) to eliminate
 * any velocity step or camera jump.
 */
export function targetPlaybackSpeed(t: number): number {
  if (t <= HERO_BLEND_START) return INTRO_FAST_SPEED;
  if (t >= HERO_WAKES_AT) return HERO_NATURAL_SPEED;
  const blend = easeRange(t, HERO_BLEND_START, HERO_WAKES_AT);
  return INTRO_FAST_SPEED + (HERO_NATURAL_SPEED - INTRO_FAST_SPEED) * blend;
}

export const easeRange = (t: number, a: number, b: number) => {
  const x = Math.max(0, Math.min(1, (t - a) / (b - a)));
  return x * x * x * (x * (x * 6 - 15) + 10);
};
export function creationStage(t: number) {
  return CREATION_STAGES.find(([, , end]) => t < end)?.[0] ?? 'COMPLETE';
}
/** Normalized timeline progress in [0, 1]. */
export function creationProgress(t = creation.time) {
  return Math.max(0, Math.min(1, clockAtScene(t) / journeyLength()));
}
/** The renderer's programs: one per original world's transition into the next, then the arrival. */
export const CREATION_PROGRAMS = 6;
export function creationProgramAt(t: number) {
  const world = CREATION_STAGES.slice(0, 5).findIndex(([, , end]) => t < end);
  return world < 0 ? 5 : world;
}
/** The opening's whales surface below the waterline, so never above it; the hero wakes after this. */
export const WHALES_ARRIVE_AT = 79.6;
export const WHALE_SETTLE_AT = 88;
export const WHALE_SETTLE_STEP = 2;
export const WHALE_FADE_SPAN = 5;
export const HERO_WAKES_AT = 87;
/**
 * How far a whale still is from its real pose: behind itself along its own heading and down in the
 * deep, so it swims in head first out of the blue. Zero at the end, so the ambient pose takes over.
 */
export function arrivalOffset(t: number, whale: number, forward: readonly [number, number, number] = [0, 0, -1]): [number, number, number] {
  const left = 1 - easeRange(t, WHALES_ARRIVE_AT + whale * 1.5, WHALE_SETTLE_AT + whale * WHALE_SETTLE_STEP);
  const behind = left * (2.6 + whale * 0.4);
  return [-forward[0] * behind, -forward[1] * behind - left * 0.5, -forward[2] * behind - left * (2.5 + whale * 0.8)];
}
/* ------------------------------------------------------------------------------------------------
 * JOURNEYS — three routes through the one clock.
 *
 * Every consumer (renderer, whales, hero, ocean) still reads creation.time as the opening's own
 * scene time, 0..91. A journey is an ordered list of spans of that scene time, played back to back
 * on its own playhead (the journey clock). The Odyssey is the single span 0..91, so its clock IS
 * the scene time and it plays exactly as before. Reversing walks the same spans backwards, so a
 * journey never enters a scene it left out. Speed still comes from the scene time
 * (targetPlaybackSpeed), so every journey is fast up to the hero and natural through it.
 * ---------------------------------------------------------------------------------------------- */
export type JourneyId = 'direct' | 'passage' | 'odyssey';
export const JOURNEY_IDS: readonly JourneyId[] = ['direct', 'passage', 'odyssey'];
/** The renderer's program for the Passage: the eye, its pupil opening on hyperspace, then Earth. */
export const PASSAGE_PROGRAM = 6;
/** The Passage's eye keeps the original eye's timing: its pupil has swallowed the screen by here. */
export const PASSAGE_EYE_END = 12;
/** The Passage's tunnel lands exactly on the arrival's own frame at PASSAGE_RESUME, already approaching. */
export const PASSAGE_END = 22;
export const PASSAGE_RESUME = 62;
/** Direct opens on the planet already in view (altitude 4), the approach about to begin. */
export const DIRECT_START = 60;

/** A span of scene time; `program` overrides the renderer's program for scene times inside it. */
export interface JourneySegment { readonly from: number; readonly to: number; readonly program?: number }
/** 'eye' is the eye-only variant: the quick first frame of an eye while its full program compiles. */
export type JourneyProgram = number | 'eye';
export interface JourneyRoute {
  readonly id: JourneyId;
  readonly segments: readonly JourneySegment[];
  /** The renderer programs this route draws, in the order they are first needed. */
  readonly programs: readonly JourneyProgram[];
}
export const JOURNEY_ROUTES: Readonly<Record<JourneyId, JourneyRoute>> = {
  // EARTH -> OCEAN -> HERO
  direct: { id: 'direct', segments: [{ from: DIRECT_START, to: CREATION_DURATION }], programs: [5] },
  // EYE -> STAR TUNNEL -> EARTH -> OCEAN -> HERO
  passage: {
    id: 'passage',
    segments: [{ from: 0, to: PASSAGE_END, program: PASSAGE_PROGRAM }, { from: PASSAGE_RESUME, to: CREATION_DURATION }],
    programs: ['eye', PASSAGE_PROGRAM, 5]
  },
  // The complete original opening
  odyssey: { id: 'odyssey', segments: [{ from: 0, to: CREATION_DURATION }], programs: ['eye', 0, 1, 2, 3, 4, 5] }
};
/**
 * While the visitor is still choosing: every journey's first frame first (the eye-only variant opens
 * both eye journeys, the arrival program opens Direct), then the Passage's own, then the Odyssey's.
 */
const CHOOSING_PROGRAMS: readonly JourneyProgram[] = ['eye', 5, PASSAGE_PROGRAM, 0, 1, 2, 3, 4];

const isJourneyId = (v: unknown): v is JourneyId => JOURNEY_IDS.includes(v as JourneyId);
function storedJourney(): JourneyId | null {
  try {
    const v = typeof sessionStorage === 'undefined' ? null : sessionStorage.getItem(JOURNEY_STORAGE_KEY);
    return isJourneyId(v) ? v : null;
  } catch { return null; }
}

/** The route being played; with no journey chosen (QA, an opening without the arrival), the Odyssey. */
export function journeyRoute(id: JourneyId | null = creation.journey): JourneyRoute {
  return JOURNEY_ROUTES[id ?? 'odyssey'];
}
export function journeyLength(route = journeyRoute()) {
  return route.segments.reduce((sum, g) => sum + g.to - g.from, 0);
}
export function journeyStart(route = journeyRoute()) {
  return route.segments[0].from;
}
/** Scene time at a point of the journey clock. A seam belongs to the span after it. */
export function sceneAtClock(clock: number, route = journeyRoute()) {
  let c = Math.max(0, clock);
  const segments = route.segments;
  for (let i = 0; i < segments.length; i++) {
    const g = segments[i], span = g.to - g.from;
    if (c < span || i === segments.length - 1) return Math.min(g.to, g.from + c);
    c -= span;
  }
  return CREATION_DURATION;
}
/** The journey clock at a scene time; a scene the route leaves out reads as its nearest edge. */
export function clockAtScene(t: number, route = journeyRoute()) {
  let offset = 0, best = 0, bestDistance = Infinity;
  for (const g of route.segments) {
    if (t >= g.from && t <= g.to) return offset + t - g.from;
    const edge = t < g.from ? g.from : g.to;
    if (Math.abs(t - edge) < bestDistance) { bestDistance = Math.abs(t - edge); best = offset + edge - g.from; }
    offset += g.to - g.from;
  }
  return best;
}
/** Which renderer program draws scene time `t` on this route. */
export function journeyProgramAt(t: number, route = journeyRoute()) {
  for (const g of route.segments) if (g.program !== undefined && t >= g.from && t <= g.to) return g.program;
  return creationProgramAt(t);
}
export type JourneyStage = ReturnType<typeof creationStage> | 'STAR_TUNNEL';
/** The stage on screen, by the route: the Passage's tunnel is its own. */
export function journeyStage(t: number, route = journeyRoute()): JourneyStage {
  if (journeyProgramAt(t, route) === PASSAGE_PROGRAM) return t < PASSAGE_EYE_END ? 'EYE' : 'STAR_TUNNEL';
  return creationStage(t);
}
/** Programs the renderer should compile, in order. */
export function journeyPrograms(): readonly JourneyProgram[] {
  return creation.choosing ? CHOOSING_PROGRAMS : journeyRoute().programs;
}
/** The journey's playhead. */
export function journeyClock(t = creation.time) {
  return clockAtScene(t);
}
/** Resting on the chosen journey's first frame: where "Scroll once to enter" shows. */
export function atJourneyStart() {
  return creation.active && creation.state === 'PAUSED' && journeyClock() <= 0.05;
}
/** Where playback will be in a moment, along the route (for the compiling-ahead check). */
export function creationLookahead(span = 0.08) {
  const route = journeyRoute(), clock = clockAtScene(creation.time, route);
  const ahead = creation.target >= creation.time ? clock + span : clock - span;
  return sceneAtClock(Math.max(0, Math.min(journeyLength(route), ahead)), route);
}

export function shouldPlayCreation() {
  if (typeof window === 'undefined') return false;
  if ((import.meta as any).env?.DEV && new URLSearchParams(location.search).has('creationqa')) return true;
  if (matchMedia('(prefers-reduced-motion: reduce)').matches || location.hash || scrollY > 20) return false;
  if (performance.getEntriesByType('navigation').some(e => (e as PerformanceNavigationTiming).type === 'back_forward')) return false;
  try { return sessionStorage.getItem(INTRO_STORAGE_KEY) !== '1'; } catch { return true; }
}
export const creation = {
  active: shouldPlayCreation(),
  ready: false,
  paused: false,
  state: 'PAUSED' as CreationPlaybackState,
  time: 0,
  target: 0,
  rate: 0,
  ambient: 0,
  reason: '',
  /** The chosen journey; null plays the full opening (the Odyssey's route). */
  journey: storedJourney() as JourneyId | null,
  /** The arrival is still open: no journey yet, so the renderer compiles the likeliest first. */
  choosing: false,
  /** The next transition's shader is still compiling: the clock waits at the seam. */
  held: false,
  /** How far the hero has woken, 0 to 1, for the layers that fade in with it. */
  onHero: null as ((woken: number) => void) | null,
  listeners: new Set<() => void>()
};

let lastHeroWoken = 0;

export function syncHeroWake(time = creation.time) {
  const woken = time >= HERO_WAKES_AT ? easeRange(time, HERO_WAKES_AT, CREATION_DURATION) : 0;
  if (woken !== lastHeroWoken || woken > 0) {
    lastHeroWoken = woken;
    creation.onHero?.(woken);
  }
}

export function seekCreation(t: number) {
  const route = journeyRoute();
  // Only scenes on the chosen route can be shown: anything else lands on its nearest edge
  const clamped = sceneAtClock(clockAtScene(Math.max(0, Math.min(CREATION_DURATION, Number.isFinite(t) ? t : 0)), route), route);
  const before = journeyStage(creation.time, route);
  const wasInitial = creation.state === 'PAUSED' && clockAtScene(creation.time, route) <= 0.05;
  creation.time = clamped;
  creation.rate = 0;
  if (clockAtScene(clamped, route) === 0) {
    creation.state = 'PAUSED';
    creation.target = clamped;
  } else if (creation.state === 'PLAYING_FORWARD') creation.target = CREATION_DURATION;
  else if (creation.state === 'PLAYING_REVERSE') creation.target = journeyStart(route);
  else creation.target = clamped;
  syncHeroWake(clamped);
  const isInitial = creation.state === 'PAUSED' && clockAtScene(creation.time, route) <= 0.05;
  if (before !== journeyStage(clamped, route) || wasInitial !== isInitial) creation.listeners.forEach(fn => fn());
}

/**
 * Called once, when the visitor picks a journey. The opening has not moved yet (the arrival held
 * every gesture), so the journey simply decides its first frame; the scroll-once cue stays.
 */
export function setCreationJourney(id: JourneyId) {
  creation.journey = id;
  creation.choosing = false;
  try { sessionStorage.setItem(JOURNEY_STORAGE_KEY, id); } catch { /* private storage */ }
  const route = journeyRoute();
  creation.rate = 0;
  if (creation.state === 'PAUSED' || creation.state === 'COMPLETED') {
    creation.time = creation.state === 'COMPLETED' ? CREATION_DURATION : journeyStart(route);
    creation.target = creation.time;
  } else creation.time = sceneAtClock(clockAtScene(creation.time, route), route);
  syncHeroWake(creation.time);
  creation.listeners.forEach(fn => fn());
}

/**
 * Handle a deliberate scroll gesture (+1 = downward/forward, -1 = upward/reverse).
 * Scroll direction controls the timeline playback direction at a strictly fixed speed.
 * Repeated scrolls in the current direction do not alter speed, restart, skip or queue.
 */
export function triggerCreationGesture(dir: 1 | -1, source: 'wheel' | 'touch' | 'key' = 'wheel') {
  if (!creation.active || !creation.ready) return;
  if (dir > 0) {
    if (creation.state === 'PLAYING_FORWARD' && !creation.paused) return;
    creation.paused = false;
    creation.state = 'PLAYING_FORWARD';
    creation.target = CREATION_DURATION;
    creation.listeners.forEach(fn => fn());
  } else if (dir < 0) {
    if (creation.state === 'PLAYING_REVERSE' && !creation.paused) return;
    if (journeyClock() <= 0.001) return;
    creation.paused = false;
    creation.state = 'PLAYING_REVERSE';
    creation.target = journeyStart();
    creation.listeners.forEach(fn => fn());
  }
}

/** Backwards-compatible helper for QA tools and raw deltas. */
export function scrubCreation(deltaPx: number, nowMs = 0, source: 'wheel' | 'touch' | 'key' = 'wheel') {
  if (!Number.isFinite(deltaPx) || deltaPx === 0) return;
  triggerCreationGesture(Math.sign(deltaPx) as 1 | -1, source);
}

/**
 * Re-enter the cinematic introduction in reverse from the completed boundary (at top of page).
 */
export function reopenCreationInReverse() {
  if (creation.active) return;
  creation.active = true;
  creation.state = 'PLAYING_REVERSE';
  creation.time = CREATION_DURATION;
  creation.target = journeyStart();
  creation.rate = 0;
  creation.paused = false;
  creation.reason = '';
  try { sessionStorage.removeItem(INTRO_STORAGE_KEY); } catch {}
  creation.listeners.forEach(fn => fn());
}

export function finishCreation(reason = 'complete') {
  if (!creation.active) return;
  creation.active = false;
  creation.time = CREATION_DURATION;
  creation.target = CREATION_DURATION;
  creation.rate = 0;
  creation.state = 'COMPLETED';
  creation.reason = reason;
  lastHeroWoken = 0;
  try { sessionStorage.setItem(INTRO_STORAGE_KEY, '1'); } catch { /* private storage */ }
  creation.listeners.forEach(fn => fn());
}

/**
 * Called by the existing ocean scheduler; hidden tabs contribute no elapsed time.
 * Advances subtle ambient motion and advances playback smoothly in the active direction at fixed speed.
 * Direction changes (forward <-> reverse) ease smoothly over ~0.15s.
 */
export function advanceCreation(dt: number) {
  if (!creation.active || !creation.ready) return;
  const stepDt = Math.max(0, Math.min(0.05, dt));
  creation.ambient += stepDt * 0.65;
  if (creation.paused) {
    creation.rate = 0;
    return;
  }

  let targetRate = 0;
  const currentSpeed = targetPlaybackSpeed(creation.time);
  if (creation.state === 'PLAYING_FORWARD') {
    if (creation.held) {
      creation.rate = 0;
      targetRate = 0;
    } else {
      targetRate = currentSpeed;
    }
  } else if (creation.state === 'PLAYING_REVERSE') {
    targetRate = -currentSpeed;
  }

  const rateAlpha = 1 - Math.exp(-stepDt / RATE_SMOOTH_TIME);
  creation.rate += (targetRate - creation.rate) * rateAlpha;
  if (Math.abs(targetRate) < 1e-4 && Math.abs(creation.rate) < 0.04) {
    creation.rate = 0;
  }

  if (Math.abs(creation.rate) < 1e-6) return;

  // The playhead moves along the chosen route and the scene follows it (identity for the Odyssey)
  const route = journeyRoute();
  const length = journeyLength(route);
  const before = journeyStage(creation.time, route);
  const clock = Math.max(0, Math.min(length, clockAtScene(creation.time, route) + creation.rate * stepDt));
  creation.time = sceneAtClock(clock, route);
  syncHeroWake(creation.time);

  if (creation.state === 'PLAYING_FORWARD' && clock >= length - 0.015) {
    creation.time = CREATION_DURATION;
    creation.rate = 0;
    creation.state = 'COMPLETED';
    finishCreation('complete');
  } else if (creation.state === 'PLAYING_REVERSE' && clock <= 0.015) {
    creation.time = journeyStart(route);
    creation.rate = 0;
    creation.state = 'PAUSED';
    creation.target = creation.time;
    creation.listeners.forEach(fn => fn());
  } else if (before !== journeyStage(creation.time, route)) {
    creation.listeners.forEach(fn => fn());
  }
}
