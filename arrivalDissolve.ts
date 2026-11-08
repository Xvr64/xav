import { HANDOFF, handoff, handoffReveal, revealShapeFor, type RevealShape } from './journeyHandoff.ts';

/**
 * The arrival's letters, dissolving (journeyHandoff.ts). Every visible character of the arrival is
 * taken over by the arrival's own 2D canvas at the exact place, face and colour it was set in; the
 * page's text is hidden in the same frame. Each then decodes through ASCII glyphs, shrinks to the
 * ocean's cell, and flies along a curve, stepping cell by cell on the field's own lattice, into the
 * shape the destination opens from: the eye's horizontal slit, or the Earth's silhouette. The
 * destination's real frame then resolves underneath them (the opening's renderer) as they fade.
 * No DOM is created; a few hundred glyphs on one existing canvas.
 */

/** The ocean ramp (arrivalField / asciiOcean), and the geometric glyphs of the site's decode set (terminalMotion) */
const RAMP = '·:-~=+≈';
const DECODE = '#*+=/\\|-:·';
const MONO = "'IBM Plex Mono', ui-monospace, SFMono-Regular, Menlo, Consolas, monospace";
const INK: readonly [number, number, number] = [150, 190, 214];
const LIT: readonly [number, number, number] = [232, 242, 248];
/** Most letters any arrival can have on screen; rules beyond it thin out evenly */
const MAX_LETTERS = 900;

export interface Letter {
  ch: string;
  font: string;
  size: number;
  /** Top-left of the glyph box and its baseline, in viewport px */
  x: number;
  y: number;
  baseline: number;
  cx: number;
  cy: number;
  rgb: [number, number, number];
  alpha: number;
  chosen: boolean;
  seed: number;
  /** ms after the choice */
  delay: number;
  flow: number;
  tx: number;
  ty: number;
  kx: number;
  ky: number;
  glyph: string;
}

export const hash1 = (n: number) => {
  let h = Math.imul(n | 0, 2654435761) ^ 0x9e3779b9;
  h = Math.imul(h ^ (h >>> 15), 2246822519);
  return ((h ^ (h >>> 13)) >>> 0) / 4294967296;
};
const clamp01 = (v: number) => Math.max(0, Math.min(1, v));
const smooth = (a: number, b: number, v: number) => { const t = clamp01((v - a) / (b - a)); return t * t * (3 - 2 * t); };
const inOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

/**
 * Where the destination opens from, in viewport px: the same mapping the opening's field uses
 * (creationRenderer: p = (uv - .5) * (aspect, 1) * 2 * fit), so particles land where it resolves.
 */
export function revealGeometry(width: number, height: number) {
  const aspect = width / height;
  const fit = Math.max(1, 1.45 / aspect);
  /** One unit of the field's p, in px */
  const unit = height / (2 * fit);
  return { cx: width / 2, cy: height / 2, unit, eyeHalfWidth: 1.32 * unit, earthRadius: 0.486 * unit };
}

/**
 * Where each letter flies: spread evenly over the whole shape (the Earth's silhouette, the eye's
 * slit), handed out in the letters' own order around it, so the shape is drawn complete and no
 * two flights cross for no reason.
 */
export function assignTargets(letters: Pick<Letter, 'cx' | 'cy' | 'seed' | 'tx' | 'ty' | 'kx' | 'ky'>[], shape: RevealShape, width: number, height: number) {
  const g = revealGeometry(width, height);
  const n = letters.length;
  if (!n) return;
  if (shape === 'planet') {
    const own = letters.map(l => Math.atan2(l.cy - g.cy, l.cx - g.cx));
    const rank = own.map((a, i) => [a, i] as const).sort((a, b) => a[0] - b[0]);
    // Turn the even ring to sit as close as it can to where the letters already are
    let s = 0, c = 0;
    rank.forEach(([a], k) => { const d = a - (-Math.PI + (2 * Math.PI * (k + 0.5)) / n); s += Math.sin(d); c += Math.cos(d); });
    const turn = Math.atan2(s, c);
    rank.forEach(([, i], k) => {
      const l = letters[i];
      const angle = -Math.PI + (2 * Math.PI * (k + 0.5)) / n + turn + (hash1(l.seed * 3 + 1) - 0.5) * 0.04;
      const r = g.earthRadius * (0.98 + 0.05 * hash1(l.seed * 5 + 2));
      l.tx = g.cx + Math.cos(angle) * r;
      l.ty = g.cy + Math.sin(angle) * r;
    });
  } else {
    const rank = letters.map((l, i) => [l.cx, i] as const).sort((a, b) => a[0] - b[0]);
    rank.forEach(([, i], k) => {
      const l = letters[i];
      const u = -1 + (2 * (k + 0.5)) / n;
      // Denser toward the middle, where the pupil will open
      const along = Math.sign(u) * Math.pow(Math.abs(u), 1.25) * 0.94;
      l.tx = g.cx + along * g.eyeHalfWidth;
      l.ty = g.cy + (hash1(l.seed * 11 + 4) - 0.5) * 0.035 * g.unit;
    });
  }
  // First along their own line, then into the shape
  for (const l of letters) { l.kx = l.cx + (l.tx - l.cx) * 0.68; l.ky = l.cy + (l.ty - l.cy) * 0.12; }
}

function effectiveOpacity(el: Element | null, stop: Element) {
  let o = 1;
  for (let e = el; e && e !== stop; e = e.parentElement) o *= parseFloat(getComputedStyle(e).opacity || '1');
  return o;
}

/**
 * What an element's ancestors clip it to: hidden outright (the rule ink's inset clip), or the
 * boxes its overflow is cut at. Read once per element, not once per character: the handoff has
 * to start in the frame the visitor chose.
 */
function clipsOf(el: Element, stop: Element) {
  let hidden = false;
  const boxes: DOMRect[] = [];
  for (let e: Element | null = el; e && e !== stop; e = e.parentElement) {
    const cs = getComputedStyle(e);
    if (/100%/.test(cs.clipPath)) hidden = true;
    if (cs.overflowX !== 'visible' || cs.overflowY !== 'visible') boxes.push(e.getBoundingClientRect());
  }
  return { hidden, boxes };
}
const outside = (rect: DOMRect, boxes: DOMRect[]) => {
  const cx = rect.left + rect.width / 2, cy = rect.top + rect.height / 2;
  return boxes.some(b => cx < b.left || cx > b.right || cy < b.top || cy > b.bottom);
};

/** Every visible character under `root`, where and how it is set. */
export function measureLetters(root: Element, chosen: Element | null, journey: Parameters<typeof revealShapeFor>[0]): Letter[] {
  const stop = root.parentElement ?? root;
  const shape = revealShapeFor(journey);
  const width = window.innerWidth, height = window.innerHeight;
  const ctx = document.createElement('canvas').getContext('2d');
  const range = document.createRange();
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  const chosenBox = chosen?.getBoundingClientRect();
  const focusX = chosenBox ? chosenBox.left + chosenBox.width / 2 : width / 2;
  const focusY = chosenBox ? chosenBox.top + chosenBox.height / 2 : height / 2;
  const reach = Math.hypot(width, height);
  const letters: Letter[] = [];
  for (let node = walker.nextNode() as Text | null; node; node = walker.nextNode() as Text | null) {
    const text = node.data;
    const el = node.parentElement;
    if (!el || !text.trim()) continue;
    const cs = getComputedStyle(el);
    if (cs.visibility === 'hidden' || cs.display === 'none') continue;
    const color = cs.color.match(/[\d.]+/g)?.map(Number) ?? [255, 255, 255, 1];
    const alpha = (color[3] ?? 1) * effectiveOpacity(el, stop);
    if (alpha < 0.03) continue;
    const font = `${cs.fontStyle} ${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`;
    const size = parseFloat(cs.fontSize) || 16;
    let ascent = size * 0.8;
    if (ctx) { ctx.font = font; const m = ctx.measureText('Hg'); ascent = m.fontBoundingBoxAscent || ascent; }
    const clips = clipsOf(el, stop);
    if (clips.hidden) continue;
    const upper = cs.textTransform === 'uppercase';
    const isChosen = !!chosen && chosen.contains(el);
    for (let i = 0; i < text.length; i++) {
      const raw = text[i];
      if (!raw.trim()) continue;
      range.setStart(node, i);
      range.setEnd(node, i + 1);
      const rect = range.getClientRects()[0];
      if (!rect || rect.width < 0.5 || rect.bottom < 0 || rect.top > height || rect.right < 0 || rect.left > width) continue;
      if (clips.boxes.length && outside(rect, clips.boxes)) continue;
      const seed = letters.length + 1;
      const cx = rect.left + rect.width / 2, cy = rect.top + rect.height / 2;
      const order = Math.hypot(cx - focusX, cy - focusY) / reach;
      const delay = isChosen
        ? HANDOFF.chosenFrom + (HANDOFF.chosenTo - HANDOFF.chosenFrom) * clamp01((rect.left - (chosenBox?.left ?? 0)) / Math.max(1, chosenBox?.width ?? 1))
        : HANDOFF.dissolveFrom + (HANDOFF.dissolveTo - HANDOFF.dissolveFrom) * Math.min(1, order * 1.6) * (0.85 + 0.3 * hash1(seed));
      letters.push({
        ch: upper ? raw.toUpperCase() : raw, font, size, x: rect.left, y: rect.top, baseline: rect.top + ascent, cx, cy,
        rgb: [color[0], color[1], color[2]], alpha, chosen: isChosen, seed, delay,
        flow: HANDOFF.flowMin + (HANDOFF.flowMax - HANDOFF.flowMin) * hash1(seed * 13 + 5),
        tx: cx, ty: cy, kx: cx, ky: cy,
        glyph: RAMP[Math.floor(hash1(seed * 17 + 6) * RAMP.length)]
      });
    }
  }
  const kept = letters.length <= MAX_LETTERS ? letters : letters.filter(l => l.chosen || hash1(l.seed * 19) < MAX_LETTERS / letters.length);
  assignTargets(kept, shape, width, height);
  return kept;
}

export interface Dissolve {
  /** Draws this moment; returns false once every letter has gone and the destination is whole. */
  draw(ctx: CanvasRenderingContext2D, now: number, cellW: number, cellH: number): boolean;
}

export function createDissolve(letters: Letter[]): Dissolve {
  const mono = (size: number) => `400 ${size.toFixed(1)}px ${MONO}`;
  const rgba = (c: readonly number[], a: number) => `rgba(${c[0] | 0},${c[1] | 0},${c[2] | 0},${a.toFixed(3)})`;
  const mix = (a: readonly number[], b: readonly number[], t: number) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];
  return {
    draw(ctx, now, cellW, cellH) {
      const t = now - handoff.startedAt;
      const reveal = handoffReveal(now);
      let alive = false;
      ctx.textBaseline = 'alphabetic';
      for (const l of letters) {
        // The chosen journey answers first: it lifts toward white while the rest begin to go
        const lift = l.chosen ? smooth(0, 160, t) * 0.55 : 0;
        if (t < l.delay) {
          alive = true;
          ctx.font = l.font;
          ctx.fillStyle = rgba(mix(l.rgb, LIT, lift), l.alpha);
          ctx.fillText(l.ch, l.x, l.baseline);
          continue;
        }
        const s = t - l.delay;
        if (s < HANDOFF.scramble) {
          // Decoding: the letter turns through the site's glyphs, settling to the ocean's cell and ink
          alive = true;
          const k = s / HANDOFF.scramble;
          const size = l.size + (cellH - l.size) * smooth(0, 1, k);
          const g = DECODE[Math.floor(hash1(l.seed * 31 + Math.floor(t / 45)) * DECODE.length)];
          ctx.font = mono(size);
          ctx.fillStyle = rgba(mix(mix(l.rgb, LIT, lift), l.chosen ? LIT : INK, k), l.alpha + (0.85 - l.alpha) * k);
          ctx.fillText(g, l.cx - size * 0.3, l.cy + size * 0.35);
          continue;
        }
        const f = (s - HANDOFF.scramble) / l.flow;
        const arrivedAt = l.delay + HANDOFF.scramble + l.flow;
        // Once there, each glyph gives way as the destination resolves beneath it
        const fadeFrom = Math.max(arrivedAt, handoff.revealAt ? handoff.revealAt - handoff.startedAt + 140 : Infinity);
        const fade = 1 - smooth(fadeFrom, fadeFrom + 220, t);
        if (fade <= 0 && reveal > 0.3) continue;
        alive = true;
        ctx.font = mono(cellH);
        const color = l.chosen ? mix(INK, LIT, 0.55) : INK;
        const at = (p: number) => {
          const e = inOut(clamp01(p)), u = 1 - e;
          const x = u * u * l.cx + 2 * u * e * l.kx + e * e * l.tx;
          const y = u * u * l.cy + 2 * u * e * l.ky + e * e * l.ty;
          // On the lattice: a glyph steps from cell to cell, it never slides
          return [Math.round(x / cellW) * cellW, Math.round(y / cellH) * cellH] as const;
        };
        if (f < 1) {
          // A short wake behind it, fainter glyphs on the cells it has just left
          const speed = Math.sin(Math.PI * clamp01(f));
          for (const [lag, a, g] of [[0.11, 0.22, '.'], [0.055, 0.42, '·']] as const) {
            if (f - lag <= 0) continue;
            const [wx, wy] = at(f - lag);
            ctx.fillStyle = rgba(color, a * speed * fade);
            ctx.fillText(g, wx - cellW / 2, wy + cellH * 0.35);
          }
        }
        const [x, y] = at(f);
        // Waiting for a destination that cannot draw yet: hold the shape, breathing
        const hold = f >= 1 && !handoff.revealAt ? 0.75 + 0.25 * Math.sin(t / 140 + l.seed) : 1;
        ctx.fillStyle = rgba(color, 0.85 * fade * hold);
        ctx.fillText(f >= 1 ? '+' : l.glyph, x - cellW / 2, y + cellH * 0.35);
      }
      return alive || reveal < 1;
    }
  };
}
