import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { DecodeSoundToggle } from './TerminalEditorial';
import { publishFixedCopy } from './oceanDirection';
import { GAUGE_SECTIONS } from './DepthGauge';
import { gaugePosition } from './gaugePosition';
import { magneticCV } from './magneticCVState';

/**
 * The page's fixed corner: sound on/off, Contact, and the CV link, persistent across the whole portfolio.
 * At <=1100px (where the right-margin DepthGauge is hidden), a quiet sentence-case `Index` trigger
 * opens a translucent abyss chapter overlay for direct one-tap jumps across all 7 CV chapters.
 *
 * The controls are copy like any other: each publishes its box so the whales thin behind it
 * (the reading veil of whaleVeil.ts). Measured on layout changes only.
 */
export const SectionIndex: React.FC<{ cvUrl: string }> = ({ cvUrl }) => {
  const root = useRef<HTMLElement | null>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const [isCompact, setIsCompact] = useState(() =>
    typeof window !== 'undefined' && typeof window.matchMedia === 'function'
      ? window.matchMedia('(max-width: 1100px)').matches
      : false
  );
  const [sheetOpen, setSheetOpen] = useState(false);
  const [activeIdx, setActiveIdx] = useState(0);

  useEffect(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return;
    const mq = window.matchMedia('(max-width: 1100px)');
    const onChange = () => {
      setIsCompact(mq.matches);
      if (!mq.matches) setSheetOpen(false);
    };
    onChange();
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

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
  }, [isCompact]);

  useEffect(() => {
    if (!sheetOpen) return;
    const sy = window.scrollY;
    const tops = GAUGE_SECTIONS.map((s) => {
      const el = document.getElementById(s.id);
      return el ? el.getBoundingClientRect().top + sy : Infinity;
    });
    const { index } = gaugePosition(tops, sy + window.innerHeight * 0.4);
    setActiveIdx(Math.max(0, index));

    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        setSheetOpen(false);
        triggerRef.current?.focus({ preventScroll: true });
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [sheetOpen]);

  const jumpToChapter = (id: string) => (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    setSheetOpen(false);
    const hash = `#${id}`;
    if (magneticCV) {
      if (location.hash !== hash) {
        location.hash = hash;
      } else {
        window.dispatchEvent(new HashChangeEvent('hashchange'));
      }
    }
    const el = document.getElementById(id);
    if (!el) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    el.scrollIntoView({ behavior: magneticCV || reduce ? 'auto' : 'smooth', block: 'start' });
    el.setAttribute('tabindex', '-1');
    el.focus({ preventScroll: true });
  };

  return (
    <>
      <aside ref={root} className="fixed-top-controls" aria-label="Site actions">
        <DecodeSoundToggle />
        {isCompact && (
          <button
            ref={triggerRef}
            type="button"
            className="mobile-chapters-trigger meta"
            aria-expanded={sheetOpen}
            aria-haspopup="dialog"
            aria-controls="mobile-chapters-dialog"
            onClick={() => setSheetOpen((open) => !open)}
          >
            Index
          </button>
        )}
        <a className="fixed-cv-link meta" href="#contact">Contact</a>
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
      {isCompact && sheetOpen && typeof document !== 'undefined' && createPortal(
        <div
          id="mobile-chapters-dialog"
          className="mobile-chapters-overlay"
          role="dialog"
          aria-modal="true"
          aria-label="Chapters"
          data-mobile-chapters-sheet=""
          onClick={(event) => {
            if (event.target === event.currentTarget) {
              setSheetOpen(false);
              triggerRef.current?.focus({ preventScroll: true });
            }
          }}
        >
          <div className="mobile-chapters-header">
            <span className="mobile-chapters-kicker">Chapters</span>
            <button
              type="button"
              className="mobile-chapters-close"
              onClick={() => {
                setSheetOpen(false);
                triggerRef.current?.focus({ preventScroll: true });
              }}
            >
              Close
            </button>
          </div>
          <ol className="mobile-chapters-list">
            {GAUGE_SECTIONS.map((section, idx) => (
              <li key={section.id}>
                <a
                  href={`#${section.id}`}
                  className="mobile-chapters-link"
                  aria-current={activeIdx === idx ? 'location' : undefined}
                  onClick={jumpToChapter(section.id)}
                >
                  <span className="mobile-chapters-num">{String(idx + 1).padStart(2, '0')}</span>
                  <span>{section.label}</span>
                </a>
              </li>
            ))}
          </ol>
        </div>,
        document.body
      )}
    </>
  );
};
