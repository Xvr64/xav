import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';
import * as oceanWorld from './oceanWorld.ts';

// Run the production scheduler, resource allocation and two-pass draw code. Only browser
// surfaces/GL calls are mocked; this checks paint ordering, not GPU pixels or Safari compositing.
const source = fs.readFileSync(new URL('./asciiOcean.ts', import.meta.url), 'utf8');
const compiled = ts.transpileModule(source.replace('(import.meta as any)', '({env:{DEV:false}})'), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 }
}).outputText;

function ocean(t, width = 390, height = 844, dpr = 3, reduced = false) {
  let painted = false, allocations = 0, clears = 0, now = 0, next = 0, draws = 0;
  let backingW = 300, backingH = 150;
  const frames = new Map(), observers = [], listeners = new Map();
  const emit = name => { for (const cb of listeners.get(name) ?? []) cb(); };
  const events = {
    addEventListener(name, cb) {
      if (!listeners.has(name)) listeners.set(name, new Set());
      listeners.get(name).add(cb);
    },
    removeEventListener(name, cb) { listeners.get(name)?.delete(cb); }
  };
  const gl = new Proxy({
    texImage2D() { allocations++; },
    drawArrays() { draws++; painted = true; }
  }, { get(target, key) {
    if (key in target) return target[key];
    if (/^[A-Z0-9_]+$/.test(key)) return key;
    return () => ({});
  }});
  const canvas = {
    ...events, clientWidth: width, clientHeight: height, dataset: {},
    getContext: () => gl,
    get width() { return backingW; },
    set width(v) { backingW = v; painted = false; clears++; },
    get height() { return backingH; },
    set height(v) { backingH = v; painted = false; clears++; }
  };
  const media = { matches: reduced, ...events };
  const win = { ...events, innerHeight: height, devicePixelRatio: dpr, scrollY: 500,
    matchMedia: () => media };
  const doc = { ...events, hidden: false, body: {}, documentElement: { scrollHeight: 12000 } };
  const deps = {
    './GradientASCII': { link: () => ({ program: {}, uniforms: {} }),
      buildAtlas: () => ({ texture: {}, count: 10, grid: [10, 1] }) },
    './abyssPalette': { globeScrollGeometry: { start: 2500, travel: 4000 } },
    './creationTimeline': { creation: { active: false, time: 0 }, OCEAN_HANDOFF_AT: 100,
      advanceCreation() {}, creationLookahead: () => 0, finishCreation() {} },
    './journeyHandoff': { tickHandoff: () => false },
    './oceanWorld': { ...oceanWorld, applyWaterColor() {} }
  };
  const exports = {};
  vm.runInNewContext(compiled, {
    exports, require: name => { assert.ok(deps[name], name); return deps[name]; },
    window: win, document: doc, console, performance: { now: () => now },
    requestAnimationFrame(cb) { frames.set(++next, cb); return next; },
    cancelAnimationFrame(id) { frames.delete(id); },
    ResizeObserver: class {
      constructor(cb) { this.fire = cb; observers.push(this); }
      observe() {} disconnect() {}
    }
  });
  const handle = exports.createAsciiOcean(canvas);
  t.after(() => handle.destroy());
  return {
    canvas, win, doc, emit, observers,
    get painted() { return painted; }, get clears() { return clears; },
    get allocations() { return allocations; }, get draws() { return draws; },
    tick() {
      now += 16;
      const pending = [...frames.values()]; frames.clear();
      for (const cb of pending) cb(now);
    }
  };
}

for (const [label, w, h, dpr] of [
  ['iPhone-sized', 390, 844, 3], ['Android-sized', 412, 915, 2.625], ['desktop', 1440, 900, 1]
]) {
  test(`${label}: resize after RAF retains the water until its replacement is drawn`, t => {
    const b = ocean(t, w, h, dpr);
    b.tick();
    assert.equal(b.painted, true);
    for (const [width, height] of [[w, h - 80], [h, w], [w, h], [w, h - 50]]) {
      b.canvas.clientWidth = width; b.canvas.clientHeight = height;
      b.win.innerHeight = height;
      b.observers[0].fire(); // Browser delivers RO after RAF, immediately before paint.
      assert.equal(b.painted, true, 'observer must not expose a cleared opaque buffer');
      b.tick();
      assert.equal(b.painted, true, 'allocation and complete draw share a frame');
      const ratio = Math.min(dpr, width < 768 ? 1.25 : 1.5);
      assert.equal(b.canvas.width, Math.round(width * ratio));
      assert.equal(b.canvas.height, Math.round(height * ratio));
    }
  });
}

test('duplicate resize notifications neither clear the water nor reallocate its cell texture', t => {
  const b = ocean(t);
  b.tick();
  const clears = b.clears, allocations = b.allocations;
  for (let i = 0; i < 5; i++) { b.observers[0].fire(); b.emit('resize'); b.tick(); }
  assert.equal(b.clears, clears);
  assert.equal(b.allocations, allocations);
  assert.equal(b.painted, true);
});

test('reduced-motion and hidden-tab resize repaint atomically on resumption', t => {
  const b = ocean(t, 390, 844, 3, true);
  b.tick();
  b.doc.hidden = true;
  b.canvas.clientHeight = 760;
  b.observers[0].fire(); b.tick();
  assert.equal(b.painted, true);
  assert.equal(b.canvas.height, 1055, 'retain previous buffer while hidden');
  b.doc.hidden = false; b.emit('visibilitychange'); b.tick();
  assert.equal(b.canvas.height, 950);
  assert.equal(b.painted, true);
});

test('scrolling forward/reverse draws both passes without resizing the backing buffer', t => {
  const b = ocean(t);
  b.tick();
  const clears = b.clears, allocations = b.allocations;
  for (const y of [100, 500, 1400, 1900, 1400, 500, 100]) {
    const before = b.draws;
    b.win.scrollY = y; b.emit('scroll'); b.tick();
    assert.equal(b.draws - before, 2);
    assert.equal(b.painted, true);
  }
  assert.equal(b.clears, clears);
  assert.equal(b.allocations, allocations);
});
