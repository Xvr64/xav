import test from 'node:test';
import assert from 'node:assert/strict';
import {
  PING_REACH,
  PING_SECONDS,
  ECHO_SECONDS,
  arrivalTime,
  echoStrength,
  isOpenWaterClick,
  pingRadius,
  pingStrength
} from './sonarPing.ts';

test('the ring spreads outward, fast then slowing, and fades out by its reach', () => {
  assert.equal(pingRadius(0), 0);
  assert.equal(Math.round(pingRadius(PING_SECONDS)), PING_REACH);
  let last = -1;
  let lastStep = Infinity;
  for (let t = 0.1; t <= PING_SECONDS; t += 0.1) {
    const r = pingRadius(t);
    assert.ok(r > last, 'outward');
    assert.ok(r - last <= lastStep + 1e-6, 'slowing');
    lastStep = r - last;
    last = r;
  }
  assert.equal(pingStrength(0), 0);
  assert.equal(pingStrength(PING_SECONDS), 0);
  assert.ok(pingStrength(0.2) > 0.5);
});

test('echoes return when the ring arrives and fade within their time', () => {
  for (const d of [0, 120, 300, 540]) {
    const t = arrivalTime(d);
    assert.ok(Math.abs(pingRadius(t) - d) < 0.5, `arrives at ${d}`);
  }
  assert.equal(arrivalTime(PING_REACH + 1), Infinity);
  assert.equal(echoStrength(-0.01), 0);
  assert.ok(echoStrength(0.2) > 0.3);
  assert.equal(echoStrength(ECHO_SECONDS), 0);
});

test('only clicks in open water ping', () => {
  assert.equal(isOpenWaterClick(null, ''), true);
  assert.equal(isOpenWaterClick(null, 'selected words'), false);
});
