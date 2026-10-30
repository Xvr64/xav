// ============================================================================
// ASCII OCEAN LIFE — anatomical ASCII bioluminescent jellyfish
// ============================================================================
// Rendered inside AsciiWhaleBackground's single requestAnimationFrame loop, with
// the same technique as the whales: every character is a tile from a pre-baked
// glyph atlas blitted with drawImage (no per-glyph fillText, no shadowBlur, no
// per-frame string/colour allocation).
//
// • Jellyfish: each creature is evaluated procedurally on its own character grid
//   as a translucent surface of revolution (bell) with internal anatomy (radial
//   canals front & back, gonads, segmented manubrium/stomach, coronal groove,
//   ring canal, scalloped luminous margin), followed by oral arms and marginal
//   tentacles whose nodes trail the bell's own motion history.
// ============================================================================

type RGB = readonly [number, number, number];

const FONT_FAMILY = '"JetBrains Mono", ui-monospace, monospace';
const TAU = Math.PI * 2;

const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const smoothstep = (e0: number, e1: number, x: number) => {
  const t = clamp01((x - e0) / (e1 - e0));
  return t * t * (3 - 2 * t);
};
const ease = (t: number) => {
  const k = clamp01(t);
  return k * k * (3 - 2 * k);
};
/** Stable integer hash -> [0, 1) */
const hash2 = (a: number, b: number) => ((((a * 73856093) ^ (b * 19349663)) >>> 0) & 1023) / 1024;
const mixRGB = (a: RGB, b: RGB, t: number): RGB => [lerp(a[0], b[0], t), lerp(a[1], b[1], t), lerp(a[2], b[2], t)];
const rgba = (c: RGB | readonly number[], a: number) =>
  `rgba(${Math.round(c[0])}, ${Math.round(c[1])}, ${Math.round(c[2])}, ${a.toFixed(3)})`;

interface GlyphAtlas {
  canvas: HTMLCanvasElement;
  tw: number;
  th: number;
}

// ============================================================================
// PART A — JELLYFISH
// ============================================================================

// Glyph vocabulary, chosen by role (density, orientation, curvature, segmentation)
const JG: readonly string[] = [
  '.', ':', '-', '~', '=', '+', '*', 'o', 'O', '0', '8', '%', '#', '@', '|', '/',
  '\\', '(', ')', '^', "'", ',', '!', ';', '{', '}', 'v', 's', 'i', '`', '_', 'x'
];
const G_DOT = 0, G_COLON = 1, G_DASH = 2, G_TILDE = 3, G_EQ = 4, G_PLUS = 5, G_STAR = 6, G_o = 7;
const G_EIGHT = 10, G_PCT = 11, G_BAR = 14, G_SLASH = 15;
const G_BSLASH = 16, G_LPAR = 17, G_RPAR = 18, G_APOS = 20, G_COMMA = 21, G_EXCL = 22, G_SEMI = 23;
const G_LBRACE = 24, G_RBRACE = 25, G_v = 26, G_TICK = 29, G_US = 30, G_HASH = 12;
// Density ramp ordered by ink coverage in JetBrains Mono (translucent tissue → luminous rim)
const RAMP = [G_DOT, G_COMMA, G_COLON, G_DASH, G_SEMI, G_TILDE, G_EQ, G_PLUS, G_STAR, G_o, G_PCT, G_HASH, G_EIGHT];

const J_LEVELS = 6; // luminance levels per palette (0 faint … 5 specular / densest)
const J_BLENDS = 4; // light-water ink (0) … abyss bioluminescence (3)

interface JellyPalette {
  inkDim: RGB; // faint ink in daylight water
  ink: RGB; // dense ink in daylight water
  deep: RGB; // dim bioluminescence
  glow: RGB; // bright bioluminescence
  spec: RGB; // specular / rim highlight
}
// Pale cyan, muted turquoise and blue-violet: restrained, desaturated, never neon
const JELLY_PALETTES: readonly JellyPalette[] = [
  { inkDim: [112, 150, 162], ink: [20, 62, 82], deep: [40, 108, 132], glow: [168, 230, 244], spec: [228, 250, 255] },
  { inkDim: [106, 150, 146], ink: [16, 70, 70], deep: [34, 108, 102], glow: [148, 224, 206], spec: [222, 252, 244] },
  { inkDim: [128, 132, 168], ink: [44, 46, 104], deep: [74, 76, 150], glow: [184, 180, 246], spec: [234, 230, 255] }
];
const LIGHT_ALPHA = [0.16, 0.26, 0.38, 0.52, 0.68, 0.84];
const GLOW_ALPHA = [0.2, 0.32, 0.46, 0.62, 0.8, 0.98];

function bakeJellyAtlas(cellW: number, cellH: number, scale: number): GlyphAtlas {
  const tw = Math.max(2, Math.round(cellW * scale));
  const th = Math.max(2, Math.round(cellH * scale));
  const canvas = document.createElement('canvas');
  canvas.width = JG.length * tw;
  canvas.height = JELLY_PALETTES.length * J_BLENDS * J_LEVELS * th;
  const c = canvas.getContext('2d');
  if (c) {
    c.font = `500 ${(th * 0.9).toFixed(2)}px ${FONT_FAMILY}`;
    c.textAlign = 'center';
    c.textBaseline = 'middle';
    for (let p = 0; p < JELLY_PALETTES.length; p++) {
      const pal = JELLY_PALETTES[p];
      for (let b = 0; b < J_BLENDS; b++) {
        const bt = b / (J_BLENDS - 1);
        for (let l = 0; l < J_LEVELS; l++) {
          const light = mixRGB(pal.inkDim, pal.ink, l / (J_LEVELS - 1));
          const glow = l === J_LEVELS - 1 ? pal.spec : mixRGB(pal.deep, pal.glow, l / (J_LEVELS - 2));
          const col = mixRGB(light, glow, bt);
          const a = lerp(LIGHT_ALPHA[l], GLOW_ALPHA[l], bt);
          c.fillStyle = rgba(col, a);
          const row = (p * J_BLENDS + b) * J_LEVELS + l;
          for (let g = 0; g < JG.length; g++) {
            c.fillText(JG[g], g * tw + tw * 0.5, row * th + th * 0.54);
          }
        }
      }
    }
  }
  return { canvas, tw, th };
}

/** Soft luminous falloff behind a jellyfish (abyss only), composited with 'screen' */
function bakeGlowSprite(p: number): HTMLCanvasElement {
  const s = 64;
  const cv = document.createElement('canvas');
  cv.width = s;
  cv.height = s;
  const c = cv.getContext('2d');
  if (c) {
    const pal = JELLY_PALETTES[p];
    const g = c.createRadialGradient(s / 2, s / 2, 0, s / 2, s / 2, s / 2);
    g.addColorStop(0, rgba(pal.glow, 0.85));
    g.addColorStop(0.32, rgba(pal.deep, 0.42));
    g.addColorStop(0.7, rgba(pal.deep, 0.1));
    g.addColorStop(1, rgba(pal.deep, 0));
    c.fillStyle = g;
    c.fillRect(0, 0, s, s);
  }
  return cv;
}

const PROF_N = 64;
interface JellySpecies {
  domeH: number; // bell height / bell radius
  prof: Float32Array; // bell half-width profile over normalised height (0 margin … 1 apex)
  dprof: Float32Array; // |d profile / dt|
  marginH: number;
  lappets: number;
  canals: number;
  canalW: number;
  branch: boolean; // finer branching canals in the outer zone (moon jelly)
  gonads: boolean; // four horseshoe gonads (moon jelly)
  manubrium: boolean; // short segmented central axis under the bell
  stomach: boolean; // tall segmented stomach column (helmet jelly)
  coronal: boolean; // segmented coronal groove (helmet jelly)
  ringCanal: boolean;
  rimWave: boolean; // slow pinwheel of light around the margin (deep-sea species)
  nTent: number;
  tentLen: number;
  tentVar: number;
  tentStiff: number;
  tentStyle: 0 | 1 | 2; // 0 fine fringe, 1 long beaded filaments, 2 stout segmented
  nArms: number;
  armLen: number;
  armW: number;
}

function buildProfile(P: number, Q: number): { prof: Float32Array; dprof: Float32Array } {
  const prof = new Float32Array(PROF_N + 2);
  const dprof = new Float32Array(PROF_N + 2);
  for (let i = 0; i <= PROF_N; i++) {
    const t = i / PROF_N;
    prof[i] = Math.pow(Math.max(0, 1 - Math.pow(t, P)), Q);
  }
  prof[PROF_N + 1] = 0;
  for (let i = 0; i <= PROF_N; i++) {
    const a = prof[Math.max(0, i - 1)];
    const b = prof[Math.min(PROF_N, i + 1)];
    const span = (Math.min(PROF_N, i + 1) - Math.max(0, i - 1)) / PROF_N;
    dprof[i] = Math.min(14, Math.abs(b - a) / span);
  }
  dprof[PROF_N + 1] = dprof[PROF_N];
  return { prof, dprof };
}

const MOON_PROFILE = buildProfile(2.2, 0.5);
const NETTLE_PROFILE = buildProfile(2.0, 0.6);
const HELMET_PROFILE = buildProfile(1.55, 0.78);

const SPECIES: readonly JellySpecies[] = [
  // 0 — Moon jelly (Aurelia): wide shallow bell, four violet gonad rings, branching canals,
  //     a dense fringe of short tentacles and four short frilled oral arms
  {
    domeH: 0.5, prof: MOON_PROFILE.prof, dprof: MOON_PROFILE.dprof, marginH: 0.13, lappets: 8,
    canals: 8, canalW: 0.035, branch: true, gonads: true, manubrium: true, stomach: false,
    coronal: false, ringCanal: true, rimWave: false,
    nTent: 30, tentLen: 0.5, tentVar: 0.4, tentStiff: 0.3, tentStyle: 0,
    nArms: 4, armLen: 0.95, armW: 0.09
  },
  // 1 — Sea nettle (Chrysaora): taller bell with 16 radial stripes, long beaded marginal
  //     tentacles and long spiralling, ruffled oral arms
  {
    domeH: 0.78, prof: NETTLE_PROFILE.prof, dprof: NETTLE_PROFILE.dprof, marginH: 0.14, lappets: 32,
    canals: 12, canalW: 0.09, branch: false, gonads: false, manubrium: true, stomach: false,
    coronal: false, ringCanal: false, rimWave: false,
    nTent: 11, tentLen: 3.0, tentVar: 0.45, tentStiff: 0.05, tentStyle: 1,
    nArms: 4, armLen: 2.5, armW: 0.1
  },
  // 2 — Helmet jelly (Periphylla-like, deep sea): tall conical bell, segmented coronal groove,
  //     segmented violet stomach column, stout segmented tentacles and a slow light wave on the rim
  {
    domeH: 1.12, prof: HELMET_PROFILE.prof, dprof: HELMET_PROFILE.dprof, marginH: 0.17, lappets: 12,
    canals: 12, canalW: 0.03, branch: false, gonads: false, manubrium: false, stomach: true,
    coronal: true, ringCanal: false, rimWave: true,
    nTent: 12, tentLen: 1.15, tentVar: 0.22, tentStiff: 0.6, tentStyle: 2,
    nArms: 0, armLen: 0, armW: 0
  }
];

interface JellySpec {
  tier: 0 | 1 | 2; // 0 far mist, 1 mid-water, 2 foreground margin
  species: 0 | 1 | 2;
  pal: 0 | 1 | 2;
  xFrac: number;
  yFrac: number;
  R: number; // bell radius (px) at desktop scale
  parallax: number;
  minDepth: number;
  rampSpan: number;
  period: number; // pulse period (s)
  phase: number;
  driftAmp: number;
  driftFreq: number;
  rise: number; // slow net ascent (px/s)
  tilt: number;
  spin: number; // slow rotation about the bell axis (rad/s)
  seed: number;
}

// Sizes stay comparable to the whales (main whale ≈ 0.58·min(w,h) long); margins keep the
// reading column clear. Individual periods, phases, spins and drifts avoid synchronised motion.
const JELLY_SPECS: readonly JellySpec[] = [
  { tier: 0, species: 0, pal: 0, xFrac: 0.24, yFrac: 0.12, R: 25, parallax: 0.18, minDepth: 0.14, rampSpan: 0.2, period: 5.6, phase: 0.1, driftAmp: 14, driftFreq: 0.11, rise: 2.4, tilt: 0.08, spin: 0.05, seed: 0.13 },
  { tier: 0, species: 1, pal: 1, xFrac: 0.74, yFrac: 0.55, R: 23, parallax: 0.21, minDepth: 0.2, rampSpan: 0.2, period: 4.9, phase: 0.55, driftAmp: 16, driftFreq: 0.09, rise: 2.9, tilt: -0.1, spin: -0.04, seed: 0.41 },
  { tier: 0, species: 2, pal: 2, xFrac: 0.6, yFrac: 0.88, R: 21, parallax: 0.16, minDepth: 0.3, rampSpan: 0.22, period: 6.3, phase: 0.8, driftAmp: 12, driftFreq: 0.1, rise: 2.1, tilt: 0.06, spin: 0.06, seed: 0.77 },
  { tier: 1, species: 1, pal: 1, xFrac: 0.11, yFrac: 0.42, R: 40, parallax: 0.36, minDepth: 0.24, rampSpan: 0.24, period: 4.6, phase: 0.33, driftAmp: 20, driftFreq: 0.085, rise: 3.6, tilt: 0.12, spin: 0.045, seed: 0.29 },
  { tier: 1, species: 0, pal: 0, xFrac: 0.88, yFrac: 0.2, R: 43, parallax: 0.39, minDepth: 0.28, rampSpan: 0.24, period: 5.9, phase: 0.71, driftAmp: 18, driftFreq: 0.07, rise: 3.1, tilt: -0.1, spin: -0.035, seed: 0.62 },
  { tier: 1, species: 2, pal: 2, xFrac: 0.15, yFrac: 0.93, R: 36, parallax: 0.42, minDepth: 0.38, rampSpan: 0.24, period: 6.7, phase: 0.05, driftAmp: 16, driftFreq: 0.08, rise: 2.6, tilt: 0.07, spin: 0.05, seed: 0.88 },
  { tier: 2, species: 1, pal: 0, xFrac: 0.9, yFrac: 0.6, R: 62, parallax: 0.55, minDepth: 0.42, rampSpan: 0.26, period: 5.1, phase: 0.47, driftAmp: 24, driftFreq: 0.06, rise: 4.2, tilt: -0.12, spin: 0.03, seed: 0.51 },
  { tier: 2, species: 0, pal: 1, xFrac: 0.1, yFrac: 0.16, R: 64, parallax: 0.52, minDepth: 0.47, rampSpan: 0.26, period: 6.1, phase: 0.9, driftAmp: 22, driftFreq: 0.065, rise: 3.8, tilt: 0.12, spin: -0.03, seed: 0.19 }
];

// Character cell per depth plane: distant creatures use finer, dimmer glyphs and fewer
// filaments (cheaper), foreground creatures carry the full anatomy.
const JELLY_TIERS = [
  { cellW: 3.5, cellH: 5.4, alpha: 0.62, detail: 0.5 },
  { cellW: 4.1, cellH: 6.3, alpha: 0.82, detail: 0.75 },
  { cellW: 4.7, cellH: 7.2, alpha: 1.0, detail: 1.0 }
];

const SURGE = 0.16; // vertical displacement per pulse, in bell radii
const SINK = 0.72; // fraction of the surge lost to sinking between pulses
const TRAIL_TAU = 0.085; // seconds of motion history per tentacle node
const TRAIL_K = 0.55; // how strongly tentacles follow the bell's past path
const MAX_NODES = 72;
// Glyph-grid repaint rate per depth plane (far, mid, near); the cached grid is blitted every frame
const JELLY_PAINT_HZ = [8, 12, 16];

const jellyPosX = (sp: JellySpec, tt: number) =>
  sp.driftAmp * (Math.sin(tt * sp.driftFreq + sp.seed * TAU) + 0.35 * Math.sin(tt * sp.driftFreq * 2.3 + sp.seed * 17));

/** Continuous vertical motion: propulsive surge on each contraction, slow sinking, gentle ascent */
const jellyPosY = (sp: JellySpec, R: number, tt: number) => {
  const cyc = tt / sp.period + sp.phase;
  const n = Math.floor(cyc);
  const e = Math.min(1, (cyc - n) / 0.6);
  const d = R * SURGE;
  return -(n + e * e * (3 - 2 * e)) * d + (d / sp.period) * SINK * tt - sp.rise * tt;
};

/** Bell contraction: quick systole, slow elastic recovery */
const jellyContraction = (fr: number) =>
  fr < 0.26
    ? Math.sin((fr / 0.26) * Math.PI * 0.5)
    : Math.pow(0.5 + 0.5 * Math.cos(((fr - 0.26) / 0.74) * Math.PI), 1.35);

const ARM_CORE = [G_COLON, G_SEMI, G_PCT, G_COLON];
const MARGIN_TILT = 0.2; // viewing elevation: the near half of the margin sags into a soft arc
const OCC_W = 160;
const OCC_H = 200;
const OCC_CX = 80;
const OCC_CY = 40;

export interface JellyfishField {
  render: (
    ctx: CanvasRenderingContext2D,
    w: number,
    h: number,
    time: number,
    scrollY: number,
    rawDepth: number,
    abyss: number,
    surfaceBaseY: number,
    reducedMotion: boolean,
    minTier: number,
    maxTier: number
  ) => void;
  rebake: () => void;
  /**
   * Optional: how much of a creature may show where it sits (viewport box → 0..1), so a jellyfish
   * drifting behind reading text or the Globe fades out instead of competing with it.
   */
  setOcclusion: (fn: ((left: number, top: number, width: number, height: number) => number) | null) => void;
  stats: { cells: number; visible: number; pos: Float32Array; ms: number };
}

export function createAsciiJellyfishField(atlasScale: number): JellyfishField {
  let atlasNear = bakeJellyAtlas(JELLY_TIERS[2].cellW, JELLY_TIERS[2].cellH, atlasScale);
  let atlasFar = bakeJellyAtlas(JELLY_TIERS[0].cellW, JELLY_TIERS[0].cellH, atlasScale);
  const glowSprites = [bakeGlowSprite(0), bakeGlowSprite(1), bakeGlowSprite(2)];

  // Per-creature cell occupancy (one glyph per cell; anatomy painted in priority order)
  const occ = new Uint8Array(OCC_W * OCC_H);
  const touched = new Int32Array(OCC_W * OCC_H);
  let touchedN = 0;
  const trX = new Float32Array(MAX_NODES + 1);
  const trY = new Float32Array(MAX_NODES + 1);
  const gon = new Float32Array(12); // 4 gonads × (x, y, front)
  // pos: per creature (x, y, bell radius, visibility) — diagnostics only, updated in place
  const stats = { cells: 0, visible: 0, pos: new Float32Array(JELLY_SPECS.length * 4), ms: 0 };

  // Shared stamping state (avoids allocating closures per creature / per frame)
  let sCtx: CanvasRenderingContext2D = null as unknown as CanvasRenderingContext2D;
  let sAtlas: GlyphAtlas = atlasNear;
  let sOx = 0;
  let sOy = 0;
  let sCw = 6;
  let sCh = 9;
  let sB = 0;
  let sW = 0; // viewport (placement)
  let sH = 0;
  let cullX0 = 0; // current paint region (stamp culling)
  let cullY0 = 0;
  let cullX1 = 0;
  let cullY1 = 0;
  let pxScale = 1;

  // Sprite cache: each creature owns a fixed region of a shared sheet canvas (one sheet for the
  // far + mid planes drawn behind the whales, one for the foreground plane). Its glyph grid is
  // repainted at its plane's rate (staggered across creatures); all due repaints happen first,
  // then every region is blitted at the creature's live position — so each sheet is snapshotted
  // by the main canvas only once per pass.
  interface JellySprite {
    group: number; // sheet index
    rx: number; // region origin in the sheet (CSS px)
    ry: number;
    rw: number; // region capacity
    rh: number;
    w: number; // used size for the current scale
    h: number;
    offX: number;
    offY: number;
    next: number;
    sB: number;
    valid: boolean;
    show: boolean; // placed on screen this frame
    ox: number;
    oy: number;
    vis: number;
    glowR: number;
    glowY: number;
    /** Eased share of the creature allowed to show where it sits (see setOcclusion). */
    clear: number;
  }
  let occlusion: ((left: number, top: number, width: number, height: number) => number) | null = null;
  const dims = { w: 0, h: 0, top: 0 }; // reused result (no per-frame allocation)
  const spriteDims = (sp: JellySpec, sizeScale: number, mobile: boolean) => {
    const S = SPECIES[sp.species];
    const tier = JELLY_TIERS[sp.tier];
    const k = mobile ? 0.92 : 1;
    const cw = tier.cellW * k;
    const ch = tier.cellH * k;
    const R = sp.R * sizeScale;
    const top = R * S.domeH * 1.25 + ch * 4.5;
    const bottom = R * (Math.max(S.tentLen, S.armLen) + S.marginH + MARGIN_TILT + 0.15) + ch * 3 + 16;
    dims.w = Math.ceil(R * 4.3 + cw * 8);
    dims.h = Math.ceil(top + bottom);
    dims.top = top;
    return dims;
  };
  // Shelf-pack each group's regions at their largest (desktop) size
  const sprites: JellySprite[] = new Array(JELLY_SPECS.length);
  const sheetW = [0, 0];
  const sheetH = [0, 0];
  for (let gI = 0; gI < 2; gI++) {
    const maxRow = 1100;
    let x = 0;
    let y = 0;
    let rowH = 0;
    for (let i = 0; i < JELLY_SPECS.length; i++) {
      if ((JELLY_SPECS[i].tier === 2 ? 1 : 0) !== gI) continue;
      const d = spriteDims(JELLY_SPECS[i], 1, false);
      if (x + d.w > maxRow) {
        x = 0;
        y += rowH + 2;
        rowH = 0;
      }
      sprites[i] = {
        group: gI, rx: x, ry: y, rw: d.w, rh: d.h, w: 0, h: 0, offX: 0, offY: 0, next: 0, sB: -1,
        valid: false, show: false, ox: 0, oy: 0, vis: 0, glowR: 0, glowY: 0, clear: 1
      };
      x += d.w + 2;
      rowH = Math.max(rowH, d.h);
      sheetW[gI] = Math.max(sheetW[gI], x);
    }
    sheetH[gI] = y + rowH;
  }
  const sheets = [document.createElement('canvas'), document.createElement('canvas')];
  const sheetCtxs = [sheets[0].getContext('2d'), sheets[1].getContext('2d')];
  let sheetScale = 0;

  const stamp = (c: number, r: number, g: number, lvl: number, pal: number) => {
    const ci = c + OCC_CX;
    const ri = r + OCC_CY;
    if (ci < 0 || ci >= OCC_W || ri < 0 || ri >= OCC_H) return;
    const k = ci + ri * OCC_W;
    if (occ[k] !== 0) return;
    occ[k] = 1;
    touched[touchedN++] = k;
    const x = sOx + c * sCw - sCw * 0.5;
    const y = sOy + r * sCh - sCh * 0.5;
    if (x < cullX0 || x + sCw > cullX1 || y < cullY0 || y + sCh > cullY1) return; // stay inside this creature's sheet region
    const l = lvl < 0 ? 0 : lvl > 5 ? 5 : lvl;
    const row = (pal * J_BLENDS + sB) * J_LEVELS + l;
    sCtx.drawImage(sAtlas.canvas, g * sAtlas.tw, row * sAtlas.th, sAtlas.tw, sAtlas.th, x, y, sCw, sCh);
    stats.cells++;
  };

  // ---- Current bell geometry (bell frame: x across, y down, margin plane at y = mH) ----
  let bA = 1; // bell half-width at the shoulder
  let bB = 1; // bell height above the margin plane
  let bMH = 1; // skirt height
  let bAM = 1; // margin (opening) radius
  let bEA = 0; // half-height of the perspective margin ellipse
  let bP: Float32Array = MOON_PROFILE.prof;

  /** Is a point (bell frame) inside the bell silhouette? Dome profile + skirt + front margin arc */
  const inBell = (bx: number, by: number): boolean => {
    const abx = bx < 0 ? -bx : bx;
    if (by <= 0) {
      if (by < -bB) return false;
      const li = (-by / bB) * PROF_N;
      const i0 = li | 0;
      return abx <= bA * (bP[i0] + (bP[i0 + 1] - bP[i0]) * (li - i0));
    }
    if (by <= bMH) return abx <= bA + (bAM - bA) * (by / bMH);
    if (abx >= bAM) return false;
    const q = abx / bAM;
    return by <= bMH + bEA * Math.sqrt(1 - q * q);
  };

  const renderOne = (
    sp: JellySpec,
    time: number,
    scrollY: number,
    rawDepth: number,
    abyss: number,
    surfaceBaseY: number,
    reduced: boolean,
    sizeScale: number,
    mobile: boolean
  ) => {
    const depthVis = clamp01((rawDepth - sp.minDepth) / sp.rampSpan);
    if (depthVis <= 0.005) return;
    const S = SPECIES[sp.species];
    const tier = JELLY_TIERS[sp.tier];
    const cellScale = mobile ? 0.92 : 1;
    const cw = tier.cellW * cellScale;
    const ch = tier.cellH * cellScale;
    const R = sp.R * sizeScale;
    const tt = time + sp.seed * 37;
    const seedI = (sp.seed * 997) | 0;

    // ---- Placement: parallax depth plane + wrapped vertical travel (continuous motion) ----
    const pxRaw = reduced ? 0 : jellyPosX(sp, tt);
    const pyNow = reduced ? 0 : jellyPosY(sp, R, tt);
    const bellTop = R * S.domeH * 1.25 + ch * 2;
    const below = R * (Math.max(S.tentLen, S.armLen) + S.marginH + MARGIN_TILT) + ch * 3;
    const span = sH + bellTop + below + 40;
    const raw = sp.yFrac * span - scrollY * sp.parallax + pyNow;
    const oy = (((raw % span) + span) % span) - below - 20;
    if (oy + below < 0 || oy - bellTop > sH) return;
    const surfClear = clamp01((oy - bellTop * 0.7 - (surfaceBaseY + 40)) / 60);
    // Daylight water: visible as translucent ink; abyss: full bioluminescence
    const vis = depthVis * (0.55 + 0.45 * abyss) * tier.alpha * surfClear;
    if (vis <= 0.01) return;
    const ox = sp.xFrac * sW + pxRaw * sizeScale;
    stats.visible++;
    const idx = JELLY_SPECS.indexOf(sp);
    const pi = idx * 4;
    stats.pos[pi] = ox;
    stats.pos[pi + 1] = oy;
    stats.pos[pi + 2] = R;
    stats.pos[pi + 3] = vis;

    // ---- Repaint the cached glyph grid only when due (blitting happens in a second pass) ----
    const spr = sprites[idx];
    const sheetCtx = sheetCtxs[spr.group];
    if (!sheetCtx) return;
    spriteDims(sp, sizeScale, mobile);
    const sprW = Math.min(dims.w, spr.rw);
    const sprH = Math.min(dims.h, spr.rh);
    spr.show = true;
    spr.ox = ox;
    spr.oy = oy;
    spr.vis = vis;
    spr.glowR = R * 2.2;
    spr.glowY = oy - R * S.domeH * 0.45;
    const due = !spr.valid || time >= spr.next || spr.sB !== sB || spr.w !== sprW || spr.h !== sprH;
    if (due) {
      // Next repaint on this creature's own phase of its plane's clock (spreads cost across frames)
      const hz = JELLY_PAINT_HZ[sp.tier];
      const phaseOff = idx / JELLY_SPECS.length;
      spr.next = (Math.floor(time * hz + phaseOff) + 1 - phaseOff) / hz;
      spr.sB = sB;
      spr.valid = true;
      spr.w = sprW;
      spr.h = sprH;
      spr.offX = sprW * 0.5;
      spr.offY = dims.top;
      const mainCtx = sCtx;
      sheetCtx.setTransform(pxScale, 0, 0, pxScale, 0, 0);
      sheetCtx.clearRect(spr.rx, spr.ry, spr.rw, spr.rh);
      sCtx = sheetCtx;
      cullX0 = spr.rx;
      cullY0 = spr.ry;
      cullX1 = spr.rx + sprW;
      cullY1 = spr.ry + sprH;
      paintOne(sp, S, tier, cw, ch, R, tt, seedI, pxRaw, pyNow, sizeScale, reduced, spr.rx + spr.offX, spr.ry + spr.offY);
      sCtx = mainCtx;
    }
  };

  /** Second pass: luminous falloff + one blit per creature from its plane's sheet */
  const blitPlaced = (ctx: CanvasRenderingContext2D, minTier: number, maxTier: number) => {
    const glowMode = sB >= 2;
    for (let i = 0; i < JELLY_SPECS.length; i++) {
      const sp = JELLY_SPECS[i];
      const spr = sprites[i];
      if (sp.tier < minTier || sp.tier > maxTier || !spr.show || !spr.valid) continue;
      const clearTarget = occlusion ? occlusion(spr.ox - spr.offX, spr.oy - spr.offY, spr.w, spr.h) : 1;
      spr.clear += (clearTarget - spr.clear) * 0.08;
      const vis = spr.vis * spr.clear;
      if (vis < 0.01) continue;
      if (glowMode) {
        // Soft luminous falloff behind the creature (deep water only; glyphs stay crisp on top)
        ctx.globalCompositeOperation = 'screen';
        ctx.globalAlpha = vis * 0.22 * ((sB - 1) / 2);
        const gr = spr.glowR;
        ctx.drawImage(glowSprites[sp.pal], spr.ox - gr, spr.glowY - gr, gr * 2, gr * 2);
        ctx.globalCompositeOperation = 'source-over';
      }
      // Snap to device pixels so the cached glyphs stay crisp while drifting
      ctx.globalAlpha = vis;
      const bx0 = Math.round((spr.ox - spr.offX) * pxScale) / pxScale;
      const by0 = Math.round((spr.oy - spr.offY) * pxScale) / pxScale;
      ctx.drawImage(sheets[spr.group], spr.rx * pxScale, spr.ry * pxScale, spr.w * pxScale, spr.h * pxScale, bx0, by0, spr.w, spr.h);
    }
  };

  const paintOne = (
    sp: JellySpec,
    S: JellySpecies,
    tier: (typeof JELLY_TIERS)[number],
    cw: number,
    ch: number,
    R: number,
    tt: number,
    seedI: number,
    pxRaw: number,
    pyNow: number,
    sizeScale: number,
    reduced: boolean,
    originX: number,
    originY: number
  ) => {
    const pal = sp.pal;
    const glowMode = sB >= 2;

    // ---- Pulse & pose ----
    const cyc = tt / sp.period + sp.phase;
    const fr = cyc - Math.floor(cyc);
    const c = reduced ? 0.25 : jellyContraction(fr);
    const a = R * (1 - 0.15 * c);
    const b = R * S.domeH * (1 + 0.18 * c);
    const mH = R * S.marginH * (1 - 0.2 * c);
    const aM = a * (0.9 - 0.08 * c); // the margin closes in on each contraction
    const eA = aM * MARGIN_TILT;
    bA = a;
    bB = b;
    bMH = mH;
    bAM = aM;
    bEA = eA;
    bP = S.prof;
    const rot = (reduced ? 0 : tt * sp.spin) + sp.seed * 5;
    const vx = reduced ? 0 : (pxRaw - jellyPosX(sp, tt - 0.6)) / 0.6;
    const tilt =
      sp.tilt + (reduced ? 0 : 0.05 * Math.sin(tt * 0.27 + sp.seed * 4)) + Math.max(-0.08, Math.min(0.08, vx * 0.006));
    const cosT = Math.cos(tilt);
    const sinT = Math.sin(tilt);

    sAtlas = sp.tier === 0 ? atlasFar : atlasNear;
    sOx = originX;
    sOy = originY;
    sCw = cw;
    sCh = ch;
    const detailed = sp.tier > 0;

    // ---- Motion history for trailing filaments ----
    const maxLen = R * Math.max(S.tentLen, S.armLen);
    const nMax = Math.min(MAX_NODES, Math.ceil(maxLen / (ch * 0.85)) + 1);
    for (let k = 0; k <= nMax; k++) {
      if (reduced) {
        trX[k] = 0;
        trY[k] = 0;
        continue;
      }
      const td = tt - k * TRAIL_TAU;
      trX[k] = (jellyPosX(sp, td) - pxRaw) * sizeScale * TRAIL_K;
      trY[k] = (jellyPosY(sp, R, td) - pyNow) * TRAIL_K;
    }

    // ---- Gonads (moon jelly): four horseshoes around the axis, rotating with the bell ----
    if (S.gonads && detailed) {
      for (let k = 0; k < 4; k++) {
        const ps = rot + k * Math.PI * 0.5 + Math.PI * 0.25;
        const cps = Math.cos(ps);
        gon[k * 3] = 0.4 * a * Math.sin(ps);
        gon[k * 3 + 1] = -b * 0.34 + mH + eA * 0.5 * cps;
        gon[k * 3 + 2] = cps;
      }
    }

    // =====================================================================
    // 1. BELL — translucent surface of revolution with internal anatomy
    // =====================================================================
    const P = S.prof;
    const DP = S.dprof;
    const extX = a + cw * 2;
    const extTop = b + ch * 2;
    const extBot = mH + eA + ch;
    const acos = Math.abs(cosT);
    const asin = Math.abs(sinT);
    const halfX = extX * acos + extTop * asin;
    const cMin = Math.floor(-halfX / cw);
    const cMax = Math.ceil(halfX / cw);
    const rMin = Math.floor(-(extTop * acos + extX * asin) / ch);
    const rMax = Math.ceil((extBot * acos + extX * asin) / ch);
    const spacing = TAU / S.canals;
    const invB = 1 / b;
    const near = Math.max(cw, ch) * 0.95;
    const sx3 = cw / 3;
    const sy3 = ch / 3;
    const rimW = R * 0.1 + cw * 0.7; // falloff of the luminous rim (thin shell seen edge-on)
    const canalPx = cw * (0.5 + S.canalW * 4);
    const gonRx = a * 0.17;
    const gonRy = b * 0.13 + ch * 0.45;

    // ---- Margin contours first (first stamp wins): luminous front rim, faint far rim ----
    {
      const M = Math.max(8, Math.ceil((aM * 2) / (cw * 0.45)));
      for (let pass = 0; pass < 2; pass++) {
        if (pass === 1 && !detailed) break;
        let pc = 99999;
        let pr = 99999;
        for (let i = 0; i <= M; i++) {
          const q = -1 + (2 * i) / M;
          const sq = Math.sqrt(Math.max(0, 1 - q * q));
          if (pass === 1 && Math.abs(q) > 0.9) continue;
          const mx = q * aM;
          const my = pass === 0 ? mH + eA * sq : mH - eA * sq;
          const sxp = mx * cosT - my * sinT;
          const syp = mx * sinT + my * cosT;
          const cx = Math.round(sxp / cw);
          const ry = Math.round(syp / ch);
          if (cx === pc && ry === pr) continue;
          pc = cx;
          pr = ry;
          const off = (syp - ry * ch) / ch;
          const subRow = off > 0.17 ? G_US : off < -0.17 && pass === 1 ? G_TICK : G_DASH;
          if (pass === 1) {
            stamp(cx, ry, subRow, 2, pal);
            continue;
          }
          const slope = sq > 0.05 ? ((-eA * q) / (aM * sq)) * (cw / ch) : q < 0 ? 9 : -9;
          const phi = Math.asin(q);
          const u = ((phi + rot) * S.lappets) / TAU;
          const notch = u - Math.floor(u) < 0.16;
          let g: number;
          let lvl = 4;
          let pl = pal;
          if (Math.abs(q) > 0.9) g = subRow;
          else if (slope > 0.55) g = G_BSLASH;
          else if (slope < -0.55) g = G_SLASH;
          else if (notch) {
            g = S.gonads ? G_o : G_v; // rhopalia / lappet notches catch the light
            lvl = S.gonads ? 4 : 5;
          } else g = subRow;
          if (S.rimWave && !reduced && Math.sin(phi * 2 + rot * 3 - tt * 1.1) > 0.8) {
            lvl = 5;
            pl = 2;
          }
          stamp(cx, ry, g, lvl, pl);
        }
      }
    }

    for (let r = rMin; r <= rMax; r++) {
      const py = r * ch;
      for (let cc = cMin; cc <= cMax; cc++) {
        const px = cc * cw;
        const bx = px * cosT + py * sinT;
        const by = -px * sinT + py * cosT;
        const abx = bx < 0 ? -bx : bx;
        const left = bx < 0;

        // ---- Bell profile at this height & signed distance to the silhouette ----
        let hw: number;
        let tN: number;
        let dhw: number;
        let frontY = mH;
        if (by <= 0) {
          tN = -by * invB;
          if (tN > 1) {
            hw = 0;
            dhw = 99;
          } else {
            const li = tN * PROF_N;
            const i0 = li | 0;
            hw = a * (P[i0] + (P[i0 + 1] - P[i0]) * (li - i0));
            dhw = a * DP[i0] * invB;
          }
        } else {
          tN = 0;
          hw = by <= mH ? a + (aM - a) * (by / mH) : aM;
          dhw = (a - aM) / mH;
        }
        if (abx < aM) {
          const q = abx / aM;
          frontY = mH + eA * Math.sqrt(1 - q * q);
        }
        const dSide = (hw - abx) / Math.sqrt(1 + dhw * dhw);
        const dTop = by + b;
        const dBot = frontY - by;
        let dEdge = dSide < dTop ? dSide : dTop;
        if (dBot < dEdge) dEdge = dBot;

        if (dEdge < -near) {
          // Outside: sparse luminous halo hugging the bell (deep water only — no blur)
          if (glowMode && dEdge > -near * 2.3 && by < frontY + ch && hash2(cc * 7 + seedI, r * 3) < 0.2) {
            stamp(cc, r, G_DOT, 0, pal);
          }
          continue;
        }

        // ---- Anti-aliased coverage: 3×3 sub-cell samples near the silhouette ----
        let n = 9;
        let gx = 0;
        let gy = 0;
        if (dEdge < near) {
          n = 0;
          for (let sy = -1; sy <= 1; sy++) {
            const qy = py + sy * sy3;
            for (let sx = -1; sx <= 1; sx++) {
              const qx = px + sx * sx3;
              if (inBell(qx * cosT + qy * sinT, -qx * sinT + qy * cosT)) {
                n++;
                gx += sx;
                gy += sy;
              }
            }
          }
          if (n === 0) {
            if (glowMode && hash2(cc * 7 + seedI, r * 3) < 0.2) stamp(cc, r, G_DOT, 0, pal);
            continue;
          }
        } else if (by > frontY) continue;
        const cov = n / 9;

        // ---- Luminance field ----
        const s = hw > 0.5 ? Math.max(-1, Math.min(1, bx / hw)) : 0;
        const z = Math.sqrt(1 - s * s);
        const de = dEdge > 0 ? dEdge : 0;
        let L = 0.1 + 0.68 * Math.exp(-de / rimW);
        const diffuse = clamp01(0.55 * tN + 0.3 * z - 0.32 * s * (1 - 0.5 * tN));
        L += 0.16 * diffuse; // key light from the upper left
        if (tN < 0.25 && by < mH) L *= 0.8 + 0.8 * tN; // darker underside toward the margin
        const backY = abx < aM ? 2 * mH - frontY : -999;
        const dBack = by - backY;
        if (dBack > ch * 0.5) L *= 0.74; // subumbrellar cavity seen through the front wall

        let kind = 0; // 0 tissue, 1 filament, 2 gonad, 4 axis, 5 specular (margins drawn as contours above)
        let fil = 0; // filament: 2 front, 1 far side, 3 branch, 4 ring canal
        let pl = pal;

        if (by > 0 && dBot < ch * 1.1 && abx < aM) {
          L = Math.max(L, 0.5); // tissue just inside the luminous margin
        }
        {
          const dsx = s + 0.42;
          const dsy = tN - 0.66;
          const ds = dsx * dsx + dsy * dsy * 2.6;
          if (detailed && ds < 0.012 && n === 9) {
            kind = 5;
            L = ds < 0.004 ? 1 : 0.9;
          } else if (S.stomach && tN > 0.1 && tN < 0.84 && abx < a * 0.2 * (1 - tN * 0.55)) {
            kind = 4;
            pl = 2;
            L = Math.max(L, 0.72);
          } else if (S.manubrium && by > -b * 0.3 && abx < Math.max(cw * 0.55, a * 0.06)) {
            kind = 4;
            L = Math.max(L, 0.55);
          } else {
            if (S.gonads && detailed) {
              for (let k = 0; k < 4; k++) {
                const dx = (bx - gon[k * 3]) / gonRx;
                const dy = (by - gon[k * 3 + 1]) / gonRy;
                const d2 = dx * dx + dy * dy;
                if (d2 < 1.96) {
                  const d = Math.sqrt(d2);
                  const front = gon[k * 3 + 2] > 0;
                  const ring = Math.exp(-((d - 0.85) * (d - 0.85)) / 0.09);
                  L = Math.max(L, (front ? 0.5 : 0.3) + (front ? 0.4 : 0.22) * ring);
                  kind = 2;
                  pl = 2;
                  gx = dx < -0.55 ? -1 : dx > 0.55 ? 1 : 0;
                  gy = dy < 0 ? -1 : 1;
                  if (d < 0.55) gx = 9; // inner lumen
                  break;
                }
              }
            }
            if (kind === 0 && S.coronal && Math.abs(by + b * 0.3) < ch * 0.55) {
              kind = 1;
              fil = 5; // coronal groove
              L = Math.max(L, 0.55);
            }
            if (kind === 0 && S.ringCanal && detailed && dBot > ch * 0.45 && dBot < ch * 1.35 && abx < aM * 0.9) {
              kind = 1;
              fil = 4;
              L = Math.max(L, 0.5);
            }
            if (kind === 0 && tN < 0.86 && z > 0.28 && n === 9) {
              // Radial canals: front surface bright, far side dim — they drift in opposite
              // directions as the bell turns, which reads as depth
              const phiF = Math.asin(s);
              const pxRad = spacing * hw * z;
              const uF = (phiF + rot) / spacing;
              const dF = Math.abs(uF - Math.round(uF)) * pxRad;
              if (dF < canalPx) {
                fil = 2;
                L = Math.max(L, 0.46 + (S.canalW > 0.08 ? 0.18 : 0.08) + 0.12 * diffuse);
              } else if (detailed) {
                const uB = (Math.PI - phiF + rot) / spacing;
                if (Math.abs(uB - Math.round(uB)) * pxRad < canalPx * 0.6) {
                  fil = 1;
                  L = Math.max(L, 0.3);
                } else if (S.branch && detailed && by > -b * 0.55) {
                  const u2 = uF + 0.5;
                  if (Math.abs(u2 - Math.round(u2)) * pxRad < canalPx * 0.7) {
                    fil = 3;
                    L = Math.max(L, 0.36);
                  }
                }
              }
              if (fil > 0) kind = 1;
            }
          }
        }
        if (n < 9) L *= Math.pow(cov, 0.75);

        // ---- Glyph ----
        let lvl = Math.round(L * 5.6 - 0.7);
        let g = -1;
        const hs = hash2(cc + seedI * 31, r * 7 + seedI);
        if (kind === 5) {
          g = L >= 1 ? G_STAR : G_TICK;
          lvl = 5;
        } else if (kind === 4) {
          const edge = S.stomach ? abx > a * 0.12 * (1 - tN * 0.5) : false;
          g = edge ? (left ? G_LPAR : G_RPAR) : (r & 1) === 0 ? G_EIGHT : S.stomach ? G_EQ : G_COLON;
        } else if (kind === 2) {
          g = gx === 9 ? G_COLON : gx < 0 ? G_LPAR : gx > 0 ? G_RPAR : gy < 0 ? G_DASH : G_US;
        } else if (kind === 1) {
          if (fil === 4) g = G_DASH;
          else if (fil === 5) {
            const u = ((Math.asin(s) + rot) * S.canals) / TAU;
            g = Math.abs(u - Math.round(u)) < 0.16 ? G_PLUS : G_EQ;
          } else {
            const slopeM = s * dhw;
            const sm = slopeM < 0 ? -slopeM : slopeM;
            if (sm < 0.4) g = fil === 2 ? G_BAR : fil === 1 ? G_COLON : G_EXCL;
            else if (sm < 1.8) g = slopeM > 0 ? G_BSLASH : G_SLASH;
            else g = G_DASH;
          }
        } else if (n < 9) {
          // Silhouette: walls read as curved strokes, the crown fades softly into the water
          const agx = gx < 0 ? -gx : gx;
          const agy = gy < 0 ? -gy : gy;
          if (agx > agy * 1.5) g = gx > 0 ? G_LPAR : G_RPAR;
          else if (agx > agy * 0.5 && gy > 0) g = gx > 0 ? G_SLASH : G_BSLASH;
          else if (gy > 0) g = n <= 3 ? G_DOT : n <= 6 ? G_DASH : L > 0.62 ? G_EQ : G_TILDE; // soft crown
          else g = n <= 4 ? G_DASH : G_US;
        } else {
          // Translucent tissue. Close to the silhouette the shell is seen edge-on: draw it as
          // contour strokes parallel to the outline; deeper inside, a sparse density ramp.
          const rimL = Math.exp(-de / rimW);
          if (rimL > 0.42) {
            const topMost = dTop <= dSide || dhw > 2.2;
            if (topMost) g = L > 0.66 ? G_EQ : rimL > 0.7 ? G_DASH : G_TILDE;
            else if (dhw > 0.6) g = left ? G_SLASH : G_BSLASH;
            else g = left ? G_LPAR : G_RPAR;
            lvl = Math.min(lvl, 4);
          } else {
            if (L < 0.16 && hs > L * 4.5) continue;
            const ri = Math.round(L * (RAMP.length - 1) + (hs - 0.5) * 0.9);
            g = RAMP[ri < 0 ? 0 : ri > 6 ? 6 : ri];
          }
        }
        if (g >= 0) stamp(cc, r, g, lvl, pl);
      }
    }

    // =====================================================================
    // 2. MARGINAL TENTACLES (near side) / 3. ORAL ARMS / 4. TENTACLES (far side)
    // =====================================================================
    const nT = Math.max(4, Math.round(S.nTent * tier.detail));
    const swayA = R * (0.14 + 0.24 * (1 - S.tentStiff));

    for (let pass = 0; pass < 3; pass++) {
      if (pass === 1) {
        // ---- Oral arms: frilled curtains twisting slowly around the central axis ----
        const nA = sp.tier === 0 ? Math.min(2, S.nArms) : S.nArms;
        for (let m = 0; m < nA; m++) {
          const ps = rot * 0.8 + (m * TAU) / S.nArms + 0.4;
          const front = Math.cos(ps);
          const rx0 = a * 0.1 * Math.sin(ps);
          const ry0 = mH + eA * 0.3 * front;
          const rootX = rx0 * cosT - ry0 * sinT;
          const rootY = rx0 * sinT + ry0 * cosT;
          const lenM = R * S.armLen * (0.8 + 0.3 * hash2(m + seedI, 5));
          const N = Math.min(MAX_NODES, Math.max(2, Math.round(lenM / (ch * 0.85))));
          const step = lenM / N;
          const lvlBase = front > -0.2 ? 3 : 2;
          for (let k = 1; k <= N; k++) {
            const u = k / N;
            const twist = a * 0.2 * u * Math.sin(ps + k * 0.26 - (reduced ? 0 : tt * 0.33));
            const sway = reduced ? 0 : R * 0.16 * u * Math.sqrt(u) * Math.sin(tt * 0.5 - k * 0.22 + m * 1.9 + sp.seed * 9);
            const x = rootX + twist + sway + trX[k];
            const y = rootY + k * step + Math.max(trY[k], -k * step * 0.3);
            const halfW = R * S.armW * (1 - 0.72 * u) * (0.7 + 0.3 * Math.sin(k * 0.9 - tt * 0.7 + m));
            const c0 = Math.round((x - halfW) / cw);
            const c1 = Math.round((x + halfW) / cw);
            const rr = Math.round(y / ch);
            const lvl = lvlBase - (u > 0.45 ? 1 : 0) - (u > 0.8 ? 1 : 0);
            if (c0 >= c1) {
              stamp(c0, rr, ((k >> 1) + m) & 1 ? G_LPAR : G_RPAR, lvl, pal);
            } else {
              for (let q = c0; q <= c1; q++) {
                const g =
                  q === c0
                    ? (k + m) % 3 === 0 ? G_LBRACE : G_LPAR
                    : q === c1
                      ? (k + m) % 3 === 0 ? G_RBRACE : G_RPAR
                      : ARM_CORE[(k + q + m) & 3];
                stamp(q, rr, g, lvl, pal);
              }
            }
          }
        }
        continue;
      }

      // ---- Marginal tentacles: pass 0 = near side, pass 2 = far side (dimmer, partly hidden) ----
      for (let j = 0; j < nT; j++) {
        const ps = (j / nT) * TAU + rot * 0.7 + sp.seed * 3;
        const front = Math.cos(ps);
        const isBack = front < -0.1;
        if ((pass === 0) === isBack) continue;
        if (isBack && S.tentStyle === 0 && (j & 1) === 1) continue; // thin out the far fringe
        const rxb = aM * Math.sin(ps);
        const ryb = mH + eA * front;
        const rootX = rxb * cosT - ryb * sinT;
        const rootY = rxb * sinT + ryb * cosT;
        const lenJ = R * S.tentLen * (1 - S.tentVar * hash2(j * 13 + seedI, 3));
        const N = Math.min(MAX_NODES, Math.max(1, Math.round(lenJ / (ch * 0.9))));
        const step = lenJ / N;
        const w1 = 0.55 + 0.35 * hash2(j, seedI);
        const ph = j * 1.71 + sp.seed * 11;
        const baseLvl = isBack ? 2 : 3;
        let prevX = rootX;
        let prevY = rootY;
        let prevC = 99999;
        let prevR = 99999;
        for (let k = 1; k <= N; k++) {
          const u = k / N;
          const env = u * (0.45 + 0.55 * u);
          const sx = reduced
            ? 0
            : swayA * env * (Math.sin(tt * w1 - k * 0.3 + ph) + 0.5 * Math.sin(tt * w1 * 1.7 - k * 0.71 + ph * 1.3));
          const spread = rxb * 0.28 * u * (1 - c);
          const x = rootX + spread + sx + trX[k];
          const y = rootY + k * step * (1 + 0.05 * c) + Math.max(trY[k], -k * step * 0.35);
          const cc = Math.round(x / cw);
          const rr = Math.round(y / ch);
          if (cc === prevC && rr === prevR) continue;
          const dx = x - prevX;
          const dy = y - prevY;
          prevX = x;
          prevY = y;
          prevC = cc;
          prevR = rr;
          const sl = dy > 0.01 ? dx / dy : dx > 0 ? 9 : -9;
          let g: number;
          let lvl = baseLvl - (u > 0.3 ? 1 : 0) - (u > 0.65 ? 1 : 0);
          if (S.tentStyle === 0) {
            g = k === N ? (k & 1 ? G_COMMA : G_APOS) : sl > 0.6 ? G_BSLASH : sl < -0.6 ? G_SLASH : k === 1 ? G_BAR : G_EXCL;
            lvl = isBack ? 2 : 3;
          } else if (u > 0.85) {
            g = (k & 1) === 0 ? G_DOT : G_COMMA;
          } else if (sl > 1.8 || sl < -1.8) {
            g = G_TILDE;
          } else if (sl > 0.75) {
            g = G_BSLASH;
          } else if (sl < -0.75) {
            g = G_SLASH;
          } else if (sl > 0.3) {
            g = G_RPAR;
          } else if (sl < -0.3) {
            g = G_LPAR;
          } else if (S.tentStyle === 2) {
            // Stout tentacle with segment rings
            g = k % 3 === 0 ? G_EQ : G_BAR;
            if (k % 3 === 0) lvl++;
          } else {
            // Long filament with nematocyst-like beading
            const m5 = (k + j) % 5;
            g = m5 === 2 ? G_COLON : m5 === 4 ? G_EXCL : G_BAR;
            if (u < 0.5 && (k + j) % 11 === 3) {
              g = G_o;
              lvl++;
            }
          }
          stamp(cc, rr, g, lvl, pal);
        }
      }
    }

    // Reset occupancy for the next creature
    for (let i = 0; i < touchedN; i++) occ[touched[i]] = 0;
    touchedN = 0;
  };

  const render: JellyfishField['render'] = (
    ctx, w, h, time, scrollY, rawDepth, abyss, surfaceBaseY, reducedMotion, minTier, maxTier
  ) => {
    if (minTier === 0) {
      stats.cells = 0;
      stats.visible = 0;
      stats.pos.fill(0);
    }
    if (rawDepth <= 0.12) return;
    const t0 = performance.now();
    sCtx = ctx;
    sW = w;
    sH = h;
    pxScale = Math.min((typeof window !== 'undefined' && window.devicePixelRatio) || 1, 1.5);
    // Light-water ink → abyss bioluminescence, switching around the page's ink flip
    sB = Math.round(smoothstep(0.36, 0.54, abyss) * (J_BLENDS - 1));
    const mobile = w < 640;
    const sizeScale = mobile ? 0.7 : w < 1024 ? 0.85 : 1;
    const prevAlpha = ctx.globalAlpha;
    if (sheetScale !== pxScale) {
      sheetScale = pxScale;
      for (let gI = 0; gI < 2; gI++) {
        sheets[gI].width = Math.max(1, Math.ceil(sheetW[gI] * pxScale));
        sheets[gI].height = Math.max(1, Math.ceil(sheetH[gI] * pxScale));
      }
      for (let i = 0; i < sprites.length; i++) sprites[i].valid = false;
    }
    // Pass 1: place every creature of these planes and repaint the cached grids that are due
    for (let i = 0; i < JELLY_SPECS.length; i++) {
      const sp = JELLY_SPECS[i];
      if (sp.tier < minTier || sp.tier > maxTier) continue;
      sprites[i].show = false;
      if (mobile && sp.tier === 0 && i > 0) continue; // fewer distant creatures on small screens
      renderOne(sp, time, scrollY, rawDepth, abyss, surfaceBaseY, reducedMotion, sizeScale, mobile);
    }
    // Pass 2: composite them into the scene
    blitPlaced(ctx, minTier, maxTier);
    ctx.globalAlpha = prevAlpha;
    ctx.globalCompositeOperation = 'source-over';
    // Smoothed cost of the jellyfish passes (diagnostics; summed over both depth-plane calls)
    const dtMs = performance.now() - t0;
    stats.ms = minTier === 0 ? stats.ms * 0.9 + dtMs * 0.1 : stats.ms + dtMs * 0.1;
  };

  const rebake = () => {
    atlasNear = bakeJellyAtlas(JELLY_TIERS[2].cellW, JELLY_TIERS[2].cellH, atlasScale);
    atlasFar = bakeJellyAtlas(JELLY_TIERS[0].cellW, JELLY_TIERS[0].cellH, atlasScale);
    for (let i = 0; i < sprites.length; i++) sprites[i].valid = false;
  };

  const setOcclusion: JellyfishField['setOcclusion'] = (fn) => {
    occlusion = fn;
  };

  return { render, rebake, setOcclusion, stats };
}

// Part B (ASCII fishing boat) removed.
export const boatSurfaceY = (_w?: number, _h?: number) => -999;
export interface FishingBoat {
  update: (dt: number, surfaceBaseY: number, h: number, reducedMotion: boolean) => void;
  render: (
    ctx: CanvasRenderingContext2D,
    w: number,
    h: number,
    time: number,
    surfaceBaseY: number,
    reducedMotion: boolean,
    sampleSurfaceY: (x: number) => number
  ) => void;
  rebake: () => void;
  forceFishing: (gear?: 'line' | 'net', catchCount?: number) => void;
  state: { tiles: number; ms: number; visible: boolean };
}
export const createAsciiFishingBoat = (_atlasScale = 1): FishingBoat => ({
  update: () => {},
  render: () => {},
  rebake: () => {},
  forceFishing: () => {},
  state: { tiles: 0, ms: 0, visible: false }
});
