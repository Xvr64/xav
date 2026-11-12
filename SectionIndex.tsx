import React, { useEffect, useRef } from 'react';
import { DecodeSoundToggle } from './TerminalEditorial';
import { publishFixedCopy } from './oceanDirection';

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
 * They are copy like any other: each control publishes its box so the whales thin behind it
 * (the reading veil), instead of a fluke or a flank running through the two labels. Measured on
 * layout changes only; the controls never move with the scroll.
 */
export const SectionIndex: React.FC<{ cvUrl: string }> = ({ cvUrl }) => {
  const root = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const publish = () => {
      const rects = Array.from(el.children, (child) => child.getBoundingClientRect())
        .filter((r) => r.width > 0 && r.height > 0)
        .map((r) => ({ left: r.left, top: r.top, width: r.width, height: r.height }));
      publishFixedCopy('controls', rects);
    };
    publish();
    const observer = new ResizeObserver(publish);
    observer.observe(el);
    window.addEventListener('resize', publish);
    document.fonts?.ready.then(publish, () => undefined);
    return () => {
      observer.disconnect();
      window.removeEventListener('resize', publish);
      publishFixedCopy('controls', []);
    };
  }, []);

  return (
    <aside ref={root} className="fixed-top-controls" aria-label="Site actions">
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
