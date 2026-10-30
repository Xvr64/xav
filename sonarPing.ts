/**
 * Sonar: a click in open water sends one ring of glyphs outward through the ocean; creatures it
 * reaches (the whales, the jellyfish) send back a brief echo where they are. Pure timing here;
 * the whale canvas draws it (AsciiWhaleBackground.tsx) inside its own loop.
 */

/** Seconds the ring travels, and how far (px) it reaches. */
export const PING_SECONDS = 1.9;
export const PING_REACH = 560;
/** Seconds an echo lingers after the ring passes a creature. */
export const ECHO_SECONDS = 0.9;
/** Pings alive at once; older ones are dropped. */
export const MAX_PINGS = 3;

/** Ring radius at age t (s): fast at first, slowing as it spreads, like a pressure wave. */
export function pingRadius(t: number): number {
  const k = Math.max(0, Math.min(1, t / PING_SECONDS));
  return PING_REACH * (1 - Math.pow(1 - k, 2.4));
}

/** Ring strength at age t (s): a quick swell, then a long fade as it spreads thin. */
export function pingStrength(t: number): number {
  if (t <= 0 || t >= PING_SECONDS) return 0;
  const k = t / PING_SECONDS;
  return Math.min(1, k / 0.06) * Math.pow(1 - k, 1.6);
}

/** Echo strength `since` seconds after the ring reached the creature. */
export function echoStrength(since: number): number {
  if (since < 0 || since >= ECHO_SECONDS) return 0;
  const k = since / ECHO_SECONDS;
  return Math.min(1, k / 0.12) * (1 - k) * (1 - k);
}

/** When (s after the click) the ring reaches something `distance` px away; Infinity if never. */
export function arrivalTime(distance: number): number {
  if (distance > PING_REACH) return Infinity;
  const k = 1 - Math.pow(1 - distance / PING_REACH, 1 / 2.4);
  return k * PING_SECONDS;
}

/** Clicks that should not ping: controls, the dialog, and the end of a text selection. */
export function isOpenWaterClick(target: EventTarget | null, selection: string): boolean {
  if (selection.trim().length > 0) return false;
  if (typeof Element === 'undefined' || !(target instanceof Element)) return true;
  return !target.closest('a, button, input, textarea, select, summary, label, [role="dialog"], [contenteditable]');
}
