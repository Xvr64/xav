import React, { useCallback, useEffect, useRef, useState } from 'react';
import { CV_DATA } from './cvData';
import { toTitleCase } from './OceanEntry';

// ============================================================================
// SECTION INDEX — the colophon that returns once the journey is over
// ============================================================================
// The cover's colophon (name on line a, index on line b, CV on line c) comes back as a fixed row
// when the introduction rises, and keeps out of the way while the visitor reads: it slips away
// while scrolling down and returns on any scroll up, on focus, and at the end of the page. On
// phones it folds into a "Menu" control that opens the index as a full-screen list in the
// display voice. Before the introduction it is absent, so the cover and the journey stay untouched.

export const SECTION_INDEX = [
  { id: 'introduction', label: 'Profile' },
  { id: 'experience', label: 'Experience' },
  { id: 'skills', label: 'Skills' },
  { id: 'education', label: 'Education' },
  { id: 'languages', label: 'Languages' },
  { id: 'contact', label: 'Contact' }
] as const;

/** How far (px) a downward scroll travels before the row slips away. */
const HIDE_AFTER_PX = 48;

export const SectionIndex: React.FC<{ cvUrl: string }> = ({ cvUrl }) => {
  const [arrived, setArrived] = useState(false);
  const [tucked, setTucked] = useState(false);
  const [active, setActive] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const menuButtonRef = useRef<HTMLButtonElement | null>(null);
  /** Set by a jump: focus goes to the destination, not back to "Menu" */
  const landedRef = useRef(false);

  useEffect(() => {
    let frame = 0;
    let lastY = window.scrollY;
    let downTravel = 0;
    let wasArrived = false;
    const update = () => {
      frame = 0;
      const vh = window.innerHeight;
      const y = window.scrollY;
      const intro = document.getElementById('introduction');
      const isArrived = !!intro && intro.getBoundingClientRect().top < vh * 0.6;
      const atEnd = y + vh >= document.documentElement.scrollHeight - 4;
      const dy = y - lastY;
      lastY = y;
      // Travel counts from the row's arrival: the descent that brings it is not a reading scroll
      if (isArrived !== wasArrived || dy < 0) downTravel = 0;
      else if (dy > 0) downTravel += dy;
      wasArrived = isArrived;
      setArrived(isArrived);
      setTucked(isArrived && !atEnd && downTravel > HIDE_AFTER_PX);
      // The section that holds the reading line (40% down the screen)
      let current: string | null = null;
      for (const { id } of SECTION_INDEX) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= vh * 0.4) current = id;
      }
      setActive(isArrived ? current : null);
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    update();
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
    };
  }, []);

  // A focused control is always shown, even mid-read (a tucked row stays focusable)
  const onFocus = useCallback(() => setTucked(false), []);

  const go = useCallback((e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    e.preventDefault();
    landedRef.current = true;
    setMenuOpen(false);
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    el.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' });
    history.replaceState(null, '', `#${id}`);
    // Keyboard and screen-reader users continue from the section they chose
    if (!el.hasAttribute('tabindex')) el.setAttribute('tabindex', '-1');
    el.focus({ preventScroll: true });
  }, []);

  // The phone menu: focus moves in on open, Tab wraps, Escape closes, focus returns to "Menu"
  useEffect(() => {
    if (!menuOpen) return;
    menuRef.current?.querySelector<HTMLElement>('a, button')?.focus();
    const button = menuButtonRef.current;
    landedRef.current = false;
    return () => {
      if (!landedRef.current) button?.focus();
    };
  }, [menuOpen]);
  const onMenuKey = useCallback((e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Escape') {
      setMenuOpen(false);
      return;
    }
    if (e.key !== 'Tab' || !menuRef.current) return;
    const items = Array.from(menuRef.current.querySelectorAll<HTMLElement>('a, button'));
    const first = items[0];
    const last = items[items.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }, []);

  const links = SECTION_INDEX.map(({ id, label }) => (
    <li key={id}>
      <a href={`#${id}`} onClick={(e) => go(e, id)} aria-current={active === id ? 'location' : undefined}>
        {label}
      </a>
    </li>
  ));

  return (
    <>
      <nav
        className="section-index ed-grid"
        data-arrived={arrived}
        data-tucked={tucked}
        aria-label="Sections"
        aria-hidden={!arrived}
        onFocus={onFocus}
      >
        <p className="section-index-name meta">{toTitleCase(CV_DATA.name)}</p>
        <ul className="section-index-links meta">{links}</ul>
        <p className="section-index-cv meta">
          <a href={cvUrl} target="_blank" rel="noopener noreferrer">
            CV <span aria-hidden="true">↗</span>
            <span className="sr-only"> (PDF, opens in a new tab)</span>
          </a>
        </p>
        <button
          ref={menuButtonRef}
          type="button"
          className="section-index-menu meta"
          aria-haspopup="dialog"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen(true)}
        >
          Menu
        </button>
      </nav>
      {menuOpen && (
        <div
          ref={menuRef}
          className="section-menu"
          role="dialog"
          aria-modal="true"
          aria-label="Sections"
          onKeyDown={onMenuKey}
        >
          <div className="section-menu-head">
            <p className="meta">{toTitleCase(CV_DATA.name)}</p>
            <button type="button" className="meta" onClick={() => setMenuOpen(false)}>
              Close
            </button>
          </div>
          <ul className="section-menu-links">{links}</ul>
          <p className="section-menu-cv meta">
            <a href={cvUrl} target="_blank" rel="noopener noreferrer">
              CV <span aria-hidden="true">↗</span>
              <span className="sr-only"> (PDF, opens in a new tab)</span>
            </a>
          </p>
        </div>
      )}
    </>
  );
};
