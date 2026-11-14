// Phase II QA harness. Private headless Chrome over CDP; starts and stops its own Vite servers.
//   node dev/phase2.mjs shots  [before|after] [widths]   section captures at 1440/1280/768/390/320
//   node dev/phase2.mjs whales [before|after|both]       matched whale frames (same pose, same scroll)
//   node dev/phase2.mjs titles                           the chapter-title emergence, frame by frame
//   node dev/phase2.mjs perf                             frame pacing, before vs after (alternating order)
//   node dev/phase2.mjs verify                           journeys, Globe, reverse, skip, index, reduced motion
// "before" is the working tree as Phase II found it (.reference/phase2-before, git-ignored).
import { browser, jpg, scrollRun, server, stopServers, task } from './phase2-lib.mjs';
import { sleep } from './fable-cdp.mjs';
import { existsSync } from 'node:fs';
import { resolve } from 'node:path';

const VIEWPORTS = [
  { w: 1440, h: 900 }, { w: 1280, h: 800 }, { w: 768, h: 1024, touch: true }, { w: 390, h: 844, touch: true }, { w: 320, h: 740, touch: true }
];
const SECTIONS = ['introduction', 'experience', 'skills', 'education', 'languages', 'interests', 'contact'];

/** Section captures: each title a fifth of the way down, read as the visitor reads it (scrolled
 * to in steps so the page's own reveals have run), then a second screen of the long sections. */
async function shots(variant, only) {
  await server(variant);
  for (const v of VIEWPORTS) {
    if (only && !only.includes(String(v.w))) continue;
    const c = await browser({ variant, width: v.w, height: v.h, touch: v.touch, dsf: 1 });
    try {
      await c.evaluate('scrollTo(0,0)'); await sleep(900);
      await jpg(c, `${variant}/${v.w}-00-cover`);
      for (const id of SECTIONS) {
        const top = await c.evaluate(`document.getElementById('${id}').getBoundingClientRect().top+scrollY`);
        const target = Math.max(0, top - v.h * (id === 'introduction' ? 0.02 : 0.18));
        // Approach from above, as a reader does, so entrances play
        await c.evaluate(`scrollTo(0,${target - v.h * 0.9})`); await sleep(350);
        await scrollRun(c, target - v.h * 0.9, target, 1400);
        await sleep(1700);
        await jpg(c, `${variant}/${v.w}-${id}`);
        if (['introduction', 'experience', 'education'].includes(id)) {
          await scrollRun(c, target, target + v.h * 0.72, 1100); await sleep(1500);
          await jpg(c, `${variant}/${v.w}-${id}-2`);
        }
      }
      console.log('SHOTS', variant, v.w, 'errors', JSON.stringify(c.errors));
    } finally { await c.close(); }
  }
}

{
  try {
    if (task === 'shots') {
      const variant = process.argv[3] || 'after';
      await shots(variant, process.argv[4]?.split(','));
    } else if (existsSync(resolve('dev/phase2-' + task + '.mjs'))) {
      await (await import('./phase2-' + task + '.mjs')).default();
    } else throw Error('unknown task ' + task);
  } finally { stopServers(); }
  process.exit(0);
}
