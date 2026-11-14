/**
 * Shared direction of the ocean layers: where the whales swim, which zones of the screen hold
 * reading text, and where the cover's typography and the migration runway sit. Written by the
 * page's conductors (cover, sections, fluid) and read every frame by the whale canvas.
 */
import type { HeroRect } from './heroCurrent';

/** Whale tile strength in open water, beside a line of text, and right behind it (or behind the
 * Globe): low enough behind the copy that a passing whale never competes with a line it crosses. */
export const READING_WHALE_ALPHA = [1, 0.5, 0.16];
/**
 * How far the whales step back while a section holds them in the deep water. On the pale surface
 * they are engraved in a blue close to the water's own and sit quietly behind the type; on the
 * abyss the same engraving turns to pale sea-glass on near-black, the strongest contrast on the
 * page, and a whale the height of the screen outshouts the CV it swims beside. So their strength
 * eases down with the water's darkness (`ink`, 0 surface .. 1 abyss) for as long as a composed
 * stretch holds them (`weight`), and is whole again in open water. 0 restores the old look.
 */
export const DEEP_READING_RECESSION = 0.22;
export const whaleStrength = (weight: number, ink: number): number =>
  1 - (0.06 + DEEP_READING_RECESSION * Math.max(0, Math.min(1, ink))) * Math.max(0, Math.min(1, weight));

/** Viewport line boxes of the page's reading text, shared by the fluid clear map and the whales. */
export const readingZones: { read: () => readonly { left: number; top: number; width: number; height: number; field?: boolean }[] } = {
  read: () => []
};

/**
 * Composed stretches of the page (the cover and the introduction) place the whales instead of
 * letting them roam: one lane per whale in viewport fractions, blended in by `weight`, and a
 * surface they stay below. Written by the cover's conductor, read by the whale loop.
 */
export const whaleDirection = {
  weight: 0,
  /** How present the ambient whales are (1 = fully): they give way as the Globe's runway rises
   * and return after the journey. */
  presence: 1,
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
} = { rects: [], version: 0 };
export const setGlobeZone = (rects: HeroRect[]) => {
  if (rects.length === 0 && globeZone.rects.length === 0) return;
  globeZone.rects = rects;
  globeZone.version++;
  // A zone can clear in an IntersectionObserver after the scroll frame. Wake a held/reduced
  // whale frame too, so a stale Globe mask never leaves ambient animals almost invisible.
  whaleStage.refresh?.();
};

/** Copy that stands outside the page's flow (the depth gauge, the corner controls): viewport
 * boxes the whales thin behind, like the reading text. Written through publishFixedCopy. */
export const fixedCopy: { rects: HeroRect[]; version: number } = { rects: [], version: 0 };

/** Wakes the whales' frame loop when something it waits on changes outside of a scroll. */
export const whaleStage: { refresh: (() => void) | null } = { refresh: null };

/**
 * Each piece of fixed copy publishes its own boxes under its own name, so one never erases
 * another's. An empty list withdraws that piece; nothing changes when there was nothing to
 * withdraw, so the whales are only woken for a real change.
 */
const fixedCopySources = new Map<string, HeroRect[]>();
export function publishFixedCopy(id: string, rects: readonly HeroRect[]): void {
  if (rects.length) fixedCopySources.set(id, rects.map((r) => ({ ...r })));
  else if (!fixedCopySources.delete(id)) return;
  fixedCopy.rects = Array.from(fixedCopySources.values()).flat();
  fixedCopy.version++;
  whaleStage.refresh?.();
}

/** Projected 3D spine for the existing ocean's feeding/sonar effects. No second whale simulation. */
export const ambientWhalesLive = {
  active: true,
  presence: 0,
  spines: [new Float32Array(96), new Float32Array(96)]
};
export type Lane = { x: number; y: number };
export const mixLane = (a: Lane, b: Lane, t: number): Lane => ({ x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t });
