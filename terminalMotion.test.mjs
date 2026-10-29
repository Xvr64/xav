import test from 'node:test';
import assert from 'node:assert/strict';
import { ASCII_GLYPHS, decodeWord, lineProgress, waterShade } from './terminalMotion.ts';

test('lines at an edge dissolve independently while central lines stay stable', () => {
  for (const viewport of [568, 844, 900, 1200]) {
    assert.equal(lineProgress(-30, 25, viewport), 0);
    assert.ok(lineProgress(0, 25, viewport) < 1);
    assert.equal(lineProgress(120, 25, viewport), 1);
    assert.equal(lineProgress(viewport / 2, 25, viewport), 1);
    assert.equal(lineProgress(viewport, 25, viewport), 0);
    const entering = [viewport-10,viewport-35,viewport-60].map(top => lineProgress(top,25,viewport));
    assert.ok(entering[0] < entering[1] && entering[1] <= entering[2]);
    for (let top = 120; top < viewport-90; top+=13) {
      assert.equal(decodeWord('Readable', lineProgress(top,25,viewport), 3), 'Readable');
    }
  }
});

test('scrolling back reproduces each glyph exactly and decoding settles at the source', () => {
  const word = 'BOLLORÉ';
  const samples = Array.from({length: 181}, (_, i) => i / 180);
  const forward = samples.map(p => decodeWord(word, p, 42));
  const backward = [...samples].reverse().map(p => decodeWord(word, p, 42)).reverse();
  assert.deepEqual(forward, backward);
  assert.equal(forward.at(-1), word);
  assert.equal(forward[0].trim(), '');
  assert.equal(decodeWord(word, 0.13, 42), decodeWord(word, 0.130001, 42));
  forward.forEach(value => {
    assert.equal(Array.from(value).length, Array.from(word).length);
    for (const glyph of value) assert.ok(glyph === '\u00a0' || word.includes(glyph) || ASCII_GLYPHS.includes(glyph));
  });
});

test('background remains white before the globe and black after its exact end', () => {
  const start = 3000, travel = 4500, viewport = 900;
  for (let y = 0; y <= start; y += 10) assert.equal(waterShade(y, start, travel, viewport), 255);
  assert.equal(waterShade(start, start, travel, viewport), 255);
  assert.equal(waterShade(start + travel, start, travel, viewport), 0);
  assert.equal(waterShade(start + travel + viewport, start, travel, viewport), 0);
  let previous = 255;
  for (let y = start; y <= start + travel; y += 10) {
    const shade = waterShade(y, start, travel, viewport);
    assert.ok(shade <= previous);
    previous = shade;
  }
});
