/**
 * THE READING VEIL — where the page's copy sits, as the whales see it.
 *
 * The whales are engraved in the same value as the type, so a torso settling behind a date, a
 * label or a list makes that line unreadable. The veil is a small coverage map on the whales'
 * own glyph grid (one byte per cell: 0 open water, 255 right behind a line of copy), feathered so
 * it has no edge. The composite pass thins the engraving by it: the body's tone almost clears,
 * the contour only softens, so the animal passes behind the text whole, as if through mist,
 * and is at full strength again in open water.
 *
 * It has two depths. Right behind a line the veil is whole, as above. Around the copy of the CV
 * (`field` boxes) lies the READING WATER: a wide, soft field at `FIELD_DEPTH` that covers a whole
 * body of copy — a paragraph, a ruled list, an entry with its dates — and falls away over most of
 * a hundred pixels. Across it the whale keeps its drawing and loses about half of its modelling,
 * so it reads as one animal passing behind one body of text, not as a torso with a line-shaped
 * notch cut out for every row. The cover's headline and the Globe's caption are single large
 * pictures with their own composed lanes: they keep the tight veil only.
 */
export interface VeilRect {
  left: number;
  top: number;
  width: number;
  height: number;
  /** Copy of the CV: the reading water gathers around it (see above). */
  field?: boolean;
}

/** What survives right behind copy: the body's tone cells, and the line work that holds the form. */
export const VEIL_KEEP_TONE = 0.1;
export const VEIL_KEEP_LINE = 0.34;
/** Clear water kept around each line box (CSS px), before the feather. */
export const VEIL_PAD_X = 16;
export const VEIL_PAD_Y = 9;
/** Feather radius, in cells: wider along the line than across it (cells are taller than wide). */
const BLUR_X = 2;
const BLUR_Y = 1;

/**
 * The reading water. `FIELD_DEPTH` is the veil's value across a body of copy (0 would switch the
 * field off and leave the tight veil exactly as it was). The contour is untouched up to that
 * value and only softens above it, right behind a line (the composite pass, whale3dRenderer.ts).
 */
export const FIELD_DEPTH = 0.64;
/** How far the field reaches past the copy (CSS px, half-widths of its two box feathers). */
export const FIELD_REACH_X = 66;
export const FIELD_REACH_Y = 44;
/** Gain before the clamp: rows of a list a line apart still add up to one unbroken field. */
const FIELD_GAIN = 3.3;

/** One box blur along rows (step 1) or columns (step cols), by running sums; edge taps are left
 * out of the mean, so copy at a screen edge keeps its full value. */
function boxBlur(src: Float32Array, dst: Float32Array, cols: number, rows: number, radius: number, alongRows: boolean): void {
  const lines = alongRows ? rows : cols;
  const length = alongRows ? cols : rows;
  const step = alongRows ? 1 : cols;
  for (let l = 0; l < lines; l++) {
    const start = alongRows ? l * cols : l;
    let sum = 0;
    let taps = 0;
    for (let k = 0; k <= radius && k < length; k++) { sum += src[start + k * step]; taps++; }
    for (let i = 0; i < length; i++) {
      dst[start + i * step] = sum / taps;
      const enter = i + radius + 1;
      const leave = i - radius;
      if (enter < length) { sum += src[start + enter * step]; taps++; }
      if (leave >= 0) { sum -= src[start + leave * step]; taps--; }
    }
  }
}

/**
 * Fill `out` (cols × rows, row 0 at the top) from line boxes in viewport CSS px. `scratch` holds
 * four grids of the same size. Pure and allocation-free: called whenever the copy moves.
 */
export function rasterizeVeil(
  out: Uint8Array,
  scratch: Float32Array,
  cols: number,
  rows: number,
  cellW: number,
  cellH: number,
  rects: readonly VeilRect[]
): void {
  const n = cols * rows;
  const a = scratch.subarray(0, n);
  const b = scratch.subarray(n, n * 2);
  // The field is far smoother than a cell, so it is drawn on a grid of half the resolution
  const hc = (cols + 1) >> 1;
  const hr = (rows + 1) >> 1;
  const f = scratch.subarray(n * 2, n * 2 + hc * hr);
  const g = scratch.subarray(n * 3, n * 3 + hc * hr);
  a.fill(0);
  let any = false;
  let anyField = false;
  for (const r of rects) {
    if (!(r.width > 0) || !(r.height > 0)) continue;
    const x0 = Math.max(0, Math.floor((r.left - VEIL_PAD_X) / cellW));
    const x1 = Math.min(cols, Math.ceil((r.left + r.width + VEIL_PAD_X) / cellW));
    const y0 = Math.max(0, Math.floor((r.top - VEIL_PAD_Y) / cellH));
    const y1 = Math.min(rows, Math.ceil((r.top + r.height + VEIL_PAD_Y) / cellH));
    if (x1 <= x0 || y1 <= y0) continue;
    any = true;
    for (let y = y0; y < y1; y++) a.fill(1, y * cols + x0, y * cols + x1);
    if (r.field && FIELD_DEPTH > 0) {
      if (!anyField) { f.fill(0); anyField = true; }
      for (let y = y0 >> 1; y < (y1 + 1) >> 1; y++) f.fill(1, y * hc + (x0 >> 1), y * hc + ((x1 + 1) >> 1));
    }
  }
  if (!any) { out.fill(0); return; }
  // Separable box feather: along the rows into b, then down the columns back into a.
  // Taps past the screen edge are left out of the mean, so copy at an edge is veiled in full.
  boxBlur(a, b, cols, rows, BLUR_X, true);
  boxBlur(b, a, cols, rows, BLUR_Y, false);
  if (anyField) {
    // A row of the editorial grid is one line of reading, whatever stands on it (a date on the
    // margin, a name, a place on the annotation line): the water between its columns is part
    // of it, or the whale would show at full strength in every gutter
    for (let y = 0; y < hr; y++) {
      const row = y * hc;
      let first = -1, last = -1;
      for (let x = 0; x < hc; x++) if (f[row + x] > 0) { if (first < 0) first = x; last = x; }
      if (last > first) f.fill(1, row + first, row + last + 1);
    }
    // The reading water: the copy's own mask, feathered twice over a much wider reach (two box
    // blurs make a tent, so it has no visible shoulder), lifted so a list's rows join up
    const rx = Math.max(1, Math.round(FIELD_REACH_X / (cellW * 2)));
    const ry = Math.max(1, Math.round(FIELD_REACH_Y / (cellH * 2)));
    boxBlur(f, g, hc, hr, rx, true);
    boxBlur(g, f, hc, hr, ry, false);
    boxBlur(f, g, hc, hr, rx, true);
    boxBlur(g, f, hc, hr, ry, false);
  }
  if (!anyField) {
    for (let i = 0; i < n; i++) out[i] = Math.round(255 * Math.min(1, a[i]));
    return;
  }
  for (let y = 0, i = 0; y < rows; y++) {
    const half = (y >> 1) * hc;
    for (let x = 0; x < cols; x++, i++) {
      out[i] = Math.round(255 * Math.max(Math.min(1, a[i]), FIELD_DEPTH * Math.min(1, f[half + (x >> 1)] * FIELD_GAIN)));
    }
  }
}
