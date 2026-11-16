import test from 'node:test';
import assert from 'node:assert/strict';
import { textPressureAt, settleTextPressure } from './whaleTextPressure.ts';

const wake = { count: 1, bodies: [{ x: 200, y: 300, r: 40, strength: 0.8 }] };
test('text pressure belongs to a moving whale and has a bounded local footprint', () => {
  assert.equal(textPressureAt(200, 300, { ...wake, count: 0 }), 0);
  assert.equal(textPressureAt(200, 300, wake), 0.8);
  assert.ok(textPressureAt(220, 300, wake) < 0.8);
  assert.equal(textPressureAt(265, 300, wake), 0);
  assert.equal(textPressureAt(285, 300, { count: 1, bodies: [{ ...wake.bodies[0], r: 1000 }] }), 0);
  const moved = { count: 1, bodies: [{ ...wake.bodies[0], x: 400 }] };
  assert.equal(textPressureAt(200, 300, moved), 0);
  assert.equal(textPressureAt(400, 300, moved), 0.8);
});
test('pressure rises gently and settles completely without frame-rate dependence', () => {
  const results = [30, 60, 120].map(fps => {
    let pressure = 0;
    for (let i = 0; i < fps; i++) pressure = settleTextPressure(pressure, 1, 1 / fps);
    const peak = pressure;
    assert.ok(peak > 0.99 && peak <= 1);
    for (let i = 0; i < fps * 3; i++) {
      const previous = pressure;
      pressure = settleTextPressure(pressure, 0, 1 / fps);
      assert.ok(pressure <= previous && pressure >= 0);
    }
    assert.equal(pressure, 0);
    return peak;
  });
  assert.ok(Math.max(...results) - Math.min(...results) < 1e-6);
});
