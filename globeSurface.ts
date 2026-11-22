/**
 * The pinned stage's layout, measured once per resize, orientation change, viewport (toolbar)
 * change, font load or caption resize, never per frame. Every per-frame position is computed from
 * it and the scroll position, so a film frame performs no layout reads.
 */
export interface GlobeStageGeometry {
  /** Runway top in document coordinates (the pinned element is its first child). */
  runwayDocTop: number;
  /** How far the pinned element travels inside the runway (runway height - pinned height). */
  travel: number;
  /** The pinned element's sticky `top`. */
  stickyTop: number;
  /** Stage top relative to the pinned element. */
  stageInPinned: number;
  /** Stage left in viewport coordinates (the page never scrolls horizontally). */
  stageLeft: number;
  /** Layout viewport height (innerHeight), refreshed on every resize. */
  viewH: number;
  /** Caption box relative to the stage, or null when it has no width. */
  caption: { dx: number; dy: number; width: number; height: number } | null;
}

export type ZoneRect = { left: number; top: number; width: number; height: number };

/** Stage top in viewport coordinates at document scroll `y` (position: sticky inside the runway). */
export function stageViewportTop(g: GlobeStageGeometry, y: number): number {
  const stuck = Math.max(0, Math.min(g.travel, y + g.stickyTop - g.runwayDocTop));
  return g.runwayDocTop + stuck + g.stageInPinned - y;
}

/**
 * Vertical offset of an inline CSS `translate` (Magnetic CV slides the pinned Globe chapter with
 * `translate: 0 <y>px`). Reads the inline value only, never layout. '' / 'none' / a single value
 * (x only) mean no vertical offset; a non-px y is ignored.
 */
export function inlineTranslateY(translate: string | null | undefined): number {
  if (!translate) return 0;
  const parts = translate.trim().split(/\s+/);
  if (parts.length < 2) return 0;
  const y = parts[1];
  if (!/^-?[\d.]+(e-?\d+)?(px)?$/i.test(y)) return 0;
  return parseFloat(y) || 0;
}

/** The disc and caption as viewport rects, or [] when the stage is off screen. `shiftY` adds a
 * transient offset of the pinned chapter (a Magnetic CV slide's translate). */
export function globeZoneRects(
  g: GlobeStageGeometry,
  y: number,
  stageH: number,
  disc: { cx: number; cy: number; r: number },
  shiftY = 0
): ZoneRect[] {
  const top = stageViewportTop(g, y) + shiftY;
  if (top + stageH <= 0 || top >= g.viewH) return [];
  const rects: ZoneRect[] = [
    { left: g.stageLeft + disc.cx - disc.r, top: top + disc.cy - disc.r, width: disc.r * 2, height: disc.r * 2 }
  ];
  if (g.caption && g.caption.width > 0) {
    rects.push({ left: g.stageLeft + g.caption.dx, top: top + g.caption.dy, width: g.caption.width, height: g.caption.height });
  }
  return rects;
}

/** y on a CSS cubic-bezier(x1, y1, x2, y2) timing curve at input progress x ∈ [0, 1]. */
export function cubicBezierAt(x1: number, y1: number, x2: number, y2: number, x: number): number {
  if (x <= 0) return 0;
  if (x >= 1) return 1;
  const bx = (t: number) => ((1 - 3 * x2 + 3 * x1) * t + (3 * x2 - 6 * x1)) * t * t + 3 * x1 * t;
  const by = (t: number) => ((1 - 3 * y2 + 3 * y1) * t + (3 * y2 - 6 * y1)) * t * t + 3 * y1 * t;
  let lo = 0, hi = 1, t = x;
  for (let i = 0; i < 40; i++) {
    t = (lo + hi) / 2;
    if (bx(t) < x) lo = t; else hi = t;
  }
  return by(t);
}

/** The arriving caption's entrance (`.globe-caption-in`, unchanged): 600 ms on this curve. */
export const CAPTION_IN_MS = 600;
export const CAPTION_IN_EASING = [0.22, 1, 0.36, 1] as const;
export const captionInOpacity = (ms: number) => cubicBezierAt(...CAPTION_IN_EASING, ms / CAPTION_IN_MS);
/** Inverse of captionInOpacity: ms into the entrance at which it shows opacity `v`. */
export function captionInTime(v: number): number {
  if (v <= 0) return 0;
  if (v >= 1) return CAPTION_IN_MS;
  let lo = 0, hi = CAPTION_IN_MS;
  for (let i = 0; i < 40; i++) {
    const mid = (lo + hi) / 2;
    if (captionInOpacity(mid) < v) lo = mid; else hi = mid;
  }
  return (lo + hi) / 2;
}

/**
 * City change = a sequenced hand-off, never an overprint and never a blank caption. The leaving
 * caption fades out over CAPTION_OUT_MS; the arriving one holds its entrance until the leaving one
 * is down to CAPTION_BOTH_MAX, so whenever both show, neither exceeds CAPTION_BOTH_MAX. The leaving
 * caption holds that level while the arriving one rises to it, then drops out over CAPTION_TAIL_MS.
 */
export const CAPTION_OUT_MS = 160;
export const CAPTION_BOTH_MAX = 0.25;
/** At or below this a caption counts as gone. */
export const CAPTION_GONE = 0.02;
export const CAPTION_TAIL_MS = 10;
export const CAPTION_OUT_EASING = [0.55, 0, 1, 0.45] as const;
const OUT_EASING_CSS = `cubic-bezier(${CAPTION_OUT_EASING.join(', ')})`;

export type CaptionFadeFrame = { offset: number; opacity: number; easing?: string };
export interface CaptionHandoff {
  /** CSS animation-delay for the arriving caption's entrance (negative: resume part-way). */
  arriveDelayMs: number;
  /** Web Animations keyframes (opacity) for the leaving caption, or null when it is already gone. */
  leave: { duration: number; frames: CaptionFadeFrame[] } | null;
}

/** Plan a hand-off between captions currently at opacities `leaving` and `arriving`. */
export function planCaptionHandoff(leaving: number, arriving: number): CaptionHandoff {
  if (arriving >= CAPTION_BOTH_MAX) {
    // A quick reversal onto a caption that is still clearly showing (it was mid-way out): it
    // continues its entrance from there, and the other one (then at most faint) steps aside at once
    return { arriveDelayMs: -captionInTime(arriving), leave: null };
  }
  // While the leaving caption is above CAPTION_BOTH_MAX a faint arriving one restarts from 0
  const resume = leaving > CAPTION_BOTH_MAX ? 0 : captionInTime(arriving);
  if (leaving <= CAPTION_GONE) return { arriveDelayMs: -resume, leave: null };
  // Time the arriving entrance needs to rise from where it is to CAPTION_BOTH_MAX
  // and the leaving caption is gone by then (its last CAPTION_TAIL_MS, or less if the lead is shorter)
  const lead = Math.max(1, captionInTime(CAPTION_BOTH_MAX) - resume);
  const tail = Math.min(CAPTION_TAIL_MS, lead);
  const fullFall = CAPTION_OUT_MS - captionInTime(CAPTION_BOTH_MAX);
  const fall = leaving > CAPTION_BOTH_MAX ? fullFall * (leaving - CAPTION_BOTH_MAX) / (1 - CAPTION_BOTH_MAX) : 0;
  const duration = fall + lead;
  const hold = Math.min(leaving, CAPTION_BOTH_MAX);
  const frames: CaptionFadeFrame[] = [];
  if (fall > 0) frames.push({ offset: 0, opacity: leaving, easing: OUT_EASING_CSS });
  frames.push({ offset: fall / duration, opacity: hold });
  frames.push({ offset: (duration - tail) / duration, opacity: hold });
  frames.push({ offset: 1, opacity: 0 });
  return { arriveDelayMs: fall - resume, leave: { duration, frames } };
}

/** Opacity of the leaving caption `ms` after a hand-off started (0 once its fade is over). */
export function captionLeavingAt(plan: CaptionHandoff, ms: number): number {
  const leave = plan.leave;
  if (!leave || ms >= leave.duration) return 0;
  const x = Math.max(0, ms) / leave.duration;
  const f = leave.frames;
  for (let i = 0; i < f.length - 1; i++) {
    if (x > f[i + 1].offset) continue;
    const span = f[i + 1].offset - f[i].offset;
    const u = span > 0 ? (x - f[i].offset) / span : 1;
    const e = f[i].easing ? cubicBezierAt(...CAPTION_OUT_EASING, u) : u;
    return f[i].opacity + (f[i + 1].opacity - f[i].opacity) * e;
  }
  return 0;
}

/** Opacity of the arriving caption `ms` after a hand-off started. */
export const captionArrivingAt = (plan: CaptionHandoff, ms: number) => captionInOpacity(ms - plan.arriveDelayMs);

/** Supplemental surface invalidation. Never uses visualViewport height as timeline geometry:
 * Safari's toolbar/pinch viewport and the sticky layout viewport are different coordinate spaces.
 */
export function observeGlobeSurface(stage: HTMLElement, refresh: () => void, also: (HTMLElement | null)[] = []) {
  let resolution: MediaQueryList;
  const onDensity = () => { watchDensity(); refresh(); };
  const watchDensity = () => {
    resolution?.removeEventListener('change', onDensity);
    resolution = window.matchMedia(`(resolution: ${window.devicePixelRatio || 1}dppx)`);
    resolution.addEventListener('change', onDensity);
  };
  watchDensity();
  const observer = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(refresh) : null;
  observer?.observe(stage);
  // e.g. the caption: its box changes when web fonts arrive, without the stage resizing
  for (const el of also) if (el) observer?.observe(el);
  window.visualViewport?.addEventListener('resize', refresh, { passive: true });
  return () => {
    resolution.removeEventListener('change', onDensity);
    observer?.disconnect();
    window.visualViewport?.removeEventListener('resize', refresh);
  };
}
