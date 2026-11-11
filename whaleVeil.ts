/**
 * THE READING VEIL — where the page's copy sits, as the whales see it.
 *
 * The whales are engraved in the same value as the type, so a torso settling behind a date, a
 * label or a list makes that line unreadable. The veil is a small coverage map on the whales'
 * own glyph grid (one byte per cell: 0 open water, 255 right behind a line of copy), feathered so
 * it has no edge. The composite pass thins the engraving by it: the body's tone almost clears,
 * the contour only softens, so the animal passes behind the text whole, as if through mist,
 * and is at full strength again in open water.
 */
export interface VeilRect { left: number; top: number; width: number; height: number }

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
 * Fill `out` (cols × rows, row 0 at the top) from line boxes in viewport CSS px. `scratch` holds
 * two grids of the same size. Pure and allocation-free: called whenever the copy moves.
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
  a.fill(0);
  let any = false;
  for (const r of rects) {
    if (!(r.width > 0) || !(r.height > 0)) continue;
    const x0 = Math.max(0, Math.floor((r.left - VEIL_PAD_X) / cellW));
    const x1 = Math.min(cols, Math.ceil((r.left + r.width + VEIL_PAD_X) / cellW));
    const y0 = Math.max(0, Math.floor((r.top - VEIL_PAD_Y) / cellH));
    const y1 = Math.min(rows, Math.ceil((r.top + r.height + VEIL_PAD_Y) / cellH));
    if (x1 <= x0 || y1 <= y0) continue;
    any = true;
    for (let y = y0; y < y1; y++) a.fill(1, y * cols + x0, y * cols + x1);
  }
  if (!any) { out.fill(0); return; }
  // Separable box feather: along the rows into b, then down the columns back into the bytes.
  // Taps past the screen edge are left out of the mean, so copy at an edge is veiled in full.
  for (let y = 0; y < rows; y++) {
    const row = y * cols;
    for (let x = 0; x < cols; x++) {
      let sum = 0, taps = 0;
      for (let k = -BLUR_X; k <= BLUR_X; k++) {
        const xx = x + k;
        if (xx >= 0 && xx < cols) { sum += a[row + xx]; taps++; }
      }
      b[row + x] = sum / taps;
    }
  }
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      let sum = 0, taps = 0;
      for (let k = -BLUR_Y; k <= BLUR_Y; k++) {
        const yy = y + k;
        if (yy >= 0 && yy < rows) { sum += b[yy * cols + x]; taps++; }
      }
      out[y * cols + x] = Math.round(255 * Math.min(1, sum / taps));
    }
  }
}
