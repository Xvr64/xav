import test from 'node:test';
import assert from 'node:assert/strict';
import { advanceEncryptedLine, encryptedCharacterState, ENCRYPTED_CHARSET } from './encryptedMotion.ts';

const advance = (state, options = {}) => advanceEncryptedLine(
  state, options.zone ?? 1, options.below ?? false, options.above ?? false,
  options.top ?? false, options.delta ?? 0, options.ms ?? 50,
  options.count ?? 10, options.reduced ?? false
);

test('fast entrance starts encrypted, locks one character per 50ms, then rests', () => {
  let state = advance({ revealState: 'hidden', currentP: 0 }, { delta: 900 });
  assert.equal(state.currentP, 0);
  for (let i = 1; i <= 10; i++) {
    state = advance(state);
    assert.ok(Math.abs(state.currentP - i / 10) < 1e-9);
    assert.equal(encryptedCharacterState(state.currentP, i - 1, 10, 50 * i, 3), -1);
  }
  assert.equal(state.revealState, 'revealed');
  assert.equal(advance(state, { ms: 5000 }).currentP, 1);
});

test('scrolling upward encrypts and erases at the lower edge, pauses, and resumes downward', () => {
  let state = { revealState: 'revealed', currentP: 1 };
  state = advance(state, { zone: 0.7, delta: -40 });
  assert.equal(state.currentP, 0.7);
  assert.equal(state.revealState, 'exiting');
  assert.equal(advance(state, { zone: 0.7, ms: 5000 }).currentP, 0.7);
  state = advance(state, { zone: 0.8, delta: 10 });
  assert.ok(state.currentP > 0.7);
  assert.equal(state.revealState, 'revealing');
  state = advance(state, { zone: 0.2, delta: -50 });
  assert.equal(state.currentP, 0.2);
  state = advance(state, { below: true, zone: 0 });
  assert.equal(state.currentP, 0);
  assert.equal(state.revealState, 'hidden');
  assert.equal(advance(state, { delta: 300 }).revealState, 'revealing');
});

test('reversing a partially revealed line never jumps to more readable text', () => {
  const state = { revealState: 'revealing', currentP: 0.25 };
  assert.equal(advance(state, { zone: 0.7, delta: -20 }).currentP, 0.25);
  assert.equal(advance(state, { zone: 0.1, delta: -20 }).currentP, 0.1);
});

test('top exit remains reversible and reduced motion resolves even off screen', () => {
  let state = { revealState: 'revealed', currentP: 1 };
  for (const zone of [0.8, 0.3, 0.6, 1]) {
    state = advance(state, { top: true, zone });
    assert.equal(state.currentP, zone);
  }
  assert.equal(advance(state, { above: true }).currentP, 0);
  assert.deepEqual(advance(state, { below: true, reduced: true }), { revealState: 'revealed', currentP: 1 });
});

test('unresolved letters flip every 50ms while the resolved prefix stays stable', () => {
  const at = (i, time) => encryptedCharacterState(0.5, i, 10, time, 17);
  assert.equal(at(0, 0), -1);
  assert.equal(at(4, 900), -1);
  assert.equal(at(8, 0), at(8, 49));
  assert.notEqual(at(8, 49), at(8, 50));
  assert.ok(ENCRYPTED_CHARSET[at(8, 50)]);
  assert.equal(encryptedCharacterState(1, 9, 10, 0, 0), -1);
});
