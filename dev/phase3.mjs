// Phase III QA harness: the living ocean (oceanExperiments.ts), one behaviour at a time.
// Private headless Chrome over CDP, a fresh profile per browser (so every shader compile is cold),
// its own Vite dev server. The behaviours are development flags: ?ocean=none|inertia|flow|wake|sea|all
//
//   node dev/phase3.mjs smoke                      every configuration loads, links and draws without errors
//   node dev/phase3.mjs frames [widths]            matched before/after stills per behaviour
//   node dev/phase3.mjs water [widths]             the same, the ocean alone with its contrast raised (glyphs legible)
//   node dev/phase3.mjs motion                     inertia trace, glyph stability, wake build-up and fade
//   node dev/phase3.mjs perf [trials] [modes] [configs]   frame pacing, CPU, heap, ocean draw cost, compile time
//   node dev/phase3.mjs identical                  flags off: the ocean's frames equal the baseline's (PHASE2_BASE)
//   node dev/phase3-visible.mjs [after|before]     how much of each behaviour can be seen, in numbers
//
// Output: artifacts/phase3 (or PHASE3_OUT).
import { resolve } from 'node:path';
import assert from 'node:assert/strict';

process.env.PHASE2_OUT = resolve(process.env.PHASE3_OUT || 'artifacts/phase3');
const { browser, geometry, jpg, sample, save, scrollRun, server, stats, stopServers, task } = await import('./phase2-lib.mjs');
const { sleep } = await import('./fable-cdp.mjs');

const CONFIGS = ['none', 'inertia', 'flow', 'wake', 'sea', 'all'];
const VIEWS = {
  1440: { width: 1440, height: 900 },
  768: { width: 768, height: 1024, touch: true, dsf: 2 },
  390: { width: 390, height: 844, touch: true, dsf: 2 },
  320: { width: 320, height: 740, touch: true, dsf: 2 }
};
const SECTIONS = ['experience', 'skills', 'education', 'languages', 'interests', 'contact'];
const open = (view, config, extra = {}) => browser({ ...VIEWS[view], path: `/?ocean=${config}`, ...extra });
const ocean = (c, expr) => c.evaluate(`(() => { const o = window.__asciiOcean; return ${expr}; })()`);
const metrics = async (c) => Object.fromEntries((await c.send('Performance.getMetrics')).metrics.map((m) => [m.name, m.value]));
const cost = (a, b) => {
  const ms = (k) => Math.round((b[k] - a[k]) * 1000);
  return { script: ms('ScriptDuration'), style: ms('RecalcStyleDuration'), layout: ms('LayoutDuration'), task: ms('TaskDuration') };
};
const median = (list) => [...list].sort((a, b) => a - b)[Math.floor(list.length / 2)];
const top = (c, id) => c.evaluate(`document.getElementById('${id}').getBoundingClientRect().top + scrollY`);

/** The ocean's own draw (both passes, the wake step when due) with the GPU drained: ms, median of n. */
const drawCost = (c, n = 40) => ocean(c, `(() => { const ms = []; for (let i = 0; i < ${n}; i++) ms.push(o.render().ms); ms.sort((a, b) => a - b); return { median: Math.round(ms[${n} >> 1] * 100) / 100, p95: Math.round(ms[Math.floor(${n} * 0.95)] * 100) / 100 }; })()`);

async function smoke() {
  await server('after');
  const rows = [];
  for (const view of Object.keys(VIEWS)) {
    for (const config of CONFIGS) {
      const c = await open(view, config);
      try {
        const info = await ocean(c, `({ effects: o.effects(), stats: o.stats(), state: o.state() })`);
        await c.evaluate(`scrollTo(0, ${await top(c, 'experience')})`); await sleep(1500);
        const drawn = await ocean(c, `(() => { const r = o.read(); let cells = 0; for (let i = 1; i < r.cells.length; i += 4) if (r.cells[i] > 0) cells++; return { cells, total: r.cols * r.rows }; })()`);
        const row = { view, config, effects: info.effects, living: info.stats.living, compileMs: Math.round(info.stats.compileMs * 10) / 10, firstDrawMs: Math.round(info.stats.firstDrawMs * 10) / 10, glReady: info.state.glReady, grid: info.state.cells, drawn, errors: c.errors };
        rows.push(row);
        console.log('SMOKE', JSON.stringify(row));
        assert.equal(info.state.glReady, true);
        assert.equal(info.stats.living, config !== 'none' && config !== 'inertia', 'the living cell pass linked');
        assert.ok(drawn.cells > drawn.total * 0.1, 'the water has glyphs');
        assert.deepEqual(c.errors, []);
      } finally { await c.close(); }
    }
  }
  save('smoke', rows);
}

/**
 * Matched stills. The ocean is paused and drawn at one chosen moment for each configuration in
 * the same page, so only the behaviour under test differs between two frames; the whales are held
 * on their pure path at one moment too. The wake needs the whales to have swum, so its pair is
 * taken live: the same instant with and without it.
 */
async function frames() {
  await server('after');
  const widths = (process.argv[3] || '1440,390').split(',');
  for (const view of widths) {
    const c = await open(view, 'none');
    try {
      const shoot = async (name, config, t) => {
        await ocean(c, `o.set(${JSON.stringify(config)})`);
        await ocean(c, `(o.pause(true), o.render(${t}).ms)`);
        await sleep(120);
        await jpg(c, `frames/${view}-${name}`, 90);
      };
      const off = { inertia: false, flow: false, wake: false, sea: false };
      await c.evaluate(`window.__ambientWhales?.seek(21)`);
      // Flow: the cover (pale surface water) and a dark section
      for (const [where, y] of [['cover', 0], ['experience', (await top(c, 'experience')) - VIEWS[view].height * 0.18], ['interests', (await top(c, 'interests')) - VIEWS[view].height * 0.3]]) {
        await c.evaluate(`scrollTo(0, ${y})`); await sleep(900);
        await shoot(`${where}-a-before`, off, 40);
        await shoot(`${where}-b-flow`, { ...off, flow: true }, 40);
        await shoot(`${where}-c-flow-sea`, { ...off, flow: true, sea: true }, 40);
        await shoot(`${where}-d-sea`, { ...off, sea: true }, 40);
      }
      // Sea states: every section, the same moment, with flow (how the states read best) and without
      for (const id of SECTIONS) {
        await c.evaluate(`scrollTo(0, ${(await top(c, id)) - VIEWS[view].height * 0.12})`); await sleep(1200);
        await shoot(`sea-${id}-a-before`, off, 40);
        await shoot(`sea-${id}-b-sea`, { ...off, sea: true }, 40);
        await shoot(`sea-${id}-c-sea-flow`, { ...off, sea: true, flow: true }, 40);
      }
      // Wake: live whales, three seconds of swimming, then the same instant with and without
      await c.evaluate(`window.__ambientWhales?.release()`);
      await ocean(c, `(o.pause(false), o.set({ inertia: false, flow: true, wake: true, sea: false }))`);
      for (const [where, y] of [['experience', (await top(c, 'experience')) + 60], ['languages', (await top(c, 'languages')) - 80]]) {
        await c.evaluate(`scrollTo(0, ${y})`); await sleep(4200);
        const t = await ocean(c, `(o.pause(true), o.state().time)`);
        await sleep(60);
        await jpg(c, `frames/${view}-wake-${where}-b-wake`, 90);
        await ocean(c, `(o.set({ wake: false }), o.render(${t}).ms)`); await sleep(120);
        await jpg(c, `frames/${view}-wake-${where}-a-before`, 90);
        await ocean(c, `(o.set({ wake: true }), o.pause(false))`);
      }
      console.log('FRAMES', view, JSON.stringify(c.errors));
      assert.deepEqual(c.errors, []);
    } finally { await c.close(); }
  }
}

/** How the behaviours move: numbers for what a still cannot show. */
async function motion() {
  await server('after');
  const report = {};
  for (const view of ['1440', '390']) {
    const r = (report[view] = {});
    // 1. Inertia: scroll at a steady speed, stop dead, and follow the water
    let c = await open(view, 'inertia');
    try {
      const y0 = (await top(c, 'experience')) - 200;
      r.inertia = {};
      for (const speed of [600, 1500, 3000]) {
        await c.evaluate(`scrollTo(0, ${y0})`); await sleep(900);
        const trace = await c.evaluate(`new Promise((resolve) => {
          const o = window.__asciiOcean, out = { during: [], after: [] }; const t0 = performance.now(); let stopped = 0;
          const f = (t) => {
            const s = (t - t0) / 1000;
            if (s < 1.2) { scrollTo(0, ${y0} + s * ${speed}); out.during.push(o.stats().lead); }
            else { if (!stopped) stopped = t; out.after.push([Math.round(t - stopped), Math.round(o.stats().lead * 100) / 100]); }
            if (s < 4.2) requestAnimationFrame(f); else resolve(out);
          };
          requestAnimationFrame(f);
        })`);
        // The water follows a steady way behind a steady scroll, and after the stop carries on the
        // same way until it has caught up (waterInertia.ts): how far behind, how long, and whether
        // it ever runs past the page
        const settled = trace.after.find(([, lead], i) => Math.abs(lead) < 0.5 && trace.after.slice(i).every((x) => Math.abs(x[1]) < 0.5));
        r.inertia[speed] = {
          behindPx: Math.round(-trace.during.at(-1) * 100) / 100,
          carriesOnPx: Math.round(-trace.after[0][1] * 100) / 100, settledAtMs: settled ? settled[0] : null,
          restExact: trace.after.at(-1)[1] === 0, runsPastPx: Math.max(0, ...trace.after.map((x) => x[1]))
        };
      }
      console.log('MOTION inertia', view, JSON.stringify(r.inertia));
    } finally { await c.close(); }

    // 2. Glyph stability: share of drawn cells whose glyph changes from one 30 Hz frame to the next;
    // and density: the share of cells that hold a glyph, averaged over 24 moments far apart
    r.stability = {};
    for (const config of ['none', 'flow', 'sea', 'flow,sea']) {
      c = await open(view, config);
      try {
        const out = {};
        for (const id of ['home', ...SECTIONS]) {
          await c.evaluate(`scrollTo(0, ${id === 'home' ? 0 : (await top(c, id)) - 100})`); await sleep(900);
          out[id] = await ocean(c, `(() => {
            o.pause(true); const t0 = o.state().time; let prev = null, changed = 0, drawn = 0, kinds = {};
            for (let k = 0; k <= 30; k++) {
              o.render(t0 + k / 30); const r = o.read();
              if (prev) for (let i = 0; i < r.cells.length; i += 4) { if (r.cells[i + 1] > 0) { drawn++; if (r.cells[i] !== prev[i]) changed++; } }
              if (k === 30) for (let i = 0; i < r.cells.length; i += 4) if (r.cells[i + 1] > 0) { const ch = [...r.characters][r.cells[i]]; kinds[ch] = (kinds[ch] || 0) + 1; }
              prev = r.cells;
            }
            let held = 0, ink = 0, all = 0;
            for (let k = 0; k < 24; k++) {
              o.render(100 + k * 41.3); const r = o.read();
              for (let i = 0; i < r.cells.length; i += 4) { all++; if (r.cells[i + 1] > 0) { held++; ink += r.cells[i + 1] / 255; } }
            }
            o.render(t0); o.pause(false);
            return { changePerFrame: Math.round((changed / Math.max(1, drawn)) * 10000) / 100, density: Math.round((held / all) * 1000) / 10, ink: Math.round((ink / all) * 1000) / 1000, glyphs: kinds };
          })()`);
        }
        r.stability[config] = out;
        console.log('MOTION stability', view, config, JSON.stringify(out));
      } finally { await c.close(); }
    }

    // 3. Wake: energy in the water while the whales swim, after a scroll, and once they are gone
    c = await open(view, 'flow,wake');
    try {
      const energy = () => ocean(c, `(() => { const r = o.read(); let sum = 0, cells = 0, peak = 0; for (let i = 0; i < r.wake.length; i += 4) { const m = Math.hypot(r.wake[i] - 128, r.wake[i + 1] - 128) / 127; if (m > 0.02) cells++; sum += m; peak = Math.max(peak, m); } return { movedShare: Math.round(cells / (r.cols * r.rows) * 1000) / 10, mean: Math.round(sum / (r.cols * r.rows) * 1000) / 1000, peak: Math.round(peak * 100) / 100, bodies: o.stats().wake.bodies.length, live: o.stats().wake.live }; })()`);
      const y = (await top(c, 'experience')) + 40;
      await c.evaluate(`scrollTo(0, ${y})`); await sleep(5000);
      r.wake = { swimming: await energy() };
      await scrollRun(c, y, y + 500, 1000);
      r.wake.afterScroll = await energy();
      await sleep(900);
      r.wake.oneSecondLater = await energy();
      // The whales hold still (their pure path at one moment): the water must come back to rest exactly
      await c.evaluate(`window.__ambientWhales.seek(21)`);
      await sleep(250);
      const fade = [];
      for (let i = 0; i < 12; i++) { fade.push((await energy()).mean); await sleep(500); }
      r.wake.fadeEveryHalfSecond = fade;
      r.wake.restExact = fade.at(-1) === 0;
      await c.evaluate(`window.__ambientWhales.release()`);
      console.log('MOTION wake', view, JSON.stringify(r.wake), JSON.stringify(c.errors));
      assert.deepEqual(c.errors, []);
    } finally { await c.close(); }
    save('motion', report);
  }
}

async function perf() {
  const trials = Number(process.argv[3] || 2);
  const modes = (process.argv[4] || '1440,390').split(',');
  const configs = (process.argv[5] || CONFIGS.join('|')).split('|');
  const tag = process.argv[6] || 'performance';
  await server('after');
  const results = [];
  for (const view of modes) {
    for (let trial = 1; trial <= trials; trial++) {
      // Alternate the order, so warm-up and thermal drift do not favour one side
      for (const config of trial % 2 ? configs : [...configs].reverse()) {
        const c = await open(view, config);
        try {
          await c.send('Performance.enable');
          const g = await geometry(c);
          const r = { view, config, trial, compileMs: Math.round((await ocean(c, 'o.stats().compileMs')) * 10) / 10 };

          // 1. Reading the CV top to bottom (first pass, every line decoding)
          await c.evaluate(`scrollTo(0, ${g.intro - g.vh})`); await sleep(1200);
          let m0 = await metrics(c);
          r.cv = stats(await scrollRun(c, g.intro - g.vh, g.max, 900));
          await sleep(900);
          r.cvCost = cost(m0, await metrics(c));

          // 2. The cover, down to the Globe
          await c.evaluate('scrollTo(0,0)'); await sleep(1000);
          r.hero = stats(await scrollRun(c, 0, g.journey - g.vh * 0.2, 700));

          // 3. The Globe's film, Doha to Shanghai
          await c.evaluate(`scrollTo(0, ${g.journey})`); await sleep(1400);
          if (VIEWS[view].touch) await c.swipe(260, { ms: 140 }); else await c.wheel(120);
          r.globe = stats(await sample(c, 9000));
          await sleep(2300);
          r.endCity = await c.evaluate(`document.querySelector('.globe-caption [aria-hidden="false"] .globe-city')?.textContent`);
          assert.equal(r.endCity, 'Shanghai');

          // 4. Idle in the CV: whales swimming, water drifting, the wake running
          await c.evaluate(`scrollTo(0, ${g.intro} + 900)`); await sleep(1500);
          m0 = await metrics(c);
          r.idle = stats(await sample(c, 4000));
          r.idleCost = cost(m0, await metrics(c));

          // 5. Stop-and-go reading scroll: the inertia's own case
          const y = g.intro + 600;
          await c.evaluate(`scrollTo(0, ${y})`); await sleep(600);
          r.stopGo = stats(await c.evaluate(`new Promise((resolve) => { const d = []; let last = 0; const t0 = performance.now(); const f = (t) => { if (last) d.push(t - last); last = t; const s = (t - t0) / 1000; const phase = s % 1; scrollTo(0, ${y} + Math.floor(s) * 420 + Math.min(1, phase / 0.35) * 420); if (s < 5) requestAnimationFrame(f); else resolve(d); }; requestAnimationFrame(f); })`));

          r.oceanDrawMs = await drawCost(c);
          const m = await metrics(c);
          r.heapMB = Math.round((m.JSHeapUsedSize / 1048576) * 10) / 10;
          r.errors = c.errors;
          results.push(r);
          save(tag, results);
          console.log('PERF', JSON.stringify(r));
          assert.deepEqual(c.errors, []);
        } finally { await c.close(); }
      }
    }
  }
}

/** With every flag off the ocean must draw what the baseline tree draws: same moment, same scroll, same pixels. */
async function identical() {
  const views = ['1440', '390'];
  // One tree at a time: two Vite servers share node_modules/.vite and reload each other's pages
  const grab = async (variant) => {
    await server(variant);
    const shots = {};
    for (const view of views) {
      const c = await browser({ ...VIEWS[view], variant, path: '/' });
      try {
        shots[view] = [];
        for (const y of [0, 1400, 8900, 10200, 11800]) {
          await c.evaluate(`scrollTo(0, ${y})`); await sleep(700);
          shots[view].push(await c.evaluate(`(window.__asciiOcean.pause(true), window.__asciiOcean.render(33.3).image)`));
        }
      } finally { await c.close(); }
    }
    stopServers(); await sleep(1500);
    return shots;
  };
  const a = await grab('before');
  const b = await grab('after');
  // The ocean dithers every frame by half a colour level, seeded by a frame count the harness
  // cannot set, so two draws of the same water are not always byte-identical. The frames are
  // kept, and dev/phase3-diff.py measures how far apart they are: a dither is a level or two
  // spread thinly; a different glyph would be tens of levels in a cell.
  const { writeFileSync, mkdirSync } = await import('node:fs');
  const dir = resolve(process.env.PHASE2_OUT, 'identical');
  mkdirSync(dir, { recursive: true });
  const out = [];
  for (const view of views) a[view].forEach((image, i) => {
    writeFileSync(resolve(dir, `${view}-${i}-before.jpg`), Buffer.from(image.split(',')[1], 'base64'));
    writeFileSync(resolve(dir, `${view}-${i}-after.jpg`), Buffer.from(b[view][i].split(',')[1], 'base64'));
    out.push({ view, frame: i, byteIdentical: image === b[view][i] });
  });
  console.log('IDENTICAL', JSON.stringify(out));
  save('identical', out);
}

/**
 * The water alone: the ocean's own canvas (no whales, no copy over it), and the whales' spines
 * drawn over it as thin lines. phase3-sheet.py --enhance stretches its contrast for reading.
 * `at` draws a chosen moment; without it the frame is the live one, wake included.
 */
const waterShot = async (c, name, { at = null, spines = false } = {}) => {
  const data = await c.evaluate(`(async () => {
    const o = window.__asciiOcean;
    const image = new Image();
    image.src = o.render(${at === null ? '' : at}).image;
    await image.decode();
    const canvas = document.createElement('canvas');
    canvas.width = image.width; canvas.height = image.height;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(image, 0, 0);
    if (${spines}) {
      const live = (await import('/oceanDirection.ts')).ambientWhalesLive;
      const k = image.width / innerWidth;
      ctx.lineWidth = 2 * k; ctx.strokeStyle = 'rgba(255, 214, 120, 0.9)';
      for (const s of live.spines) {
        ctx.beginPath();
        for (let n = 0; n < 48; n++) ctx[n ? 'lineTo' : 'moveTo'](s[n * 2] * k, s[n * 2 + 1] * k);
        ctx.stroke();
        ctx.fillStyle = 'rgba(255, 214, 120, 0.9)';
        ctx.beginPath(); ctx.arc(s[0] * k, s[1] * k, 7 * k, 0, 7); ctx.fill();
      }
    }
    return canvas.toDataURL('image/jpeg', 0.92);
  })()`);
  const { writeFileSync, mkdirSync } = await import('node:fs');
  const file = resolve(process.env.PHASE2_OUT, 'water', name + '.jpg');
  mkdirSync(resolve(file, '..'), { recursive: true });
  writeFileSync(file, Buffer.from(data.split(',')[1], 'base64'));
  return file;
};

async function water() {
  await server('after');
  for (const view of (process.argv[3] || '1440,390').split(',')) {
    const c = await open(view, 'none');
    try {
      const off = { inertia: false, flow: false, wake: false, sea: false };
      const vh = VIEWS[view].height;
      await ocean(c, 'o.pause(true)');
      // Flow and sea states: one moment, every section
      for (const [where, y] of [['cover', 0], ...(await Promise.all(SECTIONS.map(async (id) => [id, (await top(c, id)) - vh * 0.25])))]) {
        await c.evaluate(`scrollTo(0, ${y})`); await sleep(500);
        for (const [label, fx] of [['a-before', off], ['b-flow', { ...off, flow: true }], ['c-sea', { ...off, sea: true }], ['d-flow-sea', { ...off, flow: true, sea: true }]]) {
          await ocean(c, `o.set(${JSON.stringify(fx)})`);
          await waterShot(c, `${view}-${where}-${label}`, { at: 40 });
        }
      }
      // Wake: live whales; the water as it is, then the same moment without the wake
      await ocean(c, `(o.set({ inertia: false, flow: true, wake: true, sea: true }), o.pause(false))`);
      const y = (await top(c, 'experience')) + 60;
      await c.evaluate(`scrollTo(0, ${y})`); await sleep(6000);
      for (let i = 0; i < 4; i++) {
        await ocean(c, 'o.pause(true)');
        const t = await ocean(c, 'o.state().time');
        await waterShot(c, `${view}-wake-${i}-b-wake`, { spines: true });
        await ocean(c, `o.set({ wake: false })`);
        await waterShot(c, `${view}-wake-${i}-a-before`, { at: t, spines: true });
        // Back on: the memory was cleared with the switch, so let it build again
        await ocean(c, `(o.set({ wake: true }), o.pause(false))`);
        await sleep(3500);
      }
      // After a reading scroll: the water the whales have just dived through
      await scrollRun(c, y, y + 420, 700); await sleep(250);
      await ocean(c, 'o.pause(true)');
      await waterShot(c, `${view}-wake-after-scroll`, { spines: true });
      await ocean(c, 'o.pause(false)');
      console.log('WATER', view, JSON.stringify(c.errors));
      assert.deepEqual(c.errors, []);
    } finally { await c.close(); }
  }
}

/** A whale's wake over time: frames a third of a second apart, live. */
async function strip() {
  await server('after');
  const view = process.argv[3] || '1440';
  const config = process.argv[4] || 'flow,wake';
  const c = await open(view, config);
  try {
    await c.evaluate(`scrollTo(0, ${(await top(c, 'experience')) + 60})`); await sleep(5000);
    for (let i = 0; i < 8; i++) { await jpg(c, `strip/${view}-${config.replace(/,/g, '-')}-${i}`, 90); await sleep(330); }
    // And during a reading scroll
    const y = (await top(c, 'experience')) + 60;
    c.evaluate(`new Promise((resolve) => { const t0 = performance.now(); const f = (t) => { const s = (t - t0) / 1000; scrollTo(0, ${y} + Math.min(s, 1.2) * 420); if (s < 4) requestAnimationFrame(f); else resolve(1); }; requestAnimationFrame(f); })`);
    for (let i = 0; i < 8; i++) { await sleep(330); await jpg(c, `strip/${view}-${config.replace(/,/g, '-')}-scroll-${i}`, 90); }
    console.log('STRIP', view, config, JSON.stringify(c.errors));
  } finally { await c.close(); }
}

try {
  if (task === 'smoke') await smoke();
  else if (task === 'strip') await strip();
  else if (task === 'water') await water();
  else if (task === 'frames') await frames();
  else if (task === 'motion') await motion();
  else if (task === 'perf') await perf();
  else if (task === 'identical') await identical();
  else throw Error('unknown task ' + task);
} finally { stopServers(); }
process.exit(0);
