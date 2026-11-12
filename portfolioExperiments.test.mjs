import test from 'node:test';
import assert from 'node:assert/strict';
import { parsePortfolioExperiments } from './portfolioExperiments.ts';
import { createAsciiGlobeSampler } from './asciiGlobePrototype.ts';
import { buildCityConstellation } from './cityConstellation.ts';
import { CV_DATA } from './cvData.ts';
import { observeGlobeSurface } from './globeSurface.ts';

test('experiments require explicit local flags and cannot enable in production', () => {
  const all = '?asciiGlobe=1&cityConstellation=1';
  assert.ok(Object.values(parsePortfolioExperiments(all, true)).every(Boolean));
  assert.ok(Object.values(parsePortfolioExperiments(all, false)).every(v => !v));
  assert.ok(Object.values(parsePortfolioExperiments('', true)).every(v => !v));
});

test('ASCII sampler culls the back, bounds density and emits deterministic directional coast glyphs', () => {
  const sample = createAsciiGlobeSampler();
  const frame = { cx: 300, cy: 300, radius: 200, mobile: false, view: [1,0,0], east: [0,1,0], north: [0,0,1] };
  const land = { xyz: new Float32Array([1,0,0, -1,0,0]), bands: [0,1,2,2] };
  const cells = []; sample(land, frame, c => cells.push(c));
  assert.equal(cells.filter(c => c.land).length, 1, 'back point cannot overwrite front relief');
  assert.ok(cells.every(c => Math.hypot(c.x-300,c.y-300) < 200 && c.alpha >= 0 && c.alpha <= 1));
  assert.ok(cells.every(c => /^[. :+*#|/\\-]$/.test(c.glyph)));
  const again = []; sample(land, frame, c => again.push(c));
  assert.deepEqual(again, cells);
  const budget = sample(null, { ...frame, radius: 2000 }, () => {});
  assert.ok(budget.cells < 15000);
  assert.ok(sample(null, { ...frame, mobile: true }, () => {}).cellH >= 8);
});

test('constellation has exactly the seven CV cities in order, stays bounded on desktop and phone', () => {
  for (const [w,h] of [[1440,900], [390,844], [844,390], [320,568]]) {
    const points = buildCityConstellation(w,h);
    assert.deepEqual(points.filter(p => p.city).map(p => p.city), CV_DATA.locations.map(c => c.city));
    assert.ok(points.every(p => p.x >= 0 && p.x <= w && p.y >= 0 && p.y <= h));
    assert.ok(points.length < 100);
    assert.deepEqual(buildCityConstellation(w,h), points);
  }
});

test('surface invalidation re-arms DPR queries, observes visual viewport and removes all observers', () => {
  const oldWindow = globalThis.window, oldObserver = globalThis.ResizeObserver;
  const queries = [], viewport = new Map(); let calls = 0, disconnected = false;
  globalThis.window = { devicePixelRatio: 3,
    matchMedia(query) { const handlers = new Map(); const m = { query, handlers,
      addEventListener: (k,f) => handlers.set(k,f), removeEventListener: k => handlers.delete(k) };
      queries.push(m); return m; },
    visualViewport: { addEventListener: (k,f) => viewport.set(k,f), removeEventListener: k => viewport.delete(k) }
  };
  globalThis.ResizeObserver = class { constructor(cb) { this.cb = cb; } observe() { this.cb(); } disconnect() { disconnected = true; } };
  try {
    const stop = observeGlobeSurface({}, () => calls++);
    viewport.get('resize')();
    window.devicePixelRatio = 2; queries[0].handlers.get('change')();
    assert.equal(calls, 3);
    assert.equal(queries[1].query, '(resolution: 2dppx)');
    assert.equal(queries[0].handlers.size, 0);
    stop();
    assert.equal(queries[1].handlers.size, 0);
    assert.equal(viewport.size, 0); assert.ok(disconnected);
  } finally { globalThis.window = oldWindow; globalThis.ResizeObserver = oldObserver; }
});
