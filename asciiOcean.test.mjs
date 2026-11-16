import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';
import * as oceanWorld from './oceanWorld.ts';
import * as waterInertia from './waterInertia.ts';
import * as seaState from './seaState.ts';
import * as oceanWake from './oceanWake.ts';

// Run the production scheduler, resource allocation and two-pass draw code. Only browser
// surfaces/GL calls are mocked; this checks paint ordering, not GPU pixels or Safari compositing.
const source = fs.readFileSync(new URL('./asciiOcean.ts', import.meta.url), 'utf8');
const compiled = ts.transpileModule(source.replace('(import.meta as any)', '({env:{DEV:false}})'), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 }
}).outputText;

function ocean(t, width = 390, height = 844, dpr = 3, reduced = false, effects = {}) {
  let painted = false, allocations = 0, clears = 0, now = 0, next = 0, draws = 0;
  const linked = [], offsets = [];
  const whales = { presence: 1, spines: [new Float32Array(96), new Float32Array(96)] };
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
    drawArrays() { draws++; painted = true; },
    uniform1f(location, value) { if (location === 'uScrollPx') offsets.push(value); }
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
  const doc = { ...events, hidden: false, body: {}, documentElement: { scrollHeight: 12000 },
    querySelectorAll: () => [{ id: 'experience', getBoundingClientRect: () => ({ top: 3000 - win.scrollY }) }] };
  const deps = {
    './GradientASCII': { link: (_gl, source) => { linked.push(source); return { program: {}, uniforms: { uScrollPx: 'uScrollPx' } }; },
      buildAtlas: () => ({ texture: {}, count: 10, grid: [10, 1] }) },
    './abyssPalette': { globeScrollGeometry: { start: 2500, travel: 4000 } },
    './creationTimeline': { creation: { active: false, time: 0 }, OCEAN_HANDOFF_AT: 100,
      advanceCreation() {}, creationLookahead: () => 0, finishCreation() {} },
    './journeyHandoff': { tickHandoff: () => false },
    './oceanWorld': { ...oceanWorld, applyWaterColor() {} },
    './oceanDirection': { ambientWhalesLive: whales },
    './oceanExperiments': { oceanEffects: { inertia: false, flow: false, wake: false, sea: false, ...effects } },
    './waterInertia': waterInertia, './seaState': seaState, './oceanWake': oceanWake
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
    canvas, win, doc, emit, observers, linked, offsets, whales,
    get painted() { return painted; }, get clears() { return clears; },
    get allocations() { return allocations; }, get draws() { return draws; },
    tick(ms = 16) {
      now += ms;
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

// --- The living ocean (oceanExperiments.ts) -------------------------------------------------

const ALL = { inertia: true, flow: true, wake: true, sea: true };
/** uScrollPx reaches both passes: the lattice's position of the last draw, in CSS px. */
const lattice = (b, ratio) => b.offsets.at(-1) / ratio;

test('with every behaviour off the ocean links its two original shaders and nothing else', t => {
  const b = ocean(t, 1440, 900, 1);
  b.tick();
  assert.equal(b.linked.length, 2);
  for (const source of b.linked) {
    assert.ok(!/#define (FLOW|WAKE|SEA)/.test(source));
    assert.ok(!source.includes('uWake') && !source.includes('uSea'));
  }
  b.win.scrollY = 900; b.emit('scroll'); b.tick();
  assert.equal(lattice(b, 1), 900, 'the water is drawn exactly where the page is');
});

test('each behaviour builds only what it needs', t => {
  const defines = effects => {
    const b = ocean(t, 1440, 900, 1, false, effects);
    b.tick();
    return { programs: b.linked.length, defines: (b.linked[0].match(/^#define \w+/gm) || []).join(' ') };
  };
  assert.deepEqual(defines({ inertia: true }), { programs: 2, defines: '' });
  assert.deepEqual(defines({ flow: true }), { programs: 2, defines: '#define FLOW' });
  assert.deepEqual(defines({ sea: true }), { programs: 2, defines: '#define SEA' });
  assert.deepEqual(defines({ wake: true }), { programs: 3, defines: '#define WAKE' });
  assert.deepEqual(defines(ALL), { programs: 3, defines: '#define FLOW #define WAKE #define SEA' });
});

test('inertia: the water follows the page, carries on after it stops until it has caught up, and never moves the page', t => {
  const b = ocean(t, 1440, 900, 1, false, { inertia: true });
  b.tick();
  let y = 500;
  const behind = [];
  for (let i = 0; i < 120; i++) { y += 25; b.win.scrollY = y; b.emit('scroll'); b.tick(); behind.push(y - lattice(b, 1)); }
  // About 1,560 px/s: the water has settled a steady way behind the page, within its limit
  assert.ok(behind.at(-1) > 40 && behind.at(-1) <= waterInertia.WATER_INERTIA.limit, `${behind.at(-1)} px behind`);
  assert.ok(Math.abs(behind.at(-1) - behind.at(-20)) < 0.5, 'and holds there: it moves as fast as the page');
  const after = [];
  for (let i = 0; i < 180; i++) { b.tick(); after.push(y - lattice(b, 1)); }
  for (let i = 1; i < after.length; i++) assert.ok(after[i] <= after[i - 1] + 1e-9, 'it only ever closes on the page');
  assert.ok(after[20] > behind.at(-1) * 0.25, 'still under way a third of a second after the stop');
  assert.ok(Math.min(...after) >= 0, 'never past it');
  assert.equal(after.at(-1), 0, 'and is back with the page');
  assert.equal(b.win.scrollY, y);
});

test('reduced motion keeps the water with the page and leaves the wake still', t => {
  const b = ocean(t, 1440, 900, 1, true, ALL);
  b.tick();
  for (const y of [600, 1400, 1401, 900]) {
    const before = b.draws;
    b.win.scrollY = y; b.emit('scroll'); b.tick(40);
    assert.equal(lattice(b, 1), y);
    assert.equal(b.draws - before, 2, 'no wake pass');
  }
});

test('wake: a third small pass runs only while a whale is moving the water', t => {
  const b = ocean(t, 1440, 900, 1, false, { wake: true });
  b.tick(); b.tick(40);
  const still = b.draws;
  b.tick(40);
  assert.equal(b.draws - still, 2, 'no whale has moved: two passes');
  const swim = x => { for (let n = 0; n < 48; n++) { b.whales.spines[0][n * 2] = x - n * 20; b.whales.spines[0][n * 2 + 1] = 400; } };
  swim(1000); b.tick(40);
  const before = b.draws;
  swim(1006); b.tick(40);
  assert.equal(b.draws - before, 3, 'the wake steps, then the two passes');
  // The whales leave: the wake fades for some ten seconds (its trail is seen for about eight),
  // then the pass stops
  b.whales.presence = 0;
  for (let i = 0; i < 120; i++) b.tick(40);
  const fading = b.draws;
  b.tick(40);
  assert.equal(b.draws - fading, 3, 'still fading four seconds on');
  for (let i = 0; i < 240; i++) b.tick(40);
  const after = b.draws;
  b.tick(40);
  assert.equal(b.draws - after, 2);
});
