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

/** Scroll distance (CSS px) corresponding to the full 0..1 intro progression (~4x less sensitive). */
export const SCROLL_PIXELS_PER_INTRO = 5400;
/** Maximum lead (timeline units) target progress can build ahead of current progress during a burst. */
export const MAX_TARGET_LEAD = 1.6;
/** Maximum interpolation speed (timeline units / second) so fast scrolling never skips scenes. */
export const MAX_SCRUB_SPEED = 6.0;
/** Exponential smoothing time constant (seconds) between current and target timeline progress. */
export const SCRUB_SMOOTH_TIME = 0.065;

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
  active: shouldPlayCreation(), ready: false, paused: false, time: 0, target: 0, ambient: 0, reason: '',
  /** The next transition's shader is still compiling: the clock waits at the seam. */
  held: false,
  /** How far the hero has woken, 0 to 1, for the layers that fade in with it. */
  onHero: null as ((woken: number) => void) | null,
  listeners: new Set<() => void>()
};

let lastWheelMs = -Infinity;
let prevWheelMag = 0;
let peakWheelMag = 0;
let lastWheelDir = 0;
let wheelDecaying = false;
let lastHeroWoken = 0;

function resetWheelState() {
  lastWheelMs = -Infinity;
  prevWheelMag = 0;
  peakWheelMag = 0;
  lastWheelDir = 0;
  wheelDecaying = false;
}

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
  creation.target = clamped;
  resetWheelState();
  syncHeroWake(clamped);
  if (before !== creationStage(clamped)) creation.listeners.forEach(fn => fn());
}

/**
 * Feed scroll input (+px downward/forward, -px upward/reverse) into the target timeline progress.
 * Reversals respond immediately; wheel spikes and momentum tails are bounded so fast flicks never
 * skip scenes or cause chaotic camera acceleration.
 */
export function scrubCreation(deltaPx: number, nowMs = 0, source: 'wheel' | 'touch' | 'key' = 'wheel') {
  if (!creation.active || !creation.ready || creation.paused || !Number.isFinite(deltaPx) || deltaPx === 0) return;
  const dir = Math.sign(deltaPx);
  const currentLead = creation.target - creation.time;
  // Reversing scroll direction immediately cancels any unconsumed lead in the opposite direction
  if (currentLead !== 0 && Math.sign(currentLead) !== dir) {
    creation.target = creation.time;
  }
  const pxPerUnit = SCROLL_PIXELS_PER_INTRO / CREATION_DURATION;
  let effectivePx = deltaPx;
  if (source === 'wheel') {
    const mag = Math.abs(deltaPx);
    const dtMs = nowMs - lastWheelMs;
    if (dtMs < 0 || dtMs >= 180 || dir !== lastWheelDir) {
      wheelDecaying = false;
      peakWheelMag = mag;
    } else {
      if (wheelDecaying && mag > prevWheelMag * 1.6 && mag >= 14) {
        // A clear upward jump after decay means the visitor's hand engaged again
        wheelDecaying = false;
        peakWheelMag = mag;
      } else if (mag > peakWheelMag) {
        peakWheelMag = mag;
      } else if (mag < prevWheelMag * 0.94 || mag < peakWheelMag * 0.78) {
        wheelDecaying = true;
      }
    }
    const sameDir = dir === lastWheelDir;
    lastWheelMs = nowMs;
    prevWheelMag = mag;
    lastWheelDir = dir;
    // Bound per-event scroll by inter-event elapsed time so high-frequency wheel bursts or
    // smooth-scroll subdivisions never multiply sensitivity, while small/slow scrolls stay linear.
    const maxStepForInterval = dtMs > 0 && dtMs < 160 && sameDir ? Math.max(10, dtMs * 0.34) : 55;
    const cappedMag = maxStepForInterval * Math.tanh(mag / maxStepForInterval);
    effectivePx = dir * cappedMag * (wheelDecaying ? 0.25 : 1);
  }
  const nextTarget = creation.target + effectivePx / pxPerUnit;
  const leadBounded = Math.max(
    creation.time - MAX_TARGET_LEAD,
    Math.min(creation.time + MAX_TARGET_LEAD, nextTarget)
  );
  creation.target = Math.max(0, Math.min(CREATION_DURATION, leadBounded));
}

export function finishCreation(reason = 'complete') {
  if (!creation.active) return;
  creation.active = false;
  creation.time = CREATION_DURATION;
  creation.target = CREATION_DURATION;
  creation.reason = reason;
  lastHeroWoken = 0;
  resetWheelState();
  try { sessionStorage.setItem(INTRO_STORAGE_KEY, '1'); } catch { /* private storage */ }
  creation.listeners.forEach(fn => fn());
}

/**
 * Called by the existing ocean scheduler; hidden tabs contribute no elapsed time.
 * Advances subtle ambient motion and smoothly interpolates timeline progress toward `creation.target`.
 * Never advances timeline progress automatically without scroll input.
 */
export function advanceCreation(dt: number) {
  if (!creation.active || !creation.ready || creation.paused) return;
  const stepDt = Math.max(0, Math.min(0.05, dt));
  creation.ambient += stepDt * 0.65;
  const diff = creation.target - creation.time;
  if (Math.abs(diff) < 1e-6) return;
  if (creation.held && diff > 0) return;
  const before = creationStage(creation.time);
  const alpha = 1 - Math.exp(-stepDt / SCRUB_SMOOTH_TIME);
  const maxDelta = MAX_SCRUB_SPEED * stepDt;
  const rawStep = Math.abs(diff) * alpha;
  const minStep = Math.min(Math.abs(diff), 0.28 * stepDt);
  const stepMag = Math.min(Math.abs(diff), Math.max(rawStep, minStep), maxDelta);
  const step = Math.abs(diff) < 0.008 ? diff : Math.sign(diff) * stepMag;
  creation.time = Math.max(0, Math.min(CREATION_DURATION, creation.time + step));
  syncHeroWake(creation.time);
  if (creation.target >= CREATION_DURATION && creation.time >= CREATION_DURATION - 0.015) {
    finishCreation('complete');
  } else if (before !== creationStage(creation.time)) {
    creation.listeners.forEach(fn => fn());
  }
}
