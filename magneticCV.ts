import { globeScrollGeometry } from './abyssPalette';
import { GESTURE_PX } from './cinematicScroll';
import { chapterBounds, easedPhase, MAGNETIC_CHAPTERS, passage } from './magneticCVState';

const duration = 580;
const tolerance = 2;
/** Touch momentum keeps scrolling for about this long after the finger lifts (ms). */
const TOUCH_MOMENTUM_MS = 1600;
/** Without `scrollend` (Safari), native scrolling is over once it has been quiet this long (ms). */
const SCROLL_QUIET_MS = 220;
type Direction = -1 | 1;
type Chapter = { el: HTMLElement; top: number; end: number };
const jump = (top: number) => window.scrollTo({ top, behavior: 'instant' });

// Sample source baselines once, while the chapter is at its reading position.
// Only words within a narrow strip ahead of the moving cut shed their ink.
function edgeWords(section: HTMLElement) {
  const box = section.getBoundingClientRect();
  const words = [...section.querySelectorAll<HTMLElement>('.ascii-word')].flatMap(el => {
    const r = el.getBoundingClientRect();
    return r.width && r.bottom > 0 && r.top < innerHeight
      ? [{ el, y: r.top + r.height / 2, x: (r.left + r.width / 2 - box.left) / box.width }] : [];
  });
  const glyphs = ['~/:.', '::/~', '.+~:', '/:~.'];
  const stride = Math.max(1, Math.ceil(words.length / 36));
  return words.filter((word, i) => i % stride === 0 || word.el.closest('h2'))
    .map((word, i) => ({ ...word, glyphs: glyphs[i % glyphs.length] }));
}

// Register the semantic section to its own reading screen as the ocean travels
// underneath. The two polygons share exactly the same sloping viewport edge.
function clipChapter(chapter: Chapter, anchor: number, y: number, edge: number, tilt: number, above: boolean) {
  const offset = anchor - chapter.top;
  const left = edge + offset, right = left + tilt;
  const outer = offset + (above ? 0 : innerHeight);
  chapter.el.style.translate = `0 ${y - anchor}px`;
  chapter.el.style.clipPath = `polygon(0 ${outer}px,100% ${outer}px,100% ${right}px,0 ${left}px)`;
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
  let animation: { from: Chapter; to: Chapter; dir: Direction; focus: boolean; offset: number; ink: ReturnType<typeof edgeWords> } | null = null;
  let frame = 0;
  let navigationFrame = 0;
  let expected = scrollY;
  // Browsers expose wheel deltas, not physical gesture IDs. Every event renews
  // ownership; neither a sign change nor a stronger delta releases a stream.
  let wheelMode: 'armed' | 'reading' | 'consumed' = 'armed';
  let wheelTravel = 0;
  let lastWheel = -Infinity;
  let touch: { chapter: Chapter; x: number; y: number; start: number; taken: boolean } | null = null;
  let readingBounds: Chapter | null = null;
  let boundsTimer = 0;
  let readingDirection: Direction = 1;
  let atProfileEntry = false;
  // Input seen while the controller does not own the page (the Globe's runway, the cover):
  // a stream or a fling that began there is never a new deliberate gesture inside the CV.
  let fingers = 0;
  let lastTouchEnd = -Infinity;
  let touchFromRunway = false;
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

  function releaseBounds() {
    clearTimeout(boundsTimer);
    readingBounds = null;
    atProfileEntry = false;
    root.removeAttribute('data-cv-boundary');
  }
  function releaseAfterFling() {
    clearTimeout(boundsTimer);
    if (!fingers && readingBounds) boundsTimer = window.setTimeout(releaseBounds, SCROLL_QUIET_MS);
  }
  function consumeWheel(e: WheelEvent) {
    if (e.cancelable) e.preventDefault();
    // Some engines make only the first wheel packet cancelable. Hold native
    // panning for the owned stream; programmatic scroll and hit testing still work.
    root.toggleAttribute('data-cv-boundary', true);
    clearTimeout(boundsTimer);
    boundsTimer = window.setTimeout(releaseBounds, SCROLL_QUIET_MS);
  }
  function clearAnimation(landing?: HTMLElement) {
    cancelAnimationFrame(frame);
    if (!animation) return;
    const { from, to, ink } = animation;
    for (const { el } of ink) delete el.dataset.drift;
    delete from.el.dataset.cvDepart;
    delete to.el.dataset.cvArrive;
    for (const el of [from.el, to.el]) {
      el.style.removeProperty('translate');
      el.style.removeProperty('clip-path');
      el.style.removeProperty('--cv-duration');
      el.style.removeProperty('--cv-shift');
    }
    visible = null;
    show(landing ?? chapterAt(scrollY).el);
    passage.destination = null;
    animation = null;
    passage.requestDecode?.();
  }
  function finish() {
    if (!animation) return;
    const { from, to, dir, focus, offset } = animation;
    const landing = dir > 0 ? to.top : to.end;
    jump(landing);
    clearAnimation(to.el);
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
    releaseBounds();
    const focus = keyboard || from.el.contains(document.activeElement);
    const ink = reduce.matches ? [] : edgeWords(from.el);
    animation = { from, to, dir, focus, offset: startY - from.top, ink };
    if (reduce.matches) { finish(); return; }
    passage.destination = to.el;
    passage.direction = dir;
    passage.landing = endY;
    const height = innerHeight;
    const tilt = -dir * Math.min(height * .08, innerWidth * .095);
    for (const el of [from.el, to.el]) {
      el.style.setProperty('--cv-duration', duration + 'ms');
      el.style.setProperty('--cv-shift', dir * 14 + 'px');
    }
    from.el.dataset.cvDepart = '';
    to.el.dataset.cvArrive = '';
    // The mask is the only boundary between these two live compositions.
    to.el.removeAttribute('data-cv-muted');
    function tick(now: number) {
      if (!animation) return;
      if (!owns()) { clearAnimation(); sync(); return; }
      const t = Math.min(1, (now - began) / duration);
      const sweep = easedPhase(t, .04, .98);
      const fraction = -.10 + 1.43 * sweep;
      const edge = height * (dir > 0 ? fraction : 1 - fraction);
      passage.edge = edge + tilt / 2;
      expected = Math.round(startY + (endY - startY) * easedPhase(t, .05, .91));
      if (scrollY !== expected) jump(expected);
      clipChapter(from, startY, expected, edge, tilt, dir < 0);
      clipChapter(to, endY, expected, edge, tilt, dir > 0);
      for (const word of ink) {
        const distance = dir * (word.y - edge - tilt * word.x);
        if (distance >= -18 && distance < height * .085) {
          if (!word.el.hasAttribute('data-drift')) word.el.dataset.drift = word.glyphs;
        } else if (word.el.hasAttribute('data-drift')) delete word.el.dataset.drift;
      }
      passage.requestDecode?.();
      if (t >= 1) finish();
      else frame = requestAnimationFrame(tick);
    }
    tick(began);
  }
  function onWheel(e: WheelEvent) {
    if (e.defaultPrevented || e.ctrlKey || e.metaKey || e.shiftKey || !owns() || ignore(e.target)) return;
    const now = e.timeStamp;
    if (now - lastWheel >= SCROLL_QUIET_MS) {
      releaseBounds();
      wheelMode = 'armed';
      wheelTravel = 0;
    }
    if (wheelMode === 'armed' && (!e.deltaY || Math.abs(e.deltaX) > Math.abs(e.deltaY))) return;
    lastWheel = now;
    if (animation) wheelMode = 'consumed';
    if (wheelMode === 'consumed') {
      consumeWheel(e);
      return;
    }
    if (!e.deltaY) return;
    const dir = Math.sign(e.deltaY) as Direction;
    const delta = e.deltaY * (e.deltaMode === 1 ? 16 : e.deltaMode === 2 ? innerHeight : 1);
    const from = chapterAt(scrollY), to = next(from, dir);
    if (readingBounds) releaseBounds();
    const edge = boundary(from, dir);
    const room = (edge - scrollY) * dir;
    if (!to && room <= tolerance) return;
    if (wheelMode === 'reading' || room > tolerance) {
      if (room <= Math.abs(delta)) {
        wheelMode = 'consumed';
        consumeWheel(e);
        jump(edge);
      } else {
        // Let the browser integrate its own wheel/pan curve. The scroll listener
        // clamps delayed compositor movement to this same chapter's reading edge.
        wheelMode = 'reading';
        readingBounds = from;
        readingDirection = dir;
        releaseAfterFling();
      }
      return;
    }
    if (Math.sign(wheelTravel) !== dir) wheelTravel = 0;
    wheelTravel += delta;
    if (to && Math.abs(wheelTravel) >= GESTURE_PX) {
      wheelMode = 'consumed';
      start(from, to, dir);
    }
    consumeWheel(e);
  }

  function onKey(e: KeyboardEvent) {
    releaseBounds();
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
    if (e.touches.length !== 1 || !owns() || ignore(e.target)) return;
    const finger = e.touches[0];
    touch = { chapter: chapterAt(scrollY), start: scrollY, x: finger.clientX, y: finger.clientY, taken: !!animation };
  }
  function touchMove(e: TouchEvent) {
    if (e.touches.length !== 1 || (window.visualViewport?.scale ?? 1) > 1) { touch = null; releaseBounds(); return; }
    if (!touch) {
      if (readingBounds && e.cancelable) e.preventDefault();
      return;
    }
    const finger = e.touches[0], dy = touch.y - finger.clientY;
    if (touch.taken) { if (e.cancelable) e.preventDefault(); return; }
    if (e.defaultPrevented || Math.abs(dy) < Math.abs(touch.x - finger.clientX) || !dy) return;
    const dir = Math.sign(dy) as Direction, from = touch.chapter, to = next(from, dir);
    if (!to) { releaseBounds(); return; }
    if ((boundary(from, dir) - touch.start) * dir > tolerance) {
      readingDirection = dir;
      readingBounds = from; // Native movement, including its momentum, up to the reading edge.
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
    lastY = scrollY;
    if (animation && Math.abs(scrollY - expected) > tolerance) clearAnimation();
    const inside = owns();
    if (inside && prevY < chapters[0].top - tolerance && !animation && !readingBounds) {
      const carriedTouch = touchFromRunway && (fingers > 0 || now - lastTouchEnd < TOUCH_MOMENTUM_MS);
      if (carriedTouch || now - lastWheel < SCROLL_QUIET_MS) {
        readingBounds = chapters[0];
        readingDirection = 1;
        atProfileEntry = true;
      }
    }
    if (readingBounds && !animation) {
      const edge = atProfileEntry ? readingBounds.top : boundary(readingBounds, readingDirection);
      // Keep the compositor at the crossed edge until the finger and fling are quiet.
      // An opposite-direction jump (e.g. history) is free to leave immediately.
      if (!inside || (readingDirection > 0 ? scrollY < readingBounds.top - tolerance : scrollY > readingBounds.end + tolerance)) {
        releaseBounds();
      } else {
        if ((scrollY - edge) * readingDirection > 0) {
          root.toggleAttribute('data-cv-boundary', true);
          jump(edge);
        }
        releaseAfterFling();
      }
    }
    if (!animation) show(chapterAt(scrollY).el);
    if (inside && !inputs) {
      inputs = new AbortController();
      const local = { signal: inputs.signal };
      window.addEventListener('wheel', onWheel, { ...local, passive: false, capture: true });
      window.addEventListener('keydown', onKey, local);
      window.addEventListener('touchstart', touchStart, { ...local, passive: true });
      window.addEventListener('touchmove', touchMove, { ...local, passive: false });
      window.addEventListener('touchend', () => { touch = null; }, local);
      window.addEventListener('touchcancel', () => { touch = null; }, local);
    } else if (!inside && inputs) {
      inputs.abort(); inputs = null; touch = null; releaseBounds();
      wheelMode = 'armed'; wheelTravel = 0;
    }
  }
  function measure() {
    const fresh = elements.map(el => {
      // A compositing offset used during a cut must never become a document anchor.
      const staged = el.style.translate;
      if (staged) el.style.removeProperty('translate');
      const bounds = chapterBounds(el);
      if (staged) el.style.translate = staged;
      return { el, ...bounds };
    });
    if (fresh.some((s, i) => s.top !== chapters[i]?.top || s.end !== chapters[i]?.end)) {
      // A collapsing mobile toolbar resizes mid-fling: keep holding the same chapter.
      readingBounds = readingBounds && (fresh.find(c => c.el === readingBounds!.el) ?? null);
      chapters = fresh;
      if (animation) {
        animation.to = fresh.find(c => c.el === animation.to.el)!;
        finish();
      }
    }
    sync();
  }
  function interrupt() {
    clearAnimation();
    touch = null;
    releaseBounds();
    touchFromRunway = false;
    lastWheel = -Infinity;
    wheelMode = 'armed';
    wheelTravel = 0;
    sync();
  }
  const focusable = elements.filter(el => !el.hasAttribute('tabindex'));
  focusable.forEach(el => el.tabIndex = -1);
  // Registered before the CV's own listeners, so they see input that began outside the CV.
  window.addEventListener('wheel', e => {
    if (inputs || !e.deltaY) return;
    lastWheel = e.timeStamp;
    wheelMode = 'consumed';
  }, { ...options, passive: true });
  window.addEventListener('touchstart', e => {
    fingers = e.touches.length;
    releaseBounds();
    touchFromRunway = fingers === 1 && scrollY < chapters[0].top - tolerance;
  }, { ...options, passive: true });
  const lifted = (e: TouchEvent) => {
    fingers = e.touches.length;
    if (!fingers) { lastTouchEnd = performance.now(); releaseAfterFling(); }
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
    if (e.pointerType !== 'touch') releaseBounds();
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
    lifetime.abort(); inputs?.abort(); cancelAnimationFrame(navigationFrame); releaseBounds(); size.disconnect(); clearAnimation();
    elements.forEach(el => delete el.dataset.cvMuted);
    focusable.forEach(el => el.removeAttribute('tabindex'));
  };
}
