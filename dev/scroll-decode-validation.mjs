import assert from 'node:assert/strict';
import { ENCRYPTED_ENTRY_START, ENCRYPTED_ENTRY_END } from '../encryptedMotion.ts';
process.env.PHASE2_OUT ||= 'artifacts/scroll-decode';
const { server, browser, png, save, stats, stopServers } = await import('./phase2-lib.mjs');
const { sleep } = await import('./fable-cdp.mjs');
const report = [];
const linesOnly = process.argv.includes('--lines-only');
// Attribute controller time separately from the ocean/Globe and test-driver work.
const instrument = `(() => {
  const raf = requestAnimationFrame.bind(window), cache = new WeakMap();
  window.decodeTimes = [];
  window.requestAnimationFrame = callback => {
    if (!cache.has(callback)) cache.set(callback, callback.toString().includes('pendingLines'));
    if (!cache.get(callback)) return raf(callback);
    return raf(time => {
      const start = performance.now(); callback(time); decodeTimes.push(performance.now()-start);
    });
  };
})()`;
const setup = `(() => {
  window.revealEnd = ${ENCRYPTED_ENTRY_END};
  window.revealLength = ${ENCRYPTED_ENTRY_START - ENCRYPTED_ENTRY_END};
  window.cvWords = () => [...document.querySelectorAll('[data-editorial-section] .ascii-word')]
    .filter(w => !w.closest('[data-ascii-preserve]') && w.getClientRects().length);
  window.isReadable = w => {
    const v = w.querySelector('.ascii-visual');
    return v.textContent === w.querySelector('.ascii-source').textContent && v.style.visibility !== 'hidden' && !v.style.transform && !v.children.length;
  };
  window.readingFailures = () => cvWords().filter(w => {
    const r = w.getBoundingClientRect();
    return r.top >= 0 && r.top < innerHeight * (revealEnd - .02) && !isReadable(w);
  }).map(w => w.querySelector('.ascii-source').textContent);
  window.frames = [];
  if(window.decodeTimes)decodeTimes.length=0;
  window.watchWords = new Set();
  window.completedMutations = 0;
  window.wordObserver = new MutationObserver(records => {
    for (const r of records) {
      const el = r.target instanceof Element ? r.target : r.target.parentElement;
      if (watchWords.has(el?.closest('.ascii-word'))) completedMutations++;
    }
  });
  wordObserver.observe(document.querySelector('main'), {subtree:true, childList:true, characterData:true, attributes:true});
  window.moveTo = y => new Promise(resolve => {
    scrollTo(0,y); requestAnimationFrame(() => requestAnimationFrame(resolve));
  });
  return cvWords().length;
})()`;
try {
  await server('after');
  for (const width of (linesOnly ? [] : [1440, 390, 320])) {
    const c = await browser({width, height:900, touch:width<768, dsf:width<768?2:1,source:instrument});
    try {
      const row = {width, words:await c.evaluate(setup)};
      row.coverage = await c.evaluate(`(() => {
        const missed=[];
        for (const s of document.querySelectorAll('[data-editorial-section]')) {
          const walker=document.createTreeWalker(s,NodeFilter.SHOW_TEXT);
          while(walker.nextNode()) { const n=walker.currentNode,p=n.parentElement;
            if(n.textContent.trim() && p.getClientRects().length && !p.closest('[data-ascii-text],[data-ascii-preserve]')) missed.push(n.textContent);
          }
        }
        return {missed,sections:[...document.querySelectorAll('[data-editorial-section]')].map(s=>s.id)};
      })()`);
      assert.deepEqual(row.coverage.missed, []);
      // Inspect a wrapped profile paragraph at closely spaced scroll positions.
      row.slow = await c.evaluate(`(async()=>{
        const p=document.querySelector('#introduction .lead');
        const target=p.getBoundingClientRect().top+scrollY;
        await moveTo(target-innerHeight*.98);
        let partial=0,cascade=false,last=0;
        const durations=[];
        for(let y=target-innerHeight*.98;y<=target-innerHeight*(revealEnd-.03);y+=4){
          await moveTo(y);
          const now=performance.now();if(last)durations.push(now-last);last=now;
          if(readingFailures().length) throw Error('unreadable reading zone');
          const lines=new Map();
          for(const w of p.querySelectorAll('.ascii-word')){
            const top=Math.round(w.getBoundingClientRect().top/6)*6;
            const v=w.querySelector('.ascii-visual');
            const original=[...w.querySelector('.ascii-source').textContent];
            const cells=[...v.children];
            if(cells.length) partial++;
            const real=cells.length ? cells.filter((cell,i)=>cell.textContent===original[i]).length : isReadable(w)?original.length:0;
            const state=lines.get(top)||{real:0,total:0};state.real+=real;state.total+=original.length;lines.set(top,state);
          }
          const ratios=[...lines.values()].map(x=>x.real/x.total);
          if(new Set(ratios.map(x=>x.toFixed(1))).size>1)cascade=true;
        }
        return {partial,cascade,failures:readingFailures(),durations};
      })()`);
      assert.ok(row.slow.partial>0,'ASCII intermediate states');
      assert.ok(row.slow.cascade,'wrapped lines have independent progress');
      // Random suffix symbols can coincidentally match a source letter, so exact lock stability
      // is covered by the deterministic model tests rather than inferred from random glyphs.
      row.slow.scrollStepTimes=stats(row.slow.durations);delete row.slow.durations;
      await png(c, `profile-${width}`);
      row.idle = await c.evaluate(`(async()=>{
        const partial=cvWords().filter(w=>w.querySelector('.ascii-cell'));
        partial.forEach(w=>watchWords.add(w));completedMutations=0;
        await new Promise(r=>setTimeout(r,250));
        const mutations=completedMutations;watchWords.clear();
        return {partialWords:partial.length,mutations};
      })()`);
      assert.equal(row.idle.mutations,0,'paused decoding has no timer or glyph churn');
      row.partialReverse = await c.evaluate(`(async()=>{
        const partial=cvWords().filter(w=>w.querySelector('.ascii-cell'));
        await moveTo(scrollY-6);
        const settled=partial.every(isReadable);
        partial.forEach(w=>watchWords.add(w));completedMutations=0;
        await moveTo(scrollY-40);await moveTo(scrollY+55);
        const mutations=completedMutations;watchWords.clear();
        return {words:partial.length,settled,mutations};
      })()`);
      assert.ok(row.partialReverse.words>0 && row.partialReverse.settled,'reverse settles interrupted entrances');
      assert.equal(row.partialReverse.mutations,0,'interrupted lines never replay');
      row.input = {};
      const before = await c.evaluate('scrollY');
      if(width<768) {
        await c.swipe(180,{x:width/2,y0:650,steps:12,ms:240}); await sleep(350);
        row.input.touchDistance = await c.evaluate('scrollY')-before;
        assert.ok(row.input.touchDistance>20,'native touch scroll');
      } else {
        for(let i=0;i<12;i++) {await c.wheel(4);await sleep(20);}
        row.input.trackpadDistance = await c.evaluate('scrollY')-before;
        assert.ok(row.input.trackpadDistance>10,'small pixel wheel / trackpad-like input');
        const start=await c.evaluate('scrollY');await c.wheel(120);await sleep(200);
        row.input.mouseWheelDistance=await c.evaluate('scrollY')-start;
        assert.ok(row.input.mouseWheelDistance>50,'mouse wheel step');
      }
      // Slow entrances for each section header, then fast jumps through every remaining line.
      row.sections = await c.evaluate(`(async()=>{
        const sections=[];
        for(const section of document.querySelectorAll('[data-editorial-section]')){
          if(section.id==='home'||section.id==='introduction')continue;
          const word=section.querySelector('.ascii-word');if(!word)continue;
          const top=word.getBoundingClientRect().top+scrollY;
          const start=top-innerHeight*.96,end=top-innerHeight*(revealEnd-.04);
          await moveTo(start);
          let partial=false;
          for(let y=start;y<end;y+=8){await moveTo(y);partial ||= !!word.querySelector('.ascii-cell');}
          await moveTo(end);
          sections.push({id:section.id,partial,readable:isReadable(word),failures:readingFailures()});
        }
        await moveTo(document.documentElement.scrollHeight);
        return sections;
      })()`);
      for(const s of row.sections){assert.ok(s.readable, s.id);assert.deepEqual(s.failures,[],s.id);}
      assert.equal(await c.evaluate('cvWords().filter(w=>!isReadable(w)).length'),0,'all CV lines resolved at bottom');
      await c.evaluate('cvWords().forEach(w=>watchWords.add(w));completedMutations=0');
      row.reverse = await c.evaluate(`(async()=>{
        const top=document.querySelector('#introduction').getBoundingClientRect().top+scrollY-innerHeight;
        const bottom=scrollY;let last=0;
        for(let pass=0;pass<3;pass++){
          for(let y=bottom;y>=top;y-=220){
            await moveTo(y);const now=performance.now();if(last)frames.push(now-last);last=now;
            if(readingFailures().length)throw Error('reverse scrambled text');
          }
          await moveTo(bottom);
        }
        return {mutations:completedMutations,unresolved:cvWords().filter(w=>!isReadable(w)).length};
      })()`);
      assert.equal(row.reverse.mutations,0,'completed lines receive zero DOM mutations');
      assert.equal(row.reverse.unresolved,0);
      // Font/layout remeasurement, viewport wrapping, and reduced-motion preference changes.
      await c.send('Emulation.setDeviceMetricsOverride',{width:width===1440?1000:width+20,height:820,deviceScaleFactor:1,mobile:width<768});
      await sleep(250);
      assert.equal(await c.evaluate('cvWords().filter(w=>!isReadable(w)).length'),0,'resize never rearms');
      assert.equal(await c.evaluate('completedMutations'),0,'completed resize does no text DOM work');
      await c.send('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:'reduce'}]});
      await sleep(150);
      assert.equal(await c.evaluate('cvWords().filter(w=>!isReadable(w)).length'),0);
      row.controllerMs=stats(await c.evaluate('decodeTimes'));
      row.errors=c.errors;assert.deepEqual(row.errors,[]);
      row.overflow=await c.evaluate('document.documentElement.scrollWidth>innerWidth');assert.equal(row.overflow,false);
      report.push(row);save('validation',report);console.log(JSON.stringify(row));
    } finally {await c.close();}
  }
  // Sample the entrance of EVERY laid-out word, including every wrapped description line.
  const lineReport = [];
  for (const width of [1440, 390]) {
    const c = await browser({width,height:900,touch:width<768});
    try {
      await c.evaluate(setup);
      const result = await c.evaluate(`(async()=>{
        const all=cvWords(),seen=new Set();
        const max=document.documentElement.scrollHeight-innerHeight;
        const positions=new Set();
        for(const w of all){
          const top=w.getBoundingClientRect().top+scrollY;
          const end=Math.max(revealEnd,(top-max)/innerHeight+.03);
          for(const p of [.3,.65,1]) positions.add(Math.max(0,Math.min(max,Math.ceil(top-innerHeight*(end+revealLength*(1-p))))));
        }
        for(const y of [...positions].sort((a,b)=>a-b)){
          await moveTo(y);
          for(const w of all)if(w.querySelector('.ascii-cell'))seen.add(w);
          if(readingFailures().length)throw Error('unreadable line during exhaustive entrance');
        }
        await moveTo(max);
        return {words:all.length,animated:seen.size,unresolved:all.filter(w=>!isReadable(w)).length,
          missed:all.filter(w=>!seen.has(w)).map(w=>w.querySelector('.ascii-source').textContent)};
      })()`);
      assert.equal(result.unresolved,0);
      assert.deepEqual(result.missed,[],'every CV word passes through a per-line ASCII entrance');
      lineReport.push({width,...result});save('every-line',lineReport);
      console.log(JSON.stringify({everyLine:width,...result}));
    } finally {await c.close();}
  }
  // Reduced motion from the first paint, plus toggling it during an unfinished entrance.
  for(const initial of (linesOnly ? [] : [true,false])){
    const c=await browser({width:390,height:844,touch:true});
    try{
      await c.evaluate(setup);
      await c.evaluate(`moveTo(document.querySelector('#introduction .lead').getBoundingClientRect().top+scrollY-innerHeight*.9)`);
      await c.send('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:'reduce'}]});
      if(initial){await c.send('Page.reload');await sleep(2500);await c.evaluate(setup);}
      await sleep(200);
      assert.equal(await c.evaluate('cvWords().filter(w=>!isReadable(w)).length'),0,'reduced motion resolves all text');
      await c.send('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:'no-preference'}]});
      await sleep(150);
      assert.equal(await c.evaluate('cvWords().filter(w=>!isReadable(w)).length'),0,'motion toggle cannot replay');
      report.push({reducedInitial:initial,pass:true});save('validation',report);
    }finally{await c.close();}
  }
} finally {stopServers();}
