import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { creation, creationStage, finishCreation, CREATION_STAGES } from './creationTimeline';
import './creationIntro.css';

/** Controls only; rendering and time belong to the existing ocean's scheduler. */
export function CreationIntro() {
  const [, refresh] = useState(0);
  const [fading, setFading] = useState(false);
  const skip = useRef<HTMLButtonElement>(null);
  const qa = (import.meta as any).env.DEV && new URLSearchParams(location.search).has('creationqa');
  /** Leaving the cosmos mid-flight dips through its dark; past the waterline the water is already there. */
  const skipIntro = () => { if (creation.time < 81) setFading(true); finishCreation('skip'); };
  useLayoutEffect(() => {
    const update = () => refresh(n => n + 1);
    creation.listeners.add(update);
    return () => { creation.listeners.delete(update); };
  }, []);
  useLayoutEffect(() => {
    const root = document.documentElement;
    // index.html's pre-paint guess: the page's own water takes over if the opening will not play
    if (!creation.active) { delete root.dataset.creation; return; }
    const previousFocus = document.activeElement as HTMLElement | null;
    const previousOverflow = root.style.overflow;
    const previousGutter = root.style.scrollbarGutter;
    root.dataset.creation = 'active';
    root.style.scrollbarGutter = 'stable'; root.style.overflow = 'hidden';
    // Set on the layers themselves: a custom property on <html> would restyle the whole document
    // every frame of the fade. Only the compositor has work to do this way.
    const layers = [...document.querySelectorAll<HTMLElement>('main, nav, [aria-label="Site actions"], [data-hero-current], [data-ocean-life]')];
    creation.onHero = woken => {
      layers.forEach(el => { el.style.opacity = String(woken); });
      const controls = document.querySelector<HTMLElement>('.creation-controls');
      if (controls) controls.style.opacity = String(1 - woken);
    };
    const content = [...document.querySelectorAll<HTMLElement>('main, nav, [data-section-index], [aria-label="Site actions"]')];
    const previousInert = content.map(el => el.inert);
    content.forEach(el => { el.inert = true; });
    skip.current?.focus({ preventScroll: true });
    const block = (event: Event) => { event.preventDefault(); event.stopImmediatePropagation(); };
    const key = (event: KeyboardEvent) => {
      if (event.key === 'Escape') { block(event); skipIntro(); }
      else if (['ArrowDown', 'ArrowUp', 'PageDown', 'PageUp', 'Home', 'End', ' '].includes(event.key) && !(event.target instanceof HTMLButtonElement)) block(event);
      else if (event.key === 'Tab') {
        const buttons = [...document.querySelectorAll<HTMLButtonElement>('.creation-controls button')];
        if (event.shiftKey && document.activeElement === buttons[0]) { event.preventDefault(); buttons[buttons.length - 1]?.focus(); }
        else if (!event.shiftKey && document.activeElement === buttons[buttons.length - 1]) { event.preventDefault(); buttons[0]?.focus(); }
      }
    };
    window.addEventListener('wheel', block, { capture: true, passive: false });
    window.addEventListener('touchmove', block, { capture: true, passive: false });
    window.addEventListener('keydown', key, true);
    const motion = matchMedia('(prefers-reduced-motion: reduce)');
    const reduce = () => { if (motion.matches) finishCreation('reduced-motion'); };
    motion.addEventListener('change', reduce);
    return () => {
      delete root.dataset.creation; creation.onHero = null;
      layers.forEach(el => { el.style.removeProperty('opacity'); });
      root.style.overflow = previousOverflow; root.style.scrollbarGutter = previousGutter;
      content.forEach((el, i) => { el.inert = previousInert[i]; });
      window.removeEventListener('wheel', block, true); window.removeEventListener('touchmove', block, true);
      window.removeEventListener('keydown', key, true); motion.removeEventListener('change', reduce);
      if (previousFocus?.isConnected && previousFocus !== document.body) previousFocus.focus({ preventScroll: true });
      else { const hero = document.getElementById('home'); hero?.setAttribute('tabindex', '-1'); hero?.focus({ preventScroll: true }); }
    };
  }, [creation.active]);
  useEffect(() => {
    // Dev-only visual QA uses the same renderer and clock, never an alternate scene.
    if (!(import.meta as any).env.DEV) return;
    const api = { state: () => ({ active: creation.active, ready: creation.ready, time: creation.time, stage: creationStage(creation.time), reason: creation.reason }),
      seek: (t: number) => { creation.time = Math.max(0, Math.min(90.99, t)); creation.listeners.forEach(fn => fn()); },
      pause: (p: boolean) => { creation.paused = p; }, skip: () => finishCreation('skip') };
    (window as any).__creation = api;
    return () => { delete (window as any).__creation; };
  }, []);
  if (!creation.active) return fading ? <div className="creation-exit" aria-hidden="true" onAnimationEnd={() => setFading(false)} /> : null;
  const stage = creationStage(creation.time);
  return <div className="creation-controls" data-water={stage === 'OCEAN_ENTRY' || stage === 'WHALE_HANDOFF' ? '' : undefined} role="dialog" aria-modal="true" aria-label="Intro controls">
    <div className="creation-actions">
      <button onClick={() => { creation.paused = !creation.paused; refresh(n => n + 1); }}>{creation.paused ? 'Resume' : 'Pause'}</button>
      <button ref={skip} onClick={skipIntro}>Skip intro <span aria-hidden="true">↗</span></button>
    </div>
    {qa && <div className="creation-qa" style={{position:'absolute',top:85,right:20,pointerEvents:'auto',display:'flex',gap:4,flexWrap:'wrap',maxWidth:380}}>
      {CREATION_STAGES.map(([name,start]) => <button key={name} style={{background:'#07172b',color:'white',fontSize:9,padding:5}} onClick={() => { creation.time=start+.5; creation.paused=true; refresh(n=>n+1); }}>{name}</button>)}
      <label style={{background:'#07172b',padding:5,fontSize:10}}>Time <input aria-label="Preview time" type="number" min="0" max="90.9" step="0.1" defaultValue="0" style={{width:65,color:'black'}} onChange={e=>{creation.time=Math.max(0,Math.min(90.9,Number(e.target.value)));creation.paused=true;refresh(n=>n+1);}} /></label>
    </div>}
  </div>;
}
