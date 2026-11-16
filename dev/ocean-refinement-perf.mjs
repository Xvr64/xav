// Serial comparisons against the pre-refinement shader/runtime source, pinned for reproducibility.
import { execFileSync } from 'node:child_process';
import { resolve } from 'node:path';
import { readFileSync } from 'node:fs';
import { createServer } from 'vite';
process.env.PHASE2_OUT=resolve('artifacts/ocean-refinement');
const {browser,server,stopServers,sample,scrollRun,stats,save}=await import('./phase2-lib.mjs');
const {sleep}=await import('./fable-cdp.mjs');
const baselineRef='d66d05be151e7df0b664d533942a6e93ff4cae79';
const baseline=new Map(['asciiOcean.ts','oceanWake.ts','oceanExperiments.ts'].map(file=>[file,execFileSync('git',['show',`${baselineRef}:${file}`],{encoding:'utf8',windowsHide:true})]));
const old=await createServer({cacheDir:'node_modules/.cache/ocean-refinement-vite',optimizeDeps:{include:['react/jsx-dev-runtime']},server:{host:'127.0.0.1',port:5295,strictPort:true},plugins:[{name:'read-only-baseline',enforce:'pre',load(id){return baseline.get(id.split('?')[0].split('/').at(-1));}}]});
const requestedWidth=Number(process.argv[2]||0);
const results=requestedWidth ? JSON.parse(readFileSync(resolve(process.env.PHASE2_OUT,'performance-serial.json'),'utf8')).filter(row=>row.width!==requestedWidth) : [];
try{
  await old.listen();await server('after');
  for(const view of [{width:1440,height:900},{width:390,height:844,touch:true,dsf:2},{width:320,height:740,touch:true,dsf:3}]){
    if(requestedWidth && view.width!==requestedWidth)continue;
    const c=await browser({...view,path:'/?ocean=original'});
    try{
      for(const mode of ['before','refined','original']){
        await c.goto(mode==='before'?'http://127.0.0.1:5295/?ocean=all':`http://127.0.0.1:5282/${mode==='original'?'?ocean=original':''}`);
        await sleep(6000);await c.evaluate('document.fonts.ready');
        const y=await c.evaluate("document.querySelector('#experience').getBoundingClientRect().top+scrollY");
        const idle=[],scroll=[];
        for(let trial=0;trial<2;trial++){
          await c.evaluate(`scrollTo(0,${y})`);await sleep(1400);
          idle.push(...await sample(c,2000));
          scroll.push(...await scrollRun(c,y,y+600,200));
        }
        await sleep(800);
        const draw=await c.evaluate(`(()=>{const a=[];for(let i=0;i<20;i++)a.push(__asciiOcean.render().ms);return a;})()`);
        const row={...view,mode,idle:stats(idle),scroll:stats(scroll),synchronousOceanDraw:stats(draw),effects:await c.evaluate('__asciiOcean.effects()'),errors:c.errors};
        results.push(row);save('performance-serial',results);console.log(JSON.stringify(row));
      }
    }finally{await Promise.race([c.close(),sleep(1500)]);c.proc.kill();}
  }
}finally{await old.close();stopServers();}
