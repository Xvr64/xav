/**
 * The lantern cursor: a small core and a thin ring that follow the pointer through the water.
 * At the surface it is a quiet slate-blue mark; as the page descends into the dark it becomes
 * a pale seafoam light with a soft halo, like the lure of a deep-sea fish. Depth is the page's
 * own `abyss` value (the same one that darkens the water), so the cursor never keeps a timeline
 * of its own: scrolling back up reverses it exactly.
 *
 * Layers: the halo sits between the ocean canvases and the page content, so it lights the water
 * without washing over text; the core, ring and click ripple sit above everything. All motion is
 * transform/opacity only, driven by one rAF loop that sleeps whenever the cursor is at rest.
 */

type RGB = readonly [number, number, number];

/** Surface ink: the muted ocean blue-grey of the fluid's ink on white. */
const SLATE: RGB = [47, 72, 88];
/** Deep core: near-white with a breath of aqua. */
const PALE: RGB = [226, 244, 240];
/** Deep ring and halo: desaturated seafoam, never neon. */
const SEAFOAM: RGB = [150, 214, 204];

const clamp01 = (v: number) => Math.max(0, Math.min(1, v));
const smooth = (v: number, a: number, b: number) => {
  const t = clamp01((v - a) / (b - a));
  return t * t * (3 - 2 * t);
};
const mix = (a: RGB, b: RGB, t: number): RGB => [
  Math.round(a[0] + (b[0] - a[0]) * t),
  Math.round(a[1] + (b[1] - a[1]) * t),
  Math.round(a[2] + (b[2] - a[2]) * t)
];
const rgba = (c: RGB, a: number) => `rgba(${c[0]}, ${c[1]}, ${c[2]}, ${Math.round(a * 1000) / 1000})`;

export type LanternLook = {
  core: RGB;
  coreAlpha: number;
  /** Contrasting hairline around the core while its tone crosses the mid-grey water. */
  edgeAlpha: number;
  ring: RGB;
  ringAlpha: number;
  /** Halo opacity: none at the surface, a soft glow in the deep. */
  glow: number;
  /** Halo size multiplier. */
  glowScale: number;
  /** Follow time constants (ms): the ring and halo drift a little more in deeper water. */
  ringLag: number;
  haloLag: number;
};

/**
 * Pure: the cursor's whole look at a given abyss depth (0 white water → 1 black water).
 * The core flips from slate to pale where the water is mid-tone (the same place the page's ink
 * flips), and the glow grows from the middle of the descent to the bottom.
 */
export function lanternLook(depth: number): LanternLook {
  const d = clamp01(depth);
  const flip = smooth(d, 0.46, 0.6);
  const glow = smooth(d, 0.28, 1);
  return {
    core: mix(SLATE, PALE, flip),
    coreAlpha: 0.88 + 0.12 * flip,
    // A white hairline across the whole mid-tone band, where neither dark nor pale stands out
    edgeAlpha: 0.75 * smooth(1 - Math.abs(d - 0.53) / 0.17, 0, 1),
    ring: mix(SLATE, SEAFOAM, flip),
    ringAlpha: 0.36 + 0.06 * glow,
    glow: 0.62 * glow ** 1.15,
    glowScale: 0.82 + 0.3 * glow,
    ringLag: 70 + 35 * glow,
    haloLag: 140 + 70 * glow
  };
}

// --- DOM controller ----------------------------------------------------------------------------

let applyDepth: ((depth: number) => void) | null = null;
let pendingDepth = 0;

/** Called by the page whenever its abyss value changes. */
export function setLanternDepth(depth: number) {
  pendingDepth = depth;
  applyDepth?.(depth);
}

const INTERACTIVE = 'a[href], button, [role="button"], input, select, textarea, summary, label[for]';

/**
 * Mounts the cursor on fine-pointer, hover-capable devices and returns its cleanup. Elsewhere it
 * does nothing and the native cursor stays. The native cursor is only hidden once a real mouse
 * has moved over the page, and comes back as soon as touch or pen input is used.
 */
export function mountLanternCursor(): () => void {
  const fine = window.matchMedia('(hover: hover) and (pointer: fine)');
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  let teardown: (() => void) | null = null;

  const sync = () => {
    if (fine.matches && !teardown) teardown = start(reduced);
    else if (!fine.matches && teardown) {
      teardown();
      teardown = null;
    }
  };
  sync();
  fine.addEventListener('change', sync);
  return () => {
    fine.removeEventListener('change', sync);
    teardown?.();
    teardown = null;
  };
}

function start(reduced: MediaQueryList): () => void {
  const root = document.documentElement;
  const make = (className: string, parent: HTMLElement) => {
    const el = document.createElement('div');
    el.className = className;
    parent.appendChild(el);
    return el;
  };

  // Halo: under the content. Core, ring and ripple: over everything.
  const light = make('lantern-light', document.body);
  light.setAttribute('aria-hidden', 'true');
  const halo = make('lantern-halo', light);
  make('lantern-halo-glow', halo);
  const cursor = make('lantern', document.body);
  cursor.setAttribute('aria-hidden', 'true');
  const ring = make('lantern-ring', cursor);
  make('lantern-ring-shape', ring);
  const core = make('lantern-core', cursor);
  make('lantern-core-shape', core);

  let look = lanternLook(pendingDepth);
  let depthKey = -1;
  const paint = (depth: number) => {
    const key = Math.round(clamp01(depth) * 200);
    if (key === depthKey) return;
    depthKey = key;
    look = lanternLook(key / 200);
    const style = cursor.style;
    style.setProperty('--lantern-core', rgba(look.core, look.coreAlpha));
    style.setProperty('--lantern-edge', `rgba(255, 255, 255, ${look.edgeAlpha.toFixed(3)})`);
    style.setProperty('--lantern-ring', rgba(look.ring, look.ringAlpha));
    style.setProperty('--lantern-bloom', rgba(SEAFOAM, look.glow * 0.9));
    style.setProperty('--lantern-ripple', rgba(look.ring, Math.min(0.7, look.ringAlpha + 0.2 + look.glow * 0.3)));
    light.style.setProperty('--lantern-glow', look.glow.toFixed(3));
    light.style.setProperty('--lantern-glow-scale', look.glowScale.toFixed(3));
    light.classList.toggle('is-deep', look.glow > 0.04);
  };
  paint(pendingDepth);
  applyDepth = paint;

  let px = 0;
  let py = 0;
  let rx = 0;
  let ry = 0;
  let hx = 0;
  let hy = 0;
  let shown = false;
  let frame = 0;
  let last = 0;

  const place = (el: HTMLElement, x: number, y: number) => {
    el.style.transform = `translate3d(${x.toFixed(2)}px, ${y.toFixed(2)}px, 0)`;
  };

  const tick = (now: number) => {
    const dt = Math.min(64, last ? now - last : 16);
    last = now;
    if (reduced.matches) {
      rx = hx = px;
      ry = hy = py;
    } else {
      const kr = 1 - Math.exp(-dt / look.ringLag);
      const kh = 1 - Math.exp(-dt / look.haloLag);
      rx += (px - rx) * kr;
      ry += (py - ry) * kr;
      hx += (px - hx) * kh;
      hy += (py - hy) * kh;
    }
    place(ring, rx, ry);
    place(halo, hx, hy);
    const settled = Math.abs(px - rx) + Math.abs(py - ry) + Math.abs(px - hx) + Math.abs(py - hy) < 0.2;
    frame = settled ? 0 : requestAnimationFrame(tick);
    if (settled) last = 0;
  };
  const wake = () => {
    if (!frame) frame = requestAnimationFrame(tick);
  };

  const show = (on: boolean) => {
    if (on === shown) return;
    shown = on;
    cursor.classList.toggle('is-shown', on);
    light.classList.toggle('is-shown', on);
    root.classList.toggle('lantern-active', on);
  };

  const onMove = (e: PointerEvent) => {
    if (e.pointerType !== 'mouse') {
      // Touch or pen: the native behaviour comes back untouched
      show(false);
      return;
    }
    // Over the page's own scrollbar the native arrow is shown; never two cursors at once. While an
    // embedded frame is open (the CV preview) the lantern steps aside: the browser does not tell
    // the page when the pointer crosses into a frame, so it would freeze at the frame's edge.
    if (e.clientX >= root.clientWidth || e.clientY >= root.clientHeight || window.length > 0) {
      show(false);
      return;
    }
    px = e.clientX;
    py = e.clientY;
    if (!shown) {
      rx = hx = px;
      ry = hy = py;
      place(ring, rx, ry);
      place(halo, hx, hy);
    }
    place(core, px, py);
    show(true);
    wake();
  };

  const onOver = (e: PointerEvent) => {
    const target = e.target instanceof Element ? e.target.closest(INTERACTIVE) : null;
    const on = !!target && !(target as HTMLButtonElement).disabled;
    cursor.classList.toggle('is-hover', on);
    light.classList.toggle('is-hover', on);
  };

  const onDown = (e: PointerEvent) => {
    if (e.pointerType !== 'mouse' || e.button !== 0) return;
    cursor.classList.add('is-down');
    if (reduced.matches) return;
    // A small sonar pulse from the core: a hairline ring that widens and fades
    const ripple = make('lantern-ripple', cursor);
    place(ripple, e.clientX, e.clientY);
    const shape = make('lantern-ripple-shape', ripple);
    const animation = shape.animate(
      [
        { transform: 'scale(0.35)', opacity: 1 },
        { transform: 'scale(2.3)', opacity: 0 }
      ],
      { duration: 620, easing: 'cubic-bezier(0.2, 0.7, 0.3, 1)' }
    );
    animation.onfinish = animation.oncancel = () => ripple.remove();
    // The lure brightens for a moment in the deep
    halo.firstElementChild?.animate(
      [{ transform: 'scale(1)' }, { transform: 'scale(1.14)' }, { transform: 'scale(1)' }],
      { duration: 420, easing: 'ease-out', composite: 'add' }
    );
  };
  const onUp = () => cursor.classList.remove('is-down');
  const onLeave = () => {
    show(false);
    cursor.classList.remove('is-down', 'is-hover');
  };
  const onOut = (e: PointerEvent) => {
    // Leaving the window, or entering an iframe (the CV preview): the native cursor takes over
    if (!e.relatedTarget) onLeave();
  };

  window.addEventListener('pointermove', onMove, { passive: true });
  document.addEventListener('pointerover', onOver, { passive: true });
  window.addEventListener('pointerdown', onDown, { passive: true });
  window.addEventListener('pointerup', onUp, { passive: true });
  window.addEventListener('blur', onLeave);
  document.addEventListener('pointerout', onOut, { passive: true });
  root.addEventListener('pointerleave', onLeave);

  return () => {
    cancelAnimationFrame(frame);
    window.removeEventListener('pointermove', onMove);
    document.removeEventListener('pointerover', onOver);
    window.removeEventListener('pointerdown', onDown);
    window.removeEventListener('pointerup', onUp);
    window.removeEventListener('blur', onLeave);
    document.removeEventListener('pointerout', onOut);
    root.removeEventListener('pointerleave', onLeave);
    root.classList.remove('lantern-active');
    if (applyDepth === paint) applyDepth = null;
    light.remove();
    cursor.remove();
  };
}
