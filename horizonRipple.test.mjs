import test from 'node:test';
import assert from 'node:assert/strict';
import { drawnAmplitude, stepString } from './horizonRipple.ts';

test('a ripple on the horizon stays within 3 px and settles back to a straight line', () => {
  const n = 97;
  const u = new Float32Array(n);
  const v = new Float32Array(n);
  // A hard push in the middle, harder than any pointer crossing
  for (let k = -3; k <= 3; k++) v[48 + k] += 120 * Math.exp(-(k * k) / 4);
  let maxAmp = 0;
  let energy = Infinity;
  const dt = 1 / 240;
  for (let step = 0; step < 240 * 3; step++) {
    energy = stepString(u, v, dt);
    for (let i = 0; i < n; i++) maxAmp = Math.max(maxAmp, Math.abs(drawnAmplitude(u[i])));
  }
  assert.ok(maxAmp <= 3, `amplitude ${maxAmp}`);
  assert.ok(maxAmp > 0.5, 'the push is visible');
  // The shores never move
  assert.equal(u[0], 0);
  assert.equal(u[n - 1], 0);
  // Within three seconds the line is at rest (the loop sleeps below 0.02)
  assert.ok(energy < 0.02, `energy ${energy}`);
});
