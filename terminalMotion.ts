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
 * Where a line's entry decode must finish (viewport fraction). Normally the reading zone's lower
 * edge; but a line near the end of the page may never scroll that high (`lowestTop` is its top
 * at maximum scroll), so its entry zone slides down to finish just before the page stops.
 */
export function entryEndFor(lowestTop: number, viewport: number): number {
  if (viewport <= 0) return VIEWPORT_ZONES.ENTRY_END;
  return Math.max(VIEWPORT_ZONES.ENTRY_END, lowestTop / viewport + 0.03);
}

/**
 * Zone progress of one rendered line from its top edge: 0 invisible → 1 readable. The whole
 * line shares this value; each character derives its own progress from it (`charProgress`).
 */
export function lineProgress(top: number, viewport: number, entryEnd: number = VIEWPORT_ZONES.ENTRY_END): number {
  if (viewport <= 0) return 1;
  const y = top / viewport;
  const entryLength = VIEWPORT_ZONES.ENTRY_START - VIEWPORT_ZONES.ENTRY_END;
  const enter = clamp01((entryEnd + entryLength - y) / entryLength);
  const exit = clamp01((y - VIEWPORT_ZONES.EXIT_END) / (VIEWPORT_ZONES.EXIT_START - VIEWPORT_ZONES.EXIT_END));
  return Math.min(enter, exit);
}

/** A character's own progress at which its real letter locks in. */
export const LOCK_AT = 0.62;
/**
 * Width of the decoding wave. Each character runs its whole decode over 1 / (1 + DECODE_WAVE) of
 * the line's zone progress, and the start times spread over the rest, so neighbours overlap
 * while the far edge of a line is still scrambled: a narrow band travelling across the line.
 */
export const DECODE_WAVE = 2.4;
/** Distinct ASCII states a character passes through before it locks (state 0 waits ahead of the wave). */
export const GLYPH_STATES = 7;
/** Character state meaning "the real letter". */
export const RESOLVED = -1;

/**
 * One character's progress. `lineP` is its line's zone progress and `t` the character's 0..1
 * horizontal position across its text block. Entering, the wave runs left → right; leaving it
 * runs left → right too, so the left edge dissolves first. Pure: the same scroll position always
 * gives the same state, so reversing the scroll reverses the wave.
 */
export function charProgress(lineP: number, t: number, entering: boolean, wave = DECODE_WAVE): number {
  const offset = entering ? clamp01(t) : 1 - clamp01(t);
  return clamp01(lineP * (1 + wave) - wave * offset);
}

/** Letters and digits decode; spaces and punctuation keep the text's structure as they are. */
export const isDecodable = (char: string) => /[\p{L}\p{N}]/u.test(char);

/** RESOLVED once locked, otherwise which of the GLYPH_STATES the character is showing. */
export function charState(c: number): number {
  if (c >= LOCK_AT) return RESOLVED;
  return Math.min(GLYPH_STATES - 1, Math.floor((c / LOCK_AT) * GLYPH_STATES));
}

/**
 * The ASCII glyph a character shows in a given state. Seeded per character, and consecutive
 * states always differ (a step of 7 is coprime with the 23 glyphs), so each letter visibly
 * steps through a fixed sequence of symbols rather than flickering at random.
 */
export function charGlyph(state: number, seed: number): string {
  const hash = ((seed + 1) * 2654435761) >>> 0;
  return ASCII_GLYPHS[(hash + state * 7) % ASCII_GLYPHS.length];
}

/**
 * Opacity of one character. A line fades in as a faint field of scrambled glyphs (the text's
 * full structure is there before any letter resolves); each glyph brightens as the wave reaches
 * it and is at full ink by the time its letter locks.
 */
export function charOpacity(lineP: number, c: number): number {
  if (lineP <= 0) return 0;
  const presence = clamp01(lineP / 0.12);
  return presence * (0.3 + 0.7 * clamp01(c / LOCK_AT));
}

/**
 * Decode a string laid out on one line (`charOffset` characters in, `lineChars` long) into the
 * text it shows at `lineP`. The controller works per character in the DOM; this is the same
 * mapping as a string, for tests and for reasoning about the sequence.
 */
export function decodeChars(
  word: string,
  charOffset: number,
  lineChars: number,
  lineP: number,
  entering: boolean,
  seed: number
): string {
  const span = Math.max(1, lineChars - 1);
  return Array.from(word)
    .map((char, index) => {
      if (!isDecodable(char)) return char;
      const state = charState(charProgress(lineP, (charOffset + index) / span, entering));
      return state === RESOLVED ? char : charGlyph(state, seed + charOffset + index);
    })
    .join('');
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
