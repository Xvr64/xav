// Matched whale frames: the same scroll position and the same whale time (the dev build's
// __ambientWhales.seek), before and after, so only the compositing differs.
//   node dev/phase2.mjs whales [before|after|both] [times=40,90,145]
import { browser, jpg, server, scrollRun } from './phase2-lib.mjs';
import { sleep } from './fable-cdp.mjs';

const VIEWS = [{ w: 1440, h: 900 }, { w: 390, h: 844, touch: true }];
const STOPS = [
  { id: 'experience', at: 0.18 }, { id: 'skills', at: 0.18 }, { id: 'education', at: 0.18 },
  { id: 'languages', at: 0.18 }, { id: 'interests', at: 0.18 }, { id: 'contact', at: 0.3 }
];

export default async function whales() {
  const which = process.argv[3] || 'both';
  const times = (process.argv[4] || '40,90,145').split(',').map(Number);
  for (const variant of which === 'both' ? ['before', 'after'] : [which]) {
    await server(variant);
    for (const v of VIEWS) {
      const c = await browser({ variant, width: v.w, height: v.h, touch: v.touch });
      try {
        for (const stop of STOPS) {
          const top = await c.evaluate(`document.getElementById('${stop.id}').getBoundingClientRect().top+scrollY`);
          const y = Math.round(top - v.h * stop.at);
          await scrollRun(c, y - v.h, y, 1600);
          await sleep(1600);
          for (const t of times) {
            await c.evaluate(`window.__ambientWhales.seek(${t})`);
            await sleep(450);
            await jpg(c, `whales/${variant}-${v.w}-${stop.id}-t${t}`, 86);
          }
          await c.evaluate(`window.__ambientWhales.release()`);
        }
        console.log('WHALES', variant, v.w, JSON.stringify(c.errors));
      } finally { await c.close(); }
    }
  }
}
