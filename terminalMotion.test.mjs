import test from 'node:test';
import assert from 'node:assert/strict';
import {
  ASCII_GLYPHS,
  VIEWPORT_ZONES,
  decodeWord,
  wordProgress,
  wordOpacity,
  lineProgress,
  waterShade,
  orbitStages,
  ORBIT_SPIN
} from './terminalMotion.ts';

test('reading zone is expanded to 22%–78% of viewport with 100% stable readable text', () => {
  for (const viewport of [600, 800, 1000, 1200]) {
    // 0–10%: text is invisible (p = 0, opacity = 0)
    assert.equal(wordProgress(viewport * 0.05, 20, viewport, 0, 1), 0);
    assert.equal(wordProgress(viewport * 0.09, 20, viewport, 0, 1), 0);
    assert.equal(wordOpacity(0), 0);

    // 10–22%: outgoing ASCII scramble transition zone
    const pExit = wordProgress(viewport * 0.16, 20, viewport, 0, 1);
    assert.ok(pExit > 0 && pExit < 1, `Expected exit transition at 16%, got ${pExit}`);

    // 22–78%: comfortable central reading zone (fully readable, stable, opacity = 1)
    for (const frac of [0.25, 0.35, 0.50, 0.65, 0.75]) {
      const top = viewport * frac;
      const p = wordProgress(top, 20, viewport, 0, 1);
      assert.equal(p, 1, `Expected fully readable text at ${frac * 100}%, got ${p}`);
      assert.equal(decodeWord('International', p, 42), 'International');
      assert.equal(wordOpacity(p), 1);
    }

    // 78–90%: incoming ASCII decoding transition zone
    const pEntry = wordProgress(viewport * 0.84, 20, viewport, 0, 1);
    assert.ok(pEntry > 0 && pEntry < 1, `Expected entry transition at 84%, got ${pEntry}`);

    // 90–100%: invisible (p = 0, opacity = 0)
    assert.equal(wordProgress(viewport * 0.92, 20, viewport, 0, 1), 0);
    assert.equal(wordProgress(viewport * 0.98, 20, viewport, 0, 1), 0);
  }
});

test('subtle stagger allows sentences to resolve almost together without reading delays', () => {
  const viewport = 1000;
  // Position line inside entry zone at 84% viewport height
  const top = viewport * 0.84;
  const height = 20;

  const w0 = wordProgress(top, height, viewport, 0, 3);
  const w1 = wordProgress(top, height, viewport, 1, 3);
  const w2 = wordProgress(top, height, viewport, 2, 3);

  // Subtle stagger: Word 0 resolves slightly ahead of Word 1 and Word 2
  assert.ok(w0 > w1, `Expected w0 (${w0}) > w1 (${w1})`);
  assert.ok(w1 > w2, `Expected w1 (${w1}) > w2 (${w2})`);

  // Max difference between first and last word on the line is very subtle (<= 0.15 in progress)
  assert.ok(w0 - w2 <= 0.15, `Expected subtle stagger between words, got delta ${w0 - w2}`);

  // In the reading zone (e.g. 50%), all words on the line are fully stable and readable
  const centerTop = viewport * 0.50;
  assert.equal(wordProgress(centerTop, height, viewport, 0, 3), 1);
  assert.equal(wordProgress(centerTop, height, viewport, 1, 3), 1);
  assert.equal(wordProgress(centerTop, height, viewport, 2, 3), 1);
});

test('letters lock in early: fully resolved by 70% progress, calm 14 scroll bands', () => {
  const word = 'Business';

  // At progress 0: invisible
  assert.equal(decodeWord(word, 0, 42).trim(), '');

  // At progress 0.50: majority of letters are already resolved into real letters
  const mid = decodeWord(word, 0.50, 42);
  let resolvedCount = 0;
  for (let i = 0; i < word.length; i++) {
    if (mid[i] === word[i]) resolvedCount++;
  }
  assert.ok(resolvedCount >= Math.floor(word.length * 0.5), `Expected at least half letters resolved at 50%, got ${resolvedCount}/${word.length}`);

  // At progress 0.70 and above: word is 100% fully resolved into normal text!
  for (let p = 0.70; p <= 1.0; p += 0.05) {
    assert.equal(decodeWord(word, p, 42), word);
  }

  // Reverse scrolling produces identical deterministic states
  const samples = Array.from({ length: 141 }, (_, i) => i / 140);
  const forward = samples.map(p => decodeWord(word, p, 99));
  const backward = [...samples].reverse().map(p => decodeWord(word, p, 99)).reverse();
  assert.deepEqual(forward, backward);
});

test('restrained opacity: subtle low-contrast entry climbing smoothly to 1.0 by progress 0.70', () => {
  // Completely off-screen: 0
  assert.equal(wordOpacity(0), 0);

  // Entry: subtle and restrained (around 0.28 - 0.40)
  assert.ok(wordOpacity(0.05) >= 0.28 && wordOpacity(0.05) <= 0.40);

  // Smooth increase
  assert.ok(wordOpacity(0.35) > wordOpacity(0.15));

  // Full opacity reached by 0.70
  assert.equal(wordOpacity(0.70), 1);
  assert.equal(wordOpacity(0.85), 1);
  assert.equal(wordOpacity(1.0), 1);
});

test('background remains white before the globe and black after its exact end', () => {
  const start = 3000, travel = 4500, viewport = 900;
  for (let y = 0; y <= start; y += 10) assert.equal(waterShade(y, start, travel, viewport), 255);
  assert.equal(waterShade(start, start, travel, viewport), 255);
  assert.equal(waterShade(start + travel, start, travel, viewport), 0);
  assert.equal(waterShade(start + travel + viewport, start, travel, viewport), 0);
  let previous = 255;
  for (let y = start; y <= start + travel; y += 10) {
    const shade = waterShade(y, start, travel, viewport);
    assert.ok(shade <= previous);
    previous = shade;
  }
});

test('whale-to-globe prelude: deterministic, reversible and fully formed at the handoff', () => {
  const start = orbitStages(0);
  assert.equal(start.converge, 0);
  assert.equal(start.dissolve, 0);
  assert.equal(start.sphere, 0);
  assert.equal(start.globeDisc, 0);
  assert.equal(start.globeMarks, 0);
  assert.equal(start.ascii, 1);

  // The handoff frame is exactly the globe's own first frame: no spin left, nothing ASCII
  const end = orbitStages(1);
  for (const key of ['converge', 'dissolve', 'globeGrid', 'globeLand', 'globeDisc', 'globeMarks', 'caption']) {
    assert.equal(end[key], 1, key);
  }
  assert.equal(end.ascii, 0);
  assert.equal(end.spin, 0);

  // Storyboard order: the sphere is legible before the whales are gone, the planet after
  assert.equal(orbitStages(0.2).converge, 1);
  assert.ok(orbitStages(0.66).sphere === 1 && orbitStages(0.66).dissolve < 0.05);
  assert.ok(orbitStages(0.7).globeDisc === 0);
  assert.equal(orbitStages(0.88).dissolve, 1);
  assert.equal(orbitStages(0.9).globeMarks, 0);

  // Same t, same state — scrolling back replays the exact frames
  const samples = Array.from({ length: 201 }, (_, i) => i / 200);
  const down = samples.map((t) => JSON.stringify(orbitStages(t)));
  const up = [...samples].reverse().map((t) => JSON.stringify(orbitStages(t))).reverse();
  assert.deepEqual(down, up);

  // Every stage moves one way only, and the spin eases to rest
  let prev = orbitStages(0);
  for (const t of samples.slice(1)) {
    const s = orbitStages(t);
    for (const key of ['converge', 'trails', 'sphere', 'land', 'dissolve', 'globeGrid', 'globeLand', 'globeDisc', 'globeMarks', 'caption']) {
      assert.ok(s[key] >= prev[key], `${key} at ${t}`);
    }
    assert.ok(s.ascii <= prev.ascii && s.spin <= prev.spin && s.radius <= prev.radius);
    prev = s;
  }
  assert.ok(orbitStages(0.995).spin < 0.001 * ORBIT_SPIN);
});
