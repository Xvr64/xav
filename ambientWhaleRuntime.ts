import * as THREE from 'three';
import { WHALE_LOOK, WhaleAsciiRenderer, type WhaleState } from './whale3dRenderer';
import { createConvergenceLayer, type ConvergenceLayer } from './convergenceLayer';
import type { ConvergenceEntry } from './convergenceScene';
import { globeFrame } from './JourneyGlobe';
import { ambientWhalesLive, convergence, convergenceProgress, globeZone, readingZones, smoothStepRange, whaleDirection, whaleStage } from './oceanDirection';
import { ambientCamera, newTravel, noteScrollIntent, projectedBounds, sampleAmbientWhale, stepTravel, type AmbientComposition } from './ambientWhaleScene';
import { qRotate, skinFrames, type Quat } from './whale3dPose';
import type { V3 } from './whale3dAnatomy';
import { globeScrollGeometry, inkMixFromAbyss } from './abyssPalette';
import { waterShade } from './terminalMotion';

const mix = (a: number, b: number, t: number) => a + (b - a) * t;
/** A finite number, or the fallback: one bad frame (a zero-height viewport) must never poison eased state. */
const finite = (x: number, fallback: number) => (Number.isFinite(x) ? x : fallback);

/** One context, geometry and atlas; two skinned meshes; independent ambient/cinematic conductors. */
export function mountAmbientWhales(host: HTMLElement): () => void {
  const canvas = document.createElement('canvas');
  canvas.className = 'absolute inset-0 w-full h-full block pointer-events-none';
  canvas.dataset.whaleRenderer = 'shared-3d';
  host.appendChild(canvas);
  let ascii: WhaleAsciiRenderer;
  try { ascii = new WhaleAsciiRenderer(canvas, { gbufferScale: innerWidth < 768 ? 0.5 : 0.65 }); }
  catch { canvas.remove(); return () => undefined; }
  let cinematic: ConvergenceLayer | null = null;
  let cityKey = '';
  let disposed = false;
  let raf = 0;
  let last = performance.now();
  let lastDraw = 0;
  let seconds = 0;
  let dirty = true;
  let frameCount = 0;
  let meanMs = 0;
  let quality = innerWidth < 768 ? 0.5 : 0.65;
  let viewKey = '';
  let inCinema = false;
  let current: WhaleState[] = [];
  /** The ambient camera as last drawn: with `current`, where the convergence film begins. */
  let lastCamera: ConvergenceEntry['camera'] | null = null;
  let handoff = 0;
  let debugTime: number | null = null;
  let debugAngles: { whale: number; yaw: number; pitch: number; roll: number } | null = null;
  let forceReduced = false;
  let qa: { update(): void; destroy(): void } | undefined;
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  const reduced = () => motion.matches || forceReduced;
  const vw = () => Math.max(1, innerWidth || 1);
  const vh = () => Math.max(1, innerHeight || 1);
  const avoid = [0, 0];
  const composition: AmbientComposition = { width: vw(), height: vh(), scroll: 0, weight: finite(whaleDirection.weight, 0), lanes: whaleDirection.lanes.map(l => ({ ...l })), surfaceY: whaleDirection.surfaceY, avoid };
  /** Share of a screen box covered by reading text (line boxes, capped at 1). */
  const textCover = (rects: ReturnType<typeof readingZones.read>, x0: number, y0: number, x1: number, y1: number) => {
    let sum = 0;
    for (const r of rects) {
      const w = Math.min(x1, r.left + r.width) - Math.max(x0, r.left);
      const h = Math.min(y1, r.top + r.height) - Math.max(y0, r.top);
      if (w > 0 && h > 0) sum += w * h;
    }
    return Math.min(1, sum / Math.max(1, (x1 - x0) * (y1 - y0)));
  };
  /**
   * Composition: where a whale's torso (the densest engraving) has settled over a block of copy,
   * it drifts toward whichever side, above or below, holds less text. Eased, so it reads as the
   * animal choosing open water, never as a correction.
   */
  const composeAround = (dt: number) => {
    const rects = readingZones.read();
    for (let i = 0; i < 2; i++) {
      const sp = ambientWhalesLive.spines[i];
      let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
      for (let n = 10; n <= 30; n++) {
        const x = sp[n * 2], y = sp[n * 2 + 1];
        if (!Number.isFinite(x) || !Number.isFinite(y)) continue;
        x0 = Math.min(x0, x); x1 = Math.max(x1, x); y0 = Math.min(y0, y); y1 = Math.max(y1, y);
      }
      let want = 0;
      if (x1 > x0 && rects.length) {
        const girth = 0.08 * ambientCamera(vw(), vh()).px;
        x0 = Math.max(0, x0 - girth); x1 = Math.min(vw(), x1 + girth);
        y0 -= girth; y1 += girth;
        if (x1 > x0 && y1 > 0 && y0 < vh()) {
          const shift = vh() * 0.3;
          const here = textCover(rects, x0, y0, x1, y1);
          const up = textCover(rects, x0, y0 - shift, x1, y1 - shift);
          const down = textCover(rects, x0, y0 + shift, x1, y1 + shift);
          want = Math.max(-1, Math.min(1, (down - up) * 4)) * 0.07 * Math.min(1, here / 0.12);
        }
      }
      avoid[i] = finite(avoid[i] + (want - avoid[i]) * (1 - Math.exp(-dt / 1.2)), 0);
    }
  };
  // The scroll's direction drives the whales' travel: + down, - up (smoothed, saturating)
  const travel = newTravel(0);
  let lastScroll = scrollY;
  let scrollVel = 0;
  const notify = () => convergence.listeners.forEach(fn => fn());
  const setReady = () => {
    const ready = !!cinematic && !!whaleStage.host && !ascii.lost && !reduced();
    if (convergence.ready !== ready) { convergence.ready = ready; notify(); }
  };
  /**
   * The cinematic view in viewport px: the film draws over the whole viewport (as the ambient
   * whales did), so a whale reaching past the Globe stage's sides is never cut at the hand-over;
   * the Globe sits where its stage places it.
   */
  const stageView = () => {
    const r = whaleStage.host!.getBoundingClientRect();
    const { cx, cy, baseR } = globeFrame(r.width, r.height);
    return { width: vw(), height: vh(), globeX: r.left + cx, globeY: r.top + cy, globeR: baseR * 1.08 };
  };
  /** Where the film begins: the whales and camera exactly as the page last drew them. */
  const captureEntry = (): ConvergenceEntry => {
    const whales = current.length === 2 ? current : [0, 1].map(i => sampleAmbientWhale(i, seconds, composition));
    const z = ambientCamera(vw(), vh());
    return {
      whales: whales.map(w => ({ position: w.position, quaternion: w.quaternion, scale: w.scale, articulation: w.articulation })),
      camera: lastCamera ?? { position: [0, 0, z.z], target: [0, 0, 0], fov: z.fov }
    };
  };
  const prepareCinema = () => {
    const city = whaleStage.firstCity;
    if (city && whaleStage.host && cityKey !== `${city.lon}:${city.lat}`) {
      cinematic?.destroy();
      cinematic = createConvergenceLayer(canvas, city, ascii);
      cityKey = `${city.lon}:${city.lat}`;
    }
    setReady();
  };
  const resize = (w: number, h: number, cinema: boolean) => {
    const dpr = Math.min(devicePixelRatio || 1, w < 768 ? 1 : 1.25);
    const key = `${w}:${h}:${dpr}:${cinema}`;
    if (key === viewKey) return false;
    viewKey = key;
    ascii.resize(w, h, dpr);
    ascii.setStyle({ mode: 'shape', cellW: 6, cellH: 10 });
    return true;
  };
  const publishSpines = () => {
    ascii.camera.updateMatrixWorld();
    const p = new THREE.Vector3();
    current.forEach((w, i) => {
      const frames = skinFrames(w.articulation);
      for (let n = 0; n < 48; n++) {
        const local = qRotate(w.quaternion, [frames.p[n * 4] * w.scale, frames.p[n * 4 + 1] * w.scale, frames.p[n * 4 + 2] * w.scale]);
        p.set(local[0] + w.position[0], local[1] + w.position[1], local[2] + w.position[2]).project(ascii.camera);
        ambientWhalesLive.spines[i][n * 2] = (p.x + 1) * innerWidth / 2;
        ambientWhalesLive.spines[i][n * 2 + 1] = (1 - p.y) * innerHeight / 2;
      }
    });
  };
  /** Advance the scroll signal and the whales' travel by one running frame. */
  const advanceTravel = (dt: number) => {
    const y = scrollY;
    // A jump (anchor link, restore) is not a swim: cap what one frame can contribute
    const dy = Math.max(-vh() * 0.25, Math.min(vh() * 0.25, finite(y - lastScroll, 0)));
    // Observe direction before velocity smoothing can conceal a reversal. Anchor jumps do not
    // trigger a maneuver, and cinematic poses are still sampled from their own timeline.
    if (Math.abs(y - lastScroll) < vh() * 0.25) noteScrollIntent(travel, dy);
    lastScroll = y;
    const raw = dt > 0 ? dy / dt : 0;
    scrollVel = finite(scrollVel + (raw - scrollVel) * (1 - Math.exp(-dt / 0.12)), 0);
    // Even an unhurried reading scroll (a quarter viewport per second) visibly turns the whales;
    // about one viewport per second is a brisk scroll (signal near 0.9)
    composeAround(dt);
    stepTravel(travel, Math.tanh(scrollVel / (vh() * 0.6)), dt, seconds, composition);
  };
  const drawAmbient = (dt: number, h: number) => {
    if (canvas.parentElement !== host) { host.appendChild(canvas); canvas.style.position = ''; }
    resize(vw(), vh(), false);
    const ease = reduced() ? 1 : 1 - Math.exp(-dt * 1.3);
    composition.width = vw(); composition.height = vh();
    composition.weight = finite(composition.weight + (finite(whaleDirection.weight, 0) - composition.weight) * ease, 0);
    composition.lanes.forEach((l, i) => {
      const t = whaleDirection.lanes[i] ?? l;
      l.x = finite(l.x + (t.x - l.x) * ease, 0.5); l.y = finite(l.y + (t.y - l.y) * ease, 0.5);
    });
    composition.surfaceY = whaleDirection.surfaceY;
    // Debug seeks sample the pure paths; otherwise the whales hold their integrated heading
    const live = debugTime === null && !reduced() ? travel : undefined;
    // Approaching the convergence the whales simply swim on, as they are: the film begins from
    // whatever this frame shows (captureEntry), so nothing about them is morphed beforehand
    current = [0, 1].map(i => ({ ...sampleAmbientWhale(i, debugTime ?? seconds, composition, live), dissolve: 0, visible: true }));
    const frame = ambientCamera(vw(), vh());
    const cam = ascii.camera;
    // Slow lateral tracking and a breath of elevation, settling as the convergence nears
    const sway = reduced() ? 0 : 1 - h;
    const tx = 0.05 * Math.sin((seconds * Math.PI * 2) / 97) * sway;
    const ty = 0.035 * Math.sin((seconds * Math.PI * 2) / 131 + 1) * sway;
    const position: V3 = [tx, ty, frame.z];
    const target: V3 = [tx * 0.35, ty * 0.35, 0];
    cam.position.set(...position); cam.up.set(0, 1, 0); cam.lookAt(...target);
    cam.fov = frame.fov; cam.clearViewOffset();
    cam.updateProjectionMatrix();
    lastCamera = { position, target, fov: frame.fov };
    ascii.setOccluder([0, 0, 0], 0, 0);
    const abyss = 1 - waterShade(scrollY, globeScrollGeometry.start, globeScrollGeometry.travel, innerHeight) / 255;
    const ink = inkMixFromAbyss(abyss);
    const presence = reduced() ? (globeZone.rects.length ? 0.5 : 1) : h > 0 ? 1 : whaleDirection.presence;
    // Deep ocean blue on light water (the cinematic scene's own look, so the handoff never shifts),
    // a pale sea-glass on the abyss. Nothing masks or fills behind them: the glyphs are the whale.
    const near = WHALE_LOOK.ink, far = WHALE_LOOK.inkFar;
    ascii.setStyle({ opacity: presence * mix(1 - 0.06 * composition.weight, 1, h), gamma: WHALE_LOOK.gamma, tone: WHALE_LOOK.tone, contrast: WHALE_LOOK.contrast, farFade: WHALE_LOOK.farFade, invert: ink > 0.5,
      ink: [mix(near[0], 196, ink), mix(near[1], 218, ink), mix(near[2], 228, ink)], inkFar: [mix(far[0], 132, ink), mix(far[1], 168, ink), mix(far[2], 182, ink)] });
    if (debugAngles) {
      const d = debugAngles;
      const qy = new THREE.Quaternion().setFromEuler(new THREE.Euler(d.pitch, d.yaw, d.roll, 'YXZ'));
      current[d.whale].quaternion = qy.toArray() as Quat;
    }
    current.forEach((w, i) => ascii.setWhale(i, w));
    ambientWhalesLive.presence = presence;
    ascii.render(false);
    publishSpines();
  };
  const frame = (now: number) => {
    raf = 0;
    if (disposed || document.hidden || ascii.lost) return;
    const dt = Math.min(0.05, Math.max(0, (now - last) / 1000)); last = now;
    prepareCinema();
    const p = convergenceProgress(scrollY);
    const hasStage = convergence.ready && !!whaleStage.host && convergence.length > 0;
    handoff = hasStage ? smoothStepRange(scrollY, convergence.start - innerHeight * 0.95, convergence.start) : 0;
    const cinemaNow = hasStage && scrollY >= convergence.start && p < 1;
    const approaching = hasStage && scrollY < convergence.start && handoff > 0;
    const hiddenByJourney = hasStage && p >= 1 && whaleDirection.presence < 0.002;
    // The whales swim on right up to the film's first frame, which begins from where they are
    const running = !reduced() && !cinemaNow && !hiddenByJourney && debugTime === null;
    if (running) { seconds += dt; advanceTravel(dt); } else lastScroll = scrollY;
    if ((dirty || running) && (dirty || now - lastDraw >= 1000 / 30)) {
      const start = performance.now();
      if (cinemaNow) {
        if (!inCinema) cinematic!.setEntry(captureEntry());
        // In the Globe's stage (its layering), but over the whole viewport like the ambient layer
        if (canvas.parentElement !== whaleStage.host) { whaleStage.host!.appendChild(canvas); canvas.style.position = 'fixed'; }
        const view = stageView();
        if (resize(view.width, view.height, true)) cinematic!.setView(view, Math.min(devicePixelRatio || 1, view.width < 768 ? 1 : 1.25));
        cinematic!.render(p);
        ambientWhalesLive.presence = 0;
      } else if (hiddenByJourney) {
        ascii.clear(); ambientWhalesLive.presence = 0;
      } else drawAmbient(dt, approaching ? handoff : 0);
      inCinema = cinemaNow;
      dirty = false; lastDraw = now; frameCount++;
      meanMs += (performance.now() - start - meanMs) * 0.06;
      if (frameCount % 90 === 0 && meanMs > 19 && quality > 0.36) { quality = Math.max(0.35, quality - 0.1); ascii.setResolution(quality); }
      qa?.update();
    }
    if (running) raf = requestAnimationFrame(frame);
  };
  const schedule = () => { dirty = true; if (!raf && !document.hidden && !disposed) { last = performance.now(); raf = requestAnimationFrame(frame); } };
  const visibility = () => { cancelAnimationFrame(raf); raf = 0; last = performance.now(); if (!document.hidden) schedule(); };
  const onMotion = () => { setReady(); schedule(); };
  ascii.onContextLost = () => { canvas.style.visibility = 'hidden'; setReady(); cancelAnimationFrame(raf); raf = 0; ambientWhalesLive.presence = 0; };
  const restored = () => { canvas.style.visibility = ''; setReady(); viewKey = ''; schedule(); };
  canvas.addEventListener('webglcontextrestored', restored);
  window.addEventListener('scroll', schedule, { passive: true }); window.addEventListener('resize', schedule);
  document.addEventListener('visibilitychange', visibility); motion.addEventListener('change', onMotion);
  convergence.listeners.add(schedule); whaleStage.refresh = schedule;
  const ro = new ResizeObserver(schedule); ro.observe(document.body);
  document.fonts?.ready.then(() => { if (!disposed) { ascii.invalidateAtlas(); schedule(); } });
  if ((import.meta as unknown as { env?: { DEV?: boolean } }).env?.DEV) {
    const win = window as unknown as Record<string, unknown>;
    const api = {
      seek: (t: number | null) => { debugTime = t; debugAngles = null; schedule(); },
      orient: (whale: number, yaw: number, pitch = 0, roll = 0) => { debugAngles = { whale: Math.max(0, Math.min(1, whale)), yaw, pitch, roll }; schedule(); },
      release: () => { debugAngles = null; debugTime = null; schedule(); },
      reduced: (value: boolean) => { forceReduced = value; onMotion(); },
      cinematic: (p: number) => { debugAngles = null; window.scrollTo(0, convergence.start + p * convergence.length); },
      /** Advance the live whales by `sec` at 30 Hz under a fixed scroll signal (−1 up … 1 down). */
      simulate: (sec: number, signal: number) => {
        debugTime = null; debugAngles = null;
        for (let k = 0; k < Math.round(sec * 30); k++) {
          seconds += 1 / 30; composeAround(1 / 30); stepTravel(travel, signal, 1 / 30, seconds, composition);
          // Keep the projected spines current, so the composition sees where each whale now is
          if (!inCinema && k % 6 === 5) drawAmbient(1 / 30, 0);
        }
        lastScroll = scrollY; scrollVel = 0;
        if (!inCinema) drawAmbient(1 / 30, 0);
        return { s: travel.s, pitch: travel.fwd.map(f => (f ? Math.round(Math.asin(f[1]) * 573) / 10 : null)), drift: travel.drift.map(d => Math.round(d * 100) / 100), side: travel.side.map(d => Math.round(d * 100) / 100), avoid: avoid.map(a => Math.round(a * 1000) / 1000) };
      },
      /** Each whale's projected hull on screen (CSS px, flippers and flukes included). */
      bounds: () => current.map(w => {
        const [x0, x1, y0, y1] = projectedBounds(w, ambientCamera(vw(), vh()));
        return { left: Math.round((x0 + 1) * vw() / 2), right: Math.round((x1 + 1) * vw() / 2), top: Math.round((1 - y1) * vh() / 2), bottom: Math.round((1 - y0) * vh() / 2) };
      }),
      state: () => ({ seconds, current, handoff, inCinema, frameCount, meanMs, quality, reduced: reduced(), contexts: 1, parent: canvas.parentElement?.dataset, presence: ambientWhalesLive.presence, travel, camera: ambientCamera(vw(), vh()) }),
      renderer: ascii
    };
    win.__ambientWhales = api;
    if (new URLSearchParams(location.search).has('whaleqa')) import('./ambientWhaleQA').then(({ mountWhaleQA }) => {
      if (!disposed) { qa = mountWhaleQA(api); qa.update(); }
    });
    win.__convergence = { state: convergence, seek: (p: number) => window.scrollTo(0, convergence.start + p * convergence.length) };
  }
  schedule();
  return () => {
    disposed = true; cancelAnimationFrame(raf); ro.disconnect();
    qa?.destroy();
    window.removeEventListener('scroll', schedule); window.removeEventListener('resize', schedule);
    document.removeEventListener('visibilitychange', visibility); motion.removeEventListener('change', onMotion);
    canvas.removeEventListener('webglcontextrestored', restored); convergence.listeners.delete(schedule);
    if (whaleStage.refresh === schedule) whaleStage.refresh = null;
    cinematic?.destroy(); ascii.dispose(); canvas.remove();
    convergence.ready = false; ambientWhalesLive.presence = 0; notify();
    if ((import.meta as unknown as { env?: { DEV?: boolean } }).env?.DEV) { delete (window as unknown as Record<string, unknown>).__ambientWhales; delete (window as unknown as Record<string, unknown>).__convergence; }
  };
}
