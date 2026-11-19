import { buildAtlas, link, type Atlas } from './GradientASCII';
import { globeScrollGeometry } from './abyssPalette';
import { OCEAN_HANDOFF_AT, creation, advanceCreation, creationLookahead, finishCreation } from './creationTimeline';
import type { CreationRenderer } from './creationRenderer';
import { tickHandoff } from './journeyHandoff';
import {
  applyWaterColor,
  depthAtDocument,
  depthAtScroll,
  globeStageFillsScreen,
  glyphsAt,
  inkAt,
  waterAt,
  type OceanGeometry
} from './oceanWorld';
import { ambientWhalesLive } from './oceanDirection';
import { oceanEffects, type OceanEffects } from './oceanExperiments';
import { newWaterInertia, resetWaterInertia, stepWaterInertia, waterSettling } from './waterInertia';
import { SEA_MAX_EDGES, SEA_MAX_STATES, layoutSea, packSea, type SeaSection } from './seaState';
import { WAKE, WAKE_BODIES, newWakeTracker, oceanWake, trackWake } from './oceanWake';

// ============================================================================
// ASCII OCEAN — GradientASCII's glyph pipeline, rendered in document space
// ============================================================================
// The canvas is only the size of the screen, but what it draws is the document's ocean
// (oceanWorld.ts) at the current scroll position: every glyph cell, every current and every
// colour belongs to a point of the page, so scrolling down travels through the water and
// scrolling up comes back through the same water. Two passes per frame:
//   1. CELLS — one texel per visible glyph cell (a ~170 × 70 texture): the currents' value,
//      the glyph chosen for the cell and its ink, from noise in page coordinates + time.
//   2. SCREEN — the water colour for the pixel's depth, lit softly by the currents, with the
//      cell's glyph from the GradientASCII atlas inked over it. Opaque: this is the water.
// Depth samples (colour, ink, glyph density) are evaluated in JS once per frame for a column of
// points down the screen, so the CSS water and the WebGL water come from the same numbers.
//
// The default keeps the original water and adds only inertia and local whale disturbances.
// Flow bands and section sea states remain opt-in comparisons (oceanExperiments.ts).
// WAKE_STEP reuses two cell-sized textures in this context; no additional animation loop.

const DEV = !!(import.meta as any).env?.DEV;
const SAMPLES = 24;
const CHARACTERS = ' .·:-~=+≈';
/** The ramp, then the strokes of water that leaves the level: two leans and an upright (indices 9, 10 and 11). */
const FLOW_CHARACTERS = CHARACTERS + '/\\|';
/** How often the water's memory of the whales advances (the ocean's resting cadence). */
const WAKE_HZ = 30;
/** The least radius a whale's body is given in the wake, in rows of glyphs. */
const WAKE_MIN_ROWS = 2.6;
/** How many runs a line of moving water is broken into along its length (livingCells' stream). */
const FLOW_GRAIN = 5;
/** Seconds before the remaining subvisible memory is cleared and its pass stops. */
const WAKE_LINGER = 3;
const FONT = "'IBM Plex Mono', ui-monospace, SFMono-Regular, Menlo, Consolas, monospace";
const IDLE_FPS = 30;
/** CSS px per unit of the currents' noise: the size of one swell. */
const WORLD_UNIT = 560;

const COMMON = `
float hash12(vec2 p) {
  vec3 q = fract(vec3(p.xyx) * 0.1031);
  q += dot(q, q.yzx + 33.33);
  return fract((q.x + q.y) * q.z);
}
vec2 hash22(vec2 p) {
  vec3 q = fract(vec3(p.xyx) * vec3(0.1031, 0.103, 0.0973));
  q += dot(q, q.yzx + 33.33);
  return fract((q.xx + q.yz) * q.zy) * 2.0 - 1.0;
}
float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * f * (f * (f * 6.0 - 15.0) + 10.0);
  float a = dot(hash22(i), f);
  float b = dot(hash22(i + vec2(1.0, 0.0)), f - vec2(1.0, 0.0));
  float c = dot(hash22(i + vec2(0.0, 1.0)), f - vec2(0.0, 1.0));
  float d = dot(hash22(i + vec2(1.0, 1.0)), f - vec2(1.0, 1.0));
  return 0.5 + 0.5 * mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
}
`;

const CELLS = `#version 300 es
precision highp float;
uniform vec2 uCellPx;
uniform float uOffsetX;
uniform float uScrollPx;
uniform float uFirstRow;
uniform float uViewH;
uniform float uUnit;
uniform float uTime;
uniform float uCount;
uniform vec4 uGlyph[${SAMPLES}];
out vec4 outCell;
${COMMON}
void main() {
  // The cell's place on the page: column, and row counted from the top of the document
  vec2 cell = vec2(floor(gl_FragCoord.x), uFirstRow + floor(gl_FragCoord.y));
  vec2 centre = vec2(uOffsetX + (cell.x + 0.5) * uCellPx.x, (cell.y + 0.5) * uCellPx.y);
  float s = clamp((centre.y - uScrollPx) / uViewH, 0.0, 1.0) * ${SAMPLES - 1}.0;
  int i = int(floor(s));
  vec4 g = mix(uGlyph[i], uGlyph[min(i + 1, ${SAMPLES - 1})], fract(s));

  // Currents: long swells near the surface (stretched sideways), rounder water in the deep,
  // warped by a slower flow so nothing repeats; all of it drifts on with time
  float t = uTime;
  vec2 q = centre / uUnit * vec2(1.0 / g.z, 1.0) * 1.7;
  vec2 warp = vec2(
    noise(q * 0.5 + vec2(t * 0.031, 1.7)),
    noise(q * 0.5 + vec2(5.2, -t * 0.027))
  ) - 0.5;
  q += warp * 1.7;
  float swell = noise(q + vec2(t * 0.085, -t * 0.018));
  float ripple = noise(q * 2.3 + vec2(-t * 0.14, t * 0.045));
  float field = clamp(swell * 0.68 + ripple * 0.32, 0.0, 1.0);

  float v = smoothstep(0.38, 0.72, field);
  float pick = hash12(cell + 0.37);
  float level = hash12(cell * 1.73 + 4.1);
  // Each cell retunes its glyph slowly, at its own moment: a shimmer, never a flicker
  float tick = floor(t * 1.6 + level * 7.0);
  float wobble = (hash12(cell * 2.31 + tick * 17.7) - 0.5) * 0.16;
  float tone = clamp(v + wobble, 0.0, 1.0);
  float index = clamp(floor(tone * (uCount - 1.0) + 0.5), 1.0, uCount - 1.0);
  float present = step(pick, g.x * (0.3 + v));
  // Quiet water has colour and soft currents, but no ambient character texture.
  float alpha = 0.0;
  outCell = vec4(index / 255.0, alpha, field, 1.0);
}`;

const SCREEN = `#version 300 es
precision highp float;
uniform sampler2D uCells;
uniform sampler2D uAtlas;
uniform vec2 uCellPx;
uniform vec2 uCellsSize;
uniform float uOffsetX;
uniform float uScrollPx;
uniform float uFirstRow;
uniform float uViewH;
uniform vec2 uAtlasGrid;
uniform float uFrame;
uniform vec3 uWater[${SAMPLES}];
uniform vec3 uInk[${SAMPLES}];
out vec4 outColor;
${COMMON}
void main() {
  float yDown = uViewH - gl_FragCoord.y;
  float s = clamp(yDown / uViewH, 0.0, 1.0) * ${SAMPLES - 1}.0;
  int i = int(floor(s));
  int j = min(i + 1, ${SAMPLES - 1});
  vec3 water = mix(uWater[i], uWater[j], fract(s));
  vec3 ink = mix(uInk[i], uInk[j], fract(s));

  // Position in cells, on the page (rows count down from the first row on screen)
  vec2 coord = vec2((gl_FragCoord.x - uOffsetX) / uCellPx.x, (uScrollPx + yDown) / uCellPx.y - uFirstRow);

  // The currents light the water itself, smoothly between cells: brighter drifts tinted
  // towards the ink, slightly deeper troughs
  float field = texture(uCells, coord / uCellsSize).b;
  water = mix(water, ink, clamp((field - 0.44) * 0.75, 0.0, 0.2));
  water *= 1.0 - clamp((0.44 - field) * 0.3, 0.0, 0.05);

  vec2 cellIndex = floor(coord);
  vec4 cell = texelFetch(uCells, clamp(ivec2(cellIndex), ivec2(0), ivec2(uCellsSize) - 1), 0);
  vec2 local = coord - cellIndex;
  float index = floor(cell.r * 255.0 + 0.5);
  float column = mod(index, uAtlasGrid.x);
  float row = floor(index / uAtlasGrid.x);
  vec2 atlasUv = vec2((column + local.x) / uAtlasGrid.x, (row + local.y) / uAtlasGrid.y);
  vec2 continuous = coord / uAtlasGrid;
  float coverage = textureGrad(uAtlas, atlasUv, dFdx(continuous), dFdy(continuous)).a;

  vec3 color = mix(water, ink, cell.g * coverage);
  color += (hash12(gl_FragCoord.xy + uFrame * 13.7) - 0.5) / 255.0;
  outColor = vec4(clamp(color, 0.0, 1.0), 1.0);
}`;

/**
 * The cell pass of the living ocean. The currents are the ones above, written as a function so
 * that they can be read in a sea state (SEA), at a point the wake has moved (WAKE) and at two
 * neighbouring points, which give the direction the water runs in (FLOW).
 *
 * What the living ocean adds is drawn as LINES OF MOVING WATER: runs of strokes ( - ~ ≈ / \ )
 * that lie along the way the water goes and are a little firmer than the bed of dots they pass
 * through. The currents' own lines travel along the streamlines; a whale's wake is the same
 * strokes, laid along its path, fading. A line is the only thing here allowed more ink than the
 * ocean had, and never as much as a whale.
 *
 * Nothing here has a memory or a clock of its own beyond `uTime`: a glyph is a pure function of
 * its place on the page, the time and the wake under it, so it never flickers between frames.
 */
const livingCells = (fx: OceanEffects) => `#version 300 es
${fx.flow ? '#define FLOW' : ''}
${fx.wake ? '#define WAKE' : ''}
${fx.sea ? '#define SEA' : ''}
precision highp float;
uniform vec2 uCellPx;
uniform float uOffsetX;
uniform float uScrollPx;
uniform float uFirstRow;
uniform float uViewH;
uniform float uUnit;
uniform float uTime;
uniform float uCount;
uniform vec4 uGlyph[${SAMPLES}];
// How far the water is from the page (device px, waterInertia.ts): its layers do not all run as far
uniform float uLead;
#ifdef FLOW
// The lines of moving water on this screen: length, spacing, speed, and how much of a line shows in quiet water
uniform vec4 uFlow;
// How a line is drawn: the share of its cells that hold a stroke, its ink, how far that ink is
// lifted off the water, and the share of the bed's dots kept between the lines
uniform vec4 uFlowShow;
#endif
#ifdef SEA
// Per state: grain, reach, pace, ripple · warp, crossing angle, shimmer, set · run, lanes, speed (seaState.ts)
uniform vec4 uSeaA[${SEA_MAX_STATES}];
uniform vec4 uSeaB[${SEA_MAX_STATES}];
uniform vec4 uSeaC[${SEA_MAX_STATES}];
// Where state i meets state i + 1 (px from the top of the page), and half the water they share
uniform vec2 uSeaEdge[${SEA_MAX_EDGES}];
#endif
#ifdef WAKE
uniform sampler2D uWake;
// Rows the page has moved since the wake was last stepped
uniform float uWakeRow;
// How far moved water carries the currents (px), the share of a wake's cells that hold a stroke,
// their ink, and how far that ink is lifted off the water
uniform vec4 uWakeGain;
#endif
out vec4 outCell;
${COMMON}
// The two sea states that hold this cell and how far it lies from the first into the second.
// Without SEA there is one: the ocean as it has always been.
vec4 seaA0 = vec4(1.0, 1.0, 1.0, 0.32);
vec4 seaB0 = vec4(1.7, 0.0, 1.0, 1.7);
vec4 seaC0 = vec4(1.0, 1.0, 1.0, 0.0);
vec4 seaA1 = vec4(1.0, 1.0, 1.0, 0.32);
vec4 seaB1 = vec4(1.7, 0.0, 1.0, 1.7);
vec4 seaC1 = vec4(1.0, 1.0, 1.0, 0.0);
float seaMix = 0.0;

// One state's currents at a point of the page (px): long swells near the surface (stretched
// sideways), rounder water in the deep, warped by a slower flow so nothing repeats
float currents(vec2 at, float stretch, float t, vec4 a, vec4 b) {
  float ts = t * a.z;
  vec2 p = at / uUnit;
  vec2 shape = vec2(1.0 / (stretch * a.y), 1.0) * (1.7 * a.x);
  float c = cos(b.y);
  float s = sin(b.y);
  vec2 q = vec2(c * p.x + s * p.y, c * p.y - s * p.x) * shape;
  vec2 warp = (vec2(
    noise(p * shape * 0.5 + vec2(ts * 0.031, 1.7)),
    noise(p * shape * 0.5 + vec2(5.2, -ts * 0.027))
  ) - 0.5) * b.x;
  q += warp;
  float swell = noise(q + vec2(ts * 0.085, -ts * 0.018));
  if (b.y > 0.0) {
    // A second set of currents, leaning the other way, crossing the first
    vec2 r = vec2(c * p.x - s * p.y, c * p.y + s * p.x) * shape + warp + vec2(31.7, 11.3);
    float other = noise(r + vec2(-ts * 0.07, ts * 0.021));
    swell = clamp(0.5 + (swell + other - 1.0) * 0.72, 0.0, 1.0);
  }
  float ripple = noise(q * 2.3 + vec2(-ts * 0.14, ts * 0.045));
  // Whatever the share of ripple, the water keeps the contrast it has at the usual 0.32, so a
  // state changes how the currents move and never how many glyphs there are
  float contrast = sqrt(0.5648 / ((1.0 - a.w) * (1.0 - a.w) + a.w * a.w));
  return clamp(0.5 + (swell * (1.0 - a.w) + ripple * a.w - 0.5) * contrast, 0.0, 1.0);
}

// Two waters meeting: their values crossfade (never their settings, which would shear the
// drift), and keep their contrast through the middle
float meet(float f, float g) {
  float keep = inversesqrt(seaMix * seaMix + (1.0 - seaMix) * (1.0 - seaMix));
  return clamp(0.5 + (mix(f, g, seaMix) - 0.5) * keep, 0.0, 1.0);
}

float water(vec2 at, float stretch, float t) {
  float f = currents(at, stretch, t, seaA0, seaB0);
#ifdef SEA
  f = meet(f, currents(at, stretch, t, seaA1, seaB1));
#endif
  return f;
}

#ifdef FLOW
// One state's lines of moving water through a point: how much of a line is here (x) and the way
// it runs, as a doubled angle (yz), so that two flows add up whichever way each is said to point.
// The water runs sideways (the state's set) and the currents bend it: their field is the stream
// function of what they add, so a line of water follows the level lines of  y + field / set.
// A slow noise read in those two coordinates (far along the line, close across it) is therefore
// drawn out along the streamlines, and sliding it along the first makes the lines travel.
vec3 stream(vec2 at, float f, vec2 slope, float t, vec4 b, vec4 c) {
  vec2 p = at / uUnit;
  float bend = 1.0 / b.w;
  float cs = cos(b.y);
  float sn = sin(b.y);
  float along = 1.9 * uFlow.x / c.x;
  float across = 15.0 * uFlow.y * c.y;
  float travel = t * 0.098 * uFlow.z * c.z * along;
  vec2 turn = bend * vec2(slope.y, -slope.x);
  vec2 pr = vec2(cs * p.x + sn * p.y, cs * p.y - sn * p.x);
  vec2 on = vec2(pr.x * along - travel, (pr.y + f * bend) * across);
  // A line that only slid along itself would show nothing moving but its two ends: it is broken
  // into runs by a finer grain that travels with it, so the whole length is seen to stream
  float here = smoothstep(0.535, 0.65, noise(on)) * smoothstep(0.37, 0.5, noise(on * vec2(${FLOW_GRAIN.toFixed(1)}, 0.4) + vec2(0.0, 9.7)));
  vec2 run = vec2(cs, sn) + turn;
  if (b.y > 0.0) {
    // The second set of a crossing sea: leaning the other way, a little slower
    vec2 po = vec2(cs * p.x - sn * p.y, cs * p.y + sn * p.x);
    vec2 oo = vec2(po.x * along - travel * 0.7 + 17.3, (po.y + f * bend) * across + 5.1);
    float other = smoothstep(0.535, 0.65, noise(oo)) * smoothstep(0.37, 0.5, noise(oo * vec2(${FLOW_GRAIN.toFixed(1)}, 0.4) + vec2(0.0, 9.7)));
    if (other > here) {
      here = other;
      run = vec2(cs, -sn) + turn;
    }
  }
  return vec3(here, vec2(run.x * run.x - run.y * run.y, 2.0 * run.x * run.y) / max(dot(run, run), 1.0e-4));
}
#endif

void main() {
  // The cell's place on the page: column, and row counted from the top of the document
  vec2 cell = vec2(floor(gl_FragCoord.x), uFirstRow + floor(gl_FragCoord.y));
  vec2 centre = vec2(uOffsetX + (cell.x + 0.5) * uCellPx.x, (cell.y + 0.5) * uCellPx.y);
  float s = clamp((centre.y - uScrollPx) / uViewH, 0.0, 1.0) * ${SAMPLES - 1}.0;
  int i = int(floor(s));
  vec4 g = mix(uGlyph[i], uGlyph[min(i + 1, ${SAMPLES - 1})], fract(s));
  float t = uTime;
  float shimmer = 1.0;

#ifdef SEA
  int edge = 0;
  float nearest = 1.0e12;
  for (int j = 0; j < ${SEA_MAX_EDGES}; j++) {
    float away = abs(centre.y - uSeaEdge[j].x);
    if (away < nearest) { nearest = away; edge = j; }
  }
  seaMix = smoothstep(uSeaEdge[edge].x - uSeaEdge[edge].y, uSeaEdge[edge].x + uSeaEdge[edge].y, centre.y);
  seaA0 = uSeaA[edge];
  seaB0 = uSeaB[edge];
  seaC0 = uSeaC[edge];
  seaA1 = uSeaA[edge + 1];
  seaB1 = uSeaB[edge + 1];
  seaC1 = uSeaC[edge + 1];
  shimmer = mix(seaB0.z, seaB1.z, seaMix);
#endif

  // Water that is catching up with the page does not all travel as one sheet: broad bodies of
  // it run a little further or less far than the lattice, so a stop is seen to pass through it
  vec2 at = centre;
  at.y += uLead * (noise(centre / uUnit * vec2(0.6, 1.1) + vec2(3.1, 8.7)) - 0.5) * 1.7;

  // The water's memory of the whales here: the way it was moved, and how much of that is left
  vec2 wake = vec2(0.0);
  float moved = 0.0;
  float stirred = 0.0;
#ifdef WAKE
  ivec2 spot = ivec2(gl_FragCoord.xy) + ivec2(0, int(uWakeRow));
  ivec2 size = textureSize(uWake, 0);
  if (spot.y >= 0 && spot.y < size.y && spot.x < size.x) {
    vec4 memory = texelFetch(uWake, spot, 0);
    wake = (memory.rg * 255.0 - 128.0) / 127.0;
    moved = length(wake);
    stirred = smoothstep(0.02, 0.36, memory.b);
  }
  // Water a whale has moved carries the currents with it, so they bend along its path
  at -= wake * uWakeGain.x;
#endif

  float field = currents(at, g.z, t, seaA0, seaB0);
#ifdef SEA
  float fieldAbove = field;
  float fieldBelow = currents(at, g.z, t, seaA1, seaB1);
  field = meet(fieldAbove, fieldBelow);
#endif
  float v = smoothstep(0.38, 0.72, field);
  float pick = hash12(cell + 0.37);
  float level = hash12(cell * 1.73 + 4.1);
  // Each cell retunes its glyph slowly, at its own moment: a shimmer, never a flicker
#ifdef SEA
  float tick = floor(t * 1.6 * shimmer + level * 7.0);
#else
  float tick = floor(t * 1.6 + level * 7.0);
#endif
  float wobble = (hash12(cell * 2.31 + tick * 17.7) - 0.5) * 0.16;
  float tone = clamp(v + wobble, 0.0, 1.0);
  float index = clamp(floor(tone * (uCount - 1.0) + 0.5), 1.0, uCount - 1.0);
  // No global glyph bed. Only explicit flow previews or whale memory can emit ink.
  float present = 0.0;
  float ink = 0.0;
  float lift = 0.0;
  // A line of moving water through this cell: how much of one, the way it runs (doubled angle),
  // the share of its cells that hold a stroke, and their ink
  float stroke = 0.0;
  vec2 line = vec2(1.0, 0.0);
  float filled = 0.0;
  float inked = 0.0;

#ifdef FLOW
  float probe = uCellPx.y;
  vec2 slope = vec2(water(at + vec2(probe, 0.0), g.z, t) - field, water(at + vec2(0.0, probe), g.z, t) - field) * (uUnit / probe);
#ifdef SEA
  vec3 above = stream(at, fieldAbove, slope, t, seaB0, seaC0);
  vec3 below = stream(at, fieldBelow, slope, t, seaB1, seaC1);
  stroke = mix(above.x, below.x, seaMix);
  line = above.yz * (above.x + 0.05) * (1.0 - seaMix) + below.yz * (below.x + 0.05) * seaMix;
#else
  vec3 lines = stream(at, field, slope, t, seaB0, seaC0);
  stroke = lines.x;
  line = lines.yz;
#endif
  // The lines are strongest where the currents are, and thin out in quiet water
  stroke *= mix(uFlow.w, 1.0, smoothstep(0.08, 0.5, v));
  filled = uFlowShow.x;
  inked = uFlowShow.y;
  lift = stroke * uFlowShow.z;
  // Between the lines the bed is quiet: dots only, and a few less of them, so that the lines
  // carry the water's movement and the ocean holds no more ink than it did
  index = 1.0 + floor(min(tone, 0.999) * 3.0);
  present *= uFlowShow.w;
  ink *= 0.9;
#endif

#ifdef WAKE
  // Emit only inside the whale's fading, directional memory.
  float trail = stirred;
  vec2 trailLine = moved > 0.02 ? vec2(wake.x * wake.x - wake.y * wake.y, 2.0 * wake.x * wake.y) / (moved * moved) : vec2(1.0, 0.0);
  line = line * stroke * (1.0 - stirred) + trailLine * trail;
  filled = mix(filled, uWakeGain.y, stirred);
  inked = mix(inked, uWakeGain.z, stirred);
  lift = max(lift * (1.0 - stirred), stirred * uWakeGain.w);
  stroke = max(stroke * (1.0 - 0.7 * stirred), trail);
#endif

#if defined(FLOW) || defined(WAKE)
  if (stroke > 0.3) {
    vec2 heading = line / max(length(line), 1.0e-4);
    // Each cell leans a little its own way, so the border between two strokes is never a line
    float levelness = heading.x + (hash12(cell * 3.17 + 9.2) - 0.5) * 0.2;
    float weight = stroke + (level - 0.5) * 0.22;
    // Level strokes by weight ( - ~ ≈ ), a lean where the water turns, and where it runs
    // straight up or down the page the upright pair
    if (levelness > 0.5) index = weight < 0.56 ? 4.0 : (weight < 0.84 ? 5.0 : 8.0);
    else if (levelness < -0.62) index = weight < 0.7 ? 3.0 : 11.0;
    else index = heading.y > 0.0 ? 10.0 : 9.0;
    float drawn = smoothstep(0.3, 0.72, stroke);
    present = max(present, filled * drawn);
    ink = max(ink, inked * drawn * mix(0.72, 1.0, level));
  }
#endif

  float alpha = (present > 0.0 ? step(pick, present) : 0.0) * min(1.0, g.y * ink);
  // No emission outside the disturbance; preserve the water palette.
  outCell = vec4(index / 255.0, alpha, field, lift);
}`;

/** The screen pass of the living ocean: the one above, with a line's ink lifted off the water by the cell's own measure. */
const LIVING_SCREEN = SCREEN.replace(
  'vec3 color = mix(water, ink, cell.g * coverage);',
  `// Lifted ink leaves the water's colour for the pale of broken water (in the deep) or a deeper
  // blue (near the surface, where the ink is the darker of the two)
  float deep = step(dot(water, vec3(0.2126, 0.7152, 0.0722)), dot(ink, vec3(0.2126, 0.7152, 0.0722)));
  vec3 lifted = mix(ink, mix(ink * 0.55, vec3(0.80, 0.87, 0.96), deep), cell.a);
  vec3 color = mix(water, lifted, cell.g * coverage);`
);

/** Bend the existing glyph lattice locally; transport marks instead of adding particles. */
const wakeScreen = (screen: string) => screen.replace(
  'uniform float uFrame;',
  'uniform float uFrame;\nuniform sampler2D uWake;\nuniform float uWakeRow;'
).replace(
  '  vec2 cellIndex = floor(coord);',
  `  vec2 memoryUv = (coord + vec2(0.0, uWakeRow)) / uCellsSize;
  if (all(greaterThan(memoryUv, vec2(0.0))) && all(lessThan(memoryUv, vec2(1.0)))) {
    vec2 displacement = (texture(uWake, memoryUv).rg * 255.0 - 128.0) / 127.0;
    coord -= displacement * vec2(uCellPx.y / uCellPx.x, 1.0) * 1.8;
  }
  vec2 cellIndex = floor(coord);`
);

/**
 * The water's memory of the whales: one texel per glyph cell, on the cells' own lattice. Red and
 * green hold the flow a whale has given the water (128 is rest), blue how stirred it is. Each
 * step the moved water drifts on along its own direction, spreads a little and fades; where a
 * whale's body is (oceanWake.ts) the water takes the flow around it, and what its tail and flukes
 * stir is carried astern in their wash: that is the trail. Every other step the stored values are
 * rounded toward rest, so however slowly the water settles it always comes back to rest exactly,
 * within three seconds after the whale has gone.
 */
const WAKE_STEP = `#version 300 es
precision highp float;
uniform sampler2D uPrev;
uniform vec2 uCellPx;
// Rows the page has moved since the last step
uniform float uRowShift;
// Flow kept per step, stir kept, drift (px per step at full flow), spread
uniform vec4 uKeep;
// How far the water under a body takes its flow in one step, and whether this step rounds the
// stored flow toward rest (1) or to the nearest value (0)
uniform vec2 uTake;
// Centre (cells), radius (px), strength · unit direction, stir, the stir's reach (radii) ·
// what it sheds off the bow and along the flanks
uniform vec4 uBody[${WAKE_BODIES}];
uniform vec4 uMove[${WAKE_BODIES}];
uniform vec4 uShed[${WAKE_BODIES}];
out vec4 outWake;
const vec4 REST = vec4(128.0 / 255.0, 128.0 / 255.0, 0.0, 1.0);

vec4 before(vec2 at) {
  vec2 uv = (at + vec2(0.0, uRowShift)) / vec2(textureSize(uPrev, 0));
  if (uv.x <= 0.0 || uv.x >= 1.0 || uv.y <= 0.0 || uv.y >= 1.0) return REST;
  return texture(uPrev, uv);
}

void main() {
  vec2 cell = gl_FragCoord.xy;
  vec2 drift = (before(cell).rg * 255.0 - 128.0) / 127.0;
  vec2 from = cell - drift * uKeep.z / uCellPx;
  vec4 was = before(from);
  vec4 around = (before(from + vec2(1.0, 0.0)) + before(from - vec2(1.0, 0.0)) + before(from + vec2(0.0, 1.0)) + before(from - vec2(0.0, 1.0))) * 0.25;
  was = mix(was, around, uKeep.w);
  vec2 flow = (was.rg * 255.0 - 128.0) / 127.0 * uKeep.x;
  float churn = was.b * uKeep.y;

  vec2 px = cell * uCellPx;
  for (int i = 0; i < ${WAKE_BODIES}; i++) {
    vec4 body = uBody[i];
    if (body.w == 0.0) continue;
    vec2 d = px - body.xy * uCellPx;
    float d2 = dot(d, d);
    float r2 = d2 / (body.z * body.z);
    if (body.w < 0.0) {
      // A driving body (the tail, the flukes): the water is thrown astern in a wash that widens
      // and slackens, and carries what the body has stirred away behind the animal
      vec2 astern = uMove[i].xy;
      float aft = dot(d, astern) / body.z;
      if (aft > -1.0 && aft < ${WAKE.washLength.toFixed(1)}) {
        float abeam = (d.x * astern.y - d.y * astern.x) / body.z;
        float wide = 1.0 + ${WAKE.washFlare.toFixed(2)} * max(aft, 0.0);
        float inside = smoothstep(-1.0, 0.2, aft) * (1.0 - smoothstep(${(WAKE.washLength * 0.5).toFixed(1)}, ${WAKE.washLength.toFixed(1)}, aft)) * exp(-abeam * abeam / (wide * wide) * 1.5);
        flow = mix(flow, astern * (-body.w), uTake.x * inside);
      }
      churn = max(churn, min(1.0, uMove[i].z * 1.3) * exp(-r2 * ${WAKE.stirFall.toFixed(2)} / (uMove[i].w * uMove[i].w)));
      continue;
    }
    if (r2 >= ${(WAKE.reach * WAKE.reach).toFixed(1)}) continue;
    vec2 along = uMove[i].xy;
    vec2 want = along;
    float within = 1.0;
    // Under the body the water is the animal: it moves fully only at its surface
    float share = r2;
    if (r2 > 1.0) {
      // Outside the body the water is pushed on and slips around it: between a doublet and the
      // body's own heading (oceanWake.ts), fading with distance
      vec2 n = d * inversesqrt(d2);
      want = mix(2.0 * dot(along, n) * n - along, along, ${WAKE.slip.toFixed(2)});
      within = 1.0 - smoothstep(${(WAKE.reach * WAKE.reach * 0.45).toFixed(2)}, ${(WAKE.reach * WAKE.reach).toFixed(1)}, r2);
      share = within * inversesqrt(r2);
    }
    flow = mix(flow, want * (body.w * share), uTake.x * within);
    // What a body that parts the water sheds: a band just outside its outline, pressed ahead of
    // the bow as a crescent and slipping back along each flank
    float off = sqrt(r2) - ${WAKE.shedAt.toFixed(2)};
    float ahead = d2 > 0.0 ? dot(d, along) * inversesqrt(d2) : 0.0;
    float band = exp(-off * off * ${WAKE.shedFall.toFixed(1)});
    float shed = max(uShed[i].x * smoothstep(0.1, 0.8, ahead), uShed[i].y * (1.0 - smoothstep(0.35, 0.8, abs(ahead))));
    churn = max(churn, min(1.0, shed * 1.3) * band);
  }

  float speed = length(flow);
  if (speed > 1.0) flow /= speed;
  vec2 steps = sign(flow) * floor(abs(flow) * 127.0 + 0.5 * (1.0 - uTake.y));
  outWake = vec4((128.0 + steps) / 255.0, floor(clamp(churn, 0.0, 1.0) * 255.0 + 0.5 * (1.0 - uTake.y)) / 255.0, 1.0);
}`;

/** What one wake step keeps and takes (WAKE_STEP's uKeep and uTake), at WAKE_HZ. */
const WAKE_KEEP = { flow: 0.955, churn: 0.97, drift: 2.3, spread: 0.08, take: 0.14 };
/**
 * Sparse strokes in moved water only. The screen pass bends the local lattice by up to 1.8 rows.
 */
const WAKE_SHOW = { carry: 3.4, density: 0.48, ink: 1.6, lift: 0 };
/**
 * The lines of moving water (livingCells' uFlow and uFlowShow). A phone's screen is a quarter as
 * wide, so its lines are shorter and a little closer, or one line would span the screen and
 * nothing would be seen to travel. `quiet` is how much of a line shows away from the currents,
 * `bed` how many of the bed's dots stay between the lines.
 */
const FLOW_SHOW = {
  wide: { length: 1, lanes: 1, speed: 1 },
  narrow: { length: 1.9, lanes: 1.12, speed: 0.8 },
  quiet: 0.7,
  density: 0.9,
  ink: 1.18,
  lift: 0.16,
  bed: 0.74
};

export interface AsciiOcean {
  destroy: () => void;
}

/**
 * Starts the ocean on `canvas` (a fixed, screen-sized canvas under the page) and keeps the
 * page's CSS water in step with it. Without WebGL2 the CSS water still follows the descent.
 */
export function createAsciiOcean(canvas: HTMLCanvasElement): AsciiOcean {
  const gl = canvas.getContext('webgl2', {
    alpha: false,
    antialias: false,
    depth: false,
    stencil: false,
    premultipliedAlpha: true
  });
  const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  let reduce = motionQuery.matches;
  const geometry: OceanGeometry = { journeyStart: Infinity, journeyTravel: 1, maxScroll: 1, viewHeight: 1 };
  const view = { width: 1, height: 1, ratio: 1, cellCss: 14 };
  let glReady = false;
  let disposed = false;
  let raf = 0;
  let last = 0;
  let lastDraw = 0;
  let lastScroll = NaN;
  let time = 0;
  let frameSeed = 0;
  /** QA only: skip the WebGL passes, to measure the page without them. */
  let qaPaused = false;
  let resizePending = true;
  let opening: CreationRenderer | null = null;
  let openingWait = 0;
  // The living ocean: which behaviours are on, and what each one keeps between frames
  const fx: OceanEffects = { ...oceanEffects };
  const living = () => fx.flow || fx.wake || fx.sea;
  const characters = () => (living() ? FLOW_CHARACTERS : CHARACTERS);
  const inertia = newWaterInertia();
  /** How far the water is ahead of the page this frame (CSS px). */
  let lead = 0;
  let sea = packSea(layoutSea([], 1), 1);
  const wakeTracker = newWakeTracker();
  const wakeBodies = new Float32Array(WAKE_BODIES * 4);
  const wakeMoves = new Float32Array(WAKE_BODIES * 4);
  const wakeSheds = new Float32Array(WAKE_BODIES * 4);
  /** Seconds since the last wake step, the lattice row it was stepped at, and steps left to fade. */
  let wakeClock = 0;
  let wakeRow = 0;
  let wakeLive = 0;
  let wakeFront = 0;
  let wakeSteps = 0;
  const stats = { compileMs: 0, firstDrawMs: -1, living: false };

  const water = new Float32Array(SAMPLES * 3);
  const ink = new Float32Array(SAMPLES * 3);
  const glyphs = new Float32Array(SAMPLES * 4);

  // --- WebGL resources ----------------------------------------------------------------------
  let cells: ReturnType<typeof link> = null;
  let wakeStep: ReturnType<typeof link> = null;
  let screen: ReturnType<typeof link> = null;
  /** Link the cell pass for the behaviours that are on; if the living ocean cannot be built here, the ocean as it was. */
  const build = () => {
    if (!gl) return;
    const started = performance.now();
    if (cells) gl.deleteProgram(cells.program);
    if (wakeStep) gl.deleteProgram(wakeStep.program);
    if (screen) gl.deleteProgram(screen.program);
    cells = link(gl, living() ? livingCells(fx) : CELLS);
    wakeStep = fx.wake && cells ? link(gl, WAKE_STEP) : null;
    const surface = fx.flow ? LIVING_SCREEN : SCREEN;
    screen = link(gl, fx.wake ? wakeScreen(surface) : surface);
    if (living() && (!cells || !screen || (fx.wake && !wakeStep))) {
      if (cells) gl.deleteProgram(cells.program);
      if (wakeStep) gl.deleteProgram(wakeStep.program);
      if (screen) gl.deleteProgram(screen.program);
      fx.flow = fx.wake = fx.sea = false;
      wakeStep = null;
      cells = link(gl, CELLS);
      screen = link(gl, SCREEN);
    }
    stats.compileMs = performance.now() - started;
    stats.firstDrawMs = -1;
    stats.living = living();
  };
  build();
  let vao: WebGLVertexArrayObject | null = null;
  let cellTexture: WebGLTexture | null = null;
  let cellFramebuffer: WebGLFramebuffer | null = null;
  const cellGrid = { cols: 0, rows: 0 };
  let atlas: Atlas | null = null;
  const wakeTextures: (WebGLTexture | null)[] = [null, null];
  const wakeFramebuffers: (WebGLFramebuffer | null)[] = [null, null];
  /** The wake's two textures, on the cells' lattice, at rest. */
  const allocateWake = () => {
    if (!gl || !fx.wake || !cellGrid.cols) return;
    for (let i = 0; i < 2; i++) {
      wakeTextures[i] ??= gl.createTexture();
      wakeFramebuffers[i] ??= gl.createFramebuffer();
      gl.bindTexture(gl.TEXTURE_2D, wakeTextures[i]);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA8, cellGrid.cols, cellGrid.rows, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.bindFramebuffer(gl.FRAMEBUFFER, wakeFramebuffers[i]);
      gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, wakeTextures[i], 0);
      gl.clearColor(128 / 255, 128 / 255, 0, 1);
      gl.clear(gl.COLOR_BUFFER_BIT);
    }
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    wakeLive = 0;
    wakeTracker.x.fill(NaN);
    wakeTracker.y.fill(NaN);
    wakeTracker.water = NaN;
    oceanWake.count = 0;
  };
  /** Where each section of the CV begins, for the sea states. Read when the layout changes, never per frame. */
  const measureSea = () => {
    if (!fx.sea) return;
    const sections: SeaSection[] = [];
    document.querySelectorAll<HTMLElement>('[data-editorial-section][id]').forEach((el) => {
      sections.push({ id: el.id, top: el.getBoundingClientRect().top + window.scrollY });
    });
    sea = packSea(layoutSea(sections, window.innerHeight), view.ratio);
  };

  if (gl && cells && screen) {
    vao = gl.createVertexArray();
    cellTexture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, cellTexture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    cellFramebuffer = gl.createFramebuffer();
    atlas = buildAtlas(gl, characters(), FONT);
    document.fonts?.load?.(`300 64px ${FONT}`, characters()).then(
      () => {
        if (disposed || !glReady) return;
        if (atlas) gl.deleteTexture(atlas.texture);
        atlas = buildAtlas(gl, characters(), FONT);
        lastScroll = NaN;
        schedule();
      },
      () => {}
    );
    glReady = true;
  }

  if (creation.active) {
    if (!gl || !glReady) finishCreation('webgl-unavailable');
    else import('./creationRenderer').then(({ createCreationRenderer }) => {
      if (disposed || !creation.active) return;
      opening = createCreationRenderer(gl);
      return opening.ready.then(() => {
        if (!disposed && creation.active) {
          creation.ready = true;
          creation.listeners.forEach(fn => fn());
          schedule();
        }
      });
    }).catch(error => {
      if (!disposed) { console.warn('Opening unavailable; continuing into the portfolio.', error); finishCreation('renderer-unavailable'); }
    });
  }

  const onContextLost = (event: Event) => {
    event.preventDefault();
    glReady = false;
    finishCreation('context-lost');
  };
  canvas.addEventListener('webglcontextlost', onContextLost);

  const measure = () => {
    geometry.journeyStart = globeScrollGeometry.start;
    geometry.journeyTravel = globeScrollGeometry.travel;
  };

  const resize = () => {
    // ResizeObserver runs after RAF and before paint. Resizing its opaque canvas here
    // used to present a cleared (black) buffer until the next frame on mobile.
    resizePending = true;
    schedule();
  };
  const applyResize = () => {
    resizePending = false;
    const projectionChanged = view.width !== canvas.clientWidth || view.height !== canvas.clientHeight
      || view.ratio !== Math.min(window.devicePixelRatio || 1, canvas.clientWidth < 768 ? 1.25 : 1.5);
    view.width = Math.max(1, canvas.clientWidth);
    view.height = Math.max(1, canvas.clientHeight);
    const narrow = view.width < 768;
    view.ratio = Math.min(window.devicePixelRatio || 1, narrow ? 1.25 : 1.5);
    view.cellCss = narrow ? 12 : 14;
    geometry.viewHeight = window.innerHeight;
    geometry.maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    const width = Math.max(1, Math.round(view.width * view.ratio));
    const height = Math.max(1, Math.round(view.height * view.ratio));
    if (canvas.width !== width) canvas.width = width;
    if (canvas.height !== height) canvas.height = height;
    if (gl && glReady) {
      const cellH = view.cellCss * view.ratio;
      const cellW = cellH * 0.6;
      const cols = Math.ceil(canvas.width / cellW) + 1;
      const rows = Math.ceil(canvas.height / cellH) + 2;
      if (cols !== cellGrid.cols || rows !== cellGrid.rows) {
        cellGrid.cols = cols;
        cellGrid.rows = rows;
        gl.bindTexture(gl.TEXTURE_2D, cellTexture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA8, cols, rows, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
        gl.bindFramebuffer(gl.FRAMEBUFFER, cellFramebuffer);
        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, cellTexture, 0);
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      }
      if (projectionChanged) allocateWake();
    }
    measureSea();
    lastScroll = NaN;
  };

  /** Depth samples for a column of points down the screen, at this scroll position. */
  const sampleDepths = (scroll: number) => {
    for (let i = 0; i < SAMPLES; i++) {
      const depth = depthAtDocument(scroll + (i / (SAMPLES - 1)) * view.height, geometry);
      water.set(waterAt(depth), i * 3);
      ink.set(inkAt(depth), i * 3);
      const g = glyphsAt(depth);
      glyphs.set([g.density, g.strength, g.stretch, depth], i * 4);
    }
  };

  /**
   * One step of the water's memory of the whales: where they are now and how they move through
   * the water (`water`: the lattice's scroll, CSS px), relaxed into the wake's texture.
   */
  const stepWake = (elapsed: number, water: number, firstRow: number, cellW: number, cellH: number, offsetX: number) => {
    if (!gl || !wakeStep || !wakeTextures[0]) return;
    const swimming = !reduce && !creation.active;
    trackWake(wakeTracker, ambientWhalesLive.spines, swimming ? ambientWhalesLive.presence : 0, water, elapsed, view.height);
    if (oceanWake.count) wakeLive = WAKE_LINGER;
    else if (wakeLive > 0) {
      wakeLive = Math.max(0, wakeLive - elapsed);
      if (wakeLive === 0) {
        // Clear before suspending the pass, so no stale memory survives at rest.
        for (const framebuffer of wakeFramebuffers) {
          gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
          gl.clearColor(128 / 255, 128 / 255, 0, 1);
          gl.clear(gl.COLOR_BUFFER_BIT);
        }
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      }
    }
    if (wakeLive <= 0) {
      // Still water: nothing to step, and nothing in the texture to keep in place
      wakeRow = firstRow;
      return;
    }
    wakeBodies.fill(0);
    wakeMoves.fill(0);
    wakeSheds.fill(0);
    for (let i = 0; i < oceanWake.count; i++) {
      const body = oceanWake.bodies[i];
      // A driving body is told apart by the sign of its strength, and given the way astern
      const way = body.wash ? -1 : 1;
      // On a phone a whale's flukes are a cell or two across: what they move is given room enough
      // to be drawn (WAKE_MIN_ROWS), or the wake would be lost between the glyphs
      const radius = Math.max(body.r * view.ratio, WAKE_MIN_ROWS * cellH);
      wakeBodies.set([(body.x * view.ratio - offsetX) / cellW, ((body.y + water) * view.ratio) / cellH - firstRow, radius, body.strength * way], i * 4);
      wakeMoves.set([body.ux * way, body.uy * way, body.churn, body.spread], i * 4);
      wakeSheds.set([body.bow, body.flank, 0, 0], i * 4);
    }
    const back = 1 - wakeFront;
    gl.bindFramebuffer(gl.FRAMEBUFFER, wakeFramebuffers[back]);
    gl.viewport(0, 0, cellGrid.cols, cellGrid.rows);
    gl.useProgram(wakeStep.program);
    const wu = wakeStep.uniforms;
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, wakeTextures[wakeFront]);
    gl.uniform1i(wu.uPrev, 0);
    gl.uniform2f(wu.uCellPx, cellW, cellH);
    gl.uniform1f(wu.uRowShift, firstRow - wakeRow);
    // Decay and transport follow elapsed seconds, including slower mobile frames.
    const steps = elapsed * WAKE_HZ;
    gl.uniform4f(wu.uKeep, WAKE_KEEP.flow ** steps, WAKE_KEEP.churn ** steps, WAKE_KEEP.drift * view.ratio * steps, 1 - (1 - WAKE_KEEP.spread) ** steps);
    gl.uniform2f(wu.uTake, 1 - (1 - WAKE_KEEP.take) ** steps, wakeSteps++ % 2);
    gl.uniform4fv(wu.uBody, wakeBodies);
    gl.uniform4fv(wu.uMove, wakeMoves);
    gl.uniform4fv(wu.uShed, wakeSheds);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
    wakeFront = back;
    wakeRow = firstRow;
  };

  /** `scroll` is the page; `lattice` is where the ocean's glyph lattice is (the page, plus the water's own momentum). */
  const draw = (scroll: number, lattice = scroll) => {
    if (!gl || !glReady || !cells || !screen || !atlas) return;
    sampleDepths(scroll);
    const cellH = view.cellCss * view.ratio;
    const cellW = cellH * 0.6;
    const scrollPx = lattice * view.ratio;
    const firstRow = Math.floor(scrollPx / cellH);
    const offsetX = (canvas.width - cellGrid.cols * cellW) / 2;

    gl.bindVertexArray(vao);
    gl.disable(gl.BLEND);

    if (fx.wake && wakeClock >= 1 / WAKE_HZ - 0.003) {
      stepWake(wakeClock, lattice, firstRow, cellW, cellH, offsetX);
      wakeClock = 0;
    }

    gl.bindFramebuffer(gl.FRAMEBUFFER, cellFramebuffer);
    gl.viewport(0, 0, cellGrid.cols, cellGrid.rows);
    gl.useProgram(cells.program);
    const cu = cells.uniforms;
    gl.uniform2f(cu.uCellPx, cellW, cellH);
    gl.uniform1f(cu.uOffsetX, offsetX);
    gl.uniform1f(cu.uScrollPx, scrollPx);
    gl.uniform1f(cu.uFirstRow, firstRow);
    gl.uniform1f(cu.uViewH, canvas.height);
    gl.uniform1f(cu.uUnit, WORLD_UNIT * view.ratio);
    gl.uniform1f(cu.uTime, time);
    // The ramp's own length: the living ocean's atlas also holds the strokes
    gl.uniform1f(cu.uCount, [...CHARACTERS].length);
    if (living()) gl.uniform1f(cu.uLead, (lattice - scroll) * view.ratio);
    if (fx.flow) {
      const lines = view.width < 768 ? FLOW_SHOW.narrow : FLOW_SHOW.wide;
      gl.uniform4f(cu.uFlow, lines.length, lines.lanes, lines.speed, FLOW_SHOW.quiet);
      gl.uniform4f(cu.uFlowShow, FLOW_SHOW.density, FLOW_SHOW.ink, FLOW_SHOW.lift, FLOW_SHOW.bed);
    }
    gl.uniform4fv(cu.uGlyph, glyphs);
    if (fx.sea) {
      gl.uniform4fv(cu.uSeaA, sea.a);
      gl.uniform4fv(cu.uSeaB, sea.b);
      gl.uniform4fv(cu.uSeaC, sea.c);
      gl.uniform2fv(cu.uSeaEdge, sea.edges);
    }
    if (fx.wake) {
      gl.activeTexture(gl.TEXTURE2);
      gl.bindTexture(gl.TEXTURE_2D, wakeTextures[wakeFront]);
      gl.uniform1i(cu.uWake, 2);
      gl.uniform1f(cu.uWakeRow, firstRow - wakeRow);
      gl.uniform4f(cu.uWakeGain, WAKE_SHOW.carry * cellH, WAKE_SHOW.density, WAKE_SHOW.ink, WAKE_SHOW.lift);
      gl.activeTexture(gl.TEXTURE0);
    }
    gl.drawArrays(gl.TRIANGLES, 0, 3);

    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.useProgram(screen.program);
    const su = screen.uniforms;
    if (fx.wake) {
      gl.uniform1i(su.uWake, 2);
      gl.uniform1f(su.uWakeRow, firstRow - wakeRow);
    }
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, cellTexture);
    gl.uniform1i(su.uCells, 0);
    gl.activeTexture(gl.TEXTURE1);
    gl.bindTexture(gl.TEXTURE_2D, atlas.texture);
    gl.uniform1i(su.uAtlas, 1);
    gl.uniform2f(su.uCellPx, cellW, cellH);
    gl.uniform2f(su.uCellsSize, cellGrid.cols, cellGrid.rows);
    gl.uniform1f(su.uOffsetX, offsetX);
    gl.uniform1f(su.uScrollPx, scrollPx);
    gl.uniform1f(su.uFirstRow, firstRow);
    gl.uniform1f(su.uViewH, canvas.height);
    gl.uniform2f(su.uAtlasGrid, atlas.grid[0], atlas.grid[1]);
    gl.uniform1f(su.uFrame, frameSeed);
    gl.uniform3fv(su.uWater, water);
    gl.uniform3fv(su.uInk, ink);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
    if (creation.active && creation.ready && opening && creation.time < OCEAN_HANDOFF_AT) {
      opening.draw(creation.time, canvas.width, canvas.height, water, ink, atlas, {
        cellW,
        cellH,
        startH: (view.width < 768 ? 8 : 9) * view.ratio,
        anchorX: offsetX + Math.round(cellGrid.cols / 2) * cellW,
        anchorY: Math.round(cellGrid.rows / 2) * cellH - (scrollPx - firstRow * cellH)
      });
    }
    if (creation.active && !creation.ready) { gl.clearColor(.003,.006,.012,1); gl.clear(gl.COLOR_BUFFER_BIT); }
  };

  const frame = (now: number) => {
    raf = 0;
    if (disposed || document.hidden) return;
    // Allocate and draw in one RAF task; no cleared backing buffer reaches a paint.
    // Keep the last frame intact while the diagnostic pause is active as well.
    if (resizePending && !qaPaused) applyResize();
    const dt = last ? Math.min(0.1, (now - last) / 1000) : 0;
    last = now;
    const depthSurge = !reduce && !creation.active ? ((window as { __magneticDepthSurge?: number }).__magneticDepthSurge ?? 0) : 0;
    if (!reduce) time += dt * (1 + Math.abs(depthSurge) * 2.2);
    wakeClock = Math.min(0.25, wakeClock + dt);
    if (creation.active && !creation.ready) {
      openingWait += dt;
      if (openingWait > 25) finishCreation('loading-timeout');
    }
    if (opening?.failed()) finishCreation('renderer-unavailable');
    // A moment ahead along the chosen journey's own route, so a seam between its scenes is checked too
    creation.held = !!opening && !opening.canDraw(creationLookahead(0.08));
    const prevCreationTime = creation.time;
    advanceCreation(dt);
    const creationMoved = creation.active && Math.abs(creation.time - prevCreationTime) > 1e-5;
    if (DEV && creation.active) {
      canvas.dataset.creationTime = creation.time.toFixed(3);
      canvas.dataset.creationReady = String(creation.ready);
    }
    // The arrival's handoff: the destination emerges only once its first frame can really be drawn,
    // and every frame while it does
    const handingOff = tickHandoff(now, !!opening && creation.active && creation.ready && opening.canDraw(creation.time), creation.active);
    const scroll = window.scrollY;
    // The water's own momentum: only the lattice the ocean draws on, never the page
    const lastLead = lead;
    if (fx.inertia && !reduce && !creation.active) lead = stepWaterInertia(inertia, scroll, dt, geometry.viewHeight);
    else {
      if (waterSettling(inertia) || inertia.scroll !== null) resetWaterInertia(inertia);
      lead = 0;
    }
    const surgeLead = depthSurge * 116;
    const moved = scroll !== lastScroll || creationMoved || handingOff || lead !== lastLead || depthSurge !== 0;
    // Scrolling redraws on every frame so the water moves with the page; at rest the
    // currents only need 30 fps
    if (moved || (!reduce && now - lastDraw >= 1000 / IDLE_FPS - 2)) {
      measure();
      applyWaterColor(depthAtScroll(scroll, geometry), depthAtDocument(scroll + 0.8 * geometry.viewHeight, geometry), globeStageFillsScreen(scroll, geometry));
      if (!qaPaused) {
        if (DEV && stats.firstDrawMs < 0 && gl && glReady) {
          // Development only: a driver may leave part of a shader's compile to its first draw
          const started = performance.now();
          draw(scroll, scroll + lead + surgeLead);
          gl.finish();
          stats.firstDrawMs = performance.now() - started;
        } else draw(scroll, scroll + lead + surgeLead);
      }
      lastDraw = now;
      lastScroll = scroll;
      frameSeed = (frameSeed + 1) % 97;
    }
    // Under reduced motion the water holds still and only scrolling or resizing redraws it
    if (!reduce) raf = requestAnimationFrame(frame);
    else last = 0;
  };

  function schedule() {
    if (!raf && !disposed && !document.hidden) raf = requestAnimationFrame(frame);
  }

  const onVisibility = () => {
    last = 0;
    schedule();
  };
  const onMotion = () => {
    reduce = motionQuery.matches;
    if (reduce) allocateWake();
    lastScroll = NaN;
    schedule();
  };
  const resizeObserver = new ResizeObserver(resize);
  resizeObserver.observe(canvas);
  // The document grows and shrinks as sections lay out: keep the depth scale on its real length
  const pageObserver = new ResizeObserver(() => {
    geometry.maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    measureSea();
    lastScroll = NaN;
    schedule();
  });
  pageObserver.observe(document.body);
  window.addEventListener('scroll', schedule, { passive: true });
  window.addEventListener('resize', resize, { passive: true });
  // QA hook, like __ambientWhales: draw a chosen moment now and read the frame back in the same
  // task (the drawing buffer is not preserved), and report what the water is doing
  (window as unknown as { __asciiOcean?: unknown }).__asciiOcean = {
    render: (atTime?: number) => {
      if (atTime !== undefined) time = atTime;
      if (resizePending) applyResize();
      measure();
      const t0 = performance.now();
      applyWaterColor(depthAtScroll(window.scrollY, geometry), depthAtDocument(window.scrollY + 0.8 * geometry.viewHeight, geometry), globeStageFillsScreen(window.scrollY, geometry));
      draw(window.scrollY, window.scrollY + lead);
      gl?.finish();
      return { ms: performance.now() - t0, image: canvas.toDataURL('image/jpeg', 0.85) };
    },
    pause: (paused: boolean) => {
      qaPaused = paused;
    },
    state: () => ({
      time,
      reduce,
      glReady,
      scroll: window.scrollY,
      depth: depthAtScroll(window.scrollY, geometry),
      geometry: { ...geometry },
      canvas: [canvas.width, canvas.height],
      cells: { ...cellGrid }
    })
  };
  if (DEV) {
    // Development only: judge each behaviour of the living ocean on its own
    Object.assign((window as unknown as { __asciiOcean: object }).__asciiOcean, {
      effects: () => ({ ...fx }),
      stats: () => ({ ...stats, lead, inertia: { ...inertia }, wake: { live: wakeLive, bodies: oceanWake.bodies.slice(0, oceanWake.count).map((b) => ({ ...b })) }, sea: { edges: Array.from(sea.edges), count: sea.count } }),
      /** Switch behaviours without reloading: the cell pass is relinked for the new set. */
      set: (next: Partial<OceanEffects>) => {
        Object.assign(fx, next);
        build();
        if (gl && glReady) {
          if (atlas) gl.deleteTexture(atlas.texture);
          atlas = buildAtlas(gl, characters(), FONT);
          allocateWake();
        }
        measureSea();
        lastScroll = NaN;
        schedule();
        return { ...fx };
      },
      /** The glyph index and ink of every cell on screen (rows from the top), and the wake under them. */
      read: () => {
        if (!gl || !glReady) return null;
        const pixels = new Uint8Array(cellGrid.cols * cellGrid.rows * 4);
        gl.bindFramebuffer(gl.FRAMEBUFFER, cellFramebuffer);
        gl.readPixels(0, 0, cellGrid.cols, cellGrid.rows, gl.RGBA, gl.UNSIGNED_BYTE, pixels);
        let moved: Uint8Array | null = null;
        if (fx.wake && wakeFramebuffers[wakeFront]) {
          moved = new Uint8Array(pixels.length);
          gl.bindFramebuffer(gl.FRAMEBUFFER, wakeFramebuffers[wakeFront]);
          gl.readPixels(0, 0, cellGrid.cols, cellGrid.rows, gl.RGBA, gl.UNSIGNED_BYTE, moved);
        }
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        return { cols: cellGrid.cols, rows: cellGrid.rows, cells: pixels, wake: moved, characters: characters() };
      }
    });
  }
  document.addEventListener('visibilitychange', onVisibility);
  motionQuery.addEventListener('change', onMotion);
  resize();

  return {
    destroy: () => {
      disposed = true;
      cancelAnimationFrame(raf);
      resizeObserver.disconnect();
      pageObserver.disconnect();
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', resize);
      document.removeEventListener('visibilitychange', onVisibility);
      motionQuery.removeEventListener('change', onMotion);
      canvas.removeEventListener('webglcontextlost', onContextLost);
      opening?.destroy();
      if (gl) {
        if (atlas) gl.deleteTexture(atlas.texture);
        gl.deleteTexture(cellTexture);
        gl.deleteFramebuffer(cellFramebuffer);
        wakeTextures.forEach((texture) => gl.deleteTexture(texture));
        wakeFramebuffers.forEach((framebuffer) => gl.deleteFramebuffer(framebuffer));
        if (wakeStep) gl.deleteProgram(wakeStep.program);
        gl.deleteVertexArray(vao);
        if (cells) gl.deleteProgram(cells.program);
        if (screen) gl.deleteProgram(screen.program);
      }
      glReady = false;
    }
  };
}
