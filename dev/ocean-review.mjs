import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
const folder=resolve('artifacts/ocean-refinement');
const motion=JSON.parse(readFileSync(resolve(folder,'wake-validation.json'),'utf8'));
const timing=Object.fromEntries(motion.map(row=>[row.view.width,row.sequence.map(frame=>frame.time)]));
const html=`<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Ocean refinement — browser evidence</title>
<style>
body{margin:0;background:#f4f3ef;color:#17212d;font:15px/1.5 system-ui,sans-serif}main{max-width:1700px;margin:auto;padding:28px}h1{font-size:28px;margin:0 0 8px}p{max-width:900px}label{display:inline-flex;gap:8px;align-items:center;margin:8px 22px 8px 0}select,button{font:inherit;padding:8px 12px;border:1px solid #9ca6ad;border-radius:5px;background:white;color:inherit}button{cursor:pointer}.grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:16px;margin:22px 0 36px}figure{margin:0}figcaption{padding:8px 0;font-weight:650}img{display:block;width:100%;height:auto;background:#182651}.grid img{max-height:750px;object-fit:contain}.motion{max-width:1100px;margin:18px auto}.motion img{max-height:740px;object-fit:contain}.controls{display:flex;gap:12px;align-items:center;flex-wrap:wrap;margin:12px 0}input[type=range]{flex:1;min-width:180px}small{color:#54616b}a{color:#285a85}@media(max-width:800px){.grid{grid-template-columns:1fr}main{padding:18px}}
</style><main>
<h1>Clean ocean, whale-driven wake</h1>
<p>Actual Chromium captures at the same section offsets. Ocean time 40; whale seek time 24 after six seconds of swimming. These images preserve the original contrast. Click any still to inspect its full resolution.</p>
<label>Viewport <select id="width"><option value="1440">1440 × 900 · DPR 1</option><option value="390">390 × 844 · DPR 2</option><option value="320">320 × 740 · DPR 3</option></select></label>
<label>Section <select id="section"><option value="experience">Experience</option><option value="languages">Languages</option></select></label>
<label><input id="water" type="checkbox">Ocean layer only</label>
<div class="grid">
<figure><figcaption>Original · all additions off</figcaption><a id="a-original" target="_blank"><img id="original" alt="Original ocean"></a></figure>
<figure><figcaption>Before · old all-effects version</figcaption><a id="a-before" target="_blank"><img id="before" alt="Before refinement with global stroke bands"></a></figure>
<figure><figcaption>Refined · inertia + whale wake</figcaption><a id="a-refined" target="_blank"><img id="refined" alt="Refined clean ocean with local whale disturbance"></a></figure>
</div>
<h2>Whale motion — captured sequence</h2>
<p>The original projected whale animation drives these frames. Playback uses the recorded sampling intervals, including screenshot overhead; this is a sampled sequence, not a full-frame-rate recording. The wake and density remain at their normal page contrast.</p>
<div class="controls"><button id="play">Play sequence</button><label for="frame">Frame</label><input id="frame" type="range" min="0" max="11" value="0"><output id="stamp"></output></div>
<div class="motion"><img id="movie" alt="Recorded whale and wake movement"></div>
<h2>The same instant with and without the wake</h2>
<p>Both water images below use the refined shader at time 40. Clearing only its accumulated memory isolates the local disturbance.</p>
<div class="grid" style="grid-template-columns:repeat(2,minmax(0,1fr))"><figure><figcaption>With wake</figcaption><img id="with" alt="Water with the accumulated wake"></figure><figure><figcaption>Memory cleared</figcaption><img id="without" alt="The same water with no wake memory"></figure></div>
<p><a href="README.md">Full report</a> · <a href="performance-serial.json">Performance measurements</a> · <a href="wake-validation.json">Motion, locality, decay and scroll data</a></p>
<small>Mobile viewports are Chromium touch emulation on the same Windows AMD GPU. No physical iPhone or Android hardware was used.</small>
</main><script>
const times=${JSON.stringify(timing)};
const width=document.getElementById('width'),section=document.getElementById('section'),water=document.getElementById('water'),slider=document.getElementById('frame'),button=document.getElementById('play');let timer=0,playing=false;
function frame(){const n=Number(slider.value),w=width.value;document.getElementById('movie').src='motion-'+w+'-'+String(n).padStart(2,'0')+'.png';document.getElementById('stamp').textContent=(n+1)+' / 12 · whale time '+times[w][n].toFixed(2)+' s';}
function stop(){clearTimeout(timer);playing=false;button.textContent='Play sequence';}
function advance(){if(!playing)return;const n=Number(slider.value);if(n===11){stop();return;}timer=setTimeout(()=>{slider.value=String(n+1);frame();advance();},Math.max(50,(times[width.value][n+1]-times[width.value][n])*1000));}
function refresh(){stop();for(const mode of ['original','before','refined']){const src=mode+'-'+width.value+'-'+section.value+(water.checked?'-water.jpg':'.png');document.getElementById(mode).src=src;document.getElementById('a-'+mode).href=src;}for(const variant of ['with','without'])document.getElementById(variant).src='wake-'+width.value+'-'+variant+'.jpg';slider.value='0';frame();}
button.onclick=()=>{if(playing){stop();return;}if(Number(slider.value)===11)slider.value='0';playing=true;button.textContent='Pause';frame();advance();};slider.oninput=()=>{stop();frame();};width.onchange=refresh;section.onchange=refresh;water.onchange=refresh;refresh();
</script></html>`;
writeFileSync(resolve(folder,'review.html'),html);
console.log('Created '+resolve(folder,'review.html'));
