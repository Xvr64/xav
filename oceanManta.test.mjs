import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import {
  MANTA_ABYSS_ROW, MANTA_CELL, MANTA_FIRST_WAIT, MANTA_HALO_ROW, MANTA_NEXT_WAIT, MANTA_START_VISIBILITY,
  glideMantaRay, launchMantaRay, mantaStamps, mantaVisibility, newMantaRay, stepMantaRay
} from './oceanManta.ts';

/** A repeatable uniform source (mulberry32). */
const seeded = (seed) => () => {
  seed = (seed + 0x6d2b79f5) >>> 0;
  let t = seed;
  t = Math.imul(t ^ (t >>> 15), t | 1);
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};
const calm = { focus: false, reduced: false, migrating: false };

test('timing: the first ray waits 6-12 s, each next one 16-32 s after the last has gone (main)', () => {
  assert.deepEqual([...MANTA_FIRST_WAIT], [6, 12]);
  assert.deepEqual([...MANTA_NEXT_WAIT], [16, 32]);
  for (let s = 1; s < 200; s++) {
    const w = newMantaRay(seeded(s)).wait;
    assert.ok(w >= 6 && w < 12, `${w}`);
  }
  assert.equal(newMantaRay(() => 0).wait, 6);
  assert.equal(newMantaRay(() => 0.5).wait, 9);
});

test('visibility: only below 35% of the page, full by 60%; never in focus, reduced motion or the migration', () => {
  assert.equal(mantaVisibility(0, calm), 0);
  assert.equal(mantaVisibility(0.35, calm), 0);
  assert.ok(Math.abs(mantaVisibility(0.475, calm) - 0.5) < 1e-12);
  assert.equal(mantaVisibility(0.6, calm), 1);
  assert.equal(mantaVisibility(1, calm), 1);
  // It sets out only above a quarter: deeper than 41.25% of the page
  assert.equal(MANTA_START_VISIBILITY, 0.25);
  assert.ok(mantaVisibility(0.4125, calm) <= MANTA_START_VISIBILITY + 1e-12);
  assert.ok(mantaVisibility(0.42, calm) > MANTA_START_VISIBILITY);
  for (const k of ['focus', 'reduced', 'migrating']) assert.equal(mantaVisibility(0.9, { ...calm, [k]: true }), 0, k);
});

test('launch: main\'s six random draws in main\'s order, a course from off one side across the screen', () => {
  const draws = [0.3, 0.5, 0.2, 0.25, 0.5, 0.5];
  let i = 0;
  const ray = newMantaRay(() => 0);
  launchMantaRay(ray, 1440, 900, () => draws[i++]);
  assert.equal(i, 6);
  assert.equal(ray.active, true);
  assert.equal(ray.dir, 1);
  assert.ok(Math.abs(ray.span - 900 * 0.13) < 1e-9);
  assert.ok(Math.abs(ray.x + ray.span * 2.2) < 1e-9, 'starts off the left edge');
  assert.ok(Math.abs(ray.baseY - 900 * 0.195) < 1e-9, 'the upper band');
  assert.ok(Math.abs(ray.speed - 0.7) < 1e-12);
  assert.ok(Math.abs(ray.phase - 3.14) < 1e-12);
  for (let s = 1; s < 300; s++) {
    const r = newMantaRay(() => 0);
    launchMantaRay(r, 390, 844, seeded(s));
    assert.ok(r.span >= 390 * 0.11 && r.span < 390 * 0.15);
    const band = r.baseY / 844;
    assert.ok((band >= 0.16 && band < 0.3) || (band >= 0.68 && band < 0.82), `${band}`);
    assert.ok(r.speed >= 0.55 && r.speed < 0.85);
    assert.equal(r.x, r.dir > 0 ? -r.span * 2.2 : 390 + r.span * 2.2);
  }
});

test('a crossing: steady glide, gentle bob and flap, and it ends off the far side with the next wait set', () => {
  for (const seed of [3, 8, 21]) {
    const ray = newMantaRay(() => 0);
    const rnd = seeded(seed);
    launchMantaRay(ray, 1440, 900, rnd);
    let frames = 0;
    let lastX = ray.x;
    let pose;
    while ((pose = stepMantaRay(ray, 1, frames / 60, 1440, 900, rnd))) {
      frames++;
      assert.ok(Math.abs(pose.x - lastX - ray.dir * ray.speed) < 1e-9);
      lastX = pose.x;
      assert.ok(Math.abs(pose.y - ray.baseY) <= 900 * 0.02 + 1e-9, 'bob within 2% of the screen');
      assert.ok(pose.flap >= 0.64 - 1e-9 && pose.flap <= 1 + 1e-9);
      assert.ok(frames < 10000);
    }
    assert.equal(ray.active, false);
    assert.ok(ray.wait >= 16 && ray.wait < 32);
    // About half a minute or more at 60 Hz for 1440 px: a slow, distant animal
    const distance = 1440 + ray.span * 2.2 + ray.span * 0.85 * 2;
    assert.ok(Math.abs(frames - distance / ray.speed) <= 2, `${frames} frames`);
    assert.ok(frames / 60 > 25);
  }
});

test('a crossing out of sight is moved on by the time that passed, as main\'s 60 Hz steps would have', () => {
  const ray = newMantaRay(() => 0);
  launchMantaRay(ray, 1440, 900, seeded(5));
  const stepped = { ...ray };
  for (let k = 0; k < 600; k++) stepMantaRay(stepped, 1, k / 60, 1440, 900); // 10 s at 60 Hz
  assert.equal(glideMantaRay(ray, 10, 1440), -1, 'still crossing');
  assert.ok(Math.abs(ray.x - stepped.x) < 1e-6);
  // Long enough to have left: inactive, the next wait set, and how long ago it left
  const r2 = newMantaRay(() => 0);
  launchMantaRay(r2, 1440, 900, seeded(5));
  const L = r2.span * 0.85;
  const toExit = (1440 + r2.span * 2.2 + L * 2) / (r2.speed * 60);
  const ago = glideMantaRay(r2, toExit + 7, 1440, () => 0.5);
  assert.equal(r2.active, false);
  assert.equal(r2.wait, 24);
  assert.ok(Math.abs(ago - 7) < 1e-6, `${ago}`);
});

/** Main's planform loop, verbatim but for its output (AsciiWhaleBackground.tsx, 54710be). */
function mainStamps(rx, ry, S, L, dir, flap, cols, rows) {
  const out = [];
  const cellSize = 10;
  const c0 = Math.max(0, ((rx - L * 2) / cellSize) | 0);
  const c1 = Math.min(cols - 1, ((rx + L * 1.2) / cellSize) | 0);
  const r0 = Math.max(0, ((ry - S) / cellSize) | 0);
  const r1 = Math.min(rows - 1, ((ry + S) / cellSize) | 0);
  for (let rr = r0; rr <= r1; rr++) {
    const l = (rr * cellSize + cellSize * 0.5 - ry) / S;
    for (let cc = c0; cc <= c1; cc++) {
      const f = ((cc * cellSize + cellSize * 0.5 - rx) * dir) / L;
      let stamp = -1;
      if (f > -0.9 && f < 1) {
        const hs = Math.pow(Math.max(0, 1 - Math.abs(f - 0.12) / 0.92), 0.75) * flap;
        const al = Math.abs(l);
        if (al < hs) stamp = al < hs * 0.55 ? 1 : 0;
      } else if (f <= -0.9 && f > -1.7 && Math.abs(l) < 0.035) {
        stamp = 0;
      }
      if (stamp >= 0) out.push(`${cc},${rr},${stamp}`);
    }
  }
  return out;
}

test('the planform is main\'s cell for cell: a diamond of ":" with a "." rim and a thin tail', () => {
  assert.equal(MANTA_CELL, 10);
  const rnd = seeded(77);
  for (let k = 0; k < 400; k++) {
    const W = [390, 768, 1280, 1440][k % 4];
    const H = [844, 1024, 800, 900][k % 4];
    const S = Math.min(W, H) * (0.11 + rnd() * 0.04);
    const pose = { x: -S * 2 + rnd() * (W + S * 4), y: H * rnd(), span: S, length: S * 0.85, flap: 0.64 + rnd() * 0.36, dir: rnd() < 0.5 ? 1 : -1 };
    const cols = Math.ceil(W / 10), rows = Math.ceil(H / 10);
    const mine = [];
    mantaStamps(pose, cols, rows, (c, r, s) => mine.push(`${c},${r},${s}`));
    assert.deepEqual(mine, mainStamps(pose.x, pose.y, pose.span, pose.length, pose.dir, pose.flap, cols, rows));
  }
  // Mid-screen at 1440: a solid core, a rim, a tail behind it, mirror-symmetric about its line
  const pose = { x: 700, y: 455, span: 117, length: 117 * 0.85, flap: 1, dir: 1 };
  const cells = [];
  mantaStamps(pose, 144, 90, (c, r, s) => cells.push({ c, r, s }));
  const core = cells.filter((x) => x.s === 1).length;
  const rim = cells.filter((x) => x.s === 0).length;
  assert.ok(core > 100 && rim > 50, `${core} core, ${rim} rim`);
  assert.ok(cells.some((x) => x.c * 10 + 5 < 700 - 0.9 * pose.length), 'a tail behind the wings');
  assert.ok(cells.every((x) => x.c * 10 + 5 < 700 + pose.length), 'nothing ahead of the head');
});

test('the ocean layer keeps time for the ray without a loop: a timeout to arm, frames only while it crosses', () => {
  const src = readFileSync(new URL('./AsciiWhaleBackground.tsx', import.meta.url), 'utf8');
  // Still only the water's coalesced update and the canvases' frames: no loop of the ray's own
  const rafs = [...new Set(src.match(/requestAnimationFrame\((\w+)\)/g) ?? [])].sort();
  assert.deepEqual(rafs, ['requestAnimationFrame(drawPings)', 'requestAnimationFrame(updateWater)']);
  // The wait is a timeout, held while the tab is hidden, cleared on unmount
  const arm = src.slice(src.indexOf('const armRay'), src.indexOf('const holdRay'));
  assert.ok(/window\.setTimeout\(/.test(arm));
  assert.ok(/if \(isFocus \|\| prefersReducedMotion \|\| document\.hidden\) \{ rayWaitHeld = seconds \* 1000; return; \}/.test(arm), 'no timer in focus, reduced motion or a hidden tab');
  const visibility = src.slice(src.indexOf('const onVisibility'), src.indexOf('const onMotion'));
  assert.ok(/if \(document\.hidden\) \{ holdRay\(\); if \(rayParkedAt >= 0\) rayHiddenAt = performance\.now\(\); \}/.test(visibility));
  assert.ok(/if \(rayParkedAt >= 0 && rayHiddenAt >= 0\) rayParkedAt \+= performance\.now\(\) - rayHiddenAt;/.test(visibility), 'hidden time does not move a parked ray');
  const motion = src.slice(src.indexOf('const onMotion'), src.indexOf('releaseCanvases();', src.indexOf('const onMotion')));
  assert.ok(/if \(prefersReducedMotion\) \{ holdRay\(\); ray\.active = false; rayParkedAt = -1; schedulePings\(\); \}/.test(motion));
  const cleanup = src.slice(src.lastIndexOf('return () => {'), src.indexOf('}, [mode]);'));
  assert.ok(/window\.clearTimeout\(rayTimer\);/.test(cleanup) && /cancelAnimationFrame\(pingRaf\);/.test(cleanup));
  // It sets out from the timeout or a scroll, only when due and deep enough, never in reduced motion
  const launch = src.slice(src.indexOf('const tryLaunchRay'), src.indexOf('const drawRay'));
  assert.ok(/if \(!rayDue \|\| ray\.active \|\| !mantaTiles \|\| document\.hidden \|\| isFocus \|\| prefersReducedMotion\) return;/.test(launch));
  assert.ok(/if \(rayVisibility\(\) <= MANTA_START_VISIBILITY\) return;/.test(launch));
  const update = src.slice(src.indexOf('const updateWater'), src.indexOf('const scheduleWater'));
  assert.ok(/resumeParkedRay\(\);\s*tryLaunchRay\(\);/.test(update));
  // The canvases run while a ping lives or a ray crosses in sight, and give their stores back after
  const draw = src.slice(src.indexOf('const drawPings'), src.indexOf('pingRaf = requestAnimationFrame(drawPings)'));
  assert.ok(/const rayInSight = ray\.active && rayParkedAt < 0;\s*if \(!pings\.length && !rayInSight\) \{\s*releaseCanvases\(\);\s*return;\s*\}/.test(draw));
  // Drawn beneath the whales, after the rings, as on main; the next wait armed on exit
  assert.ok(draw.indexOf('if (rayInSight) drawRay(now);') > draw.indexOf('ctx.fillText(glyph, x, y)'));
  const ray = src.slice(src.indexOf('const drawRay'), src.indexOf('const drawPings'));
  assert.ok(/if \(!pose\) \{ armRay\(ray\.wait\); return; \}/.test(ray));
  // Out of sight up the page (no ping either) the crossing stops its frames until the water is deep again
  assert.ok(/\} else if \(!pings\.length\) \{[\s\S]*?rayParkedAt = now;/.test(ray));
  const resume = src.slice(src.indexOf('const resumeParkedRay'), src.indexOf('const drawRay'));
  assert.ok(/rayVisibility\(\) <= 0\.01\) return;/.test(resume) && /glideMantaRay\(ray, seconds, viewW\)/.test(resume));
  assert.ok(/if \(gone >= 0\) armRay\(Math\.max\(0, ray\.wait - gone\)\);/.test(resume), 'a ray that left meanwhile starts its wait from when it left');
  assert.ok(/drawMantaRay\(underCtx,/.test(ray));
  // The dev hook exists only in development
  assert.ok(/env\?\.DEV && !isFocus\) \{[\s\S]*__oceanManta = \{/.test(src));
});

test('atlas row indices match main (5 halo, 19 abyss) and mantaStamps body planform is mirror-symmetric across dir 1 vs -1', () => {
  assert.equal(MANTA_HALO_ROW, 5);
  assert.equal(MANTA_ABYSS_ROW, 19);
  const cx = 700;
  const base = { x: cx, y: 455, span: 117, length: 117 * 0.85, flap: 0.92 };
  const inBody = (c) => Math.abs(c * MANTA_CELL + MANTA_CELL * 0.5 - cx) < base.length;
  const right = [];
  const left = [];
  mantaStamps({ ...base, dir: 1 }, 144, 90, (c, r, s) => {
    if (inBody(c)) right.push(`${c},${r},${s}`);
  });
  mantaStamps({ ...base, dir: -1 }, 144, 90, (c, r, s) => {
    if (inBody(c)) {
      const mirrorCol = Math.round((2 * cx) / MANTA_CELL) - 1 - c;
      left.push(`${mirrorCol},${r},${s}`);
    }
  });
  assert.ok(right.length > 150);
  assert.deepEqual(left.sort(), right.sort(), 'dir = -1 mirrors dir = 1 cell-for-cell across the body planform');
});
