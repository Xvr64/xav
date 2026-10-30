/** Pure scroll mappings: the same position always produces the same glyphs. */
export const ASCII_GLYPHS = '0123456789#%&@/\\|+-=*:' + ';';
export const clamp01 = (value: number) => Math.max(0, Math.min(1, value));
export const progressBetween = (position: number, start: number, length: number) =>
  clamp01((position - start) / Math.max(1, length));

/**
 * Refined Viewport Zones (Expanded Central Reading Zone):
 * 0–10% from top: invisible (p = 0, opacity = 0)
 * 10–22%: outgoing ASCII scramble (transition zone)
 * 22–78%: fully readable, stable text (56% of viewport, 100% stable reading area)
 * 78–90%: incoming ASCII decoding (transition zone)
 * 90–100%: invisible (p = 0, opacity = 0)
 */
export const VIEWPORT_ZONES = {
  EXIT_END: 0.10,       // 10% from top (invisible / fully scrambled off)
  EXIT_START: 0.22,     // 22% from top (outgoing scramble begins)
  READING_TOP: 0.22,    // 22% from top
  READING_BOTTOM: 0.78, // 78% from top
  ENTRY_END: 0.78,      // 78% from top (fully stable & readable)
  ENTRY_START: 0.90     // 90% from top (incoming decode begins)
} as const;

/**
 * Individual word progress based on vertical position in viewport.
 * Uses a very subtle left-to-right stagger so words in a sentence
 * resolve almost together and remain effortless to read naturally.
 */
export function wordProgress(
  top: number,
  height: number,
  viewport: number,
  wordIndexInLine = 0,
  totalWordsInLine = 1
): number {
  if (viewport <= 0) return 1;
  const y = top / viewport;

  // Very subtle stagger: max 0.018 across the entire line (~15px scroll)
  // Ensures words resolve almost together so sentences read naturally
  const maxLineStagger = 0.018;
  const step = totalWordsInLine > 1 ? Math.min(0.004, maxLineStagger / (totalWordsInLine - 1)) : 0;
  const stagger = wordIndexInLine * step;

  // Entry zone: 90% down to 78%
  // Progress goes from 0 (at 0.90 - stagger) to 1 (at 0.78 - stagger)
  const entryStart = VIEWPORT_ZONES.ENTRY_START - stagger;
  const entryEnd = VIEWPORT_ZONES.ENTRY_END - stagger;
  const enter = clamp01((entryStart - y) / (entryStart - entryEnd));

  // Exit zone: 22% down to 10%
  // Progress goes from 1 (at 0.22 - stagger) down to 0 (at 0.10 - stagger)
  const exitStart = VIEWPORT_ZONES.EXIT_START - stagger;
  const exitEnd = VIEWPORT_ZONES.EXIT_END - stagger;
  const exit = clamp01((y - exitEnd) / (exitStart - exitEnd));

  return Math.min(enter, exit);
}

/**
 * Line-level compatibility function.
 */
export function lineProgress(top: number, height: number, viewport: number) {
  return wordProgress(top, height, viewport, 0, 1);
}

/**
 * Restrained opacity progression:
 * - Starts with subtle, low-opacity scrambled characters (~0.28)
 * - Smoothly ramps to full opacity (1.0) as real letters resolve by progress ~0.70
 * - Remains 1.0 throughout the central reading zone and fully resolved text
 * - Reverses smoothly during exit so outgoing glyphs fade gracefully
 */
export function wordOpacity(progress: number): number {
  if (progress <= 0) return 0;
  if (progress >= 0.70) return 1;
  // Subtle entry: starts at 0.28 and smoothly climbs to 1.0 by progress 0.70
  return 0.28 + 0.72 * clamp01(progress / 0.70);
}

/**
 * Progressive character-by-character decoding:
 * - 14 meaningful intermediate scroll bands (calm, restrained, no harsh flicker)
 * - Begins revealing correct characters early (~0.16)
 * - Resolves most characters by approximately 50%
 * - Fully resolves all characters by 70%
 * - Completely normal, stable, original text for the remaining transition and central zone
 */
export function decodeWord(word: string, progress: number, seed: number) {
  // Fully resolve early (by 70%) so the word is completely readable well before the center
  if (progress >= 0.70) return word;

  const chars = Array.from(word);
  const len = chars.length;
  if (progress <= 0 || len === 0) return '\u00a0'.repeat(len);

  // 14 scroll bands for calm, deliberate intermediate states without visual noise
  const band = Math.floor(progress * 14);

  return chars.map((char, index) => {
    // Preserve whitespace
    if (/^\s$/.test(char)) return char;

    // Deterministic rank for organic letter locking
    // Letters lock in smoothly between progress 0.16 and 0.68
    const hash = (((seed + 1) * 2654435761 ^ (index * 2246822519)) >>> 0);
    const rank = (index * 7 + (seed % 11)) % len;
    const threshold = 0.16 + 0.50 * ((rank + 0.5) / len);

    // If progress has reached this character's threshold, lock in the real character
    if (progress >= threshold) return char;

    // Otherwise, cycle through restrained ASCII glyphs
    const glyphIndex = (hash + band * 5 + index * 3) % ASCII_GLYPHS.length;
    return ASCII_GLYPHS[glyphIndex];
  }).join('');
}

/** White until the globe starts; black after its complete scroll sequence. */
export function waterShade(y: number, start: number, travel: number, viewport: number) {
  if (!Number.isFinite(start) || y <= start) return 255;
  const progress = progressBetween(y, start, travel);
  return Math.round(255 * (1 - progress ** 1.5));
}

const smoothRange = (value: number, start: number, end: number) => {
  const t = clamp01((value - start) / (end - start));
  return t * t * (3 - 2 * t);
};

/** Radians the forming planet still turns before it settles on the first city. */
export const ORBIT_SPIN = 1.15;

/**
 * The whale-to-globe prelude as a pure function of its own scroll progress t ∈ [0, 1]:
 * converge (0–20%), orbit (20–45%), sphere (45–70%), planet (70–90%), handoff (90–100%).
 * Both canvases read the same stages, so stopping anywhere holds one exact state and
 * scrolling back plays the same states in reverse.
 */
export function orbitStages(t: number) {
  const p = clamp01(t);
  return {
    /** The whales leave their own swim for the deterministic orbit. */
    converge: smoothRange(p, 0, 0.2),
    /** Orbit radius in planet radii: a wide approach that tightens onto the surface. */
    radius: 1.6 - 0.54 * smoothRange(p, 0.05, 0.62),
    /** Trails left by the orbit, the first arcs of the sphere. */
    trails: smoothRange(p, 0.22, 0.42),
    /** ASCII lattice (limb, longitude and latitude arcs). */
    sphere: smoothRange(p, 0.42, 0.66),
    /** ASCII land, the first geography. */
    land: smoothRange(p, 0.56, 0.8),
    /** The whales dissolve into the character field, tail first. */
    dissolve: smoothRange(p, 0.64, 0.88),
    /** The ASCII sphere hands its place to the drawn globe. */
    ascii: 1 - smoothRange(p, 0.84, 0.99),
    globeGrid: smoothRange(p, 0.7, 0.9),
    globeLand: smoothRange(p, 0.74, 0.94),
    globeDisc: smoothRange(p, 0.76, 0.96),
    globeMarks: smoothRange(p, 0.9, 1),
    caption: smoothRange(p, 0.93, 1),
    /** Remaining planet rotation (radians about the polar axis); eases to rest at t = 1. */
    spin: ORBIT_SPIN * (1 - smoothRange(p, 0.3, 1))
  };
}
