/**
 * THE CV'S CHAPTERS — one list, read by everything that counts or names them: the depth gauge
 * (DepthGauge.tsx), the small-screen index (SectionIndex.tsx) and the chapter marks set above
 * each section title. Seven chapters after seven cities: the marks use the Globe caption's own
 * "03 / 07" form, so the count that paced the journey goes on pacing the CV.
 */
export const CV_SECTIONS = [
  { id: 'introduction', label: 'Profile' },
  { id: 'experience', label: 'Experience' },
  { id: 'skills', label: 'Skills' },
  { id: 'education', label: 'Education' },
  { id: 'languages', label: 'Languages' },
  { id: 'interests', label: 'Interests' },
  { id: 'contact', label: 'Contact' }
] as const;

export type CvSectionId = (typeof CV_SECTIONS)[number]['id'];

const two = (n: number) => String(n).padStart(2, '0');

/** "02" for the second chapter; empty for an id that is not a chapter. */
export function sectionNumber(id: string): string {
  const index = CV_SECTIONS.findIndex((section) => section.id === id);
  return index < 0 ? '' : two(index + 1);
}

/**
 * A chapter's place as two lengths: the chapters reached (this one included) and those still
 * ahead. The chapter line (ChapterLine.tsx) draws them as water travelled and water to come;
 * null for an id that is not a chapter.
 */
export function chapterShare(id: string): { reached: number; ahead: number } | null {
  const index = CV_SECTIONS.findIndex((section) => section.id === id);
  return index < 0 ? null : { reached: index + 1, ahead: CV_SECTIONS.length - index - 1 };
}

/** "02 / 07": where a chapter stands in the CV; empty for an id that is not a chapter. */
export function sectionMark(id: string): string {
  const number = sectionNumber(id);
  return number ? `${number} / ${two(CV_SECTIONS.length)}` : '';
}
