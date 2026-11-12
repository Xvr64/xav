// Offline geometry/art-direction plates + CPU sampling benchmark. Not browser/GPU/iPhone QA.
// Run: node dev/portfolio-review.mjs; python dev/render-portfolio-review.py
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import os from 'node:os';
import ts from 'typescript';
import { loadLandDots } from '../glyphcssGlobe.ts';
import { createAsciiGlobeSampler } from '../asciiGlobePrototype.ts';
import { buildCityConstellation } from '../cityConstellation.ts';
import { CV_DATA } from '../cvData.ts';

const out = 'artifacts/ascii-pass';
fs.mkdirSync(out, { recursive: true });
const originalFetch = globalThis.fetch;
globalThis.fetch = async url => {
  if (!String(url).startsWith('/data/geo-tiles/')) throw Error('Only bundled terrain is used');
  const bytes = fs.readFileSync(path.join('public', url));
  return { ok: true, arrayBuffer: async () => bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength) };
};
const land = await loadLandDots();
globalThis.fetch = originalFetch;
const source = ts.transpileModule(fs.readFileSync('JourneyGlobe.tsx', 'utf8').replaceAll('import.meta', '({ env: { DEV: true } })'), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020, jsx: ts.JsxEmit.React }
}).outputText;
const context = { exports: {}, require: name => name === 'react' ? { default: { memo: fn => fn } } : {} };
vm.runInNewContext(source, context);
const { lonLatToVec, cameraBasis, globeFrame, vecDot, vecSlerp } = context.exports;
const sampler = createAsciiGlobeSampler();
const frames = [], metrics = [];
for (const [w,h] of [[1000,800], [358,844]]) {
  const { baseR } = globeFrame(w,h), R = baseR * 1.08;
  const size = Math.ceil(R * 2 + 32);
  for (const city of CV_DATA.locations) {
    const view = lonLatToVec(city.lon,city.lat), basis = cameraBasis(view);
    const frame = { cx: size/2, cy: size/2, radius: R, mobile: w < 768, view, ...basis };
    const cells = [], dots = [];
    const lattice = sampler(land, frame, c => cells.push(c));
    for (let b=0;b<3;b++) for (let i=land.bands[b];i<land.bands[b+1];i++) {
      const v = Array.from(land.xyz.slice(i*3,i*3+3)), d = vecDot(v,view);
      if (d <= 0.14) continue;
      const scale = Math.max(0.75,Math.min(1.6,R/300));
      dots.push({ x:size/2+R*vecDot(v,basis.east), y:size/2-R*vecDot(v,basis.north),
        size:(0.75+d)*scale, band:b,
        alpha:[0.13,0.34,0.56,0.78][Math.min(3,((0.2+d*0.65)*Math.min(1,(d-0.14)/0.3)*4.5)|0)] });
    }
    frames.push({ city:city.city, mobile:w<768, size, radius:R, cells, dots, lattice });
  }
  const times = []; let count=0;
  for (let i=0;i<260;i++) {
    const view = vecSlerp(lonLatToVec(51.531,25.2854),lonLatToVec(2.3522,48.8566),(i%200)/200);
    const start = performance.now();
    sampler(land,{cx:0,cy:0,radius:R,mobile:w<768,view,...cameraBasis(view)},()=>{ count++; });
    if(i>=60) times.push(performance.now()-start);
  }
  times.sort((a,b)=>a-b);
  metrics.push({ viewport:[w,h], terrainPoints:land.xyz.length/3,
    medianSamplingMs:times[100], p95SamplingMs:times[190],
    meanGlyphs:count/260, note:'CPU sampler only; excludes font rasterization, canvas, DOM, compositor and GPU.' });
}
fs.mkdirSync('node_modules/.cache/ascii-pass', { recursive: true });
fs.writeFileSync('node_modules/.cache/ascii-pass/geometry.json',JSON.stringify({frames,constellation:buildCityConstellation(1000,800)}));
fs.writeFileSync(path.join(out,'metrics.json'),JSON.stringify({node:process.version,cpu:os.cpus()[0].model,metrics},null,2));
console.log(JSON.stringify(metrics,null,2));
