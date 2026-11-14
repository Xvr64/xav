import React, { useEffect, useRef } from 'react';
import { DecodeSoundToggle } from './TerminalEditorial';
import { publishFixedCopy } from './oceanDirection';

/**
 * The page's fixed corner: sound on/off and the CV link, persistent across the whole portfolio.
 * Nothing else lives up there. Copy scrolling up to the top of the screen has already scrambled
 * out by the time it reaches the corner (the decode's exit band, terminalMotion.ts), so the
 * controls never sit over readable text.
 *
 * The controls are copy like any other: each publishes its box so the whales thin behind it
 * (the reading veil of whaleVeil.ts). Measured on layout changes only.
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
