import test from 'node:test';
import assert from 'node:assert/strict';
import { ambientCamera, ambientPath, newTravel, rollAt, sampleAmbientWhale, socialAt, stepTravel } from './ambientWhaleScene.ts';
import { qRotate, vLen, vSub } from './whale3dPose.ts';

const composition = (width = 1280, height = 720) => ({ width, height, scroll: 0, weight: 0, lanes: [{ x: 0.79, y: 0.8 }, { x: 0.15, y: 0.9 }], surfaceY: -Infinity });
const angle = (a, b) => 2 * Math.acos(Math.min(1, Math.abs(a.reduce((s, v, i) => s + v * b[i], 0))));
const deg = (r) => (r * 180) / Math.PI;
const heading = (pose) => qRotate(pose.quaternion, [0, 0, -1]);
const DT = 1 / 30;

/** Run the live integrator at 30 Hz under a scroll signal script; collect both whales' poses. */
function run(c, seconds, signal, from = 0) {
  const st = newTravel(from);
  const frames = [];
  for (let k = 0; k * DT < seconds; k++) {
    const t = from + k * DT;
    stepTravel(st, signal(k * DT), DT, t, c);
    frames.push({ t: k * DT, s: st.s, poses: [0, 1].map((i) => sampleAmbientWhale(i, t, c, st)) });
  }
  return frames;
}

test('framing: Whale A is monumental on every screen', () => {
  for (const [w, h, min] of [[1280, 720, 0.8], [1920, 1080, 0.8], [1024, 768, 0.9], [390, 844, 1.25], [768, 1024, 1]]) {
    const cam = ambientCamera(w, h);
    assert.ok(cam.px / w >= min, `${w}x${h}: ${cam.px}px is ${(cam.px / w).toFixed(2)} of the width`);
    // Girth (about 0.22 of the length) spans at least twenty 10 px character rows on desktop
    if (w >= 1024) assert.ok((cam.px * 0.22) / 10 >= 20, `${w}: girth ${((cam.px * 0.22) / 10).toFixed(1)} rows`);
    assert.ok(cam.fov > 10 && cam.fov < 50);
  }
});

for (const [width, height] of [[1280, 720], [390, 844]]) {
  test(`ambient ${width}: 1600 s idle, every yaw, restrained pitch, never a flip`, () => {
    const c = composition(width, height);
    const frames = run(c, 1600, () => 0);
    for (let i = 0; i < 2; i++) {
      const bins = new Set();
      let maxRate = 0;
      let maxPitch = 0;
      for (let k = 0; k < frames.length; k++) {
        const pose = frames[k].poses[i];
        assert.ok([...pose.position, ...pose.quaternion].every(Number.isFinite));
        assert.ok(Math.abs(Math.hypot(...pose.quaternion) - 1) < 1e-6);
        const f = heading(pose);
        bins.add(Math.floor((Math.atan2(f[0], f[2]) + Math.PI) / (Math.PI / 4)) % 8);
        maxPitch = Math.max(maxPitch, Math.abs(deg(Math.asin(f[1]))));
        if (k) maxRate = Math.max(maxRate, deg(angle(frames[k - 1].poses[i].quaternion, pose.quaternion)) / DT);
      }
      assert.equal(bins.size, 8, `whale ${i} yaw coverage`);
      // A pivots unhurriedly; B is nimbler, still well under a flip (about 3 deg per frame)
      assert.ok(maxRate < (i === 0 ? 50 : 80), `whale ${i} turned at ${maxRate.toFixed(0)} deg/s`);
      assert.ok(maxPitch < 42, `whale ${i} idle pitch ${maxPitch.toFixed(0)}`);
    }
  });

  test(`ambient ${width}: the two animals keep their distance`, () => {
    const c = composition(width, height);
    for (const f of run(c, 900, () => 0)) {
      const [a, b] = f.poses;
      assert.ok(vLen(vSub(a.position, b.position)) > (a.scale + b.scale) * 0.43, `overlap at ${f.t}`);
    }
  });

  test(`ambient ${width}: scrolling down dives, scrolling up rises, reversals turn through level`, () => {
    const c = composition(width, height);
    // rest 4 s, scroll down 7 s, reverse and scroll up 7 s, rest
    const script = (t) => (t < 4 ? 0 : t < 11 ? 0.85 : t < 18 ? -0.85 : 0);
    const frames = run(c, 30, script, 120);
    const at = (t) => frames[Math.round(t / DT)];
    for (let i = 0; i < 2; i++) {
      const down = at(10.5).poses[i];
      const up = at(17.5).poses[i];
      assert.ok(deg(Math.asin(heading(down)[1])) < -35, `whale ${i} heads down while scrolling down`);
      assert.ok(deg(Math.asin(heading(up)[1])) > 30, `whale ${i} heads up while scrolling up`);
      // ...and travels that way on screen
      assert.ok(at(10.5).poses[i].position[1] < at(6).poses[i].position[1] - 0.05, `whale ${i} descends`);
      assert.ok(at(17.5).poses[i].position[1] > at(13.5).poses[i].position[1] + 0.05, `whale ${i} rises`);
      let maxRate = 0;
      let maxPitch = 0;
      for (let k = 1; k < frames.length; k++) {
        maxRate = Math.max(maxRate, deg(angle(frames[k - 1].poses[i].quaternion, frames[k].poses[i].quaternion)) / DT);
        maxPitch = Math.max(maxPitch, Math.abs(deg(Math.asin(heading(frames[k].poses[i])[1]))));
      }
      assert.ok(maxRate < 80, `whale ${i} reversal turned at ${maxRate.toFixed(0)} deg/s`);
      assert.ok(maxPitch < 66, `whale ${i} pitch ${maxPitch.toFixed(0)}: never end-on`);
    }
  });
}

test('scrolling quickens the swim, the turning is smooth, the lean is a lean and not a capsize', () => {
  const c = composition();
  const script = (t) => (t < 4 ? 0 : t < 11 ? 0.85 : t < 18 ? -0.85 : 0);
  const frames = run(c, 40, script, 120);
  const at = (t) => Math.round(t / DT);
  for (let i = 0; i < 2; i++) {
    const speed = (a, b) => {
      let d = 0;
      for (let k = at(a) + 1; k <= at(b); k++) {
        const step = vLen(vSub(frames[k].poses[i].position, frames[k - 1].poses[i].position));
        if (step < 0.2) d += step; // skip the off-screen re-entry
      }
      return d / (b - a);
    };
    // The visitor's scroll is carried by the whale's own swimming: faster, not sliding
    assert.ok(speed(8, 11) > 1.8 * speed(0, 4), `whale ${i}: ${speed(8, 11).toFixed(3)} vs ${speed(0, 4).toFixed(3)} at rest`);
    let maxAccel = 0;
    let prev = 0;
    for (let k = 1; k < frames.length; k++) {
      const rate = angle(frames[k - 1].poses[i].quaternion, frames[k].poses[i].quaternion) / DT;
      if (k > 1) maxAccel = Math.max(maxAccel, Math.abs(rate - prev) / DT);
      prev = rate;
    }
    // A heavy body: no turn, lean or stroke ever jerks the attitude (about 1/60 of a turn per s²)
    assert.ok(maxAccel < 1.5, `whale ${i} angular acceleration ${maxAccel.toFixed(2)} rad/s²`);
  }
  // Under a held scroll the flank faces the camera, so the dive or climb reads on screen
  for (const signal of [0.85, -0.85]) {
    const held = run(c, 200, () => signal, 300).slice(150);
    for (let i = 0; i < 2; i++) {
      const endOn = held.reduce((sum, f) => sum + Math.abs(heading(f.poses[i])[2]), 0) / held.length;
      assert.ok(endOn < 0.35, `whale ${i} heads into the screen ${endOn.toFixed(2)} on average at ${signal}`);
    }
  }
  // Leaning into the slow wander: present, never lying over at rest
  const idle = run(c, 300, () => 0, 500);
  for (let i = 0; i < 2; i++) {
    const leans = idle.map((f) => Math.abs(deg(f.poses[i].bank - rollAt(i, 500 + f.t))));
    assert.ok(Math.max(...leans) > 8, `whale ${i} never leans`);
    assert.ok(leans.reduce((a, b) => a + b, 0) / leans.length < 30, `whale ${i} mean idle lean too deep`);
  }
});

test('personalities: A larger and calmer, B quicker, their strokes never in unison', () => {
  const c = composition();
  const frames = run(c, 300, () => 0);
  const travelled = [0, 0];
  for (let k = 1; k < frames.length; k++) for (let i = 0; i < 2; i++) travelled[i] += vLen(vSub(frames[k].poses[i].position, frames[k - 1].poses[i].position));
  assert.ok(travelled[1] > travelled[0] * 1.1, `B ${travelled[1].toFixed(1)} vs A ${travelled[0].toFixed(1)}`);
  assert.ok(frames[0].poses[0].scale > frames[0].poses[1].scale);
  const last = frames.at(-1).poses;
  assert.notEqual(last[0].articulation.stroke, last[1].articulation.stroke);
});

test('ambient sampling is repeatable; rolls are occasional; social motion is bounded', () => {
  const c = composition();
  assert.deepEqual(sampleAmbientWhale(1, 150, c), sampleAmbientWhale(1, 150, c));
  const a = run(c, 20, (t) => (t < 10 ? 0.6 : -0.4));
  const b = run(c, 20, (t) => (t < 10 ? 0.6 : -0.4));
  assert.deepEqual(a.at(-1).poses, b.at(-1).poses);
  let rolling = 0;
  for (let t = 0; t < 2900; t += 1) if (rollAt(0, t) % (Math.PI * 2) > 0.05) rolling++;
  assert.ok(rolling / 2900 < 0.1, `rolling ${(rolling / 29).toFixed(1)}% of the time`);
  assert.equal(socialAt(20), 0);
  assert.equal(socialAt(145), 1);
  assert.equal(socialAt(200), 0);
  assert.ok(ambientPath(0, 10, c).every(Number.isFinite));
});
