import React, { useEffect, useRef } from 'react';

/**
 * The hadal floor: where the descent comes to rest. A seabed drawn in characters along the foot of
 * the Contact section — abyssal plain on the left under the footer, falling into a trench beneath
 * the CV column, with the sounding of its floor. Still (no motion), behind the copy, decorative.
 */

const CELL_W = 9;
const CELL_H = 12;
const INK = '198, 220, 214';
const FONT = '400 12px "JetBrains Mono", ui-monospace, monospace';
/** Sediment beneath the floor line, densest at the surface of the mud. */
const SEDIMENT = [':', '.', '.', '·', '·'];

/** Depth of the floor (0 top of the band … 1 bottom) across the width (0 … 1). Pure. */
export function floorDepth(x: number, narrow: boolean): number {
  const trenchX = narrow ? 0.8 : 0.74;
  const trenchHalf = narrow ? 0.15 : 0.13;
  // The plain lies low beneath the footer links on the left and rises toward the trench's rim,
  // where no copy sits, leaving the trench room to fall
  const shelfStart = narrow ? 0.5 : 0.42;
  const s = Math.max(0, Math.min(1, (x - shelfStart) / 0.16));
  const plain = 0.78 - 0.3 * s * s * (3 - 2 * s) + Math.sin(x * 9.1 + 0.6) * 0.03 + Math.sin(x * 23.7 + 1.9) * 0.015;
  const t = Math.max(0, 1 - Math.abs(x - trenchX) / trenchHalf);
  const trench = (0.96 - plain) * Math.pow(t, 1.5);
  // A low rise on the trench's landward side, as on the edge of a subduction trench
  const rise = -0.07 * Math.exp(-(((x - (trenchX - trenchHalf * 1.2)) / 0.04) ** 2));
  return Math.max(0.12, Math.min(0.97, plain + trench + rise));
}

export const HadalFloor: React.FC = React.memo(() => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    let disposed = false;

    const draw = () => {
      const W = canvas.clientWidth;
      const H = canvas.clientHeight;
      if (W < 1 || H < 1) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(W * dpr);
      canvas.height = Math.round(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, W, H);
      ctx.font = FONT;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      const narrow = W < 768;
      const cols = Math.ceil(W / CELL_W);
      const rows = Math.floor(H / CELL_H);
      let deepest = { c: 0, r: 0 };
      for (let c = 0; c < cols; c++) {
        const x = (c + 0.5) / cols;
        const d = floorDepth(x, narrow);
        const r0 = Math.min(rows - 1, Math.floor(d * rows));
        if (r0 > deepest.r) deepest = { c, r: r0 };
        // The floor line: its glyph follows the slope to the neighbouring columns
        const slope = (floorDepth(x + 1 / cols, narrow) - floorDepth(x - 1 / cols, narrow)) * rows;
        const glyph = slope > 0.55 ? '\\' : slope < -0.55 ? '/' : '_';
        const cx = c * CELL_W + CELL_W / 2;
        ctx.fillStyle = `rgba(${INK}, 0.5)`;
        ctx.fillText(glyph, cx, r0 * CELL_H + CELL_H / 2);
        // Sediment fading with depth below the line, thinning out irregularly
        for (let r = r0 + 1, k = 0; r < rows; r++, k++) {
          const hash = (((c * 73856093) ^ (r * 19349663)) >>> 0) % 100;
          if (hash < 22 + k * 9) continue;
          ctx.fillStyle = `rgba(${INK}, ${Math.max(0.05, 0.26 - k * 0.05).toFixed(3)})`;
          ctx.fillText(SEDIMENT[Math.min(SEDIMENT.length - 1, k)], cx, r * CELL_H + CELL_H / 2);
        }
      }
      // The sounding of the trench floor, set just outside its far wall at the floor's depth
      const labelRow = Math.max(0, deepest.r - 1);
      let wallC = deepest.c;
      while (wallC < cols - 1 && Math.floor(floorDepth((wallC + 0.5) / cols, narrow) * rows) >= labelRow) wallC++;
      const label = '10 994 m';
      const labelW = ctx.measureText(label).width;
      const lx = Math.min(W - labelW - CELL_W, wallC * CELL_W + CELL_W * 1.5);
      const ly = labelRow * CELL_H + CELL_H / 2;
      ctx.clearRect(lx - 4, ly - CELL_H / 2, labelW + 8, CELL_H);
      ctx.textAlign = 'left';
      ctx.fillStyle = `rgba(${INK}, 0.55)`;
      ctx.fillText(label, lx, ly);
    };

    const observer = new ResizeObserver(draw);
    observer.observe(canvas);
    document.fonts?.ready.then(() => {
      if (!disposed) draw();
    });
    draw();
    return () => {
      disposed = true;
      observer.disconnect();
    };
  }, []);

  return <canvas ref={canvasRef} className="hadal-floor" aria-hidden="true" />;
});
