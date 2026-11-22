import test from 'node:test';
import assert from 'node:assert/strict';
import { advanceEncryptedLine, encryptedEntryProgress, encryptedCharacterState, ENCRYPTED_CHARSET } from './encryptedMotion.ts';

const hidden = () => ({ revealState: 'hidden', currentP: 0 });

test('each line follows its own entrance position with a spatial cascade', () => {
  assert.equal(encryptedEntryProgress(950, 1000), 0);
  assert.ok(Math.abs(encryptedEntryProgress(785, 1000) - 0.5) < 1e-9);
  assert.equal(encryptedEntryProgress(620, 1000), 1);
  const progress = [850, 875, 900].map(top => encryptedEntryProgress(top, 1000));
  assert.ok(progress[0] > progress[1] && progress[1] > progress[2]);
  let state = hidden();
  for (let top = 1000; top >= 610; top -= 2) {
    const previous = state;
    const zone = encryptedEntryProgress(top, 1000);
    state = advanceEncryptedLine(state, zone, 2);
    assert.ok(state.currentP >= previous.currentP);
    assert.ok(Math.abs(state.currentP - zone) < 1 / 64 + 1e-9);
  }
  assert.equal(state.revealState, 'revealed');
});

test('fast scrolling and skipped viewports resolve immediately with no timer backlog', () => {
  for (const top of [550, 0, -2000]) {
    assert.deepEqual(advanceEncryptedLine(hidden(), encryptedEntryProgress(top, 900), 5000),
      { revealState: 'revealed', currentP: 1 });
  }
});

test('completed lines never change on reverse, repeated scrolling, or offscreen visits', () => {
  const complete = advanceEncryptedLine(hidden(), 1, 100);
  for (const delta of [-5000, -1, 0, 1, 5000]) {
    for (const zone of [0, 0.2, 0.8, 1]) assert.equal(advanceEncryptedLine(complete, zone, delta), complete);
  }
});

test('pausing does no work; reversing a partial line settles it without scrambling', () => {
  const partial = advanceEncryptedLine(hidden(), 0.5, 1);
  assert.equal(advanceEncryptedLine(partial, 0.5, 0), partial);
  const settled = advanceEncryptedLine(partial, 0, -100);
  assert.equal(settled.currentP, 1);
  assert.equal(advanceEncryptedLine(settled, 0.1, 100), settled);
  assert.equal(advanceEncryptedLine(hidden(), 0.2, -1).currentP, 1);
  assert.equal(advanceEncryptedLine(hidden(), 0, -1).currentP, 0);
});

test('reduced motion settles even future lines and never rearms them', () => {
  const settled = advanceEncryptedLine(hidden(), 0, 0, true);
  assert.equal(settled.currentP, 1);
  assert.equal(advanceEncryptedLine(settled, 0, 1, false), settled);
});

test('bottom-of-page lines and zero-height viewports are readable', () => {
  assert.equal(encryptedEntryProgress(970, 1000, 1), 1);
  assert.equal(encryptedEntryProgress(0, 0), 1);
});

test('adjusted bottom-of-page entrances do not animate below the viewport', () => {
  for (const top of [1000, 1050, 1200]) assert.equal(encryptedEntryProgress(top, 1000, 0.9), 0);
  assert.ok(encryptedEntryProgress(990, 1000, 0.9) > 0);
  assert.equal(encryptedEntryProgress(890, 1000, 0.9), 1);
});

test('locked characters stay correct; suffix glyphs are deterministic and scroll-driven', () => {
  assert.equal(encryptedCharacterState(0.5, 4, 10, 17), -1);
  const glyph = encryptedCharacterState(0.5, 8, 10, 17);
  assert.equal(encryptedCharacterState(0.5, 8, 10, 17), glyph);
  assert.notEqual(encryptedCharacterState(0.55, 8, 10, 17), glyph);
  assert.ok(ENCRYPTED_CHARSET[glyph]);
  for (let i = 0; i < 150; i++) assert.equal(encryptedCharacterState(1, i, 150, 17), -1);
});

test('ENCRYPTED_CHARSET contains strictly narrow/medium oceanic characters and zero wide collision symbols', () => {
  for (const wide of ['M', 'W', '@', '%', '#', '&']) {
    assert.equal(ENCRYPTED_CHARSET.includes(wide), false, `must not contain wide glyph ${wide}`);
  }
  assert.ok(ENCRYPTED_CHARSET.length >= 10);
});
