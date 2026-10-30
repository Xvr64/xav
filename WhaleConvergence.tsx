import React, { useEffect, useRef } from 'react';
import { convergence, convergenceProgress } from './oceanDirection';
import { globeFrame } from './JourneyGlobe';
import type { ConvergenceLayer } from './convergenceLayer';

/**
 * The convergence's canvas, beneath the Globe in its pinned stage: two 3D ASCII whales circle each
 * other and become the Earth that the journey then travels (convergenceLayer.ts, scene in
 * convergenceScene.ts). Three.js loads on its own once the page is idle, so the cover never waits
 * for it. It draws only when the scroll position changes while the stage is near the screen;
 * stopping the scroll holds the frame. With reduced motion, without WebGL2 or after a lost
 * context it draws nothing and the Globe shows itself throughout (see globeRevealAt).
 */
export const WhaleConvergence: React.FC<{ firstCity: { lon: number; lat: number } }> = React.memo(({ firstCity }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const stage = canvas?.parentElement;
    const runway = canvas?.closest<HTMLElement>('[data-journey-runway]');
    if (!canvas || !stage || !runway) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let layer: ConvergenceLayer | null = null;
    let disposed = false;
    let inView = false;
    let raf = 0;
    let cleared = true;
    const notify = () => convergence.listeners.forEach((fn) => fn());

    const measure = () => {
      if (!layer) return;
      const r = stage.getBoundingClientRect();
      const W = Math.max(1, r.width);
      const H = Math.max(1, r.height);
      const { cx, cy, baseR } = globeFrame(W, H);
      // The Globe's framing at the first city of its journey (its dwell zoom is 1.08)
      layer.setView({ width: W, height: H, globeX: cx, globeY: cy, globeR: baseR * 1.08 }, Math.min(window.devicePixelRatio || 1, 1.5));
    };
    const frame = () => {
      raf = 0;
      if (!layer || layer.lost || convergence.length <= 0) return;
      const p = convergenceProgress(window.scrollY);
      if (p >= 1) {
        // The journey has the Earth now
        if (!cleared) layer.clear();
        cleared = true;
        return;
      }
      layer.render(p);
      cleared = false;
    };
    const schedule = () => {
      if (inView && !raf) raf = requestAnimationFrame(frame);
    };
    const onResize = () => {
      measure();
      schedule();
    };

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) inView = e.isIntersecting;
        if (inView) schedule();
        else if (layer && !cleared) {
          layer.clear();
          cleared = true;
        }
      },
      { rootMargin: '100px 0px 100px 0px' }
    );
    io.observe(stage);
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', onResize);

    const start = () =>
      import('./convergenceLayer')
        .then(({ createConvergenceLayer }) => {
          if (disposed) return;
          try {
            layer = createConvergenceLayer(canvas, firstCity);
          } catch {
            return; // no WebGL2: the Globe keeps its own Earth throughout
          }
          layer.onContextLost = () => {
            convergence.ready = false;
            canvas.style.visibility = 'hidden';
            notify();
          };
          measure();
          convergence.ready = true;
          notify();
          // Development: seek the sequence from the console (__convergence.seek(0.35))
          if ((import.meta as unknown as { env?: { DEV?: boolean } }).env?.DEV) {
            (window as unknown as { __convergence: unknown }).__convergence = {
              state: convergence,
              seek: (p: number) => window.scrollTo(0, convergence.start + p * convergence.length)
            };
          }
          schedule();
          // Glyphs are drawn from the web font: re-bake them once it has loaded
          document.fonts?.ready.then(() => !disposed && onResize()).catch(() => undefined);
        })
        .catch(() => undefined);
    const idle = (window as unknown as { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number }).requestIdleCallback;
    const idleId = idle ? idle(start, { timeout: 2500 }) : window.setTimeout(start, 800);

    return () => {
      disposed = true;
      const cancelIdle = (window as unknown as { cancelIdleCallback?: (id: number) => void }).cancelIdleCallback;
      if (idle && cancelIdle) cancelIdle(idleId);
      else window.clearTimeout(idleId);
      io.disconnect();
      cancelAnimationFrame(raf);
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', onResize);
      layer?.destroy();
      convergence.ready = false;
      notify();
    };
  }, [firstCity]);

  return <canvas ref={canvasRef} aria-hidden="true" className="absolute inset-0 w-full h-full block pointer-events-none" />;
});
