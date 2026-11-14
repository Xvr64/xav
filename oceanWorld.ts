// ============================================================================
// OCEAN WORLD — the one water the whole document sits in
// ============================================================================
// Every point of the page has a fixed depth, from 0 at the top of the cover to 1 at the end of
// the contact section. Depth decides the water's colour (sky blue → light ocean → saturated
// ocean blue → deep navy → near-black abyss), the ASCII glyphs' ink, and how dense and how strong they are.
// Because it belongs to the document and not to the screen, scrolling travels through it and
// scrolling back returns to exactly the same water.
//
// The depth follows the existing descent so the page's ink stays readable: the cover settles
// from the sky-blue surface into lighter ocean, the Globe journey carries the old abyss curve (its ink flip lands on
// the mid-tone of this palette), and the CV sections keep sinking from dark blue to black.

export type RGB = [number, number, number];

/** Where each stretch of the descent ends, in depth. */
export const COVER_DEPTH = 0.12;
export const JOURNEY_DEPTH = 0.74;

/** The water, by depth, sampled from the reference: sky-blue surface, light ocean, saturated
 *  mid-ocean blue, deep navy, near-black abyss. */
export const WATER_STOPS: [number, string][] = [
  [0.0, '#99D6F1'],
  [0.12, '#84CAEF'],
  [0.26, '#6BB7EB'],
  [0.54, '#2563CE'],
  [0.74, '#172264'],
  [1.0, '#111017']
];

/** The glyphs' ink, by depth: a deeper blue than the water near the surface, a lighter one
 *  below the flip, crossing over in a short stretch so the texture never thins out for long. */
export const INK_STOPS: [number, string][] = [
  [0.0, '#2E79C0'],
  [0.12, '#2B73BD'],
  [0.26, '#2C6FBF'],
  [0.36, '#2560B6'],
  [0.44, '#8FC3F2'],
  [0.54, '#7AAEEF'],
  [0.64, '#6593E2'],
  [0.74, '#4C6CC8'],
  [0.88, '#4462B6'],
  [1.0, '#4060B0']
];

export interface OceanGeometry {
  /** Scroll position where the Globe journey's water starts to darken (Infinity until measured). */
  journeyStart: number;
  /** Scroll length of that darkening. */
  journeyTravel: number;
  /** Largest scroll position. */
  maxScroll: number;
  /** Viewport height in CSS px. */
  viewHeight: number;
}

const clamp01 = (v: number) => Math.max(0, Math.min(1, v));
const smooth = (t: number) => t * t * (3 - 2 * t);

/**
 * The water's depth seen at the centre of the screen at scroll position `scroll`. The journey
 * stretch is the old abyss curve (progress^1.5) remapped onto this palette.
 */
export function depthAtScroll(scroll: number, g: OceanGeometry): number {
  const s = Math.max(0, scroll);
  if (!Number.isFinite(g.journeyStart) || g.journeyStart <= 0) return 0;
  if (s <= g.journeyStart) return COVER_DEPTH * smooth(clamp01(s / g.journeyStart));
  const journeyEnd = g.journeyStart + Math.max(1, g.journeyTravel);
  if (s <= journeyEnd) {
    const abyss = clamp01((s - g.journeyStart) / Math.max(1, g.journeyTravel)) ** 1.5;
    return COVER_DEPTH + (JOURNEY_DEPTH - COVER_DEPTH) * abyss;
  }
  const deep = clamp01((s - journeyEnd) / Math.max(1, g.maxScroll - journeyEnd));
  return JOURNEY_DEPTH + (1 - JOURNEY_DEPTH) * deep;
}

/** The depth of the water at a point of the document (a row `docY` px from the top). */
export const depthAtDocument = (docY: number, g: OceanGeometry) => depthAtScroll(docY - g.viewHeight / 2, g);

// --- OKLab, so the ramps blend through even, natural colours -------------------------------
const toLinear = (v: number) => (v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4);
const toGamma = (v: number) => (v <= 0.0031308 ? v * 12.92 : 1.055 * v ** (1 / 2.4) - 0.055);

export const hexToRgb = (hex: string): RGB => {
  const n = parseInt(hex.slice(1), 16);
  return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
};

export const rgbToLab = ([r, g, b]: RGB): RGB => {
  const lr = toLinear(r);
  const lg = toLinear(g);
  const lb = toLinear(b);
  const l = Math.cbrt(0.4122214708 * lr + 0.5363325363 * lg + 0.0514459929 * lb);
  const m = Math.cbrt(0.2119034982 * lr + 0.6806995451 * lg + 0.1073969566 * lb);
  const s = Math.cbrt(0.0883024619 * lr + 0.2817188376 * lg + 0.6299787005 * lb);
  return [
    0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s,
    1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s,
    0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s
  ];
};

export const labToRgb = ([L, a, b]: RGB): RGB => {
  const l = (L + 0.3963377774 * a + 0.2158037573 * b) ** 3;
  const m = (L - 0.1055613458 * a - 0.0638541728 * b) ** 3;
  const s = (L - 0.0894841775 * a - 1.291485548 * b) ** 3;
  return [
    clamp01(toGamma(4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s)),
    clamp01(toGamma(-1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s)),
    clamp01(toGamma(-0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s))
  ];
};

const toLabStops = (stops: [number, string][]) => stops.map(([at, hex]) => [at, rgbToLab(hexToRgb(hex))] as const);
const WATER_LAB = toLabStops(WATER_STOPS);
const INK_LAB = toLabStops(INK_STOPS);

const sampleRamp = (stops: readonly (readonly [number, RGB])[], depth: number): RGB => {
  const d = clamp01(depth);
  let i = 0;
  while (i < stops.length - 2 && d > stops[i + 1][0]) i++;
  const [a0, c0] = stops[i];
  const [a1, c1] = stops[i + 1];
  const t = smooth(clamp01((d - a0) / Math.max(1e-6, a1 - a0)));
  return labToRgb([c0[0] + (c1[0] - c0[0]) * t, c0[1] + (c1[1] - c0[1]) * t, c0[2] + (c1[2] - c0[2]) * t]);
};

/** Water colour at a depth, sRGB 0–1. */
export const waterAt = (depth: number) => sampleRamp(WATER_LAB, depth);
/** Glyph ink at a depth, sRGB 0–1. */
export const inkAt = (depth: number) => sampleRamp(INK_LAB, depth);

/** Relative luminance (0–1) of an sRGB colour. */
export const luminance = ([r, g, b]: RGB) => 0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b);

/**
 * How the glyphs carry at a depth: `density` (share of cells drawn), `strength` (ink opacity)
 * and `stretch` (how much wider than tall the currents are: long swells near the surface,
 * rounder drifting water in the deep).
 */
export function glyphsAt(depth: number) {
  const d = clamp01(depth);
  return {
    density: 0.42 + 0.22 * Math.sin(Math.PI * Math.min(1, d * 1.15)),
    strength: 0.6 + 0.2 * smooth(clamp01(d / 0.6)),
    stretch: 2.6 - 1.5 * smooth(d)
  };
}

const css = ([r, g, b]: RGB) => `${Math.round(r * 255)}, ${Math.round(g * 255)}, ${Math.round(b * 255)}`;
/** What is on screen now (wherever it was written), and what the document root holds. */
let lastWater = '';
let lastLow = '';
let rootWater = '';
let rootLow = '';
let wantWater = '';
let wantLow = '';
let wantStageOnly = false;
let lastWaterWrite = -Infinity;
let waterTimer: ReturnType<typeof setTimeout> | 0 = 0;
/**
 * How often the page's CSS may follow the water (ms). A custom property on <html> restyles the
 * whole document, measured at 18-28 ms a write on this page; written on every frame of the
 * descent, as it was, that held the Globe's film at 15-24 fps with half the main thread in forced
 * style recalculation. The water itself is the ocean's opaque canvas, which still draws the exact
 * colour on every frame; these properties only tint what sits on it (the text's halo, the Globe
 * caption's veil), where a step of a few levels of 255 inside a blurred shadow cannot be seen.
 * The last colour is always written once the water settles.
 */
export const WATER_CSS_INTERVAL_MS = 240;
/** Whether a write is due `now`, given the last one (pure, for tests). */
export const waterWriteDue = (now: number, last: number) => now - last >= WATER_CSS_INTERVAL_MS;

/**
 * WHO IS READING THE WATER'S COLOUR — the Globe's stage alone, for the length of its film.
 *
 * Even at one write every 240 ms the root write is the film's periodic hitch: the halo is an
 * inherited text-shadow on <main>, so each new colour restyles every element of the CV (some
 * 1,500 of them, 36-46 ms measured), although through the film none of that copy is on screen.
 * The Globe's runway is 600vh with a pinned stage: while it covers the viewport, the only things
 * showing the water's colour are the stage itself (caption halo, caption veils), the corner
 * controls, and the page background behind the ocean's canvas.
 *
 * So while the stage is the whole screen (`globeStageFillsScreen`) the same values, at the same
 * cadence, are written on those few elements only: custom properties on the runway and the
 * controls (nearer than the root's, so they win inside), the background colour itself on the
 * three elements that paint it. The root keeps the colour it had. The moment the film comes
 * within a quarter screen of either end of the runway the overrides are taken off and the root is
 * brought up to date in the same task, well before anything else can be seen, and from then on
 * the root is written as it always was.
 * Nothing on screen ever holds a colour older than it would have before; what is skipped is only
 * the restyling of copy that is not there to be seen.
 */
/** How much of a screen from either end of the runway the root is written as before. The copy
 *  beyond each end (the cover above Doha, the profile below Shanghai) must already carry the
 *  current halo before its first line can be scrolled into view: a browser paints the page just
 *  outside the screen ahead of time and scrolls it in without asking the page first. So the root
 *  is always current while the film rests on Doha or on Shanghai and for a quarter screen of
 *  travel beside them; only the stretch between is the stage's alone. The stage is also 100svh,
 *  shorter than the viewport on a phone with its toolbar away, which the same margin covers. */
export const STAGE_RELEASE_MARGIN = 0.25;
export function globeStageFillsScreen(scroll: number, g: OceanGeometry): boolean {
  if (!Number.isFinite(g.journeyStart) || !(g.viewHeight > 0)) return false;
  const margin = STAGE_RELEASE_MARGIN * g.viewHeight;
  // Reduced motion collapses the runway to one still screen: there is no film to protect
  if (!(g.journeyTravel > g.viewHeight + 2 * margin)) return false;
  return scroll >= g.journeyStart + margin && scroll <= g.journeyStart + g.journeyTravel - margin;
}

type WaterValue = 'wash' | 'halo' | 'low' | 'background';
interface StageTarget { style: CSSStyleDeclaration; props: [name: string, value: WaterValue][]; saved: string[] }
/** The stage's own consumers while they carry the colour themselves; null while the root does. */
let stageTargets: StageTarget[] | null = null;

const waterValue = (kind: WaterValue) =>
  kind === 'wash' ? wantWater : kind === 'low' ? wantLow : kind === 'halo' ? `rgba(${wantWater}, 0.82)` : `rgb(${wantWater})`;

const findStageTargets = (): StageTarget[] | null => {
  const runway = document.querySelector<HTMLElement>('[data-journey-runway]');
  if (!runway) return null;
  const targets: StageTarget[] = [
    { style: runway.style, props: [['--abyss-wash', 'wash'], ['--abyss-halo', 'halo'], ['--abyss-wash-low', 'low']], saved: [] }
  ];
  const controls = document.querySelector<HTMLElement>('.fixed-top-controls');
  if (controls) targets.push({ style: controls.style, props: [['--abyss-halo', 'halo']], saved: [] });
  // The water behind the ocean's canvas: what shows if that canvas is ever lost
  const painted = [document.documentElement, document.body, document.querySelector<HTMLElement>('.terminal-portfolio')];
  for (const el of painted) if (el) targets.push({ style: el.style, props: [['background-color', 'background']], saved: [] });
  for (const t of targets) t.saved = t.props.map(([name]) => t.style.getPropertyValue(name));
  return targets;
};
const releaseStageTargets = () => {
  if (!stageTargets) return;
  for (const t of stageTargets) {
    t.props.forEach(([name], i) => {
      if (t.saved[i]) t.style.setProperty(name, t.saved[i]);
      else t.style.removeProperty(name);
    });
  }
  stageTargets = null;
};

const writeWater = (now: number) => {
  lastWaterWrite = now;
  if (wantStageOnly) {
    stageTargets ??= findStageTargets();
    if (stageTargets) {
      for (const t of stageTargets) for (const [name, kind] of t.props) t.style.setProperty(name, waterValue(kind));
      lastWater = wantWater;
      lastLow = wantLow;
      return;
    }
  }
  releaseStageTargets();
  const root = document.documentElement.style;
  if (wantWater !== rootWater) {
    rootWater = wantWater;
    root.setProperty('--ocean-background', `rgb(${wantWater})`);
    root.setProperty('--abyss-wash', wantWater);
    root.setProperty('--abyss-halo', `rgba(${wantWater}, 0.82)`);
  }
  if (wantLow !== rootLow) {
    rootLow = wantLow;
    root.setProperty('--abyss-wash-low', wantLow);
  }
  lastWater = wantWater;
  lastLow = wantLow;
};
/**
 * The page's own water (body background, text halos, caption veils, the phone menu) takes the
 * colour of the ocean at the screen's centre, so nothing drawn on it reads as a grey patch.
 * The water deepens down the screen, so washes that sit low (the phone Globe caption's veil)
 * take `--abyss-wash-low`, the colour four fifths of the way down, `lowDepth`.
 * Called every drawn frame; the document is only restyled every WATER_CSS_INTERVAL_MS.
 * `stageOnly`: the Globe's pinned stage is all of the page that is on screen (see above).
 */
export function applyWaterColor(depth: number, lowDepth = depth, stageOnly = false) {
  wantWater = css(waterAt(depth));
  wantLow = css(waterAt(lowDepth));
  wantStageOnly = stageOnly;
  const now = performance.now();
  if (stageTargets && !stageOnly) {
    // The stage has stopped being the whole screen: the rest of the page takes the colour now,
    // not at the next interval, so no line of it is ever seen under an older halo
    if (waterTimer) { clearTimeout(waterTimer); waterTimer = 0; }
    writeWater(now);
    return;
  }
  if (wantWater === lastWater && wantLow === lastLow) return;
  if (waterWriteDue(now, lastWaterWrite)) {
    if (waterTimer) { clearTimeout(waterTimer); waterTimer = 0; }
    writeWater(now);
  } else if (!waterTimer) {
    // The trailing write: whatever colour the water has reached by then, even if it has stopped
    waterTimer = setTimeout(() => { waterTimer = 0; writeWater(performance.now()); }, WATER_CSS_INTERVAL_MS - (now - lastWaterWrite));
  }
}
