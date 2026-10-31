import test from 'node:test';
import assert from 'node:assert/strict';
import { AMBIENT_SIZE, ambientCamera, ambientPath, newTravel, projectedBounds, rollAt, sampleAmbientWhale, socialAt, stepTravel } from './ambientWhaleScene.ts';
import { qRotate, vLen, vSub } from './whale3dPose.ts';

const composition = (width = 1280, height = 720) => ({ width, height, scroll: 0, weight: 0, lanes: [{ x: 0.79, y: 0.8 }, { x: 0.15, y: 0.9 }], surfaceY: -Infinity });
const angle = (a, b) => 2 * Math.acos(Math.min(1, Math.abs(a.reduce((s, v, i) => s + v * b[i], 0))));
const deg = (r) => (r * 180) / Math.PI;
const heading = (pose) => qRotate(pose.quaternion, [0, 0, -1]);
const DT = 1 / 30;

/** Vertical distance travelled on screen between two times (the whales never wrap or jump). */
const climbed = (frames, i, a, b) => frames[Math.round(b / DT)].poses[i].position[1] - frames[Math.round(a / DT)].poses[i].position[1];
/** Share of a whale's projected extent inside the viewport, across and up/down. */
const inView = (pose, cam) => {
  const [x0, x1, y0, y1] = projectedBounds(pose, cam);
  return [Math.max(0, Math.min(1, x1) - Math.max(-1, x0)) / (x1 - x0), Math.max(0, Math.min(1, y1) - Math.max(-1, y0)) / (y1 - y0)];
};
const pitchOf = (pose) => deg(Math.asin(heading(pose)[1]));

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

test('framing: Whale A is monumental on every screen, a touch smaller than it was', () => {
  assert.ok(AMBIENT_SIZE >= 0.88 && AMBIENT_SIZE <= 0.92);
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
      // ...and travels that way on screen until the camera, following the page, has caught up
      assert.ok(climbed(frames, i, 4, 10.5) < -0.1, `whale ${i} descends`);
      assert.ok(climbed(frames, i, 11, 17.5) > 0.2, `whale ${i} rises`);
      let maxRate = 0;
      let maxPitch = 0;
      for (let k = 1; k < frames.length; k++) {
        maxRate = Math.max(maxRate, deg(angle(frames[k - 1].poses[i].quaternion, frames[k].poses[i].quaternion)) / DT);
        maxPitch = Math.max(maxPitch, Math.abs(deg(Math.asin(heading(frames[k].poses[i])[1]))));
      }
      assert.ok(maxRate < 100, `whale ${i} reversal turned at ${maxRate.toFixed(0)} deg/s`);
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
    // The visitor's scroll is carried by the whale's own swimming: its flukes beat faster, even
    // where the camera following the page holds it in frame (on screen it need not move faster)
    const beat = (a, b) => (frames[at(b)].poses[i].articulation.stroke - frames[at(a)].poses[i].articulation.stroke) / (b - a);
    assert.ok(beat(8, 11) > 1.8 * beat(0, 4), `whale ${i}: ${beat(8, 11).toFixed(2)} vs ${beat(0, 4).toFixed(2)} rad/s at rest`);
    let maxAccel = 0;
    let prev = 0;
    for (let k = 1; k < frames.length; k++) {
      const rate = angle(frames[k - 1].poses[i].quaternion, frames[k].poses[i].quaternion) / DT;
      if (k > 1) maxAccel = Math.max(maxAccel, Math.abs(rate - prev) / DT);
      prev = rate;
    }
    // A heavy body: no turn, lean or stroke ever jerks the attitude (about 1/30 of a turn per s²)
    assert.ok(maxAccel < 2.2, `whale ${i} angular acceleration ${maxAccel.toFixed(2)} rad/s²`);
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

test('a one-second scroll turns both whales into a dive; it is held, eased out, and reversed by scrolling up', () => {
  const c = composition();
  // rest, a brisk one-second scroll down, let go, then the same scroll up
  const cam = ambientCamera(c.width, c.height);
  const script = (t) => (t < 2 ? 0 : t < 3 ? 0.6 : t < 10 ? 0 : t < 11 ? -0.6 : 0);
  const frames = run(c, 20, script, 120);
  const at = (t) => frames[Math.round(t / DT)].poses;
  for (let i = 0; i < 2; i++) {
    const rest = pitchOf(at(2)[i]);
    // Within a second and a half of the scroll the whale has pushed over into a dive...
    const dive = Math.min(...[3, 3.5, 4, 4.5].map((t) => pitchOf(at(t)[i])));
    assert.ok(dive < rest - 6 && dive < -25, `whale ${i} dives to ${dive.toFixed(0)}° from ${rest.toFixed(0)}°`);
    // ...and, the scroll stopped, carries it on as a glide rather than snapping level
    assert.ok(pitchOf(at(4.5)[i]) < rest - 4, `whale ${i} snapped out of the dive (${pitchOf(at(4.5)[i]).toFixed(0)}°)`);
    // On screen it sinks, unless the camera already holds it at the foot of the frame
    const edge = (t) => projectedBounds(at(t)[i], cam);
    assert.ok(climbed(frames, i, 2, 6) < -0.04 || edge(2)[2] < -0.95, `whale ${i} did not descend`);
    // The reverse scroll is the same system run backwards: the whale rises
    const climb = Math.max(...[11, 11.5, 12, 12.5].map((t) => pitchOf(at(t)[i])));
    assert.ok(climb > pitchOf(at(10)[i]) + 6 && climb > 25, `whale ${i} climbs to ${climb.toFixed(0)}°`);
    assert.ok(climbed(frames, i, 10, 14) > 0.04 || edge(10)[3] > 0.95, `whale ${i} did not rise`);
  }
  // The signal itself never jumps: stopping eases it out over seconds
  for (let k = 1; k < frames.length; k++) assert.ok(Math.abs(frames[k].s - frames[k - 1].s) < 0.06);
  assert.ok(frames[Math.round(4 / DT)].s > 0.3, 'the dive intent is held after the scroll stops');
});

test('composition: a whale settled over copy swims toward open water, only while the page holds still', () => {
  for (const [width, height, room] of [[1280, 720, 0.15], [390, 844, 0.5]]) {
    const free = run(composition(width, height), 20, () => 0, 200);
    const steered = run({ ...composition(width, height), avoid: [0.07, -0.07] }, 20, () => 0, 200);
    // A rises off the paragraph, B sinks below it, each by a good part of a viewport (as far as
    // the frame allows: on a wide screen Whale A fills most of its height)
    assert.ok(climbed(steered, 0, 0, 19.9) - climbed(free, 0, 0, 19.9) > room, `${width}: A did not swim up toward open water`);
    assert.ok(climbed(steered, 1, 0, 19.9) - climbed(free, 1, 0, 19.9) < -room, `${width}: B did not swim down toward open water`);
  }
  // While the visitor scrolls, the scroll owns the vertical
  const scrolling = (avoid) => run({ ...composition(), avoid }, 6, () => 0.85, 200);
  const d = climbed(scrolling([0.07, 0.07]), 0, 0, 5.9) - climbed(scrolling([0, 0]), 0, 0, 5.9);
  assert.ok(Math.abs(d) < 0.05, `composition fought the scroll by ${d.toFixed(3)}`);
});

for (const [width, height] of [[1280, 720], [1920, 1080], [768, 1024], [390, 844]]) {
  test(`camera tracking ${width}x${height}: both whales accompany a long scroll down and back up, never leaving the frame`, () => {
    const c = composition(width, height);
    const cam = ambientCamera(width, height);
    // A minute and a half of reading: long scrolls down, pauses, a long climb back, brisk flicks
    const script = (t) => (t < 3 ? 0 : t < 33 ? 0.9 : t < 38 ? 0 : t < 58 ? -0.9 : t < 62 ? 0 : Math.sin(t * 1.3) > 0 ? 0.7 : -0.7);
    const frames = run(c, 90, script, 40);
    for (let i = 0; i < 2; i++) {
      let low = 0;
      for (const f of frames) {
        const [fx, fy] = inView(f.poses[i], cam);
        // Never lost: most of its height and a good part of its length always on screen
        assert.ok(fy > 0.55 && fx > 0.3, `whale ${i} left the frame at ${f.t.toFixed(1)} s (${fx.toFixed(2)} across, ${fy.toFixed(2)} up/down)`);
        if (fx * fy < 0.5) low++;
      }
      assert.ok(low / frames.length < 0.15, `whale ${i} half cropped ${((100 * low) / frames.length).toFixed(0)}% of the time`);
      // The soft frame never jerks it: no step larger than a brisk swim in one frame
      for (let k = 1; k < frames.length; k++) assert.ok(vLen(vSub(frames[k].poses[i].position, frames[k - 1].poses[i].position)) < 0.06, `whale ${i} jumped at ${frames[k].t.toFixed(1)} s`);
    }
    // Held at the frame's edge they still read as travelling with the page: pitched along it
    const held = frames.filter((f) => f.t > 20 && f.t < 33);
    for (let i = 0; i < 2; i++) assert.ok(held.reduce((sum, f) => sum + pitchOf(f.poses[i]), 0) / held.length < -25, `whale ${i} levels out while the page still runs down`);
  });
}

test('personalities: A larger and calmer, B quicker, their strokes never in unison', () => {
  const c = composition();
  const frames = run(c, 300, () => 0);
  const travelled = [0, 0];
  for (let k = 1; k < frames.length; k++) for (let i = 0; i < 2; i++) travelled[i] += vLen(vSub(frames[k].poses[i].position, frames[k - 1].poses[i].position));
  assert.ok(travelled[1] > travelled[0] * 1.1, `B ${travelled[1].toFixed(1)} vs A ${travelled[0].toFixed(1)}`);
  assert.ok(frames[0].poses[0].scale > frames[0].poses[1].scale);
  const last = frames.at(-1).poses;
  assert.notEqual(last[0].articulation.stroke, last[1].articulation.stroke);
  // Alive at rest: even drifting slowly, each beats its flukes every few seconds, A the slower
  const period = [0, 1].map((i) => (300 * 2 * Math.PI) / (last[i].articulation.stroke - frames[0].poses[i].articulation.stroke));
  assert.ok(period[0] > 4.5 && period[0] < 8, `A beats every ${period[0].toFixed(1)} s`);
  assert.ok(period[1] > 3.5 && period[1] < period[0], `B beats every ${period[1].toFixed(1)} s`);
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
