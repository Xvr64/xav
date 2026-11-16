// How much of the living ocean can actually be SEEN: the ocean's own canvas at real contrast,
// each behaviour against the same instant without it. Numbers, so that "visible" is not a matter
// of opinion and a later change cannot quietly make the water invisible again.
//
//   node dev/phase3-visible.mjs [after|before] [widths]     (before = PHASE2_BASE, a snapshot of another tree)
//
// A pixel "shows" when its luminance differs by more than SEEN levels of 255 from the frame it is
// compared with (the ocean dithers by half a level; JPEG adds two or three).
// Output: <PHASE3_OUT or artifacts/phase3>/visible-<variant>.json
import { resolve } from 'node:path';

process.env.PHASE2_OUT = resolve(process.env.PHASE3_OUT || 'artifacts/phase3');
const variant = process.argv[2] === 'before' ? 'before' : 'after';
const widths = (process.argv[3] || '1440,390,320').split(',');
const { browser, save, server, stopServers } = await import('./phase2-lib.mjs');
const { sleep } = await import('./fable-cdp.mjs');

const SEEN = 8;
const VIEWS = {
  1440: { width: 1440, height: 900 },
  390: { width: 390, height: 844, touch: true, dsf: 2 },
  320: { width: 320, height: 740, touch: true, dsf: 2 }
};
const OFF = { inertia: false, flow: false, wake: false, sea: false };
const top = (c, id) => c.evaluate(`document.getElementById('${id}').getBoundingClientRect().top + scrollY`);
const round = (v, n = 1) => Math.round(v * 10 ** n) / 10 ** n;

/** In the page: frames as luminance arrays, and the comparison of two of them. */
const HELPERS = `
  window.__lum = async (dataUrl) => {
    const image = new Image(); image.src = dataUrl; await image.decode();
    const canvas = document.createElement('canvas'); canvas.width = image.width; canvas.height = image.height;
    const ctx = canvas.getContext('2d', { willReadFrequently: true }); ctx.drawImage(image, 0, 0);
    const px = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
    const lum = new Float32Array(px.length / 4);
    for (let i = 0; i < lum.length; i++) lum[i] = 0.2126 * px[i * 4] + 0.7152 * px[i * 4 + 1] + 0.0722 * px[i * 4 + 2];
    return lum;
  };
  window.__frame = (t) => window.__lum(window.__asciiOcean.render(t).image);
  // Share of pixels that show a difference, and how large the difference is where it shows
  window.__differ = (a, b) => {
    let seen = 0, sum = 0; const d = [];
    for (let i = 0; i < a.length; i++) { const v = Math.abs(a[i] - b[i]); if (v > ${SEEN}) { seen++; sum += v; d.push(v); } }
    d.sort((x, y) => x - y);
    return { share: seen / a.length * 100, mean: seen ? sum / seen : 0, p95: d.length ? d[Math.floor(d.length * 0.95)] : 0 };
  };
  // How far the ocean's own marks stand off the water: the 99th percentile of luminance against the median
  window.__standOff = (a) => { const s = Array.from(a).sort((x, y) => x - y); return s[Math.floor(s.length * 0.99)] - s[s.length >> 1]; };
`;
const fmt = (d) => ({ share: round(d.share, 2), mean: round(d.mean), p95: round(d.p95) });

try {
  await server(variant);
  const report = {};
  for (const view of widths) {
    const r = (report[view] = { flow: {}, sea: {}, wake: {}, inertia: {} });
    const c = await browser({ ...VIEWS[view], variant, path: '/?ocean=none' });
    try {
      await c.evaluate(HELPERS);
      const vh = VIEWS[view].height;
      const ocean = (expr) => c.evaluate(`(async () => { const o = window.__asciiOcean; return ${expr}; })()`);

      // 1. Flow and sea states: the same instant with and without, and how much of the water is
      //    seen to change over half a second (movement the eye can follow)
      await c.evaluate(`window.__ambientWhales?.seek(21)`);
      await ocean('o.pause(true)');
      for (const id of ['experience', 'skills', 'education', 'languages', 'interests', 'contact']) {
        await c.evaluate(`scrollTo(0, ${(await top(c, id)) - vh * 0.2})`); await sleep(500);
        const row = await c.evaluate(`(async () => {
          const o = window.__asciiOcean, out = {};
          const take = async (fx) => { o.set(fx); return [await window.__frame(40), await window.__frame(40.5)]; };
          const none = await take(${JSON.stringify(OFF)});
          const flow = await take(${JSON.stringify({ ...OFF, flow: true })});
          const sea = await take(${JSON.stringify({ ...OFF, sea: true })});
          const both = await take(${JSON.stringify({ ...OFF, flow: true, sea: true })});
          o.set(${JSON.stringify(OFF)});
          return {
            standOff: { none: window.__standOff(none[0]), flow: window.__standOff(flow[0]), both: window.__standOff(both[0]) },
            against: { flow: window.__differ(flow[0], none[0]), sea: window.__differ(sea[0], none[0]), both: window.__differ(both[0], none[0]) },
            moving: { none: window.__differ(none[1], none[0]), flow: window.__differ(flow[1], flow[0]), sea: window.__differ(sea[1], sea[0]), both: window.__differ(both[1], both[0]) }
          };
        })()`);
        r.flow[id] = {
          standOff: Object.fromEntries(Object.entries(row.standOff).map(([k, v]) => [k, round(v)])),
          against: Object.fromEntries(Object.entries(row.against).map(([k, v]) => [k, fmt(v)])),
          movingInHalfSecond: Object.fromEntries(Object.entries(row.moving).map(([k, v]) => [k, fmt(v)]))
        };
        console.log('VISIBLE', variant, view, id, JSON.stringify(r.flow[id]));
      }

      // 2. Wake: the whales swim their own path for eight seconds; the water then, against the same
      //    instant with the wake taken away. Then the whales hold still and the water is timed home.
      await ocean(`(o.set(${JSON.stringify({ ...OFF, flow: true, sea: true, wake: true })}), o.pause(false))`);
      await c.evaluate(`scrollTo(0, ${(await top(c, 'experience')) + 60})`); await sleep(1200);
      await c.evaluate(`(() => { const s = performance.now(); window.__swim = true; const f = (t) => { if (!window.__swim) return; window.__ambientWhales.seek(18 + (t - s) / 1000); requestAnimationFrame(f); }; requestAnimationFrame(f); })()`);
      const marks = [];
      for (let i = 0; i < 4; i++) {
        await sleep(2000);
        marks.push(await c.evaluate(`(async () => {
          const o = window.__asciiOcean;
          const r = o.read(); let stirred = 0, flowing = 0;
          for (let i = 0; i < r.wake.length; i += 4) { if (r.wake[i + 2] > 8) stirred++; if (Math.hypot(r.wake[i] - 128, r.wake[i + 1] - 128) > 6) flowing++; }
          return { stirredCells: stirred / (r.cols * r.rows) * 100, movedCells: flowing / (r.cols * r.rows) * 100, bodies: o.stats().wake.bodies.length };
        })()`));
      }
      const wake = await c.evaluate(`(async () => {
        const o = window.__asciiOcean;
        window.__swim = false;
        o.pause(true);
        const t = o.state().time;
        const withWake = await window.__frame(t);
        const cells = o.read();
        // The same instant without the wake: the memory is cleared by the switch, so this comes second
        o.set({ wake: false });
        const without = await window.__frame(t);
        o.set({ wake: true }); o.pause(false);
        return { differ: window.__differ(withWake, without), standOff: { with: window.__standOff(withWake), without: window.__standOff(without) } };
      })()`);
      r.wake.whileSwimming = marks.map((m) => ({ stirredCells: round(m.stirredCells), movedCells: round(m.movedCells), bodies: m.bodies }));
      r.wake.againstNoWake = fmt(wake.differ);
      r.wake.standOff = { with: round(wake.standOff.with), without: round(wake.standOff.without) };
      // Lifetime: swim again, then hold the whales still and wait for the water
      await c.evaluate(`(() => { const s = performance.now(); window.__swim = true; const f = (t) => { if (!window.__swim) return; window.__ambientWhales.seek(18 + (t - s) / 1000); requestAnimationFrame(f); }; requestAnimationFrame(f); })()`);
      await sleep(6000);
      await c.evaluate(`(window.__swim = false, window.__ambientWhales.seek(24))`);
      const energy = () => ocean(`(() => { const r = o.read(); let stirred = 0, any = 0; for (let i = 0; i < r.wake.length; i += 4) { if (r.wake[i + 2] > 36) stirred++; if (r.wake[i + 2] > 0 || r.wake[i] !== 128 || r.wake[i + 1] !== 128) any++; } return [stirred, any]; })()`);
      const fade = [];
      for (let i = 0; i < 30; i++) { const [stirred, any] = await energy(); fade.push([i * 0.5, stirred, any]); if (!any) break; await sleep(500); }
      r.wake.trailSeenForSeconds = (fade.find(([, stirred]) => stirred === 0) || [null])[0];
      r.wake.restExactAfterSeconds = (fade.find(([, , any]) => any === 0) || [null])[0];
      await c.evaluate(`window.__ambientWhales.release()`);
      console.log('VISIBLE', variant, view, 'wake', JSON.stringify(r.wake));

      // 3. Inertia: scroll steadily, stop dead, follow the water
      await ocean(`o.set(${JSON.stringify({ ...OFF, inertia: true })})`);
      const y0 = (await top(c, 'experience')) - 300;
      for (const speed of [600, 1500, 3000]) {
        await c.evaluate(`scrollTo(0, ${y0})`); await sleep(1200);
        const trace = await c.evaluate(`new Promise((resolve) => {
          const o = window.__asciiOcean, out = { during: [], after: [] }; const t0 = performance.now(); let stopped = 0;
          const f = (t) => {
            const s = (t - t0) / 1000;
            if (s < 1.2) { scrollTo(0, ${y0} + s * ${speed}); out.during.push(o.stats().lead); }
            else { if (!stopped) stopped = t; out.after.push([Math.round(t - stopped), o.stats().lead]); }
            if (s < 4.2) requestAnimationFrame(f); else resolve(out);
          };
          requestAnimationFrame(f);
        })`);
        // How far the water still travels once the page has stopped, whichever way the model has it go
        const leads = trace.after.map((x) => x[1]);
        const start = leads[0];
        const extreme = leads.reduce((a, b) => (Math.abs(b - start) > Math.abs(a - start) ? b : a), start);
        const travel = Math.abs(extreme - start) + Math.abs(extreme - leads.at(-1));
        const still = trace.after.find(([, lead], i) => trace.after.slice(i).every((x) => Math.abs(x[1] - leads.at(-1)) < 1));
        r.inertia[speed] = {
          behindWhileScrolling: round(-trace.during.at(-1)),
          travelAfterStopPx: round(travel),
          reversesPx: round(Math.abs(extreme - leads.at(-1))),
          stillAfterMs: still ? still[0] : null,
          restExact: leads.at(-1) === 0
        };
      }
      console.log('VISIBLE', variant, view, 'inertia', JSON.stringify(r.inertia), JSON.stringify(c.errors));
      r.errors = c.errors;
    } finally { await c.close(); }
    save(`visible-${variant}`, report);
  }
} finally { stopServers(); }
process.exit(0);
