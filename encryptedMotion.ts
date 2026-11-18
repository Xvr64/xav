/** One-way scroll decoding. Completed lines are an absorbing state for this visit. */
export const ENCRYPTED_CHARSET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-={}[];:,.<>/?';
export type EncryptedLineState = {
  revealState: 'hidden' | 'revealing' | 'revealed';
  currentP: number;
};

/** The entrance band follows each rendered line, including lines at the page's bottom. */
export function encryptedEntryProgress(top: number, viewport: number, entryEnd = 0.84): number {
  if (viewport <= 0) return 1;
  return Math.max(0, Math.min(1, (entryEnd + 0.11 - top / viewport) / 0.11));
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
export function encryptedCharacterState(progress: number, index: number, count: number, seed: number): number {
  if (index < Math.floor(progress * count + 1e-9) || progress >= 1) return -1;
  const tick = Math.floor(progress * 32);
  const hash = Math.imul(seed + index + 1, 2654435761) >>> 0;
  return (hash + tick * 17) % ENCRYPTED_CHARSET.length;
}
