import test from 'node:test';
import assert from 'node:assert/strict';
import { lanternLook } from './lanternCursor.ts';

const luminance = ([r, g, b]) => 0.2126 * r + 0.7152 * g + 0.0722 * b;
const saturation = (c) => (Math.max(...c) - Math.min(...c)) / Math.max(1, Math.max(...c));
const samples = Array.from({ length: 201 }, (_, i) => i / 200);

test('surface: a quiet slate mark with no light of its own', () => {
  const look = lanternLook(0);
  assert.equal(look.glow, 0);
  assert.ok(luminance(look.core) < 80, 'dark core on white water');
  assert.equal(look.edgeAlpha, 0);
  assert.ok(look.ringAlpha < 0.45);
  // Still a surface look a third of the way down
  assert.ok(lanternLook(0.3).glow < 0.01);
});

test('deep: a pale lantern with a soft, bounded halo', () => {
  const look = lanternLook(1);
  assert.ok(luminance(look.core) > 220, 'pale core on black water');
  assert.ok(look.glow > 0.5 && look.glow <= 0.65, `restrained glow: ${look.glow}`);
  assert.ok(look.glowScale <= 1.2, 'the halo never grows into an orb');
  assert.equal(look.edgeAlpha, 0);
  // Slightly more fluid in deep water, still responsive
  assert.ok(look.ringLag > lanternLook(0).ringLag && look.ringLag <= 120);
});

test('one continuous progression, reversible and never neon', () => {
  let prev = lanternLook(0);
  for (const d of samples.slice(1)) {
    const look = lanternLook(d);
    assert.ok(look.glow >= prev.glow, `glow only grows with depth (${d})`);
    assert.ok(luminance(look.core) >= luminance(prev.core) - 1e-9, `core only brightens (${d})`);
    // No step changes: at most a few levels per 0.5% of depth
    assert.ok(Math.abs(luminance(look.core) - luminance(prev.core)) < 12, `smooth core at ${d}`);
    assert.ok(Math.abs(look.glow - prev.glow) < 0.02, `smooth glow at ${d}`);
    for (const c of [look.core, look.ring]) assert.ok(saturation(c) < 0.5, `desaturated at ${d}`);
    prev = look;
  }
  // Pure: scrolling back up gives exactly the same states
  assert.deepEqual(samples.map(lanternLook), [...samples].reverse().map(lanternLook).reverse());
});

test('stays visible where the water is mid-grey', () => {
  for (const d of samples) {
    const look = lanternLook(d);
    const water = 255 * (1 - d);
    const contrast = Math.abs(luminance(look.core) - water);
    // Where the core's tone crosses the water's, the hairline edge and the glow carry it
    if (contrast < 60) assert.ok(look.edgeAlpha > 0.3 || look.glow > 0.3, `visible at ${d}`);
  }
});
