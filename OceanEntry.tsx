import React, { useEffect, useRef } from 'react';
import { AsciiText } from './TerminalEditorial';
import { createHeroCurrent } from './heroCurrent';
import { CV_DATA } from './cvData';
import {
  directWhales,
  heroZone,
  migrationRunway,
  mixLane,
  smoothStepRange,
  whaleDirection,
  type Lane
} from './oceanDirection';

// ============================================================================
// PROGRESSIVE OCEAN ENTRY & SCROLL-DRIVEN INTRODUCTION (PHASES 1 -> 4)
// ============================================================================

export interface ProgressiveOceanEntryProps {
  onExploreDossier: () => void;
  onDownloadPdf: () => void;
}

export const NAME_WORDS = [
  { text: 'Xavier', offset: 0 },
  { text: 'Hery', offset: 1.5 }
];

/** One span per letter so each can break up on its own; spaces stay plain text. */
export const heroLetters = (text: string) =>
  Array.from(text).map((ch, i) =>
    ch === ' ' ? (
      ' '
    ) : (
      <span key={i} className="hero-letter" data-hero-letter>
        {ch}
      </span>
    )
  );

/** "XAVIER HERY" → "Xavier Hery", for the colophon's quiet voice. */
export const toTitleCase = (text: string) => text.toLowerCase().replace(/(^|[\s/·-])(\p{L})/gu, (_, sep, ch) => sep + ch.toUpperCase());

/**
 * The hero current's canvas: fixed between the fluid (below) and the whales (above), so the
 * whales keep priority over the fragments. It redraws only when the scroll position changes.
 */
/** Px over which the water fades in under the horizon: light falling off with depth. */
export const SURFACE_FADE = 170;

// Whale lanes (main, companion) for each moment of the cover and introduction, chosen against
// the type: under the horizon at the surface, at the edges while the fragments own the middle,
// beside the name, then in the introduction's open left field while the statement reads on the
// right. While the finished name holds, the main whale glides beneath it through the empty
// lower band — the one movement between two still compositions — so it never crosses the type.
export const LANES_SURFACE: Lane[] = [{ x: 0.79, y: 0.8 }, { x: 0.15, y: 0.9 }];
export const LANES_DESCENT: Lane[] = [{ x: 0.83, y: 0.8 }, { x: 0.13, y: 0.86 }];
export const LANES_NAME: Lane[] = [{ x: 0.85, y: 0.68 }, { x: 0.12, y: 0.9 }];
export const LANES_HOLD: Lane[] = [{ x: 0.36, y: 0.86 }, { x: 0.1, y: 0.92 }];
export const LANES_INTRO: Lane[] = [{ x: 0.17, y: 0.6 }, { x: 0.1, y: 0.93 }];
// One reading column on phones leaves no open field: the whales keep to the bottom edge
export const LANES_INTRO_NARROW: Lane[] = [{ x: 0.86, y: 0.95 }, { x: 0.12, y: 0.97 }];

/**
 * The hero current's canvas: fixed between the fluid (below) and the whales (above), so the
 * whales keep priority over the fragments. It redraws only when the scroll position changes.
 * Its frames also conduct the ocean around the cover: the surface mask on the fluid and whale
 * layers, and where the whales swim.
 */
export const HeroCurrentLayer: React.FC = React.memo(() => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const section = document.getElementById('home');
    const stage = section?.querySelector<HTMLElement>('[data-hero-stage]');
    const intro = document.getElementById('introduction');
    if (!canvas || !section || !stage) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const nameEl = stage.querySelector<HTMLElement>('[data-hero-name]');
    if (!nameEl) return;

    const oceanLayers = Array.from(document.querySelectorAll<HTMLElement>('[data-ocean-layer]'));
    let maskY = NaN;
    const maskSurface = (horizonY: number) => {
      const y = Math.round(horizonY);
      if (y === maskY) return;
      maskY = y;
      const mask =
        y <= -SURFACE_FADE
          ? ''
          : `linear-gradient(to bottom, transparent ${y}px, rgba(0, 0, 0, 0.35) ${y + 1}px, #000 ${y + SURFACE_FADE}px)`;
      for (const el of oceanLayers) {
        el.style.maskImage = mask;
        el.style.setProperty('-webkit-mask-image', mask);
      }
    };

    // The introduction's document position, for handing the whales back once it has passed
    let introTop = 0;
    let introBottom = 0;
    const measureIntro = () => {
      if (!intro) return;
      const r = intro.getBoundingClientRect();
      introTop = r.top + window.scrollY;
      introBottom = r.bottom + window.scrollY;
    };
    measureIntro();
    const introObserver = new ResizeObserver(measureIntro);
    if (intro) introObserver.observe(intro);
    window.addEventListener('resize', measureIntro);

    const handle = createHeroCurrent({
      canvas,
      section,
      stage,
      letters: Array.from(stage.querySelectorAll<HTMLElement>('[data-hero-letter]')),
      nameEl,
      nameLines: Array.from(nameEl.querySelectorAll<HTMLElement>('[data-hero-name-line]')),
      horizon: stage.querySelector<HTMLElement>('[data-hero-horizon]'),
      depthEl: stage.querySelector<HTMLElement>('[data-hero-depth]'),
      onZones: (rects) => {
        if (rects.length === 0 && heroZone.rects.length === 0) return;
        heroZone.rects = rects;
        heroZone.version++;
      },
      onFrame: ({ t, horizonY, stageTop, stageHeight }) => {
        maskSurface(horizonY);
        // Surface → descent → name, then the stage scrolls away and the introduction takes over
        const toDescent = smoothStepRange(t, 0.04, 0.36);
        const toName = smoothStepRange(t, 0.4, 0.72);
        const toHold = smoothStepRange(t, 0.86, 1);
        const away = smoothStepRange(-stageTop / Math.max(1, stageHeight), 0.35, 0.95);
        const lanes = [0, 1].map((i) => {
          let lane = mixLane(LANES_SURFACE[i], LANES_DESCENT[i], toDescent);
          lane = mixLane(lane, LANES_NAME[i], toName);
          lane = mixLane(lane, LANES_HOLD[i], toHold);
          return mixLane(lane, (window.innerWidth < 768 ? LANES_INTRO_NARROW : LANES_INTRO)[i], away);
        });
        whaleDirection.surfaceY = horizonY;
        // Fully composed until the introduction's last line rises past mid-screen
        const vh = window.innerHeight;
        const introLeft = intro ? introBottom - window.scrollY : -1;
        directWhales('cover', introTop > 0 ? smoothStepRange(introLeft, vh * 0.05, vh * 0.55) : 1 - away, lanes);
      }
    });
    return () => {
      handle.destroy();
      introObserver.disconnect();
      window.removeEventListener('resize', measureIntro);
      maskSurface(-Infinity);
      directWhales('cover', 0, LANES_SURFACE);
      whaleDirection.surfaceY = -Infinity;
    };
  }, []);

  return <canvas ref={canvasRef} aria-hidden="true" className="fixed inset-0 z-0 pointer-events-none w-full h-full" />;
});

// Experience: the stations fill the reading measure, so the whales swim the lower band of the
// screen, beneath the eye line, where the next station is only rising into view.
export const LANES_EXPERIENCE: Lane[] = [{ x: 0.17, y: 0.91 }, { x: 0.88, y: 0.96 }];
export const LANES_EXPERIENCE_NARROW: Lane[] = [{ x: 0.86, y: 0.95 }, { x: 0.12, y: 0.97 }];

/**
 * Holds the whales in composed lanes while a section is on screen: the hold builds as the
 * section rises into view and lets go as its end rises past mid-screen.
 */
export const WhaleStretch: React.FC<{ sectionId: string; lanes: readonly Lane[]; narrowLanes?: readonly Lane[] }> = ({
  sectionId,
  lanes,
  narrowLanes = lanes
}) => {
  useEffect(() => {
    const section = document.getElementById(sectionId);
    if (!section) return;
    let top = 0;
    let bottom = 0;
    const measure = () => {
      const r = section.getBoundingClientRect();
      top = r.top + window.scrollY;
      bottom = r.bottom + window.scrollY;
      update();
    };
    let frame = 0;
    const update = () => {
      frame = 0;
      const vh = window.innerHeight;
      const sy = window.scrollY;
      const weight = Math.min(
        smoothStepRange(sy + vh - top, vh * 0.1, vh * 0.5),
        smoothStepRange(bottom - sy, vh * 0.05, vh * 0.55)
      );
      directWhales(sectionId, weight, window.innerWidth < 768 ? narrowLanes : lanes);
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    const observer = new ResizeObserver(measure);
    observer.observe(section);
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', measure);
    measure();
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', measure);
      directWhales(sectionId, 0, lanes);
    };
  }, [sectionId, lanes, narrowLanes]);
  return null;
};

/**
 * The migration's runway: an empty interval of scroll between the cover and the introduction.
 * It never moves the page; its length is the migration's timeline, which the whale canvas draws
 * (camera, whales, wakes and the spherical ocean — see migrationScene.ts). Collapsed for reduced motion.
 */
export const MigrationRunway: React.FC = React.memo(() => {
  const ref = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const measure = () => {
      const r = el.getBoundingClientRect();
      migrationRunway.top = r.top + window.scrollY;
      migrationRunway.height = r.height;
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    observer.observe(document.documentElement);
    window.addEventListener('resize', measure);
    return () => {
      observer.disconnect();
      window.removeEventListener('resize', measure);
      migrationRunway.height = 0;
    };
  }, []);
  return <div ref={ref} className="migration-runway" aria-hidden="true" />;
});

export const ProgressiveOceanEntry: React.FC<ProgressiveOceanEntryProps> = React.memo(() => (
  <>
    {/* Cover: a scroll runway with a pinned stage. The headline's real letters break into the
        current drawn by HeroCurrentLayer, which gathers them into the name; the stage is kept
        out of the word-reveal system because it does not move while pinned. */}
    <section id="home" data-editorial-section className="hero-runway relative">
      <div className="hero-stage" data-hero-stage data-ascii-preserve>
        <div className="minimal-hero ed-grid">
          {/* The cover's line is the page's epigraph; the name below is its one h1 */}
          <p className="display cover-title">
            <span className="sr-only">A journey without horizons</span>
            <span className="cover-line" aria-hidden="true">
              {heroLetters('A journey without')}
              <span className="hero-horizon" data-hero-horizon>
                <span className="hero-horizon-label">0 m · sea level</span>
              </span>
            </span>
            <span className="cover-line cover-line--drift" aria-hidden="true">{heroLetters('horizons')}</span>
          </p>
        </div>
        {/* The type the ASCII name resolves into; the semantic heading stays in the introduction */}
        <p className="hero-name ed-grid" data-hero-name aria-hidden="true">
          <span className="hero-name-first" data-hero-name-line>Xavier</span>
          <span className="hero-name-last" data-hero-name-line>Hery</span>
        </p>
      </div>
    </section>
    {/* Introduction: the name resolved above carries the heading visually; the semantic name stays
        here (visually clipped, so it is excluded from the word system). The rest of the spread
        uses the shared ASCII word reveal like every other section. */}
    <section id="introduction" data-editorial-section className="terminal-overview ed-grid relative">
      <h1 className="intro-name intro-name--carried" data-ascii-preserve>
        <span className="intro-name-first"><AsciiText text="Xavier" /></span>{' '}
        <span className="intro-name-last"><AsciiText text="Hery" /></span>
      </h1>
      <p className="depth-mark" aria-hidden="true"><AsciiText text="10 m — sunlit zone" /></p>
      <p className="lead" data-text-rank="2"><AsciiText text={CV_DATA.heroIntroConcise} /></p>
      <p className="intro-support" data-text-rank="3"><AsciiText text={CV_DATA.heroIntroSecondary} /></p>
    </section>
  </>
));
