/**
 * Archived, not deleted: components and helpers no longer rendered on the page, kept out of the
 * bundle (nothing imports this module) until a decision is made to restore or remove them.
 *  - NAV_ITEMS: the section index of an earlier navigation.
 *  - generateOriginalCvPdfBlob: a raw PDF writer, replaced by the original CV file in /public.
 *  - TideWord: the regular/italic drifting word of an earlier cover.
 *  - HeroAsciiCanvas: the earlier ASCII hero, including its whale migration loop waypoints.
 *  - TiltCard: a pointer-tilt card from the earlier boxed layout.
 */
import React, { useEffect, useRef, useState } from 'react';

export const NAV_ITEMS = [
  { id: 'home', num: '01', label: 'Index' },
  { id: 'experience', num: '02', label: 'Experience' },
  { id: 'global', num: '03', label: 'Global' },
  { id: 'skills', num: '04', label: 'Skills' },
  { id: 'education', num: '05', label: 'Education' },
  { id: 'languages', num: '06', label: 'Languages' },
  { id: 'interests', num: '07', label: 'Interests' },
  { id: 'contact', num: '08', label: 'Contact' }
];

// ============================================================================
// STANDARDS-COMPLIANT RAW PDF 1.4 BINARY GENERATOR
// ============================================================================

export function escapePdfText(str: string): string {
  return str
    .replace(/–/g, '-')
    .replace(/—/g, '-')
    .replace(/’/g, "'")
    .replace(/•/g, '-')
    .replace(/\\/g, '\\\\')
    .replace(/\(/g, '\\(')
    .replace(/\)/g, '\\)');
}

export function generateOriginalCvPdfBlob(): Blob {
  const ops: string[] = [];
  ops.push('0.96 0.953 0.933 rg');
  ops.push('0 0 595.28 841.89 re f');
  ops.push('0.09 0.09 0.09 rg');
  ops.push('0.09 0.09 0.09 RG');

  const addText = (text: string, x: number, y: number, size: number, bold = false, muted = false) => {
    if (muted) {
      ops.push('0.467 0.463 0.435 rg');
    } else {
      ops.push('0.09 0.09 0.09 rg');
    }
    ops.push('BT');
    ops.push(`/${bold ? 'F2' : 'F1'} ${size} Tf`);
    ops.push(`1 0 0 1 ${x.toFixed(2)} ${y.toFixed(2)} Tm`);
    ops.push(`(${escapePdfText(text)}) Tj`);
    ops.push('ET');
  };

  const addLine = (x1: number, y1: number, x2: number, y2: number, width = 0.6) => {
    ops.push(`${width} w`);
    ops.push('0.09 0.09 0.09 RG');
    ops.push(`${x1.toFixed(2)} ${y1.toFixed(2)} m ${x2.toFixed(2)} ${y2.toFixed(2)} l S`);
  };

  addText('XAVIER HERY', 42, 785, 22, true);
  addText('+33 7 67 20 58 22  |  Heryxx44@gmail.com  |  https://www.linkedin.com/in/xavierhry/', 42, 766, 9, false, true);
  addLine(42, 754, 553, 754, 0.75);

  addText('Third-year Bachelor student at ESSCA with an international background shaped by living in Doha, Paris,', 42, 736, 9.5);
  addText('Jakarta, Moscow, Singapore, Pau, and Shanghai. Proven adaptability, strong cross-cultural communication, and', 42, 723, 9.5);
  addText('practical experience in project coordination.', 42, 710, 9.5);
  addLine(42, 696, 553, 696, 0.5);

  // Left Column
  addText('SKILLS', 42, 676, 11, true);
  addLine(42, 671, 206, 671, 0.4);
  addText('- AI & Tech Tools: Prompt engineering', 42, 655, 9, true);
  addText('  (incl. OpenClaw, Google AI Studio,', 42, 643, 8.5);
  addText('  Antigravity, OpenAI Codex).', 42, 632, 8.5);

  addText('LANGUAGES', 42, 512, 11, true);
  addLine(42, 507, 206, 507, 0.4);
  addText('- French: Native', 42, 491, 8.8);
  addText('- English: C1 (Bilingual / Fluent)', 42, 477, 8.8);

  // Right Column
  addText('WORK EXPERIENCE', 238, 676, 11, true);
  addLine(238, 671, 553, 671, 0.4);
  addText('Business Development & Operations Intern - FRESHPEPPER', 238, 654, 9.8, true);
  addText('April 2025', 238, 641, 8.5, false, true);

  const contentStream = ops.join('\n');
  const encoder = new TextEncoder();
  const streamByteLength = encoder.encode(contentStream).length;

  const objects: string[] = [
    `1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n`,
    `2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n`,
    `3 0 obj\n<< /Type /Page /Parent 2 0 R /Resources << /Font << /F1 4 0 R /F2 5 0 R >> >> /MediaBox [0 0 595.28 841.89] /Contents 6 0 R >>\nendobj\n`,
    `4 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>\nendobj\n`,
    `5 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold /Encoding /WinAnsiEncoding >>\nendobj\n`,
    `6 0 obj\n<< /Length ${streamByteLength} >>\nstream\n${contentStream}\nendstream\nendobj\n`
  ];

  let pdfHeader = '%PDF-1.4\n';
  const offsets: number[] = [];
  let currentByteOffset = encoder.encode(pdfHeader).length;

  let body = '';
  for (const obj of objects) {
    offsets.push(currentByteOffset);
    body += obj;
    currentByteOffset += encoder.encode(obj).length;
  }

  const xrefOffset = currentByteOffset;
  let xref = `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
  for (const offset of offsets) {
    xref += `${String(offset).padStart(10, '0')} 00000 n \n`;
  }

  const trailer = `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`;
  return new Blob([encoder.encode(pdfHeader + body + xref + trailer)], { type: 'application/pdf' });
}

// TideWord: a word that drifts between the regular and italic cuts of Instrument Serif
// (like a changing current). Staying within ONE typeface keeps the size, x-height and
// width constant, so the word never grows, shrinks or shifts while it animates.
export const TIDE_STATES: readonly { family: string; style: 'normal' | 'italic'; weight: number }[] = [
  { family: 'var(--font-hero)', style: 'normal', weight: 400 }, // Instrument Serif Regular
  { family: 'var(--font-hero)', style: 'italic', weight: 400 }, // Instrument Serif Italic
  { family: 'var(--font-hero)', style: 'normal', weight: 400 }, // Instrument Serif Regular
  { family: 'var(--font-hero)', style: 'italic', weight: 400 }  // Instrument Serif Italic
];
export const DEFAULT_TIDE_CYCLE_SECONDS = 7; // 1.75s per typeface state, ~0.4s soft-focus dissolve between states

export const TideWord: React.FC<{
  text: string;
  offset?: number;
  className?: string;
  cycleSeconds?: number;
}> = ({
  text,
  offset = 0,
  className = '',
  cycleSeconds = DEFAULT_TIDE_CYCLE_SECONDS
}) => {
  const quarter = cycleSeconds / TIDE_STATES.length;
  return (
    <span className={`tide-word ${className}`}>
      <span className="sr-only">{text}</span>
      {TIDE_STATES.map((state, i) => {
        const phase =
          (((quarter / 2 + offset - i * quarter) % cycleSeconds) + cycleSeconds) %
          cycleSeconds;
        return (
          <span
            key={i}
            aria-hidden="true"
            className="tide-layer"
            style={{
              fontFamily: state.family,
              fontStyle: state.style,
              fontWeight: state.weight,
              animationDuration: `${cycleSeconds}s`,
              animationDelay: `-${phase.toFixed(2)}s`
            }}
          >
            {text}
          </span>
        );
      })}
    </span>
  );
};

// 3D Simplex Noise & Curl-Fluid Flow Field adapted from muraleph/glyphwork (glyphwork/flowfield.py)
export const SIMPLEX_GRAD3: readonly [number, number, number][] = [
  [1, 1, 0], [-1, 1, 0], [1, -1, 0], [-1, -1, 0],
  [1, 0, 1], [-1, 0, 1], [1, 0, -1], [-1, 0, -1],
  [0, 1, 1], [0, -1, 1], [0, 1, -1], [0, -1, -1]
];

export function createGlyphworkSimplex3D(seed = 42) {
  const p = new Uint8Array(256);
  for (let i = 0; i < 256; i++) p[i] = i;
  let s = seed >>> 0;
  for (let i = 255; i > 0; i--) {
    s = (Math.imul(s, 1664525) + 1013904223) >>> 0;
    const j = s % (i + 1);
    const tmp = p[i];
    p[i] = p[j];
    p[j] = tmp;
  }
  const perm = new Uint8Array(512);
  const permMod12 = new Uint8Array(512);
  for (let i = 0; i < 512; i++) {
    perm[i] = p[i & 255];
    permMod12[i] = perm[i] % 12;
  }

  const F3 = 1 / 3;
  const G3 = 1 / 6;

  return function noise3d(xin: number, yin: number, zin: number): number {
    const skew = (xin + yin + zin) * F3;
    const i = Math.floor(xin + skew);
    const j = Math.floor(yin + skew);
    const k = Math.floor(zin + skew);
    const unskew = (i + j + k) * G3;

    const x0 = xin - (i - unskew);
    const y0 = yin - (j - unskew);
    const z0 = zin - (k - unskew);

    let i1 = 0, j1 = 0, k1 = 0;
    let i2 = 0, j2 = 0, k2 = 0;
    if (x0 >= y0) {
      if (y0 >= z0) {
        i1 = 1; j1 = 0; k1 = 0; i2 = 1; j2 = 1; k2 = 0;
      } else if (x0 >= z0) {
        i1 = 1; j1 = 0; k1 = 0; i2 = 1; j2 = 0; k2 = 1;
      } else {
        i1 = 0; j1 = 0; k1 = 1; i2 = 1; j2 = 0; k2 = 1;
      }
    } else if (y0 < z0) {
      i1 = 0; j1 = 0; k1 = 1; i2 = 0; j2 = 1; k2 = 1;
    } else if (x0 < z0) {
      i1 = 0; j1 = 1; k1 = 0; i2 = 0; j2 = 1; k2 = 1;
    } else {
      i1 = 0; j1 = 1; k1 = 0; i2 = 1; j2 = 1; k2 = 0;
    }

    const x1 = x0 - i1 + G3;
    const y1 = y0 - j1 + G3;
    const z1 = z0 - k1 + G3;
    const x2 = x0 - i2 + 2 * G3;
    const y2 = y0 - j2 + 2 * G3;
    const z2 = z0 - k2 + 2 * G3;
    const x3 = x0 - 1 + 3 * G3;
    const y3 = y0 - 1 + 3 * G3;
    const z3 = z0 - 1 + 3 * G3;

    const ii = i & 255;
    const jj = j & 255;
    const kk = k & 255;

    let n0 = 0, n1 = 0, n2 = 0, n3 = 0;

    let t0 = 0.6 - x0 * x0 - y0 * y0 - z0 * z0;
    if (t0 > 0) {
      t0 *= t0;
      const g = SIMPLEX_GRAD3[permMod12[ii + perm[jj + perm[kk]]]];
      n0 = t0 * t0 * (g[0] * x0 + g[1] * y0 + g[2] * z0);
    }

    let t1 = 0.6 - x1 * x1 - y1 * y1 - z1 * z1;
    if (t1 > 0) {
      t1 *= t1;
      const g = SIMPLEX_GRAD3[permMod12[ii + i1 + perm[jj + j1 + perm[kk + k1]]]];
      n1 = t1 * t1 * (g[0] * x1 + g[1] * y1 + g[2] * z1);
    }

    let t2 = 0.6 - x2 * x2 - y2 * y2 - z2 * z2;
    if (t2 > 0) {
      t2 *= t2;
      const g = SIMPLEX_GRAD3[permMod12[ii + i2 + perm[jj + j2 + perm[kk + k2]]]];
      n2 = t2 * t2 * (g[0] * x2 + g[1] * y2 + g[2] * z2);
    }

    let t3 = 0.6 - x3 * x3 - y3 * y3 - z3 * z3;
    if (t3 > 0) {
      t3 *= t3;
      const g = SIMPLEX_GRAD3[permMod12[ii + 1 + perm[jj + 1 + perm[kk + 1]]]];
      n3 = t3 * t3 * (g[0] * x3 + g[1] * y3 + g[2] * z3);
    }

    return 32 * (n0 + n1 + n2 + n3);
  };
}

export const HERO_SIMPLEX_NOISE = createGlyphworkSimplex3D(73);
export const HERO_FLOW_CHARS = ['.', '·', ':', '+', '*', '#'] as const;
export const HERO_FLOW_THRESHOLDS = [0.04, 0.12, 0.23, 0.37, 0.52, 0.67] as const;

export interface MigrationWaypoint {
  id: string;
  season: string;
  label: string;
  nx: number;
  ny: number;
  placement: 'top' | 'bottom';
}

export const WHALE_MIGRATION_WAYPOINTS: readonly MigrationWaypoint[] = [
  {
    id: 'summer',
    season: 'Summer',
    label: 'Summer · Polar',
    nx: 0.18,
    ny: 0.22,
    placement: 'top'
  },
  {
    id: 'autumn',
    season: 'Autumn',
    label: 'Autumn',
    nx: 0.65,
    ny: 0.26,
    placement: 'top'
  },
  {
    id: 'winter',
    season: 'Winter',
    label: 'Winter · Tropics',
    nx: 0.83,
    ny: 0.74,
    placement: 'bottom'
  },
  {
    id: 'spring',
    season: 'Spring',
    label: 'Spring',
    nx: 0.38,
    ny: 0.72,
    placement: 'bottom'
  }
];

// Evaluates the closed annual whale migration loop in normalized [0..1] chart coordinates
// u in [0, 1): 0.00 = Summer (Polar North-West) -> 0.25 = Autumn Transit -> 0.50 = Winter (Tropical South-East) -> 0.75 = Spring Return
export function evalMigrationLoopPoint(u: number): {
  nx: number;
  ny: number;
  tx: number;
  ty: number;
} {
  const angle = u * Math.PI * 2;
  const cosA = Math.cos(angle);
  const sinA = Math.sin(angle);

  // Tilted oceanic figure-oval spanning from high-latitude feeding grounds (top-left)
  // down to warm equatorial breeding waters (bottom-right) and returning along deep currents
  const nx = 0.5 + 0.34 * (-cosA) + 0.05 * Math.sin(angle * 2);
  const ny = 0.49 + 0.25 * (-cosA) - 0.21 * sinA + 0.03 * Math.cos(angle * 2);

  // Analytic derivative with respect to angle for unit tangent vector
  const dNx = 0.34 * sinA + 0.1 * Math.cos(angle * 2);
  const dNy = 0.25 * sinA - 0.21 * cosA - 0.06 * Math.sin(angle * 2);
  const len = Math.hypot(dNx, dNy) || 1;

  return {
    nx,
    ny,
    tx: dNx / len,
    ty: dNy / len
  };
}

export const HeroAsciiCanvas: React.FC<{ isInteractive?: boolean }> = React.memo(({ isInteractive = true }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const mouseRef = useRef<{
    targetX: number;
    targetY: number;
    smoothX: number;
    smoothY: number;
    active: boolean;
    strength: number;
  }>({
    targetX: 0.5,
    targetY: 0.5,
    smoothX: 0.5,
    smoothY: 0.5,
    active: false,
    strength: 0
  });
  const animFrameRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let flowTime = 2.4;
    let prevTimestamp = performance.now();
    let disposed = false;

    // Reusable cell buffers (zero per-frame allocations, eliminates random flickering)
    let bufCols = 0;
    let bufRows = 0;
    let accumBuf = new Float32Array(0);
    let routeMaskBuf = new Float32Array(0);
    let smoothBuf = new Float32Array(0);
    let charIdxBuf = new Int8Array(0);

    // Pre-sampled closed migration loop Lut (160 samples around the 12-month cycle)
    const LOOP_SAMPLES = 160;
    const loopNx = new Float32Array(LOOP_SAMPLES);
    const loopNy = new Float32Array(LOOP_SAMPLES);
    const loopTx = new Float32Array(LOOP_SAMPLES);
    const loopTy = new Float32Array(LOOP_SAMPLES);
    for (let i = 0; i < LOOP_SAMPLES; i++) {
      const pt = evalMigrationLoopPoint(i / LOOP_SAMPLES);
      loopNx[i] = pt.nx;
      loopNy[i] = pt.ny;
      loopTx[i] = pt.tx;
      loopTy[i] = pt.ty;
    }

    // Deterministic stratified seeds for background oceanic curl-field streamlines
    const STREAM_COLS = 10;
    const STREAM_ROWS = 6;
    const STREAM_COUNT = STREAM_COLS * STREAM_ROWS;
    const seedOffsets = new Float32Array(STREAM_COUNT * 3);
    let rng = 1337;
    for (let i = 0; i < STREAM_COUNT; i++) {
      rng = (Math.imul(rng, 1664525) + 1013904223) >>> 0;
      const jx = ((rng & 0xffff) / 0xffff - 0.5) * 0.68;
      rng = (Math.imul(rng, 1664525) + 1013904223) >>> 0;
      const jy = ((rng & 0xffff) / 0xffff - 0.5) * 0.68;
      rng = (Math.imul(rng, 1664525) + 1013904223) >>> 0;
      const phase = ((rng & 0xffff) / 0xffff) * Math.PI * 2;
      seedOffsets[i * 3] = jx;
      seedOffsets[i * 3 + 1] = jy;
      seedOffsets[i * 3 + 2] = phase;
    }

    // Offscreen static layers + glyph sprite atlas (zero ctx.font / fillText / measureText on DOM canvas per frame)
    const heroUnderlayCanvas = document.createElement('canvas');
    const heroOverlayCanvas = document.createElement('canvas');
    const heroGlyphAtlas = document.createElement('canvas');
    const GLYPH_TILE_W = 12;
    const GLYPH_TILE_H = 16;
    let glyphTilePxW = GLYPH_TILE_W;
    let glyphTilePxH = GLYPH_TILE_H;

    let canvasWidth = 0;
    let canvasHeight = 0;
    let isInViewport = true;
    let loopRunning = false;

    const rebuildStaticLayers = () => {
      const width = canvasWidth;
      const height = canvasHeight;
      if (width <= 0 || height <= 0) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      const pw = Math.max(1, Math.round(width * dpr));
      const ph = Math.max(1, Math.round(height * dpr));

      // 1. Glyph sprite atlas: 6 flow chars × 3 oceanic color tiers
      glyphTilePxW = Math.round(GLYPH_TILE_W * dpr);
      glyphTilePxH = Math.round(GLYPH_TILE_H * dpr);
      heroGlyphAtlas.width = HERO_FLOW_CHARS.length * glyphTilePxW;
      heroGlyphAtlas.height = 3 * glyphTilePxH;
      const gCtx = heroGlyphAtlas.getContext('2d');
      if (gCtx) {
        gCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
        gCtx.clearRect(0, 0, HERO_FLOW_CHARS.length * GLYPH_TILE_W, 3 * GLYPH_TILE_H);
        gCtx.font = '600 10.5px "JetBrains Mono", monospace';
        gCtx.textAlign = 'center';
        gCtx.textBaseline = 'middle';
        const tierColors = ['rgb(15, 30, 42)', 'rgb(42, 66, 82)', 'rgb(74, 98, 112)'];
        for (let tier = 0; tier < 3; tier++) {
          gCtx.fillStyle = tierColors[tier];
          const cy = tier * GLYPH_TILE_H + GLYPH_TILE_H * 0.5;
          for (let c = 0; c < HERO_FLOW_CHARS.length; c++) {
            gCtx.fillText(HERO_FLOW_CHARS[c], c * GLYPH_TILE_W + GLYPH_TILE_W * 0.5, cy);
          }
        }
      }

      // 2. Static hydrographic coordinate grid + latitude parallels underlay
      heroUnderlayCanvas.width = pw;
      heroUnderlayCanvas.height = ph;
      const uCtx = heroUnderlayCanvas.getContext('2d');
      if (uCtx) {
        uCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
        uCtx.clearRect(0, 0, width, height);
        uCtx.strokeStyle = 'rgba(23, 23, 23, 0.035)';
        uCtx.lineWidth = 1;
        const gridStep = 32;
        uCtx.beginPath();
        for (let x = gridStep; x < width; x += gridStep) {
          uCtx.moveTo(x, 0);
          uCtx.lineTo(x, height);
        }
        for (let y = gridStep; y < height; y += gridStep) {
          uCtx.moveTo(0, y);
          uCtx.lineTo(width, y);
        }
        uCtx.stroke();

        uCtx.save();
        uCtx.setLineDash([2, 5]);
        uCtx.strokeStyle = 'rgba(23, 23, 23, 0.08)';
        const latBands = [
          { yFrac: 0.22, label: '60°N POLAR' },
          { yFrac: 0.74, label: '15°N TROPICS' }
        ];
        uCtx.font = '500 7.5px "JetBrains Mono", monospace';
        uCtx.textAlign = 'left';
        uCtx.textBaseline = 'bottom';
        uCtx.fillStyle = 'rgba(45, 65, 75, 0.4)';
        for (const band of latBands) {
          const by = Math.round(height * band.yFrac) + 0.5;
          uCtx.beginPath();
          uCtx.moveTo(6, by);
          uCtx.lineTo(width - 6, by);
          uCtx.stroke();
          uCtx.fillText(band.label, 8, by - 2);
        }
        uCtx.restore();
      }

      // 3. Static directional chevrons + seasonal waypoint anchors & pills overlay
      heroOverlayCanvas.width = pw;
      heroOverlayCanvas.height = ph;
      const oCtx = heroOverlayCanvas.getContext('2d');
      if (oCtx) {
        oCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
        oCtx.clearRect(0, 0, width, height);

        const arrowPhases = [0.13, 0.38, 0.63, 0.88];
        for (const aPhase of arrowPhases) {
          const pt = evalMigrationLoopPoint(aPhase);
          const ax = pt.nx * width;
          const ay = pt.ny * height;
          const angle = Math.atan2(pt.ty * height, pt.tx * width);
          oCtx.save();
          oCtx.translate(ax, ay);
          oCtx.rotate(angle);
          oCtx.strokeStyle = 'rgba(23, 23, 23, 0.38)';
          oCtx.lineWidth = 1.1;
          oCtx.beginPath();
          oCtx.moveTo(-3, -2.5);
          oCtx.lineTo(2.5, 0);
          oCtx.lineTo(-3, 2.5);
          oCtx.stroke();
          oCtx.restore();
        }

        oCtx.font = '500 9px "JetBrains Mono", monospace';
        oCtx.textAlign = 'center';
        oCtx.textBaseline = 'middle';
        for (const wp of WHALE_MIGRATION_WAYPOINTS) {
          const wx = wp.nx * width;
          const wy = wp.ny * height;

          oCtx.strokeStyle = 'rgba(23, 23, 23, 0.35)';
          oCtx.lineWidth = 1;
          oCtx.beginPath();
          oCtx.arc(wx, wy, 3.5, 0, Math.PI * 2);
          oCtx.stroke();

          oCtx.fillStyle = '#171717';
          oCtx.beginPath();
          oCtx.arc(wx, wy, 1.8, 0, Math.PI * 2);
          oCtx.fill();

          const textMetrics = oCtx.measureText(wp.label);
          const padX = 5;
          const pillW = textMetrics.width + padX * 2;
          const pillH = 14;
          const pillX = Math.max(5, Math.min(width - pillW - 5, wx - pillW * 0.5));
          const pillY = wp.placement === 'top' ? wy - pillH - 4 : wy + 5;

          oCtx.fillStyle = 'rgba(255, 255, 255, 0.34)';
          oCtx.beginPath();
          if (oCtx.roundRect) {
            oCtx.roundRect(pillX, pillY, pillW, pillH, 2.5);
          } else {
            oCtx.rect(pillX, pillY, pillW, pillH);
          }
          oCtx.fill();
          oCtx.strokeStyle = 'rgba(23, 23, 23, 0.12)';
          oCtx.lineWidth = 0.75;
          oCtx.stroke();

          oCtx.fillStyle = '#171717';
          oCtx.fillText(wp.label, pillX + pillW * 0.5, pillY + pillH * 0.5 + 0.5);
        }
      }
    };

    const handleResize = () => {
      const rect = canvas.getBoundingClientRect();
      canvasWidth = rect.width;
      canvasHeight = rect.height;
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = Math.max(1, Math.round(canvasWidth * dpr));
      canvas.height = Math.max(1, Math.round(canvasHeight * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      rebuildStaticLayers();
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    const resizeObs =
      typeof ResizeObserver !== 'undefined'
        ? new ResizeObserver(() => {
            handleResize();
          })
        : null;
    if (resizeObs) resizeObs.observe(canvas);
    document.fonts?.ready
      .then(() => {
        if (!disposed) {
          rebuildStaticLayers();
          if (prefersReducedMotion || !loopRunning) renderFrame(performance.now(), true);
        }
      })
      .catch(() => undefined);

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      if (rect.width <= 0 || rect.height <= 0) return;
      mouseRef.current.targetX = (e.clientX - rect.left) / rect.width;
      mouseRef.current.targetY = (e.clientY - rect.top) / rect.height;
      mouseRef.current.active = true;
    };

    const handleMouseLeave = () => {
      mouseRef.current.active = false;
    };

    if (isInteractive) {
      canvas.addEventListener('mousemove', handleMouseMove);
      canvas.addEventListener('mouseleave', handleMouseLeave);
    }

    // Divergence-free CURL_FLUID streamfunction adapted from glyphwork/flowfield.py
    const sampleStreamPotential = (nx: number, ny: number, t: number): number => {
      const oct1 = HERO_SIMPLEX_NOISE(nx * 1.25 - t * 0.1, ny * 1.65, t * 0.14) * 0.72;
      const oct2 = HERO_SIMPLEX_NOISE(nx * 2.55 - t * 0.17, ny * 3.1 + 4.2, t * 0.22) * 0.24;
      const drift = ny * 0.52 + Math.sin(ny * Math.PI * 1.4 - t * 0.18) * 0.08;

      let cursorPotential = 0;
      const m = mouseRef.current;
      if (m.strength > 0.005) {
        const dx = nx - m.smoothX;
        const dy = (ny - m.smoothY) * 0.65;
        const d2 = dx * dx + dy * dy;
        cursorPotential = m.strength * 0.16 * Math.exp(-d2 / 0.045);
      }

      return oct1 + oct2 + drift + cursorPotential;
    };

    const sampleCurlVector = (nx: number, ny: number, t: number): [number, number] => {
      const eps = 0.006;
      const dPsiDx =
        (sampleStreamPotential(nx + eps, ny, t) - sampleStreamPotential(nx - eps, ny, t)) /
        (2 * eps);
      const dPsiDy =
        (sampleStreamPotential(nx, ny + eps, t) - sampleStreamPotential(nx, ny - eps, t)) /
        (2 * eps);
      const vx = dPsiDy;
      const vy = -dPsiDx * 0.68;
      const mag = Math.hypot(vx, vy) || 1;
      const speed = 0.55 + 0.45 * Math.min(1.6, mag);
      return [(vx / mag) * speed, (vy / mag) * speed];
    };

    // Sub-cell bilinear density splat into accumulation buffer (and optional migration corridor mask)
    const splatBilinear = (
      gx: number,
      gy: number,
      energy: number,
      cols: number,
      rows: number,
      isRouteCorridor = false
    ) => {
      const c0 = Math.floor(gx);
      const r0 = Math.floor(gy);
      if (c0 < -1 || c0 >= cols || r0 < -1 || r0 >= rows) return;
      const fx = gx - c0;
      const fy = gy - r0;

      const w00 = (1 - fx) * (1 - fy) * energy;
      const w10 = fx * (1 - fy) * energy;
      const w01 = (1 - fx) * fy * energy;
      const w11 = fx * fy * energy;

      if (c0 >= 0 && r0 >= 0) {
        const i = r0 * cols + c0;
        accumBuf[i] += w00;
        if (isRouteCorridor) routeMaskBuf[i] += w00;
      }
      if (c0 + 1 < cols && c0 + 1 >= 0 && r0 >= 0) {
        const i = r0 * cols + (c0 + 1);
        accumBuf[i] += w10;
        if (isRouteCorridor) routeMaskBuf[i] += w10;
      }
      if (c0 >= 0 && r0 + 1 < rows && r0 + 1 >= 0) {
        const i = (r0 + 1) * cols + c0;
        accumBuf[i] += w01;
        if (isRouteCorridor) routeMaskBuf[i] += w01;
      }
      if (c0 + 1 < cols && c0 + 1 >= 0 && r0 + 1 < rows && r0 + 1 >= 0) {
        const i = (r0 + 1) * cols + (c0 + 1);
        accumBuf[i] += w11;
        if (isRouteCorridor) routeMaskBuf[i] += w11;
      }
    };

    const renderFrame = (now: number, initialWarmup = false) => {
      loopRunning = false;
      const dt = Math.min(0.05, Math.max(0.001, (now - prevTimestamp) / 1000));
      prevTimestamp = now;

      const width = canvasWidth;
      const height = canvasHeight;
      const isVisible = width > 0 && height > 0;

      if (!prefersReducedMotion && !initialWarmup && isVisible && isInViewport) {
        flowTime += dt * 0.42;
      }

      const m = mouseRef.current;
      m.smoothX += (m.targetX - m.smoothX) * 0.08;
      m.smoothY += (m.targetY - m.smoothY) * 0.08;
      m.strength += ((m.active ? 1 : 0) - m.strength) * 0.07;

      if (isVisible && (isInViewport || initialWarmup)) {
        // Transparent background so the ocean & whale canvas remains visible behind the corridor
        ctx.clearRect(0, 0, width, height);

        // Blit static hydrographic grid & latitude parallels in 1 call
        if (heroUnderlayCanvas.width > 0) {
          ctx.drawImage(heroUnderlayCanvas, 0, 0, width, height);
        }

        const cellW = 7.6;
        const cellH = 10.8;
        const cols = Math.max(8, Math.floor(width / cellW));
        const rows = Math.max(6, Math.floor(height / cellH));
        const totalCells = cols * rows;

        if (cols !== bufCols || rows !== bufRows) {
          bufCols = cols;
          bufRows = rows;
          accumBuf = new Float32Array(totalCells);
          routeMaskBuf = new Float32Array(totalCells);
          smoothBuf = new Float32Array(totalCells);
          charIdxBuf = new Int8Array(totalCells).fill(-1);
        } else {
          accumBuf.fill(0);
          routeMaskBuf.fill(0);
        }

        // 1. Ambient curl-field oceanic streamlines (soft background water movement)
        const stepsPerCurve = 42;
        const stepCells = 0.68;

        for (let sIdx = 0; sIdx < STREAM_COUNT; sIdx++) {
          const sCol = sIdx % STREAM_COLS;
          const sRow = Math.floor(sIdx / STREAM_COLS);
          const jx = seedOffsets[sIdx * 3];
          const jy = seedOffsets[sIdx * 3 + 1];
          const phase = seedOffsets[sIdx * 3 + 2];

          const baseNx = -0.12 + ((sCol + 0.5 + jx) / STREAM_COLS) * 1.16;
          const baseNy = 0.04 + ((sRow + 0.5 + jy) / STREAM_ROWS) * 0.92;

          let gx = baseNx * cols;
          let gy = baseNy * rows;

          const layerWeight = sIdx % 3 === 0 ? 0.19 : sIdx % 3 === 1 ? 0.14 : 0.1;

          for (let step = 0; step < stepsPerCurve; step++) {
            const u = step / (stepsPerCurve - 1);
            const taper = Math.sin(Math.PI * u);
            const wave = 0.5 + 0.5 * Math.sin(step * 0.2 - flowTime * 1.8 + phase);
            const pulse = 0.35 + 0.65 * wave;

            splatBilinear(gx - 0.5, gy - 0.5, taper * pulse * layerWeight, cols, rows, false);

            const nx = gx / cols;
            const ny = gy / rows;
            const [vx1, vy1] = sampleCurlVector(nx, ny, flowTime);
            const midGx = gx + vx1 * stepCells * 0.5;
            const midGy = gy + vy1 * stepCells * 0.5;
            const [vx2, vy2] = sampleCurlVector(midGx / cols, midGy / rows, flowTime);

            gx += vx2 * stepCells;
            gy += vy2 * stepCells;
          }
        }

        // 2. Primary Annual Whale Migration Corridor (high-density ASCII current loop + directional pulses)
        // A whale pod position (`podPhase`) completes one full annual cycle every ~14 seconds
        const podPhase = (flowTime * 0.068) % 1;

        for (let i = 0; i < LOOP_SAMPLES; i++) {
          const u = i / LOOP_SAMPLES;
          const nx = loopNx[i];
          const ny = loopNy[i];
          const tx = loopTx[i];
          const ty = loopTy[i];
          // Normal vector perpendicular to the migration path
          const px = -ty;
          const py = tx;

          // Subtle organic curl breathing along the corridor
          const noiseDisp = HERO_SIMPLEX_NOISE(nx * 3.2, ny * 3.2, flowTime * 0.25) * 0.012;
          const cx = (nx + px * noiseDisp) * cols - 0.5;
          const cy = (ny + py * noiseDisp) * rows - 0.5;

          // Directional traveling wave packets moving forward along the annual loop
          const waveAlong = 0.5 + 0.5 * Math.sin((u * 6 - flowTime * 0.55) * Math.PI * 2);

          // Distance behind the migrating whale pod for a luminous hydrographic wake
          let dPod = u - podPhase;
          if (dPod < 0) dPod += 1;
          // Wake is strongest right at the pod (dPod ~ 0.92..1.0 or 0.0) and trails behind
          const distBehind = 1 - dPod;
          const podWake = Math.exp(-(distBehind * distBehind) / 0.018);

          const coreEnergy = 0.36 + 0.26 * waveAlong + 0.55 * podWake;

          // Splat core spine of the migration corridor + flanking current filaments
          splatBilinear(cx, cy, coreEnergy, cols, rows, true);
          splatBilinear(
            cx + px * 0.85,
            cy + py * 0.65,
            coreEnergy * 0.52,
            cols,
            rows,
            true
          );
          splatBilinear(
            cx - px * 0.85,
            cy - py * 0.65,
            coreEnergy * 0.52,
            cols,
            rows,
            true
          );
        }

        // 3. Render density-mapped ASCII characters (. · : + * #) via pre-baked sprite atlas
        const offsetX = (width - cols * cellW) * 0.5;
        const offsetY = (height - rows * cellH) * 0.5;
        const lerpFactor = initialWarmup || prefersReducedMotion ? 1.0 : 0.22;
        const hyst = 0.014;

        for (let r = 0; r < rows; r++) {
          const py = offsetY + r * cellH + cellH * 0.5 - GLYPH_TILE_H * 0.5;
          for (let c = 0; c < cols; c++) {
            const idx = r * cols + c;
            const target = 1 - Math.exp(-accumBuf[idx] * 1.65);
            const val = smoothBuf[idx] + (target - smoothBuf[idx]) * lerpFactor;
            smoothBuf[idx] = val;

            let cIdx = charIdxBuf[idx];
            if (val < HERO_FLOW_THRESHOLDS[0] - (cIdx >= 0 ? hyst : 0)) {
              cIdx = -1;
            } else {
              let desired = 0;
              for (let t = HERO_FLOW_THRESHOLDS.length - 1; t >= 0; t--) {
                if (val >= HERO_FLOW_THRESHOLDS[t]) {
                  desired = t;
                  break;
                }
              }
              if (cIdx < 0) {
                cIdx = desired;
              } else if (desired > cIdx && val >= HERO_FLOW_THRESHOLDS[desired] + hyst) {
                cIdx = desired;
              } else if (desired < cIdx && val < HERO_FLOW_THRESHOLDS[cIdx] - hyst) {
                cIdx = desired;
              }
            }
            charIdxBuf[idx] = cIdx;

            if (cIdx < 0) continue;

            const px = offsetX + c * cellW + cellW * 0.5 - GLYPH_TILE_W * 0.5;
            const normAlpha = Math.min(1, Math.max(0, (val - 0.03) / 0.72));
            const isCorridor = routeMaskBuf[idx] > 0.12;

            let tierRow: number;
            let a: number;
            if (cIdx >= 4 || isCorridor) {
              tierRow = 0;
              a = isCorridor ? Math.min(1, 0.72 + normAlpha * 0.28) : 0.78 + normAlpha * 0.2;
            } else if (cIdx >= 2) {
              tierRow = 1;
              a = 0.44 + normAlpha * 0.36;
            } else {
              tierRow = 2;
              a = 0.2 + normAlpha * 0.28;
            }

            ctx.globalAlpha = a;
            ctx.drawImage(
              heroGlyphAtlas,
              cIdx * glyphTilePxW,
              tierRow * glyphTilePxH,
              glyphTilePxW,
              glyphTilePxH,
              px,
              py,
              GLYPH_TILE_W,
              GLYPH_TILE_H
            );
          }
        }
        ctx.globalAlpha = 1;

        // 4 & 5. Blit static directional chevrons + seasonal waypoint anchors & pills in 1 call
        if (heroOverlayCanvas.width > 0) {
          ctx.drawImage(heroOverlayCanvas, 0, 0, width, height);
        }

        // 6. Draw Live Migrating Whale Pod Beacon traveling along the annual route
        const podPt = evalMigrationLoopPoint(podPhase);
        const podX = podPt.nx * width;
        const podY = podPt.ny * height;
        const pulseRadius = 5 + 3 * (0.5 + 0.5 * Math.sin(flowTime * 4.2));

        ctx.strokeStyle = 'rgba(182, 197, 176, 0.75)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(podX, podY, pulseRadius, 0, Math.PI * 2);
        ctx.stroke();

        ctx.fillStyle = '#171717';
        ctx.beginPath();
        ctx.arc(podX, podY, 3, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#B6C5B0';
        ctx.beginPath();
        ctx.arc(podX, podY, 1.2, 0, Math.PI * 2);
        ctx.fill();
      }

      if (!prefersReducedMotion && !initialWarmup && isVisible && isInViewport) {
        loopRunning = true;
        animFrameRef.current = requestAnimationFrame((ts) => renderFrame(ts, false));
      }
    };

    const startLoopIfNeeded = () => {
      if (!prefersReducedMotion && !loopRunning && isInViewport && canvasWidth > 0 && canvasHeight > 0) {
        loopRunning = true;
        prevTimestamp = performance.now();
        animFrameRef.current = requestAnimationFrame((ts) => renderFrame(ts, false));
      }
    };

    const io =
      typeof IntersectionObserver !== 'undefined'
        ? new IntersectionObserver(
            (entries) => {
              for (const entry of entries) {
                isInViewport = entry.isIntersecting;
              }
              if (isInViewport) startLoopIfNeeded();
            },
            { rootMargin: '120px 0px 120px 0px', threshold: 0 }
          )
        : null;
    if (io) io.observe(canvas);

    // Render initial settled state immediately
    renderFrame(performance.now(), true);
    startLoopIfNeeded();

    return () => {
      disposed = true;
      window.removeEventListener('resize', handleResize);
      if (resizeObs) resizeObs.disconnect();
      if (io) io.disconnect();
      if (isInteractive) {
        canvas.removeEventListener('mousemove', handleMouseMove);
        canvas.removeEventListener('mouseleave', handleMouseLeave);
      }
      cancelAnimationFrame(animFrameRef.current);
    };
  }, [isInteractive]);

  return (
    <div className="relative w-full h-full overflow-hidden select-none pointer-events-auto">
      <canvas ref={canvasRef} className="w-full h-full block" />
    </div>
  );
});

export interface TiltCardProps {
  children: React.ReactNode;
  className?: string;
  intensity?: number;
}

export const TiltCard: React.FC<TiltCardProps> = ({ children, className = '', intensity = 5.5 }) => {
  const cardRef = useRef<HTMLDivElement | null>(null);
  const [rotate, setRotate] = useState({ x: 0, y: 0 });
  const [glare, setGlare] = useState({ x: 50, y: 50, opacity: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const normX = (x / rect.width - 0.5) * 2;
    const normY = (y / rect.height - 0.5) * 2;

    setRotate({ x: -normY * intensity, y: normX * intensity });
    setGlare({ x: (x / rect.width) * 100, y: (y / rect.height) * 100, opacity: 1 });
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setRotate({ x: 0, y: 0 });
    setGlare((prev) => ({ ...prev, opacity: 0 }));
    setIsHovered(false);
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: `perspective(1200px) rotateX(${rotate.x}deg) rotateY(${rotate.y}deg) scale3d(${
          isHovered ? 1.006 : 1
        }, ${isHovered ? 1.006 : 1}, 1)`,
        transformStyle: 'preserve-3d',
        transition: isHovered ? 'transform 120ms ease-out' : 'transform 500ms cubic-bezier(0.16, 1, 0.3, 1)'
      }}
      className={`relative will-change-transform ${className}`}
    >
      <div
        className="absolute inset-0 pointer-events-none z-10 transition-opacity duration-300 overflow-hidden"
        style={{
          opacity: glare.opacity,
          background: `radial-gradient(circle 380px at ${glare.x}% ${glare.y}%, rgba(182, 197, 176, 0.38), rgba(23, 23, 23, 0.03) 45%, transparent 75%)`
        }}
      >
        <div
          className="w-full h-full opacity-25"
          style={{ backgroundImage: 'radial-gradient(#171717 0.75px, transparent 0.75px)', backgroundSize: '12px 12px' }}
        />
      </div>
      {children}
    </div>
  );
};
