import { globeScrollGeometry } from './abyssPalette';
import { SETTLE_MS } from './cinematicScroll';
import {
  chapterBounds,
  createMagneticGestureMachine,
  depthGlideEase,
  inSweepPhase,
  MAGNETIC_CHAPTERS,
  outSweepPhase,
  passage,
  TRANSITION_DURATION_MS,
  type GestureDirection
} from './magneticCVState';

const TOLERANCE = 2;
/** Native touch momentum can continue briefly after finger lift inside a long chapter (ms). */
const TOUCH_MOMENTUM_MS = 1400;
/** Quiet delay before releasing temporary boundary clamping after native reading momentum (ms). */
const SCROLL_QUIET_MS = 200;

type ChapterKind = 'globe' | 'cv';
type Chapter = {
  id: string;
  kind: ChapterKind;
  el: HTMLElement;
  top: number;
  end: number;
};

type InkWord = {
  el: HTMLElement;
  y: number;
  x: number;
  glyphs: readonly [string, string, string];
  stage: '' | '1' | '2' | '3';
};

const DISSOLVE_GLYPHS: readonly (readonly [string, string, string])[] = [
  ['/:.', '~/:=.', '.:~/ '],
  ['::/', '/:+~:', '~.:/ '],
  ['.~:', '+=:/~', ':.~- '],
  ['/:~', '~::/+', '.-:~ ']
];

const jump = (top: number) => window.scrollTo({ top, behavior: 'instant' as ScrollBehavior });

/**
 * Sample visible word baselines once while the departing chapter sits at rest.
 * Keeps ASCII dissolution strictly bound to actual typography boxes (zero background clutter).
 */
function sampleDissolveWords(section: HTMLElement): InkWord[] {
  const box = section.getBoundingClientRect();
  if (!box.width) return [];
  const visible = [...section.querySelectorAll<HTMLElement>('.ascii-word')].flatMap(el => {
    const r = el.getBoundingClientRect();
    return r.width > 0 && r.bottom > -8 && r.top < innerHeight + 8
      ? [{ el, y: r.top + r.height / 2, x: Math.max(0, Math.min(1, (r.left + r.width / 2 - box.left) / box.width)) }]
      : [];
  });
  const stride = Math.max(1, Math.ceil(visible.length / 96));
  return visible
    .filter((w, i) => i % stride === 0 || !!w.el.closest('h2, h3, .lead, .entry-title'))
    .map((w, i) => ({
      ...w,
      glyphs: DISSOLVE_GLYPHS[i % DISSOLVE_GLYPHS.length],
      stage: '' as const
    }));
}

/**
 * Register a chapter to its reading viewport while the ocean scrolls underneath,
 * applying an angled directional clipping polygon with generous outer margins so scaled
 * headings and text-shadow halos never crop at the viewport edge.
 */
function clipChapter(chapter: Chapter, anchor: number, y: number, edge: number, tilt: number, above: boolean) {
  const offset = anchor - chapter.top;
  const left = edge + offset;
  const right = left + tilt;
  const outer = offset + (above ? -140 : innerHeight + 140);
  chapter.el.style.translate = `0 ${y - anchor}px`;
  chapter.el.style.clipPath = `polygon(0 ${outer}px,100% ${outer}px,100% ${right}px,0 ${left}px)`;
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

  const gesture = createMagneticGestureMachine();
  let chapters: Chapter[] = [];
  let visibleChapter: Chapter | null = null;
  let animation: {
    from: Chapter;
    to: Chapter;
    dir: GestureDirection;
    focus: boolean;
    offset: number;
    ink: InkWord[];
    began: number;
    startY: number;
    endY: number;
  } | null = null;

  let frame = 0;
  let navigationFrame = 0;
  let expected = scrollY;

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
  let readingDirection: GestureDirection = 1;
  let fingers = 0;
  let lastTouchEnd = -Infinity;
  let touchFromOutside = false;
  let lastY = scrollY;
  let lastTransitionMs = 0;
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

  const nextChapter = (chapter: Chapter, dir: GestureDirection): Chapter | undefined =>
    chapters[chapters.indexOf(chapter) + dir];

  const boundary = (chapter: Chapter, dir: GestureDirection) => (dir > 0 ? chapter.end : chapter.top);

  const ignoreTarget = (target: EventTarget | null) =>
    !!document.querySelector('[aria-modal="true"]') ||
    (target instanceof Element &&
      !!target.closest('input,select,textarea,[contenteditable]:not([contenteditable="false"]),[role="dialog"]'));

  /** Exclusive visibility: at rest, at most ONE CV chapter is readable; at Shanghai, ALL CV chapters are muted. */
  function show(active: Chapter | null) {
    if (visibleChapter === active) return;
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
    readingBounds = null;
    root.removeAttribute('data-cv-boundary');
  }

  function scheduleReleaseBounds() {
    clearTimeout(boundsTimer);
    if (!fingers && (readingBounds || root.hasAttribute('data-cv-boundary'))) {
      boundsTimer = window.setTimeout(releaseBounds, SCROLL_QUIET_MS);
    }
  }

  function consumeWheel(e: WheelEvent) {
    if (e.cancelable) {
      e.preventDefault();
    } else {
      // Only lock root overflow when the browser already refused cancellation.
      root.toggleAttribute('data-cv-boundary', true);
      scheduleReleaseBounds();
    }
  }

  function clearDissolveWords(ink: InkWord[]) {
    for (const word of ink) {
      if (word.stage) {
        delete word.el.dataset.dissolve;
        delete word.el.dataset.drift;
        word.stage = '';
      }
    }
  }

  function clearAnimation(landing?: Chapter) {
    cancelAnimationFrame(frame);
    frame = 0;
    if (!animation) return;
    const { from, to, ink } = animation;
    clearDissolveWords(ink);

    if (from.kind === 'globe') delete from.el.dataset.globeDepart;
    else delete from.el.dataset.cvDepart;
    if (to.kind === 'globe') delete to.el.dataset.globeArrive;
    else delete to.el.dataset.cvArrive;

    for (const ch of [from, to]) {
      ch.el.style.removeProperty('translate');
      ch.el.style.removeProperty('clip-path');
      ch.el.style.removeProperty('--cv-duration');
      ch.el.style.removeProperty('--cv-shift');
      ch.el.style.removeProperty('--cv-dir');
    }

    passage.destination = null;
    passage.settleAll = false;
    animation = null;
    visibleChapter = null;

    const target = landing ?? (scrollY < chapters[0].top - TOLERANCE ? shanghaiChapter() : chapterAt(scrollY));
    show(target);
    passage.requestDecode?.();
  }

  function finish() {
    if (!animation) return;
    const { from, to, dir, focus, offset, began, endY } = animation;
    const now = performance.now();
    lastTransitionMs = Math.round(now - began);
    transitionCount++;

    // Guarantee every visible line on the landing screen is 100% crisply decoded.
    if (to.kind === 'cv') {
      passage.edge = dir > 0 ? innerHeight * 2 : -innerHeight;
      passage.settleAll = true;
      passage.requestDecode?.();
    }

    expected = endY;
    jump(endY);
    lastY = scrollY;
    clearAnimation(to);
    gesture.endTransition(now, fingers > 0);

    // Update URL hash and save reading state for Browser Back / Forward.
    if (to.kind === 'cv') {
      const targetHash = '#' + to.id;
      if (location.hash !== targetHash) {
        history.replaceState({ ...history.state, cvReading: { id: from.id, offset } }, '');
        history.pushState({ ...history.state, cvReading: { id: to.id, offset: endY - to.top } }, '', targetHash);
      }
      if (focus) to.el.focus({ preventScroll: true });
    } else {
      // Returning to Shanghai: clear CV hash cleanly while preserving Back/Forward state.
      if (location.hash) {
        history.replaceState({ ...history.state, cvReading: { id: from.id, offset } }, '');
        history.pushState({ ...history.state, cvReading: { id: to.id, offset: 0 } }, '', location.pathname + location.search);
      }
      globeScrollGeometry.requestRender?.();
    }
  }

  function start(from: Chapter, to: Chapter, dir: GestureDirection, keyboard = false, now = performance.now()) {
    const startY = scrollY;
    const endY = dir > 0 ? to.top : to.end;
    releaseBounds();
    gesture.beginTransition(dir, now);

    const focus = keyboard || (from.kind === 'cv' && from.el.contains(document.activeElement));
    const ink = !reduce.matches && from.kind === 'cv' ? sampleDissolveWords(from.el) : [];

    animation = {
      from,
      to,
      dir,
      focus,
      offset: Math.max(0, startY - from.top),
      ink,
      began: now,
      startY,
      endY
    };

    if (to.kind === 'globe') {
      globeScrollGeometry.requestRender?.();
    }

    if (reduce.matches) {
      finish();
      return;
    }

    passage.destination = to.kind === 'cv' ? to.el : null;
    passage.direction = dir;
    passage.landing = endY;
    passage.settleAll = false;

    const height = innerHeight;
    const shiftPx = dir * Math.round(Math.min(34, Math.max(22, height * 0.034)));
    const tilt = -dir * Math.min(height * 0.09, innerWidth * 0.10);

    for (const ch of [from, to]) {
      ch.el.style.setProperty('--cv-duration', `${TRANSITION_DURATION_MS}ms`);
      ch.el.style.setProperty('--cv-shift', `${shiftPx}px`);
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
        clearAnimation();
        sync();
        return;
      }

      const t = Math.max(0, Math.min(1, (frameNow - now) / TRANSITION_DURATION_MS));
      const glideP = Math.max(0, Math.min(1, (t - 0.04) / 0.88));
      expected = Math.round(startY + (endY - startY) * depthGlideEase(glideP));
      if (scrollY !== expected) jump(expected);

      // 1. Outgoing sweep (t = 0.03 -> 0.48): completely gone before incoming reads.
      const outS = outSweepPhase(t);
      if (outS >= 1) {
        from.el.style.clipPath = 'inset(50%)';
        clearDissolveWords(ink);
      } else {
        const outFrac = -0.14 + 1.38 * outS;
        const outEdge = height * (dir > 0 ? outFrac : 1 - outFrac);
        clipChapter(from, startY, expected, outEdge, tilt, dir < 0);

        if (ink.length) {
          for (const word of ink) {
            const dist = dir * (word.y - outEdge - tilt * word.x);
            let nextStage: '' | '1' | '2' | '3' = '';
            if (dist >= -24 && dist < 26) nextStage = '3';
            else if (dist >= 26 && dist < 76) nextStage = '2';
            else if (dist >= 76 && dist < 132) nextStage = '1';

            if (nextStage !== word.stage) {
              word.stage = nextStage;
              if (nextStage) {
                word.el.dataset.dissolve = nextStage;
                word.el.dataset.drift = word.glyphs[Number(nextStage) - 1];
              } else {
                delete word.el.dataset.dissolve;
                delete word.el.dataset.drift;
              }
            }
          }
        }
      }

      // 2. Incoming unveil (t = 0.40 -> 0.92): clean depth separation behind outgoing.
      const inS = inSweepPhase(t);
      if (inS <= 0) {
        to.el.style.translate = `0 ${expected - endY}px`;
        to.el.style.clipPath = 'inset(50%)';
        passage.edge = dir > 0 ? -height * 0.25 : height * 1.25;
      } else {
        const inFrac = -0.12 + 1.44 * inS;
        const inEdge = height * (dir > 0 ? inFrac : 1 - inFrac);
        clipChapter(to, endY, expected, inEdge, tilt, dir > 0);
        passage.edge = inEdge + tilt / 2;
      }

      if (to.kind === 'cv') {
        if (t >= 0.96) passage.settleAll = true;
        passage.requestDecode?.();
      }

      if (t >= 1) finish();
      else frame = requestAnimationFrame(tick);
    };

    tick(now);
  }

  function onWheel(e: WheelEvent) {
    if (e.defaultPrevented || e.ctrlKey || e.metaKey || e.shiftKey || ignoreTarget(e.target)) return;
    const unit = e.deltaMode === 1 ? 16 : e.deltaMode === 2 ? innerHeight : 1;
    const delta = e.deltaY * unit;
    const now = performance.now();

    if (!delta || Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
      if (animation || gesture.state === 'draining') consumeWheel(e);
      return;
    }

    if (!animation && !owns()) {
      gesture.noteExternalWheel(delta, now);
      return;
    }

    // While resting at Shanghai immediately after Globe completion, respect Globe's desktop settle window.
    if (!animation && isAtShanghai() && !isShanghaiSettled(now)) {
      gesture.noteExternalWheel(delta, now);
      return;
    }

    const from = animation ? animation.to : chapterAt(scrollY);
    const action = gesture.feedWheel(delta, now, dir => {
      const to = nextChapter(from, dir);
      const edge = boundary(from, dir);
      const room = (edge - scrollY) * dir;
      return { room, hasTarget: !!to };
    });

    if (action.kind === 'ignore' || action.kind === 'passthrough') {
      releaseBounds();
      return;
    }

    if (action.kind === 'consume') {
      consumeWheel(e);
      return;
    }

    if (action.kind === 'read') {
      readingBounds = from;
      readingDirection = Math.sign(delta) as GestureDirection;
      scheduleReleaseBounds();
      return;
    }

    if (action.kind === 'clamp') {
      consumeWheel(e);
      jump(boundary(from, action.dir));
      return;
    }

    // action.kind === 'snap'
    const to = nextChapter(from, action.dir);
    if (!to) return;
    consumeWheel(e);
    if (from.kind === 'globe') globeScrollGeometry.release?.();
    start(from, to, action.dir, false, now);
  }

  function onKey(e: KeyboardEvent) {
    if (['Home', 'End', 'Tab', 'Escape'].includes(e.key)) {
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

    const from = chapterAt(scrollY);
    const to = nextChapter(from, dir as GestureDirection);
    if (!to) return; // Lets ArrowUp/PageUp at Shanghai flow directly to cinematicScroll.

    const edge = boundary(from, dir as GestureDirection);
    const room = (edge - scrollY) * dir;
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

    touchFromOutside = false;
    const finger = e.touches[0];
    const taken = !!animation || gesture.state === 'draining';
    touch = {
      chapter: animation ? animation.to : chapterAt(scrollY),
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
    if ((boundary(from, dir) - touch.startY) * dir > TOLERANCE) {
      touch.reading = true;
      readingDirection = dir;
      readingBounds = from;
      if ((boundary(from, dir) - scrollY) * dir <= TOLERANCE && e.cancelable) {
        e.preventDefault();
      }
      return;
    }

    // At a boundary with a valid adjacent target: cancel native scroll immediately so
    // no gap between Shanghai/Profile or adjacent CV sections ever appears.
    if (!e.cancelable) return;
    e.preventDefault();
    if (Math.abs(dy) >= 28) {
      touch.taken = true;
      if (from.kind === 'globe') globeScrollGeometry.release?.();
      start(from, to, dir);
    }
  }

  function onTouchEnd(e: TouchEvent) {
    fingers = e.touches.length;
    if (!fingers) {
      lastTouchEnd = performance.now();
      if (touch?.taken && !animation) {
        gesture.reset();
      }
      touch = null;
      touchFromOutside = false;
      scheduleReleaseBounds();
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
      if (scrollY < lo || scrollY > hi) {
        clearAnimation();
      } else {
        jump(expected);
        return;
      }
    }

    const inside = owns();
    const sh = shanghaiChapter();
    const prof = firstCvChapter();

    // Guard against native touch inertia carrying from the Globe runway past Shanghai into Profile.
    if (inside && sh && prof && prevY <= sh.top + TOLERANCE && scrollY > sh.top + TOLERANCE && !animation && !readingBounds) {
      const carriedTouch = touchFromOutside && (fingers > 0 || now - lastTouchEnd < TOUCH_MOMENTUM_MS);
      if (carriedTouch || now - gesture.lastEventTime < SCROLL_QUIET_MS) {
        readingBounds = sh;
        readingDirection = 1;
        gesture.enterDraining(1, now);
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
          root.toggleAttribute('data-cv-boundary', true);
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
        show(chapterAt(scrollY));
      }
    }
  }

  function measure() {
    const fresh: Chapter[] = [];
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
      if (staged) el.style.translate = staged;
      fresh.push({ id: el.id, kind: 'cv', el, ...bounds });
    }

    const changed =
      fresh.length !== chapters.length ||
      fresh.some((c, i) => c.top !== chapters[i]?.top || c.end !== chapters[i]?.end);

    if (changed) {
      readingBounds = readingBounds && (fresh.find(c => c.el === readingBounds!.el) ?? null);
      chapters = fresh;
      if (animation) {
        const nextTo = fresh.find(c => c.el === animation!.to.el);
        if (nextTo) {
          animation.to = nextTo;
          animation.endY = animation.dir > 0 ? nextTo.top : nextTo.end;
        }
        finish();
      }
    }
    sync();
  }

  function interrupt() {
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
  // cinematicScroll at Shanghai without listener-attachment races.
  window.addEventListener('wheel', onWheel, { ...options, passive: false, capture: true });
  window.addEventListener('keydown', onKey, { ...options, capture: true });
  window.addEventListener('touchstart', onTouchStart, { ...options, passive: true, capture: true });
  window.addEventListener('touchmove', onTouchMove, { ...options, passive: false, capture: true });
  window.addEventListener('touchend', onTouchEnd, { ...options, passive: true, capture: true });
  window.addEventListener('touchcancel', onTouchEnd, { ...options, passive: true, capture: true });

  measure();

  // Direct fragment link on initial load.
  const initial = chapters.find(c => c.kind === 'cv' && '#' + c.id === location.hash);
  if (initial && scrollY < 2) {
    jump(initial.top);
    lastY = scrollY;
    show(initial);
    passage.settleAll = true;
    passage.requestDecode?.();
    passage.settleAll = false;
    sync();
  }

  const size = new ResizeObserver(measure);
  cvElements.forEach(el => size.observe(el));
  if (runway) size.observe(runway);
  const mainEl = document.querySelector('main');
  if (mainEl) size.observe(mainEl);

  window.addEventListener('scroll', sync, { ...options, passive: true });
  window.addEventListener('resize', measure, options);

  function navigateHistory(event: Event) {
    interrupt();
    const saved = history.state?.cvReading as { id?: string; offset?: number } | undefined;
    const anchor = chapters.find(c => '#' + c.id === location.hash);
    const destination = anchor ?? (!location.hash ? chapters.find(c => c.id === saved?.id) : undefined);
    if (!destination) return;

    const offset = saved?.id === destination.id && Number.isFinite(saved.offset) ? saved.offset! : 0;
    cancelAnimationFrame(navigationFrame);
    navigationFrame = requestAnimationFrame(() => {
      const targetY = Math.min(destination.end, destination.top + Math.max(0, offset));
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
  window.addEventListener('pointerdown', e => {
    if (e.pointerType !== 'touch') releaseBounds();
  }, options);
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
        jump(Math.min(dest.end, dest.top + Math.max(0, offset)));
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
  if ((import.meta as { env?: { DEV?: boolean } }).env?.DEV) {
    win.__magneticCV = {
      snapshot: () => ({
        gestureState: gesture.state,
        lockedDir: gesture.lockedDir,
        animating: !!animation,
        activeId: visibleChapter?.id ?? null,
        scrollY,
        lastTransitionMs,
        transitionCount,
        chapters: chapters.map(c => ({ id: c.id, kind: c.kind, top: c.top, end: c.end }))
      })
    };
  }

  return () => {
    lifetime.abort();
    cancelAnimationFrame(navigationFrame);
    releaseBounds();
    size.disconnect();
    clearAnimation();
    cvElements.forEach(el => delete el.dataset.cvMuted);
    if (globeStage) delete globeStage.dataset.globeMuted;
    focusable.forEach(el => el.removeAttribute('tabindex'));
    if ((import.meta as { env?: { DEV?: boolean } }).env?.DEV) {
      delete win.__magneticCV;
    }
  };
}
