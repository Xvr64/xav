// ============================================================================
// TITLE EMERGENCE — a chapter title forming out of the ASCII water
// ============================================================================
// The cover gathers "Xavier Hery" out of fragments carried by a current, then resolves the
// glyphs into type (heroCurrent.ts). Each chapter title makes the same gesture, small and once:
// glyph cells drift in from upstream, settle into the letters' own strokes (editorialVoices.ts
// chooses | - _ / \ by the direction of the ink in each cell), the real title comes up through
// them and the glyphs let go.
//
// Cost: one small 2D canvas over one title, created when that title starts to arrive and removed
// when it has; a few hundred fillText calls per frame for under a second. No loop of its own (the
// editorial controller's frame drives it with the line's progress), no WebGL context, nothing
// while a title is not arriving, and nothing at all under reduced motion.

import { BOB_PX, DRIFT_PX, WATER_GLYPHS, cellMoment, emergenceCell, shapeGlyph } from './editorialVoices';

export interface TitleEmergence {
  /** Draw the title's glyphs at progress p (0 not yet … 1 gone: the type stands alone). */
  draw(p: number): void;
  dispose(): void;
}

interface Cell { x: number; y: number; tx: number; rand: number; seed: number; glyph: string; bob: number }

const PAD_X = 84;
const PAD_Y = 18;
const MONO = "'IBM Plex Mono', ui-monospace, SFMono-Regular, Menlo, Consolas, monospace";

const hash = (i: number, k: number) => {
  const s = Math.sin(i * 12.9898 + k * 78.233) * 43758.5453;
  return s - Math.floor(s);
};

/**
 * `title` is the heading element; `words` its rendered words (each holding one text node, the
 * decode system's `.ascii-source`). The canvas is appended to `host`, a positioned ancestor that
 * is not itself reading text, so nothing that measures the copy ever sees it.
 */
export function createTitleEmergence(title: HTMLElement, words: readonly HTMLElement[], host: HTMLElement): TitleEmergence | null {
  const titleRect = title.getBoundingClientRect();
  const hostRect = host.getBoundingClientRect();
  if (titleRect.width < 4 || titleRect.height < 4 || !words.length) return null;

  // The words' own box (the chapter mark above the title is not part of the picture)
  let left = Infinity, top = Infinity, right = -Infinity, bottom = -Infinity;
  const range = document.createRange();
  const glyphBoxes: { ch: string; x: number; top: number; height: number; font: string }[] = [];
  for (const word of words) {
    const node = word.firstChild;
    if (!(node instanceof Text)) continue;
    const cs = getComputedStyle(word);
    const font = `${cs.fontStyle} ${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`;
    const text = node.data;
    let unit = 0;
    for (const ch of Array.from(text)) {
      range.setStart(node, unit);
      range.setEnd(node, unit + ch.length);
      unit += ch.length;
      const r = range.getBoundingClientRect();
      if (r.width <= 0 || r.height <= 0) continue;
      left = Math.min(left, r.left); right = Math.max(right, r.right);
      top = Math.min(top, r.top); bottom = Math.max(bottom, r.bottom);
      glyphBoxes.push({ ch, x: r.left, top: r.top, height: r.height, font });
    }
  }
  range.detach();
  if (!glyphBoxes.length) return null;

  const fontPx = parseFloat(getComputedStyle(words[0]).fontSize) || 48;
  const cell = emergenceCell(fontPx);
  const width = Math.ceil(right - left + PAD_X * 2);
  const height = Math.ceil(bottom - top + PAD_Y * 2);
  const originX = left - PAD_X;
  const originY = top - PAD_Y;

  // 1. The title as a mask, one canvas pixel per CSS pixel, every letter where the page set it
  const mask = document.createElement('canvas');
  mask.width = width;
  mask.height = height;
  const mctx = mask.getContext('2d', { willReadFrequently: true });
  if (!mctx) return null;
  mctx.fillStyle = '#000';
  mctx.textBaseline = 'alphabetic';
  mctx.textAlign = 'left';
  for (const g of glyphBoxes) {
    mctx.font = g.font;
    const m = mctx.measureText(g.ch);
    const asc = m.fontBoundingBoxAscent || fontPx * 0.8;
    const desc = m.fontBoundingBoxDescent || fontPx * 0.2;
    mctx.fillText(g.ch, g.x - originX, g.top - originY + (g.height - (asc + desc)) / 2 + asc);
  }
  const alpha = mctx.getImageData(0, 0, width, height).data;
  const ink = (x: number, y: number) => (x < 0 || y < 0 || x >= width || y >= height ? 0 : alpha[(y * width + x) * 4 + 3] / 255);

  // 2. One cell per glyph of the grid that holds ink: its coverage, its stroke direction, its glyph
  const cols = Math.ceil(width / cell.w);
  const rows = Math.ceil(height / cell.h);
  const span = Math.max(1, right - left);
  const cells: Cell[] = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const x0 = Math.floor(c * cell.w), x1 = Math.min(width, Math.floor((c + 1) * cell.w));
      const y0 = Math.floor(r * cell.h), y1 = Math.min(height, Math.floor((r + 1) * cell.h));
      let sum = 0, weightedY = 0, jxx = 0, jyy = 0, jxy = 0, n = 0;
      for (let y = y0; y < y1; y++) {
        for (let x = x0; x < x1; x++) {
          const a = ink(x, y);
          sum += a; weightedY += a * (y - y0 + 0.5); n++;
          const gx = ink(x + 1, y) - ink(x - 1, y);
          const gy = ink(x, y + 1) - ink(x, y - 1);
          jxx += gx * gx; jyy += gy * gy; jxy += gx * gy;
        }
      }
      if (!n || sum <= 0) continue;
      const seed = r * 131 + c * 17;
      const glyph = shapeGlyph(sum / n, jxx, jyy, jxy, weightedY / sum / Math.max(1, y1 - y0), seed);
      if (!glyph) continue;
      const cx = (c + 0.5) * cell.w;
      cells.push({
        x: cx, y: (r + 0.5) * cell.h,
        tx: Math.max(0, Math.min(1, (cx - PAD_X) / span)),
        rand: hash(seed, 1), seed, glyph,
        bob: (hash(seed, 2) - 0.5) * 2 * BOB_PX
      });
    }
  }
  if (!cells.length) return null;

  // 3. The canvas the visitor sees, over the title
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const canvas = document.createElement('canvas');
  canvas.width = Math.round(width * dpr);
  canvas.height = Math.round(height * dpr);
  canvas.setAttribute('aria-hidden', 'true');
  canvas.dataset.titleEmergence = '';
  canvas.style.cssText = `position:absolute;left:${originX - hostRect.left}px;top:${originY - hostRect.top}px;width:${width}px;height:${height}px;pointer-events:none;z-index:1`;
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;
  host.appendChild(canvas);
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.font = `500 ${(cell.h * 0.94).toFixed(2)}px ${MONO}`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = getComputedStyle(title).color;

  let disposed = false;
  let drawn = NaN;
  return {
    draw(p) {
      if (disposed || p === drawn) return;
      drawn = p;
      ctx.clearRect(0, 0, width, height);
      if (p <= 0 || p >= 1) return;
      // The current's glyphs turn over a few times while a cell travels
      const turn = Math.floor(p * 16);
      for (const cell of cells) {
        const m = cellMoment(p, cell.tx, cell.rand);
        if (m.alpha <= 0.01) continue;
        const away = 1 - m.arrive;
        const x = cell.x - away * (DRIFT_PX[0] + DRIFT_PX[1] * cell.rand);
        const y = cell.y + away * cell.bob;
        ctx.globalAlpha = m.alpha;
        ctx.fillText(m.formed ? cell.glyph : WATER_GLYPHS[(cell.seed + turn) % WATER_GLYPHS.length], x, y);
      }
      ctx.globalAlpha = 1;
    },
    dispose() {
      if (disposed) return;
      disposed = true;
      canvas.remove();
    }
  };
}
