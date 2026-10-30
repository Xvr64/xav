/**
 * Humpback whale anatomy: one procedural, articulated 3D mesh (no Three.js, so it is testable in Node).
 *
 * Whale-local convention, shared by every whale3d module:
 *   -Z forward (the snout tip sits at z = -0.5), +Y dorsal, +X the whale's right side.
 *   Units are body lengths: snout tip to fluke notch is 1. s = z + 0.5 runs 0 (snout) → 1 (notch).
 *
 * The body is lofted from superellipse cross-sections whose half-width, upper and lower heights
 * and centre line follow measured humpback proportions: a broad flat-topped head with a deep
 * lower jaw, the girth peaking just behind the flippers, a small hooked dorsal fin on its hump,
 * and a laterally compressed, keeled tail stock. The appendages are separate lofts: pectoral
 * flippers a third of the body long with a scalloped leading edge, and broad swept flukes
 * with a centre notch.
 *
 * Every vertex is stored relative to the spine (or to an appendage's pivot), so the pose module
 * can bend the body continuously along its length without seams (see whale3dPose.ts).
 */

export const SPINE_NODES = 48;
/** Where the tail stock closes; the flukes overlap it from FLUKE_ROOT_S. */
export const BODY_END = 0.965;
export const FLIPPER_ROOT_S = 0.305;
export const FLUKE_ROOT_S = 0.925;

export const PART_BODY = 0;
export const PART_FLIPPER_L = 1;
export const PART_FLIPPER_R = 2;
export const PART_FLUKE = 3;
export const PART_FIN = 4;

export const REGION_SKIN = 0;
export const REGION_MOUTH = 1;
export const REGION_EYE = 2;
export const REGION_PLEATS = 3;

export type V3 = [number, number, number];

// ---- Profile curves ---------------------------------------------------------------------------

/** Monotone cubic (Fritsch–Carlson) through [x, y] knots: smooth, never overshoots a profile. */
export function monotoneCurve(knots: readonly (readonly [number, number])[]): (x: number) => number {
  const n = knots.length;
  const xs = knots.map((k) => k[0]);
  const ys = knots.map((k) => k[1]);
  const d: number[] = [];
  for (let i = 0; i < n - 1; i++) d.push((ys[i + 1] - ys[i]) / (xs[i + 1] - xs[i]));
  const m: number[] = [d[0]];
  for (let i = 1; i < n - 1; i++) m.push(d[i - 1] * d[i] <= 0 ? 0 : (d[i - 1] + d[i]) / 2);
  m.push(d[n - 2]);
  for (let i = 0; i < n - 1; i++) {
    if (d[i] === 0) {
      m[i] = 0;
      m[i + 1] = 0;
      continue;
    }
    const a = m[i] / d[i];
    const b = m[i + 1] / d[i];
    const h = a * a + b * b;
    if (h > 9) {
      const t = 3 / Math.sqrt(h);
      m[i] = t * a * d[i];
      m[i + 1] = t * b * d[i];
    }
  }
  return (x: number) => {
    if (x <= xs[0]) return ys[0];
    if (x >= xs[n - 1]) return ys[n - 1];
    let i = 0;
    while (i < n - 2 && x > xs[i + 1]) i++;
    const h = xs[i + 1] - xs[i];
    const t = (x - xs[i]) / h;
    const t2 = t * t;
    const t3 = t2 * t;
    return (
      (2 * t3 - 3 * t2 + 1) * ys[i] +
      (t3 - 2 * t2 + t) * h * m[i] +
      (-2 * t3 + 3 * t2) * ys[i + 1] +
      (t3 - t2) * h * m[i + 1]
    );
  };
}

// s, half-width, height above the centre line, depth below it, centre line
const PROFILE: readonly (readonly [number, number, number, number, number])[] = [
  [0.0, 0.0, 0.0, 0.0, -0.012],
  [0.01, 0.022, 0.014, 0.022, -0.012],
  [0.035, 0.042, 0.026, 0.042, -0.012],
  [0.08, 0.06, 0.038, 0.06, -0.011],
  [0.15, 0.077, 0.052, 0.08, -0.01],
  [0.23, 0.092, 0.068, 0.098, -0.008],
  [0.31, 0.103, 0.083, 0.108, -0.005],
  [0.39, 0.107, 0.094, 0.104, -0.001],
  [0.47, 0.103, 0.099, 0.091, 0.004],
  [0.55, 0.093, 0.099, 0.075, 0.009],
  [0.62, 0.078, 0.094, 0.063, 0.012],
  [0.69, 0.06, 0.081, 0.054, 0.013],
  [0.77, 0.04, 0.062, 0.044, 0.011],
  [0.84, 0.025, 0.044, 0.033, 0.008],
  [0.9, 0.015, 0.028, 0.022, 0.005],
  [0.94, 0.009, 0.015, 0.013, 0.002],
  [BODY_END, 0.0, 0.0, 0.0, 0.001]
];
const col = (c: number) => monotoneCurve(PROFILE.map((k) => [k[0], k[c]] as const));
export const halfWidthAt = col(1);
export const topAt = col(2);
export const bottomAt = col(3);
export const centreAt = col(4);
/** Superellipse exponents: a flat, squarish head top; round mid-body; keeled tail stock. */
const topExp = monotoneCurve([[0, 2.7], [0.2, 2.6], [0.45, 2.1], [0.65, 2.0], [0.8, 1.65], [0.95, 1.45]]);
const bottomExp = monotoneCurve([[0, 2.3], [0.3, 2.2], [0.5, 2.0], [0.75, 1.8], [0.95, 1.55]]);
/** The mouth line on the head's side: from the snout tip it runs back and down to the gape. */
export const MOUTH_END_S = 0.285;
export const mouthLineY = (s: number) => {
  const t = Math.min(1, s / MOUTH_END_S);
  return centreAt(s) - bottomAt(s) * (0.08 + 0.34 * t ** 1.5);
};
export const EYE_S = 0.292;
export const eyeY = () => mouthLineY(EYE_S) + 0.017;

const smoothstep = (a: number, b: number, x: number) => {
  const t = Math.max(0, Math.min(1, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};
const spow = (v: number, e: number) => Math.sign(v) * Math.abs(v) ** e;

// ---- Mesh assembly ----------------------------------------------------------------------------

export interface WhaleGeometry {
  /** Vertex offset from its spine sample (body, fin) or from its appendage pivot (flippers, flukes). */
  readonly offset: Float32Array;
  /** Unit normal in the same local frame as the offset (before articulation). */
  readonly normal: Float32Array;
  /** Fractional spine node index the vertex follows, 0 … SPINE_NODES - 1. */
  readonly spine: Float32Array;
  /** part, region, pigment (0 pale … 1 dark), dissolve key (0 dissolves last … 1 first) */
  readonly info: Float32Array;
  /** The assembled rest pose, whale-local (for bounds, sampling and tests). */
  readonly rest: Float32Array;
  readonly index: Uint32Array;
  readonly vertexCount: number;
  /** Appendage pivots in whale-local rest space: left flipper, right flipper, flukes. */
  readonly pivots: { flipperL: V3; flipperR: V3; fluke: V3 };
  /** First triangle index and count per part, for sampling. */
  readonly parts: { part: number; start: number; count: number }[];
}

interface PartBuilder {
  pos: number[];
  info: number[];
  spine: number[];
  idx: number[];
}
const newPart = (): PartBuilder => ({ pos: [], info: [], spine: [], idx: [] });
const spineIndexOf = (s: number) => Math.max(0, Math.min(1, s)) * (SPINE_NODES - 1);

/** Loft grid indices: rings of `around` vertices, `rings` of them, closed around. */
function loftIndices(b: PartBuilder, base: number, rings: number, around: number) {
  for (let i = 0; i < rings - 1; i++) {
    for (let j = 0; j < around; j++) {
      const j1 = (j + 1) % around;
      const a = base + i * around + j;
      const bb = base + i * around + j1;
      const c = base + (i + 1) * around + j;
      const d = base + (i + 1) * around + j1;
      b.idx.push(a, c, bb, bb, c, d);
    }
  }
}
/** Fan a ring closed onto one apex vertex. */
function capIndices(b: PartBuilder, ringBase: number, around: number, apex: number, flip: boolean) {
  for (let j = 0; j < around; j++) {
    const a = ringBase + j;
    const c = ringBase + ((j + 1) % around);
    if (flip) b.idx.push(a, c, apex);
    else b.idx.push(c, a, apex);
  }
}

function buildBody(b: PartBuilder) {
  const RINGS = 76;
  const AROUND = 40;
  for (let i = 0; i < RINGS; i++) {
    const u = (i + 1) / (RINGS + 1);
    // Denser rings at the snout and the tail stock, where the outline turns fastest
    const s = BODY_END * (0.3 * u + 0.7 * (0.5 - 0.5 * Math.cos(Math.PI * u)));
    const w = halfWidthAt(s);
    const ht = topAt(s) + 0.0055 * Math.exp(-(((s - 0.61) / 0.05) ** 2)); // the hump under the fin
    const hb = bottomAt(s);
    const yc = centreAt(s);
    const nt = topExp(s);
    const nb = bottomExp(s);
    const ym = mouthLineY(s);
    for (let j = 0; j < AROUND; j++) {
      const phi = (2 * Math.PI * j) / AROUND;
      const c = Math.cos(phi);
      const sn = Math.sin(phi);
      const n = sn >= 0 ? nt : nb;
      let x = w * spow(c, 2 / n);
      let y = yc + (sn >= 0 ? ht : hb) * spow(sn, 2 / n);
      let region = REGION_SKIN;
      // Mouth: a shallow crease along the jaw line on each side of the head
      if (s < MOUTH_END_S + 0.01 && Math.abs(c) > 0.25) {
        const crease = Math.exp(-(((y - ym) / 0.0048) ** 2)) * smoothstep(0.004, 0.03, s) * (1 - smoothstep(MOUTH_END_S - 0.02, MOUTH_END_S + 0.01, s));
        const side = Math.abs(c);
        x -= Math.sign(x) * 0.0035 * crease * side;
        y -= 0.0012 * crease;
        if (crease > 0.38) region = REGION_MOUTH;
      }
      if (Math.abs(c) > 0.35 && Math.hypot((s - EYE_S) * 0.9, y - eyeY()) < 0.0062) region = REGION_EYE;
      // Throat pleats: the grooved ventral pouch from chin to navel
      if (y < yc - hb * 0.42 && s > 0.025 && s < 0.5) region = REGION_PLEATS;
      // Countershading: dark back, pale throat and belly
      const vertical = sn * (sn >= 0 ? ht : hb) / Math.max(1e-4, Math.hypot(c * w, sn * (sn >= 0 ? ht : hb)));
      const pigment = 0.12 + 0.88 * smoothstep(-0.62, 0.05, vertical);
      b.pos.push(x, y, s - 0.5);
      b.info.push(PART_BODY, region, pigment, s / BODY_END);
      b.spine.push(spineIndexOf(s));
    }
  }
  loftIndices(b, 0, RINGS, AROUND);
  const tip = b.pos.length / 3;
  b.pos.push(0, centreAt(0), -0.5);
  b.info.push(PART_BODY, REGION_SKIN, 0.75, 0);
  b.spine.push(0);
  const end = b.pos.length / 3;
  b.pos.push(0, centreAt(BODY_END), BODY_END - 0.5);
  b.info.push(PART_BODY, REGION_SKIN, 0.9, 1);
  b.spine.push(spineIndexOf(BODY_END));
  capIndices(b, 0, AROUND, tip, true);
  capIndices(b, (RINGS - 1) * AROUND, AROUND, end, false);
}

/** Thin airfoil section: chord fraction 0 (leading edge) … 1 (trailing), half thickness factor. */
const AIRFOIL = (xc: number) => 1.32 * Math.sqrt(Math.max(0, xc)) * (1 - xc) ** 0.85 / 0.6;

/**
 * The right pectoral flipper in its own frame: pivot at the root, span along +X, chord along +Z
 * (leading edge toward -Z), thickness along Y. The left flipper mirrors it.
 */
function flipperShape(): { pos: number[]; rings: number; around: number } {
  const RINGS = 30;
  const AROUND = 14;
  const LEN = 0.31;
  const pos: number[] = [];
  for (let k = 0; k < RINGS; k++) {
    const t = k / (RINGS - 1);
    const u = -0.05 + 1.05 * (1 - (1 - t) ** 1.35);
    const uc = Math.max(0, u);
    let chord = 0.066 * (1 - 0.5 * uc ** 1.2);
    if (uc > 0.8) chord *= Math.sqrt(Math.max(0.0, 1 - ((uc - 0.8) / 0.2) ** 2));
    chord = Math.max(chord, 0.0015);
    // Knobbed leading edge (the tubercles), and a planform that sweeps gently back
    const knobs = 0.0042 * Math.max(0, Math.sin(uc * Math.PI * 11)) ** 2 * smoothstep(0.18, 0.32, uc) * (1 - smoothstep(0.82, 0.95, uc));
    const le = -0.42 * chord + 0.05 * uc ** 1.6 - knobs;
    const thick = 0.19 * chord + 0.0015;
    const droop = -0.022 * uc ** 2;
    for (let j = 0; j < AROUND; j++) {
      const th = (2 * Math.PI * j) / AROUND;
      const xc = 0.5 - 0.5 * Math.cos(th);
      const side = Math.sin(th) >= 0 ? 1 : -1;
      const cam = 0.06 * thick * Math.sin(Math.PI * xc); // a little camber
      pos.push(u * LEN, droop + cam + side * 0.5 * thick * AIRFOIL(xc), le + (chord + knobs) * xc);
    }
  }
  return { pos, rings: RINGS, around: AROUND };
}

function buildFlipper(b: PartBuilder, part: number, mirror: boolean, shape: ReturnType<typeof flipperShape>) {
  const base = b.pos.length / 3;
  const { pos, rings, around } = shape;
  for (let v = 0; v < pos.length; v += 3) {
    const span = pos[v] / 0.31;
    b.pos.push(mirror ? -pos[v] : pos[v], pos[v + 1], pos[v + 2]);
    // Humpback flippers are pale; the tips dissolve before the root
    const underside = pos[v + 1] < 0 ? 0 : 1;
    b.info.push(part, REGION_SKIN, 0.3 + 0.22 * underside, 0.42 + 0.3 * Math.max(0, span));
    b.spine.push(spineIndexOf(FLIPPER_ROOT_S));
  }
  const local: PartBuilder = newPart();
  loftIndices(local, 0, rings, around);
  const tip = b.pos.length / 3;
  b.pos.push(mirror ? -0.31 : 0.31, -0.022, 0.05 + 0.002);
  b.info.push(part, REGION_SKIN, 0.4, 0.72);
  b.spine.push(spineIndexOf(FLIPPER_ROOT_S));
  capIndices(local, (rings - 1) * around, around, tip - base, false);
  for (let i = 0; i < local.idx.length; i += 3) {
    const a = local.idx[i] + base;
    const c = local.idx[i + 1] + base;
    const d = local.idx[i + 2] + base;
    if (mirror) b.idx.push(a, d, c);
    else b.idx.push(a, c, d);
  }
}

/** The flukes in the pivot frame: span along X, chord along +Z, a notch at the centre. */
function buildFlukes(b: PartBuilder) {
  const STATIONS = 49;
  const AROUND = 12;
  const HALF_SPAN = 0.168;
  for (let k = 0; k < STATIONS; k++) {
    const t = (k / (STATIONS - 1)) * 2 - 1;
    const u = Math.sign(t) * Math.abs(t) ** 0.85; // denser stations near the tips
    const a = Math.abs(u);
    const le = -0.012 + 0.098 * a ** 1.35;
    let chord = 0.074 * Math.max(0, 1 - a ** 2.5) ** 0.55 + 0.0012;
    // Trailing edge: the centre notch, then a gently scalloped, swept edge out to the tips
    chord -= 0.016 * Math.max(0, 1 - a / 0.075) ** 1.4;
    chord += 0.0022 * Math.sin(a * 46) * smoothstep(0.25, 0.4, a) * (1 - a);
    const thick = 0.017 * (1 - a) ** 1.25 + 0.0014;
    for (let j = 0; j < AROUND; j++) {
      const th = (2 * Math.PI * j) / AROUND;
      const xc = 0.5 - 0.5 * Math.cos(th);
      const side = Math.sin(th) >= 0 ? 1 : -1;
      b.pos.push(u * HALF_SPAN, side * 0.5 * thick * AIRFOIL(xc), le + chord * xc);
      // Dark upper surface, pale patterned underside
      b.info.push(PART_FLUKE, REGION_SKIN, side > 0 ? 0.92 : 0.46, 0.97 + 0.03 * a);
      b.spine.push(spineIndexOf(FLUKE_ROOT_S));
    }
  }
  loftIndices(b, 0, STATIONS, AROUND);
  const tipL = b.pos.length / 3;
  b.pos.push(-HALF_SPAN - 0.001, 0, 0.087);
  b.info.push(PART_FLUKE, REGION_SKIN, 0.8, 1);
  b.spine.push(spineIndexOf(FLUKE_ROOT_S));
  const tipR = b.pos.length / 3;
  b.pos.push(HALF_SPAN + 0.001, 0, 0.087);
  b.info.push(PART_FLUKE, REGION_SKIN, 0.8, 1);
  b.spine.push(spineIndexOf(FLUKE_ROOT_S));
  capIndices(b, 0, AROUND, tipL, false);
  capIndices(b, (STATIONS - 1) * AROUND, AROUND, tipR, true);
}

/** The small hooked dorsal fin sitting on the hump, two thirds of the way back. */
function buildFin(b: PartBuilder) {
  const RINGS = 10;
  const AROUND = 10;
  for (let k = 0; k < RINGS; k++) {
    const v = k / (RINGS - 1);
    const chord = 0.072 * (1 - v) ** 0.75 + 0.006;
    const zle = 0.615 - 0.5 + 0.048 * v ** 1.2;
    const thick = 0.011 * (1 - v) + 0.0018;
    for (let j = 0; j < AROUND; j++) {
      const th = (2 * Math.PI * j) / AROUND;
      const xc = 0.5 - 0.5 * Math.cos(th);
      const side = Math.sin(th) >= 0 ? 1 : -1;
      const z = zle + chord * xc;
      const s = z + 0.5;
      const top = centreAt(s) + topAt(s) + 0.0055 * Math.exp(-(((s - 0.61) / 0.05) ** 2));
      const y = top - 0.008 + v * 0.036 * (1 - 0.35 * xc) + v * v * 0.004;
      b.pos.push(side * 0.5 * thick * AIRFOIL(xc), y, z);
      b.info.push(PART_FIN, REGION_SKIN, 0.95, Math.min(1, s / BODY_END));
      b.spine.push(spineIndexOf(s));
    }
  }
  loftIndices(b, 0, RINGS, AROUND);
  const tip = b.pos.length / 3;
  const s = 0.615 + 0.048 + 0.003;
  b.pos.push(0, centreAt(s) + topAt(s) - 0.008 + 0.0405, s - 0.5);
  b.info.push(PART_FIN, REGION_SKIN, 0.95, s);
  b.spine.push(spineIndexOf(s));
  capIndices(b, (RINGS - 1) * AROUND, AROUND, tip, false);
}

/** Smooth vertex normals from the triangle fan around each vertex (area weighted). */
export function vertexNormals(pos: ArrayLike<number>, idx: ArrayLike<number>, vertexCount: number): Float32Array {
  const n = new Float32Array(vertexCount * 3);
  for (let i = 0; i < idx.length; i += 3) {
    const a = idx[i] * 3;
    const b = idx[i + 1] * 3;
    const c = idx[i + 2] * 3;
    const e1x = pos[b] - pos[a], e1y = pos[b + 1] - pos[a + 1], e1z = pos[b + 2] - pos[a + 2];
    const e2x = pos[c] - pos[a], e2y = pos[c + 1] - pos[a + 1], e2z = pos[c + 2] - pos[a + 2];
    const nx = e1y * e2z - e1z * e2y;
    const ny = e1z * e2x - e1x * e2z;
    const nz = e1x * e2y - e1y * e2x;
    for (const v of [a, b, c]) {
      n[v] += nx;
      n[v + 1] += ny;
      n[v + 2] += nz;
    }
  }
  for (let v = 0; v < n.length; v += 3) {
    const l = Math.hypot(n[v], n[v + 1], n[v + 2]) || 1;
    n[v] /= l;
    n[v + 1] /= l;
    n[v + 2] /= l;
  }
  return n;
}

/** Faces wound so normals point out of each part (checked against the part's own centre line). */
function orientOutward(b: PartBuilder, axisPoint: (x: number, y: number, z: number) => V3) {
  const vc = b.pos.length / 3;
  const n = vertexNormals(b.pos, b.idx, vc);
  let score = 0;
  for (let v = 0; v < vc; v++) {
    const [cx, cy, cz] = axisPoint(b.pos[v * 3], b.pos[v * 3 + 1], b.pos[v * 3 + 2]);
    score += n[v * 3] * (b.pos[v * 3] - cx) + n[v * 3 + 1] * (b.pos[v * 3 + 1] - cy) + n[v * 3 + 2] * (b.pos[v * 3 + 2] - cz);
  }
  if (score < 0) {
    for (let i = 0; i < b.idx.length; i += 3) {
      const t = b.idx[i + 1];
      b.idx[i + 1] = b.idx[i + 2];
      b.idx[i + 2] = t;
    }
  }
}

/** Rest attachment of the right flipper: low on the flank, swept back and angled down. */
export const FLIPPER_PIVOT_R: V3 = [
  halfWidthAt(FLIPPER_ROOT_S) * 0.74,
  centreAt(FLIPPER_ROOT_S) - bottomAt(FLIPPER_ROOT_S) * 0.5,
  FLIPPER_ROOT_S - 0.5
];
export const FLUKE_PIVOT: V3 = [0, centreAt(FLUKE_ROOT_S), FLUKE_ROOT_S - 0.5];

let cached: WhaleGeometry | null = null;

export function buildWhaleGeometry(): WhaleGeometry {
  if (cached) return cached;
  const body = newPart();
  buildBody(body);
  orientOutward(body, (_x, _y, z) => [0, centreAt(z + 0.5), z]);
  const fin = newPart();
  buildFin(fin);
  orientOutward(fin, (_x, y, z) => [0, y, z]);
  const shape = flipperShape();
  const flipR = newPart();
  buildFlipper(flipR, PART_FLIPPER_R, false, shape);
  orientOutward(flipR, (x, _y, z) => [x, -0.022 * (x / 0.31) ** 2, z]);
  const flipL = newPart();
  buildFlipper(flipL, PART_FLIPPER_L, true, shape);
  orientOutward(flipL, (x, _y, z) => [x, -0.022 * (x / 0.31) ** 2, z]);
  const fluke = newPart();
  buildFlukes(fluke);
  orientOutward(fluke, (x, _y, z) => [x, 0, z]);

  const builders = [body, fin, flipL, flipR, fluke];
  const vertexCount = builders.reduce((a, p) => a + p.pos.length / 3, 0);
  const triCount = builders.reduce((a, p) => a + p.idx.length / 3, 0);
  const offset = new Float32Array(vertexCount * 3);
  const normal = new Float32Array(vertexCount * 3);
  const spine = new Float32Array(vertexCount);
  const info = new Float32Array(vertexCount * 4);
  const rest = new Float32Array(vertexCount * 3);
  const index = new Uint32Array(triCount * 3);
  const parts: { part: number; start: number; count: number }[] = [];
  const pivotL: V3 = [-FLIPPER_PIVOT_R[0], FLIPPER_PIVOT_R[1], FLIPPER_PIVOT_R[2]];
  let vBase = 0;
  let iBase = 0;
  for (const p of builders) {
    const vc = p.pos.length / 3;
    const n = vertexNormals(p.pos, p.idx, vc);
    for (let v = 0; v < vc; v++) {
      const o = (vBase + v) * 3;
      const part = p.info[v * 4];
      const x = p.pos[v * 3];
      const y = p.pos[v * 3 + 1];
      const z = p.pos[v * 3 + 2];
      normal.set([n[v * 3], n[v * 3 + 1], n[v * 3 + 2]], o);
      spine[vBase + v] = p.spine[v];
      info.set(p.info.slice(v * 4, v * 4 + 4), (vBase + v) * 4);
      if (part === PART_BODY || part === PART_FIN) {
        // Offset from the spine sample: the spine runs along z at the rest pose
        const sz = (p.spine[v] / (SPINE_NODES - 1)) - 0.5;
        offset.set([x, y, z - sz], o);
        rest.set([x, y, z], o);
      } else {
        // Appendages: offset from their own pivot, articulated in the pose
        offset.set([x, y, z], o);
        const pv = part === PART_FLUKE ? FLUKE_PIVOT : part === PART_FLIPPER_R ? FLIPPER_PIVOT_R : pivotL;
        rest.set([pv[0] + x, pv[1] + y, pv[2] + z], o);
      }
    }
    parts.push({ part: p.info[0], start: iBase / 3, count: p.idx.length / 3 });
    for (let i = 0; i < p.idx.length; i++) index[iBase + i] = p.idx[i] + vBase;
    vBase += vc;
    iBase += p.idx.length;
  }
  cached = {
    offset,
    normal,
    spine,
    info,
    rest,
    index,
    vertexCount,
    pivots: { flipperL: pivotL, flipperR: FLIPPER_PIVOT_R, fluke: FLUKE_PIVOT },
    parts
  };
  return cached;
}

/** Deterministic PRNG (mulberry32): the same seed always gives the same particles. */
export function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export interface SurfaceSamples {
  readonly count: number;
  readonly offset: Float32Array;
  readonly normal: Float32Array;
  readonly spine: Float32Array;
  readonly info: Float32Array;
}

/**
 * Points spread over the whale's skin in proportion to area, carrying the same skinning inputs as
 * the mesh vertices (so a shader can place them exactly on the posed whale). `filter` keeps only
 * triangles whose first vertex passes, e.g. the flukes for wake particles.
 */
export function sampleWhaleSurface(count: number, seed: number, filter?: (info: Float32Array, v: number) => boolean): SurfaceSamples {
  const g = buildWhaleGeometry();
  const rnd = mulberry32(seed);
  const tris: number[] = [];
  const cdf: number[] = [];
  let total = 0;
  for (let i = 0; i < g.index.length; i += 3) {
    const a = g.index[i];
    if (filter && !filter(g.info, a)) continue;
    const b = g.index[i + 1];
    const c = g.index[i + 2];
    const r = g.rest;
    const e1 = [r[b * 3] - r[a * 3], r[b * 3 + 1] - r[a * 3 + 1], r[b * 3 + 2] - r[a * 3 + 2]];
    const e2 = [r[c * 3] - r[a * 3], r[c * 3 + 1] - r[a * 3 + 1], r[c * 3 + 2] - r[a * 3 + 2]];
    const area = 0.5 * Math.hypot(e1[1] * e2[2] - e1[2] * e2[1], e1[2] * e2[0] - e1[0] * e2[2], e1[0] * e2[1] - e1[1] * e2[0]);
    total += area;
    tris.push(i);
    cdf.push(total);
  }
  const out: SurfaceSamples = {
    count,
    offset: new Float32Array(count * 3),
    normal: new Float32Array(count * 3),
    spine: new Float32Array(count),
    info: new Float32Array(count * 4)
  };
  for (let k = 0; k < count; k++) {
    const x = rnd() * total;
    let lo = 0;
    let hi = cdf.length - 1;
    while (lo < hi) {
      const mid = (lo + hi) >> 1;
      if (cdf[mid] < x) lo = mid + 1;
      else hi = mid;
    }
    const i = tris[lo];
    let u = rnd();
    let v = rnd();
    if (u + v > 1) {
      u = 1 - u;
      v = 1 - v;
    }
    const w = 1 - u - v;
    const vs = [g.index[i], g.index[i + 1], g.index[i + 2]];
    const ws = [w, u, v];
    for (let c = 0; c < 3; c++) {
      out.offset[k * 3 + c] = ws[0] * g.offset[vs[0] * 3 + c] + ws[1] * g.offset[vs[1] * 3 + c] + ws[2] * g.offset[vs[2] * 3 + c];
      out.normal[k * 3 + c] = ws[0] * g.normal[vs[0] * 3 + c] + ws[1] * g.normal[vs[1] * 3 + c] + ws[2] * g.normal[vs[2] * 3 + c];
    }
    out.spine[k] = ws[0] * g.spine[vs[0]] + ws[1] * g.spine[vs[1]] + ws[2] * g.spine[vs[2]];
    for (let c = 0; c < 4; c++) out.info[k * 4 + c] = g.info[vs[0] * 4 + c];
    out.info[k * 4 + 3] = ws[0] * g.info[vs[0] * 4 + 3] + ws[1] * g.info[vs[1] * 4 + 3] + ws[2] * g.info[vs[2] * 4 + 3];
  }
  return out;
}
