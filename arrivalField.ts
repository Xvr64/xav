import { handoff, revealShapeFor } from './journeyHandoff.ts';
import { revealGeometry, type Dissolve } from './arrivalDissolve.ts';
import {
  SKY_MARGIN, buildSky, dustAt, galaxyLight, hash2, meteorAt, seeded, skyLayout, smooth, spawnMeteor, strokeFor,
  type Meteor, type SkyLayout, type Star
} from './arrivalSky.ts';

/**
 * The arrival's sky (arrivalSky.ts is the model): drawn as glyphs on one 2D canvas, on the ASCII
 * ocean's own typeface and cell, at its 30 fps resting cadence, so it reads as the same instrument
 * as the rest of the site without a second WebGL context beside the ocean's.
 *
 * At rest: three planes of stars drifting at their own depths, scintillating, shifting a few px
 * against the pointer; the band's dust; the distant galaxy; now and then a meteor behind the type.
 * Each journey, hovered or focused, bends the same sky toward where it goes:
 *   direct   an orbit draws itself around the place the Earth will rise
 *   passage  the stars align into radial streaks toward the tunnel's vanishing point
 *   odyssey  gravity: the field twists toward the centre, the galaxy winds, one wave crosses it
 * Choosing (journeyHandoff.ts): the sky rushes past toward the eye, or falls in toward the Earth,
 * while the letters fly.
 */
export type FieldMode = 'direct' | 'passage' | 'odyssey';

/** asciiOcean.ts FONT */
const FONT = "'IBM Plex Mono', ui-monospace, SFMono-Regular, Menlo, Consolas, monospace";
const IDLE_FPS = 30;
/** Seconds for a journey's response to rise or settle */
const BLEND_TIME = 0.6;
const LEAVE_MS = 900;
/** site ink, cool white, warm, galaxy blue, dust */
const TINTS: readonly (readonly [number, number, number])[] = [[150, 190, 214], [222, 232, 246], [246, 222, 190], [160, 176, 236], [92, 116, 184]];
const STEPS = 10;
/** px of parallax at full pointer travel, and px/s of drift, far to near */
const PARALLAX = [2.5, 6, 12];
const DRIFT = [[-1.1, -0.3], [-2.4, -0.65], [-4.6, -1.25]];
const TWINKLE = [0.22, 0.38, 0.46];
const RAMP = ['.', '·', ':', '+', '*'];
const code = (s: string) => s.charCodeAt(0);
const STAR_HIGH = code('˙'), STAR_MID = code('·'), STAR_LOW = code('.'), PLUS = code('+'), STAR = code('*');
const DUST = [STAR_LOW, STAR_LOW, STAR_HIGH, STAR_MID];
const COLON = code(':');

/** The glyph a light level is drawn with, where nothing chose one */
export function rampGlyph(light: number) {
  return light < 0.12 ? RAMP[0] : light < 0.22 ? RAMP[1] : light < 0.36 ? RAMP[2] : light < 0.56 ? RAMP[3] : RAMP[4];
}

export interface ArrivalField {
  /** The journey to respond to, or null for the resting sky */
  setMode(mode: FieldMode | null): void;
  /** Elements whose text the field should quiet itself behind */
  setQuietZones(elements: Element[]): void;
  /** Re-measure the quiet zones (layout moved) */
  refresh(): void;
  /** Dissolve; the loop ends when the sky is gone */
  leave(): void;
  /**
   * The handoff (journeyHandoff.ts): the letters are drawn here from now on and fly into the
   * destination while the sky rushes past it. onSwap runs in the frame the canvas first draws
   * them (hide the page's text then); onDone once they and the sky are gone.
   */
  dissolve(letters: Dissolve, onSwap: () => void, onDone: () => void): void;
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
  let dissolving: { letters: Dissolve; onSwap: (() => void) | null; onDone: () => void } | null = null;
  let quiet: Element[] = [];

  const view = { w: 1, h: 1, ratio: 1, cellH: 14, cellW: 8.4, cols: 0, rows: 0 };
  /** Sky time (s): stands still under reduced motion */
  let t = 0;
  const weight = { direct: 0, passage: 0, odyssey: 0 };
  const pointer = { tx: 0, ty: 0, x: 0, y: 0 };
  /** When the Odyssey's wave set out (ms), 0 when none */
  let waveAt = 0;
  let layout: SkyLayout = skyLayout(1, 1);
  let stars: Star[] = [];
  const meteors: Meteor[] = [];
  const random = seeded(31);
  let nextMeteorAt = performance.now() + 2600 + random() * 1600;

  // The lattice: each cell keeps its brightest light this frame, whose tint, and an explicit glyph
  let mask = new Float32Array(0);
  let light = new Float32Array(0);
  let tint = new Uint8Array(0);
  let glyph = new Uint16Array(0);
  let dust = new Float32Array(0);
  let dustGlyph = new Uint16Array(0);
  let dustCells = new Int32Array(0);
  const galaxyCache = { stale: true, twist: 0, glow: 1, t: 0, n: 0, cell: new Int32Array(0), lit: new Float32Array(0), tint: new Uint8Array(0), glyph: new Uint16Array(0) };
  let grain = new Float32Array(0);
  let order = new Int32Array(0);
  const counts = new Int32Array(TINTS.length * STEPS + 1);
  const galaxyBox = { c0: 0, c1: -1, r0: 0, r1: -1 };
  const styles = TINTS.map(([r, g, b]) =>
    Array.from({ length: STEPS }, (_, s) => `rgba(${r}, ${g}, ${b}, ${(0.1 + 0.9 * Math.pow((s + 0.5) / STEPS, 0.9)).toFixed(3)})`));

  const measureQuiet = () => {
    mask = new Float32Array(view.cols * view.rows).fill(1);
    const feather = 48;
    // The lines of text themselves, not their blocks: a heading's box runs the width of the page,
    // its words do not, and the sky belongs everywhere the words are not
    // (text nodes only: a range over an element also returns its children's block boxes), cut to
    // whatever clips them (the long rules run off under their own overflow)
    const range = document.createRange();
    const rects: { left: number; top: number; right: number; bottom: number; width: number; height: number }[] = [];
    for (const el of quiet) {
      const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
      for (let node = walker.nextNode(); node; node = walker.nextNode()) {
        if (!node.nodeValue?.trim()) continue;
        let clip: DOMRect | null = null;
        for (let e = node.parentElement; e && e !== el.parentElement; e = e.parentElement) {
          const cs = getComputedStyle(e);
          if (cs.overflowX !== 'visible' || cs.overflowY !== 'visible') { clip = e.getBoundingClientRect(); break; }
        }
        range.selectNodeContents(node);
        for (const r of Array.from(range.getClientRects())) {
          const left = Math.max(r.left, clip?.left ?? -Infinity), right = Math.min(r.right, clip?.right ?? Infinity);
          const top = Math.max(r.top, clip?.top ?? -Infinity), bottom = Math.min(r.bottom, clip?.bottom ?? Infinity);
          if (right > left && bottom > top) rects.push({ left, top, right, bottom, width: right - left, height: bottom - top });
        }
      }
    }
    for (const r of rects) {
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
          // The type keeps its contrast: the sky all but goes out behind it
          mask[i] = Math.min(mask[i], 1 - 0.92 * inside);
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
      view.cellW = ctx.measureText('.').width || view.cellH * 0.6;
    }
    view.cols = Math.ceil(view.w / view.cellW) + 1;
    view.rows = Math.ceil(view.h / view.cellH) + 1;
    const n = view.cols * view.rows;
    light = new Float32Array(n);
    tint = new Uint8Array(n);
    glyph = new Uint16Array(n);
    order = new Int32Array(n);
    layout = skyLayout(view.w, view.h);
    stars = buildSky(view.w, view.h);
    // What does not move is worked out once: the band's dust and the galaxy's stellar grain
    dust = new Float32Array(n);
    dustGlyph = new Uint16Array(n);
    grain = new Float32Array(n);
    for (let r = 0; r < view.rows; r++) for (let c = 0; c < view.cols; c++) {
      const i = r * view.cols + c;
      // Stippled, never a run of dots along a row: dust is grain, each speck its own height
      const speck = hash2(c * 5 + 3, r * 11 + 7);
      dust[i] = speck > 0.42 ? dustAt((c + 0.5) * view.cellW, (r + 0.5) * view.cellH, layout) * (0.6 + 0.8 * speck) : 0;
      dustGlyph[i] = DUST[Math.floor(hash2(c * 13 + 1, r * 3 + 9) * DUST.length)];
      grain[i] = hash2(c * 3 + 1, r * 7 + 2);
    }
    const G = layout.galaxy, reach = G.r * 1.3;
    galaxyBox.c0 = Math.max(0, Math.floor((G.x - reach) / view.cellW));
    galaxyBox.c1 = Math.min(view.cols - 1, Math.ceil((G.x + reach) / view.cellW));
    galaxyBox.r0 = Math.max(0, Math.floor((G.y - reach) / view.cellH));
    galaxyBox.r1 = Math.min(view.rows - 1, Math.ceil((G.y + reach) / view.cellH));
    const box = Math.max(0, (galaxyBox.c1 - galaxyBox.c0 + 1) * (galaxyBox.r1 - galaxyBox.r0 + 1));
    Object.assign(galaxyCache, { stale: true, n: 0, cell: new Int32Array(box), lit: new Float32Array(box), tint: new Uint8Array(box), glyph: new Uint16Array(box) });
    dustCells = Int32Array.from(dust.reduce<number[]>((list, v, i) => { if (v > 0) list.push(i); return list; }, []));
    measureQuiet();
    lastDraw = -Infinity;
    schedule();
  };

  /** Light a cell at (x, y) px, keeping the brightest light to land there this frame */
  const put = (x: number, y: number, value: number, hue: number, ch = 0) => {
    const c = Math.floor(x / view.cellW), r = Math.floor(y / view.cellH);
    if (c < 0 || r < 0 || c >= view.cols || r >= view.rows) return;
    const i = r * view.cols + c;
    const v = value * mask[i];
    if (v > light[i]) { light[i] = v; tint[i] = hue; glyph[i] = ch; }
  };
  /**
   * A short trail behind a moving light, along (ux, uy), fading: a drawn stroke for a meteor, a
   * line of points for a star (as the Passage's own tunnel streaks), never a scatter of slashes
   */
  const streak = (x: number, y: number, ux: number, uy: number, cells: number, value: number, hue: number, stroked = false) => {
    if (cells <= 0) return;
    const { cellW, cellH } = view;
    // One sample per cell along the line's dominant axis, so every column (or row) gets one glyph
    const step = stroked ? 1 / Math.max(Math.abs(ux) / cellW, Math.abs(uy) / cellH) : cellW * 0.95;
    for (let k = 1; k <= cells; k++) {
      const px = x - ux * k * step, py = y - uy * k * step;
      const ch = stroked ? code(strokeFor(ux, uy, cellW, cellH, py / cellH - Math.floor(py / cellH))) : k === 1 ? STAR_MID : STAR_LOW;
      put(px, py, value * Math.pow(1 - k / (cells + 1), 1.4), hue, ch);
    }
  };

  const render = (now: number, fade: number) => {
    if (!ctx) return;
    ctx.clearRect(0, 0, view.w, view.h);
    if (fade <= 0) return;
    light.fill(0);
    const { cols, rows, cellW, cellH, w, h } = view;
    const cx = w / 2, cy = h / 2, diag = Math.hypot(w, h) / 2;
    const wd = weight.direct, wp = weight.passage, wo = weight.odyssey;

    // The handoff: the sky rushes past toward the eye, or falls in toward the Earth
    const since = dissolving ? now - handoff.startedAt : -1;
    const rush = since >= 0 ? smooth(0, 1, since / 950) : 0;
    const toEarth = revealShapeFor(handoff.journey) === 'planet';

    // Dust, then the galaxy
    for (let k = 0; k < dustCells.length; k++) { const i = dustCells[k]; light[i] = dust[i] * mask[i]; tint[i] = 4; glyph[i] = dustGlyph[i]; }
    const twist = wo * 0.9;
    const glow = (1 + 0.4 * wo) * (1 - rush);
    // The galaxy turns imperceptibly: its cells are worked out again only when the Odyssey winds
    // or brightens it, or once a second, and replayed every frame in between
    if (galaxyCache.stale || Math.abs(twist - galaxyCache.twist) > 0.004 || Math.abs(glow - galaxyCache.glow) > 0.004 || t - galaxyCache.t > 1) {
      galaxyCache.stale = false; galaxyCache.twist = twist; galaxyCache.glow = glow; galaxyCache.t = t;
      galaxyCache.n = 0;
      for (let r = galaxyBox.r0; r <= galaxyBox.r1; r++) for (let c = galaxyBox.c0; c <= galaxyBox.c1; c++) {
        const i = r * cols + c;
        const g = galaxyLight((c + 0.5) * cellW, (r + 0.5) * cellH, layout, t, twist);
        if (g.light <= 0.015) continue;
        // Stippled: a cell holds one of the galaxy's stars with the chance its light gives, so the
        // arms resolve as density, the way a far galaxy does, never as a lit block of cells
        const v = Math.min(1, g.light * 1.15 * glow);
        if (v < 0.07 || (v < 0.2 && grain[i] > v * 2.6)) continue;
        const n = galaxyCache.n++;
        galaxyCache.cell[n] = i;
        galaxyCache.lit[n] = 0.12 + 0.44 * v;
        galaxyCache.tint[n] = g.core > 0.5 ? 2 : 3;
        // The inner disk mixes : and · by the cell's own grain, so it never sets into a grid
        galaxyCache.glyph[n] = v < 0.2 ? STAR_LOW : v < 0.34 ? STAR_MID : v < 0.66 ? (grain[i] > 0.42 ? COLON : STAR_MID) : g.core > 0.8 && v > 0.9 ? STAR : PLUS;
      }
    }
    for (let k = 0; k < galaxyCache.n; k++) {
      const i = galaxyCache.cell[k], lit = galaxyCache.lit[k] * mask[i];
      if (lit > light[i]) { light[i] = lit; tint[i] = galaxyCache.tint[k]; glyph[i] = galaxyCache.glyph[k]; }
    }

    // The stars
    const spanX = w + 2 * SKY_MARGIN, spanY = h + 2 * SKY_MARGIN;
    const wave = waveAt && !reduce ? (now - waveAt) * 0.38 : -1;
    for (const s of stars) {
      const p = s.plane;
      let x = s.x + DRIFT[p][0] * t - pointer.x * PARALLAX[p];
      let y = s.y + DRIFT[p][1] * t - pointer.y * PARALLAX[p];
      x = ((((x + SKY_MARGIN) % spanX) + spanX) % spanX) - SKY_MARGIN;
      y = ((((y + SKY_MARGIN) % spanY) + spanY) % spanY) - SKY_MARGIN;
      let rx = x - cx, ry = y - cy;
      let d = Math.hypot(rx, ry) || 1;
      // The Odyssey's gravity: the field turns toward the centre, more the nearer it is
      if (wo > 0.001) {
        const a = wo * (0.08 + 0.1 * p) * (1 - smooth(0, diag * 1.1, d));
        const ca = Math.cos(a), sa = Math.sin(a);
        [rx, ry] = [rx * ca - ry * sa, rx * sa + ry * ca];
      }
      const ux = rx / d, uy = ry / d;
      // The Passage: aligned outward along the rays of the tunnel to come
      let push = wp * (6 + 18 * p) * smooth(0, diag * 0.6, d);
      if (rush > 0) push += toEarth ? -d * rush * rush * 0.3 * (0.45 + 0.25 * p) : rush * rush * (30 + 130 * p) * (0.3 + d / diag);
      x = cx + rx + ux * push;
      y = cy + ry + uy * push;
      const tw = 1 - TWINKLE[p] + TWINKLE[p] * (0.5 + 0.5 * Math.sin(t * s.f1 + s.phase)) * (0.5 + 0.5 * Math.sin(t * s.f2 + s.phase * 2.3));
      let v = s.mag * tw;
      // A swell of light, not a flash: a point brightens, it does not turn into another glyph
      if (wave > 0) v *= 1 + wo * 0.45 * Math.exp(-(((d - wave) / 46) ** 2)) * (1 - smooth(diag * 0.6, diag * 1.3, wave));
      let ch: number;
      if (v < 0.64) {
        // Most stars are points, their brightness in their light alone; each keeps its place
        // inside the cell, high, middle or low, so the drift reads below the lattice's step
        const f = y / cellH - Math.floor(y / cellH);
        ch = f < 0.34 ? STAR_HIGH : f < 0.67 ? STAR_MID : STAR_LOW;
      } else ch = v < 0.86 ? PLUS : STAR;
      put(x, y, Math.min(1, v * 1.05), s.tint, ch);
      // Streaks: the Passage's alignment, and the rush of the handoff toward the eye
      const cells = Math.round(wp * (1 + p * 2) * (v > 0.3 ? 1 : 0.5) + (toEarth ? rush * (1 + p) : rush * (1 + 3.5 * p)));
      if (cells > 0) streak(x, y, toEarth ? -ux : ux, toEarth ? -uy : uy, cells, v * 0.7, s.tint);
    }

    // Direct: an orbit draws itself around where the Earth will rise
    if (wd > 0.01) {
      const R = revealGeometry(w, h).earthRadius;
      const ax = 1.3 * R, ay = 0.52 * ax, tilt = -0.24, ct = Math.cos(tilt), st = Math.sin(tilt);
      const head = reduce ? 2.3 : t * 0.5;
      // The whole orbit, faint, its far side fainter still, and a brighter wake behind the satellite
      const wake = Math.PI * 0.9;
      const step = (cellW * 0.8) / ax;
      for (let a = 0; a < Math.PI * 2; a += step) {
        const phi = head - a, ex = Math.cos(phi) * ax, ey = Math.sin(phi) * ay;
        const near = ey < 0 ? 0.55 : 1;
        const value = wd * (0.26 * near + 0.5 * Math.pow(Math.max(0, 1 - a / wake), 1.5));
        put(cx + ex * ct - ey * st, cy + ex * st + ey * ct, value, 1, a < wake * 0.35 ? STAR_MID : STAR_LOW);
      }
      const ex = Math.cos(head) * ax, ey = Math.sin(head) * ay;
      put(cx + ex * ct - ey * st, cy + ex * st + ey * ct, wd * 0.95, 1, PLUS);
    }

    // Meteors, behind the type
    for (const m of meteors) {
      const u = (now - m.born) / m.duration;
      if (u < 0 || u > 1) continue;
      const at = meteorAt(m, u);
      const value = at.light * (0.4 + 0.55 * m.depth);
      put(at.x, at.y, value, 1, m.depth > 0.8 ? STAR : m.depth > 0.5 ? PLUS : STAR_MID);
      const travelled = Math.hypot(at.x - m.x0, at.y - m.y0);
      const cells = Math.min(Math.round(5 + 13 * m.depth), Math.floor(travelled * Math.max(Math.abs(m.dx) / cellW, Math.abs(m.dy) / cellH)));
      streak(at.x, at.y, m.dx, m.dy, cells, at.light * (0.3 + 0.45 * m.depth), 1, true);
    }

    // Glyphs, grouped by colour so the canvas changes style a few dozen times, not per glyph
    counts.fill(0);
    const n = cols * rows;
    const key = (i: number) => tint[i] * STEPS + Math.min(STEPS - 1, Math.floor(light[i] * fade * STEPS));
    for (let i = 0; i < n; i++) if (light[i] * fade >= 0.07) counts[key(i) + 1]++;
    for (let k = 1; k < counts.length; k++) counts[k] += counts[k - 1];
    const total = counts[counts.length - 1];
    for (let i = 0; i < n; i++) if (light[i] * fade >= 0.07) order[counts[key(i)]++] = i;
    ctx.font = `400 ${cellH}px ${FONT}`;
    ctx.textBaseline = 'middle';
    let current = -1;
    for (let k = 0; k < total; k++) {
      const i = order[k];
      const kk = key(i);
      if (kk !== current) { current = kk; ctx.fillStyle = styles[Math.floor(kk / STEPS)][kk % STEPS]; }
      const r = Math.floor(i / cols), c = i - r * cols;
      ctx.fillText(glyph[i] ? String.fromCharCode(glyph[i]) : rampGlyph(light[i] * fade), c * cellW, r * cellH + cellH / 2);
    }
  };

  /**
   * A meteor through open sky: of a dozen possible paths, the one that crosses the least type
   * (behind the words the sky is all but out, and a meteor there would be lost)
   */
  const spawnOpen = (now: number) => {
    let best: Meteor | null = null, bestOpen = -1;
    for (let k = 0; k < 12 && bestOpen < 0.9; k++) {
      const m = spawnMeteor(random, view.w, view.h, now);
      let open = 0;
      for (let j = 0; j <= 10; j++) {
        const at = meteorAt(m, j / 10);
        const c = Math.floor(at.x / view.cellW), r = Math.floor(at.y / view.cellH);
        open += c >= 0 && r >= 0 && c < view.cols && r < view.rows ? mask[r * view.cols + c] : 0;
      }
      if (open / 11 > bestOpen) { bestOpen = open / 11; best = m; }
    }
    return best!;
  };

  const ease = (current: number, target: number, dt: number) =>
    reduce ? target : current + (target - current) * (1 - Math.exp(-dt / (BLEND_TIME / 3)));

  const frame = (now: number) => {
    raf = 0;
    if (disposed || document.hidden) return;
    const dt = last ? Math.min(0.1, (now - last) / 1000) : 0;
    last = now;
    if (!reduce) t += dt;
    const targets = { direct: mode === 'direct' ? 1 : 0, passage: mode === 'passage' ? 1 : 0, odyssey: mode === 'odyssey' ? 1 : 0 };
    let settling = false;
    for (const k of ['direct', 'passage', 'odyssey'] as const) {
      weight[k] = ease(weight[k], targets[k], dt);
      if (Math.abs(weight[k] - targets[k]) > 0.004) settling = true;
    }
    pointer.x += (pointer.tx - pointer.x) * (1 - Math.exp(-dt / 0.7));
    pointer.y += (pointer.ty - pointer.y) * (1 - Math.exp(-dt / 0.7));
    // Rare meteors: never more than one at a time, never while leaving
    for (let i = meteors.length - 1; i >= 0; i--) if (now - meteors[i].born > meteors[i].duration) meteors.splice(i, 1);
    if (!reduce && !leaveAt && !dissolving && now >= nextMeteorAt) {
      if (!meteors.length) meteors.push(spawnOpen(now));
      nextMeteorAt = now + 5200 + random() * 7800;
    }
    if (waveAt && now - waveAt > 4000) waveAt = 0;

    if (dissolving && ctx) {
      // Every frame while the letters fly; the sky gives way beneath them
      const since = now - handoff.startedAt;
      render(now, 1 - smooth(0, 820, since));
      const alive = dissolving.letters.draw(ctx, now, view.cellW, view.cellH);
      dissolving.onSwap?.();
      dissolving.onSwap = null;
      if (!alive) { const done = dissolving.onDone; dissolving = null; ctx.clearRect(0, 0, view.w, view.h); done(); return; }
      raf = requestAnimationFrame(frame);
      return;
    }
    const fade = leaveAt ? (reduce ? 0 : 1 - smooth(0, 1, (now - leaveAt) / LEAVE_MS)) : 1;
    // A meteor, a response settling or a wave in flight is drawn every frame; the resting sky at 30 fps
    const lively = meteors.length > 0 || settling || waveAt > 0 || leaveAt > 0;
    if (lively || now - lastDraw >= 1000 / IDLE_FPS - 2) {
      render(now, fade);
      lastDraw = now;
    }
    if (leaveAt && fade <= 0) return;
    // Under reduced motion the sky holds still: only a change of journey or size redraws it
    if (!reduce || leaveAt) raf = requestAnimationFrame(frame);
    else last = 0;
  };

  function schedule() {
    if (!raf && !disposed && !document.hidden) raf = requestAnimationFrame(frame);
  }

  const onPointer = (event: PointerEvent) => {
    if (event.pointerType !== 'mouse') return;
    pointer.tx = (event.clientX / view.w) * 2 - 1;
    pointer.ty = (event.clientY / view.h) * 2 - 1;
  };
  const onPointerOut = (event: PointerEvent) => {
    if (!event.relatedTarget) pointer.tx = pointer.ty = 0;
  };
  const onMotion = () => { reduce = motion.matches; schedule(); };
  const onVisibility = () => {
    last = 0;
    // Back from another tab: no meteor waiting to fire the instant it returns
    nextMeteorAt = Math.max(nextMeteorAt, performance.now() + 2500);
    schedule();
  };
  const observer = new ResizeObserver(resize);
  observer.observe(canvas);
  if (!reduce) {
    window.addEventListener('pointermove', onPointer, { passive: true });
    document.addEventListener('pointerout', onPointerOut, { passive: true });
  }
  motion.addEventListener('change', onMotion);
  document.addEventListener('visibilitychange', onVisibility);
  // The glyphs' metrics change once the typeface arrives
  // Dev QA: fire a meteor now (the browser checks film it)
  if ((import.meta as any).env?.DEV) (window as any).__arrivalSky = { meteor: () => { meteors.length = 0; meteors.push(spawnOpen(performance.now())); schedule(); const { born, ...m } = meteors[0]; return m; },
    /** ms per frame of the sky alone, averaged */
    bench: (n = 60) => { const t0 = performance.now(); for (let i = 0; i < n; i++) render(t0 + i * 33, 1); return (performance.now() - t0) / n; } };
  document.fonts?.load?.(`400 14px ${FONT}`, '.˙·:+*¯-_/\\|').then(() => { if (!disposed) resize(); }, () => {});
  resize();

  return {
    setMode(next) {
      if (next === mode) return;
      if (next === 'odyssey') waveAt = performance.now();
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
    dissolve(letters, onSwap, onDone) {
      if (dissolving || leaveAt) return;
      dissolving = { letters, onSwap, onDone };
      // The pointer no longer steers the sky: the flight has its own direction
      pointer.tx = pointer.ty = 0;
      window.removeEventListener('pointermove', onPointer);
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
