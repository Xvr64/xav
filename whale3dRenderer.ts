/**
 * The 3D whales drawn as ASCII, in three GPU passes:
 *
 *   1. Geometry — the articulated whales (whale3dAnatomy.ts), skinned in the vertex shader from a
 *      shared float texture of spine frames (whale3dPose.ts), are rendered to three attachments:
 *      ink, depth and normal; mouth, eye, body axis and coverage; and anatomical surface marks.
 *   2. Cells — one fragment per character cell samples its patch of that G-buffer. "Luminance"
 *      maps mean ink to a density ramp of glyphs measured from the font. "Shape" engraves: the
 *      silhouette closes wherever a cell is partly covered (oriented by the coverage gradient),
 *      a structure tensor of depth and normals draws inner contours. Font-measured glyph density
 *      models the flank, with separate marks for the throat grooves, jaw, tubercles and eye.
 *   3. Composite — each screen pixel looks up its cell's glyph in an atlas drawn at the exact
 *      device cell size and writes premultiplied ink: no halos, no rectangle around the whales.
 *
 * The cell grid is locked to the canvas pixels and the glyph choice is a pure function of the
 * G-buffer (no randomness, no history), so a still whale keeps every character and a moving
 * whale changes only the cells its form actually crosses. Nothing animates on its own: callers
 * render a frame when their scroll (or a dev control) changes the scene.
 */
import * as THREE from 'three';
import { SKIN_ROWS, packSkin, type Articulation, type Quat } from './whale3dPose.ts';
import { SPINE_NODES, buildWhaleGeometry, type V3 } from './whale3dAnatomy.ts';
import { FIELD_DEPTH, VEIL_KEEP_LINE, VEIL_KEEP_TONE, rasterizeVeil, type VeilRect } from './whaleVeil.ts';
import { LAND_END, memoryWater } from './profileMemoryTimeline.ts';
import { MEMORY_CELL_KEY, WhaleMemoryCurrent } from './whaleMemoryCurrent.ts';

export type AsciiMode = 'shape' | 'luminance' | 'raw';

export interface AsciiStyle {
  mode: AsciiMode;
  /** Columns left of this fraction draw in luminance mode (comparison view); 0 = off. */
  split: number;
  /** Character cell in CSS px. */
  cellW: number;
  cellH: number;
  /** Ink for the densest glyphs, and the paler ink far whales recede toward (0–255 RGB). */
  ink: [number, number, number];
  inkFar: [number, number, number];
  opacity: number;
  /** Glyph strength: >1 lifts the pale engraving tones toward full ink (the silhouette is already full). */
  contrast: number;
  /** How much the farther whale's glyphs fade with depth (0 none … 1 to nothing). */
  farFade: number;
  /** Dark water: light glyphs read as light, so density follows light instead of pigment. */
  invert: boolean;
  /** Ink response: >1 keeps more of the body sparse. */
  gamma: number;
  /** Lift of the body's engraving tone scale (0 … 1): more line work, the modelling kept. */
  tone: number;
  /** Countershading (0 … 1): tone led by the skin's dark back and pale belly, light only turning the form. */
  countershade: number;
}

export interface WhaleState {
  visible: boolean;
  position: V3;
  quaternion: Quat;
  /** World units per body length. */
  scale: number;
  articulation: Articulation;
  /** 0 whole … 1 fully dissolved, tail first. */
  dissolve: number;
}

/**
 * The whales' look on light water, shared by the ambient and cinematic scenes so the handoff
 * never shifts: a deep ocean blue that reads at a glance, the farther animal a lighter blue that
 * recedes without washing out, and engraving tones lifted toward full ink.
 */
export const WHALE_LOOK = {
  ink: [24, 60, 89] as [number, number, number],
  inkFar: [44, 84, 116] as [number, number, number],
  contrast: 1.28,
  farFade: 0.32,
  gamma: 1.08,
  tone: 0.08
};

export const DEFAULT_STYLE: AsciiStyle = {
  mode: 'shape',
  split: 0,
  cellW: 7,
  cellH: 12,
  ink: WHALE_LOOK.ink,
  inkFar: WHALE_LOOK.inkFar,
  opacity: 1,
  contrast: WHALE_LOOK.contrast,
  farFade: WHALE_LOOK.farFade,
  invert: false,
  gamma: WHALE_LOOK.gamma,
  tone: WHALE_LOOK.tone,
  countershade: 1
};

// ---- Glyph atlas -----------------------------------------------------------------------------

export const ATLAS_CHARS = [' ', '.', ':', '-', '=', '+', '*', 'x', '#', '%', '@', '_', '/', '\\', '|', '(', ')', 'o', '~', ',', "'", '`', ';', '"', '^'];
const RAMP_CANDIDATES = ['.', "'", ':', ';', '+', '*', 'x', '#', '%', '@'];
export const glyphIndex = (ch: string) => ATLAS_CHARS.indexOf(ch);
const ATLAS_COLS = 8;

export interface GlyphAtlas {
  canvas: HTMLCanvasElement;
  tileW: number;
  tileH: number;
  /** Atlas indices of the density ramp, sparse → dense, in measured ink order. */
  ramp: number[];
  /** Measured ink coverage of each atlas glyph (0 … 1). */
  coverage: number[];
}

/** Draw every glyph white on transparent at the exact device cell size, and measure its ink. */
export function buildGlyphAtlas(tileW: number, tileH: number, font = '"JetBrains Mono", monospace'): GlyphAtlas {
  const rows = Math.ceil(ATLAS_CHARS.length / ATLAS_COLS);
  const canvas = document.createElement('canvas');
  canvas.width = tileW * ATLAS_COLS;
  canvas.height = tileH * rows;
  const ctx = canvas.getContext('2d', { willReadFrequently: true })!;
  const size = Math.max(6, Math.min(tileW / 0.6, tileH * 0.92));
  ctx.font = `500 ${size.toFixed(2)}px ${font}`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = '#fff';
  ATLAS_CHARS.forEach((ch, i) => {
    const x = (i % ATLAS_COLS) * tileW + tileW / 2;
    const y = Math.floor(i / ATLAS_COLS) * tileH + tileH / 2 + size * 0.04;
    ctx.fillText(ch, x, y);
  });
  const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
  const coverage = ATLAS_CHARS.map((_, i) => {
    const x0 = (i % ATLAS_COLS) * tileW;
    const y0 = Math.floor(i / ATLAS_COLS) * tileH;
    let sum = 0;
    for (let y = 0; y < tileH; y++) for (let x = 0; x < tileW; x++) sum += data[((y0 + y) * canvas.width + x0 + x) * 4 + 3];
    return sum / (255 * tileW * tileH);
  });
  // Ramp: candidates sorted by measured ink; near-duplicates dropped so every step reads darker
  const sorted = RAMP_CANDIDATES.map((ch) => ({ i: glyphIndex(ch), c: coverage[glyphIndex(ch)] })).sort((a, b) => a.c - b.c);
  const ramp: number[] = [];
  let last = -1;
  for (const g of sorted) {
    if (g.c - last < 0.012) continue;
    ramp.push(g.i);
    last = g.c;
  }
  return { canvas, tileW, tileH, ramp, coverage };
}

// ---- Shaders -----------------------------------------------------------------------------------

export const SKIN_GLSL = /* glsl */ `
uniform highp sampler2D uSkin;
uniform vec3 uPivotL;
uniform vec3 uPivotR;
uniform vec3 uPivotF;
const int SPINE_N = ${SPINE_NODES};
vec4 skinTexel(int x, int row) { return texelFetch(uSkin, ivec2(x, row), 0); }
vec3 qrot(vec4 q, vec3 v) { vec3 t = 2.0 * cross(q.xyz, v); return v + q.w * t + cross(q.xyz, t); }
// Mirrors skinVertex() in whale3dPose.ts
void skinWhale(float spine, vec3 offset, vec3 nrm, float part, int row, out vec3 pos, out vec3 n, out vec3 tangent) {
  int i0 = min(int(floor(spine)), SPINE_N - 2);
  float t = spine - float(i0);
  vec3 P = mix(skinTexel(i0, row).xyz, skinTexel(i0 + 1, row).xyz, t);
  vec4 Q = normalize(mix(skinTexel(i0, row + 1), skinTexel(i0 + 1, row + 1), t));
  float sz = spine / float(SPINE_N - 1) - 0.5;
  vec3 off = offset;
  vec3 nn = nrm;
  if (part > 0.5 && part < 2.5) {
    bool left = part < 1.5;
    vec4 fq = skinTexel(left ? 0 : 1, row + 2);
    vec3 pv = left ? uPivotL : uPivotR;
    float flex = skinTexel(3, row + 2).z;
    float span = off.x / 0.33;
    off.y += flex * span * span;
    nn.x -= nn.y * 2.0 * flex * span / 0.33;
    off = vec3(pv.xy, pv.z - sz) + qrot(fq, off);
    nn = qrot(fq, nn);
  } else if (part > 2.5 && part < 3.5) {
    vec4 fq = skinTexel(2, row + 2);
    float flex = skinTexel(3, row + 2).x;
    float sx = off.x / 0.168;
    off.y += flex * sx * sx;
    off = vec3(uPivotF.xy, uPivotF.z - sz) + qrot(fq, off);
    nn = qrot(fq, nn);
  }
  pos = P + qrot(Q, off);
  n = qrot(Q, nn);
  tangent = qrot(Q, vec3(0.0, 0.0, -1.0));
}
`;

const WHALE_VS = /* glsl */ `
${SKIN_GLSL}
in float aSpine;
in vec4 aInfo;
uniform float uSkinRow;
out vec3 vViewN;
out vec3 vViewPos;
out vec4 vInfo;
out vec4 vMarks;
out vec3 vViewTan;
out vec3 vRestPos;
out vec3 vRestN;
void main() {
  vec3 p; vec3 n; vec3 tg;
  skinWhale(aSpine, position, normal, aInfo.x, int(uSkinRow), p, n, tg);
  vec4 view = viewMatrix * modelMatrix * vec4(p, 1.0);
  vViewPos = view.xyz;
  vViewN = normalize(mat3(viewMatrix) * mat3(modelMatrix) * n);
  vViewTan = mat3(viewMatrix) * mat3(modelMatrix) * tg;
  vInfo = aInfo;
  // Region ids are per-vertex integers: turn them into masks before they interpolate
  // (mouth, eye, throat pleats, tubercles)
  vMarks = vec4(abs(aInfo.y - 1.0) < 0.5 ? 1.0 : 0.0, abs(aInfo.y - 2.0) < 0.5 ? 1.0 : 0.0, abs(aInfo.y - 3.0) < 0.5 ? 1.0 : 0.0, abs(aInfo.y - 4.0) < 0.5 ? 1.0 : 0.0);
  vRestPos = position + vec3(0.0, 0.0, aSpine);
  // The body's rest normal: an angle around the body that the skin carries with it
  vRestN = normal;
  gl_Position = projectionMatrix * view;
}
`;

const WHALE_FS = /* glsl */ `
precision highp float;
in vec3 vViewN;
in vec3 vViewPos;
in vec4 vInfo;
in vec4 vMarks;
in vec3 vViewTan;
in vec3 vRestPos;
in vec3 vRestN;
layout(location = 0) out vec4 gInk;
layout(location = 1) out vec4 gMask;
layout(location = 2) out vec4 gMarks;
uniform vec3 uLight;
uniform vec2 uDepthRange;
uniform float uDissolve;
uniform vec4 uOccluder;
uniform float uOcclusion;
uniform float uInvert;
uniform float uCountershade;
float hash(vec3 p) { return fract(sin(dot(p, vec3(12.9898, 78.233, 37.719))) * 43758.5453); }
// Smooth value noise in the whale's rest frame: anything it shapes is painted on the skin and
// travels, bends and rolls with the animal instead of sliding across the screen
float skinNoise(vec3 p) {
  vec3 i = floor(p);
  vec3 f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  float a = mix(mix(hash(i), hash(i + vec3(1, 0, 0)), f.x), mix(hash(i + vec3(0, 1, 0)), hash(i + vec3(1, 1, 0)), f.x), f.y);
  float b = mix(mix(hash(i + vec3(0, 0, 1)), hash(i + vec3(1, 0, 1)), f.x), mix(hash(i + vec3(0, 1, 1)), hash(i + vec3(1, 1, 1)), f.x), f.y);
  return mix(a, b, f.z);
}
void main() {
  // Unravel from the tail: the same key orders the particles that leave the body
  if (uDissolve > 0.0) {
    float front = 1.0 - uDissolve;
    float edge = (hash(floor(vRestPos * 220.0)) - 0.5) * 0.07;
    if (vInfo.w + edge > front) discard;
  }
  vec3 n = normalize(vViewN);
  if (!gl_FrontFacing) n = -n;
  float lambert = dot(n, uLight);
  float wrap = lambert * 0.5 + 0.5;
  float facing = clamp(abs(n.z), 0.0, 1.0);
  float rim = 1.0 - facing;
  float pigment = vInfo.z;
  // Ink: pigment (dark back, pale belly) shaded by the light, deepening toward the silhouette
  // and into the core shadow, so the broad flank turns like a modelled surface
  // A raking light from above models the mass: the ridge of the back and the upper flank catch a
  // wet sheen, the flank turns through a core shadow below it, and the countershading keeps the
  // throat and belly pale beneath that shadow
  float shade = 1.0 - clamp(lambert, 0.0, 1.0);
  float core = 1.0 - smoothstep(-0.5, 0.15, lambert);
  float sheen = pow(max(dot(n, normalize(uLight + vec3(0.0, 0.0, 1.0))), 0.0), 14.0);
  float ink = pigment * (0.4 + 0.52 * pow(shade, 1.3)) + 0.24 * core * (1.0 - 0.4 * pigment) + 0.3 * rim * rim * rim - 0.2 * sheen * pigment;
  ink = smoothstep(0.04, 0.97, ink);
  // The throat pleats: a pale pouch engraved with grooves running along the body. The groove
  // phase is the angle around the body at rest, so the grooves travel with the skin.
  float pleat = smoothstep(0.25, 0.85, vMarks.z) * (vInfo.x < 0.5 ? 1.0 : 0.0);
  float groove = 0.5 + 0.5 * cos(atan(vRestN.y, vRestN.x) * 38.0);
  ink = max(ink, pleat * (0.3 + 0.32 * groove));
  float knob = smoothstep(0.2, 0.7, vMarks.w);
  float light = clamp(0.15 + 0.85 * wrap * (1.0 - 0.55 * pigment) + 0.25 * pow(max(lambert, 0.0), 6.0), 0.0, 1.0);
  light = light * 0.9 + 0.12 * rim;

  // Countershading. A real whale's dark back and pale belly cancel the light from above, so a
  // lit model of it reads flat; the engraver keeps the pigment as the first statement instead.
  // Tone follows the skin (the rest-frame angle around the body, carried through every bend,
  // roll and fluke stroke), with the light only turning the form inside each zone.
  // The dorsal/ventral boundary wanders a little along the body, like the irregular white of a
  // humpback's flank and throat, and never as a screen-space gradient.
  float bodyPart = vInfo.x < 0.5 ? 1.0 : 0.0;
  float flipper = vInfo.x > 0.5 && vInfo.x < 2.5 ? 1.0 : 0.0;
  float boundary = clamp(1.0 - abs(pigment * 2.0 - 1.12) * 1.25, 0.0, 1.0) * bodyPart * uCountershade;
  float drift = 0.0;
  // Only the band around the boundary pays for the noise
  if (boundary > 0.0) {
    drift = ((skinNoise(vRestPos * vec3(26.0, 26.0, 7.0)) - 0.5) * 0.3 + (skinNoise(vRestPos * vec3(60.0, 60.0, 19.0)) - 0.5) * 0.1) * boundary;
  }
  float dorsal = smoothstep(0.1, 0.96, pigment + drift);
  // The long pectoral flippers stay pale, with a darker leading surface where they meet the light
  dorsal = mix(dorsal, 0.16 + 0.34 * smoothstep(0.2, 0.9, lambert), flipper);
  float ventral = 1.0 - dorsal;
  // The turn of the flank: a soft shadow just above the pale belly where the surface rolls under
  float turn = smoothstep(0.18, 0.5, dorsal) * (1.0 - smoothstep(0.5, 0.82, dorsal)) * (1.0 - smoothstep(-0.45, 0.35, lambert));
  // Ventral grooves: pale pouch, fine grooves running with the body from chin to navel
  float grooveCs = smoothstep(0.62, 0.92, 0.5 + 0.5 * cos(atan(vRestN.y, vRestN.x) * 24.0));
  float pouch = pleat * smoothstep(0.0, 0.5, ventral);
  // Light water: density is pigment. The back carries the deepest ink with a wet sheen along
  // its ridge; the belly stays pale but still turns away from the light.
  float inkCs = 0.12 + 0.5 * dorsal
    + 0.24 * (1.0 - wrap) * (0.4 + 0.6 * ventral)
    + 0.18 * turn
    - 0.22 * sheen * dorsal
    + 0.24 * rim * rim * rim;
  inkCs = mix(inkCs, 0.16 + 0.5 * grooveCs, pouch * 0.85);
  inkCs = smoothstep(0.03, 0.98, inkCs);
  // Dark water: density is light. The pale belly and flippers read brightest, the back recedes
  // into the water with only its ridge catching the light.
  float lightCs = 0.16 + 0.47 * ventral
    + 0.26 * wrap * (0.6 + 0.4 * ventral)
    + 0.3 * sheen * dorsal
    - 0.14 * turn
    + 0.1 * rim;
  lightCs = mix(lightCs, lightCs * (1.0 - 0.62 * grooveCs), pouch);
  lightCs = clamp(lightCs, 0.0, 1.0);

  ink = mix(ink, inkCs, uCountershade);
  light = mix(light, lightCs, uCountershade);
  ink = mix(ink, light, uInvert);
  // The cell pass engraves a groove where this phase peaks across a cell: fewer, wider grooves
  // survive the character grid as lines instead of averaging into grey
  groove = mix(groove, 0.5 + 0.5 * cos(atan(vRestN.y, vRestN.x) * 24.0), uCountershade);
  float mouth = smoothstep(0.35, 0.8, vMarks.x);
  float eye = smoothstep(0.35, 0.8, vMarks.y);
  float depth = clamp((-vViewPos.z - uDepthRange.x) / max(1e-4, uDepthRange.y - uDepthRange.x), 0.0, 1.0);
  // A forming sphere hides what passes behind it
  float coverage = 1.0;
  if (uOcclusion > 0.0) {
    vec3 d = normalize(vViewPos);
    float tc = dot(uOccluder.xyz, d);
    float h2 = dot(uOccluder.xyz, uOccluder.xyz) - tc * tc;
    float r2 = uOccluder.w * uOccluder.w;
    if (h2 < r2) {
      float t0 = tc - sqrt(r2 - h2);
      if (t0 > 0.0 && t0 < length(vViewPos) - 1e-3) coverage = 1.0 - uOcclusion;
    }
  }
  gInk = vec4(clamp(ink, 0.0, 1.0), depth, n.x * 0.5 + 0.5, n.y * 0.5 + 0.5);
  // Screen direction of the body axis (for hatching along the form), and how strongly it shows
  vec2 tan2 = normalize(vViewTan).xy;
  // (0 means none, so an exactly level axis is kept just above it)
  float axial = length(tan2) > 0.32 ? max(fract(atan(tan2.y, tan2.x) / 3.14159265 + 1.0), 0.002) : 0.0;
  gMask = vec4(mouth, eye, axial, coverage);
  // Engraving marks: pleat pouch, groove line, tubercles, and appendages (kept pale and crisp)
  gMarks = vec4(pleat, groove * pleat, knob, vInfo.x > 0.5 && vInfo.x < 3.5 ? 1.0 : 0.0);
}
`;

const QUAD_VS = /* glsl */ `
void main() { gl_Position = vec4(position.xy, 0.0, 1.0); }
`;

const CELL_FS = /* glsl */ `
precision highp float;
uniform sampler2D uInk;
uniform sampler2D uMask;
uniform vec2 uCanvas;   // device px
uniform vec2 uCell;     // device px
uniform vec2 uTexel;    // one G-buffer texel in uv
uniform float uSplit;   // columns (uv x) below this use luminance mode
uniform float uShape;   // 1 shape-aware, 0 luminance
uniform float uRamp[12];
uniform float uRampN;
uniform float uGamma;
uniform float uTone;
uniform vec4 uEdgeA;   // indices: '-', '_', '/', '\'
uniform vec4 uEdgeB;    // indices: '|', '(', ')', 'o'
uniform float uEyeGlyph;
uniform sampler2D uMarks;
uniform sampler2D uPreviousCells;
uniform float uFreezeBelow;
${MEMORY_CELL_KEY}
out vec4 outCell;

// 4×4 ordered dither by cell: neighbouring cells straddle two ramp steps instead of banding,
// and since the grid is locked to the canvas the pattern never shimmers
float bayer4(vec2 c) {
  vec2 p = mod(c, 4.0);
  int i = int(p.x) + int(p.y) * 4;
  int m[16] = int[16](0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5);
  return (float(m[i]) + 0.5) / 16.0;
}
float rampGlyph(float v, vec2 cell) {
  float x = clamp(v * (uRampN - 0.4) + (bayer4(cell) - 0.5) * 0.9, 0.0, uRampN - 1.0);
  return uRamp[int(floor(x + 0.5))];
}
/** Oriented stroke for a line at angle a (radians, 0 … π, y up). */
float strokeGlyph(float a) {
  if (a < 0.3927 || a >= 2.7489) return uEdgeA.x;
  if (a < 1.1781) return uEdgeA.z;
  if (a < 1.9635) return uEdgeB.x;
  return uEdgeA.w;
}

void main() {
  vec2 cellIx = floor(gl_FragCoord.xy);              // x = column, y = row counted from the top
  // As a cell leaves, keep the precise glyph on the last attached frame.
  // Undeparted cells are still engraved from the live, swimming meshes.
  if (uFreezeBelow > 0.0 && memoryKey(ivec2(cellIx)) < uFreezeBelow) {
    outCell = texelFetch(uPreviousCells, ivec2(cellIx), 0);
    return;
  }
  vec2 px0 = cellIx * uCell;                         // cell's top-left, device px from the top-left
  // Every G-buffer read below is textureLod(…, 0.0): the targets have no mipmaps, so this is the
  // very sample texture() takes, without the implicit derivatives that are undefined after the
  // early returns (ANGLE/D3D warning X3595, "gradient instruction used in a loop with varying
  // iteration")
  // Most cells are open water: a 3 × 3 probe of coverage (one texel beyond the cell) skips them
  float probe = 0.0;
  for (int j = 0; j < 3; j++) {
    for (int i = 0; i < 3; i++) {
      vec2 sp = px0 + vec2(float(i), float(j)) * 0.5 * uCell;
      vec2 uv = vec2(sp.x / uCanvas.x, 1.0 - sp.y / uCanvas.y) + (vec2(float(i), float(j)) - 1.0) * uTexel * vec2(1.0, -1.0);
      probe = max(probe, textureLod(uMask, uv, 0.0).a);
    }
  }
  if (probe <= 0.0) { outCell = vec4(0.0); return; }
  const int SX = 3;
  const int SY = 4;
  float covSum = 0.0, inkSum = 0.0, depthSum = 0.0, eyeSum = 0.0, mouthSum = 0.0;
  float pleatSum = 0.0, grooveSum = 0.0, knobSum = 0.0, appSum = 0.0;
  float jxx = 0.0, jyy = 0.0, jxy = 0.0, silE = 0.0, inE = 0.0;
  vec2 covGrad = vec2(0.0);
  vec2 covCentroid = vec2(0.0);
  vec2 axis = vec2(0.0);
  for (int j = 0; j < SY; j++) {
    for (int i = 0; i < SX; i++) {
      vec2 sp = px0 + (vec2(float(i), float(j)) + 0.5) / vec2(float(SX), float(SY)) * uCell;
      vec2 uv = vec2(sp.x / uCanvas.x, 1.0 - sp.y / uCanvas.y);
      vec4 a = textureLod(uInk, uv, 0.0);
      vec4 m = textureLod(uMask, uv, 0.0);
      float c = m.a;
      covSum += c;
      inkSum += a.r * c;
      depthSum += a.g * c;
      eyeSum += m.g * c;
      mouthSum += m.r * c;
      vec4 mk = textureLod(uMarks, uv, 0.0);
      pleatSum += mk.r * c;
      grooveSum += mk.g * c;
      knobSum += mk.b * c;
      appSum += mk.a * c;
      // The axis angle wraps (0 and 1 are the same direction), so it is read unfiltered: a linear
      // blend of 0.99 and 0.01 would turn a level body's hatching vertical
      float ax = texelFetch(uMask, ivec2(uv * vec2(textureSize(uMask, 0))), 0).b;
      if (ax > 0.0) axis += vec2(cos(ax * 6.2831853), sin(ax * 6.2831853)) * c;
      covCentroid += (vec2(float(i), float(j)) + 0.5) / vec2(float(SX), float(SY)) * c;
      // Gradients (uv y up): silhouette from coverage, occluding contours from depth, creases
      // from normals, and the mouth line from its mask
      vec4 ax1 = textureLod(uInk, uv + vec2(uTexel.x, 0.0), 0.0);
      vec4 ax0 = textureLod(uInk, uv - vec2(uTexel.x, 0.0), 0.0);
      vec4 ay1 = textureLod(uInk, uv + vec2(0.0, uTexel.y), 0.0);
      vec4 ay0 = textureLod(uInk, uv - vec2(0.0, uTexel.y), 0.0);
      vec4 mx1 = textureLod(uMask, uv + vec2(uTexel.x, 0.0), 0.0);
      vec4 mx0 = textureLod(uMask, uv - vec2(uTexel.x, 0.0), 0.0);
      vec4 my1 = textureLod(uMask, uv + vec2(0.0, uTexel.y), 0.0);
      vec4 my0 = textureLod(uMask, uv - vec2(0.0, uTexel.y), 0.0);
      vec2 gc = vec2(mx1.a - mx0.a, my1.a - my0.a);
      float both = min(min(mx1.a, mx0.a), min(my1.a, my0.a));
      vec2 gd = vec2(ax1.g - ax0.g, ay1.g - ay0.g) * both;
      gd *= step(0.035, length(gd)) * 6.0;
      vec2 gnx = vec2(ax1.b - ax0.b, ay1.b - ay0.b) * both;
      vec2 gny = vec2(ax1.a - ax0.a, ay1.a - ay0.a) * both;
      vec2 gm = vec2(mx1.r - mx0.r, my1.r - my0.r);
      covGrad += gc;
      jxx += gc.x * gc.x + gd.x * gd.x + 0.2 * (gnx.x * gnx.x + gny.x * gny.x) + 0.6 * gm.x * gm.x;
      jyy += gc.y * gc.y + gd.y * gd.y + 0.2 * (gnx.y * gnx.y + gny.y * gny.y) + 0.6 * gm.y * gm.y;
      jxy += gc.x * gc.y + gd.x * gd.y + 0.2 * (gnx.x * gnx.y + gny.x * gny.y) + 0.6 * gm.x * gm.y;
      silE += dot(gc, gc);
      inE += dot(gd, gd) + 0.2 * (dot(gnx, gnx) + dot(gny, gny)) + 0.6 * dot(gm, gm);
    }
  }
  float n = float(SX * SY);
  float coverage = covSum / n;
  if (coverage < 0.02 && silE < 0.02) { outCell = vec4(0.0); return; }
  float ink = covSum > 0.0 ? inkSum / covSum : 0.0;
  float depth = covSum > 0.0 ? depthSum / covSum : 0.0;
  bool lum = uShape < 0.5 || (cellIx.x * uCell.x) / uCanvas.x < uSplit;

  float glyph = 0.0;
  float alpha = 0.0;
  // Drawing class for the composite: 1 line work, else the tone cell's level (0.2 … 0.8)
  float cls = 1.0;
  if (lum) {
    // Luminance: mean ink (thinned at the silhouette by coverage) through the density ramp
    float v = pow(clamp(ink * smoothstep(0.15, 0.6, coverage), 0.0, 1.0), uGamma);
    if (coverage > 0.22 && v > 0.04) {
      glyph = rampGlyph(v, cellIx);
      alpha = 1.0;
      cls = 0.2 + 0.6 * v;
    }
  } else {
    float eye = eyeSum / n;
    float mouth = mouthSum / n;
    float body = max(covSum, 1e-3);
    float pleat = pleatSum / body;
    float groove = grooveSum / body;
    float knob = knobSum / n;
    float app = appSum / body;
    float tr = jxx + jyy;
    // Dominant gradient direction of the patch (structure tensor), then the contour across it
    float theta = 0.5 * atan(2.0 * jxy, jxx - jyy);
    float coherence = tr > 1e-5 ? sqrt((jxx - jyy) * (jxx - jyy) + 4.0 * jxy * jxy) / tr : 0.0;
    float lineA = mod(theta + 1.5707963, 3.14159265);
    // The silhouette is wherever the cell is partly covered: a soft edge still counts, so the
    // outline closes instead of breaking into punctuation. Its direction comes from the coverage
    // gradient itself (it points into the body), which is steadier than the tensor at an edge.
    bool silhouette = coverage > 0.05 && coverage < 0.94 && silE > 0.06;
    if (silhouette && length(covGrad) > 0.08) lineA = mod(atan(covGrad.y, covGrad.x) + 1.5707963, 3.14159265);
    bool contour = inE > 0.04 * n && coherence > 0.42 && coverage > 0.5;
    bool mouthLine = mouth > 0.1 && coverage > 0.55;
    float v = pow(clamp(ink, 0.0, 1.0), uGamma);
    float axisLen = length(axis) / body;
    float axisA = fract(atan(axis.y, axis.x) / 6.2831853 + 1.0) * 3.14159265;
    bool along = axisLen > 0.55;
    // The jaw line runs with the head; its crease mask is too thin to orient itself reliably
    if (mouthLine && !silhouette && along) lineA = axisA;
    if (eye > 0.14 && coverage > 0.4) {
      glyph = uEyeGlyph;
      alpha = 1.0;
    } else if (silhouette || contour || mouthLine) {
      vec2 cen = covSum > 0.0 ? covCentroid / covSum : vec2(0.5);
      if (lineA < 0.3927 || lineA >= 2.7489) {
        // Horizontal contour: an underscore when it runs along the cell's floor
        glyph = (silhouette && cen.y > 0.58) ? uEdgeA.y : uEdgeA.x;
      } else if (lineA < 1.1781) {
        glyph = uEdgeA.z;
      } else if (lineA < 1.9635) {
        // Round flanks read as parentheses; a sliver seen edge-on (a fin) as a bar
        glyph = silhouette && coverage > 0.3 ? (covGrad.x > 0.0 ? uEdgeB.y : uEdgeB.z) : uEdgeB.x;
      } else {
        glyph = uEdgeA.w;
      }
      alpha = silhouette ? 1.0 : (mouthLine ? 1.0 : 0.88);
    } else if (knob > 0.3 && coverage > 0.5) {
      // Tubercles: the knobs of the rostrum, each its own small ring
      glyph = uEdgeB.w;
      alpha = 0.95;
    } else if (pleat > 0.45 && coverage > 0.5) {
      // Throat grooves engraved along the body: doubled lines where they run level
      glyph = groove > 0.56 && along ? strokeGlyph(axisA) : rampGlyph(v * 0.74, cellIx);
      alpha = 0.38 + 0.52 * max(v, groove);
      cls = 0.4;
    } else if (coverage > 0.3) {
      // Continuous density describes the turning flank. Reserve directional cuts for
      // the outline and pleats so a level animal never becomes horizontal stripes.
      float t = clamp(v * (app > 0.5 ? 0.82 : 1.0) + uTone, 0.0, 1.0);
      glyph = rampGlyph(t, cellIx);
      alpha = mix(0.36, 1.0, smoothstep(0.0, 0.8, t));
      cls = 0.2 + 0.6 * t;
    }
  }
  // B: tone toward the far ink with depth (the farther of two whales recedes)
  outCell = vec4(glyph / 255.0, alpha, clamp(depth * 0.6, 0.0, 1.0), cls);
}
`;

const COMPOSITE_FS = /* glsl */ `
precision highp float;
uniform sampler2D uCells;
uniform sampler2D uAtlas;
uniform vec2 uCell;
uniform vec2 uTile;
uniform float uAtlasCols;
uniform float uCanvasH;
uniform vec3 uInk;
uniform vec3 uInkFar;
uniform float uOpacity;
uniform float uContrast;
uniform float uFarFade;
uniform float uInvert;
uniform sampler2D uVeil;
uniform float uVeilAmount;
uniform vec2 uVeilKeep;
uniform float uVeilField;
uniform float uConsumed;
${MEMORY_CELL_KEY}
out vec4 outColor;
void main() {
  vec2 fc = vec2(gl_FragCoord.x, uCanvasH - gl_FragCoord.y);
  ivec2 cell = ivec2(floor(fc / uCell));
  vec4 c = texelFetch(uCells, cell, 0);
  float gi = floor(c.r * 255.0 + 0.5);
  // Nothing but the glyphs: no panel and no fill. Behind a line of copy the engraving thins by
  // the reading veil (whaleVeil.ts): the tone almost clears and the contour only softens, so the
  // silhouette stays whole while the text in front of it stays readable. Across the reading
  // water around the copy (veil up to uVeilField) the modelling eases away and the drawing is
  // left as it is: the whale passes behind a body of text as a line drawing, whole
  if (c.g <= 0.0 || gi < 0.5) discard;
  if (uConsumed > 0.0 && memoryKey(cell) < uConsumed) discard;
  // Line work (silhouette, contours, mouth, eye) is class 1; the body's tone cells carry their
  // engraver's level 0 … 1 below it
  float line = step(0.95, c.a);
  float level = clamp((c.a - 0.2) / 0.6, 0.0, 1.0) * (1.0 - line);
  vec2 local = floor(fc - vec2(cell) * uCell);
  vec2 tile = vec2(mod(gi, uAtlasCols), floor(gi / uAtlasCols));
  float a = texelFetch(uAtlas, ivec2(tile * uTile + min(local, uTile - 1.0)), 0).a * min(1.0, c.g * uContrast) * uOpacity;
  a *= 1.0 - uFarFade * c.b;
  if (uVeilAmount > 0.0) {
    float veil = texture(uVeil, fc / (uCell * vec2(textureSize(uVeil, 0)))).r * uVeilAmount;
    float behind = smoothstep(uVeilField, 1.0, veil);
    a *= mix(mix(1.0, uVeilKeep.x, veil), mix(1.0, uVeilKeep.y, behind), line);
  }
  vec3 col = mix(uInk, uInkFar, c.b);
  // The drawing and the deepest shadow take the strongest ink (deeper on light water, brighter
  // on the abyss), so the contour holds the form and the modelling reads in depth
  float strong = max(line, smoothstep(0.55, 1.0, level));
  col = mix(col, mix(col * 0.66, mix(col, vec3(1.0), 0.3), uInvert), strong * (1.0 - 0.6 * c.b));
  outColor = vec4(col * a, a);
}
`;

const RAW_FS = /* glsl */ `
precision highp float;
uniform sampler2D uInk;
uniform sampler2D uMask;
uniform vec2 uCanvas;
uniform vec3 uInk3;
out vec4 outColor;
void main() {
  vec2 uv = gl_FragCoord.xy / uCanvas;
  vec4 a = texture(uInk, uv);
  vec4 m = texture(uMask, uv);
  float c = m.a;
  vec3 shade = mix(vec3(0.96), uInk3, a.r);
  shade = mix(shade, vec3(0.1), max(m.r, m.g));
  outColor = vec4(shade * c, c);
}
`;

/** Write a 0–255 RGB colour into a shader vec3 (no allocation per frame). */
const setRgb = (v: THREE.Vector3, c: [number, number, number]) => v.set(c[0] / 255, c[1] / 255, c[2] / 255);

// ---- Renderer -----------------------------------------------------------------------------------

export interface WhaleAsciiRendererOptions {
  maxWhales?: number;
  /** G-buffer resolution relative to CSS px. */
  gbufferScale?: number;
}

export class WhaleAsciiRenderer {
  readonly renderer: THREE.WebGLRenderer;
  readonly camera = new THREE.PerspectiveCamera(30, 1, 0.1, 200);
  /** Drawn before the ASCII composite (beneath the whales) and after it, with the same camera. */
  readonly underlay = new THREE.Scene();
  readonly overlay = new THREE.Scene();
  readonly style: AsciiStyle = { ...DEFAULT_STYLE };
  readonly skinData: Float32Array<ArrayBuffer>;
  readonly skinTexture: THREE.DataTexture;
  readonly pivotUniforms: { uPivotL: { value: THREE.Vector3 }; uPivotR: { value: THREE.Vector3 }; uPivotF: { value: THREE.Vector3 } };
  lost = false;
  onContextLost: (() => void) | null = null;

  private readonly scene = new THREE.Scene();
  private readonly quadCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
  private readonly whales: { mesh: THREE.Mesh; material: THREE.ShaderMaterial; state: WhaleState | null }[] = [];
  private gbuffer: THREE.WebGLRenderTarget;
  private cells: THREE.WebGLRenderTarget;
  private previousCells: THREE.WebGLRenderTarget | null = null;
  private cellsValid = false;
  private current: WhaleMemoryCurrent | null = null;
  /** The current's program has been used once (warmed or drawn): its link is behind us. */
  private currentWarm = false;
  private readonly cellMaterial: THREE.ShaderMaterial;
  private readonly compositeMaterial: THREE.ShaderMaterial;
  private readonly rawMaterial: THREE.ShaderMaterial;
  private readonly quad: THREE.Mesh;
  private readonly quadScene = new THREE.Scene();
  private atlas: GlyphAtlas | null = null;
  private atlasTexture: THREE.CanvasTexture | null = null;
  private atlasKey = '';
  private cssW = 1;
  private cssH = 1;
  private dpr = 1;
  private gscale: number;
  private readonly occluder = { center: new THREE.Vector3(), radius: 0, amount: 0 };
  /** The reading veil (whaleVeil.ts): the copy's line boxes, rasterised on the glyph grid. */
  private veilRects: readonly VeilRect[] | null = null;
  private veilAmount = 0;
  private veilDirty = false;
  private veilData: Uint8Array<ArrayBuffer> = new Uint8Array(1);
  private veilScratch = new Float32Array(4);
  private veilTexture = WhaleAsciiRenderer.makeVeilTexture(new Uint8Array(1), 1, 1);
  private readonly light = new THREE.Vector3(-0.42, 0.8, 0.42).normalize();
  private readonly tmp = new THREE.Vector3();
  private readonly onLost = (e: Event) => {
    e.preventDefault();
    this.lost = true;
    this.onContextLost?.();
  };
  private readonly onRestored = () => {
    this.lost = false;
    this.atlasKey = '';
    this.skinTexture.needsUpdate = true;
    this.veilDirty = true;
  };
  private readonly canvas: HTMLCanvasElement;

  constructor(canvas: HTMLCanvasElement, opts: WhaleAsciiRendererOptions = {}) {
    this.canvas = canvas;
    const maxWhales = opts.maxWhales ?? 2;
    this.gscale = opts.gbufferScale ?? 0.75;
    this.renderer = new THREE.WebGLRenderer({ canvas, alpha: true, premultipliedAlpha: true, antialias: false, powerPreference: 'high-performance' });
    this.renderer.setClearColor(0x000000, 0);
    this.renderer.autoClear = false;
    canvas.addEventListener('webglcontextlost', this.onLost);
    canvas.addEventListener('webglcontextrestored', this.onRestored);

    this.skinData = new Float32Array(SPINE_NODES * 4 * SKIN_ROWS * maxWhales);
    this.skinTexture = new THREE.DataTexture(this.skinData, SPINE_NODES, SKIN_ROWS * maxWhales, THREE.RGBAFormat, THREE.FloatType);
    this.skinTexture.minFilter = THREE.NearestFilter;
    this.skinTexture.magFilter = THREE.NearestFilter;
    this.skinTexture.needsUpdate = true;

    const g = buildWhaleGeometry();
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(g.offset, 3));
    geometry.setAttribute('normal', new THREE.BufferAttribute(g.normal, 3));
    geometry.setAttribute('aSpine', new THREE.BufferAttribute(g.spine, 1));
    geometry.setAttribute('aInfo', new THREE.BufferAttribute(g.info, 4));
    geometry.setIndex(new THREE.BufferAttribute(g.index, 1));
    this.pivotUniforms = {
      uPivotL: { value: new THREE.Vector3(...g.pivots.flipperL) },
      uPivotR: { value: new THREE.Vector3(...g.pivots.flipperR) },
      uPivotF: { value: new THREE.Vector3(...g.pivots.fluke) }
    };
    for (let i = 0; i < maxWhales; i++) {
      const material = new THREE.ShaderMaterial({
        glslVersion: THREE.GLSL3,
        vertexShader: WHALE_VS,
        fragmentShader: WHALE_FS,
        side: THREE.DoubleSide,
        uniforms: {
          uSkin: { value: this.skinTexture },
          ...this.pivotUniforms,
          uSkinRow: { value: i * SKIN_ROWS },
          uLight: { value: new THREE.Vector3() },
          uDepthRange: { value: new THREE.Vector2(0, 1) },
          uDissolve: { value: 0 },
          uOccluder: { value: new THREE.Vector4() },
          uOcclusion: { value: 0 },
          uInvert: { value: 0 },
          uCountershade: { value: 1 }
        }
      });
      const mesh = new THREE.Mesh(geometry, material);
      mesh.frustumCulled = false;
      mesh.visible = false;
      this.scene.add(mesh);
      this.whales.push({ mesh, material, state: null });
    }

    this.gbuffer = new THREE.WebGLRenderTarget(1, 1, { count: 3, depthBuffer: true, type: THREE.UnsignedByteType });
    for (const t of this.gbuffer.textures) {
      t.minFilter = THREE.LinearFilter;
      t.magFilter = THREE.LinearFilter;
      t.generateMipmaps = false;
    }
    this.cells = new THREE.WebGLRenderTarget(1, 1, { depthBuffer: false, type: THREE.UnsignedByteType });
    this.cells.texture.minFilter = THREE.NearestFilter;
    this.cells.texture.magFilter = THREE.NearestFilter;
    this.cells.texture.generateMipmaps = false;

    this.cellMaterial = new THREE.ShaderMaterial({
      glslVersion: THREE.GLSL3,
      vertexShader: QUAD_VS,
      fragmentShader: CELL_FS,
      depthTest: false,
      depthWrite: false,
      uniforms: {
        uInk: { value: null },
        uMask: { value: null },
        uCanvas: { value: new THREE.Vector2() },
        uCell: { value: new THREE.Vector2() },
        uTexel: { value: new THREE.Vector2() },
        uSplit: { value: 0 },
        uShape: { value: 1 },
        uRamp: { value: new Array(12).fill(0) },
        uRampN: { value: 1 },
        uGamma: { value: 1 },
        uTone: { value: 0 },
        uEdgeA: { value: new THREE.Vector4(glyphIndex('-'), glyphIndex('_'), glyphIndex('/'), glyphIndex('\\')) },
        uEdgeB: { value: new THREE.Vector4(glyphIndex('|'), glyphIndex('('), glyphIndex(')'), glyphIndex('o')) },
        uEyeGlyph: { value: glyphIndex('@') },
        uMarks: { value: null },
        uPreviousCells: { value: null },
        uFreezeBelow: { value: 0 }
      }
    });
    this.compositeMaterial = new THREE.ShaderMaterial({
      glslVersion: THREE.GLSL3,
      vertexShader: QUAD_VS,
      fragmentShader: COMPOSITE_FS,
      transparent: true,
      premultipliedAlpha: true,
      blending: THREE.CustomBlending,
      blendSrc: THREE.OneFactor,
      blendDst: THREE.OneMinusSrcAlphaFactor,
      depthTest: false,
      depthWrite: false,
      uniforms: {
        uCells: { value: this.cells.texture },
        uAtlas: { value: null },
        uCell: { value: new THREE.Vector2() },
        uTile: { value: new THREE.Vector2() },
        uAtlasCols: { value: ATLAS_COLS },
        uCanvasH: { value: 1 },
        uInk: { value: new THREE.Vector3() },
        uInkFar: { value: new THREE.Vector3() },
        uOpacity: { value: 1 },
        uContrast: { value: WHALE_LOOK.contrast },
        uFarFade: { value: WHALE_LOOK.farFade },
        uInvert: { value: 0 },
        uVeil: { value: null },
        uVeilAmount: { value: 0 },
        uVeilKeep: { value: new THREE.Vector2(VEIL_KEEP_TONE, VEIL_KEEP_LINE) },
        uVeilField: { value: FIELD_DEPTH },
        uConsumed: { value: 0 }
      }
    });
    this.rawMaterial = new THREE.ShaderMaterial({
      glslVersion: THREE.GLSL3,
      vertexShader: QUAD_VS,
      fragmentShader: RAW_FS,
      transparent: true,
      blending: THREE.CustomBlending,
      blendSrc: THREE.OneFactor,
      blendDst: THREE.OneMinusSrcAlphaFactor,
      depthTest: false,
      depthWrite: false,
      uniforms: {
        uInk: { value: null },
        uMask: { value: null },
        uCanvas: { value: new THREE.Vector2() },
        uInk3: { value: new THREE.Vector3() }
      }
    });
    this.quad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), this.cellMaterial);
    this.quad.frustumCulled = false;
    this.quadScene.add(this.quad);
  }

  /** Canvas size in CSS px and the (capped) device pixel ratio. */
  resize(cssW: number, cssH: number, dpr: number) {
    this.cssW = Math.max(1, cssW);
    this.cssH = Math.max(1, cssH);
    this.dpr = dpr;
    this.renderer.setPixelRatio(dpr);
    this.renderer.setSize(this.cssW, this.cssH, false);
    this.camera.aspect = this.cssW / this.cssH;
    this.camera.updateProjectionMatrix();
    this.gbuffer.setSize(Math.max(1, Math.round(this.cssW * this.gscale)), Math.max(1, Math.round(this.cssH * this.gscale)));
    this.atlasKey = '';
  }

  get size() {
    return { width: this.cssW, height: this.cssH, dpr: this.dpr };
  }

  setStyle(style: Partial<AsciiStyle>) {
    Object.assign(this.style, style);
  }

  /** Lower sampling cost on slow devices; topology and quaternion motion stay unchanged. */
  setResolution(scale: number) {
    this.gscale = Math.max(0.35, Math.min(0.75, scale));
    this.gbuffer.setSize(Math.max(1, Math.round(this.cssW * this.gscale)), Math.max(1, Math.round(this.cssH * this.gscale)));
  }

  setWhale(i: number, state: WhaleState | null) {
    const w = this.whales[i];
    if (!w) return;
    w.state = state;
    w.mesh.visible = !!state && state.visible;
    if (!state || !state.visible) return;
    w.mesh.position.set(...state.position);
    w.mesh.quaternion.set(...state.quaternion);
    w.mesh.scale.setScalar(state.scale);
    packSkin(state.articulation, this.skinData, i, state.dissolve);
    w.material.uniforms.uDissolve.value = state.dissolve;
  }

  /** A sphere (world centre, radius) that hides the whales behind it by `amount` (0 … 1). */
  setOccluder(center: V3, radius: number, amount: number) {
    this.occluder.center.set(...center);
    this.occluder.radius = radius;
    this.occluder.amount = amount;
  }

  /**
   * Where the page's copy sits (viewport CSS px line boxes), so the engraving thins behind it;
   * null or amount 0 draws the whales at full strength everywhere. Pass the same array while
   * nothing has moved: the map is only redrawn when the array or the glyph grid changes.
   */
  setVeil(rects: readonly VeilRect[] | null, amount = 1) {
    if (rects !== this.veilRects) { this.veilRects = rects; this.veilDirty = true; }
    this.veilAmount = rects && rects.length ? Math.max(0, Math.min(1, amount)) : 0;
  }

  private static makeVeilTexture(data: Uint8Array<ArrayBuffer>, cols: number, rows: number) {
    const texture = new THREE.DataTexture(data, cols, rows, THREE.RedFormat, THREE.UnsignedByteType);
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;
    texture.wrapS = texture.wrapT = THREE.ClampToEdgeWrapping;
    texture.generateMipmaps = false;
    texture.flipY = false;
    texture.unpackAlignment = 1;
    texture.needsUpdate = true;
    return texture;
  }

  /** Redraw the veil on the current glyph grid (cw × ch device px per cell) if anything changed. */
  private syncVeil(cw: number, ch: number, W: number, H: number) {
    if (this.veilAmount <= 0 || !this.veilRects) return;
    const cols = Math.ceil(W / cw), rows = Math.ceil(H / ch);
    if (this.veilData.length !== cols * rows || this.veilTexture.image.width !== cols) {
      this.veilData = new Uint8Array(cols * rows);
      this.veilScratch = new Float32Array(cols * rows * 4);
      this.veilTexture.dispose();
      this.veilTexture = WhaleAsciiRenderer.makeVeilTexture(this.veilData, cols, rows);
      this.veilDirty = true;
    }
    if (!this.veilDirty) return;
    this.veilDirty = false;
    rasterizeVeil(this.veilData, this.veilScratch, cols, rows, cw / this.dpr, ch / this.dpr, this.veilRects);
    this.veilTexture.needsUpdate = true;
  }

  private ensureCells() {
    const cw = Math.max(2, Math.round(this.style.cellW * this.dpr));
    const ch = Math.max(3, Math.round(this.style.cellH * this.dpr));
    const W = Math.round(this.cssW * this.dpr);
    const H = Math.round(this.cssH * this.dpr);
    const key = `${cw}x${ch}:${W}x${H}`;
    if (key === this.atlasKey) return { cw, ch, W, H };
    this.atlasKey = key;
    this.atlas = buildGlyphAtlas(cw, ch);
    this.atlasTexture?.dispose();
    this.atlasTexture = new THREE.CanvasTexture(this.atlas.canvas);
    this.atlasTexture.flipY = false;
    this.atlasTexture.minFilter = THREE.NearestFilter;
    this.atlasTexture.magFilter = THREE.NearestFilter;
    this.atlasTexture.generateMipmaps = false;
    this.cells.setSize(Math.ceil(W / cw), Math.ceil(H / ch));
    this.cellsValid = false;
    const ramp = this.atlas.ramp;
    const u = this.cellMaterial.uniforms;
    const r = new Array(12).fill(ramp[ramp.length - 1]);
    ramp.forEach((g, k) => (r[k] = g));
    u.uRamp.value = r;
    u.uRampN.value = Math.min(12, ramp.length);
    return { cw, ch, W, H };
  }

  /** The glyph atlas in use (device-px tiles), for layers that draw glyphs of their own. */
  get glyphs(): { texture: THREE.Texture | null; tileW: number; tileH: number; cols: number } {
    this.ensureCells();
    return { texture: this.atlasTexture, tileW: this.atlas?.tileW ?? 1, tileH: this.atlas?.tileH ?? 1, cols: ATLAS_COLS };
  }

  /** Rebuild the atlas on the next frame (after the web font has loaded). */
  invalidateAtlas() {
    this.atlasKey = '';
  }

  render(drawOverlay = true, profileMemories = false) {
    if (this.lost) return;
    const r = this.renderer;
    const { cw, ch, W, H } = this.ensureCells();
    this.skinTexture.needsUpdate = true;

    // Depth range around the visible whales (the farther one recedes in tone), light in view space
    this.camera.updateMatrixWorld();
    const view = this.camera.matrixWorldInverse;
    let near = Infinity;
    let far = -Infinity;
    for (const w of this.whales) {
      if (!w.mesh.visible || !w.state) continue;
      const d = -this.tmp.set(...w.state.position).applyMatrix4(view).z;
      near = Math.min(near, d - w.state.scale * 0.7);
      far = Math.max(far, d + w.state.scale * 0.7);
    }
    // Engraver's light: always from the upper left of the picture, so the tone stays balanced
    // from every angle while the form itself (normals, contours) changes with the view
    const lightView = this.light;
    const occ = this.tmp.copy(this.occluder.center).applyMatrix4(view);
    for (const w of this.whales) {
      const u = w.material.uniforms;
      u.uLight.value.copy(lightView);
      u.uDepthRange.value.set(Number.isFinite(near) ? near : 0, Number.isFinite(far) ? far : 1);
      u.uOccluder.value.set(occ.x, occ.y, occ.z, this.occluder.radius);
      u.uOcclusion.value = this.occluder.amount;
      u.uInvert.value = this.style.invert ? 1 : 0;
      u.uCountershade.value = this.style.countershade;
    }

    const anyWhale = this.whales.some((w) => w.mesh.visible);

    // 1. G-buffer
    r.setRenderTarget(this.gbuffer);
    r.setClearColor(0x000000, 0);
    r.clear(true, true, true);
    r.render(this.scene, this.camera);

    // 2. Cells or raw view
    const [inkTex, maskTex, marksTex] = this.gbuffer.textures;
    r.setRenderTarget(null);
    r.setClearColor(0x000000, 0);
    r.clear(true, true, true);
    if (drawOverlay && this.underlay.children.length) r.render(this.underlay, this.camera);
    if (!anyWhale) {
      // Nothing to engrave: skip the cell and composite passes
    } else if (this.style.mode === 'raw') {
      const u = this.rawMaterial.uniforms;
      u.uInk.value = inkTex;
      u.uMask.value = maskTex;
      u.uCanvas.value.set(W, H);
      setRgb(u.uInk3.value, this.style.ink);
      this.quad.material = this.rawMaterial;
      r.render(this.quadScene, this.quadCamera);
    } else {
      const cu = this.cellMaterial.uniforms;
      cu.uInk.value = inkTex;
      cu.uMask.value = maskTex;
      cu.uMarks.value = marksTex;
      cu.uCanvas.value.set(W, H);
      cu.uCell.value.set(cw, ch);
      cu.uTexel.value.set(1 / this.gbuffer.width, 1 / this.gbuffer.height);
      cu.uShape.value = this.style.mode === 'shape' ? 1 : 0;
      cu.uSplit.value = this.style.split;
      cu.uGamma.value = this.style.gamma;
      cu.uTone.value = this.style.tone;
      this.quad.material = this.cellMaterial;
      const consumed = profileMemories ? memoryWater.consumed : 0;
      const flying = profileMemories && memoryWater.running && memoryWater.transferring && !!memoryWater.landings;
      cu.uFreezeBelow.value = 0;
      cu.uPreviousCells.value = null;
      if (flying && !memoryWater.reversing && this.cellsValid) {
        this.previousCells ??= this.cells.clone();
        if (this.previousCells.width !== this.cells.width || this.previousCells.height !== this.cells.height) {
          this.previousCells.setSize(this.cells.width, this.cells.height);
        }
        const previous = this.cells;
        this.cells = this.previousCells;
        this.previousCells = previous;
        cu.uPreviousCells.value = previous.texture;
        cu.uFreezeBelow.value = consumed;
      }
      r.setRenderTarget(this.cells);
      r.clear(true, false, false);
      r.render(this.quadScene, this.quadCamera);
      this.cellsValid = true;

      // 3. Composite
      r.setRenderTarget(null);
      const pu = this.compositeMaterial.uniforms;
      pu.uCells.value = this.cells.texture;
      pu.uConsumed.value = consumed;
      pu.uAtlas.value = this.atlasTexture;
      pu.uCell.value.set(cw, ch);
      pu.uTile.value.set(cw, ch);
      pu.uCanvasH.value = H;
      pu.uInvert.value = this.style.invert ? 1 : 0;
      setRgb(pu.uInk.value, this.style.ink);
      setRgb(pu.uInkFar.value, this.style.inkFar);
      pu.uOpacity.value = this.style.opacity;
      pu.uContrast.value = this.style.contrast;
      pu.uFarFade.value = this.style.farFade;
      this.syncVeil(cw, ch, W, H);
      pu.uVeil.value = this.veilTexture;
      pu.uVeilAmount.value = this.veilAmount;
      this.quad.material = this.compositeMaterial;
      r.render(this.quadScene, this.quadCamera);
      if (flying && memoryWater.phase < LAND_END + 0.03) {
        this.current ??= new WhaleMemoryCurrent(memoryWater.landings!);
        this.current.draw(r, this.quadCamera, this.cells, this.atlasTexture!, cw / this.dpr, ch / this.dpr,
          pu.uInk.value, pu.uInkFar.value, this.style.opacity);
        this.currentWarm = true;
      } else if (profileMemories && memoryWater.framed && memoryWater.landings && !this.currentWarm) {
        // The current's program starts linking ahead of the Profile (prepareMemoryCurrent, from the
        // Globe on) and is warmed here on the first framed frame it has linked: linked on the spot,
        // the frame the Profile is framed waited 110-380 ms for it. Without the parallel-compile
        // extension prepared() is true at once and this is the warm of before, on the same frame.
        this.previousCells ??= this.cells.clone();
        this.prepareMemoryCurrent();
        if (this.current?.prepared(r)) {
          this.current.warm(r, this.quadCamera, this.cells, this.atlasTexture!);
          this.currentWarm = true;
        }
      }
    }

    if (drawOverlay && this.overlay.children.length) r.render(this.overlay, this.camera);
  }

  /** Clear the canvas (nothing drawn) without touching the scene. */
  clear() {
    if (this.lost) return;
    this.renderer.setRenderTarget(null);
    this.renderer.clear(true, true, true);
  }

  /**
   * Begin linking the Profile memory current's program ahead of the Profile (from the Globe on):
   * with KHR_parallel_shader_compile its link runs off the main thread and has long finished when
   * the Profile is framed. Once; nothing is drawn.
   */
  prepareMemoryCurrent() {
    if (this.lost || this.current || !memoryWater.landings) return;
    this.renderer.setRenderTarget(null);
    this.current = new WhaleMemoryCurrent(memoryWater.landings);
    this.current.prepare(this.renderer, this.quadCamera);
  }

  dispose() {
    this.canvas.removeEventListener('webglcontextlost', this.onLost);
    this.canvas.removeEventListener('webglcontextrestored', this.onRestored);
    this.gbuffer.dispose();
    this.cells.dispose();
    this.previousCells?.dispose();
    this.current?.dispose();
    this.atlasTexture?.dispose();
    this.veilTexture.dispose();
    this.skinTexture.dispose();
    this.whales[0]?.mesh.geometry.dispose();
    for (const w of this.whales) w.material.dispose();
    this.cellMaterial.dispose();
    this.compositeMaterial.dispose();
    this.rawMaterial.dispose();
    this.quad.geometry.dispose();
    this.renderer.dispose();
  }
}
