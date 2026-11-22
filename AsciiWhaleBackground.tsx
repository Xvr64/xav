import React, { useEffect, useRef } from 'react';
import { AmbientWhaleLayer } from './AmbientWhaleLayer';
import { playSonarPing, setSoundDepth } from './decodeAudio';
import { MAX_PINGS, arrivalTime, echoStrength, isOpenWaterClick, pingRadius, pingStrength } from './sonarPing';
import { waterShade } from './terminalMotion';
import { applyAbyssPalette, applyAbyssWash, abyssPaletteScoped, globeScrollGeometry, inkMixFromAbyss } from './abyssPalette';
import { ambientWhalesLive, readingZones } from './oceanDirection';
import { globeStageFillsScreen } from './oceanWorld';

export interface AsciiWhaleBackgroundProps {
  mode: 'ambient' | 'focus' | 'off';
}

/** Seconds a sonar ping lives (its ring and the whales' echoes), as before. */
const PING_LIFE_S = 3;
/** Spine node (of the whales' 48) the echoes answer from: the body's middle, as before. */
const ECHO_NODE = 24;
/** Echo radius per whale, as a share of the main whale's on-screen body length. */
const ECHO_SCALE = [1.0, 0.58];

/**
 * The ocean layer: the shared 3D whales (AmbientWhaleLayer) between two 2D sonar canvases, and
 * the page's palette, lantern depth and sound depth, which follow the scroll.
 *
 * Nothing here runs on its own. The palette, the lantern and the sound are brought up to date
 * once per frame in which the page scrolled or changed size (one coalesced rAF); the 2D canvases
 * hold no pixels and no backing store until an open-water click sends a ping, and then draw for
 * the ping's three seconds only. (The 2D whales, fish, wake, manta and generative water this file
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
      // The Globe measures its runway after mount: until it has, look again next frame
      if (!Number.isFinite(globeScrollGeometry.start)) scheduleWater();
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
    const drawPings = () => {
      pingRaf = 0;
      if (document.hidden) return;
      const nowS = performance.now() / 1000;
      while (pings.length && nowS - pings[0].at > PING_LIFE_S) pings.shift();
      if (!pings.length) {
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
      const lines = readingZones.read();
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
    // A frame is due while a ping lives, and once more after the last, to clear and release
    const schedulePings = () => {
      if (!pingRaf && (pings.length || sized) && !document.hidden) pingRaf = requestAnimationFrame(drawPings);
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
      if (!document.hidden) { scheduleWater(); schedulePings(); }
    };
    const onMotion = () => { prefersReducedMotion = motionQuery.matches; scheduleWater(); };
    releaseCanvases();
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
