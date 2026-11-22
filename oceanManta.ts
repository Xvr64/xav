// ============================================================================
// THE DEEP-WATER SILHOUETTE: one distant manta ray now and then, only once the visitor has
// descended, drawn in the faintest halo glyphs ('.' ':'). Restored exactly as main drew it in
// its 60 Hz ocean loop (AsciiWhaleBackground.tsx "2C. DEEP-WATER SILHOUETTE", 54710be): the
// same timing, planform, glyph tiles, alpha and layer. What changed is only who keeps time:
// the wait is a timeout and frames run only while a ray crosses (AsciiWhaleBackground.tsx).
// ============================================================================

/** The 2D ocean's glyph cell (CSS px), as on main. */
export const MANTA_CELL = 10;
/** Seconds before the first ray, from mount, and between rays, from the last one's exit (main). */
export const MANTA_FIRST_WAIT: readonly [number, number] = [6, 12];
export const MANTA_NEXT_WAIT: readonly [number, number] = [16, 32];
/** A ray sets out only where it shows at more than this (main: rayVis > 0.25). */
export const MANTA_START_VISIBILITY = 0.25;

export type Random = () => number;
const range = (rnd: Random, min: number, max: number) => min + rnd() * (max - min);

export interface MantaRay {
  active: boolean;
  /** Seconds left before the next ray may set out. */
  wait: number;
  dir: 1 | -1;
  x: number;
  baseY: number;
  span: number;
  speed: number;
  phase: number;
}

export const newMantaRay = (rnd: Random = Math.random): MantaRay => ({
  active: false,
  wait: range(rnd, MANTA_FIRST_WAIT[0], MANTA_FIRST_WAIT[1]),
  dir: 1,
  x: 0,
  baseY: 0,
  span: 100,
  speed: 0.7,
  phase: 0
});

/** How much of the ray shows at page depth `depth` (scrollY / scrollable, 0 … 1). */
export function mantaVisibility(depth: number, o: { focus: boolean; reduced: boolean; migrating: boolean }): number {
  return o.focus || o.reduced || o.migrating ? 0 : Math.max(0, Math.min(1, (depth - 0.35) / 0.25));
}

/** Send a ray across a `w` × `h` screen (the random draws in main's order). */
export function launchMantaRay(ray: MantaRay, w: number, h: number, rnd: Random = Math.random) {
  ray.active = true;
  ray.dir = rnd() < 0.5 ? 1 : -1;
  ray.span = Math.min(w, h) * range(rnd, 0.11, 0.15);
  ray.x = ray.dir > 0 ? -ray.span * 2.2 : w + ray.span * 2.2;
  ray.baseY = h * (rnd() < 0.5 ? range(rnd, 0.16, 0.3) : range(rnd, 0.68, 0.82));
  ray.speed = range(rnd, 0.55, 0.85);
  ray.phase = rnd() * 6.28;
}

export interface MantaPose {
  /** Body centre (CSS px), half-span S, body length L, wing flap and heading. */
  x: number;
  y: number;
  span: number;
  length: number;
  flap: number;
  dir: 1 | -1;
}

/**
 * One frame of glide (`dtScale` = dt × 60, `time` = the ocean's clock in seconds). Returns the
 * pose to draw, or null once the ray has left the screen: it is then inactive and the next wait
 * (MANTA_NEXT_WAIT) is set.
 */
export function stepMantaRay(ray: MantaRay, dtScale: number, time: number, w: number, h: number, rnd: Random = Math.random): MantaPose | null {
  ray.x += ray.dir * ray.speed * dtScale;
  const S = ray.span;
  const L = S * 0.85;
  const rx = ray.x;
  const ry = ray.baseY + Math.sin(time * 0.35 + ray.phase) * h * 0.02;
  const flap = 0.82 + 0.18 * Math.sin(time * 1.4 + ray.phase);
  const offscreen = ray.dir > 0 ? rx - L * 2 > w : rx + L * 2 < 0;
  if (offscreen) {
    ray.active = false;
    ray.wait = range(rnd, MANTA_NEXT_WAIT[0], MANTA_NEXT_WAIT[1]);
    return null;
  }
  return { x: rx, y: ry, span: S, length: L, flap, dir: ray.dir };
}

/**
 * Advance a ray by `seconds` of glide at once, for the time nobody could see it (the visitor
 * went back up the page mid-crossing): main's 60 Hz steps, summed. Returns how many seconds ago
 * it left the screen (it is then inactive, its next wait set), or -1 while it is still crossing.
 */
export function glideMantaRay(ray: MantaRay, seconds: number, w: number, rnd: Random = Math.random): number {
  ray.x += ray.dir * ray.speed * 60 * seconds;
  const L = ray.span * 0.85;
  const past = ray.dir > 0 ? ray.x - L * 2 - w : -(ray.x + L * 2);
  if (past <= 0) return -1;
  ray.active = false;
  ray.wait = range(rnd, MANTA_NEXT_WAIT[0], MANTA_NEXT_WAIT[1]);
  return past / (ray.speed * 60);
}

/**
 * The planform on the glyph grid: `visit(col, row, stamp)` for every cell of the ray, stamp 1
 * (':') in the body's core, 0 ('.') at the wing edges and along the thin tail.
 */
export function mantaStamps(p: MantaPose, cols: number, rows: number, visit: (col: number, row: number, stamp: 0 | 1) => void, cell = MANTA_CELL) {
  const S = p.span;
  const L = p.length;
  const c0 = Math.max(0, ((p.x - L * 2) / cell) | 0);
  const c1 = Math.min(cols - 1, ((p.x + L * 1.2) / cell) | 0);
  const r0 = Math.max(0, ((p.y - S) / cell) | 0);
  const r1 = Math.min(rows - 1, ((p.y + S) / cell) | 0);
  for (let rr = r0; rr <= r1; rr++) {
    const l = (rr * cell + cell * 0.5 - p.y) / S;
    for (let cc = c0; cc <= c1; cc++) {
      const f = ((cc * cell + cell * 0.5 - p.x) * p.dir) / L; // -1 tail … 1 head
      if (f > -0.9 && f < 1) {
        // Diamond-like wing planform with a rounded leading edge
        const hs = Math.pow(Math.max(0, 1 - Math.abs(f - 0.12) / 0.92), 0.75) * p.flap;
        const al = Math.abs(l);
        if (al < hs) visit(cc, rr, al < hs * 0.55 ? 1 : 0);
      } else if (f <= -0.9 && f > -1.7 && Math.abs(l) < 0.035) {
        visit(cc, rr, 0); // thin tail
      }
    }
  }
}

// ---- Drawing (the browser side; nothing runs at import) ----------------------------------------

/** Atlas rows main's ray drew from, at their original places: row 5 halo stamps, row 19 abyss glyphs. */
export const MANTA_HALO_ROW = 5;
export const MANTA_ABYSS_ROW = 19;

/**
 * The few tiles of main's ocean atlas the ray uses, baked by main's own code at main's own
 * positions (so every glyph lands on the same subpixel): row 5 ('.' ':' '+', ambient halo
 * inks) and row 19 ('·' '.' ':' '-', the pale abyss teal). Returns the canvas and its tile size.
 */
export function bakeMantaAtlas(dpr: number): { atlas: HTMLCanvasElement; tilePx: number } {
  const cellSize = MANTA_CELL;
  const atlasScale = Math.min(dpr || 1, 2);
  const tilePx = cellSize * atlasScale;
  const atlas = document.createElement('canvas');
  atlas.width = 4 * tilePx;
  atlas.height = 20 * tilePx;
  const aCtx = atlas.getContext('2d');
  if (!aCtx) return { atlas, tilePx };
  aCtx.scale(atlasScale, atlasScale);
  aCtx.font = 'bold 8.5px "JetBrains Mono", monospace';
  aCtx.textAlign = 'center';
  aCtx.textBaseline = 'middle';
  // Row 5: Halo border stamps (0: '.', 1: ':', 2: '+'), ambient (masterAlpha 0.32); the ray is
  // never drawn in focus mode
  const masterAlpha = 0.32;
  const haloChars = ['.', ':', '+'];
  const haloAlphas = [masterAlpha * 0.12, masterAlpha * 0.20, masterAlpha * 0.28];
  const pyHalo = MANTA_HALO_ROW * cellSize;
  for (let hIdx = 0; hIdx < 3; hIdx++) {
    const px = hIdx * cellSize;
    const ha = haloAlphas[hIdx];
    if (hIdx >= 1) {
      aCtx.fillStyle = `rgba(138, 156, 162, ${(ha * 0.38).toFixed(3)})`;
      aCtx.fillRect(px + 1.5, pyHalo + 1.5, cellSize - 3, cellSize - 3);
    }
    aCtx.fillStyle = `rgba(34, 52, 62, ${(ha * 0.85).toFixed(3)})`;
    aCtx.fillText(haloChars[hIdx], px + cellSize * 0.5, pyHalo + cellSize * 0.5 + 0.5);
  }
  // Row 19: ABYSS OCEAN, desaturated teal crest (the first four of its ten glyphs)
  aCtx.font = '500 9px "JetBrains Mono", monospace';
  const OCEAN_GLYPHS = ['·', '.', ':', '-', '~', '=', '+', '*', '#', '@'];
  const tier = { row: MANTA_ABYSS_ROW, r: 122, g: 166, b: 156, baseA: 0.34 };
  const py = tier.row * cellSize;
  for (let gIdx = 0; gIdx < 4; gIdx++) {
    const densityAlpha = tier.baseA * (0.42 + (gIdx / (OCEAN_GLYPHS.length - 1)) * 0.58);
    aCtx.fillStyle = `rgba(${tier.r}, ${tier.g}, ${tier.b}, ${densityAlpha.toFixed(3)})`;
    aCtx.fillText(OCEAN_GLYPHS[gIdx], gIdx * cellSize + cellSize * 0.5, py + cellSize * 0.5 + 0.5);
  }
  return { atlas, tilePx };
}

/**
 * Draw the ray at `visibility` (mantaVisibility) on a context scaled to CSS px: dark halo glyphs
 * on light water, pale teal glyphs where the abyss has turned the water dark (abyss > 0.5).
 */
export function drawMantaRay(
  ctx: CanvasRenderingContext2D,
  atlas: CanvasImageSource,
  tilePx: number,
  pose: MantaPose,
  visibility: number,
  abyss: number,
  cols: number,
  rows: number
) {
  const cellSize = MANTA_CELL;
  ctx.globalAlpha = 0.55 * visibility;
  mantaStamps(pose, cols, rows, (cc, rr, stamp) => {
    if (abyss > 0.5) {
      ctx.drawImage(atlas, (stamp + 1) * tilePx, MANTA_ABYSS_ROW * tilePx, tilePx, tilePx, cc * cellSize, rr * cellSize, cellSize, cellSize);
    } else {
      ctx.drawImage(atlas, stamp * tilePx, MANTA_HALO_ROW * tilePx, tilePx, tilePx, cc * cellSize, rr * cellSize, cellSize, cellSize);
    }
  });
  ctx.globalAlpha = 1;
}
