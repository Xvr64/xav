import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import {
  CREATION_DURATION,
  CREATION_STAGES,
  OCEAN_HANDOFF_AT,
  HERO_RELEASE_AT,
  atJourneyStart,
  creation,
  creationProgress,
  creationStage,
  finishCreation,
  journeyClock,
  journeyRoute,
  journeyStage,
  reopenCreationInReverse,
  seekCreation,
  setCreationJourney,
  triggerCreationGesture,
  type JourneyId
} from './creationTimeline';
import { createWheelGestures } from './cinematicScroll';
import { holdRootScroll } from './rootScrollLock';
import './creationIntro.css';

/** Controls and scroll-scrubbing input; rendering and time belong to the existing ocean's scheduler. */
export function CreationIntro() {
  const [, refresh] = useState(0);
  const [fading, setFading] = useState(false);
  const skip = useRef<HTMLButtonElement>(null);
  const qa = (import.meta as any).env.DEV && new URLSearchParams(location.search).has('creationqa');
  /** Leaving the cosmos mid-flight dips through its dark; past the waterline the water is already there. */
  const skipIntro = () => { if (creation.time < OCEAN_HANDOFF_AT) setFading(true); finishCreation('skip'); };
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
    root.dataset.creation = 'active';
    // Held once and given back once (rootScrollLock.ts): the Globe may own the page's scrolling
    // by the time this effect cleans up, and a second restore would clear its lock
    const scrollHold = holdRootScroll(root.style);
    // Set on the layers themselves: a custom property on <html> would restyle the whole document
    // every frame of the fade. Only the compositor has work to do this way.
    const layers = [...document.querySelectorAll<HTMLElement>('main, nav, [aria-label="Site actions"], [data-hero-current], [data-ocean-life]')];
    // Once the title is legible the visitor is never held: the page is theirs again while the last
    // second of the arrival (whales settling, the camera coming to rest) finishes by itself.
    let released = false;
    const release = () => {
      if (released) return;
      released = true;
      delete root.dataset.creation;
      scrollHold.release();
      content.forEach((el, i) => { el.inert = previousInert[i]; });
      const controls = document.querySelector<HTMLElement>('.creation-controls');
      if (controls) controls.style.visibility = 'hidden';
    };
    creation.onHero = woken => {
      layers.forEach(el => { el.style.opacity = String(woken); });
      const controls = document.querySelector<HTMLElement>('.creation-controls');
      if (controls) controls.style.opacity = String(1 - woken);
      if (woken >= HERO_RELEASE_AT && creation.state === 'PLAYING_FORWARD') release();
    };
    const content = [...document.querySelectorAll<HTMLElement>('main, nav, [data-section-index], [aria-label="Site actions"]')];
    const previousInert = content.map(el => el.inert);
    content.forEach(el => { el.inert = true; });
    skip.current?.focus({ preventScroll: true });

    const gestures = createWheelGestures();
    let lastWheelAt = -Infinity;
    let lastWheelMag = 0;
    const block = (event: Event) => { if (released) return; event.preventDefault(); event.stopImmediatePropagation(); };
    const onWheel = (event: WheelEvent) => {
      if (event.ctrlKey || released) return;
      block(event);
      const unit = event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? Math.min(window.innerHeight, 360) : 1;
      const delta = event.deltaY * unit;
      if (!delta || Math.abs(event.deltaY) < Math.abs(event.deltaX)) return;
      const now = performance.now();
      lastWheelAt = now;
      lastWheelMag = Math.abs(delta);
      const gesture = gestures.feed(delta, now);
      if (gesture !== 0) {
        triggerCreationGesture(gesture as 1 | -1, 'wheel');
      }
    };

    let touchStartY = 0;
    let touchStartX = 0;
    let touchFiredDir: 0 | 1 | -1 = 0;
    const onTouchStart = (event: TouchEvent) => {
      if (event.touches.length !== 1 || event.target instanceof HTMLButtonElement) {
        touchFiredDir = 0;
        return;
      }
      touchStartY = event.touches[0].clientY;
      touchStartX = event.touches[0].clientX;
      touchFiredDir = 0;
    };
    const onTouchMove = (event: TouchEvent) => {
      if (released || event.target instanceof HTMLButtonElement) return;
      block(event);
      if (event.touches.length !== 1) return;
      const y = event.touches[0].clientY;
      const x = event.touches[0].clientX;
      const dy = touchStartY - y;
      const dx = touchStartX - x;
      if (Math.abs(dy) < Math.abs(dx) * 0.8) return;
      if (dy > 28 && touchFiredDir !== 1) {
        touchFiredDir = 1;
        triggerCreationGesture(1, 'touch');
      } else if (dy < -28 && touchFiredDir !== -1) {
        touchFiredDir = -1;
        triggerCreationGesture(-1, 'touch');
      }
    };
    const onTouchEnd = () => {
      touchFiredDir = 0;
    };
    const onTouchCancel = () => {
      touchFiredDir = 0;
    };

    const key = (event: KeyboardEvent) => {
      if (released) return;
      if (event.key === 'Escape') { block(event); skipIntro(); return; }
      if (event.key === 'Tab') {
        const buttons = [...document.querySelectorAll<HTMLButtonElement>('.creation-controls button')];
        if (event.shiftKey && document.activeElement === buttons[0]) { event.preventDefault(); buttons[buttons.length - 1]?.focus(); }
        else if (!event.shiftKey && document.activeElement === buttons[buttons.length - 1]) { event.preventDefault(); buttons[0]?.focus(); }
        return;
      }
      if (event.target instanceof HTMLInputElement) return;
      if (event.target instanceof HTMLButtonElement && (event.key === ' ' || event.key === 'Enter')) return;
      if (event.key === 'ArrowDown' || event.key === 'ArrowRight' || event.key === 'PageDown' || (event.key === ' ' && !event.shiftKey)) {
        block(event);
        triggerCreationGesture(1, 'key');
      } else if (event.key === 'ArrowUp' || event.key === 'ArrowLeft' || event.key === 'PageUp' || (event.key === ' ' && event.shiftKey)) {
        block(event);
        triggerCreationGesture(-1, 'key');
      } else if (event.key === 'Home') {
        block(event);
        seekCreation(0);
      } else if (event.key === 'End') {
        block(event);
        skipIntro();
      }
    };

    window.addEventListener('wheel', onWheel, { capture: true, passive: false });
    window.addEventListener('touchstart', onTouchStart, { capture: true, passive: true });
    window.addEventListener('touchmove', onTouchMove, { capture: true, passive: false });
    window.addEventListener('touchend', onTouchEnd, { capture: true, passive: true });
    window.addEventListener('touchcancel', onTouchCancel, { capture: true, passive: true });
    window.addEventListener('keydown', key, true);
    const motion = matchMedia('(prefers-reduced-motion: reduce)');
    const reduce = () => { if (motion.matches && !qa) finishCreation('reduced-motion'); };
    motion.addEventListener('change', reduce);
    return () => {
      delete root.dataset.creation; creation.onHero = null;
      layers.forEach(el => { el.style.removeProperty('opacity'); });
      scrollHold.release();
      content.forEach((el, i) => { el.inert = previousInert[i]; });
      window.removeEventListener('wheel', onWheel, true);
      window.removeEventListener('touchstart', onTouchStart, true);
      window.removeEventListener('touchmove', onTouchMove, true);
      window.removeEventListener('touchend', onTouchEnd, true);
      window.removeEventListener('touchcancel', onTouchCancel, true);
      window.removeEventListener('keydown', key, true);
      motion.removeEventListener('change', reduce);
      // Absorb only a continuing decaying momentum tail from the gesture that just finished the intro
      if (creation.reason === 'complete' && performance.now() - lastWheelAt < 120) {
        const settleEnd = performance.now() + 320;
        let prevMag = lastWheelMag;
        let prevAt = lastWheelAt;
        const absorbTail = (event: WheelEvent) => {
          const now = performance.now();
          const unit = event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? window.innerHeight : 1;
          const mag = Math.abs(event.deltaY * unit);
          if (now > settleEnd || now - prevAt > 140 || event.deltaY <= 0 || mag > prevMag * 1.35) {
            window.removeEventListener('wheel', absorbTail, true);
            return;
          }
          prevMag = mag;
          prevAt = now;
          event.preventDefault();
          event.stopImmediatePropagation();
        };
        window.addEventListener('wheel', absorbTail, { capture: true, passive: false });
      }
      if (previousFocus?.isConnected && previousFocus !== document.body) previousFocus.focus({ preventScroll: true });
      else { const hero = document.getElementById('home'); hero?.setAttribute('tabindex', '-1'); hero?.focus({ preventScroll: true }); }
    };
  }, [creation.active]);

  // When the intro has completed and the visitor is at the top of the page, allow an upward gesture to reverse into the intro naturally
  useEffect(() => {
    if (creation.active) return;
    const gestures = createWheelGestures();
    let touchStartY = 0;
    const onWheelReopen = (event: WheelEvent) => {
      if (window.scrollY > 2) return;
      if (event.ctrlKey) return;
      const unit = event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? Math.min(window.innerHeight, 360) : 1;
      const delta = event.deltaY * unit;
      if (delta >= 0) return;
      const gesture = gestures.feed(delta, performance.now());
      if (gesture === -1) {
        event.preventDefault();
        event.stopImmediatePropagation();
        reopenCreationInReverse();
      }
    };
    const onTouchStartReopen = (event: TouchEvent) => {
      if (window.scrollY <= 2 && event.touches.length === 1) {
        touchStartY = event.touches[0].clientY;
      }
    };
    const onTouchMoveReopen = (event: TouchEvent) => {
      if (window.scrollY > 2 || event.touches.length !== 1) return;
      const dy = touchStartY - event.touches[0].clientY;
      if (dy < -32) {
        reopenCreationInReverse();
      }
    };
    window.addEventListener('wheel', onWheelReopen, { capture: true, passive: false });
    window.addEventListener('touchstart', onTouchStartReopen, { passive: true });
    window.addEventListener('touchmove', onTouchMoveReopen, { passive: true });
    return () => {
      window.removeEventListener('wheel', onWheelReopen, true);
      window.removeEventListener('touchstart', onTouchStartReopen);
      window.removeEventListener('touchmove', onTouchMoveReopen);
    };
  }, [creation.active]);

  useEffect(() => {
    // Dev-only visual QA uses the same renderer and clock, never an alternate scene.
    if (!(import.meta as any).env.DEV) return;
    const api = {
      state: () => ({
        active: creation.active,
        ready: creation.ready,
        paused: creation.paused,
        playbackState: creation.state,
        rate: creation.rate,
        time: creation.time,
        target: creation.target,
        progress: creationProgress(),
        stage: journeyStage(creation.time),
        journey: journeyRoute().id,
        clock: journeyClock(),
        reason: creation.reason
      }),
      journey: (id: JourneyId) => setCreationJourney(id),
      seek: (t: number) => {
        seekCreation(Math.max(0, Math.min(CREATION_DURATION - 0.01, t)));
        creation.listeners.forEach(fn => fn());
      },
      playForward: () => triggerCreationGesture(1, 'wheel'),
      playReverse: () => triggerCreationGesture(-1, 'wheel'),
      reopen: () => reopenCreationInReverse(),
      scrub: (deltaPx: number) => {
        triggerCreationGesture(Math.sign(deltaPx) as 1 | -1, 'wheel');
      },
      pause: (p: boolean) => { creation.paused = p; },
      skip: () => finishCreation('skip')
    };
    (window as any).__creation = api;
    return () => { delete (window as any).__creation; };
  }, []);
  if (!creation.active) return fading ? <div className="creation-exit" aria-hidden="true" onAnimationEnd={() => setFading(false)} /> : null;
  const stage = creationStage(creation.time);
  // On the chosen journey's own first frame: the eye, or the Earth for Direct
  const showHint = atJourneyStart();
  return <div className="creation-controls" data-water={stage === 'OCEAN_ENTRY' || stage === 'WHALE_HANDOFF' ? '' : undefined} role="dialog" aria-modal="true" aria-label="Intro controls">
    <div className="creation-actions">
      <button onClick={() => {
        if (creation.paused) {
          creation.paused = false;
          if (creation.state === 'PAUSED') triggerCreationGesture(1, 'key');
        } else {
          creation.paused = true;
        }
        refresh(n => n + 1);
      }}>{creation.paused ? 'Resume' : 'Pause'}</button>
      <button ref={skip} onClick={skipIntro}>Skip intro <span aria-hidden="true">↗</span></button>
    </div>
    <div
      className={`creation-scroll-hint ${showHint ? 'creation-scroll-hint--visible' : ''}`}
      data-scroll-hint
      aria-hidden="true"
    >
      <span className="creation-scroll-hint-text">Scroll once to enter</span>
      <div className="creation-scroll-hint-line" />
    </div>
    {qa && <div className="creation-qa" style={{position:'absolute',top:85,right:20,pointerEvents:'auto',display:'flex',gap:4,flexWrap:'wrap',maxWidth:380}}>
      {CREATION_STAGES.map(([name,start]) => <button key={name} style={{background:'#07172b',color:'white',fontSize:9,padding:5}} onClick={() => { seekCreation(start + 0.15); refresh(n=>n+1); }}>{name}</button>)}
      <label style={{background:'#07172b',padding:5,fontSize:10}}>Time <input aria-label="Preview time" type="number" min="0" max="90.9" step="0.1" defaultValue="0" style={{width:65,color:'black'}} onChange={e=>{seekCreation(Math.max(0,Math.min(CREATION_DURATION,Number(e.target.value))));refresh(n=>n+1);}} /></label>
    </div>}
  </div>;
}
