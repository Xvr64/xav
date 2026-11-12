import type { CinematicSnapshot } from './cinematicScroll';

/** Opt-in local diagnostics. No console traffic, DOM or frame allocations when disabled. */
export function mountGlobeDiagnostics(stage: HTMLElement) {
  if (!(import.meta as any).env?.DEV || !new URLSearchParams(window.location.search).has('globeDebug')) return null;
  const samples: Record<string, unknown>[] = [];
  const panel = document.createElement('pre');
  panel.setAttribute('data-globe-diagnostics', '');
  panel.style.cssText = 'position:fixed;bottom:8px;left:8px;z-index:9999;margin:0;padding:8px;background:#001d;color:#fff;font:10px monospace;pointer-events:none';
  stage.appendChild(panel);
  let controller: CinematicSnapshot | null = null;
  let progress = 0;
  let lastPanelUpdate = -Infinity;
  let lastFrameCount = -1;
  const record = (
    kind: string,
    renderedProgress?: number,
    cityIndex?: number,
    drawMs?: number,
    city?: string,
    frameCount?: number,
    visibilityStale?: boolean
  ) => {
    const producingFrames = typeof frameCount === 'number' ? frameCount > lastFrameCount : undefined;
    if (typeof frameCount === 'number') lastFrameCount = frameCount;
    const sample = {
      at: performance.now(),
      kind,
      ...controller,
      documentY: window.scrollY,
      actualY: window.scrollY,
      timelineProgress: progress,
      renderedProgress,
      city,
      cityIndex,
      frameCount,
      producingFrames,
      visibilityStale,
      drawMs,
      dpr: window.devicePixelRatio,
      layoutHeight: window.innerHeight,
      visualHeight: window.visualViewport?.height,
      visualScale: window.visualViewport?.scale
    };
    if (samples.length === 1200) samples.shift();
    samples.push(sample);
    if ((kind === 'render' || kind === 'controller') && sample.at - lastPanelUpdate >= 250) {
      panel.textContent = JSON.stringify(sample, null, 1);
      lastPanelUpdate = sample.at;
    }
  };
  // Available for device inspection/export while ?globeDebug is enabled in the local server.
  (window as any).__globeDiagnostics = samples;
  return {
    controller(sample: CinematicSnapshot, p: number) { controller = sample; progress = p; record('controller'); },
    render(p: number, cityIndex: number, drawMs?: number, city?: string, frameCount?: number, visibilityStale?: boolean) {
      record('render', p, cityIndex, drawMs, city, frameCount, visibilityStale);
    },
    destroy() { panel.remove(); delete (window as any).__globeDiagnostics; }
  };
}
