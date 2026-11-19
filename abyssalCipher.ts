import {
  buildStaircaseClip,
  clamp01,
  cubicBezier,
  depthPassagePhase,
  easedPhase,
  oceanWaveY,
  type GestureDirection,
  type StaircaseLineBox,
  type TransitionPreset
} from './magneticCVState';
import { globeFrame } from './JourneyGlobe';

type Tier = 0 | 1 | 2 | 3; // 0 = hero heading / lead / city, 1 = company / lang / email, 2 = meta / dates, 3 = body copy

interface OutPlane {
  el: HTMLElement;
  role: 'hero' | 'meta' | 'item' | 'globe-canvas' | 'globe-caption';
  isLead: boolean;
  ox: number;
  oy: number;
  delay: number;
  scale: number;
  dy: number;
}

interface OutGlyph {
  x: number;
  y: number;
  planeIdx: number;
  tier: Tier;
  size: number;
  travel: number;
  curl: number;
  seed: number;
  lifeSpan: number;
  releaseAt: number; // >= 0 for explicit timeline release (e.g. Globe arcs), < 0 for wave-edge crossing
  crossedAt: number;
  spawnX: number;
  spawnY: number;
  spawnScale: number;
  isCarrier: boolean;
  carrierIdx: number;
}

interface InPlane {
  el: HTMLElement;
  role: 'hero' | 'meta' | 'item' | 'globe-canvas' | 'globe-caption';
  ox: number;
  oy: number;
  startT: number;
  endT: number;
  startScale: number;
  startDy: number;
  startRx: number;
  scale: number;
  dy: number;
}

interface ReconLine {
  box: StaircaseLineBox;
  scrambleStart: number;
  decodeStart: number;
  decodeEnd: number;
  reveal: number;
  charCount: number;
}

interface ReconGlyph {
  tx: number;
  ty: number;
  size: number;
  colFrac: number;
  lineIdx: number;
  charIdx: number;
  tier: Tier;
  seed: number;
}

interface ReconBlock {
  el: HTMLElement;
  planeIdx: number;
  tier: Tier;
  width: number;
  height: number;
  lines: ReconLine[];
  glyphs: ReconGlyph[];
  settled: boolean;
}

interface Carrier {
  outGlyphIdx: number;
  spawnX: number;
  spawnY: number;
  departAt: number;
  targetX: number;
  targetY: number;
  arriveAt: number;
  alongBias: number;
  laneOffset: number;
  wavePhase: number;
  size: number;
  seed: number;
  tier: Tier;
  launched: boolean;
}

interface GlobeCrystal {
  tx: number;
  ty: number;
  ox: number;
  oy: number;
  t0: number;
  t1: number;
  size: number;
  seed: number;
}

export interface CipherBeginOptions {
  fromEl: HTMLElement;
  fromKind: 'globe' | 'cv';
  toEl: HTMLElement;
  toKind: 'globe' | 'cv';
  dir: GestureDirection;
  duration: number;
  toLandingOffset: number;
  landingAtBottom: boolean;
  preset: TransitionPreset;
}

export interface CipherFrameState {
  t: number;
  dir: GestureDirection;
  outS: number;
  outEdge: number;
  inS: number;
  inEdge: number;
  tilt: number;
  amp: number;
  phase: number;
  fromIsGlobe: boolean;
  toIsGlobe: boolean;
}

export interface AbyssalCipher {
  begin(opts: CipherBeginOptions): number;
  render(frame: CipherFrameState): void;
  end(): void;
  destroy(): void;
  readonly fragmentCount: number;
}

// Restrained editorial oceanic ASCII vocabulary
// Indices: 0:~  1:/  2:\  3::  4:·  5:+  6:#  7:%  8:=  9:-  10:|  11:≈
const ATLAS_CHARS = ['~', '/', '\\', ':', '·', '+', '#', '%', '=', '-', '|', '≈'] as const;
const CIPHER_CORE = [6, 7, 8, 5, 1, 2, 10] as const;   // # % = + / \ |
const CIPHER_CREST = [6, 7, 5, 8, 1, 2] as const;      // # % + = / \
const CIPHER_FLOW_H = [0, 9, 8, 11, 3, 4] as const;    // ~ - = ≈ : ·
const CIPHER_FLOW_D1 = [2, 0, 8, 3, 5] as const;       // \ ~ = : +
const CIPHER_FLOW_D2 = [1, 0, 8, 3, 5] as const;       // / ~ = : +
const CIPHER_FADE = [3, 0, 9, 4, 4] as const;          // : ~ - · ·
const CIPHER_META = [3, 4, 9, 1, 8] as const;          // : · - / =
const CELL_PX = 72;

const hash01 = (n: number) => {
  const s = Math.sin(n * 127.1 + 311.7) * 43758.5453123;
  return s - Math.floor(s);
};

const easeOutCubic = (x: number) => 1 - (1 - clamp01(x)) ** 3;
const easeOutQuad = (x: number) => 1 - (1 - clamp01(x)) ** 2;
const smoothstep = (x: number) => {
  const c = clamp01(x);
  return c * c * (3 - 2 * c);
};

function parseRgbCss(raw: string, fallback: [number, number, number]): [number, number, number] {
  const m = raw.match(/\d+/g);
  if (!m || m.length < 3) return fallback;
  return [Number(m[0]), Number(m[1]), Number(m[2])];
}

function collectSectionPlanes(section: HTMLElement) {
  if (section.id === 'introduction') {
    const hero = section.querySelector<HTMLElement>('.lead');
    const meta = section.querySelector<HTMLElement>('.intro-kicker');
    const support = section.querySelector<HTMLElement>('.intro-support');
    const facts = [...section.querySelectorAll<HTMLElement>('.intro-facts > div')];
    return {
      hero: hero ? [hero] : [],
      meta: meta ? [meta] : [],
      items: [...(support ? [support] : []), ...facts]
    };
  }
  const children = [...section.children].filter((el): el is HTMLElement => el instanceof HTMLElement);
  const hero = children[0] ? [children[0]] : [];
  const list = section.querySelector<HTMLElement>(
    ':scope > .station-list, :scope > .edu-list, :scope > .skill-index, :scope > .lang-list, :scope > .interest-list'
  );
  const items = list
    ? [...list.children].filter((el): el is HTMLElement => el instanceof HTMLElement)
    : children.slice(1);
  return { hero, meta: [] as HTMLElement[], items };
}

/** Measure character bounding centers & exact left edges using Range on `.ascii-source` (exact serif kerning). */
function measureCharCenters(
  textNode: Text,
  fallbackRect: DOMRect,
  maxChars: number
): { left: number; cx: number; cy: number; cw: number }[] {
  const raw = textNode.textContent ?? '';
  const chars = Array.from(raw);
  if (!chars.length) return [];
  const stride = chars.length > maxChars ? Math.ceil(chars.length / maxChars) : 1;
  const out: { left: number; cx: number; cy: number; cw: number }[] = [];
  const range = document.createRange();
  let codeOffset = 0;
  for (let i = 0; i < chars.length; i++) {
    const ch = chars[i];
    const start = codeOffset;
    codeOffset += ch.length;
    if (i % stride !== 0 || /^\s$/.test(ch)) continue;
    try {
      range.setStart(textNode, start);
      range.setEnd(textNode, codeOffset);
      const r = range.getBoundingClientRect();
      if (r.width > 0.5 && r.height > 0.5) {
        out.push({ left: r.left, cx: r.left + r.width * 0.5, cy: r.top + r.height * 0.52, cw: r.width });
        continue;
      }
    } catch {
      /* fallback below */
    }
    const cw = fallbackRect.width / chars.length;
    const left = fallbackRect.left + i * cw;
    out.push({
      left,
      cx: left + cw * 0.5,
      cy: fallbackRect.top + fallbackRect.height * 0.52,
      cw
    });
  }
  return out;
}

function classifyLeafTier(el: HTMLElement, section: HTMLElement): Tier {
  if (el.matches('h2.ocean-h2') || (section.id === 'introduction' && el.matches('.lead'))) return 0;
  if (el.matches('.meta, dt, time') || el.closest('.meta')) return 2;
  if (el.matches('h3.exp-company, h3.entry-title, h3.lang-name, a.contact-address, p.exp-role, p.edu-degree')) return 1;
  return 3;
}

const LEAF_BLOCK_SELECTOR = [
  'h2.ocean-h2',
  '#introduction .lead',
  '#introduction .intro-kicker',
  '#introduction .intro-support',
  '#introduction .intro-facts dt',
  '#introduction .intro-facts dd',
  '.exp-when',
  '.exp-company',
  '.exp-role',
  '.exp-scope li',
  '.edu-tier-label',
  '.edu-when',
  '.edu-body h3',
  '.edu-degree',
  '.edu-highlights p',
  '.edu-where',
  '.skill-label',
  '.skill-items li',
  '.lang-name',
  '.lang-level',
  '.interest-label',
  '.interest li',
  '.contact-label',
  '.contact-address',
  '.contact-cv h3',
  '.contact-cv .meta',
  '.contact-elsewhere li',
  '.contact-sign'
].join(',');

/**
 * ABYSSAL CIPHER — Signature five-phase cinematic ASCII scene transformation engine.
 *
 * Drives synchronized GPU plane transforms, per-block line-by-line staircase directional clipping,
 * and a hi-DPI 2D glyph atlas canvas on the single transition rAF clock:
 *   Phase 1: Scene loses form (subtle depth push + early edge ASCII shimmer)
 *   Phase 2: Localized typography-locked ASCII disintegration along curved oceanic wave
 *   Phase 3: Abyssal Current — sculpted laminar ribbon gliding across open ocean & whales
 *   Phase 4: Hierarchical directional ASCII-to-typography reconstruction (first visits & revisits)
 *   Phase 5: Crisp magnetic landing with zero residual transforms or DOM mutations on `.ascii-visual`
 */
export function createAbyssalCipher(): AbyssalCipher {
  const canvas = document.createElement('canvas');
  canvas.setAttribute('aria-hidden', 'true');
  canvas.dataset.magneticVeil = '';
  canvas.style.cssText =
    'position:fixed;inset:0;z-index:12;pointer-events:none;width:100%;height:100%;display:none;';
  document.body.appendChild(canvas);

  const ctx = canvas.getContext('2d', { alpha: true });

  const atlas = document.createElement('canvas');
  atlas.width = ATLAS_CHARS.length * CELL_PX;
  atlas.height = 4 * CELL_PX;
  const actx = atlas.getContext('2d', { alpha: true });
  let atlasKey = '';

  let width = 1;
  let height = 1;
  let dpr = 1;
  let active = false;
  let preset: TransitionPreset | null = null;
  let inkPrimary: [number, number, number] = [244, 248, 252];
  let inkSea: [number, number, number] = [188, 216, 244];
  let inkLightness = 1;

  let outPlanes: OutPlane[] = [];
  let outGlyphs: OutGlyph[] = [];
  let inPlanes: InPlane[] = [];
  let reconBlocks: ReconBlock[] = [];
  let carriers: Carrier[] = [];
  let globeCrystals: GlobeCrystal[] = [];
  let datumTagged: HTMLElement[] = [];

  // Shared cubic Bezier spline for Phase 3 Abyssal Current ribbon
  let spX0 = 0;
  let spY0 = 0;
  let spX1 = 0;
  let spY1 = 0;
  let spX2 = 0;
  let spY2 = 0;
  let spX3 = 0;
  let spY3 = 0;

  const syncAtlas = () => {
    const cs = getComputedStyle(document.documentElement);
    const p = parseRgbCss(cs.getPropertyValue('--ink-171717'), [244, 248, 252]);
    const s = parseRgbCss(cs.getPropertyValue('--ink-2F4858'), [188, 216, 244]);
    const m = parseRgbCss(cs.getPropertyValue('--ink-52595E'), [164, 190, 224]);
    const lightFlag = parseFloat(cs.getPropertyValue('--ink-light'));
    inkLightness = Number.isFinite(lightFlag) ? lightFlag : 1;

    // Row 0: luminous crisp highlight adapted to ocean depth polarity
    const hi: [number, number, number] = inkLightness >= 0.5
      ? [
          Math.min(255, Math.round(p[0] * 0.72 + 255 * 0.28)),
          Math.min(255, Math.round(p[1] * 0.76 + 255 * 0.24)),
          Math.min(255, Math.round(p[2] * 0.80 + 255 * 0.20))
        ]
      : [
          Math.max(0, Math.round(p[0] * 0.75)),
          Math.max(0, Math.round(p[1] * 0.82)),
          Math.max(0, Math.round(p[2] * 0.92))
        ];

    inkPrimary = p;
    inkSea = s;
    const key = `${hi.join(',')}|${p.join(',')}|${s.join(',')}|${m.join(',')}`;
    if (key === atlasKey || !actx) return;
    atlasKey = key;
    actx.clearRect(0, 0, atlas.width, atlas.height);
    actx.textAlign = 'center';
    actx.textBaseline = 'middle';
    actx.font = '300 46px "IBM Plex Mono", ui-monospace, SFMono-Regular, monospace';
    const rows: [number, number, number][] = [hi, p, s, m];
    for (let r = 0; r < rows.length; r++) {
      const [cr, cg, cb] = rows[r];
      actx.fillStyle = `rgb(${cr},${cg},${cb})`;
      for (let c = 0; c < ATLAS_CHARS.length; c++) {
        actx.fillText(ATLAS_CHARS[c], c * CELL_PX + CELL_PX * 0.5, r * CELL_PX + CELL_PX * 0.5 + 1);
      }
    }
  };

  const sizeCanvas = () => {
    width = Math.max(1, window.innerWidth);
    height = Math.max(1, window.innerHeight);
    dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    const pw = Math.max(1, Math.round(width * dpr));
    const ph = Math.max(1, Math.round(height * dpr));
    if (canvas.width !== pw) canvas.width = pw;
    if (canvas.height !== ph) canvas.height = ph;
  };

  const blit = (glyphIdx: number, inkRow: 0 | 1 | 2 | 3, x: number, y: number, size: number, alpha: number) => {
    if (!ctx || alpha < 0.015 || size < 4) return;
    if (x < -size || x > width + size || y < -size || y > height + size) return;
    const drawSize = size * 1.48;
    ctx.globalAlpha = alpha > 1 ? 1 : alpha;
    ctx.drawImage(
      atlas,
      glyphIdx * CELL_PX,
      inkRow * CELL_PX,
      CELL_PX,
      CELL_PX,
      x - drawSize * 0.5,
      y - drawSize * 0.5,
      drawSize,
      drawSize
    );
  };

  const evalSpline = (s: number) => {
    const inv = 1 - s;
    const inv2 = inv * inv;
    const s2 = s * s;
    const x = inv2 * inv * spX0 + 3 * inv2 * s * spX1 + 3 * inv * s2 * spX2 + s2 * s * spX3;
    const y = inv2 * inv * spY0 + 3 * inv2 * s * spY1 + 3 * inv * s2 * spY2 + s2 * s * spY3;
    const tx = 3 * inv2 * (spX1 - spX0) + 6 * inv * s * (spX2 - spX1) + 3 * s2 * (spX3 - spX2);
    const ty = 3 * inv2 * (spY1 - spY0) + 6 * inv * s * (spY2 - spY1) + 3 * s2 * (spY3 - spY2);
    const len = Math.hypot(tx, ty) || 1;
    return { x, y, tx: tx / len, ty: ty / len, nx: -ty / len, ny: tx / len };
  };

  const drawWaveMeniscus = (
    edge: number,
    tilt: number,
    amp: number,
    phase: number,
    sweep: number,
    strength: number
  ) => {
    if (!ctx || sweep <= 0.02 || sweep >= 0.99) return;
    const env = Math.sin(sweep * Math.PI) * strength;
    if (env < 0.01) return;
    const [sr, sg, sb] = inkSea;
    const [pr, pg, pb] = inkPrimary;
    const steps = 28;
    ctx.beginPath();
    for (let i = 0; i <= steps; i++) {
      const u = i / steps;
      const wy = oceanWaveY(u, edge, tilt, amp, phase);
      if (i === 0) ctx.moveTo(u * width, wy);
      else ctx.lineTo(u * width, wy);
    }
    const haloGrad = ctx.createLinearGradient(0, 0, width, 0);
    haloGrad.addColorStop(0, `rgba(${sr},${sg},${sb},0)`);
    haloGrad.addColorStop(0.2, `rgba(${sr},${sg},${sb},${(0.045 * env).toFixed(4)})`);
    haloGrad.addColorStop(0.5, `rgba(${sr},${sg},${sb},${(0.072 * env).toFixed(4)})`);
    haloGrad.addColorStop(0.8, `rgba(${sr},${sg},${sb},${(0.045 * env).toFixed(4)})`);
    haloGrad.addColorStop(1, `rgba(${sr},${sg},${sb},0)`);
    ctx.strokeStyle = haloGrad;
    ctx.lineWidth = 22;
    ctx.stroke();

    const crestGrad = ctx.createLinearGradient(0, 0, width, 0);
    crestGrad.addColorStop(0, `rgba(${pr},${pg},${pb},0)`);
    crestGrad.addColorStop(0.18, `rgba(${sr},${sg},${sb},${(0.15 * env).toFixed(4)})`);
    crestGrad.addColorStop(0.5, `rgba(${pr},${pg},${pb},${(0.22 * env).toFixed(4)})`);
    crestGrad.addColorStop(0.82, `rgba(${sr},${sg},${sb},${(0.15 * env).toFixed(4)})`);
    crestGrad.addColorStop(1, `rgba(${pr},${pg},${pb},0)`);
    ctx.strokeStyle = crestGrad;
    ctx.lineWidth = 1.1;
    ctx.stroke();
  };

  /** Draw a whisper-subtle curved water-current luminance thread binding the Phase 3 ASCII ribbon. */
  const drawCurrentFilament = (t: number, bell: number, currentDensity: number) => {
    if (!ctx || bell < 0.02) return;
    const [sr, sg, sb] = inkSea;
    const [pr, pg, pb] = inkPrimary;
    const head = clamp01((t - 0.24) / 0.42);
    const tail = clamp01((t - 0.36) / 0.40);
    if (head <= tail + 0.02) return;

    const steps = 22;
    ctx.beginPath();
    for (let i = 0; i <= steps; i++) {
      const s = tail + (head - tail) * (i / steps);
      const pt = evalSpline(s);
      const undul = Math.sin(s * 5.2 - t * 6.0) * 10;
      const x = pt.x + pt.nx * undul;
      const y = pt.y + pt.ny * undul;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    const alpha = bell * 0.055 * currentDensity;
    const grad = ctx.createLinearGradient(spX0, spY0, spX3, spY3);
    grad.addColorStop(0, `rgba(${sr},${sg},${sb},0)`);
    grad.addColorStop(0.35, `rgba(${sr},${sg},${sb},${alpha.toFixed(4)})`);
    grad.addColorStop(0.65, `rgba(${pr},${pg},${pb},${(alpha * 1.15).toFixed(4)})`);
    grad.addColorStop(1, `rgba(${sr},${sg},${sb},0)`);
    ctx.strokeStyle = grad;
    ctx.lineWidth = width < 768 ? 16 : 24;
    ctx.lineCap = 'round';
    ctx.stroke();
  };

  /** Sample departing CV chapter planes + character-accurate typography slots ONCE at rest. */
  const setupDepartingCV = (section: HTMLElement, curPreset: TransitionPreset) => {
    const isIntro = section.id === 'introduction';
    const { hero, meta, items } = collectSectionPlanes(section);
    const planeMap = new Map<HTMLElement, number>();

    const registerPlane = (el: HTMLElement, role: OutPlane['role'], delay: number) => {
      const r = el.getBoundingClientRect();
      const isIndented = el.matches('.section-head--indented') || !!el.querySelector('.section-head--indented');
      const fx = role === 'hero' ? (isIntro ? 0.24 : isIndented ? 0.26 : 0.14) : 0.14;
      const fy = role === 'hero' ? 0.46 : 0.46;
      el.dataset.cvRole = role;
      el.style.transformOrigin = `${Math.round(fx * 100)}% ${Math.round(fy * 100)}%`;
      const idx = outPlanes.length;
      outPlanes.push({
        el,
        role,
        isLead: isIntro && role === 'hero',
        ox: r.left + r.width * fx,
        oy: r.top + r.height * fy,
        delay,
        scale: 1,
        dy: 0
      });
      planeMap.set(el, idx);
      return idx;
    };

    for (const el of hero) registerPlane(el, 'hero', 0);
    for (const el of meta) registerPlane(el, 'meta', 0);
    let visibleIdx = 0;
    for (const el of items) {
      const r = el.getBoundingClientRect();
      if (r.bottom < -36 || r.top > height + 36) continue;
      registerPlane(el, 'item', Math.min(0.045, visibleIdx * 0.012));
      visibleIdx++;
    }

    const findPlaneIdx = (el: HTMLElement): number => {
      let cur: HTMLElement | null = el;
      while (cur && cur !== section) {
        const hit = planeMap.get(cur);
        if (hit !== undefined) return hit;
        cur = cur.parentElement;
      }
      return 0;
    };

    const maxTotal = Math.round((width < 768 ? 190 : 340) * Math.max(0.75, curPreset.currentDensity));
    const words = [...section.querySelectorAll<HTMLElement>('.ascii-word')];
    const bucket: { el: HTMLElement; r: DOMRect; tier: Tier; fontPx: number; planeIdx: number }[][] = [[], [], [], []];

    for (const w of words) {
      const r = w.getBoundingClientRect();
      if (r.width < 2 || r.height < 2 || r.bottom < -16 || r.top > height + 16) continue;
      let tier: Tier = 3;
      if (w.closest('h2.ocean-h2, #introduction .lead')) tier = 0;
      else if (w.closest('.meta, dt, time')) tier = 2;
      else if (w.closest('h3.exp-company, h3.entry-title, h3.lang-name, a.contact-address, p.exp-role, p.edu-degree')) tier = 1;
      const fontPx = parseFloat(getComputedStyle(w).fontSize) || r.height * 0.72;
      bucket[tier].push({ el: w, r, tier, fontPx, planeIdx: findPlaneIdx(w) });
    }

    const pushOutSlot = (
      x: number,
      y: number,
      planeIdx: number,
      tier: Tier,
      fontPx: number
    ) => {
      if (outGlyphs.length >= maxTotal) return;
      const idx = outGlyphs.length + 1;
      // Typography-proportional glyph size: headings turn into unmistakable editorial ASCII!
      const glyphSize = tier === 0
        ? Math.min(44, Math.max(19, fontPx * 0.62))
        : tier === 1
          ? Math.min(36, Math.max(15, fontPx * 0.58))
          : tier === 2
            ? Math.min(13.5, Math.max(10.5, fontPx * 0.92))
            : Math.min(15.5, Math.max(11.5, fontPx * 0.78));
      outGlyphs.push({
        x,
        y,
        planeIdx,
        tier,
        size: glyphSize,
        travel: (tier === 0 ? 72 : tier === 1 ? 54 : 34) + hash01(idx * 5.7) * (tier === 0 ? 44 : 26),
        curl: (hash01(idx * 7.3) - 0.5) * (tier === 0 ? 52 : tier === 1 ? 38 : 22),
        seed: idx * 23 + Math.floor(hash01(idx) * 89),
        lifeSpan: tier === 0 ? 0.34 : tier === 1 ? 0.28 : 0.21,
        releaseAt: -1,
        crossedAt: -1,
        spawnX: x,
        spawnY: y,
        spawnScale: 1,
        isCarrier: false,
        carrierIdx: -1
      });
    };

    // Tier 0 (Headings / Lead): exact per-character sampling!
    const tier0Cap = Math.round(maxTotal * 0.44);
    for (const w of bucket[0]) {
      if (outGlyphs.length >= tier0Cap) break;
      const src = w.el.querySelector<HTMLElement>('.ascii-source');
      const node = src?.firstChild;
      if (node instanceof Text) {
        const centers = measureCharCenters(node, w.r, 18);
        for (const c of centers) {
          if (outGlyphs.length >= tier0Cap) break;
          pushOutSlot(c.cx, c.cy, w.planeIdx, 0, w.fontPx);
        }
      } else {
        pushOutSlot(w.r.left + w.r.width * 0.5, w.r.top + w.r.height * 0.52, w.planeIdx, 0, w.fontPx);
      }
    }

    // Tier 1 (Company, Institution, Language, Email): character/cluster sampling!
    const tier1Cap = Math.round(maxTotal * 0.76);
    const t1Stride = Math.max(1, Math.ceil(bucket[1].length / 32));
    for (let i = 0; i < bucket[1].length && outGlyphs.length < tier1Cap; i += t1Stride) {
      const w = bucket[1][i];
      const src = w.el.querySelector<HTMLElement>('.ascii-source');
      const node = src?.firstChild;
      if (node instanceof Text) {
        const centers = measureCharCenters(node, w.r, 8);
        for (const c of centers) {
          if (outGlyphs.length >= tier1Cap) break;
          pushOutSlot(c.cx, c.cy, w.planeIdx, 1, w.fontPx);
        }
      } else {
        pushOutSlot(w.r.left + w.r.width * 0.5, w.r.top + w.r.height * 0.52, w.planeIdx, 1, w.fontPx);
      }
    }

    // Tier 2 & 3 (Meta & Body): crisp restrained sampling along visible lines
    const rest = [...bucket[2], ...bucket[3]];
    const rem = maxTotal - outGlyphs.length;
    if (rem > 0 && rest.length) {
      const stride = Math.max(1, Math.ceil(rest.length / rem));
      for (let i = 0; i < rest.length && outGlyphs.length < maxTotal; i += stride) {
        const w = rest[i];
        const cols = w.r.width > 56 && outGlyphs.length + 1 < maxTotal ? 2 : 1;
        for (let c = 0; c < cols; c++) {
          const x = w.r.left + ((c + 0.5) / cols) * w.r.width;
          pushOutSlot(x, w.r.top + w.r.height * 0.52, w.planeIdx, w.tier, w.fontPx);
        }
      }
    }
  };

  /** Sample departing Shanghai Globe stage: completed Globe canvas + character-accurate Shanghai label. */
  const setupDepartingGlobe = (globeStage: HTMLElement) => {
    const stageRect = globeStage.getBoundingClientRect();
    const { cx, cy, baseR } = globeFrame(stageRect.width || width, stageRect.height || height);
    const gcx = stageRect.left + cx;
    const gcy = stageRect.top + cy;

    const globeCanvas = globeStage.querySelector<HTMLElement>(':scope > div > canvas');
    let canvasPlaneIdx = -1;
    if (globeCanvas) {
      globeCanvas.style.transformOrigin = `${Math.round(cx)}px ${Math.round(cy)}px`;
      canvasPlaneIdx = outPlanes.length;
      outPlanes.push({
        el: globeCanvas,
        role: 'globe-canvas',
        isLead: false,
        ox: gcx,
        oy: gcy,
        delay: 0,
        scale: 1,
        dy: 0
      });
    }

    const activeCaption = globeStage.querySelector<HTMLElement>('.globe-caption > div[aria-hidden="false"]');
    let capPlaneIdx = -1;
    if (activeCaption) {
      const capRect = activeCaption.getBoundingClientRect();
      activeCaption.style.transformOrigin = '12% 50%';
      capPlaneIdx = outPlanes.length;
      outPlanes.push({
        el: activeCaption,
        role: 'globe-caption',
        isLead: false,
        ox: capRect.left + capRect.width * 0.12,
        oy: capRect.top + capRect.height * 0.5,
        delay: 0,
        scale: 1,
        dy: 0
      });

      const nodes = [...activeCaption.querySelectorAll<HTMLElement>('h3, p')];
      for (const node of nodes) {
        const r = node.getBoundingClientRect();
        if (r.width < 2 || r.height < 2) continue;
        const isCity = node.matches('h3');
        const fontPx = parseFloat(getComputedStyle(node).fontSize) || (isCity ? 54 : 13);
        const textNode = node.firstChild;
        if (textNode instanceof Text) {
          const centers = measureCharCenters(textNode, r, isCity ? 20 : 12);
          for (let ci = 0; ci < centers.length; ci++) {
            const c = centers[ci];
            const idx = outGlyphs.length + 1;
            outGlyphs.push({
              x: c.cx,
              y: c.cy,
              planeIdx: capPlaneIdx,
              tier: isCity ? 0 : 2,
              size: isCity ? Math.min(42, Math.max(22, fontPx * 0.64)) : 12,
              travel: (isCity ? 72 : 34) + hash01(idx * 4.1) * 34,
              curl: (hash01(idx * 7.9) - 0.5) * 40,
              seed: idx * 29,
              lifeSpan: isCity ? 0.36 : 0.24,
              releaseAt: -1, // Follows the real curved clipping wave!
              crossedAt: -1,
              spawnX: c.cx,
              spawnY: c.cy,
              spawnScale: 1,
              isCarrier: false,
              carrierIdx: -1
            });
          }
        }
      }
    }

    // Coherent Globe perimeter & subtle route-arc glyphs (originate strictly from the real sphere!)
    const R = baseR * 1.03;
    const rimCount = width < 768 ? 50 : 80;
    for (let i = 0; i < rimCount; i++) {
      const angle = (i / rimCount) * Math.PI * 2;
      const radial = R * (0.97 + hash01(i * 6.7) * 0.04);
      const x = gcx + Math.cos(angle) * radial;
      const y = gcy + Math.sin(angle) * radial;
      outGlyphs.push({
        x,
        y,
        planeIdx: Math.max(0, canvasPlaneIdx),
        tier: 1,
        size: width < 768 ? 14 : 16.5,
        travel: 58 + hash01(i * 9.3) * 34,
        curl: Math.cos(angle) * 42,
        seed: 500 + i * 19,
        lifeSpan: 0.36,
        releaseAt: -1, // Peels cleanly right as the curved clipping mask sweeps across the Globe!
        crossedAt: -1,
        spawnX: x,
        spawnY: y,
        spawnScale: 1,
        isCarrier: false,
        carrierIdx: -1
      });
    }

    // Two subtle meridian/route arcs echoing the completed 7-city journey across the Globe
    const arcCount = width < 768 ? 18 : 30;
    for (let i = 0; i < arcCount; i++) {
      const frac = i / Math.max(1, arcCount - 1);
      const angle = -Math.PI * 0.78 + frac * Math.PI * 1.18;
      const band = i % 2 === 0 ? 0.58 : 0.34;
      const x = gcx + Math.cos(angle) * (R * band);
      const y = gcy + Math.sin(angle) * (R * (band * 0.84));
      outGlyphs.push({
        x,
        y,
        planeIdx: Math.max(0, canvasPlaneIdx),
        tier: 1,
        size: 14.5,
        travel: 48 + hash01(i * 5.1) * 30,
        curl: -28 + frac * 56,
        seed: 800 + i * 23,
        lifeSpan: 0.34,
        releaseAt: -1,
        crossedAt: -1,
        spawnX: x,
        spawnY: y,
        spawnScale: 1,
        isCarrier: false,
        carrierIdx: -1
      });
    }
  };

  /** Sample incoming CV chapter planes + multi-line directional reconstruction blocks ONCE at begin(). */
  const setupArrivingCV = (
    section: HTMLElement,
    duration: number,
    landingOffset: number,
    landingAtBottom: boolean,
    curPreset: TransitionPreset
  ) => {
    const isIntro = section.id === 'introduction';
    const sectionRect = section.getBoundingClientRect();
    const toLandingY = (docViewportY: number) => docViewportY - sectionRect.top - landingOffset;

    const { hero, meta, items } = collectSectionPlanes(section);
    const planeMap = new Map<HTMLElement, number>();
    const rowOrderMap = new Map<HTMLElement, number>();

    const registerInPlane = (
      el: HTMLElement,
      role: InPlane['role'],
      startT: number,
      endT: number,
      startScale: number,
      startDy: number,
      startRx: number
    ) => {
      const r = el.getBoundingClientRect();
      const lTop = toLandingY(r.top);
      const isIndented = el.matches('.section-head--indented') || !!el.querySelector('.section-head--indented');
      const fx = role === 'hero' ? (isIntro ? 0.24 : isIndented ? 0.26 : 0.14) : 0.14;
      const fy = 0.48;
      el.dataset.cvRole = role;
      el.style.transformOrigin = `${Math.round(fx * 100)}% ${Math.round(fy * 100)}%`;
      const idx = inPlanes.length;
      inPlanes.push({
        el,
        role,
        ox: r.left + r.width * fx,
        oy: lTop + r.height * fy,
        startT,
        endT,
        startScale,
        startDy,
        startRx,
        scale: startScale,
        dy: startDy
      });
      planeMap.set(el, idx);
      return idx;
    };

    for (const el of hero) {
      registerInPlane(el, 'hero', 0.54, 0.90, 0.915, 22, 2.0);
    }
    for (const el of meta) {
      registerInPlane(el, 'meta', 0.59, 0.88, 0.96, 10, 0);
    }

    const visibleItems = items.filter(el => {
      const r = el.getBoundingClientRect();
      const relTop = toLandingY(r.top);
      return relTop + r.height > -36 && relTop < height + 36;
    });

    const baseRowStart = landingAtBottom ? 0.55 : 0.60;
    const rawStep = visibleItems.length > 1 ? 0.042 * curPreset.rowStagger : 0;
    const step = visibleItems.length > 1
      ? Math.min(rawStep, Math.max(0.014, (0.14) / (visibleItems.length - 1)))
      : 0;

    visibleItems.forEach((el, idx) => {
      const order = landingAtBottom ? visibleItems.length - 1 - idx : idx;
      const st = baseRowStart + order * step;
      const en = Math.min(0.95, st + 0.29);
      registerInPlane(el, 'item', st, en, 0.955, 16, 1.1);
      rowOrderMap.set(el, order);

      // Sync architectural hairline unfurl CSS vars cleanly with the row's arrival
      const datumTarget = el.matches('.exp-entry, .skill-row, .edu-entry--school, .contact-foot')
        ? el
        : el.querySelector<HTMLElement>('.exp-entry, .skill-row, .edu-entry--school, .contact-foot');
      if (datumTarget) {
        datumTarget.style.setProperty('--cv-datum-delay', `${Math.round((st + 0.04) * duration)}ms`);
        datumTarget.style.setProperty('--cv-datum-dur', `${Math.round(0.24 * duration)}ms`);
        datumTagged.push(datumTarget);
      }
    });

    const findInPlane = (el: HTMLElement): { idx: number; rowOrder: number } => {
      let cur: HTMLElement | null = el;
      while (cur && cur !== section) {
        const hit = planeMap.get(cur);
        if (hit !== undefined) {
          return { idx: hit, rowOrder: rowOrderMap.get(cur) ?? 0 };
        }
        cur = cur.parentElement;
      }
      return { idx: 0, rowOrder: 0 };
    };

    // Collect leaf typographic blocks visible in the landing viewport
    const candidates = [...section.querySelectorAll<HTMLElement>(LEAF_BLOCK_SELECTOR)];
    const accepted = new Set<HTMLElement>();
    const maxReconGlyphs = Math.round((width < 768 ? 220 : 390) * Math.max(0.75, curPreset.currentDensity));
    let totalGlyphs = 0;

    for (const block of candidates) {
      // Never nest two ReconBlocks
      let parent = block.parentElement;
      let nested = false;
      while (parent && parent !== section) {
        if (accepted.has(parent)) { nested = true; break; }
        parent = parent.parentElement;
      }
      if (nested) continue;

      const br = block.getBoundingClientRect();
      const bTop = toLandingY(br.top);
      if (br.width < 2 || br.height < 2 || bTop + br.height < -24 || bTop > height + 24) continue;

      const wordEls = [...block.querySelectorAll<HTMLElement>('.ascii-word')];
      if (!wordEls.length) continue;

      accepted.add(block);
      const tier = classifyLeafTier(block, section);
      const { idx: planeIdx, rowOrder } = findInPlane(block);
      const fontPx = parseFloat(getComputedStyle(block).fontSize) || 18;

      // Group words into actual rendered visual lines (in block-local coords)
      const lineGroups: { top: number; bottom: number; left: number; right: number; words: { el: HTMLElement; r: DOMRect }[] }[] = [];
      for (const wEl of wordEls) {
        const wr = wEl.getBoundingClientRect();
        if (wr.width < 1 || wr.height < 1) continue;
        const wTop = toLandingY(wr.top);
        if (wTop + wr.height < -20 || wTop > height + 20) continue;
        const locTop = wr.top - br.top;
        const locBot = wr.bottom - br.top;
        const locLeft = wr.left - br.left;
        const locRight = wr.right - br.left;
        const existing = lineGroups.find(g => Math.abs(g.top - locTop) <= Math.max(8, fontPx * 0.45));
        if (existing) {
          existing.top = Math.min(existing.top, locTop);
          existing.bottom = Math.max(existing.bottom, locBot);
          existing.left = Math.min(existing.left, locLeft);
          existing.right = Math.max(existing.right, locRight);
          existing.words.push({ el: wEl, r: wr });
        } else {
          lineGroups.push({ top: locTop, bottom: locBot, left: locLeft, right: locRight, words: [{ el: wEl, r: wr }] });
        }
      }
      if (!lineGroups.length) continue;
      lineGroups.sort((a, b) => a.top - b.top);

      // Compute hierarchical directional wave windows per line
      const plane = inPlanes[planeIdx];
      const basePlaneT = plane ? plane.startT : 0.56;
      const lines: ReconLine[] = lineGroups.map((g, li) => {
        const lineOrder = landingAtBottom ? lineGroups.length - 1 - li : li;
        let scrambleStart: number;
        let decodeStart: number;
        let decodeEnd: number;

        if (tier === 0) {
          // Strongest reconstruction: headings & Profile's monumental statement!
          const lineLag = lineOrder * (isIntro ? 0.044 : 0.038);
          scrambleStart = Math.min(0.68, 0.50 + lineLag * 0.65);
          decodeStart = Math.min(0.74, 0.585 + lineLag);
          decodeEnd = Math.min(0.86, decodeStart + (isIntro ? 0.16 : 0.21));
        } else if (tier === 1) {
          // Companies, institutions, languages, contact email: confident medium reconstruction
          const lineLag = lineOrder * 0.028;
          scrambleStart = Math.min(0.72, basePlaneT - 0.035 + lineLag * 0.6);
          decodeStart = Math.min(0.77, basePlaneT + 0.025 + lineLag);
          decodeEnd = Math.min(0.895, decodeStart + 0.155);
        } else if (tier === 2) {
          // Dates & labels: short, restrained, quiet decoding
          const extra = isIntro && block.matches('.intro-kicker') ? -0.02 : 0.01;
          scrambleStart = Math.min(0.76, basePlaneT + extra);
          decodeStart = Math.min(0.80, scrambleStart + 0.035);
          decodeEnd = Math.min(0.89, decodeStart + 0.095);
        } else {
          // Paragraphs & list items: subtle line-by-line progression settling before Phase 5
          const lineLag = lineOrder * 0.026;
          const rowLag = Math.min(0.065, rowOrder * 0.013 * curPreset.rowStagger);
          scrambleStart = Math.min(0.75, basePlaneT + 0.015 + rowLag * 0.35 + lineLag * 0.6);
          decodeStart = Math.min(0.80, scrambleStart + 0.04);
          decodeEnd = Math.min(0.905, decodeStart + 0.115);
        }

        return {
          box: { top: g.top, bottom: g.bottom, left: g.left, right: g.right, charLefts: [] },
          scrambleStart,
          decodeStart,
          decodeEnd,
          reveal: 0,
          charCount: 0
        };
      });

      // Sample character slots for each line in landing viewport coordinates + record exact local charLefts!
      const glyphs: ReconGlyph[] = [];
      const glyphSize = tier === 0
        ? Math.min(44, Math.max(19, fontPx * 0.62))
        : tier === 1
          ? Math.min(36, Math.max(15, fontPx * 0.58))
          : tier === 2
            ? Math.min(13, Math.max(10.5, fontPx * 0.90))
            : Math.min(15, Math.max(11.5, fontPx * 0.76));

      for (let li = 0; li < lineGroups.length; li++) {
        const g = lineGroups[li];
        const lineSpan = Math.max(1, g.right - g.left);
        const lineLeftVp = br.left + g.left;
        const maxPerWord = tier === 0 ? 22 : tier === 1 ? 14 : tier === 2 ? 6 : 4;
        const lineEntries: { leftLocal: number; tx: number; ty: number; colFrac: number }[] = [];

        for (const w of g.words) {
          if (totalGlyphs >= maxReconGlyphs && tier >= 2) break;
          const src = w.el.querySelector<HTMLElement>('.ascii-source');
          const node = src?.firstChild;
          if ((tier === 0 || tier === 1) && node instanceof Text) {
            const centers = measureCharCenters(node, w.r, maxPerWord);
            for (const c of centers) {
              if (totalGlyphs >= maxReconGlyphs && tier > 0) break;
              const ly = toLandingY(c.cy);
              const colFrac = clamp01((c.cx - lineLeftVp) / lineSpan);
              lineEntries.push({ leftLocal: c.left - br.left, tx: c.cx, ty: ly, colFrac });
            }
          } else {
            const cols = Math.max(1, Math.min(maxPerWord, Math.round(w.r.width / (tier === 2 ? 12 : 16))));
            const cellW = w.r.width / cols;
            for (let k = 0; k < cols; k++) {
              if (totalGlyphs >= maxReconGlyphs) break;
              const leftVp = w.r.left + k * cellW;
              const cx = leftVp + cellW * 0.5;
              const ly = toLandingY(w.r.top + w.r.height * 0.52);
              const colFrac = clamp01((cx - lineLeftVp) / lineSpan);
              lineEntries.push({ leftLocal: leftVp - br.left, tx: cx, ty: ly, colFrac });
            }
          }
        }

        lineEntries.sort((a, b) => a.leftLocal - b.leftLocal);
        const ln = lines[li];
        ln.charCount = lineEntries.length;
        // Snap staircase clip cleanly to exact character boundaries on Tier 0 & Tier 1 headings/titles
        // (and full-word boundaries on Tier 2/3) so letters NEVER appear half-sliced!
        ln.box.charLefts = lineEntries.map(e => e.leftLocal);
        for (let ci = 0; ci < lineEntries.length; ci++) {
          const e = lineEntries[ci];
          totalGlyphs++;
          glyphs.push({
            tx: e.tx,
            ty: e.ty,
            size: glyphSize,
            colFrac: e.colFrac,
            lineIdx: li,
            charIdx: ci,
            tier,
            seed: 2000 + totalGlyphs * 31
          });
        }
      }

      // Immediately hide leaf block until its line decoding wave begins
      block.style.clipPath = 'inset(50%)';
      reconBlocks.push({
        el: block,
        planeIdx,
        tier,
        width: br.width,
        height: br.height,
        lines,
        glyphs,
        settled: false
      });
    }
  };

  /** Sample incoming Shanghai Globe stage (on reverse Profile -> Shanghai). */
  const setupArrivingGlobe = (globeStage: HTMLElement) => {
    const stageRect = globeStage.getBoundingClientRect();
    const { cx, cy, baseR } = globeFrame(stageRect.width || width, stageRect.height || height);
    const gcx = stageRect.left + cx;
    const gcy = cy; // At rest at shanghaiY, stageRect.top === 0!

    const globeCanvas = globeStage.querySelector<HTMLElement>(':scope > div > canvas');
    if (globeCanvas) {
      globeCanvas.style.transformOrigin = `${Math.round(cx)}px ${Math.round(cy)}px`;
      inPlanes.push({
        el: globeCanvas,
        role: 'globe-canvas',
        ox: gcx,
        oy: gcy,
        startT: 0.56,
        endT: 0.92,
        startScale: 0.86,
        startDy: -22,
        startRx: 0,
        scale: 0.86,
        dy: -22
      });
    }

    const activeCaption = globeStage.querySelector<HTMLElement>('.globe-caption > div[aria-hidden="false"]');
    if (activeCaption) {
      const capRect = activeCaption.getBoundingClientRect();
      const capTop = capRect.top - stageRect.top;
      activeCaption.style.transformOrigin = '12% 50%';
      const capPlaneIdx = inPlanes.length;
      inPlanes.push({
        el: activeCaption,
        role: 'globe-caption',
        ox: capRect.left + capRect.width * 0.12,
        oy: capTop + capRect.height * 0.5,
        startT: 0.56,
        endT: 0.90,
        startScale: 0.92,
        startDy: -16,
        startRx: 0,
        scale: 0.92,
        dy: -16
      });

      const nodes = [...activeCaption.querySelectorAll<HTMLElement>('h3, p')];
      let gCount = 0;
      for (let ni = 0; ni < nodes.length; ni++) {
        const node = nodes[ni];
        const nr = node.getBoundingClientRect();
        if (nr.width < 2 || nr.height < 2) continue;
        const isCity = node.matches('h3');
        const tier: Tier = isCity ? 0 : 2;
        const fontPx = parseFloat(getComputedStyle(node).fontSize) || (isCity ? 54 : 13);
        const textNode = node.firstChild;
        if (!(textNode instanceof Text)) continue;
        const centers = measureCharCenters(textNode, nr, isCity ? 20 : 12);
        if (!centers.length) continue;

        const minX = Math.min(...centers.map(c => c.cx - c.cw * 0.5));
        const maxX = Math.max(...centers.map(c => c.cx + c.cw * 0.5));
        const span = Math.max(1, maxX - minX);
        const scrambleStart = isCity ? 0.50 : 0.61 + ni * 0.025;
        const decodeStart = isCity ? 0.58 : 0.66 + ni * 0.025;
        const decodeEnd = isCity ? 0.80 : Math.min(0.89, decodeStart + 0.12);

        const glyphs: ReconGlyph[] = centers.map((c, ci) => {
          gCount++;
          return {
            tx: c.cx,
            ty: c.cy - stageRect.top,
            size: isCity ? Math.min(42, Math.max(22, fontPx * 0.64)) : 12,
            colFrac: clamp01((c.cx - minX) / span),
            lineIdx: 0,
            charIdx: ci,
            tier,
            seed: 3100 + gCount * 29
          };
        });

        node.style.clipPath = 'inset(50%)';
        reconBlocks.push({
          el: node,
          planeIdx: capPlaneIdx,
          tier,
          width: nr.width,
          height: nr.height,
          lines: [{
            box: {
              top: 0,
              bottom: nr.height,
              left: Math.max(0, minX - nr.left),
              right: Math.min(nr.width, maxX - nr.left + 8),
              charLefts: centers.map(c => c.left - nr.left)
            },
            scrambleStart,
            decodeStart,
            decodeEnd,
            reveal: 0,
            charCount: centers.length
          }],
          glyphs,
          settled: false
        });
      }
    }

    // Coherent Globe rim crystallization glyphs
    const R = baseR * 1.04;
    const count = width < 768 ? 36 : 56;
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      const tx = gcx + Math.cos(angle) * R;
      const ty = gcy + Math.sin(angle) * R;
      const t0 = 0.52 + ((Math.sin(angle) + 1) * 0.5) * 0.14;
      globeCrystals.push({
        tx,
        ty,
        ox: Math.cos(angle) * 26,
        oy: Math.sin(angle) * 26 - 18,
        t0,
        t1: Math.min(0.86, t0 + 0.24),
        size: 13.5,
        seed: 4200 + i * 17
      });
    }
  };

  /** Pair curated departing glyphs with arriving focal slots into the Phase 3 Abyssal Current ribbon. */
  const buildCurrentCarriers = (dir: GestureDirection, curPreset: TransitionPreset) => {
    if (!outGlyphs.length) return;

    // Gather destination anchor points from incoming Tier 0 & Tier 1 glyphs (or Globe crystals)
    const targetPool: { x: number; y: number; arriveAt: number; tier: Tier }[] = [];
    for (const block of reconBlocks) {
      if (block.tier <= 1) {
        for (const g of block.glyphs) {
          const ln = block.lines[g.lineIdx];
          targetPool.push({ x: g.tx, y: g.ty, arriveAt: ln.scrambleStart + 0.055, tier: block.tier });
        }
      }
    }
    if (targetPool.length < 18) {
      for (const block of reconBlocks) {
        for (const g of block.glyphs) {
          const ln = block.lines[g.lineIdx];
          targetPool.push({ x: g.tx, y: g.ty, arriveAt: ln.scrambleStart + 0.055, tier: block.tier });
        }
      }
    }
    for (const gc of globeCrystals) {
      targetPool.push({ x: gc.tx, y: gc.ty, arriveAt: gc.t0 + 0.05, tier: 1 });
    }
    if (!targetPool.length) {
      targetPool.push({ x: width * 0.42, y: height * 0.44, arriveAt: 0.58, tier: 0 });
    }

    // Prioritize departing Tier 0 & Tier 1 glyphs as ribbon carriers
    const prioritized: number[] = [];
    for (let i = 0; i < outGlyphs.length; i++) if (outGlyphs[i].tier === 0) prioritized.push(i);
    for (let i = 0; i < outGlyphs.length; i++) if (outGlyphs[i].tier === 1) prioritized.push(i);
    for (let i = 0; i < outGlyphs.length; i++) if (outGlyphs[i].tier >= 2) prioritized.push(i);

    const desired = Math.round((width < 768 ? 50 : 84) * curPreset.currentDensity);
    const count = Math.min(prioritized.length, Math.max(24, desired));
    const chosen: number[] = [];
    for (let k = 0; k < count; k++) {
      const pick = prioritized[Math.min(prioritized.length - 1, Math.floor((k * prioritized.length) / count))];
      if (!outGlyphs[pick].isCarrier) {
        chosen.push(pick);
        outGlyphs[pick].isCarrier = true;
      }
    }
    if (!chosen.length) return;

    // Sort chosen sources & targets horizontally so the current glides smoothly without crossing chaos
    chosen.sort((a, b) => outGlyphs[a].x - outGlyphs[b].x || outGlyphs[a].y - outGlyphs[b].y);
    targetPool.sort((a, b) => a.x - b.x || a.y - b.y);

    // Compute centroids for the shared laminar current spine
    let sxSum = 0;
    let sySum = 0;
    for (const idx of chosen) { sxSum += outGlyphs[idx].x; sySum += outGlyphs[idx].y; }
    const outCx = Math.max(width * 0.14, Math.min(width * 0.86, sxSum / chosen.length));
    const outCy = Math.max(height * 0.16, Math.min(height * 0.84, sySum / chosen.length));

    let txSum = 0;
    let tySum = 0;
    for (const tp of targetPool) { txSum += tp.x; tySum += tp.y; }
    const inCx = Math.max(width * 0.14, Math.min(width * 0.86, txSum / targetPool.length));
    const inCy = Math.max(height * 0.16, Math.min(height * 0.84, tySum / targetPool.length));

    // Sculpt a sweeping, graceful horizontal-diagonal oceanic current spine across the viewport
    // so Phase 3 reads as a fine flowing silk ribbon of ASCII information (never a clumped mid-screen knot!)
    const arcDir = curPreset.ribbonArc >= 0 ? 1 : -1;
    const sweepSpan = width * (width < 768 ? 0.34 : 0.36);
    spX0 = Math.max(width * 0.08, Math.min(width * 0.92, outCx - arcDir * sweepSpan * 0.45));
    spY0 = outCy;
    spX3 = Math.max(width * 0.08, Math.min(width * 0.92, inCx + arcDir * sweepSpan * 0.35));
    spY3 = inCy;

    const midY = height * (0.46 + dir * 0.05);
    spX1 = Math.max(width * 0.10, Math.min(width * 0.90, width * (arcDir > 0 ? 0.36 : 0.64)));
    spY1 = outCy * 0.42 + midY * 0.58 + dir * height * 0.07;
    spX2 = Math.max(width * 0.10, Math.min(width * 0.90, width * (arcDir > 0 ? 0.72 : 0.28)));
    spY2 = inCy * 0.42 + midY * 0.58 - dir * height * 0.07;

    const halfWidth = (width < 768 ? 22 : 34) * curPreset.ribbonWidth;
    for (let k = 0; k < chosen.length; k++) {
      const outIdx = chosen[k];
      const og = outGlyphs[outIdx];
      const tp = targetPool[Math.min(targetPool.length - 1, Math.floor((k * targetPool.length) / chosen.length))];
      const cIdx = carriers.length;
      og.carrierIdx = cIdx;
      // Distribute carriers evenly along the ribbon's LENGTH (-0.36..+0.36) so at peak Phase 3
      // they form a continuous 600–900px flowing stream rather than piling onto one point!
      const rank = chosen.length > 1 ? k / (chosen.length - 1) : 0.5;
      const alongBias = (rank - 0.5) * 0.76 + (hash01(k * 7.1) - 0.5) * 0.05;
      const arriveShift = (rank - 0.5) * 0.08;
      carriers.push({
        outGlyphIdx: outIdx,
        spawnX: og.x,
        spawnY: og.y,
        departAt: 0.18 + rank * 0.12,
        targetX: tp.x,
        targetY: tp.y,
        arriveAt: Math.max(0.58, Math.min(0.73, tp.arriveAt + 0.03 + arriveShift)),
        alongBias,
        laneOffset: (hash01(k * 5.3) - 0.5) * 2 * halfWidth,
        wavePhase: rank * 2.2 + hash01(k * 11.7) * 0.6,
        size: width < 768 ? 14 + hash01(k * 2.1) * 4.5 : 16 + hash01(k * 2.1) * 5.5,
        seed: 5100 + k * 23,
        tier: og.tier,
        launched: false
      });
    }
  };

  /** Update outgoing GPU plane transforms synchronized to the single rAF t clock. */
  const updateDepartingPlanes = (t: number, dir: GestureDirection, depthPush: number) => {
    for (let i = 0; i < outPlanes.length; i++) {
      const p = outPlanes[i];
      const lt = clamp01((t - p.delay) / Math.max(0.1, 1 - p.delay));
      if (p.role === 'hero') {
        const p1 = clamp01(lt / 0.22);
        const e1 = cubicBezier(p1, 0.18, 0.94, 0.28, 1);
        const p2 = clamp01((lt - 0.22) / 0.22);
        const e2 = smoothstep(p2);
        const midScale = 1 + (p.isLead ? 0.068 : 0.095) * depthPush;
        const endScale = 1 + (p.isLead ? 0.092 : 0.135) * depthPush;
        const scale = lt <= 0.22 ? 1 + (midScale - 1) * e1 : midScale + (endScale - midScale) * e2;
        const dy = dir * (-10 * e1 - 24 * e2);
        const rx = dir * (-1.1 * e1 - 1.2 * e2);
        const opacity = lt <= 0.24 ? 1 : Math.max(0.06, 1 - smoothstep((lt - 0.24) / 0.20) * 0.94);
        p.scale = scale;
        p.dy = dy;
        p.el.style.transform = `perspective(1100px) translate3d(0,${dy.toFixed(1)}px,0) scale(${scale.toFixed(4)}) rotateX(${rx.toFixed(2)}deg)`;
        p.el.style.opacity = opacity.toFixed(3);
      } else if (p.role === 'meta') {
        const e = smoothstep(clamp01(lt / 0.38));
        const scale = 1 - 0.075 * e;
        const dy = dir * -22 * e;
        const opacity = Math.max(0.04, 1 - smoothstep(clamp01((lt - 0.12) / 0.26)) * 0.96);
        p.scale = scale;
        p.dy = dy;
        p.el.style.transform = `perspective(1100px) translate3d(0,${dy.toFixed(1)}px,0) scale(${scale.toFixed(4)})`;
        p.el.style.opacity = opacity.toFixed(3);
      } else if (p.role === 'item') {
        const e = smoothstep(clamp01(lt / 0.42));
        const scale = 1 - 0.062 * e;
        const dy = dir * -28 * e;
        const rx = dir * 1.4 * e;
        const opacity = Math.max(0.04, 1 - smoothstep(clamp01((lt - 0.14) / 0.28)) * 0.96);
        p.scale = scale;
        p.dy = dy;
        p.el.style.transform = `perspective(1100px) translate3d(0,${dy.toFixed(1)}px,0) scale(${scale.toFixed(4)}) rotateX(${rx.toFixed(2)}deg)`;
        p.el.style.opacity = opacity.toFixed(3);
      } else if (p.role === 'globe-canvas') {
        // Phase 1 (0..0.20): subtle recession while points & routes stay 100% crisp and coherent!
        // Phase 2 (0.20..0.44): continues receding as curved clipping boundary sweeps across the Globe stage.
        const e1 = smoothstep(clamp01(t / 0.20));
        const e2 = smoothstep(clamp01((t - 0.20) / 0.24));
        const scale = 1 - 0.045 * e1 - 0.125 * e2;
        const dy = -6 * e1 - 22 * e2;
        const opacity = t <= 0.20 ? 1 : Math.max(0.06, 1 - e2 * 0.94);
        p.scale = scale;
        p.dy = dy;
        p.el.style.transform = `translate3d(0,${dy.toFixed(1)}px,0) scale(${scale.toFixed(4)})`;
        p.el.style.opacity = opacity.toFixed(3);
      } else if (p.role === 'globe-caption') {
        const e1 = cubicBezier(clamp01(t / 0.20), 0.18, 0.94, 0.28, 1);
        const e2 = smoothstep(clamp01((t - 0.20) / 0.22));
        const scale = 1 + 0.06 * e1 + 0.05 * e2;
        const dy = -8 * e1 - 18 * e2;
        const opacity = t <= 0.18 ? 1 : Math.max(0.04, 1 - e2 * 0.96);
        p.scale = scale;
        p.dy = dy;
        p.el.style.transform = `perspective(1100px) translate3d(0,${dy.toFixed(1)}px,0) scale(${scale.toFixed(4)})`;
        p.el.style.opacity = opacity.toFixed(3);
      }
    }
  };

  /** Update incoming GPU plane transforms synchronized to the single rAF t clock (zero bounce, zero overshoot). */
  const updateArrivingPlanes = (t: number, dir: GestureDirection) => {
    for (let i = 0; i < inPlanes.length; i++) {
      const p = inPlanes[i];
      if (t <= p.startT) {
        p.scale = p.startScale;
        p.dy = p.role.startsWith('globe') ? p.startDy : dir * p.startDy;
        p.el.style.transform = p.role === 'globe-canvas'
          ? `translate3d(0,${p.dy.toFixed(1)}px,0) scale(${p.scale.toFixed(4)})`
          : `perspective(1100px) translate3d(0,${p.dy.toFixed(1)}px,0) scale(${p.scale.toFixed(4)}) rotateX(${(dir * p.startRx).toFixed(2)}deg)`;
        p.el.style.opacity = '0';
        continue;
      }
      if (t >= p.endT) {
        p.scale = 1;
        p.dy = 0;
        if (p.el.style.transform) p.el.style.removeProperty('transform');
        if (p.el.style.opacity) p.el.style.removeProperty('opacity');
        continue;
      }
      const raw = (t - p.startT) / (p.endT - p.startT);
      const ease = cubicBezier(raw, 0.16, 0.92, 0.24, 1.0);
      const scale = p.startScale + (1 - p.startScale) * ease;
      const signedDy = p.role.startsWith('globe') ? p.startDy : dir * p.startDy;
      const dy = signedDy * (1 - ease);
      const rx = dir * p.startRx * (1 - ease);
      // Opacity reaches 1.0 briskly so freshly decoded DOM letters behind the staircase clip read at full crispness!
      const opacity = p.role === 'globe-canvas'
        ? smoothstep(clamp01(raw / 0.55))
        : smoothstep(clamp01(raw / 0.22));
      p.scale = scale;
      p.dy = dy;
      p.el.style.transform = p.role === 'globe-canvas'
        ? `translate3d(0,${dy.toFixed(1)}px,0) scale(${scale.toFixed(4)})`
        : `perspective(1100px) translate3d(0,${dy.toFixed(1)}px,0) scale(${scale.toFixed(4)}) rotateX(${rx.toFixed(2)}deg)`;
      p.el.style.opacity = opacity.toFixed(3);
    }
  };

  return {
    get fragmentCount() {
      return outGlyphs.length + carriers.length + reconBlocks.reduce((acc, b) => acc + b.glyphs.length, 0) + globeCrystals.length;
    },

    begin(opts) {
      if (!ctx) return 0;
      this.end();
      sizeCanvas();
      syncAtlas();
      preset = opts.preset;

      if (opts.fromKind === 'globe') setupDepartingGlobe(opts.fromEl);
      else setupDepartingCV(opts.fromEl, opts.preset);

      if (opts.toKind === 'globe') setupArrivingGlobe(opts.toEl);
      else setupArrivingCV(opts.toEl, opts.duration, opts.toLandingOffset, opts.landingAtBottom, opts.preset);

      buildCurrentCarriers(opts.dir, opts.preset);

      active = true;
      canvas.style.display = 'block';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.globalAlpha = 1;
      ctx.clearRect(0, 0, width, height);
      return this.fragmentCount;
    },

    render({ t, dir, outS, outEdge, inS, inEdge, tilt, amp, phase, fromIsGlobe, toIsGlobe }) {
      if (!active || !ctx || !preset) return;

      // 1. Update synchronized DOM plane transforms (0.0 px drift against canvas glyphs!)
      updateDepartingPlanes(t, dir, preset.depthPush);
      updateArrivingPlanes(t, dir);

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.globalAlpha = 1;
      ctx.clearRect(0, 0, width, height);

      // 2. Phase 3 — Subtle oceanic depth atmosphere & laminar current filament (no blackout, no flash, no heavy blur)
      const depthBell = depthPassagePhase(t);
      if (depthBell > 0.008) {
        drawCurrentFilament(t, depthBell, preset.currentDensity);
      }

      // 3. Curved oceanic clipping meniscus along sweeping masks
      if (outS > 0.02 && outS < 0.99) {
        drawWaveMeniscus(outEdge, tilt, amp, phase, outS, fromIsGlobe ? 0.92 : 0.85);
      }
      if (inS > 0.02 && inS < 0.98) {
        drawWaveMeniscus(inEdge, tilt * 0.86, amp * 0.86, phase + 0.85, inS, toIsGlobe ? 0.88 : 0.72);
      }

      // 4. Phase 1 & 2 — Typography-Locked Outgoing ASCII Disintegration
      const fastTick = Math.floor(t * 28);
      for (let i = 0; i < outGlyphs.length; i++) {
        const g = outGlyphs[i];
        const pl = outPlanes[g.planeIdx];
        const pScale = pl ? pl.scale : 1;
        const pDy = pl ? pl.dy : 0;
        const ox = pl ? pl.ox : g.x;
        const oy = pl ? pl.oy : g.y;

        if (g.crossedAt < 0) {
          const liveX = ox + (g.x - ox) * pScale;
          const liveY = oy + (g.y - oy) * pScale + pDy;
          const waveAtX = oceanWaveY(clamp01(liveX / width), outEdge, tilt, amp, phase);
          const distAhead = dir > 0 ? liveY - waveAtX : waveAtX - liveY;

          // Phase 1 subtle edge ASCII shimmer right at the approaching curved mask (zero double-print over intact text!)
          if (outS > 0.005 && outS < 1 && distAhead > 0 && distAhead < 26) {
            const prox = 1 - distAhead / 26;
            const alpha = prox * prox * (g.tier === 0 ? 0.30 : g.tier === 1 ? 0.24 : 0.18);
            const glyphIdx = CIPHER_FLOW_H[(g.seed + fastTick) % CIPHER_FLOW_H.length];
            blit(
              glyphIdx,
              2,
              liveX + (hash01(g.seed + fastTick) - 0.5) * 5,
              liveY - dir * (4 + prox * 6),
              Math.max(12, g.size * pScale * 0.55),
              alpha
            );
          }

          if (outS >= 1 || (outS > 0 && distAhead <= 0)) {
            g.spawnX = liveX;
            g.spawnY = liveY;
            g.spawnScale = pScale;
            g.crossedAt = t;
            if (g.isCarrier && g.carrierIdx >= 0) {
              const car = carriers[g.carrierIdx];
              car.spawnX = liveX;
              car.spawnY = liveY;
              car.departAt = Math.min(0.39, t + 0.03);
              car.launched = true;
            }
          } else {
            continue;
          }
        }

        // In-place ASCII substitution + localized edge cluster detachment
        const life = (t - g.crossedAt) / g.lifeSpan;
        if (life < 0 || life >= 1) continue;

        // Hold nearly in place for the first 25% of life so the visitor literally sees the letter morph into ASCII!
        const holdFrac = clamp01(life / 0.25);
        const driftFrac = clamp01((life - 0.16) / 0.84);
        const driftE = easeOutCubic(driftFrac);
        const curlE = easeOutQuad(driftFrac);

        const px = g.spawnX + g.curl * curlE + Math.sin(g.spawnY * 0.013 + phase + g.seed * 0.08) * 9 * curlE;
        const py = g.spawnY - dir * (4 * holdFrac + g.travel * driftE);

        // If this glyph is a carrier, hand off gracefully into the carrier stream around life = 0.28
        const carrierDamp = g.isCarrier ? Math.max(0, 1 - smoothstep((life - 0.18) / 0.26)) : 1;
        const fade = (1 - life) ** 1.25;
        const peak = g.tier === 0 ? 0.96 : g.tier === 1 ? 0.86 : g.tier === 2 ? 0.62 : 0.58;
        const alpha = fade * peak * carrierDamp;

        if (alpha >= 0.015) {
          const ramp = life < 0.30 ? CIPHER_CORE : life < 0.66 ? CIPHER_FLOW_H : CIPHER_FADE;
          const mutTick = Math.floor(life * (g.tier === 0 ? 11 : 8));
          const glyphIdx = ramp[(g.seed + mutTick * 3) % ramp.length];
          // Large editorial heading glyphs start at matched typographic scale, then thin down as they enter the current
          const sz = g.size * g.spawnScale * (g.tier <= 1 ? (1 - 0.48 * driftE) : (1 - 0.22 * driftE));
          const inkRow: 0 | 1 | 2 | 3 =
            g.tier === 0
              ? (life < 0.26 ? 0 : life < 0.56 ? 1 : 2)
              : g.tier === 1
                ? (life < 0.34 ? 1 : 2)
                : 3;
          blit(glyphIdx, inkRow, px, py, sz, alpha);
        }

        // Detached fine ASCII edge cluster (1–2 smaller trailing characters detaching from heading/title edges!)
        if (g.tier <= 1 && life > 0.06 && life < 0.78) {
          const cLife = (life - 0.06) / 0.72;
          const cAlpha = Math.sin(cLife * Math.PI) * (g.tier === 0 ? 0.64 : 0.48);
          const side = (g.seed & 1) === 0 ? 1 : -1;
          const wakeIdx = CIPHER_FLOW_H[(g.seed + Math.floor(cLife * 7)) % CIPHER_FLOW_H.length];
          blit(
            wakeIdx,
            2,
            px + side * (10 + 18 * cLife),
            py + dir * (6 + 10 * cLife),
            Math.max(11, g.size * 0.42),
            cAlpha
          );
        }
      }

      // 5. Phase 3 — The Abyssal Current (Sculpted, flowing silk-like ASCII ribbon across the open ocean)
      for (let i = 0; i < carriers.length; i++) {
        const c = carriers[i];
        // Safety launch if wave finished without crossing an edge glyph
        if (!c.launched && outS >= 0.94) {
          c.departAt = Math.min(0.41, t);
          c.launched = true;
        }
        if (!c.launched || t < c.departAt || t > c.arriveAt + 0.06) continue;

        const u = clamp01((t - c.departAt) / Math.max(0.08, c.arriveAt - c.departAt));
        const s = u * u * (3 - 2 * u);
        // Stretch carriers gracefully along the full length of the oceanic ribbon during Phase 3!
        const ribbonEnv = Math.sin(Math.PI * s);
        const sRibbon = clamp01(s + c.alongBias * (ribbonEnv ** 0.75));
        const sp = evalSpline(sRibbon);
        const ribbonPull = ribbonEnv ** 0.72;

        const linX = c.spawnX + (c.targetX - c.spawnX) * s;
        const linY = c.spawnY + (c.targetY - c.spawnY) * s;
        const undul = Math.sin(sRibbon * 6.2 - t * 7.4 + c.wavePhase) * 16 * preset.ribbonWidth;
        const rx = sp.x + sp.nx * (c.laneOffset + undul);
        const ry = sp.y + sp.ny * (c.laneOffset + undul);

        const px = linX + (rx - linX) * ribbonPull;
        const py = linY + (ry - linY) * ribbonPull;

        // Luminous oceanic clarity across Phase 3, flowing smoothly out of disintegration & into reconstruction
        const enter = smoothstep(clamp01(u / 0.12));
        const exit = 1 - smoothstep(clamp01((u - 0.85) / 0.15));
        const alpha = enter * exit * (c.tier === 0 ? 0.94 : c.tier === 1 ? 0.84 : 0.68);
        if (alpha < 0.015) continue;

        // Directional stroke aligned with local current tangent
        const absTx = Math.abs(sp.tx);
        const absTy = Math.abs(sp.ty);
        const ramp = (u < 0.14 || u > 0.86)
          ? CIPHER_CORE
          : absTx > absTy * 1.15
            ? CIPHER_FLOW_H
            : sp.tx * sp.ty > 0
              ? CIPHER_FLOW_D1
              : CIPHER_FLOW_D2;
        const mutTick = Math.floor(u * 10);
        const glyphIdx = ramp[(c.seed + mutTick * 3) % ramp.length];

        // Subtle 3D depth swell as the ribbon glides across mid-ocean
        const depthScale = 0.94 + 0.22 * ribbonEnv;
        const inkRow: 0 | 1 | 2 | 3 =
          (c.tier <= 1 && s > 0.18 && s < 0.84)
            ? ((c.seed & 2) === 0 ? 0 : 1)
            : 2;
        blit(glyphIdx, inkRow, px, py, c.size * depthScale, alpha);

        // Delicate trailing mist echo along primary ribbon strokes so the current reads as a fluid stream
        if (c.tier <= 1 && (i & 1) === 0 && ribbonEnv > 0.28) {
          const echoIdx = CIPHER_FADE[(c.seed + mutTick) % CIPHER_FADE.length];
          blit(echoIdx, 2, px - sp.tx * 18, py - sp.ty * 18, c.size * 0.78, alpha * 0.50 * ribbonEnv);
        }
      }

      // 6. Phase 4 & 5 — Hierarchical Whole-Character Directional ASCII-to-Typography Reconstruction
      const reconTickFast = Math.floor(t * 26);
      const reconTickMed = Math.floor(t * 16);

      for (let bi = 0; bi < reconBlocks.length; bi++) {
        const block = reconBlocks[bi];
        const pl = inPlanes[block.planeIdx];
        const pScale = pl ? pl.scale : 1;
        const pDy = pl ? pl.dy : 0;
        const ox = pl ? pl.ox : 0;
        const oy = pl ? pl.oy : 0;

        // Update each rendered line's directional wave progress & synchronized whole-character staircase DOM clip-path
        let anyActive = false;
        let allDone = true;
        const reveals: number[] = new Array(block.lines.length);

        for (let li = 0; li < block.lines.length; li++) {
          const ln = block.lines[li];
          if (t < ln.decodeStart) {
            ln.reveal = 0;
            allDone = false;
          } else if (t >= ln.decodeEnd) {
            ln.reveal = 1;
          } else {
            const p = (t - ln.decodeStart) / Math.max(0.01, ln.decodeEnd - ln.decodeStart);
            ln.reveal = cubicBezier(p, 0.22, 0.10, 0.25, 1.0);
            allDone = false;
          }
          reveals[li] = ln.reveal;
          if (t >= ln.scrambleStart && ln.reveal < 1) anyActive = true;
        }

        if (allDone) {
          if (!block.settled) {
            block.el.style.removeProperty('clip-path');
            block.settled = true;
          }
          continue;
        }

        // Apply pure-GPU whole-character staircase clip-path so letters emerge 100% intact (never half-sliced!)
        block.el.style.clipPath = buildStaircaseClip(block.width, block.height, block.lines.map(l => l.box), reveals);

        if (!anyActive) continue;

        // Draw live mutating ASCII cipher glyphs strictly over still-clipped characters (zero double-vision!)
        for (let gi = 0; gi < block.glyphs.length; gi++) {
          const g = block.glyphs[gi];
          const ln = block.lines[g.lineIdx];
          if (t < ln.scrambleStart) continue;

          // Exact whole-character lock index matching buildStaircaseClip's charLefts cut!
          const unlockedCount = ln.charCount > 0 ? Math.floor(ln.reveal * ln.charCount) : 0;
          if (g.charIdx < unlockedCount) continue; // Already 100% uncovered & razor-sharp in real DOM!

          const charsAhead = g.charIdx - unlockedCount;
          const isCrest = charsAhead <= (g.tier === 0 ? 1 : 0);

          // Project character slot through the parent plane's exact live depth transform
          const liveX = ox + (g.tx - ox) * pScale;
          const liveY = oy + (g.ty - oy) * pScale + pDy;

          // Subtle depth lift settling into exact baseline as the decoding wave approaches
          const materialize = smoothstep(clamp01((t - ln.scrambleStart) / 0.07));
          const aheadFrac = ln.charCount > 1 ? charsAhead / ln.charCount : 0;
          const settleY = dir * (g.tier === 0 ? 7 : g.tier === 1 ? 5 : 2.5) * Math.min(1, aheadFrac * 2.2) * (1 - ln.reveal);

          const ramp = g.tier === 2
            ? CIPHER_META
            : isCrest
              ? CIPHER_CREST
              : CIPHER_CORE;
          const tick = isCrest ? reconTickFast : reconTickMed;
          const glyphIdx = ramp[(g.seed + tick * 5) % ramp.length];

          const baseAlpha = g.tier === 0
            ? (isCrest ? 0.96 : 0.78)
            : g.tier === 1
              ? (isCrest ? 0.88 : 0.68)
              : g.tier === 2
                ? (isCrest ? 0.64 : 0.44)
                : (isCrest ? 0.70 : 0.50);
          const alpha = materialize * baseAlpha;
          const inkRow: 0 | 1 | 2 | 3 = g.tier === 0
            ? (isCrest ? 0 : 2)
            : g.tier === 1
              ? (isCrest ? 1 : 2)
              : g.tier === 2
                ? 3
                : (isCrest ? 1 : 2);

          blit(
            glyphIdx,
            inkRow,
            liveX,
            liveY + settleY,
            g.size * pScale * (isCrest ? 0.98 : 0.90),
            alpha
          );
        }
      }

      // 7. Reverse Profile -> Shanghai: Globe rim ASCII crystallization as the completed sphere returns
      if (globeCrystals.length && t >= 0.50 && t <= 0.88) {
        const gPl = inPlanes[0];
        const gScale = gPl ? gPl.scale : 1;
        const gDy = gPl ? gPl.dy : 0;
        const gox = gPl ? gPl.ox : width * 0.64;
        const goy = gPl ? gPl.oy : height * 0.47;

        for (let i = 0; i < globeCrystals.length; i++) {
          const gc = globeCrystals[i];
          if (t <= gc.t0 || t >= gc.t1) continue;
          const p = (t - gc.t0) / (gc.t1 - gc.t0);
          const conv = easeOutCubic(p);
          const tx = gox + (gc.tx - gox) * gScale;
          const ty = goy + (gc.ty - goy) * gScale + gDy;
          const x = tx + gc.ox * (1 - conv);
          const y = ty + gc.oy * (1 - conv);
          const alpha = Math.sin(p * Math.PI) * 0.66;
          const glyphIdx = CIPHER_FLOW_H[(gc.seed + Math.floor(p * 6)) % CIPHER_FLOW_H.length];
          blit(glyphIdx, 2, x, y, gc.size * (0.86 + 0.14 * conv), alpha);
        }
      }

      ctx.globalAlpha = 1;
    },

    end() {
      active = false;
      preset = null;

      for (const p of outPlanes) {
        delete p.el.dataset.cvRole;
        p.el.style.removeProperty('transform');
        p.el.style.removeProperty('opacity');
        p.el.style.removeProperty('transform-origin');
      }
      for (const p of inPlanes) {
        delete p.el.dataset.cvRole;
        p.el.style.removeProperty('transform');
        p.el.style.removeProperty('opacity');
        p.el.style.removeProperty('transform-origin');
      }
      for (const b of reconBlocks) {
        b.el.style.removeProperty('clip-path');
      }
      for (const el of datumTagged) {
        el.style.removeProperty('--cv-datum-delay');
        el.style.removeProperty('--cv-datum-dur');
      }

      outPlanes = [];
      outGlyphs = [];
      inPlanes = [];
      reconBlocks = [];
      carriers = [];
      globeCrystals = [];
      datumTagged = [];

      if (ctx) {
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        ctx.globalAlpha = 1;
        ctx.clearRect(0, 0, width, height);
      }
      canvas.style.display = 'none';
    },

    destroy() {
      this.end();
      canvas.remove();
    }
  };
}
