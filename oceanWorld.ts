// ============================================================================
// OCEAN WORLD — the one water the whole document sits in
// ============================================================================
// Every point of the page has a fixed depth, from 0 at the top of the cover to 1 at the end of
// the contact section. Depth decides the water's colour (cream → beige → cooling sea → dark
// blue → near-black abyss), the ASCII glyphs' ink, and how dense and how strong they are.
// Because it belongs to the document and not to the screen, scrolling travels through it and
// scrolling back returns to exactly the same water.
//
// The depth follows the existing descent so the page's ink stays readable: the cover settles
// from cream into beige, the Globe journey carries the old abyss curve (its ink flip lands on
// the mid-tone of this palette), and the CV sections keep sinking from dark blue to black.

export type RGB = [number, number, number];

/** Where each stretch of the descent ends, in depth. */
export const COVER_DEPTH = 0.12;
export const JOURNEY_DEPTH = 0.74;

/** The water, by depth: cream, beige, cooling stone and mist, sea, ocean blue, abyss. */
export const WATER_STOPS: [number, string][] = [
  [0.0, '#F7F2E8'],
  [0.12, '#ECE0CA'],
  [0.22, '#DDD9C9'],
  [0.32, '#BACDCB'],
  [0.4, '#90B1BA'],
  [0.46, '#64889B'],
  [0.56, '#3A627C'],
  [0.66, '#1F4260'],
  [0.74, '#142C47'],
  [0.87, '#0B182B'],
  [1.0, '#05080F']
];

/** The glyphs' ink, by depth: darker than the water near the surface, lighter below the flip. */
export const INK_STOPS: [number, string][] = [
  [0.0, '#B8A584'],
  [0.12, '#A38E6B'],
  [0.24, '#8E9C94'],
  [0.34, '#7896A0'],
  [0.42, '#A2C3CB'],
  [0.5, '#A4CAD6'],
  [0.66, '#6FA2BD'],
  [0.8, '#4C7FA6'],
  [1.0, '#3B6592']
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
let lastWater = '';
let lastLow = '';
/**
 * The page's own water (body background, text halos, caption veils, the phone menu) takes the
 * colour of the ocean at the screen's centre, so nothing drawn on it reads as a grey patch.
 * The water deepens down the screen, so washes that sit low (the phone Globe caption's veil)
 * take `--abyss-wash-low`, the colour four fifths of the way down, `lowDepth`.
 */
export function applyWaterColor(depth: number, lowDepth = depth) {
  const water = css(waterAt(depth));
  const low = css(waterAt(lowDepth));
  const root = document.documentElement.style;
  if (water !== lastWater) {
    lastWater = water;
    root.setProperty('--ocean-background', `rgb(${water})`);
    root.setProperty('--abyss-wash', water);
    root.setProperty('--abyss-halo', `rgba(${water}, 0.82)`);
  }
  if (low !== lastLow) {
    lastLow = low;
    root.setProperty('--abyss-wash-low', low);
  }
}
