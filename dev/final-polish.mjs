// Continuation QA only. Private Chrome; no product source mutations or experimental flags.
// node dev/fable-audit.mjs [verify|perf|hitch|all]
import { launch, sleep, SCRATCH } from './fable-cdp.mjs';
import { spawn } from 'node:child_process';
import { mkdirSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import assert from 'node:assert/strict';

const task = process.argv[2] || 'all';
const out = resolve('artifacts/final-polish');
mkdirSync(out, { recursive: true });
const baseRoot = process.env.FABLE_BASE || resolve('.reference/final-polish-before');
const servers = [];
const origins = { before: 'http://127.0.0.1:5291', after: 'http://127.0.0.1:5281' };
let port = 9830;
const save = (name, data) => writeFileSync(resolve(out, name + '.json'), JSON.stringify(data, null, 2));
const stats = d => {
  if (!d.length) return null;
  const s = [...d].sort((a,b) => a-b);
  return { frames: d.length, mean: d.reduce((a,b)=>a+b,0)/d.length, p50:s[Math.floor(s.length*.5)], p95:s[Math.floor(s.length*.95)], max:s.at(-1), over34:d.filter(x=>x>34).length };
};
async function server(root, p) {
  const child = spawn(process.execPath, [resolve('node_modules/vite/bin/vite.js'), '--host', '127.0.0.1', '--port', String(p), '--strictPort'], { cwd:root, windowsHide:true, stdio:['ignore','pipe','pipe'] });
  servers.push(child);
  let log=''; child.stdout.on('data',d=>log+=d); child.stderr.on('data',d=>log+=d);
  for(let i=0;i<100;i++) {
    try { if((await fetch(`http://127.0.0.1:${p}/`)).ok) return; } catch {}
    if(child.exitCode!==null) throw Error(log);
    await sleep(200);
  }
  throw Error('Local server failed: '+log);
}
async function browser(mode='desktop', variant='after', source='') {
  const c=await launch({port:port++,profile:`continuation-${task}-${Date.now()}-${port}`});
  if(mode==='mobile') await c.mobile(390,844,2); else await c.desktop(1440,900,1);
  await c.send('Page.addScriptToEvaluateOnNewDocument',{source:`sessionStorage.setItem('xh-creation-seen-v1','1');${source}`});
  await c.goto(origins[variant]+'/');
  for(let i=0;i<120;i++) {
    if(await c.evaluate(`!!document.querySelector('#journey')`)) break;
    await sleep(250);
  }
  assert.equal(await c.evaluate(`!!document.querySelector('#journey')`),true,JSON.stringify(c.errors));
  await c.evaluate('document.fonts.ready'); await sleep(2500);
  return c;
}
async function shot(c,name) {
  const r=await c.send('Page.captureScreenshot',{format:'png'});
  writeFileSync(resolve(out,name+'.png'),Buffer.from(r.data,'base64'));
}
const geometry = c => c.evaluate(`({vh:innerHeight,journey:document.querySelector('#journey').getBoundingClientRect().top+scrollY,intro:document.querySelector('#introduction').getBoundingClientRect().top+scrollY,max:document.documentElement.scrollHeight-innerHeight,nodes:document.querySelectorAll('*').length})`);
const scrollRun = (c,y0,y1,speed) => c.evaluate(`new Promise(resolve=>{const d=[];let last=0;const t0=performance.now();scrollTo(0,${y0});function f(t){if(last)d.push(t-last);last=t;const y=${y0}+(t-t0)/1000*${speed};scrollTo(0,Math.min(y,${y1}));if(y>=${y1})resolve(d);else requestAnimationFrame(f)}requestAnimationFrame(f)})`);
const sample = (c,ms) => c.evaluate(`new Promise(resolve=>{const d=[];let last=0;const t0=performance.now();function f(t){if(last)d.push(t-last);last=t;if(t-t0>${ms})resolve(d);else requestAnimationFrame(f)}requestAnimationFrame(f)})`);
async function click(c,sel) {
  const p=await c.evaluate(`(()=>{const r=document.querySelector(${JSON.stringify(sel)}).getBoundingClientRect();return {x:r.x+r.width/2,y:r.y+r.height/2}})()`);
  await c.send('Input.dispatchMouseEvent',{type:'mousePressed',button:'left',clickCount:1,...p});
  await c.send('Input.dispatchMouseEvent',{type:'mouseReleased',button:'left',clickCount:1,...p});
  await sleep(500);
}
async function verify() {
  const c=await browser('mobile'); const results=[];
  try {
    assert.equal(await c.evaluate(`!!document.querySelector('.index-toggle')`),false);
    for(const [w,h] of [[320,740],[375,812],[390,844],[768,1024],[900,900],[1100,900],[1101,900],[1180,900],[1280,900],[1440,900],[844,390]]) {
      await c.mobile(w,h,1);
      await c.evaluate(`document.querySelector('#experience').scrollIntoView()`); await sleep(900);
      const r=await c.evaluate(`({w:innerWidth,h:innerHeight,scrollWidth:document.documentElement.scrollWidth,marks:[...document.querySelectorAll('.section-mark')].map(e=>e.textContent),toggle:getComputedStyle(document.querySelector('.index-toggle')).display,veil:getComputedStyle(document.querySelector('.reading-veil')).opacity,markerAnimations:document.querySelector('.section-mark').getAnimations().length})`);
      assert.deepEqual(r.marks,['01 / 07','02 / 07','03 / 07','04 / 07','05 / 07','06 / 07','07 / 07']);
      assert.equal(r.toggle==='none',w>1100); assert.ok(r.scrollWidth<=w);
      if(w<=1100) {
        await click(c,'.index-toggle');
        assert.equal(await c.evaluate(`document.querySelectorAll('.index-sheet a').length`),7);
        r.sheet=await c.evaluate(`({h:document.querySelector('.index-sheet').clientHeight,scrollHeight:document.querySelector('.index-sheet').scrollHeight,locked:document.documentElement.dataset.globeScroll||null,current:document.querySelector('.index-sheet a[aria-current]')?.getAttribute('href')})`);
        if(w===390||w===900||h===390) await shot(c,`index-${w}x${h}`);
        await c.send('Input.dispatchKeyEvent',{type:'keyDown',key:'Escape',code:'Escape',windowsVirtualKeyCode:27});
        await c.send('Input.dispatchKeyEvent',{type:'keyUp',key:'Escape',code:'Escape',windowsVirtualKeyCode:27}); await sleep(200);
        assert.equal(await c.evaluate(`document.activeElement.classList.contains('index-toggle')`),true);
      }
      await c.evaluate(`(()=>{const e=document.querySelector('.itinerary');scrollTo(0,e.getBoundingClientRect().top+scrollY-innerHeight*.28)})()`);await sleep(500);
      r.itinerary=await c.evaluate(`({width:document.querySelector('.itinerary').clientWidth,overflow:[...document.querySelectorAll('.itin-leg:not(.itin-gap)')].map(e=>({city:e.querySelector('.itin-city').textContent,right:e.querySelector('.itin-rule').getBoundingClientRect().right})),motion:document.querySelector('.itin-rule').getAnimations().length})`);
      if([320,375,390,768,900,1280,1440].includes(w)&&h>500) await shot(c,`itinerary-${w}`);
      results.push(r);
    }
    await c.mobile(390,844,2);
    for(const id of ['introduction','experience','skills','education','languages','interests','contact']) {
      await c.evaluate(`document.querySelector('#education').scrollIntoView()`);await sleep(500);
      await click(c,'.index-toggle');await click(c,`.index-sheet a[href="#${id}"]`);
      const r=await c.evaluate(`({id:${JSON.stringify(id)},focus:document.activeElement.id,top:document.querySelector('#${id}').getBoundingClientRect().top,markTop:document.querySelector('#${id} .section-mark').getBoundingClientRect().top,open:!!document.querySelector('.index-sheet'),lock:document.documentElement.dataset.globeScroll||null})`);
      assert.equal(r.focus,id); assert.equal(r.open,false); assert.equal(r.lock,null);results.push(r);
      if(id==='introduction') await shot(c,'profile-index-landing');
    }
    // Widening closes the disclosure; no invisible open sheet survives the breakpoint.
    await click(c,'.index-toggle');await c.desktop(1200,900);await sleep(400);
    assert.equal(await c.evaluate(`!!document.querySelector('.index-sheet')`),false);
    await c.mobile(390,844,2);
    await c.send('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:'reduce'}]});
    await c.evaluate(`document.querySelector('#education').scrollIntoView()`);await sleep(500);await click(c,'.index-toggle');
    const reduced=await c.evaluate(`({sheet:getComputedStyle(document.querySelector('.index-sheet')).animationName,items:getComputedStyle(document.querySelector('.index-sheet li')).animationName,rule:getComputedStyle(document.querySelector('.itin-rule')).animationName,veil:getComputedStyle(document.querySelector('.reading-veil')).transitionDuration})`);
    assert.equal(reduced.sheet,'none');assert.equal(reduced.items,'none');assert.equal(reduced.rule,'none');assert.equal(reduced.veil,'0s');
    results.push({reduced,errors:c.errors});save('verification',results);console.log('VERIFY PASS',JSON.stringify(results));
  } finally { await c.close(); }
}
async function perf() {
  const results=[];
  // Sequential, alternating order; never contend with a second benchmark browser.
  for(const mode of ['desktop','mobile']) for(const [trial,variants] of [[1,['before','after']],[2,['after','before']]]) for(const variant of variants) {
    const c=await browser(mode,variant);
    try {
      const g=await geometry(c);await scrollRun(c,g.intro-g.vh,g.max,4000);await sleep(600);
      const r={mode,variant,trial,nodes:g.nodes,cv:stats(await scrollRun(c,g.intro-g.vh*.5,g.max,900))};
      await c.evaluate('scrollTo(0,0)');await sleep(1000);
      r.hero=stats(await scrollRun(c,0,g.journey-g.vh*.2,700));
      await c.evaluate(`scrollTo(0,${g.journey})`);await sleep(1400);
      if(mode==='mobile')await c.swipe(260,{ms:140});else await c.wheel(120);
      r.globe=stats(await sample(c,9000));await sleep(2300);
      r.endCity=await c.evaluate(`document.querySelector('.globe-caption [aria-hidden="false"] .globe-city')?.textContent`);
      assert.equal(r.endCity,'Shanghai');
      await c.evaluate(`scrollTo(0,${g.intro}+400)`);await sleep(1000);
      r.idle=stats(await sample(c,2000));r.errors=c.errors;
      results.push(r);save('performance',results);console.log('PERF',JSON.stringify(r));
    } finally {await c.close();}
  }
}
async function hitch() {
  const results=[];
  // Temporary browser-only ablation: suppress water CSS writes after Doha. Never a shipping fix.
  for(const mode of ['desktop','mobile']) for(const suppress of [false,true,false]) {
    const c=await browser(mode,'after',`window.__waterWrites=[];window.__suppressWater=false;const orig=CSSStyleDeclaration.prototype.setProperty;CSSStyleDeclaration.prototype.setProperty=function(n,v,p){if(this===document.documentElement.style&&['--ocean-background','--abyss-wash','--abyss-halo','--abyss-wash-low'].includes(n)){window.__waterWrites.push({at:performance.now(),n});if(window.__suppressWater)return;}return orig.call(this,n,v,p)};`);
    try {
      const g=await geometry(c);await c.evaluate(`scrollTo(0,${g.journey})`);await sleep(1400);
      await c.send('Performance.enable');
      const metric=async()=>Object.fromEntries((await c.send('Performance.getMetrics')).metrics.map(x=>[x.name,x.value]));
      const m0=await metric();
      await c.evaluate(`window.__waterWrites=[];window.__suppressWater=${suppress}`);
      // Trace browser style work, distinct from the JS setter's duration.
      const events=[];c.on('Tracing.dataCollected',p=>events.push(...p.value));
      await c.send('Tracing.start',{categories:'devtools.timeline,blink.user_timing',transferMode:'ReportEvents'});
      if(mode==='mobile')await c.swipe(260,{ms:140});else await c.wheel(120);
      const frames=await sample(c,9000);const m1=await metric();
      const done=new Promise(res=>c.on('Tracing.tracingComplete',res));await c.send('Tracing.end');await done;
      const r={mode,suppress,frames:stats(frames),metrics:Object.fromEntries(['RecalcStyleDuration','LayoutDuration','ScriptDuration','TaskDuration','RecalcStyleCount','LayoutCount'].map(k=>[k,m1[k]-m0[k]])),writes:await c.evaluate('window.__waterWrites'),styles:events.filter(x=>x.ph==='X'&&['UpdateLayoutTree','RecalculateStyles'].includes(x.name)).map(x=>({name:x.name,ms:x.dur/1000,at:x.ts/1000,elementCount:x.args?.beginData?.elementCount})),errors:c.errors};
      writeFileSync(resolve(SCRATCH,`trace-${mode}-${results.length}.json`),JSON.stringify(events));
      await sleep(2300);r.endCity=await c.evaluate(`document.querySelector('.globe-caption [aria-hidden="false"] .globe-city')?.textContent`);assert.equal(r.endCity,'Shanghai');
      results.push(r);save('hitches',results);console.log('HITCH',JSON.stringify({...r,writes:r.writes.length,styles:stats(r.styles.map(x=>x.ms))}));
    } finally {await c.close();}
  }
}
async function measure() {
  const results=[];
  for(const mode of ['desktop','mobile']) for(const variant of ['before','after']) {
    const c=await browser(mode,variant);
    try {
      const g=await geometry(c);await c.evaluate(`scrollTo(0,${g.journey})`);await sleep(1400);
      await c.send('Performance.enable');
      const metric=async()=>Object.fromEntries((await c.send('Performance.getMetrics')).metrics.map(x=>[x.name,x.value]));
      const m0=await metric();
      if(mode==='mobile')await c.swipe(260,{ms:140});else await c.wheel(120);
      const frames=await sample(c,9000);const m1=await metric();
      const r={mode,variant,frames:stats(frames),styleMs:(m1.RecalcStyleDuration-m0.RecalcStyleDuration)*1000,layoutMs:(m1.LayoutDuration-m0.LayoutDuration)*1000,errors:c.errors};
      await sleep(2300);r.endCity=await c.evaluate(`document.querySelector('.globe-caption [aria-hidden="false"] .globe-city')?.textContent`);assert.equal(r.endCity,'Shanghai');
      results.push(r);save('style-measure',results);console.log('MEASURE',JSON.stringify(r));
    }finally{await c.close();}
  }
}
// What the water's colour looks like on every consumer, before and after: computed styles at
// rest points all the way down the page (exact), and sampled through the film (nearest scroll
// position, since the two runs never land on the same frame of a 240 ms cadence).
const PROBE = `(()=>{const cs=(e,p)=>e?getComputedStyle(e)[p]:null;const q=s=>document.querySelector(s);
const veils=[...document.querySelectorAll('[data-journey-runway] [style*="--abyss-wash"]')];
return {y:Math.round(scrollY),
caption:cs(q('.globe-caption [aria-hidden="false"] .globe-city'),'textShadow'),
captionMeta:cs(q('.globe-caption [aria-hidden="false"] .meta'),'textShadow'),
veilWide:cs(veils[0],'backgroundImage'),veilLow:cs(veils[1],'backgroundImage'),
controls:cs(q('.fixed-top-controls'),'textShadow'),soundLabel:cs(q('.decode-sound-toggle'),'textShadow'),
html:cs(document.documentElement,'backgroundColor'),body:cs(document.body,'backgroundColor'),page:cs(q('.terminal-portfolio'),'backgroundColor'),
main:cs(q('main'),'textShadow'),cvTitle:cs(q('#experience h2'),'textShadow'),heroLine:cs(q('.cover-line'),'textShadow'),
readingVeil:cs(q('.reading-veil'),'backgroundImage'),gauge:cs(q('.depth-gauge'),'textShadow'),marker:cs(q('.depth-gauge-marker'),'boxShadow'),
overrides:[q('[data-journey-runway]').style.cssText,q('.fixed-top-controls').style.cssText,document.documentElement.style.getPropertyValue('background-color'),document.body.style.getPropertyValue('background-color'),q('.terminal-portfolio').style.getPropertyValue('background-color')]}})()`;
const ON_STAGE = ['caption','captionMeta','veilWide','veilLow','controls','soundLabel','html','body','page'];
const EVERYWHERE = [...ON_STAGE,'main','cvTitle','heroLine','readingVeil','gauge','marker'];
const rgbOf = s => (String(s).match(/rgba?\(([^)]+)\)/)?.[1] || '').split(',').slice(0,3).map(Number);
async function visualRun(mode, variant, label) {
  const c = await browser(mode, variant); const rest = {}; const film = [];
  try {
    const g = await geometry(c); const travel = g.intro - g.journey - g.vh;
    const at = async (name, y) => { await c.evaluate(`scrollTo(0,${Math.round(y)})`); await sleep(800); rest[name] = await c.evaluate(PROBE); };
    await at('top', 0); await at('hero-mid', g.journey * 0.5); await at('above-globe', g.journey - 200);
    await at('doha', g.journey);
    if (mode === 'mobile') await c.swipe(260, { ms: 140 }); else await c.wheel(120);
    const t0 = Date.now(); let shots = 0;
    while (Date.now() - t0 < 11500) {
      film.push(await c.evaluate(PROBE));
      if (Date.now() - t0 > [3000, 6000, 9000][shots]) await shot(c, `visual-${mode}-${label}-film-${++shots}`);
      await sleep(120);
    }
    await sleep(1500); rest['shanghai'] = await c.evaluate(PROBE);
    assert.equal(await c.evaluate(`document.querySelector('.globe-caption [aria-hidden="false"] .globe-city')?.textContent`), 'Shanghai');
    await at('profile-rising', g.intro - g.vh * 0.5); await shot(c, `visual-${mode}-${label}-profile`);
    await at('profile', g.intro); await at('cv', g.intro + (g.max - g.intro) * 0.5); await at('end', g.max);
    // The film in reverse, entered from the profile: resting on Doha again, everything (the cover
    // just above the screen included) must hold exactly what it held on the way down
    // One gesture from just under the runway's end crosses into it and starts the reverse film
    await at('below-globe', g.intro - g.vh + 100);
    if (mode === 'mobile') await c.swipe(-260, { y0: 300, ms: 140 }); else await c.wheel(-120);
    await sleep(13000);
    assert.equal(await c.evaluate(`document.querySelector('.globe-caption [aria-hidden="false"] .globe-city')?.textContent`), 'Doha');
    rest['doha-after-reverse'] = await c.evaluate(PROBE);
    await at('above-globe-again', g.journey - 200);
    return { mode, variant, label, travel, journey: g.journey, rest, film, errors: c.errors };
  } finally { await c.close(); }
}
async function visual() {
  const report = [];
  for (const mode of ['desktop', 'mobile']) {
    const before = await visualRun(mode, 'before', 'before');
    const again = await visualRun(mode, 'before', 'before2');
    const after = await visualRun(mode, 'after', 'after');
    const margin = 0.25 * (mode === 'mobile' ? 844 : 900);
    const stageOnly = (run, y) => y >= run.journey + margin && y <= run.journey + run.travel - margin;
    const restDiff = (a, b) => Object.keys(a.rest).flatMap(name => {
      const keys = stageOnly(b, b.rest[name].y) ? ON_STAGE : EVERYWHERE;
      return keys.filter(k => a.rest[name][k] !== b.rest[name][k]).map(k => ({ at: name, y: b.rest[name].y, key: k, before: a.rest[name][k], after: b.rest[name][k] }));
    });
    // Through the film: each sample against the other run's sample nearest in scroll position
    const filmDelta = (a, b) => {
      let worst = { delta: 0 };
      for (const s of b.film) {
        const near = a.film.reduce((best, x) => Math.abs(x.y - s.y) < Math.abs(best.y - s.y) ? x : best, a.film[0]);
        for (const k of ['caption', 'controls', 'veilWide', 'veilLow', 'body', 'page']) {
          const p = rgbOf(near[k]), q = rgbOf(s[k]);
          const delta = Math.max(...p.map((v, i) => Math.abs(v - q[i])));
          if (delta > worst.delta) worst = { delta, key: k, y: s.y, nearY: near.y, a: near[k], b: s[k] };
        }
      }
      return worst;
    };
    // The caption must never fall behind its own controls or page background inside one frame
    const internal = run => run.film.filter(s => rgbOf(s.caption).join() !== rgbOf(s.controls).join() || rgbOf(s.caption).join() !== rgbOf(s.body).join()).length;
    const r = {
      mode,
      restStops: Object.keys(after.rest).length,
      restDifferences: restDiff(before, after),
      restNoiseFloor: restDiff(before, again).length,
      filmSamples: after.film.length,
      filmWorstVsBefore: filmDelta(before, after),
      filmNoiseFloor: filmDelta(before, again),
      consumersOutOfStep: { before: internal(before), after: internal(after) },
      overridesAfterFilm: after.rest['profile'].overrides,
      overridesAtDoha: after.rest['doha'].overrides,
      rootHeldAtDoha: after.rest['doha'].main === after.rest['above-globe'].main,
      dohaAfterReverseMatches: JSON.stringify(EVERYWHERE.map(k => after.rest['doha'][k])) === JSON.stringify(EVERYWHERE.map(k => after.rest['doha-after-reverse'][k])),
      returnMatches: JSON.stringify(EVERYWHERE.map(k => after.rest['above-globe'][k])) === JSON.stringify(EVERYWHERE.map(k => after.rest['above-globe-again'][k])),
      errors: [...before.errors, ...after.errors]
    };
    report.push(r); save('visual-equivalence', report);
    console.log('VISUAL', JSON.stringify(r));
  }
}
try {
  await server(process.cwd(),5281);
  if(['perf','measure','visual','all'].includes(task))await server(baseRoot,5291);
  if(task==='visual'||task==='all')await visual();
  if(task==='measure'||task==='all')await measure();
  if(task==='verify'||task==='all')await verify();
  if(task==='perf'||task==='all')await perf();
  if(task==='hitch'||task==='all')await hitch();
} finally {for(const p of servers)p.kill();}
