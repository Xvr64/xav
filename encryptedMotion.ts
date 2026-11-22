/** One-way scroll decoding. Completed lines are an absorbing state for this visit.
 * Uses strictly narrow/medium advance-width oceanic characters so proportional Newsreader and
 * Instrument Sans cells never suffer wide-glyph (M, W, @, %) horizontal collisions. */
export const ENCRYPTED_CHARSET = '·:-~/\\|+*=;_';
export const ENCRYPTED_ENTRY_START = 0.95;
export const ENCRYPTED_ENTRY_END = 0.62;
export type EncryptedLineState = {
  revealState: 'hidden' | 'revealing' | 'revealed';
  currentP: number;
};

/** The entrance band follows each rendered line, including lines at the page's bottom. */
export function encryptedEntryProgress(top: number, viewport: number, entryEnd = ENCRYPTED_ENTRY_END): number {
  if (viewport <= 0) return 1;
  // Adjusted bottom-of-page bands can extend below the viewport. Do no character
  // work there; a fast jump still resolves the line as soon as it passes into view.
  if (top >= viewport) return 0;
  if (top / viewport <= entryEnd) return 1;
  const length = ENCRYPTED_ENTRY_START - ENCRYPTED_ENTRY_END;
  return Math.max(0, Math.min(1, (entryEnd + length - top / viewport) / length));
}

export function advanceEncryptedLine(
  previous: EncryptedLineState,
  zoneProgress: number,
  scrollDelta: number,
  reduced = false
): EncryptedLineState {
  if (previous.revealState === 'revealed') return previous;
  // Reverse gestures settle an interrupted entrance immediately, without playing a decode.
  // This also handles an upward first visit after a jump or restored scroll position.
  if (reduced || zoneProgress >= 1 || (scrollDelta < 0 && (previous.currentP > 0 || zoneProgress > 0))) {
    return { revealState: 'revealed', currentP: 1 };
  }
  if (scrollDelta <= 0 || zoneProgress <= previous.currentP) return previous;
  // Quantization bounds DOM updates; elapsed time and paragraph length never delay reading.
  const currentP = Math.max(previous.currentP, Math.floor(zoneProgress * 64) / 64);
  return { revealState: currentP > 0 ? 'revealing' : 'hidden', currentP };
}

/** -1 is a locked real character; the unresolved suffix changes only with scroll progress. */
export function encryptedCharacterState(progress: number, index: number, count: number, seed: number, ticks = 32): number {
  if (index < Math.floor(progress * count + 1e-9) || progress >= 1) return -1;
  const tick = Math.floor(progress * ticks);
  const hash = Math.imul(seed + index + 1, 2654435761) >>> 0;
  return (hash + tick * 17) % ENCRYPTED_CHARSET.length;
}
