import test from 'node:test';
import assert from 'node:assert/strict';
import { PLANE_DENSITY, SKY_MARGIN, bandWeight, buildSky, dustAt, galaxyLight, meteorAt, seeded, skyLayout, spawnMeteor, strokeFor } from './arrivalSky.ts';

test('the same screen always gets the same sky, and a bigger screen more stars, not denser ones', () => {
  assert.deepEqual(buildSky(1280, 800), buildSky(1280, 800));
  const desk = buildSky(1280, 800), phone = buildSky(390, 844);
  assert.ok(desk.length > phone.length * 2.5);
  for (const [w, h, sky] of [[1280, 800, desk], [390, 844, phone]]) {
    const area = (w + 2 * SKY_MARGIN) * (h + 2 * SKY_MARGIN);
    for (const plane of [0, 1, 2]) {
      // the open cluster's 16 stars sit on the nearer planes on top of the field's own
      const n = sky.filter(s => s.plane === plane).length, expected = area * PLANE_DENSITY[plane];
      assert.ok(Math.abs(n - expected) <= expected * 0.2 + (plane ? 16 : 0), `plane ${plane}: ${n} vs ${expected.toFixed(0)}`);
    }
  }
});

test('far stars gather along the Milky Way band; most stars are faint, a few bright', () => {
  const L = skyLayout(1280, 800), sky = buildSky(1280, 800);
  const far = sky.filter(s => s.plane === 0);
  const on = far.filter(s => bandWeight(s.x, s.y, L) > 0.5).length, off = far.filter(s => bandWeight(s.x, s.y, L) < 0.1).length;
  // per unit area: sample the band's share of the screen
  const rand = seeded(5);
  let onArea = 0, offArea = 0;
  for (let i = 0; i < 20000; i++) { const w = bandWeight(rand() * 1280, rand() * 800, L); if (w > 0.5) onArea++; else if (w < 0.1) offArea++; }
  assert.ok(on / onArea > 1.8 * (off / offArea), 'band densification');
  const bright = sky.filter(s => s.mag > 0.8).length;
  assert.ok(bright > 0 && bright < sky.length * 0.08, `${bright} bright of ${sky.length}`);
  for (const s of sky) assert.ok(s.mag > 0 && s.mag <= 1);
});

test('the galaxy is light within its disk only, brightest at its core, never above 1', () => {
  for (const [w, h] of [[1280, 800], [390, 844], [1920, 1080]]) {
    const L = skyLayout(w, h), G = L.galaxy;
    assert.ok(G.x - G.r > 0 && G.x + G.r * 0.6 < w && G.y - G.r * G.incl > 0, 'on screen');
    const core = galaxyLight(G.x, G.y, L, 0).light;
    assert.ok(core > 0.9);
    assert.equal(galaxyLight(G.x + G.r * 1.6, G.y, L, 0).light, 0);
    for (let k = 0; k < 400; k++) {
      const a = k * 2.399, r = (k / 400) * G.r * 1.3;
      const v = galaxyLight(G.x + Math.cos(a) * r, G.y + Math.sin(a) * r * 0.5, L, k, k % 3).light;
      assert.ok(v >= 0 && v <= 1 && v <= core + 1e-9);
    }
  }
});

test('dust is faint, and only on the band', () => {
  const L = skyLayout(1280, 800);
  const rand = seeded(9);
  for (let i = 0; i < 5000; i++) {
    const x = rand() * 1280, y = rand() * 800, d = dustAt(x, y, L);
    assert.ok(d >= 0 && d <= 0.2);
    if (bandWeight(x, y, L) < 0.06) assert.equal(d, 0);
  }
});

test('a meteor enters and leaves without a flash, travelling one way', () => {
  const rand = seeded(3);
  for (let i = 0; i < 200; i++) {
    const m = spawnMeteor(rand, 1280, 800, 0);
    assert.ok([0.35, 0.62, 1].includes(m.depth));
    assert.ok(m.duration > 400 && m.duration < 1500);
    assert.ok(meteorAt(m, 0).light < 1e-6 && meteorAt(m, 1).light < 1e-6);
    let prev = -1, peak = 0;
    for (let u = 0; u <= 1.0001; u += 0.05) {
      const at = meteorAt(m, u);
      const along = (at.x - m.x0) * m.dx + (at.y - m.y0) * m.dy;
      assert.ok(along >= prev - 1e-9, 'never turns back');
      prev = along;
      peak = Math.max(peak, at.light);
    }
    assert.ok(peak <= 1 && peak > 0.95);
    assert.ok(m.dy > 0, 'falls');
  }
});

test('a thin line is drawn the way an ASCII artist would: over, dash, under; slashes only when steep', () => {
  // 30 degrees down-right on an 8.4 x 14 cell is shallow on the lattice
  const dx = Math.cos(Math.PI / 6), dy = Math.sin(Math.PI / 6);
  assert.equal(strokeFor(dx, dy, 8.4, 14, 0.1), '¯');
  assert.equal(strokeFor(dx, dy, 8.4, 14, 0.5), '-');
  assert.equal(strokeFor(dx, dy, 8.4, 14, 0.9), '_');
  assert.equal(strokeFor(0.4, 0.9, 8.4, 14), '\\');
  assert.equal(strokeFor(-0.4, 0.9, 8.4, 14), '/');
  assert.equal(strokeFor(0.05, 1, 8.4, 14), '|');
});
