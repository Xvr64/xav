import test from 'node:test';
import assert from 'node:assert/strict';
import { parseMagneticCV, magneticCV, easedPhase, readingEnd, READING_BREATH, READING_SLACK } from './magneticCVState.ts';

test('the magnetic CV is a development preview behind ?magneticCV=1 only', () => {
  assert.equal(parseMagneticCV('?magneticCV=1', true), true);
  assert.equal(parseMagneticCV('?ocean=all&magneticCV=1', true), true);
  assert.equal(parseMagneticCV('', true), false);
  assert.equal(parseMagneticCV('?magneticCV=0', true), false);
  assert.equal(parseMagneticCV('?magneticCV=true', true), false);
  // Production never enables it, whatever the URL says.
  assert.equal(parseMagneticCV('?magneticCV=1', false), false);
  // Outside a browser (tests, SSR) the flag is off and nothing touches location.
  assert.equal(magneticCV, false);
});

test('passage phases ease in and out and clamp outside their window', () => {
  assert.equal(easedPhase(0, .2, .6), 0);
  assert.equal(easedPhase(.2, .2, .6), 0);
  assert.equal(easedPhase(.6, .2, .6), 1);
  assert.equal(easedPhase(1, .2, .6), 1);
  assert.ok(Math.abs(easedPhase(.4, .2, .6) - .5) < 1e-9);
  let last = -1;
  for (let t = 0; t <= 1; t += .01) {
    const p = easedPhase(t, .2, .6);
    assert.ok(p >= last, 'monotonic');
    last = p;
  }
});

test('a chapter that fits the screen ends where it starts', () => {
  assert.equal(readingEnd(1000, 1900, 60, 900), 1000);
});

test('overflow that is only bottom padding never costs a gesture', () => {
  // Mobile: 880px chapter on an 844px screen, 59px of padding below the last line.
  assert.equal(readingEnd(9288, 9288 + 880, 59, 844), 9288);
  // A few pixels of content past the foot is still one screen.
  assert.equal(readingEnd(0, 900 + 60 + READING_SLACK - READING_BREATH - 1, 60, 900), 0);
});

test('a long chapter ends once its last line, with breathing room, meets the viewport foot', () => {
  const top = 5000, bottom = 5000 + 2400, pad = 80, viewport = 800;
  const end = readingEnd(top, bottom, pad, viewport);
  assert.equal(end, bottom - pad + READING_BREATH - viewport);
  // The last line (at bottom - pad) is on screen at the reading edge, the padding beyond is not needed.
  assert.ok(bottom - pad <= end + viewport);
  assert.ok(end < bottom - viewport);
});

test('the reading edge never exceeds the chapter bottom, even with no padding', () => {
  assert.equal(readingEnd(0, 3000, 0, 800), 2200);
});
