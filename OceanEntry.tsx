import React, { useEffect, useRef, useState } from 'react';
import { AsciiText } from './TerminalEditorial';
import { createHeroCurrent } from './heroCurrent';
import { CV_DATA } from './cvData';
import {
  convergence,
  directWhales,
  globeZone,
  heroZone,
  migrationRunway,
  mixLane,
  smoothStepRange,
  whaleDirection,
  type Lane
} from './oceanDirection';

// ============================================================================
// PROGRESSIVE OCEAN ENTRY (THE COVER) & THE INTRODUCTION AFTER THE JOURNEY
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

// Whale lanes (main, companion) for each moment of the cover and introduction, chosen against
// the type: on arrival they frame the headline from above and below, so the scene fills the
// screen from the first frame; at the edges while the fragments own the middle, beside the name,
// and, after the journey, in the introduction's open left field while the statement reads on the
// right. While the finished name holds, the main whale glides beneath it through the empty
// lower band — the one movement between two still compositions — so it never crosses the type.
export const LANES_SURFACE: Lane[] = [{ x: 0.74, y: 0.82 }, { x: 0.26, y: 0.2 }];
export const LANES_DESCENT: Lane[] = [{ x: 0.83, y: 0.8 }, { x: 0.13, y: 0.86 }];
export const LANES_NAME: Lane[] = [{ x: 0.85, y: 0.68 }, { x: 0.12, y: 0.9 }];
export const LANES_HOLD: Lane[] = [{ x: 0.36, y: 0.86 }, { x: 0.1, y: 0.92 }];
export const LANES_INTRO: Lane[] = [{ x: 0.17, y: 0.6 }, { x: 0.1, y: 0.93 }];
// One reading column on phones leaves no open field: the whales keep to the bottom edge
export const LANES_INTRO_NARROW: Lane[] = [{ x: 0.86, y: 0.95 }, { x: 0.12, y: 0.97 }];

/**
 * The hero current's canvas: fixed between the fluid (below) and the whales (above), so the
 * whales keep priority over the fragments. It redraws only when the scroll position changes.
 * Its frames also conduct where the whales swim. The ocean fills the whole screen from the first
 * frame: there is no surface line, no sky above it, and nothing measures the descent.
 */
export const HeroCurrentLayer: React.FC = React.memo(() => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const section = document.getElementById('home');
    const stage = section?.querySelector<HTMLElement>('[data-hero-stage]');
    if (!canvas || !section || !stage) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const nameEl = stage.querySelector<HTMLElement>('[data-hero-name]');
    if (!nameEl) return;

    const handle = createHeroCurrent({
      canvas,
      section,
      stage,
      letters: Array.from(stage.querySelectorAll<HTMLElement>('[data-hero-letter]')),
      nameEl,
      nameLines: Array.from(nameEl.querySelectorAll<HTMLElement>('[data-hero-name-line]')),
      horizon: stage.querySelector<HTMLElement>('[data-hero-horizon]'),
      onZones: (rects) => {
        if (rects.length === 0 && heroZone.rects.length === 0) return;
        heroZone.rects = rects;
        heroZone.version++;
      },
      onFrame: ({ t, stageTop, stageHeight }) => {
        // Arrival → descent → name, then the stage scrolls away as the convergence's runway rises:
        // the whales are let go to swim on into the film, which begins from wherever they are
        const toDescent = smoothStepRange(t, 0.04, 0.36);
        const toName = smoothStepRange(t, 0.4, 0.72);
        const toHold = smoothStepRange(t, 0.86, 1);
        const away = smoothStepRange(-stageTop / Math.max(1, stageHeight), 0.35, 0.95);
        const lanes = [0, 1].map((i) => {
          let lane = mixLane(LANES_SURFACE[i], LANES_DESCENT[i], toDescent);
          lane = mixLane(lane, LANES_NAME[i], toName);
          return mixLane(lane, LANES_HOLD[i], toHold);
        });
        directWhales('cover', 1 - away, lanes);
      }
    });
    return () => {
      handle.destroy();
      directWhales('cover', 0, LANES_SURFACE);
    };
  }, []);

  return <canvas ref={canvasRef} aria-hidden="true" className="fixed inset-0 z-0 pointer-events-none w-full h-full" />;
});

// Experience: the stations fill the reading measure, so the whales swim the lower band of the
// screen, beneath the eye line, where the next station is only rising into view.
export const LANES_EXPERIENCE: Lane[] = [{ x: 0.17, y: 0.91 }, { x: 0.88, y: 0.96 }];
export const LANES_EXPERIENCE_NARROW: Lane[] = [{ x: 0.86, y: 0.95 }, { x: 0.12, y: 0.97 }];

/**
 * The ambient whales around the Globe. When the convergence can draw (WhaleConvergence.tsx), they
 * give way as the Globe's runway rises — the 3D pair takes over, circles and becomes the Earth —
 * and return as the pinned stage lets go after the journey. Without it (no WebGL2), they dive into
 * the Globe as before: steering toward the journey's first city on the disc and shrinking to a
 * third of their size, swimming deep into the planet behind it (a calm zone, so they draw faintly
 * there) for the whole city sequence, and growing back as the pinned stage lets go.
 * Every value follows the runway's position, so scrolling back plays it in reverse.
 */
export const GlobeDive: React.FC = () => {
  useEffect(() => {
    const runway = document.querySelector<HTMLElement>('[data-journey-runway]');
    if (!runway || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const lanes: Lane[] = [
      { x: 0.64, y: 0.47 },
      { x: 0.6, y: 0.53 }
    ];
    let frame = 0;
    const update = () => {
      frame = 0;
      const vh = window.innerHeight;
      const r = runway.getBoundingClientRect();
      if (convergence.ready) {
        // Gone before the stage pins, back once its end rises past the middle of the screen
        const away = Math.min(smoothStepRange(vh - r.top, vh * 0.1, vh * 0.85), smoothStepRange(r.bottom, vh * 0.35, vh * 1.0));
        whaleDirection.presence = 1 - away;
        whaleDirection.size = 1;
        directWhales('globe', 0, lanes);
        return;
      }
      whaleDirection.presence = 1;
      const dive = Math.min(
        smoothStepRange(vh - r.top, vh * 0.15, vh * 0.95),
        smoothStepRange(r.bottom, vh * 0.35, vh * 1.0)
      );
      // They dive toward the journey's first city where the Globe shows it (their wake lands there
      // and becomes the route), else toward the disc's centre; the desktop framing until either
      const disc = globeZone.rects[0];
      const origin = globeZone.origin;
      if (origin || disc) {
        const cx = (origin ? origin.x : disc.left + disc.width / 2) / Math.max(1, window.innerWidth);
        const cy = (origin ? origin.y : disc.top + disc.height / 2) / Math.max(1, vh);
        lanes[0] = { x: cx, y: cy };
        lanes[1] = { x: cx - 0.04, y: cy + 0.06 };
      }
      whaleDirection.size = 1 - 0.68 * dive;
      directWhales('globe', dive, lanes);
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    convergence.listeners.add(schedule);
    update();
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      convergence.listeners.delete(schedule);
      whaleDirection.size = 1;
      whaleDirection.presence = 1;
      directWhales('globe', 0, lanes);
    };
  }, []);
  return null;
};

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

export const HEADLINE_TRANSLATIONS = [
  { line1: 'A journey without', line2: 'horizons', full: 'A journey without horizons', lang: 'en' },
  { line1: 'Un voyage sans', line2: 'horizons', full: 'Un voyage sans horizons', lang: 'fr' },
  { line1: 'Un viaje sin', line2: 'horizontes', full: 'Un viaje sin horizontes', lang: 'es' },
  { line1: '一段没有', line2: '地平线的旅程', full: '一段没有地平线的旅程', lang: 'zh' },
  { line1: 'رحلة بلا', line2: 'آفاق', full: 'رحلة بلا آفاق', lang: 'ar', dir: 'rtl' },
  { line1: 'Путешествие без', line2: 'горизонтов', full: 'Путешествие без горизонтов', lang: 'ru' }
] as const;

export const ProgressiveOceanEntry: React.FC<ProgressiveOceanEntryProps> = React.memo(() => {
  const [transIdx, setTransIdx] = useState(0);
  const [fade, setFade] = useState(true);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const timer = setInterval(() => {
      // Pause cycling while visitor is actively scrolling through the descent
      if (window.scrollY > 40) return;
      setFade(false);
      setTimeout(() => {
        setTransIdx((prev) => (prev + 1) % HEADLINE_TRANSLATIONS.length);
        setFade(true);
        window.dispatchEvent(new Event('resize'));
      }, 400);
    }, 3000);

    return () => clearInterval(timer);
  }, []);

  const current = HEADLINE_TRANSLATIONS[transIdx];

  return (
    <>
      {/* Cover: a scroll runway with a pinned stage. The headline's real letters break into the
          current drawn by HeroCurrentLayer, which gathers them into the name; the stage is kept
          out of the word-reveal system because it does not move while pinned. */}
      <section id="home" data-editorial-section className="hero-runway relative">
        <div className="hero-stage" data-hero-stage data-ascii-preserve>
          <div className="minimal-hero ed-grid">
            {/* The cover's line is the page's epigraph; the name below is its one h1 */}
            <p
              className="display cover-title"
              style={{
                opacity: fade ? 1 : 0,
                transition: 'opacity 0.4s ease-in-out',
                direction: (current as { dir?: string }).dir === 'rtl' ? 'rtl' : 'ltr'
              }}
            >
              <span className="sr-only">{current.full}</span>
              <span className="cover-line" aria-hidden="true">
                {heroLetters(current.line1)}
                {/* An invisible datum under the first line: it times the letters' break-up, never drawn */}
                <span className="hero-horizon" data-hero-horizon />
              </span>
              <span className="cover-line cover-line--drift" aria-hidden="true">
                {heroLetters(current.line2)}
              </span>
            </p>
          </div>
          {/* The type the ASCII name resolves into; the semantic heading follows the stage */}
          <p className="hero-name ed-grid" data-hero-name aria-hidden="true">
            <span className="hero-name-first" data-hero-name-line>Xavier</span>
            <span className="hero-name-last" data-hero-name-line>Hery</span>
          </p>
        </div>
        {/* The page's one h1. With motion the name resolved on the stage carries it visually, so it
            is clipped (and kept out of the word system); without motion it is set as type here. */}
        <h1 className="intro-name intro-name--carried" data-ascii-preserve>
          <span className="intro-name-first"><AsciiText text="Xavier" /></span>{' '}
          <span className="intro-name-last"><AsciiText text="Hery" /></span>
        </h1>
      </section>
    </>
  );
});

/**
 * The introduction: the personal statement, met in the deep water once the whales have become the
 * Earth and the city journey has ended. It uses the shared ASCII word reveal like every other
 * section; the whales keep to its open left field while it reads.
 */
export const OceanIntroduction: React.FC = React.memo(() => (
  <section id="introduction" data-editorial-section className="terminal-overview ed-grid relative">
    <p className="lead" data-text-rank="2"><AsciiText text={CV_DATA.heroIntroConcise} /></p>
    <p className="intro-support" data-text-rank="3"><AsciiText text={CV_DATA.heroIntroSecondary} /></p>
  </section>
));
