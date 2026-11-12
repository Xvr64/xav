import test from 'node:test';
import assert from 'node:assert/strict';
import { createWheelGestures, mountCinematicScroll, timelineY, timelineTime, timelineTimes, sequenceTarget, GESTURE_GAP_MS, SETTLE_MS } from './cinematicScroll.ts';

/** Feed a sequence of [delta, ms-after-previous] and count the gestures recognised. */
const gesturesIn = (events, g = createWheelGestures()) => {
  let t = 1000;
  const out = [];
  for (const [d, dt] of events) {
    t += dt;
    const r = g.feed(d, t);
    if (r) out.push(r);
  }
  return out;
};

function styleDeclaration() {
  const values = new Map(), priorities = new Map();
  return {
    getPropertyValue: p => values.get(p) ?? '',
    getPropertyPriority: p => priorities.get(p) ?? '',
    setProperty(p, v, priority = '') { values.set(p, v); priorities.set(p, priority); },
    removeProperty(p) { values.delete(p); priorities.delete(p); }
  };
}

test('one mouse-wheel notch is one gesture; notches spun together are still one', () => {
  assert.deepEqual(gesturesIn([[100, 0]]), [1]);
  assert.deepEqual(gesturesIn([[100, 0], [100, 40], [100, 40], [100, 40], [100, 40]]), [1]);
  // A pause between notches makes each a new, deliberate step
  assert.deepEqual(gesturesIn([[100, 0], [100, GESTURE_GAP_MS + 20], [100, GESTURE_GAP_MS + 20]]), [1, 1, 1]);
});

test('a trackpad stroke and its momentum tail are one gesture, however long the tail', () => {
  const stroke = [];
  for (let k = 0; k < 8; k++) stroke.push([4 + k * 3, 16]);
  for (let k = 0; k < 90; k++) stroke.push([Math.max(1, 30 * Math.exp(-k / 18)), 16]);
  assert.deepEqual(gesturesIn(stroke), [1]);
  // A tiny graze is not intentional
  assert.deepEqual(gesturesIn([[3, 0], [4, 16], [3, 16]]), []);
});

test('a fresh flick during a fading momentum tail, and any reversal, are new gestures', () => {
  const events = [];
  for (let k = 0; k < 6; k++) events.push([20, 16]);
  for (let k = 0; k < 30; k++) events.push([Math.max(1, 20 * Math.exp(-k / 6)), 16]);
  events.push([25, 16], [30, 16]);
  assert.deepEqual(gesturesIn(events), [1, 1]);
  assert.deepEqual(gesturesIn([[60, 0], [60, 16], [-40, 16]]), [1, -1]);
});


const stops = {
  y: [100, 250, 400, 550, 940, 1150, 1600, 2100, 2600, 3100, 3600, 4100, 4300],
  dur: [2, 2.6, 2.6, 3.8, 2.6, 2.1, 2.2, 2.1, 2.2, 2.1, 2.2, 1.05],
  earth: 5,
};

/** Exercise the mounted production listeners and RAF clock, not just progress helpers. */
function browser(t, initialY = 100, reducedMotion = false) {
  let now = 1000, next = 0;
  const frames = new Map(), listeners = new Map(), mediaListeners = new Set();
  // The browser's own smooth scrolling of a wheel notch: a glide toward a target, which any
  // programmatic scroll ends (as Chrome's does)
  let glide = null;
  class Element {
    tagName = 'DIV'; scrollHeight = 0; clientHeight = 0; parentElement = null;
    isContentEditable = false;
    closest() { return null; }
  }
  const body = new Element();
  const media = { matches: reducedMotion,
    addEventListener: (_, fn) => mediaListeners.add(fn),
    removeEventListener: (_, fn) => mediaListeners.delete(fn) };
  const emit = (kind, fields = {}) => {
    const e = { target: body, defaultPrevented: false, cancelable: true,
      preventDefault() { this.defaultPrevented = true; }, ...fields };
    for (const fn of listeners.get(kind) ?? []) fn(e);
    return e;
  };
  const win = {
    scrollY: initialY, innerHeight: 800,
    history: { scrollRestoration: 'auto' },
    matchMedia: query => query.includes('coarse') ? { matches: false } : media,
    scrollTo({top}) { glide = null; this.scrollY = Math.max(0, Math.round(top)); },
    addEventListener(kind, fn) { if (!listeners.has(kind)) listeners.set(kind, new Set()); listeners.get(kind).add(fn); },
    removeEventListener(kind, fn) { listeners.get(kind)?.delete(fn); },
  };
  const originals = new Map();
  for (const [key, value] of Object.entries({ window: win, document: { body, documentElement: {clientWidth:1200, style: styleDeclaration()}, addEventListener: win.addEventListener, removeEventListener: win.removeEventListener },
    HTMLElement: Element, getComputedStyle: () => ({overflowY:'visible'}),
    requestAnimationFrame: fn => { frames.set(++next, fn); return next; },
    cancelAnimationFrame: id => frames.delete(id) })) {
    originals.set(key, Object.getOwnPropertyDescriptor(globalThis, key));
    Object.defineProperty(globalThis, key, {value, configurable:true, writable:true});
  }
  t.mock.method(performance, 'now', () => now);
  const controller = mountCinematicScroll(() => stops);
  t.after(() => {
    controller.destroy();
    for (const [key, descriptor] of originals) {
      if (descriptor) Object.defineProperty(globalThis, key, descriptor);
      else delete globalThis[key];
    }
  });
  return {
    win, controller, emit,
    get active() { return frames.size; },
    get now() { return now; },
    advance(ms) {
      const end = now + ms;
      while (now < end) {
        now = Math.min(end, now + 16);
        if (glide) {
          // About a fifth of what is left each frame: the browser's eased glide over ~250 ms
          const step = Math.abs(glide.target - win.scrollY) < 2 ? glide.target - win.scrollY : (glide.target - win.scrollY) * 0.2;
          win.scrollY = Math.round(win.scrollY + step);
          if (win.scrollY === glide.target) glide = null;
          emit('scroll');
        }
        const queued = [...frames.values()]; frames.clear();
        for (const fn of queued) fn(now);
        emit('scroll');
      }
    },
    wheel(delta, extra = {}) {
      const e = emit('wheel', {deltaY:delta, deltaX:0, deltaMode:0, ...extra});
      if (!e.defaultPrevented) { win.scrollY += delta; emit('scroll'); }
      return e;
    },
    /** A mouse-wheel notch the browser scrolls smoothly when the page lets it. */
    notch(delta) {
      const e = emit('wheel', {deltaY:delta, deltaX:0, deltaMode:0});
      if (!e.defaultPrevented) glide = { target: (glide ? glide.target : win.scrollY) + delta };
      return e;
    },
    reduced(value) { media.matches = value; for (const fn of mediaListeners) fn(); },
    swipe(dy) {
      emit('touchstart', {touches:[{clientY:500,clientX:100}]});
      const e = emit('touchmove', {touches:[{clientY:500-dy,clientX:100}]});
      emit('touchend', {changedTouches:[{clientY:500-dy,clientX:100}]});
      return e;
    },
  };
}

test('only two forward targets and two reverse targets, regardless of internal timing cues', () => {
  assert.equal(sequenceTarget(stops, 100, 1), 5);
  assert.equal(sequenceTarget(stops, 500, 1), 5);
  assert.equal(sequenceTarget(stops, 1150, 1), 12);
  assert.equal(sequenceTarget(stops, 1600, 1), 12);
  assert.equal(sequenceTarget(stops, 4300, -1), 5);
  assert.equal(sequenceTarget(stops, 1150, -1), 0);
  assert.equal(sequenceTarget(stops, 4300, 1), null);
  assert.equal(sequenceTarget(stops, 100, -1), null);
});

test('timeline is monotone, invertible, continuous across whale cues and slow at city arrivals', () => {
  const times = timelineTimes(stops);
  let previous = 100;
  for (let time = 0; time < times.at(-1); time += .03) {
    const y = timelineY(stops, time);
    assert.ok(y >= previous - 1e-8);
    assert.ok(Math.abs(timelineTime(stops, y) - time) < 1e-5);
    previous = y;
  }
  const speed = (time) => (timelineY(stops, time + .001) - timelineY(stops, time - .001)) / .002;
  for (let i = 1; i < stops.earth; i++) assert.ok(speed(times[i]) > 10);
  for (let i = stops.earth; i < times.length - 1; i++) assert.ok(speed(times[i]) < 1);
});

test('two wheel gestures complete both films without further input; third exits natively', t => {
  const b = browser(t);
  assert.ok(b.wheel(100).defaultPrevented);
  b.advance(14000);
  assert.equal(b.win.scrollY, 1150);
  assert.equal(b.active, 0);
  b.advance(3000);
  assert.equal(b.win.scrollY, 1150, 'Doha waits indefinitely');
  b.wheel(100);
  const visited = new Set([5]);
  for (let i = 0; i < 1000; i++) {
    b.advance(16);
    for (let c = 6; c <= 11; c++) if (Math.abs(b.win.scrollY - stops.y[c]) < 30) visited.add(c);
  }
  assert.equal(b.win.scrollY, 4300);
  assert.equal(visited.size, 7, 'all seven city arrivals traversed');
  assert.equal(b.wheel(100).defaultPrevented, false);
  assert.equal(b.win.scrollY, 4400);
});

test('trackpad momentum and repeated forward strokes never extend or queue playback', t => {
  const b = browser(t);
  b.wheel(40);
  for (let i = 0; i < 1100; i++) {
    b.advance(16);
    b.wheel(i % 60 === 0 ? 50 : 2);
  }
  assert.equal(b.win.scrollY, 1150, 'long tail cannot start the city journey');
  assert.equal(b.active, 0);
  b.advance(GESTURE_GAP_MS + 1);
  b.wheel(40);
  b.advance(16000);
  assert.equal(b.win.scrollY, 4300);
});

test('reverse gestures replay each complete film in reverse', t => {
  const b = browser(t, 4300);
  b.wheel(-100); b.advance(16000);
  assert.equal(b.win.scrollY, 1150);
  b.wheel(-100); b.advance(14000);
  assert.equal(b.win.scrollY, 100);
  b.advance(SETTLE_MS);
  assert.equal(b.wheel(-100).defaultPrevented, false);
});

test('reversing mid-film preserves position and velocity and returns to that film start', t => {
  const b = browser(t, 1150);
  b.wheel(100); b.advance(3500);
  const before = b.win.scrollY;
  b.wheel(-100);
  assert.equal(b.win.scrollY, before, 'no position snap');
  b.advance(16);
  assert.ok(b.win.scrollY >= before, 'forward velocity decelerates before turning');
  b.advance(5000);
  assert.equal(b.win.scrollY, 1150, 'city reversal stops at Doha, not the whales');
  b.wheel(-100); b.advance(5000);
  const whalePosition = b.win.scrollY;
  b.wheel(100);
  assert.equal(b.win.scrollY, whalePosition);
  b.advance(7000);
  assert.equal(b.win.scrollY, 1150);
});

test('keyboard repeats cannot queue a film; distinct keys work and Escape releases it', t => {
  const b = browser(t);
  b.emit('keydown', {key:'PageDown'});
  b.advance(14000);
  b.emit('keydown', {key:'PageDown',repeat:true});
  b.advance(2000);
  assert.equal(b.win.scrollY, 1150);
  b.emit('keydown', {key:'PageDown'});
  b.advance(16000);
  assert.equal(b.win.scrollY, 4300);
  assert.equal(b.emit('keydown', {key:'PageDown'}).defaultPrevented, false);
  b.emit('keydown', {key:'PageUp'}); b.advance(2000);
  b.emit('keydown', {key:'Escape'});
  assert.equal(b.win.scrollY, 100);
  assert.equal(b.active, 0);
});

test('two touch swipes complete both films and the next swipe is native', t => {
  const b = browser(t);
  assert.ok(b.swipe(100).defaultPrevented);
  b.advance(14000);
  assert.equal(b.win.scrollY, 1150);
  b.advance(SETTLE_MS);
  b.swipe(100); b.advance(16000);
  assert.equal(b.win.scrollY, 4300);
  assert.equal(b.swipe(100).defaultPrevented, false);
  b.swipe(-100); b.advance(16000);
  assert.equal(b.win.scrollY, 1150);
});

test('reduced motion and native navigation release control without trapping the visitor', t => {
  const b = browser(t, 100, true);
  assert.equal(b.wheel(100).defaultPrevented, false);
  assert.equal(b.emit('keydown', {key:'PageDown'}).defaultPrevented, false);
  assert.equal(b.swipe(100).defaultPrevented, false);
  assert.equal(b.active, 0);
  b.reduced(false);
  b.wheel(100); b.advance(2000);
  assert.equal(b.active, 1);
  b.reduced(true);
  assert.equal(b.active, 0);
});

test('native scrolling elsewhere, entry crossing, skip, anchors, and cleanup', t => {
  const b = browser(t, 0);
  assert.equal(b.wheel(30).defaultPrevented, false);
  assert.equal(b.win.scrollY, 30);
  b.advance(300);
  b.wheel(100); b.advance(14000);
  assert.equal(b.win.scrollY, 1150);
  b.wheel(100); b.advance(1000);
  b.controller.skip();
  const y = b.win.scrollY;
  b.advance(3000);
  assert.equal(b.win.scrollY, y);
  b.controller.goTo(12); b.advance(1000);
  b.win.scrollY = 5000; b.emit('scroll'); b.advance(2000);
  assert.equal(b.win.scrollY, 5000, 'anchor navigation overrides playback');
  b.controller.destroy();
  assert.equal(b.wheel(-100).defaultPrevented, false);
});


test('tiny sign bounces in a continuing momentum tail cannot unlock the next film', t => {
  const b = browser(t);
  b.wheel(100);
  for (let i = 0; i < 1000; i++) { b.advance(16); b.wheel(i % 5 === 0 ? -1 : 8); }
  assert.equal(b.win.scrollY, 1150);
  assert.equal(b.active, 0);
  b.wheel(-60); b.advance(14000);
  assert.equal(b.win.scrollY, 100, 'deliberate reverse still works without a pause');
});

test('a continuous approach gesture that crosses the section edge starts the full first film', t => {
  const b = browser(t, 0);
  b.wheel(40); b.advance(16);
  b.wheel(40); b.advance(16);
  b.wheel(40); b.advance(14000);
  assert.equal(b.win.scrollY, 1150);
});

test('a swipe begun during playback cannot become queued input when lifted after completion', t => {
  const b = browser(t);
  b.wheel(100); b.advance(13000);
  b.emit('touchstart', {touches:[{clientY:500,clientX:100}]});
  b.emit('touchmove', {touches:[{clientY:400,clientX:100}]});
  b.advance(2000);
  b.emit('touchend', {changedTouches:[{clientY:400,clientX:100}]});
  b.advance(3000);
  assert.equal(b.win.scrollY, 1150);
  assert.equal(b.active, 0);
});


/** Scroll position at every frame of the first film, from the frame it starts until it rests. */
function filmFrames(b) {
  const out = [];
  for (let i = 0; i < 1200 && (b.active || out.length === 0); i++) { out.push(b.win.scrollY); b.advance(16); }
  out.push(b.win.scrollY);
  return out;
}

test('gentle and aggressive input play the identical film at the same pace', async t => {
  let calm, rough;
  await t.test('one notch', st => {
    const b = browser(st);
    b.wheel(100);
    calm = filmFrames(b);
  });
  await t.test('a spun wheel, then trackpad-like bursts of hard momentum all through the film', st => {
    const b = browser(st);
    b.wheel(400);
    rough = [];
    for (let i = 0; i < 1200 && (b.active || rough.length === 0); i++) {
      rough.push(b.win.scrollY);
      for (let k = 0; k < 3; k++) b.wheel(i % 40 < 30 ? 120 : 6);
      b.advance(16);
    }
    rough.push(b.win.scrollY);
  });
  assert.deepEqual(rough, calm, 'every frame of the film the same');
  assert.equal(calm.at(-1), 1150);
  // The whole first film: its knots' seconds, not a frame more or less
  const seconds = stops.dur.slice(0, stops.earth).reduce((a, d) => a + d, 0);
  assert.ok(Math.abs((calm.length - 2) * 0.016 - seconds) <= 0.033, `${(calm.length - 2) * 0.016} s vs ${seconds} s`);
});

test('a smooth scroll still gliding as the film begins never carries the page into it nor cancels it', t => {
  const b = browser(t, 0);
  // Notches spun from above the section: the browser glides toward their targets
  for (let k = 0; k < 4; k++) { b.notch(40); b.advance(16); }
  assert.ok(b.active, 'the film began from the gliding page');
  const frames = filmFrames(b);
  for (let k = 1; k < frames.length; k++) assert.ok(frames[k] >= frames[k - 1], 'never jumps back');
  assert.ok(frames[0] <= stops.y[0] + 1, `entered at ${frames[0]}`);
  assert.equal(frames.at(-1), 1150, 'played to the Earth, never stopped half-way');
});

test('a fresh flick the moment a film ends is still the last gesture; after a breath, the next film', t => {
  const b = browser(t);
  b.wheel(100);
  b.advance(13600 - 200);
  // A pause, then a new burst just as the Earth arrives
  b.advance(GESTURE_GAP_MS + 30);
  for (let i = 0; i < 20; i++) { b.wheel(60); b.advance(16); }
  assert.equal(b.win.scrollY, 1150, 'the city journey did not launch');
  assert.equal(b.active, 0);
  b.advance(SETTLE_MS + GESTURE_GAP_MS);
  b.wheel(60);
  assert.equal(b.active, 1, 'a deliberate gesture after the settle starts the journey');
});


test('fast entry scroll from above produces identical animation speed and timing as slow entry', async t => {
  let slowFrames, fastWheelFrames, trackpadFrames;

  // 1. Slow arrival from above
  await t.test('slow arrival', st => {
    const b = browser(st, 0);
    // Slow small steps crossing at 100
    b.wheel(30); b.advance(50);
    b.wheel(30); b.advance(50);
    b.wheel(30); b.advance(50); // reaches 90
    b.wheel(30); // crosses 100 -> starts film 1
    slowFrames = filmFrames(b);
  });

  // 2. Fast mouse-wheel flick from above
  await t.test('fast mouse-wheel gesture arrival', st => {
    const b = browser(st, 0);
    b.wheel(500); // large burst crossing from 0 directly into section
    fastWheelFrames = filmFrames(b);
  });

  // 3. Strong trackpad momentum arriving from above with long tail
  await t.test('strong trackpad momentum arrival with long tail', st => {
    const b = browser(st, 0);
    b.wheel(300);
    trackpadFrames = [];
    for (let i = 0; i < 1200 && (b.active || trackpadFrames.length === 0); i++) {
      trackpadFrames.push(b.win.scrollY);
      // Continuous tail of momentum
      b.wheel(Math.max(1, 150 * Math.exp(-i / 20)));
      b.advance(16);
    }
    trackpadFrames.push(b.win.scrollY);
  });

  assert.equal(slowFrames.at(-1), 1150);
  assert.equal(fastWheelFrames.at(-1), 1150);
  assert.equal(trackpadFrames.at(-1), 1150);
  assert.deepEqual(fastWheelFrames, slowFrames, 'fast wheel entry matches slow entry frame by frame');
  assert.deepEqual(trackpadFrames, slowFrames, 'trackpad momentum entry matches slow entry frame by frame');
});

test('city journey plays at identical fixed predefined speed under calm and violent input', async t => {
  let calmJourney, violentJourney;

  await t.test('calm city journey', st => {
    const b = browser(st, 1150);
    b.wheel(100);
    calmJourney = [];
    for (let i = 0; i < 1500 && (b.active || calmJourney.length === 0); i++) {
      calmJourney.push(b.win.scrollY);
      b.advance(16);
    }
    calmJourney.push(b.win.scrollY);
  });

  await t.test('violent city journey with continuous aggressive downward scrolling', st => {
    const b = browser(st, 1150);
    b.wheel(600); // huge downward flick
    violentJourney = [];
    for (let i = 0; i < 1500 && (b.active || violentJourney.length === 0); i++) {
      violentJourney.push(b.win.scrollY);
      // violent downward spam
      b.wheel(i % 20 < 10 ? 300 : 20);
      b.advance(16);
    }
    violentJourney.push(b.win.scrollY);
  });

  assert.equal(calmJourney.at(-1), 4300);
  assert.equal(violentJourney.at(-1), 4300);
  assert.deepEqual(violentJourney, calmJourney, 'violent downward input never accelerates city journey');

  // Verify all 7 cities traversed in order
  const visitedCities = new Set();
  for (const y of violentJourney) {
    for (let c = 5; c <= 11; c++) {
      if (Math.abs(y - stops.y[c]) < 10) visitedCities.add(c);
    }
  }
  assert.equal(visitedCities.size, 7, 'all 7 cities traversed without skipping');
});

test('mid-journey upward gesture reverses smoothly and downward gesture resumes forward without skipping', t => {
  const b = browser(t, 1150);
  b.wheel(100); // start city journey
  b.advance(3000); // advance partway into journey
  const midY = b.win.scrollY;
  assert.ok(midY > 1150 && midY < 4300, `mid-journey position: ${midY}`);

  // Upward gesture reverses
  b.wheel(-100);
  b.advance(16);
  assert.ok(b.win.scrollY >= midY, 'velocity eases before turning around');
  b.advance(2000);
  const reversedY = b.win.scrollY;
  assert.ok(reversedY < midY, 'reversed toward Doha');

  // Downward gesture resumes forward
  b.wheel(100);
  b.advance(500);
  assert.ok(b.win.scrollY > reversedY, 'resumed forward toward Shanghai');

  // Continues to completion
  b.advance(15000);
  assert.equal(b.win.scrollY, 4300, 'completed at Shanghai release');
});

// Production JourneyGlobe geometry: 300svh hero above (g0 = 2766), earth = 0 (Doha starting state at g0),
// followed by the 7 city dwells (Paris, Jakarta, Moscow, Singapore, Pau, Shanghai) and release.
const prodStops = {
  y: [2766, 3480, 4120, 4760, 5400, 6040, 6680, 7200],
  dur: [1.8, 1.9, 1.85, 1.9, 1.85, 1.9, 0.7],
  earth: 0,
};

function prodBrowser(t, initialY = 0, geometry = prodStops) {
  let now = 1000, next = 0, lockedY = null;
  const frames = new Map(), listeners = new Map(), mediaListeners = new Set();
  let glide = null;
  class Element {
    tagName = 'DIV'; scrollHeight = 0; clientHeight = 0; parentElement = null;
    isContentEditable = false;
    closest() { return null; }
  }
  const body = new Element();
  const media = { matches: false,
    addEventListener: (_, fn) => mediaListeners.add(fn),
    removeEventListener: (_, fn) => mediaListeners.delete(fn) };
  const emit = (kind, fields = {}) => {
    const e = { target: body, defaultPrevented: false, cancelable: true,
      preventDefault() { this.defaultPrevented = true; }, ...fields };
    for (const fn of listeners.get(kind) ?? []) fn(e);
    return e;
  };
  const win = {
    scrollY: initialY, innerHeight: 922,
    history: { scrollRestoration: 'auto' },
    matchMedia: query => query.includes('coarse') ? { matches: false } : media,
    scrollTo({top}) { glide = null; this.scrollY = Math.max(0, Math.round(top)); },
    addEventListener(kind, fn) { if (!listeners.has(kind)) listeners.set(kind, new Set()); listeners.get(kind).add(fn); },
    removeEventListener(kind, fn) { listeners.get(kind)?.delete(fn); },
  };
  const originals = new Map();
  for (const [key, value] of Object.entries({ window: win, document: { body, documentElement: {clientWidth:1200, style: styleDeclaration()}, addEventListener: win.addEventListener, removeEventListener: win.removeEventListener },
    HTMLElement: Element, getComputedStyle: () => ({overflowY:'visible'}),
    requestAnimationFrame: fn => { frames.set(++next, fn); return next; },
    cancelAnimationFrame: id => frames.delete(id) })) {
    originals.set(key, Object.getOwnPropertyDescriptor(globalThis, key));
    Object.defineProperty(globalThis, key, {value, configurable:true, writable:true});
  }
  t.mock.method(performance, 'now', () => now);
  let isPlaying = false;
  const controller = mountCinematicScroll(() => geometry, (y, playing = false) => {
    lockedY = y;
    isPlaying = playing;
  });
  t.after(() => {
    controller.destroy();
    for (const [key, descriptor] of originals) {
      if (descriptor) Object.defineProperty(globalThis, key, descriptor);
      else delete globalThis[key];
    }
  });
  return {
    win, controller, emit,
    get active() { return frames.size; },
    get lockedY() { return lockedY; },
    get isPlaying() { return isPlaying; },
    get waitingForExplore() {
      const y = lockedY ?? win.scrollY;
      return !isPlaying && Math.abs(y - geometry.y[geometry.earth]) <= 6;
    },
    advance(ms) {
      const end = now + ms;
      while (now < end) {
        now = Math.min(end, now + 16);
        if (glide) {
          const step = Math.abs(glide.target - win.scrollY) < 2 ? glide.target - win.scrollY : (glide.target - win.scrollY) * 0.25;
          win.scrollY = Math.round(win.scrollY + step);
          if (win.scrollY === glide.target) glide = null;
          emit('scroll');
        }
        const queued = [...frames.values()]; frames.clear();
        for (const fn of queued) fn(now);
        emit('scroll');
      }
    },
    wheel(delta, extra = {}) {
      const e = emit('wheel', {deltaY:delta, deltaX:0, deltaMode:0, ...extra});
      if (!e.defaultPrevented) { win.scrollY += delta; emit('scroll'); }
      return e;
    },
    notch(delta) {
      const e = emit('wheel', {deltaY:delta, deltaX:0, deltaMode:0});
      if (!e.defaultPrevented) glide = { target: (glide ? glide.target : win.scrollY) + delta };
      return e;
    },
  };
}

test('production geometry: native momentum gliding across section start is intercepted at Doha and never skips cities', t => {
  const b = prodBrowser(t, 2400);
  // Strong native smooth-scroll impulse started in #home that would coast to 3600 (past Doha and Paris)
  b.notch(120);
  b.advance(16);
  // Simulate compositor inertia continuing past 2766 without further wheel events
  b.win.scrollY = 2950;
  b.emit('scroll');
  assert.equal(b.win.scrollY, 2766, 'pinned back to section start (Doha)');
  assert.equal(b.waitingForExplore, true, 'Doha indicator is visible waiting for user exploration gesture');
});

test('production geometry: 3.5s trackpad momentum with 1-vs-2 packet coalescing and sign bounces never auto-starts cities', t => {
  const b = prodBrowser(t, 2600);
  // Enter from #home with a long 3.5s trackpad fling (220 frames * 16ms = 3520ms)
  b.wheel(180);
  for (let i = 0; i < 220; i++) {
    b.advance(16);
    // Simulate 1-vs-2 packet coalescing (7px vs 14px) and occasional -1px sign bounce
    const jitter = i % 17 === 0 ? -1 : (i % 2 === 0 ? 7 : 14);
    b.wheel(jitter);
  }
  assert.equal(b.win.scrollY, 2766, 'remained at Doha despite 3.5s momentum with coalescing jitter');
  assert.equal(b.active, 0);
  assert.equal(b.waitingForExplore, true, 'indicator visible at Doha waiting state');

  // After a genuine pause, one deliberate downward gesture starts the 7-city journey at exact predefined speed
  b.advance(GESTURE_GAP_MS + 20);
  b.wheel(80);
  assert.ok(b.active, 'deliberate gesture after pause starts city journey');
  const journeyFrames = [];
  const visitedCities = [];
  for (let i = 0; i < 1000 && b.active; i++) {
    journeyFrames.push(b.win.scrollY);
    for (let c = 1; c <= 7; c++) {
      if (Math.abs(b.win.scrollY - prodStops.y[c]) < 15 && visitedCities.at(-1) !== c) {
        visitedCities.push(c);
      }
    }
    b.advance(16);
  }
  assert.equal(b.win.scrollY, 7200, 'completed at Shanghai release');
  assert.deepEqual(visitedCities, [1, 2, 3, 4, 5, 6, 7], 'visited all 7 cities in exact order');
  const expectedDuration = prodStops.dur.reduce((a, d) => a + d, 0);
  const actualDuration = journeyFrames.length * 0.016;
  assert.ok(Math.abs(actualDuration - expectedDuration) <= 0.05, `${actualDuration}s vs ${expectedDuration}s`);
});

test('second scroll-once indicator ("Scroll once to explore") shows immediately when Doha appears, hides on trigger scroll, never during city playback, and reappears on full reversal', t => {
  const b = prodBrowser(t, 2600);

  // 1. Before reaching Globe section: indicator is hidden
  assert.equal(b.waitingForExplore, false, 'hidden before reaching Globe section');

  // 2. Scroll into Globe section -> pins at Doha (st.earth = 0), and indicator is IMMEDIATELY visible with Doha
  b.wheel(180);
  assert.equal(b.win.scrollY, prodStops.y[prodStops.earth], 'pinned at Doha starting state');
  assert.equal(b.isPlaying, false, 'no intermediate animation stage');
  assert.equal(b.waitingForExplore, true, 'visible immediately when Doha appears without extra scroll step');

  // 3. Trigger 7-city journey -> immediately hides on the single triggering scroll
  b.advance(SETTLE_MS + GESTURE_GAP_MS);
  assert.equal(b.waitingForExplore, true, 'still visible while waiting');
  b.wheel(100);
  assert.equal(b.isPlaying, true, 'city journey started');
  assert.equal(b.waitingForExplore, false, 'immediately hides when visitor scrolls down to start Globe animation');

  // 4. Hidden throughout all 7 cities
  while (b.active) {
    assert.equal(b.waitingForExplore, false, 'never visible while cities are animating');
    b.advance(16);
  }
  assert.equal(b.win.scrollY, 7200);
  assert.equal(b.waitingForExplore, false, 'hidden after city journey completes');

  // 5. Reverse the Globe journey all the way back to initial waiting state -> reappears only upon arrival
  b.advance(SETTLE_MS + GESTURE_GAP_MS);
  b.wheel(-100);
  assert.equal(b.isPlaying, true);
  while (b.active) {
    assert.equal(b.waitingForExplore, false, 'hidden while reversing through cities');
    b.advance(16);
  }
  assert.equal(b.win.scrollY, prodStops.y[prodStops.earth]);
  assert.equal(b.waitingForExplore, true, 'reappears when reversed all the way to initial Globe waiting state');

  // 6. Trigger again -> hides immediately
  b.advance(SETTLE_MS + GESTURE_GAP_MS);
  b.wheel(100);
  assert.equal(b.waitingForExplore, false, 'hides immediately when triggered again');
});

const touchStart = b => b.emit('touchstart', { touches: [{ clientY: 650, clientX: 180 }] });
const touchMove = (b, dy) => b.emit('touchmove', { touches: [{ clientY: 650 - dy, clientX: 180 }] });
const touchEnd = (b, dy) => b.emit('touchend', { changedTouches: [{ clientY: 650 - dy, clientX: 180 }] });
const touchSwipe = (b, dy) => { touchStart(b); touchMove(b, dy); touchEnd(b, dy); };

test('mobile: swipe entering from the Hero lands on Doha instead of freezing above it', t => {
  const b = prodBrowser(t, prodStops.y[0] - 100);
  touchSwipe(b, 160);
  assert.equal(b.win.scrollY, prodStops.y[0]);
  assert.equal(b.waitingForExplore, true);
  assert.equal(b.active, 0);
});

test('mobile: a long entry swipe crossing natively never also starts the city film', t => {
  const b = prodBrowser(t, prodStops.y[0] - 100);
  touchStart(b);
  b.win.scrollY = prodStops.y[0] + 50;
  b.emit('scroll');
  touchMove(b, 200);
  b.advance(1000); // Still the same finger, even after the settling timer expires.
  touchEnd(b, 200);
  assert.equal(b.waitingForExplore, true);
  assert.equal(b.active, 0);
});

test('mobile: first deliberate new swipe at Doha starts immediately without a cooldown', t => {
  const b = prodBrowser(t, prodStops.y[0] - 100);
  b.wheel(160);
  touchSwipe(b, 100);
  assert.equal(b.isPlaying, true);
});

test('mobile: continuous fast swipes do not accelerate playback, reversal and replays keep their endpoints', t => {
  const b = prodBrowser(t, prodStops.y[0]);
  const duration = prodStops.dur.reduce((a, d) => a + d, 0);
  for (let replay = 0; replay < 3; replay++) {
    touchSwipe(b, 80);
    for (let ms = 0; ms < 2000; ms += 100) {
      b.advance(100);
      touchSwipe(b, 500);
    }
    assert.ok(Math.abs(b.win.scrollY - timelineY(prodStops, 2)) <= 1);
    b.advance(duration * 1000 - 2000 + 16);
    assert.equal(b.win.scrollY, prodStops.y.at(-1));
    b.advance(SETTLE_MS + 1);
    touchSwipe(b, -120);
    b.advance(duration * 1000 + 16);
    assert.equal(b.waitingForExplore, true);
    b.advance(SETTLE_MS + 1);
  }
});

test('mobile: changing viewport geometry mid-film preserves elapsed time and reverse endpoint', t => {
  const geometry = structuredClone(prodStops);
  const b = prodBrowser(t, geometry.y[0], geometry);
  touchSwipe(b, 80);
  b.advance(2000);
  geometry.y = geometry.y.map(y => y * 0.6);
  b.win.innerHeight = 390;
  b.emit('resize');
  b.advance(1000);
  assert.ok(Math.abs(b.win.scrollY - timelineY(geometry, 3)) <= 1);
  touchSwipe(b, -100);
  b.advance(10000);
  assert.equal(b.win.scrollY, Math.round(geometry.y[0]));
  assert.equal(b.waitingForExplore, true);
});

test('mobile: cancelled and multi-touch gestures cannot launch the film', t => {
  const b = prodBrowser(t, prodStops.y[0]);
  touchStart(b); touchMove(b, 100);
  b.emit('touchcancel'); touchEnd(b, 100);
  assert.equal(b.active, 0);
  touchStart(b); touchMove(b, 100);
  b.emit('touchmove', { touches: [{clientY: 550, clientX: 180}, {clientY: 500, clientX: 200}] });
  touchEnd(b, 100);
  assert.equal(b.active, 0);
});

test('regression: a native touch scroll after Doha settling cannot leave stale renderer progress', t => {
  const b = prodBrowser(t, prodStops.y[0] - 100);
  touchSwipe(b, 160);
  b.advance(SETTLE_MS + 1);
  // Safari has already claimed the gesture: scroll arrives independently of cancelable touchmove.
  b.win.scrollY += 450;
  b.emit('scroll');
  assert.equal(b.win.scrollY, b.lockedY, 'document and published Globe position must agree while owned');
});

test('regression: first small touchmove at Doha is captured before native pan begins', t => {
  const b = prodBrowser(t, prodStops.y[0]);
  touchStart(b);
  assert.equal(touchMove(b, 2).defaultPrevented, true);
});


