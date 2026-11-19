/** The magnetic CV is enabled by default in both development and production;
 * `?magneticCV=0` disables it as a troubleshooting fallback to the continuous scroll experience. */
export function parseMagneticCV(search: string) {
  return new URLSearchParams(search).get('magneticCV') !== '0';
}

export const magneticCV = typeof location !== 'undefined' && parseMagneticCV(location.search);

/** The CV chapters isolated in reading order (Shanghai precedes them as chapter 0). */
export const MAGNETIC_CHAPTERS = '#introduction, .cv-arch > section';

/** Canonical cinematic editorial transition duration for CV <-> CV scenes (ms, 1.2–1.4s Abyssal Cipher target). */
export const TRANSITION_DURATION_MS = 1280;

/** Special cinematic handoff duration for Shanghai (Globe) <-> Profile (ms, grander ocean passage). */
export const GLOBE_TRANSITION_DURATION_MS = 1360;

export type TransitionPresetId =
  | 'globe-handoff'
  | 'editorial-command'
  | 'hierarchy-shift'
  | 'rhythmic-index'
  | 'delicate-swell'
  | 'natural-glide'
  | 'refined-coda';

export interface TransitionPreset {
  id: TransitionPresetId;
  duration: number;
  /** Signed horizontal curvature bias of the Abyssal Current ribbon (-1..1). */
  ribbonArc: number;
  /** Tightness of the Phase 3 ASCII current ribbon (0.65..1.1). */
  ribbonWidth: number;
  /** Curved directional mask amplitude multiplier. */
  waveAmpScale: number;
  /** Curved directional mask diagonal tilt multiplier. */
  waveTiltScale: number;
  /** Phase 1 camera push intensity multiplier. */
  depthPush: number;
  /** Heading reconstruction presence & wave emphasis. */
  heroLead: number;
  /** Supporting row stagger cadence multiplier. */
  rowStagger: number;
  /** Restrained fragment density multiplier (cleanest on Interests -> Contact). */
  currentDensity: number;
}

const PRESETS: Record<TransitionPresetId, TransitionPreset> = {
  'globe-handoff': {
    id: 'globe-handoff',
    duration: GLOBE_TRANSITION_DURATION_MS,
    ribbonArc: -0.78,
    ribbonWidth: 1.0,
    waveAmpScale: 1.08,
    waveTiltScale: 1.06,
    depthPush: 1.0,
    heroLead: 1.12,
    rowStagger: 1.05,
    currentDensity: 1.06
  },
  'editorial-command': {
    id: 'editorial-command',
    duration: 1300,
    ribbonArc: 0.62,
    ribbonWidth: 0.96,
    waveAmpScale: 1.04,
    waveTiltScale: 1.04,
    depthPush: 1.08,
    heroLead: 1.14,
    rowStagger: 1.0,
    currentDensity: 1.0
  },
  'hierarchy-shift': {
    id: 'hierarchy-shift',
    duration: 1280,
    ribbonArc: -0.46,
    ribbonWidth: 0.9,
    waveAmpScale: 0.96,
    waveTiltScale: 0.98,
    depthPush: 0.98,
    heroLead: 1.06,
    rowStagger: 0.96,
    currentDensity: 0.94
  },
  'rhythmic-index': {
    id: 'rhythmic-index',
    duration: 1260,
    ribbonArc: 0.34,
    ribbonWidth: 0.84,
    waveAmpScale: 0.88,
    waveTiltScale: 0.92,
    depthPush: 0.92,
    heroLead: 1.0,
    rowStagger: 0.78,
    currentDensity: 0.92
  },
  'delicate-swell': {
    id: 'delicate-swell',
    duration: 1280,
    ribbonArc: -0.58,
    ribbonWidth: 0.88,
    waveAmpScale: 1.02,
    waveTiltScale: 0.94,
    depthPush: 0.95,
    heroLead: 1.04,
    rowStagger: 1.16,
    currentDensity: 0.9
  },
  'natural-glide': {
    id: 'natural-glide',
    duration: 1260,
    ribbonArc: 0.44,
    ribbonWidth: 0.86,
    waveAmpScale: 0.92,
    waveTiltScale: 0.88,
    depthPush: 0.9,
    heroLead: 1.0,
    rowStagger: 0.98,
    currentDensity: 0.86
  },
  'refined-coda': {
    id: 'refined-coda',
    duration: 1240,
    ribbonArc: -0.28,
    ribbonWidth: 0.68,
    waveAmpScale: 0.78,
    waveTiltScale: 0.8,
    depthPush: 0.86,
    heroLead: 1.05,
    rowStagger: 0.88,
    currentDensity: 0.68
  }
};

/** Select a coherent, section-aware variation within the single Abyssal Cipher design system. */
export function transitionPresetFor(fromId: string, toId: string, dir: GestureDirection): TransitionPreset {
  if (fromId === 'journey' || toId === 'journey') {
    const base = PRESETS['globe-handoff'];
    return dir < 0 ? { ...base, ribbonArc: -base.ribbonArc } : base;
  }
  const pair = `${fromId}->${toId}`;
  const reverse = `${toId}->${fromId}`;
  const map: Record<string, TransitionPresetId> = {
    'introduction->experience': 'editorial-command',
    'experience->education': 'hierarchy-shift',
    'education->skills': 'rhythmic-index',
    'skills->languages': 'delicate-swell',
    'languages->interests': 'natural-glide',
    'interests->contact': 'refined-coda'
  };
  const key = map[pair] ?? map[reverse] ?? 'hierarchy-shift';
  const base = PRESETS[key];
  return dir < 0 ? { ...base, ribbonArc: -base.ribbonArc } : base;
}

export interface StaircaseLineBox {
  top: number;
  bottom: number;
  left: number;
  right: number;
  /** Optional exact local pixel left-edges of characters along this line so the clip snaps cleanly between letters. */
  charLefts?: number[];
}

/**
 * Build a pure-GPU staircase clip-path polygon that reveals each rendered visual line of a
 * typographic block left-to-right in exact lockstep with the Abyssal Cipher decoding wave.
 * When `charLefts` is provided, the cut snaps cleanly to whole-character boundaries so letters
 * never appear half-sliced mid-glyph.
 */
export function buildStaircaseClip(
  width: number,
  height: number,
  lines: readonly StaircaseLineBox[],
  reveals: readonly number[]
): string {
  if (!lines.length) return '';
  let allZero = true;
  let allDone = true;
  for (let i = 0; i < lines.length; i++) {
    const f = reveals[i] ?? 0;
    if (f > 0.001) allZero = false;
    if (f < 0.999) allDone = false;
  }
  if (allZero) return 'inset(50%)';
  if (allDone) return '';

  const pad = 18;
  const pts: string[] = [`${-pad}px ${-pad}px`];
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const f = clamp01(reveals[i] ?? 0);
    const yTop = i === 0 ? -pad : (lines[i - 1].bottom + line.top) * 0.5;
    const yBot = i === lines.length - 1 ? height + pad : (line.bottom + lines[i + 1].top) * 0.5;
    const span = Math.max(1, line.right - line.left);
    let xEdge: number;
    if (f <= 0.001) {
      xEdge = -pad;
    } else if (f >= 0.999) {
      xEdge = width + pad;
    } else if (line.charLefts && line.charLefts.length > 0) {
      const idx = Math.floor(f * line.charLefts.length);
      xEdge = idx <= 0 ? -pad : idx >= line.charLefts.length ? width + pad : Math.max(-pad, line.charLefts[idx] - 1.5);
    } else {
      xEdge = line.left + span * f;
    }
    pts.push(`${xEdge.toFixed(1)}px ${yTop.toFixed(1)}px`);
    pts.push(`${xEdge.toFixed(1)}px ${yBot.toFixed(1)}px`);
  }
  pts.push(`${-pad}px ${(height + pad).toFixed(1)}px`);
  return `polygon(${pts.join(',')})`;
}

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

/** Phase 1 — The Scene Loses Its Form (0% -> 24%, ~0–310 ms): subtle camera push-in & depth separation. */
export function focusLockPhase(t: number): number {
  return cubicBezier(clamp01(t / 0.24), 0.18, 0.94, 0.28, 1.0);
}

/** Phase 2 — Outgoing Curved Mask & ASCII Disintegration (6% -> 43%, ~77–550 ms).
 * Smooth cubic sweep engages visibly by ~200ms and clears 100% by t = 0.43, opening into Phase 3. */
export function outSweepPhase(t: number): number {
  return cubicBezier(clamp01((t - 0.06) / 0.37), 0.36, 0.08, 0.24, 1.0);
}

/** Phase 3 — The Abyssal Current & Ocean Depth Passage (24% -> 78%, peaking at t = 0.50).
 * Between t = 0.43 and t = 0.57 (~180–195 ms), neither section's typography is readable while
 * the living ocean, whales, and sculpted ASCII current ribbon carry the scene through depth. */
export function depthPassagePhase(t: number): number {
  if (t <= 0.24 || t >= 0.78) return 0;
  if (t <= 0.50) return easedPhase(t, 0.24, 0.50);
  return 1 - easedPhase(t, 0.50, 0.78);
}

/** Phase 4 — Incoming Curved Oceanic Reveal (57% -> 86%, ~730–1100 ms).
 * Opens cleanly after the Phase 3 open-ocean passage with zero dual-text collision. */
export function inSweepPhase(t: number): number {
  return cubicBezier(clamp01((t - 0.57) / 0.29), 0.16, 0.86, 0.24, 1.00);
}

/** Phase 4A — Heading Directional ASCII Reconstruction (54% -> 82%, ~690–1050 ms): title resolves first. */
export function titleArrivePhase(t: number): number {
  return cubicBezier(clamp01((t - 0.54) / 0.28), 0.18, 0.16, 0.28, 1.00);
}

/** Phase 4B — Supporting Typography Cascade (60% -> 90%, ~768–1152 ms): companies, labels & paragraphs follow. */
export function copyArrivePhase(t: number): number {
  return cubicBezier(clamp01((t - 0.60) / 0.30), 0.20, 0.14, 0.32, 1.00);
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
/** Quiet gap (ms) that cleanly separates two distinct physical wheel gestures while reading or accumulating. */
export const MAGNETIC_IDLE_GAP_MS = 190;
/** Quiet gap (ms) required to leave draining after continuous wheel/trackpad momentum.
 * Continuous momentum & flywheels deliver packets every 8–60ms (never pausing 200ms),
 * while two distinct human scroll gestures naturally separate cleanly without lockup. */
export const MAGNETIC_DRAIN_IDLE_MS = 200;
/** Shorter pause (ms) after a faded trackpad tail at which a bold new stroke (>=10px) breaks out of draining. */
const MAGNETIC_FRESH_PAUSE_MS = 85;
/** Shorter gap (ms) at which a bold fresh discrete impulse (>=40px) cleanly breaks out of a faded tail (<=8px). */
const MAGNETIC_FRESH_IMPULSE_GAP_MS = 135;
/** EMA / packet ceiling (px) defining a faded momentum tail eligible for fresh-gesture surge detection. */
const DRAIN_TAIL_MAX_PX = 6;
/** Minimum peak packet (px) for a multi-step re-acceleration wave on a faded tail to confirm a fresh trackpad gesture. */
const DRAIN_SURGE_PEAK_PX = 7;
/** Peak below which a strictly-monotonically-decaying post-snap stream is treated as dying momentum crumbs. */
const CRUMB_MAX_PEAK_PX = 12;
/** Short window right after a transition ends during which strictly-decaying sub-12px crumbs after a frame stall are filtered. */
const POST_SNAP_CRUMB_WINDOW_MS = 450;
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
  let hasNonDecay = false;
  let strictDrops = 0;
  let emaMag = 0;
  let drainTailFaded = false;
  let tailBaseline = 0;
  let drainLowRun = 0;
  let surgeAcc = 0;
  let surgePeak = 0;
  let surgePrev = 0;
  let surgeRises = 0;
  let surgeCount = 0;
  let reverseAcc = 0;
  let reverseHits = 0;
  let lastEventTime = -Infinity;

  const resetSurge = () => {
    surgeAcc = 0;
    surgePeak = 0;
    surgePrev = 0;
    surgeRises = 0;
    surgeCount = 0;
  };

  const initDrainTail = () => {
    resetSurge();
    if (emaMag > 0 && emaMag <= DRAIN_TAIL_MAX_PX) {
      drainTailFaded = true;
      tailBaseline = Math.max(1, emaMag);
      drainLowRun = 2;
    } else {
      drainTailFaded = false;
      tailBaseline = emaMag;
      drainLowRun = 0;
    }
  };

  const resetToIdle = () => {
    state = 'idle';
    lockedDir = 0;
    acc = 0;
    accPeak = 0;
    accDir = 0;
    prevIdleMag = 0;
    hasNonDecay = false;
    strictDrops = 0;
    emaMag = 0;
    drainTailFaded = false;
    tailBaseline = 0;
    drainLowRun = 0;
    resetSurge();
    reverseAcc = 0;
    reverseHits = 0;
  };

  const trackStream = (mag: number) => {
    emaMag = emaMag > 0 ? emaMag * 0.75 + mag * 0.25 : mag;
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
      if (gap >= MAGNETIC_DRAIN_IDLE_MS) emaMag = 0;
      trackStream(mag);
      lastEventTime = now;
      if (state !== 'transitioning') {
        state = 'draining';
        lockedDir = dir;
        reverseAcc = 0;
        reverseHits = 0;
        initDrainTail();
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
      hasNonDecay = false;
      strictDrops = 0;
      drainTailFaded = false;
      tailBaseline = 0;
      drainLowRun = 0;
      resetSurge();
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
        initDrainTail();
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
      hasNonDecay = false;
      strictDrops = 0;
      reverseAcc = 0;
      reverseHits = 0;
      initDrainTail();
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
      // Only same-direction packets update the momentum envelope so a -1px sign bounce
      // after a slow paint frame can never poison emaMag down to 1px.
      if (state === 'transitioning' || state === 'captured') {
        if (dir === lockedDir) trackStream(mag);
        lastEventTime = now;
        return { kind: 'consume' };
      }

      let seededFromDrain = false;

      // 2. Draining consumes residual momentum until either:
      //    - a genuine quiet gap (>= MAGNETIC_DRAIN_IDLE_MS) separates the previous gesture,
      //    - a fresh gesture arrives after a brief pause (>=115ms) on a faded tail,
      //    - a sustained multi-step trackpad re-acceleration surge rises cleanly above a faded tail
      //      (never triggered by continuous flywheels, 1-vs-2 packet coalescing, or single coalesced spikes), or
      //    - a confirmed opposite-direction reversal arrives.
      if (state === 'draining') {
        if (gap >= MAGNETIC_DRAIN_IDLE_MS) {
          resetToIdle();
        } else if (dir !== lockedDir) {
          resetSurge();
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
          hasNonDecay = true;
          seededFromDrain = true;
        } else {
          const isFreshDiscrete =
            gap >= MAGNETIC_FRESH_IMPULSE_GAP_MS &&
            emaMag <= 8 &&
            mag >= 40;
          const isFreshAfterPause =
            gap >= MAGNETIC_FRESH_PAUSE_MS &&
            (drainTailFaded || emaMag <= DRAIN_TAIL_MAX_PX) &&
            mag >= Math.max((drainTailFaded ? tailBaseline : emaMag) * 2.5, 10);

          if (isFreshDiscrete || isFreshAfterPause) {
            resetToIdle();
            accDir = dir;
            hasNonDecay = true;
            seededFromDrain = true;
          } else {
            reverseAcc = 0;
            reverseHits = 0;
            trackStream(mag);
            lastEventTime = now;

            // Detect when continuous momentum has genuinely faded into a low tail (<= 6px).
            if (mag <= DRAIN_TAIL_MAX_PX) {
              drainLowRun++;
              if (!drainTailFaded && (emaMag <= DRAIN_TAIL_MAX_PX || drainLowRun >= 2 || gap >= 60)) {
                drainTailFaded = true;
                tailBaseline = Math.max(1, Math.min(emaMag || mag, mag));
              }
            } else {
              drainLowRun = 0;
            }

            if (drainTailFaded) {
              if (surgeAcc === 0) {
                if (mag > tailBaseline) {
                  surgeAcc = mag;
                  surgePeak = mag;
                  surgePrev = mag;
                  surgeRises = 0;
                  surgeCount = 1;
                } else {
                  tailBaseline = Math.max(1, Math.min(tailBaseline, mag));
                }
              } else if (mag > surgePrev) {
                // Reject sudden massive coalesced spikes (>3.5x single-step jump to >=28px)
                // during an active draining stream: real finger re-acceleration ramps smoothly.
                if (mag >= 28 && mag > surgePrev * 3.5) {
                  resetSurge();
                  if (emaMag > 10) drainTailFaded = false;
                } else {
                  surgeRises++;
                  surgeCount++;
                  surgeAcc += mag;
                  surgePeak = Math.max(surgePeak, mag);
                  surgePrev = mag;
                }
              } else if (mag === surgePrev && mag >= Math.max(tailBaseline * 2, 4.5)) {
                // Quantized plateau during a fresh trackpad ramp (does not increment surgeRises).
                surgeCount++;
                surgeAcc += mag;
              } else if (surgeRises >= 2 && mag >= Math.max(tailBaseline * 2, 4.5)) {
                // Cresting after >=2 strict acceleration steps (supports 60Hz, 120Hz, and DPI-scaled pads).
                surgeCount++;
                surgeAcc += mag;
                surgePrev = mag;
              } else if (
                surgeRises >= 1 &&
                surgePeak >= Math.max(tailBaseline * 4, 12) &&
                mag >= Math.max(tailBaseline * 2.5, 7)
              ) {
                // Fast 2-frame-peak trackpad flick (e.g. [5, 14, 12], [8, 15, 11], [12, 18, 10]) above faded tail.
                surgeCount++;
                surgeAcc += mag;
                surgePrev = mag;
              } else {
                // Dropped before confirming a genuine re-acceleration wave (e.g. 1-vs-2 coalescing or single spike).
                resetSurge();
                if (mag <= DRAIN_TAIL_MAX_PX) {
                  tailBaseline = Math.max(1, Math.min(tailBaseline, mag));
                } else if (mag > 10 && emaMag > 10) {
                  // Sustained non-rising high stream (e.g. flywheel burst): require tail to fade again.
                  drainTailFaded = false;
                }
              }

              const confirmedTrackpadSurge =
                surgeAcc >= MAGNETIC_GESTURE_PX && (
                  (surgeRises >= 2 && surgePeak >= Math.max(tailBaseline * 2.8, DRAIN_SURGE_PEAK_PX)) ||
                  (surgeRises >= 1 && surgeCount >= 3 && surgePeak >= Math.max(tailBaseline * 4, 12) && mag >= Math.max(tailBaseline * 2.5, 7))
                );

              if (confirmedTrackpadSurge) {
                const seeded = surgeAcc;
                const peak = surgePeak;
                resetToIdle();
                acc = seeded - mag; // idle branch below adds `mag`
                accPeak = peak;
                accDir = dir;
                hasNonDecay = true;
                seededFromDrain = true;
              } else {
                return { kind: 'consume' };
              }
            } else {
              return { kind: 'consume' };
            }
          }
        }
      }

      // 3. Reading inside a long section: stay clamped strictly within its boundaries.
      if (state === 'reading') {
        if (gap >= MAGNETIC_IDLE_GAP_MS) {
          resetToIdle();
        } else {
          const { room, hasTarget } = query(dir);
          trackStream(mag);
          lastEventTime = now;
          if (dir !== lockedDir) {
            if (room > BOUNDARY_TOLERANCE) {
              lockedDir = dir;
              return { kind: 'read' };
            }
            state = 'draining';
            lockedDir = dir;
            initDrainTail();
            return { kind: 'clamp', dir };
          }
          if (room <= mag) {
            state = 'draining';
            lockedDir = dir;
            initDrainTail();
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
      if (!seededFromDrain && (gap >= MAGNETIC_IDLE_GAP_MS || (accDir !== 0 && accDir !== dir))) {
        acc = 0;
        accPeak = 0;
        prevIdleMag = 0;
        hasNonDecay = false;
        strictDrops = 0;
        accDir = dir;
      } else if (accDir === 0) {
        accDir = dir;
      }

      const { room, hasTarget } = query(dir);
      if (!hasTarget && room <= BOUNDARY_TOLERANCE) {
        // Outer boundary (upward at Shanghai -> Globe reverse, or downward at Contact bottom).
        return { kind: 'passthrough' };
      }

      trackStream(mag);
      lastEventTime = now;

      if (room > BOUNDARY_TOLERANCE) {
        if (room <= mag) {
          state = 'draining';
          lockedDir = dir;
          initDrainTail();
          return { kind: 'clamp', dir };
        }
        state = 'reading';
        lockedDir = dir;
        return { kind: 'read' };
      }

      // At a chapter boundary with a valid adjacent target: accumulate intentional travel.
      // Only filter strictly-monotonically-decaying sub-12px crumbs (>=2 consecutive strict drops,
      // e.g. 11->10->9->8->7) arriving immediately (<450ms) after a same-direction snap due to a frame stall.
      // Never penalize gentle trackpad strokes with flat starts, coalesced peaks (>=12px), or 1px jitter.
      if (!seededFromDrain && prevIdleMag > 0) {
        if (mag >= prevIdleMag) {
          hasNonDecay = true;
          strictDrops = 0;
        } else {
          strictDrops++;
        }
      }
      const recentSameDir =
        !seededFromDrain &&
        dir === lastSnapDir &&
        (now - lastTransitionEnd) < POST_SNAP_CRUMB_WINDOW_MS;
      const isDecayingCrumb =
        recentSameDir &&
        !hasNonDecay &&
        strictDrops >= 2 &&
        accPeak < CRUMB_MAX_PEAK_PX;
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
        hasNonDecay = false;
        strictDrops = 0;
        reverseAcc = 0;
        reverseHits = 0;
        return { kind: 'snap', dir };
      }
      return { kind: 'consume' };
    }
  };
}
