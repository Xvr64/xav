import { globeScrollGeometry } from './abyssPalette';
import { SETTLE_MS } from './cinematicScroll';
import {
  chapterBounds,
  copyArrivePhase,
  createMagneticGestureMachine,
  depthGlideEase,
  depthPassagePhase,
  GLOBE_TRANSITION_DURATION_MS,
  inSweepPhase,
  MAGNETIC_CHAPTERS,
  MAGNETIC_DRAIN_IDLE_MS,
  MAGNETIC_IDLE_GAP_MS,
  oceanWaveY,
  outSweepPhase,
  passage,
  titleArrivePhase,
  TRANSITION_DURATION_MS,
  type GestureDirection
} from './magneticCVState';
import { createMagneticCVVeil } from './magneticCVVeil';

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
  let pts = `0 ${outer}px,100% ${outer}px`;
  const steps = 12;
  for (let i = steps; i >= 0; i--) {
    const u = i / steps;
    const wy = (oceanWaveY(u, edge, tilt, amp, phase) + offset).toFixed(1);
    pts += `,${(u * 100).toFixed(1)}% ${wy}px`;
  }
  chapter.el.style.translate = `0 ${y - anchor}px`;
  chapter.el.style.clipPath = `polygon(${pts})`;
}

/** Collect semantic editorial planes inside a CV section for multi-plane depth choreography. */
function collectSectionPlanes(section: HTMLElement) {
  if (section.id === 'introduction') {
    const hero = section.querySelector<HTMLElement>('.lead');
    const meta = section.querySelector<HTMLElement>('.intro-kicker');
    const support = section.querySelector<HTMLElement>('.intro-support');
    const facts = [...section.querySelectorAll<HTMLElement>('.intro-facts > div')];
    return {
      hero: hero ? [hero] : [],
      meta: meta ? [meta] : [],
      items: [...(support ? [support] : []), ...facts]
    };
  }
  const children = [...section.children].filter((el): el is HTMLElement => el instanceof HTMLElement);
  const hero = children[0] ? [children[0]] : [];
  const list = section.querySelector<HTMLElement>(
    ':scope > .station-list, :scope > .edu-list, :scope > .skill-index, :scope > .lang-list, :scope > .interest-list'
  );
  const items = list
    ? [...list.children].filter((el): el is HTMLElement => el instanceof HTMLElement)
    : children.slice(1);
  return { hero, meta: [] as HTMLElement[], items };
}

/** Tag outgoing CV planes once at transition start (zero per-frame DOM reads). */
function tagDepartingPlanes(section: HTMLElement, tagged: HTMLElement[]) {
  const { hero, meta, items } = collectSectionPlanes(section);
  for (const el of hero) {
    el.dataset.cvRole = 'hero';
    tagged.push(el);
  }
  for (const el of meta) {
    el.dataset.cvRole = 'meta';
    tagged.push(el);
  }
  let visibleIdx = 0;
  for (const el of items) {
    const r = el.getBoundingClientRect();
    if (r.bottom < -40 || r.top > innerHeight + 40) continue;
    el.dataset.cvRole = 'item';
    el.style.setProperty('--cv-depart-delay', `${Math.min(54, visibleIdx * 16)}ms`);
    tagged.push(el);
    visibleIdx++;
  }
}

/**
 * Tag incoming CV planes with sculpted, viewport-aware stagger timing so the heading always
 * commands the stage first with depth zoom and ASCII decryption, and every visible row
 * settles cleanly into magnetic rest before 96%.
 */
function tagArrivingPlanes(
  section: HTMLElement,
  duration: number,
  landingOffset: number,
  landingAtBottom: boolean,
  tagged: HTMLElement[]
) {
  const { hero, meta, items } = collectSectionPlanes(section);
  const sectionRect = section.getBoundingClientRect();

  const heroDelay = Math.round(duration * 0.44);
  const heroDur = Math.round(duration * 0.42);
  for (const el of hero) {
    el.dataset.cvRole = 'hero';
    el.style.setProperty('--cv-delay', `${heroDelay}ms`);
    el.style.setProperty('--cv-item-dur', `${heroDur}ms`);
    tagged.push(el);
  }

  const metaDelay = Math.round(duration * 0.52);
  const metaDur = Math.round(duration * 0.30);
  for (const el of meta) {
    el.dataset.cvRole = 'meta';
    el.style.setProperty('--cv-delay', `${metaDelay}ms`);
    el.style.setProperty('--cv-item-dur', `${metaDur}ms`);
    tagged.push(el);
  }

  // Only stagger rows visible on the landing screen so tall-section offscreen rows read immediately.
  const visibleItems = items.filter(el => {
    const r = el.getBoundingClientRect();
    const relTop = r.top - sectionRect.top - landingOffset;
    const relBottom = relTop + r.height;
    return relBottom > -32 && relTop < innerHeight + 32;
  });

  const baseStart = duration * (landingAtBottom ? 0.48 : 0.54);
  const maxEnd = duration * 0.96;
  const itemDur = Math.round(duration * 0.33);
  const spread = Math.max(0, maxEnd - itemDur - baseStart);
  const step = visibleItems.length > 1
    ? Math.min(Math.round(duration * 0.058), Math.floor(spread / (visibleItems.length - 1)))
    : 0;

  visibleItems.forEach((el, idx) => {
    const order = landingAtBottom ? visibleItems.length - 1 - idx : idx;
    const delay = Math.round(baseStart + order * step);
    el.dataset.cvRole = 'item';
    el.style.setProperty('--cv-delay', `${delay}ms`);
    el.style.setProperty('--cv-item-dur', `${itemDur}ms`);
    el.style.setProperty('--cv-datum-delay', `${delay + 40}ms`);
    el.style.setProperty('--cv-datum-dur', `${Math.max(240, itemDur - 20)}ms`);
    tagged.push(el);
  });
}

function clearTaggedPlanes(tagged: HTMLElement[]) {
  for (const el of tagged) {
    delete el.dataset.cvRole;
    el.style.removeProperty('--cv-delay');
    el.style.removeProperty('--cv-item-dur');
    el.style.removeProperty('--cv-depart-delay');
    el.style.removeProperty('--cv-datum-delay');
    el.style.removeProperty('--cv-datum-dur');
  }
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
  const veil = createMagneticCVVeil();

  const gesture = createMagneticGestureMachine();
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
    tagged: HTMLElement[];
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

  const nextChapter = (chapter: Chapter, dir: GestureDirection): Chapter | undefined =>
    chapters[chapters.indexOf(chapter) + dir];

  const boundary = (chapter: Chapter, dir: GestureDirection) => (dir > 0 ? chapter.end : chapter.top);

  const ignoreTarget = (target: EventTarget | null) =>
    !!document.querySelector('[aria-modal="true"]') ||
    (target instanceof Element &&
      !!target.closest('input,select,textarea,[contenteditable]:not([contenteditable="false"]),[role="dialog"]'));

  /** Proactive transition-to-idle re-arming: never leaves the machine stranded in draining/reading. */
  function scheduleRearm() {
    clearTimeout(rearmTimer);
    rearmTimer = 0;
    const st = gesture.state;
    if (st === 'draining' || st === 'reading') {
      const wait = st === 'draining' ? MAGNETIC_DRAIN_IDLE_MS + 12 : MAGNETIC_IDLE_GAP_MS + 12;
      rearmTimer = window.setTimeout(() => {
        rearmTimer = 0;
        if (!fingers && !animation) {
          gesture.rearmIfQuiet(performance.now());
        }
      }, wait);
    }
  }

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

  /** Cancel native wheel scrolling without ever locking root overflow-y on desktop. */
  function consumeWheel(e: WheelEvent) {
    if (e.cancelable) {
      e.preventDefault();
    }
  }

  function clearAnimation(landing?: Chapter) {
    cancelAnimationFrame(frame);
    frame = 0;
    veil.end();
    if (!animation) return;
    const { from, to, tagged } = animation;
    clearTaggedPlanes(tagged);

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
    userInteracted = true;
    const startY = scrollY;
    const endY = dir > 0 ? to.top : to.end;
    const isGlobeHandoff = from.kind === 'globe' || to.kind === 'globe';
    const duration = isGlobeHandoff ? GLOBE_TRANSITION_DURATION_MS : TRANSITION_DURATION_MS;
    const landingOffset = Math.max(0, endY - to.top);
    const landingAtBottom = dir < 0 && landingOffset > 40;

    releaseBounds();
    clearTimeout(rearmTimer);
    rearmTimer = 0;
    gesture.beginTransition(dir, now);

    const focus = keyboard || (from.kind === 'cv' && from.el.contains(document.activeElement));
    const tagged: HTMLElement[] = [];

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
      tagged,
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

    // Sample typography & Globe rim ONCE while departing chapter sits cleanly at rest.
    lastVeilFragments = veil.begin({
      fromEl: from.el,
      fromKind: from.kind,
      toEl: to.el,
      toKind: to.kind,
      dir,
      toLandingOffset: landingOffset,
      landingAtBottom
    });

    if (from.kind === 'cv') tagDepartingPlanes(from.el, tagged);
    if (to.kind === 'cv') tagArrivingPlanes(to.el, duration, landingOffset, landingAtBottom, tagged);

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
    const tilt = -dir * Math.min(height * 0.135, width * 0.14);
    const waveAmp = Math.min(height * 0.052, 52);
    const phaseBase = dir > 0 ? 0.35 : 2.15;
    // Unveil heading-first top-to-bottom whenever the heading is on the landing screen;
    // unveil bottom-to-top only when landing at the bottom edge of a tall chapter.
    const revealTopDown = !landingAtBottom;

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
        clearAnimation();
        sync();
        return;
      }

      const t = Math.max(0, Math.min(1, (frameNow - now) / duration));
      const phase = phaseBase + t * 2.8;

      // Smooth luxury ocean glide: weighted during push-in, surging through the depth bridge, velvet settle.
      const glideP = Math.max(0, Math.min(1, (t - 0.04) / 0.92));
      expected = Math.round(startY + (endY - startY) * depthGlideEase(glideP));
      if (scrollY !== expected) jump(expected);

      // Drive continuous ocean depth-current surge strictly during this passage.
      passage.depthSurge = dir * depthPassagePhase(t);
      (window as { __magneticDepthSurge?: number }).__magneticDepthSurge = passage.depthSurge;

      // Stage A -> B: Outgoing curved oceanic sweep (t = 0.10 -> 0.48).
      // 100% cleared by t = 0.48, right before incoming opens, so departing & arriving text never overlap.
      // Circular Shanghai Globe descends whole into depth without slicing its sphere.
      const outS = outSweepPhase(t);
      const outFrac = -0.18 + 1.44 * outS;
      const outEdge = height * (dir > 0 ? outFrac : 1 - outFrac);
      if (outS >= 1) {
        from.el.style.translate = `0 ${expected - startY}px`;
        from.el.style.clipPath = 'inset(50%)';
      } else if (outS <= 0 || from.kind === 'globe') {
        from.el.style.translate = `0 ${expected - startY}px`;
        from.el.style.removeProperty('clip-path');
      } else {
        clipChapter(from, startY, expected, outEdge, tilt, waveAmp, phase, dir < 0);
      }

      // Stage D: Incoming curved oceanic unveil (t = 0.48 -> 0.88).
      // Circular Shanghai Globe rises whole out of depth without a flat equator cut.
      const inS = inSweepPhase(t);
      const inFrac = -0.18 + 1.48 * inS;
      const inEdge = height * (revealTopDown ? inFrac : 1 - inFrac);
      if (inS <= 0) {
        to.el.style.translate = `0 ${expected - endY}px`;
        to.el.style.clipPath = 'inset(50%)';
        passage.edge = revealTopDown ? -height * 0.25 : height * 1.25;
      } else if (inS >= 1 || to.kind === 'globe') {
        to.el.style.translate = `0 ${expected - endY}px`;
        to.el.style.removeProperty('clip-path');
        passage.edge = revealTopDown ? height * 1.35 : -height * 0.35;
      } else {
        clipChapter(to, endY, expected, inEdge, tilt * 0.84, waveAmp * 0.86, phase + 0.85, revealTopDown);
        passage.edge = inEdge;
      }

      // Render ephemeral typography-locked ASCII fragmentation, curved meniscus glow & depth bridge.
      veil.render({
        t,
        dir,
        outS,
        outEdge,
        inS,
        inEdge,
        tilt,
        amp: waveAmp,
        phase,
        isGlobeHandoff,
        fromIsGlobe: from.kind === 'globe',
        toIsGlobe: to.kind === 'globe',
        revealTopDown
      });

      // Drive hierarchical heading-first ASCII decryption on incoming CV chapters.
      if (to.kind === 'cv') {
        passage.progress = t;
        passage.titleProgress = titleArrivePhase(t);
        passage.bodyProgress = copyArrivePhase(t);
        if (t >= 0.94) passage.settleAll = true;
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
      scheduleRearm();
      return;
    }

    // While resting at Shanghai immediately after Globe completion, respect Globe's desktop settle window.
    if (!animation && isAtShanghai() && !isShanghaiSettled(now)) {
      gesture.noteExternalWheel(delta, now);
      scheduleRearm();
      return;
    }

    userInteracted = true;
    const from = animation ? animation.to : chapterAt(scrollY);
    const action = gesture.feedWheel(delta, now, dir => {
      const to = nextChapter(from, dir);
      const edge = boundary(from, dir);
      const room = (edge - scrollY) * dir;
      return { room, hasTarget: !!to };
    });

    if (action.kind === 'ignore' || action.kind === 'passthrough') {
      releaseBounds();
      scheduleRearm();
      return;
    }

    if (action.kind === 'consume') {
      consumeWheel(e);
      scheduleRearm();
      return;
    }

    if (action.kind === 'read') {
      root.removeAttribute('data-cv-boundary');
      readingBounds = from;
      readingDirection = Math.sign(delta) as GestureDirection;
      scheduleReleaseBounds();
      scheduleRearm();
      return;
    }

    if (action.kind === 'clamp') {
      consumeWheel(e);
      jump(boundary(from, action.dir));
      scheduleRearm();
      return;
    }

    // action.kind === 'snap'
    const to = nextChapter(from, action.dir);
    if (!to) {
      gesture.reset();
      return;
    }
    consumeWheel(e);
    if (from.kind === 'globe') globeScrollGeometry.release?.();
    start(from, to, action.dir, false, now);
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
    if ((boundary(from, dir) - touch.startY) * dir > TOLERANCE) {
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
        show(chapterAt(scrollY));
      }
    }
  }

  function alignInitialHash() {
    if (userInteracted || animation) return;
    const initial = chapters.find(c => c.kind === 'cv' && '#' + c.id === location.hash);
    if (!initial) return;
    if (scrollY < 2 || Math.abs(scrollY - initial.top) <= innerHeight * 0.4) {
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
  if ((import.meta as { env?: { DEV?: boolean } }).env?.DEV) {
    win.__magneticCV = {
      snapshot: () => ({
        gestureState: gesture.state,
        lockedDir: gesture.lockedDir,
        animating: !!animation,
        activeId: visibleChapter?.id ?? null,
        scrollY,
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
    veil.destroy();
    cvElements.forEach(el => delete el.dataset.cvMuted);
    if (globeStage) delete globeStage.dataset.globeMuted;
    focusable.forEach(el => el.removeAttribute('tabindex'));
    if ((import.meta as { env?: { DEV?: boolean } }).env?.DEV) {
      delete win.__magneticCV;
    }
    delete win.__magneticDepthSurge;
  };
}
