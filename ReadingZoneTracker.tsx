import React, { useEffect } from 'react';
import { globeZone, heroZone, readingZones } from './oceanDirection';

// ============================================================================
// READING ZONES — where the page's reading text sits on screen
// ============================================================================
// Line boxes of the copy, measured in document space on layout changes only and offset by the
// scroll per drawn frame (zero layout reads while scrolling; the same array is returned while
// nothing moves). The whales read them to let their tone recede softly behind a line of text.

/** Reading text the whales recede behind. */
export const READING_SELECTOR = 'main h1, main h2, main h3, main p, main li, main a, main button';

export const ReadingZoneTracker: React.FC = React.memo(() => {
  useEffect(() => {
    let docRects: { left: number; top: number; width: number; height: number }[] = [];
    let viewRects: { left: number; top: number; width: number; height: number }[] = [];
    let generation = 0;
    let readGeneration = -1;
    let readScrollY = NaN;
    let readHeroVersion = -1;
    let readGlobeVersion = -1;
    const range = document.createRange();
    const measure = () => {
      const sy = window.scrollY;
      const next: typeof docRects = [];
      document.querySelectorAll<HTMLElement>(READING_SELECTOR).forEach((el) => {
        if (el.parentElement?.closest(READING_SELECTOR) || el.closest('[data-journey-runway], [data-hero-stage]')) return;
        range.selectNodeContents(el);
        const lines: typeof docRects = [];
        for (const r of Array.from(range.getClientRects())) {
          if (r.width < 1 || r.height < 1) continue;
          const line = lines.find((l) => Math.abs(l.top - (r.top + sy)) < r.height * 0.5);
          if (line) {
            const right = Math.max(line.left + line.width, r.right);
            line.left = Math.min(line.left, r.left);
            line.width = right - line.left;
            line.height = Math.max(line.height, r.height);
          } else {
            lines.push({ left: r.left, top: r.top + sy, width: r.width, height: r.height });
          }
        }
        next.push(...lines);
      });
      docRects = next;
      generation++;
    };
    const read = () => {
      const sy = window.scrollY;
      if (
        sy === readScrollY &&
        generation === readGeneration &&
        heroZone.version === readHeroVersion &&
        globeZone.version === readGlobeVersion
      )
        return viewRects;
      readScrollY = sy;
      readGeneration = generation;
      readHeroVersion = heroZone.version;
      readGlobeVersion = globeZone.version;
      const vh = window.innerHeight;
      viewRects = [];
      for (const r of docRects) {
        const top = r.top - sy;
        if (top > vh + 48 || top + r.height < -48) continue;
        viewRects.push({ left: r.left, top, width: r.width, height: r.height });
      }
      // The pinned hero supplies its own live rects (headline, then the gathering name)
      for (const r of heroZone.rects) viewRects.push(r);
      // The Globe's disc and caption, while its stage is on screen
      for (const r of globeZone.rects) viewRects.push(r);
      return viewRects;
    };
    let measureTimer = 0;
    const scheduleMeasure = () => {
      window.clearTimeout(measureTimer);
      measureTimer = window.setTimeout(measure, 120);
    };
    measure();
    readingZones.read = read;
    const layoutObserver = new ResizeObserver(scheduleMeasure);
    layoutObserver.observe(document.documentElement);
    document.fonts?.addEventListener?.('loadingdone', scheduleMeasure);

    return () => {
      document.fonts?.removeEventListener?.('loadingdone', scheduleMeasure);
      layoutObserver.disconnect();
      window.clearTimeout(measureTimer);
      range.detach();
      if (readingZones.read === read) readingZones.read = () => [];
    };
  }, []);

  return null;
});
