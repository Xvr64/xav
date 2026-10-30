import test from 'node:test';
import assert from 'node:assert/strict';
import {
  ASCII_GLYPHS,
  VIEWPORT_ZONES,
  DECODE_WAVE,
  GLYPH_STATES,
  LOCK_AT,
  RESOLVED,
  decodeChars,
  charProgress,
  charState,
  charGlyph,
  charOpacity,
  lineProgress,
  entryEndFor,
  exitStartFor,
  waterShade
} from './terminalMotion.ts';
import { ClickGate, CLICK_GAP_MS, MIN_ACTIVITY } from './decodeAudio.ts';

test('reading zone is 14%–84% of the viewport and fully stable there', () => {
  for (const viewport of [600, 800, 1000, 1200]) {
    // 0–4% and 95–100%: invisible
    for (const frac of [0.01, 0.03, 0.96, 0.99]) {
      const p = lineProgress(viewport * frac, viewport);
      assert.equal(p, 0, `at ${frac}`);
      assert.equal(charOpacity(p, charProgress(p, 0.5, frac > 0.5)), 0);
    }
    // Transition zones: text still decodes in on entry and dissolves on exit
    for (const frac of [0.06, 0.09, 0.12, 0.87, 0.9, 0.93]) {
      const p = lineProgress(viewport * frac, viewport);
      assert.ok(p > 0 && p < 1, `Expected transition at ${frac}, got ${p}`);
    }
    // Reading zone: every character resolved, full opacity
    for (const frac of [0.14, 0.2, 0.35, 0.5, 0.65, 0.8, 0.84]) {
      const p = lineProgress(viewport * frac, viewport);
      assert.equal(p, 1, `Expected fully readable text at ${frac * 100}%, got ${p}`);
      assert.equal(decodeChars('International', 0, 13, p, true, 42), 'International');
      for (const t of [0, 0.5, 1]) assert.equal(charOpacity(p, charProgress(p, t, true)), 1);
    }
  }
  assert.equal(VIEWPORT_ZONES.READING_TOP, 0.14);
  assert.equal(VIEWPORT_ZONES.READING_BOTTOM, 0.84);
});

test('lines resting near the top of the final screen stay readable there', () => {
  const viewport = 800;
  // A line that leaves the screen before the page ends keeps the normal exit zone
  assert.equal(exitStartFor(-40, viewport), VIEWPORT_ZONES.EXIT_START);
  assert.equal(exitStartFor(viewport * 0.5, viewport), VIEWPORT_ZONES.EXIT_START);
  for (const frac of [0, 0.02, 0.06, 0.1, 0.13]) {
    const lowest = viewport * frac;
    const start = exitStartFor(lowest, viewport);
    // Where it rests at the end of the page: fully readable
    assert.equal(lineProgress(lowest, viewport, VIEWPORT_ZONES.ENTRY_END, start), 1, `${frac}`);
    // Lower on the screen (scrolled back up from the end) it is readable too
    assert.equal(lineProgress(lowest + viewport * 0.3, viewport, VIEWPORT_ZONES.ENTRY_END, start), 1, `${frac}`);
  }
  // Scrolling back up, the same lines still decode in from the bottom of the screen
  const start = exitStartFor(viewport * 0.05, viewport);
  const entering = lineProgress(viewport * 0.9, viewport, VIEWPORT_ZONES.ENTRY_END, start);
  assert.ok(entering > 0 && entering < 1);
});

test('lines that cannot scroll into the reading zone still resolve at the end of the page', () => {
  const viewport = 900;
  // A line that reaches the reading zone keeps the normal entry zone
  assert.equal(entryEndFor(viewport * 0.4, viewport), VIEWPORT_ZONES.ENTRY_END);
  assert.equal(entryEndFor(-5000, viewport), VIEWPORT_ZONES.ENTRY_END);
  // The footer stops at 82% of the viewport: readable there, still decoding a little lower
  for (const frac of [0.79, 0.82, 0.88, 0.96]) {
    const lowest = viewport * frac;
    const end = entryEndFor(lowest, viewport);
    assert.equal(lineProgress(lowest, viewport, end), 1, `${frac}`);
    const below = lineProgress(lowest + viewport * 0.08, viewport, end);
    assert.ok(below > 0 && below < 1, `${frac}: ${below}`);
  }
});

test('characters decode one by one in a narrow left-to-right wave', () => {
  const line = 'Xavier Hery builds things';
  const n = line.length;
  const at = (lp, entering = true) => decodeChars(line, 0, n, lp, entering, 7);
  // The full structure is present from the start: same length, spaces kept, ASCII glyphs
  assert.equal(at(0.01).length, n);
  assert.equal(at(0.01)[6], ' ');
  assert.ok([...at(0.01)].every((ch, i) => ch === ' ' || ASCII_GLYPHS.includes(ch)));
  // Mid-wave: leading letters are real while trailing ones are still glyphs
  const mid = at(0.5);
  assert.equal(mid.slice(0, 3), 'Xav');
  assert.notEqual(mid.slice(-4), 'ings');
  // Letters lock individually, never a whole word or line at once
  const locked = (lp) => [...at(lp)].filter((ch, i) => ch === line[i] && ch !== ' ').length;
  const counts = Array.from({ length: 101 }, (_, i) => locked(i / 100));
  for (let i = 1; i < counts.length; i++) {
    assert.ok(counts[i] >= counts[i - 1], 'locking is monotonic while entering');
    assert.ok(counts[i] - counts[i - 1] <= 3, `at most a few letters lock per 1% (${i})`);
  }
  // The wave is narrow: while the first letter is still decoding, the last has not started
  assert.equal(charProgress(1 / (1 + DECODE_WAVE) / 2, 1, true), 0);
  // Exactly the original text before the reading zone
  assert.equal(at(1), line);
  assert.equal(at(0.92), line);
  // Punctuation is never replaced
  assert.equal(decodeChars('B2B,', 0, 4, 0.1, true, 1)[3], ',');
});

test('each character steps through several distinct ASCII states before it locks', () => {
  const seen = [];
  for (let i = 0; i <= 400; i++) {
    const state = charState(i / 400);
    if (seen[seen.length - 1] !== state) seen.push(state);
  }
  assert.deepEqual(seen, [...Array.from({ length: GLYPH_STATES }, (_, i) => i), RESOLVED]);
  assert.equal(charState(LOCK_AT), RESOLVED);
  for (let seed = 0; seed < 50; seed++) {
    const glyphs = Array.from({ length: GLYPH_STATES }, (_, s) => charGlyph(s, seed));
    glyphs.forEach((g, s) => {
      assert.ok(ASCII_GLYPHS.includes(g));
      if (s) assert.notEqual(g, glyphs[s - 1], 'consecutive states differ');
    });
    assert.ok(new Set(glyphs).size >= 5);
  }
});

test('exit reverses the wave deterministically', () => {
  const samples = Array.from({ length: 101 }, (_, i) => i / 100);
  const down = samples.map((p) => decodeChars('Operational', 0, 11, p, false, 9));
  const up = [...samples].reverse().map((p) => decodeChars('Operational', 0, 11, p, false, 9)).reverse();
  assert.deepEqual(down, up);
  assert.equal(charProgress(1, 0.5, false), 1);
  assert.equal(charProgress(0, 0.5, false), 0);
  assert.ok(charProgress(0.5, 0, false) < charProgress(0.5, 1, false), 'left edge leaves first');
});

test('opacity: a faint field of glyphs that brightens to full ink as letters lock', () => {
  assert.equal(charOpacity(0, 0), 0);
  const faint = charOpacity(0.2, 0);
  assert.ok(faint > 0.2 && faint < 0.4, `ahead of the wave: ${faint}`);
  assert.ok(charOpacity(0.2, 0.3) > faint);
  assert.equal(charOpacity(0.5, LOCK_AT), 1);
  assert.equal(charOpacity(1, 1), 1);
});

test('click gate: grouped, rate-limited, silent when still, no backlog', () => {
  const gate = new ClickGate();
  // Jitter that flips one or two glyphs never clicks
  assert.equal(gate.offer(0, 1, 0, false), null);
  assert.equal(gate.offer(16, 0, 0, false), null);
  assert.equal(gate.offer(32, MIN_ACTIVITY - 1, 0, false), null);
  assert.equal(gate.offer(48, 0, 0, false), null);

  // A fast scroll for two seconds at 60 fps with heavy activity every frame
  let clicks = 0;
  for (let t = 1000; t < 3000; t += 1000 / 60) if (gate.offer(t, 120, 10, false)) clicks++;
  assert.ok(clicks >= 2 * 8 && clicks <= 2 * 15, `~8–15 clicks per second, got ${clicks / 2}`);

  // Stopping clears everything at once: the next frame with no changes is silent, and so is
  // anything after it until new changes arrive
  assert.equal(gate.offer(3100, 0, 0, false), null);
  assert.equal(gate.offer(3200, 0, 0, false), null);

  // Grouping: changes from consecutive frames add up into one click
  const g2 = new ClickGate();
  assert.equal(g2.offer(0, 1, 0, false), null);
  assert.equal(g2.offer(16, 1, 0, false), null);
  const click = g2.offer(32, 1, 1, true);
  assert.ok(click && click.lock && click.exiting);
  assert.ok(click.strength > 0 && click.strength <= 1);
  // Rate limit: activity right after a click waits for the gap, then needs fresh changes
  assert.equal(g2.offer(40, 30, 0, false), null);
  assert.ok(g2.offer(32 + CLICK_GAP_MS * 1.3, 30, 0, false));
  // Strength is bounded however much changes at once
  const g3 = new ClickGate();
  assert.ok(g3.offer(0, 100000, 0, false).strength <= 1);
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
