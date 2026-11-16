import { resolve } from 'node:path';
import { writeFileSync } from 'node:fs';
import assert from 'node:assert/strict';
process.env.PHASE2_OUT = resolve('artifacts/ocean-refinement');
const { browser, server, stopServers, save, png } = await import('./phase2-lib.mjs');
const { sleep } = await import('./fable-cdp.mjs');
const report = [];
try {
  await server('after');
  for (const view of [{width:1440,height:900}, {width:390,height:844,touch:true,dsf:2}, {width:320,height:740,touch:true,dsf:3}]) {
    const c = await browser({...view,path:'/?ocean=wake'});
    try {
      await c.evaluate(`scrollTo(0,document.querySelector('#experience').getBoundingClientRect().top+scrollY-100); __ambientWhales.seek(18)`);
      await sleep(1800);
      const row = {view};
      row.rest = await c.evaluate(`(() => {
        const o=__asciiOcean; o.pause(true);
        const off={inertia:false,flow:false,sea:false,wake:false};
        o.set(off);o.render(40);const a=o.read();
        o.set({...off,wake:true});o.render(40);const b=o.read();
        let changed=0,max=0;const channels=[0,0,0],histA=Array(12).fill(0),histB=Array(12).fill(0);for(let i=0;i<a.cells.length;i++)if(i%4!==3){const d=Math.abs(a.cells[i]-b.cells[i]);if(d){changed++;channels[i%4]++;}max=Math.max(max,d);if(i%4===0 && a.cells[i+1]){histA[a.cells[i]]++;histB[b.cells[i]]++;}}
        o.pause(false);return {changed,max,channels,histA,histB,cells:a.cols*a.rows};
      })()`);
      console.log('REST',view.width,row.rest);
      assert.equal(row.rest.channels[1],0,'undisturbed density and alpha must equal the original ocean');
      assert.equal(row.rest.channels[2],0,'undisturbed water field must equal the original ocean');
      assert.ok(row.rest.histA.every((n,i)=>Math.abs(n-row.rest.histB[i])/row.rest.cells<.015),'original character distribution');
      assert.equal(row.rest.histB.slice(9).reduce((a,b)=>a+b,0),0,'no directional marks in quiet water');
      await c.evaluate(`window.__wakeEnergy=()=>{const r=__asciiOcean.read();let any=0,visible=0,energy=0,x=0,y=0;for(let i=0;i<r.wake.length;i+=4){const v=r.wake[i+2];if(v||r.wake[i]!==128||r.wake[i+1]!==128)any++;if(v>36)visible++;energy+=v;x+=(i/4%r.cols)*v;y+=Math.floor(i/4/r.cols)*v;}return {any,visible,energy,x:energy?x/energy:0,y:energy?y/energy:0};};
        window.__swim=true;window.__lastSwim=18;(()=>{const start=performance.now();const f=t=>{if(!__swim)return;__lastSwim=18+(t-start)/1000;__ambientWhales.seek(__lastSwim);requestAnimationFrame(f);};requestAnimationFrame(f);})()`);
      row.sequence=[];
      for(let frame=0;frame<12;frame++){
        await sleep(250);
        row.sequence.push(await c.evaluate('({time:__lastSwim,water:__wakeEnergy(),bodies:__asciiOcean.stats().wake.bodies})'));
        await png(c,`motion-${view.width}-${String(frame).padStart(2,'0')}`);
      }
      assert.ok(row.sequence.some(s=>s.water.visible>0),'swimming must produce a visible disturbance');
      await c.evaluate('window.__swim=false;__ambientWhales.seek(__lastSwim);__asciiOcean.pause(true)');
      await sleep(100);
      // Compare exactly the same water moment with and without the accumulated wake.
      const local = await c.evaluate(`(() => {
        const o=__asciiOcean;o.render(40);const a=o.read();const image=o.render(40).image;
        o.set({wake:true});o.render(40);const b=o.read();let changed=0,farChanged=0,visibleChanged=0;
        for(let i=0;i<a.cells.length;i+=4){const diff=a.cells[i]!==b.cells[i]||a.cells[i+1]!==b.cells[i+1]||a.cells[i+2]!==b.cells[i+2];
          if(diff){changed++;if(a.cells[i+1]||b.cells[i+1])visibleChanged++;if(a.wake[i]===128&&a.wake[i+1]===128&&a.wake[i+2]===0)farChanged++;}}
        const without=o.render(40).image;o.set({wake:true});o.pause(false);return {changed,farChanged,visibleChanged,image,without};
      })()`);
      for(const [key,suffix] of [['image','with'],['without','without']]) writeFileSync(resolve(process.env.PHASE2_OUT,`wake-${view.width}-${suffix}.jpg`),Buffer.from(local[key].split(',')[1],'base64'));
      delete local.image;delete local.without;row.locality=local;
      assert.equal(local.farChanged,0,'no new glyph changes away from moved water');
      // Swim, then stop at the exact last time (no seek jump); record actual elapsed fade.
      await c.evaluate(`window.__swim=true;(()=>{const start=performance.now(),base=__lastSwim;const f=t=>{if(!__swim)return;__lastSwim=base+(t-start)/1000;__ambientWhales.seek(__lastSwim);requestAnimationFrame(f);};requestAnimationFrame(f);})()`);
      await sleep(3000);
      await c.evaluate('window.__swim=false;__ambientWhales.seek(__lastSwim);window.__fadeStart=performance.now()');
      row.fade=[];
      for(let i=0;i<16;i++){row.fade.push(await c.evaluate('({seconds:(performance.now()-__fadeStart)/1000,...__wakeEnergy()})'));await sleep(250);}
      assert.equal(row.fade.at(-1).any,0,'all memory must return to exact rest');
      // Reprojection: freeze emission, move one document glyph row, step once.
      row.scroll = await c.evaluate(`(async()=>{
        const {ambientWhalesLive:w}=await import('/oceanDirection.ts');
        __ambientWhales.reduced(true);await new Promise(r=>setTimeout(r,60));
        w.presence=1;w.spines.forEach((s,j)=>{for(let n=0;n<48;n++){s[n*2]=innerWidth*.7-n*innerWidth*.008;s[n*2+1]=innerHeight*(.3+j*.3);}});
        const o=__asciiOcean;o.pause(false);await new Promise(r=>setTimeout(r,50));
        for(let k=0;k<12;k++){w.spines.forEach(s=>{for(let n=0;n<48;n++)s[n*2]+=2;});await new Promise(r=>setTimeout(r,36));}
        w.presence=0;o.pause(true);const a=__wakeEnergy();const row=innerWidth<768?12:14;
        scrollTo(0,scrollY+row);await new Promise(r=>setTimeout(r,40));w.presence=0;o.render();const b=__wakeEnergy();
        return {row,before:a,after:b,deltaRows:b.y-a.y};
      })()`);
      console.log('SCROLL',view.width,row.scroll);
      assert.ok(Math.abs(row.scroll.deltaRows+1)<.25,'memory scrolls with document, not screen');
      row.errors=c.errors;assert.deepEqual(c.errors,[]);
      report.push(row);save('wake-validation',report);
      console.log(JSON.stringify({width:view.width,rest:row.rest,locality:row.locality,fade:row.fade.map(f=>[+f.seconds.toFixed(2),f.visible,f.any]),scrollDelta:row.scroll.deltaRows}));
    }finally{await c.close();}
  }
}finally{stopServers();}
