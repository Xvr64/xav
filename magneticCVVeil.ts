import { clamp01, depthPassagePhase, oceanWaveY, type GestureDirection } from './magneticCVState';
import { globeFrame } from './JourneyGlobe';

type FragmentTier = 0 | 1 | 2; // 0 = hero title, 1 = sub/entry/globe rim, 2 = body/meta

interface OutFragment {
  x: number;
  y: number;
  ox: number;
  oy: number;
  u: number;
  tier: FragmentTier;
  isLead: boolean;
  travel: number;
  curl: number;
  seed: number;
  size: number;
  lifeSpan: number;
  releaseAt: number;
  crossedAt: number;
  spawnX: number;
  spawnY: number;
  spawnScale: number;
}

interface InCrystal {
  tx: number;
  ty: number;
  ox: number;
  oy: number;
  t0: number;
  t1: number;
  size: number;
  seed: number;
  tier: FragmentTier;
}

export interface VeilBeginOptions {
  fromEl: HTMLElement;
  fromKind: 'globe' | 'cv';
  toEl: HTMLElement;
  toKind: 'globe' | 'cv';
  dir: GestureDirection;
  toLandingOffset: number;
  landingAtBottom: boolean;
}

export interface VeilFrameState {
  t: number;
  dir: GestureDirection;
  outS: number;
  outEdge: number;
  inS: number;
  inEdge: number;
  tilt: number;
  amp: number;
  phase: number;
  isGlobeHandoff: boolean;
  fromIsGlobe: boolean;
  toIsGlobe: boolean;
  revealTopDown: boolean;
}

export interface MagneticCVVeil {
  begin(opts: VeilBeginOptions): number;
  render(frame: VeilFrameState): void;
  end(): void;
  destroy(): void;
  readonly fragmentCount: number;
}

// Restrained oceanic ASCII vocabulary aligned with heroCurrent.ts and asciiOcean.ts
const ATLAS_CHARS = ['/', '\\', '+', '=', ':', '~', '#', '-', '·', '.', '≈', '|'] as const;
const RAMP_EARLY = [6, 0, 1, 2, 3, 11, 5] as const;      // # / \ + = | ~
const RAMP_MID = [5, 4, 0, 7, 3, 10, 8] as const;        // ~ : / - = ≈ ·
const RAMP_LATE = [4, 9, 8, 8] as const;                 // : . · ·
const WAKE_STROKES = [5, 7, 8, 0, 10] as const;          // ~ - · / ≈
const CRYSTAL_GLYPHS = [8, 4, 2, 0, 5, 3, 11] as const;  // · : + / ~ = |
const CELL_PX = 36;

const hash01 = (n: number) => {
  const s = Math.sin(n * 127.1 + 311.7) * 43758.5453123;
  return s - Math.floor(s);
};

const easeOutCubic = (x: number) => 1 - (1 - clamp01(x)) ** 3;
const easeOutQuad = (x: number) => 1 - (1 - clamp01(x)) ** 2;

function parseRgbCss(raw: string, fallback: [number, number, number]): [number, number, number] {
  const m = raw.match(/\d+/g);
  if (!m || m.length < 3) return fallback;
  return [Number(m[0]), Number(m[1]), Number(m[2])];
}

/** Analytical mirror of CSS depart keyframes so edge-locked ASCII peels off the exact live pushed-in letters. */
function departPlaneTransform(
  t: number,
  tier: FragmentTier,
  isLead: boolean,
  dir: GestureDirection
): { scale: number; dy: number } {
  if (tier === 0) {
    const p1 = clamp01(t / 0.22);
    const e1 = 1 - (1 - p1) ** 2.4;
    const p2 = clamp01((t - 0.22) / 0.26);
    const e2 = p2 * p2 * (3 - 2 * p2);
    const midScale = isLead ? 1.075 : 1.12;
    const endScale = isLead ? 1.135 : 1.21;
    const scale = t <= 0.22 ? 1 + (midScale - 1) * e1 : midScale + (endScale - midScale) * e2;
    const dy = dir * (t <= 0.22 ? -12 * e1 : -12 - 38 * e2);
    return { scale, dy };
  }
  if (tier === 1) {
    const p = clamp01(t / 0.44);
    const e = p * p * (3 - 2 * p);
    return { scale: 1 - 0.085 * e, dy: dir * -46 * e };
  }
  const p = clamp01(t / 0.40);
  const e = p * p * (3 - 2 * p);
  return { scale: 1 - 0.11 * e, dy: dir * -32 * e };
}

/**
 * Ephemeral, strictly typography-locked 2D canvas veil for Abyssal Snap V3.
 * - Zero extra WebGL contexts.
 * - Pre-baked hi-DPI glyph sprite atlas: zero `fillText` / `ctx.font` changes per frame.
 * - `display: none` and zero CPU/GPU cost at rest.
 * - Samples real `.ascii-word` rectangles ONCE per transition (never per frame).
 * - Projects departing words through their live camera push-in transform so ASCII fragments
 *   erupt directly along the curved clipping meniscus with zero ocean clutter.
 */
export function createMagneticCVVeil(): MagneticCVVeil {
  const canvas = document.createElement('canvas');
  canvas.setAttribute('aria-hidden', 'true');
  canvas.dataset.magneticVeil = '';
  canvas.style.cssText =
    'position:fixed;inset:0;z-index:12;pointer-events:none;width:100%;height:100%;display:none;';
  document.body.appendChild(canvas);

  const ctx = canvas.getContext('2d', { alpha: true });

  // Pre-baked 4-row (highlight, primary, sea, muted) × ATLAS_CHARS.length sprite atlas
  const atlas = document.createElement('canvas');
  atlas.width = ATLAS_CHARS.length * CELL_PX;
  atlas.height = 4 * CELL_PX;
  const actx = atlas.getContext('2d', { alpha: true });
  let atlasKey = '';

  let width = 1;
  let height = 1;
  let dpr = 1;
  let active = false;
  let outFragments: OutFragment[] = [];
  let inCrystals: InCrystal[] = [];
  let inkSea: [number, number, number] = [188, 216, 244];
  let inkPrimary: [number, number, number] = [244, 248, 252];

  const syncAtlas = () => {
    const cs = getComputedStyle(document.documentElement);
    const p = parseRgbCss(cs.getPropertyValue('--ink-171717'), [244, 248, 252]);
    const s = parseRgbCss(cs.getPropertyValue('--ink-2F4858'), [188, 216, 244]);
    const m = parseRgbCss(cs.getPropertyValue('--ink-52595E'), [156, 186, 222]);
    // Bright crisp highlight tint derived from the current palette's primary + sea inks
    const hi: [number, number, number] = [
      Math.min(255, Math.round(p[0] * 0.8 + 255 * 0.2)),
      Math.min(255, Math.round(p[1] * 0.82 + 255 * 0.18)),
      Math.min(255, Math.round(p[2] * 0.85 + 255 * 0.15))
    ];
    inkPrimary = p;
    inkSea = s;
    const key = `${hi.join(',')}|${p.join(',')}|${s.join(',')}|${m.join(',')}`;
    if (key === atlasKey || !actx) return;
    atlasKey = key;
    actx.clearRect(0, 0, atlas.width, atlas.height);
    actx.textAlign = 'center';
    actx.textBaseline = 'middle';
    actx.font = '400 26px "IBM Plex Mono", ui-monospace, monospace';
    const rows: [number, number, number][] = [hi, p, s, m];
    for (let r = 0; r < rows.length; r++) {
      const [cr, cg, cb] = rows[r];
      actx.fillStyle = `rgb(${cr},${cg},${cb})`;
      for (let c = 0; c < ATLAS_CHARS.length; c++) {
        actx.fillText(ATLAS_CHARS[c], c * CELL_PX + CELL_PX / 2, r * CELL_PX + CELL_PX / 2);
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
    if (!ctx || alpha < 0.015) return;
    const drawSize = size * 1.22;
    ctx.globalAlpha = alpha;
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

    // 1. Soft atmospheric current bloom along the curved clip boundary
    const haloGrad = ctx.createLinearGradient(0, 0, width, 0);
    haloGrad.addColorStop(0, `rgba(${sr},${sg},${sb},0)`);
    haloGrad.addColorStop(0.18, `rgba(${sr},${sg},${sb},${(0.055 * env).toFixed(4)})`);
    haloGrad.addColorStop(0.5, `rgba(${sr},${sg},${sb},${(0.082 * env).toFixed(4)})`);
    haloGrad.addColorStop(0.82, `rgba(${sr},${sg},${sb},${(0.055 * env).toFixed(4)})`);
    haloGrad.addColorStop(1, `rgba(${sr},${sg},${sb},0)`);
    ctx.strokeStyle = haloGrad;
    ctx.lineWidth = 28;
    ctx.stroke();

    // 2. Crisp translucent luminous meniscus crest tracing the curved wave
    const crestGrad = ctx.createLinearGradient(0, 0, width, 0);
    crestGrad.addColorStop(0, `rgba(${pr},${pg},${pb},0)`);
    crestGrad.addColorStop(0.15, `rgba(${sr},${sg},${sb},${(0.16 * env).toFixed(4)})`);
    crestGrad.addColorStop(0.5, `rgba(${pr},${pg},${pb},${(0.24 * env).toFixed(4)})`);
    crestGrad.addColorStop(0.85, `rgba(${sr},${sg},${sb},${(0.16 * env).toFixed(4)})`);
    crestGrad.addColorStop(1, `rgba(${pr},${pg},${pb},0)`);
    ctx.strokeStyle = crestGrad;
    ctx.lineWidth = 1.25;
    ctx.stroke();
  };

  const sampleDepartingCV = (section: HTMLElement): OutFragment[] => {
    const out: OutFragment[] = [];
    const maxTotal = width < 768 ? 170 : 300;
    const isIntro = section.id === 'introduction';
    const heroBox = section.querySelector<HTMLElement>(isIntro ? '.lead' : '.section-head, h2.ocean-h2')?.getBoundingClientRect();
    const isIndented = !!section.querySelector('.section-head--indented');
    const heroOriginX = heroBox ? heroBox.left + heroBox.width * (isIndented ? 0.24 : 0.14) : width * 0.18;
    const heroOriginY = heroBox ? heroBox.top + heroBox.height * 0.46 : height * 0.34;

    const words = [...section.querySelectorAll<HTMLElement>('.ascii-word')];
    const heroWords: { r: DOMRect; ox: number; oy: number }[] = [];
    const subWords: { r: DOMRect; ox: number; oy: number }[] = [];
    const bodyWords: { r: DOMRect; ox: number; oy: number }[] = [];

    for (const el of words) {
      const r = el.getBoundingClientRect();
      if (r.width < 2 || r.height < 2 || r.bottom < -12 || r.top > height + 12) continue;
      if (el.closest('h2.ocean-h2, #introduction .lead')) {
        heroWords.push({ r, ox: heroOriginX, oy: heroOriginY });
      } else if (el.closest('h3, .entry-title, .lang-name, .contact-address')) {
        const row = el.closest<HTMLElement>('.exp-entry, .edu-entry, .skill-row, .lang-row, .interest, .contact-mail, .contact-foot');
        const rr = row ? row.getBoundingClientRect() : r;
        subWords.push({ r, ox: rr.left + rr.width * 0.14, oy: rr.top + rr.height * 0.46 });
      } else {
        const row = el.closest<HTMLElement>('.exp-entry, .edu-entry, .skill-row, .lang-row, .interest, .intro-support, .intro-facts > div, .contact-mail, .contact-foot');
        const rr = row ? row.getBoundingClientRect() : r;
        bodyWords.push({ r, ox: rr.left + rr.width * 0.14, oy: rr.top + rr.height * 0.46 });
      }
    }

    const pushFromRect = (
      entry: { r: DOMRect; ox: number; oy: number },
      tier: FragmentTier,
      stepPx: number,
      budget: number
    ) => {
      const { r, ox, oy } = entry;
      const cols = Math.max(1, Math.min(budget, Math.round(r.width / stepPx)));
      const rows = tier === 0 && r.height > 44 ? 2 : 1;
      for (let row = 0; row < rows; row++) {
        for (let c = 0; c < cols; c++) {
          if (out.length >= maxTotal) return;
          const idx = out.length + 1;
          const fx = cols === 1 ? 0.5 : (c + 0.5) / cols;
          const fy = rows === 1 ? 0.52 : (row === 0 ? 0.34 : 0.68);
          const jitterY = (hash01(idx * 3.1) - 0.5) * r.height * 0.16;
          const x = r.left + fx * r.width;
          const y = r.top + r.height * fy + jitterY;
          const isHero = tier === 0;
          const isSub = tier === 1;
          out.push({
            x,
            y,
            ox,
            oy,
            u: clamp01(x / width),
            tier,
            isLead: isIntro,
            travel: (isHero ? 56 : isSub ? 40 : 28) + hash01(idx * 5.7) * (isHero ? 36 : isSub ? 24 : 16),
            curl: (hash01(idx * 7.3) - 0.5) * (isHero ? 42 : isSub ? 28 : 18),
            seed: idx * 19 + Math.floor(hash01(idx) * 97),
            size: isHero ? Math.min(17.5, Math.max(13, r.height * 0.24)) : isSub ? Math.min(14, Math.max(11, r.height * 0.34)) : 10.5,
            lifeSpan: isHero ? 0.27 : isSub ? 0.23 : 0.18,
            releaseAt: -1,
            crossedAt: -1,
            spawnX: x,
            spawnY: y,
            spawnScale: 1
          });
        }
      }
    };

    const heroCap = Math.round(maxTotal * 0.52);
    for (const w of heroWords) {
      if (out.length >= heroCap) break;
      pushFromRect(w, 0, width < 768 ? 11 : 9, Math.min(16, heroCap - out.length));
    }

    const subCap = Math.round(maxTotal * 0.80);
    const subStride = Math.max(1, Math.ceil(subWords.length / 34));
    for (let i = 0; i < subWords.length && out.length < subCap; i += subStride) {
      pushFromRect(subWords[i], 1, 14, Math.min(5, subCap - out.length));
    }

    const remaining = maxTotal - out.length;
    if (remaining > 0 && bodyWords.length) {
      const bodyStride = Math.max(1, Math.ceil(bodyWords.length / remaining));
      for (let i = 0; i < bodyWords.length && out.length < maxTotal; i += bodyStride) {
        pushFromRect(bodyWords[i], 2, 24, 2);
      }
    }

    return out;
  };

  const sampleDepartingGlobe = (globeStage: HTMLElement): OutFragment[] => {
    const out: OutFragment[] = [];
    const activeCaption = globeStage.querySelector<HTMLElement>('.globe-caption > div[aria-hidden="false"]');
    if (activeCaption) {
      const capRect = activeCaption.getBoundingClientRect();
      const capOx = capRect.left + capRect.width * 0.12;
      const capOy = capRect.top + capRect.height * 0.5;
      const nodes = [...activeCaption.querySelectorAll<HTMLElement>('h3, p')];
      for (const node of nodes) {
        const r = node.getBoundingClientRect();
        if (r.width < 2 || r.height < 2) continue;
        const isCity = node.matches('h3');
        const textLen = (node.textContent ?? '').trim().length;
        const tightW = Math.min(r.width, isCity ? Math.max(140, textLen * 32) : Math.max(60, textLen * 9.5));
        const cols = isCity ? Math.min(22, Math.max(10, Math.round(tightW / 10))) : Math.min(10, Math.max(4, Math.round(tightW / 16)));
        for (let c = 0; c < cols; c++) {
          const idx = out.length + 1;
          const x = r.left + ((c + 0.5) / cols) * tightW;
          const y = r.top + r.height * 0.52 + (hash01(idx * 2.9) - 0.5) * r.height * 0.22;
          out.push({
            x,
            y,
            ox: capOx,
            oy: capOy,
            u: clamp01(x / width),
            tier: isCity ? 0 : 2,
            isLead: false,
            travel: (isCity ? 58 : 30) + hash01(idx * 4.3) * 28,
            curl: (hash01(idx * 8.1) - 0.5) * 34,
            seed: idx * 23,
            size: isCity ? 18 : 11.5,
            lifeSpan: isCity ? 0.28 : 0.21,
            releaseAt: 0.17 + (c / Math.max(1, cols)) * 0.16 + (isCity ? 0.02 : 0),
            crossedAt: -1,
            spawnX: x,
            spawnY: y,
            spawnScale: 1
          });
        }
      }
    }

    const stageRect = globeStage.getBoundingClientRect();
    const { cx, cy, baseR } = globeFrame(stageRect.width || width, stageRect.height || height);
    const R = baseR * 1.08;
    const gcx = stageRect.left + cx;
    const gcy = stageRect.top + cy;
    const rimCount = width < 768 ? 44 : 68;
    for (let i = 0; i < rimCount; i++) {
      const angle = (i / rimCount) * Math.PI * 2;
      const radial = R * (0.98 + hash01(i * 6.7) * 0.04);
      const x = gcx + Math.cos(angle) * radial;
      const y = gcy + Math.sin(angle) * radial;
      const verticalBias = (Math.sin(angle) + 1) * 0.5;
      out.push({
        x,
        y,
        ox: gcx,
        oy: gcy,
        u: clamp01(x / width),
        tier: 1,
        isLead: false,
        travel: 42 + hash01(i * 9.3) * 30,
        curl: Math.cos(angle) * 32,
        seed: 500 + i * 17,
        size: 12,
        lifeSpan: 0.28,
        releaseAt: 0.16 + verticalBias * 0.18,
        crossedAt: -1,
        spawnX: x,
        spawnY: y,
        spawnScale: 1
      });
    }
    return out;
  };

  const sampleIncomingHero = (
    toEl: HTMLElement,
    toKind: 'globe' | 'cv',
    dir: GestureDirection,
    toLandingOffset: number,
    landingAtBottom: boolean
  ): InCrystal[] => {
    const crystals: InCrystal[] = [];
    if (toKind === 'globe') {
      const stageRect = toEl.getBoundingClientRect();
      const { cx, cy, baseR } = globeFrame(stageRect.width || width, stageRect.height || height);
      const R = baseR * 1.08;
      const gcx = stageRect.left + cx;
      const gcy = cy;
      const count = width < 768 ? 36 : 56;
      for (let i = 0; i < count; i++) {
        const angle = (i / count) * Math.PI * 2;
        const tx = gcx + Math.cos(angle) * R;
        const ty = gcy + Math.sin(angle) * R;
        const startShift = 0.44 + ((Math.sin(angle) + 1) * 0.5) * 0.12;
        crystals.push({
          tx,
          ty,
          ox: Math.cos(angle) * 32,
          oy: Math.sin(angle) * 32 - 22,
          t0: startShift,
          t1: startShift + 0.26,
          size: 12,
          seed: 900 + i * 13,
          tier: 1
        });
      }
      return crystals;
    }

    if (landingAtBottom) return crystals;

    const hero = toEl.querySelector<HTMLElement>('h2.ocean-h2, .lead');
    if (!hero) return crystals;
    const sectionRect = toEl.getBoundingClientRect();
    const wordEls = [...hero.querySelectorAll<HTMLElement>('.ascii-word')];
    if (!wordEls.length) return crystals;

    const maxCrystals = width < 768 ? 28 : 50;
    const wordBoxes: { left: number; top: number; w: number; h: number }[] = [];
    for (const wEl of wordEls) {
      const r = wEl.getBoundingClientRect();
      const relTop = r.top - sectionRect.top - toLandingOffset;
      if (r.width < 2 || r.height < 2 || relTop < -20 || relTop > height) continue;
      wordBoxes.push({ left: r.left, top: relTop, w: r.width, h: r.height });
    }
    if (!wordBoxes.length) return crystals;

    const totalWidth = wordBoxes.reduce((acc, b) => acc + b.w, 0) || 1;
    let cursor = 0;
    for (let wi = 0; wi < wordBoxes.length && crystals.length < maxCrystals; wi++) {
      const b = wordBoxes[wi];
      const quota = Math.max(1, Math.min(10, Math.round((b.w / totalWidth) * maxCrystals)));
      for (let k = 0; k < quota && crystals.length < maxCrystals; k++) {
        const fx = quota === 1 ? 0.5 : (k + 0.5) / quota;
        const tx = b.left + fx * b.w;
        const ty = b.top + b.h * (0.44 + (hash01(cursor * 3.7) - 0.5) * 0.28);
        const progressAlongHeading = cursor / Math.max(1, maxCrystals - 1);
        const t0 = 0.43 + progressAlongHeading * 0.09;
        crystals.push({
          tx,
          ty,
          ox: (hash01(cursor * 4.1) - 0.5) * 22,
          oy: dir * (28 + hash01(cursor * 7.7) * 22),
          t0,
          t1: Math.min(0.72, t0 + 0.20),
          size: Math.min(17, Math.max(12, b.h * 0.24)),
          seed: 1200 + cursor * 29,
          tier: 0
        });
        cursor++;
      }
    }
    return crystals;
  };

  return {
    get fragmentCount() {
      return outFragments.length + inCrystals.length;
    },

    begin(opts) {
      if (!ctx) return 0;
      sizeCanvas();
      syncAtlas();
      outFragments =
        opts.fromKind === 'globe'
          ? sampleDepartingGlobe(opts.fromEl)
          : sampleDepartingCV(opts.fromEl);
      inCrystals = sampleIncomingHero(
        opts.toEl,
        opts.toKind,
        opts.dir,
        opts.toLandingOffset,
        opts.landingAtBottom
      );
      active = true;
      canvas.style.display = 'block';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.globalAlpha = 1;
      ctx.clearRect(0, 0, width, height);
      return outFragments.length + inCrystals.length;
    },

    render({ t, dir, outS, outEdge, inS, inEdge, tilt, amp, phase, isGlobeHandoff, fromIsGlobe, toIsGlobe }) {
      if (!active || !ctx) return;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.globalAlpha = 1;
      ctx.clearRect(0, 0, width, height);

      // 1. Stage C — Continuous Ocean Depth Movement (subtle atmospheric current wash + depth-lens vignette)
      const depthBell = depthPassagePhase(t);
      if (depthBell > 0.005) {
        const [sr, sg, sb] = inkSea;

        // Directional luminous ocean current sweeping across the depth bridge
        const bandFrac = dir > 0 ? 0.14 + (t - 0.22) * 1.38 : 0.86 - (t - 0.22) * 1.38;
        const bandY = height * bandFrac;
        const bandH = height * (isGlobeHandoff ? 0.42 : 0.34);
        const grad = ctx.createLinearGradient(0, bandY - bandH, 0, bandY + bandH);
        const peakAlpha = (isGlobeHandoff ? 0.095 : 0.072) * depthBell;
        grad.addColorStop(0, `rgba(${sr},${sg},${sb},0)`);
        grad.addColorStop(0.5, `rgba(${sr},${sg},${sb},${peakAlpha.toFixed(4)})`);
        grad.addColorStop(1, `rgba(${sr},${sg},${sb},0)`);
        ctx.fillStyle = grad;
        ctx.fillRect(0, Math.max(0, bandY - bandH), width, bandH * 2);

        // Subtle peripheral abyssal depth vignette (enhances 3D camera push-in sensation)
        const maxR = Math.hypot(width * 0.5, height * 0.5);
        const vig = ctx.createRadialGradient(width * 0.5, height * 0.48, maxR * 0.32, width * 0.5, height * 0.48, maxR * 1.05);
        vig.addColorStop(0, 'rgba(3, 8, 22, 0)');
        vig.addColorStop(1, `rgba(3, 8, 22, ${(0.16 * depthBell).toFixed(4)})`);
        ctx.fillStyle = vig;
        ctx.fillRect(0, 0, width, height);
      }

      // 2. Curved oceanic clipping meniscus along BOTH outgoing & incoming sweeps
      if (!fromIsGlobe && outS > 0.02 && outS < 0.99) {
        drawWaveMeniscus(outEdge, tilt, amp, phase, outS, 1.0);
      }
      if (!toIsGlobe && inS > 0.02 && inS < 0.98) {
        drawWaveMeniscus(inEdge, tilt * 0.84, amp * 0.86, phase + 0.85, inS, 0.88);
      }

      // 3. Stage B — Live-projected, edge-locked outgoing ASCII fragmentation (zero ocean clutter)
      const shimmerTick = Math.floor(t * 32);
      for (let i = 0; i < outFragments.length; i++) {
        const f = outFragments[i];
        if (f.crossedAt < 0) {
          if (f.releaseAt >= 0) {
            if (t >= f.releaseAt) {
              const xf = departPlaneTransform(t, f.tier, f.isLead, dir);
              f.spawnX = f.ox + (f.x - f.ox) * xf.scale;
              f.spawnY = f.oy + (f.y - f.oy) * xf.scale + xf.dy;
              f.spawnScale = xf.scale;
              f.crossedAt = t;
            } else continue;
          } else {
            const xf = departPlaneTransform(t, f.tier, f.isLead, dir);
            const liveX = f.ox + (f.x - f.ox) * xf.scale;
            const liveY = f.oy + (f.y - f.oy) * xf.scale + xf.dy;
            const waveAtX = oceanWaveY(clamp01(liveX / width), outEdge, tilt, amp, phase);
            const distAhead = dir > 0 ? liveY - waveAtX : waveAtX - liveY;

            // Pre-cut local fracture: glyphs ignite right on the letter edge as the curved meniscus touches it
            if (outS > 0 && outS < 1 && distAhead > 0 && distAhead < 48) {
              const fringe = 1 - distAhead / 48;
              const alpha = fringe * fringe * (f.tier === 0 ? 0.88 : f.tier === 1 ? 0.64 : 0.38);
              const glyphIdx = RAMP_EARLY[(f.seed + shimmerTick) % RAMP_EARLY.length];
              blit(
                glyphIdx,
                f.tier === 0 ? 0 : 1,
                liveX + (hash01(f.seed) - 0.5) * 4,
                liveY - dir * fringe * 5,
                f.size * xf.scale,
                alpha
              );
            }
            if (outS >= 1 || (outS > 0 && distAhead <= 0)) {
              f.spawnX = liveX;
              f.spawnY = liveY;
              f.spawnScale = xf.scale;
              f.crossedAt = t;
            } else continue;
          }
        }

        const life = (t - f.crossedAt) / f.lifeSpan;
        if (life < 0 || life >= 1) continue;

        const driftE = easeOutCubic(life);
        const curlE = easeOutQuad(life);
        const px = f.spawnX + f.curl * curlE + Math.sin(f.spawnY * 0.014 + phase + f.seed * 0.1) * 8 * curlE;
        const py = f.spawnY - dir * f.travel * driftE;

        const release = Math.min(1, life / 0.10);
        const fade = (1 - life) ** 1.35;
        const peak = f.tier === 0 ? 0.96 : f.tier === 1 ? 0.80 : 0.54;
        const alpha = release * fade * peak;
        if (alpha < 0.015) continue;

        const ramp = life < 0.28 ? RAMP_EARLY : life < 0.66 ? RAMP_MID : RAMP_LATE;
        const tick = Math.floor(life * 6);
        const glyphIdx = ramp[(f.seed + tick * 3) % ramp.length];
        // Hero fragments subtly expand as they slip past the lens, then thin gracefully
        const sz = f.size * f.spawnScale * (f.tier === 0 ? (1 + life * 0.08) : (1 - life * 0.15));
        const inkRow: 0 | 1 | 2 | 3 = f.tier === 0 ? (life < 0.28 ? 0 : life < 0.58 ? 1 : 2) : f.tier === 1 ? 2 : 3;
        blit(glyphIdx, inkRow, px, py, sz, alpha);

        // Localized micro-wake strictly behind hero & sub fragments (never stray ocean particles)
        if (f.tier <= 1 && (f.seed & 3) === 0 && life > 0.08 && life < 0.72) {
          const wakeIdx = WAKE_STROKES[(f.seed + tick) % WAKE_STROKES.length];
          blit(wakeIdx, 2, px + (f.curl >= 0 ? 10 : -10), py + dir * 7, sz * 0.88, alpha * 0.38);
        }
      }

      // 4. Stage D — Localized pre-crystallization strictly inside incoming Hero word boxes / Globe rim
      if (t >= 0.42 && t <= 0.74 && inCrystals.length) {
        for (let i = 0; i < inCrystals.length; i++) {
          const c = inCrystals[i];
          if (t <= c.t0 || t >= c.t1) continue;
          const p = (t - c.t0) / (c.t1 - c.t0);
          const conv = easeOutCubic(p);
          const x = c.tx + c.ox * (1 - conv);
          const y = c.ty + c.oy * (1 - conv);
          const alpha = Math.sin(p * Math.PI) * (c.tier === 0 ? 0.62 : 0.48);
          const glyphIdx = CRYSTAL_GLYPHS[(c.seed + Math.floor(p * 5)) % CRYSTAL_GLYPHS.length];
          blit(glyphIdx, c.tier === 0 ? 0 : 2, x, y, c.size * (0.86 + 0.14 * conv), alpha);
        }
      }
      ctx.globalAlpha = 1;
    },

    end() {
      active = false;
      outFragments = [];
      inCrystals = [];
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
