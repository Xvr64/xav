/** Opening only. The later two-gesture controller never reads or writes this clock. */
export const CREATION_STAGES = [
  ['EYE', 0, 12], ['CREATION', 12, 25], ['BIG_BANG', 25, 33],
  ['GALAXY', 33, 43], ['BLACK_HOLE', 43, 54], ['SPACE_EXIT', 54, 60],
  ['EARTH_APPROACH', 60, 68], ['ATMOSPHERIC_DESCENT', 68, 76],
  ['OCEAN_ENTRY', 76, 81], ['WHALE_HANDOFF', 81, 91]
] as const;
export const CREATION_DURATION = 91;
export const INTRO_STORAGE_KEY = 'xh-creation-seen-v1';
export const easeRange = (t: number, a: number, b: number) => {
  const x = Math.max(0, Math.min(1, (t - a) / (b - a)));
  return x * x * x * (x * (x * 6 - 15) + 10);
};
export function creationStage(t: number) {
  return CREATION_STAGES.find(([, , end]) => t < end)?.[0] ?? 'COMPLETE';
}
/** The renderer's programs: one per original world's transition into the next, then the arrival. */
export const CREATION_PROGRAMS = 6;
export function creationProgramAt(t: number) {
  const world = CREATION_STAGES.slice(0, 5).findIndex(([, , end]) => t < end);
  return world < 0 ? 5 : world;
}
/** The opening's whales surface below the waterline, so never above it; the hero wakes after this. */
export const WHALES_ARRIVE_AT = 79.6;
export const HERO_WAKES_AT = 87;
/**
 * How far a whale still is from its real pose: behind itself along its own heading and down in the
 * deep, so it swims in head first out of the blue. Zero at the end, so the ambient pose takes over.
 */
export function arrivalOffset(t: number, whale: number, forward: readonly [number, number, number] = [0, 0, -1]): [number, number, number] {
  const left = 1 - easeRange(t, WHALES_ARRIVE_AT + whale * 1.5, 88 + whale * 2);
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
  active: shouldPlayCreation(), ready: false, paused: false, time: 0, reason: '',
  /** The next transition's shader is still compiling: the clock waits at the seam. */
  held: false,
  /** How far the hero has woken, 0 to 1, for the layers that fade in with it. */
  onHero: null as ((woken: number) => void) | null,
  listeners: new Set<() => void>()
};
export function finishCreation(reason = 'complete') {
  if (!creation.active) return;
  creation.active = false; creation.time = CREATION_DURATION; creation.reason = reason;
  try { sessionStorage.setItem(INTRO_STORAGE_KEY, '1'); } catch { /* private storage */ }
  creation.listeners.forEach(fn => fn());
}
/** Called by the existing ocean scheduler; hidden tabs contribute no elapsed time. */
export function advanceCreation(dt: number) {
  if (!creation.active || !creation.ready || creation.paused || creation.held) return;
  const before = creationStage(creation.time);
  creation.time = Math.min(CREATION_DURATION, creation.time + Math.max(0, Math.min(0.05, dt)));
  if (creation.time >= HERO_WAKES_AT) creation.onHero?.(easeRange(creation.time, HERO_WAKES_AT, CREATION_DURATION));
  if (creation.time >= CREATION_DURATION) finishCreation();
  else if (before !== creationStage(creation.time)) creation.listeners.forEach(fn => fn());
}
