import React, { useEffect, useRef } from 'react';
import { AmbientWhaleLayer } from './AmbientWhaleLayer';
import { playSonarPing, setSoundDepth } from './decodeAudio';
import { MAX_PINGS, arrivalTime, echoStrength, isOpenWaterClick, pingRadius, pingStrength } from './sonarPing';
import { waterShade } from './terminalMotion';
import { applyAbyssPalette, applyAbyssWash, abyssPaletteScoped, globeScrollGeometry, inkMixFromAbyss, releaseAbyssPalette } from './abyssPalette';
import { ambientWhalesLive, migrationRunway, readingZones } from './oceanDirection';
import { globeStageFillsScreen } from './oceanWorld';
import { migrationAt } from './migrationScene';
import {
  MANTA_CELL, MANTA_START_VISIBILITY, bakeMantaAtlas, drawMantaRay, glideMantaRay, launchMantaRay, mantaVisibility, newMantaRay, stepMantaRay, type Random
} from './oceanManta';

export interface AsciiWhaleBackgroundProps {
  mode: 'ambient' | 'focus' | 'off';
}

/** Seconds a sonar ping lives (its ring and the whales' echoes), as before. */
const PING_LIFE_S = 3;
/** Spine node (of the whales' 48) the echoes answer from: the body's middle, as before. */
const ECHO_NODE = 24;
/** Echo radius per whale, as a share of the main whale's on-screen body length. */
const ECHO_SCALE = [1.0, 0.58];
/** Frames the water looks again for the Globe's first measurement (about 5 s at 60 Hz). */
const UNMEASURED_RETRY_FRAMES = 300;

/**
 * The ocean layer: the shared 3D whales (AmbientWhaleLayer) between two 2D sonar canvases, and
 * the page's palette, lantern depth and sound depth, which follow the scroll.
 *
 * Nothing here runs on its own. The palette, the lantern and the sound are brought up to date
 * once per frame in which the page scrolled or changed size (one coalesced rAF); the 2D canvases
 * hold no pixels and no backing store until an open-water click sends a ping, or a distant manta
 * ray crosses deep water (oceanManta.ts), and draw only for as long as one of them is there: the
 * ray's wait is a timeout, not a loop. (The 2D whales, fish, wake and generative water this file
 * used to animate at display rate had been retired behind the 3D whales: they drew nothing.)
 */
export const AsciiWhaleBackground: React.FC<AsciiWhaleBackgroundProps> = React.memo(({ mode }) => {
  // Sonar rings pass beneath the whales; the whales' echoes are drawn above them
  const underRef = useRef<HTMLCanvasElement | null>(null);
  const overRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (mode === 'off') return;
    const under = underRef.current;
    const over = overRef.current;
    const underCtx = under?.getContext('2d', { alpha: true }) ?? null;
    const overCtx = over?.getContext('2d', { alpha: true }) ?? null;
    if (!under || !underCtx) return;
    const isFocus = mode === 'focus';
    const motionQuery = matchMedia('(prefers-reduced-motion: reduce)');
    let prefersReducedMotion = motionQuery.matches;

    let viewW = window.innerWidth;
    let viewH = window.innerHeight;
    let docScrollable = Math.max(1, document.documentElement.scrollHeight - viewH);

    // ------------------------------------------------------------------------
    // THE WATER'S VALUE: palette, lantern, sound (on scroll and resize only)
    // ------------------------------------------------------------------------
    let lastInkMix = -1;
    let lastWashAbyss = -1;
    let waterRaf = 0;
    let unmeasuredFrames = 0;
    const abyssNow = () =>
      isFocus ? 0 : 1 - waterShade(window.scrollY, globeScrollGeometry.start, globeScrollGeometry.travel, viewH) / 255;
    const updateWater = () => {
      waterRaf = 0;
      if (document.hidden) return;
      const abyss = abyssNow();
      // Text, rules and panels follow the same value (the ink flips where the water is mid-tone)
      const inkMix = isFocus ? 0 : inkMixFromAbyss(abyss);
      const inkEndpoint = (inkMix === 0 && lastInkMix !== 0) || (inkMix === 1 && lastInkMix !== 1);
      const changed = Math.abs(inkMix - lastInkMix) > 0.015 || inkEndpoint;
      if (changed || abyssPaletteScoped()) {
        // While the Globe's stage is the whole screen the palette is written on the stage alone
        // (abyssPalette.ts); the root takes it the moment the stage lets go
        const scoped = !isFocus && globeStageFillsScreen(window.scrollY, {
          journeyStart: globeScrollGeometry.start,
          journeyTravel: globeScrollGeometry.travel,
          maxScroll: docScrollable,
          viewHeight: viewH
        });
        if (changed || !scoped) {
          if (changed) lastInkMix = inkMix;
          applyAbyssPalette(lastInkMix, scoped);
        }
      }
      if (!isFocus && abyss !== lastWashAbyss) {
        lastWashAbyss = abyss;
        applyAbyssWash(abyss);
      }
      const rawDepth = Math.max(0, Math.min(1, window.scrollY / docScrollable));
      setSoundDepth(Math.max(abyss, rawDepth * 0.4));
      // A ray out of sight comes back where it would be; one that is due sets out the moment the
      // visitor has descended far enough
      resumeParkedRay();
      tryLaunchRay();
      // The Globe measures its runway after mount: until it has, look again next frame, for a
      // bounded number of frames (a Globe that never measures must not leave a display-rate loop
      // behind); after that, scroll and resize still bring the water up to date
      if (Number.isFinite(globeScrollGeometry.start)) unmeasuredFrames = 0;
      else if (unmeasuredFrames < UNMEASURED_RETRY_FRAMES) { unmeasuredFrames++; scheduleWater(); }
    };
    const scheduleWater = () => {
      if (!waterRaf && !document.hidden) waterRaf = requestAnimationFrame(updateWater);
    };

    // ------------------------------------------------------------------------
    // SONAR — a click in open water sends a ring outward from where it landed (sonarPing.ts)
    // ------------------------------------------------------------------------
    const pings: { x: number; y: number; at: number }[] = [];
    let pingRaf = 0;
    let sized = false;
    const sizeCanvases = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      const w = Math.round(viewW * dpr);
      const h = Math.round(viewH * dpr);
      for (const [canvas, ctx] of [[under, underCtx], [over, overCtx]] as const) {
        if (!canvas || !ctx) continue;
        if (canvas.width !== w || canvas.height !== h) {
          canvas.width = w;
          canvas.height = h;
        }
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      }
      sized = true;
    };
    /** Give the backing stores back once the water is quiet again. */
    const releaseCanvases = () => {
      for (const canvas of [under, over]) {
        if (canvas) { canvas.width = 0; canvas.height = 0; }
      }
      sized = false;
    };

    // ------------------------------------------------------------------------
    // THE DEEP-WATER SILHOUETTE — a distant manta ray glides past now and then, only once the
    // visitor has descended (oceanManta.ts: main's ray, its timing, planform and glyphs). It is
    // drawn on the canvas beneath the whales, after the sonar rings, as on main. Its wait is a
    // timeout; frames run only while it crosses; reduced motion and focus mode never see it.
    // ------------------------------------------------------------------------
    const ray = newMantaRay();
    const mantaTiles = isFocus ? null : bakeMantaAtlas(window.devicePixelRatio || 1);
    let rayTimer = 0;
    /** The wait has run out: the ray sets out as soon as the water is deep enough. */
    let rayDue = false;
    let rayWaitEnds = 0;
    /** Wait left (ms) while the tab is hidden or motion is reduced: the wait does not run then. */
    let rayWaitHeld: number | null = null;
    /** The ray's own clock (s) and the last frame it moved on. */
    let rayClock = 0;
    let rayLastFrame = 0;
    /**
     * When (performance.now) a crossing went out of sight (the visitor went back up the page):
     * it then runs no frames and is moved on by the time that passed when the water is deep
     * again (glideMantaRay), so it is where main's ever-running loop would have it. -1: in sight.
     */
    let rayParkedAt = -1;
    /** When the tab was hidden while parked: hidden time does not count, as on main. */
    let rayHiddenAt = -1;
    const rayMigrating = () => {
      if (isFocus || prefersReducedMotion || migrationRunway.height <= 1) return false;
      const t = migrationAt(window.scrollY, migrationRunway.top, migrationRunway.height, viewH);
      return t.p > 0 && t.handoff < 1;
    };
    const rayVisibility = () =>
      mantaVisibility(Math.max(0, Math.min(1, window.scrollY / docScrollable)), {
        focus: isFocus,
        reduced: prefersReducedMotion,
        migrating: rayMigrating()
      });
    const armRay = (seconds: number) => {
      window.clearTimeout(rayTimer);
      rayTimer = 0;
      rayDue = false;
      if (isFocus || prefersReducedMotion || document.hidden) { rayWaitHeld = seconds * 1000; return; }
      rayWaitHeld = null;
      rayWaitEnds = performance.now() + seconds * 1000;
      rayTimer = window.setTimeout(() => { rayTimer = 0; rayDue = true; tryLaunchRay(); }, seconds * 1000);
    };
    /** Stop the wait where it is (hidden tab, reduced motion); resumeRay picks it up again. */
    const holdRay = () => {
      if (!rayTimer) return;
      window.clearTimeout(rayTimer);
      rayTimer = 0;
      rayWaitHeld = Math.max(0, rayWaitEnds - performance.now());
    };
    const resumeRay = () => {
      if (rayWaitHeld !== null && !isFocus && !prefersReducedMotion && !document.hidden) armRay(rayWaitHeld / 1000);
    };
    const tryLaunchRay = (rnd?: Random) => {
      if (!rayDue || ray.active || !mantaTiles || document.hidden || isFocus || prefersReducedMotion) return;
      if (rayVisibility() <= MANTA_START_VISIBILITY) return;
      rayDue = false;
      launchMantaRay(ray, viewW, viewH, rnd);
      rayParkedAt = -1;
      rayLastFrame = performance.now();
      schedulePings();
    };
    /** A crossing out of sight comes back where it would be by now (or is gone, its wait running). */
    const resumeParkedRay = () => {
      if (!ray.active || rayParkedAt < 0 || document.hidden || rayVisibility() <= 0.01) return;
      const now = performance.now();
      const seconds = (now - rayParkedAt) / 1000;
      rayParkedAt = -1;
      rayClock += seconds;
      rayLastFrame = now;
      const gone = glideMantaRay(ray, seconds, viewW);
      if (gone >= 0) armRay(Math.max(0, ray.wait - gone));
      else schedulePings();
    };
    /** One frame of the crossing on the canvas beneath the whales. */
    const drawRay = (now: number) => {
      const dt = Math.max(0.004, Math.min(0.033, (now - rayLastFrame) * 0.001 || 0.0166));
      rayLastFrame = now;
      rayClock += dt;
      const pose = stepMantaRay(ray, dt * 60, rayClock, viewW, viewH);
      // Gone off the far side: the next one waits 16-32 s, on a timeout
      if (!pose) { armRay(ray.wait); return; }
      const visibility = rayVisibility();
      if (visibility > 0.01 && mantaTiles) {
        drawMantaRay(underCtx, mantaTiles.atlas, mantaTiles.tilePx, pose, visibility, abyssNow(),
          Math.ceil(viewW / MANTA_CELL), Math.ceil(viewH / MANTA_CELL));
      } else if (!pings.length) {
        // Out of sight up the page: no frames until the water is deep again (resumeParkedRay)
        rayParkedAt = now;
      }
    };

    const drawPings = (now: number) => {
      pingRaf = 0;
      if (document.hidden) return;
      const nowS = performance.now() / 1000;
      while (pings.length && nowS - pings[0].at > PING_LIFE_S) pings.shift();
      // Quiet water (no ping, no ray in sight): the canvases give their backing stores back
      const rayInSight = ray.active && rayParkedAt < 0;
      if (!pings.length && !rayInSight) {
        releaseCanvases();
        return;
      }
      if (!sized) sizeCanvases();
      const w = viewW;
      const h = viewH;
      underCtx.clearRect(0, 0, w, h);
      overCtx?.clearRect(0, 0, w, h);

      // The ring: glyphs along a spreading circle, in the water's ink (slate on light water,
      // seafoam in the deep), passing beneath the whales and never over a line of text
      const deep = Math.max(0, Math.min(1, (abyssNow() - 0.4) / 0.25));
      const sonarInk = `rgb(${Math.round(47 + 123 * deep)}, ${Math.round(72 + 152 * deep)}, ${Math.round(88 + 126 * deep)})`;
      const lines = pings.length ? readingZones.read() : [];
      const ctx = underCtx;
      ctx.font = '500 12px "JetBrains Mono", monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = sonarInk;
      for (const ping of pings) {
        const age = nowS - ping.at;
        const strength = pingStrength(age);
        if (strength <= 0.01) continue;
        for (const [offset, share, glyph] of [[0, 1, ':'], [-16, 0.45, '·']] as const) {
          const radius = pingRadius(age) + offset;
          if (radius < 4) continue;
          const count = Math.max(8, Math.round((Math.PI * 2 * radius) / 13));
          ctx.globalAlpha = Math.min(1, strength * share * 0.95);
          for (let k = 0; k < count; k++) {
            const a = (k / count) * Math.PI * 2;
            const x = ping.x + Math.cos(a) * radius;
            const y = ping.y + Math.sin(a) * radius;
            if (x < -8 || x > w + 8 || y < -8 || y > h + 8) continue;
            let behindText = false;
            for (let li = 0; li < lines.length; li++) {
              const r = lines[li];
              if (x > r.left - 4 && x < r.left + r.width + 4 && y > r.top - 4 && y < r.top + r.height + 4) {
                behindText = true;
                break;
              }
            }
            if (!behindText) ctx.fillText(glyph, x, y);
          }
        }
      }
      ctx.globalAlpha = 1;

      // The ray, on the same canvas after the rings (main's order)
      if (rayInSight) drawRay(now);

      // The echoes: each whale the ring reaches answers with a brief bracket of glyphs around
      // the middle of its body, the moment the ring arrives
      const echoCtx = overCtx ?? underCtx;
      if (ambientWhalesLive.presence > 0.1) {
        const bodyLen = Math.min(w, h) * 0.51;
        echoCtx.font = '500 12px "JetBrains Mono", monospace';
        echoCtx.textAlign = 'center';
        echoCtx.textBaseline = 'middle';
        echoCtx.fillStyle = sonarInk;
        for (const ping of pings) {
          const age = nowS - ping.at;
          for (let wi = 0; wi < 2; wi++) {
            const spine = ambientWhalesLive.spines[wi];
            const tx = spine[ECHO_NODE * 2];
            const ty = spine[ECHO_NODE * 2 + 1];
            const tr = bodyLen * ECHO_SCALE[wi] * 0.42;
            const since = age - arrivalTime(Math.hypot(tx - ping.x, ty - ping.y));
            const strength = echoStrength(since);
            if (strength <= 0.01) continue;
            // An open bracket facing back toward the click, widening a little as it fades
            const facing = Math.atan2(ping.y - ty, ping.x - tx);
            const rr = tr * (1 + since * 0.35);
            echoCtx.globalAlpha = strength * 0.85;
            for (let k = -4; k <= 4; k++) {
              const a = facing + k * 0.17;
              echoCtx.fillText(Math.abs(k) === 4 ? '.' : ':', tx + Math.cos(a) * rr, ty + Math.sin(a) * rr);
            }
          }
        }
        echoCtx.globalAlpha = 1;
      }
      pingRaf = requestAnimationFrame(drawPings);
    };
    // A frame is due while a ping lives or a ray crosses, and once more after, to clear and release
    const schedulePings = () => {
      if (!pingRaf && (pings.length || (ray.active && rayParkedAt < 0) || sized) && !document.hidden) pingRaf = requestAnimationFrame(drawPings);
    };
    const handleSonarClick = (e: MouseEvent) => {
      if (prefersReducedMotion || isFocus || e.button !== 0) return;
      if (!isOpenWaterClick(e.target, window.getSelection()?.toString() ?? '')) return;
      pings.push({ x: e.clientX, y: e.clientY, at: performance.now() / 1000 });
      if (pings.length > MAX_PINGS) pings.shift();
      playSonarPing();
      schedulePings();
    };

    // ------------------------------------------------------------------------
    // WIRING
    // ------------------------------------------------------------------------
    const handleResize = () => {
      viewW = window.innerWidth;
      viewH = window.innerHeight;
      docScrollable = Math.max(1, document.documentElement.scrollHeight - viewH);
      if (sized) sizeCanvases();
      scheduleWater();
    };
    const layoutObserver = new ResizeObserver(handleResize);
    layoutObserver.observe(document.documentElement);
    const onVisibility = () => {
      cancelAnimationFrame(waterRaf); waterRaf = 0;
      cancelAnimationFrame(pingRaf); pingRaf = 0;
      // The ray's wait stands still while the tab is hidden (main's loop did not run then either)
      if (document.hidden) { holdRay(); if (rayParkedAt >= 0) rayHiddenAt = performance.now(); }
      else {
        if (rayParkedAt >= 0 && rayHiddenAt >= 0) rayParkedAt += performance.now() - rayHiddenAt;
        rayHiddenAt = -1;
        resumeRay(); rayLastFrame = performance.now(); scheduleWater(); schedulePings();
      }
    };
    const onMotion = () => {
      prefersReducedMotion = motionQuery.matches;
      // Reduced motion: no ray, and no wait running toward one
      if (prefersReducedMotion) { holdRay(); ray.active = false; rayParkedAt = -1; schedulePings(); }
      else resumeRay();
      scheduleWater();
    };
    releaseCanvases();
    // The first ray may come 6-12 s after the ocean appears, as on main
    armRay(ray.wait);
    if ((import.meta as unknown as { env?: { DEV?: boolean } }).env?.DEV && !isFocus) {
      // QA (dev only): send a ray now (a seed makes its course repeatable), and read its state
      (window as unknown as Record<string, unknown>).__oceanManta = {
        force: (seed?: number) => {
          let s = (seed ?? 0) >>> 0;
          const rnd: Random | undefined = seed === undefined ? undefined : () => {
            s = (s + 0x6d2b79f5) >>> 0;
            let t = s;
            t = Math.imul(t ^ (t >>> 15), t | 1);
            t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
            return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
          };
          window.clearTimeout(rayTimer); rayTimer = 0; rayDue = true; ray.active = false;
          tryLaunchRay(rnd);
          return ray.active;
        },
        state: () => ({ ...ray, due: rayDue, waitLeftMs: rayTimer ? Math.round(rayWaitEnds - performance.now()) : rayWaitHeld, clock: rayClock, visibility: rayVisibility() })
      };
    }
    window.addEventListener('resize', handleResize);
    window.addEventListener('scroll', scheduleWater, { passive: true });
    window.addEventListener('click', handleSonarClick);
    document.addEventListener('visibilitychange', onVisibility);
    motionQuery.addEventListener('change', onMotion);
    scheduleWater();

    return () => {
      layoutObserver.disconnect();
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', scheduleWater);
      window.removeEventListener('click', handleSonarClick);
      document.removeEventListener('visibilitychange', onVisibility);
      motionQuery.removeEventListener('change', onMotion);
      cancelAnimationFrame(waterRaf);
      cancelAnimationFrame(pingRaf);
      window.clearTimeout(rayTimer);
      if ((import.meta as unknown as { env?: { DEV?: boolean } }).env?.DEV) delete (window as unknown as Record<string, unknown>).__oceanManta;
      // Nothing may keep the palette on the stage once its writer has gone
      releaseAbyssPalette();
    };
  }, [mode]);

  if (mode === 'off') return null;

  return (
    <div
      aria-hidden="true"
      data-ocean-layer
      className={`fixed inset-0 pointer-events-none transition-opacity duration-500 max-w-full overflow-hidden ${
        mode === 'focus' ? 'z-30 bg-[#F5F3EE]/85 backdrop-blur-[2px]' : 'z-[1]'
      }`}
    >
      <canvas ref={underRef} data-ocean-life width={0} height={0} className="w-full max-w-full h-full block" />
      <AmbientWhaleLayer />
      <canvas ref={overRef} data-ocean-life width={0} height={0} className="absolute inset-0 w-full h-full block" />
    </div>
  );
});
