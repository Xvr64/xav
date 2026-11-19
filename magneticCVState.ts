/** The magnetic CV preview is a development-only experiment, like the other URL flags
 * (portfolioExperiments.ts): production builds never enable it, whatever the query string. */
export function parseMagneticCV(search: string, development: boolean) {
  return development && new URLSearchParams(search).get('magneticCV') === '1';
}

export const magneticCV = typeof location !== 'undefined'
  && parseMagneticCV(location.search, !!(import.meta as { env?: { DEV?: boolean } }).env?.DEV);

/** The CV chapters isolated in reading order (Shanghai precedes them as chapter 0). */
export const MAGNETIC_CHAPTERS = '#introduction, .cv-arch > section';

/** Canonical cinematic editorial transition duration for CV <-> CV scenes (ms, 900–1200ms target). */
export const TRANSITION_DURATION_MS = 1080;

/** Special cinematic handoff duration for Shanghai (Globe) <-> Profile (ms, 900–1200ms target). */
export const GLOBE_TRANSITION_DURATION_MS = 1180;

/** Shared transition bridge read by the editorial ASCII decoder (TerminalEditorial.tsx) and ocean (asciiOcean.ts). */
export const passage = {
  destination: null as HTMLElement | null,
  direction: 1 as -1 | 1,
  landing: 0,
  edge: 0,
  /** Normalized overall transition clock 0..1 while animating, 0 at rest. */
  progress: 0,
  /** Heading-first reconstruction progress 0..1 (leads supporting copy during arrival). */
  titleProgress: 0,
  /** Supporting line-by-line cascade progress 0..1 across arrival. */
  bodyProgress: 0,
  /** Signed ocean depth-bridge surge (-1..1) strictly active during ?magneticCV=1 passages, 0 at rest. */
  depthSurge: 0,
  /** True when landing at a tall chapter's lower reading edge (heading sits above viewport). */
  landingAtBottom: false,
  settleAll: false,
  requestDecode: null as (() => void) | null
};

export function clamp01(v: number): number {
  return v <= 0 ? 0 : v >= 1 ? 1 : v;
}

/** Smoothstep eased phase clamped cleanly to [0, 1]. */
export function easedPhase(t: number, start: number, end: number): number {
  const p = clamp01((t - start) / (end - start));
  return p * p * (3 - 2 * p);
}

/** Smootherstep (quintic) eased phase: zero 1st & 2nd derivative at both ends for cinema poise. */
export function cinematicPhase(t: number, start: number, end: number): number {
  const p = clamp01((t - start) / (end - start));
  return p * p * p * (p * (p * 6 - 15) + 10);
}

/** Exact cubic-bezier evaluator for cinema-grade, zero-overshoot easing curves. */
export function cubicBezier(t: number, x1: number, y1: number, x2: number, y2: number): number {
  const x = clamp01(t);
  if (x === 0 || x === 1) return x;
  const ax = 3 * x1 - 3 * x2 + 1;
  const bx = 3 * x2 - 6 * x1;
  const cx = 3 * x1;
  let u = x;
  for (let i = 0; i < 6; i++) {
    const fu = ((ax * u + bx) * u + cx) * u - x;
    const dfu = (3 * ax * u + 2 * bx) * u + cx;
    if (Math.abs(fu) < 1e-6 || Math.abs(dfu) < 1e-6) break;
    u = clamp01(u - fu / dfu);
  }
  const ay = 3 * y1 - 3 * y2 + 1;
  const by = 3 * y2 - 6 * y1;
  const cy = 3 * y1;
  return clamp01(((ay * u + by) * u + cy) * u);
}

/**
 * Cinema camera depth glide:
 * - Weighted, poised departure during Camera Push-In (t = 0.00 -> 0.24),
 * - Commanding ocean surge through the central depth bridge (t = 0.35 -> 0.65),
 * - Long, aristocratic velvet deceleration into the magnetic landing,
 * - Strictly monotonic, zero overshoot, zero bounce.
 * Evaluates cubic-bezier(0.38, 0.02, 0.14, 1.00).
 */
export function depthGlideEase(t: number): number {
  return cubicBezier(t, 0.38, 0.02, 0.14, 1.00);
}

/** Stage A — Camera Push-In / Optical Focus Lock (0% -> 24%): draws focal title toward lens while body recedes. */
export function focusLockPhase(t: number): number {
  return cubicBezier(clamp01(t / 0.24), 0.18, 0.96, 0.28, 1.0);
}

/** Stage B — Outgoing Curved Clip & Local Edge ASCII Dissolution (10% -> 48%).
 * Guaranteed 100% cleared at t = 0.48, right as the incoming curved unveil opens cleanly. */
export function outSweepPhase(t: number): number {
  return cinematicPhase(t, 0.10, 0.48);
}

/** Stage C — Continuous Ocean Depth Movement (22% -> 76%, peaking at t = 0.49 across the bridge). */
export function depthPassagePhase(t: number): number {
  if (t <= 0.22 || t >= 0.76) return 0;
  if (t <= 0.49) return easedPhase(t, 0.22, 0.49);
  return 1 - easedPhase(t, 0.49, 0.76);
}

/** Stage D — Incoming Curved Clip Reveal (48% -> 88%).
 * Begins at t = 0.48 right as outgoing clears (0.48 >= 0.48): overlapping rhythm with zero dual-text collision. */
export function inSweepPhase(t: number): number {
  return cubicBezier(clamp01((t - 0.48) / 0.40), 0.16, 0.88, 0.22, 1.00);
}

/** Stage D1 — Dramatic Heading Reconstruction (47% -> 84%): large heading emerges first with depth zoom & ASCII decode. */
export function titleArrivePhase(t: number): number {
  return cubicBezier(clamp01((t - 0.47) / 0.37), 0.20, 0.14, 0.30, 1.00);
}

/** Stage D2 — Refined Staggered Supporting Cascade (55% -> 94%): follows heading in crisp reading order. */
export function copyArrivePhase(t: number): number {
  return cubicBezier(clamp01((t - 0.55) / 0.39), 0.22, 0.12, 0.34, 1.00);
}

/**
 * Sculpted curved oceanic meniscus profile for both DOM clip-path polygons and
 * typography-locked ASCII edge fragmentation. Combines a sweeping asymmetric arch with
 * an organic dual-frequency swell so the clipping reveal reads unmistakably as a curved veil.
 */
export function oceanWaveY(
  u: number,
  baseEdge: number,
  tilt: number,
  amplitude: number,
  phase: number
): number {
  const diag = (u - 0.5) * tilt;
  const arch = Math.sin(u * Math.PI) * (amplitude * 0.95);
  const swell = Math.sin(u * Math.PI * 1.6 + phase) * (amplitude * 0.52);
  const ripple = Math.cos(u * Math.PI * 2.8 - phase * 0.7) * (amplitude * 0.16);
  return baseEdge + diag - arch + swell + ripple;
}

/** Breathing room kept beneath a long chapter's last line when its reading edge is reached (px). */
export const READING_BREATH = 16;

/** The scroll position at which a chapter's last line has been read (document px). A chapter
 * that fits the screen ends where it starts; a longer one ends once its content (not its bottom
 * padding) has risen past the viewport's foot, so a few pixels of padding never cost a gesture. */
export function readingEnd(top: number, bottom: number, paddingBottom: number, viewport: number) {
  const contentBottom = bottom - paddingBottom;
  if (contentBottom <= top + viewport) return top;
  return Math.round(Math.min(bottom, contentBottom + READING_BREATH) - viewport);
}

/** One chapter's reading span in document coordinates. Both the scroll controller and the
 * decoder read it, so the lines resting at a chapter's edge are exactly the ones decoded. */
export function chapterBounds(el: HTMLElement, y = scrollY, viewport = innerHeight) {
  const r = el.getBoundingClientRect();
  const top = Math.round(r.top + y);
  const pad = parseFloat(getComputedStyle(el).paddingBottom) || 0;
  return { top, end: readingEnd(top, r.bottom + y, pad, viewport) };
}

// ============================================================================
// GESTURE OWNERSHIP STATE MACHINE (ONE GESTURE = ONE SECTION, ZERO LOCKUP)
// ============================================================================
// Design invariants:
// 1. Strict one-gesture-one-section: continuous momentum tails, free-spinning flywheels,
//    coalesced spikes arriving at continuous-stream cadence (<200ms), and dying momentum
//    crumbs after frame stalls can NEVER advance a second section.
// 2. Zero lockup on stationary mouse:
//    - Normal gestures finish well before the ~1.08s transition ends and land directly in `idle`.
//    - Residual momentum tails re-arm cleanly after a 200ms quiet gap (never a self-extending 450ms trap).
//    - Precision touchpads and smooth-scroll wheels (small 3..12px packets with ±1px jitter)
//      accumulate reliably without being wiped as "decaying crumbs".
//    - `rearmIfQuiet(now)` lets the controller proactively transition `draining -> idle` via timer
//      so no mouse move, hover, focus change, or click is ever required to re-enable wheel input.

export type GestureState = 'idle' | 'captured' | 'transitioning' | 'draining' | 'reading';
export type GestureDirection = -1 | 1;

export type WheelQuery = (dir: GestureDirection) => {
  /** Remaining readable scroll distance inside the current chapter toward its edge (px). */
  room: number;
  /** Whether an adjacent chapter exists in `dir`. */
  hasTarget: boolean;
};

export type WheelAction =
  | { kind: 'ignore' }
  | { kind: 'passthrough' }
  | { kind: 'consume' }
  | { kind: 'read' }
  | { kind: 'clamp'; dir: GestureDirection }
  | { kind: 'snap'; dir: GestureDirection };

export interface MagneticGestureMachine {
  readonly state: GestureState;
  readonly lockedDir: -1 | 0 | 1;
  readonly lastEventTime: number;
  feedWheel(delta: number, now: number, query: WheelQuery): WheelAction;
  /** Record wheel activity occurring outside magnetic ownership (e.g. during the Globe film). */
  noteExternalWheel(delta: number, now: number): void;
  beginTransition(dir: GestureDirection, now: number): void;
  endTransition(now: number, touchActive?: boolean): void;
  /** Enter draining explicitly (e.g. after touch fling or boundary clamp). */
  enterDraining(dir: GestureDirection, now: number): void;
  /** Proactively re-arm to `idle` once the quiet window has elapsed without requiring a wheel/pointer event. */
  rearmIfQuiet(now: number): boolean;
  reset(): void;
}

/** Intentional travel required to launch a snap (px): one wheel notch or crisp trackpad stroke. */
export const MAGNETIC_GESTURE_PX = 28;
/** Quiet gap (ms) that cleanly separates two distinct physical wheel gestures while reading. */
export const MAGNETIC_IDLE_GAP_MS = 190;
/** Quiet gap (ms) required to leave draining after continuous wheel/trackpad momentum.
 * Continuous momentum & flywheels deliver packets every 8–60ms (never pausing 200ms),
 * while two distinct human scroll gestures naturally separate cleanly without lockup. */
export const MAGNETIC_DRAIN_IDLE_MS = 200;
/** Shorter gap (ms) at which a bold fresh discrete impulse (>=40px) cleanly breaks out of a faded tail (<=8px). */
const MAGNETIC_FRESH_IMPULSE_GAP_MS = 135;
/** Peak below which a strictly-monotonically-decaying post-snap stream is treated as dying momentum crumbs. */
const GESTURE_PEAK_PX = 14;
/** Window after a transition ends during which strictly-decaying sub-14px crumbs in the same direction are filtered. */
const POST_SNAP_CRUMB_WINDOW_MS = 2500;
/** Minimum single-packet reverse travel (px) to break out of active draining (rejects flywheel recoil). */
const DRAIN_REVERSE_PX = 96;
const BOUNDARY_TOLERANCE = 2;

export function createMagneticGestureMachine(): MagneticGestureMachine {
  let state: GestureState = 'idle';
  let lockedDir: -1 | 0 | 1 = 0;
  let lastSnapDir: -1 | 0 | 1 = 0;
  let lastTransitionEnd = -Infinity;
  let acc = 0;
  let accPeak = 0;
  let accDir: -1 | 0 | 1 = 0;
  let prevIdleMag = 0;
  let hasRise = false;
  let emaMag = 0;
  let reverseAcc = 0;
  let reverseHits = 0;
  let lastEventTime = -Infinity;

  const resetToIdle = () => {
    state = 'idle';
    lockedDir = 0;
    acc = 0;
    accPeak = 0;
    accDir = 0;
    prevIdleMag = 0;
    hasRise = false;
    emaMag = 0;
    reverseAcc = 0;
    reverseHits = 0;
  };

  const trackStream = (mag: number, gap: number) => {
    emaMag = gap > 140 ? mag : (emaMag > 0 ? emaMag * 0.75 + mag * 0.25 : mag);
  };

  return {
    get state() { return state; },
    get lockedDir() { return lockedDir; },
    get lastEventTime() { return lastEventTime; },

    noteExternalWheel(delta: number, now: number) {
      if (!delta) return;
      const dir = Math.sign(delta) as GestureDirection;
      const mag = Math.abs(delta);
      const gap = now - lastEventTime;
      trackStream(mag, gap);
      lastEventTime = now;
      if (state !== 'transitioning') {
        state = 'draining';
        lockedDir = dir;
        reverseAcc = 0;
        reverseHits = 0;
      }
    },

    beginTransition(dir: GestureDirection, now: number) {
      state = 'transitioning';
      lockedDir = dir;
      lastSnapDir = dir;
      acc = 0;
      accPeak = 0;
      accDir = 0;
      prevIdleMag = 0;
      hasRise = false;
      reverseAcc = 0;
      reverseHits = 0;
      if (!Number.isFinite(lastEventTime)) lastEventTime = now;
    },

    endTransition(now: number, touchActive = false) {
      lastTransitionEnd = now;
      if (touchActive || (now - lastEventTime < MAGNETIC_DRAIN_IDLE_MS)) {
        state = 'draining';
        reverseAcc = 0;
        reverseHits = 0;
      } else {
        resetToIdle();
      }
    },

    enterDraining(dir: GestureDirection, now: number) {
      state = 'draining';
      lockedDir = dir;
      acc = 0;
      accPeak = 0;
      accDir = 0;
      prevIdleMag = 0;
      hasRise = false;
      reverseAcc = 0;
      reverseHits = 0;
      lastEventTime = now;
    },

    rearmIfQuiet(now: number): boolean {
      if (state === 'draining' && now - lastEventTime >= MAGNETIC_DRAIN_IDLE_MS) {
        resetToIdle();
        return true;
      }
      if (state === 'reading' && now - lastEventTime >= MAGNETIC_IDLE_GAP_MS) {
        resetToIdle();
        return true;
      }
      return false;
    },

    reset() {
      resetToIdle();
      lastEventTime = -Infinity;
      lastSnapDir = 0;
      lastTransitionEnd = -Infinity;
    },

    feedWheel(delta: number, now: number, query: WheelQuery): WheelAction {
      if (!delta) return { kind: 'ignore' };
      const dir = Math.sign(delta) as GestureDirection;
      const mag = Math.abs(delta);
      const gap = now - lastEventTime;

      // 1. Active transition owns every incoming wheel packet; never queues.
      if (state === 'transitioning' || state === 'captured') {
        trackStream(mag, gap);
        lastEventTime = now;
        return { kind: 'consume' };
      }

      // 2. Draining consumes residual momentum until either:
      //    - a genuine quiet gap (>= MAGNETIC_DRAIN_IDLE_MS) separates the previous gesture,
      //    - a bold fresh discrete impulse (>=40px) follows a faded tail (<=8px) after >=135ms, or
      //    - a confirmed opposite-direction reversal arrives.
      //    Continuous flywheels & coalesced momentum tails (8..60ms spacing) remain 100% consumed.
      if (state === 'draining') {
        if (gap >= MAGNETIC_DRAIN_IDLE_MS) {
          resetToIdle();
        } else if (dir !== lockedDir) {
          reverseAcc += mag;
          reverseHits++;
          lastEventTime = now;
          const confirmedReverse =
            reverseAcc >= DRAIN_REVERSE_PX ||
            (reverseHits >= 2 && reverseAcc >= 44);
          if (!confirmedReverse) return { kind: 'consume' };
          const seeded = reverseAcc;
          resetToIdle();
          acc = seeded - mag; // idle branch below adds `mag`
          accPeak = mag;
          accDir = dir;
          hasRise = true;
        } else {
          const isFreshDiscrete =
            gap >= MAGNETIC_FRESH_IMPULSE_GAP_MS &&
            emaMag <= 8 &&
            mag >= 40;
          if (isFreshDiscrete) {
            resetToIdle();
          } else {
            reverseAcc = 0;
            reverseHits = 0;
            trackStream(mag, gap);
            lastEventTime = now;
            return { kind: 'consume' };
          }
        }
      }

      // 3. Reading inside a long section: stay clamped strictly within its boundaries.
      if (state === 'reading') {
        if (gap >= MAGNETIC_IDLE_GAP_MS) {
          resetToIdle();
        } else {
          const { room, hasTarget } = query(dir);
          trackStream(mag, gap);
          lastEventTime = now;
          if (dir !== lockedDir) {
            if (room > BOUNDARY_TOLERANCE) {
              lockedDir = dir;
              return { kind: 'read' };
            }
            state = 'draining';
            lockedDir = dir;
            return { kind: 'clamp', dir };
          }
          if (room <= mag) {
            state = 'draining';
            lockedDir = dir;
            return { kind: 'clamp', dir };
          }
          if (!hasTarget && room <= BOUNDARY_TOLERANCE) {
            resetToIdle();
            return { kind: 'passthrough' };
          }
          return { kind: 'read' };
        }
      }

      // 4. Idle / ready: evaluate whether we are reading a long section, passing through an
      //    outer edge (e.g. Shanghai upward back into Globe), or capturing a magnetic snap.
      if (gap >= 140 || (accDir !== 0 && accDir !== dir)) {
        acc = 0;
        accPeak = 0;
        prevIdleMag = 0;
        hasRise = false;
        accDir = dir;
      } else if (accDir === 0) {
        accDir = dir;
      }

      const { room, hasTarget } = query(dir);
      if (!hasTarget && room <= BOUNDARY_TOLERANCE) {
        // Outer boundary (upward at Shanghai -> Globe reverse, or downward at Contact bottom).
        return { kind: 'passthrough' };
      }

      trackStream(mag, gap);
      lastEventTime = now;

      if (room > BOUNDARY_TOLERANCE) {
        if (room <= mag) {
          state = 'draining';
          lockedDir = dir;
          return { kind: 'clamp', dir };
        }
        state = 'reading';
        lockedDir = dir;
        return { kind: 'read' };
      }

      // At a chapter boundary with a valid adjacent target: accumulate intentional travel.
      // Only filter strictly-monotonically-decaying tiny crumbs (e.g. 11,10,9,8,7) that arrive
      // right after a recent same-direction snap with zero upward acceleration — never penalizing
      // precision touchpads or smooth-scroll mice whose packets rise (3->8->9) or hold steady (8,8,8).
      if (prevIdleMag > 0 && mag > prevIdleMag) {
        hasRise = true;
      }
      const recentSameDir =
        dir === lastSnapDir &&
        (now - lastTransitionEnd) < POST_SNAP_CRUMB_WINDOW_MS;
      const isDecayingCrumb =
        recentSameDir &&
        !hasRise &&
        prevIdleMag > 0 &&
        mag < prevIdleMag &&
        accPeak < GESTURE_PEAK_PX;
      prevIdleMag = mag;
      if (isDecayingCrumb) {
        acc = 0;
        return { kind: 'consume' };
      }

      acc += mag;
      accPeak = Math.max(accPeak, mag);
      if (acc >= MAGNETIC_GESTURE_PX) {
        state = 'captured';
        lockedDir = dir;
        acc = 0;
        accPeak = 0;
        accDir = 0;
        prevIdleMag = 0;
        hasRise = false;
        reverseAcc = 0;
        reverseHits = 0;
        return { kind: 'snap', dir };
      }
      return { kind: 'consume' };
    }
  };
}
