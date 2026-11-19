/** The magnetic CV preview is a development-only experiment, like the other URL flags
 * (portfolioExperiments.ts): production builds never enable it, whatever the query string. */
export function parseMagneticCV(search: string, development: boolean) {
  return development && new URLSearchParams(search).get('magneticCV') === '1';
}

export const magneticCV = typeof location !== 'undefined'
  && parseMagneticCV(location.search, !!(import.meta as { env?: { DEV?: boolean } }).env?.DEV);

/** The CV chapters isolated in reading order (Shanghai precedes them as chapter 0). */
export const MAGNETIC_CHAPTERS = '#introduction, .cv-arch > section';

/** Target transition duration (ms): squarely inside the 550–650 ms cinematic window. */
export const TRANSITION_DURATION_MS = 600;

/** Arrival timing for the existing editorial decoder. */
export const passage = {
  destination: null as HTMLElement | null,
  direction: 1 as -1 | 1,
  landing: 0,
  edge: 0,
  settleAll: false,
  requestDecode: null as (() => void) | null
};

export function easedPhase(t: number, start: number, end: number) {
  const p = Math.max(0, Math.min(1, (t - start) / (end - start)));
  return p * p * (3 - 2 * p);
}

/**
 * Controlled camera depth glide: responsive initial acceleration, fluid mid-travel,
 * long silky deceleration, zero overshoot and zero bounce.
 * Evaluates cubic-bezier(0.30, 0.06, 0.20, 1.00).
 */
export function depthGlideEase(t: number): number {
  const x = Math.max(0, Math.min(1, t));
  if (x === 0 || x === 1) return x;
  const x1 = 0.30, y1 = 0.06, x2 = 0.20, y2 = 1.00;
  const ax = 3 * x1 - 3 * x2 + 1;
  const bx = 3 * x2 - 6 * x1;
  const cx = 3 * x1;
  let u = x;
  for (let i = 0; i < 6; i++) {
    const fu = ((ax * u + bx) * u + cx) * u - x;
    const dfu = (3 * ax * u + 2 * bx) * u + cx;
    if (Math.abs(fu) < 1e-6 || Math.abs(dfu) < 1e-6) break;
    u = Math.max(0, Math.min(1, u - fu / dfu));
  }
  const ay = 3 * y1 - 3 * y2 + 1;
  const by = 3 * y2 - 6 * y1;
  const cy = 3 * y1;
  return Math.max(0, Math.min(1, ((ay * u + by) * u + cy) * u));
}

/** Outgoing clip & ASCII dissolution sweep: finishes cleanly before incoming text reads. */
export function outSweepPhase(t: number): number {
  return easedPhase(t, 0.02, 0.50);
}

/** Incoming clip & typography reconstruction sweep: opens smoothly behind the outgoing cut. */
export function inSweepPhase(t: number): number {
  return easedPhase(t, 0.28, 0.88);
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
// GESTURE OWNERSHIP STATE MACHINE (ONE GESTURE = ONE SECTION)
// ============================================================================
// Limitation: browsers do not expose hardware gesture IDs on WheelEvent.
// We therefore combine explicit lifecycle states with idle-gap detection,
// directional hysteresis (ignoring tiny trackpad sign bounces), and decaying-tail
// velocity envelope analysis (ignoring 1-vs-2 packet coalescing while still
// recognizing a genuinely fresh flick on a dying momentum tail).

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
  reset(): void;
}

/** Intentional travel required to launch a snap (px): one wheel notch or crisp trackpad flick. */
export const MAGNETIC_GESTURE_PX = 28;
/** Quiet gap (ms) that cleanly separates two distinct physical wheel gestures. */
export const MAGNETIC_IDLE_GAP_MS = 210;
/** Minimum ms after a transition ends before a sharp velocity spike on a faded tail can re-arm. */
export const MAGNETIC_DRAIN_REFIRE_MS = 220;
/** Minimum delta (px) for a velocity-spike re-arm during a faded momentum tail. */
export const MAGNETIC_REARM_SPIKE_MIN = 26;
const BOUNDARY_TOLERANCE = 2;

export function createMagneticGestureMachine(): MagneticGestureMachine {
  let state: GestureState = 'idle';
  let lockedDir: -1 | 0 | 1 = 0;
  let acc = 0;
  let accDir: -1 | 0 | 1 = 0;
  let reverseAcc = 0;
  let lastEventTime = -Infinity;
  let transitionEndTime = -Infinity;
  let prevMag = 0;
  let emaMag = 0;
  let decaying = false;
  let decaySamples = 0;

  const updateStream = (mag: number, now: number) => {
    const gap = now - lastEventTime;
    if (gap >= MAGNETIC_IDLE_GAP_MS) {
      prevMag = mag;
      emaMag = mag;
      decaying = false;
      decaySamples = 0;
    } else {
      if (mag < prevMag || mag <= 10) decaying = true;
      if (decaying && mag <= 12) decaySamples++;
      else if (mag > Math.max(prevMag, emaMag) * 1.35) decaySamples = 0;
      emaMag = emaMag * 0.72 + mag * 0.28;
      prevMag = mag;
    }
    lastEventTime = now;
  };

  const resetToIdle = () => {
    state = 'idle';
    lockedDir = 0;
    acc = 0;
    accDir = 0;
    reverseAcc = 0;
  };

  return {
    get state() { return state; },
    get lockedDir() { return lockedDir; },
    get lastEventTime() { return lastEventTime; },

    noteExternalWheel(delta: number, now: number) {
      if (!delta) return;
      const dir = Math.sign(delta) as GestureDirection;
      const mag = Math.abs(delta);
      updateStream(mag, now);
      if (state !== 'transitioning') {
        state = 'draining';
        lockedDir = dir;
        reverseAcc = 0;
      }
    },

    beginTransition(dir: GestureDirection, now: number) {
      state = 'transitioning';
      lockedDir = dir;
      acc = 0;
      accDir = 0;
      reverseAcc = 0;
      if (!Number.isFinite(lastEventTime) || now - lastEventTime > MAGNETIC_IDLE_GAP_MS) {
        // Keyboard or direct trigger without an active wheel stream.
        prevMag = 0;
        emaMag = 0;
        decaying = false;
        decaySamples = 0;
      }
    },

    endTransition(now: number, touchActive = false) {
      transitionEndTime = now;
      if (touchActive || (now - lastEventTime < MAGNETIC_IDLE_GAP_MS)) {
        state = 'draining';
        reverseAcc = 0;
      } else {
        resetToIdle();
      }
    },

    enterDraining(dir: GestureDirection, now: number) {
      state = 'draining';
      lockedDir = dir;
      acc = 0;
      accDir = 0;
      reverseAcc = 0;
      transitionEndTime = now;
      lastEventTime = now;
    },

    reset() {
      resetToIdle();
      lastEventTime = -Infinity;
      transitionEndTime = -Infinity;
      prevMag = 0;
      emaMag = 0;
      decaying = false;
      decaySamples = 0;
    },

    feedWheel(delta: number, now: number, query: WheelQuery): WheelAction {
      if (!delta) return { kind: 'ignore' };
      const dir = Math.sign(delta) as GestureDirection;
      const mag = Math.abs(delta);
      const gap = now - lastEventTime;

      // 1. Active transition owns every incoming wheel packet; never queues.
      if (state === 'transitioning' || state === 'captured') {
        updateStream(mag, now);
        return { kind: 'consume' };
      }

      // 2. Draining consumes residual momentum until a genuinely separate gesture starts.
      if (state === 'draining') {
        if (gap >= MAGNETIC_IDLE_GAP_MS) {
          resetToIdle();
        } else if (dir !== lockedDir) {
          reverseAcc += mag;
          lastEventTime = now;
          if (reverseAcc < MAGNETIC_GESTURE_PX) return { kind: 'consume' };
          // Deliberate opposite-direction gesture confirmed.
          const seeded = reverseAcc;
          resetToIdle();
          acc = seeded - mag; // idle branch below adds `mag`
          accDir = dir;
        } else {
          // Check for a fresh flick on a clearly faded tail (protects against packet coalescing).
          const isFreshFlick =
            now - transitionEndTime >= MAGNETIC_DRAIN_REFIRE_MS &&
            decaying &&
            decaySamples >= 4 &&
            emaMag <= 10 &&
            mag >= MAGNETIC_REARM_SPIKE_MIN &&
            mag >= Math.max(prevMag * 2.8, emaMag * 2.5);
          if (isFreshFlick) {
            resetToIdle();
          } else {
            reverseAcc = 0;
            updateStream(mag, now);
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
          updateStream(mag, now);
          if (dir !== lockedDir) {
            if (room > BOUNDARY_TOLERANCE) {
              lockedDir = dir;
              return { kind: 'read' };
            }
            state = 'draining';
            lockedDir = dir;
            transitionEndTime = now;
            return { kind: 'clamp', dir };
          }
          if (room <= mag) {
            state = 'draining';
            lockedDir = dir;
            transitionEndTime = now;
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
      if (gap >= MAGNETIC_IDLE_GAP_MS || (accDir !== 0 && accDir !== dir)) {
        acc = 0;
        accDir = dir;
      } else if (accDir === 0) {
        accDir = dir;
      }

      const { room, hasTarget } = query(dir);
      if (!hasTarget && room <= BOUNDARY_TOLERANCE) {
        // Outer boundary (upward at Shanghai -> Globe reverse, or downward at Contact bottom).
        return { kind: 'passthrough' };
      }

      updateStream(mag, now);

      if (room > BOUNDARY_TOLERANCE) {
        if (room <= mag) {
          state = 'draining';
          lockedDir = dir;
          transitionEndTime = now;
          return { kind: 'clamp', dir };
        }
        state = 'reading';
        lockedDir = dir;
        return { kind: 'read' };
      }

      // At a chapter boundary with a valid adjacent target: accumulate intentional travel.
      acc += mag;
      if (acc >= MAGNETIC_GESTURE_PX) {
        state = 'captured';
        lockedDir = dir;
        acc = 0;
        accDir = 0;
        reverseAcc = 0;
        return { kind: 'snap', dir };
      }
      return { kind: 'consume' };
    }
  };
}
