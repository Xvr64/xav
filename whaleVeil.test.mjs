import test from 'node:test';
import assert from 'node:assert/strict';
import { FIELD_DEPTH, FIELD_REACH_X, FIELD_REACH_Y, rasterizeVeil, VEIL_KEEP_LINE, VEIL_KEEP_TONE, VEIL_PAD_X, VEIL_PAD_Y } from './whaleVeil.ts';

// The whales' glyph grid at 1440 × 900: 6 × 10 px cells
const CELL_W = 6, CELL_H = 10, COLS = 240, ROWS = 90;
const grid = (rects) => {
  const out = new Uint8Array(COLS * ROWS);
  rasterizeVeil(out, new Float32Array(COLS * ROWS * 4), COLS, ROWS, CELL_W, CELL_H, rects);
  return out;
};
const at = (g, x, y) => g[Math.floor(y / CELL_H) * COLS + Math.floor(x / CELL_W)];

test('open water stays open: no copy, no veil', () => {
  assert.ok(grid([]).every((v) => v === 0));
  assert.ok(grid([{ left: 100, top: 100, width: 0, height: 20 }]).every((v) => v === 0));
});

test('a line of copy is fully veiled across its box, and clear well away from it', () => {
  // A metadata line: "April 2025", 12px mono
  const line = { left: 75, top: 380, width: 78, height: 18 };
  const g = grid([line]);
  for (let x = line.left; x < line.left + line.width; x += CELL_W) {
    assert.equal(at(g, x, line.top + line.height / 2), 255, `behind the text at x=${x}`);
  }
  assert.equal(at(g, line.left + line.width + 80, line.top + 9), 0);
  assert.equal(at(g, line.left + 30, line.top + 80), 0);
  assert.equal(at(g, line.left + 30, line.top - 60), 0);
});

test('the veil has no edge: it falls away through intermediate values on every side', () => {
  const line = { left: 300, top: 400, width: 400, height: 24 };
  const g = grid([line]);
  const row = Math.floor((line.top + 12) / CELL_H);
  const right = [];
  for (let c = Math.floor((line.left + line.width) / CELL_W); c < COLS && right.length < 12; c++) right.push(g[row * COLS + c]);
  assert.ok(right.some((v) => v > 0 && v < 255), `feathered along the line: ${right}`);
  for (let i = 1; i < right.length; i++) assert.ok(right[i] <= right[i - 1], 'monotone falloff');
  const col = Math.floor((line.left + 200) / CELL_W);
  const below = [];
  for (let r = Math.floor((line.top + line.height) / CELL_H); r < ROWS && below.length < 6; r++) below.push(g[r * COLS + col]);
  assert.ok(below.some((v) => v > 0 && v < 255), `feathered across the line: ${below}`);
  assert.equal(below[below.length - 1], 0);
});

test('lines of one block merge into one clear field; separate entries keep open water between them', () => {
  // Body copy: 16px at 1.58 leading leaves ~9px between line boxes
  const para = [0, 1, 2].map((i) => ({ left: 300, top: 400 + i * 25.3, width: 420, height: 16 }));
  const g = grid(para);
  for (let y = 400; y < 400 + 2 * 25.3 + 16; y += 5) assert.equal(at(g, 500, y), 255, `no gap at y=${y}`);
  // A ruled list (rows ~56px apart) reads as one field too: no venetian blind across a whale
  const list = [0, 1, 2].map((i) => ({ left: 300, top: 400 + i * 56, width: 300, height: 22 }));
  const h = grid(list);
  for (let y = 404; y < 400 + 2 * 56 + 20; y += 7) assert.ok(at(h, 450, y) > 255 * 0.6, `list field holds at y=${y}`);
  // Two stations a screen-third apart: the whale is whole again between them
  const stations = [0, 1].map((i) => ({ left: 300, top: 300 + i * 300, width: 300, height: 46 }));
  const s = grid(stations);
  assert.equal(at(s, 450, 300 + 46 + (300 - 46) / 2), 0);
});

test('boxes at and beyond the screen edge are clipped, never thrown', () => {
  const g = grid([
    { left: -200, top: -50, width: 260, height: 80 },
    { left: 1400, top: 880, width: 500, height: 200 },
    { left: 5000, top: 5000, width: 10, height: 10 }
  ]);
  assert.equal(at(g, 2, 2), 255);
  assert.equal(at(g, 1438, 898), 255);
  assert.equal(at(g, 700, 450), 0);
});

test('behind copy the tone nearly clears while the contour holds the form', () => {
  assert.ok(VEIL_KEEP_TONE <= 0.16, 'no stronger than the 2D whales were behind a line (0.16)');
  assert.ok(VEIL_KEEP_LINE > VEIL_KEEP_TONE * 2, 'the silhouette stays readable as a whale');
  assert.ok(VEIL_PAD_X >= CELL_W * 2 && VEIL_PAD_Y >= CELL_H * 0.8, 'clear water reaches past the glyphs themselves');
});

// ---- The reading water (Phase II): a soft field around the CV's copy -------------------------
const fieldOf = (rects) => rects.map((r) => ({ ...r, field: true }));
const FIELD = Math.round(255 * FIELD_DEPTH);

test('the reading water covers a whole body of copy at one even depth', () => {
  // A ruled list: date on line a, name on line b, place on line c, rows 56px apart
  const rows = [0, 1, 2, 3].flatMap((i) => [
    { left: 75, top: 580 + i * 56, width: 74, height: 18 },
    { left: 294, top: 574 + i * 56, width: 320, height: 26 },
    { left: 953, top: 580 + i * 56, width: 90, height: 18 }
  ]);
  const g = grid(fieldOf(rows));
  // In the gutters between the date, the name and the place the whale used to be whole
  for (const [x, y] of [[220, 646], [220, 674], [220, 702], [800, 618], [800, 646]]) {
    assert.ok(at(g, x, y) >= FIELD && at(g, x, y) <= FIELD + 12, `field holds at ${x},${y}: ${at(g, x, y)}`);
  }
  // At the list's first row the field is already most of the way up: a shore, not a wall
  assert.ok(at(g, 220, 590) > FIELD * 0.5 && at(g, 220, 590) <= FIELD);
  // Right behind a line the veil is still whole
  assert.equal(at(g, 400, 587), 255);
  // The same boxes without the flag: the tight veil exactly as before, open between columns
  assert.equal(at(grid(rows), 220, 618), 0);
});

test('the reading water has no edge and ends in open water', () => {
  const para = fieldOf([0, 1, 2, 3, 4].map((i) => ({ left: 300, top: 300 + i * 25.3, width: 480, height: 16 })));
  const g = grid(para);
  const row = Math.floor(350 / CELL_H);
  const right = [];
  for (let c = Math.floor(800 / CELL_W); c < COLS; c++) right.push(g[row * COLS + c]);
  for (let i = 1; i < right.length; i++) assert.ok(right[i] <= right[i - 1], 'monotone falloff to the right');
  const steps = new Set(right.filter((v) => v > 0 && v < FIELD));
  assert.ok(steps.size >= 8, `a gradual shore, not a step: ${[...steps]}`);
  // Open water again within about two reaches of the copy, on both axes
  assert.equal(at(g, 780 + VEIL_PAD_X + FIELD_REACH_X * 4 + 12, 350), 0);
  assert.equal(at(g, 500, 300 + 5 * 25.3 + VEIL_PAD_Y + FIELD_REACH_Y * 4 + 20), 0);
  assert.ok(at(g, 780 + 40, 350) > 0, 'but it does reach past the line ends');
});

test('an isolated label gets a faint halo, never the full field', () => {
  const g = grid(fieldOf([{ left: 600, top: 400, width: 78, height: 18 }]));
  const beside = at(g, 600 + 78 + VEIL_PAD_X + 30, 409);
  assert.ok(beside > 0 && beside < FIELD, `faint beside a lone label: ${beside}`);
});

test('the cover and the Globe keep the tight veil only: no field without the flag', () => {
  const name = [{ left: 80, top: 120, width: 900, height: 230 }];
  const tight = grid(name);
  assert.equal(at(tight, 80 + 900 + VEIL_PAD_X + 40, 235), 0);
  assert.equal(at(tight, 500, 120 + 230 + VEIL_PAD_Y + 40), 0);
});

test('the field leaves the drawing alone and takes about half of the modelling', () => {
  assert.ok(FIELD_DEPTH >= 0.4 && FIELD_DEPTH <= 0.75, 'deep enough to calm the body, never a hole');
  const toneKept = 1 - FIELD_DEPTH * (1 - VEIL_KEEP_TONE);
  assert.ok(toneKept > 0.3 && toneKept < 0.65, `the body stays visible across copy: ${toneKept}`);
});

test('rasterising a full screen of copy stays far inside a frame', () => {
  const rects = fieldOf(Array.from({ length: 60 }, (_, i) => ({ left: 80 + (i % 3) * 420, top: 20 + Math.floor(i / 3) * 44, width: 360, height: 20 })));
  const out = new Uint8Array(COLS * ROWS);
  const scratch = new Float32Array(COLS * ROWS * 4);
  for (let i = 0; i < 20; i++) rasterizeVeil(out, scratch, COLS, ROWS, CELL_W, CELL_H, rects);
  const t0 = performance.now();
  for (let i = 0; i < 100; i++) rasterizeVeil(out, scratch, COLS, ROWS, CELL_W, CELL_H, rects);
  const each = (performance.now() - t0) / 100;
  assert.ok(each < 2, `one rasterisation: ${each.toFixed(3)} ms`);
  console.log(`veil rasterisation: ${each.toFixed(3)} ms`);
});
