import test from 'node:test';
import assert from 'node:assert/strict';
import { gradeDepth, gradeDepthPixels } from './profileDepthGrade.ts';

const grade = (r, g, b) => {
  const out = [0, 0, 0];
  gradeDepth(r, g, b, out);
  return out;
};
const luma = ([r, g, b]) => 0.2126 * r + 0.7152 * g + 0.0722 * b;

test('the reds go first: crimson and orange lose their warmth', () => {
  for (const warm of [[210, 30, 35], [240, 140, 60], [250, 90, 40]]) {
    const [r, g, b] = grade(...warm);
    assert.ok(r < warm[0] * 0.75, `red attenuated for ${warm}: ${r}`);
    assert.ok(r <= Math.max(g, b) + 6, `no longer red-dominant for ${warm}: ${[r, g, b]}`);
  }
});

test('blue light survives and stays blue', () => {
  const [r, g, b] = grade(40, 60, 200);
  assert.ok(b > r && b > g, `blue stays dominant: ${[r, g, b]}`);
  assert.ok(b > 120, `blue keeps most of its strength under the chroma cap: ${b}`);
});

test('neutrals keep their lightness and take on the water', () => {
  for (const v of [60, 128, 200]) {
    const out = grade(v, v, v);
    assert.ok(Math.abs(luma(out) - v) < v * 0.16 + 8, `lightness kept for ${v}: ${out}`);
    assert.ok(out[2] > out[0] && out[1] > out[0], `cool, never warm, for ${v}: ${out}`);
  }
});

test('contrast survives the veil', () => {
  const dark = luma(grade(10, 10, 12));
  const light = luma(grade(245, 245, 240));
  assert.ok(dark < 40, `blacks stay deep: ${dark}`);
  assert.ok(light > 200, `highlights stay bright: ${light}`);
});

test('colour stays restrained', () => {
  for (const c of [[20, 200, 40], [255, 0, 255], [0, 255, 255]]) {
    const [r, g, b] = grade(...c);
    const chroma = Math.max(r, g, b) - Math.min(r, g, b);
    assert.ok(chroma < 190, `no runaway saturation for ${c}: ${[r, g, b]}`);
  }
});

test('pixel grading leaves alpha untouched', () => {
  const px = new Uint8ClampedArray([200, 40, 40, 77, 30, 30, 200, 255]);
  gradeDepthPixels(px);
  assert.equal(px[3], 77);
  assert.equal(px[7], 255);
  assert.ok(px[0] < 160);
});
