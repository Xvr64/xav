import type { LandDots } from './glyphcssGlobe';

type V3 = readonly [number, number, number];
export interface AsciiGlobeFrame {
  cx: number; cy: number; radius: number; mobile: boolean;
  view: V3; east: V3; north: V3;
}
export interface GlobeCell { x: number; y: number; glyph: string; alpha: number; land: boolean }

/** Reuses the production geography and camera. No clock, events, WebGL context or readback.
 * A fixed screen lattice avoids overlapping glyphs at the limb. Relief sets the density;
 * neighbouring land occupancy chooses a directional character along the coast.
 */
export function createAsciiGlobeSampler() {
  let depth = new Float32Array(0), relief = new Uint8Array(0);
  return (land: LandDots | null, frame: AsciiGlobeFrame, emit: (cell: GlobeCell) => void) => {
    const { cx, cy, radius: R, view, east, north, mobile } = frame;
    // Never sub-6px phone type. Cap cells as well as size for large/zoomed displays.
    const cellH = Math.max(mobile ? 8 : 10, R * 2 / 100);
    const cellW = cellH * 0.72;
    const cols = Math.ceil(2 * R / cellW) + 2, rows = Math.ceil(2 * R / cellH) + 2;
    const size = cols * rows;
    if (depth.length !== size) { depth = new Float32Array(size); relief = new Uint8Array(size); }
    depth.fill(0); relief.fill(0);
    const left = cx - cols * cellW / 2, top = cy - rows * cellH / 2;
    if (land) {
      const { xyz, bands } = land;
      for (let b = 0; b < 3; b++) for (let i = bands[b]; i < bands[b + 1]; i++) {
        const k = i * 3, x = xyz[k], y = xyz[k + 1], z = xyz[k + 2];
        const d = x * view[0] + y * view[1] + z * view[2];
        if (d <= 0.06) continue;
        const sx = cx + R * (x * east[0] + y * east[1] + z * east[2]);
        const sy = cy - R * (x * north[0] + y * north[1] + z * north[2]);
        const c = Math.floor((sx - left) / cellW), r = Math.floor((sy - top) / cellH);
        if (c < 0 || c >= cols || r < 0 || r >= rows) continue;
        const at = r * cols + c;
        if (d >= depth[at]) { depth[at] = d; relief[at] = b + 1; }
      }
    }
    for (let r = 1; r < rows - 1; r++) for (let c = 1; c < cols - 1; c++) {
      const x = left + (c + 0.5) * cellW, y = top + (r + 0.5) * cellH;
      const u = (x - cx) / R, v = (y - cy) / R, rr = u*u + v*v;
      if (rr >= 1) continue;
      const at = r * cols + c, d = Math.sqrt(1 - rr);
      const isLand = relief[at] > 0;
      let glyph = '.';
      let alpha = 0.12 + 0.13 * d;
      if (isLand) {
        const gx = Number(relief[at + 1] > 0) - Number(relief[at - 1] > 0);
        const gy = Number(relief[at + cols] > 0) - Number(relief[at - cols] > 0);
        glyph = gx && gy ? (gx === gy ? '/' : '\\') : gx ? '|' : gy ? '-' : ['+', '*', '#'][relief[at] - 1];
        alpha = (0.48 + d * 0.46) * Math.min(1, d / 0.25);
      } else if (d < 0.24) { glyph = ':'; alpha = 0.3; }
      else if ((c + r) % 3 !== 0) continue;
      emit({ x, y, glyph, alpha, land: isLand });
    }
    return { cellH, cellW, cells: size };
  };
}

export function createAsciiGlobePainter() {
  const sample = createAsciiGlobeSampler();
  return (ctx: CanvasRenderingContext2D, land: LandDots | null, frame: AsciiGlobeFrame, ink: string) => {
    ctx.save();
    ctx.font = `${Math.max(frame.mobile ? 8 : 10, frame.radius * 2 / 100)}px "IBM Plex Mono", monospace`;
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillStyle = ink;
    sample(land, frame, cell => {
      ctx.globalAlpha = cell.alpha;
      ctx.fillText(cell.glyph, cell.x, cell.y);
    });
    ctx.restore();
  };
}
