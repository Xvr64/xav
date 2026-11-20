/**
 * Aspect-ratio-aware real-photograph -> whale-ink ASCII -> chromatic ASCII -> real-photograph renderer.
 *
 * Every photograph is analyzed in its entirety at its exact intrinsic aspect ratio (landscape,
 * portrait, square, or unusual proportions — zero cropping, zero stretching).
 *
 * Wave 1 builds each city's ASCII photograph organically cell-by-cell in the whales' exact pale
 * sea-glass ink over transparent deep ocean (no empty placeholder rectangles, no borders).
 * Wave 2 sweeps an organic chromatic ASCII wavefront across each completed ASCII image, infusing
 * every glyph with its real photographic color before dissolving smoothly into sharp photographic
 * detail with subtle micro-focus depth settling.
 */

import { bakeDepthPhoto, gradeDepth } from './profileDepthGrade.ts';

const BASE_LANDING_COLS = 36;
const BASE_LANDING_ROWS = 28;
const BASE_LANDING_CELLS = BASE_LANDING_COLS * BASE_LANDING_ROWS;
const MAX_CANVAS_DIM = 400;
const CHAR_ASPECT = 0.64; // JetBrains Mono cell width / height
const TARGET_ASCII_CELLS = 1020;

// Perceptually graded ASCII density ramp matching the whales' typography from sparse ocean to dense highlight.
const DENSITY_RAMP = [' ', '.', ':', '-', '~', '=', '+', '*', 'o', 'x', '#', '%', 'W', '@'];

// 4x4 Bayer ordered dither matrix for smooth, shimmer-free skies, clouds, and water reflections.
const BAYER_4 = [
  0, 8, 2, 10,
  12, 4, 14, 6,
  3, 11, 1, 9,
  15, 7, 13, 5
];

export interface PlateGridSpec {
  readonly canvasW: number;
  readonly canvasH: number;
  readonly cols: number;
  readonly rows: number;
  readonly aspect: number;
}

/**
 * Compute natural-proportion canvas dimensions and monospace ASCII grid resolution
 * matching the supplied photograph's exact intrinsic aspect ratio.
 */
export function computePlateGrid(naturalWidth: number, naturalHeight: number): PlateGridSpec {
  const aspect = naturalWidth > 0 && naturalHeight > 0 ? naturalWidth / naturalHeight : 1;
  let canvasW: number;
  let canvasH: number;
  if (aspect >= 1) {
    canvasW = MAX_CANVAS_DIM;
    canvasH = Math.max(96, Math.round(MAX_CANVAS_DIM / aspect));
  } else {
    canvasH = MAX_CANVAS_DIM;
    canvasW = Math.max(96, Math.round(MAX_CANVAS_DIM * aspect));
  }

  const ratio = aspect / CHAR_ASPECT;
  const cols = Math.max(18, Math.min(54, Math.round(Math.sqrt(TARGET_ASCII_CELLS * ratio))));
  const rows = Math.max(14, Math.min(46, Math.round(cols / ratio)));
  return { canvasW, canvasH, cols, rows, aspect };
}

/**
 * Calculate collision-free natural display dimensions inside an allocated safe bounding box.
 * Guarantees exact intrinsic aspect ratio (zero crop, zero distortion) and balanced visual weight
 * across landscape, portrait, square, and panoramic photographs.
 */
export function computeNaturalPhotoSize(
  naturalWidth: number,
  naturalHeight: number,
  maxWidth: number,
  maxHeight: number,
  scale = 1,
  areaRatio = 0.72
): { width: number; height: number } {
  const ar = naturalWidth > 0 && naturalHeight > 0 ? naturalWidth / naturalHeight : 1;
  const boundW = Math.max(1, maxWidth * scale);
  const boundH = Math.max(1, maxHeight * scale);
  const targetArea = boundW * boundH * Math.max(0.2, Math.min(1, areaRatio));

  let width = Math.sqrt(targetArea * ar);
  let height = width / ar;
  if (width > boundW) {
    width = boundW;
    height = width / ar;
  }
  if (height > boundH) {
    height = boundH;
    width = height * ar;
  }
  return { width, height };
}

/**
 * Measure every invisible slot anchor and tightly fit each photograph frame to the
 * image's exact intrinsic aspect ratio with zero cropping, zero distortion, and zero
 * overlap (accounting for subtle editorial rotation and lane offset).
 */
export function syncProfilePhotoSizes(itinerary: HTMLElement) {
  const anchors = itinerary.querySelectorAll<HTMLElement>('.profile-city-slot-anchor');
  const isCompactLayout =
    typeof window !== 'undefined' &&
    window.matchMedia('(max-width: 850px) and (max-aspect-ratio: 6/5)').matches;

  anchors.forEach(anchor => {
    const frame = anchor.querySelector<HTMLElement>('.profile-city-frame');
    if (!frame) return;
    const img = frame.querySelector<HTMLImageElement>('img');
    const anchorW = anchor.clientWidth;
    const anchorH = anchor.clientHeight;
    if (anchorW <= 1 || anchorH <= 1) return;

    const plateScale = Number(frame.dataset.plateScale || '1');
    const tiltDeg = Math.abs(Number(frame.dataset.plateRot || '0'));
    const shiftX = isCompactLayout ? 0 : Math.abs(Number(frame.dataset.plateX || '0'));

    const sinT = Math.sin((tiltDeg * Math.PI) / 180);
    const rotPad = Math.ceil(Math.max(anchorW, anchorH) * sinT) + 2;
    const availW = Math.max(20, anchorW - shiftX * 2 - rotPad);
    const availH = Math.max(20, anchorH - rotPad);

    const nw = img && img.naturalWidth > 0 ? img.naturalWidth : 1;
    const nh = img && img.naturalHeight > 0 ? img.naturalHeight : 1;
    const areaRatio = anchorW < 105 || anchorH < 105 ? 0.84 : 0.72;

    const { width, height } = computeNaturalPhotoSize(nw, nh, availW, availH, plateScale, areaRatio);
    frame.style.width = `${width.toFixed(2)}px`;
    frame.style.height = `${height.toFixed(2)}px`;
    frame.dataset.naturalAspect = (nw / nh).toFixed(4);
  });
}

interface GridCell {
  readonly col: number;
  readonly row: number;
  /** Normalized center coordinates (0..1) inside the photograph's natural rectangle. */
  readonly x: number;
  readonly y: number;
  readonly left: number;
  readonly top: number;
  /** Normalized arrival order (0..1) for Wave 1 ASCII assembly. */
  readonly order: number;
  /** Normalized resolution order (0..1) for Wave 2 chromatic-to-photo reveal. */
  readonly resolveOrder: number;
}

const clamp01 = (v: number) => (v <= 0 ? 0 : v >= 1 ? 1 : v);
const smoothstep = (e0: number, e1: number, x: number) => {
  const t = clamp01((x - e0) / (e1 - e0));
  return t * t * (3 - 2 * t);
};

function hash2(col: number, row: number, seed: number): number {
  const s = Math.sin(col * 37.41 + row * 91.17 + seed) * 1345.43;
  return s - Math.floor(s);
}

/** Build deterministic organic wavefront cell ordering for any aspect-ratio grid. */
function buildGridCells(cols: number, rows: number, canvasW: number, canvasH: number): readonly GridCell[] {
  const total = cols * rows;
  const cellW = canvasW / cols;
  const cellH = canvasH / rows;

  const raw = Array.from({ length: total }, (_, index) => {
    const col = index % cols;
    const row = Math.floor(index / cols);
    const x = (col + 0.5) / cols;
    const y = (row + 0.5) / rows;
    // Organic current front entering from the whale-facing left/lower-left with subtle cluster grouping.
    const cCol = Math.floor((x * 12));
    const cRow = Math.floor((y * 10));
    const cluster = hash2(cCol, cRow, 11.7);
    const fine = hash2(col, row, 4.3);
    const wave = 0.11 * Math.sin(y * 5.6 + x * 3.1) + 0.06 * Math.cos(x * 7.2 - y * 4.4);
    const rawOrder = x * 0.48 + (1 - y) * 0.24 + wave + cluster * 0.14 + fine * 0.07;

    // Wave 2 resolution wave: sweeping diagonal oceanic tide across the photograph.
    const distCenter = Math.hypot(x - 0.36, y - 0.44);
    const rawResolve =
      x * 0.38 +
      y * 0.24 +
      distCenter * 0.22 +
      0.09 * Math.sin(y * 6.4 - x * 3.8) +
      cluster * 0.07 +
      fine * 0.04;

    return { col, row, x, y, left: col * cellW, top: row * cellH, rawOrder, rawResolve };
  });

  const minO = Math.min(...raw.map(c => c.rawOrder));
  const maxO = Math.max(...raw.map(c => c.rawOrder));
  const minR = Math.min(...raw.map(c => c.rawResolve));
  const maxR = Math.max(...raw.map(c => c.rawResolve));

  return raw
    .map(c => ({
      col: c.col,
      row: c.row,
      x: c.x,
      y: c.y,
      left: c.left,
      top: c.top,
      order: (c.rawOrder - minO) / Math.max(1e-5, maxO - minO),
      resolveOrder: (c.rawResolve - minR) / Math.max(1e-5, maxR - minR)
    }))
    .sort((a, b) => a.order - b.order);
}

/** Normalized arrival table shared with the GPU whale current's landing shader. */
const LANDING_CELLS = buildGridCells(BASE_LANDING_COLS, BASE_LANDING_ROWS, 1, 1);

/** Exact normalized landing site (0..1, 0..1) for a whale glyph arriving at `arrivalFraction` (0..1). */
export function memoryLanding(arrivalFraction: number): { x: number; y: number } {
  const index = Math.max(0, Math.min(BASE_LANDING_CELLS - 1, Math.floor(arrivalFraction * BASE_LANDING_CELLS)));
  const cell = LANDING_CELLS[index];
  return { x: cell.x, y: cell.y };
}

/** Shared reusable work canvas (sized to at least MAX_CANVAS_DIM x MAX_CANVAS_DIM — zero per-frame allocations). */
let sharedWorkCanvas: HTMLCanvasElement | null = null;
let sharedWorkCtx: CanvasRenderingContext2D | null = null;

function ensureWorkCanvas(w: number, h: number) {
  if (!sharedWorkCanvas) {
    sharedWorkCanvas = document.createElement('canvas');
    sharedWorkCanvas.width = Math.max(MAX_CANVAS_DIM, w);
    sharedWorkCanvas.height = Math.max(MAX_CANVAS_DIM, h);
    sharedWorkCtx = sharedWorkCanvas.getContext('2d')!;
  } else if (sharedWorkCanvas.width < w || sharedWorkCanvas.height < h) {
    sharedWorkCanvas.width = Math.max(sharedWorkCanvas.width, w);
    sharedWorkCanvas.height = Math.max(sharedWorkCanvas.height, h);
    sharedWorkCtx = sharedWorkCanvas.getContext('2d')!;
  }
  return { workCanvas: sharedWorkCanvas, workCtx: sharedWorkCtx! };
}

/** Draw a source layer onto `dest` through a smooth bilinear-upscaled alpha mask at exact plate dimensions. */
function compositeMasked(
  dest: CanvasRenderingContext2D,
  source: HTMLCanvasElement,
  maskCanvas: HTMLCanvasElement,
  maskCtx: CanvasRenderingContext2D,
  maskData: ImageData,
  canvasW: number,
  canvasH: number,
  scale = 1
) {
  const { workCanvas, workCtx } = ensureWorkCanvas(canvasW, canvasH);
  maskCtx.putImageData(maskData, 0, 0);

  workCtx.globalCompositeOperation = 'source-over';
  workCtx.clearRect(0, 0, canvasW, canvasH);
  workCtx.imageSmoothingEnabled = true;
  workCtx.imageSmoothingQuality = 'high';
  workCtx.drawImage(maskCanvas, 0, 0, canvasW, canvasH);

  workCtx.globalCompositeOperation = 'source-in';
  if (scale !== 1) {
    const drawW = canvasW * scale;
    const drawH = canvasH * scale;
    const ox = (canvasW - drawW) * 0.5;
    const oy = (canvasH - drawH) * 0.5;
    workCtx.drawImage(source, ox, oy, drawW, drawH);
  } else {
    workCtx.drawImage(source, 0, 0, canvasW, canvasH);
  }
  workCtx.globalCompositeOperation = 'source-over';
  dest.drawImage(workCanvas, 0, 0, canvasW, canvasH, 0, 0, canvasW, canvasH);
}

interface AnalyzedCell {
  glyph: string;
  lum: number;
  edge: number;
  r: number;
  g: number;
  b: number;
}

/**
 * Analyze the complete uncropped photograph on a 3x3-supersampled aspect-matched grid:
 * extracts adaptive contrast-stretched luminance, 3x3 unsharp-mask local structure,
 * edge saliency, and local photographic RGB.
 */
function analyzePhoto(image: HTMLImageElement, cols: number, rows: number): AnalyzedCell[] {
  const cells = cols * rows;
  const sub = 3;
  const sw = cols * sub;
  const sh = rows * sub;
  const sample = document.createElement('canvas');
  sample.width = sw;
  sample.height = sh;
  const sctx = sample.getContext('2d', { willReadFrequently: true })!;
  sctx.drawImage(image, 0, 0, sw, sh);
  const px = sctx.getImageData(0, 0, sw, sh).data;

  const rArr = new Float32Array(cells);
  const gArr = new Float32Array(cells);
  const bArr = new Float32Array(cells);
  const lArr = new Float32Array(cells);

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      let rs = 0, gs = 0, bs = 0;
      for (let dy = 0; dy < sub; dy++) {
        for (let dx = 0; dx < sub; dx++) {
          const off = ((row * sub + dy) * sw + (col * sub + dx)) * 4;
          rs += px[off];
          gs += px[off + 1];
          bs += px[off + 2];
        }
      }
      const n = sub * sub;
      const r = rs / n;
      const g = gs / n;
      const b = bs / n;
      const idx = row * cols + col;
      rArr[idx] = r;
      gArr[idx] = g;
      bArr[idx] = b;
      // Blend perceived luminance with max-channel chroma glow so neon blue (Singapore)
      // and crimson lanterns (Shanghai) shine clearly in monochrome ASCII.
      const yLum = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
      const maxCh = Math.max(r, g, b) / 255;
      lArr[idx] = yLum * 0.78 + maxCh * 0.22;
    }
  }

  // Per-photo adaptive contrast stretch preserving night drama while maximizing visual clarity.
  const sorted = Array.from(lArr).sort((a, b) => a - b);
  const p03 = sorted[Math.floor(cells * 0.03)];
  const p50 = sorted[Math.floor(cells * 0.50)];
  const p97 = sorted[Math.floor(cells * 0.97)];
  const isNight = p50 < 0.26;
  const lo = isNight ? Math.max(0.03, p03) : p03;
  const hi = Math.max(lo + 0.24, p97);
  const gamma = isNight ? 0.66 : 0.86;

  const base = new Float32Array(cells);
  for (let i = 0; i < cells; i++) {
    const stretched = clamp01((lArr[i] - lo) / (hi - lo));
    const curved = Math.pow(stretched, gamma);
    const s = curved * curved * (3 - 2 * curved);
    base[i] = clamp01(curved * 0.66 + s * 0.34);
  }

  const at = (arr: Float32Array, c: number, r: number) =>
    arr[Math.max(0, Math.min(rows - 1, r)) * cols + Math.max(0, Math.min(cols - 1, c))];

  // 3x3 unsharp mask: sharpens skylines, spires, domes, palms, columns, and mountain ridges.
  const norm = new Float32Array(cells);
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const idx = row * cols + col;
      const blur =
        (at(base, col - 1, row - 1) + 2 * at(base, col, row - 1) + at(base, col + 1, row - 1) +
         2 * at(base, col - 1, row) + 4 * at(base, col, row) + 2 * at(base, col + 1, row) +
         at(base, col - 1, row + 1) + 2 * at(base, col, row + 1) + at(base, col + 1, row + 1)) / 16;
      const sharp = base[idx] + (base[idx] - blur) * 0.72;
      norm[idx] = clamp01(sharp);
    }
  }

  const out: AnalyzedCell[] = new Array(cells);
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const idx = row * cols + col;
      const lum = norm[idx];
      const gx =
        -at(norm, col - 1, row - 1) - 2 * at(norm, col - 1, row) - at(norm, col - 1, row + 1) +
        at(norm, col + 1, row - 1) + 2 * at(norm, col + 1, row) + at(norm, col + 1, row + 1);
      const gy =
        -at(norm, col - 1, row - 1) - 2 * at(norm, col, row - 1) - at(norm, col + 1, row - 1) +
        at(norm, col - 1, row + 1) + 2 * at(norm, col, row + 1) + at(norm, col + 1, row + 1);
      const edge = Math.min(1, Math.hypot(gx, gy) * 0.48);

      const bayer = (BAYER_4[(row & 3) * 4 + (col & 3)] + 0.5) / 16 - 0.5;
      const dithered = clamp01(lum + bayer * 0.055);
      const rampIdx = Math.min(DENSITY_RAMP.length - 1, Math.floor(dithered * DENSITY_RAMP.length));
      let glyph = DENSITY_RAMP[rampIdx];
      // Subtle contour punctuation on crisp dark silhouettes (towers, spires, mountain edges)
      if (glyph === ' ' && edge > 0.28) glyph = '.';

      out[idx] = { glyph, lum, edge, r: rArr[idx], g: gArr[idx], b: bArr[idx] };
    }
  }
  return out;
}

/** Bake crisp whale-ink ASCII and vivid chromatic ASCII canvases at exact photographic proportions. */
function bakeAsciiLayers(cells: readonly AnalyzedCell[], spec: PlateGridSpec) {
  const { canvasW, canvasH, cols, rows } = spec;
  const cellW = canvasW / cols;
  const cellH = canvasH / rows;
  const font = `700 ${Math.max(8, Math.round(cellH * 0.98))}px "JetBrains Mono", ui-monospace, monospace`;

  const inkCanvas = document.createElement('canvas');
  inkCanvas.width = canvasW;
  inkCanvas.height = canvasH;
  const ictx = inkCanvas.getContext('2d')!;
  ictx.font = font;
  ictx.textAlign = 'center';
  ictx.textBaseline = 'middle';

  const colorCanvas = document.createElement('canvas');
  colorCanvas.width = canvasW;
  colorCanvas.height = canvasH;
  const cctx = colorCanvas.getContext('2d')!;
  cctx.font = font;
  cctx.textAlign = 'center';
  cctx.textBaseline = 'middle';

  const depthRgb = [0, 0, 0];
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const cell = cells[row * cols + col];
      if (cell.lum > 0.14) {
        const wash = Math.pow(cell.lum, 1.55) * 0.24;
        ictx.fillStyle = `rgba(154, 206, 232, ${wash.toFixed(3)})`;
        ictx.fillRect(col * cellW, row * cellH, cellW + 0.5, cellH + 0.5);
      }
      if (cell.glyph === ' ') continue;

      const cx = (col + 0.5) * cellW;
      const cy = (row + 0.5) * cellH + 0.5;

      // Whale sea-glass ink palette: crisp luminous ice-silver highlights into ocean frost midtones.
      const tone = clamp01(cell.lum * 0.92 + cell.edge * 0.22);
      const ir = Math.round(138 + tone * 114); // 138..252
      const ig = Math.round(182 + tone * 72);  // 182..254
      const ib = Math.round(212 + tone * 43);  // 212..255
      const ia = Math.min(1, 0.38 + tone * 0.62);
      ictx.fillStyle = `rgba(${ir},${ig},${ib},${ia.toFixed(3)})`;
      ictx.fillText(cell.glyph, cx, cy);

      // Wave 2's chromatic awakening arrives in the colour the photograph keeps at depth (the reds
      // already absorbed), gently lifted for a luminous wavefront.
      gradeDepth(cell.r, cell.g, cell.b, depthRgb);
      const avg = (depthRgb[0] + depthRgb[1] + depthRgb[2]) / 3;
      const boost = 1.32;
      const lift = 38;
      const cr = Math.min(255, Math.max(0, Math.round(avg + (depthRgb[0] - avg) * boost + lift)));
      const cg = Math.min(255, Math.max(0, Math.round(avg + (depthRgb[1] - avg) * boost + lift)));
      const cb = Math.min(255, Math.max(0, Math.round(avg + (depthRgb[2] - avg) * boost + lift)));
      const ca = Math.min(1, 0.60 + tone * 0.40);
      cctx.fillStyle = `rgba(${cr},${cg},${cb},${ca.toFixed(3)})`;
      cctx.fillText(cell.glyph, cx, cy);
    }
  }

  return { inkCanvas, colorCanvas };
}

export interface MemoryPlate {
  readonly spec: PlateGridSpec;
  draw(assembled: number, color: number): void;
}

/**
 * Preload the real photograph and pre-bake its natural-aspect whale-ink ASCII, chromatic ASCII,
 * and uncropped photographic surfaces so two-wave playback runs cleanly at 60fps.
 */
export async function prepareMemoryPlate(frame: HTMLElement): Promise<MemoryPlate | null> {
  const image = frame.querySelector<HTMLImageElement>('.profile-city-photo-layer img');
  const surface = frame.querySelector<HTMLCanvasElement>('.profile-memory-etching');
  const ctx = surface?.getContext('2d');
  if (!image || !surface || !ctx) return null;

  try {
    await image.decode();
    if (document.fonts?.ready) {
      await Promise.race([document.fonts.ready, new Promise(r => setTimeout(r, 600))]);
    }
  } catch {
    return null;
  }

  const spec = computePlateGrid(image.naturalWidth, image.naturalHeight);
  const { canvasW, canvasH, cols, rows } = spec;
  const cellW = canvasW / cols;
  const cellH = canvasH / rows;
  const gridCells = buildGridCells(cols, rows, canvasW, canvasH);

  surface.width = canvasW;
  surface.height = canvasH;

  const photoCanvas = document.createElement('canvas');
  photoCanvas.width = canvasW;
  photoCanvas.height = canvasH;
  const pctx = photoCanvas.getContext('2d')!;
  pctx.imageSmoothingEnabled = true;
  pctx.imageSmoothingQuality = 'high';
  // Wave 2 resolves into the photograph as it is seen at depth, the same image that then rests
  // on the page; the original colours return only under the diver's light (profileTorch.ts)
  const depth = await bakeDepthPhoto(image);
  pctx.drawImage(depth ?? image, 0, 0, canvasW, canvasH);

  const analyzed = analyzePhoto(image, cols, rows);
  const { inkCanvas, colorCanvas } = bakeAsciiLayers(analyzed, spec);

  // Per-plate compact alpha-mask buffer (~4 KB) matching this photo's exact ASCII grid.
  const maskCanvas = document.createElement('canvas');
  maskCanvas.width = cols;
  maskCanvas.height = rows;
  const maskCtx = maskCanvas.getContext('2d')!;
  const maskData = maskCtx.createImageData(cols, rows);
  const buf = maskData.data;

  // Pre-warm the shared work canvas and Skia GPU backing stores before Wave 2 begins.
  const { workCtx } = ensureWorkCanvas(canvasW, canvasH);
  workCtx.globalCompositeOperation = 'source-over';
  workCtx.clearRect(0, 0, 4, 4);
  workCtx.drawImage(maskCanvas, 0, 0, 2, 2);
  workCtx.globalCompositeOperation = 'source-in';
  workCtx.drawImage(photoCanvas, 0, 0, 2, 2);
  workCtx.drawImage(inkCanvas, 0, 0, 2, 2);
  workCtx.drawImage(colorCanvas, 0, 0, 2, 2);
  workCtx.globalCompositeOperation = 'source-over';
  workCtx.clearRect(0, 0, 4, 4);

  let lastAssembled = -1;
  let lastColor = -1;

  return {
    spec,
    draw(assembled, color) {
      const a = clamp01(assembled);
      const c = a >= 0.999 ? clamp01(color) : 0;

      const phase =
        c >= 0.999
          ? 'photo'
          : c > 0.001
            ? 'resolving'
            : a >= 0.999
              ? 'ascii'
              : a > 0.001
                ? 'forming'
                : 'empty';
      if (frame.dataset.memoryPhase !== phase) frame.dataset.memoryPhase = phase;

      if (Math.abs(a - lastAssembled) < 0.0005 && Math.abs(c - lastColor) < 0.0005) return;
      lastAssembled = a;
      lastColor = c;

      ctx.clearRect(0, 0, canvasW, canvasH);

      if (a <= 0.001) return;

      if (c >= 0.999) {
        ctx.drawImage(photoCanvas, 0, 0);
        return;
      }

      // ---- WAVE 1: Materializing out of empty ocean -> recognizable whale-ink ASCII ----
      if (c <= 0.001) {
        for (let i = 0; i < gridCells.length; i++) {
          const cell = gridCells[i];
          const p = smoothstep(0, 1, (a - cell.order * 0.78) / 0.22);
          const off = (cell.row * cols + cell.col) * 4;
          buf[off] = 5;
          buf[off + 1] = 13;
          buf[off + 2] = 38;
          buf[off + 3] = Math.round(p * 168);
        }
        maskCtx.putImageData(maskData, 0, 0);
        ctx.imageSmoothingEnabled = true;
        ctx.drawImage(maskCanvas, 0, 0, canvasW, canvasH);

        if (a >= 0.999) {
          ctx.drawImage(inkCanvas, 0, 0);
          return;
        }

        for (let i = 0; i < gridCells.length; i++) {
          const cell = gridCells[i];
          const p = (a - cell.order * 0.80) / 0.20;
          if (p <= 0) continue;
          if (p >= 1) {
            ctx.globalAlpha = 1;
            ctx.drawImage(inkCanvas, cell.left, cell.top, cellW, cellH, cell.left, cell.top, cellW, cellH);
          } else {
            const e = p * p * (3 - 2 * p);
            const settleScale = 1 + (1 - e) * 0.24;
            const dw = cellW * settleScale;
            const dh = cellH * settleScale;
            const dx = cell.left + (cellW - dw) * 0.5 - (1 - e) * 2.2;
            const dy = cell.top + (cellH - dh) * 0.5 + (1 - e) * 2.6;
            ctx.globalAlpha = e;
            ctx.drawImage(inkCanvas, cell.left, cell.top, cellW, cellH, dx, dy, dw, dh);
          }
        }
        ctx.globalAlpha = 1;
        return;
      }

      // ---- WAVE 2: Whale-ink ASCII -> Chromatic ASCII Wavefront -> Sharp Real Photograph ----
      const groundAlpha = 0.66 * (1 - smoothstep(0.42, 0.94, c));
      if (groundAlpha > 0.005) {
        ctx.fillStyle = `rgba(5, 13, 38, ${groundAlpha.toFixed(3)})`;
        ctx.fillRect(0, 0, canvasW, canvasH);
      }

      // 1. Progressive photographic detail emerging through organic feathered cell mask with micro-focus settle.
      const focusScale = 1 + 0.030 * (1 - smoothstep(0, 1, c));
      for (let i = 0; i < gridCells.length; i++) {
        const cell = gridCells[i];
        const cp = clamp01((c - cell.resolveOrder * 0.44) / 0.56);
        const alpha = smoothstep(0.20, 0.90, cp);
        const off = (cell.row * cols + cell.col) * 4;
        buf[off] = 255;
        buf[off + 1] = 255;
        buf[off + 2] = 255;
        buf[off + 3] = Math.round(alpha * 255);
      }
      compositeMasked(ctx, photoCanvas, maskCanvas, maskCtx, maskData, canvasW, canvasH, focusScale);

      // 2. Monochrome whale-ink ASCII yielding gracefully as chromatic color arrives.
      for (let i = 0; i < gridCells.length; i++) {
        const cell = gridCells[i];
        const cp = clamp01((c - cell.resolveOrder * 0.44) / 0.56);
        const alpha = 1 - smoothstep(0.0, 0.38, cp);
        const off = (cell.row * cols + cell.col) * 4;
        buf[off + 3] = Math.round(alpha * 255);
      }
      compositeMasked(ctx, inkCanvas, maskCanvas, maskCtx, maskData, canvasW, canvasH, 1);

      // 3. Chromatic ASCII wavefront: characters ignite with real photo color before melting into pixels.
      for (let i = 0; i < gridCells.length; i++) {
        const cell = gridCells[i];
        const cp = clamp01((c - cell.resolveOrder * 0.44) / 0.56);
        const ignite = smoothstep(0.0, 0.30, cp);
        const dissolve = 1 - smoothstep(0.44, 0.94, cp);
        const alpha = ignite * dissolve;
        const off = (cell.row * cols + cell.col) * 4;
        buf[off + 3] = Math.round(alpha * 255);
      }
      compositeMasked(ctx, colorCanvas, maskCanvas, maskCtx, maskData, canvasW, canvasH, 1);
    }
  };
}
