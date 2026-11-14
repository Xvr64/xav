/**
 * THREE VOICES, THREE MOTIONS — how the CV's type arrives.
 *
 * The page is set in three voices (terminal.css): the display serif, the mono instrument and the
 * reading text. Until Phase II all three arrived the same way, letter by letter out of a random
 * alphabet, so a date, a paragraph and a chapter title made the same gesture and a recruiter had
 * to wait for sentences to finish deciphering themselves. Each voice now has its own arrival,
 * and glyph motion belongs only to the two that are made of the ocean's material:
 *
 *   title       a chapter title EMERGES from the water. ASCII glyphs drift in on a current and
 *               settle into the shape of the letters (chosen by the direction of each stroke),
 *               then the real type comes up through them: the cover's gesture, once per chapter.
 *   instrument  dates, places, levels and labels SETTLE like a readout: a brief run of digits
 *               and marks in their own monospaced cells, locked within a third of a second.
 *   reading     everything meant to be read (names, roles, statements, lists, paragraphs)
 *               SURFACES: no substitute characters at all, only the line coming up into focus.
 *               It is legible from the first frame it is visible.
 *
 * Pure functions and constants; the controller is TerminalEditorial.tsx and the title's canvas
 * is titleEmergence.ts. Setting `VOICE_MOTION` to 'decode' for a voice restores the Phase I
 * letter-lock for it exactly.
 */
export type Voice = 'title' | 'instrument' | 'reading';
export type Motion = 'emerge' | 'settle' | 'surface' | 'decode';

export const VOICE_MOTION: Record<Voice, Motion> = {
  title: 'emerge',
  instrument: 'settle',
  reading: 'surface'
};

/** A section title is a title; anything set in the mono face is the instrument; the rest reads. */
export function voiceFor(isSectionTitle: boolean, fontFamily: string): Voice {
  if (isSectionTitle) return 'title';
  return /mono/i.test(fontFamily.split(',')[0] ?? '') ? 'instrument' : 'reading';
}

const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);
const smooth = (a: number, b: number, v: number) => {
  const x = clamp01((v - a) / (b - a));
  return x * x * (3 - 2 * x);
};
export const easeOutCubic = (x: number) => 1 - Math.pow(1 - clamp01(x), 3);

// ---- instrument: settle -------------------------------------------------------------------------

/** The readout's own marks: figures and the strokes an instrument draws with. No letters, so a
 * settling label never spells a false word. */
export const INSTRUMENT_CHARSET = '0123456789·:+-=/|';
export const SETTLE_MS_PER_CHAR = 26;
export const SETTLE_MIN_MS = 140;
export const SETTLE_MAX_MS = 320;
export const settleMs = (characterCount: number) =>
  Math.min(SETTLE_MAX_MS, Math.max(SETTLE_MIN_MS, characterCount * SETTLE_MS_PER_CHAR));

// ---- reading: surface ---------------------------------------------------------------------------

/** One line of reading text comes up in this long, however long the line. */
export const SURFACE_MS = 440;
/** How far below its place a line starts (CSS px). */
export const SURFACE_RISE_PX = 9;
/** Opacity and offset are written in this many steps, so a word is restyled a dozen times, not
 * once per frame. */
export const SURFACE_STEPS = 12;
export const surfaceStep = (p: number) => Math.round(clamp01(p) * SURFACE_STEPS) / SURFACE_STEPS;
/** Readable early: three quarters of the ink is there by the middle of the movement. */
export const surfaceOpacity = (p: number) => easeOutCubic(p);
export const surfaceRise = (p: number) => (1 - easeOutCubic(p)) * SURFACE_RISE_PX;

// ---- title: emerge ------------------------------------------------------------------------------

/** The whole emergence. The real type is fully in at TYPE_IN[1] of it (about 0.75 s). */
export const EMERGE_MS = 920;
/** The real title comes up through the formed glyphs… */
export const TYPE_IN: [number, number] = [0.54, 0.82];
/** …and the glyphs let go, left to right. */
export const GLYPHS_OUT: [number, number] = [0.66, 1];
/** Share of the timeline over which the cells' departures are spread, left to right. */
export const SWEEP = 0.3;
/** How long one cell travels (share of the timeline). */
export const TRAVEL = 0.34;
/** How far upstream a cell starts (CSS px, min and extra by its seed), and how much it bobs. */
export const DRIFT_PX: [number, number] = [26, 54];
export const BOB_PX = 7;

export const titleTypeOpacity = (p: number) => smooth(TYPE_IN[0], TYPE_IN[1], p);

export interface CellMoment {
  /** 0 upstream … 1 in place (eased). */
  arrive: number;
  /** Still a piece of water (shows a current glyph) or already the letter's own stroke. */
  formed: boolean;
  alpha: number;
}

/**
 * One glyph cell at title progress `p`: `tx` is its place across the title (0 left … 1 right),
 * `rand` its seed in [0, 1). Pure, so a frame can be recomputed or tested at any `p`.
 */
export function cellMoment(p: number, tx: number, rand: number): CellMoment {
  const start = SWEEP * clamp01(tx) + 0.05 * rand;
  const arrive = easeOutCubic((p - start) / TRAVEL);
  const appear = smooth(start, start + 0.1, p);
  const leave = 1 - smooth(GLYPHS_OUT[0] + 0.1 * clamp01(tx), GLYPHS_OUT[1] - 0.08 * (1 - clamp01(tx)), p);
  return { arrive, formed: arrive > 0.72, alpha: appear * (0.5 + 0.42 * arrive) * leave };
}

/** The current's own glyphs (asciiOcean.ts), lightest first: what a cell is before it is a stroke. */
export const WATER_GLYPHS = '·:-~=';

// The formed title: strokes by direction, then tone by coverage (the cover's alphabet, heroCurrent.ts)
const DENSE = '#%';
const MID = '+=*';
const EDGE = ':·.';

/**
 * SHAPE-AWARE GLYPH for one cell of a rasterised title.
 *
 * `coverage` is the mean ink in the cell (0..1). `jxx, jyy, jxy` are the cell's structure tensor:
 * sums of gx², gy², gx·gy over its pixels, with y pointing down. Where the ink has one clear
 * direction the cell is a stroke and takes the character that runs the same way (| for a stem,
 * - _ ¯ for a bar by where it sits in the cell, / and \ for diagonals), so the title is drawn with
 * its own strokes instead of a density ramp. Where it has none (a serif's joint, a bowl's
 * shoulder) the cell is tone, and takes a glyph by coverage.
 *
 * `cy` is the ink's centroid in the cell (0 top … 1 bottom); `seed` any integer.
 */
export function shapeGlyph(coverage: number, jxx: number, jyy: number, jxy: number, cy: number, seed: number): string {
  if (coverage < 0.045) return '';
  const energy = jxx + jyy;
  const coherence = energy > 1e-6 ? Math.sqrt((jxx - jyy) ** 2 + 4 * jxy * jxy) / energy : 0;
  if (coherence > 0.34 && coverage < 0.86) {
    // Direction of the gradient (across the stroke), folded into (-90°, 90°]
    const theta = 0.5 * Math.atan2(2 * jxy, jxx - jyy);
    const deg = (theta * 180) / Math.PI;
    if (deg > -22.5 && deg <= 22.5) return '|';
    if (deg > 67.5 || deg <= -67.5) return cy > 0.66 ? '_' : cy < 0.34 ? '¯' : '-';
    // y points down: a gradient along (+x, +y) crosses a stroke rising to the right
    return deg > 0 ? '/' : '\\';
  }
  const pick = (set: string) => set[Math.abs(seed) % set.length];
  if (coverage > 0.7) return pick(DENSE);
  if (coverage > 0.34) return pick(MID);
  return pick(EDGE);
}

/** Glyph cell size for a title set at `fontPx`: the whales' own 6 × 10 grid for a desktop title,
 * finer for a phone's so its letters still hold several rows. */
export function emergenceCell(fontPx: number): { w: number; h: number } {
  const w = Math.max(3.6, Math.min(6, fontPx * 0.084));
  return { w, h: w * (10 / 6) };
}
