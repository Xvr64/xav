/**
 * Shared direction of the ocean layers: where the whales swim, which zones of the screen hold
 * reading text, and where the cover's typography and the migration runway sit. Written by the
 * page's conductors (cover, sections, fluid) and read every frame by the whale canvas.
 */
import type { HeroRect } from './heroCurrent';

/** Whale tile strength in open water, beside a line of text, and right behind it (or behind the
 * Globe): low enough behind the copy that a passing whale never competes with a line it crosses. */
export const READING_WHALE_ALPHA = [1, 0.5, 0.16];
/** Viewport line boxes of the page's reading text, shared by the fluid clear map and the whales. */
export const readingZones: { read: () => readonly { left: number; top: number; width: number; height: number }[] } = {
  read: () => []
};

/**
 * Composed stretches of the page (the cover and the introduction) place the whales instead of
 * letting them roam: one lane per whale in viewport fractions, blended in by `weight`, and a
 * surface they stay below. Written by the cover's conductor, read by the whale loop.
 */
export const whaleDirection = {
  weight: 0,
  /** How present the ambient whales are (1 = fully): they give way while the 3D whales of the
   * convergence swim and are the Earth, and return after the journey. */
  presence: 1,
  /** Drawn size of the whales (1 = their own): below 1 while they dive into the Globe. */
  size: 1,
  surfaceY: -Infinity,
  // The cover's arrival lanes (LANES_SURFACE), so the very first frame is already composed
  lanes: [
    { x: 0.74, y: 0.82 },
    { x: 0.26, y: 0.2 }
  ]
};

/**
 * Each composed stretch publishes how strongly it holds the whales and where. The strongest
 * stretch sets the weight; the lanes blend by weight, so hand-overs between stretches stay
 * continuous.
 */
export const whaleStretches = new Map<string, { weight: number; lanes: readonly Lane[] }>();
export const directWhales = (id: string, weight: number, lanes: readonly Lane[]) => {
  whaleStretches.set(id, { weight, lanes: lanes.map((l) => ({ ...l })) });
  let strongest = 0;
  let total = 0;
  const x = [0, 0];
  const y = [0, 0];
  for (const s of whaleStretches.values()) {
    if (s.weight <= 0) continue;
    strongest = Math.max(strongest, s.weight);
    total += s.weight;
    for (let i = 0; i < 2; i++) {
      x[i] += s.lanes[i].x * s.weight;
      y[i] += s.lanes[i].y * s.weight;
    }
  }
  whaleDirection.weight = strongest;
  if (total <= 0) return;
  for (let i = 0; i < 2; i++) {
    whaleDirection.lanes[i].x = x[i] / total;
    whaleDirection.lanes[i].y = y[i] / total;
  }
};

/**
 * The migration runway's place in the document (MigrationRunway measures it on layout changes).
 * Its scroll interval is the migration's only clock: p runs 0 → 1 from the moment the runway
 * enters the viewport until its end reaches the bottom; the handoff follows over one viewport.
 */
export const migrationRunway = { top: 0, height: 0 };

export function smoothStepRange(value: number, start: number, end: number): number {
  if (end <= start) return value >= end ? 1 : 0;
  const t = Math.max(0, Math.min(1, (value - start) / (end - start)));
  return t * t * (3 - 2 * t);
}

/** Calm zones of the hero typography (viewport px), read by the fluid clear map and the whales. */
export const heroZone: { rects: HeroRect[]; version: number } = { rects: [], version: 0 };

/** Calm zones of the Globe stage while it is on screen (viewport px): the disc and the city
 * caption. The fluid quiets there and the whales and jellyfish draw faintly behind them. */
export const globeZone: {
  rects: HeroRect[];
  version: number;
  /** Where the journey's first city sits on screen while it faces the viewer (viewport px). */
  origin: { x: number; y: number } | null;
} = { rects: [], version: 0, origin: null };
export const setGlobeZone = (rects: HeroRect[], origin: { x: number; y: number } | null = null) => {
  globeZone.origin = origin;
  if (rects.length === 0 && globeZone.rects.length === 0) return;
  globeZone.rects = rects;
  globeZone.version++;
  // A zone can clear in an IntersectionObserver after the scroll frame. Wake a held/reduced
  // whale frame too, so a stale Globe mask never leaves ambient animals almost invisible.
  whaleStage.refresh?.();
};

/** The dive's wake as the Globe should land it: the lead whale's latest wake point (viewport px)
 * how strongly it shows (0 none … 1 full) and how far toward the first city it has drawn (0 … 1). Written by the whale loop, read by the Globe. */
export const diveWake = { x: 0, y: 0, strength: 0, reach: 0 };

/**
 * The convergence (two 3D whales becoming the Earth) plays in the first part of the Globe's
 * pinned runway. JourneyGlobe measures it: p runs 0 → 1 as the page scrolls from `start` over
 * `length` px, and the journey's own progress begins where it ends. `ready` is set once the 3D
 * layer can draw; until then (or without WebGL2) the Globe shows itself throughout.
 */
export const convergence = {
  start: Infinity,
  length: 0,
  ready: false,
  /** Called when readiness or geometry changes, so the Globe redraws its reveal. */
  listeners: new Set<() => void>()
};
export const convergenceProgress = (scrollY: number) =>
  convergence.length > 0 ? Math.max(0, Math.min(1, (scrollY - convergence.start) / convergence.length)) : 1;

/** The cinematic stage borrows the ambient renderer's canvas and the very same two meshes. */
export const whaleStage: {
  host: HTMLElement | null;
  firstCity: { lon: number; lat: number } | null;
  refresh: (() => void) | null;
} = { host: null, firstCity: null, refresh: null };

/** Projected 3D spine for the existing ocean's feeding/sonar effects. No second whale simulation. */
export const ambientWhalesLive = {
  active: true,
  presence: 0,
  spines: [new Float32Array(96), new Float32Array(96)]
};
/** How visible the Globe's own canvas and caption are (it takes over from the convergence's Earth). */
export const globeRevealAt = (p: number) => {
  if (!convergence.ready || convergence.length <= 0) return 1;
  const t = Math.max(0, Math.min(1, (p - 0.955) / (0.985 - 0.955)));
  return t * t * (3 - 2 * t);
};

export type Lane = { x: number; y: number };
export const mixLane = (a: Lane, b: Lane, t: number): Lane => ({ x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t });
