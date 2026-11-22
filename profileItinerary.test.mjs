import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { profileCityStops } from './profileCityStops.ts';
import {
  ASCII_HOLD_DURATION,
  MEMORY_DURATION,
  MEMORY_INSPECT_QUERY,
  MEMORY_RETURN_DURATION,
  WAVE1_DURATION,
  WAVE2_DURATION,
  canInspectMemory,
  nextMemoryInspection,
  sampleMemory
} from './profileMemoryTimeline.ts';
import {
  computeNaturalPhotoSize,
  computePlateGrid,
  memoryLanding
} from './profileMemoryPlate.ts';

test('one reveal gesture stays at the Profile anchor', () => {
  assert.deepEqual(profileCityStops(100, 100, 1200), [100, 100]);
});

test('only summary reading stops follow the pinned reveal on short screens', () => {
  const stops = profileCityStops(100, 1560, 480);
  assert.deepEqual(stops.slice(0, 2), [100, 100]);
  assert.equal(stops.at(-1), 1560);
  assert.ok(stops.slice(2).every((y, i) => y > stops[i + 1] && y - stops[i + 1] <= 0.76 * 480 + 1));
});

test('two-wave whale-to-memory timeline forms all 8 ASCII images, holds briefly, then reveals all 8 real photos in ~5–6.5s', () => {
  assert.ok(WAVE1_DURATION >= 2500 && WAVE1_DURATION <= 3200, `wave1 ${WAVE1_DURATION}ms`);
  assert.ok(ASCII_HOLD_DURATION >= 250 && ASCII_HOLD_DURATION <= 400, `hold ${ASCII_HOLD_DURATION}ms`);
  assert.ok(WAVE2_DURATION >= 2200 && WAVE2_DURATION <= 3000, `wave2 ${WAVE2_DURATION}ms`);
  assert.ok(MEMORY_DURATION >= 5000 && MEMORY_DURATION <= 6500, `total ${MEMORY_DURATION}ms`);
  assert.ok(MEMORY_RETURN_DURATION >= 1800 && MEMORY_RETURN_DURATION < MEMORY_DURATION);

  const waves = [];
  const wave1Cities = [];
  const wave2Cities = [];
  let holdSamples = 0;
  let prevConsumed = -1;
  const wave2ColorCounts = Array(8).fill(0);

  for (let i = 0; i <= 1000; i++) {
    const s = sampleMemory(i / 1000);
    if (!waves.length || waves.at(-1) !== s.wave) waves.push(s.wave);
    assert.ok(s.consumed >= prevConsumed - 1e-9, `monotonic consumption at ${i}`);
    prevConsumed = s.consumed;
    assert.equal(s.slots.length, 8);

    if (s.wave === 'wave1') {
      if (!wave1Cities.length || wave1Cities.at(-1) !== s.city) wave1Cities.push(s.city);
      // Zero real photos may reveal during Wave 1; previously built ASCII cities stay visible.
      for (let c = 0; c < 8; c++) {
        assert.equal(s.slots[c].color, 0, `no real photo color during Wave 1 for city ${c}`);
        if (c < s.city) assert.equal(s.slots[c].assembled, 1, `completed ASCII city ${c} remains visible`);
        if (c > s.city) assert.equal(s.slots[c].assembled, 0, `future city ${c} stays invisible`);
      }
    } else if (s.wave === 'hold') {
      holdSamples++;
      assert.equal(s.consumed, 8, 'whales fully dissolved by collective ASCII hold');
      assert.equal(s.transferring, false, 'no flying glyphs during hold');
      for (let c = 0; c < 8; c++) {
        assert.equal(s.slots[c].assembled, 1, `city ${c} complete ASCII during hold`);
        assert.equal(s.slots[c].color, 0, `city ${c} still pure ASCII during hold`);
      }
    } else {
      if (!wave2Cities.length || wave2Cities.at(-1) !== s.city) wave2Cities.push(s.city);
      assert.equal(s.consumed, 8, 'whales remain dissolved during Wave 2');
      assert.equal(s.transferring, false, 'no flying glyphs during Wave 2');
      for (let c = 0; c < 8; c++) {
        assert.equal(s.slots[c].assembled, 1, `city ${c} assembled during Wave 2`);
        if (c < s.city) assert.equal(s.slots[c].color, 1, `revealed real photo ${c} stays visible`);
        if (c > s.city) assert.equal(s.slots[c].color, 0, `upcoming city ${c} holds ASCII until its turn`);
      }
      if (s.slots[s.city].color > 0 && s.slots[s.city].color < 1) {
        wave2ColorCounts[s.city]++;
      }
    }
  }

  assert.deepEqual(waves, ['wave1', 'hold', 'wave2']);
  assert.deepEqual(wave1Cities, [0, 1, 2, 3, 4, 5, 6, 7]);
  assert.deepEqual(wave2Cities, [0, 1, 2, 3, 4, 5, 6, 7]);
  assert.ok(holdSamples >= 35, `collective ASCII hold sampled ${holdSamples} times`);
  assert.ok(wave2ColorCounts.every(n => n >= 25), `every city morphs smoothly in Wave 2: ${wave2ColorCounts}`);

  const start = sampleMemory(0);
  assert.equal(start.consumed, 0);
  assert.ok(start.slots.every(slot => slot.assembled === 0 && slot.color === 0));

  const end = sampleMemory(1);
  assert.equal(end.consumed, 8);
  assert.ok(end.slots.every(slot => slot.assembled === 1 && slot.color === 1));

  for (const frac of [0, 0.125, 0.5, 0.875, 1]) {
    const pt = memoryLanding(frac);
    assert.ok(pt.x > 0 && pt.x < 1 && pt.y > 0 && pt.y < 1);
  }
});

test('natural aspect-ratio sizing and ASCII grid preserve intrinsic proportions without cropping or overflow', () => {
  const proportions = [
    [1920, 1080], // 16:9 landscape
    [1500, 1000], // 3:2 landscape
    [1200, 900],  // 4:3 landscape
    [480, 480],   // 1:1 square
    [900, 1200],  // 3:4 portrait
    [1000, 1500], // 2:3 portrait
    [1080, 1920], // 9:16 portrait
    [2350, 1000], // 2.35:1 panoramic
    [700, 910]    // unusual portrait
  ];

  for (const [nw, nh] of proportions) {
    const ar = nw / nh;
    for (const [maxW, maxH, scale] of [[186, 166, 0.98], [150, 130, 0.94], [76, 92, 1.0]]) {
      const { width, height } = computeNaturalPhotoSize(nw, nh, maxW, maxH, scale, 0.72);
      assert.ok(Math.abs(width / height - ar) < 1e-6, `aspect preserved for ${nw}x${nh}: ${width / height} vs ${ar}`);
      assert.ok(width <= maxW * scale + 1e-6, `width fits safe anchor (${width} <= ${maxW * scale})`);
      assert.ok(height <= maxH * scale + 1e-6, `height fits safe anchor (${height} <= ${maxH * scale})`);
      assert.ok(width >= 15 && height >= 15, `usable visible size for ${nw}x${nh}`);
    }

    const grid = computePlateGrid(nw, nh);
    assert.ok(Math.abs(grid.canvasW / grid.canvasH - ar) < 0.03, `canvas matches natural aspect for ${nw}x${nh}`);
    assert.ok(grid.cols >= 18 && grid.rows >= 14, `detailed ASCII grid ${grid.cols}x${grid.rows}`);
  }
});

test('Profile eight-city editorial spread enforces exact cities, zero frames/connectors, natural contain fit, and isolation', () => {
  const itinerarySrc = readFileSync(new URL('./ProfileItinerary.tsx', import.meta.url), 'utf8');
  const cssSrc = readFileSync(new URL('./profileItinerary.css', import.meta.url), 'utf8');
  const entrySrc = readFileSync(new URL('./OceanEntry.tsx', import.meta.url), 'utf8');
  const cvDataSrc = readFileSync(new URL('./cvData.ts', import.meta.url), 'utf8');
  const appSrc = readFileSync(new URL('./xavier_h_ry_editorial_portfolio.tsx', import.meta.url), 'utf8');

  assert.match(
    cvDataSrc,
    /heroIntroConcise:\s*'Like the whale migrating across oceans without borders, my journey has been shaped by constant movement\.'/
  );

  const expectedCities = [
    ['doha', 'Doha'],
    ['paris', 'Paris'],
    ['jakarta', 'Jakarta'],
    ['moscow', 'Moscow'],
    ['singapore', 'Singapore'],
    ['pau', 'Pau'],
    ['bordeaux', 'Bordeaux'],
    ['shanghai', 'Shanghai']
  ];

  const foundPairs = [...itinerarySrc.matchAll(/id:\s*'([^']+)',\s*city:\s*'([^']+)'/g)].map(
    ([, id, city]) => [id, city]
  );
  assert.deepEqual(foundPairs, expectedCities);

  for (const [id] of expectedCities) {
    assert.ok(itinerarySrc.includes(`photoSrc: '/profile-memories/${id}.webp'`));
    const asset = readFileSync(new URL(`./public/profile-memories/${id}.webp`, import.meta.url));
    assert.equal(asset.toString('ascii', 8, 12), 'WEBP');
  }
  assert.match(itinerarySrc, /alt=\{slot.alt\}/);
  assert.match(itinerarySrc, /className="profile-memory-etching"[^>]*aria-hidden="true"/);

  // Zero empty placeholder frames, decorative chrome, or connecting lines.
  for (const forbiddenMarkup of ['profile-city-ghost', 'profile-city-outer-mark', 'profile-city-placeholder', 'EN TRAVAUX', 'PlateTexture']) {
    assert.equal(itinerarySrc.includes(forbiddenMarkup), false, `ProfileItinerary.tsx must not render ${forbiddenMarkup}`);
  }
  for (const forbiddenCss of ['.profile-city-name::after', 'object-fit: cover', 'aspect-ratio: 1', '.profile-city-ghost', '.profile-city-outer-mark', '.profile-city-corners']) {
    assert.equal(cssSrc.includes(forbiddenCss), false, `profileItinerary.css must not include ${forbiddenCss}`);
  }
  assert.match(cssSrc, /object-fit:\s*contain/);
  assert.match(itinerarySrc, /lane:\s*'a'/);
  assert.match(itinerarySrc, /lane:\s*'b'/);

  // Mounted exclusively in Profile (OceanEntry.tsx), never in other CV sections.
  assert.equal((entrySrc.match(/<ProfileItinerary\b/g) ?? []).length, 1);
  assert.equal((appSrc.match(/<ProfileItinerary\b/g) ?? []).length, 0);

  // CSS strictly scoped to Profile (#introduction), never targeting other sections.
  for (const forbidden of ['#experience', '#education', '#skills', '#languages', '#interests', '#contact']) {
    assert.equal(cssSrc.includes(forbidden), false, `profileItinerary.css must not target ${forbidden}`);
  }
});

test('step-0 cue follows the reveal state: shown only while the plates wait, never under reduced motion, no timer', () => {
  const itinerarySrc = readFileSync(new URL('./ProfileItinerary.tsx', import.meta.url), 'utf8');
  const cssSrc = readFileSync(new URL('./profileItinerary.css', import.meta.url), 'utf8').replace(/\r\n/g, '\n');

  // One quiet mono line with the approved wording, kept out of the accessibility tree
  assert.match(itinerarySrc, /<p className="profile-memory-cue meta" aria-hidden="true">Scroll once to surface memories<\/p>/);
  assert.equal((itinerarySrc.match(/Scroll once to surface memories/g) ?? []).length, 1);
  // State-driven, never time-driven
  assert.doesNotMatch(itinerarySrc, /setTimeout|setInterval/);

  const rule = (selector) => {
    const at = cssSrc.indexOf(selector + ' {');
    assert.ok(at >= 0, `missing rule ${selector}`);
    return cssSrc.slice(at, cssSrc.indexOf('}', at));
  };
  // Hidden by default (revealing, restoring, revealed, or no Magnetic CV at all)
  const base = rule('.terminal-portfolio #introduction .profile-memory-cue');
  assert.match(base, /opacity: 0;/);
  assert.match(base, /visibility: hidden;/);
  assert.match(base, /pointer-events: none;/);
  // Shown only on the active Profile while data-plates="waiting"
  const shown = rule('html[data-profile-steps] .terminal-portfolio #introduction .profile-itinerary[data-plates="waiting"] ~ .profile-memory-cue');
  assert.match(shown, /visibility: visible;/);
  assert.equal((cssSrc.match(/~ \.profile-memory-cue/g) ?? []).length, 1, 'no other state shows the cue');
  // Never under reduced motion (the photographs are already there)
  const reduced = cssSrc.slice(cssSrc.indexOf('@media (prefers-reduced-motion: reduce)'));
  assert.match(reduced, /\.terminal-portfolio #introduction \.profile-memory-cue \{\s*display: none;/);
});

test('mobile photo inspection opens only after the reveal, only on narrow screens, and always closes', () => {
  assert.equal(MEMORY_INSPECT_QUERY, '(max-width: 850px)');

  for (const plates of [undefined, 'waiting', 'revealing', 'restoring']) {
    assert.equal(canInspectMemory(plates, true), false, `no inspection while ${plates}`);
    assert.equal(nextMemoryInspection(null, { type: 'open', id: 'moscow', plates, narrow: true }), null);
  }
  assert.equal(canInspectMemory('revealed', false), false, 'never on wide screens');
  assert.equal(nextMemoryInspection(null, { type: 'open', id: 'moscow', plates: 'revealed', narrow: false }), null);

  assert.equal(canInspectMemory('revealed', true), true);
  assert.equal(nextMemoryInspection(null, { type: 'open', id: 'moscow', plates: 'revealed', narrow: true }), 'moscow');
  assert.equal(nextMemoryInspection('moscow', { type: 'open', id: 'doha', plates: 'revealed', narrow: true }), 'doha');
  // A refused open leaves the current photograph as it is
  assert.equal(nextMemoryInspection('doha', { type: 'open', id: 'pau', plates: 'restoring', narrow: true }), 'doha');
  assert.equal(nextMemoryInspection('doha', { type: 'close' }), null);
  assert.equal(nextMemoryInspection(null, { type: 'close' }), null);
});

test('inspection markup: invisible row targets on narrow screens only, a borderless modal plate the Magnetic CV ignores', () => {
  const itinerarySrc = readFileSync(new URL('./ProfileItinerary.tsx', import.meta.url), 'utf8');
  const cssSrc = readFileSync(new URL('./profileItinerary.css', import.meta.url), 'utf8').replace(/\r\n/g, '\n');
  const magneticSrc = readFileSync(new URL('./magneticCV.ts', import.meta.url), 'utf8');

  // Row targets do not exist on wide screens or before the reveal
  assert.match(cssSrc, /\.profile-city-inspect \{\s*display: none;\s*\}/);
  assert.match(cssSrc, /@media \(max-width: 850px\) \{\s*\.profile-itinerary\[data-plates="revealed"\] \.profile-city-inspect \{/);
  // The open plate is an aria-modal dialog: magneticCV's ignoreTarget() drops wheel, key and touch
  // input while one is shown, and the layer stops its touches from bubbling any further
  assert.match(itinerarySrc, /role="dialog"\s+aria-modal="true"/);
  assert.match(magneticSrc, /\[aria-modal="true"\]/);
  assert.match(itinerarySrc, /addEventListener\('touchmove', still, \{ passive: false \}\)/);
  assert.match(itinerarySrc, /focus\(\{ preventScroll: true \}\)/);
  // Uncropped photograph with its city and years, no frame or panel
  const plate = cssSrc.slice(cssSrc.indexOf('.profile-memory-inspect-plate img {'));
  assert.match(plate, /max-width: 100%;/);
  assert.doesNotMatch(cssSrc.slice(cssSrc.indexOf('.profile-memory-inspect {')), /border: 1px|border-radius: [1-9]|object-fit: cover/);
  assert.match(itinerarySrc, /CV_DATA\.locations\.map\(\(location\) => \[location\.id, location\.period\]\)/);
});

test('history navigation closes the photo plate without pulling focus (and the page) back to Profile', () => {
  const itinerarySrc = readFileSync(new URL('./ProfileItinerary.tsx', import.meta.url), 'utf8');
  // Back/forward or a hash change moves the Magnetic CV under the dialog: it must close
  assert.match(itinerarySrc, /addEventListener\('popstate', onHistory\)/);
  assert.match(itinerarySrc, /addEventListener\('hashchange', onHistory\)/);
  assert.match(itinerarySrc, /removeEventListener\('popstate', onHistory\)/);
  assert.match(itinerarySrc, /removeEventListener\('hashchange', onHistory\)/);
  // ...without handing focus back to the Profile row (magneticCV follows focus to its chapter)
  assert.match(itinerarySrc, /const onHistory = \(\) => onClose\(false\)/);
  assert.match(itinerarySrc, /if \(restoreFocus && trigger\?\.isConnected\)/);
});
