/**
 * A SEA STATE PER SECTION — the same ocean, in a different mood under each part of the CV.
 *
 * A state is how the currents are drawn (asciiOcean.ts), nothing more: how fine they are, how far
 * they reach sideways, how fast they drift, how much small movement rides on them, how much the
 * slow flow bends them, and whether a second set crosses the first. Colour, ink and how many
 * glyphs there are stay the depth's own (oceanWorld.ts).
 *
 * States belong to the document: each begins where its section begins and gives way to the next
 * over a wide stretch of water, by crossfading the two waters themselves, so there is no line
 * where one becomes the other. Everything above the first section keeps the ocean as it was.
 */
export interface SeaState {
  /** Fineness of the currents (1 as before; above is finer, below is broader). */
  grain: number;
  /** Extra sideways reach on top of the depth's own (long currents above 1, rounder below). */
  reach: number;
  /** Speed of every drift (1 as before). */
  pace: number;
  /** Share of the fine ripple riding on the swell (0.32 as before). */
  ripple: number;
  /** How far the slow flow bends the currents (1.7 as before; high values turn them into eddies). */
  warp: number;
  /** Angle (radians) of a second set of currents crossing the first at the opposite lean; 0 for none. */
  cross: number;
  /** How often a glyph retunes (1 as before). */
  shimmer: number;
  /**
   * How firmly the water keeps its sideways heading against what the currents add (1.7 in open
   * water). Only read where glyphs follow the flow: high, and almost every stroke lies level;
   * low, and the strokes turn with every eddy.
   */
  set: number;
  /**
   * The lines of moving water that travel along the currents where glyphs follow the flow
   * (asciiOcean.ts): how long one line is (1 is about 300 px of stroke), how closely the lines
   * lie (1 is a line every five rows or so) and how fast they travel (1 is about 55 px a second).
   * This is what tells one sea from another at a glance: long slow lines, short quick ones,
   * two sets crossing, lines that curl, lines that barely move.
   */
  run: number;
  lanes: number;
  speed: number;
}

/** The ocean as it has always been: the cover, the Globe's journey and the profile. */
export const SEA_OPEN: SeaState = { grain: 1, reach: 1, pace: 1, ripple: 0.32, warp: 1.7, cross: 0, shimmer: 1, set: 1.7, run: 1, lanes: 1, speed: 1 };

/** By section id. A section without an entry keeps the state of the water above it. */
export const SEA_STATES: Readonly<Record<string, SeaState>> = {
  // Long, gentle currents: unbroken level lines, travelling steadily
  experience: { grain: 0.85, reach: 2.2, pace: 0.8, ripple: 0.2, warp: 1.2, cross: 0, shimmer: 0.8, set: 3, run: 1.9, lanes: 0.9, speed: 0.85 },
  // Finer, more energetic movement: short lines, close together, quick
  skills: { grain: 1.45, reach: 0.85, pace: 1.7, ripple: 0.42, warp: 1.8, cross: 0, shimmer: 1.4, set: 1.5, run: 0.5, lanes: 1.45, speed: 1.9 },
  // Broad, slow-moving swells: few, long, heavy lines, far apart
  education: { grain: 0.55, reach: 1.5, pace: 0.5, ripple: 0.12, warp: 1.1, cross: 0, shimmer: 0.7, set: 2.1, run: 2.6, lanes: 0.55, speed: 0.42 },
  // Softly intersecting currents: two sets of lines crossing
  languages: { grain: 1, reach: 2, pace: 0.85, ripple: 0.2, warp: 0.9, cross: 0.38, shimmer: 0.9, set: 2.4, run: 1.25, lanes: 0.85, speed: 0.75 },
  // Slow organic eddies: the lines curl with the water
  interests: { grain: 0.8, reach: 0.8, pace: 0.6, ripple: 0.2, warp: 3.4, cross: 0, shimmer: 0.8, set: 0.62, run: 0.9, lanes: 0.8, speed: 0.55 },
  // Nearly still water
  contact: { grain: 0.75, reach: 1.4, pace: 0.12, ripple: 0.14, warp: 1.2, cross: 0, shimmer: 0.3, set: 3.2, run: 1.6, lanes: 0.7, speed: 0.07 }
};

/** The most states and meetings the ocean's shader holds (the open water, then six sections). */
export const SEA_MAX_STATES = 7;
export const SEA_MAX_EDGES = SEA_MAX_STATES - 1;
/** A meeting never reaches further than this share of a screen to either side… */
export const SEA_BLEND_SCREEN = 0.34;
/** …nor further than this share of the way to the next meeting, so two never overlap. */
export const SEA_BLEND_GAP = 0.46;

export interface SeaSection {
  id: string;
  /** Top of the section in the document (px). */
  top: number;
}
export interface SeaEdge {
  /** Where the state above meets the state below (px from the top of the document). */
  at: number;
  /** Half the length of water over which they blend (px). */
  half: number;
}
export interface SeaLayout {
  /** states[0] is the open water; states[i + 1] begins at edges[i]. */
  states: SeaState[];
  edges: SeaEdge[];
}

/** The document's sea: one state per section that has one, in page order. */
export function layoutSea(sections: readonly SeaSection[], viewport: number): SeaLayout {
  const placed = sections
    .filter((section) => SEA_STATES[section.id] && Number.isFinite(section.top))
    .sort((a, b) => a.top - b.top)
    .slice(0, SEA_MAX_EDGES);
  const states = [SEA_OPEN, ...placed.map((section) => SEA_STATES[section.id])];
  const edges = placed.map((section, i) => {
    const before = i > 0 ? section.top - placed[i - 1].top : Infinity;
    const after = i < placed.length - 1 ? placed[i + 1].top - section.top : Infinity;
    return { at: section.top, half: Math.max(1, Math.min(SEA_BLEND_SCREEN * viewport, SEA_BLEND_GAP * Math.min(before, after))) };
  });
  return { states, edges };
}

const smoothstep = (a: number, b: number, v: number) => {
  const t = Math.max(0, Math.min(1, (v - a) / (b - a)));
  return t * t * (3 - 2 * t);
};

/**
 * Which two states hold a point of the document, and how far it is from the first to the second.
 * The shader makes the same choice per glyph cell: the nearest meeting decides.
 */
export function seaAt(layout: SeaLayout, y: number): { from: number; to: number; mix: number } {
  if (!layout.edges.length) return { from: 0, to: 0, mix: 0 };
  let nearest = 0;
  for (let i = 1; i < layout.edges.length; i++) {
    if (Math.abs(y - layout.edges[i].at) < Math.abs(y - layout.edges[nearest].at)) nearest = i;
  }
  const edge = layout.edges[nearest];
  return { from: nearest, to: nearest + 1, mix: smoothstep(edge.at - edge.half, edge.at + edge.half, y) };
}

/** The layout as the shader takes it: three vec4 per state, one vec2 per meeting (scaled to device px). */
export function packSea(layout: SeaLayout, ratio: number) {
  const a = new Float32Array(SEA_MAX_STATES * 4);
  const b = new Float32Array(SEA_MAX_STATES * 4);
  const c = new Float32Array(SEA_MAX_STATES * 4);
  const edges = new Float32Array(SEA_MAX_EDGES * 2);
  for (let i = 0; i < SEA_MAX_STATES; i++) {
    const s = layout.states[Math.min(i, layout.states.length - 1)];
    a.set([s.grain, s.reach, s.pace, s.ripple], i * 4);
    b.set([s.warp, s.cross, s.shimmer, s.set], i * 4);
    c.set([s.run, s.lanes, s.speed, 0], i * 4);
  }
  for (let i = 0; i < SEA_MAX_EDGES; i++) {
    const e = layout.edges[i];
    // A meeting that does not exist sits out of reach: nothing is ever nearest to it
    edges.set(e ? [e.at * ratio, e.half * ratio] : [1e9, 1], i * 2);
  }
  return { a, b, c, edges, count: layout.edges.length };
}
