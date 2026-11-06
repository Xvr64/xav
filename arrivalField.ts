/**
 * The arrival's water: a sparse ASCII field drawn on a 2D canvas, in the ASCII ocean's own
 * glyph ramp, typeface, cell proportions and 30 fps resting cadence (asciiOcean.ts), so it reads
 * as the same water without a second WebGL context beside the ocean's.
 *
 * At rest it is slow swell and drifting plankton. Each journey, when hovered or focused, tunes the
 * same cells toward its own figure: straight lanes for Direct, stars streaming from a far point
 * above the sea for The Passage, a slow spiral eye for The Odyssey.
 */
export type FieldMode = 'direct' | 'passage' | 'odyssey';

/** asciiOcean.ts CHARACTERS and FONT */
const GLYPHS = ' .·:-~=+≈';
const FONT = "'IBM Plex Mono', ui-monospace, SFMono-Regular, Menlo, Consolas, monospace";
const LEVELS = GLYPHS.length - 1;
const IDLE_FPS = 30;
/** Seconds for a journey's figure to rise or settle */
const BLEND_TIME = 0.55;
const LEAVE_MS = 900;
const INK = [150, 190, 214] as const;

const clamp01 = (v: number) => Math.max(0, Math.min(1, v));
const smooth = (a: number, b: number, v: number) => {
  const t = clamp01((v - a) / (b - a));
  return t * t * (3 - 2 * t);
};
export const cellHash = (x: number, y: number) => {
  let h = (Math.imul(x | 0, 374761393) + Math.imul(y | 0, 668265263)) | 0;
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
};
const TAU = Math.PI * 2;
const RAYS = 96;

export interface FieldState {
  /** Width / height of the viewport */
  aspect: number;
  t: number;
  /** Weights of the three figures, each 0..1 */
  direct: number;
  passage: number;
  odyssey: number;
  /** Where the far point and the eye sit, as fractions of the viewport */
  focusX: number;
  focusY: number;
  /** Pointer as fractions of the viewport, or negative when absent */
  pointerX: number;
  pointerY: number;
}

/** Pure: the field's intensity, 0..1, at cell (col,row) whose centre is (u,v) in viewport fractions. */
export function fieldIntensity(u: number, v: number, col: number, row: number, s: FieldState): number {
  const x = u * s.aspect;
  const y = v;
  const t = s.t;
  const deep = 0.45 + 0.55 * smooth(0.04, 0.96, y);

  // At rest: fine current lines that bend, travel and come and go along their length,
  // and plankton rising a cell at a time
  const X = x * 9;
  const Y = y * 9;
  const warp = Math.sin(X * 0.42 + t * 0.21) * 0.9 + Math.sin(X * 0.17 - t * 0.13 + Y * 0.3) * 0.6;
  const swell = smooth(0.66, 1, Math.sin(Y * 2.4 + warp - t * 0.35));
  const reach = smooth(0.08, 0.7, 0.5 + 0.5 * Math.sin(X * 0.26 - t * 0.16 + Y * 1.3));
  const shimmer = 0.72 + 0.28 * Math.sin(X * 0.8 - t * 0.5 + Y * 0.4);
  const mote = cellHash(col, row + Math.floor(t * 0.7 + cellHash(col, 7) * 3));
  const plankton = mote > 0.988 ? 0.28 + (mote - 0.988) * 30 : 0;
  const rest = (swell * reach * shimmer + plankton) * deep;

  const sum = s.direct + s.passage + s.odyssey;
  const norm = sum > 1 ? 1 / sum : 1;
  let value = rest * Math.max(0, 1 - sum);

  if (s.direct > 0.001) {
    // Even lanes, dashes running left to right: no detours
    const lane = smooth(0.8, 1, Math.sin(Y * 2.6 + 0.6));
    const dash = smooth(0.25, 1, 0.5 + 0.5 * Math.sin(X * 1.15 - t * 2.4 + cellHash(3, row) * TAU));
    value += s.direct * norm * lane * (0.22 + 0.62 * dash) * (0.5 + 0.5 * deep);
  }

  if (s.passage > 0.001 || s.odyssey > 0.001) {
    const dx = x - s.focusX * s.aspect;
    const dy = y - s.focusY;
    const r = Math.hypot(dx, dy);
    const theta = Math.atan2(dy, dx);

    if (s.passage > 0.001) {
      // Stars streaming out of the far point, the sea below its horizon
      const ray = Math.floor((theta / TAU + 0.5) * RAYS);
      const seed = cellHash(ray, 17);
      const phase = (seed * 7.3 + t * (0.06 + seed * 0.09)) % 1;
      const reach = phase * phase * 1.7;
      // Distance across the ray's own centre line, so each streak is one unbroken line of cells
      const across = Math.abs(Math.sin(theta - ((ray + 0.5) / RAYS - 0.5) * TAU)) * r;
      const line = 1 - smooth(0.005, 0.013, across);
      const streak = line * Math.max(0, 1 - Math.abs(r - reach) / (0.02 + reach * 0.12));
      const still = cellHash(col, row) > 0.986 ? 0.32 + 0.22 * Math.sin(t * 1.3 + col) : 0;
      const sky = (seed > 0.3 ? streak * (0.5 + reach * 0.6) : 0) + still;
      const horizon = smooth(s.focusY + 0.22, s.focusY + 0.34, y);
      value += s.passage * norm * (sky * (1 - horizon) + rest * 1.15 * horizon);
    }

    if (s.odyssey > 0.001) {
      // A slow spiral eye: arms winding in, a bright ring, darkness at its centre
      const arms = smooth(0.6, 1, Math.sin(theta * 2 + Math.log(r + 0.015) * 4.2 - t * 0.35));
      const ring = Math.exp(-(((r - 0.12) / 0.022) ** 2));
      const hole = smooth(0.06, 0.09, r);
      value += s.odyssey * norm * (arms * 0.95 * Math.exp(-r * 3.2) + ring * 0.85) * hole + s.odyssey * norm * rest * 0.2;
    }
  }

  if (s.pointerX >= 0) {
    // The pointer's wake: a faint ripple around it
    const d = Math.hypot(x - s.pointerX * s.aspect, y - s.pointerY);
    value += Math.exp(-d * 9) * (0.5 + 0.5 * Math.sin(d * 70 - t * 4)) * 0.35;
  }
  return clamp01(value);
}

export interface ArrivalField {
  /** The figure to tune toward, or null for the resting water */
  setMode(mode: FieldMode | null): void;
  /** Elements whose text the field should quiet itself behind */
  setQuietZones(elements: Element[]): void;
  /** Re-measure the quiet zones (layout moved) */
  refresh(): void;
  /** Dissolve; the loop ends when the water is gone */
  leave(): void;
  destroy(): void;
}

export function mountArrivalField(canvas: HTMLCanvasElement): ArrivalField {
  const ctx = canvas.getContext('2d', { alpha: true });
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  let reduce = motion.matches;
  let raf = 0;
  let disposed = false;
  let last = 0;
  let lastDraw = -Infinity;
  let leaveAt = 0;
  let mode: FieldMode | null = null;
  let quiet: Element[] = [];

  const state: FieldState = { aspect: 1, t: 12, direct: 0, passage: 0, odyssey: 0, focusX: 0.8, focusY: 0.3, pointerX: -1, pointerY: -1 };
  const view = { w: 1, h: 1, ratio: 1, cellH: 14, cellW: 8.4, cols: 0, rows: 0, uniform: true };
  let mask = new Float32Array(0);
  let levels = new Uint8Array(0);
  let row = new Uint16Array(0);
  const counts = new Uint16Array(LEVELS + 1);

  const fillStyles = Array.from({ length: LEVELS + 1 }, (_, level) =>
    `rgba(${INK[0]}, ${INK[1]}, ${INK[2]}, ${(0.09 + 0.06 * level).toFixed(3)})`);

  const measureQuiet = () => {
    mask = new Float32Array(view.cols * view.rows).fill(1);
    const feather = 48;
    for (const el of quiet) {
      const r = el.getBoundingClientRect();
      if (!r.width || !r.height) continue;
      const c0 = Math.max(0, Math.floor((r.left - feather) / view.cellW));
      const c1 = Math.min(view.cols - 1, Math.ceil((r.right + feather) / view.cellW));
      const r0 = Math.max(0, Math.floor((r.top - feather) / view.cellH));
      const r1 = Math.min(view.rows - 1, Math.ceil((r.bottom + feather) / view.cellH));
      for (let rr = r0; rr <= r1; rr++) {
        const cy = (rr + 0.5) * view.cellH;
        const oy = Math.max(r.top - cy, 0, cy - r.bottom);
        for (let cc = c0; cc <= c1; cc++) {
          const cx = (cc + 0.5) * view.cellW;
          const ox = Math.max(r.left - cx, 0, cx - r.right);
          const inside = 1 - smooth(0, feather, Math.hypot(ox, oy));
          const i = rr * view.cols + cc;
          mask[i] = Math.min(mask[i], 1 - 0.9 * inside);
        }
      }
    }
  };

  const resize = () => {
    view.w = Math.max(1, canvas.clientWidth);
    view.h = Math.max(1, canvas.clientHeight);
    const narrow = view.w < 768;
    view.ratio = Math.min(window.devicePixelRatio || 1, narrow ? 1.25 : 1.5);
    view.cellH = narrow ? 12 : 14;
    canvas.width = Math.round(view.w * view.ratio);
    canvas.height = Math.round(view.h * view.ratio);
    if (ctx) {
      ctx.setTransform(view.ratio, 0, 0, view.ratio, 0, 0);
      ctx.font = `400 ${view.cellH}px ${FONT}`;
      ctx.textBaseline = 'middle';
      // One string per row when every glyph has the same advance; otherwise glyph by glyph
      const widths = [...GLYPHS].map(g => ctx.measureText(g).width);
      view.cellW = widths[0] || view.cellH * 0.6;
      view.uniform = widths.every(w => Math.abs(w - view.cellW) < 0.01);
    }
    view.cols = Math.ceil(view.w / view.cellW) + 1;
    view.rows = Math.ceil(view.h / view.cellH) + 1;
    levels = new Uint8Array(view.cols * view.rows);
    row = new Uint16Array(view.cols);
    state.aspect = view.w / view.h;
    // The far point and the eye keep to the open water away from the type
    const tall = state.aspect < 0.85;
    state.focusX = tall ? 0.74 : 0.8;
    state.focusY = tall ? 0.15 : 0.3;
    measureQuiet();
    lastDraw = -Infinity;
    schedule();
  };

  const draw = (fade: number) => {
    if (!ctx) return;
    ctx.clearRect(0, 0, view.w, view.h);
    if (fade <= 0) return;
    counts.fill(0);
    const { cols, rows } = view;
    for (let r = 0; r < rows; r++) {
      const v = (r + 0.5) * view.cellH / view.h;
      for (let c = 0; c < cols; c++) {
        const i = r * cols + c;
        const quietness = mask[i];
        if (quietness <= 0.02) { levels[i] = 0; continue; }
        const value = fieldIntensity((c + 0.5) * view.cellW / view.w, v, c, r, state) * quietness * fade;
        const level = value < 0.08 ? 0 : 1 + Math.min(LEVELS - 1, Math.floor((value - 0.08) / 0.92 * LEVELS));
        levels[i] = level;
        counts[level]++;
      }
    }
    const half = view.cellH / 2;
    for (let level = 1; level <= LEVELS; level++) {
      if (!counts[level]) continue;
      ctx.fillStyle = fillStyles[level];
      const glyph = GLYPHS.charCodeAt(level);
      for (let r = 0; r < rows; r++) {
        const base = r * cols;
        const y = r * view.cellH + half;
        if (view.uniform) {
          let any = false;
          for (let c = 0; c < cols; c++) {
            const hit = levels[base + c] === level;
            row[c] = hit ? glyph : 32;
            any ||= hit;
          }
          if (any) ctx.fillText(String.fromCharCode.apply(null, row as unknown as number[]), 0, y);
        } else {
          const ch = GLYPHS[level];
          for (let c = 0; c < cols; c++) if (levels[base + c] === level) ctx.fillText(ch, c * view.cellW, y);
        }
      }
    }
  };

  const ease = (current: number, target: number, dt: number) =>
    reduce ? target : current + (target - current) * (1 - Math.exp(-dt / (BLEND_TIME / 3)));

  const frame = (now: number) => {
    raf = 0;
    if (disposed || document.hidden) return;
    const dt = last ? Math.min(0.1, (now - last) / 1000) : 0;
    last = now;
    if (!reduce) state.t += dt;
    state.direct = ease(state.direct, mode === 'direct' ? 1 : 0, dt);
    state.passage = ease(state.passage, mode === 'passage' ? 1 : 0, dt);
    state.odyssey = ease(state.odyssey, mode === 'odyssey' ? 1 : 0, dt);
    const fade = leaveAt ? (reduce ? 0 : 1 - smooth(0, 1, (now - leaveAt) / LEAVE_MS)) : 1;
    if (now - lastDraw >= 1000 / IDLE_FPS - 2) {
      draw(fade);
      lastDraw = now;
    }
    if (leaveAt && fade <= 0) return;
    // Under reduced motion the water holds still: only a change of figure or size redraws it
    if (!reduce || leaveAt) raf = requestAnimationFrame(frame);
    else last = 0;
  };

  function schedule() {
    if (!raf && !disposed && !document.hidden) raf = requestAnimationFrame(frame);
  }

  const onPointer = (event: PointerEvent) => {
    if (event.pointerType !== 'mouse') return;
    state.pointerX = event.clientX / view.w;
    state.pointerY = event.clientY / view.h;
  };
  const onPointerOut = (event: PointerEvent) => {
    if (!event.relatedTarget) state.pointerX = state.pointerY = -1;
  };
  const onMotion = () => { reduce = motion.matches; schedule(); };
  const onVisibility = () => { last = 0; schedule(); };
  const observer = new ResizeObserver(resize);
  observer.observe(canvas);
  if (!reduce) {
    window.addEventListener('pointermove', onPointer, { passive: true });
    document.addEventListener('pointerout', onPointerOut, { passive: true });
  }
  motion.addEventListener('change', onMotion);
  document.addEventListener('visibilitychange', onVisibility);
  // The ramp's metrics change once the typeface arrives
  document.fonts?.load?.(`400 14px ${FONT}`, GLYPHS).then(() => { if (!disposed) resize(); }, () => {});
  resize();

  return {
    setMode(next) {
      if (next === mode) return;
      mode = next;
      lastDraw = -Infinity;
      schedule();
    },
    setQuietZones(elements) {
      quiet = elements;
      measureQuiet();
      lastDraw = -Infinity;
      schedule();
    },
    refresh() {
      measureQuiet();
      lastDraw = -Infinity;
      schedule();
    },
    leave() {
      if (leaveAt) return;
      leaveAt = performance.now();
      schedule();
    },
    destroy() {
      disposed = true;
      cancelAnimationFrame(raf);
      observer.disconnect();
      window.removeEventListener('pointermove', onPointer);
      document.removeEventListener('pointerout', onPointerOut);
      motion.removeEventListener('change', onMotion);
      document.removeEventListener('visibilitychange', onVisibility);
    }
  };
}
