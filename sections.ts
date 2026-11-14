/**
 * THE CV'S CHAPTERS — one list, in reading order, read by the depth gauge (DepthGauge.tsx):
 * one tick per chapter.
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
