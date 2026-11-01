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
    matchMedia: () => media,
    scrollTo({top}) { glide = null; this.scrollY = Math.max(0, Math.round(top)); },
    addEventListener(kind, fn) { if (!listeners.has(kind)) listeners.set(kind, new Set()); listeners.get(kind).add(fn); },
    removeEventListener(kind, fn) { listeners.get(kind)?.delete(fn); },
  };
  const originals = new Map();
  for (const [key, value] of Object.entries({ window: win, document: { body, documentElement: {clientWidth:1200} },
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
