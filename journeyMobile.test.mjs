import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';
import { CV_DATA } from './cvData.ts';
import {
  captionArrivingAt, captionInOpacity, captionInTime, captionLeavingAt, cubicBezierAt, globeZoneRects, inlineTranslateY, planCaptionHandoff, stageViewportTop,
  CAPTION_BOTH_MAX, CAPTION_GONE, CAPTION_IN_MS, CAPTION_OUT_MS
} from './globeSurface.ts';

// Execute the real controller, camera/city state, canvas draw, renderer RAF and shared
// progress module together. DOM/Canvas/React hooks are simulated, not WebKit or GPU pixels.
const compile = file => ts.transpileModule(fs.readFileSync(new URL(file, import.meta.url), 'utf8').replaceAll('import.meta', '({ env: { DEV: true } })'), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020, jsx: ts.JsxEmit.React }
}).outputText;
const sources = Object.fromEntries(['cinematicScroll', 'abyssPalette', 'asciiGlobePrototype', 'globeSurface', 'JourneyGlobe'].map(name =>
  [name, compile(`./${name}.${name === 'JourneyGlobe' ? 'tsx' : 'ts'}`)]));

function globe({ staleReads = false, coarse = true, ascii = false } = {}) {
  let now = 0, nextFrame = 0, controller, geometry, pendingY = null, blits = 0;
  let width = 390, height = 844, start = 2500;
  const raf = new Map(), listeners = new Map(), refs = [], effects = [], io = [];
  const cities = ['doha'], renders = [], samples = [], paintedLabels = new Set(), zones = [];
  let layoutReads = 0;
  const events = {
    addEventListener(type, fn, options) {
      if (!listeners.has(type)) listeners.set(type, new Map());
      listeners.get(type).set(fn, options);
    },
    removeEventListener(type, fn) { listeners.get(type)?.delete(fn); }
  };
  const css = new Map();
  const style = {
    setProperty(p, v, priority = '') { css.set(p, [v, priority]); },
    getPropertyValue: p => css.get(p)?.[0] ?? '',
    getPropertyPriority: p => css.get(p)?.[1] ?? '',
    removeProperty(p) { css.delete(p); }
  };
  class Element {
    tagName = 'DIV'; scrollHeight = 0; clientHeight = 0; parentElement = null;
    style = {}; isContentEditable = false;
    closest() { return null; }
  }
  const win = { ...events, scrollY: start, scrollX: 0, innerHeight: height, devicePixelRatio: 3,
    history: { scrollRestoration: 'auto' },
    matchMedia: query => ({ ...events, matches: query.includes('coarse') && coarse }),
    scrollTo({top}) {
      if (staleReads) pendingY = top;
      else this.scrollY = Math.round(top);
    }
  };
  const emit = (type, fields = {}) => {
    const e = { type, target: stage, defaultPrevented: false, cancelable: true,
      preventDefault() { if (this.cancelable) this.defaultPrevented = true; }, ...fields };
    for (const [fn, options] of listeners.get(type) ?? []) {
      const prevent = e.preventDefault;
      if (options?.passive) e.preventDefault = () => {};
      fn(e); e.preventDefault = prevent;
    }
    return e;
  };
  const ctx = new Proxy({
    measureText: text => ({ width: text.length * 7 }),
    createRadialGradient: () => ({ addColorStop() {} }),
    fillText: text => paintedLabels.add(text),
    drawImage() { blits++; }
  }, { get(target, prop) { return prop in target ? target[prop] : () => {}; } });
  const canvas = new Element();
  canvas.getContext = () => ctx;
  const rect = () => ({ left: 16, top: 0, bottom: height, width: width - 32, height });
  // Every layout read is counted: a film frame must not perform any
  const read = fn => () => { layoutReads++; return fn(); };
  const pinned = new Element(); pinned.getBoundingClientRect = read(rect);
  const runway = new Element(); runway.firstElementChild = pinned;
  runway.getBoundingClientRect = read(() => ({ top: start - win.scrollY, height: 6 * height }));
  const stage = new Element(); stage.getBoundingClientRect = read(rect);
  stage.closest = () => runway; stage.querySelectorAll = () => [];
  const progress = new Element(), caption = new Element();
  caption.getBoundingClientRect = read(() => ({ left: 24, top: height - 300, bottom: height - 96, width: width - 48, height: 204 }));
  let hintVisible = false;
  const hint = { classList: { toggle(_, value) { hintVisible = value; } } };
  const attrs = new Map();
  const doc = { ...events, body: new Element(),
    documentElement: {
      style, clientWidth: width, scrollHeight: 15000,
      setAttribute: (k, v) => attrs.set(k, v),
      removeAttribute: k => attrs.delete(k),
      getAttribute: k => attrs.get(k) ?? null
    },
    createElement: () => canvas, hidden: false };
  const react = {
    memo: fn => fn,
    createElement: () => null,
    useState(initial) { return [typeof initial === 'function' ? initial() : initial, id => cities.push(id)]; },
    useRef(initial) { const ref = { current: initial }; refs.push(ref); return ref; },
    useMemo: fn => fn(), useEffect: fn => effects.push(fn), useLayoutEffect() {}
  };
  const deps = {
    react: { ...react, default: react },
    './portfolioExperiments': { portfolioExperiments: { asciiGlobe: ascii } },
    './glyphcssGlobe': { loadLandDots: () => new Promise(() => {}) },
    './lanternCursor': { setLanternDepth() {} },
    './oceanDirection': { setGlobeZone(rects) { zones.push(rects); } },
    './globeDiagnostics': { mountGlobeDiagnostics: () => ({
      controller: (s, p) => samples.push({ ...s, progress: p }),
      render: (p, city) => renders.push({ p, city, documentY: win.scrollY, at: now }), destroy() {}
    }) }
  };
  const context = vm.createContext({ window: win, document: doc, HTMLElement: Element,
    getComputedStyle: () => ({ overflowY: 'visible', top: '0' }),
    performance: { now: () => now }, console,
    requestAnimationFrame(fn) { raf.set(++nextFrame, fn); return nextFrame; },
    cancelAnimationFrame(id) { raf.delete(id); },
    IntersectionObserver: class {
      constructor(cb) { io.push(cb); } observe() {} disconnect() {}
    },
    require: name => { assert.ok(deps[name], name); return deps[name]; }
  });
  for (const name of ['cinematicScroll', 'abyssPalette', 'asciiGlobePrototype', 'globeSurface', 'JourneyGlobe']) {
    context.exports = {};
    vm.runInContext(`(function(exports, require) { ${sources[name]}\n})(exports, require);`, context);
    deps[`./${name}`] = context.exports;
    if (name === 'cinematicScroll') {
      const mount = context.exports.mountCinematicScroll;
      context.exports.mountCinematicScroll = (...args) => (controller = mount(...args));
    }
  }
  geometry = deps['./abyssPalette'].globeScrollGeometry;
  deps['./JourneyGlobe'].JourneyGlobe({ locations: CV_DATA.locations });
  [stage, canvas, progress, caption, hint].forEach((el, i) => refs[i].current = el);
  const cleanup = effects[0]();
  const advance = ms => {
    const end = now + ms;
    while (now < end) {
      now = Math.min(end, now + 16);
      if (pendingY !== null) { win.scrollY = Math.round(pendingY); pendingY = null; }
      const tasks = [...raf.values()]; raf.clear();
      for (const fn of tasks) fn(now);
      // Intentionally no scroll events: render scheduling must come from the controller.
    }
  };
  const startTouch = () => emit('touchstart', { touches: [{ clientY: 650, clientX: 150 }] });
  const move = dy => {
    const e = emit('touchmove', { touches: [{ clientY: 650 - dy, clientX: 150 }] });
    if (!e.defaultPrevented && style.getPropertyValue('overflow-y') !== 'hidden') {
      win.scrollY += dy; emit('scroll');
    }
    return e;
  };
  const endTouch = dy => emit('touchend', { touches: [], changedTouches: [{ clientY: 650 - dy, clientX: 150 }] });
  advance(16);
  return {
    win, doc, controller, style, samples, renders, cities, paintedLabels, advance, emit, startTouch, move, endTouch,
    anchor() { const a = new Element(); a.closest = () => a; emit('click', { target: a }); },
    get blits() { return blits; }, get hint() { return hintVisible; }, get layoutReads() { return layoutReads; },
    zones, pinned, globeFrame: deps['./JourneyGlobe'].globeFrame, get size() { return { width, height, start }; },
    get p() { return deps['./abyssPalette'].globeScrollProgress(); },
    get end() { return geometry.start + geometry.travel; },
    get controlledY() { return geometry.controlledY; },
    swipe(dy) { startTouch(); move(Math.sign(dy) * 2); move(dy); endTouch(dy); },
    forceNative(y) { win.scrollY = y; emit('scroll'); },
    hideObserver() { for (const cb of io) cb([{ isIntersecting: false }]); },
    resize(w, h, top = start) { width = w; height = h; start = top; win.innerHeight = h; emit('resize'); },
    cleanup
  };
}

test('production controller + Globe: single mobile swipe paints all eight cities and releases', () => {
  const b = globe();
  try {
    assert.equal(b.hint, true);
    b.swipe(100);
    assert.equal(b.hint, false);
    assert.equal(b.controller.snapshot().ownership, 'playing');
    b.advance(13000);
    assert.deepEqual(b.cities, ['doha', 'paris', 'jakarta', 'moscow', 'singapore', 'pau', 'bordeaux', 'shanghai']);
    for (const loc of CV_DATA.locations) assert.ok(b.paintedLabels.has(loc.city.toUpperCase()), loc.city);
    assert.ok(b.blits > 300);
    assert.equal(b.p, 1);
    assert.equal(b.win.scrollY, b.end);
    assert.equal(b.controller.snapshot().ownership, 'document');
    assert.equal(b.style.getPropertyValue('overflow-y'), '');
    assert.equal(b.win.history.scrollRestoration, 'auto');
    assert.equal(b.move(100).defaultPrevented, false);
  } finally { b.cleanup(); }
});

test('production Globe: repeated swipes and native overshoot produce the same frames at the same speed', () => {
  const calm = globe(), busy = globe();
  try {
    calm.swipe(100); busy.swipe(100);
    for (let i = 0; i < 750; i++) {
      calm.advance(16); busy.advance(16);
      if (busy.controller.snapshot().playing && i % 5 === 0) {
        const y = busy.win.scrollY;
        busy.swipe(500);
        busy.forceNative(busy.end + 2000);
        assert.ok(Math.abs(busy.win.scrollY - y) <= 1);
      }
    }
    assert.deepEqual(busy.renders.map(r => [r.p, r.city]), calm.renders.map(r => [r.p, r.city]));
    assert.deepEqual(busy.cities, calm.cities);
  } finally { calm.cleanup(); busy.cleanup(); }
});

test('production Globe: delayed scroll readback and stale visibility cannot freeze the renderer on Doha', () => {
  const b = globe({ staleReads: true });
  try {
    b.hideObserver(); b.swipe(100); b.advance(5000);
    assert.ok(b.p > 0.4);
    assert.ok(b.renders.at(-1).city >= 3);
    assert.ok(b.paintedLabels.has('MOSCOW'));
    for (const s of b.samples.filter(s => s.playing)) assert.ok(s.progress >= 0);
    b.advance(8000);
    assert.equal(b.cities.at(-1), 'shanghai');
    assert.equal(b.renders.at(-1).p, 1, 'final render survives asynchronous scroll acknowledgement');
    assert.equal(b.controller.snapshot().ownership, 'document');
  } finally { b.cleanup(); }
});

test('production Globe: mobile reverse/resume keeps position continuous and returns through every city', () => {
  const b = globe();
  try {
    b.swipe(100); b.advance(5000);
    const p = b.p;
    b.swipe(-100); assert.equal(b.p, p);
    b.advance(1500); assert.ok(b.p < p);
    const reversed = b.p;
    b.swipe(100); assert.equal(b.p, reversed);
    b.advance(13000); assert.equal(b.p, 1);
    b.swipe(-100); b.advance(13000);
    assert.deepEqual(b.cities.slice(-8), ['shanghai', 'bordeaux', 'pau', 'singapore', 'moscow', 'jakarta', 'paris', 'doha']);
    assert.equal(b.hint, true);
    b.swipe(-100);
    assert.equal(b.controller.snapshot().ownership, 'document');
    assert.ok(b.win.scrollY < 2500, 'outward swipe returns to Hero');
  } finally { b.cleanup(); }
});

test('production Globe: resize at Doha and mid-play preserves geometry and the playback clock', () => {
  const b = globe();
  try {
    b.startTouch(); b.move(2); b.endTouch(2); // own ready, but below deliberate intent
    b.resize(844, 390, 2000);
    assert.ok(Math.abs(b.win.scrollY - 2000) <= 1);
    assert.equal(b.hint, true);
    b.swipe(100); b.advance(2500);
    const time = b.controller.snapshot().time;
    b.resize(390, 844, 2500);
    assert.equal(b.controller.snapshot().time, time);
    b.advance(13000);
    assert.equal(b.win.scrollY, b.end);
    assert.equal(b.cities.at(-1), 'shanghai');
  } finally { b.cleanup(); }
});

test('production Globe: endpoint drains an existing finger then releases immediately without queued playback', () => {
  const b = globe();
  try {
    b.swipe(100); b.advance(2000); b.startTouch(); b.move(200);
    b.advance(13000);
    assert.equal(b.controller.snapshot().ownership, 'draining');
    assert.equal(b.move(500).defaultPrevented, true);
    b.endTouch(500);
    assert.equal(b.controller.snapshot().ownership, 'document');
    assert.equal(b.controller.snapshot().playing, false);
    assert.equal(b.style.getPropertyValue('touch-action'), '');
  } finally { b.cleanup(); }
});

test('production Globe: teardown and explicit navigation restore original styles even with a finger down', () => {
  for (const exit of ['skip', 'destroy', 'pagehide', 'hashchange', 'Home', 'End', 'Tab']) {
    const b = globe();
    b.style.setProperty('overflow-y', 'scroll', 'important');
    b.style.setProperty('touch-action', 'pan-y');
    b.style.setProperty('overscroll-behavior', 'contain');
    try {
      b.swipe(100); b.startTouch(); b.move(100);
      if (exit === 'skip') b.controller.skip();
      else if (exit === 'destroy') b.controller.destroy();
      else if (['Home', 'End', 'Tab'].includes(exit)) b.emit('keydown', { key: exit });
      else b.emit(exit);
      assert.equal(b.style.getPropertyValue('overflow-y'), 'scroll', exit);
      assert.equal(b.style.getPropertyPriority('overflow-y'), 'important', exit);
      assert.equal(b.style.getPropertyValue('touch-action'), 'pan-y', exit);
      assert.equal(b.style.getPropertyValue('overscroll-behavior'), 'contain', exit);
      assert.equal(b.win.history.scrollRestoration, 'auto', exit);
      assert.equal(b.controller.snapshot().ownership, 'document', exit);
    } finally { b.cleanup(); }
  }
});

test('Profile anchor: a single native jump releases mobile ownership without playing cities; reverse still works', () => {
  for (const coarse of [true, false]) {
    const b = globe({ coarse });
    try {
      if (coarse) b.swipe(100);
      else b.emit('wheel', { deltaY: 100, deltaMode: 0 });
      b.advance(1800);
      b.anchor();
      b.forceNative(b.end + 250);
      b.emit('hashchange');
      b.advance(1000);
      assert.equal(b.controller.snapshot().playing, false);
      assert.equal(b.controller.snapshot().ownership, coarse ? 'document' : 'desktop');
      assert.equal(b.style.getPropertyValue('overflow-y'), '');
      assert.equal(b.win.scrollY, b.end + 250);
      b.forceNative(b.end - 10);
      b.advance(13000);
      assert.equal(b.cities.at(-1), 'doha');
    } finally { b.cleanup(); }
  }
});

test('ASCII prototype retains every city, frame progress, reversal and mobile ownership', () => {
  const baseline = globe(), ascii = globe({ ascii: true });
  try {
    baseline.swipe(100); ascii.swipe(100);
    baseline.advance(13000); ascii.advance(13000);
    assert.deepEqual(ascii.cities, baseline.cities);
    assert.deepEqual(ascii.renders, baseline.renders);
    assert.equal(ascii.controller.snapshot().ownership, 'document');
    assert.ok(ascii.paintedLabels.has(':'), 'sphere is painted with glyphs');
    ascii.swipe(-100); ascii.advance(13000);
    assert.equal(ascii.cities.at(-1), 'doha');
  } finally { baseline.cleanup(); ascii.cleanup(); }
});

test('production Globe: sustained mobile escape past runway releases ownership instead of freezing on Doha', () => {
  // Simulate iOS Safari UIProcess momentum ignoring window.scrollTo() for > 120ms past runway end.
  const b = globe({ staleReads: true });
  try {
    b.startTouch();
    b.move(2);
    b.endTouch(2); // mobile owns scene in 'ready' at Doha, lock attribute set
    assert.equal(b.controller.snapshot().owner, 'ready');
    assert.equal(b.doc.documentElement.getAttribute('data-globe-scroll'), 'locked');
    assert.equal(b.controller.snapshot().expectedY, 2500);
    assert.equal(b.controller.snapshot().actualY, 2500);

    // Override scrollTo to refuse moving scrollY back while native UIProcess drives document past runway
    const origScrollTo = b.win.scrollTo;
    b.win.scrollTo = () => {};
    b.forceNative(b.end + 400);
    assert.equal(b.controller.snapshot().owner, 'ready', 'single overshoot frame does not instantly drop ownership');
    b.advance(140);
    b.forceNative(b.end + 550);
    assert.equal(b.controller.snapshot().owner, 'document', 'sustained out-of-bounds divergence yields ownership');
    assert.equal(b.controlledY, null, 'controlledY cleared so Globe cannot remain frozen on Doha');
    assert.equal(b.doc.documentElement.getAttribute('data-globe-scroll'), null, 'scroll lock attribute removed');
    b.win.scrollTo = origScrollTo;
  } finally { b.cleanup(); }
});

test('production Globe: stale IntersectionObserver during ready state still produces frames', () => {
  const b = globe();
  try {
    b.hideObserver();
    const before = b.renders.length;
    b.forceNative(2500); // touch/scroll update while IO mistakenly reports out of view
    b.advance(32);
    assert.ok(b.renders.length > before, 'synchronous stage visibility keeps rendering despite stale observer');
  } finally { b.cleanup(); }
});
test('production Globe: a film frame reads no layout; calm zones follow scroll from cached geometry', () => {
  const b = globe();
  try {
    const { width, height } = b.size;
    const W = width - 32, H = height;
    const disc = zoom => { const { cx, cy, baseR } = b.globeFrame(W, H); const r = baseR * zoom; return { left: 16 + cx - r, top: cy - r, width: 2 * r, height: 2 * r }; };
    const caption = top => ({ left: 24, top: top + height - 300, width: width - 48, height: 204 });
    const shift = (r, dy) => ({ ...r, top: r.top + dy });
    const zone = () => JSON.parse(JSON.stringify(b.zones.at(-1))); // vm realm -> plain objects
    b.swipe(100);
    const reads = b.layoutReads;
    const zonesBefore = b.zones.length;
    b.advance(13000);
    assert.equal(b.cities.at(-1), 'shanghai');
    assert.ok(b.zones.length - zonesBefore > 300, 'every film frame publishes its zones');
    assert.equal(b.layoutReads, reads, 'no getBoundingClientRect during the whole Doha -> Shanghai film');
    // Pinned at Shanghai (dwell zoom 1.08): disc + caption exactly where layout puts them
    assert.deepEqual(zone(), [disc(1.08), caption(0)]);
    // A Magnetic CV slide translates the pinned chapter inline: the zones move with it, still no layout read
    for (const [translate, dy] of [['0px -300px', -300], ['0 412.5px', 412.5], ['', 0]]) {
      b.pinned.style.translate = translate; b.forceNative(b.end); b.advance(32);
      assert.deepEqual(zone(), [shift(disc(1.08), dy), caption(dy)], translate || 'no translate');
    }
    delete b.pinned.style.translate;
    assert.equal(b.layoutReads, reads, 'slide offsets come from the inline style, not layout');
    // Released: the stage scrolls away with the document, then leaves the viewport
    b.forceNative(b.end + 300); b.advance(32);
    assert.deepEqual(zone(), [shift(disc(1.08), -300), caption(-300)]);
    b.forceNative(b.end + H + 5); b.advance(32);
    assert.deepEqual(zone(), []);
    assert.equal(b.layoutReads, reads, 'native scrolling after the film reads no layout either');
    // Rotation / toolbar resize re-measures once, then frames are read-free again
    b.forceNative(b.end); b.advance(32);
    b.resize(844, 390, 2000);
    const afterResize = b.layoutReads;
    assert.ok(afterResize > reads, 'resize re-measures the stage');
    b.forceNative(b.end); b.advance(32); // the released end of the new, shorter runway
    assert.equal(b.layoutReads, afterResize);
    const z = zone();
    const f = b.globeFrame(844 - 32, 390);
    assert.equal(z.length, 2);
    assert.ok(Math.abs(z[0].width - 2 * f.baseR * 1.08) < 1e-6, 'disc follows the new stage size');
    assert.deepEqual(z[1], { left: 24, top: 390 - 300, width: 844 - 48, height: 204 });
  } finally { b.cleanup(); }
});

test('cached stage geometry: sticky stage top before, during and after the pin', () => {
  const g = { runwayDocTop: 2500, travel: 4220, stickyTop: 0, stageInPinned: 0, stageLeft: 16, viewH: 844, caption: { dx: 8, dy: 544, width: 310, height: 204 } };
  assert.equal(stageViewportTop(g, 2000), 500, 'before the pin the stage scrolls with the page');
  assert.equal(stageViewportTop(g, 2500), 0);
  assert.equal(stageViewportTop(g, 4600), 0, 'pinned anywhere along the runway');
  assert.equal(stageViewportTop(g, 6720), 0);
  assert.equal(stageViewportTop(g, 7020), -300, 'after release it scrolls away');
  assert.equal(stageViewportTop({ ...g, stickyTop: 40, stageInPinned: 6 }, 3000), 46);
  const disc = { cx: 179, cy: 287, r: 150 };
  assert.deepEqual(globeZoneRects(g, 2000, 844, disc), [
    { left: 45, top: 637, width: 300, height: 300 },
    { left: 24, top: 1044, width: 310, height: 204 }
  ]);
  assert.deepEqual(globeZoneRects(g, 2500 - 844, 844, disc), [], 'stage top exactly at the viewport bottom: off screen');
  assert.deepEqual(globeZoneRects(g, 6720 + 844, 844, disc), [], 'stage bottom exactly at the viewport top: off screen');
  assert.equal(globeZoneRects(g, 6720 + 843, 844, disc).length, 2);
  assert.equal(globeZoneRects({ ...g, caption: null }, 3000, 844, disc).length, 1, 'no caption box, disc only');
});

test('caption hand-off: two cities never overprint (both showing => each <= 0.25) and the caption is never blank', () => {
  // Curve solver matches CSS: linear, and the standard `ease` at its midpoint
  for (const x of [0, 0.25, 0.5, 0.9, 1]) assert.ok(Math.abs(cubicBezierAt(0, 0, 1, 1, x) - x) < 1e-6);
  assert.ok(Math.abs(cubicBezierAt(0.25, 0.1, 0.25, 1, 0.5) - 0.8024) < 1e-3);
  assert.equal(captionInOpacity(0), 0);
  assert.equal(captionInOpacity(CAPTION_IN_MS), 1);
  for (const v of [0.1, 0.25, 0.5, 0.9]) assert.ok(Math.abs(captionInOpacity(captionInTime(v)) - v) < 1e-6);
  const sweep = (plan, step = 0.25) => {
    let floor = 1, below = 0, both = 0, maxBoth = 0;
    for (let t = 0; t <= CAPTION_IN_MS + 200; t += step) {
      const l = captionLeavingAt(plan, t), a = captionArrivingAt(plan, t);
      floor = Math.min(floor, Math.max(l, a));
      if (Math.max(l, a) < 0.5) below += step;
      if (l > CAPTION_GONE && a > CAPTION_GONE) { both += step; maxBoth = Math.max(maxBoth, l, a); }
    }
    return { floor, below, both, maxBoth };
  };
  // A full change (the leaving caption at rest, the arriving one hidden)
  const plan = planCaptionHandoff(1, 0);
  const r = sweep(plan);
  assert.ok(r.maxBoth <= CAPTION_BOTH_MAX + 1e-9, `while both show neither exceeds 0.25 (got ${r.maxBoth.toFixed(3)})`);
  assert.ok(r.both > 0 && r.both < 40, `the faint overlap is brief (${r.both} ms)`);
  assert.ok(r.floor >= 0.19, `never blank: strongest caption floor ${r.floor.toFixed(3)}`);
  assert.ok(r.below <= 90, `below 0.5 only around the cross-over (${r.below} ms)`);
  assert.equal(captionLeavingAt(plan, CAPTION_OUT_MS), 0, 'the leaving caption is gone after CAPTION_OUT_MS');
  // Sampled at 60 fps at any phase, no painted frame drops below ~0.2
  for (let phase = 0; phase < 16.7; phase += 0.5) {
    let f = 1;
    for (let t = phase; t < CAPTION_IN_MS + 200; t += 1000 / 60) f = Math.min(f, Math.max(captionLeavingAt(plan, t), captionArrivingAt(plan, t)));
    assert.ok(f >= 0.195, `frame floor ${f.toFixed(3)} at phase ${phase}`);
  }
  // The arriving entrance is the unchanged 600 ms curve, only started later
  assert.ok(plan.arriveDelayMs > 100 && plan.arriveDelayMs < CAPTION_OUT_MS);
  for (const t of [0, 50, 300, 600]) assert.equal(captionArrivingAt(plan, plan.arriveDelayMs + t), captionInOpacity(t));
  // The old hard cut, for the record: the arriving entrance alone starts from 0
  assert.equal(captionInOpacity(0), 0);
  // Quick reversals and changes caught part-way: same rules from wherever both captions are
  for (const leaving of [0, 0.01, 0.1, 0.25, 0.5, 0.8, 1]) {
    for (const arriving of [0, 0.1, 0.2, 0.24]) {
      const q = sweep(planCaptionHandoff(leaving, arriving));
      assert.ok(q.maxBoth <= CAPTION_BOTH_MAX + 1e-9, `${leaving}->${arriving}: overprint ${q.maxBoth}`);
      // (a caption already at or below CAPTION_GONE was effectively blank before the change)
      if (Math.max(leaving, arriving) > CAPTION_GONE) assert.ok(q.floor >= Math.min(0.19, Math.max(leaving, arriving)) - 1e-9, `${leaving}->${arriving}: floor ${q.floor}`);
    }
  }
  // Reversal onto a caption still clearly showing (it was mid-way out; the other is then at most faint):
  // it continues from where it is and the faint one steps aside at once
  const back = planCaptionHandoff(0.2, 0.7);
  assert.ok(Math.abs(captionArrivingAt(back, 0) - 0.7) < 1e-6);
  assert.equal(back.leave, null);
  // Markup: inactive captions stay hidden and aria-hidden at rest, the entrance class is unchanged,
  // reduced motion bypasses the hand-off (instant swap)
  const src = fs.readFileSync(new URL('./JourneyGlobe.tsx', import.meta.url), 'utf8');
  assert.match(src, /visibility: isCityActive \? 'visible' : 'hidden'/);
  assert.match(src, /isCityActive \? 'globe-caption-in' : 'opacity-0'/);
  assert.match(src, /prefers-reduced-motion: reduce\)'\)\.matches;\s*if \(prev < 0 \|\| prev === activeIdx \|\| reduced/);
});

test('inline translate parsing: only the vertical px offset Magnetic CV writes', () => {
  for (const [v, y] of [[undefined, 0], [null, 0], ['', 0], ['none', 0], ['12px', 0], ['0 -300px', -300], ['0px 412.5px', 412.5], ['0px 0px', 0], ['3px -1e-3px', -0.001], ['0px 50%', 0], ['0px 4px 2px', 4]]) {
    assert.equal(inlineTranslateY(v), y, String(v));
  }
  const g = { runwayDocTop: 0, travel: 1000, stickyTop: 0, stageInPinned: 0, stageLeft: 0, viewH: 800, caption: null };
  assert.equal(globeZoneRects(g, 500, 800, { cx: 100, cy: 100, r: 50 }, -120)[0].top, -70);
  assert.deepEqual(globeZoneRects(g, 500, 800, { cx: 100, cy: 100, r: 50 }, -800), [], 'slid fully out of view');
});
