/** Opening only. The later two-gesture controller never reads or writes this clock. */
export const CREATION_STAGES = [
  ['EYE', 0, 4], ['CREATION', 4, 8.5], ['BIG_BANG', 8.5, 11.5],
  ['GALAXY', 11.5, 15], ['BLACK_HOLE', 15, 18.5], ['SPACE_EXIT', 18.5, 20],
  ['EARTH_APPROACH', 20, 22], ['ATMOSPHERIC_DESCENT', 22, 24],
  ['OCEAN_ENTRY', 24, 26], ['WHALE_HANDOFF', 26, 30]
] as const;
export const CREATION_DURATION = 30;
export const OCEAN_HANDOFF_AT = 26;
export const INTRO_STORAGE_KEY = 'xh-creation-seen-v1';

export type CreationPlaybackState = 'PAUSED' | 'PLAYING_FORWARD' | 'PLAYING_REVERSE' | 'COMPLETED';

/** Fixed playback speed: 30 units / 3.0 units/sec = 10.0 seconds full cinematic duration. */
export const PLAYBACK_SPEED = 3.0;
/** Controlled reverse playback speed. */
export const REVERSE_PLAYBACK_SPEED = 3.0;
/** Exponential rate easing time constant (seconds) between current and target rate for smooth direction changes. */
export const RATE_SMOOTH_TIME = 0.15;

export const easeRange = (t: number, a: number, b: number) => {
  const x = Math.max(0, Math.min(1, (t - a) / (b - a)));
  return x * x * x * (x * (x * 6 - 15) + 10);
};
export function creationStage(t: number) {
  return CREATION_STAGES.find(([, , end]) => t < end)?.[0] ?? 'COMPLETE';
}
/** Normalized timeline progress in [0, 1]. */
export function creationProgress(t = creation.time) {
  return Math.max(0, Math.min(1, t / CREATION_DURATION));
}
/** The renderer's programs: one per original world's transition into the next, then the arrival. */
export const CREATION_PROGRAMS = 6;
export function creationProgramAt(t: number) {
  const world = CREATION_STAGES.slice(0, 5).findIndex(([, , end]) => t < end);
  return world < 0 ? 5 : world;
}
/** The opening's whales surface below the waterline, so never above it; the hero wakes after this. */
export const WHALES_ARRIVE_AT = 25.2;
export const WHALE_SETTLE_AT = 28.8;
export const WHALE_SETTLE_STEP = 0.6;
export const WHALE_FADE_SPAN = 1.8;
export const HERO_WAKES_AT = 28.2;
/**
 * How far a whale still is from its real pose: behind itself along its own heading and down in the
 * deep, so it swims in head first out of the blue. Zero at the end, so the ambient pose takes over.
 */
export function arrivalOffset(t: number, whale: number, forward: readonly [number, number, number] = [0, 0, -1]): [number, number, number] {
  const left = 1 - easeRange(t, WHALES_ARRIVE_AT + whale * 0.5, WHALE_SETTLE_AT + whale * WHALE_SETTLE_STEP);
  const behind = left * (2.6 + whale * 0.4);
  return [-forward[0] * behind, -forward[1] * behind - left * 0.5, -forward[2] * behind - left * (2.5 + whale * 0.8)];
}
export function shouldPlayCreation() {
  if (typeof window === 'undefined') return false;
  if (matchMedia('(prefers-reduced-motion: reduce)').matches || location.hash || scrollY > 20) return false;
  if (performance.getEntriesByType('navigation').some(e => (e as PerformanceNavigationTiming).type === 'back_forward')) return false;
  if ((import.meta as any).env?.DEV && new URLSearchParams(location.search).has('creationqa')) return true;
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
  const clamped = Math.max(0, Math.min(CREATION_DURATION, Number.isFinite(t) ? t : 0));
  const before = creationStage(creation.time);
  creation.time = clamped;
  creation.rate = 0;
  if (creation.state === 'PLAYING_FORWARD') creation.target = CREATION_DURATION;
  else if (creation.state === 'PLAYING_REVERSE') creation.target = 0;
  else creation.target = clamped;
  syncHeroWake(clamped);
  if (before !== creationStage(clamped)) creation.listeners.forEach(fn => fn());
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
    if (creation.time <= 0.001) return;
    creation.paused = false;
    creation.state = 'PLAYING_REVERSE';
    creation.target = 0;
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
  creation.target = 0;
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
  if (creation.state === 'PLAYING_FORWARD') {
    if (creation.held) {
      creation.rate = 0;
      targetRate = 0;
    } else {
      targetRate = PLAYBACK_SPEED;
    }
  } else if (creation.state === 'PLAYING_REVERSE') {
    targetRate = -REVERSE_PLAYBACK_SPEED;
  }

  const rateAlpha = 1 - Math.exp(-stepDt / RATE_SMOOTH_TIME);
  creation.rate += (targetRate - creation.rate) * rateAlpha;
  if (Math.abs(targetRate) < 1e-4 && Math.abs(creation.rate) < 0.04) {
    creation.rate = 0;
  }

  if (Math.abs(creation.rate) < 1e-6) return;

  const before = creationStage(creation.time);
  creation.time = Math.max(0, Math.min(CREATION_DURATION, creation.time + creation.rate * stepDt));
  syncHeroWake(creation.time);

  if (creation.state === 'PLAYING_FORWARD' && creation.time >= CREATION_DURATION - 0.015) {
    creation.time = CREATION_DURATION;
    creation.rate = 0;
    creation.state = 'COMPLETED';
    finishCreation('complete');
  } else if (creation.state === 'PLAYING_REVERSE' && creation.time <= 0.015) {
    creation.time = 0;
    creation.rate = 0;
    creation.state = 'PAUSED';
    creation.target = 0;
    creation.listeners.forEach(fn => fn());
  } else if (before !== creationStage(creation.time)) {
    creation.listeners.forEach(fn => fn());
  }
}
