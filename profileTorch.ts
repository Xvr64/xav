/**
 * The diver's light over the Profile's depth photographs.
 *
 * Each resting photograph is two layers: the depth-graded copy (profileDepthGrade.ts) and the
 * original <img> above it, fully masked. Near the pointer the mask opens on a soft, gaussian-like
 * falloff, so the original colours come back where the light is and nowhere else. A second,
 * slower and wider lobe trails the light as it moves, so the lit area drifts like light in
 * water instead of reading as a circle.
 *
 * The light is physical rather than per photograph: it falls on whichever plates are within its
 * reach, so it never snaps between neighbours. It brightens over a moment when it arrives and,
 * once the pointer leaves, lingers and then fades; the reds go first again.
 *
 * Touch: a finger lights the photograph it rests on and the light follows it; after lifting it
 * lingers briefly before fading. Nothing here takes scroll, touch-action or default behaviour,
 * so the magnetic controller and its gestures are untouched.
 *
 * Cost: listeners are attached only while the Profile is on screen, the loop runs only while a
 * light is alive, plate boxes are measured once per scroll/resize, and each frame writes one
 * mask-image to each lit photograph (a few small, isolated elements; nothing on <html>).
 */

interface Plate {
  frame: HTMLElement;
  aperture: HTMLElement;
  img: HTMLImageElement;
  cx: number;
  cy: number;
  w: number;
  h: number;
  cos: number;
  sin: number;
  lit: boolean;
}

const clamp01 = (v: number) => (v <= 0 ? 0 : v >= 1 ? 1 : v);

// Gaussian-like falloff as gradient stops: [radius fraction, opacity]
const FALLOFF: readonly [number, number][] = [
  [0, 1],
  [0.16, 0.97],
  [0.3, 0.88],
  [0.44, 0.71],
  [0.58, 0.49],
  [0.71, 0.28],
  [0.83, 0.12],
  [0.93, 0.035],
  [1, 0]
];

function lobe(x: number, y: number, r: number, a: number) {
  let stops = '';
  for (let i = 0; i < FALLOFF.length; i++) {
    const [f, o] = FALLOFF[i];
    stops += `, rgba(0,0,0,${(o * a).toFixed(3)}) ${(f * 100).toFixed(0)}%`;
  }
  return `radial-gradient(circle ${r.toFixed(1)}px at ${x.toFixed(1)}px ${y.toFixed(1)}px${stops})`;
}

export function mountProfileTorch(itinerary: HTMLElement): () => void {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  const plates: Plate[] = Array.from(itinerary.querySelectorAll<HTMLElement>('.profile-city-frame')).flatMap((frame) => {
    const aperture = frame.querySelector<HTMLElement>('.profile-city-aperture');
    const img = frame.querySelector<HTMLImageElement>('.profile-city-photo-layer > img');
    return aperture && img ? [{ frame, aperture, img, cx: 0, cy: 0, w: 0, h: 0, cos: 1, sin: 0, lit: false }] : [];
  });

  // Pointer target, the light's head and its slower trailing lobe (viewport px)
  let px = 0;
  let py = 0;
  let hx = 0;
  let hy = 0;
  let tx = 0;
  let ty = 0;
  let placed = false;
  // Light strength: rises when the pointer is over the plates, lingers, then fades
  let strength = 0;
  let wanted = 0;
  let lingerUntil = 0;
  let touching = false;
  let measured = false;
  let raf = 0;
  let last = 0;
  let inView = false;
  let radius = 90;

  const measure = () => {
    let sum = 0;
    let n = 0;
    for (const p of plates) {
      const r = p.aperture.getBoundingClientRect();
      p.w = p.aperture.offsetWidth;
      p.h = p.aperture.offsetHeight;
      p.cx = r.left + r.width / 2;
      p.cy = r.top + r.height / 2;
      const rot = (-Number(p.frame.dataset.plateRot || '0') * Math.PI) / 180;
      p.cos = Math.cos(rot);
      p.sin = Math.sin(rot);
      if (p.w > 0) {
        sum += Math.hypot(p.w, p.h);
        n++;
      }
    }
    // The light spans most of one photograph, so part of every plate stays at depth
    radius = n ? Math.max(46, Math.min(130, (sum / n) * 0.4)) : 72;
    measured = true;
  };

  const ready = (p: Plate) => p.frame.dataset.depth === 'ready' && p.frame.dataset.memoryPhase === 'photo';

  /** Is the point over (or just beside) a resting photograph? */
  const overPlate = (x: number, y: number, margin: number) => {
    for (const p of plates) {
      if (!ready(p) || p.w <= 0) continue;
      if (Math.abs(x - p.cx) <= p.w / 2 + margin && Math.abs(y - p.cy) <= p.h / 2 + margin) return true;
    }
    return false;
  };

  const clear = (p: Plate) => {
    if (!p.lit) return;
    p.lit = false;
    p.img.style.removeProperty('mask-image');
    p.img.style.removeProperty('-webkit-mask-image');
  };

  const tick = (now: number) => {
    raf = 0;
    const dt = Math.min(0.05, last ? (now - last) / 1000 : 0.016);
    last = now;
    if (!measured) measure();

    const snappy = reduce.matches;
    // Head follows closely; the trail lags further behind (frame-rate independent smoothing)
    const kh = snappy ? 1 : 1 - Math.exp(-dt / 0.085);
    const kt = snappy ? 1 : 1 - Math.exp(-dt / 0.32);
    hx += (px - hx) * kh;
    hy += (py - hy) * kh;
    tx += (hx - tx) * kt;
    ty += (hy - ty) * kt;

    const target = wanted > 0 || now < lingerUntil ? 1 : 0;
    // Arrives over ~0.35 s; fades over ~1.4 s
    const rate = target > strength ? 1 / 0.35 : 1 / 1.4;
    strength = target > strength ? Math.min(target, strength + dt * rate) : Math.max(target, strength - dt * rate);
    const s = strength * strength * (3 - 2 * strength);

    // The trail opens a little wider while the light is moving
    const speed = Math.hypot(hx - tx, hy - ty);
    const trailR = radius * (1.08 + Math.min(0.35, speed / (radius * 2.5)));
    const trailA = 0.42 * clamp01(speed / (radius * 0.35));

    const alive = s > 0.002;
    for (const p of plates) {
      if (!alive || !ready(p) || p.w <= 0) {
        clear(p);
        continue;
      }
      // Is any of the light on this plate?
      const reach = Math.max(radius, trailR);
      const dx = Math.max(0, Math.abs(hx - p.cx) - p.w / 2);
      const dy = Math.max(0, Math.abs(hy - p.cy) - p.h / 2);
      const tdx = Math.max(0, Math.abs(tx - p.cx) - p.w / 2);
      const tdy = Math.max(0, Math.abs(ty - p.cy) - p.h / 2);
      if (Math.hypot(dx, dy) > reach && Math.hypot(tdx, tdy) > reach) {
        clear(p);
        continue;
      }
      // Viewport → the plate's own (slightly tilted) frame
      const hxr = hx - p.cx;
      const hyr = hy - p.cy;
      const lx = hxr * p.cos - hyr * p.sin + p.w / 2;
      const ly = hxr * p.sin + hyr * p.cos + p.h / 2;
      const txr = tx - p.cx;
      const tyr = ty - p.cy;
      const lx2 = txr * p.cos - tyr * p.sin + p.w / 2;
      const ly2 = txr * p.sin + tyr * p.cos + p.h / 2;
      let mask = lobe(lx, ly, radius, s);
      if (trailA * s > 0.01) mask += ', ' + lobe(lx2, ly2, trailR, trailA * s);
      p.img.style.setProperty('-webkit-mask-image', mask);
      p.img.style.setProperty('mask-image', mask);
      p.lit = true;
    }

    // Keep going while the light moves, brightens, fades or lingers; a still pointer over a
    // fully lit plate costs nothing until it moves again
    const settling = Math.abs(px - hx) + Math.abs(py - hy) + Math.abs(hx - tx) + Math.abs(hy - ty) > 0.3;
    const lingering = wanted === 0 && now < lingerUntil;
    if (strength !== target || lingering || (settling && alive)) schedule();
  };

  const schedule = () => {
    if (!raf) raf = requestAnimationFrame(tick);
  };

  const point = (x: number, y: number) => {
    px = x;
    py = y;
    if (!placed) {
      hx = tx = x;
      hy = ty = y;
      placed = true;
    }
  };

  const onMove = (e: PointerEvent) => {
    if (!inView) return;
    if (e.pointerType === 'touch' && !touching) return;
    if (!measured) measure();
    const over = overPlate(e.clientX, e.clientY, radius * 0.25);
    // A fresh light starts where the pointer is, not where the last one faded
    if (over && strength <= 0.002) placed = false;
    // Off the photographs the light stays where it last touched them and fades there
    if (over || touching) point(e.clientX, e.clientY);
    if (over) wanted = 1;
    else if (wanted) {
      wanted = 0;
      lingerUntil = performance.now() + (e.pointerType === 'touch' ? 900 : 260);
    }
    if (over || strength > 0) schedule();
  };

  const onDown = (e: PointerEvent) => {
    if (!inView || e.pointerType !== 'touch') return;
    measure();
    if (!overPlate(e.clientX, e.clientY, 8)) return;
    touching = true;
    placed = strength > 0.002;
    point(e.clientX, e.clientY);
    wanted = 1;
    schedule();
  };

  const onUp = (e: PointerEvent) => {
    if (e.pointerType !== 'touch' || !touching) return;
    touching = false;
    wanted = 0;
    lingerUntil = performance.now() + 1500;
    schedule();
  };

  const onLeave = () => {
    if (!wanted) return;
    wanted = 0;
    lingerUntil = performance.now() + 260;
    schedule();
  };

  const invalidate = () => {
    measured = false;
    if (strength > 0) schedule();
  };

  const listen = (on: boolean) => {
    const m = on ? 'addEventListener' : 'removeEventListener';
    window[m]('pointermove', onMove as EventListener, { passive: true } as AddEventListenerOptions);
    window[m]('pointerdown', onDown as EventListener, { passive: true } as AddEventListenerOptions);
    window[m]('pointerup', onUp as EventListener, { passive: true } as AddEventListenerOptions);
    window[m]('pointercancel', onUp as EventListener, { passive: true } as AddEventListenerOptions);
    window[m]('scroll', invalidate, { passive: true } as AddEventListenerOptions);
    window[m]('resize', invalidate, { passive: true } as AddEventListenerOptions);
    document.documentElement[m]('pointerleave', onLeave);
  };

  const io = new IntersectionObserver((entries) => {
    const visible = entries.some((e) => e.isIntersecting);
    if (visible === inView) return;
    inView = visible;
    measured = false;
    listen(visible);
    if (!visible) {
      wanted = 0;
      touching = false;
      strength = 0;
      lingerUntil = 0;
      plates.forEach(clear);
    }
  });
  io.observe(itinerary);

  return () => {
    io.disconnect();
    if (inView) listen(false);
    inView = false;
    cancelAnimationFrame(raf);
    raf = 0;
    plates.forEach(clear);
  };
}
