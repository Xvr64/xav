// Local Chrome playback validation for Whale Memory Transfer V2.
// Set FFMPEG_PATH to record the full desktop walk to MP4.
// node dev/profile-memories-validation.mjs desktop|pacing|laptop|tablet|mobile|reduced|mixed
import assert from 'node:assert/strict';
import { once } from 'node:events';
import { spawn } from 'node:child_process';
import { writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { sleep } from './fable-cdp.mjs';

process.env.PHASE2_OUT ||= 'artifacts/profile-memories';
const { browser, server, stopServers, stats, save, png, out } = await import('./phase2-lib.mjs');
const mode = process.argv[2] ?? 'desktop';
const sizes = {
  desktop: [1440, 900],
  pacing: [1440, 900],
  laptop: [1280, 720],
  tablet: [768, 1024],
  mobile: [390, 844],
  reduced: [1280, 800],
  mixed: [1440, 900]
};
const [width, height] = sizes[mode];
const touch = mode === 'tablet' || mode === 'mobile';
const fullJourney = mode === 'desktop';
const record = fullJourney && !!process.env.FFMPEG_PATH;
const cities = ['doha', 'paris', 'jakarta', 'moscow', 'singapore', 'pau', 'bordeaux', 'shanghai'];
const report = { width, height, touch, mode, recording: record, checks: [] };
const frames = [];

async function until(c, expression, limit = 15000) {
  const started = Date.now();
  while (Date.now() - started < limit) {
    if (await c.evaluate(expression)) return;
    await sleep(40);
  }
  throw Error('Timed out waiting for ' + expression + ': ' + JSON.stringify(await c.evaluate('memoryQA.status()')));
}

async function encode() {
  if (!frames.length) return;
  const fps = 30;
  const proc = spawn(process.env.FFMPEG_PATH, [
    '-y', '-hide_banner', '-loglevel', 'error', '-f', 'image2pipe',
    '-framerate', String(fps), '-vcodec', 'mjpeg', '-i', '-', '-c:v', 'libx264',
    '-preset', 'fast', '-crf', '18', '-pix_fmt', 'yuv420p', '-movflags', '+faststart',
    join(out, 'desktop-walk.mp4')
  ], { stdio: ['pipe', 'ignore', 'inherit'], windowsHide: true });
  const done = once(proc, 'close');
  let i = 0;
  for (let t = frames[0].time; t <= frames.at(-1).time; t += 1000 / fps) {
    while (i < frames.length - 1 && frames[i + 1].time <= t) i++;
    if (!proc.stdin.write(frames[i].jpeg)) await once(proc.stdin, 'drain');
  }
  proc.stdin.end();
  assert.equal((await done)[0], 0);
}

const monitor = `(() => {
  const itinerary = document.querySelector('.profile-itinerary');
  const rows = [...itinerary.querySelectorAll('[data-city-id]')];
  const status = () => ({
    scene: itinerary.dataset.plates,
    wave: itinerary.dataset.memoryWave ?? null,
    city: itinerary.dataset.memoryCity ?? null,
    stage: itinerary.dataset.memoryStage ?? null,
    activeId: window.__magneticCV.snapshot().activeId,
    y: scrollY,
    slots: rows.map(row => row.querySelector('figure')?.dataset.memoryPhase),
    globe: document.querySelector('.globe-caption > div[aria-hidden="false"] .globe-city')?.textContent.trim()
  });
  const log = [], intervals = [], stalls = [], globeCities = new Set();
  let drift = 0, last = 0, anchor = 0, locked = false, moves = 0, clicks = 0;
  addEventListener('pointermove', () => moves++);
  addEventListener('click', () => clicks++);
  function sample(t) {
    const data = status();
    if (data.globe) globeCities.add(data.globe);
    const prev = log.at(-1);
    if (
      !prev ||
      prev.scene !== data.scene ||
      prev.wave !== data.wave ||
      prev.city !== data.city ||
      prev.stage !== data.stage ||
      prev.activeId !== data.activeId ||
      prev.slots.join(',') !== data.slots.join(',')
    ) {
      log.push({ ...data, time: performance.timeOrigin + performance.now() });
    }
    if (locked) {
      drift = Math.max(drift, Math.abs(scrollY - anchor));
      if (data.scene === 'revealing') {
        if (last) {
          intervals.push(t - last);
          if (t - last > 34) stalls.push({ ms: Math.round(t - last), wave: data.wave, city: data.city, stage: data.stage });
        }
        last = t;
      }
    }
    requestAnimationFrame(sample);
  }
  requestAnimationFrame(sample);
  const rectsOverlap = (a, b) =>
    !(a.right <= b.left + 0.5 || b.right <= a.left + 0.5 || a.bottom <= b.top + 0.5 || b.bottom <= a.top + 0.5);
  window.memoryQA = {
    status,
    start() { locked = true; anchor = scrollY; last = 0; },
    stop() { locked = false; },
    results() { return { log, intervals, stalls, drift, globeCities: [...globeCities], moves, clicks }; },
    invisibleCheck() {
      const forbiddenNodes = itinerary.querySelectorAll('.profile-city-ghost, .profile-city-outer-mark, .profile-city-placeholder, .profile-city-corners, .profile-city-inner-frame').length;
      const items = rows.map(row => {
        const h3 = row.querySelector('.profile-city-name');
        const afterContent = getComputedStyle(h3, '::after').content;
        const fig = row.querySelector('figure');
        const ap = row.querySelector('.profile-city-aperture');
        const img = row.querySelector('img');
        const canvas = row.querySelector('canvas');
        const csFig = getComputedStyle(fig);
        const csAp = getComputedStyle(ap);
        const csImg = getComputedStyle(img);
        const csCanvas = getComputedStyle(canvas);
        return {
          id: row.dataset.cityId,
          noConnector: afterContent === 'none' || afterContent === 'normal',
          figTransparent: csFig.backgroundColor === 'rgba(0, 0, 0, 0)' && csFig.borderTopWidth === '0px' && csFig.boxShadow === 'none',
          apTransparent: csAp.backgroundColor === 'rgba(0, 0, 0, 0)' && csAp.borderTopWidth === '0px' && csAp.boxShadow === 'none',
          imgHidden: parseFloat(csImg.opacity) === 0,
          canvasHidden: csCanvas.display === 'none'
        };
      });
      return { forbiddenNodes, items };
    },
    geometry() {
      const items = rows.map(row => {
        const fig = row.querySelector('figure');
        const plate = fig.getBoundingClientRect();
        const title = row.querySelector('h3 span:last-child').getBoundingClientRect();
        const img = row.querySelector('img');
        const natAr = img && img.naturalHeight ? img.naturalWidth / img.naturalHeight : 1;
        // Measure unrotated frame CSS dimensions for exact aspect-ratio check.
        const styleW = parseFloat(getComputedStyle(fig).width);
        const styleH = parseFloat(getComputedStyle(fig).height);
        const dispAr = styleH > 0 ? styleW / styleH : 1;
        return {
          id: row.dataset.cityId,
          left: Math.round(plate.left),
          right: Math.round(plate.right),
          top: Math.round(plate.top),
          bottom: Math.round(plate.bottom),
          width: Math.round(styleW),
          height: Math.round(styleH),
          natAr: +natAr.toFixed(4),
          dispAr: +dispAr.toFixed(4),
          arDelta: +Math.abs(dispAr - natAr).toFixed(4),
          objectFit: getComputedStyle(img).objectFit,
          fits:
            title.left >= 0 &&
            title.right < plate.left &&
            title.top >= 0 &&
            title.bottom <= innerHeight &&
            plate.left >= 0 &&
            plate.top >= 0 &&
            plate.bottom <= innerHeight + 1 &&
            plate.right <= innerWidth + 1,
          imgReady: !!img && img.complete && img.naturalWidth > 0,
          alt: img?.alt,
          _plate: plate,
          _title: title
        };
      });
      const photoOverlaps = [];
      const titleOverlaps = [];
      for (let i = 0; i < items.length; i++) {
        for (let j = i + 1; j < items.length; j++) {
          if (rectsOverlap(items[i]._plate, items[j]._plate)) {
            photoOverlaps.push([items[i].id, items[j].id]);
          }
        }
        for (let j = 0; j < items.length; j++) {
          if (rectsOverlap(items[i]._plate, items[j]._title)) {
            titleOverlaps.push([items[i].id, items[j].id]);
          }
        }
      }
      return {
        items: items.map(({ _plate, _title, ...rest }) => rest),
        photoOverlaps,
        titleOverlaps
      };
    }
  };
})()`;

async function injectMixedAspectPhotos(c) {
  // Replace the 8 photos in-page with crisp synthetic photographs spanning 8 distinct aspect ratios
  // (16:9, 2:3, 4:3, 9:16, 3:2, 2.35:1, 3:4, 1:1) to prove zero crop, zero distortion, and zero overlap.
  await c.evaluate(`(async () => {
    const specs = [
      { id: 'doha',      w: 640, h: 360, c1: '#18345c', c2: '#e6b87d', label: '16:9' },
      { id: 'paris',     w: 400, h: 600, c1: '#5697d4', c2: '#d9c496', label: '2:3'  },
      { id: 'jakarta',   w: 560, h: 420, c1: '#2f6d3b', c2: '#cbe0a4', label: '4:3'  },
      { id: 'moscow',    w: 360, h: 640, c1: '#6c7c94', c2: '#e6d8cc', label: '9:16' },
      { id: 'singapore', w: 600, h: 400, c1: '#111a3a', c2: '#5577ff', label: '3:2'  },
      { id: 'pau',       w: 705, h: 300, c1: '#6ca0d6', c2: '#c9934c', label: '2.35:1' },
      { id: 'bordeaux',  w: 450, h: 600, c1: '#3a558c', c2: '#f08242', label: '3:4'  },
      { id: 'shanghai',  w: 480, h: 480, c1: '#1b0d14', c2: '#e03a28', label: '1:1'  }
    ];
    for (const s of specs) {
      const cv = document.createElement('canvas');
      cv.width = s.w; cv.height = s.h;
      const ctx = cv.getContext('2d');
      const g = ctx.createLinearGradient(0, 0, 0, s.h);
      g.addColorStop(0, s.c1);
      g.addColorStop(1, s.c2);
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, s.w, s.h);
      // Distinct architectural silhouette & frame edge markers to visually prove zero cropping.
      ctx.fillStyle = 'rgba(10, 18, 42, 0.72)';
      ctx.fillRect(s.w * 0.14, s.h * 0.42, s.w * 0.16, s.h * 0.58);
      ctx.fillRect(s.w * 0.36, s.h * 0.24, s.w * 0.22, s.h * 0.76);
      ctx.fillRect(s.w * 0.66, s.h * 0.36, s.w * 0.18, s.h * 0.64);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.85)';
      ctx.lineWidth = Math.max(4, Math.round(Math.min(s.w, s.h) * 0.02));
      ctx.strokeRect(ctx.lineWidth / 2, ctx.lineWidth / 2, s.w - ctx.lineWidth, s.h - ctx.lineWidth);
      const url = cv.toDataURL('image/png');
      const img = document.querySelector('[data-city-slot="' + s.id + '"] img');
      await new Promise(res => { img.onload = res; img.src = url; });
    }
    window.dispatchEvent(new Event('resize'));
    await new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)));
  })()`);
}

async function run(c) {
  const stroke = (dir, magnitude = 150) =>
    touch
      ? c.swipe(dir * magnitude, { x: width / 2, y0: height / 2, steps: 6, ms: 90 })
      : c.wheel(dir * magnitude, width / 2, height / 2);

  if (mode === 'reduced') {
    await c.send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] });
    await sleep(350);
  }
  if (!touch) await c.send('Input.dispatchMouseEvent', { type: 'mouseMoved', x: width / 2, y: height / 2 });
  await c.evaluate(monitor);

  if (mode === 'mixed') {
    await injectMixedAspectPhotos(c);
    await sleep(300);
    // Test mixed aspects across Desktop (1440x900), Laptop (1280x720), Tablet (768x1024), and Mobile (390x844)!
    const mixedChecks = [];
    for (const vp of [
      { name: 'desktop', w: 1440, h: 900, t: false },
      { name: 'laptop', w: 1280, h: 720, t: false },
      { name: 'tablet', w: 768, h: 1024, t: true },
      { name: 'mobile', w: 390, h: 844, t: true }
    ]) {
      if (vp.t) await c.mobile(vp.w, vp.h, 2);
      else await c.desktop(vp.w, vp.h, 1);
      await sleep(350);
      const g = await c.evaluate('memoryQA.geometry()');
      const overflowX = await c.evaluate('document.documentElement.scrollWidth > innerWidth');
      assert.equal(overflowX, false, `mixed ${vp.name}: zero horizontal overflow`);
      assert.deepEqual(g.photoOverlaps, [], `mixed ${vp.name}: zero photo overlaps`);
      assert.deepEqual(g.titleOverlaps, [], `mixed ${vp.name}: zero title-photo overlaps`);
      assert.ok(g.items.every(x => x.fits), `mixed ${vp.name}: all cities and photos fit viewport`);
      assert.ok(g.items.every(x => x.objectFit === 'contain'), `mixed ${vp.name}: object-fit contain`);
      assert.ok(g.items.every(x => x.arDelta < 0.04), `mixed ${vp.name}: exact natural aspect ratios preserved`);
      mixedChecks.push({ viewport: vp.name, width: vp.w, height: vp.h, items: g.items, photoOverlaps: g.photoOverlaps, titleOverlaps: g.titleOverlaps });
    }
    await c.desktop(1440, 900, 1);
    await sleep(300);
    // Trigger Scroll 2 and capture revealed mixed-aspect composition!
    await stroke(1, 200);
    await until(c, "memoryQA.status().scene === 'revealed'", 12000);
    await sleep(250);
    await png(c, 'mixed-desktop-complete');
    // Also capture tablet & mobile revealed mixed-aspect shots!
    await c.mobile(768, 1024, 2);
    await sleep(350);
    await png(c, 'mixed-tablet-complete');
    await c.mobile(390, 844, 2);
    await sleep(350);
    await png(c, 'mixed-mobile-complete');
    report.mixedChecks = mixedChecks;
    report.checks.push('Verified 8 mixed aspect ratios (16:9, 2:3, 4:3, 9:16, 3:2, 2.35:1, 3:4, 1:1) across desktop/laptop/tablet/mobile with zero crop and zero overlap');
    assert.deepEqual(c.errors, []);
    return;
  }

  if (record) {
    c.on('Page.screencastFrame', ({ data, metadata, sessionId }) => {
      c.send('Page.screencastFrameAck', { sessionId }).catch(() => {});
      const time = metadata.timestamp * 1000;
      if (!frames.length || time - frames.at(-1).time >= 1000 / 42) frames.push({ time, jpeg: Buffer.from(data, 'base64') });
    });
    await c.send('Page.startScreencast', { format: 'jpeg', quality: 88 });
  }

  if (fullJourney) {
    await c.evaluate("scrollTo({top:Math.round(document.querySelector('#journey').getBoundingClientRect().top + scrollY),behavior:'instant'})");
    await sleep(1000);
    await stroke(1);
    await until(c, "memoryQA.status().globe === 'Shanghai' && Math.abs(scrollY-window.__magneticCV.snapshot().chapters[0].top) < 3", 25000);
    await sleep(1100);
    await stroke(1);
    await until(c, "window.__magneticCV.snapshot().activeId === 'introduction' && !window.__magneticCV.snapshot().animating");
    await sleep(550);
    report.checks.push('Played the existing Globe from Doha to Shanghai and entered Profile with one stroke');
  }

  // 1. Validate completely invisible photo slots and zero connecting lines before Scroll 2.
  const before = await c.evaluate('memoryQA.status()');
  if (mode !== 'reduced') {
    assert.equal(before.scene, 'waiting');
    const inv = await c.evaluate('memoryQA.invisibleCheck()');
    report.invisibleBefore = inv;
    assert.equal(inv.forbiddenNodes, 0, 'zero empty-frame chrome/placeholder nodes in DOM');
    assert.ok(inv.items.every(x => x.noConnector), 'zero connecting lines on city names');
    assert.ok(inv.items.every(x => x.figTransparent && x.apTransparent && x.imgHidden && x.canvasHidden), 'all 8 photo slots 100% invisible on Scroll 1');
    report.checks.push('Confirmed zero visible empty frames and zero connecting lines on Scroll 1');
  }

  const geo = await c.evaluate('memoryQA.geometry()');
  report.geometry = geo;
  assert.deepEqual(geo.items.map(x => x.id), cities);
  assert.ok(geo.items.every(x => x.imgReady && x.alt), 'eight decoded images have descriptions');
  assert.ok(geo.items.every(x => x.objectFit === 'contain'), 'all photos use object-fit: contain');
  assert.ok(geo.items.every(x => x.arDelta < 0.04), 'all photos preserve natural intrinsic aspect ratio');
  assert.ok(geo.items.every(x => x.fits), 'all city names and photos fit cleanly within viewport');
  assert.deepEqual(geo.photoOverlaps, [], 'zero pairwise photographic overlaps');
  assert.deepEqual(geo.titleOverlaps, [], 'zero city-title/photo overlaps');
  assert.ok(await c.evaluate('document.documentElement.scrollWidth <= innerWidth'), 'zero horizontal overflow');

  if (fullJourney) await png(c, 'intact');

  // 2. Scroll 2 -> Two-Wave Sequential Choreography (Wave 1 ASCII -> Hold -> Wave 2 Real Photos).
  if (before.scene !== 'revealed') {
    await c.evaluate('memoryQA.start()');
    const seqStarted = Date.now();
    await stroke(1, 210);
    await until(c, "['revealing','revealed'].includes(memoryQA.status().scene)");
    if (fullJourney) {
      // Aggressive wheel packets, reversal, and long decaying trackpad momentum tail must NOT skip stages or advance to Experience.
      await sleep(300);
      await stroke(1, 1800);
      await stroke(-1, 600);
      await until(c, "memoryQA.status().wave === 'wave2' && memoryQA.status().city === 'bordeaux'", 12000);
      const tail = [];
      for (let i = 0; i < 36; i++) {
        tail.push(stroke(1, Math.max(2, Math.round(115 * 0.92 ** i))));
        await sleep(18);
      }
      await Promise.all(tail);
    }
    await until(c, "memoryQA.status().scene === 'revealed'", 12000);
    report.sequenceWallMs = Date.now() - seqStarted;
    await c.evaluate('memoryQA.stop()');
  }

  await sleep(350);
  assert.equal(await c.evaluate('memoryQA.status().activeId'), 'introduction');
  report.checks.push('Two-wave reveal completed cleanly while Profile held its anchor');
  if (mode !== 'pacing') await png(c, mode + '-complete');

  // 3. Scroll 3 -> Navigates normally to Experience.
  await stroke(1);
  await sleep(1750);
  report.afterThird = await c.evaluate('memoryQA.status()');
  assert.equal(report.afterThird.activeId, 'experience', 'one fresh stroke goes to Experience');

  if (mode === 'laptop') {
    await c.evaluate('history.back()');
    await until(c, "memoryQA.status().scene === 'revealed' && memoryQA.status().activeId === 'introduction'");
    await c.evaluate('history.forward()');
    await until(c, "memoryQA.status().activeId === 'experience'");
    report.checks.push('Browser Back restores finished Profile and Forward restores Experience');
  }

  // 4. Reverse navigation -> Restores completed Profile, then reverses back to clean invisible Profile, then Shanghai.
  if (fullJourney || touch) {
    await stroke(-1);
    await sleep(1750);
    assert.equal(await c.evaluate('memoryQA.status().scene'), 'revealed');
    await stroke(-1);
    await until(c, "memoryQA.status().scene === 'waiting'", 10000);
    await sleep(400);
    assert.equal(await c.evaluate('memoryQA.status().activeId'), 'introduction');
    const invAfter = await c.evaluate('memoryQA.invisibleCheck()');
    assert.ok(invAfter.items.every(x => x.imgHidden && x.canvasHidden), 'reverse restoration leaves zero half-revealed photos');
    if (fullJourney) await png(c, 'reversed-intact');
    await stroke(-1);
    await sleep(1750);
    assert.equal(await c.evaluate('memoryQA.status().globe'), 'Shanghai');
    assert.ok(await c.evaluate("Math.abs(scrollY-window.__magneticCV.snapshot().chapters[0].top) < 3"));
    report.checks.push('Experience -> completed Profile -> clean reverse restoration -> Shanghai');
  }

  const { log, intervals, stalls, drift, globeCities, moves, clicks } = await c.evaluate('memoryQA.results()');
  report.log = log;
  report.pacing = stats(intervals);
  report.stalls = stalls;
  report.globeCities = globeCities;
  report.drift = drift;
  assert.equal(drift, 0, 'Profile viewport anchor stayed locked with zero scroll drift');

  if (mode !== 'reduced') {
    const revealing = log.filter(x => x.scene === 'revealing');
    const w1 = revealing.filter(x => x.wave === 'wave1');
    const hold = revealing.filter(x => x.wave === 'hold');
    const w2 = revealing.filter(x => x.wave === 'wave2');

    const w1Cities = [...new Set(w1.map(x => x.city).filter(Boolean))];
    const w2Cities = [...new Set(w2.map(x => x.city).filter(Boolean))];
    report.waveSummary = {
      wave1Cities: w1Cities,
      holdFrames: hold.length,
      wave2Cities: w2Cities,
      durationMs: revealing.length ? Math.round((log.find(x => x.scene === 'revealed')?.time ?? revealing.at(-1).time) - revealing[0].time) : 0
    };

    assert.deepEqual(w1Cities, cities, 'Wave 1 forms all eight cities in exact order');
    assert.ok(w1.every(x => x.slots.every(s => s !== 'resolving' && s !== 'photo')), 'ZERO real photos appear during Wave 1');
    assert.ok(hold.length >= 1, 'Collective all-eight-ASCII hold occurred');
    assert.ok(hold.some(x => x.slots.every(s => s === 'ascii')), 'All eight cities simultaneously visible in ASCII during hold');
    assert.deepEqual(w2Cities, cities, 'Wave 2 reveals all eight real photographs in exact order');
    assert.ok(report.waveSummary.durationMs >= 4600 && report.waveSummary.durationMs <= 7200, `actual playback duration ${report.waveSummary.durationMs}ms`);
  }

  if (mode === 'reduced') assert.ok(intervals.length < 50);
  if (!touch) { assert.equal(moves, 0); assert.equal(clicks, 0); }
  report.errors = c.errors;
  assert.deepEqual(c.errors, []);

  if (record) {
    await c.send('Page.stopScreencast');
    const revealing = log.filter(x => x.scene === 'revealing');
    function extract(pred, fraction, name) {
      const row = revealing.find(pred);
      if (!row) return;
      const next = log[log.indexOf(row) + 1];
      const time = row.time + ((next?.time ?? row.time) - row.time) * fraction;
      const frame = frames.reduce((best, f) => Math.abs(f.time - time) < Math.abs(best.time - time) ? f : best);
      writeFileSync(join(out, name + '.jpg'), frame.jpeg);
    }
    extract(x => x.wave === 'wave1' && x.city === 'doha' && x.slots[0] === 'forming', 0.22, 'wave1-doha-current');
    extract(x => x.wave === 'wave1' && x.city === 'paris' && x.slots[1] === 'forming', 0.22, 'wave1-doha-ascii-paris-current');
    extract(x => x.wave === 'wave1' && x.city === 'singapore' && x.slots[4] === 'forming', 0.22, 'wave1-halfway');
    extract(x => x.wave === 'wave1' && x.city === 'shanghai' && x.slots[7] === 'forming', 0.22, 'wave1-shanghai-transfer');
    extract(x => x.wave === 'hold', 0.5, 'hold-all-ascii');
    extract(x => x.wave === 'wave2' && x.city === 'doha', 0.5, 'wave2-doha-morph');
    extract(x => x.wave === 'wave2' && x.city === 'singapore', 0.5, 'wave2-halfway');
    extract(x => x.wave === 'wave2' && x.city === 'shanghai', 0.5, 'wave2-shanghai-morph');
    report.movieSeconds = Math.round((frames.at(-1).time - frames[0].time) / 1000);
    await encode();
  }
}

await server('after');
let c;
try {
  c = await browser({ width, height, touch, dsf: touch ? 2 : 1, path: fullJourney ? '/' : '/#introduction' });
  await run(c);
  report.pass = true;
} catch (error) {
  report.error = String(error);
  if (c) {
    report.failureState = await c.evaluate('window.memoryQA?.status()').catch(() => null);
    report.errors = c.errors;
    await png(c, mode + '-failure').catch(() => {});
  }
  process.exitCode = 1;
} finally {
  await c?.close();
  stopServers();
  save(mode, report);
  console.log(JSON.stringify({ mode, pass: report.pass, error: report.error, waveSummary: report.waveSummary, status: report.failureState, pacing: report.pacing }));
}
