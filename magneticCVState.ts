/** The magnetic CV preview is a development-only experiment, like the other URL flags
 * (portfolioExperiments.ts): production builds never enable it, whatever the query string. */
export function parseMagneticCV(search: string, development: boolean) {
  return development && new URLSearchParams(search).get('magneticCV') === '1';
}

/** Shared by the existing ocean and editorial renderers only during the local CV preview. */
export const magneticCV = typeof location !== 'undefined'
  && parseMagneticCV(location.search, !!(import.meta as { env?: { DEV?: boolean } }).env?.DEV);

/** The chapters the preview isolates, in reading order. */
export const MAGNETIC_CHAPTERS = '#introduction, .cv-arch > section';

export const passage = {
  destination: null as HTMLElement | null,
  direction: 1,
  progress: 0,
  requestDecode: null as (() => void) | null
};

export function easedPhase(t: number, start: number, end: number) {
  const p = Math.max(0, Math.min(1, (t - start) / (end - start)));
  return p * p * (3 - 2 * p);
}

/** Breathing room kept beneath a long chapter's last line when its reading edge is reached (px). */
export const READING_BREATH = 16;
/** Overflow shorter than this is padding, not reading: the chapter is treated as one screen (px). */
export const READING_SLACK = 24;

/** The scroll position at which a chapter's last line has been read (document px). A chapter
 * that fits the screen ends where it starts; a longer one ends once its content (not its bottom
 * padding) has risen past the viewport's foot, so a few pixels of padding never cost a gesture. */
export function readingEnd(top: number, bottom: number, paddingBottom: number, viewport: number) {
  const content = Math.min(bottom, bottom - paddingBottom + READING_BREATH);
  const end = Math.round(content - viewport);
  return end - top < READING_SLACK ? top : end;
}

/** One chapter's reading span in document coordinates. Both the scroll controller and the
 * decoder read it, so the lines resting at a chapter's edge are exactly the ones decoded. */
export function chapterBounds(el: HTMLElement, y = scrollY, viewport = innerHeight) {
  const r = el.getBoundingClientRect();
  const top = Math.round(r.top + y);
  const pad = parseFloat(getComputedStyle(el).paddingBottom) || 0;
  return { top, end: readingEnd(top, r.bottom + y, pad, viewport) };
}
