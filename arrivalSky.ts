/**
 * THE ARRIVAL'S SKY — the model, without a canvas (drawn by arrivalField.ts).
 *
 * One night sky in the opening's own language: the same kind of polar starfield the Eye of
 * Creation and its arrival use, laid out as an editorial composition around the type rather than
 * as noise.
 *   a Milky Way band crossing from the lower left through the open centre, where far stars and
 *     fine dust gather, split by a darker lane
 *   one distant spiral galaxy, inclined and very faint, in the open field opposite the title
 *   a small open cluster on the band, three depth planes of stars with power-law brightness
 *   rare meteors at three apparent depths
 * Everything is positions and light; the field turns it into glyphs on the ocean's lattice.
 */

export const hash2 = (x: number, y: number) => {
  let h = (Math.imul(x | 0, 374761393) + Math.imul(y | 0, 668265263)) | 0;
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
};

/** A small seeded generator: the same sky for the same screen, every visit. */
export function seeded(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const clamp01 = (v: number) => Math.max(0, Math.min(1, v));
export const smooth = (a: number, b: number, v: number) => {
  const t = clamp01((v - a) / (b - a));
  return t * t * (3 - 2 * t);
};

/** Value noise on a lattice, smooth between points (dust, the band's own irregularity). */
export function valueNoise(x: number, y: number) {
  const ix = Math.floor(x), iy = Math.floor(y), fx = x - ix, fy = y - iy;
  const ux = fx * fx * (3 - 2 * fx), uy = fy * fy * (3 - 2 * fy);
  const a = hash2(ix, iy), b = hash2(ix + 1, iy), c = hash2(ix, iy + 1), d = hash2(ix + 1, iy + 1);
  return a + (b - a) * ux + (c - a) * uy + (a - b - c + d) * ux * uy;
}
const fbm = (x: number, y: number) => 0.55 * valueNoise(x, y) + 0.3 * valueNoise(x * 2.1 + 5.2, y * 2.1 - 1.7) + 0.15 * valueNoise(x * 4.3 - 3.1, y * 4.3 + 8.4);

export interface SkyLayout {
  w: number;
  h: number;
  /** The galaxy: centre, radius (px), position angle and axis ratio of its inclined disk */
  galaxy: { x: number; y: number; r: number; pa: number; incl: number };
  /** The band: a line through two points, and its half-width (px) */
  band: { ax: number; ay: number; bx: number; by: number; width: number };
  cluster: { x: number; y: number; r: number };
}

/**
 * Composed to the arrival's layout: the title holds the upper left and the journeys the lower
 * right, so the galaxy takes the open field above the journeys and the band runs through the
 * channel between them, from the cluster in the lower left toward the galaxy.
 */
export function skyLayout(w: number, h: number): SkyLayout {
  const landscape = w / h >= 0.9;
  const m = Math.min(w, h);
  return {
    w, h,
    galaxy: landscape
      ? { x: 0.765 * w, y: 0.27 * h, r: 0.23 * m, pa: -0.36, incl: 0.52 }
      : { x: 0.7 * w, y: 0.155 * h, r: 0.32 * w, pa: -0.3, incl: 0.52 },
    band: landscape
      ? { ax: -0.05 * w, ay: 1.12 * h, bx: 1.02 * w, by: 0.04 * h, width: 0.15 * m }
      : { ax: -0.1 * w, ay: 0.98 * h, bx: 1.1 * w, by: 0.1 * h, width: 0.2 * m },
    cluster: landscape ? { x: 0.17 * w, y: 0.84 * h, r: 0.07 * m } : { x: 0.83 * w, y: 0.44 * h, r: 0.09 * m }
  };
}

/** Across the band: 0 on its spine, signed px. Along it: px from its first point. */
function bandCoords(x: number, y: number, L: SkyLayout) {
  const { ax, ay, bx, by } = L.band;
  const dx = bx - ax, dy = by - ay, len = Math.hypot(dx, dy);
  const ux = dx / len, uy = dy / len;
  const px = x - ax, py = y - ay;
  return { along: px * ux + py * uy, across: -px * uy + py * ux };
}

/** How much of the band is here, 0..1: a soft, irregular river of light, never a stripe. */
export function bandWeight(x: number, y: number, L: SkyLayout) {
  const { along, across } = bandCoords(x, y, L);
  const swell = 0.75 + 0.5 * fbm(along / 260, 3.7);
  const width = L.band.width * swell;
  const wander = (fbm(along / 340, 9.1) - 0.5) * L.band.width * 0.9;
  return Math.exp(-(((across - wander) / width) ** 2)) * (0.55 + 0.45 * fbm(along / 180, 1.3));
}

/** Fine dust along the band, with the darker lane down its spine: faint, 0..~0.2. */
export function dustAt(x: number, y: number, L: SkyLayout) {
  const b = bandWeight(x, y, L);
  if (b < 0.06) return 0;
  const { along, across } = bandCoords(x, y, L);
  const n = fbm(along / 46, across / 46);
  const wander = (fbm(along / 340, 9.1) - 0.5) * L.band.width * 0.9;
  const lane = 1 - 0.8 * Math.exp(-(((across - wander - L.band.width * 0.12) / (L.band.width * 0.22)) ** 2)) * smooth(0.3, 0.7, fbm(along / 120, 4.4));
  return b * smooth(0.5, 0.82, n) * 0.2 * lane;
}

/**
 * The galaxy's light at (x, y), 0..1: a two-armed logarithmic spiral seen inclined, its bulge
 * warm and small. `twist` winds the arms (the Odyssey's pull); `t` turns it imperceptibly.
 * Returns the bulge's share too, for its tint.
 */
export function galaxyLight(x: number, y: number, L: SkyLayout, t: number, twist = 0) {
  const G = L.galaxy;
  const dx = x - G.x, dy = y - G.y;
  const c = Math.cos(G.pa), s = Math.sin(G.pa);
  const u = dx * c + dy * s, v = (-dx * s + dy * c) / G.incl;
  const r = Math.hypot(u, v) / G.r;
  if (r > 1.3) return { light: 0, core: 0 };
  const theta = Math.atan2(v, u);
  // An open pitch and broad arms: at a 14 px cell a tight spiral would read as a smudge
  const spiral = Math.cos(2 * (theta - 2.0 * Math.log(r + 0.035)) - t * 0.006 - twist);
  const arm = Math.pow(Math.max(0, 0.5 + 0.5 * spiral), 1.8);
  const disk = Math.exp(-r * 1.7) * (0.06 + 0.94 * arm);
  const bulge = Math.exp(-((r / 0.07) ** 2));
  const light = (disk * 0.9 + bulge * 0.95) * (1 - smooth(0.8, 1.3, r));
  return { light: clamp01(light), core: bulge / (bulge + disk + 1e-6) };
}

export type Plane = 0 | 1 | 2;
export interface Star {
  /** At rest, in px (the sky extends a margin past the screen so drift can wrap unseen) */
  x: number;
  y: number;
  plane: Plane;
  /** 0..1, power-law: most stars faint, a few bright */
  mag: number;
  /** palette index (arrivalField): 0 site ink, 1 cool white, 2 warm */
  tint: 0 | 1 | 2;
  f1: number;
  f2: number;
  phase: number;
}

/** Stars per px² for each plane, far to near */
export const PLANE_DENSITY = [2.3e-4, 0.62e-4, 0.17e-4] as const;
export const SKY_MARGIN = 48;

export function buildSky(w: number, h: number, seed = 1977): Star[] {
  const L = skyLayout(w, h);
  const rand = seeded(seed);
  const W = w + 2 * SKY_MARGIN, H = h + 2 * SKY_MARGIN;
  const stars: Star[] = [];
  const add = (x: number, y: number, plane: Plane, lo: number, hi: number, warmth = 0.12) => {
    const k = rand();
    stars.push({
      x, y, plane,
      mag: lo + (hi - lo) * Math.pow(rand(), 2.4),
      tint: k < warmth ? 2 : k < warmth + (plane === 0 ? 0.25 : 0.5) ? 1 : 0,
      f1: 0.5 + 1.6 * rand(), f2: 1.4 + 2.6 * rand(), phase: rand() * Math.PI * 2
    });
  };
  const ranges: [number, number][] = [[0.14, 0.52], [0.26, 0.82], [0.5, 1]];
  ([0, 1, 2] as Plane[]).forEach(plane => {
    const target = Math.round(W * H * PLANE_DENSITY[plane]);
    // Far stars gather along the band; nearer ones barely care
    const bias = plane === 0 ? 0.75 : plane === 1 ? 0.35 : 0;
    let placed = 0, guard = 0;
    while (placed < target && guard++ < target * 12) {
      const x = -SKY_MARGIN + rand() * W, y = -SKY_MARGIN + rand() * H;
      if (rand() > 1 - bias + bias * bandWeight(x, y, L)) continue;
      add(x, y, plane, ...ranges[plane]);
      placed++;
    }
  });
  // The open cluster: a loose knot of young bluish stars, two or three of them bright
  const C = L.cluster;
  for (let i = 0; i < 16; i++) {
    const a = rand() * Math.PI * 2, d = Math.sqrt(-2 * Math.log(1 - rand() * 0.95)) * C.r * 0.5;
    add(C.x + Math.cos(a) * d, C.y + Math.sin(a) * d * 0.8, i < 3 ? 2 : 1, i < 3 ? 0.62 : 0.2, i < 3 ? 0.95 : 0.55, 0.04);
  }
  return stars;
}

/** A meteor: where it enters, its direction, how far and how long it runs, how near it seems. */
export interface Meteor {
  x0: number;
  y0: number;
  dx: number;
  dy: number;
  length: number;
  /** ms */
  duration: number;
  born: number;
  /** 0.35 far .. 1 near */
  depth: number;
}

export function spawnMeteor(rand: () => number, w: number, h: number, now: number): Meteor {
  const k = rand();
  const depth = k < 0.5 ? 0.35 : k < 0.86 ? 0.62 : 1;
  const angle = ((16 + 22 * rand()) * Math.PI) / 180;
  const right = rand() < 0.55;
  return {
    x0: right ? (0.06 + 0.6 * rand()) * w : (0.34 + 0.6 * rand()) * w,
    y0: (0.03 + 0.36 * rand()) * h,
    dx: (right ? 1 : -1) * Math.cos(angle),
    dy: Math.sin(angle),
    length: (0.2 + 0.22 * rand()) * w * (0.55 + 0.45 * depth),
    duration: (650 + 500 * rand()) * (1.2 - 0.3 * depth),
    born: now,
    depth
  };
}

/** Where its head is at u (0..1 of its life) and how bright it is: no light at birth or death. */
export function meteorAt(m: Meteor, u: number) {
  const p = clamp01(u);
  const run = 1 - Math.pow(1 - p, 1.5);
  return { x: m.x0 + m.dx * m.length * run, y: m.y0 + m.dy * m.length * run, light: Math.pow(Math.sin(Math.PI * p), 0.7) };
}

/**
 * The ASCII stroke for one cell of a thin line running (dx, dy), on a lattice of cellW x cellH,
 * passing at `f` (0 top .. 1 bottom) of the cell's height. A shallow line is drawn the way an
 * ASCII artist would: over, dash, under (¯ - _) as it sinks through each row, so it reads as one
 * fine line, not a staircase of slashes; only a steep one uses / \ or |.
 */
export function strokeFor(dx: number, dy: number, cellW = 1, cellH = 1, f = 0.5) {
  const slope = (Math.abs(dy) / cellH) / Math.max(1e-6, Math.abs(dx) / cellW);
  if (slope < 0.7) return f < 0.34 ? '¯' : f < 0.67 ? '-' : '_';
  if (slope > 2.2) return '|';
  return dx * dy > 0 ? '\\' : '/';
}
