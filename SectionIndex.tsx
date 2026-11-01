import React from 'react';
import { DecodeSoundToggle } from './TerminalEditorial';

export const SECTION_INDEX = [
  { id: 'introduction', label: 'Profile' },
  { id: 'experience', label: 'Experience' },
  { id: 'skills', label: 'Skills' },
  { id: 'education', label: 'Education' },
  { id: 'languages', label: 'Languages' },
  { id: 'contact', label: 'Contact' }
] as const;

/**
 * Top fixed controls: sound on/off + CV link, persistent across the entirety of the portfolio.
 */
export const SectionIndex: React.FC<{ cvUrl: string }> = ({ cvUrl }) => {
  return (
    <aside className="fixed-top-controls" aria-label="Site actions">
      <DecodeSoundToggle />
      <a
        href={cvUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed-cv-link meta"
      >
        CV <span aria-hidden="true">↗</span>
        <span className="sr-only"> (PDF, opens in a new tab)</span>
      </a>
    </aside>
  );
};
