/** Pure scroll mappings: the same position always produces the same glyphs. */
export const ASCII_GLYPHS = '0123456789#%&@/\\|+-=*:' + ';';
export const clamp01 = (value: number) => Math.max(0, Math.min(1, value));
export const progressBetween = (position: number, start: number, length: number) =>
  clamp01((position - start) / Math.max(1, length));

/** Actual rendered line geometry, independent of its paragraph or section. */
export function lineProgress(top: number, height: number, viewport: number) {
  const edge = Math.min(84, viewport * 0.1);
  const exit = clamp01((top + height) / (edge + height));
  const enter = clamp01((viewport - top) / edge);
  return Math.min(enter, exit);
}

export function decodeWord(word: string, progress: number, seed: number) {
  if (progress >= 1) return word;
  if (progress <= 0) return '\u00a0'.repeat(Array.from(word).length);
  // Quantized scroll bands, no timers, random state, or direction-dependent history.
  const band = Math.floor(progress * 18);
  return Array.from(word).map((character, index) => {
    const hash = ((seed + 1) * 131 + index * 73) >>> 0;
    const threshold = 0.24 + (hash % 67) / 100;
    if (progress >= threshold) return character;
    return ASCII_GLYPHS[(hash + band * 7) % ASCII_GLYPHS.length];
  }).join('');
}

/** White until the globe starts; black after its complete scroll sequence. */
export function waterShade(y: number, start: number, travel: number, viewport: number) {
  if (!Number.isFinite(start) || y <= start) return 255;
  const progress = progressBetween(y, start, travel);
  return Math.round(255 * (1 - progress ** 1.5));
}
