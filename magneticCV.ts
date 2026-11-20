import { globeScrollGeometry } from './abyssPalette';
import { SETTLE_MS } from './cinematicScroll';
import {
  chapterBounds,
  copyArrivePhase,
  createMagneticGestureMachine,
  depthGlideEase,
  depthPassagePhase,
  inSweepPhase,
  MAGNETIC_CHAPTERS,
  MAGNETIC_DRAIN_IDLE_MS,
  MAGNETIC_IDLE_GAP_MS,
  oceanWaveY,
  outSweepPhase,
  passage,
  titleArrivePhase,
  TRANSITION_DURATION_MS,
  transitionPresetFor,
  type GestureDirection
} from './magneticCVState';
import { createAbyssalCipher } from './abyssalCipher';
import { profileCityStops } from './profileCityStops';
import { mountProfileMemories } from './profileMemories';
import { MEMORY_DURATION, MEMORY_RETURN_DURATION } from './profileMemoryTimeline';

const TOLERANCE = 2;
/** Native touch momentum can continue briefly after finger lift inside a long chapter (ms). */
const TOUCH_MOMENTUM_MS = 1400;
/** Quiet delay before releasing temporary boundary clamping after native reading momentum (ms). */
const SCROLL_QUIET_MS = 180;

type ChapterKind = 'globe' | 'cv';
type Chapter = {
  id: string;
  kind: ChapterKind;
  el: HTMLElement;
  top: number;
  end: number;
};

const jump = (top: number) => window.scrollTo({ top, behavior: 'instant' as ScrollBehavior });

/**
 * Register a chapter to its reading viewport while the ocean glides underneath,
 * applying a smooth 15-point curved oceanic clipping polygon with generous outer margins so
 * 3D-scaled headings and text-shadow halos never crop at the viewport edge.
 */
function clipChapter(
  chapter: Chapter,
  anchor: number,
  y: number,
  edge: number,
  tilt: number,
  amp: number,
  phase: number,
  above: boolean
) {
  const offset = anchor - chapter.top;
  const outer = offset + (above ? -260 : innerHeight + 260);
  // Generous -12%..112% horizontal bounds ensure Phase 1 scaled-up headings never clip at the left/right margin.
  let pts = `-12% ${outer}px,112% ${outer}px`;
  const steps = 12;
  for (let i = steps; i >= 0; i--) {
    const u = i / steps;
    const xPct = -12 + u * 124;
    const wy = (oceanWaveY(u, edge, tilt, amp, phase) + offset).toFixed(1);
    pts += `,${xPct.toFixed(1)}% ${wy}px`;
  }
  chapter.el.style.translate = `0 ${y - anchor}px`;
  chapter.el.style.clipPath = `polygon(${pts})`;
}

export function mountMagneticCV() {
  const cvElements = [...document.querySelectorAll<HTMLElement>(MAGNETIC_CHAPTERS)];
  if (!cvElements.length) return;

  const runway = document.querySelector<HTMLElement>('[data-journey-runway]');
  const globeStage = (runway?.firstElementChild as HTMLElement | null) ?? null;

  const root = document.documentElement;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)');
  const lifetime = new AbortController();
  const options = { signal: lifetime.signal };
  const cipher = createAbyssalCipher();

  const gesture = createMagneticGestureMachine();
  const profile = cvElements.find(el => el.id === 'introduction');
  const itinerary = profile?.querySelector<HTMLElement>('.profile-itinerary');
  const memories = itinerary && mountProfileMemories(itinerary);
  let cityStops: number[] = [];
  let cityStep = 0;
  const isProfile = (ch: Chapter | null) => !!cityStops.length && ch?.el === profile;
  function selectStep(index: number, settle = true) {
    cityStep = Math.max(0, Math.min(index, cityStops.length - 1));
    if (settle) memories?.finish(reduce.matches || cityStep > 0);
  }
  let chapters: Chapter[] = [];
  let visibleChapter: Chapter | null = null;
  let animation: {
    from: Chapter;
    to: Chapter;
    dir: GestureDirection;
    focus: boolean;
    offset: number;
    duration: number;
    isGlobeHandoff: boolean;
    landingAtBottom: boolean;
    began: number;
    startY: number;
    endY: number;
  } | null = null;

  let frame = 0;
  let navigationFrame = 0;
  let expected = scrollY;
  let userInteracted = false;

  let touch: {
    chapter: Chapter;
    x: number;
    y: number;
    startY: number;
    taken: boolean;
    reading: boolean;
  } | null = null;
  let readingBounds: Chapter | null = null;
  let boundsTimer = 0;
  let rearmTimer = 0;
  let readingDirection: GestureDirection = 1;
  let fingers = 0;
  let lastTouchEnd = -Infinity;
  let touchFromOutside = false;
  let lastY = scrollY;
  let lastTransitionMs = 0;
  let lastDurationTargetMs = TRANSITION_DURATION_MS;
  let lastVeilFragments = 0;
  let transitionCount = 0;

  const shanghaiChapter = () => (chapters[0]?.kind === 'globe' ? chapters[0] : null);
  const firstCvChapter = () => chapters.find(c => c.kind === 'cv') ?? chapters[0];

  const blockedByOverlay = () =>
    root.hasAttribute('data-creation') ||
    root.hasAttribute('data-arrival') ||
    root.hasAttribute('data-globe-scroll') ||
    globeScrollGeometry.playing;

  const owns = () => {
    if (!chapters.length || blockedByOverlay()) return false;
    return scrollY >= chapters[0].top - TOLERANCE;
  };

  /** Desktop Globe holds a short settle window after arriving at Shanghai; respect it cleanly. */
  const isShanghaiSettled = (now: number) =>
    globeScrollGeometry.controlledY === null ||
    now - globeScrollGeometry.shanghaiReachedAt >= SETTLE_MS;

  const isAtShanghai = (y = scrollY) => {
    const sh = shanghaiChapter();
    return !!sh && Math.abs(y - sh.top) <= TOLERANCE + 2;
  };

  const chapterAt = (y: number): Chapter => {
    const sh = shanghaiChapter();
    const prof = firstCvChapter();
    if (sh && prof && y < (sh.top + prof.top) / 2) return sh;
    let index = sh ? 1 : 0;
    while (index + 1 < chapters.length && y + innerHeight / 2 >= chapters[index + 1].top) index++;
    return chapters[index];
  };

  function nextChapter(chapter: Chapter, dir: GestureDirection): Chapter | undefined {
    const step = cityStep + dir;
    if (isProfile(chapter) && step >= 0 && step < cityStops.length) return chapter;
    return chapters[chapters.indexOf(chapter) + dir];
  }

  const boundary = (chapter: Chapter, dir: GestureDirection) => (dir > 0 ? chapter.end : chapter.top);

  const ignoreTarget = (target: EventTarget | null) => {
    const modal = document.querySelector('[aria-modal="true"]');
    if (modal && getComputedStyle(modal).visibility !== 'hidden') return true;
    return (
      target instanceof Element &&
      !!target.closest('input,select,textarea,[contenteditable]:not([contenteditable="false"]),[role="dialog"]')
    );
  };

  /** Zero-UI, zero-overhead opt-in trace buffer for real-device trackpad inspection (?magneticDebug=1). */
  const debugTrace: Record<string, unknown>[] | null =
    new URLSearchParams(location.search).get('magneticDebug') === '1' ? [] : null;
  let debugLastWheelAt = -Infinity;
  let debugLastMoveX = NaN;
  let debugLastMoveY = NaN;
  const describeNode = (node: EventTarget | null | undefined): string => {
    if (!node) return 'null';
    if (node === window) return 'window';
    if (node === document) return 'document';
    if (!(node instanceof Element)) return String((node as Node).nodeName || node);
    const cls = typeof node.className === 'string' ? node.className.trim().split(/\s+/).filter(Boolean).slice(0, 2).join('.') : '';
    return `${node.tagName.toLowerCase()}${node.id ? '#' + node.id : ''}${cls ? '.' + cls : ''}`;
  };
  const recordDebug = (entry: Record<string, unknown>) => {
    if (!debugTrace) return;
    if (debugTrace.length >= 1200) debugTrace.shift();
    debugTrace.push(entry);
  };
  const wheelDebugBase = (e: WheelEvent, perfNow: number, now: number, gap: number) => {
    const tgt = e.target;
    const cs = tgt instanceof Element ? getComputedStyle(tgt) : null;
    const hit = Number.isFinite(e.clientX) && Number.isFinite(e.clientY) ? document.elementFromPoint(e.clientX, e.clientY) : null;
    const path = typeof e.composedPath === 'function' ? e.composedPath().slice(0, 6).map(describeNode) : [];
    return {
      kind: 'wheel',
      t: Math.round(perfNow),
      ts: Math.round(now),
      gap,
      x: Math.round(e.clientX),
      y: Math.round(e.clientY),
      dx: +e.deltaX.toFixed(2),
      dy: +e.deltaY.toFixed(2),
      mode: e.deltaMode,
      canc: e.cancelable,
      dpPre: e.defaultPrevented,
      tgt: describeNode(tgt),
      tgtConn: tgt instanceof Node ? tgt.isConnected : null,
      tgtPE: cs?.pointerEvents ?? null,
      tgtClip: cs?.clipPath && cs.clipPath !== 'none' ? cs.clipPath : null,
      hit: describeNode(hit),
      path,
      active: visibleChapter?.id ?? null,
      scrollY: Math.round(scrollY)
    };
  };

  /** Proactive transition-to-idle re-arming: never leaves the machine stranded in draining/reading. */
  function scheduleRearm() {
    clearTimeout(rearmTimer);
    rearmTimer = 0;
    const st = gesture.state;
    if (st === 'draining' || st === 'reading') {
      const threshold = st === 'draining' ? MAGNETIC_DRAIN_IDLE_MS : MAGNETIC_IDLE_GAP_MS;
      const elapsed = Number.isFinite(gesture.lastEventTime) ? Math.max(0, performance.now() - gesture.lastEventTime) : 0;
      const wait = Math.max(12, Math.ceil(threshold - elapsed) + 12);
      rearmTimer = window.setTimeout(() => {
        rearmTimer = 0;
        if (fingers || animation) return;
        const prevState = gesture.state;
        const now = performance.now();
        const rearmed = gesture.rearmIfQuiet(now);
        if (rearmed && debugTrace) {
          recordDebug({
            kind: 'rearm',
            t: Math.round(now),
            stateBefore: prevState,
            stateAfter: gesture.state,
            active: visibleChapter?.id ?? null,
            scrollY: Math.round(scrollY)
          });
        }
        if (!rearmed && (gesture.state === 'draining' || gesture.state === 'reading')) {
          scheduleRearm();
        }
      }, wait);
    }
  }

  /** Exclusive visibility: at rest, at most ONE CV chapter is readable; at Shanghai, ALL CV chapters are muted. */
  function show(active: Chapter | null) {
    if (visibleChapter === active) return;
    memories?.setActive(isProfile(active));
    root.toggleAttribute('data-profile-steps', isProfile(active));
    for (const el of cvElements) {
      el.toggleAttribute('data-cv-muted', !active || active.el !== el);
    }
    if (globeStage) {
      const prof = firstCvChapter();
      const muteGlobe = !!active && active.kind === 'cv' && (!prof || scrollY >= prof.top - TOLERANCE);
      globeStage.toggleAttribute('data-globe-muted', muteGlobe);
    }
    visibleChapter = active;
  }

  function releaseBounds() {
    clearTimeout(boundsTimer);
    boundsTimer = 0;
    readingBounds = null;
    root.removeAttribute('data-cv-boundary');
  }

  function scheduleReleaseBounds() {
    clearTimeout(boundsTimer);
    if (!fingers && (readingBounds || root.hasAttribute('data-cv-boundary'))) {
      boundsTimer = window.setTimeout(releaseBounds, SCROLL_QUIET_MS);
    }
  }

  /** Cancel native wheel scrolling without ever locking root overflow-y on desktop.
   * Also stops propagation from capture phase so bubble-phase controllers (e.g. Globe) never
   * compete with CV navigation even if Chromium delivers a non-cancelable async wheel packet. */
  function consumeWheel(e: WheelEvent) {
    if (e.cancelable) {
      e.preventDefault();
    }
    e.stopPropagation();
  }

  function clearAnimation(landing?: Chapter) {
    cancelAnimationFrame(frame);
    frame = 0;
    cipher.end();
    if (!animation) return;
    const { from, to } = animation;
    if (from === to && isProfile(to)) memories?.finish(reduce.matches || cityStep > 0);

    if (from.kind === 'globe') delete from.el.dataset.globeDepart;
    else delete from.el.dataset.cvDepart;
    if (to.kind === 'globe') delete to.el.dataset.globeArrive;
    else delete to.el.dataset.cvArrive;

    for (const ch of [from, to]) {
      ch.el.style.removeProperty('translate');
      ch.el.style.removeProperty('clip-path');
      ch.el.style.removeProperty('--cv-duration');
      ch.el.style.removeProperty('--cv-dir');
    }

    passage.destination = null;
    passage.progress = 0;
    passage.titleProgress = 0;
    passage.bodyProgress = 0;
    passage.depthSurge = 0;
    (window as { __magneticDepthSurge?: number }).__magneticDepthSurge = 0;
    passage.landingAtBottom = false;
    passage.settleAll = false;
    animation = null;
    visibleChapter = null;

    const target = landing ?? (scrollY < chapters[0].top - TOLERANCE ? shanghaiChapter() : chapterAt(scrollY));
    show(target);
    if (from !== to) passage.requestDecode?.();
  }

  function finish() {
    if (!animation) return;
    const { from, to, dir, focus, offset, began, endY } = animation;
    const now = performance.now();
    lastTransitionMs = Math.round(now - began);
    transitionCount++;

    // Guarantee every visible line on the landing screen is 100% crisply decoded.
    if (to.kind === 'cv' && from !== to) {
      passage.progress = 1;
      passage.titleProgress = 1;
      passage.bodyProgress = 1;
      passage.depthSurge = 0;
      passage.edge = dir > 0 ? innerHeight * 2 : -innerHeight;
      passage.settleAll = true;
      passage.requestDecode?.();
    }

    expected = endY;
    jump(endY);
    lastY = scrollY;
    clearAnimation(to);
    gesture.endTransition(now, fingers > 0);
    scheduleRearm();
    if (debugTrace) {
      recordDebug({
        kind: 'transition-end',
        t: Math.round(now),
        from: from.id,
        to: to.id,
        dir,
        ms: lastTransitionMs,
        stateAfter: gesture.state,
        active: visibleChapter?.id ?? null,
        scrollY: Math.round(scrollY)
      });
    }

    // Update URL hash and save reading state for Browser Back / Forward.
    if (to.kind === 'cv') {
      const targetHash = '#' + to.id;
      if (location.hash !== targetHash) {
        history.replaceState({ ...history.state, cvReading: { id: from.id, offset, step: isProfile(from) ? cityStep : undefined } }, '');
        history.pushState({ ...history.state, cvReading: { id: to.id, offset: endY - to.top, step: isProfile(to) ? cityStep : undefined } }, '', targetHash);
      } else if (isProfile(to)) {
        history.replaceState({ ...history.state, cvReading: { id: to.id, offset: endY - to.top, step: cityStep } }, '');
      }
      if (focus) to.el.focus({ preventScroll: true });
    } else {
      // Returning to Shanghai: clear CV hash cleanly while preserving Back/Forward state.
      if (location.hash) {
        history.replaceState({ ...history.state, cvReading: { id: from.id, offset, step: isProfile(from) ? cityStep : undefined } }, '');
        history.pushState({ ...history.state, cvReading: { id: to.id, offset: 0 } }, '', location.pathname + location.search);
      }
      globeScrollGeometry.requestRender?.();
    }
  }

  function start(from: Chapter, to: Chapter, dir: GestureDirection, keyboard = false, now = performance.now()) {
    userInteracted = true;
    const startY = scrollY;
    const cityMove = from === to;
    const transfer = !reduce.matches && cityMove && (dir > 0 ? cityStep === 0 : cityStep === 1);
    if (isProfile(to)) selectStep(cityMove ? cityStep + dir : dir > 0 ? 0 : cityStops.length - 1, !transfer);
    const endY = isProfile(to) ? cityStops[cityStep] : dir > 0 ? to.top : to.end;
    const isGlobeHandoff = from.kind === 'globe' || to.kind === 'globe';
    const preset = transitionPresetFor(from.id, to.id, dir);
    const duration = transfer ? (dir > 0 ? MEMORY_DURATION : MEMORY_RETURN_DURATION) : cityMove ? 540 : preset.duration;
    const landingOffset = Math.max(0, endY - to.top);
    const landingAtBottom = dir < 0 && landingOffset > 40;

    releaseBounds();
    clearTimeout(rearmTimer);
    rearmTimer = 0;
    gesture.beginTransition(dir, now);
    if (debugTrace) {
      recordDebug({
        kind: 'transition-start',
        t: Math.round(now),
        from: from.id,
        to: to.id,
        dir,
        keyboard,
        startY: Math.round(startY),
        endY: Math.round(endY)
      });
    }

    const focus = keyboard || (from.kind === 'cv' && from.el.contains(document.activeElement));

    lastDurationTargetMs = duration;
    animation = {
      from,
      to,
      dir,
      focus,
      offset: Math.max(0, startY - from.top),
      duration,
      isGlobeHandoff,
      landingAtBottom,
      began: now,
      startY,
      endY
    };
    if (isProfile(from) || isProfile(to)) root.setAttribute('data-profile-steps', '');

    if (to.kind === 'globe') {
      globeScrollGeometry.requestRender?.();
    }

    if (reduce.matches || (transfer && !memories?.begin(dir < 0))) {
      finish();
      return;
    }
    if (cityMove) {
      const glide = (time: number) => {
        const progress = Math.min(1, Math.max(0, (time - now) / duration));
        if (transfer) memories?.draw(dir > 0 ? progress : 1 - progress);
        const eased = depthGlideEase(progress);
        expected = Math.round(startY + (endY - startY) * eased);
        if (scrollY !== expected) jump(expected);
        if (progress === 1) finish();
        else frame = requestAnimationFrame(glide);
      };
      glide(now);
      return;
    }

    // Sample typography, lines & Globe geometry ONCE while departing chapter sits cleanly at rest.
    lastVeilFragments = cipher.begin({
      fromEl: from.el,
      fromKind: from.kind,
      toEl: to.el,
      toKind: to.kind,
      dir,
      duration,
      toLandingOffset: landingOffset,
      landingAtBottom,
      preset
    });

    passage.destination = to.kind === 'cv' ? to.el : null;
    passage.direction = dir;
    passage.landing = endY;
    passage.progress = 0;
    passage.titleProgress = 0;
    passage.bodyProgress = 0;
    passage.depthSurge = 0;
    passage.landingAtBottom = landingAtBottom;
    passage.settleAll = false;

    const height = innerHeight;
    const width = innerWidth;
    const tilt = -dir * Math.min(height * 0.125, width * 0.135) * preset.waveTiltScale;
    const waveAmp = Math.min(height * 0.050, 50) * preset.waveAmpScale;
    const phaseBase = dir > 0 ? 0.35 : 2.15;
    // Unveil heading-first top-to-bottom for CV top landings; unveil bottom-to-top when
    // landing at the lower edge of a tall CV section OR when returning upward to Shanghai Globe.
    const revealTopDown = to.kind === 'globe' ? dir > 0 : !landingAtBottom;

    for (const ch of [from, to]) {
      ch.el.style.setProperty('--cv-duration', `${duration}ms`);
      ch.el.style.setProperty('--cv-dir', String(dir));
    }

    if (from.kind === 'globe') {
      from.el.removeAttribute('data-globe-muted');
      from.el.dataset.globeDepart = '';
    } else {
      from.el.removeAttribute('data-cv-muted');
      from.el.dataset.cvDepart = '';
    }

    if (to.kind === 'globe') {
      to.el.removeAttribute('data-globe-muted');
      to.el.dataset.globeArrive = '';
    } else {
      to.el.removeAttribute('data-cv-muted');
      to.el.dataset.cvArrive = '';
    }

    const tick = (frameNow: number) => {
      if (!animation) return;
      if (blockedByOverlay()) {
        clearTimeout(rearmTimer);
        rearmTimer = 0;
        clearAnimation();
        gesture.reset();
        sync();
        return;
      }

      const t = Math.max(0, Math.min(1, (frameNow - now) / duration));
      const phase = phaseBase + t * 2.8;
      if (t > 0.5 && (isProfile(from) || isProfile(to))) memories?.setActive(isProfile(to));

      // Smooth ocean depth glide carrying scroll cleanly from departure to exact magnetic landing.
      const glideP = Math.max(0, Math.min(1, (t - 0.04) / 0.92));
      expected = Math.round(startY + (endY - startY) * depthGlideEase(glideP));
      if (scrollY !== expected) jump(expected);

      // Drive continuous ocean depth-current surge strictly during this passage.
      passage.depthSurge = dir * depthPassagePhase(t);
      (window as { __magneticDepthSurge?: number }).__magneticDepthSurge = passage.depthSurge;

      // Phase 1 -> 2: Outgoing curved directional oceanic sweep (t = 0.06 -> 0.43).
      // Engages visibly around 180–220ms and clears 100% by t = 0.43, opening into Phase 3.
      const outS = outSweepPhase(t);
      const outFrac = -0.05 + 1.24 * outS;
      const outEdge = height * (dir > 0 ? outFrac : 1 - outFrac);
      if (outS >= 1) {
        from.el.style.translate = `0 ${expected - startY}px`;
        from.el.style.clipPath = 'inset(50%)';
      } else if (outS <= 0) {
        from.el.style.translate = `0 ${expected - startY}px`;
        from.el.style.removeProperty('clip-path');
      } else {
        clipChapter(from, startY, expected, outEdge, tilt, waveAmp, phase, dir < 0);
      }

      // Phase 4: Incoming curved oceanic unveil (t = 0.57 -> 0.87), after the ~200ms open ocean passage.
      const inS = inSweepPhase(t);
      const inFrac = -0.14 + 1.42 * inS;
      const inEdge = height * (revealTopDown ? inFrac : 1 - inFrac);
      if (inS <= 0) {
        to.el.style.translate = `0 ${expected - endY}px`;
        to.el.style.clipPath = 'inset(50%)';
        passage.edge = revealTopDown ? -height * 0.25 : height * 1.25;
      } else if (inS >= 1) {
        to.el.style.translate = `0 ${expected - endY}px`;
        to.el.style.removeProperty('clip-path');
        passage.edge = revealTopDown ? height * 1.35 : -height * 0.35;
      } else {
        clipChapter(to, endY, expected, inEdge, tilt * 0.86, waveAmp * 0.86, phase + 0.85, revealTopDown);
        passage.edge = inEdge;
      }

      // Render Abyssal Cipher: synchronized plane depth, ASCII disintegration, current ribbon & directional decode.
      cipher.render({
        t,
        dir,
        outS,
        outEdge,
        inS,
        inEdge,
        tilt,
        amp: waveAmp,
        phase,
        fromIsGlobe: from.kind === 'globe',
        toIsGlobe: to.kind === 'globe'
      });

      // Drive permanent first-visit ASCII decryption on incoming CV chapters (completed lines untouched).
      if (to.kind === 'cv') {
        passage.progress = t;
        passage.titleProgress = titleArrivePhase(t);
        passage.bodyProgress = copyArrivePhase(t);
        if (t >= 0.93) passage.settleAll = true;
        passage.requestDecode?.();
      }

      if (t >= 1) finish();
      else frame = requestAnimationFrame(tick);
    };

    tick(now);
  }

  function onWheel(e: WheelEvent) {
    const perfNow = performance.now();
    // Prefer the browser's hardware event timestamp when on the performance.now() clock so a
    // brief main-thread paint stall never fabricates a false quiet gap mid-momentum.
    const now =
      Number.isFinite(e.timeStamp) && e.timeStamp > 0 && Math.abs(perfNow - e.timeStamp) < 1000
        ? Math.min(perfNow, e.timeStamp)
        : perfNow;
    const debugGap = Number.isFinite(debugLastWheelAt) ? Math.round(now - debugLastWheelAt) : -1;
    debugLastWheelAt = now;

    if (e.defaultPrevented || e.ctrlKey || e.metaKey || e.shiftKey || ignoreTarget(e.target)) {
      if (debugTrace) {
        const reason = e.defaultPrevented
          ? 'pre-defaultPrevented'
          : e.ctrlKey || e.metaKey || e.shiftKey
            ? 'modifier-key'
            : 'ignore-target';
        recordDebug({
          ...wheelDebugBase(e, perfNow, now, debugGap),
          reason,
          stateBefore: gesture.state,
          stateAfter: gesture.state,
          dpPost: e.defaultPrevented
        });
      }
      return;
    }

    const unit = e.deltaMode === 1 ? 16 : e.deltaMode === 2 ? innerHeight : 1;
    const delta = e.deltaY * unit;

    // While Profile is mid-transition or running the whale-to-photograph transfer, feed the
    // gesture state machine so momentum tails remain tracked cleanly for post-finish draining
    // while strictly blocking any queued or competing gestures.
    if (animation && (isProfile(animation.from) || isProfile(animation.to))) {
      if (delta) gesture.feedWheel(delta, now, () => ({ room: 0, hasTarget: false }));
      consumeWheel(e);
      return;
    }

    // Never leave the gesture machine stranded in transitioning/captured when no animation is running.
    if (!animation && (gesture.state === 'transitioning' || gesture.state === 'captured')) {
      gesture.reset();
    }

    const isHorizontalSwipe = Math.abs(e.deltaX) >= 6 && Math.abs(e.deltaX) > Math.abs(e.deltaY) * 4;
    if (!delta || Math.abs(e.deltaX) > Math.abs(e.deltaY) * 1.5) {
      // Prevent tiny horizontal/zero touch-down wobble (kPhaseBegan) inside magnetic CV ownership
      // from leaking into native compositor scrolling and turning the rest of the gesture non-cancelable.
      // Genuine horizontal two-finger swipes (|deltaX| >= 6 and > 4x |deltaY|) pass through untouched when idle.
      if (animation || gesture.state === 'draining' || (!isHorizontalSwipe && owns())) {
        consumeWheel(e);
      }
      if (debugTrace) {
        recordDebug({
          ...wheelDebugBase(e, perfNow, now, debugGap),
          reason: isHorizontalSwipe ? 'horizontal-swipe' : 'horizontal-or-zero',
          stateBefore: gesture.state,
          stateAfter: gesture.state,
          dpPost: e.defaultPrevented
        });
      }
      return;
    }

    if (!animation && !owns()) {
      gesture.noteExternalWheel(delta, now);
      scheduleRearm();
      if (debugTrace) {
        recordDebug({
          ...wheelDebugBase(e, perfNow, now, debugGap),
          dy: +delta.toFixed(2),
          reason: 'external-not-owned',
          stateBefore: gesture.state,
          stateAfter: gesture.state,
          dpPost: e.defaultPrevented
        });
      }
      return;
    }

    // While resting at Shanghai immediately after Globe completion, respect Globe's desktop settle window.
    if (!animation && isAtShanghai() && !isShanghaiSettled(perfNow)) {
      gesture.noteExternalWheel(delta, now);
      scheduleRearm();
      if (debugTrace) {
        recordDebug({
          ...wheelDebugBase(e, perfNow, now, debugGap),
          dy: +delta.toFixed(2),
          reason: 'shanghai-settle',
          stateBefore: gesture.state,
          stateAfter: gesture.state,
          dpPost: e.defaultPrevented
        });
      }
      return;
    }

    userInteracted = true;
    const stateBefore = gesture.state;
    const from = animation ? animation.to : chapterAt(scrollY);
    const hasSpan = !isProfile(from) && from.end - from.top > TOLERANCE;
    const action = gesture.feedWheel(delta, now, dir => {
      const to = nextChapter(from, dir);
      const edge = boundary(from, dir);
      const room = hasSpan ? (edge - scrollY) * dir : 0;
      return { room, hasTarget: !!to };
    });

    if (action.kind === 'ignore' || action.kind === 'passthrough') {
      releaseBounds();
      scheduleRearm();
      if (debugTrace) {
        recordDebug({
          ...wheelDebugBase(e, perfNow, now, debugGap),
          dy: +delta.toFixed(2),
          from: from.id,
          span: from.end - from.top,
          stateBefore,
          action: action.kind,
          stateAfter: gesture.state,
          dpPost: e.defaultPrevented
        });
      }
      return;
    }

    if (action.kind === 'consume') {
      consumeWheel(e);
      scheduleRearm();
      if (debugTrace) {
        recordDebug({
          ...wheelDebugBase(e, perfNow, now, debugGap),
          dy: +delta.toFixed(2),
          from: from.id,
          span: from.end - from.top,
          stateBefore,
          action: action.kind,
          stateAfter: gesture.state,
          dpPost: e.defaultPrevented
        });
      }
      return;
    }

    if (action.kind === 'read') {
      if (from.kind === 'cv') e.stopPropagation();
      root.removeAttribute('data-cv-boundary');
      readingBounds = from;
      readingDirection = Math.sign(delta) as GestureDirection;
      scheduleReleaseBounds();
      scheduleRearm();
      if (debugTrace) {
        recordDebug({
          ...wheelDebugBase(e, perfNow, now, debugGap),
          dy: +delta.toFixed(2),
          from: from.id,
          span: from.end - from.top,
          stateBefore,
          action: action.kind,
          stateAfter: gesture.state,
          dpPost: e.defaultPrevented
        });
      }
      return;
    }

    if (action.kind === 'clamp') {
      consumeWheel(e);
      jump(boundary(from, action.dir));
      scheduleRearm();
      if (debugTrace) {
        recordDebug({
          ...wheelDebugBase(e, perfNow, now, debugGap),
          dy: +delta.toFixed(2),
          from: from.id,
          span: from.end - from.top,
          stateBefore,
          action: action.kind,
          stateAfter: gesture.state,
          dpPost: e.defaultPrevented
        });
      }
      return;
    }

    // action.kind === 'snap'
    const to = nextChapter(from, action.dir);
    if (!to) {
      gesture.reset();
      if (debugTrace) {
        recordDebug({
          ...wheelDebugBase(e, perfNow, now, debugGap),
          dy: +delta.toFixed(2),
          from: from.id,
          span: from.end - from.top,
          stateBefore,
          action: 'snap-no-target',
          stateAfter: gesture.state,
          dpPost: e.defaultPrevented
        });
      }
      return;
    }
    consumeWheel(e);
    if (debugTrace) {
      recordDebug({
        ...wheelDebugBase(e, perfNow, now, debugGap),
        dy: +delta.toFixed(2),
        from: from.id,
        to: to.id,
        span: from.end - from.top,
        stateBefore,
        action: action.kind,
        stateAfter: 'transitioning',
        dpPost: e.defaultPrevented
      });
    }
    if (from.kind === 'globe') globeScrollGeometry.release?.();
    start(from, to, action.dir, false, perfNow);
  }

  function onKey(e: KeyboardEvent) {
    if (['Home', 'End', 'Tab', 'Escape'].includes(e.key)) {
      userInteracted = true;
      releaseBounds();
      if (animation) finish();
      return;
    }
    if (e.defaultPrevented || e.ctrlKey || e.metaKey || e.altKey || ignoreTarget(e.target)) return;
    if (e.key === ' ' && e.target instanceof Element && e.target.closest('a,button,summary')) return;
    const dir =
      e.key === ' '
        ? (e.shiftKey ? -1 : 1)
        : ['PageDown', 'ArrowDown'].includes(e.key)
          ? 1
          : ['PageUp', 'ArrowUp'].includes(e.key)
            ? -1
            : 0;
    if (!dir) return;
    if (!animation && !owns()) return;
    if (animation) {
      e.preventDefault();
      return;
    }
    if (isAtShanghai() && !isShanghaiSettled(performance.now())) return;

    userInteracted = true;
    const from = chapterAt(scrollY);
    const to = nextChapter(from, dir as GestureDirection);
    if (!to) return; // Lets ArrowUp/PageUp at Shanghai flow directly to cinematicScroll.

    const edge = boundary(from, dir as GestureDirection);
    const room = isProfile(from) ? 0 : (edge - scrollY) * dir;
    if (room > (e.key.startsWith('Arrow') ? 48 : innerHeight * 0.85)) return;

    e.preventDefault();
    if (room > TOLERANCE) {
      jump(edge);
      return;
    }
    if (e.repeat) return;
    if (from.kind === 'globe') globeScrollGeometry.release?.();
    start(from, to, dir as GestureDirection, true);
  }

  function onTouchStart(e: TouchEvent) {
    fingers = e.touches.length;
    releaseBounds();
    touch = null;

    if (e.touches.length !== 1 || ignoreTarget(e.target)) return;
    if (!animation && !owns()) {
      touchFromOutside = true;
      return;
    }

    userInteracted = true;
    touchFromOutside = false;
    const finger = e.touches[0];
    const chapter = animation ? animation.to : chapterAt(scrollY);
    const taken = !!animation || gesture.state === 'draining';
    // Inside CV chapters (or while transitioning/draining), stop propagation so cinematicScroll's
    // bubble-phase mobile touch controller never intercepts Profile -> Shanghai as a Globe reverse.
    if (taken || chapter.kind === 'cv') {
      e.stopImmediatePropagation();
    }
    touch = {
      chapter,
      startY: scrollY,
      x: finger.clientX,
      y: finger.clientY,
      taken,
      reading: false
    };
  }

  function onTouchMove(e: TouchEvent) {
    if (e.touches.length !== 1 || (window.visualViewport?.scale ?? 1) > 1) {
      touch = null;
      releaseBounds();
      return;
    }
    if (!touch) {
      if (readingBounds && e.cancelable) e.preventDefault();
      return;
    }
    if (touch.taken) {
      e.stopImmediatePropagation();
      if (e.cancelable) e.preventDefault();
      return;
    }
    if (e.defaultPrevented) return;

    const finger = e.touches[0];
    const dy = touch.y - finger.clientY;
    const dx = touch.x - finger.clientX;
    if (!dy || Math.abs(dy) < Math.abs(dx)) return;

    const dir = Math.sign(dy) as GestureDirection;
    const from = touch.chapter;
    const to = nextChapter(from, dir);

    // At Shanghai, upward gestures (dir = -1) pass cleanly to cinematicScroll unless draining.
    if (!to) {
      if (from.kind === 'globe' && dir < 0) {
        touch = null;
        return;
      }
      releaseBounds();
      return;
    }

    if (from.kind === 'globe' && !isShanghaiSettled(performance.now())) {
      touch = null;
      return;
    }

    // Long chapter reading: let native scroll run up to its reading edge, never past it.
    if (!isProfile(from) && (boundary(from, dir) - touch.startY) * dir > TOLERANCE) {
      touch.reading = true;
      readingDirection = dir;
      readingBounds = from;
      if ((boundary(from, dir) - scrollY) * dir <= TOLERANCE && e.cancelable) {
        e.preventDefault();
      }
      return;
    }

    // At a boundary with a valid adjacent target: claim the gesture exclusively so
    // neither native scroll nor cinematicScroll competes with the magnetic transition.
    e.stopImmediatePropagation();
    if (!e.cancelable) return;
    e.preventDefault();
    if (Math.abs(dy) >= 28) {
      touch.taken = true;
      if (from.kind === 'globe') globeScrollGeometry.release?.();
      start(from, to, dir);
    }
  }

  function onTouchEnd(e: TouchEvent) {
    if (touch?.taken || animation || touch?.chapter.kind === 'cv') {
      e.stopImmediatePropagation();
    }
    fingers = e.touches.length;
    if (!fingers) {
      lastTouchEnd = performance.now();
      if (touch?.taken && !animation) {
        gesture.reset();
      }
      touch = null;
      touchFromOutside = false;
      scheduleReleaseBounds();
      scheduleRearm();
    }
  }

  function sync() {
    if (!chapters.length) return;
    const now = performance.now();
    const prevY = lastY;
    lastY = scrollY;

    if (animation && Math.abs(scrollY - expected) > TOLERANCE) {
      const lo = Math.min(animation.startY, animation.endY) - 160;
      const hi = Math.max(animation.startY, animation.endY) + 160;
      if (animation.from !== animation.to && (scrollY < lo || scrollY > hi)) {
        clearTimeout(rearmTimer);
        rearmTimer = 0;
        clearAnimation();
        gesture.reset();
      } else {
        jump(expected);
        return;
      }
    }

    const inside = owns();
    const sh = shanghaiChapter();
    const prof = firstCvChapter();

    // Guard against native touch or external Globe inertia carrying past Shanghai into Profile.
    if (inside && sh && prof && prevY <= sh.top + TOLERANCE && scrollY > sh.top + TOLERANCE && !animation && !readingBounds) {
      const carriedTouch = touchFromOutside && (fingers > 0 || now - lastTouchEnd < TOUCH_MOMENTUM_MS);
      const externalDraining = gesture.state === 'draining' && now - gesture.lastEventTime < SCROLL_QUIET_MS;
      if (carriedTouch || externalDraining) {
        readingBounds = sh;
        readingDirection = 1;
        gesture.enterDraining(1, now);
        scheduleRearm();
      }
    }

    if (readingBounds && !animation) {
      const edge = boundary(readingBounds, readingDirection);
      if (
        !inside ||
        (readingDirection > 0 ? scrollY < readingBounds.top - TOLERANCE : scrollY > readingBounds.end + TOLERANCE)
      ) {
        releaseBounds();
      } else {
        if ((scrollY - edge) * readingDirection > 0) {
          // Only clamp root overflow-y during active touch momentum; on desktop, jump(edge) holds cleanly.
          if (fingers > 0 || now - lastTouchEnd < TOUCH_MOMENTUM_MS) {
            root.toggleAttribute('data-cv-boundary', true);
          }
          jump(edge);
        }
        scheduleReleaseBounds();
      }
    }

    if (!animation) {
      if (scrollY < chapters[0].top - TOLERANCE) {
        // Above Shanghai (Hero or Doha..Pau): mute all CV sections, keep Globe visible.
        show(sh);
      } else {
        const active = chapterAt(scrollY);
        if (isProfile(active) && !blockedByOverlay()) {
          if (!isProfile(visibleChapter)) {
            selectStep(cityStops.reduce((best, y, i) =>
              Math.abs(y - scrollY) < Math.abs(cityStops[best] - scrollY) ? i : best, 0));
          }
          if (Math.abs(scrollY - cityStops[cityStep]) > 0.5) jump(cityStops[cityStep]);
        }
        show(active);
      }
    }
  }

  function alignInitialHash() {
    if (userInteracted || animation) return;
    const initial = chapters.find(c => c.kind === 'cv' && '#' + c.id === location.hash);
    if (!initial) return;
    if (scrollY < 2 || Math.abs(scrollY - initial.top) <= innerHeight * 0.4) {
      if (isProfile(initial) && history.state?.cvReading?.id === initial.id) {
        selectStep(history.state.cvReading.step ?? 0);
      }
      if (Math.abs(scrollY - initial.top) > TOLERANCE) {
        jump(initial.top);
        lastY = scrollY;
      }
      show(initial);
      passage.settleAll = true;
      passage.requestDecode?.();
      passage.settleAll = false;
      sync();
    }
  }

  function measure() {
    const fresh: Chapter[] = [];
    let stepsChanged = false;
    if (runway && globeStage) {
      const rr = runway.getBoundingClientRect();
      const pr = globeStage.getBoundingClientRect();
      const stickyTop = parseFloat(getComputedStyle(globeStage).top) || 0;
      const shanghaiY = Math.round(rr.top + scrollY - stickyTop + Math.max(0, rr.height - pr.height));
      fresh.push({ id: 'journey', kind: 'globe', el: globeStage, top: shanghaiY, end: shanghaiY });
    }
    for (const el of cvElements) {
      const staged = el.style.translate;
      if (staged) el.style.removeProperty('translate');
      const bounds = chapterBounds(el);
      if (el === profile && itinerary) {
        const rawStops = profileCityStops(bounds.top, bounds.end, innerHeight);
        // Under prefers-reduced-motion, present all eight real photographs immediately on arrival
        // without requiring the extra animation-trigger scroll stop.
        const stops = reduce.matches ? rawStops.slice(1) : rawStops;
        stepsChanged = stops.length !== cityStops.length || stops.some((y, i) => y !== cityStops[i]);
        cityStops = stops;
        if (stepsChanged) selectStep(cityStep);
      }
      if (staged) el.style.translate = staged;
      fresh.push({ id: el.id, kind: 'cv', el, ...bounds });
    }

    const changed =
      stepsChanged || fresh.length !== chapters.length ||
      fresh.some((c, i) => c.top !== chapters[i]?.top || c.end !== chapters[i]?.end);

    if (changed) {
      readingBounds = readingBounds && (fresh.find(c => c.el === readingBounds!.el) ?? null);
      chapters = fresh;
      if (animation) {
        const nextTo = fresh.find(c => c.el === animation!.to.el);
        if (nextTo) {
          animation.to = nextTo;
          animation.endY = isProfile(nextTo) ? cityStops[cityStep] : animation.dir > 0 ? nextTo.top : nextTo.end;
        }
        finish();
      } else if (isProfile(visibleChapter)) {
        // A font swap or orientation change can move the entire section past
        // the old scroll position. Keep the selected city through remeasurement.
        jump(cityStops[cityStep]);
        lastY = scrollY;
      } else if (!userInteracted && location.hash) {
        alignInitialHash();
      }
    }
    sync();
  }

  function interrupt() {
    clearTimeout(rearmTimer);
    rearmTimer = 0;
    clearAnimation();
    touch = null;
    releaseBounds();
    touchFromOutside = false;
    gesture.reset();
    sync();
  }

  const focusable = cvElements.filter(el => !el.hasAttribute('tabindex'));
  focusable.forEach(el => { el.tabIndex = -1; });

  // Persistent capture-phase listeners ensure magneticCV can hand off cleanly with
  // cinematicScroll at Shanghai without listener-attachment races or focus/hover dependencies.
  window.addEventListener('wheel', onWheel, { ...options, passive: false, capture: true });
  window.addEventListener('keydown', onKey, { ...options, capture: true });
  window.addEventListener('touchstart', onTouchStart, { ...options, passive: true, capture: true });
  window.addEventListener('touchmove', onTouchMove, { ...options, passive: false, capture: true });
  window.addEventListener('touchend', onTouchEnd, { ...options, passive: true, capture: true });
  window.addEventListener('touchcancel', onTouchEnd, { ...options, passive: true, capture: true });

  measure();
  alignInitialHash();
  requestAnimationFrame(alignInitialHash);
  document.fonts?.ready.then(() => {
    if (!lifetime.signal.aborted) {
      measure();
      alignInitialHash();
    }
  }).catch(() => undefined);

  const size = new ResizeObserver(measure);
  cvElements.forEach(el => size.observe(el));
  if (runway) size.observe(runway);
  const mainEl = document.querySelector('main');
  if (mainEl) size.observe(mainEl);

  window.addEventListener('scroll', sync, { ...options, passive: true });
  window.addEventListener('resize', measure, options);

  function navigateHistory(event: Event) {
    userInteracted = true;
    interrupt();
    const saved = history.state?.cvReading as { id?: string; offset?: number; step?: number } | undefined;
    const anchor = chapters.find(c => '#' + c.id === location.hash);
    const destination = anchor ?? (!location.hash ? chapters.find(c => c.id === saved?.id) : undefined);
    if (!destination) return;

    const offset = saved?.id === destination.id && Number.isFinite(saved.offset) ? saved.offset! : 0;
    cancelAnimationFrame(navigationFrame);
    navigationFrame = requestAnimationFrame(() => {
      if (isProfile(destination)) selectStep(saved?.id === destination.id && Number.isInteger(saved.step) ? saved.step! : 0);
      const targetY = isProfile(destination) ? cityStops[cityStep] : Math.min(destination.end, destination.top + Math.max(0, offset));
      jump(targetY);
      lastY = scrollY;
      show(destination);
      if (destination.kind === 'cv') {
        passage.settleAll = true;
        passage.requestDecode?.();
        passage.settleAll = false;
        if (event.type === 'hashchange' || document.activeElement?.closest('[data-editorial-section]')) {
          destination.el.focus({ preventScroll: true });
        }
      } else {
        globeScrollGeometry.requestRender?.();
      }
    });
  }

  window.addEventListener('popstate', navigateHistory, options);
  window.addEventListener('hashchange', navigateHistory, options);
  window.addEventListener('pagehide', interrupt, options);
  document.addEventListener('visibilitychange', interrupt, options);

  reduce.addEventListener('change', () => {
    const chapter = animation?.to ?? (owns() ? chapters.find(c => '#' + c.id === location.hash) : undefined);
    if (animation) finish();
    measure();
    if (chapter) {
      const dest = chapters.find(c => c.el === chapter.el);
      if (dest) {
        const saved = history.state?.cvReading as { id?: string; offset?: number } | undefined;
        const offset = saved?.id === dest.id && Number.isFinite(saved.offset) ? saved.offset! : 0;
        jump(isProfile(dest) ? cityStops[cityStep] : Math.min(dest.end, dest.top + Math.max(0, offset)));
        lastY = scrollY;
        sync();
      }
    }
  }, options);

  document.addEventListener('focusin', e => {
    if (!(e.target instanceof HTMLElement)) return;
    const section = e.target.closest<HTMLElement>('[data-editorial-section]');
    if (!section || !cvElements.includes(section)) return;
    if (visibleChapter?.el !== section || animation) {
      userInteracted = true;
      interrupt();
      const dest = chapters.find(c => c.el === section);
      if (!dest) return;
      const wanted = Math.round(e.target.getBoundingClientRect().top + scrollY - innerHeight * 0.3);
      jump(Math.max(dest.top, Math.min(dest.end, wanted)));
      lastY = scrollY;
      show(dest);
      passage.settleAll = true;
      passage.requestDecode?.();
      passage.settleAll = false;
    }
  }, options);

  // Dev-only inspection handle for automated browser validation (tree-shaken in production).
  const win = window as unknown as Record<string, unknown>;
  if (debugTrace) {
    // Passive pointer-move marker strictly for opt-in ?magneticDebug=1 diagnostics
    // (never alters navigation state; lets real-trackpad traces compare before vs after cursor movement).
    window.addEventListener('pointermove', (e: PointerEvent) => {
      const x = Math.round(e.clientX);
      const y = Math.round(e.clientY);
      if (x === debugLastMoveX && y === debugLastMoveY) return;
      const fromX = debugLastMoveX;
      const fromY = debugLastMoveY;
      debugLastMoveX = x;
      debugLastMoveY = y;
      recordDebug({
        kind: 'pointermove',
        t: Math.round(performance.now()),
        fromX: Number.isFinite(fromX) ? fromX : null,
        fromY: Number.isFinite(fromY) ? fromY : null,
        x,
        y,
        hit: describeNode(document.elementFromPoint(x, y)),
        state: gesture.state,
        active: visibleChapter?.id ?? null,
        scrollY: Math.round(scrollY)
      });
    }, { ...options, capture: true, passive: true });

    win.__magneticCVTrace = debugTrace;
    win.__magneticCVDebug = {
      trace: debugTrace,
      status: () => ({
        gestureState: gesture.state,
        lockedDir: gesture.lockedDir,
        animating: !!animation,
        activeId: visibleChapter?.id ?? null,
        owns: owns(),
        blockedByOverlay: blockedByOverlay(),
        scrollY: Math.round(scrollY),
        viewport: { w: innerWidth, h: innerHeight, dpr: devicePixelRatio },
        chapters: chapters.map(c => ({ id: c.id, kind: c.kind, top: c.top, end: c.end, span: c.end - c.top })),
        traceCount: debugTrace.length
      }),
      dump: (limit = 200) => JSON.stringify({
        status: (win.__magneticCVDebug as { status: () => unknown }).status(),
        entries: debugTrace.slice(-limit)
      }, null, 2),
      clear: () => { debugTrace.length = 0; }
    };
  }
  if ((import.meta as { env?: { DEV?: boolean } }).env?.DEV) {
    win.__magneticCV = {
      snapshot: () => ({
        gestureState: gesture.state,
        lockedDir: gesture.lockedDir,
        animating: !!animation,
        activeId: visibleChapter?.id ?? null,
        scrollY,
        profileStep: cityStep,
        profileStopCount: cityStops.length,
        lastTransitionMs,
        lastDurationTargetMs,
        lastVeilFragments,
        transitionCount,
        chapters: chapters.map(c => ({ id: c.id, kind: c.kind, top: c.top, end: c.end }))
      })
    };
  }

  return () => {
    lifetime.abort();
    clearTimeout(rearmTimer);
    cancelAnimationFrame(navigationFrame);
    releaseBounds();
    size.disconnect();
    clearAnimation();
    root.removeAttribute('data-profile-steps');
    memories?.destroy();
    itinerary?.removeAttribute('data-plates');
    cipher.destroy();
    cvElements.forEach(el => delete el.dataset.cvMuted);
    if (globeStage) delete globeStage.dataset.globeMuted;
    focusable.forEach(el => el.removeAttribute('tabindex'));
    if (debugTrace) {
      delete win.__magneticCVTrace;
      delete win.__magneticCVDebug;
    }
    if ((import.meta as { env?: { DEV?: boolean } }).env?.DEV) {
      delete win.__magneticCV;
    }
    delete win.__magneticDepthSurge;
  };
}
