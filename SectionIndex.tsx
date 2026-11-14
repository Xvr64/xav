import React, { useCallback, useEffect, useRef, useState } from 'react';
import { DecodeSoundToggle } from './TerminalEditorial';
import { publishFixedCopy } from './oceanDirection';
import { gaugePosition } from './gaugePosition';
import { CV_SECTIONS, sectionNumber } from './sections';

/** The reading line the depth gauge uses: the section holding this fraction of the screen is current. */
const READING_LINE = 0.4;
/** How far the page may move under an open index before it is taken as reading on (px). */
const SCROLL_CLOSES_AFTER = 56;
const RULE_REST = '· '.repeat(120);
const RULE_INK = '~'.repeat(240);

/**
 * The page's fixed corner: sound on/off and the CV link, persistent across the whole portfolio,
 * and from the CV onwards two things more.
 *
 * THE READING VEIL. The page's copy stays readable once it has decoded (encryptedMotion.ts), so
 * a line scrolling up used to run straight under the corner controls: two texts on top of each
 * other, on a phone at every screen. Now the top of the screen is the water's own colour,
 * feathered downwards, and a line dissolves into it before it reaches the controls. One fixed
 * element, shown from the profile on; it never moves, so it costs the compositor one layer.
 *
 * THE INDEX. Below 1100px the depth gauge has no margin to stand in, and the CV's seven chapters
 * could only be reached by scrolling. There the corner gains one word, "Index": the veil comes
 * down as a sheet listing the chapters in the arrival screen's own voice (number, name, a rule of
 * dots, waves under the chapter being read). A disclosure, not a modal: the page is never locked,
 * so nothing here can contend with the Globe's hold on scrolling; reading on, Escape, or a tap
 * outside closes it. Choosing a chapter cuts straight to it.
 *
 * The controls are copy like any other: each publishes its box so the whales thin behind it
 * (the reading veil of whaleVeil.ts). Measured on layout changes only.
 */
export const SectionIndex: React.FC<{ cvUrl: string }> = ({ cvUrl }) => {
  const root = useRef<HTMLElement | null>(null);
  const toggle = useRef<HTMLButtonElement | null>(null);
  const sheet = useRef<HTMLElement | null>(null);
  /** The CV has been reached: the journey's film is over and the page is being read */
  const [reached, setReached] = useState(false);
  /** The Globe's stage has left the top of the screen: nothing but copy is there to veil */
  const [stageGone, setStageGone] = useState(true);
  const [open, setOpen] = useState(false);
  const [current, setCurrent] = useState(-1);

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

  // Reached while any part of the CV stands above the lower quarter of the screen: the profile as
  // it rises after the Globe, and everything below it. No scroll listener: two observed blocks.
  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') { setReached(true); return; }
    const blocks = [document.getElementById(CV_SECTIONS[0].id), document.querySelector('.cv-arch')].filter(Boolean) as Element[];
    if (blocks.length === 0) return;
    const inView = new Set<Element>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) inView.add(entry.target);
          else inView.delete(entry.target);
        }
        setReached(inView.size > 0);
      },
      { rootMargin: '0px 0px -28% 0px' }
    );
    blocks.forEach((block) => observer.observe(block));
    // The veil waits for the Globe to finish leaving: a band of water drawn across the top of the
    // disc would cut the sphere in two. Its runway ends where the profile begins, so while any
    // of it still crosses the top band of the screen the veil stays away.
    const runway = document.querySelector('[data-journey-runway]');
    const stage = runway
      ? new IntersectionObserver(([entry]) => setStageGone(!entry.isIntersecting), { rootMargin: '0px 0px -86% 0px' })
      : null;
    if (runway) stage?.observe(runway);
    return () => { observer.disconnect(); stage?.disconnect(); };
  }, []);

  const close = useCallback((returnFocus = false) => {
    setOpen(false);
    if (returnFocus) toggle.current?.focus({ preventScroll: true });
  }, []);

  // Back above the CV (into the Globe's film) the index has nothing to point at
  useEffect(() => { if (!reached) setOpen(false); }, [reached]);

  // Open: which chapter is being read, and every way of putting the sheet away
  useEffect(() => {
    if (!open) return;
    const sy = window.scrollY;
    const tops = CV_SECTIONS.map((section) => {
      const el = document.getElementById(section.id);
      return el ? el.getBoundingClientRect().top + sy : Infinity;
    });
    setCurrent(gaugePosition(tops, sy + window.innerHeight * READING_LINE).index);

    const onKey = (event: KeyboardEvent) => { if (event.key === 'Escape') close(true); };
    const onScroll = () => { if (Math.abs(window.scrollY - sy) > SCROLL_CLOSES_AFTER) close(); };
    const onPointer = (event: PointerEvent) => {
      const target = event.target as Node | null;
      if (target && (sheet.current?.contains(target) || toggle.current?.contains(target))) return;
      close();
    };
    // The index is for screens without the gauge: widened past them, it steps aside
    const wide = window.matchMedia('(min-width: 1101px)');
    const onWide = () => { if (wide.matches) close(); };
    document.addEventListener('keydown', onKey);
    window.addEventListener('scroll', onScroll, { passive: true });
    document.addEventListener('pointerdown', onPointer);
    wide.addEventListener('change', onWide);
    return () => {
      document.removeEventListener('keydown', onKey);
      window.removeEventListener('scroll', onScroll);
      document.removeEventListener('pointerdown', onPointer);
      wide.removeEventListener('change', onWide);
    };
  }, [open, close]);

  const goTo = (id: string) => (event: React.MouseEvent) => {
    event.preventDefault();
    const el = document.getElementById(id);
    close();
    if (!el) return;
    // A cut, not a glide: the sheet lifts on the chapter already in place
    el.scrollIntoView({ behavior: 'auto', block: 'start' });
    // The section is the landing point for the keyboard and for screen readers
    el.setAttribute('tabindex', '-1');
    el.focus({ preventScroll: true });
  };

  return (
    <>
      <div className="reading-veil" aria-hidden="true" data-shown={reached && stageGone ? '' : undefined} />
      <aside ref={root} className="fixed-top-controls" aria-label="Site actions">
        {reached && (
          <button
            ref={toggle}
            type="button"
            className="index-toggle meta"
            aria-expanded={open}
            aria-controls="section-index"
            onClick={() => setOpen((was) => !was)}
          >
            {open ? 'Close' : 'Index'}
          </button>
        )}
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
      {open && (
        <nav ref={sheet} id="section-index" className="index-sheet" aria-label="Sections">
          <ol>
            {CV_SECTIONS.map((section, i) => (
              <li key={section.id}>
                <a href={`#${section.id}`} onClick={goTo(section.id)} aria-current={current === i ? 'location' : undefined}>
                  <span className="index-number">
                    {sectionNumber(section.id)}<span aria-hidden="true"> /</span>
                  </span>
                  <span className="index-name">{section.label}</span>
                  <span className="index-rule" aria-hidden="true">{current === i ? RULE_INK : RULE_REST}</span>
                </a>
              </li>
            ))}
          </ol>
        </nav>
      )}
    </>
  );
};
