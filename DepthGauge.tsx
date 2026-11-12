import React, { useEffect, useRef, useState } from 'react';
import { publishFixedCopy } from './oceanDirection';
import { gaugePosition } from './gaugePosition';

// ============================================================================
// DEPTH GAUGE — the sounding line: where you are in the descent, and the way to any station
// ============================================================================
// The page hides its scrollbar and runs some 13 screens deep, so after the journey the visitor
// had no measure of it and no way to a section except scrolling. The gauge is that measure, drawn
// as an instrument rather than a menu: a hairline in the right margin with one tick per section
// and a marker that travels with the reading line. At rest it is only strokes. The section names
// appear when it is approached (hover, keyboard focus) and for a moment when it first arrives,
// which is how it introduces itself. Absent on the cover and through the Globe's film, on phones
// and tablets (no margin to stand in) and in print. Everything it writes while scrolling is one
// transform on the marker; section positions are measured on layout changes only.
//
// To remove it: delete <DepthGauge /> from the page and the "Depth gauge" block in terminal.css.

export const GAUGE_SECTIONS = [
  { id: 'introduction', label: 'Profile' },
  { id: 'experience', label: 'Experience' },
  { id: 'skills', label: 'Skills' },
  { id: 'education', label: 'Education' },
  { id: 'languages', label: 'Languages' },
  { id: 'interests', label: 'Interests' },
  { id: 'contact', label: 'Contact' }
] as const;

/** Distance between two ticks (px); terminal.css reads it as --gauge-step. */
export const GAUGE_STEP = 30;
/** The reading line: the section holding this fraction of the screen height is the current one. */
const READING_LINE = 0.4;
/** How far the names reach to the left of the strokes (px): the longest label and its gap. */
const LABEL_REACH = 104;
/** How long the names show when the gauge first arrives (ms). */
const INTRODUCTION_MS = 2800;

export const DepthGauge: React.FC = () => {
  const root = useRef<HTMLElement | null>(null);
  const marker = useRef<HTMLSpanElement | null>(null);
  const [active, setActive] = useState(-1);
  const [shown, setShown] = useState(false);
  const [introducing, setIntroducing] = useState(false);
  /** Approached by the pointer or the keyboard: the names are out */
  const [approached, setApproached] = useState(false);
  const labelsOut = introducing || approached;
  const introduced = useRef(false);

  useEffect(() => {
    let tops: number[] = [];
    let frame = 0;
    let lastIndex = -2;
    let lastShown = false;
    let lastPosition = NaN;
    const sections = GAUGE_SECTIONS.map((s) => document.getElementById(s.id));
    const update = () => {
      frame = 0;
      if (!tops.length) return;
      const vh = window.innerHeight;
      const y = window.scrollY;
      const { index, position } = gaugePosition(tops, y + vh * READING_LINE);
      // It arrives as the introduction rises, once the Globe's film has let the page go
      const isShown = y + vh * 0.72 >= tops[0];
      if (position !== lastPosition && marker.current) {
        lastPosition = position;
        marker.current.style.transform = `translate3d(0, ${(position * GAUGE_STEP).toFixed(2)}px, 0)`;
      }
      if (index !== lastIndex) { lastIndex = index; setActive(index); }
      if (isShown !== lastShown) { lastShown = isShown; setShown(isShown); }
    };
    const measure = () => {
      const sy = window.scrollY;
      tops = sections.map((el) => (el ? el.getBoundingClientRect().top + sy : Infinity));
      update();
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
    const observer = new ResizeObserver(measure);
    sections.forEach((el) => el && observer.observe(el));
    observer.observe(document.documentElement);
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', measure);
    document.fonts?.ready.then(measure, () => undefined);
    measure();
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', measure);
    };
  }, []);

  // Its first arrival: the names show for a moment, then it is strokes again
  useEffect(() => {
    if (!shown || introduced.current) return;
    introduced.current = true;
    setIntroducing(true);
    const timer = window.setTimeout(() => setIntroducing(false), INTRODUCTION_MS);
    return () => window.clearTimeout(timer);
  }, [shown]);

  // While it shows, its strokes are copy like any other: the whales thin behind them, and
  // behind the names too while those are out
  useEffect(() => {
    const el = root.current;
    const publish = () => {
      const r = el && shown && getComputedStyle(el).display !== 'none' ? el.getBoundingClientRect() : null;
      const names = labelsOut ? LABEL_REACH : 0;
      publishFixedCopy('gauge', r && r.width > 0 ? [{ left: r.left - names, top: r.top, width: r.width + names, height: r.height }] : []);
    };
    publish();
    window.addEventListener('resize', publish);
    return () => {
      window.removeEventListener('resize', publish);
      publishFixedCopy('gauge', []);
    };
  }, [shown, labelsOut]);

  const goTo = (id: string) => (event: React.MouseEvent) => {
    event.preventDefault();
    const el = document.getElementById(id);
    if (!el) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    el.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
    // The section is the landing point for the keyboard and for screen readers
    el.setAttribute('tabindex', '-1');
    el.focus({ preventScroll: true });
  };

  return (
    <nav
      ref={root}
      className="depth-gauge"
      aria-label="Sections"
      data-shown={shown ? '' : undefined}
      data-labels={labelsOut ? '' : undefined}
      onPointerEnter={() => setApproached(true)}
      onPointerLeave={() => setApproached(false)}
      onFocus={() => setApproached(true)}
      onBlur={(event) => { if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setApproached(false); }}
      style={{ '--gauge-step': `${GAUGE_STEP}px` } as React.CSSProperties}
    >
      <ol>
        {GAUGE_SECTIONS.map((section, i) => (
          <li key={section.id}>
            <a href={`#${section.id}`} onClick={goTo(section.id)} aria-current={active === i ? 'location' : undefined}>
              <span className="depth-gauge-label">{section.label}</span>
              <span className="depth-gauge-tick" aria-hidden="true" />
            </a>
          </li>
        ))}
      </ol>
      <span ref={marker} className="depth-gauge-marker" aria-hidden="true" />
    </nav>
  );
};
