// The chapter-title emergence, frame by frame: every composited frame (CDP screencast) from the
// moment a title is brought into the reading zone, with the page's own clock.
//   node dev/phase2.mjs titles [after|before] [sections=experience,education] [widths=1440,390]
import { browser, out, server } from './phase2-lib.mjs';
import { sleep } from './fable-cdp.mjs';
import { mkdirSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

export default async function titles() {
  const variant = process.argv[3] || 'after';
  const ids = (process.argv[4] || 'experience,education').split(',');
  const widths = (process.argv[5] || '1440,390').split(',').map(Number);
  await server(variant);
  const dir = resolve(out, 'titles');
  mkdirSync(dir, { recursive: true });
  for (const w of widths) {
    const touch = w < 900;
    const h = touch ? 844 : 900;
    const c = await browser({ variant, width: w, height: h, touch, dsf: touch ? 2 : 1 });
    try {
      for (const id of ids) {
        const top = await c.evaluate(`document.querySelector('#${id} h2').getBoundingClientRect().top+scrollY`);
        // Park with the title still below the screen, then bring it to 46% in one step
        await c.evaluate(`scrollTo(0,${Math.round(top - h * 1.25)})`);
        await sleep(900);
        const frames = [];
        c.on('Page.screencastFrame', (f) => {
          frames.push({ t: f.metadata.timestamp, data: f.data });
          c.send('Page.screencastFrameAck', { sessionId: f.sessionId }).catch(() => undefined);
        });
        await c.send('Page.startScreencast', { format: 'jpeg', quality: 88, everyNthFrame: 1 });
        await sleep(120);
        const t0 = Date.now() / 1000;
        await c.evaluate(`scrollTo(0,${Math.round(top - h * 0.46)})`);
        await sleep(1700);
        await c.send('Page.stopScreencast');
        const kept = frames.filter((f) => f.t >= t0 - 0.05);
        kept.forEach((f, i) => writeFileSync(resolve(dir, `${variant}-${w}-${id}-${String(i).padStart(3, '0')}-${Math.round((f.t - t0) * 1000)}ms.jpg`), Buffer.from(f.data, 'base64')));
        const rect = await c.evaluate(`(()=>{const r=document.querySelector('#${id} h2').getBoundingClientRect();return {x:r.x,y:r.y,w:r.width,h:r.height,canvases:document.querySelectorAll('[data-title-emergence]').length}})()`);
        console.log('TITLE', variant, w, id, kept.length, 'frames', JSON.stringify(rect), JSON.stringify(c.errors));
        frames.length = 0;
      }
    } finally { await c.close(); }
  }
}
