import test from 'node:test';
import assert from 'node:assert/strict';
import { JOURNEYS, RECOMMENDED_JOURNEY, arrival, enterJourney, isGatedKey } from './journeyEntry.ts';
import { fieldIntensity } from './arrivalField.ts';

test('three journeys in order, the passage recommended and the default', () => {
  assert.deepEqual(JOURNEYS.map(j => [j.index, j.id]), [['01', 'direct'], ['02', 'passage'], ['03', 'odyssey']]);
  assert.deepEqual(JOURNEYS.filter(j => j.recommended).map(j => j.id), ['passage']);
  assert.equal(RECOMMENDED_JOURNEY, 'passage');
  assert.deepEqual(JOURNEYS.map(j => j.line), ['Straight to the story.', 'A journey through space and sea.', 'The complete cinematic experience.']);
});

test('every journey enters the same way: it records the choice, closes the arrival once', () => {
  for (const journey of JOURNEYS) {
    arrival.open = true;
    arrival.selected = null;
    let launches = 0;
    const listener = () => { launches++; };
    arrival.listeners.add(listener);
    enterJourney(journey.id);
    enterJourney(journey.id); // a second press after the arrival has closed changes nothing
    arrival.listeners.delete(listener);
    assert.equal(arrival.open, false);
    assert.equal(arrival.selected, journey.id);
    assert.equal(launches, 1);
  }
});

test('the gate keeps the opening\'s keys from it, but a journey still answers Enter and Space', () => {
  for (const key of ['ArrowDown', 'ArrowUp', 'PageDown', 'PageUp', 'Home', 'End', 'Escape', ' ']) assert.equal(isGatedKey(key, false), true, key);
  assert.equal(isGatedKey(' ', true), false);
  assert.equal(isGatedKey('Enter', true), false);
  assert.equal(isGatedKey('Tab', false), false);
});

test('the arrival water stays within 0..1 in every figure', () => {
  for (const figure of [{}, { direct: 1 }, { passage: 1 }, { odyssey: 1 }, { direct: 0.6, odyssey: 0.7 }]) {
    const s = { aspect: 1.6, t: 7.5, direct: 0, passage: 0, odyssey: 0, focusX: 0.8, focusY: 0.3, pointerX: 0.4, pointerY: 0.5, ...figure };
    for (let r = 0; r < 40; r++) for (let c = 0; c < 60; c++) {
      const v = fieldIntensity((c + 0.5) / 60, (r + 0.5) / 40, c, r, s);
      assert.ok(v >= 0 && v <= 1 && Number.isFinite(v), `${JSON.stringify(figure)} ${c},${r} -> ${v}`);
    }
  }
});
