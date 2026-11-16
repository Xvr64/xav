// Real Chromium captures and pacing, using the repository's existing CDP driver.
import { resolve } from 'node:path';
import { writeFileSync } from 'node:fs';
process.env.PHASE2_OUT = resolve('artifacts/ocean-refinement');
const { browser, server, stopServers, png, sample, stats, scrollRun, save } = await import('./phase2-lib.mjs');
const { sleep } = await import('./fable-cdp.mjs');
const mode = process.argv[2] || 'refined';
const views = [{ width: 1440, height: 900 }, { width: 390, height: 844, touch: true, dsf: 2 }, { width: 320, height: 740, touch: true, dsf: 3 }];
const report = [];
try {
  await server('after');
  for (const view of views) {
    const c = await browser({ ...view, path: mode === 'before' ? '/?ocean=all' : mode === 'original' ? '/?ocean=original' : '/' });
    try {
      const row = { mode, ...view, sections: [] };
      for (const section of ['experience', 'languages']) {
        const y = await c.evaluate(`document.getElementById('${section}').getBoundingClientRect().top + scrollY - innerHeight * .15`);
        await c.evaluate(`scrollTo(0, ${y}); window.__ambientWhales.seek(18)`);
        await sleep(1600);
        await c.evaluate(`window.__swim = true; (() => {const start = performance.now(); function f(t) {if (!window.__swim) return; window.__ambientWhales.seek(18 + (t-start)/1000); requestAnimationFrame(f);} requestAnimationFrame(f);})()`);
        await sleep(6000);
        await c.evaluate('window.__swim = false; window.__ambientWhales.seek(24); window.__asciiOcean.pause(true)');
        await sleep(100);
        const rendered = await c.evaluate('window.__asciiOcean.render(40)');
        writeFileSync(resolve(process.env.PHASE2_OUT, `${mode}-${view.width}-${section}-water.jpg`), Buffer.from(rendered.image.split(',')[1], 'base64'));
        await png(c, `${mode}-${view.width}-${section}`);
        row.sections.push(await c.evaluate(`({section:'${section}', scroll:scrollY, ocean:__asciiOcean.state(), effects:__asciiOcean.effects(), wake:__asciiOcean.stats().wake, bounds:__ambientWhales.bounds(), overflow:document.documentElement.scrollWidth > innerWidth})`));
        await c.evaluate('window.__asciiOcean.pause(false); window.__ambientWhales.release()');
      }
      await sleep(1000);
      row.idle = stats(await sample(c, 4000));
      const y = await c.evaluate('scrollY');
      row.scrolling = stats(await scrollRun(c, y, y + 800, 200));
      row.gpu = await c.evaluate(`(() => {const g=document.querySelector('canvas').getContext('webgl2'); const e=g?.getExtension('WEBGL_debug_renderer_info'); return e ? g.getParameter(e.UNMASKED_RENDERER_WEBGL) : 'unavailable';})()`);
      row.errors = c.errors;
      report.push(row); save(mode, report);
      console.log(JSON.stringify({mode,width:view.width,idle:row.idle,scrolling:row.scrolling,errors:row.errors}));
    } finally { await c.close(); }
  }
} finally { stopServers(); }
