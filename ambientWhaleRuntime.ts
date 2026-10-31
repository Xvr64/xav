import * as THREE from 'three';
import { WHALE_LOOK, WhaleAsciiRenderer, type WhaleState } from './whale3dRenderer';
import { createConvergenceLayer, type ConvergenceLayer } from './convergenceLayer';
import { sampleConvergence } from './convergenceScene';
import { globeFrame } from './JourneyGlobe';
import { ambientWhalesLive, convergence, convergenceProgress, globeZone, heroZone, readingZones, smoothStepRange, whaleDirection, whaleStage } from './oceanDirection';
import { ambientCamera, newTravel, sampleAmbientWhale, stepTravel, type AmbientComposition } from './ambientWhaleScene';
import { qConj, qMul, qRotate, qSlerp, vLerp, skinFrames, type Articulation, type Quat } from './whale3dPose';
import { globeScrollGeometry, inkMixFromAbyss } from './abyssPalette';
import { waterShade } from './terminalMotion';

const mix = (a: number, b: number, t: number) => a + (b - a) * t;
/** A finite number, or the fallback: one bad frame (a zero-height viewport) must never poison eased state. */
const finite = (x: number, fallback: number) => (Number.isFinite(x) ? x : fallback);
function blendArticulation(a: Articulation, b: Articulation, t: number): Articulation {
  const fin = (x: Articulation['flipperL'], y: Articulation['flipperL']) => ({ sweep: mix(x.sweep, y.sweep, t), dihedral: mix(x.dihedral, y.dihedral, t), twist: mix(x.twist, y.twist, t) });
  const strokeDelta = Math.atan2(Math.sin(b.stroke - a.stroke), Math.cos(b.stroke - a.stroke));
  return { stroke: a.stroke + strokeDelta * t, amplitude: mix(a.amplitude, b.amplitude, t), bendYaw: mix(a.bendYaw, b.bendYaw, t), bendPitch: mix(a.bendPitch, b.bendPitch, t), flipperL: fin(a.flipperL, b.flipperL), flipperR: fin(a.flipperR, b.flipperR), fluke: mix(a.fluke, b.fluke, t), flukeFlex: mix(a.flukeFlex, b.flukeFlex, t) };
}

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
  let maskDirty = true;
  let lastZones: ReturnType<typeof readingZones.read> | null = null;
  let lastHeroVersion = -1;
  let lastGlobeVersion = -1;
  let frameCount = 0;
  let meanMs = 0;
  let quality = innerWidth < 768 ? 0.5 : 0.65;
  let viewKey = '';
  let inCinema = false;
  let anchor: WhaleState[] | null = null;
  let current: WhaleState[] = [];
  let handoff = 0;
  let debugTime: number | null = null;
  let debugAngles: { whale: number; yaw: number; pitch: number; roll: number } | null = null;
  let forceReduced = false;
  let qa: { update(): void; destroy(): void } | undefined;
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  const reduced = () => motion.matches || forceReduced;
  const vw = () => Math.max(1, innerWidth || 1);
  const vh = () => Math.max(1, innerHeight || 1);
  const composition: AmbientComposition = { width: vw(), height: vh(), scroll: 0, weight: finite(whaleDirection.weight, 0), lanes: whaleDirection.lanes.map(l => ({ ...l })), surfaceY: whaleDirection.surfaceY };
  // The scroll's direction drives the whales' travel: + down, - up (smoothed, saturating)
  const travel = newTravel(0);
  let lastScroll = scrollY;
  let scrollVel = 0;
  const notify = () => convergence.listeners.forEach(fn => fn());
  const setReady = () => {
    const ready = !!cinematic && !!whaleStage.host && !ascii.lost && !reduced();
    if (convergence.ready !== ready) { convergence.ready = ready; notify(); }
  };
  const stageView = () => {
    const r = whaleStage.host!.getBoundingClientRect();
    const { cx, cy, baseR } = globeFrame(r.width, r.height);
    return { r, view: { width: r.width, height: r.height, globeX: cx, globeY: cy, globeR: baseR * 1.08 } };
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
    maskDirty = true;
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
    lastScroll = y;
    const raw = dt > 0 ? dy / dt : 0;
    scrollVel = finite(scrollVel + (raw - scrollVel) * (1 - Math.exp(-dt / 0.18)), 0);
    // About one viewport per second reads as a brisk scroll (signal near 0.8)
    stepTravel(travel, Math.tanh(scrollVel / (vh() * 0.9)), dt, seconds, composition);
  };
  const drawAmbient = (dt: number, h: number) => {
    if (canvas.parentElement !== host) host.appendChild(canvas);
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
    const sampled = [0, 1].map(i => ({ ...sampleAmbientWhale(i, debugTime ?? seconds, composition, live), dissolve: 0, visible: true }));
    if (h <= 0 || !anchor) anchor = sampled;
    current = h > 0 ? anchor.map(w => ({ ...w })) : sampled;
    const frame = ambientCamera(vw(), vh());
    const cam = ascii.camera;
    // Slow lateral tracking and a breath of elevation, faded out into the cinematic handoff
    const sway = reduced() ? 0 : 1 - h;
    const tx = 0.05 * Math.sin((seconds * Math.PI * 2) / 97) * sway;
    const ty = 0.035 * Math.sin((seconds * Math.PI * 2) / 131 + 1) * sway;
    cam.position.set(tx, ty, frame.z); cam.up.set(0, 1, 0); cam.lookAt(tx * 0.35, ty * 0.35, 0);
    cam.fov = frame.fov; cam.clearViewOffset();
    if (h > 0 && whaleStage.host) {
      const { r, view } = stageView();
      const f = sampleConvergence(0, view);
      const sourceCam = new THREE.PerspectiveCamera(f.camera.fov, view.width / view.height);
      sourceCam.position.set(...f.camera.position); sourceCam.up.set(...f.camera.up); sourceCam.lookAt(0, 0, 0);
      const inv = qConj(sourceCam.quaternion.toArray() as Quat);
      const k = frame.z / sourceCam.position.length();
      current = current.map((a, i) => {
        const b = f.whales[i];
        const p = qRotate(inv, [b.position[0] - f.camera.position[0], b.position[1] - f.camera.position[1], b.position[2] - f.camera.position[2]]);
        return { ...a, position: vLerp(a.position, [p[0] * k, p[1] * k, p[2] * k + frame.z], h), quaternion: qSlerp(a.quaternion, qMul(inv, b.quaternion), h), scale: mix(a.scale, b.scale * k, h), articulation: blendArticulation(a.articulation, b.articulation, h) };
      });
      const targetFov = Math.atan(Math.tan(f.camera.fov * Math.PI / 360) * vh() / view.height) * 360 / Math.PI;
      cam.fov = mix(frame.fov, targetFov, h);
      cam.setViewOffset(vw(), vh(), (vw() / 2 - r.left - f.camera.centerX) * h, (vh() / 2 - r.top - f.camera.centerY) * h, vw(), vh());
    }
    cam.updateProjectionMatrix();
    ascii.setOccluder([0, 0, 0], 0, 0);
    const abyss = 1 - waterShade(scrollY, globeScrollGeometry.start, globeScrollGeometry.travel, innerHeight) / 255;
    const ink = inkMixFromAbyss(abyss);
    const water = (1 - abyss) * 255;
    const presence = reduced() ? (globeZone.rects.length ? 0.35 : 0.8) : h > 0 ? 1 : whaleDirection.presence;
    // Deep blue on light water (the cinematic scene's own look, so the handoff never shifts), pale
    // on the abyss; the silhouette clears the water behind it so the form reads over the ocean field
    const near = WHALE_LOOK.ink, far = WHALE_LOOK.inkFar;
    ascii.setStyle({ opacity: presence * mix(1 - 0.06 * composition.weight, 1, h), gamma: WHALE_LOOK.gamma, tone: WHALE_LOOK.tone, contrast: WHALE_LOOK.contrast, farFade: WHALE_LOOK.farFade, invert: ink > 0.5, water: [water, water, water], waterOpacity: 0.82 * (1 - h),
      ink: [mix(near[0], 178, ink), mix(near[1], 204, ink), mix(near[2], 214, ink)], inkFar: [mix(far[0], 112, ink), mix(far[1], 151, ink), mix(far[2], 165, ink)] });
    const zones = readingZones.read();
    if (maskDirty || h > 0 || zones !== lastZones || lastHeroVersion !== heroZone.version || lastGlobeVersion !== globeZone.version) {
      ascii.setReadingZones([...zones, ...heroZone.rects, ...(h > 0 ? [] : globeZone.rects)], 1 - h);
      lastZones = zones; lastHeroVersion = heroZone.version; lastGlobeVersion = globeZone.version;
      maskDirty = false;
    }
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
    const running = !reduced() && !cinemaNow && !approaching && !hiddenByJourney && debugTime === null;
    if (running) { seconds += dt; advanceTravel(dt); } else lastScroll = scrollY;
    if ((dirty || running) && (dirty || now - lastDraw >= 1000 / 30)) {
      const start = performance.now();
      if (cinemaNow) {
        if (canvas.parentElement !== whaleStage.host) whaleStage.host!.appendChild(canvas);
        const { view } = stageView();
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
  const schedule = () => { dirty = true; maskDirty = true; if (!raf && !document.hidden && !disposed) { last = performance.now(); raf = requestAnimationFrame(frame); } };
  const visibility = () => { cancelAnimationFrame(raf); raf = 0; last = performance.now(); if (!document.hidden) schedule(); };
  const onMotion = () => { anchor = null; setReady(); schedule(); };
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
      seek: (t: number | null) => { debugTime = t; debugAngles = null; anchor = null; schedule(); },
      orient: (whale: number, yaw: number, pitch = 0, roll = 0) => { debugAngles = { whale: Math.max(0, Math.min(1, whale)), yaw, pitch, roll }; schedule(); },
      release: () => { debugAngles = null; debugTime = null; schedule(); },
      reduced: (value: boolean) => { forceReduced = value; onMotion(); },
      cinematic: (p: number) => { debugAngles = null; window.scrollTo(0, convergence.start + p * convergence.length); },
      /** Advance the live whales by `sec` at 30 Hz under a fixed scroll signal (−1 up … 1 down). */
      simulate: (sec: number, signal: number) => {
        debugTime = null; debugAngles = null; anchor = null;
        for (let k = 0; k < Math.round(sec * 30); k++) { seconds += 1 / 30; stepTravel(travel, signal, 1 / 30, seconds, composition); }
        lastScroll = scrollY; scrollVel = 0;
        if (!inCinema) drawAmbient(1 / 30, 0);
        return { s: travel.s, pitch: travel.fwd.map(f => (f ? Math.round(Math.asin(f[1]) * 573) / 10 : null)), drift: travel.drift.map(d => Math.round(d * 100) / 100) };
      },
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
