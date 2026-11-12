/** Supplemental surface invalidation. Never uses visualViewport height as timeline geometry:
 * Safari's toolbar/pinch viewport and the sticky layout viewport are different coordinate spaces.
 */
export function observeGlobeSurface(stage: HTMLElement, refresh: () => void) {
  let resolution: MediaQueryList;
  const onDensity = () => { watchDensity(); refresh(); };
  const watchDensity = () => {
    resolution?.removeEventListener('change', onDensity);
    resolution = window.matchMedia(`(resolution: ${window.devicePixelRatio || 1}dppx)`);
    resolution.addEventListener('change', onDensity);
  };
  watchDensity();
  const observer = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(refresh) : null;
  observer?.observe(stage);
  window.visualViewport?.addEventListener('resize', refresh, { passive: true });
  return () => {
    resolution.removeEventListener('change', onDensity);
    observer?.disconnect();
    window.visualViewport?.removeEventListener('resize', refresh);
  };
}
