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

/**
 * What survives right behind copy: the body's tone cells, and the line work that holds the form.
 * The line work keeps no more than the tone there: on night water a pale contour stroke behind a
 * 300-weight italic competed with it at 0.22. Only the line box and its padding are affected; the
 * contour is whole across the reading water around the copy and in open water (FIELD_DEPTH).
 */
export const VEIL_KEEP_TONE = 0.1;
export const VEIL_KEEP_LINE = 0.1;
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
export const FIELD_DEPTH = 0.74;
/** How far the field reaches past the copy (CSS px, half-widths of its two box feathers). */
export const FIELD_REACH_X = 66;
export const FIELD_REACH_Y = 44;
/** Gain before the clamp: rows of a list a line apart still add up to one unbroken field. */
const FIELD_GAIN = 3.3;

/** Horizontal box blur by running sums; edge taps are left out of the mean. */
function boxBlurX(src: Float32Array, dst: Float32Array, cols: number, rows: number, radius: number): void {
  const span = 2 * radius + 1;
  if (cols < span) {
    for (let y = 0; y < rows; y++) {
      const row = y * cols;
      let sum = 0;
      let taps = 0;
      for (let k = 0; k <= radius && k < cols; k++) { sum += src[row + k]; taps++; }
      for (let x = 0; x < cols; x++) {
        dst[row + x] = sum / taps;
        const enter = x + radius + 1;
        const leave = x - radius;
        if (enter < cols) { sum += src[row + enter]; taps++; }
        if (leave >= 0) { sum -= src[row + leave]; taps--; }
      }
    }
    return;
  }
  const invSpan = 1 / span;
  const midEnd = cols - radius - 1;
  for (let y = 0; y < rows; y++) {
    const row = y * cols;
    let sum = 0;
    for (let k = 0; k <= radius; k++) sum += src[row + k];
    let taps = radius + 1;
    for (let x = 0; x < radius; x++) {
      dst[row + x] = sum / taps;
      sum += src[row + x + radius + 1];
      taps++;
    }
    for (let x = radius; x < midEnd; x++) {
      dst[row + x] = sum * invSpan;
      sum += src[row + x + radius + 1] - src[row + x - radius];
    }
    taps = span;
    for (let x = midEnd; x < cols; x++) {
      dst[row + x] = sum / taps;
      sum -= src[row + x - radius];
      taps--;
    }
  }
}

/** Vertical box blur by running sums; edge taps are left out of the mean. */
function boxBlurY(src: Float32Array, dst: Float32Array, cols: number, rows: number, radius: number): void {
  if (radius === 1 && rows >= 2) {
    for (let x = 0; x < cols; x++) dst[x] = (src[x] + src[x + cols]) * 0.5;
    const inv3 = 1 / 3;
    for (let y = 1; y < rows - 1; y++) {
      const prev = (y - 1) * cols;
      const cur = y * cols;
      const next = (y + 1) * cols;
      for (let x = 0; x < cols; x++) dst[cur + x] = (src[prev + x] + src[cur + x] + src[next + x]) * inv3;
    }
    const prev = (rows - 2) * cols;
    const cur = (rows - 1) * cols;
    for (let x = 0; x < cols; x++) dst[cur + x] = (src[prev + x] + src[cur + x]) * 0.5;
    return;
  }
  const span = 2 * radius + 1;
  if (rows < span) {
    for (let x = 0; x < cols; x++) {
      let sum = 0;
      let taps = 0;
      for (let k = 0; k <= radius && k < rows; k++) { sum += src[x + k * cols]; taps++; }
      for (let y = 0; y < rows; y++) {
        dst[x + y * cols] = sum / taps;
        const enter = y + radius + 1;
        const leave = y - radius;
        if (enter < rows) { sum += src[x + enter * cols]; taps++; }
        if (leave >= 0) { sum -= src[x + leave * cols]; taps--; }
      }
    }
    return;
  }
  const invSpan = 1 / span;
  const midEnd = rows - radius - 1;
  const enterOff = (radius + 1) * cols;
  const leaveOff = radius * cols;
  for (let x = 0; x < cols; x++) {
    let sum = 0;
    for (let k = 0, p = x; k <= radius; k++, p += cols) sum += src[p];
    let idx = x;
    let taps = radius + 1;
    for (let y = 0; y < radius; y++, idx += cols) {
      dst[idx] = sum / taps;
      sum += src[idx + enterOff];
      taps++;
    }
    for (let y = radius; y < midEnd; y++, idx += cols) {
      dst[idx] = sum * invSpan;
      sum += src[idx + enterOff] - src[idx - leaveOff];
    }
    taps = span;
    for (let y = midEnd; y < rows; y++, idx += cols) {
      dst[idx] = sum / taps;
      sum -= src[idx - leaveOff];
      taps--;
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
  boxBlurX(a, b, cols, rows, BLUR_X);
  boxBlurY(b, a, cols, rows, BLUR_Y);
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
    boxBlurX(f, g, hc, hr, rx);
    boxBlurY(g, f, hc, hr, ry);
    boxBlurX(f, g, hc, hr, rx);
    boxBlurY(g, f, hc, hr, ry);
  }
  if (!anyField) {
    for (let i = 0; i < n; i++) {
      const av = a[i];
      out[i] = ((av >= 1 ? 1 : av) * 255 + 0.5) | 0;
    }
    return;
  }
  const hn = hc * hr;
  for (let k = 0; k < hn; k++) {
    const v = f[k] * FIELD_GAIN;
    f[k] = v >= 1 ? FIELD_DEPTH : v * FIELD_DEPTH;
  }
  const evenCols = cols & ~1;
  for (let y = 0, i = 0; y < rows; y++) {
    const half = (y >> 1) * hc;
    for (let x = 0, hx = 0; x < evenCols; x += 2, hx++, i += 2) {
      const fv = f[half + hx];
      const a0 = a[i];
      const m0 = a0 > fv ? (a0 >= 1 ? 1 : a0) : fv;
      out[i] = (m0 * 255 + 0.5) | 0;
      const a1 = a[i + 1];
      const m1 = a1 > fv ? (a1 >= 1 ? 1 : a1) : fv;
      out[i + 1] = (m1 * 255 + 0.5) | 0;
    }
    if (cols & 1) {
      const fv = f[half + (evenCols >> 1)];
      const av = a[i];
      const m = av > fv ? (av >= 1 ? 1 : av) : fv;
      out[i++] = (m * 255 + 0.5) | 0;
    }
  }
}
