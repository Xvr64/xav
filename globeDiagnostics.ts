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
  const record = (kind: string, renderedProgress?: number, cityIndex?: number) => {
    const sample = { at: performance.now(), kind, ...controller, documentY: window.scrollY,
      timelineProgress: progress, renderedProgress, cityIndex };
    if (samples.length === 1200) samples.shift();
    samples.push(sample);
    if (kind === 'render') panel.textContent = JSON.stringify(sample, null, 1);
  };
  // Available for device inspection/export while ?globeDebug is enabled in the local server.
  (window as any).__globeDiagnostics = samples;
  return {
    controller(sample: CinematicSnapshot, p: number) { controller = sample; progress = p; record('controller'); },
    render(p: number, city: number) { record('render', p, city); },
    destroy() { panel.remove(); delete (window as any).__globeDiagnostics; }
  };
}
