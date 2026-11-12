import test from 'node:test';
import assert from 'node:assert/strict';
import { DEEP_READING_RECESSION, fixedCopy, publishFixedCopy, whaleStage, whaleStrength } from './oceanDirection.ts';

const box = (left, top) => ({ left, top, width: 40, height: 20 });

test('fixed copy: each piece keeps its own boxes, and withdrawing one leaves the others', () => {
  let woken = 0;
  whaleStage.refresh = () => { woken++; };
  const start = fixedCopy.version;

  publishFixedCopy('controls', [box(1200, 30), box(1300, 30)]);
  publishFixedCopy('gauge', [box(1400, 400)]);
  assert.equal(fixedCopy.rects.length, 3, 'the gauge does not erase the corner controls');
  assert.equal(fixedCopy.version, start + 2);

  // The gauge leaves (above the introduction): the controls are still veiled
  publishFixedCopy('gauge', []);
  assert.deepEqual(fixedCopy.rects.map((r) => r.left), [1200, 1300]);
  assert.equal(fixedCopy.version, start + 3);

  // Withdrawing what was never there changes nothing and wakes nothing
  const before = woken;
  publishFixedCopy('gauge', []);
  assert.equal(fixedCopy.version, start + 3);
  assert.equal(woken, before);

  // A piece replaces only its own boxes
  publishFixedCopy('controls', [box(900, 30)]);
  assert.deepEqual(fixedCopy.rects.map((r) => r.left), [900]);

  publishFixedCopy('controls', []);
  assert.equal(fixedCopy.rects.length, 0);
  assert.ok(woken >= 5, 'every real change wakes the whales');
  whaleStage.refresh = null;
});

test('fixed copy: published boxes are copies, so a caller reusing its array changes nothing', () => {
  const mine = [box(10, 10)];
  publishFixedCopy('controls', mine);
  mine[0].left = 999;
  assert.equal(fixedCopy.rects[0].left, 10);
  publishFixedCopy('controls', []);
});

test('whales: unchanged on the surface, a step back in deep reading water, whole in open water', () => {
  // The cover and the pale water keep the look they had: only the composed-stretch easing applies
  assert.equal(whaleStrength(1, 0), 1 - 0.06);
  assert.equal(whaleStrength(0, 0), 1);
  // Open deep water (no section holding them): full strength
  assert.equal(whaleStrength(0, 1), 1);
  // A section holding them on the abyss: quieter, but never faint
  const deep = whaleStrength(1, 1);
  assert.ok(Math.abs(deep - (1 - 0.06 - DEEP_READING_RECESSION)) < 1e-9);
  assert.ok(deep >= 0.65 && deep < 0.94);
  // Monotone and continuous through the descent, so the change is never seen as a step
  let last = whaleStrength(1, 0);
  for (let ink = 0.05; ink <= 1.0001; ink += 0.05) {
    const s = whaleStrength(1, ink);
    assert.ok(s <= last && last - s < 0.02);
    last = s;
  }
  // Bad frames never push it out of range
  assert.equal(whaleStrength(4, 9), deep);
  assert.equal(whaleStrength(-1, -1), 1);
});
