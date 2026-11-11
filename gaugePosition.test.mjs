import test from 'node:test';
import assert from 'node:assert/strict';
import { gaugePosition } from './gaugePosition.ts';

// Document tops of seven sections, as on the page: uneven lengths
const TOPS = [7200, 8100, 9500, 10100, 10900, 11500, 12100];

test('before the first station the marker rests on the first tick and nothing is current', () => {
  assert.deepEqual(gaugePosition(TOPS, 0), { index: -1, position: 0 });
  assert.deepEqual(gaugePosition(TOPS, 7199), { index: -1, position: 0 });
});

test('on a station the marker sits exactly on its tick', () => {
  TOPS.forEach((top, i) => {
    const g = gaugePosition(TOPS, top);
    assert.equal(g.index, i);
    assert.equal(g.position, i);
  });
});

test('between two stations it travels in proportion, whatever their lengths', () => {
  assert.equal(gaugePosition(TOPS, 7650).position, 0.5);
  assert.equal(gaugePosition(TOPS, 8800).position, 1.5);
  const quarter = gaugePosition(TOPS, 9500 + 150);
  assert.equal(quarter.index, 2);
  assert.ok(Math.abs(quarter.position - 2.25) < 1e-9);
});

test('it never leaves the scale: the last station holds it to the end of the page', () => {
  assert.deepEqual(gaugePosition(TOPS, 12100), { index: 6, position: 6 });
  assert.deepEqual(gaugePosition(TOPS, 99999), { index: 6, position: 6 });
});

test('the same reading line gives the same marker going down and coming back', () => {
  const down = [7000, 7400, 9000, 12000].map((y) => gaugePosition(TOPS, y).position);
  const up = [12000, 9000, 7400, 7000].map((y) => gaugePosition(TOPS, y).position).reverse();
  assert.deepEqual(down, up);
  for (let i = 1; i < down.length; i++) assert.ok(down[i] >= down[i - 1]);
});

test('sections not laid out yet (Infinity) are simply never reached', () => {
  assert.deepEqual(gaugePosition([Infinity, Infinity], 5000), { index: -1, position: 0 });
  const g = gaugePosition([1000, Infinity], 5000);
  assert.equal(g.index, 0);
  assert.equal(g.position, 0);
});
