import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';
import {
  CV_PASSAGE_SELECTOR,
  PASSAGE_SETTLE_MS,
  STAGE_RELEASE_MARGIN,
  WATER_CSS_INTERVAL_MS,
  applyWaterColor,
  globeStageFillsScreen,
  waterAt
} from './oceanWorld.ts';

/** abyssPalette.ts with its one import (the lantern) stubbed, run against `globals` (as journeyMobile.test.mjs does). */
function loadPalette(globals) {
  const source = ts.transpileModule(readFileSync(new URL('./abyssPalette.ts', import.meta.url), 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 }
  }).outputText;
  const context = vm.createContext({ ...globals, exports: {}, require: (name) => { assert.equal(name, './lanternCursor'); return { setLanternDepth() {} }; } });
  vm.runInContext(`(function(exports, require) { ${source}\n})(exports, require);`, context);
  return context.exports;
}

// The water's CSS publisher (oceanWorld.ts): while the Globe's stage is the whole screen the
// colour is written on the stage's own consumers; everywhere else, and the moment the stage
// stops filling the screen, on the document root as before.

const geometry = { journeyStart: 2700, journeyTravel: 4500, maxScroll: 12000, viewHeight: 900 };

test('the stage is alone only between the two ends of its runway, a quarter screen clear of each', () => {
  const margin = STAGE_RELEASE_MARGIN * 900;
  assert.equal(globeStageFillsScreen(2699, geometry), false, 'the cover is still on screen above it');
  // Resting on Doha the cover is one scroll away, already painted just above the screen
  assert.equal(globeStageFillsScreen(2700, geometry), false, 'resting on Doha: the root stays current');
  assert.equal(globeStageFillsScreen(2700 + margin - 1, geometry), false);
  assert.equal(globeStageFillsScreen(2700 + margin, geometry), true, 'the film is under way');
  assert.equal(globeStageFillsScreen(5000, geometry), true, 'mid-film');
  const release = 2700 + 4500 - margin;
  assert.equal(globeStageFillsScreen(release, geometry), true);
  assert.equal(globeStageFillsScreen(release + 1, geometry), false, 'the profile is about to rise');
  assert.equal(globeStageFillsScreen(7200, geometry), false, 'Shanghai, as the stage lets go');
  assert.equal(globeStageFillsScreen(9000, geometry), false, 'the CV');
});

test('the root is current for at least a quarter screen of travel before either neighbour can show', () => {
  // Walking the film both ways: the last position at which the root was written is never more
  // than the margin away from an end, so the copy beyond that end is restyled before it rises
  const margin = STAGE_RELEASE_MARGIN * geometry.viewHeight;
  for (let y = geometry.journeyStart; y <= geometry.journeyStart + geometry.journeyTravel; y += 7) {
    const alone = globeStageFillsScreen(y, geometry);
    const fromTop = y - geometry.journeyStart;
    const fromEnd = geometry.journeyStart + geometry.journeyTravel - y;
    if (alone) assert.ok(fromTop >= margin && fromEnd >= margin, `stage alone too near an end at ${y}`);
  }
});

test('no film, no scope: unmeasured geometry and the reduced-motion runway always use the root', () => {
  assert.equal(globeStageFillsScreen(3000, { ...geometry, journeyStart: Infinity }), false);
  // Reduced motion: the runway is one still screen, so its travel is nil
  assert.equal(globeStageFillsScreen(2700, { ...geometry, journeyTravel: 1 }), false);
  assert.equal(globeStageFillsScreen(3000, { ...geometry, viewHeight: 0 }), false);
  // A runway too short to have a middle never scopes anything
  assert.equal(globeStageFillsScreen(3000, { ...geometry, journeyTravel: 1300 }), false);
});

/** An inline style that records what it holds, like CSSStyleDeclaration for these three calls. */
function fakeStyle(initial = {}) {
  const values = new Map(Object.entries(initial));
  return {
    values,
    writes: 0,
    setProperty(name, value) { this.writes++; values.set(name, value); },
    getPropertyValue(name) { return values.get(name) ?? ''; },
    removeProperty(name) { this.writes++; const old = values.get(name) ?? ''; values.delete(name); return old; }
  };
}
const rgbOf = (depth) => waterAt(depth).map((v) => Math.round(v * 255)).join(', ');

test('the film writes the stage, the root is brought up to date the moment the stage lets go', () => {
  const root = fakeStyle();
  const body = fakeStyle({ 'background-color': 'var(--ocean-background, #FFFFFF)' });
  const runway = fakeStyle();
  const controls = fakeStyle();
  const portfolio = fakeStyle();
  const elements = { '[data-journey-runway]': { style: runway }, '.fixed-top-controls': { style: controls }, '.terminal-portfolio': { style: portfolio } };
  let now = 10_000;
  const realPerformance = Object.getOwnPropertyDescriptor(globalThis, 'performance');
  Object.defineProperty(globalThis, 'performance', { configurable: true, value: { now: () => now } });
  globalThis.document = { documentElement: { style: root }, body: { style: body }, querySelector: (selector) => elements[selector] ?? null };
  try {
    // 1. Arriving above the Globe: the root is written, as it always was
    applyWaterColor(0.1, 0.12, false);
    assert.equal(root.values.get('--abyss-wash'), rgbOf(0.1));
    assert.equal(root.values.get('--abyss-wash-low'), rgbOf(0.12));
    assert.equal(root.values.get('--abyss-halo'), `rgba(${rgbOf(0.1)}, 0.82)`);
    assert.equal(root.values.get('--ocean-background'), `rgb(${rgbOf(0.1)})`);
    assert.equal(runway.values.size, 0);

    // 2. The film: the stage's consumers take the colour, the root is left alone
    const rootWrites = root.writes;
    for (const depth of [0.2, 0.35, 0.5]) {
      now += WATER_CSS_INTERVAL_MS;
      applyWaterColor(depth, depth + 0.02, true);
      assert.equal(runway.values.get('--abyss-wash'), rgbOf(depth));
      assert.equal(runway.values.get('--abyss-wash-low'), rgbOf(depth + 0.02));
      assert.equal(runway.values.get('--abyss-halo'), `rgba(${rgbOf(depth)}, 0.82)`, 'the caption halo follows the water');
      assert.equal(controls.values.get('--abyss-halo'), `rgba(${rgbOf(depth)}, 0.82)`, 'so do the corner controls');
      for (const painted of [root, body, portfolio]) {
        assert.equal(painted.values.get('background-color'), `rgb(${rgbOf(depth)})`, 'the page behind the canvas stays the water');
      }
    }
    assert.equal(root.values.get('--abyss-wash'), rgbOf(0.1), 'the root still holds the colour from before the film');
    assert.equal(root.writes - rootWrites, 3, 'the root took three background colours and no custom property');

    // 3. The same cadence as before: a colour arriving inside the interval is not written at once
    now += 20;
    applyWaterColor(0.55, 0.57, true);
    assert.equal(runway.values.get('--abyss-wash'), rgbOf(0.5));

    // 4. The stage lets go 20 ms later still: no waiting for the interval. The overrides come off
    //    and the root holds the current colour in the same call.
    now += 20;
    applyWaterColor(0.6, 0.62, false);
    assert.equal(root.values.get('--abyss-wash'), rgbOf(0.6));
    assert.equal(root.values.get('--abyss-wash-low'), rgbOf(0.62));
    assert.equal(root.values.get('--abyss-halo'), `rgba(${rgbOf(0.6)}, 0.82)`);
    assert.equal(root.values.get('--ocean-background'), `rgb(${rgbOf(0.6)})`);
    assert.equal(runway.values.size, 0, 'the runway reads the root again');
    assert.equal(controls.values.size, 0);
    assert.equal(portfolio.values.has('background-color'), false);
    assert.equal(root.values.has('background-color'), false);
    assert.equal(body.values.get('background-color'), 'var(--ocean-background, #FFFFFF)', 'the body keeps the declaration it came with');

    // 5. Letting go with the colour the stage already showed still updates the root
    now += WATER_CSS_INTERVAL_MS;
    applyWaterColor(0.7, 0.7, true);
    assert.equal(root.values.get('--abyss-wash'), rgbOf(0.6));
    now += 5;
    applyWaterColor(0.7, 0.7, false);
    assert.equal(root.values.get('--abyss-wash'), rgbOf(0.7));
    assert.equal(runway.values.size, 0);

    // 6. Reversing back into the film and out through the top behaves the same way
    now += WATER_CSS_INTERVAL_MS;
    applyWaterColor(0.3, 0.3, true);
    assert.equal(runway.values.get('--abyss-wash'), rgbOf(0.3));
    now += 1;
    applyWaterColor(0.11, 0.12, false);
    assert.equal(root.values.get('--abyss-wash'), rgbOf(0.11));
    assert.equal(runway.values.size, 0);

    // 7. Without a runway to carry it, the colour goes to the root whatever the caller says
    delete elements['[data-journey-runway]'];
    now += WATER_CSS_INTERVAL_MS;
    applyWaterColor(0.4, 0.4, true);
    assert.equal(root.values.get('--abyss-wash'), rgbOf(0.4));
    assert.equal(controls.values.size, 0);
  } finally {
    delete globalThis.document;
    if (realPerformance) Object.defineProperty(globalThis, 'performance', realPerformance);
  }
});

// ---- The palette follows the same scope (abyssPalette.ts) ------------------------------------

/** A declaration block as a stylesheet rule holds it (length / item / getPropertyValue). */
function fakeDeclarations(entries) {
  const names = Object.keys(entries);
  return { length: names.length, item: (i) => names[i], getPropertyValue: (n) => entries[n] ?? '' };
}

test('while the stage is the whole screen the palette is written on the stage, the root takes it as the stage lets go', () => {
  const root = fakeStyle();
  const runway = fakeStyle();
  const controls = fakeStyle();
  const gauge = fakeStyle({ '--glass-bg': 'kept' });
  const elements = { '[data-journey-runway]': { style: runway }, '.fixed-top-controls': { style: controls }, '.depth-gauge': { style: gauge } };
  const derived = 'calc(300 - 26 * var(--ink-light, 0))';
  const document = {
    documentElement: { style: root },
    querySelector: (selector) => elements[selector] ?? null,
    styleSheets: [{ cssRules: [{ selectorText: ':root', style: fakeDeclarations({ '--display-weight': derived, '--font-mono': 'IBM Plex Mono', '--tracking-body': 'calc(-0.004em + 0.01em * var(--ink-light, 0))' }) }] }]
  };
  const { abyssPaletteEntries, abyssPaletteScoped, applyAbyssPalette, PALETTE_SCOPE_SELECTORS } = loadPalette({ document });
  {
    assert.deepEqual([...PALETTE_SCOPE_SELECTORS.slice(0, 2)], ['[data-journey-runway]', '.fixed-top-controls']);
    // 1. Above the Globe: the root, as always
    applyAbyssPalette(0, false);
    assert.equal(root.values.get('--ink-light'), '0.000');
    assert.equal(runway.values.size, 0);
    // 2. The ink flips mid-film: the stage and the chrome over it take every value, the root none
    const rootWrites = root.writes;
    applyAbyssPalette(0.6, true);
    assert.equal(abyssPaletteScoped(), true);
    assert.equal(root.writes, rootWrites, 'no whole-document restyle while the stage owns the screen');
    for (const target of [runway, controls, gauge]) {
      for (const [name, value] of abyssPaletteEntries(0.6)) assert.equal(target.values.get(name), value, name);
      // A :root property computed from the palette resolves where it is declared: re-declared here
      assert.equal(target.values.get('--display-weight'), derived);
      assert.ok(target.values.get('--tracking-body').includes('var(--ink-light'));
      assert.equal(target.values.has('--font-mono'), false, 'only what reads the palette');
    }
    // 3. The stage lets go: overrides off, the root current, in the same call
    applyAbyssPalette(0.6, false);
    assert.equal(abyssPaletteScoped(), false);
    for (const [name, value] of abyssPaletteEntries(0.6)) assert.equal(root.values.get(name), value, name);
    assert.equal(runway.values.size, 0);
    assert.equal(controls.values.size, 0);
    assert.equal(gauge.values.get('--glass-bg'), 'kept', 'what an element held before is given back');
    assert.equal(gauge.values.size, 1);
    // 4. No runway, no scope: the root, whatever the caller says
    delete elements['[data-journey-runway]'];
    applyAbyssPalette(1, true);
    assert.equal(root.values.get('--ink-light'), '1.000');
    assert.equal(controls.values.size, 0);
    assert.equal(abyssPaletteScoped(), false);
  }
});

test('a scoped target inside the legible copy re-declares its ink colour; the chrome outside keeps its own', () => {
  const root = fakeStyle();
  const runway = fakeStyle();
  const controls = fakeStyle({ color: 'chrome' });
  const gauge = fakeStyle();
  // The runway sits inside <main class="ocean-legible">; the fixed controls and the gauge do not
  const inside = (yes) => (selector) => (selector === '.ocean-legible' && yes ? {} : null);
  const elements = {
    '[data-journey-runway]': { style: runway, closest: inside(true) },
    '.fixed-top-controls': { style: controls, closest: inside(false) },
    '.depth-gauge': { style: gauge, closest: inside(false) }
  };
  const document = { documentElement: { style: root }, querySelector: (s) => elements[s] ?? null, styleSheets: [] };
  const { applyAbyssPalette, abyssPaletteEntries, PALETTE_SCOPE_INK } = loadPalette({ document });
  applyAbyssPalette(0, false);
  applyAbyssPalette(1, true);
  // Inherited colour (and currentColor) inside the stage resolve against the stage's own ink
  assert.equal(PALETTE_SCOPE_INK, 'var(--ink-171717)');
  assert.equal(runway.values.get('color'), PALETTE_SCOPE_INK);
  assert.equal(runway.values.get('--ink-171717'), Object.fromEntries(abyssPaletteEntries(1))['--ink-171717']);
  assert.equal(controls.values.get('color'), 'chrome', 'outside the legible copy nothing changes its colour');
  assert.equal(gauge.values.has('color'), false);
  // Released with the scope: the runway inherits from the root again
  applyAbyssPalette(1, false);
  assert.equal(runway.values.has('color'), false);
  assert.equal(runway.values.size, 0);
  assert.equal(controls.values.get('color'), 'chrome');
  // The CSS side of the contract: the legible copy's colour is that same ink variable
  assert.ok(/\.ocean-legible \{ color: var\(--ink-171717\); \}/.test(readFileSync(new URL('./abyssPalette.ts', import.meta.url), 'utf8').replace(/\$\{scope\}/g, '.ocean-legible')));
});

test('releasing the palette gives the stage back and leaves the root on the ink the screen showed', () => {
  const root = fakeStyle();
  const runway = fakeStyle({ '--ink-light': 'held-before' });
  const elements = { '[data-journey-runway]': { style: runway, closest: () => ({}) } };
  const document = { documentElement: { style: root }, querySelector: (s) => elements[s] ?? null, styleSheets: [] };
  const { applyAbyssPalette, abyssPaletteScoped, abyssPaletteEntries, releaseAbyssPalette } = loadPalette({ document });
  // Not scoped: release is a no-op (no root write)
  applyAbyssPalette(0, false);
  const before = root.writes;
  releaseAbyssPalette();
  assert.equal(root.writes, before);
  // Scoped at 0.8, then the writer unmounts
  applyAbyssPalette(0.8, true);
  assert.equal(abyssPaletteScoped(), true);
  releaseAbyssPalette();
  assert.equal(abyssPaletteScoped(), false);
  assert.equal(runway.values.get('--ink-light'), 'held-before');
  assert.equal(runway.values.size, 1);
  for (const [name, value] of abyssPaletteEntries(0.8)) assert.equal(root.values.get(name), value, name);
  // And the ocean layer calls it on unmount
  const src = readFileSync(new URL('./AsciiWhaleBackground.tsx', import.meta.url), 'utf8');
  const cleanup = src.slice(src.lastIndexOf('return () => {'), src.indexOf('}, [mode]);'));
  assert.ok(/releaseAbyssPalette\(\);/.test(cleanup));
});

test('an unmeasured Globe gets a bounded number of retry frames, never a display-rate loop', () => {
  const src = readFileSync(new URL('./AsciiWhaleBackground.tsx', import.meta.url), 'utf8');
  const cap = Number(src.match(/const UNMEASURED_RETRY_FRAMES = (\d+);/)?.[1]);
  assert.ok(cap > 0 && cap <= 600, `cap ${cap}`);
  // Simulate the water's frame logic: geometry never measures
  const geometry = { start: Infinity };
  let scheduled = 0;
  let unmeasuredFrames = 0;
  const update = () => {
    if (Number.isFinite(geometry.start)) unmeasuredFrames = 0;
    else if (unmeasuredFrames < cap) { unmeasuredFrames++; scheduled++; }
  };
  const body = src.slice(src.indexOf('const updateWater'), src.indexOf('const scheduleWater'));
  assert.ok(body.includes('if (Number.isFinite(globeScrollGeometry.start)) unmeasuredFrames = 0;'));
  // The first frame comes from mount; each later one only if the frame before scheduled it
  let frames = 0;
  for (let pending = true; pending && frames < cap * 4; frames++) { const s = scheduled; update(); pending = scheduled > s; }
  assert.equal(scheduled, cap, 'the self-retry stops at the cap');
  assert.equal(frames, cap + 1);
  // Once it measures, the counter is spent no further and nothing more is scheduled by itself
  geometry.start = 2700;
  update();
  assert.equal(scheduled, cap);
  assert.equal(unmeasuredFrames, 0);
  // Scroll and resize still schedule the water (outside the retry budget)
  assert.ok(/window\.addEventListener\('scroll', scheduleWater/.test(src));
  assert.ok(/new ResizeObserver\(handleResize\)/.test(src));
});

test('a Magnetic CV passage holds the water off the root until it lands', async () => {
  const root = fakeStyle();
  const body = fakeStyle();
  const runway = fakeStyle();
  const controls = fakeStyle();
  const portfolio = fakeStyle();
  const elements = { '[data-journey-runway]': { style: runway }, '.fixed-top-controls': { style: controls }, '.terminal-portfolio': { style: portfolio } };
  let now = 1_000_000;
  const realPerformance = Object.getOwnPropertyDescriptor(globalThis, 'performance');
  Object.defineProperty(globalThis, 'performance', { configurable: true, value: { now: () => now } });
  globalThis.document = { documentElement: { style: root }, body: { style: body }, querySelector: (selector) => elements[selector] ?? null };
  const passage = (on) => { if (on) elements[CV_PASSAGE_SELECTOR] = {}; else delete elements[CV_PASSAGE_SELECTOR]; };
  try {
    // 1. At rest in the CV: the root, as always
    applyWaterColor(0.8, 0.82, false);
    assert.equal(root.values.get('--abyss-wash'), rgbOf(0.8));
    // 2. In flight: the page behind the canvas and the chrome follow, the root's properties do not
    passage(true);
    now += WATER_CSS_INTERVAL_MS;
    const rootWrites = root.writes;
    applyWaterColor(0.85, 0.86, false);
    assert.equal(root.values.get('--abyss-wash'), rgbOf(0.8), 'no whole-document restyle mid-passage');
    assert.equal(controls.values.get('--abyss-halo'), `rgba(${rgbOf(0.85)}, 0.82)`);
    assert.equal(root.values.get('background-color'), `rgb(${rgbOf(0.85)})`);
    assert.equal(root.writes - rootWrites, 1, 'the root took its background colour only');
    // 3. It lands: the next call brings the root up to date at once
    passage(false);
    now += 20;
    applyWaterColor(0.86, 0.87, false);
    assert.equal(root.values.get('--abyss-wash'), rgbOf(0.86));
    assert.equal(root.values.get('--abyss-wash-low'), rgbOf(0.87));
    assert.equal(runway.values.size, 0);
    assert.equal(root.values.has('background-color'), false);
    // 4. And if nothing calls again after it lands, the root is still current within the settle time
    passage(true);
    now += WATER_CSS_INTERVAL_MS;
    applyWaterColor(0.9, 0.9, false);
    assert.equal(root.values.get('--abyss-wash'), rgbOf(0.86));
    passage(false);
    await new Promise((resolve) => setTimeout(resolve, PASSAGE_SETTLE_MS * 2 + 40));
    assert.equal(root.values.get('--abyss-wash'), rgbOf(0.9));
    assert.equal(runway.values.size, 0);
  } finally {
    delete globalThis.document;
    if (realPerformance) Object.defineProperty(globalThis, 'performance', realPerformance);
  }
});

test('the ocean layer runs no loop of its own: the water follows scroll and resize, the 2D canvases only a ping', () => {
  const src = readFileSync(new URL('./AsciiWhaleBackground.tsx', import.meta.url), 'utf8');
  const rafs = src.match(/requestAnimationFrame\((\w+)\)/g) ?? [];
  // One coalesced update for the water, and the ping's own frames
  assert.deepEqual([...new Set(rafs)].sort(), ['requestAnimationFrame(drawPings)', 'requestAnimationFrame(updateWater)']);
  // The water's update never schedules itself, except while the Globe has not yet measured
  const update = src.slice(src.indexOf('const updateWater'), src.indexOf('const scheduleWater'));
  assert.ok(!/requestAnimationFrame/.test(update));
  assert.ok(/else if \(unmeasuredFrames < UNMEASURED_RETRY_FRAMES\) \{ unmeasuredFrames\+\+; scheduleWater\(\); \}/.test(update));
  // The ping loop stops (and gives its canvases back) the frame its last ping has gone
  const pings = src.slice(src.indexOf('const drawPings'), src.indexOf('pingRaf = requestAnimationFrame(drawPings)'));
  assert.ok(/if \(!pings\.length\) \{\s*releaseCanvases\(\);\s*return;\s*\}/.test(pings));
  // No backing store until a ping: both canvases start empty
  assert.equal((src.match(/data-ocean-life width=\{0\} height=\{0\}/g) ?? []).length, 2);
  assert.ok(!/getContext\('webgl/.test(src), 'no second WebGL whale engine');
});
