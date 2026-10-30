/** Opt-in development controls on the actual portfolio: /?whaleqa=1. Excluded from production. */
export function mountWhaleQA(api: {
  seek(t: number | null): void;
  orient(whale: number, yaw: number, pitch?: number, roll?: number): void;
  release(): void;
  reduced(value: boolean): void;
  state(): unknown;
  cinematic(p: number): void;
}) {
  const panel = document.createElement('details');
  panel.open = true;
  panel.dataset.whaleQa = '';
  panel.style.cssText = 'position:fixed;top:8px;left:8px;z-index:9999;padding:8px;background:#fffef8ee;color:#1f3b57;font:11px monospace;max-width:95vw;border:1px solid #aaa';
  panel.innerHTML = '<summary>Whale QA (development only)</summary>';
  const row = document.createElement('div');
  row.style.cssText = 'display:flex;gap:5px;flex-wrap:wrap;max-width:700px'; panel.appendChild(row);
  let timer: ReturnType<typeof setInterval> | undefined;
  const stop = () => { clearInterval(timer); timer = undefined; };
  const button = (label: string, action: () => void) => {
    const b = document.createElement('button'); b.textContent = label; b.type = 'button';
    b.style.cssText='border:1px solid #aaa;padding:3px;background:white;color:#1f3b57';
    b.onclick = () => { stop(); action(); }; row.appendChild(b);
  };
  for(const t of [0,20,40,60,90,145,236]) button(`Time ${t}`, () => api.seek(t));
  button('Live', api.release);
  button('Fast swim', () => { let t = 0; timer = setInterval(() => { t += 0.2; api.seek(t); }, 40); });
  for(const i of [0,1]) {
    for(const [name,yaw,pitch,roll] of [['side',Math.PI/2,0,0],['front',Math.PI,0,0],['rear',0,0,0],['top',0,Math.PI/2,0],['dive',Math.PI/2,-0.5,0.3]] as const)
      button(`${i ? 'B' : 'A'} ${name}`, () => { api.seek(0); api.orient(i,yaw,pitch,roll); });
    button(`${i ? 'B' : 'A'} 360`, () => {
      api.seek(0); let yaw=0;
      timer=setInterval(() => { yaw += Math.PI / 150; api.orient(i,yaw,0.08,0.12); if(yaw>=Math.PI*2)stop(); },40);
    });
  }
  for(const p of [-0.2,-0.1,-0.001,0,0.2,0.5,0.8,0.97,1,2,4]) button(`Cinema ${p}`,()=>api.cinematic(p));
  button('Reduce',()=>api.reduced(true)); button('Motion',()=>api.reduced(false));
  const output=document.createElement('output'); output.style.display='block';panel.appendChild(output);
  document.body.appendChild(panel);
  const update = () => {
    const state=api.state() as { seconds:number; frameCount:number; meanMs:number; quality:number; inCinema:boolean; reduced:boolean };
    output.dataset.whaleState=JSON.stringify(state);
    output.textContent=`${state.inCinema?'cinematic':'ambient'} | time ${state.seconds.toFixed(2)} | frame ${state.frameCount} | submit ${state.meanMs.toFixed(1)}ms | quality ${state.quality.toFixed(2)} | reduced ${state.reduced}`;
  };
  return { update, destroy: () => { stop(); panel.remove(); } };
}
