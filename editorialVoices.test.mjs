import test from 'node:test';
import assert from 'node:assert/strict';
import {
  EMERGE_MS, GLYPHS_OUT, INSTRUMENT_CHARSET, SETTLE_MAX_MS, SURFACE_MS, SURFACE_RISE_PX, SURFACE_STEPS, TYPE_IN,
  VOICE_MOTION, WATER_GLYPHS, cellMoment, emergenceCell, settleMs, shapeGlyph, surfaceOpacity, surfaceRise,
  surfaceStep, titleTypeOpacity, voiceFor
} from './editorialVoices.ts';
import { advanceEncryptedLine, LINE_REVEAL_MAX_MS } from './encryptedMotion.ts';

test('each voice has its own arrival, and only titles and the instrument use glyphs', () => {
  assert.deepEqual(VOICE_MOTION, { title: 'emerge', instrument: 'settle', reading: 'surface' });
  assert.equal(voiceFor(true, "'Newsreader', serif"), 'title');
  assert.equal(voiceFor(false, "'IBM Plex Mono', ui-monospace, monospace"), 'instrument');
  assert.equal(voiceFor(false, '"IBM Plex Mono", monospace'), 'instrument');
  assert.equal(voiceFor(false, "'Instrument Sans', -apple-system, sans-serif"), 'reading');
  // A serif entry title (a company, a school) is read, not deciphered
  assert.equal(voiceFor(false, "'Newsreader', 'Iowan Old Style', Georgia, serif"), 'reading');
  // Only the first family decides: a mono fallback at the end of a stack is not the instrument
  assert.equal(voiceFor(false, "'Instrument Sans', ui-monospace"), 'reading');
});

test('nothing takes longer to arrive than the letter-lock it replaces, except the title, under a second', () => {
  assert.ok(SURFACE_MS < LINE_REVEAL_MAX_MS);
  assert.ok(SETTLE_MAX_MS < LINE_REVEAL_MAX_MS);
  assert.ok(EMERGE_MS < 1000);
  assert.equal(settleMs(1), 140);
  assert.equal(settleMs(9), 234);
  assert.equal(settleMs(40), SETTLE_MAX_MS);
  // The real title is whole well before the emergence ends
  assert.ok(TYPE_IN[1] * EMERGE_MS < 800);
});

test('the line controller honours a voice duration and keeps its entrance-only contract', () => {
  const step = (state, ms, duration) => advanceEncryptedLine(state, 1, false, false, false, 0, ms, 60, false, true, duration);
  let state = step({ revealState: 'hidden', currentP: 0 }, 16, SURFACE_MS);
  assert.deepEqual(state, { revealState: 'revealing', currentP: 0 });
  let elapsed = 0;
  while (state.revealState !== 'revealed') { state = step(state, 16, SURFACE_MS); elapsed += 16; }
  assert.ok(elapsed >= SURFACE_MS - 16 && elapsed <= SURFACE_MS + 32, `surfaced in ${elapsed} ms`);
  assert.deepEqual(step(state, 5000, SURFACE_MS), { revealState: 'revealed', currentP: 1 });
  // Without a duration the Phase I pace is untouched (a 60-character line: 600 ms)
  const legacy = advanceEncryptedLine({ revealState: 'revealing', currentP: 0 }, 1, false, false, false, 0, 300, 60, false);
  assert.equal(legacy.currentP, 0.5);
});

test('reading text is legible from its first visible step and lands exactly in place', () => {
  assert.equal(surfaceOpacity(0), 0);
  assert.equal(surfaceOpacity(1), 1);
  assert.equal(surfaceRise(1), 0);
  assert.equal(surfaceRise(0), SURFACE_RISE_PX);
  assert.ok(SURFACE_RISE_PX <= 12, 'a rise, not a slide');
  assert.ok(surfaceOpacity(0.5) > 0.85, 'most of the ink is there by the middle');
  let last = -1;
  for (let i = 0; i <= 100; i++) {
    const o = surfaceOpacity(i / 100);
    assert.ok(o >= last, 'opacity never dips');
    last = o;
  }
  // A dozen restyles per word at most
  const steps = new Set();
  for (let i = 0; i <= 1000; i++) steps.add(surfaceStep(i / 1000));
  assert.equal(steps.size, SURFACE_STEPS + 1);
});

test('the instrument settles through figures and strokes, never through letters', () => {
  assert.ok(INSTRUMENT_CHARSET.length >= 12);
  assert.ok(!/[A-Za-z]/.test(INSTRUMENT_CHARSET), 'a settling label never spells a false word');
  assert.equal(new Set(INSTRUMENT_CHARSET).size, INSTRUMENT_CHARSET.length);
});

test('a title cell travels in from upstream, becomes a stroke, and is gone when the type stands', () => {
  for (const tx of [0, 0.5, 1]) {
    for (const rand of [0, 0.5, 0.99]) {
      assert.equal(cellMoment(0, tx, rand).alpha, 0, 'nothing before it starts');
      assert.ok(cellMoment(1, tx, rand).alpha < 1e-6, 'nothing left at the end');
      let lastArrive = -1;
      let formedAt = null;
      for (let i = 0; i <= 100; i++) {
        const m = cellMoment(i / 100, tx, rand);
        assert.ok(m.arrive >= lastArrive - 1e-9, 'a cell never drifts back upstream');
        assert.ok(m.alpha >= 0 && m.alpha <= 1);
        lastArrive = m.arrive;
        if (m.formed && formedAt === null) formedAt = i / 100;
      }
      assert.equal(lastArrive, 1, 'every cell reaches its place');
      assert.ok(formedAt !== null && formedAt < GLYPHS_OUT[0] + 0.1, `formed before the glyphs let go: ${formedAt}`);
    }
  }
  // Left to right: the first letters gather, and go, before the last
  assert.ok(cellMoment(0.3, 0, 0.5).arrive > cellMoment(0.3, 1, 0.5).arrive);
  assert.ok(cellMoment(0.85, 0, 0.5).alpha < cellMoment(0.85, 1, 0.5).alpha);
});

test('the glyphs are whole while the type comes up, so the title is never absent', () => {
  // At every moment from the glyphs forming to the type standing, one or the other carries it
  for (let i = 45; i <= 100; i++) {
    const p = i / 100;
    const glyphs = cellMoment(p, 0.5, 0.5).alpha;
    assert.ok(glyphs + titleTypeOpacity(p) > 0.55, `carried at p=${p}: glyphs ${glyphs.toFixed(2)} + type ${titleTypeOpacity(p).toFixed(2)}`);
  }
  assert.equal(titleTypeOpacity(TYPE_IN[0]), 0);
  assert.equal(titleTypeOpacity(TYPE_IN[1]), 1);
  assert.equal(titleTypeOpacity(1), 1);
});

test('shape-aware glyphs: a cell takes the character that runs the way its ink does', () => {
  // Structure tensors of ideal strokes: the gradient lies across the stroke (y points down)
  const stem = shapeGlyph(0.4, 10, 0, 0, 0.5, 1);          // gradient along x → vertical stroke
  const bar = shapeGlyph(0.4, 0, 10, 0, 0.5, 1);           // gradient along y → horizontal stroke
  const rising = shapeGlyph(0.4, 5, 5, 5, 0.5, 1);         // gradient along (1, 1) → "/"
  const falling = shapeGlyph(0.4, 5, 5, -5, 0.5, 1);       // gradient along (1, -1) → "\"
  assert.equal(stem, '|');
  assert.equal(bar, '-');
  assert.equal(rising, '/');
  assert.equal(falling, '\\');
  // A bar is set where it sits in its cell: a baseline serif low, an overshoot high
  assert.equal(shapeGlyph(0.3, 0, 10, 0, 0.85, 1), '_');
  assert.equal(shapeGlyph(0.3, 0, 10, 0, 0.12, 1), '¯');
  // No direction (a joint, a bowl's shoulder): tone by coverage, denser with more ink
  const tone = [0.1, 0.5, 0.95].map((c) => shapeGlyph(c, 3, 3, 0, 0.5, 4));
  assert.ok(':·.'.includes(tone[0]) && '+=*'.includes(tone[1]) && '#%'.includes(tone[2]), tone.join(' '));
  // A cell full of ink is tone even if its edge has a direction; an empty one is nothing
  assert.ok('#%'.includes(shapeGlyph(0.95, 10, 0, 0, 0.5, 2)));
  assert.equal(shapeGlyph(0.01, 10, 0, 0, 0.5, 1), '');
  assert.equal(shapeGlyph(0, 0, 0, 0, 0.5, 1), '');
});

test('the same cell always gets the same glyph (no flicker between frames or rebuilds)', () => {
  for (let seed = 0; seed < 50; seed++) {
    assert.equal(shapeGlyph(0.5, 2, 2, 0.1, 0.5, seed), shapeGlyph(0.5, 2, 2, 0.1, 0.5, seed));
  }
});

test('the title grid is the whales\' own on a desktop title and stays fine enough on a phone', () => {
  const desktop = emergenceCell(72);
  assert.equal(desktop.w, 6);
  assert.equal(desktop.h, 10);
  const phone = emergenceCell(38);
  assert.ok(phone.w >= 3 && phone.w < 4 && Math.abs(phone.h / phone.w - 10 / 6) < 1e-9);
  // Capital height of a 38px serif (~26px) still spans at least four rows of cells
  assert.ok((38 * 0.68) / phone.h >= 4);
  assert.ok(emergenceCell(12).w >= 3.6);
});

test('the current before it is a letter is drawn in the ocean field\'s own glyphs', () => {
  const OCEAN = ' .·:-~=+≈'; // asciiOcean.ts CHARACTERS
  for (const glyph of WATER_GLYPHS) assert.ok(OCEAN.includes(glyph), glyph);
});
