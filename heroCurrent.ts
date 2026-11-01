// ============================================================================
// HERO CURRENT — "A journey without horizons" → "Xavier Hery"
// ============================================================================
// The cover headline breaks into ASCII fragments that an ocean current carries across the
// stage and gathers into the name, built as a dot-matrix of monospaced glyphs that finally
// resolves into the real type of the name lock-up.
//
// Every particle's position, glyph, ink and opacity is a pure function of the hero's scroll
// progress t ∈ [0, 1]: scrolling back reverses the sequence exactly, and a still page never
// changes. Nothing animates on its own — the canvas is redrawn only when scroll or layout
// changes, so this adds no loop of its own next to the whales and the fluid.
//
// The same progress times the break-up against an invisible waterline under the first line:
// it rises out of view as the visitor descends, and each letter breaks up the moment the water
// reaches it. The line itself is never drawn; the ocean fills the screen from the first frame.
//
// Choreography (refined in the browser):
//   0.00–0.05  arrival: the headline still, "horizons" already in the water
//   0.05–0.42  the waterline rises out of view; letters break up as the water passes them
//   0.42–0.78  the current carries the fragments and gathers Xavier, then Hery
//   0.76–0.88  the ASCII name resolves into the type of the lock-up
//   0.88–1.00  the name holds, complete and still

export interface HeroRect {
  left: number;
  top: number;
  width: number;
  height: number;
}

export interface HeroCurrentOptions {
  canvas: HTMLCanvasElement;
  /** The scroll runway; its progress drives everything. */
  section: HTMLElement;
  /** The sticky full-viewport stage inside the runway. */
  stage: HTMLElement;
  /** One span per headline letter (spaces excluded), in reading order. */
  letters: HTMLElement[];
  /** The name lock-up the current resolves into (kept transparent until it does). */
  nameEl: HTMLElement;
  /** Its lines, each set in its own face and position by CSS. */
  nameLines: HTMLElement[];
  /** The invisible datum under the first line: where the waterline rests on arrival. */
  horizon?: HTMLElement | null;
  /** Viewport rects of the typography currently on stage, for the calm zones around it. */
  onZones?: (rects: HeroRect[]) => void;
  /** Called on every drawn scroll position with the cover's state (viewport px). */
  onFrame?: (state: HeroFrame) => void;
}

export interface HeroFrame {
  /** Progress through the runway, 0–1. */
  t: number;
  /** Viewport y of the stage: 0 while pinned, negative once the runway has passed. */
  stageTop: number;
  stageHeight: number;
}

export interface HeroCurrentHandle {
  destroy(): void;
}

// The restrained character language of the current
const FLIGHT = '·:.+*#%@/\\|0123456789';
// The name: dense cores, mid tones, light edges (all from the same alphabet)
const DENSE = '#%@8';
const MID = '0698+*';
const EDGE = ':·./\\|1';
const CHARS = Array.from(new Set(Array.from(FLIGHT + DENSE + MID + EDGE)));
const CHAR_INDEX = new Map(CHARS.map((c, i) => [c, i]));
// Fresh fragment · fragment in the current · formed name
const INKS = ['#2F4858', '#647887', '#171717'];
// The waterline rises from under the first line to just above the top of the stage
const RISE: [number, number] = [0.05, 0.42];
/** "horizons" starts below the surface, so it is the first word to go. */
const SUBMERGED_RELEASE = 0.075;
const ARRIVE_START = 0.42;
const ARRIVE_SPREAD = 0.22; // last arrival ends ≤ 0.78
const ARRIVE_DURATION = 0.14;
const STRAY_FADE: [number, number] = [0.5, 0.68];
/** The ASCII name hands over to the type: the type comes up, then the glyphs go. */
const TYPE_IN: [number, number] = [0.76, 0.85];
const GLYPHS_OUT: [number, number] = [0.79, 0.88];
/** From here the glyphs are gone: the image is final and is never redrawn. */
const HOLD = 0.88;

const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);
const smooth = (a: number, b: number, v: number) => {
  const x = clamp01((v - a) / (b - a));
  return x * x * (3 - 2 * x);
};
const easeInOutCubic = (x: number) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);
/** Deterministic per-index hash in [0, 1). */
const hash = (i: number, k: number) => {
  const s = Math.sin(i * 12.9898 + k * 78.233) * 43758.5453;
  return s - Math.floor(s);
};

export function createHeroCurrent(opts: HeroCurrentOptions): HeroCurrentHandle {
  const { canvas, section, stage, letters: initialLetters, nameEl, nameLines, horizon, onZones, onFrame } = opts;
  let letters = initialLetters;
  const ctx = canvas.getContext('2d');
  if (!ctx) return { destroy() {} };

  let disposed = false;
  let frame = 0;
  let dpr = 1;
  let viewW = 0;
  let stageH = 0;
  let sectionTop = 0;
  let runway = 1;
  let cellW = 6;
  let cellH = 10;
  let ready = false;
  let drewLast = false;
  let drawnT = NaN;
  let canvasShift = 0;

  // Particle state (rebuilt on layout changes only)
  let count = 0;
  let sx = new Float32Array(0);
  let sy = new Float32Array(0);
  let tx = new Float32Array(0);
  let ty = new Float32Array(0);
  let rel = new Float32Array(0);
  let a0 = new Float32Array(0);
  let field = new Float32Array(0);
  let speed = new Float32Array(0);
  let seed = new Uint16Array(0);
  let targetGlyph = new Int16Array(0); // -1 for strays
  let targetAlpha = new Float32Array(0);

  // Headline letters: release time per letter, last opacity written
  let letterRelease = new Float32Array(0);
  let letterOpacity = new Float32Array(0);
  let headlineRects: HeroRect[] = [];
  let nameRects: HeroRect[] = [];
  let releaseEnd = RISE[1];
  // Waterline: rest position (stage px) and where it leaves the stage
  let horizonRest = 0;
  let horizonEnd = -40;
  let lastTypeOpacity = -1;

  // Glyph atlas: one column per character, one row per ink
  const atlas = document.createElement('canvas');
  let atlasW = 1;
  let atlasH = 1;

  const maskCanvas = document.createElement('canvas');
  const mctx = maskCanvas.getContext('2d', { willReadFrequently: true });

  const bakeAtlas = () => {
    atlasW = Math.ceil(cellW * dpr);
    atlasH = Math.ceil(cellH * dpr);
    atlas.width = atlasW * CHARS.length;
    atlas.height = atlasH * INKS.length;
    const a = atlas.getContext('2d');
    if (!a) return;
    a.clearRect(0, 0, atlas.width, atlas.height);
    a.textAlign = 'center';
    a.textBaseline = 'middle';
    a.font = `600 ${(cellH * 0.94 * dpr).toFixed(2)}px "JetBrains Mono", ui-monospace, monospace`;
    INKS.forEach((ink, row) => {
      a.fillStyle = ink;
      CHARS.forEach((ch, col) => a.fillText(ch, col * atlasW + atlasW / 2, row * atlasH + atlasH / 2 + 0.5 * dpr));
    });
  };

  /** Cells (centre points) of the grid whose sample in the current mask is inked. */
  const sampleMask = (w: number, h: number, threshold: number) => {
    const data = mctx!.getImageData(0, 0, w, h).data;
    const cols = Math.floor(w / cellW);
    const rows = Math.floor(h / cellH);
    const occ = new Uint8Array(cols * rows);
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        // 2×2 supersample per cell so thin serifs still register
        let ink = 0;
        for (let oy = 0.3; oy < 1; oy += 0.4) {
          for (let ox = 0.3; ox < 1; ox += 0.4) {
            const px = Math.min(w - 1, ((c + ox) * cellW) | 0);
            const py = Math.min(h - 1, ((r + oy) * cellH) | 0);
            ink += data[(py * w + px) * 4 + 3];
          }
        }
        if (ink / 4 > threshold) occ[r * cols + c] = 1;
      }
    }
    return { occ, cols, rows };
  };

  const measure = () => {
    if (!mctx) return;
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    viewW = window.innerWidth;
    const viewH = window.innerHeight;
    canvas.width = Math.round(viewW * dpr);
    canvas.height = Math.round(viewH * dpr);

    const sr = stage.getBoundingClientRect();
    stageH = sr.height || viewH;
    sectionTop = section.getBoundingClientRect().top + window.scrollY;
    runway = Math.max(1, section.offsetHeight - stageH);

    // ---- Target layout: the name lock-up, exactly where CSS set its type ------------------
    const lineBoxes = nameLines.map((el) => {
      const r = el.getBoundingClientRect();
      return { el, x: r.left, y: r.top - sr.top, w: r.width, h: r.height, cs: getComputedStyle(el) };
    });
    const nameFontPx = parseFloat(getComputedStyle(nameEl).fontSize) || 120;
    // Cells follow the strokes of the light serif: hairlines still register as one glyph
    const capH = nameFontPx * 0.63;
    cellH = Math.max(4, Math.min(9, capH / 19));
    cellW = cellH * 0.6;

    maskCanvas.width = Math.max(1, Math.ceil(viewW));
    maskCanvas.height = Math.max(1, Math.ceil(stageH));
    const W = maskCanvas.width;
    const H = maskCanvas.height;
    const spacing = mctx as CanvasRenderingContext2D & { letterSpacing?: string };

    mctx.clearRect(0, 0, W, H);
    mctx.fillStyle = '#000';
    mctx.textAlign = 'left';
    mctx.textBaseline = 'alphabetic';
    nameRects = [];
    for (const b of lineBoxes) {
      const cs = b.cs;
      mctx.font = `${cs.fontStyle} ${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`;
      if ('letterSpacing' in spacing) spacing.letterSpacing = cs.letterSpacing;
      const text = b.el.textContent || '';
      const m = mctx.measureText(text);
      const asc = m.fontBoundingBoxAscent || nameFontPx * 0.8;
      const desc = m.fontBoundingBoxDescent || nameFontPx * 0.2;
      const baseline = b.y + (b.h - (asc + desc)) / 2 + asc;
      mctx.fillText(text, b.x, baseline);
      const inkAsc = m.actualBoundingBoxAscent || capH;
      nameRects.push({ left: b.x, top: baseline - inkAsc, width: m.width, height: inkAsc + (m.actualBoundingBoxDescent || 0) });
    }
    if ('letterSpacing' in spacing) spacing.letterSpacing = '0px';
    const target = sampleMask(W, H, 52);
    const targets: { x: number; y: number; edge: number }[] = [];
    for (let r = 1; r < target.rows - 1; r++) {
      for (let c = 1; c < target.cols - 1; c++) {
        const i = r * target.cols + c;
        if (!target.occ[i]) continue;
        let n = 0;
        for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) n += target.occ[i + dy * target.cols + dx];
        targets.push({ x: (c + 0.5) * cellW, y: (r + 0.5) * cellH, edge: n });
      }
    }

    // ---- Source layout: the real headline letters, where the browser set them -------------
    mctx.clearRect(0, 0, W, H);
    const currentLetters = Array.from(stage.querySelectorAll<HTMLElement>('[data-hero-letter]'));
    if (currentLetters.length > 0) letters = currentLetters;
    const sources: { x: number; y: number; letter: number; local: number }[] = [];
    let minX = Infinity;
    let maxX = -Infinity;
    const letterBoxes = letters.map((el) => {
      const r = el.getBoundingClientRect();
      const box = { x: r.left, y: r.top - sr.top, w: r.width, h: r.height };
      minX = Math.min(minX, box.x);
      maxX = Math.max(maxX, box.x + box.w);
      const cs = getComputedStyle(el);
      mctx.font = `${cs.fontStyle} ${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`;
      const m = mctx.measureText(el.textContent || '');
      const asc = m.fontBoundingBoxAscent || parseFloat(cs.fontSize) * 0.8;
      const desc = m.fontBoundingBoxDescent || parseFloat(cs.fontSize) * 0.2;
      mctx.fillText(el.textContent || '', box.x, box.y + (box.h - (asc + desc)) / 2 + asc);
      return box;
    });
    const source = sampleMask(W, H, 70);
    const taken = new Uint8Array(source.occ.length);
    letterBoxes.forEach((b, li) => {
      const c0 = Math.max(0, Math.floor(b.x / cellW) - 1);
      const c1 = Math.min(source.cols - 1, Math.ceil((b.x + b.w) / cellW) + 1);
      const r0 = Math.max(0, Math.floor(b.y / cellH));
      const r1 = Math.min(source.rows - 1, Math.ceil((b.y + b.h) / cellH));
      for (let r = r0; r <= r1; r++) {
        for (let c = c0; c <= c1; c++) {
          const i = r * source.cols + c;
          if (!source.occ[i] || taken[i]) continue;
          taken[i] = 1;
          const x = (c + 0.5) * cellW;
          sources.push({ x, y: (r + 0.5) * cellH, letter: li, local: clamp01((x - b.x) / Math.max(1, b.w)) });
        }
      }
    });

    // Lines of the headline (for the calm zone while it is still on stage)
    headlineRects = [];
    letterBoxes.forEach((b) => {
      const line = headlineRects.find((l) => Math.abs(l.top - b.y) < b.h * 0.5);
      if (line) {
        const right = Math.max(line.left + line.width, b.x + b.w);
        line.left = Math.min(line.left, b.x);
        line.width = right - line.left;
      } else headlineRects.push({ left: b.x, top: b.y, width: b.w, height: b.h });
    });

    // Waterline rest position: just under the first line's baseline (set by CSS)
    horizonRest = horizon ? horizon.getBoundingClientRect().top - sr.top : stageH * 0.55;
    horizonEnd = -Math.max(40, stageH * 0.06);

    // Release: each letter breaks up as the rising water reaches its middle, with a slight
    // left → right lag so the line dissolves like a wave rather than a cut. The letters already
    // below the surface ("horizons") go first, as soon as the descent begins.
    const spanX = Math.max(1, maxX - minX);
    letterRelease = new Float32Array(letters.length);
    letterOpacity = new Float32Array(letters.length).fill(-1);
    releaseEnd = 0;
    letterBoxes.forEach((b, li) => {
      const ux = (b.x + b.w / 2 - minX) / spanX;
      const cy = b.y + b.h * 0.55;
      const base = cy >= horizonRest ? SUBMERGED_RELEASE : riseTimeAt(cy);
      letterRelease[li] = base + 0.05 * ux + 0.008 * Math.sin(ux * 9 + li);
      releaseEnd = Math.max(releaseEnd, letterRelease[li] + 0.04);
    });

    // ---- Pair fragments with name cells by horizontal rank ---------------------------------
    sources.sort((p, q) => p.x - q.x || p.y - q.y);
    targets.sort((p, q) => p.x - q.x || p.y - q.y);
    const nS = sources.length;
    const nT = targets.length;
    count = nS === 0 ? 0 : Math.max(nS, nT);
    sx = new Float32Array(count);
    sy = new Float32Array(count);
    tx = new Float32Array(count);
    ty = new Float32Array(count);
    rel = new Float32Array(count);
    a0 = new Float32Array(count);
    field = new Float32Array(count);
    speed = new Float32Array(count);
    seed = new Uint16Array(count);
    targetGlyph = new Int16Array(count);
    targetAlpha = new Float32Array(count);
    if (count === 0) return;

    let tMinX = Infinity;
    let tMaxX = -Infinity;
    for (const t of targets) {
      tMinX = Math.min(tMinX, t.x);
      tMaxX = Math.max(tMaxX, t.x);
    }
    const tSpan = Math.max(1, tMaxX - tMinX);

    for (let k = 0; k < count; k++) {
      // More name cells than headline cells: each letter fragment splits into several glyphs
      const s = nT >= nS ? sources[Math.min(nS - 1, Math.floor((k * nS) / nT))] : sources[k];
      const dup = nT >= nS && k > 0 && Math.floor(((k - 1) * nS) / nT) === Math.floor((k * nS) / nT);
      sx[k] = s.x + (dup ? (hash(k, 1) - 0.5) * cellW * 1.6 : 0);
      sy[k] = s.y + (dup ? (hash(k, 2) - 0.5) * cellH * 1.2 : 0);
      rel[k] = letterRelease[s.letter] + 0.022 * s.local + 0.01 * hash(k, 3);
      // Coherent current: neighbouring fragments share the same band of the flow
      field[k] = s.x * 0.0061 + s.y * 0.0042;
      speed[k] = 0.75 + 0.5 * hash(k, 4);
      seed[k] = (hash(k, 5) * 997) | 0;

      let tgt: { x: number; y: number; edge: number } | undefined;
      if (nT >= nS) tgt = targets[k];
      else {
        // Fewer name cells: every name cell takes one fragment, the rest return to the ocean
        const ti = Math.floor((k * nT) / nS);
        if (Math.floor(((k + 1) * nT) / nS) !== ti || k === count - 1) tgt = targets[ti];
      }
      if (tgt) {
        tx[k] = tgt.x;
        ty[k] = tgt.y;
        const ux = (tgt.x - tMinX) / tSpan;
        a0[k] = ARRIVE_START + ARRIVE_SPREAD * ux + 0.015 * hash(k, 6);
        const pool = tgt.edge >= 9 ? DENSE : tgt.edge >= 6 ? MID : EDGE;
        targetGlyph[k] = CHAR_INDEX.get(pool[seed[k] % pool.length]) ?? 0;
        targetAlpha[k] = tgt.edge >= 9 ? 1 : tgt.edge >= 6 ? 0.92 : 0.78;
      } else {
        tx[k] = NaN;
        targetGlyph[k] = -1;
      }
    }

    bakeAtlas();
    drawnT = NaN;
    ready = true;
  };

  /** Stage y of the horizon at progress t. */
  const horizonAt = (t: number) =>
    horizonRest + (horizonEnd - horizonRest) * easeInOutCubic(smooth(RISE[0], RISE[1], t));
  /** Earliest progress at which the horizon has risen to stage y `y` (y above its rest). */
  const riseTimeAt = (y: number) => {
    let lo = RISE[0];
    let hi = RISE[1];
    for (let i = 0; i < 24; i++) {
      const mid = (lo + hi) / 2;
      if (horizonAt(mid) > y) lo = mid;
      else hi = mid;
    }
    return hi;
  };

  const progressNow = () => clamp01((window.scrollY - sectionTop) / runway);
  /** Viewport y of the stage: 0 while pinned, negative once the runway has passed. */
  const stageTopNow = () => Math.min(0, sectionTop + runway - window.scrollY);

  const renderHero = () => {
    frame = 0;
    if (disposed || !ready) return;
    const t = progressNow();
    const top = stageTopNow();
    const W = viewW;
    const H = stageH;

    // The type of the name comes up under the glyphs, then the glyphs let go
    const typeOpacity = Math.round(smooth(TYPE_IN[0], TYPE_IN[1], t) * 100) / 100;
    if (typeOpacity !== lastTypeOpacity) {
      lastTypeOpacity = typeOpacity;
      nameEl.style.opacity = String(typeOpacity);
    }
    onFrame?.({ t, stageTop: top, stageHeight: H });

    // Real headline letters break up exactly as their fragments are released
    for (let i = 0; i < letters.length; i++) {
      const r = letterRelease[i];
      const o = Math.round((1 - smooth(r - 0.004, r + 0.035, t)) * 100) / 100;
      if (o !== letterOpacity[i]) {
        letterOpacity[i] = o;
        letters[i].style.opacity = o === 1 ? '' : String(o);
      }
    }

    const visible = t > SUBMERGED_RELEASE - 0.002 && top > -H;
    if (!visible) {
      if (drewLast) {
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drewLast = false;
        drawnT = NaN;
      }
      onZones?.(t < releaseEnd && top > -H ? headlineRects.map((r) => ({ ...r, top: r.top + top })) : []);
      return;
    }

    // Calm zones: the headline while it is still breaking up, the name once it gathers
    const zones: HeroRect[] = [];
    if (t < releaseEnd) for (const r of headlineRects) zones.push({ ...r, top: r.top + top });
    if (t > ARRIVE_START) for (const r of nameRects) zones.push({ ...r, top: r.top + top });
    onZones?.(zones);

    // The image depends on t alone (drawn at stage-local y); leaving the runway only moves
    // the finished canvas on the compositor, and the settled hold is never redrawn.
    if (top !== canvasShift) {
      canvasShift = top;
      canvas.style.transform = top === 0 ? '' : `translate3d(0, ${top}px, 0)`;
    }
    const drawT = Math.min(t, HOLD);
    if (drawT === drawnT) return;
    drawnT = drawT;

    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.imageSmoothingEnabled = true;
    // Nothing of the current shows above the waterline
    const waterTop = Math.max(0, horizonAt(drawT));
    ctx.save();
    ctx.beginPath();
    ctx.rect(0, Math.floor(waterTop * dpr), canvas.width, canvas.height);
    ctx.clip();
    const glyphFade = 1 - smooth(GLYPHS_OUT[0], GLYPHS_OUT[1], drawT);
    let activeAlpha = -1;

    for (let k = 0; k < count; k++) {
      const r = rel[k];
      if (drawT <= r) continue;
      const stray = targetGlyph[k] < 0;
      const end = stray ? STRAY_FADE[1] : a0[k] + ARRIVE_DURATION;
      const tau = clamp01((drawT - r) / Math.max(0.01, end - r));
      const env = Math.sin(Math.PI * tau);
      const f = field[k];

      // The current: a broad drift to the right, a slow swell, and soft eddies
      const drift = W * 0.14 * speed[k] * (tau * tau * (3 - 2 * tau));
      const swell = H * 0.05 * env * Math.sin(f * 5 + tau * 3.4);
      const eddyA = f * 6 + tau * 5.2;
      let x = sx[k] + drift + 15 * env * Math.cos(eddyA);
      let y = sy[k] + swell + 11 * env * Math.sin(eddyA);

      let alpha = 0.9 * smooth(r, r + 0.025, drawT);
      let glyph = CHAR_INDEX.get(FLIGHT[(seed[k] + Math.floor(tau * 4) * 7) % FLIGHT.length]) ?? 0;
      let ink = drawT > r + 0.05 ? 1 : 0;

      if (stray) {
        alpha *= 1 - smooth(STRAY_FADE[0], STRAY_FADE[1], drawT);
      } else {
        const a = easeInOutCubic(smooth(a0[k], a0[k] + ARRIVE_DURATION, drawT));
        x += (tx[k] - x) * a;
        y += (ty[k] - y) * a;
        if (a > 0.55) {
          glyph = targetGlyph[k];
          ink = 2;
          alpha = alpha + (targetAlpha[k] - alpha) * smooth(0.55, 1, a);
        }
      }
      alpha *= glyphFade;
      if (alpha < 0.02) continue;

      if (x < -cellW || x > W + cellW || y < -cellH || y > window.innerHeight + cellH) continue;

      if (alpha !== activeAlpha) {
        ctx.globalAlpha = alpha;
        activeAlpha = alpha;
      }
      ctx.drawImage(
        atlas,
        glyph * atlasW,
        ink * atlasH,
        atlasW,
        atlasH,
        Math.round((x - cellW / 2) * dpr),
        Math.round((y - cellH / 2) * dpr),
        atlasW,
        atlasH
      );
    }
    ctx.globalAlpha = 1;
    ctx.restore();
    drewLast = true;
  };

  const schedule = () => {
    if (!frame && !disposed) frame = requestAnimationFrame(renderHero);
  };
  let remeasureTimer = 0;
  const remeasure = () => {
    window.clearTimeout(remeasureTimer);
    remeasureTimer = window.setTimeout(() => {
      if (disposed) return;
      measure();
      schedule();
    }, 80);
  };

  window.addEventListener('scroll', schedule, { passive: true });
  window.addEventListener('resize', remeasure);
  const observer = new ResizeObserver(remeasure);
  observer.observe(section);
  document.fonts?.addEventListener?.('loadingdone', remeasure);
  (document.fonts?.ready ?? Promise.resolve()).then(() => {
    if (disposed) return;
    measure();
    schedule();
  });

  return {
    destroy() {
      disposed = true;
      cancelAnimationFrame(frame);
      window.clearTimeout(remeasureTimer);
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', remeasure);
      observer.disconnect();
      document.fonts?.removeEventListener?.('loadingdone', remeasure);
      for (const el of letters) el.style.opacity = '';
      canvas.style.transform = '';
      nameEl.style.opacity = '';
      onZones?.([]);
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  };
}
