import test from 'node:test';
import assert from 'node:assert/strict';
import {
  COVER_DEPTH,
  JOURNEY_DEPTH,
  depthAtScroll,
  depthAtDocument,
  waterAt,
  inkAt,
  luminance,
  glyphsAt
} from './oceanWorld.ts';

const geometry = { journeyStart: 3000, journeyTravel: 5000, maxScroll: 12000, viewHeight: 800 };

test('depth runs from the cover surface to the abyss at the end of the page', () => {
  assert.equal(depthAtScroll(0, geometry), 0);
  assert.equal(depthAtScroll(-200, geometry), 0);
  assert.ok(Math.abs(depthAtScroll(3000, geometry) - COVER_DEPTH) < 1e-9);
  assert.ok(Math.abs(depthAtScroll(8000, geometry) - JOURNEY_DEPTH) < 1e-9);
  assert.equal(depthAtScroll(12000, geometry), 1);
});

test('depth only ever deepens down the document, with no jumps between stretches', () => {
  let previous = -1;
  for (let y = 0; y <= 12000; y += 10) {
    const d = depthAtScroll(y, geometry);
    assert.ok(d >= previous - 1e-12, `depth fell at ${y}`);
    assert.ok(previous < 0 || d - previous < 0.01, `depth jumped at ${y}`);
    previous = d;
  }
});

test('a point of the document keeps its depth: the world belongs to the page, not the screen', () => {
  assert.equal(depthAtDocument(5400, geometry), depthAtScroll(5000, geometry));
});

test('before the Globe is measured the whole page is surface water', () => {
  const unmeasured = { ...geometry, journeyStart: Infinity };
  assert.equal(depthAtScroll(6000, unmeasured), 0);
});

const hex = (rgb) => '#' + rgb.map((v) => Math.round(v * 255).toString(16).padStart(2, '0')).join('').toUpperCase();

test('the water passes through the reference colours: sky blue, light ocean, ocean blue, navy, abyss', () => {
  for (const [depth, colour] of [
    [0, '#99D6F1'],
    [0.26, '#6BB7EB'],
    [0.54, '#2563CE'],
    [0.74, '#172264'],
    [1, '#111017']
  ]) {
    assert.equal(hex(waterAt(depth)), colour, `water at depth ${depth}`);
  }
});

test('every depth is blue water, never cream or grey, darkening all the way down', () => {
  let previous = Infinity;
  for (let d = 0; d <= 1.0001; d += 0.02) {
    const [r, g, b] = waterAt(d);
    assert.ok(b > r, `blue water at depth ${d.toFixed(2)}`);
    const y = luminance(waterAt(d));
    assert.ok(y <= previous + 1e-9, `water lightened at depth ${d.toFixed(2)}`);
    previous = y;
  }
  assert.ok(luminance(waterAt(1)) < 0.01, 'near-black abyss');
});

test("the page ink flips where the water is mid-tone, so both inks stay readable", () => {
  // The ink flips at abyss 0.54 (inkMixFromAbyss); on the journey that is this depth:
  const flip = COVER_DEPTH + (JOURNEY_DEPTH - COVER_DEPTH) * 0.54;
  const y = luminance(waterAt(flip));
  assert.ok(y > 0.12 && y < 0.3, `mid-tone water at the flip (luminance ${y.toFixed(3)})`);
  assert.ok(luminance(waterAt(flip - 0.06)) > y && luminance(waterAt(flip + 0.06)) < y);
});

test('glyph ink stands apart from the water at the surface and in the deep', () => {
  for (const d of [0, 0.1, 0.3, 0.6, 0.8, 1]) {
    const gap = Math.abs(luminance(inkAt(d)) - luminance(waterAt(d)));
    assert.ok(gap > 0.03, `ink too close to water at depth ${d}`);
  }
});

test('glyph settings stay in range at every depth', () => {
  for (let d = 0; d <= 1; d += 0.05) {
    const g = glyphsAt(d);
    assert.ok(g.density > 0.3 && g.density < 0.7);
    assert.ok(g.strength >= 0.6 && g.strength <= 0.8);
    assert.ok(g.stretch >= 1.1 && g.stretch <= 2.6);
  }
});
