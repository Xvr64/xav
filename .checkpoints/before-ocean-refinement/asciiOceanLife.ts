// ============================================================================
// ASCII OCEAN LIFE — anatomical ASCII jellyfish & ASCII fishing boat
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
// • Fishing boat: hull, deck, wheelhouse and rigging are composed once as a
//   mosaic of shaded glyph tiles (same fill/ink palette as the whales) and cached
//   in an offscreen canvas. Only the animated parts (A-frame gantry, line/net,
//   catch, radar, smoke, foam, splash) are drawn per frame, driven by a small
//   time-based state machine.
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
  }
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
        valid: false, show: false, ox: 0, oy: 0, vis: 0, glowR: 0, glowY: 0
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
      if (glowMode) {
        // Soft luminous falloff behind the creature (deep water only; glyphs stay crisp on top)
        ctx.globalCompositeOperation = 'screen';
        ctx.globalAlpha = spr.vis * 0.22 * ((sB - 1) / 2);
        const gr = spr.glowR;
        ctx.drawImage(glowSprites[sp.pal], spr.ox - gr, spr.glowY - gr, gr * 2, gr * 2);
        ctx.globalCompositeOperation = 'source-over';
      }
      // Snap to device pixels so the cached glyphs stay crisp while drifting
      ctx.globalAlpha = spr.vis;
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

  return { render, rebake, stats };
}

// ============================================================================
// PART B — FISHING BOAT
// ============================================================================

const BOAT_LH = 38; // hull length (cells)
const BOAT_TOP = -18; // highest row (masthead); waterline sits between rows -1 and 0
const BOAT_BOTTOM = 2; // lowest submerged row
const BOAT_C0 = -1;
const BOAT_C1 = BOAT_LH + 2;
const BOAT_NC = BOAT_C1 - BOAT_C0 + 1;
const BOAT_NR = BOAT_BOTTOM - BOAT_TOP + 1;
const BOAT_OX = BOAT_LH * 0.5; // local origin (cells) = hull midpoint on the waterline

// Same fill/ink mosaic palette as the whale atlas rows 10..14 (ventral → dorsal)
const MOSAIC = [
  { fill: [176, 192, 204], fillA: 0.5, ink: [34, 56, 78], inkA: 0.58 },
  { fill: [138, 160, 178], fillA: 0.56, ink: [28, 48, 70], inkA: 0.7 },
  { fill: [100, 126, 150], fillA: 0.6, ink: [20, 40, 62], inkA: 0.82 },
  { fill: [72, 100, 128], fillA: 0.62, ink: [14, 32, 54], inkA: 0.88 },
  { fill: [52, 78, 104], fillA: 0.64, ink: [10, 26, 46], inkA: 0.92 }
];

interface TileStyle {
  fill: string | null;
  ink: string;
}
const tileStyle = (fill: readonly number[] | null, fillA: number, ink: readonly number[], inkA: number): TileStyle => ({
  fill: fill ? rgba(fill, fillA) : null,
  ink: rgba(ink, inkA)
});
const BOAT_STYLES: Record<string, TileStyle> = {
  m0: tileStyle(MOSAIC[0].fill, MOSAIC[0].fillA, MOSAIC[0].ink, MOSAIC[0].inkA),
  m1: tileStyle(MOSAIC[1].fill, MOSAIC[1].fillA, MOSAIC[1].ink, MOSAIC[1].inkA),
  m2: tileStyle(MOSAIC[2].fill, MOSAIC[2].fillA, MOSAIC[2].ink, MOSAIC[2].inkA),
  m3: tileStyle(MOSAIC[3].fill, MOSAIC[3].fillA, MOSAIC[3].ink, MOSAIC[3].inkA),
  m4: tileStyle(MOSAIC[4].fill, MOSAIC[4].fillA, MOSAIC[4].ink, MOSAIC[4].inkA),
  wall: tileStyle([234, 237, 236], 0.86, [78, 98, 110], 0.6), // sunlit superstructure paint
  wallS: tileStyle([206, 214, 218], 0.84, [60, 82, 96], 0.66), // superstructure in shade
  roof: tileStyle([222, 228, 230], 0.9, [44, 64, 78], 0.78),
  glass: tileStyle([38, 60, 80], 0.8, [200, 218, 228], 0.8),
  ring: tileStyle([226, 232, 234], 0.8, [30, 50, 66], 0.9),
  tyre: tileStyle([36, 46, 56], 0.72, [150, 166, 176], 0.7),
  reg: tileStyle(MOSAIC[3].fill, MOSAIC[3].fillA, [228, 236, 240], 0.92),
  rig: tileStyle(null, 0, [26, 44, 58], 0.82),
  rigL: tileStyle(null, 0, [52, 74, 90], 0.6)
};

// Hull geometry (cells; x from stern 0 → bow LH, y rows with waterline at 0, negative = above).
// Sheer rises toward a raked stem; freeboard grows from 3 rows aft to 5½ rows at the bow.
const hullFreeboard = (x: number) => 3.1 + 2.5 * Math.pow(clamp01(x / BOAT_LH), 2.4);
const hullDraft = (x: number) => 1.9 * Math.pow(Math.sin(Math.PI * clamp01((x + 0.6) / (BOAT_LH + 0.6))), 0.5);
const hullStern = (y: number) => (y <= 0 ? 1.0 + 0.28 * y : 1.0 + 2.6 * Math.pow(Math.min(1, y / 1.9), 1.2));
const hullBow = (y: number) =>
  y <= 0
    ? BOAT_LH - 4.6 + 4.6 * Math.min(1, -y / hullFreeboard(BOAT_LH))
    : BOAT_LH - 4.6 - 4 * Math.pow(Math.min(1, y / 1.9), 1.3);
const hullTopRow = (x: number) => Math.ceil(-hullFreeboard(x) - 0.5);

interface BoatCell {
  g: string;
  st: TileStyle;
}

/** Composes the static vessel once as a grid of shaded glyph tiles */
function buildBoatLayout(): (BoatCell | null)[] {
  const cells: (BoatCell | null)[] = new Array(BOAT_NC * BOAT_NR).fill(null);
  const idx = (c: number, r: number) => c - BOAT_C0 + (r - BOAT_TOP) * BOAT_NC;
  const inGrid = (c: number, r: number) => c >= BOAT_C0 && c <= BOAT_C1 && r >= BOAT_TOP && r <= BOAT_BOTTOM;
  const put = (c: number, r: number, g: string, st: string, overwrite = true) => {
    if (!inGrid(c, r)) return;
    const k = idx(c, r);
    if (!overwrite && cells[k]) return;
    cells[k] = { g, st: BOAT_STYLES[st] };
  };
  const levelOf = (v: number) => (v > 0.76 ? 'm4' : v > 0.6 ? 'm3' : v > 0.45 ? 'm2' : v > 0.3 ? 'm1' : 'm0');
  // Plating texture: horizontal strakes in the light, denser glyphs in shadow (same logic as the whale mosaic)
  const plate = (v: number, c: number, r: number) => {
    const h = hash2(c * 3, r + 50);
    if (v < 0.5) return (r & 1) === 0 ? '=' : h < 0.7 ? '-' : '=';
    if (v < 0.66) return h < 0.6 ? '=' : '+';
    if (v < 0.8) return h < 0.5 ? '#' : '%';
    return h < 0.5 ? '%' : '8';
  };

  // ---- Hull ----
  for (let c = 0; c <= BOAT_LH + 1; c++) {
    const X = c + 0.5;
    const fb = hullFreeboard(X);
    const deckY = -fb;
    const topRow = hullTopRow(X);
    for (let r = -7; r <= BOAT_BOTTOM; r++) {
      const Y = r + 0.5;
      if (X < hullStern(Y) || X > hullBow(Y)) continue;
      if (Y < deckY) {
        // Partial cell above the sheer: a cap stroke keeps the rising deck edge continuous
        if (r === topRow - 1 && r + 1 - deckY > 0.15) put(c, r, '_', 'rigL');
        continue;
      }
      if (Y > hullDraft(X)) continue;
      const bowEdge = X + 1 > hullBow(Y);
      const sternEdge = X - 1 < hullStern(Y);
      if (r >= 0) {
        // Underbody (drawn later through the water column)
        const v = 0.7 + 0.1 * (Y / 2);
        put(c, r, bowEdge ? ')' : sternEdge ? '(' : plate(v, c, r), levelOf(v));
        continue;
      }
      if (r === topRow) {
        put(c, r, bowEdge ? '/' : sternEdge ? '\\' : '=', 'm0'); // gunwale cap catching the sky
        continue;
      }
      if (bowEdge) {
        put(c, r, '/', r === -1 ? 'm3' : r >= -2 ? 'm2' : 'm1'); // raked stem
        continue;
      }
      if (sternEdge) {
        put(c, r, '\\', 'm3'); // transom in shadow
        continue;
      }
      if (r === -1) {
        put(c, r, '=', 'm4'); // boot-top stripe on the waterline
        continue;
      }
      if (r === topRow + 1) {
        put(c, r, '-', X > BOAT_LH - 8 ? 'm2' : 'm3'); // rubbing strake
        continue;
      }
      const q = clamp01((Y - deckY) / fb);
      let v = 0.6 + 0.3 * q;
      if (X > BOAT_LH - 12) v -= 0.3 * (1 - 0.6 * q) * smoothstep(BOAT_LH - 12, BOAT_LH - 4, X); // bow flare in the light
      if (X < 4) v += 0.08; // quarter in shadow
      put(c, r, plate(v, c, r), levelOf(v));
    }
  }

  // Tyre fenders over the side, anchor hawse, port registration on the bow
  for (const fc of [9, 16, 23]) put(fc, hullTopRow(fc + 0.5) + 1, 'O', 'tyre');
  put(BOAT_LH - 5, hullTopRow(BOAT_LH - 4.5) + 1, 'o', 'tyre');
  const REG = 'XH-26';
  for (let i = 0; i < REG.length; i++) put(28 + i, -2, REG[i], 'reg');

  // ---- Wheelhouse: reverse-raked front windows, door, life ring ----
  const roofRow = -9;
  for (let c = 14; c <= 24; c++) {
    const bottom = hullTopRow(c + 0.5) - 1;
    for (let r = roofRow + 1; r <= bottom; r++) {
      const shade = r === bottom || c === 14;
      put(c, r, c === 14 ? '|' : (c + r) & 1 ? ':' : '.', shade ? 'wallS' : 'wall');
    }
  }
  for (const wc of [16, 19, 22]) {
    put(wc, -8, '/', 'glass');
    put(wc + 1, -8, ' ', 'glass');
    put(wc, -7, ' ', 'glass');
    put(wc + 1, -7, ' ', 'glass');
  }
  put(25, -8, '/', 'wallS'); // raked front: top further forward
  put(25, -7, '/', 'glass');
  put(24, -8, ' ', 'glass');
  put(24, -7, ' ', 'glass');
  for (let r = -6; r <= hullTopRow(24.5) - 1; r++) put(24, r, '/', 'wallS');
  for (let r = -7; r <= hullTopRow(15.5) - 1; r++) put(15, r, r === -7 ? 'o' : '|', 'm1'); // door with porthole
  put(21, -5, 'O', 'ring');
  for (let c = 13; c <= 26; c++) put(c, roofRow, c === 13 || c === 26 ? '_' : '=', 'roof');
  // Exhaust stack, whip antenna, radar pedestal
  put(14, -12, '=', 'm3');
  put(15, -12, '=', 'm3');
  for (let r = -11; r <= -10; r++) {
    put(14, r, '#', 'm4');
    put(15, r, '%', 'm3');
  }
  for (let r = -13; r <= -10; r++) put(18, r, '|', 'rigL');
  put(18, -14, "'", 'rigL');
  put(23, -10, '|', 'rig');

  // ---- Aft working deck: net drum, stacked fish crates, spare floats ----
  const aft = hullTopRow(8.5); // deck cap row aft
  put(6, aft - 2, '(', 'm3');
  put(7, aft - 2, '@', 'm3');
  put(8, aft - 2, ')', 'm3');
  put(6, aft - 1, '/', 'rig');
  put(7, aft - 1, '#', 'm2');
  put(8, aft - 1, '\\', 'rig');
  put(9, aft - 1, '[', 'm2');
  put(10, aft - 1, '#', 'm2');
  put(11, aft - 1, ']', 'm2');
  put(10, aft - 2, '[', 'm1');
  put(11, aft - 2, '=', 'm1');
  put(12, aft - 2, ']', 'm1');
  put(12, aft - 1, 'o', 'm0');
  put(13, aft - 1, 'o', 'm0');

  // ---- Foremast, crosstree, forestay and foredeck rail ----
  for (let r = -16; r <= hullTopRow(30.5) - 1; r++) put(30, r, '|', 'rig');
  put(29, -14, '-', 'rig');
  put(30, -14, '+', 'rig');
  put(31, -14, '-', 'rig');
  put(30, -17, "'", 'rigL'); // masthead light
  for (let c = 26; c <= BOAT_LH - 3; c++) {
    const rr = hullTopRow(c + 0.5) - 1;
    put(c, rr, (c - 26) % 3 === 0 ? '+' : '-', 'rigL', false);
  }
  const rasterRig = (x0: number, y0: number, x1: number, y1: number, st: string) => {
    const dx = x1 - x0;
    const dy = y1 - y0;
    const n = Math.ceil(Math.max(Math.abs(dx), Math.abs(dy)) / 0.9);
    const sl = dy !== 0 ? dx / dy : 99;
    const g = Math.abs(sl) < 0.35 ? '|' : Math.abs(sl) > 2.4 ? '-' : sl > 0 ? '\\' : '/';
    for (let i = 1; i < n; i++) put(Math.floor(x0 + (dx * i) / n), Math.floor(y0 + (dy * i) / n), g, st, false);
  };
  rasterRig(30.5, -15.4, BOAT_LH - 0.3, -hullFreeboard(BOAT_LH) - 0.4, 'rigL'); // forestay to the stem head
  rasterRig(29.5, -13.6, 26.5, -9.4, 'rigL'); // shroud down to the wheelhouse roof
  return cells;
}

const BOAT_LAYOUT = buildBoatLayout();

// Per-frame glyph atlas (animated parts only)
const BG: readonly string[] = [
  '.', ':', '-', '=', '+', '*', 'x', '#', '%', '8', '@', '|', '/', '\\', '(', ')',
  '<', '>', 'o', 'O', '~', "'", ',', '`', '_', '^', 'v', 'J', 'X', 'V', ';', '{', '}'
];
const bi = (ch: string) => BG.indexOf(ch);
const B_DOT = bi('.'), B_COLON = bi(':'), B_DASH = bi('-'), B_EQ = bi('='), B_PLUS = bi('+'), B_HASH = bi('#');
const B_PCT = bi('%'), B_BAR = bi('|'), B_SLASH = bi('/'), B_BSLASH = bi('\\'), B_LPAR = bi('('), B_RPAR = bi(')');
const B_LT = bi('<'), B_GT = bi('>'), B_o = bi('o'), B_TILDE = bi('~'), B_APOS = bi("'"), B_COMMA = bi(',');
const B_CARET = bi('^'), B_J = bi('J'), B_X = bi('X'), B_V = bi('V'), B_LBRACE = bi('{'), B_RBRACE = bi('}');
const FISH_LEFT = [B_LT, B_o, B_HASH, B_GT, B_LT];
const FISH_RIGHT = [B_GT, B_LT, B_HASH, B_o, B_GT];
const FISH_SMALL = [B_LT, B_o, B_GT];

// Atlas rows
const BR_RIG = 0; // dark rigging ink
const BR_UNDER = 1; // line / gear seen through water
const BR_FOAM = 2; // white foam & spray
const BR_FOAM_B = 3; // blue-grey foam
const BR_M = 4; // 4..8 mosaic levels (fill + ink)
const BR_SILVER = 9; // silver fish belly
const BR_SMOKE = 10;
const BR_COUNT = 11;

function bakeBoatAtlas(cell: number, scale: number): GlyphAtlas {
  const t = Math.max(2, Math.round(cell * scale));
  const canvas = document.createElement('canvas');
  canvas.width = BG.length * t;
  canvas.height = BR_COUNT * t;
  const c = canvas.getContext('2d');
  if (c) {
    c.font = `bold ${(t * 0.86).toFixed(2)}px ${FONT_FAMILY}`;
    c.textAlign = 'center';
    c.textBaseline = 'middle';
    const pad = Math.max(0.5, t * 0.07);
    const rows: TileStyle[] = [];
    rows[BR_RIG] = BOAT_STYLES.rig;
    rows[BR_UNDER] = tileStyle(null, 0, [34, 66, 86], 0.64);
    rows[BR_FOAM] = tileStyle(null, 0, [255, 255, 255], 0.92);
    rows[BR_FOAM_B] = tileStyle(null, 0, [104, 152, 176], 0.72);
    for (let i = 0; i < 5; i++) rows[BR_M + i] = BOAT_STYLES['m' + i];
    rows[BR_SILVER] = tileStyle([214, 224, 230], 0.82, [36, 58, 74], 0.78);
    rows[BR_SMOKE] = tileStyle(null, 0, [118, 130, 138], 0.6);
    for (let r = 0; r < BR_COUNT; r++) {
      const st = rows[r];
      for (let g = 0; g < BG.length; g++) {
        if (st.fill) {
          c.fillStyle = st.fill;
          c.fillRect(g * t + pad, r * t + pad, t - pad * 2, t - pad * 2);
        }
        c.fillStyle = st.ink;
        c.fillText(BG[g], g * t + t * 0.5, r * t + t * 0.54);
      }
    }
  }
  return { canvas, tw: t, th: t };
}

function bakeBoatLayer(cell: number, scale: number, r0: number, r1: number): HTMLCanvasElement {
  const t = Math.max(2, Math.round(cell * scale));
  const canvas = document.createElement('canvas');
  canvas.width = BOAT_NC * t;
  canvas.height = (r1 - r0 + 1) * t;
  const c = canvas.getContext('2d');
  if (c) {
    c.font = `bold ${(t * 0.86).toFixed(2)}px ${FONT_FAMILY}`;
    c.textAlign = 'center';
    c.textBaseline = 'middle';
    const pad = Math.max(0.5, t * 0.07);
    for (let r = r0; r <= r1; r++) {
      for (let cc = BOAT_C0; cc <= BOAT_C1; cc++) {
        const cell = BOAT_LAYOUT[cc - BOAT_C0 + (r - BOAT_TOP) * BOAT_NC];
        if (!cell) continue;
        const x = (cc - BOAT_C0) * t;
        const y = (r - r0) * t;
        if (cell.st.fill) {
          c.fillStyle = cell.st.fill;
          c.fillRect(x + pad, y + pad, t - pad * 2, t - pad * 2);
        }
        if (cell.g !== ' ') {
          c.fillStyle = cell.st.ink;
          c.fillText(cell.g, x + t * 0.5, y + t * 0.54);
        }
      }
    }
  }
  return canvas;
}

// Fishing state machine
const F_IDLE = 0, F_SETTLE = 1, F_DEPLOY = 2, F_LOWER = 3, F_SOAK = 4, F_HAUL = 5;
const F_HANG = 6, F_SWING = 7, F_STOW = 8, F_RETRACT = 9;
const FISH_PHASE_NAMES = ['idle', 'settle', 'deploy', 'lower', 'soak', 'haul', 'hang', 'swing', 'stow', 'retract'];

const ANG_STOW = 0.14; // A-frame resting, leaning slightly forward
const ANG_OUT = -0.52; // A-frame swung out over the stern
const ANG_IN = 0.42; // A-frame swung inboard over the working deck
const FRAME_LEN = 7.2; // A-frame leg length (cells)
const PIVOT_X = 1.4;
const CRATE_X = 11;
const CRATE_Y = -5.6;

const rnd = (a: number, b: number) => a + Math.random() * (b - a);

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
  state: {
    phase: string;
    gear: string;
    catchCount: number;
    attempts: number;
    landed: number;
    empty: number;
    visible: boolean;
    tiles: number;
    ms: number;
  };
}

export function createAsciiFishingBoat(atlasScale: number): FishingBoat {
  let cell = 0;
  let atlas: GlyphAtlas | null = null;
  let layerAbove: HTMLCanvasElement | null = null;
  let layerBelow: HTMLCanvasElement | null = null;

  const fs = {
    phase: F_IDLE,
    t: 0,
    dur: rnd(9, 14), // first attempt soon after arrival, then long calm intervals
    gear: 0 as 0 | 1, // 0 hand line, 1 small net
    catchN: 0,
    depth: 8,
    drop: 0, // line end relative to the water surface (rows; negative = above)
    hangDrop: 0,
    angFrom: ANG_STOW,
    angTo: ANG_STOW,
    ang: ANG_STOW,
    settle: 0,
    crate: 0,
    splashT: -1,
    splashX: 0,
    wasUnder: false,
    forceGear: -1,
    forceCatch: -1
  };
  const state = {
    phase: 'idle',
    gear: 'line',
    catchCount: 0,
    attempts: 0,
    landed: 0,
    empty: 0,
    visible: false,
    tiles: 0,
    ms: 0
  };

  // Frame-to-frame geometry shared between update/render (no allocation)
  let blockWX = 0;
  let blockWY = 0;

  const ensureCell = (w: number) => {
    const want = w < 640 ? 4.6 : w < 1024 ? 5.6 : 6.4;
    if (want === cell && atlas) return;
    cell = want;
    atlas = bakeBoatAtlas(cell, atlasScale);
    layerAbove = bakeBoatLayer(cell, atlasScale, BOAT_TOP, -1);
    layerBelow = bakeBoatLayer(cell, atlasScale, 0, BOAT_BOTTOM);
  };

  const go = (phase: number, dur: number) => {
    fs.phase = phase;
    fs.t = 0;
    fs.dur = dur;
    state.phase = FISH_PHASE_NAMES[phase];
  };
  const startAngle = (to: number) => {
    fs.angFrom = fs.ang;
    fs.angTo = to;
  };

  const update: FishingBoat['update'] = (dt, surfaceBaseY, h, reducedMotion) => {
    fs.t += dt;
    const k = fs.dur > 0 ? Math.min(1, fs.t / fs.dur) : 1;
    // Only begin new attempts while the surface is on screen (a running sequence always completes)
    const canStart = !reducedMotion && surfaceBaseY > 40 && surfaceBaseY < h * 0.9;
    if (fs.splashT >= 0) {
      fs.splashT += dt;
      if (fs.splashT > 0.9) fs.splashT = -1;
    }
    switch (fs.phase) {
      case F_IDLE:
        fs.settle += (0 - fs.settle) * Math.min(1, dt * 0.8);
        if (fs.t >= fs.dur) {
          if (!canStart) {
            fs.t = fs.dur - 2.5;
            break;
          }
          fs.gear = fs.forceGear >= 0 ? (fs.forceGear as 0 | 1) : Math.random() < 0.58 ? 0 : 1;
          if (fs.forceCatch >= 0) fs.catchN = fs.forceCatch;
          else if (fs.gear === 0) fs.catchN = Math.random() < 0.5 ? 1 : 0;
          else fs.catchN = Math.random() < 0.62 ? 2 + ((Math.random() * 2.2) | 0) : 0;
          if (fs.gear === 0) fs.catchN = Math.min(1, fs.catchN);
          fs.forceGear = -1;
          fs.forceCatch = -1;
          fs.depth = fs.gear === 0 ? rnd(7, 10) : rnd(6, 8);
          state.attempts++;
          state.gear = fs.gear === 0 ? 'line' : 'net';
          state.catchCount = fs.catchN;
          go(F_SETTLE, 2.4);
        }
        break;
      case F_SETTLE:
        fs.settle = Math.max(fs.settle, ease(k));
        if (k >= 1) {
          startAngle(ANG_OUT);
          go(F_DEPLOY, 2.4);
        }
        break;
      case F_DEPLOY:
        fs.ang = lerp(fs.angFrom, fs.angTo, ease(k));
        fs.drop = -99;
        if (k >= 1) go(F_LOWER, rnd(3.6, 5));
        break;
      case F_LOWER:
        fs.drop = fs.depth * ease(k);
        if (k >= 1) go(F_SOAK, rnd(4, 8));
        break;
      case F_SOAK:
        fs.drop = fs.depth;
        if (k >= 1) {
          fs.wasUnder = true;
          go(F_HAUL, rnd(3.8, 4.6));
        }
        break;
      case F_HAUL: {
        fs.drop = lerp(fs.depth, fs.hangDrop, ease(k));
        const under = fs.drop > 0.2;
        if (fs.wasUnder && !under && fs.catchN > 0) {
          fs.splashT = 0; // the catch breaks the surface
          fs.splashX = blockWX;
        }
        fs.wasUnder = under;
        if (k >= 1) {
          if (fs.catchN > 0) go(F_HANG, 1.7);
          else {
            startAngle(ANG_IN);
            go(F_SWING, 2.0);
          }
        }
        break;
      }
      case F_HANG:
        fs.drop = fs.hangDrop;
        if (k >= 1) {
          startAngle(ANG_IN);
          go(F_SWING, 2.3);
        }
        break;
      case F_SWING:
        fs.ang = lerp(fs.angFrom, fs.angTo, ease(k));
        if (k >= 1) {
          if (fs.catchN > 0) go(F_STOW, 1.3);
          else {
            state.empty++;
            startAngle(ANG_STOW);
            go(F_RETRACT, 1.8);
          }
        }
        break;
      case F_STOW:
        if (k >= 1) {
          fs.crate = Math.min(4, fs.crate + fs.catchN);
          state.landed += fs.catchN;
          startAngle(ANG_STOW);
          go(F_RETRACT, 1.8);
        }
        break;
      case F_RETRACT:
        fs.ang = lerp(fs.angFrom, fs.angTo, ease(k));
        if (k >= 1) {
          fs.ang = ANG_STOW;
          go(F_IDLE, rnd(30, 68));
        }
        break;
    }
  };

  // Per-frame drawing state shared by the helpers below (hoisted: no closures allocated per frame)
  let dCtx: CanvasRenderingContext2D = null as unknown as CanvasRenderingContext2D;
  let dAtlas: GlyphAtlas | null = null;
  let dCB = 6;
  let dShipX = 0;
  let dWaterY = 0;
  let dCos = 1;
  let dSin = 0;
  const toWX = (lx: number, ly: number) => dShipX + ((lx - BOAT_OX) * dCos - ly * dSin) * dCB;
  const toWY = (lx: number, ly: number) => dWaterY + ((lx - BOAT_OX) * dSin + ly * dCos) * dCB;
  /** Tile centred on a world-space point */
  const wTile = (g: number, row: number, x: number, y: number) => {
    const T = dAtlas.tw;
    dCtx.drawImage(dAtlas.canvas, g * T, row * T, T, T, x - dCB * 0.5, y - dCB * 0.5, dCB, dCB);
    state.tiles++;
  };
  /** Tile at a cell of the vessel's own (pitching) grid */
  const lTile = (g: number, row: number, cx: number, cy: number) => {
    const T = dAtlas.tw;
    dCtx.drawImage(dAtlas.canvas, g * T, row * T, T, T, (cx - BOAT_OX) * dCB, cy * dCB, dCB, dCB);
    state.tiles++;
  };

  const render: FishingBoat['render'] = (ctx, w, h, time, surfaceBaseY, reducedMotion, sampleSurfaceY) => {
    ensureCell(w);
    state.tiles = 0;
    const CB = cell;
    const maxUnder = (fs.depth + 6) * CB;
    if (surfaceBaseY < -maxUnder || surfaceBaseY > h + (-BOAT_TOP + 2) * CB || !atlas || !layerAbove || !layerBelow) {
      state.visible = false;
      return;
    }
    const tStart = performance.now();
    state.visible = surfaceBaseY > -4 * CB;

    // ---- Buoyancy: ride the sampled swell; calmer once settled for fishing ----
    const calm = 1 - 0.5 * fs.settle;
    const shipX = w * (w < 640 ? 0.66 : 0.755) + (reducedMotion ? 0 : Math.sin(time * 0.042) * (w * 0.018));
    const halfLen = BOAT_LH * 0.5 * CB;
    const sL = sampleSurfaceY(shipX - halfLen * 0.6);
    const sR = sampleSurfaceY(shipX + halfLen * 0.6);
    const sC = sampleSurfaceY(shipX);
    const heave = reducedMotion ? 0 : Math.sin(time * 1.15) * 0.8 * calm;
    const waterY = (sC * 2 + sL + sR) * 0.25 + heave + 0.15 * CB;
    const pitch =
      Math.atan((sR - sL) / (halfLen * 1.2)) * 0.55 * (1 - 0.4 * fs.settle) +
      (reducedMotion ? 0 : 0.008 * Math.sin(time * 0.7 + 1.3) * calm);
    dCtx = ctx;
    dAtlas = atlas;
    dCB = CB;
    dShipX = shipX;
    dWaterY = waterY;
    dCos = Math.cos(pitch);
    dSin = Math.sin(pitch);

    // A-frame geometry (local cells)
    const pivotY = -hullFreeboard(PIVOT_X) + 0.2;
    const topLX = PIVOT_X + Math.sin(fs.ang) * FRAME_LEN;
    const topLY = pivotY - Math.cos(fs.ang) * FRAME_LEN;
    blockWX = toWX(topLX, topLY + 0.5);
    blockWY = toWY(topLX, topLY + 0.5);
    const surfAtLine = sampleSurfaceY(blockWX);
    fs.hangDrop = -((surfAtLine - blockWY) / CB) + 1.4;

    // ---- Fishing line / net / catch in world space (hangs plumb under the block) ----
    const fishing = fs.phase >= F_LOWER && fs.phase <= F_HANG;
    const catchAttached = fs.catchN > 0 && (fs.phase === F_HAUL || fs.phase === F_HANG || fs.phase === F_SWING || fs.phase === F_STOW);
    let endX = blockWX;
    let endY = blockWY;
    if (fishing || fs.phase === F_SWING || fs.phase === F_STOW) {
      const drop = fs.phase >= F_HANG ? fs.hangDrop : fs.drop;
      endY = Math.max(blockWY + CB * 0.8, surfAtLine + drop * CB);
      // Bite: a few sharp twitches before a successful haul
      const bite =
        fs.phase === F_SOAK && fs.catchN > 0 && fs.t > fs.dur - 1.6 && !reducedMotion
          ? Math.sin(time * 26) * Math.max(0, Math.sin((fs.t - fs.dur + 1.6) * 6)) * CB * 0.35
          : 0;
      // Plumb line above water; below the surface it drifts gently with the current
      const rows = Math.max(1, Math.round((endY - blockWY) / CB));
      for (let i = 1; i <= rows; i++) {
        const y = blockWY + i * CB;
        const under = y > surfAtLine + CB * 0.3;
        const d = under ? (y - surfAtLine) / CB : 0;
        const x = blockWX + (under ? d * 0.18 * CB * (0.6 + 0.4 * Math.sin(time * 0.31)) + Math.sin(time * 1.3 + d * 0.6) * 1.2 + bite * (d / 8) : 0);
        if (i === rows) endX = x;
        if (catchAttached && i === rows) break;
        if (under) {
          ctx.globalAlpha = Math.max(0.25, 0.95 - d * 0.06);
          wTile(fs.gear === 1 && i === rows ? B_BAR : (i & 1) === 0 ? B_COLON : B_BAR, BR_UNDER, x, y);
          ctx.globalAlpha = 1;
        } else {
          wTile(B_BAR, BR_RIG, x, y);
        }
      }
      // Entry ripples where the line cuts the surface
      if (endY > surfAtLine + CB && !reducedMotion) {
        const rp = (time * 0.8) % 1;
        ctx.globalAlpha = 0.8 * (1 - rp);
        wTile(B_TILDE, BR_FOAM_B, blockWX - CB * (0.9 + rp * 1.4), surfAtLine);
        wTile(B_TILDE, BR_FOAM_B, blockWX + CB * (0.9 + rp * 1.4), surfAtLine);
        ctx.globalAlpha = 1;
      }
    }

    // Terminal gear (hook or net) and the catch
    if (fishing || fs.phase === F_SWING || fs.phase === F_STOW) {
      let gx = endX;
      let gy = endY;
      let fade = 1;
      if (fs.phase === F_STOW) {
        // Lower the catch into the crate on the working deck
        const k = ease(fs.t / fs.dur);
        gx = lerp(endX, toWX(CRATE_X, CRATE_Y), k);
        gy = lerp(endY, toWY(CRATE_X, CRATE_Y), k);
        fade = 1 - smoothstep(0.55, 1, fs.t / fs.dur);
      }
      const underGear = gy > surfAtLine + CB * 0.4;
      const swingAmp = fs.phase === F_HANG || fs.phase === F_SWING ? 1 : 0.3;
      const wig = reducedMotion ? 0 : fs.phase === F_HANG ? 1 - 0.5 * (fs.t / fs.dur) : 0.7;
      ctx.globalAlpha = fade * (underGear ? 0.7 : 1);
      if (fs.gear === 0) {
        if (fs.catchN > 0 && catchAttached) {
          // Hooked fish hanging head-up: mouth, head with eye, shaded body, peduncle, forked tail
          const ink = underGear ? BR_UNDER : BR_RIG;
          for (let r = 0; r < 6; r++) {
            const off = Math.sin(time * 8 + r * 0.8) * CB * 0.22 * (r / 5) * wig + Math.sin(time * 2.1) * CB * 0.15 * swingAmp * (r / 5);
            const y = gy + r * CB;
            const x = gx + off;
            if (r === 0) wTile(B_CARET, ink, x, y);
            else if (r === 1) {
              wTile(B_LPAR, ink, x - CB, y);
              wTile(B_o, underGear ? BR_UNDER : BR_SILVER, x, y);
              wTile(B_RPAR, ink, x + CB, y);
            } else if (r === 2 || r === 3) {
              wTile(B_LBRACE, ink, x - CB, y);
              wTile(r === 2 ? B_HASH : B_PCT, underGear ? BR_UNDER : r === 2 ? BR_M + 2 : BR_SILVER, x, y);
              wTile(B_RBRACE, ink, x + CB, y);
            } else if (r === 4) wTile(B_V, ink, x, y);
            else {
              const flick = Math.sin(time * 9) > 0;
              wTile(flick ? B_SLASH : B_LPAR, ink, x - CB * 0.7, y);
              wTile(flick ? B_BSLASH : B_RPAR, ink, x + CB * 0.7, y);
            }
          }
        } else {
          // Sinker and hook
          const row = underGear ? BR_UNDER : BR_RIG;
          wTile(B_o, row, gx, gy);
          wTile(B_J, row, gx, gy + CB);
        }
      } else {
        // Small net: bridles, mesh, cod-end; fish visible inside when there is a catch
        const ink = underGear ? BR_UNDER : BR_RIG;
        const sway = reducedMotion ? 0 : Math.sin(time * 1.7) * CB * 0.2 * swingAmp;
        const meshShift = ((time * 1.5) | 0) & 1;
        wTile(B_SLASH, ink, gx - CB + sway * 0.3, gy);
        wTile(B_BAR, ink, gx + sway * 0.3, gy);
        wTile(B_BSLASH, ink, gx + CB + sway * 0.3, gy);
        for (let r = 1; r <= 3; r++) {
          const y = gy + r * CB;
          const xo = gx + sway * (0.4 + r * 0.2);
          const half = r === 3 ? 2 : 3;
          for (let q = -half; q <= half; q++) {
            const x = xo + q * CB;
            if (q === -half) {
              wTile(r === 3 ? B_BSLASH : B_LPAR, ink, x, y);
              continue;
            }
            if (q === half) {
              wTile(r === 3 ? B_SLASH : B_RPAR, ink, x, y);
              continue;
            }
            const fishRow = catchAttached && ((r === 2 && fs.catchN >= 1) || (r === 3 && fs.catchN >= 2) || (r === 1 && fs.catchN >= 3));
            if (fishRow) {
              // Fish silhouettes in the cod-end: "<o#><" / "><#o>" (5 cells), "<o>" (3 cells)
              const seq = r === 3 ? FISH_SMALL : r === 2 ? FISH_LEFT : FISH_RIGHT;
              const gi = seq[q + half - 1];
              const filled = gi === B_o || gi === B_HASH;
              wTile(gi, underGear ? BR_UNDER : filled ? (gi === B_o ? BR_SILVER : BR_M + 2) : BR_RIG, x, y);
            } else {
              wTile((q + r + meshShift) & 1 ? B_X : B_PLUS, ink, x, y);
            }
          }
        }
        wTile(B_V, ink, gx + sway, gy + CB * 4);
        // Dripping water once the net is out
        if (!underGear && !reducedMotion && fs.phase === F_HANG) {
          const dp = (time * 1.6) % 1;
          ctx.globalAlpha = fade * (1 - dp);
          wTile(B_DOT, BR_FOAM_B, gx - CB * 0.6, gy + CB * (4.6 + dp * 2.5));
          wTile(B_COMMA, BR_FOAM_B, gx + CB * 0.8, gy + CB * (4.2 + ((dp + 0.5) % 1) * 2.5));
        }
      }
      ctx.globalAlpha = 1;
    }

    if (surfaceBaseY > -4 * CB) {
      // ---- Vessel in its own (pitching) frame ----
      ctx.save();
      ctx.translate(shipX, waterY);
      ctx.rotate(pitch);
      const lw = BOAT_NC * CB;
      const x0 = (BOAT_C0 - BOAT_OX) * CB;
      const aboveH = -BOAT_TOP * CB;

      // Rippled reflection (mirrored slices, fading with distance from the hull)
      const slices = 6;
      const srcSliceH = layerAbove.height / (-BOAT_TOP) * 1.5;
      for (let i = 0; i < slices; i++) {
        const wob = reducedMotion ? 0 : Math.sin(time * 1.6 + i * 0.9) * CB * 0.35;
        ctx.globalAlpha = 0.11 * (1 - i / slices);
        const sy = layerAbove.height - (i + 1) * srcSliceH;
        if (sy < 0) break;
        ctx.save();
        ctx.translate(x0 + wob, (i + 1) * CB * 1.05);
        ctx.scale(1, -0.7);
        ctx.drawImage(layerAbove, 0, sy, layerAbove.width, srcSliceH, 0, 0, lw, CB * 1.5);
        ctx.restore();
      }
      // Submerged hull, softened by the water column
      ctx.globalAlpha = 0.3;
      ctx.drawImage(layerBelow, x0, 0, lw, (BOAT_BOTTOM + 1) * CB);
      ctx.globalAlpha = 1;
      // The static, pre-composed vessel
      ctx.drawImage(layerAbove, x0, -aboveH, lw, aboveH);
      state.tiles++;

      // A-frame gantry: leg, hydraulic ram, block, and warp running to the net drum
      // Two legs seen slightly offset in perspective, tied by a crossbeam under the block
      const legN = Math.ceil(FRAME_LEN / 0.9);
      const legG = fs.ang > 0.2 ? B_SLASH : fs.ang < -0.2 ? B_BSLASH : B_BAR;
      for (let i = 1; i < legN; i++) {
        const u = i / legN;
        const lx = Math.floor(PIVOT_X + Math.sin(fs.ang) * FRAME_LEN * u);
        const ly = Math.floor(pivotY - Math.cos(fs.ang) * FRAME_LEN * u);
        lTile(legG, BR_RIG, lx, ly);
        if (u > 0.2) lTile(legG, BR_UNDER, lx + 1, ly + 1);
      }
      lTile(B_EQ, BR_RIG, Math.floor(topLX) + 1, Math.floor(topLY) + 1);
      const ramX = PIVOT_X + Math.sin(fs.ang) * FRAME_LEN * 0.45;
      const ramY = pivotY - Math.cos(fs.ang) * FRAME_LEN * 0.45;
      const rx0 = 4.4;
      const ry0 = -hullFreeboard(4.4) - 0.6;
      const ramN = Math.max(2, Math.ceil(Math.hypot(ramX - rx0, ramY - ry0) / 0.9));
      const ramSl = (ramX - rx0) / Math.min(-0.01, ramY - ry0);
      const ramG = Math.abs(ramSl) < 0.35 ? B_BAR : ramSl > 0 ? B_SLASH : B_BSLASH;
      for (let i = 1; i < ramN; i++) {
        const u = i / ramN;
        lTile(ramG, BR_RIG, Math.floor(lerp(rx0, ramX, u)), Math.floor(lerp(ry0, ramY, u)));
      }
      lTile(B_o, BR_M + 3, Math.floor(topLX), Math.floor(topLY));
      // Warp from block to drum: thin rope rendered with sub-cell glyph placement
      const wx1 = 7.5;
      const wy1 = -5.6;
      const wn = Math.ceil(Math.hypot(wx1 - topLX, wy1 - topLY) / 0.85);
      for (let i = 1; i < wn; i++) {
        const u = i / wn;
        const x = lerp(topLX, wx1, u);
        const y = lerp(topLY, wy1, u) + Math.sin(u * Math.PI) * 0.35;
        const fy = y - Math.floor(y);
        lTile(fy < 0.5 ? B_APOS : B_DOT, BR_RIG, x - 0.5, Math.floor(y));
      }

      // Radar scanner, pennant and catch tally in the crate
      const rf = reducedMotion ? 0 : ((time * 1.4) | 0) & 3;
      lTile(rf & 1 ? B_EQ : B_DASH, BR_RIG, 22, -11);
      lTile(B_EQ, BR_RIG, 23, -11);
      lTile(rf & 1 ? B_EQ : B_DASH, BR_RIG, 24, -11);
      const pf = reducedMotion ? 0 : ((time * 2.2) | 0) % 4;
      lTile(pf === 1 ? B_TILDE : pf === 3 ? B_DASH : B_GT, BR_RIG, 31, -16);
      if (fs.crate > 0) lTile(B_LT, BR_M + 2, 10, -6);
      if (fs.crate > 2) lTile(B_GT, BR_SILVER, 12, -6);
      ctx.restore();

      // ---- Exhaust smoke drifting aft (analytic puffs, no particles allocated) ----
      if (!reducedMotion) {
        for (let i = 0; i < 5; i++) {
          const age = (time * 0.2 + i / 5) % 1;
          const lx = 14.8 - age * 6;
          const ly = -12.8 - age * 3.6 - Math.sin(age * 3 + i) * 0.3;
          ctx.globalAlpha = 0.55 * (1 - age) * (0.6 + 0.4 * fs.settle);
          wTile(age < 0.3 ? B_o : age < 0.65 ? B_COLON : B_DOT, BR_SMOKE, toWX(lx, ly), toWY(lx, ly));
        }
        ctx.globalAlpha = 1;
      }

      // ---- Waterline foam hugging the hull, bow wave and stern wash ----
      const fShift = reducedMotion ? 0 : (time * 1.3) | 0;
      for (let c = 0; c <= BOAT_LH; c++) {
        const wx = toWX(c + 0.5, 0);
        const sy = sampleSurfaceY(wx) - CB * 0.15;
        const bowness = smoothstep(BOAT_LH - 8, BOAT_LH, c);
        const g = (c + fShift) % 3 === 0 ? B_TILDE : (c + fShift) % 3 === 1 ? B_DASH : B_TILDE;
        ctx.globalAlpha = 0.5 + 0.35 * bowness;
        wTile(g, BR_FOAM_B, wx, sy + CB * 0.55);
        if ((c + fShift) % 4 === 0 || bowness > 0.5) {
          ctx.globalAlpha = 0.9;
          wTile(B_TILDE, BR_FOAM, wx, sy + CB * 0.25);
        }
      }
      if (!reducedMotion) {
        for (let i = 0; i < 3; i++) {
          const ph = (time * 0.9 + i * 0.33) % 1;
          const wx = toWX(BOAT_LH + 0.6 + i * 0.9 + ph * 0.8, 0);
          ctx.globalAlpha = 0.75 * (1 - ph);
          wTile(i === 0 ? B_CARET : B_COMMA, BR_FOAM, wx, sampleSurfaceY(wx) - CB * (0.6 - i * 0.2));
          const sx = toWX(-0.8 - i * 1.1 - ph * 1.2, 0);
          ctx.globalAlpha = 0.6 * (1 - ph);
          wTile(B_TILDE, BR_FOAM_B, sx, sampleSurfaceY(sx));
        }
      }
      ctx.globalAlpha = 1;
    }

    // ---- Spray when the catch breaks the surface ----
    if (fs.splashT >= 0 && !reducedMotion) {
      const st = fs.splashT;
      const sy = sampleSurfaceY(fs.splashX);
      for (let i = 0; i < 5; i++) {
        const dir = i - 2;
        const k = Math.min(1, st / 0.75);
        const x = fs.splashX + dir * CB * 0.55 * (0.4 + k * 1.8);
        const y = sy - Math.sin(k * Math.PI) * CB * (1.6 + (i & 1) * 0.9);
        ctx.globalAlpha = 0.9 * (1 - k);
        wTile(k < 0.35 ? B_APOS : B_DOT, BR_FOAM, x, y);
      }
      ctx.globalAlpha = 0.7 * (1 - Math.min(1, st / 0.9));
      wTile(B_TILDE, BR_FOAM_B, fs.splashX - CB * (1 + st * 3), sy);
      wTile(B_TILDE, BR_FOAM_B, fs.splashX + CB * (1 + st * 3), sy);
      ctx.globalAlpha = 1;
    }
    state.ms = state.ms * 0.9 + (performance.now() - tStart) * 0.1;
  };

  const rebake = () => {
    cell = 0; // forces a rebake on the next render
  };

  const forceFishing: FishingBoat['forceFishing'] = (gear, catchCount) => {
    fs.forceGear = gear === 'net' ? 1 : gear === 'line' ? 0 : -1;
    fs.forceCatch = typeof catchCount === 'number' ? catchCount : -1;
    if (fs.phase === F_IDLE) fs.t = fs.dur;
  };

  return { update, render, rebake, forceFishing, state };
}

