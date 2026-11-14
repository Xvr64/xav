// Frame pacing and main-thread cost, before vs after Phase II. Sequential, alternating order,
// one benchmark browser at a time; Vite dev servers for both trees; diagnostics off.
//   node dev/phase2.mjs perf [trials=2] [desktop,mobile] [first=before|after] [tag]
import { browser, geometry, sample, save, scrollRun, server, stats } from './phase2-lib.mjs';
import { sleep } from './fable-cdp.mjs';
import assert from 'node:assert/strict';

const metrics = async (c) => Object.fromEntries((await c.send('Performance.getMetrics')).metrics.map((m) => [m.name, m.value]));
const cost = (a, b) => {
  const ms = (k) => Math.round((b[k] - a[k]) * 1000);
  return { script: ms('ScriptDuration'), style: ms('RecalcStyleDuration'), layout: ms('LayoutDuration'), task: ms('TaskDuration'), styleCount: b.RecalcStyleCount - a.RecalcStyleCount, layoutCount: b.LayoutCount - a.LayoutCount };
};

export default async function perf() {
  const trials = Number(process.argv[3] || 2);
  const modes = (process.argv[4] || 'desktop,mobile').split(',');
  const first = process.argv[5] || 'before';
  const tag = process.argv[6] || modes.join('-');
  await server('before');
  await server('after');
  const results = [];
  for (const mode of modes) {
    for (let trial = 1; trial <= trials; trial++) {
      for (const variant of (trial % 2 === 1) === (first === 'before') ? ['before', 'after'] : ['after', 'before']) {
        const c = await browser(mode === 'mobile' ? { variant, width: 390, height: 844, touch: true, dsf: 2 } : { variant });
        try {
          await c.send('Performance.enable');
          const g = await geometry(c);
          const r = { mode, variant, trial, nodes: g.nodes };

          // 1. First read of the CV: every line arrives while scrolling (the reveals' real cost)
          await c.evaluate(`scrollTo(0, ${g.intro - g.vh})`); await sleep(1200);
          let m0 = await metrics(c);
          r.cvFirst = stats(await scrollRun(c, g.intro - g.vh, g.max, 900));
          await sleep(900);
          r.cvFirstCost = cost(m0, await metrics(c));

          // 2. Second pass: everything already read (whales, ocean, veil, chapter rules only)
          await c.evaluate(`scrollTo(0, ${g.intro - g.vh * 0.5})`); await sleep(900);
          m0 = await metrics(c);
          r.cv = stats(await scrollRun(c, g.intro - g.vh * 0.5, g.max, 900));
          r.cvCost = cost(m0, await metrics(c));

          // 3. The cover
          await c.evaluate('scrollTo(0,0)'); await sleep(1000);
          r.hero = stats(await scrollRun(c, 0, g.journey - g.vh * 0.2, 700));

          // 4. The Globe's film, Doha to Shanghai
          await c.evaluate(`scrollTo(0, ${g.journey})`); await sleep(1400);
          if (mode === 'mobile') await c.swipe(260, { ms: 140 }); else await c.wheel(120);
          m0 = await metrics(c);
          r.globe = stats(await sample(c, 9000));
          r.globeCost = cost(m0, await metrics(c));
          await sleep(2300);
          r.endCity = await c.evaluate(`document.querySelector('.globe-caption [aria-hidden="false"] .globe-city')?.textContent`);
          assert.equal(r.endCity, 'Shanghai');

          // 5. Idle in the CV, whales swimming
          await c.evaluate(`scrollTo(0, ${g.intro} + 400)`); await sleep(1000);
          m0 = await metrics(c);
          r.idle = stats(await sample(c, 3000));
          r.idleCost = cost(m0, await metrics(c));
          r.heapMB = Math.round(((await metrics(c)).JSHeapUsedSize / 1048576) * 10) / 10;
          r.errors = c.errors;
          results.push(r);
          save('performance-' + tag, results);
          console.log('PERF', JSON.stringify(r));
        } finally { await c.close(); }
      }
    }
  }
}
