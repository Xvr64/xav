/** Aceternity-style letter locking, driven by the portfolio's reversible scroll lifecycle. */
export const ENCRYPTED_CHARSET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-={}[];:,.<>/?';
export const REVEAL_DELAY_MS = 50;
/**
 * The longest any one rendered line takes to resolve. Short labels keep the letter-by-letter lock
 * (50 ms a character); a full line of copy, which at that pace stayed scrambled for 2–4 seconds
 * after it had scrolled into the reading zone, sweeps through in the same time as a 12-letter word.
 * The effect is the same wave; the page is simply never waited on.
 */
export const LINE_REVEAL_MAX_MS = 600;
/** How long a line of `characterCount` characters takes to resolve once it starts. */
export const lineRevealMs = (characterCount: number) =>
  Math.min(LINE_REVEAL_MAX_MS, Math.max(REVEAL_DELAY_MS, characterCount * REVEAL_DELAY_MS));
export const FLIP_DELAY_MS = 50;

export type EncryptedLineState = {
  revealState: 'hidden' | 'revealing' | 'revealed' | 'exiting';
  currentP: number;
};

export function advanceEncryptedLine(
  previous: EncryptedLineState,
  zoneProgress: number,
  belowEntry: boolean,
  aboveExit: boolean,
  inTopZone: boolean,
  scrollDelta: number,
  elapsedMs: number,
  characterCount: number,
  reduced: boolean,
  entranceOnly = true,
  /** How long this line takes to arrive; by default the letter-lock's own pace. */
  durationMs: number = lineRevealMs(characterCount)
): EncryptedLineState {
  if (reduced) return { revealState: 'revealed', currentP: 1 };
  if (entranceOnly) {
    // Once read, never erase on exit/reverse. Fast jumps past a line resolve it too.
    if (previous.revealState === 'revealed' || inTopZone || aboveExit)
      return { revealState: 'revealed', currentP: 1 };
    if (belowEntry) return { revealState: 'hidden', currentP: 0 };
    if (previous.revealState === 'hidden') return { revealState: 'revealing', currentP: 0 };
    const progress = previous.currentP + Math.max(0, elapsedMs) / Math.max(1, durationMs);
    const currentP = progress >= 1 - 1e-9 ? 1 : progress;
    return { revealState: currentP === 1 ? 'revealed' : 'revealing', currentP };
  }
  if (belowEntry || aboveExit) return { revealState: 'hidden', currentP: 0 };
  if (inTopZone) return { revealState: 'exiting', currentP: zoneProgress };
  // Reverse the lower entrance when scrolling upwards; do not restart a timer while paused.
  if (zoneProgress < 1 && (scrollDelta < 0 || (scrollDelta === 0 && previous.revealState === 'exiting'))) {
    return { revealState: 'exiting', currentP: Math.min(previous.currentP, zoneProgress) };
  }
  if (previous.revealState === 'hidden') return { revealState: 'revealing', currentP: 0 };
  const progress = previous.currentP + Math.max(0, elapsedMs) / Math.max(1, durationMs);
  const currentP = progress >= 1 - 1e-9 ? 1 : progress;
  return { revealState: currentP === 1 ? 'revealed' : 'revealing', currentP };
}

/** -1 is a locked real character; all other values index the encrypted alphabet. */
export function encryptedCharacterState(progress: number, index: number, count: number, now: number, seed: number): number {
  if (index < Math.floor(progress * count + 1e-9) || progress >= 1) return -1;
  const tick = Math.floor(now / FLIP_DELAY_MS);
  const hash = Math.imul(seed + index + 1, 2654435761) >>> 0;
  return (hash + tick * 17) % ENCRYPTED_CHARSET.length;
}
