import React, { useEffect, useRef } from 'react';
import { AmbientWhaleLayer } from './AmbientWhaleLayer';
import { createAsciiJellyfishField } from './asciiOceanLife';
import { playSonarPing, setSoundDepth } from './decodeAudio';
import { createGlyphBatchGL } from './glyphBatchGL';
import { MAX_PINGS, arrivalTime, echoStrength, isOpenWaterClick, pingRadius, pingStrength } from './sonarPing';
import { waterShade } from './terminalMotion';
import {
  applyAbyssPalette,
  applyAbyssWash,
  globeScrollGeometry,
  globeScrollProgress,
  inkMixFromAbyss
} from './abyssPalette';
import {
  READING_WHALE_ALPHA,
  ambientWhalesLive,
  diveWake,
  directWhales,
  migrationRunway,
  readingZones,
  smoothStepRange,
  whaleDirection,
  type Lane
} from './oceanDirection';
import {
  cameraAt,
  crestsAt,
  densityAt,
  earthToLane,
  migrationAt,
  headY,
  oceanHit,
  PLANET_R,
  projectLane,
  seaBaseAt,
  seaStateAt,
  spineAlongLane,
  stagesAt,
  strokeAt,
  travelAt,
  TRAIL_FROM,
  whaleWake,
  WHALES,
  type Camera,
  type Projected,
  type V3 as SceneV3
} from './migrationScene';

export interface AsciiWhaleBackgroundProps {
  mode: 'ambient' | 'focus' | 'off';
}

export const AsciiWhaleBackground: React.FC<AsciiWhaleBackgroundProps> = React.memo(({ mode }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  // The whale tiles' WebGL layer and the 2D layer drawn above it (sonar echoes, foreground jellyfish)
  const glCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const overCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const mouseRef = useRef<{ x: number; y: number; active: boolean }>({ x: 0.5, y: 0.5, active: false });
  const scrollMotionRef = useRef<{
    targetScrollY: number;
    smoothScrollY: number;
    prevSmoothScrollY: number;
    velocity: number;
    direction: 1 | -1; // 1 = down (vers le bas), -1 = up (vers le haut)
    dirBlend: number;  // continuous -1..+1 vertical orientation blend (zero 1-frame snap)
    activity: number;  // smooth 0..1 scroll activity envelope
    idleSide: 1 | -1;  // horizontal orientation when idle
  }>({
    targetScrollY: typeof window !== 'undefined' ? window.scrollY : 0,
    smoothScrollY: typeof window !== 'undefined' ? window.scrollY : 0,
    prevSmoothScrollY: typeof window !== 'undefined' ? window.scrollY : 0,
    velocity: 0,
    direction: 1,
    dirBlend: 1,
    activity: 0,
    idleSide: 1
  });

  useEffect(() => {
    if (mode === 'off') return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let animId = 0;
    let time = 0;
    let lastFrameTime = performance.now();

    const cellSize = 10;
    const oceanCell = 16;
    const isFocus = mode === 'focus';
    const masterAlpha = isFocus ? 0.96 : 0.32;

    // Ordered density glyphs for the mosaic ASCII tiles & generative ocean surface
    const GLYPHS = ['.', ':', '-', '=', '+', '*', 'x', '#', '%', '8', '@', 'M', 'W'];
    const NUM_GLYPHS = GLYPHS.length;
    const OCEAN_GLYPHS = ['·', '.', ':', '-', '~', '=', '+', '*', '#', '@'];
    const NUM_OCEAN_GLYPHS = OCEAN_GLYPHS.length;
    // Migration scene glyphs, faint to dense: 0 '·' 1 '.' 2 ':' 3 '-' 4 '~' 5 '+' 6 '*'
    const SPHERE_GLYPHS = ['·', '.', ':', '-', '~', '+', '*'];
    // Engraved contour strokes, indexed by CONTOUR_* below
    const CONTOUR_GLYPHS = ['-', '|', '/', '\\'];
    const CONTOUR_FLAT = 0;
    const CONTOUR_END = 1;
    const CONTOUR_RISE = 2;
    const CONTOUR_FALL = 3;

    // ------------------------------------------------------------------------
    // 1. PRE-BAKED SPRITE ATLAS FOR WHALE MOSAIC TILES, HALO & OCEAN SHADER GLYPHS
    // ------------------------------------------------------------------------
    // Rows 0..4: Oceanic-integrated whale mosaic tiles
    // In ambient mode, use translucent paper-slate wash tones (never pitch-black blocks)
    // so dark website text floating above is always 100% crisp and readable.
    const atlasScale = Math.min(window.devicePixelRatio || 1, 2);
    const tilePx = cellSize * atlasScale;
    const atlasCanvas = document.createElement('canvas');
    atlasCanvas.width = NUM_GLYPHS * tilePx;
    // Rows 0..9: legacy whale, halo & ocean tiers. Rows 10..14: whale deep-blue palette.
    // Rows 15..17: fish school ink (glyph only). Row 18: open-mouth interior (baleen).
    // Rows 19..21: abyss ocean tiers — pale teal / blue-grey / forest-green glyphs for dark water.
    // Rows 22..23: migration scene — the globe's graticule navy (water, trails, lattice) and land ink.
    // Row 24: the whales' engraved contour — edge strokes in the dorsal navy.
    atlasCanvas.height = 25 * tilePx;
    const aCtx = atlasCanvas.getContext('2d');

    if (aCtx) {
      aCtx.scale(atlasScale, atlasScale);
      aCtx.font = 'bold 8.5px "JetBrains Mono", monospace';
      aCtx.textAlign = 'center';
      aCtx.textBaseline = 'middle';

      const tilePad = 1.1;
      const tileSize = cellSize - tilePad;

      // Restrained oceanic-editorial palette
      // Focus mode: deep midnight contrast
      // Ambient mode: soft luminous aquatic slate wash (guarantees zero dark-on-dark text clashes)
      const styles = isFocus
        ? [
            { r: 182, g: 198, b: 198, a: masterAlpha * 0.4, lightText: false },  // Ventral sea-light
            { r: 112, g: 132, b: 142, a: masterAlpha * 0.54, lightText: false }, // Blue-gray
            { r: 60, g: 80, b: 94, a: masterAlpha * 0.68, lightText: true },     // Slate midtone
            { r: 34, g: 50, b: 64, a: masterAlpha * 0.76, lightText: true },     // Midnight blue-slate
            { r: 18, g: 26, b: 33, a: masterAlpha * 0.9, lightText: true }       // Abyssal dorsal
          ]
        : [
            { r: 210, g: 220, b: 222, a: masterAlpha * 0.35, lightText: false }, // Soft sea-mist
            { r: 188, g: 200, b: 205, a: masterAlpha * 0.48, lightText: false }, // Blue-gray wash
            { r: 162, g: 178, b: 184, a: masterAlpha * 0.60, lightText: false }, // Oceanic slate tint
            { r: 140, g: 156, b: 164, a: masterAlpha * 0.70, lightText: false }, // Deeper slate tint
            { r: 118, g: 136, b: 144, a: masterAlpha * 0.80, lightText: false }  // Muted dorsal tone (never pitch black)
          ];

      for (let sIdx = 0; sIdx < styles.length; sIdx++) {
        const st = styles[sIdx];
        const py = sIdx * cellSize;
        for (let gIdx = 0; gIdx < NUM_GLYPHS; gIdx++) {
          const px = gIdx * cellSize;
          aCtx.fillStyle = `rgba(${st.r}, ${st.g}, ${st.b}, ${st.a.toFixed(3)})`;
          aCtx.fillRect(px + tilePad * 0.5, py + tilePad * 0.5, tileSize, tileSize);

          if (st.lightText) {
            aCtx.fillStyle = `rgba(242, 245, 245, ${Math.min(1, st.a * 0.96).toFixed(3)})`;
          } else {
            aCtx.fillStyle = isFocus
              ? `rgba(20, 32, 42, ${Math.min(1, st.a * 1.18).toFixed(3)})`
              : `rgba(32, 48, 56, ${Math.min(0.68, st.a * 1.05).toFixed(3)})`;
          }
          aCtx.fillText(GLYPHS[gIdx], px + cellSize * 0.5, py + cellSize * 0.5 + 0.5);
        }
      }

      // Row 5: Halo border stamps (0: '.', 1: ':', 2: '+')
      const haloChars = ['.', ':', '+'];
      const haloAlphas = isFocus
        ? [masterAlpha * 0.16, masterAlpha * 0.26, masterAlpha * 0.38]
        : [masterAlpha * 0.12, masterAlpha * 0.20, masterAlpha * 0.28];
      const pyHalo = 5 * cellSize;
      for (let hIdx = 0; hIdx < 3; hIdx++) {
        const px = hIdx * cellSize;
        const ha = haloAlphas[hIdx];
        if (hIdx >= 1) {
          aCtx.fillStyle = `rgba(138, 156, 162, ${(ha * 0.38).toFixed(3)})`;
          aCtx.fillRect(px + 1.5, pyHalo + 1.5, cellSize - 3, cellSize - 3);
        }
        aCtx.fillStyle = `rgba(34, 52, 62, ${(ha * 0.85).toFixed(3)})`;
        aCtx.fillText(haloChars[hIdx], px + cellSize * 0.5, pyHalo + cellSize * 0.5 + 0.5);
      }

      // Rows 6..9: Pure typographic ocean shader characters (living typographic water)
      aCtx.font = '500 9px "JetBrains Mono", monospace';
      const oceanTiers = [
        { row: 6, r: 78, g: 122, b: 128, baseA: isFocus ? 0.52 : 0.24 }, // Muted turquoise sunbeam crest
        { row: 7, r: 54, g: 78, b: 94, baseA: isFocus ? 0.46 : 0.20 },   // Desaturated blue-gray current
        { row: 8, r: 38, g: 58, b: 70, baseA: isFocus ? 0.48 : 0.18 },   // Soft blue-slate swell (never dark black)
        { row: 9, r: 68, g: 82, b: 88, baseA: isFocus ? 0.26 : 0.12 }    // Restrained deep-dossier current
      ];
      for (let tIdx = 0; tIdx < oceanTiers.length; tIdx++) {
        const tier = oceanTiers[tIdx];
        const py = tier.row * cellSize;
        for (let gIdx = 0; gIdx < NUM_OCEAN_GLYPHS; gIdx++) {
          const px = gIdx * cellSize;
          const densityAlpha = tier.baseA * (0.42 + (gIdx / (NUM_OCEAN_GLYPHS - 1)) * 0.58);
          aCtx.fillStyle = `rgba(${tier.r}, ${tier.g}, ${tier.b}, ${densityAlpha.toFixed(3)})`;
          aCtx.fillText(OCEAN_GLYPHS[gIdx], px + cellSize * 0.5, py + cellSize * 0.5 + 0.5);
        }
      }

      // Rows 10..14: WHALES — deep ocean-blue palette (ventral → dorsal), shared by both whales.
      // Tile fills stop at a mid-tone slate blue so that dark page text crossing the whale keeps
      // roughly 5:1 contrast; the dark navy glyphs carry the anatomy and make the silhouette read
      // instantly against the off-white paper.
      aCtx.font = 'bold 8.5px "JetBrains Mono", monospace';
      const mainWhaleStyles = [
        // Fills kept to a faint wash so the glyphs, not the squares, draw the animal
        { fill: [176, 192, 204], fillA: 0.18, ink: [34, 56, 78], inkA: 0.66 },  // Ventral sea-light
        { fill: [138, 160, 178], fillA: 0.22, ink: [28, 48, 70], inkA: 0.78 },  // Blue-grey flank
        { fill: [100, 126, 150], fillA: 0.26, ink: [20, 40, 62], inkA: 0.88 },  // Slate blue
        { fill: [72, 100, 128], fillA: 0.3, ink: [14, 32, 54], inkA: 0.94 },    // Deep slate navy
        { fill: [52, 78, 104], fillA: 0.34, ink: [10, 26, 46], inkA: 1 }        // Dorsal navy
      ];
      for (let sIdx = 0; sIdx < mainWhaleStyles.length; sIdx++) {
        const st = mainWhaleStyles[sIdx];
        const py = (10 + sIdx) * cellSize;
        for (let gIdx = 0; gIdx < NUM_GLYPHS; gIdx++) {
          const px = gIdx * cellSize;
          aCtx.fillStyle = `rgba(${st.fill[0]}, ${st.fill[1]}, ${st.fill[2]}, ${st.fillA})`;
          aCtx.fillRect(px + tilePad * 0.5, py + tilePad * 0.5, tileSize, tileSize);
          aCtx.fillStyle = `rgba(${st.ink[0]}, ${st.ink[1]}, ${st.ink[2]}, ${st.inkA})`;
          aCtx.fillText(GLYPHS[gIdx], px + cellSize * 0.5, py + cellSize * 0.5 + 0.5);
        }
      }

      // Rows 15..17: FISH SCHOOL — bold ocean-blue ink on a faint blue-grey wash, so a school
      // stands out clearly from the paler ocean texture while staying lighter than the whale.
      aCtx.font = 'bold 9.5px "JetBrains Mono", monospace';
      const fishInks = [
        { c: [30, 54, 80], a: 0.66, wash: 0.1 },
        { c: [20, 42, 68], a: 0.86, wash: 0.18 },
        { c: [12, 32, 56], a: 1.0, wash: 0.26 }
      ];
      for (let tIdx = 0; tIdx < fishInks.length; tIdx++) {
        const ink = fishInks[tIdx];
        const py = (15 + tIdx) * cellSize;
        for (let gIdx = 0; gIdx < NUM_GLYPHS; gIdx++) {
          const px = gIdx * cellSize;
          aCtx.fillStyle = `rgba(140, 164, 184, ${ink.wash})`;
          aCtx.fillRect(px + tilePad * 0.5, py + tilePad * 0.5, tileSize, tileSize);
          aCtx.fillStyle = `rgba(${ink.c[0]}, ${ink.c[1]}, ${ink.c[2]}, ${ink.a})`;
          aCtx.fillText(GLYPHS[gIdx], px + cellSize * 0.5, py + cellSize * 0.5 + 0.5);
        }
      }

      // Row 18: OPEN MOUTH INTERIOR — deep navy cavity with pale baleen-like fringe strokes
      aCtx.font = '500 9px "JetBrains Mono", monospace';
      const BALEEN = ['|', '!', ':', "'"];
      for (let bIdx = 0; bIdx < BALEEN.length; bIdx++) {
        const px = bIdx * cellSize;
        const py = 18 * cellSize;
        aCtx.fillStyle = 'rgba(20, 34, 52, 0.86)';
        aCtx.fillRect(px + tilePad * 0.5, py + tilePad * 0.5, tileSize, tileSize);
        aCtx.fillStyle = 'rgba(176, 194, 208, 0.78)';
        aCtx.fillText(BALEEN[bIdx], px + cellSize * 0.5, py + cellSize * 0.5 + 0.5);
      }

      // Rows 19..21: ABYSS OCEAN — pale, desaturated glyphs that read on near-black water
      aCtx.font = '500 9px "JetBrains Mono", monospace';
      const abyssTiers = [
        { row: 19, r: 122, g: 166, b: 156, baseA: 0.34 }, // Desaturated teal crest
        { row: 20, r: 146, g: 164, b: 172, baseA: 0.28 }, // Muted blue-grey current
        { row: 21, r: 88, g: 130, b: 108, baseA: 0.36 }   // Deep forest-green swell
      ];
      for (const tier of abyssTiers) {
        const py = tier.row * cellSize;
        for (let gIdx = 0; gIdx < NUM_OCEAN_GLYPHS; gIdx++) {
          const densityAlpha = tier.baseA * (0.42 + (gIdx / (NUM_OCEAN_GLYPHS - 1)) * 0.58);
          aCtx.fillStyle = `rgba(${tier.r}, ${tier.g}, ${tier.b}, ${densityAlpha.toFixed(3)})`;
          aCtx.fillText(OCEAN_GLYPHS[gIdx], gIdx * cellSize + cellSize * 0.5, py + cellSize * 0.5 + 0.5);
        }
      }

      // Rows 22..23: MIGRATION SCENE — the same inks the drawn globe uses (#1F3B57 lattice, #162633
      // land), glyph only; strength comes from globalAlpha.
      aCtx.font = '500 9px "JetBrains Mono", monospace';
      const sphereInks = [
        { row: 22, c: [31, 59, 87] },
        { row: 23, c: [22, 38, 51] }
      ];
      for (const ink of sphereInks) {
        aCtx.fillStyle = `rgb(${ink.c[0]}, ${ink.c[1]}, ${ink.c[2]})`;
        for (let gIdx = 0; gIdx < SPHERE_GLYPHS.length; gIdx++) {
          aCtx.fillText(SPHERE_GLYPHS[gIdx], gIdx * cellSize + cellSize * 0.5, ink.row * cellSize + cellSize * 0.5 + 0.5);
        }
      }

      // Row 24: ENGRAVED CONTOUR — the strokes that outline a swimming whale ('-' top and bottom
      // edges, '|' ends, '/' and '' slopes), on the flank's faint wash so the body stays whole
      aCtx.font = 'bold 9.5px "JetBrains Mono", monospace';
      for (let gIdx = 0; gIdx < CONTOUR_GLYPHS.length; gIdx++) {
        const px = gIdx * cellSize;
        const py = 24 * cellSize;
        aCtx.fillStyle = 'rgba(138, 160, 178, 0.16)';
        aCtx.fillRect(px + tilePad * 0.5, py + tilePad * 0.5, tileSize, tileSize);
        aCtx.fillStyle = 'rgba(10, 26, 46, 0.95)';
        aCtx.fillText(CONTOUR_GLYPHS[gIdx], px + cellSize * 0.5, py + cellSize * 0.5 + 0.5);
      }
    }

    // Offscreen static dot-grid canvas + quarter-res atmospheric water backdrop canvas
    const bgGridCanvas = document.createElement('canvas');
    const waterBackdropCanvas = document.createElement('canvas');
    const waterBackdropCtx = waterBackdropCanvas.getContext('2d');
    let backdropW = 0;
    let backdropH = 0;
    let lastBackdropDepth = -999;
    let backdropValid = false;

    // Pre-allocated Reusable Grid Buffers (zero GC allocations during animation!)
    let gridCols = 0;
    let gridRows = 0;
    let oceanCols = 0;
    let oceanRows = 0;
    let zBuf = new Float32Array(0);
    let lumBuf = new Float32Array(0);
    let toneBuf = new Float32Array(0);
    let occBuf = new Uint8Array(0);
    let haloBuf = new Uint8Array(0);
    // Fish school density raster (same cell grid as the whale) + list of touched cells
    let fishBuf = new Float32Array(0);
    let fishTouched = new Int32Array(0);
    // Reading-text proximity per whale cell (0 open water, 1 near a line, 2 behind a line)
    let readingBuf = new Uint8Array(0);
    // Migration scene: once-per-cell stamp and glyph queue
    let sceneStamp = new Uint32Array(0);
    let sceneQueue = new Int32Array(0);
    let sceneOrder = new Int32Array(0);

    // Pre-allocated 1D separable harmonic tables for the generative ocean shader (zero trig in inner loop)
    let colSin1 = new Float32Array(0);
    let colCos1 = new Float32Array(0);
    let colSin2 = new Float32Array(0);
    let colCos2 = new Float32Array(0);
    let colLight = new Float32Array(0);
    let rowSin1 = new Float32Array(0);
    let rowCos1 = new Float32Array(0);
    let rowSin2 = new Float32Array(0);
    let rowCos2 = new Float32Array(0);
    let rowDepth = new Float32Array(0);
    // Depth descent (Stage 5): finer third harmonic that emerges with depth + reading-column profile
    let colSin3 = new Float32Array(0);
    let colCos3 = new Float32Array(0);
    let rowSin3 = new Float32Array(0);
    let rowCos3 = new Float32Array(0);
    let colReading = new Float32Array(0);
    // Cached viewport & scrollable document geometry (updated on resize / ResizeObserver, zero layout reads in RAF)
    let viewW = typeof window !== 'undefined' ? window.innerWidth : 1440;
    let viewH = typeof window !== 'undefined' ? window.innerHeight : 900;
    let docScrollable = 1;
    let lastInkMix = -1;
    let lastWashAbyss = -1;

    // Precomputed LUT for Humpback Whale Body Half-Width (256 samples)
    const LUT_SIZE = 256;
    const BODY_WIDTH_LUT = new Float32Array(LUT_SIZE);
    for (let i = 0; i < LUT_SIZE; i++) {
      const u = i / (LUT_SIZE - 1);
      if (u < 0.18) {
        const t = u / 0.18;
        BODY_WIDTH_LUT[i] = 0.185 * Math.pow(Math.sin(t * Math.PI * 0.5), 0.58);
      } else if (u < 0.36) {
        const t = (u - 0.18) / 0.18;
        BODY_WIDTH_LUT[i] = 0.185 + 0.025 * Math.sin(t * Math.PI);
      } else if (u < 0.84) {
        const t = (u - 0.36) / 0.48;
        BODY_WIDTH_LUT[i] = 0.022 + 0.163 * Math.pow(Math.cos(t * Math.PI * 0.5), 1.45);
      } else {
        const t = (u - 0.84) / 0.16;
        BODY_WIDTH_LUT[i] = 0.022 * (1 - t * 0.65);
      }
    }
    const getBodyHalfWidthFast = (u: number): number => {
      const idx = Math.max(0, Math.min(LUT_SIZE - 1, (u * (LUT_SIZE - 1)) | 0));
      return BODY_WIDTH_LUT[idx];
    };

    // Side profile of a humpback (fractions of body length, head at u = 0): how far the back
    // rises above the spine and the belly hangs below it. A flat rostrum, the deep pleated throat,
    // the small dorsal fin on its hump, and the slender tail stock.
    const PROFILE_POINTS: readonly [number, number, number][] = [
      // u, dorsal, ventral
      [0.0, 0.008, 0.01],
      [0.03, 0.028, 0.036],
      [0.08, 0.05, 0.07],
      [0.14, 0.066, 0.095],
      [0.22, 0.08, 0.11],
      [0.32, 0.09, 0.113],
      [0.45, 0.09, 0.1],
      [0.56, 0.084, 0.08],
      [0.6, 0.088, 0.072],
      [0.635, 0.112, 0.066],
      [0.665, 0.09, 0.06],
      [0.7, 0.07, 0.052],
      [0.8, 0.042, 0.035],
      [0.88, 0.025, 0.022],
      [0.94, 0.016, 0.015],
      [1.0, 0.01, 0.01]
    ];
    const DORSAL_LUT = new Float32Array(LUT_SIZE);
    const VENTRAL_LUT = new Float32Array(LUT_SIZE);
    for (let i = 0, p = 0; i < LUT_SIZE; i++) {
      const u = i / (LUT_SIZE - 1);
      while (p < PROFILE_POINTS.length - 2 && u > PROFILE_POINTS[p + 1][0]) p++;
      const [u0, d0, v0] = PROFILE_POINTS[p];
      const [u1, d1, v1] = PROFILE_POINTS[p + 1];
      const t = Math.max(0, Math.min(1, (u - u0) / (u1 - u0)));
      const s = t * t * (3 - 2 * t);
      DORSAL_LUT[i] = d0 + (d1 - d0) * s;
      VENTRAL_LUT[i] = v0 + (v1 - v0) * s;
    }
    const profileAt = (lut: Float32Array, u: number) =>
      lut[Math.max(0, Math.min(LUT_SIZE - 1, (u * (LUT_SIZE - 1)) | 0))];

    interface WakeParticle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      age: number;
      maxAge: number;
      size: number;
      kind: 'vortex' | 'bubble';
    }
    const wakeParticles: WakeParticle[] = [];

    interface WhaleAgent {
      x: number;
      y: number;
      heading: number;
      turnRate: number;
      baseSpeed: number;
      scale: number;
      swimCycle: number;
      CycleSpeed: number;
      finCycle: number;
      smoothSwimRate: number;
      smoothWaveAmp: number;
      spineX: Float32Array;
      spineY: Float32Array;
      spineAngle: Float32Array;
      initialized: boolean;
      // Displayed pose during the migration: the swim blended onto the scene's, plus each
      // node's size on screen relative to the swim's (1 outside the migration)
      dispX: Float32Array;
      dispY: Float32Array;
      dispAngle: Float32Array;
      dispScale: Float32Array;
      /** Side-view turn: -1 just turned (drawn still facing the old way) → 1 settled. */
      turnS: number;
    }

    const SPINE_NODES = 64;
    /** Steepest climb or dive of a swimming whale (rad, ~20°): they travel, they do not stand. */
    const SWIM_PITCH_MAX = 0.35;
    /** Most any part of the body may angle away from the head's line (rad, ~17°). */
    const SIDE_BODY_BEND = 0.3;
    const createWhaleAgent = (scale: number, cycleOffset: number): WhaleAgent => ({
      x: 0,
      y: 0,
      heading: Math.PI * 0.5,
      turnRate: 0,
      baseSpeed: 1.55 * scale,
      scale,
      swimCycle: cycleOffset,
      CycleSpeed: 0.055 / Math.pow(scale, 0.35),
      finCycle: cycleOffset * 0.7,
      smoothSwimRate: 0.16,
      smoothWaveAmp: 0.024,
      spineX: new Float32Array(SPINE_NODES),
      spineY: new Float32Array(SPINE_NODES),
      spineAngle: new Float32Array(SPINE_NODES),
      initialized: false,
      dispX: new Float32Array(SPINE_NODES),
      dispY: new Float32Array(SPINE_NODES),
      dispAngle: new Float32Array(SPINE_NODES),
      dispScale: new Float32Array(SPINE_NODES).fill(1),
      turnS: 1
    });

    /** Seconds a whale takes to turn around, seen from the side. */
    const SIDE_TURN_SECONDS = 1.1;
    /**
     * Turning around in side view is a yaw, not a loop in the page's plane: the body is mirrored
     * about its middle at once, and the drawing (turnS) foreshortens it from the old facing,
     * through head-on, to the new one, so the whale is never seen standing on its tail.
     */
    const turnAround = (wh: WhaleAgent) => {
      const c = wh.spineX[SPINE_NODES >> 1];
      for (let k = 0; k < SPINE_NODES; k++) {
        wh.spineX[k] = 2 * c - wh.spineX[k];
        wh.spineAngle[k] = Math.PI - wh.spineAngle[k];
      }
      wh.x = wh.spineX[0];
      wh.heading = Math.PI - wh.heading;
      wh.turnRate = -wh.turnRate;
      wh.turnS = -1;
    };
    /** The drawn facing during a turn: -1 old facing … 1 new, never fully edge-on. */
    const sideTurnScale = (wh: WhaleAgent) => {
      const s = Math.sin(Math.max(-1, Math.min(1, wh.turnS)) * Math.PI * 0.5);
      return Math.abs(s) < 0.12 ? (s < 0 ? -0.12 : 0.12) : s;
    };

    const whales: WhaleAgent[] = [
      createWhaleAgent(1.0, 0),
      createWhaleAgent(0.58, 3.4)
    ];

    // Lightweight drifting ambient ASCII points (precomputed relative offsets)
    const ambientDots = Array.from({ length: 85 }, (_, idx) => ({
      nx: ((idx * 41 + 13) % 100) / 100,
      ny: ((idx * 67 + 29) % 100) / 100,
      speedX: ((idx % 2 === 0 ? 1 : -1) * (0.002 + (idx % 3) * 0.001)),
      glyphIdx: idx % 3 // 0: '.', 1: ':', 2: '+'
    }));
    let ambientOffsetY = 0;

    // The lead whale's wake while it dives into the Globe: its recent head path (viewport px),
    // drawn as the route's first stroke into the journey's first city
    const WAKE_POINTS = 80;
    const wakeX = new Float32Array(WAKE_POINTS);
    const wakeY = new Float32Array(WAKE_POINTS);
    let wakeCount = 0;
    /** The sonar's ink this frame (set when a ping is drawn, reused by its echoes). */
    let sonarInk = 'rgb(47, 72, 88)';

    // Marine snow (deterministic): position, parallax against the page (> 1: it passes faster
    // than the copy), slow sink (px/s), sideways sway, glyph and strength
    const MARINE_SNOW = Array.from({ length: 64 }, (_, i) => {
      const r = (k: number) => (((i + 1) * k) % 1000) / 1000;
      return {
        nx: r(617.3),
        ny: r(379.1),
        par: 1.15 + r(271.7) * 0.45,
        sink: 4 + r(143.9) * 7,
        sway: 3 + r(97.3) * 6,
        swayF: 0.2 + r(53.1) * 0.25,
        phase: r(811.7) * Math.PI * 2,
        glyph: ['.', '.', '·', '·', ',', ':'][(r(431.9) * 6) | 0],
        alpha: 0.38 + r(677.1) * 0.5
      };
    });

    // Anatomical ASCII jellyfish (3 species, 3 parallax depth planes).
    // Rendered by this component's single RAF loop through pre-baked glyph atlases
    // (see asciiOceanLife.ts) — no extra loop, no per-glyph fillText, no shadowBlur.
    const jellyfishField = createAsciiJellyfishField(atlasScale);
    // A jellyfish drifting behind reading text or the Globe fades with the share of it covered
    jellyfishField.setOcclusion((left, top, width, height) => {
      const pad = 16;
      let covered = 0;
      for (const r of readingZones.read()) {
        const ix = Math.min(left + width, r.left + r.width + pad) - Math.max(left, r.left - pad);
        const iy = Math.min(top + height, r.top + r.height + pad) - Math.max(top, r.top - pad);
        if (ix > 0 && iy > 0) covered += ix * iy;
      }
      const share = covered / Math.max(1, width * height);
      return share < 0.02 ? 1 : Math.max(0.06, 1 - share * 4);
    });
    let oceanLifeDisposed = false;
    // Re-bake glyph atlases once the web font is ready (first bake may use the fallback face)
    if (typeof document !== 'undefined' && document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => {
        if (oceanLifeDisposed) return;
        jellyfishField.rebake();
      });
    }
    // Smoothed cost (ms) of a whole frame and of the migration scene's field (diagnostics)
    const migrationStats = { frameMs: 0, sceneMs: 0 };
    (window as unknown as Record<string, unknown>).__oceanLife = {
      jellyfish: jellyfishField.stats,
      migration: migrationStats
    };

    // The whale tiles and halos (one cell each, the bulk of the frame's draw calls) go to a WebGL2
    // batch in a single instanced draw; what the 2D canvas drew after them moves to a 2D layer
    // above it, so the stacking is unchanged. Without WebGL2, or once its context is lost, every
    // layer stays on the 2D canvas exactly as before.
    const glCanvas = glCanvasRef.current;
    const overCanvas = overCanvasRef.current;
    const overCtx = overCanvas ? overCanvas.getContext('2d', { alpha: true }) : null;
    // Only the archived migration uses the old tile renderer. Ambient animals use the shared
    // 3D context, so there is no second WebGL whale engine running behind it.
    let glyphBatch = migrationRunway.height > 1 && glCanvas && overCtx ? createGlyphBatchGL(glCanvas, cellSize) : null;
    glyphBatch?.setAtlas(atlasCanvas, tilePx);

    const handleResize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      viewW = w;
      viewH = h;
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      glyphBatch?.resize(w, h, dpr);
      if (overCanvas && overCtx) {
        overCanvas.width = w * dpr;
        overCanvas.height = h * dpr;
        overCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
      }

      gridCols = Math.ceil(w / cellSize);
      gridRows = Math.ceil(h / cellSize);
      oceanCols = Math.ceil(w / oceanCell);
      oceanRows = Math.ceil(h / oceanCell);

      const total = gridCols * gridRows;
      zBuf = new Float32Array(total).fill(-999);
      lumBuf = new Float32Array(total);
      toneBuf = new Float32Array(total);
      occBuf = new Uint8Array(total);
      haloBuf = new Uint8Array(total);
      fishBuf = new Float32Array(total);
      fishTouched = new Int32Array(total);
      readingBuf = new Uint8Array(total);
      sceneStamp = new Uint32Array(total);
      sceneQueue = new Int32Array(total * 2);
      sceneOrder = new Int32Array(total);

      colSin1 = new Float32Array(oceanCols);
      colCos1 = new Float32Array(oceanCols);
      colSin2 = new Float32Array(oceanCols);
      colCos2 = new Float32Array(oceanCols);
      colLight = new Float32Array(oceanCols);
      rowSin1 = new Float32Array(oceanRows);
      rowCos1 = new Float32Array(oceanRows);
      rowSin2 = new Float32Array(oceanRows);
      rowCos2 = new Float32Array(oceanRows);
      rowDepth = new Float32Array(oceanRows);
      colSin3 = new Float32Array(oceanCols);
      colCos3 = new Float32Array(oceanCols);
      rowSin3 = new Float32Array(oceanRows);
      rowCos3 = new Float32Array(oceanRows);
      // Reading-column profile: the central text column stays calmer, margins carry the texture
      colReading = new Float32Array(oceanCols);
      for (let oc = 0; oc < oceanCols; oc++) {
        const nx = oc / Math.max(1, oceanCols);
        const t = Math.max(0, Math.min(1, (Math.abs(nx - 0.46) - 0.16) / 0.24));
        colReading[oc] = 0.7 + 0.3 * (t * t * (3 - 2 * t));
      }
      docScrollable = Math.max(1, document.documentElement.scrollHeight - h);

      // Pre-render subtle hydrographic dot matrix once on resize
      bgGridCanvas.width = w * dpr;
      bgGridCanvas.height = h * dpr;
      const bgCtx = bgGridCanvas.getContext('2d');
      if (bgCtx) {
        bgCtx.scale(dpr, dpr);
        bgCtx.fillStyle = isFocus ? 'rgba(22, 38, 51, 0.09)' : 'rgba(22, 38, 51, 0.042)';
        for (let r = 0; r < gridRows; r += 2) {
          const py = r * cellSize + cellSize * 0.5;
          for (let c = 0; c < gridCols; c += 2) {
            const px = c * cellSize + cellSize * 0.5;
            bgCtx.fillRect(px - 0.5, py - 0.5, 1, 1);
          }
        }
      }
      backdropW = Math.max(64, Math.ceil(w * 0.25));
      backdropH = Math.max(64, Math.ceil(h * 0.25));
      waterBackdropCanvas.width = backdropW;
      waterBackdropCanvas.height = backdropH;
      backdropValid = false;
    };

    handleResize();
    const layoutObserver = new ResizeObserver(handleResize);
    layoutObserver.observe(document.documentElement);
    const globeSection = document.getElementById('global');
    if (globeSection) layoutObserver.observe(globeSection);
    window.addEventListener('resize', handleResize);

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = e.clientX / Math.max(1, viewW);
      mouseRef.current.y = e.clientY / Math.max(1, viewH);
      mouseRef.current.active = true;
    };
    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    const handleScrollChange = () => {
      const currentY = window.scrollY;
      const dy = currentY - scrollMotionRef.current.targetScrollY;
      scrollMotionRef.current.targetScrollY = currentY;
      if (Math.abs(dy) > 0.25) {
        scrollMotionRef.current.direction = dy > 0 ? 1 : -1;
      }
    };

    const handleWheelDir = (e: WheelEvent) => {
      if (Math.abs(e.deltaY) > 0.5) {
        scrollMotionRef.current.direction = e.deltaY > 0 ? 1 : -1;
      }
    };

    window.addEventListener('scroll', handleScrollChange, { passive: true });
    window.addEventListener('wheel', handleWheelDir, { passive: true });

    // SONAR — a click in open water sends a ring outward from where it landed (see sonarPing.ts)
    const pings: { x: number; y: number; at: number }[] = [];
    const handleSonarClick = (e: MouseEvent) => {
      if (prefersReducedMotion || isFocus || e.button !== 0) return;
      if (!isOpenWaterClick(e.target, window.getSelection()?.toString() ?? '')) return;
      pings.push({ x: e.clientX, y: e.clientY, at: performance.now() / 1000 });
      if (pings.length > MAX_PINGS) pings.shift();
      playSonarPing();
    };
    window.addEventListener('click', handleSonarClick);

    // ------------------------------------------------------------------------
    // AUTONOMOUS SWIMMING (main whale only)
    // ------------------------------------------------------------------------
    // Whenever the visitor is not scrolling, the main whale keeps swimming:
    // phases chain into one another with no idle gap —
    //   wander   → glides toward a random waypoint (most common), with gentle
    //              speed variation and an occasional brief pause
    //   cruise   → crosses the screen and leaves beyond the edge it faces
    //   offscreen→ short moment out of sight, then re-enters from the opposite side
    //   return   → swims back into view, then continues exploring
    //   drift    → brief slow glide
    // `weight` blends steering & speed between the existing scroll/idle controller
    // (0) and the autonomous controller (1). Scrolling drives `weight` to 0 within
    // ~250ms; autonomy resumes ~0.6s after scrolling stops.
    type AutoPhase = 'rest' | 'wander' | 'cruise' | 'offscreen' | 'return' | 'drift';
    const rand = (min: number, max: number) => min + Math.random() * (max - min);
    const auto = {
      phase: 'rest' as AutoPhase,
      weight: 0,
      idleSeconds: 0,
      phaseTime: 0,
      phaseDuration: 0,
      dir: 1 as 1 | -1,
      targetXFrac: 0.5,
      targetYFrac: 0.5,
      targetSpeed: 0,
      curSpeed: 0,
      speedPhase: Math.random() * 10,
      pauseAt: -1,
      pauseLeft: 0,
      driftAngle: 0,
      // Lane anchor offsets: captured when scrolling takes over so the scroll lane target
      // starts where the whale actually is and relaxes back gradually (no sliding jump).
      offX: 0,
      offY: 0
    };

    const handBackToScroll = (wh: WhaleAgent, laneX: number, laneY: number) => {
      auto.offX = wh.x - laneX;
      auto.offY = wh.y - laneY;
      auto.phase = 'rest';
      auto.pauseAt = -1;
      auto.pauseLeft = 0;
    };

    const getMinUnderwaterYFrac = (_h?: number, _clearancePx = 0): number => {
      return 0.05; // Whales can reach the very top of the site
    };

    const startNextPhase = (wh: WhaleAgent, w: number, h: number) => {
      auto.phaseTime = 0;
      auto.pauseAt = -1;
      auto.pauseLeft = 0;
      const facing: 1 | -1 = Math.cos(wh.heading) >= 0 ? 1 : -1;
      const r = Math.random();

      if (whaleDirection.weight > 0.5) {
        // Composed stretch: short explorations around the lane, never across the type
        const lane = whaleDirection.lanes[0];
        const surfaceFrac = (whaleDirection.surfaceY + mainBodyLen * 0.3) / Math.max(1, h);
        auto.phase = r < 0.3 ? 'drift' : 'wander';
        auto.phaseDuration = auto.phase === 'drift' ? rand(1.6, 2.6) : rand(5, 8);
        auto.targetXFrac = Math.max(0.08, Math.min(0.92, lane.x + rand(-0.09, 0.09)));
        auto.targetYFrac = Math.max(surfaceFrac, Math.min(0.94, lane.y + rand(-0.06, 0.06)));
        auto.targetSpeed = rand(0.6, 1.1) * wh.scale;
        auto.driftAngle = rand(-0.1, 0.1);
        return;
      }

      if (r < 0.24 && feed.state !== 'school') {
        // Cross the screen and leave through the edge the whale already faces
        // (never while a school is waiting — the encounter takes priority)
        auto.phase = 'cruise';
        auto.dir = facing;
        auto.targetYFrac = rand(0.06, 0.82);
        auto.targetSpeed = rand(1.7, 2.5) * wh.scale;
      } else if (r < 0.32) {
        // Brief, slow glide
        auto.phase = 'drift';
        auto.phaseDuration = rand(1.4, 2.4);
        auto.targetSpeed = rand(0.25, 0.45) * wh.scale;
        auto.driftAngle = rand(-0.14, 0.14);
      } else {
        // Explore toward a waypoint, usually ahead so turns stay wide and natural
        auto.phase = 'wander';
        const xNow = wh.x / Math.max(1, w);
        const ahead = Math.random() < 0.78 ? facing : ((-facing) as 1 | -1);
        const lo = ahead > 0 ? Math.min(0.88, xNow + 0.22) : 0.12;
        const hi = ahead > 0 ? 0.88 : Math.max(0.12, xNow - 0.22);
        auto.targetXFrac = lo < hi ? rand(lo, hi) : rand(0.15, 0.85);
        auto.targetYFrac = rand(0.06, 0.84);
        auto.targetSpeed = rand(1.2, 2.2) * wh.scale;
        auto.phaseDuration = rand(7, 12); // safety timeout
        auto.pauseAt = Math.random() < 0.15 ? rand(1.5, 3.5) : -1;
      }
    };

    const placeWhaleOffscreen = (wh: WhaleAgent, w: number, h: number, segLen: number) => {
      // Whale is fully out of view here: re-seed the straight spine just outside the entry edge
      const headX = auto.dir > 0 ? -cellSize * 4 : w + cellSize * 4;
      const headY = h * auto.targetYFrac;
      const heading = auto.dir > 0 ? 0 : Math.PI;
      wh.x = headX;
      wh.y = headY;
      wh.heading = heading;
      wh.turnRate = 0;
      for (let k = 0; k < SPINE_NODES; k++) {
        wh.spineX[k] = headX - Math.cos(heading) * k * segLen;
        wh.spineY[k] = headY;
        wh.spineAngle[k] = heading;
      }
    };

    /**
     * Advances the autonomous phase machine and returns the steering contribution.
     * Returns null when the autonomous controller has no say this frame.
     */
    const stepAutonomy = (
      wh: WhaleAgent,
      w: number,
      h: number,
      bodyLenPx: number,
      segLen: number,
      dt: number,
      laneX: number,
      laneY: number
    ): { angle: number; speed: number } | null => {
      const sm = scrollMotionRef.current;
      const scrolling = sm.activity > 0.08;

      // Lane anchor offsets relax back to the real lane gently without rigid sideways yanks
      const relax = Math.exp(-dt / (scrolling ? 1.6 : 4.5));
      auto.offX *= relax;
      auto.offY *= relax;

      if (prefersReducedMotion) {
        auto.weight = 0;
        return null;
      }

      if (scrolling) {
        auto.idleSeconds = 0;
        if (auto.phase !== 'rest') handBackToScroll(wh, laneX, laneY);
        auto.weight = Math.max(0, auto.weight - dt * 4);
        auto.curSpeed *= Math.exp(-dt * 6);
        return auto.weight > 0.001 ? { angle: wh.heading, speed: auto.curSpeed } : null;
      }

      auto.idleSeconds += dt;
      auto.phaseTime += dt;
      auto.speedPhase += dt;

      if (auto.phase === 'rest' && auto.idleSeconds > 0.6) {
        startNextPhase(wh, w, h);
      }

      let angle = wh.heading;
      let speed = 0;
      // Organic speed breathing so cruising never feels mechanical
      const breathe = 1 + Math.sin(auto.speedPhase * 0.7) * 0.12 + Math.sin(auto.speedPhase * 0.23 + 1.3) * 0.08;

      if (auto.phase === 'wander') {
        if (auto.pauseAt > 0 && auto.phaseTime >= auto.pauseAt) {
          auto.pauseLeft = rand(0.9, 1.6);
          auto.pauseAt = -1;
        }
        const pausing = auto.pauseLeft > 0;
        if (pausing) auto.pauseLeft -= dt;

        const tx = w * auto.targetXFrac;
        const ty = h * auto.targetYFrac;
        const dx = tx - wh.x;
        const dy = ty - wh.y;
        const meander = Math.sin(time * 0.41 + auto.targetYFrac * 7) * 0.08;
        // Keep the body mostly horizontal: compress steep climbs/dives
        const rawAngle = Math.atan2(dy * 0.75, dx);
        angle = rawAngle + meander;
        speed = (pausing ? 0.22 * wh.scale : auto.targetSpeed) * breathe;

        const dist = Math.hypot(dx, dy);
        if (dist < Math.min(w, h) * 0.09 || auto.phaseTime > auto.phaseDuration) {
          startNextPhase(wh, w, h);
        }
      } else if (auto.phase === 'cruise' || auto.phase === 'return') {
        const dyErr = Math.max(-0.35, Math.min(0.35, ((h * auto.targetYFrac - wh.y) / h) * 1.4));
        const meander = Math.sin(time * 0.33 + auto.targetYFrac * 9) * 0.05;
        const pitch = dyErr + meander;
        angle = auto.dir > 0 ? pitch : Math.PI - pitch;
        speed = auto.targetSpeed * breathe;

        if (auto.phase === 'cruise') {
          // Fully past the exit edge (tail included)?
          const tailX = wh.spineX[SPINE_NODES - 1];
          const margin = bodyLenPx * 0.25;
          const exited = auto.dir > 0 ? tailX > w + margin : tailX < -margin;
          if (exited) {
            auto.phase = 'offscreen';
            auto.phaseTime = 0;
            auto.phaseDuration = rand(0.8, 2.2);
          }
        } else {
          // Back in view and clear of the entry edge: keep exploring
          const inside = auto.dir > 0 ? wh.x > w * 0.24 : wh.x < w * 0.76;
          if (inside) startNextPhase(wh, w, h);
        }
      } else if (auto.phase === 'offscreen') {
        speed = auto.curSpeed;
        if (auto.phaseTime >= auto.phaseDuration) {
          // Re-enter from the opposite side, continuing the same heading (roaming from top to bottom)
          auto.targetYFrac = rand(0.06, 0.80);
          auto.targetSpeed = rand(1.5, 2.2) * wh.scale;
          auto.curSpeed = auto.targetSpeed;
          placeWhaleOffscreen(wh, w, h, segLen);
          auto.phase = 'return';
          auto.phaseTime = 0;
        }
        angle = wh.heading;
      } else if (auto.phase === 'drift') {
        const facing: 1 | -1 = Math.cos(wh.heading) >= 0 ? 1 : -1;
        angle = facing > 0 ? auto.driftAngle : Math.PI - auto.driftAngle;
        speed = auto.targetSpeed;
        if (auto.phaseTime >= auto.phaseDuration) startNextPhase(wh, w, h);
      }

      // Blend weight: ~1.2s ease in after scrolling stops
      const targetWeight = auto.phase === 'rest' ? 0 : 1;
      auto.weight += (targetWeight - auto.weight) * Math.min(1, dt * 1.7);
      if (auto.phase !== 'rest' && auto.weight > 0.995) auto.weight = 1;
      // Speed eases so departures, pauses and arrivals never jerk
      auto.curSpeed += (speed - auto.curSpeed) * Math.min(1, dt * 1.1);

      return auto.weight > 0.001 ? { angle, speed: auto.curSpeed } : null;
    };

    // ------------------------------------------------------------------------
    // FEEDING ENCOUNTER (main whale) — works while scrolling or idle
    // ------------------------------------------------------------------------
    // Every ~8–15s of browsing a small school of ASCII fish appears AHEAD of the
    // main whale's current trajectory. While scrolling, the scroll-linked whale
    // holds its screen band and "swims" against the scroll, so the fish drift with
    // the scrolled water toward its mouth; they also ease sideways toward the
    // whale's path. The whale's steering is only *biased* toward the school (never
    // overridden while scrolling). Within reach the jaws part briefly, nearby fish
    // are drawn in and vanish. If the encounter can't complete (direction reversed,
    // school scrolled away, timeout), the fish scatter and fade.
    const FEEDING_ENABLED = false;
    interface FeedFish {
      ox: number; // home offset inside the elongated school
      oy: number;
      x: number;
      y: number;
      vx: number;
      vy: number;
      alpha: number;
      phase: number;
      face: 1 | -1; // facing, with hysteresis
      tier: 0 | 1 | 2; // depth: 0 far, 1 mid, 2 near (ink weight)
      state: 'swim' | 'eaten' | 'scatter';
      t: number;
    }
    // Depth weight per tier: far fish contribute faint ink, near fish denser ink
    const FISH_TIER_WEIGHT = [0.72, 0.9, 1.0];
    const feed = {
      state: 'idle' as 'idle' | 'school' | 'scatter',
      // First encounter: within ~3–6s of arrival, even while scrolling
      timer: prefersReducedMotion ? Infinity : rand(3, 5),
      firstDone: false,
      isFirst: false, // the current encounter is the first one (prioritised)
      // Later encounters: only after ~10s without scrolling, plus a small random delay
      idleForFeed: 0,
      extraDelay: rand(0.5, 4),
      age: 0,
      cx: 0,
      cy: 0,
      swimDir: 1 as 1 | -1,
      fish: [] as FeedFish[],
      mouthOpen: 0,
      gulp: 0, // throat pouch fullness after swallowing (0..1), deflates slowly
      eatenCount: 0,
      doneDelay: 0,
      lungeSeen: false,
      leaveTimer: 0
    };
    let mainBodyLen = 300;
    let lastSmoothScrollY = scrollMotionRef.current.smoothScrollY;
    // Clock for the whales' glyph shimmer and caustics: real time in their own swim, scroll
    // distance while the migration holds them, so nothing moves on a still page there
    let fxClock = 0;
    let lastMigP = 0;
    // Deep-water silhouette (Stage 5): one distant manta ray at a time, only in deeper water
    const mantaRay = {
      active: false,
      wait: rand(6, 12),
      dir: 1 as 1 | -1,
      x: 0,
      baseY: 0,
      span: 100,
      speed: 0.7,
      phase: 0
    };

    // Approximate gaussian for natural school density (dense core, sparse edges)
    const gauss = () => (Math.random() + Math.random() + Math.random() - 1.5) / 1.5;

    const spawnSchool = (headX: number, headY: number, hx: number, hy: number, w: number, h: number, scrolling: boolean) => {
      feed.isFirst = !feed.firstDone;
      // The first school appears closer and more centred on the whale's path so it is reached quickly
      const ahead = mainBodyLen * (feed.isFirst ? rand(0.75, 1.05) : rand(1.0, 1.55));
      const side = (feed.isFirst ? rand(-0.1, 0.1) : rand(-0.2, 0.2)) * mainBodyLen;
      let cx = headX + hx * ahead - hy * side;
      let cy = headY + hy * ahead + hx * side;
      // While scrolling the school may start just beyond the edge and drift into view with the water
      const edgeAllowance = feed.isFirst ? 0.1 : 0.22;
      cx = Math.max(w * 0.12, Math.min(w * 0.88, cx));
      cy = scrolling
        ? Math.max(-h * edgeAllowance, Math.min(h * (1 + edgeAllowance), cy))
        : Math.max(h * 0.06, Math.min(h * 0.86, cy));
      feed.cx = cx;
      feed.cy = cy;
      feed.swimDir = Math.random() < 0.5 ? 1 : -1;
      feed.age = 0;
      feed.eatenCount = 0;
      feed.doneDelay = 0;
      feed.lungeSeen = false;
      feed.leaveTimer = 0;

      // Large bait school: elongated along the swimming direction, dense core
      const count = Math.round(rand(46, 72) * (w < 640 ? 0.6 : 1));
      const spanX = rand(70, 105);
      const spanY = rand(22, 34);
      feed.fish = [];
      for (let i = 0; i < count; i++) {
        const ox = gauss() * spanX;
        const oy = gauss() * spanY + ox * rand(-0.08, 0.08);
        const tierRoll = Math.random();
        const tier: 0 | 1 | 2 = tierRoll < 0.34 ? 0 : tierRoll < 0.78 ? 1 : 2;
        feed.fish.push({
          ox,
          oy,
          x: cx + ox,
          y: cy + oy,
          vx: feed.swimDir * rand(0.7, 1.1),
          vy: rand(-0.15, 0.15),
          alpha: 0,
          phase: Math.random() * Math.PI * 2,
          face: feed.swimDir,
          tier,
          state: 'swim',
          t: 0
        });
      }
      feed.state = 'school';
    };

    const scatterSchool = () => {
      for (const f of feed.fish) {
        if (f.state !== 'swim') continue;
        const ang = Math.atan2(f.y - feed.cy, f.x - feed.cx) + rand(-0.4, 0.4);
        const sp = rand(1.6, 2.6);
        f.vx = Math.cos(ang) * sp;
        f.vy = Math.sin(ang) * sp * 0.6;
        f.state = 'scatter';
        f.t = rand(-0.4, 0); // staggered fade so the school thins out progressively
      }
      feed.state = 'scatter';
    };

    const updateWhaleKinematics = (
      wh: WhaleAgent,
      w: number,
      h: number,
      bodyLenPx: number,
      idx: number,
      dtScale: number,
      entryCalm: number,
      rawDepth: number
    ) => {
      const segLen = bodyLenPx / (SPINE_NODES - 1);
      const sm = scrollMotionRef.current;

      if (!wh.initialized) {
        // Opening screen placement: on the cover, already in the lanes composed against the type
        const onCover = window.scrollY < h;
        wh.x = onCover ? w * whaleDirection.lanes[idx].x : idx === 0 ? w * 0.64 : w * 0.24;
        wh.y = onCover ? h * whaleDirection.lanes[idx].y : idx === 0 ? h * 0.58 : h * 0.18;
        wh.heading = idx === 0 ? -0.08 : 0.14;
        for (let k = 0; k < SPINE_NODES; k++) {
          wh.spineX[k] = wh.x - Math.cos(wh.heading) * k * segLen;
          wh.spineY[k] = wh.y - Math.sin(wh.heading) * k * segLen;
          wh.spineAngle[k] = wh.heading;
        }
        wh.initialized = true;
      }

      const scrollSpeedPx = Math.abs(sm.velocity);
      const motionScale = prefersReducedMotion ? 0.22 : 1.0;

      // Understated, slow fluid swimming on the opening screen; smooth organic acceleration during scroll (zero frantic thrashing)
      const baseIdleSwim = 0.14 + (1 - entryCalm) * 0.05;
      const targetSwimRate =
        (baseIdleSwim + sm.activity * Math.min(0.76, 0.26 + scrollSpeedPx * 0.028)) * motionScale;
      wh.smoothSwimRate += (targetSwimRate - wh.smoothSwimRate) * Math.min(1, 0.16 * dtScale);
      const swimStep = wh.smoothSwimRate * dtScale;
      wh.swimCycle += wh.CycleSpeed * swimStep;
      wh.finCycle += wh.CycleSpeed * 0.56 * swimStep;

      const sProg = rawDepth;
      const rawLaneCenterX =
        idx === 0
          ? w * (0.58 - (1 - entryCalm) * 0.06) + Math.sin(sProg * Math.PI * 2.4 + time * 0.1) * (w * 0.22)
          : w * (0.26 + (1 - entryCalm) * 0.08) + Math.cos(sProg * Math.PI * 2.0 + 1.2 + time * 0.085) * (w * 0.2);

      // Opening screen & scroll lanes: allow both whales to glide throughout the water column including the top of the site
      const entryScreenY = idx === 0 ? h * 0.58 : h * 0.16;
      const dossierScreenY =
        idx === 0
          ? h * (0.16 + sProg * 0.50)
          : h * (0.08 + (1 - sProg * 0.5) * 0.40);
      const rawScrollLinkedScreenY =
        entryScreenY * entryCalm + dossierScreenY * (1 - entryCalm);

      // Autonomous controller (main whale only) — blended through `autoW`
      const autoStep =
        idx === 0
          ? stepAutonomy(wh, w, h, bodyLenPx, segLen, dtScale / 60, rawLaneCenterX, rawScrollLinkedScreenY)
          : null;
      const autoW = autoStep ? auto.weight : 0;

      // Feeding bias: a soft pull toward the school, only when it lies ahead and within reach.
      // While scrolling it is capped low so the scroll direction always dominates.
      let feedPull = 0;
      let feedDirX = 0;
      let feedDirY = 0;
      if (idx === 0 && feed.state === 'school') {
        const fdx = feed.cx - wh.x;
        const fdy = feed.cy - wh.y;
        const fd = Math.hypot(fdx, fdy);
        if (fd > 1) {
          feedDirX = fdx / fd;
          feedDirY = fdy / fd;
          const aheadDot = feedDirX * Math.cos(wh.heading) + feedDirY * Math.sin(wh.heading);
          const prox = Math.max(0, 1 - fd / (bodyLenPx * (feed.isFirst ? 3.0 : 2.2)));
          const scrollingNow = sm.activity > 0.08;
          if (!scrollingNow || aheadDot > -0.15) {
            // The first encounter is prioritised (stronger bias), scroll still dominates
            feedPull = (scrollingNow ? (feed.isFirst ? 0.45 : 0.3) : feed.isFirst ? 0.9 : 0.8) * prox;
          }
        }
      }

      let laneCenterX =
        rawLaneCenterX +
        (idx === 0 ? auto.offX : 0) +
        (feedPull > 0 ? (feed.cx - rawLaneCenterX) * feedPull * 0.6 : 0);
      let scrollLinkedScreenY = rawScrollLinkedScreenY + (idx === 0 ? auto.offY : 0);
      // Composed stretches (cover, introduction): the lanes are placed against the type
      const directed = whaleDirection.weight;
      if (directed > 0) {
        const lane = whaleDirection.lanes[idx];
        laneCenterX += (lane.x * w - laneCenterX) * directed;
        scrollLinkedScreenY += (lane.y * h - scrollLinkedScreenY) * directed;
      }

      if (autoStep) {
        // Tail beat follows cruising speed
        const cruiseBeat = autoW * Math.min(1.4, autoStep.speed * 0.5) * dtScale * motionScale;
        wh.swimCycle += wh.CycleSpeed * cruiseBeat;
        wh.finCycle += wh.CycleSpeed * 0.56 * cruiseBeat;
      }

      // Scrolling sets the whales travelling, never diving head-first: they keep swimming across
      // the screen, facing their lane, and only pitch gently down (scrolling down) or up
      // (scrolling up). The scroll's pace shows in the stroke, not in a vertical heading.
      const cosCurr = Math.cos(wh.heading);
      const laneDx = laneCenterX - wh.x;
      const scrollFacing: 1 | -1 =
        Math.abs(laneDx) > w * 0.08 ? (laneDx > 0 ? 1 : -1) : cosCurr >= 0 ? 1 : -1;
      const scrollPitch = sm.dirBlend * SWIM_PITCH_MAX * 0.7;
      const verticalScrollHeading = scrollFacing > 0 ? scrollPitch : Math.PI - scrollPitch;

      const idleHorizontalHeading =
        cosCurr >= 0
          ? Math.sin(time * 0.28 + idx) * 0.11
          : Math.PI - Math.sin(time * 0.28 + idx) * 0.11;

      const activeWeight = Math.pow(sm.activity, 0.65);
      let targetVecX =
        (1 - activeWeight) * Math.cos(idleHorizontalHeading) +
        activeWeight * Math.cos(verticalScrollHeading);
      let targetVecY =
        (1 - activeWeight) * Math.sin(idleHorizontalHeading) +
        activeWeight * Math.sin(verticalScrollHeading);
      if (autoStep) {
        targetVecX = targetVecX * (1 - autoW) + Math.cos(autoStep.angle) * autoW;
        targetVecY = targetVecY * (1 - autoW) + Math.sin(autoStep.angle) * autoW;
      }
      if (feedPull > 0.001) {
        targetVecX = targetVecX * (1 - feedPull) + feedDirX * feedPull;
        targetVecY = targetVecY * (1 - feedPull) + feedDirY * feedPull;
      }
      // Whatever steers (scroll, idle drift, autonomy), the body stays within a shallow pitch
      // of horizontal, so the side profile always reads as a whale swimming through water
      // Facing changes only by a side-view turn, and only on a clear pull the other way; while a
      // turn plays out the whale holds its new facing, so steering never rotates it through vertical
      const facingNow: 1 | -1 = Math.cos(wh.heading) >= 0 ? 1 : -1;
      if (wh.turnS < 1) wh.turnS = Math.min(1, wh.turnS + dtScale / 60 / (SIDE_TURN_SECONDS * 0.5));
      else if (targetVecX * facingNow < -0.2) turnAround(wh);
      const desiredFacing: 1 | -1 = Math.cos(wh.heading) >= 0 ? 1 : -1;
      const desiredPitch = Math.max(
        -SWIM_PITCH_MAX,
        Math.min(SWIM_PITCH_MAX, Math.atan2(targetVecY, Math.abs(targetVecX) + 1e-6))
      );
      const desiredAngle = desiredFacing > 0 ? desiredPitch : Math.PI - desiredPitch;

      let angleDiff = desiredAngle - wh.heading;
      while (angleDiff > Math.PI) angleDiff -= Math.PI * 2;
      while (angleDiff < -Math.PI) angleDiff += Math.PI * 2;

      // Smooth critically-damped reorientation without abrupt snaps
      const maxTurn = (0.056 + sm.activity * 0.092 - autoW * 0.024) * dtScale;
      const targetTurn = Math.max(-maxTurn, Math.min(maxTurn, angleDiff * (0.13 + sm.activity * 0.16) * dtScale));
      wh.turnRate += (targetTurn - wh.turnRate) * Math.min(1, 0.26 * dtScale);

      const headYawWave = Math.sin(wh.swimCycle) * (0.0018 + sm.activity * 0.0024 + autoW * 0.0015) * dtScale * motionScale;
      wh.heading += wh.turnRate + headYawWave;

      const pivotBoostPx = Math.abs(angleDiff) * sm.activity * 2.1 * wh.scale;
      const idleDriftPx = (0.13 + (1 - entryCalm) * 0.05) * wh.scale * motionScale;
      // Horizontal travel is held near the lane's own drift so a long scroll does not carry the
      // whales off-screen; the faster stroke above carries the sense of speed
      const scrollSwimPx = Math.min(8.5, scrollSpeedPx * 0.38 + pivotBoostPx) * wh.scale * 0.45;
      let stepPx = (idleDriftPx * (1 - sm.activity * 0.5) + scrollSwimPx) * dtScale;
      if (autoStep) {
        stepPx = stepPx * (1 - autoW) + autoStep.speed * dtScale * autoW;
      }

      wh.x += Math.cos(wh.heading) * stepPx;
      wh.y += Math.sin(wh.heading) * stepPx;

      wh.spineX[0] = wh.x;
      wh.spineY[0] = wh.y;
      wh.spineAngle[0] = wh.heading;

      const alignRate = Math.min(0.54, (0.15 + sm.activity * 0.18) * dtScale);
      const targetWaveAmp = (0.022 + sm.activity * 0.036 + autoW * 0.022) * motionScale;
      wh.smoothWaveAmp += (targetWaveAmp - wh.smoothWaveAmp) * Math.min(1, 0.14 * dtScale);
      const waveAmp = wh.smoothWaveAmp;

      for (let k = 1; k < SPINE_NODES; k++) {
        const u = k / (SPINE_NODES - 1);
        const dx = wh.spineX[k - 1] - wh.spineX[k];
        const dy = wh.spineY[k - 1] - wh.spineY[k];
        let segAngle = Math.atan2(dy, dx);

        let alignDiff = wh.spineAngle[k - 1] - segAngle;
        while (alignDiff > Math.PI) alignDiff -= Math.PI * 2;
        while (alignDiff < -Math.PI) alignDiff += Math.PI * 2;
        segAngle += alignDiff * alignRate;

        const waveEnvelope = u < 0.22 ? u * 0.15 : 0.033 + Math.pow((u - 0.22) / 0.78, 1.75) * 0.44;
        const muscularWave = Math.sin(wh.swimCycle - u * 4.8) * waveEnvelope * waveAmp;
        segAngle += muscularWave;

        let diff = segAngle - wh.spineAngle[k - 1];
        while (diff > Math.PI) diff -= Math.PI * 2;
        while (diff < -Math.PI) diff += Math.PI * 2;
        const maxBend = 0.12;
        if (diff > maxBend) segAngle = wh.spineAngle[k - 1] + maxBend;
        if (diff < -maxBend) segAngle = wh.spineAngle[k - 1] - maxBend;
        // Seen from the side, a whale's body flexes only a little up and down: no point of it
        // strays far from the head's line, so the tail never curls over the back
        let fromHead = segAngle - wh.spineAngle[0];
        while (fromHead > Math.PI) fromHead -= Math.PI * 2;
        while (fromHead < -Math.PI) fromHead += Math.PI * 2;
        if (fromHead > SIDE_BODY_BEND) segAngle = wh.spineAngle[0] + SIDE_BODY_BEND;
        else if (fromHead < -SIDE_BODY_BEND) segAngle = wh.spineAngle[0] - SIDE_BODY_BEND;

        wh.spineAngle[k] = segAngle;
        wh.spineX[k] = wh.spineX[k - 1] - Math.cos(segAngle) * segLen;
        wh.spineY[k] = wh.spineY[k - 1] - Math.sin(segAngle) * segLen;
      }

      // Lane springs yield entirely to the autonomous controller while it is in charge, clamped for graceful drift
      const springScale = 1 - autoW;
      const maxPullY = 4.6 * dtScale;
      const maxPullX = 3.0 * dtScale;
      const rawPullY = (scrollLinkedScreenY - wh.y) * Math.min(1, 0.032 * dtScale) * springScale;
      const rawPullX = (laneCenterX - wh.x) * Math.min(1, 0.018 * dtScale) * springScale;
      const pullY = Math.max(-maxPullY, Math.min(maxPullY, rawPullY));
      const pullX = Math.max(-maxPullX, Math.min(maxPullX, rawPullX));

      wh.x += pullX;
      wh.y += pullY;
      for (let k = 0; k < SPINE_NODES; k++) {
        wh.spineX[k] += pullX;
        wh.spineY[k] += pullY;
      }

      // Boundary near the very top of the viewport so whales can reach the top of the site and bank smoothly
      const minWhaleY = Math.max(18, bodyLenPx * 0.04, whaleDirection.surfaceY + bodyLenPx * 0.3);
      if (wh.y < minWhaleY) {
        const pushDown = (minWhaleY - wh.y) * Math.min(1, 0.14 * dtScale);
        wh.y += pushDown;
        for (let k = 0; k < SPINE_NODES; k++) {
          wh.spineY[k] += pushDown;
        }
        if (Math.sin(wh.heading) < 0) {
          wh.heading += (Math.cos(wh.heading) >= 0 ? 1 : -1) * 0.025 * dtScale;
        }
      }
    };

    // ------------------------------------------------------------------------
    // MIGRATION — the cinematic interval between the cover's name and the introduction
    // ------------------------------------------------------------------------
    // migrationScene.ts turns one scroll value into a camera, the whales' lanes on a spherical
    // ocean, the wakes and trails they leave and the planet's turn beneath them; it is all drawn
    // here, in the same character grid as the whales. The swim keeps running underneath and
    // the displayed pose blends onto the scene's by `engage`, so the whales arrive from where
    // they are and are handed back to their own swim once the introduction rises.
    const laneX = new Float64Array(SPINE_NODES);
    const laneY = new Float64Array(SPINE_NODES);
    const laneZ = new Float64Array(SPINE_NODES);
    const tgtX = new Float32Array(SPINE_NODES);
    const tgtY = new Float32Array(SPINE_NODES);
    const tgtS = new Float32Array(SPINE_NODES);
    const tgtA = new Float32Array(SPINE_NODES);
    const proj: Projected = { x: 0, y: 0, scale: 0, depth: 0 };
    const migLanes: Lane[] = [{ x: 0.5, y: 0.5 }, { x: 0.5, y: 0.5 }];
    let migLaneWeight = 0;
    let wasMigrationActive = false;
    // Exactly b once fully blended, so a held scene frame never depends on the swim behind it
    const lerpAngle = (a: number, b: number, k: number) => {
      if (k >= 1) return b;
      let d = b - a;
      while (d > Math.PI) d -= Math.PI * 2;
      while (d < -Math.PI) d += Math.PI * 2;
      return a + d * k;
    };
    /**
     * Readable at any tilt: the posed body keeps each node's true direction on screen but most of
     * its unforeshortened length, so a camera looking ahead never squashes a whale into a blob.
     */
    const KEEP_LENGTH = 0.75;
    /** Whale `idx` posed in the scene (blended with its swim by `eng`); returns its bank angle */
    const composeScenePose = (
      wh: WhaleAgent,
      idx: number,
      cam: Camera,
      travel: number,
      eng: number,
      stroke: number,
      mainPx: number,
      simSegLen: number
    ) => {
      spineAlongLane(idx, headY(idx, travel), SPINE_NODES, laneX, laneY, laneZ);
      for (let k = 0; k < SPINE_NODES; k++) {
        projectLane(cam, laneX[k], laneY[k], laneZ[k], proj);
        tgtX[k] = proj.x;
        tgtY[k] = proj.y;
        tgtS[k] = proj.scale;
      }
      const nodeLen = WHALES[idx].length / (SPINE_NODES - 1);
      tgtA[0] = Math.atan2(tgtY[0] - tgtY[1], tgtX[0] - tgtX[1]);
      wh.dispX[0] = eng >= 1 ? tgtX[0] : wh.spineX[0] + (tgtX[0] - wh.spineX[0]) * eng;
      wh.dispY[0] = eng >= 1 ? tgtY[0] : wh.spineY[0] + (tgtY[0] - wh.spineY[0]) * eng;
      wh.dispAngle[0] = lerpAngle(wh.spineAngle[0], tgtA[0], eng);
      wh.dispScale[0] = 1 + (tgtS[0] / mainPx - 1) * eng;
      for (let k = 1; k < SPINE_NODES; k++) {
        const u = k / (SPINE_NODES - 1);
        const dx = tgtX[k - 1] - tgtX[k];
        const dy = tgtY[k - 1] - tgtY[k];
        // The same muscular wave as the swim, its stroke set by the distance swum
        const envelope = u < 0.22 ? u * 0.15 : 0.033 + Math.pow((u - 0.22) / 0.78, 1.75) * 0.44;
        const a = Math.atan2(dy, dx) + Math.sin(stroke - u * 4.8) * envelope * 0.05;
        const seg = Math.hypot(dx, dy) * (1 - KEEP_LENGTH) + tgtS[k] * nodeLen * KEEP_LENGTH;
        tgtA[k] = a;
        const da = lerpAngle(wh.spineAngle[k], a, eng);
        const s = eng >= 1 ? seg : simSegLen + (seg - simSegLen) * eng;
        wh.dispAngle[k] = da;
        wh.dispX[k] = wh.dispX[k - 1] - Math.cos(da) * s;
        wh.dispY[k] = wh.dispY[k - 1] - Math.sin(da) * s;
        wh.dispScale[k] = 1 + (tgtS[k] / mainPx - 1) * eng;
      }
      // Banking into the lane's turns
      let turn = tgtA[0] - tgtA[24];
      while (turn > Math.PI) turn -= Math.PI * 2;
      while (turn < -Math.PI) turn += Math.PI * 2;
      return Math.max(-0.35, Math.min(0.35, turn * 1.5));
    };

    // The scene's character field: one glyph per cell at most, never over a whale or its rim
    let stampId = 0;
    const cellHash = (a: number, b: number) => (((a * 73856093) ^ (b * 19349663)) >>> 0) / 4294967296;
    // Glyphs are queued and drawn grouped by strength, so the canvas changes its alpha a few
    // dozen times a frame rather than once per glyph
    const SCENE_LEVELS = 40;
    const sceneLevelCount = new Int32Array(SCENE_LEVELS + 2);
    let sceneQueued = 0;
    const sceneGlyph = (c: number, r: number, glyph: number, row: number, alpha: number) => {
      if (c < 1 || r < 1 || c >= gridCols - 1 || r >= gridRows - 1) return;
      const idx = r * gridCols + c;
      if (sceneStamp[idx] === stampId) return;
      if (occBuf[idx] > 0 || occBuf[idx - 1] > 0 || occBuf[idx + 1] > 0 || occBuf[idx - gridCols] > 0 || occBuf[idx + gridCols] > 0) return;
      sceneStamp[idx] = stampId;
      const level = Math.min(SCENE_LEVELS, Math.round(alpha * SCENE_LEVELS));
      if (level <= 0) return;
      const q = sceneQueued * 2;
      sceneQueue[q] = idx;
      sceneQueue[q + 1] = (level << 16) | (row << 8) | glyph;
      sceneQueued++;
    };
    const flushSceneGlyphs = () => {
      sceneLevelCount.fill(0);
      for (let i = 0; i < sceneQueued; i++) sceneLevelCount[(sceneQueue[i * 2 + 1] >>> 16) + 1]++;
      for (let l = 1; l <= SCENE_LEVELS + 1; l++) sceneLevelCount[l] += sceneLevelCount[l - 1];
      for (let i = 0; i < sceneQueued; i++) sceneOrder[sceneLevelCount[sceneQueue[i * 2 + 1] >>> 16]++] = i;
      let level = -1;
      for (let k = 0; k < sceneQueued; k++) {
        const i = sceneOrder[k];
        const idx = sceneQueue[i * 2];
        const code = sceneQueue[i * 2 + 1];
        const l = code >>> 16;
        if (l !== level) {
          level = l;
          ctx.globalAlpha = l / SCENE_LEVELS;
        }
        ctx.drawImage(
          atlasCanvas,
          (code & 255) * tilePx,
          ((code >>> 8) & 255) * tilePx,
          tilePx,
          tilePx,
          (idx % gridCols) * cellSize,
          ((idx / gridCols) | 0) * cellSize,
          cellSize,
          cellSize
        );
      }
      sceneQueued = 0;
      ctx.globalAlpha = 1;
    };

    /**
     * The ocean, one ray per cell, each meeting the planet's sphere. What a ray finds there is
     * fixed to the Earth, so the sea passes beneath the whales as they swim and the camera rides
     * its curve. Everything that varies slowly across the screen (where a ray lands, the swell's
     * grouping, the water's depth variations, the offsets from the whales' lanes, the deep shell)
     * is sampled every few cells and interpolated; only the crests themselves are per cell. In
     * order of priority: the whales' wakes, the faint meridians and parallels of the long
     * migration, the crests (thinned by the water's depth variations, rougher in the southern
     * latitudes), and in the open cells a sparse deep layer of particles on a shell below the
     * surface, which passes more slowly (true parallax).
     */
    const DEEP_Z = -2.4;
    const SNOW_GRID = 0.42;
    /** Degrees between chart lines */
    const CHART_STEP = 10;
    const RAD = 180 / Math.PI;
    /** Cells between samples of the sphere, and the values kept per sample */
    const SAMPLE = 4;
    const NV = 14;
    let samples = new Float64Array(0);
    let sampleRow = new Float64Array(0);
    const hit: SceneV3 = [0, 0, 0];
    const laneAt: [number, number] = [0, 0];
    const seaBase: [number, number] = [0, 0];
    const drawSceneWater = (cam: Camera, p: number, travel: number, st: ReturnType<typeof stagesAt>) => {
      const F = cam.focal;
      const water = st.water;
      const sCols = Math.ceil((gridCols - 1) / SAMPLE) + 1;
      const sRows = Math.ceil((gridRows - 1) / SAMPLE) + 1;
      if (samples.length < sCols * sRows * NV) samples = new Float64Array(sCols * sRows * NV);
      if (sampleRow.length < sCols * NV) sampleRow = new Float64Array(sCols * NV);
      for (let sr = 0; sr < sRows; sr++) {
        const sy = sr * SAMPLE * cellSize + cellSize * 0.5;
        for (let sc = 0; sc < sCols; sc++) {
          const sx = sc * SAMPLE * cellSize + cellSize * 0.5;
          const o = (sr * sCols + sc) * NV;
          const t = oceanHit(cam, sx, sy, PLANET_R, hit);
          samples[o] = t > 0 ? 1 : 0;
          if (t <= 0) continue;
          earthToLane(hit[0], hit[1], hit[2], laneAt);
          const lx = laneAt[0];
          const ly = laneAt[1];
          seaBaseAt(lx, ly, p, seaBase);
          samples[o + 1] = lx;
          samples[o + 2] = ly;
          samples[o + 3] = Math.asin(hit[2] / PLANET_R) * RAD;
          samples[o + 4] = Math.atan2(hit[1], hit[0]) * RAD;
          // Water covered by one cell
          samples[o + 5] = (t * cellSize) / F;
          samples[o + 6] = seaBase[0];
          samples[o + 7] = seaBase[1];
          samples[o + 8] = densityAt(lx, ly);
          samples[o + 9] = lx - WHALES[0].x(ly);
          samples[o + 10] = lx - WHALES[1].x(ly);
          const td = oceanHit(cam, sx, sy, PLANET_R + DEEP_Z, hit);
          samples[o + 13] = 0;
          if (td > 0) {
            earthToLane(hit[0], hit[1], hit[2], laneAt);
            samples[o + 11] = laneAt[0];
            samples[o + 12] = laneAt[1];
            samples[o + 13] = F / td;
          }
        }
      }

      const head0 = headY(0, travel);
      const head1 = headY(1, travel);
      // Interpolated value `k` between the samples either side of a cell
      const at = (o: number, k: number, fx: number) => sampleRow[o + k] + (sampleRow[o + NV + k] - sampleRow[o + k]) * fx;
      for (let row = 1; row < gridRows - 1; row++) {
        const sr = (row / SAMPLE) | 0;
        const fy = (row - sr * SAMPLE) / SAMPLE;
        const a0 = sr * sCols * NV;
        const a1 = a0 + sCols * NV;
        for (let k = 0; k < sCols * NV; k++) sampleRow[k] = samples[a0 + k] + (samples[a1 + k] - samples[a0 + k]) * fy;
        for (let col = 1; col < gridCols - 1; col++) {
          const sc = (col / SAMPLE) | 0;
          const fx = (col - sc * SAMPLE) / SAMPLE;
          const o = sc * NV;
          // Every ray around this cell met the water
          if (sampleRow[o] < 1 || sampleRow[o + NV] < 1) continue;
          const lx = at(o, 1, fx);
          const ly = at(o, 2, fx);
          const foot = at(o, 5, fx);

          if (st.wake > 0) {
            const wk = Math.max(whaleWake(0, at(o, 9, fx), ly, head0), whaleWake(1, at(o, 10, fx), ly, head1));
            if (wk > 0.12) {
              // Foam where the water is most churned, then the wake's ridges
              sceneGlyph(col, row, wk > 0.72 ? 5 : wk > 0.38 ? 4 : 3, 22, st.wake * water * (0.46 + 0.5 * wk));
              continue;
            }
          }

          const lat = at(o, 3, fx);
          if (st.chart > 0) {
            // A fine rule within half a cell of the line, in a narrow channel of calm water, so
            // it reads apart from the crests that run beside it
            const cellDeg = (foot / PLANET_R) * RAD;
            const dLat = Math.abs(lat - Math.round(lat / CHART_STEP) * CHART_STEP);
            const lon = at(o, 4, fx);
            const dLon = Math.abs(lon - Math.round(lon / CHART_STEP) * CHART_STEP) * Math.cos(lat / RAD);
            const d = Math.min(dLat, dLon);
            if (d < cellDeg * 0.5) {
              sceneGlyph(col, row, 0, 22, st.chart * water * 0.62);
              continue;
            }
            if (d < cellDeg * 1.6 * st.chart) continue;
          }

          // The finest train fades before it can alias
          const fine = 1 - smoothStepRange(foot, 0.035, 0.065);
          const storm = seaStateAt(lat);
          const dens = at(o, 8, fx);
          const v = crestsAt(lx, ly, p, fine, storm, at(o, 6, fx), at(o, 7, fx));
          // Only the crests are drawn: the troughs between them leave the page open. Denser
          // water draws each crest a little wider
          const cut = 0.03 - 0.07 * dens;
          if (v > cut) {
            const lv = Math.min(1, (v - cut) / 0.3);
            sceneGlyph(col, row, lv < 0.18 ? 1 : lv < 0.5 ? 3 : 4, 22, water * (0.44 + 0.46 * lv) * (0.82 + 0.18 * dens));
            continue;
          }

          if (st.snow <= 0.01 || sampleRow[o + 13] <= 0 || sampleRow[o + NV + 13] <= 0) continue;
          const Xd = at(o, 11, fx);
          const Yd = at(o, 12, fx);
          const gi = Math.floor(Xd / SNOW_GRID);
          const gj = Math.floor(Yd / SNOW_GRID);
          const hsh = cellHash(gi, gj);
          if (hsh >= 0.1) continue;
          // Each patch of deep water holds at most one particle, at its own fixed spot
          const jx = (gi + 0.2 + 0.6 * cellHash(gj + 911, gi)) * SNOW_GRID;
          const jy = (gj + 0.2 + 6 * hsh) * SNOW_GRID;
          const k = at(o, 13, fx);
          if (Math.abs(Xd - jx) * k < cellSize * 0.5 && Math.abs(Yd - jy) * k < cellSize * 0.5) {
            sceneGlyph(col, row, hsh < 0.03 ? 1 : 0, 22, st.snow * water * 0.32);
          }
        }
      }
    };

    /**
     * Thin traces behind each whale: sparse characters along the exact path it swam, fading with
     * age. Samples sit at fixed places in the water; as the camera rises they thin out by halves
     * (each halving fades), so the spacing on screen stays under two cells and nothing crawls
     * along the line.
     */
    const TRAIL_STEP = 0.08;
    // Mostly '·' and '.', now and then ':' or '-', rarely '+'
    const TRAIL_GLYPHS = [0, 0, 0, 0, 0, 0, 1, 1, 1, 2, 2, 3, 0, 1, 0, 5];
    const drawTrails = (cam: Camera, travel: number, trails: number) => {
      for (let i = 0; i < 2; i++) {
        const lane = WHALES[i];
        const tail = headY(i, travel) - lane.length * 1.08;
        const from = Math.max(TRAIL_FROM, tail - 24);
        if (tail <= from) continue;
        const j0 = Math.ceil(from / TRAIL_STEP);
        const j1 = Math.floor(tail / TRAIL_STEP);
        for (let j = j1; j >= j0; j--) {
          const y = j * TRAIL_STEP;
          const age = tail - y;
          let alpha =
            trails *
            (i === 0 ? 0.5 : 0.4) *
            Math.exp(-age / 11) *
            (1 - smoothStepRange(age, 17, 24)) *
            smoothStepRange(y - TRAIL_FROM, 0, 3);
          if (alpha < 0.02) continue;
          projectLane(cam, lane.x(y) + 0.06 * Math.sin(j * 0.9 + i * 2.1), y, -0.02, proj);
          const want = Math.max(1, (cellSize * 1.7) / Math.max(1e-3, proj.scale * TRAIL_STEP));
          const lod = Math.log2(want);
          const level = Math.min(10, Math.ceil(lod));
          if (j % (1 << level) !== 0) {
            if (level === 0 || j % (1 << (level - 1)) !== 0) continue;
            alpha *= level - lod;
          }
          sceneGlyph((proj.x / cellSize) | 0, (proj.y / cellSize) | 0, TRAIL_GLYPHS[(cellHash(j, i + 7) * 16) | 0], 22, alpha);
        }
      }
    };

    /** The whole field, behind the whales: trails first (they claim their cells), then the water */
    const drawMigrationScene = (cam: Camera, p: number, travel: number, st: ReturnType<typeof stagesAt>) => {
      stampId++;
      sceneQueued = 0;
      if (st.trails > 0) drawTrails(cam, travel, st.trails);
      drawSceneWater(cam, p, travel, st);
      flushSceneGlyphs();
    };

    // ------------------------------------------------------------------------
    // ASCII BIOLUMINESCENT JELLYFISH (anatomical, multi-species — see asciiOceanLife.ts)
    // ------------------------------------------------------------------------
    // Each creature is evaluated per character cell as a translucent bell with radial canals,
    // gonads / segmented stomach, luminous scalloped margin, oral arms and trailing tentacles.
    // Far & mid planes draw behind the whales, the foreground plane in front of them.
    const renderJellyfishPlanes = (
      w: number,
      h: number,
      rawDepth: number,
      abyss: number,
      surfaceBaseY: number,
      minTier: number,
      maxTier: number,
      target: CanvasRenderingContext2D = ctx
    ) => {
      if (isFocus) return;
      jellyfishField.render(
        target,
        w,
        h,
        time,
        scrollMotionRef.current.smoothScrollY,
        rawDepth,
        abyss,
        surfaceBaseY,
        prefersReducedMotion,
        minTier,
        maxTier
      );
    };

    // Dirty bounding box of occupied cells from previous frame
    let prevMinC = 0;
    let prevMaxC = 0;
    let prevMinR = 0;
    let prevMaxR = 0;

    const render = (now: number) => {
      animId = 0;
      if (document.hidden) return;
      const frameStart = performance.now();
      const rawDt = (now - lastFrameTime) * 0.001;
      lastFrameTime = now;
      const dt = Math.max(0.004, Math.min(0.033, rawDt || 0.0166));
      const dtScale = dt * 60;

      time += prefersReducedMotion ? 0 : dt;

      const sm = scrollMotionRef.current;
      const curScrollY = window.scrollY;
      sm.targetScrollY = curScrollY;

      const w = viewW;
      const h = viewH;

      sm.prevSmoothScrollY = sm.smoothScrollY;
      const scrollDiff = sm.targetScrollY - sm.smoothScrollY;
      if (prefersReducedMotion) {
        sm.smoothScrollY = sm.targetScrollY;
      } else {
        const alphaY = 1 - Math.exp(-dt * 16);
        sm.smoothScrollY += scrollDiff * alphaY;
      }

      // Smooth frame-rate-independent scroll speed (px per 60Hz frame), eliminating wheel-notch surges & 1-frame snaps
      const frameScrollStep = (sm.smoothScrollY - sm.prevSmoothScrollY) / Math.max(0.25, dtScale);
      sm.velocity += (frameScrollStep - sm.velocity) * (1 - Math.exp(-dt * 18));

      const speedMag = Math.abs(sm.velocity);
      if (speedMag > 0.18) {
        sm.direction = sm.velocity > 0 ? 1 : -1;
        const targetAct = Math.min(1, 0.35 + speedMag * 0.048);
        const actRate = targetAct > sm.activity ? 8.5 : 3.2;
        sm.activity += (targetAct - sm.activity) * (1 - Math.exp(-dt * actRate));
      } else {
        sm.activity *= Math.exp(-dt * 3.0);
        if (sm.activity < 0.004) sm.activity = 0;
      }
      sm.dirBlend += (sm.direction - sm.dirBlend) * (1 - Math.exp(-dt * 9.0));

      ctx.clearRect(0, 0, w, h);
      if (glyphBatch && !glyphBatch.alive) {
        // The GPU context was lost: back to the 2D path for good, nothing left above it
        glyphBatch = null;
        overCtx?.clearRect(0, 0, w, h);
      }
      // Where what is drawn after the whale tiles goes: the layer above the WebGL tiles, or the 2D canvas
      const topCtx = overCtx ?? ctx;
      if (topCtx !== ctx) topCtx.clearRect(0, 0, w, h);

      // Continuous ocean immersion factor: 1.0 on the entry screen, easing smoothly into restrained ambient currents in CV sections
      const scrollViewports = h > 0 ? curScrollY / h : 0;
      const entryCalm = Math.max(0, Math.min(1, 1 - scrollViewports / 1.85));

      // Preserve overall page progress for creature movement and ocean texture.
      const rawDepth = Math.max(0, Math.min(1, curScrollY / docScrollable));
      const depth = rawDepth;
      const surfaceBaseY = -999;
      // Actual scroll (not the lagging creature position) guarantees white on upward return.
      const abyss = isFocus ? 0 : (1 - waterShade(window.scrollY, globeScrollGeometry.start, globeScrollGeometry.travel, h) / 255);
      const oceanPresence = isFocus ? 0.88 : 0.4 + depth * 0.46;
      const surfaceLight = isFocus ? 0.6 : (1 - depth) * (1 - abyss);

      // Text, rules and panels follow the same value (the ink flips where the water is mid-tone)
      const inkMixS = isFocus ? 0 : inkMixFromAbyss(abyss);
      const inkEndpoint =
        (inkMixS === 0 && lastInkMix !== 0) || (inkMixS === 1 && lastInkMix !== 1);
      if (Math.abs(inkMixS - lastInkMix) > 0.015 || inkEndpoint) {
        lastInkMix = inkMixS;
        applyAbyssPalette(inkMixS);
      }
      if (!isFocus && abyss !== lastWashAbyss) {
        lastWashAbyss = abyss;
        applyAbyssWash(abyss);
      }
      // The water is the plain page background (--ocean-background), which follows the abyss
      // and shows through this canvas; only the focus view still draws its own generative water.
      const plainWater = !isFocus;

      // MIGRATION — one scroll clock, including the final handoff. No elapsed-time easing.
      // Stop scrolling and every scene layer holds its exact frame immediately.
      const migOn = !isFocus && !prefersReducedMotion && migrationRunway.height > 1;
      const migTimeline = migrationAt(curScrollY, migrationRunway.top, migrationRunway.height, h);
      const migP = migOn ? migTimeline.p : 0;
      const migHandoff = migOn ? migTimeline.handoff : 0;
      const migActive = migOn && migP > 0 && migHandoff < 1;
      const mig = stagesAt(migActive ? migP : 0, migHandoff);
      const eng = migActive ? mig.engage : 0;
      if (wasMigrationActive && !migActive && migHandoff >= 1) {
        // Resume ambient swimming from the departing tracked pose, above the copy.
        for (const wh of whales) {
          wh.spineX.set(wh.dispX);
          wh.spineY.set(wh.dispY);
          wh.spineAngle.set(wh.dispAngle);
          wh.x = wh.dispX[0];
          wh.y = wh.dispY[0];
          wh.heading = wh.dispAngle[0];
        }
      }
      wasMigrationActive = migActive;
      // The main whale's length on screen, as the swim draws it
      const mainPx = Math.min(w, h) * 0.58 * (1 - entryCalm * 0.16) * (1 + depth * 0.1);
      let migCam: Camera | null = null;
      let migTravel = 0;
      if (migActive) {
        const vp = { w, h, whalePx: Math.min(w, h) * 0.58 };
        migCam = cameraAt(migP, vp);
        // Once the stage releases, the scene leaves with the page as the introduction rises
        migCam.oy -= migHandoff * h;
        migTravel = travelAt(migP);
      }
      if (eng > 0 || migLaneWeight > 0) {
        // The swim underneath is steered toward the scene's whales, so releasing them stays close by
        if (migCam) {
          for (let i = 0; i < 2; i++) {
            const hy = headY(i, migTravel);
            projectLane(migCam, WHALES[i].x(hy), hy, WHALES[i].z(hy), proj);
            migLanes[i].x = proj.x / Math.max(1, w);
            migLanes[i].y = proj.y / Math.max(1, h);
          }
        }
        directWhales('migration', eng, migLanes);
        migLaneWeight = eng;
      }
      // Scene-driven glyph motion: still when the scroll is still, and once the scene holds the
      // whales entirely, a function of p alone, so scrolling back shows the very same frames
      fxClock += dt * (1 - eng) + Math.abs(migP - lastMigP) * 24 * eng;
      lastMigP = migP;
      const fx = migActive ? migP * 24 : fxClock;

      // Reuse the cached backdrop and animation loop for an exact neutral background.
      if (waterBackdropCtx && (!backdropValid || abyss !== lastBackdropDepth)) {
        const shade = Math.round(255 * (1 - abyss));
        waterBackdropCtx.fillStyle = `rgb(${shade}, ${shade}, ${shade})`;
        waterBackdropCtx.fillRect(0, 0, backdropW, backdropH);
        lastBackdropDepth = abyss;
        backdropValid = true;
      }
      if (backdropValid && !plainWater) ctx.drawImage(waterBackdropCanvas, 0, 0, w, h);

      const cols = gridCols;
      const rows = gridRows;

      // 1B. Draw pre-rendered static hydrographic dot grid in 1 drawImage call
      if (!plainWater) ctx.drawImage(bgGridCanvas, 0, 0, w, h);

      // 2. Generative ASCII Ocean Shader (Separable Harmonics: 0 inner-loop trig calls, 0 random flicker)
      const oCols = oceanCols;
      const oRows = oceanRows;
      const descentShift = sm.smoothScrollY * 0.0024;
      const tSlow = time * 0.42;
      const mxOffset = mouseRef.current.active ? (mouseRef.current.x - 0.5) * 0.35 : 0;

      for (let oc = 0; oc < oCols; oc++) {
        const nx = oc / Math.max(1, oCols);
        const a1 = nx * 5.2 + tSlow + mxOffset;
        const a2 = nx * 2.7 - tSlow * 0.68;
        const a3 = nx * 13.5 + tSlow * 0.37;
        colSin1[oc] = Math.sin(a1);
        colCos1[oc] = Math.cos(a1);
        colSin2[oc] = Math.sin(a2);
        colCos2[oc] = Math.cos(a2);
        colSin3[oc] = Math.sin(a3);
        colCos3[oc] = Math.cos(a3);
        // Volumetric light shaft bands across horizontal span
        const shaft = Math.sin(nx * 9.5 - time * 0.19) * 0.5 + 0.5;
        colLight[oc] = shaft * shaft;
      }

      for (let or = 0; or < oRows; or++) {
        const ny = or / Math.max(1, oRows);
        const worldY = ny + descentShift;
        const b1 = worldY * 4.4 - tSlow * 0.52;
        const b2 = worldY * 7.8 + tSlow * 0.31;
        const b3 = worldY * 15.5 - tSlow * 0.23;
        rowSin1[or] = Math.sin(b1);
        rowCos1[or] = Math.cos(b1);
        rowSin2[or] = Math.sin(b2);
        rowCos2[or] = Math.cos(b2);
        rowSin3[or] = Math.sin(b3);
        rowCos3[or] = Math.cos(b3);
        // Surface light attenuation with depth (screen row) and with page depth
        rowDepth[or] = Math.max(0.12, 1 - ny * 0.78) * (0.35 + 0.65 * surfaceLight);
      }

      // Density rises with depth; the finer third harmonic adds intricacy deeper down
      const densityCutoff = 0.62 - oceanPresence * 0.34;
      const invSpan = 1 / Math.max(0.15, 1 - densityCutoff);
      const fineAmt = depth * 0.16;
      const inDossier = entryCalm <= 0.2;
      // Light crests belong to the surface; deeper water turns slate
      const crestThreshold = 0.38 + depth * 0.5;

      // Skipped entirely over plain water
      const minOceanRow = plainWater || migActive ? oRows : 0;
      for (let or = minOceanRow; or < oRows; or++) {
        const rs1 = rowSin1[or];
        const rc1 = rowCos1[or];
        const rs2 = rowSin2[or];
        const rc2 = rowCos2[or];
        const rs3 = rowSin3[or];
        const rc3 = rowCos3[or];
        const depthLight = rowDepth[or];
        const ny = or / Math.max(1, oRows);
        const py = or * oceanCell;

        // Gentle calm clearing around center of initial screen so conceptual typography breathes effortlessly
        const dyCenter = ny - 0.47;
        const centerRowFactor = entryCalm > 0.2 ? dyCenter * dyCenter : 1;

        for (let oc = 0; oc < oCols; oc++) {
          // sin(a1 + b1) = sin(a1)cos(b1) + cos(a1)sin(b1)
          const swellPrimary = colSin1[oc] * rc1 + colCos1[oc] * rs1;
          // cos(a2 - b2) = cos(a2)cos(b2) + sin(a2)sin(b2)
          const currentStream = colCos2[oc] * rc2 + colSin2[oc] * rs2;
          const sunbeam = colLight[oc] * depthLight;

          let waveVal = swellPrimary * 0.34 + currentStream * 0.24 + sunbeam * 0.32 + 0.36;
          if (fineAmt > 0.002) {
            // sin(a3 + b3): fine ripples that only emerge at depth
            waveVal += (colSin3[oc] * rc3 + colCos3[oc] * rs3) * fineAmt;
          }

          if (entryCalm > 0.2) {
            const dxCenter = oc / Math.max(1, oCols) - 0.5;
            const distSq = dxCenter * dxCenter * 0.9 + centerRowFactor * 2.2;
            if (distSq < 0.14) {
              waveVal *= 0.58 + (distSq / 0.14) * 0.42;
            }
          } else if (inDossier) {
            // CV sections: keep the reading column calmer than the margins
            waveVal *= colReading[oc];
          }

          if (waveVal > densityCutoff) {
            ctx.globalAlpha = 1;
            const norm = Math.min(0.999, (waveVal - densityCutoff) * invSpan);
            const gIdx = (norm * NUM_OCEAN_GLYPHS) | 0;

            let oceanRow = 9;
            if (entryCalm > 0.12 || isFocus || depth > 0.08) {
              if (sunbeam > crestThreshold && ny < 0.62) {
                oceanRow = 6; // Filtered muted-turquoise light crest (surface)
              } else if (norm > 0.56 - depth * 0.2) {
                oceanRow = 8; // Deep blue-slate swell (more frequent deeper)
              } else {
                oceanRow = 7; // Desaturated blue-gray current
              }
            }
            if (abyss > 0.004) {
              // Stable per-cell dither: cells progressively swap to the pale abyss tiers
              const hsh = ((((oc * 73856093) ^ (or * 19349663)) >>> 0) % 1024) / 1024;
              if (hsh < abyss) oceanRow = oceanRow === 6 ? 19 : oceanRow === 8 ? 21 : 20;
            }

            ctx.drawImage(
              atlasCanvas,
              gIdx * tilePx,
              oceanRow * tilePx,
              tilePx,
              tilePx,
              oc * oceanCell,
              py,
              cellSize,
              cellSize
            );
          }
        }
      }

      ctx.globalAlpha = 1;

      // 3. Clear only the dirty bounding box in our pre-allocated buffers
      for (let r = prevMinR; r <= prevMaxR; r++) {
        const rowOffset = r * cols;
        for (let c = prevMinC; c <= prevMaxC; c++) {
          const idx = rowOffset + c;
          zBuf[idx] = -999;
          occBuf[idx] = 0;
          haloBuf[idx] = 0;
        }
      }

      let curMinC = cols - 1;
      let curMaxC = 0;
      let curMinR = rows - 1;
      let curMaxR = 0;
      let currentWhaleLayer = 1;

      // Fast squared-distance splat into pre-allocated buffers
      const splatPoint = (
        wx: number,
        wy: number,
        zHeight: number,
        shade: number,
        tone: number,
        radiusPx: number
      ) => {
        const reach = radiusPx + cellSize * 0.52;
        const reachSq = reach * reach;
        const minC = Math.max(1, ((wx - reach) / cellSize) | 0);
        const maxC = Math.min(cols - 2, ((wx + reach) / cellSize) | 0);
        const minR = Math.max(1, ((wy - reach) / cellSize) | 0);
        const maxR = Math.min(rows - 2, ((wy + reach) / cellSize) | 0);

        if (minC < curMinC) curMinC = minC;
        if (maxC > curMaxC) curMaxC = maxC;
        if (minR < curMinR) curMinR = minR;
        if (maxR > curMaxR) curMaxR = maxR;

        for (let rr = minR; rr <= maxR; rr++) {
          const dy = rr * cellSize + cellSize * 0.5 - wy;
          const dySq = dy * dy;
          const rowOff = rr * cols;
          for (let cc = minC; cc <= maxC; cc++) {
            const dx = cc * cellSize + cellSize * 0.5 - wx;
            if (dx * dx + dySq <= reachSq) {
              const idx = rowOff + cc;
              if (zHeight > zBuf[idx]) {
                zBuf[idx] = zHeight;
                lumBuf[idx] = shade;
                toneBuf[idx] = tone;
                occBuf[idx] = currentWhaleLayer;
              }
            }
          }
        }
      };

      // 4. Update & Rasterize Each Whale (distant understated scale on entry screen, natural presence in depth)
      const entryDistanceScale = 1 - entryCalm * 0.16;
      for (let wIdx = 0; wIdx < whales.length; wIdx++) {
        currentWhaleLayer = wIdx + 1;
        const wh = whales[wIdx];
        if (!migActive) {
          // Feeding and sonar follow the projected anatomical spine of the actual 3D animal.
          // No mirrored 2D body or its independent kinematics run in the permanent ocean.
          const spine = ambientWhalesLive.spines[wIdx];
          for (let k = 0; k < SPINE_NODES; k++) {
            const n = Math.round(k * 47 / (SPINE_NODES - 1));
            wh.spineX[k] = spine[n * 2]; wh.spineY[k] = spine[n * 2 + 1];
            const tail = Math.min(47, n + 1);
            wh.spineAngle[k] = Math.atan2(spine[n * 2 + 1] - spine[tail * 2 + 1], spine[n * 2] - spine[tail * 2]);
          }
          wh.x = wh.spineX[0]; wh.y = wh.spineY[0]; wh.heading = wh.spineAngle[0];
          if (wIdx === 0) mainBodyLen = Math.min(w, h) * 0.51;
          continue;
        }
        // Whales grow slightly more present as the visitor descends (up to +10%)
        // whaleDirection.size < 1 while they dive into the Globe (GlobeDive in OceanEntry.tsx)
        const baseLen =
          Math.min(w, h) * (isFocus ? 0.66 : 0.58 * entryDistanceScale) * wh.scale * (1 + depth * 0.1) * whaleDirection.size;
        if (wIdx === 0) mainBodyLen = baseLen;

        // Freeze the ambient entry pose while this scroll sequence owns the animals.
        // In particular, a partly blended entrance must not keep swimming on a held page.
        if (!migActive || !wh.initialized) updateWhaleKinematics(wh, w, h, baseLen, wIdx, dtScale, entryCalm, rawDepth);

        // Migration: the displayed pose is the scene's, and so is the stroke (set by the distance
        // swum, so the tail stops with the scroll); the swim's own phases are restored after drawing
        const bodyLen = baseLen;
        const posed = eng > 0 && migCam !== null;
        const simSwim = wh.swimCycle;
        const simFin = wh.finCycle;
        const simTurn = wh.turnRate;
        let rollAngle = Math.max(-0.52, Math.min(0.52, wh.turnRate * 26 + Math.sin(wh.finCycle) * 0.14));
        if (posed) {
          const stroke = strokeAt(wIdx, migTravel);
          const bank = composeScenePose(wh, wIdx, migCam, migTravel, eng, stroke, mainPx, baseLen / (SPINE_NODES - 1));
          wh.swimCycle = lerpAngle(simSwim, stroke, eng);
          wh.finCycle = lerpAngle(simFin, stroke * 0.5 + 0.7, eng);
          rollAngle += (bank + Math.sin(wh.finCycle) * 0.1 - rollAngle) * eng;
          // The fins spread with the turn too: the scene's, not the swim's
          wh.turnRate += (bank / 26 - wh.turnRate) * eng;
        }
        const SX = posed ? wh.dispX : wh.spineX;
        const SY = posed ? wh.dispY : wh.spineY;
        const SA = posed ? wh.dispAngle : wh.spineAngle;

        const sinRoll = Math.sin(rollAngle);
        const cosRoll = Math.cos(rollAngle);

        const sampleSpine = (u: number) => {
          const f = u * (SPINE_NODES - 1);
          const i0 = f | 0;
          const i1 = i0 < SPINE_NODES - 1 ? i0 + 1 : i0;
          const frac = f - i0;
          const sx = SX[i0] + (SX[i1] - SX[i0]) * frac;
          const sy = SY[i0] + (SY[i1] - SY[i0]) * frac;

          let da = SA[i1] - SA[i0];
          while (da > Math.PI) da -= Math.PI * 2;
          while (da < -Math.PI) da += Math.PI * 2;
          const ang = SA[i0] + da * frac;
          const cosA = Math.cos(ang);
          const sinA = Math.sin(ang);

          return {
            x: sx,
            y: sy,
            ang,
            tx: cosA,
            ty: sinA,
            nx: -sinA,
            ny: cosA,
            scale: posed ? wh.dispScale[i0] + (wh.dispScale[i1] - wh.dispScale[i0]) * frac : 1,
            layerZ: (1 - wIdx) * 5
          };
        };

        const lightDirX = -0.55;
        const lightDirY = -0.65;
        const lightDirZ = 0.52;

        if (!posed) {
          // SIDE PROFILE — the whale seen from the side as it swims across the page: dark back,
          // pale pleated throat, mouth line and eye, one long pectoral fin and the flukes edge-on.
          // (The migration's overhead camera keeps the dorsal view drawn in A–C below.)
          const headAng = SA[0];
          // The back faces up the screen whichever way the whale swims
          const dorsalSign = Math.cos(headAng) >= 0 ? -1 : 1;
          // While turning around, the body is drawn foreshortened about its middle (see turnAround)
          const turnScale = sideTurnScale(wh);
          const pivotX = SX[SPINE_NODES >> 1];
          const sideX = (x: number) => pivotX + (x - pivotX) * turnScale;
          const splatSide = (x: number, y: number, z: number, shade: number, tone: number, r: number) =>
            splatPoint(sideX(x), y, z, shade, tone, r);

          // A'. BODY — one column of cells per station, from the belly edge to the back edge
          const uSteps = 84;
          for (let iu = 0; iu <= uSteps; iu++) {
            const u = iu / uSteps;
            const sp = sampleSpine(u);
            const Ls = bodyLen * sp.scale;
            const dorsal = profileAt(DORSAL_LUT, u) * Ls;
            const ventral = profileAt(VENTRAL_LUT, u) * Ls;
            const upX = sp.nx * dorsalSign;
            const upY = sp.ny * dorsalSign;
            // The stroke rides through the body as a gentle rise and fall toward the tail
            const heave = Math.cos(wh.swimCycle - u * 4.5) * u * u * 0.035 * Ls;
            const centre = (dorsal - ventral) * 0.5 + heave;
            const half = (dorsal + ventral) * 0.5;
            const steps = Math.max(4, Math.ceil((half * 2) / (cellSize * 0.58)));
            for (let il = 0; il <= steps; il++) {
              // -1 belly edge … +1 back edge
              const localY = (il / steps) * 2 - 1;
              const localZ = Math.sqrt(Math.max(0, 1 - localY * localY));
              const off = centre + localY * half;
              const wx = sp.x + upX * off;
              const wy = sp.y + upY * off;

              let anatomyShade: number;
              let tone: number;
              if (localY > 0.15) {
                // Dark back
                anatomyShade = 0.88;
                tone = 0.88;
                // Knobbed rostrum: the tubercles along the top of the head
                if (u < 0.15 && localY > 0.72 && Math.sin(u * 140) > 0.45) {
                  anatomyShade = 0.3;
                  tone = 0.3;
                }
              } else if (localY > -0.3 || u < 0.06 || u > 0.55) {
                // Flank
                anatomyShade = 0.66 - (0.15 - localY) * 0.18;
                tone = 0.6;
              } else {
                // Pale throat with its long ventral pleats, running along the body
                const pleat = Math.sin(localY * 30) * 0.5 + 0.5;
                anatomyShade = 0.22 + pleat * 0.3;
                tone = 0.18;
              }
              // Mouth line: from the tip of the jaw, curving down and back past the eye
              const mouthY = 0.02 - u * 1.9;
              if (u < 0.18 && Math.abs(localY - mouthY) < 0.1) {
                anatomyShade = 0.14;
                tone = 0.1;
              }
              // Eye, just above the corner of the mouth
              if (Math.abs(u - 0.17) < 0.012 && Math.abs(localY + 0.18) < 0.13) {
                anatomyShade = 0.12;
                tone = 0.1;
              }

              const worldNX = upX * localY;
              const worldNY = upY * localY;
              const diffuse = Math.max(0, worldNX * lightDirX + worldNY * lightDirY + Math.max(0.1, localZ) * lightDirZ);
              const caustic = Math.sin(wx * 0.045 + fx * 2.8) * Math.cos(wy * 0.045 - fx * 2.2) * 0.11;
              const finalShade = Math.max(0.08, Math.min(0.98, anatomyShade * 0.72 + (1 - diffuse) * 0.32 + caustic));
              splatSide(wx, wy, 10 + localZ * 3 + sp.layerZ, finalShade, tone, cellSize * 0.42);
            }
          }

          // B'. PECTORAL FIN — the near fin, long and pale, sweeping down and back from below the
          // throat; it rows slowly with the fin cycle. The far fin is hidden behind the body.
          {
            const root = sampleSpine(0.28);
            const Lr = bodyLen * root.scale;
            const upX = root.nx * dorsalSign;
            const upY = root.ny * dorsalSign;
            const rootOff = -profileAt(VENTRAL_LUT, 0.28) * Lr * 0.45;
            const rootX = root.x + upX * rootOff;
            const rootY = root.y + upY * rootOff;
            const sweep = 0.68 + Math.sin(wh.finCycle) * 0.14 + wh.turnRate * 6;
            // Tailward and downward directions in the screen plane
            const backX = -root.tx;
            const backY = -root.ty;
            const finLen = Lr * 0.3;
            const finSteps = 30;
            for (let is = 0; is <= finSteps; is++) {
              const s = is / finSteps;
              // The fin curves slightly further back toward its tip
              const a = sweep - s * s * 0.22;
              const dirX = backX * Math.cos(a) - upX * Math.sin(a);
              const dirY = backY * Math.cos(a) - upY * Math.sin(a);
              const cx = rootX + dirX * s * finLen;
              const cy = rootY + dirY * s * finLen;
              // Scalloped leading edge (the knobs of a humpback's flipper)
              const tubercle = Math.sin(s * Math.PI * 8.5) * 0.08 * (1 - s * 0.4);
              const chord = Lr * 0.062 * Math.sin(Math.pow(s, 0.42) * Math.PI) * (1 + tubercle);
              const chordSteps = Math.max(3, Math.ceil(chord / (cellSize * 0.52)));
              // Across the fin, toward its trailing (tailward) edge
              const perpX = -dirY;
              const perpY = dirX;
              const toTrail = perpX * backX + perpY * backY >= 0 ? 1 : -1;
              for (let ic = 0; ic <= chordSteps; ic++) {
                const c = ic / chordSteps;
                const off = (c - 0.3) * chord * toTrail;
                const leading = c < 0.35 || s > 0.8;
                splatSide(
                  cx + perpX * off,
                  cy + perpY * off,
                  14 + root.layerZ,
                  leading ? 0.2 + c * 0.2 : 0.5 + Math.sin(s * 6 + c * 4) * 0.12,
                  leading ? 0.12 : 0.5,
                  cellSize * 0.38
                );
              }
            }
          }

          // C'. FLUKES, EDGE-ON — the tail stock ends in the flukes seen from the side: a thin,
          // slightly forked blade that tilts up and down with each stroke.
          {
            const tail = sampleSpine(1);
            const Lt = bodyLen * tail.scale;
            const upX = tail.nx * dorsalSign;
            const upY = tail.ny * dorsalSign;
            const tilt = Math.cos(wh.swimCycle - 4.8) * 0.42;
            const span = Lt * 0.13;
            const steps = 18;
            for (const lobe of [-1, 1]) {
              const a = tilt + lobe * 0.12;
              const dirX = -tail.tx * Math.cos(a) + upX * Math.sin(a);
              const dirY = -tail.ty * Math.cos(a) + upY * Math.sin(a);
              for (let is = 0; is <= steps; is++) {
                const s = is / steps;
                const x = tail.x + dirX * s * span;
                const y = tail.y + dirY * s * span;
                const thick = Lt * 0.016 * (1 - s * 0.7);
                const tipEdge = s > 0.75;
                for (const side of [-1, 0, 1]) {
                  splatSide(
                    x + upX * side * thick,
                    y + upY * side * thick,
                    9.8 + tail.layerZ,
                    tipEdge ? 0.26 : 0.78,
                    tipEdge ? 0.16 : 0.8,
                    cellSize * 0.38
                  );
                }
                if (!migActive && is === steps && sm.activity > 0.12 && Math.random() < 0.3 * sm.activity) {
                  wakeParticles.push({
                    x: sideX(x),
                    y,
                    vx: -tail.tx * 0.6 + (Math.random() - 0.5) * 0.5,
                    vy: -tail.ty * 0.6 + (Math.random() - 0.5) * 0.5,
                    age: 0,
                    maxAge: 45 + Math.random() * 35,
                    size: (11 + Math.random() * 14) * wh.scale,
                    kind: 'vortex'
                  });
                }
              }
            }
          }
        } else {
        // A. MAIN BODY
        const uBodySteps = 78;
        for (let iu = 0; iu <= uBodySteps; iu++) {
          const u = iu / uBodySteps;
          const sp = sampleSpine(u);
          const Ls = bodyLen * sp.scale;
          let halfW = getBodyHalfWidthFast(u) * Ls;
          const verticalWave = Math.cos(wh.swimCycle - u * 4.5) * (0.04 + u * 0.08) * Ls;

          // FEEDING ANATOMY (main whale): jaws swing apart from the tip, throat pleats balloon
          const mouthAmt = wIdx === 0 ? feed.mouthOpen * (1 - eng) : 0;
          if (!migActive && wIdx === 0 && (mouthAmt > 0.01 || feed.gulp > 0.01)) {
            const throat = Math.exp(-((u - 0.27) * (u - 0.27)) / 0.012);
            halfW *= 1 + (mouthAmt * 0.22 + feed.gulp * 0.32) * throat;
          }
          const JAW_LEN = 0.24;
          const jawT = mouthAmt > 0.01 && u < JAW_LEN ? Math.pow(1 - u / JAW_LEN, 1.15) : 0;
          // Half-distance between the parted jaws at this station
          const gapePx = jawT * mouthAmt * Ls * 0.085;
          if (gapePx > 0) halfW = Math.max(halfW, Ls * 0.03); // jaws keep some thickness at the tip

          const latSteps = Math.max(6, Math.ceil((halfW * 2) / (cellSize * 0.58)));
          for (let il = 0; il <= latSteps; il++) {
            const localY = (il / latSteps) * 2 - 1;
            const localZ = Math.sqrt(Math.max(0, 1 - localY * localY));

            const rolledLat = localY * cosRoll - localZ * sinRoll * 0.35;
            const rolledZ = localY * sinRoll + localZ * cosRoll;

            // Each half of the head becomes a jaw, displaced outward by the gape
            const jawOffset = gapePx > 0 ? (localY >= 0 ? 1 : -1) * gapePx : 0;

            const wx = sp.x + sp.nx * (rolledLat * halfW + jawOffset);
            const wy = sp.y + sp.ny * (rolledLat * halfW + jawOffset) - verticalWave * 0.25;

            const worldNX = sp.nx * rolledLat;
            const worldNY = sp.ny * rolledLat;
            const worldNZ = Math.max(0.1, rolledZ);
            const diffuse = Math.max(0, worldNX * lightDirX + worldNY * lightDirY + worldNZ * lightDirZ);

            let anatomyShade = 0.68;
            let tone = 0.55;

            if (u < 0.16) {
              const isJawEdge = Math.abs(localY) > 0.72;
              anatomyShade = isJawEdge ? 0.32 : 0.78;
              tone = isJawEdge ? 0.2 : 0.75;
            } else if (u > 0.15 && u < 0.19 && Math.abs(localY) < 0.18) {
              anatomyShade = 0.95;
              tone = 0.95;
            } else if (u > 0.58 && u < 0.70 && Math.abs(localY) < 0.22) {
              anatomyShade = 0.94;
              tone = 0.92;
            } else if (Math.abs(localY) < 0.24) {
              anatomyShade = 0.84;
              tone = 0.85;
            } else if (localY * sinRoll > 0.25 && u > 0.12 && u < 0.52) {
              const pleat = Math.sin(localY * 26) * 0.5 + 0.5;
              anatomyShade = 0.25 + pleat * 0.35;
              tone = 0.18;
            }

            // Pale lip line along the inner edge of each parted jaw
            if (gapePx > cellSize * 0.2 && Math.abs(localY) < 0.28) {
              anatomyShade = 0.16;
              tone = 0.12;
            }

            const caustic = Math.sin(wx * 0.045 + fx * 2.8) * Math.cos(wy * 0.045 - fx * 2.2) * 0.11;
            const finalShade = Math.max(
              0.08,
              Math.min(0.98, anatomyShade * 0.65 + (1 - diffuse) * 0.42 + caustic)
            );

            splatPoint(
              wx,
              wy,
              10 + rolledZ * 3 + sp.layerZ,
              finalShade,
              tone,
              cellSize * 0.42
            );
          }

          // Open-mouth interior between the jaws: deep navy cavity with baleen fringe (tone flag 2)
          if (gapePx > cellSize * 0.3) {
            const inner = gapePx * 0.9;
            const cavSteps = Math.max(2, Math.ceil((inner * 2) / (cellSize * 0.55)));
            for (let ic = 0; ic <= cavSteps; ic++) {
              const off = (ic / cavSteps) * 2 * inner - inner;
              splatPoint(
                sp.x + sp.nx * off,
                sp.y + sp.ny * off - verticalWave * 0.25,
                8.5,
                0.97,
                2,
                cellSize * 0.4
              );
            }
          }
        }

        // B. LONG SCALLOPED PECTORAL FINS
        const finRootSp = sampleSpine(0.26);
        const finL = bodyLen * finRootSp.scale;
        const finLength = finL * 0.36;
        const finSpanSteps = 34;

        for (const side of [-1, 1]) {
          const strokeBase = Math.sin(wh.finCycle + (side === 1 ? 0 : 0.15));
          const turnExtend = 1 + side * wh.turnRate * 14;
          const bankForeshorten = Math.max(0.45, Math.min(1.18, 1 + side * sinRoll * 0.38));

          const rootOffset = getBodyHalfWidthFast(0.26) * finL * 0.82;
          const rootX = finRootSp.x + finRootSp.nx * side * rootOffset;
          const rootY = finRootSp.y + finRootSp.ny * side * rootOffset;

          for (let is = 0; is <= finSpanSteps; is++) {
            const s = is / finSpanSteps;
            const dynamicSweep =
              0.52 + strokeBase * 0.24 + Math.pow(s, 1.5) * (0.28 - Math.cos(wh.finCycle) * 0.18);

            const finAng = finRootSp.ang + side * (Math.PI * 0.5 + dynamicSweep);
            const dist = s * finLength * bankForeshorten * Math.max(0.7, Math.min(1.25, turnExtend));

            const tipCurveBack = s * s * finL * 0.08;
            const cosFA = Math.cos(finAng);
            const sinFA = Math.sin(finAng);
            const fCenterX = rootX + cosFA * dist - finRootSp.tx * tipCurveBack;
            const fCenterY = rootY + sinFA * dist - finRootSp.ty * tipCurveBack;

            const tubercleBump = Math.sin(s * Math.PI * 8.5) * 0.08 * (1 - s * 0.4);
            const chordWidth =
              finL * 0.088 * Math.sin(Math.pow(s, 0.42) * Math.PI) * (1 + tubercleBump);

            const chordSteps = Math.max(4, Math.ceil(chordWidth / (cellSize * 0.52)));
            const fPerpX = -sinFA * side;
            const fPerpY = cosFA * side;

            for (let ic = 0; ic <= chordSteps; ic++) {
              const cNorm = ic / chordSteps;
              const offset = (cNorm - 0.35) * chordWidth;
              const wx = fCenterX - fPerpX * offset;
              const wy = fCenterY - fPerpY * offset;

              const isLeadingOrTip = cNorm < 0.32 || s > 0.76;
              const finShade = isLeadingOrTip
                ? 0.18 + cNorm * 0.25
                : 0.62 + Math.sin(s * 6 + cNorm * 4) * 0.15;
              const finTone = isLeadingOrTip ? 0.12 : 0.65;

              const finZ = 9.5 + Math.sin(wh.finCycle - s) * 1.5 + finRootSp.layerZ;
              splatPoint(wx, wy, finZ, finShade, finTone, cellSize * 0.38);
            }
          }
        }

        // C. BUTTERFLY TAIL FLUKES
        const flukeRootSp = sampleSpine(0.92);
        const flukeL = bodyLen * flukeRootSp.scale;
        const flukeSpan = flukeL * 0.29;
        const flukeSteps = 28;

        const flukeWhipAngle = Math.cos(wh.swimCycle - 4.8) * 0.32;
        const flukeScale3D = 0.88 + 0.18 * Math.sin(wh.swimCycle - 4.2);

        for (const side of [-1, 1]) {
          for (let is = 0; is <= flukeSteps; is++) {
            const s = is / flukeSteps;
            const sweepBack = Math.pow(s, 1.45) * 0.48 + Math.sin(wh.swimCycle - 5.2) * 0.12 * s;
            const flukeAng =
              flukeRootSp.ang + flukeWhipAngle + side * (Math.PI * 0.5 + sweepBack);

            const dist = s * flukeSpan * flukeScale3D;
            const fx = flukeRootSp.x + Math.cos(flukeAng) * dist;
            const fy = flukeRootSp.y + Math.sin(flukeAng) * dist;

            const notchProfile = s < 0.15 ? s / 0.15 : 1.0;
            const flukeChord =
              flukeL *
              0.095 *
              Math.sin(Math.sqrt(s) * Math.PI) *
              (0.55 + 0.45 * notchProfile);

            const chordSteps = Math.max(3, Math.ceil(flukeChord / (cellSize * 0.52)));
            for (let ic = 0; ic <= chordSteps; ic++) {
              const cNorm = ic / chordSteps;
              const wx = fx - flukeRootSp.tx * (cNorm * flukeChord);
              const wy = fy - flukeRootSp.ty * (cNorm * flukeChord);

              const isLightEdge = s > 0.72 || cNorm > 0.74;
              const shade = isLightEdge ? 0.24 : 0.76 - cNorm * 0.18;
              const tone = isLightEdge ? 0.15 : 0.8;

              splatPoint(
                wx,
                wy,
                9.8 + (flukeScale3D - 0.88) * 8 + flukeRootSp.layerZ,
                shade,
                tone,
                cellSize * 0.4
              );
            }

            if (!migActive && is === flukeSteps && sm.activity > 0.12 && Math.random() < 0.3 * sm.activity * (1 - eng)) {
              wakeParticles.push({
                x: fx,
                y: fy,
                vx: -flukeRootSp.tx * 0.6 + (Math.random() - 0.5) * 0.5,
                vy: -flukeRootSp.ty * 0.6 + (Math.random() - 0.5) * 0.5,
                age: 0,
                maxAge: 45 + Math.random() * 35,
                size: (11 + Math.random() * 14) * wh.scale,
                kind: 'vortex'
              });
            }
          }
        }
        }

        if (!migActive && Math.random() < (0.05 + sm.activity * 0.18) * (1 - eng)) {
          const blowSp = sampleSpine(0.17);
          wakeParticles.push({
            x: blowSp.x + (Math.random() - 0.5) * 10,
            y: blowSp.y + (Math.random() - 0.5) * 10,
            vx: -blowSp.tx * 0.35 + (Math.random() - 0.5) * 0.3,
            vy: -blowSp.ty * 0.35 + (Math.random() - 0.5) * 0.3,
            age: 0,
            maxAge: 35 + Math.random() * 30,
            size: (8 + Math.random() * 9) * wh.scale,
            kind: 'bubble'
          });
        }
        wh.swimCycle = simSwim;
        wh.finCycle = simFin;
        wh.turnRate = simTurn;
      }

      if (wakeParticles.length > 60) {
        wakeParticles.splice(0, wakeParticles.length - 60);
      }

      // 4. (end) The dive's wake: record the lead whale's head while it dives into the Globe
      if (!migActive && ambientWhalesLive.presence > 0.1 && whaleDirection.size < 0.97) {
        const hx = whales[0].spineX[0];
        const hy = whales[0].spineY[0];
        const last = wakeCount - 1;
        if (wakeCount === 0 || Math.hypot(hx - wakeX[last], hy - wakeY[last]) > 7) {
          if (wakeCount === WAKE_POINTS) {
            wakeX.copyWithin(0, 1);
            wakeY.copyWithin(0, 1);
            wakeCount--;
          }
          wakeX[wakeCount] = hx;
          wakeY[wakeCount] = hy;
          wakeCount++;
        }
      } else {
        wakeCount = 0;
      }

      // 4A. READING CLEARANCE — whales keep their path, but where their tiles pass behind a
      // measured line of page text (or the hero typography) they draw at reduced strength with a
      // soft one-cell falloff, so the copy stays legible without any panel behind it. Computed
      // before the occlusion fill, which leaves the cells right behind a line open.
      const rdMinC = Math.max(1, curMinC - 1);
      const rdMaxC = Math.min(cols - 2, curMaxC + 1);
      const rdMinR = Math.max(1, curMinR - 1);
      const rdMaxR = Math.min(rows - 2, curMaxR + 1);
      for (let r = rdMinR; r <= rdMaxR; r++) readingBuf.fill(0, r * cols + rdMinC, r * cols + rdMaxC + 1);
      if (!isFocus && rdMaxC >= rdMinC) {
        const lines = readingZones.read();
        for (let i = 0; i < lines.length; i++) {
          const ln = lines[i];
          const c0 = Math.max(rdMinC, Math.floor(ln.left / cellSize) - 1);
          const c1 = Math.min(rdMaxC, Math.floor((ln.left + ln.width) / cellSize) + 1);
          const r0 = Math.max(rdMinR, Math.floor(ln.top / cellSize) - 1);
          const r1 = Math.min(rdMaxR, Math.floor((ln.top + ln.height) / cellSize) + 1);
          for (let r = r0; r <= r1; r++) {
            const edgeR = r === r0 || r === r1;
            const off = r * cols;
            for (let c = c0; c <= c1; c++) {
              const level = edgeR || c === c0 || c === c1 ? 1 : 2;
              if (level > readingBuf[off + c]) readingBuf[off + c] = level;
            }
          }
        }
      }

      // 4C. MIGRATION SCENE — the spherical ocean, its wakes and the trails (behind the whales)
      if (migCam && mig.water > 0) {
        const t0 = performance.now();
        drawMigrationScene(migCam, migP, migTravel, mig);
        migrationStats.sceneMs += (performance.now() - t0 - migrationStats.sceneMs) * 0.1;
      }

      // 2B. Subtle drifting deep-water particles (restrained count, zero flicker). Screen-space,
      // so they give way while the migration's world-anchored water is on screen.
      ambientOffsetY = (ambientOffsetY - sm.velocity * 0.00038 * dtScale + 10) % 1;
      const dotLimit = migActive ? 0 : prefersReducedMotion ? 24 : 48;
      if (mig.water > 0) ctx.globalAlpha = 1 - mig.water;
      for (let i = 0; i < dotLimit; i++) {
        const d = ambientDots[i];
        const cx = (((d.nx + time * d.speedX * 0.65 + 10) % 1) * cols) | 0;
        const cy = (((d.ny + ambientOffsetY + 10) % 1) * rows) | 0;
        const inAbyss = abyss > 0.004 && ((i * 37) % 100) / 100 < abyss;
        ctx.drawImage(
          atlasCanvas,
          (inAbyss ? d.glyphIdx + 1 : d.glyphIdx) * tilePx,
          (inAbyss ? 20 : 5) * tilePx,
          tilePx,
          tilePx,
          cx * cellSize,
          cy * cellSize,
          cellSize,
          cellSize
        );
      }
      ctx.globalAlpha = 1;

      // The ocean sound bed (when sound is on) darkens with the descent
      setSoundDepth(Math.max(abyss, rawDepth * 0.4));

      // 2B'. MARINE SNOW — in dark water only, sparse flecks pass upward faster than the page as
      // the visitor descends (the reader is the one sinking) and settle into a slow fall when the
      // page holds still. Never over a line of text; absent on white water and without motion.
      const snowPresence = migActive || prefersReducedMotion ? 0 : Math.max(0, Math.min(1, (abyss - 0.22) / 0.4));
      if (snowPresence > 0.01) {
        const snowCount = w < 768 ? 34 : MARINE_SNOW.length;
        const lines = readingZones.read();
        const scrollNow = window.scrollY;
        ctx.font = '500 13px "JetBrains Mono", monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = 'rgb(198, 220, 214)';
        for (let i = 0; i < snowCount; i++) {
          const f = MARINE_SNOW[i];
          const span = h + 40;
          const y = ((((f.ny * span - scrollNow * f.par + time * f.sink) % span) + span) % span) - 20;
          const x = (f.nx * w + Math.sin(time * f.swayF + f.phase) * f.sway + w) % w;
          let behindText = false;
          for (let k = 0; k < lines.length; k++) {
            const r = lines[k];
            if (x > r.left - 6 && x < r.left + r.width + 6 && y > r.top - 6 && y < r.top + r.height + 6) {
              behindText = true;
              break;
            }
          }
          if (behindText) continue;
          ctx.globalAlpha = snowPresence * f.alpha;
          ctx.fillText(f.glyph, x, y);
        }
        ctx.globalAlpha = 1;
      }

      // 2B''. SONAR RING — glyphs along a spreading circle, in the water's ink (slate on light
      // water, seafoam in the deep), passing beneath the whales and never over a line of text
      const nowS = performance.now() / 1000;
      while (pings.length && nowS - pings[0].at > 3) pings.shift();
      if (pings.length) {
        const deep = Math.max(0, Math.min(1, (abyss - 0.4) / 0.25));
        sonarInk = `rgb(${Math.round(47 + 123 * deep)}, ${Math.round(72 + 152 * deep)}, ${Math.round(88 + 126 * deep)})`;
        const lines = readingZones.read();
        ctx.font = '500 12px "JetBrains Mono", monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = sonarInk;
        for (const ping of pings) {
          const age = nowS - ping.at;
          const strength = pingStrength(age);
          if (strength <= 0.01) continue;
          for (const [offset, share, glyph] of [[0, 1, ':'], [-16, 0.45, '·']] as const) {
            const radius = pingRadius(age) + offset;
            if (radius < 4) continue;
            const count = Math.max(8, Math.round((Math.PI * 2 * radius) / 13));
            ctx.globalAlpha = Math.min(1, strength * share * 0.95);
            for (let k = 0; k < count; k++) {
              const a = (k / count) * Math.PI * 2;
              const x = ping.x + Math.cos(a) * radius;
              const y = ping.y + Math.sin(a) * radius;
              if (x < -8 || x > w + 8 || y < -8 || y > h + 8) continue;
              let behindText = false;
              for (let li = 0; li < lines.length; li++) {
                const r = lines[li];
                if (x > r.left - 4 && x < r.left + r.width + 4 && y > r.top - 4 && y < r.top + r.height + 4) {
                  behindText = true;
                  break;
                }
              }
              if (!behindText) ctx.fillText(glyph, x, y);
            }
          }
        }
        ctx.globalAlpha = 1;
      }

      // 2B'''. THE WAKE BECOMES THE ROUTE — while the whales dive into the Globe, the lead whale's
      // path is drawn in the Globe's route navy, ending where it meets the journey's first city;
      // it fades as the Globe's own route takes over
      diveWake.strength = 0;
      if (wakeCount > 1) {
        const dive = Math.min(1, (1 - whaleDirection.size) / 0.68);
        const takeover = Math.max(0, Math.min(1, (globeScrollProgress() - 0.015) / 0.045));
        const strength = dive * (1 - takeover);
        diveWake.x = wakeX[wakeCount - 1];
        diveWake.y = wakeY[wakeCount - 1];
        diveWake.strength = strength;
        diveWake.reach = Math.min(1, dive * 1.2);
        if (strength > 0.01) {
          ctx.font = '500 12px "JetBrains Mono", monospace';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillStyle = 'rgb(31, 59, 87)';
          for (let i = 0; i < wakeCount; i++) {
            const age = (wakeCount - 1 - i) / WAKE_POINTS;
            ctx.globalAlpha = strength * 0.85 * (1 - age) * (1 - age);
            ctx.fillText(i % 3 === 0 ? '.' : '·', wakeX[i], wakeY[i]);
          }
          ctx.globalAlpha = 1;
        }
      }

      // 2C. DEEP-WATER SILHOUETTE (Stage 5): a distant manta ray glides past now and then,
      // only once the visitor has descended, drawn in the faintest halo glyphs ('.' ':')
      const rayVis = isFocus || prefersReducedMotion || migActive ? 0 : Math.max(0, Math.min(1, (depth - 0.35) / 0.25));
      if (!mantaRay.active) {
        mantaRay.wait -= dt;
        if (mantaRay.wait <= 0 && rayVis > 0.25) {
          mantaRay.active = true;
          mantaRay.dir = Math.random() < 0.5 ? 1 : -1;
          mantaRay.span = Math.min(w, h) * rand(0.11, 0.15);
          mantaRay.x = mantaRay.dir > 0 ? -mantaRay.span * 2.2 : w + mantaRay.span * 2.2;
          mantaRay.baseY = h * (Math.random() < 0.5 ? rand(0.16, 0.3) : rand(0.68, 0.82));
          mantaRay.speed = rand(0.55, 0.85);
          mantaRay.phase = Math.random() * 6.28;
        }
      }
      if (mantaRay.active) {
        mantaRay.x += mantaRay.dir * mantaRay.speed * dtScale;
        const S = mantaRay.span;
        const L = S * 0.85;
        const rx = mantaRay.x;
        const ry = mantaRay.baseY + Math.sin(time * 0.35 + mantaRay.phase) * h * 0.02;
        const flap = 0.82 + 0.18 * Math.sin(time * 1.4 + mantaRay.phase);
        const offscreen = mantaRay.dir > 0 ? rx - L * 2 > w : rx + L * 2 < 0;
        if (offscreen) {
          mantaRay.active = false;
          mantaRay.wait = rand(16, 32);
        } else if (rayVis > 0.01) {
          ctx.globalAlpha = 0.55 * rayVis;
          const c0 = Math.max(0, ((rx - L * 2) / cellSize) | 0);
          const c1 = Math.min(cols - 1, ((rx + L * 1.2) / cellSize) | 0);
          const r0 = Math.max(0, ((ry - S) / cellSize) | 0);
          const r1 = Math.min(rows - 1, ((ry + S) / cellSize) | 0);
          for (let rr = r0; rr <= r1; rr++) {
            const l = (rr * cellSize + cellSize * 0.5 - ry) / S;
            for (let cc = c0; cc <= c1; cc++) {
              const f = ((cc * cellSize + cellSize * 0.5 - rx) * mantaRay.dir) / L; // -1 tail … 1 head
              let stamp = -1;
              if (f > -0.9 && f < 1) {
                // Diamond-like wing planform with a rounded leading edge
                const hs = Math.pow(Math.max(0, 1 - Math.abs(f - 0.12) / 0.92), 0.75) * flap;
                const al = Math.abs(l);
                if (al < hs) stamp = al < hs * 0.55 ? 1 : 0;
              } else if (f <= -0.9 && f > -1.7 && Math.abs(l) < 0.035) {
                stamp = 0; // thin tail
              }
              if (stamp >= 0) {
                // Dark halo glyphs in light water, pale teal glyphs ('.' ':') in the abyss
                if (abyss > 0.5) {
                  ctx.drawImage(atlasCanvas, (stamp + 1) * tilePx, 19 * tilePx, tilePx, tilePx, cc * cellSize, rr * cellSize, cellSize, cellSize);
                } else {
                  ctx.drawImage(atlasCanvas, stamp * tilePx, 5 * tilePx, tilePx, tilePx, cc * cellSize, rr * cellSize, cellSize, cellSize);
                }
              }
            }
          }
          ctx.globalAlpha = 1;
        }
      }

      // 2D. DEEP-OCEAN BIOLUMINESCENT JELLYFISH — Far & Mid depth planes (behind the whales)
      if (!migActive) renderJellyfishPlanes(w, h, rawDepth, abyss, surfaceBaseY, 0, 1);

      // 5. Render Wake Vortices & Bubble Trails
      for (let i = migActive ? -1 : wakeParticles.length - 1; i >= 0; i--) {
        const pt = wakeParticles[i];
        pt.x += pt.vx * dtScale;
        pt.y += (pt.vy - sm.velocity * 0.18) * dtScale;
        pt.age += dtScale;
        if (pt.age >= pt.maxAge) {
          wakeParticles.splice(i, 1);
          continue;
        }
        const progress = pt.age / pt.maxAge;
        const rad = pt.size * (0.4 + progress * 1.1);
        const cCol = (pt.x / cellSize) | 0;
        const cRow = (pt.y / cellSize) | 0;
        const span = Math.ceil(rad / cellSize);

        for (let dr = -span; dr <= span; dr++) {
          const rr = cRow + dr;
          if (rr < 0 || rr >= rows) continue;
          for (let dc = -span; dc <= span; dc++) {
            const cc = cCol + dc;
            if (cc < 0 || cc >= cols) continue;
            if (occBuf[cc + rr * cols] > 0) continue;

            const d = Math.hypot(dc * cellSize, dr * cellSize);
            const isRing =
              pt.kind === 'vortex'
                ? Math.abs(d - rad * 0.7) < cellSize * 0.9
                : d < rad * 0.6;
            if (isRing) {
              const stampIdx = progress < 0.4 ? 2 : progress < 0.75 ? 1 : 0;
              ctx.drawImage(
                atlasCanvas,
                stampIdx * tilePx,
                5 * tilePx,
                tilePx,
                tilePx,
                cc * cellSize,
                rr * cellSize,
                cellSize,
                cellSize
              );
            }
          }
        }
      }

      // 5B. FEEDING ENCOUNTER — fish school simulation (drawn beneath the whale tiles)
      const scrollDeltaPx = sm.smoothScrollY - lastSmoothScrollY;
      lastSmoothScrollY = sm.smoothScrollY;
      // Paused while the migration holds the whales: the scene owns their path
      if (!prefersReducedMotion && !isFocus && !migActive && ambientWhalesLive.presence > 0.1) {
        const mainWh = whales[0];
        const headX = mainWh.spineX[0];
        const headY = mainWh.spineY[0];
        const hx = Math.cos(mainWh.heading);
        const hy = Math.sin(mainWh.heading);
        const scrollingNow = sm.activity > 0.08;

        if (feed.state === 'idle') {
          let ready = false;
          if (!feed.firstDone) {
            // First encounter: fixed short delay after arrival, scrolling or not
            feed.timer -= dt;
            ready = feed.timer <= 0;
          } else {
            // Later encounters: ~10s without scrolling (any scroll resets), then a small random delay
            if (scrollingNow) feed.idleForFeed = 0;
            else feed.idleForFeed += dt;
            ready = feed.idleForFeed >= 10 + feed.extraDelay;
          }
          // The whale no longer hunts: no school is ever spawned
          if (ready && FEEDING_ENABLED) {
            const headVisible = headX > w * 0.04 && headX < w * 0.96 && headY > h * 0.06 && headY < h * 0.94;
            if (headVisible && auto.phase !== 'offscreen' && auto.phase !== 'return') {
              spawnSchool(headX, headY, hx, hy, w, h, scrollingNow);
            } else if (!feed.firstDone) {
              feed.timer = 0.8; // whale out of view: try again shortly
            }
          }
        }

        let wantMouth = false;
        if (feed.state !== 'idle') {
          feed.age += dt;
          // The school lives in the water: it drifts with the scrolled page (parallax)
          const waterShiftY = -scrollDeltaPx * 0.7;
          const reach = mainBodyLen * 0.4;
          const eatRadius = mainBodyLen * 0.075 + 14;

          if (feed.state === 'school') {
            // Ease toward the whale's path (projection of the school onto its heading line)
            const relX = feed.cx - headX;
            const relY = feed.cy - headY;
            const along = relX * hx + relY * hy;
            const pathX = headX + hx * Math.max(0, along);
            const pathY = headY + hy * Math.max(0, along);
            const interceptX = (pathX - feed.cx) * Math.min(1, 0.012 * dtScale);
            const interceptY = (pathY - feed.cy) * Math.min(1, 0.008 * dtScale);
            const maxStep = 1.1 * dtScale;
            feed.cx += Math.max(-maxStep, Math.min(maxStep, interceptX)) + feed.swimDir * 0.35 * dtScale;
            feed.cy += Math.max(-maxStep, Math.min(maxStep, interceptY)) + waterShiftY;
            if (!scrollingNow) {
              // Idle: a school waiting just beyond the edge swims into view
              const clampedY = Math.max(h * 0.12, Math.min(h * 0.88, feed.cy));
              feed.cy += Math.max(-0.9 * dtScale, Math.min(0.9 * dtScale, clampedY - feed.cy));
            }
            if (feed.isFirst && feed.age > 3.2 && !feed.lungeSeen) {
              // First encounter must complete within ~5–8s: the school swims into the whale's path
              const meetX = headX + hx * reach * 0.6;
              const meetY = headY + hy * reach * 0.6;
              const step = Math.min(1, (feed.age - 3.2) / 2) * 1.8 * dtScale;
              const mdx = meetX - feed.cx;
              const mdy = meetY - feed.cy;
              const md = Math.hypot(mdx, mdy);
              if (md > 1) {
                feed.cx += (mdx / md) * Math.min(md, step);
                feed.cy += (mdy / md) * Math.min(md, step);
              }
            }

            // Encounter can no longer complete naturally → scatter
            const distToHead = Math.hypot(relX, relY);
            const behind = along < -mainBodyLen * 0.25;
            const offView = feed.cy < -h * 0.4 || feed.cy > h * 1.4 || feed.cx < -w * 0.15 || feed.cx > w * 1.15;
            if (offView || feed.age > 13 || (behind && !feed.isFirst && distToHead > mainBodyLen * 0.5 && feed.age > 2)) {
              scatterSchool();
            }
          }

          let alive = 0;
          let mouthCandidates = 0;
          // Whale's lateral axis: fish escaping a lunge dart sideways, not straight ahead
          const latX = -hy;
          const latY = hx;
          const fleeR = mainBodyLen * 0.42;
          const mouthHalfW = mainBodyLen * 0.085 * (1 + feed.mouthOpen * 0.6);
          const fishList = feed.fish;
          for (let i = 0; i < fishList.length; i++) {
            const f = fishList[i];
            f.t += dt;
            if (f.state === 'swim') {
              alive++;
              // 1. Home slot inside the elongated school, with a slow wave travelling through it
              const morph = 1 + Math.sin(time * 0.45 + f.phase) * 0.12;
              const gx = feed.cx + f.ox * morph;
              const gy = feed.cy + f.oy + Math.sin(time * 0.9 - f.ox * 0.035) * 4;
              let ax = (gx - f.x) * 0.0022;
              let ay = (gy - f.y) * 0.003;

              // 2. Flocking: align with neighbours, keep a small personal space
              let avx = 0;
              let avy = 0;
              let n = 0;
              let sepX = 0;
              let sepY = 0;
              for (let j = 0; j < fishList.length; j++) {
                if (j === i) continue;
                const o = fishList[j];
                if (o.state !== 'swim') continue;
                const ddx = f.x - o.x;
                const ddy = f.y - o.y;
                if (ddx > 36 || ddx < -36 || ddy > 36 || ddy < -36) continue;
                const d2 = ddx * ddx + ddy * ddy;
                avx += o.vx;
                avy += o.vy;
                n++;
                if (d2 < 110 && d2 > 0.01) {
                  sepX += ddx / d2;
                  sepY += ddy / d2;
                }
              }
              if (n > 0) {
                ax += (avx / n - f.vx) * 0.045;
                ay += (avy / n - f.vy) * 0.045;
              }
              ax += sepX * 0.9 + feed.swimDir * 0.012;
              ay += sepY * 0.9;

              // 3. The whale: fish in the mouth's path are drawn in, the others part sideways
              const rx = f.x - headX;
              const ry = f.y - headY;
              const d = Math.hypot(rx, ry);
              const along = rx * hx + ry * hy;
              const lat = rx * latX + ry * latY;
              let fleeing = false;
              if (d < fleeR) {
                if (along > -eatRadius && d < reach) mouthCandidates++;
                const inMouthPath = along > -eatRadius && along < reach && Math.abs(lat) < mouthHalfW;
                if (inMouthPath && feed.mouthOpen > 0.3 && d > 1) {
                  const pull = Math.min(d, 2.4 * dtScale * feed.mouthOpen);
                  f.x -= (rx / d) * pull;
                  f.y -= (ry / d) * pull;
                } else if (!inMouthPath) {
                  const side = lat >= 0 ? 1 : -1;
                  const k = 1 - d / fleeR;
                  ax += (latX * side * 0.38 + hx * 0.08) * k;
                  ay += (latY * side * 0.38 + hy * 0.08) * k;
                  fleeing = true;
                }
              }

              // 4. Integrate: fish prefer level swimming and a narrow speed band
              f.vx += ax * dtScale;
              f.vy += ay * dtScale;
              f.vy *= Math.pow(0.94, dtScale);
              const sp = Math.hypot(f.vx, f.vy);
              const maxS = fleeing ? 3.6 : 2.0;
              if (sp > maxS) {
                f.vx *= maxS / sp;
                f.vy *= maxS / sp;
              } else if (sp < 0.45 && sp > 0.0001) {
                f.vx *= 0.45 / sp;
                f.vy *= 0.45 / sp;
              }
              f.x += f.vx * dtScale;
              f.y += f.vy * dtScale + waterShiftY;
              f.alpha = Math.min(1, f.alpha + dt * 1.2);

              if (d < eatRadius && feed.mouthOpen > 0.25 && along > -eatRadius) {
                f.state = 'eaten';
                f.t = 0;
                feed.eatenCount++;
                feed.lungeSeen = true;
                feed.gulp = Math.min(1, feed.gulp + 0.1);
                if (feed.eatenCount % 9 === 1) {
                  wakeParticles.push({
                    x: headX + (Math.random() - 0.5) * 8,
                    y: headY + (Math.random() - 0.5) * 8,
                    vx: -hx * 0.3,
                    vy: -hy * 0.3,
                    age: 0,
                    maxAge: 30 + Math.random() * 20,
                    size: 7 + Math.random() * 5,
                    kind: 'bubble'
                  });
                }
              }
            } else if (f.state === 'eaten') {
              // Drawn into the mouth, vanishing quickly
              f.x += (headX - f.x) * Math.min(1, 0.35 * dtScale);
              f.y += (headY - f.y) * Math.min(1, 0.35 * dtScale);
              f.alpha = Math.max(0, f.alpha - dt * 5);
            } else {
              // Scatter outward, slow down and thin out progressively
              f.x += f.vx * dtScale;
              f.y += f.vy * dtScale + waterShiftY;
              f.vx *= Math.pow(0.988, dtScale);
              f.vy *= Math.pow(0.97, dtScale);
              if (f.t > 0) f.alpha = Math.max(0, f.alpha - dt * 0.7);
            }
          }
          wantMouth = mouthCandidates > 0;

          // After the lunge, survivors regroup briefly, then the school disperses
          if (feed.state === 'school' && feed.lungeSeen && !wantMouth) {
            feed.leaveTimer += dt;
            if (feed.leaveTimer > 2.8) scatterSchool();
          }

          // Encounter finished: everything eaten or faded
          const anyVisible = fishList.some((f) => f.alpha > 0.01 || f.t < 0);
          if ((feed.state === 'school' && alive === 0) || !anyVisible) {
            feed.doneDelay += dt;
            if (feed.doneDelay > 0.5 || !anyVisible) {
              feed.state = 'idle';
              feed.fish = [];
              if (feed.isFirst && feed.eatenCount === 0) {
                // The first encounter didn't happen (e.g. scrolled away): offer it again shortly
                feed.timer = rand(1.5, 3);
              } else {
                // From now on, encounters need ~10s without scrolling (counted from here)
                feed.firstDone = true;
              }
              feed.isFirst = false;
              feed.idleForFeed = 0;
              feed.extraDelay = rand(0.5, 4);
            }
          }

          // Raster the school into the shared character grid (same mosaic as whale & water).
          // Each fish inks its cell plus a fainter tail cell behind it; the ink weight
          // ripples with the fish's heading, so turning waves flash through the school.
          if (feed.fish.length) {
            let touched = 0;
            const addInk = (cc: number, rr: number, v: number) => {
              if (cc < 1 || cc >= cols - 1 || rr < 1 || rr >= rows - 1) return;
              const k = cc + rr * cols;
              if (fishBuf[k] === 0) fishTouched[touched++] = k;
              fishBuf[k] += v;
            };
            for (const f of feed.fish) {
              if (f.alpha <= 0.01) continue;
              if (f.vx > 0.25) f.face = 1;
              else if (f.vx < -0.25) f.face = -1;
              const heading = Math.atan2(f.vy, f.vx);
              const flash = 0.82 + 0.18 * Math.sin(heading * 3 + time * 1.6 + f.ox * 0.025);
              const v = f.alpha * FISH_TIER_WEIGHT[f.tier] * flash;
              const cc = (f.x / cellSize) | 0;
              const rr = (f.y / cellSize) | 0;
              addInk(cc, rr, v);
              addInk(cc - f.face, rr, v * 0.5);
            }
            for (let k = 0; k < touched; k++) {
              const cellIdx = fishTouched[k];
              const v = fishBuf[cellIdx];
              fishBuf[cellIdx] = 0;
              // Hidden under the whale (fish being engulfed) or too faint
              if (v < 0.08 || occBuf[cellIdx] > 0) continue;
              const level = Math.min(1, v / 1.1);
              const inkRow =
                abyss > 0.5
                  ? level < 0.3 ? 20 : level < 0.62 ? 21 : 19 // pale tiers in dark water
                  : level < 0.3 ? 15 : level < 0.62 ? 16 : 17;
              // Denser glyphs ('-' '=' '+' '*' 'x' '#' '%') so every fish reads as a solid mark
              const gi = Math.min(9, 2 + ((level * 6.5) | 0) + ((cellIdx * 7) & 1));
              ctx.drawImage(
                atlasCanvas,
                gi * tilePx,
                inkRow * tilePx,
                tilePx,
                tilePx,
                (cellIdx % cols) * cellSize,
                ((cellIdx / cols) | 0) * cellSize,
                cellSize,
                cellSize
              );
            }
          }
        }

        // Jaws: open quickly when fish are within reach ahead, close softly afterwards
        const mouthTarget = wantMouth ? 1 : 0;
        feed.mouthOpen += (mouthTarget - feed.mouthOpen) * Math.min(1, dt * (wantMouth ? 6 : 2.6));
        if (feed.mouthOpen < 0.005) feed.mouthOpen = 0;
        // Throat pouch deflates slowly after the gulp
        feed.gulp *= Math.exp(-dt / 1.6);
        if (feed.gulp < 0.005) feed.gulp = 0;
      }

      // Expand dirty bounding box by 1 cell for halo border computation
      const boxMinC = Math.max(1, curMinC - 1);
      const boxMaxC = Math.min(cols - 2, curMaxC + 1);
      const boxMinR = Math.max(1, curMinR - 1);
      const boxMaxR = Math.min(rows - 2, curMaxR + 1);

      prevMinC = boxMinC;
      prevMaxC = boxMaxC;
      prevMinR = boxMinR;
      prevMaxR = boxMaxR;

      // 6. Compute Halo & Blit Pre-rendered Atlas Tiles Only Inside Bounding Box
      // Subtle contrast attenuation establishes underwater distance (foreground vs deeper companion)
      const shimmerTick = (fx * 2.2) | 0;
      const fgWhaleAlpha = isFocus ? 1.0 : 0.60 + (1 - entryCalm) * 0.18;
      // Both whales share the deep-blue atlas rows (10..14) at full strength; they give way while
      // the convergence's 3D whales swim and become the Globe (whaleDirection.presence)
      const whaleAlpha = (migActive ? mig.whales : 1) * whaleDirection.presence;
      let activeAlpha = 1.0;
      const batch = glyphBatch;
      batch?.begin();
      /** One atlas tile into the cell at (px, py): batched for WebGL, or drawn on the 2D canvas */
      const blit = (col: number, row: number, px: number, py: number, alpha: number) => {
        if (batch) {
          batch.push(col, row, px, py, alpha);
          return;
        }
        if (alpha !== activeAlpha) {
          ctx.globalAlpha = alpha;
          activeAlpha = alpha;
        }
        ctx.drawImage(atlasCanvas, col * tilePx, row * tilePx, tilePx, tilePx, px, py, cellSize, cellSize);
      };

      for (let r = boxMinR; r <= boxMaxR; r++) {
        const py = r * cellSize;
        const rowOff = r * cols;
        for (let c = boxMinC; c <= boxMaxC; c++) {
          const idx = rowOff + c;
          const px = c * cellSize;
          const occ = occBuf[idx];

          if (occ > 0) {
            const targetAlpha = whaleAlpha * READING_WHALE_ALPHA[readingBuf[idx]];

            const shade = lumBuf[idx];
            const tone = toneBuf[idx];

            // Calm, coherent typographic evolution (no rapid random flickering)
            const hash = ((c * 37 + r * 73 + shimmerTick) & 7) * 0.16;
            const glyphIdx = Math.min(
              NUM_GLYPHS - 1,
              Math.max(0, (shade * (NUM_GLYPHS - 2) + hash) | 0)
            );

            let styleRow = 0;
            if (shade > 0.76) {
              styleRow = 4;
            } else if (shade > 0.52) {
              styleRow = tone > 0.6 ? 3 : 2;
            } else if (shade > 0.32) {
              styleRow = 1;
            } else {
              styleRow = 0;
            }

            // Engraved contour: a swimming whale's edge cells take the stroke of the edge they sit
            // on, read from which neighbours are open water
            let contour = -1;
            if (!migActive && !isFocus && tone <= 1.5) {
              const up = occBuf[idx - cols] === 0;
              const down = occBuf[idx + cols] === 0;
              const left = occBuf[idx - 1] === 0;
              const right = occBuf[idx + 1] === 0;
              if (up || down || left || right) {
                if ((up && right) || (down && left)) contour = up && down ? CONTOUR_FLAT : CONTOUR_FALL;
                else if ((up && left) || (down && right)) contour = up && down ? CONTOUR_FLAT : CONTOUR_RISE;
                else if (up || down) contour = CONTOUR_FLAT;
                else contour = CONTOUR_END;
              }
            }

            blit(
              contour >= 0 ? contour : tone > 1.5 ? (c * 7 + r * 13 + shimmerTick) & 3 : glyphIdx,
              contour >= 0 ? 24 : tone > 1.5 ? 18 : !isFocus ? styleRow + 10 : styleRow,
              px,
              py,
              targetAlpha
            );
          } else {
            const n =
              (occBuf[idx - 1] > 0 ? 1 : 0) +
              (occBuf[idx + 1] > 0 ? 1 : 0) +
              (occBuf[idx - cols] > 0 ? 1 : 0) +
              (occBuf[idx + cols] > 0 ? 1 : 0) +
              (occBuf[idx - cols - 1] > 0 ? 1 : 0) +
              (occBuf[idx - cols + 1] > 0 ? 1 : 0) +
              (occBuf[idx + cols - 1] > 0 ? 1 : 0) +
              (occBuf[idx + cols + 1] > 0 ? 1 : 0);

            if (n > 0) {
              const haloAlpha = fgWhaleAlpha * whaleAlpha * READING_WHALE_ALPHA[readingBuf[idx]];
              blit(n >= 3 ? 2 : n >= 2 ? 1 : 0, 5, px, py, haloAlpha);
            }
          }
        }
      }
      if (activeAlpha !== 1.0) {
        ctx.globalAlpha = 1.0;
      }
      batch?.flush();

      // 6B. SONAR ECHOES — each whale and visible jellyfish the ring reaches answers with a brief
      // bracket of glyphs around it, the moment the ring arrives
      if (pings.length && ambientWhalesLive.presence > 0.1) {
        const echoTargets: number[] = [];
        for (const wh of whales) {
          const mid = SPINE_NODES >> 1;
          echoTargets.push(wh.spineX[mid], wh.spineY[mid], mainBodyLen * wh.scale * 0.42);
        }
        const jp = jellyfishField.stats.pos;
        for (let j = 0; j < jp.length; j += 4) {
          if (jp[j + 3] > 0.08) echoTargets.push(jp[j], jp[j + 1], jp[j + 2] * 1.5);
        }
        topCtx.font = '500 12px "JetBrains Mono", monospace';
        topCtx.textAlign = 'center';
        topCtx.textBaseline = 'middle';
        topCtx.fillStyle = sonarInk;
        for (const ping of pings) {
          const age = nowS - ping.at;
          for (let ti = 0; ti < echoTargets.length; ti += 3) {
            const tx = echoTargets[ti];
            const ty = echoTargets[ti + 1];
            const tr = echoTargets[ti + 2];
            const since = age - arrivalTime(Math.hypot(tx - ping.x, ty - ping.y));
            const strength = echoStrength(since);
            if (strength <= 0.01) continue;
            // An open bracket facing back toward the click, widening a little as it fades
            const facing = Math.atan2(ping.y - ty, ping.x - tx);
            const rr = tr * (1 + since * 0.35);
            topCtx.globalAlpha = strength * 0.85;
            for (let k = -4; k <= 4; k++) {
              const a = facing + k * 0.17;
              topCtx.fillText(Math.abs(k) === 4 ? '.' : ':', tx + Math.cos(a) * rr, ty + Math.sin(a) * rr);
            }
          }
        }
        topCtx.globalAlpha = 1;
      }

      // 7. DEEP-OCEAN BIOLUMINESCENT JELLYFISH — Foreground-margin plane
      if (!migActive) renderJellyfishPlanes(w, h, rawDepth, abyss, surfaceBaseY, 2, 2, topCtx);

      migrationStats.frameMs += (performance.now() - frameStart - migrationStats.frameMs) * 0.1;
      if (!prefersReducedMotion) animId = requestAnimationFrame(render);
    };

    const scheduleOcean = () => {
      if (!animId && !document.hidden) { lastFrameTime = performance.now(); animId = requestAnimationFrame(render); }
    };
    const onVisibility = () => {
      cancelAnimationFrame(animId); animId = 0; scheduleOcean();
    };
    const motionQuery = matchMedia('(prefers-reduced-motion: reduce)');
    const onMotion = () => { prefersReducedMotion = motionQuery.matches; scheduleOcean(); };
    document.addEventListener('visibilitychange', onVisibility);
    window.addEventListener('scroll', scheduleOcean, { passive: true });
    window.addEventListener('resize', scheduleOcean);
    motionQuery.addEventListener('change', onMotion);
    animId = requestAnimationFrame(render);

    return () => {
      layoutObserver.disconnect();
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScrollChange);
      window.removeEventListener('wheel', handleWheelDir);
      window.removeEventListener('click', handleSonarClick);
      oceanLifeDisposed = true;
      cancelAnimationFrame(animId);
      document.removeEventListener('visibilitychange', onVisibility);
      window.removeEventListener('scroll', scheduleOcean);
      window.removeEventListener('resize', scheduleOcean);
      motionQuery.removeEventListener('change', onMotion);
      glyphBatch?.destroy();
      directWhales('migration', 0, migLanes);
    };
  }, [mode]);

  if (mode === 'off') return null;

  return (
    <div
      aria-hidden="true"
      data-ocean-layer
      className={`fixed inset-0 pointer-events-none transition-opacity duration-500 max-w-full overflow-hidden ${
        mode === 'focus' ? 'z-30 bg-[#F5F3EE]/85 backdrop-blur-[2px]' : 'z-[1]'
      }`}
    >
      <canvas ref={canvasRef} className="w-full max-w-full h-full block" />
      <canvas ref={glCanvasRef} className="absolute inset-0 w-full h-full block" />
      <AmbientWhaleLayer />
      <canvas ref={overCanvasRef} className="absolute inset-0 w-full h-full block" />
    </div>
  );
});
