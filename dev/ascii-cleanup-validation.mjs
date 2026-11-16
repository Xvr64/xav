import assert from 'node:assert/strict';
process.env.PHASE2_OUT = 'artifacts/ascii-cleanup';
const { server, browser, png, save, sample, stats, stopServers } = await import('./phase2-lib.mjs');
const { sleep } = await import('./fable-cdp.mjs');
const report = [];
const glyphs = `(() => {
  const r=__asciiOcean.read();let visible=0,far=0;
  for(let i=0;i<r.cells.length;i+=4) if(r.cells[i+1]) {
    visible++;if(!r.wake || r.wake[i+2]===0)far++;
  }
  return {visible,far,total:r.cols*r.rows};
})()`;
try {
  await server('after');
  for (const width of [1440, 390, 320]) {
    const c = await browser({ width, height:900, touch:width<768, dsf:width<768?2:1 });
    try {
      const row = { width };
      await c.evaluate(`scrollTo(0,document.querySelector('#experience').getBoundingClientRect().top+scrollY-120)`);
      await sleep(4500);
      row.motion=[];
      for(let i=0;i<8;i++) {
        row.motion.push(await c.evaluate(`({glyphs:${glyphs},text:document.querySelectorAll('.ascii-pressure').length,bodies:__asciiOcean.stats().wake.bodies.length})`));
        if(i===3) await png(c, 'after-'+width);
        await sleep(350);
      }
      assert.ok(row.motion.some(x=>x.glyphs.visible>0),'real swimming emits wake');
      assert.ok(row.motion.every(x=>x.glyphs.far===0),'no glyphs outside whale memory');
      row.performance=stats(await sample(c,3000));
      row.overflow=await c.evaluate('document.documentElement.scrollWidth>innerWidth');
      assert.equal(row.overflow,false);
      // Freeze the whale in its last pose. No animation means the entire wake must dissipate.
      await c.evaluate('__ambientWhales.seek(__ambientWhales.state().seconds)');
      await sleep(3800);
      row.rest=await c.evaluate(glyphs);
      assert.equal(row.rest.visible,0,'resting water is entirely glyph-free');
      assert.equal(await c.evaluate(`document.querySelectorAll('.ascii-pressure').length`),0,'text settles');
      await png(c,'rest-'+width);
      // Deliberate near-text passage tests locality independently of the animal's route.
      row.text=await c.evaluate(`(async()=>{
        const {oceanWake,onWhaleWake}=await import('/oceanWake.ts');
        const target=[...document.querySelectorAll('#experience .ascii-word')].find(el=>{
          const r=el.getBoundingClientRect();return r.top>220&&r.top<600&&r.width>60;
        });const r=target.getBoundingClientRect();
        __asciiOcean.pause(true);
        oceanWake.count=1;Object.assign(oceanWake.bodies[0],{x:r.left+r.width/2,y:r.top+r.height/2,r:40,strength:1});
        dispatchEvent(new Event('scroll'));
        await new Promise(r=>setTimeout(r,600));
        const cells=[...document.querySelectorAll('.ascii-pressure')];
        const result={count:cells.length,words:new Set(cells.map(c=>c.closest('.ascii-word'))).size,
          intact:[...new Set(cells.map(c=>c.closest('.ascii-word')))].every(w=>w.querySelector('.ascii-visual').textContent===w.querySelector('.ascii-source').textContent),
          maxDisplacement:Math.max(0,...[...document.querySelectorAll('#experience .ascii-cell')].map(c=>Math.abs(new DOMMatrix(getComputedStyle(c).transform).m42)))};
        oceanWake.count=0;await new Promise(r=>setTimeout(r,2200));
        result.settled=document.querySelectorAll('.ascii-pressure').length===0;
        __asciiOcean.pause(false);return result;
      })()`);
      save('in-progress-'+width,row);
      assert.ok(row.text.count>0 && row.text.words<=4,'local words react');
      assert.ok(row.text.intact && row.text.settled,'original letters retained and restored');
      assert.ok(row.text.maxDisplacement<=1.71,'displacement stays small');
      await c.send('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:'reduce'}]});
      await sleep(500);
      row.reduced=await c.evaluate(glyphs);
      assert.equal(row.reduced.visible,0);
      row.errors=c.errors;assert.deepEqual(row.errors,[]);
      report.push(row);save('validation',report);console.log(JSON.stringify(row));
    } finally { await c.close(); }
  }
} finally { stopServers(); }
