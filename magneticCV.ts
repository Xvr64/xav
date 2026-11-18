import { globeScrollGeometry } from './abyssPalette';
import { createWheelGestures, GESTURE_GAP_MS } from './cinematicScroll';
import { chapterBounds, easedPhase, MAGNETIC_CHAPTERS, passage } from './magneticCVState';

const duration = 960;
const tolerance = 2;
/** Touch momentum keeps scrolling for about this long after the finger lifts (ms). */
const TOUCH_MOMENTUM_MS = 1600;
/** Without `scrollend` (Safari), native scrolling is over once it has been quiet this long (ms). */
const SCROLL_QUIET_MS = 220;
type Direction = -1 | 1;
type Chapter = { el: HTMLElement; top: number; end: number };
const jump = (top: number) => window.scrollTo({ top, behavior: 'instant' });

/** A few strokes lift from the baselines of visible words. Their accessible source and
 * the decoder's completed visual nodes are never replaced or re-scrambled. */
function liftType(section: HTMLElement) {
  const visible = [...section.querySelectorAll<HTMLElement>('.ascii-word')].filter(word => {
    const r = word.getBoundingClientRect();
    return r.bottom > 0 && r.top < innerHeight && r.width > 0;
  });
  const stride = Math.max(1, Math.ceil(visible.length / 36));
  const strokes = ['· ∼', '– ·', '·', '∼', '· –'];
  const marked = visible.filter((_, i) => i % stride === 0);
  marked.forEach((word, i) => {
    word.dataset.drift = strokes[i % strokes.length];
    word.style.setProperty('--cv-slip', String(.55 + ((i * 17) % 19) / 20));
  });
  return () => marked.forEach(word => {
    delete word.dataset.drift;
    word.style.removeProperty('--cv-slip');
  });
}

export function mountMagneticCV() {
  const elements = [...document.querySelectorAll<HTMLElement>(MAGNETIC_CHAPTERS)];
  if (!elements.length) return;
  const root = document.documentElement;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)');
  const lifetime = new AbortController();
  const options = { signal: lifetime.signal };
  let inputs: AbortController | null = null;
  let chapters: Chapter[] = [];
  let visible: HTMLElement | null = null;
  let animation: { from: Chapter; to: Chapter; dir: Direction; focus: boolean; offset: number; clear: () => void } | null = null;
  let frame = 0;
  let navigationFrame = 0;
  let haltFrame = 0;
  let expected = scrollY;
  let gestures = createWheelGestures();
  let tail = 0;
  let lastWheel = -Infinity;
  let touch: { chapter: Chapter; x: number; y: number; start: number; taken: boolean } | null = null;
  let touchBounds: Chapter | null = null;
  let boundsTimer = 0;
  // Input seen while the controller does not own the page (the Globe's runway, the cover):
  // a stream or a fling that began there is never a new deliberate gesture inside the CV.
  let fingers = 0;
  let lastTouchEnd = -Infinity;
  let lastScroll = -Infinity;
  let lastY = scrollY;

  const show = (el: HTMLElement | null) => {
    if (visible === el) return;
    for (const item of elements) item.toggleAttribute('data-cv-muted', item !== el);
    visible = el;
  };
  const chapterAt = (y: number) => {
    let index = 0;
    while (index + 1 < chapters.length && y + innerHeight / 2 >= chapters[index + 1].top) index++;
    return chapters[index];
  };
  const owns = () => scrollY >= chapters[0].top - tolerance && globeScrollGeometry.controlledY === null
    && !root.hasAttribute('data-globe-scroll') && !root.hasAttribute('data-creation') && !root.hasAttribute('data-arrival');
  const next = (chapter: Chapter, dir: Direction) => chapters[chapters.indexOf(chapter) + dir];
  const boundary = (chapter: Chapter, dir: Direction) => dir > 0 ? chapter.end : chapter.top;
  const ignore = (target: EventTarget | null) =>
    !!document.querySelector('[aria-modal="true"]') || (target instanceof Element &&
      !!target.closest('input,select,textarea,[contenteditable]:not([contenteditable="false"]),[role="dialog"]'));

  function clearAnimation() {
    cancelAnimationFrame(frame);
    if (!animation) return;
    const { from, to, clear } = animation;
    clear();
    delete from.el.dataset.cvDepart;
    delete to.el.dataset.cvArrive;
    for (const name of ['--cv-type', '--cv-foam', '--cv-dx', '--cv-dy', 'opacity']) from.el.style.removeProperty(name);
    for (const name of ['--cv-title', '--cv-body']) to.el.style.removeProperty(name);
    passage.destination = null;
    passage.progress = 0;
    animation = null;
    passage.requestDecode?.();
  }
  function finish() {
    if (!animation) return;
    const { from, to, dir, focus, offset } = animation;
    const landing = dir > 0 ? to.top : to.end;
    jump(landing);
    clearAnimation();
    show(to.el);
    // Remember reading positions within long chapters even when the original URL had no hash.
    if (location.hash !== '#' + to.el.id) {
      history.replaceState({ ...history.state, cvReading: { id: from.el.id, offset } }, '');
      history.pushState({ ...history.state, cvReading: { id: to.el.id, offset: landing - to.top } }, '', '#' + to.el.id);
    }
    if (focus) to.el.focus({ preventScroll: true });
  }
  function start(from: Chapter, to: Chapter, dir: Direction, keyboard = false) {
    const startY = scrollY;
    const endY = dir > 0 ? to.top : to.end;
    const began = performance.now();
    touchBounds = null;
    const focus = keyboard || from.el.contains(document.activeElement);
    animation = { from, to, dir, focus, offset: startY - from.top, clear: reduce.matches ? () => {} : liftType(from.el) };
    if (reduce.matches) { finish(); return; }
    passage.destination = to.el;
    passage.direction = dir;
    from.el.dataset.cvDepart = '';
    to.el.dataset.cvArrive = '';
    function tick(now: number) {
      if (!animation) return;
      if (!owns()) { clearAnimation(); sync(); return; }
      const t = Math.min(1, (now - began) / duration);
      passage.progress = t;
      const lift = easedPhase(t, 0, .35);
      if (t < .36) {
        from.el.style.setProperty('--cv-type', String(1 - easedPhase(t, .01, .25)));
        from.el.style.setProperty('--cv-foam', String(.8 * Math.sin(Math.PI * lift)));
        from.el.style.setProperty('--cv-dx', (dir * 80 * lift).toFixed(1) + 'px');
        from.el.style.setProperty('--cv-dy', (-dir * 19 * lift).toFixed(1) + 'px');
        from.el.style.opacity = String(1 - easedPhase(t, .21, .35));
      }
      show(t < .35 ? from.el : t < .49 ? null : to.el);
      to.el.style.setProperty('--cv-title', String(easedPhase(t, .49, .77)));
      to.el.style.setProperty('--cv-body', String(easedPhase(t, .63, .94)));
      expected = Math.round(startY + (endY - startY) * easedPhase(t, .15, .78));
      if (scrollY !== expected) jump(expected);
      passage.requestDecode?.();
      if (t >= 1) finish();
      else frame = requestAnimationFrame(tick);
    }
    tick(began);
  }
  function onWheel(e: WheelEvent) {
    if (e.defaultPrevented || !e.cancelable || e.ctrlKey || e.metaKey || e.shiftKey || !owns() ||
        Math.abs(e.deltaX) > Math.abs(e.deltaY) || !e.deltaY || ignore(e.target)) return;
    const now = performance.now();
    const dir = Math.sign(e.deltaY) as Direction;
    const delta = e.deltaY * (e.deltaMode === 1 ? 16 : e.deltaMode === 2 ? innerHeight : 1);
    if (now - lastWheel >= GESTURE_GAP_MS || dir !== tail) tail = 0;
    lastWheel = now;
    if (animation || tail) { e.preventDefault(); tail = dir; return; }
    const from = chapterAt(scrollY), to = next(from, dir);
    if (!to) return;
    const edge = boundary(from, dir);
    const room = (edge - scrollY) * dir;
    if (room > tolerance) {
      gestures = createWheelGestures();
      if (room <= Math.abs(delta)) { e.preventDefault(); jump(edge); tail = dir; }
      return;
    }
    e.preventDefault();
    if (gestures.feed(delta, now)) { tail = dir; start(from, to, dir); }
  }

  function onKey(e: KeyboardEvent) {
    if (['Home', 'End', 'Tab', 'Escape'].includes(e.key)) {
      if (animation) finish();
      return;
    }
    if (e.defaultPrevented || e.ctrlKey || e.metaKey || e.altKey || !owns() || ignore(e.target)) return;
    if (e.key === ' ' && e.target instanceof Element && e.target.closest('a,button,summary')) return;
    const dir = e.key === ' ' ? (e.shiftKey ? -1 : 1)
      : ['PageDown', 'ArrowDown'].includes(e.key) ? 1 : ['PageUp', 'ArrowUp'].includes(e.key) ? -1 : 0;
    if (!dir) return;
    if (animation) { e.preventDefault(); return; }
    const from = chapterAt(scrollY), to = next(from, dir);
    if (!to) return;
    const edge = boundary(from, dir);
    const room = (edge - scrollY) * dir;
    if (room > (e.key.startsWith('Arrow') ? 40 : innerHeight * .88)) return;
    e.preventDefault();
    if (room > tolerance) jump(edge);
    else if (!e.repeat) start(from, to, dir, true);
  }

  function touchStart(e: TouchEvent) {
    touch = null;
    touchBounds = null;
    if (e.touches.length !== 1 || !owns() || ignore(e.target)) return;
    const finger = e.touches[0];
    touch = { chapter: chapterAt(scrollY), start: scrollY, x: finger.clientX, y: finger.clientY, taken: !!animation };
  }
  function touchMove(e: TouchEvent) {
    if (e.touches.length !== 1 || (window.visualViewport?.scale ?? 1) > 1) { touch = null; touchBounds = null; return; }
    if (!touch) {
      if (touchBounds && e.cancelable) e.preventDefault();
      return;
    }
    const finger = e.touches[0], dy = touch.y - finger.clientY;
    if (e.defaultPrevented || Math.abs(dy) < Math.abs(touch.x - finger.clientX) || !dy) return;
    if (touch.taken) { if (e.cancelable) e.preventDefault(); return; }
    const dir = Math.sign(dy) as Direction, from = touch.chapter, to = next(from, dir);
    if (!to) { touchBounds = null; return; }
    if ((boundary(from, dir) - touch.start) * dir > tolerance) {
      touchBounds = from; // Native movement, including its momentum, up to the reading edge.
      if ((boundary(from, dir) - scrollY) * dir <= tolerance && e.cancelable) e.preventDefault();
      return;
    }
    if (!e.cancelable) return;
    e.preventDefault();
    if (Math.abs(dy) >= 28) { touch.taken = true; start(from, to, dir); }
  }
  function sync() {
    if (!chapters.length) return;
    const now = performance.now();
    const prevY = lastY;
    const moving = now - lastScroll < SCROLL_QUIET_MS;
    lastY = scrollY;
    lastScroll = now;
    if (animation && Math.abs(scrollY - expected) > tolerance) clearAnimation();
    const inside = owns();
    if (inside && prevY < chapters[0].top - tolerance && !animation && !touchBounds) {
      const flung = fingers > 0 || (moving && (now - lastTouchEnd < TOUCH_MOMENTUM_MS || now - lastWheel < GESTURE_GAP_MS));
      // Momentum carried in from the Globe's runway settles on the Profile instead of coasting
      // through the chapters beneath it. Programmatic and anchor scrolls are never held.
      if (flung && scrollY < chapters[0].end + innerHeight) touchBounds = chapters[0];
    }
    if (touchBounds && !animation) {
      const clamped = Math.max(touchBounds.top, Math.min(touchBounds.end, scrollY));
      if (Math.abs(scrollY - clamped) > tolerance) {
        // Halting overflow-y for one frame aborts an active mobile compositor fling curve;
        // scrollTo alone only nudges one frame while the compositor fling keeps advancing.
        if (!haltFrame && inside) {
          const prev = root.style.overflowY;
          root.style.overflowY = 'hidden';
          haltFrame = requestAnimationFrame(() => {
            haltFrame = 0;
            if (root.style.overflowY === 'hidden' && !root.hasAttribute('data-globe-scroll') && !root.hasAttribute('data-creation')) {
              if (prev) root.style.overflowY = prev;
              else root.style.removeProperty('overflow-y');
            }
            if (touchBounds && !animation) {
              const c = Math.max(touchBounds.top, Math.min(touchBounds.end, scrollY));
              if (Math.abs(scrollY - c) > tolerance) jump(c);
            }
          });
        }
        jump(clamped);
      }
      // Browsers without `scrollend` release the hold once native scrolling has gone quiet.
      clearTimeout(boundsTimer);
      boundsTimer = window.setTimeout(() => { if (!touch && !fingers) touchBounds = null; }, SCROLL_QUIET_MS);
    }
    if (!animation) show(chapterAt(scrollY).el);
    if (inside && !inputs) {
      inputs = new AbortController();
      const local = { signal: inputs.signal };
      window.addEventListener('wheel', onWheel, { ...local, passive: false });
      window.addEventListener('keydown', onKey, local);
      window.addEventListener('touchstart', touchStart, { ...local, passive: true });
      window.addEventListener('touchmove', touchMove, { ...local, passive: false });
      window.addEventListener('touchend', () => { touch = null; }, local);
      window.addEventListener('touchcancel', () => { touch = null; touchBounds = null; }, local);
    } else if (!inside && inputs) {
      inputs.abort(); inputs = null; tail = 0; touch = null; touchBounds = null;
      gestures = createWheelGestures();
    }
  }
  function measure() {
    const fresh = elements.map(el => ({ el, ...chapterBounds(el) }));
    if (fresh.some((s, i) => s.top !== chapters[i]?.top || s.end !== chapters[i]?.end)) {
      // A collapsing mobile toolbar resizes mid-fling: keep holding the same chapter.
      touchBounds = touchBounds && (fresh.find(c => c.el === touchBounds!.el) ?? null);
      chapters = fresh;
      if (animation) {
        animation.to = fresh.find(c => c.el === animation.to.el)!;
        finish();
      }
    }
    sync();
  }
  function interrupt() {
    clearAnimation(); touch = null; touchBounds = null; tail = 0; sync();
  }
  const focusable = elements.filter(el => !el.hasAttribute('tabindex'));
  focusable.forEach(el => el.tabIndex = -1);
  // Registered before the CV's own listeners, so they see input that began outside the CV.
  window.addEventListener('wheel', e => {
    if (inputs || !e.deltaY) return;
    lastWheel = performance.now();
    tail = Math.sign(e.deltaY) as Direction;
  }, { ...options, passive: true });
  window.addEventListener('touchstart', e => { fingers = e.touches.length; }, { ...options, passive: true });
  const lifted = (e: TouchEvent) => {
    fingers = e.touches.length;
    if (!fingers) lastTouchEnd = performance.now();
  };
  window.addEventListener('touchend', lifted, { ...options, passive: true });
  window.addEventListener('touchcancel', lifted, { ...options, passive: true });
  measure();
  // React can mount after the browser's first attempt to resolve the initial fragment.
  const initial = chapters.find(c => '#' + c.el.id === location.hash);
  if (initial && scrollY < 2) { jump(initial.top); sync(); }
  const size = new ResizeObserver(measure);
  elements.forEach(el => size.observe(el));
  size.observe(document.querySelector('main')!);
  window.addEventListener('scroll', sync, { ...options, passive: true });
  window.addEventListener('resize', measure, options);
  function navigateHistory(event: Event) {
    interrupt();
    const saved = history.state?.cvReading;
    const anchor = chapters.find(c => '#' + c.el.id === location.hash);
    const destination = anchor ?? (!location.hash && chapters.find(c => c.el.id === saved?.id));
    if (!destination) return;
    // A traversal fires popstate and then hashchange. Let the UA restore its scroll first.
    const offset = saved?.id === destination.el.id && Number.isFinite(saved.offset) ? saved.offset : 0;
    cancelAnimationFrame(navigationFrame);
    navigationFrame = requestAnimationFrame(() => {
      jump(Math.min(destination.top + Math.max(0, offset), destination.end));
      show(destination.el);
      if (event.type === 'hashchange' || document.activeElement?.closest('[data-editorial-section]')) {
        destination.el.focus({ preventScroll: true });
      }
    });
  }
  window.addEventListener('popstate', navigateHistory, options);
  window.addEventListener('hashchange', navigateHistory, options);
  window.addEventListener('pagehide', interrupt, options);
  window.addEventListener('pointerdown', e => {
    if (e.pointerType !== 'touch') interrupt();
  }, options);
  document.addEventListener('visibilitychange', interrupt, options);
  reduce.addEventListener('change', () => {
    const chapter = animation?.to.el ?? (inputs && elements.find(el => '#' + el.id === location.hash));
    if (animation) finish();
    measure(); // The reduced-motion stylesheet also changes the length of the Globe runway.
    if (chapter) {
      const dest = chapters.find(c => c.el === chapter)!;
      const saved = history.state?.cvReading;
      const offset = saved?.id === chapter.id && Number.isFinite(saved.offset) ? saved.offset : 0;
      jump(Math.min(dest.end, dest.top + Math.max(0, offset)));
      sync();
    }
  }, options);
  document.addEventListener('focusin', e => {
    if (!(e.target instanceof HTMLElement)) return;
    const chapter = e.target.closest<HTMLElement>('[data-editorial-section]');
    if (!elements.includes(chapter)) return;
    if (chapter !== visible || animation) {
      interrupt();
      const dest = chapters.find(c => c.el === chapter)!;
      // Bring the focused control itself into view: in a long chapter it may sit far below the top.
      const wanted = Math.round(e.target.getBoundingClientRect().top + scrollY - innerHeight * .3);
      jump(Math.max(dest.top, Math.min(dest.end, wanted)));
      show(chapter);
    }
  }, options);
  return () => {
    lifetime.abort(); inputs?.abort(); cancelAnimationFrame(navigationFrame); cancelAnimationFrame(haltFrame); clearTimeout(boundsTimer); size.disconnect(); clearAnimation();
    elements.forEach(el => delete el.dataset.cvMuted);
    focusable.forEach(el => el.removeAttribute('tabindex'));
  };
}
