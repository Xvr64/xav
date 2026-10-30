import React, { useEffect, useRef } from 'react';
import { background, fluid, type BackgroundHandle } from 'asciify-engine/kit';
import { lerpN, type AbyssRGB } from './abyssPalette';
import { globeZone, heroZone, readingZones } from './oceanDirection';

// ============================================================================
// ASCIIFY FLUID OCEAN — one shared field for the whole page
// ============================================================================
// A single official `fluid` background on a fixed, viewport-sized host sits directly under the
// whale canvas, so the current is continuous across every section (no per-section instances,
// no restart at boundaries). The whale canvas no longer paints the water colour itself: the
// page background shows through, and each whale's silhouette cells are filled with that exact
// water colour before its tiles, so the fluid never shows through a whale's body.
// Ink and opacity follow the same `abyss` value as the background — no second timeline.
export const FLUID_INK_SURFACE: AbyssRGB = [47, 72, 88]; // #2F4858 muted ocean blue-grey on white
export const FLUID_INK_ABYSS: AbyssRGB = [232, 238, 242]; // #E8EEF2 soft cool white on black
// The fluid preset draws a flat ink whose density follows the field's tone, and the cursor wake
// only adds tone. On white that left the wake as faint as the idle folds (ink at one flat low
// opacity). `shade` dims low-tone glyphs, so on light water a higher canvas opacity plus shade
// keeps the idle field quiet while wake-lifted glyphs reach full ink. Both fade to the original
// flat look (shade 0) on dark water, which already reads well.
export const FLUID_OPACITY_SURFACE = 0.58;
export const FLUID_OPACITY_ABYSS = 0.46;
export const FLUID_SHADE_SURFACE = 0.8;
export const FLUID_SHADE_ABYSS = 0;
export const rgbHex = (c: number[]) => `#${c.map((v) => Math.round(v).toString(16).padStart(2, '0')).join('')}`;

export const fluidOcean = {
  host: null as HTMLElement | null,
  handle: null as BackgroundHandle | null,
  ink: '',
  shade: -1,
  opacity: -1,
  paused: false
};
/** True while the GPU fluid is mounted; otherwise the canvas keeps its own water as a fallback. */
export const fluidOceanLive = () => !!fluidOcean.handle?.supported;

/**
 * Ink crosses from dark to light around the neutral water's equal-contrast midpoint
 * (the same point the text palette switches at), so glyphs stay visible on both sides.
 */
export function syncFluidOcean(abyss: number, presence = 1) {
  const { host, handle } = fluidOcean;
  if (!host || !handle) return;
  const paused = presence === 0;
  if (paused !== fluidOcean.paused) {
    if (paused) handle.pause();
    else handle.play();
    fluidOcean.paused = paused;
  }
  const s = Math.max(0, Math.min(1, (abyss - 0.42) / 0.24));
  const t = s * s * (3 - 2 * s);
  const ink = rgbHex(FLUID_INK_SURFACE.map((v, i) => lerpN(v, FLUID_INK_ABYSS[i], t)));
  if (ink !== fluidOcean.ink) {
    fluidOcean.ink = ink;
    // Kept on the host too, so any internal refresh of the kit resolves the same ink
    host.style.setProperty('--fluid-ink', ink);
    handle.field?.update({ ink });
  }
  const shade = Math.round(lerpN(FLUID_SHADE_SURFACE, FLUID_SHADE_ABYSS, t) * 50) / 50;
  if (shade !== fluidOcean.shade) {
    fluidOcean.shade = shade;
    handle.field?.update({ shade });
  }
  // `presence` lets the migration's world-anchored ocean take over from the screen-space current
  const opacity = Math.round(lerpN(FLUID_OPACITY_SURFACE, FLUID_OPACITY_ABYSS, t) * presence * 200) / 200;
  if (opacity !== fluidOcean.opacity) {
    const canvas = host.querySelector<HTMLCanvasElement>('canvas[data-ascii-kit]');
    if (canvas) {
      canvas.style.opacity = String(opacity);
      fluidOcean.opacity = opacity;
    }
  }
}

/** Reading text the current quiets behind (line boxes, measured on layout changes only). */
export const FLUID_CLEAR_SELECTOR = 'main h1, main h2, main h3, main p, main li, main a, main button';

export const FluidOceanBackground: React.FC = React.memo(() => {
  const hostRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    host.style.setProperty('--fluid-ink', rgbHex(FLUID_INK_SURFACE));

    // Text-shaped clear map: line boxes in document space, offset by scroll per drawn frame
    // (zero layout reads while scrolling; same array returned while nothing moves).
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
      document.querySelectorAll<HTMLElement>(FLUID_CLEAR_SELECTOR).forEach((el) => {
        if (el.parentElement?.closest(FLUID_CLEAR_SELECTOR) || el.closest('[data-journey-runway], [data-hero-stage]')) return;
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
    const readClear = () => {
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
    readingZones.read = readClear;
    const layoutObserver = new ResizeObserver(scheduleMeasure);
    layoutObserver.observe(document.documentElement);
    document.fonts?.addEventListener?.('loadingdone', scheduleMeasure);

    const handle = background(host, {
      preset: fluid,
      color: 'var(--fluid-ink, #2F4858)',
      // Punctuation only, from still to dense: the current reads as water, never as letters
      charset: ' ·.:-~=+*',
      opacity: FLUID_OPACITY_SURFACE,
      lazy: false,
      clear: readClear,
      clearPadding: 14,
      clearSoftness: 36,
      clearStrength: 0.95,
      // Full-bleed field behind everything: a lower backing-store ratio than the preset's 1.5
      // keeps its per-frame GPU draw and canvas copy cheap next to the whales and the Globe.
      look: { maxPixelRatio: 1, shade: FLUID_SHADE_SURFACE }
    });
    fluidOcean.host = host;
    fluidOcean.handle = handle;
    fluidOcean.ink = '';
    fluidOcean.shade = -1;
    fluidOcean.opacity = -1;
    fluidOcean.paused = false;

    // The host never takes pointer events (content stays clickable), so real pointer moves are
    // forwarded to it for the fluid's cursor wake; over links and controls the wake lets go.
    const forwardMove = (e: PointerEvent) => {
      if (!e.isTrusted || e.pointerType === 'touch') return;
      const overControl =
        e.target instanceof Element && e.target.closest('button, a, input, select, summary, textarea');
      host.dispatchEvent(
        overControl
          ? new PointerEvent('pointerleave')
          : new PointerEvent('pointermove', {
              clientX: e.clientX,
              clientY: e.clientY,
              pointerId: e.pointerId,
              pointerType: e.pointerType,
              isPrimary: e.isPrimary
            })
      );
    };
    const forwardLeave = () => host.dispatchEvent(new PointerEvent('pointerleave'));
    window.addEventListener('pointermove', forwardMove, { passive: true });
    document.documentElement.addEventListener('pointerleave', forwardLeave);

    return () => {
      window.removeEventListener('pointermove', forwardMove);
      document.documentElement.removeEventListener('pointerleave', forwardLeave);
      document.fonts?.removeEventListener?.('loadingdone', scheduleMeasure);
      layoutObserver.disconnect();
      window.clearTimeout(measureTimer);
      range.detach();
      handle.destroy();
      if (readingZones.read === readClear) readingZones.read = () => [];
      if (fluidOcean.handle === handle) {
        fluidOcean.handle = null;
        fluidOcean.host = null;
      }
    };
  }, []);

  return <div ref={hostRef} aria-hidden="true" data-ocean-layer className="fixed inset-0 z-0 pointer-events-none overflow-hidden" />;
});
