// Acceptance in a real browser: the cinematic experience is intact and the CV reads as the
// minimalist page it is (one decode for every line, nothing in the corner but sound and CV).
//   node dev/phase2.mjs verify [journeys,globe,mobile,cv,reduced]
import { browser, click, jpg, save, scrollRun, server } from './phase2-lib.mjs';
import { sleep } from './fable-cdp.mjs';
import assert from 'node:assert/strict';

const results = [];
const pass = (name, detail) => { results.push({ name, ok: true, detail }); console.log('PASS', name, detail === undefined ? '' : JSON.stringify(detail)); };
const city = (c) => c.evaluate(`document.querySelector('.globe-caption [aria-hidden="false"] .globe-city')?.textContent ?? null`);
const CITIES = ['Doha', 'Paris', 'Jakarta', 'Moscow', 'Singapore', 'Pau', 'Shanghai'];

/** Poll the Globe's caption until `want` shows, recording each city once in the order seen. */
async function follow(c, want, ms) {
  const seen = [];
  const t0 = Date.now();
  while (Date.now() - t0 < ms) {
    const now = await city(c);
    if (now && seen.at(-1) !== now) seen.push(now);
    if (now === want) break;
    await sleep(80);
  }
  return seen;
}

async function journeys() {
  for (const id of ['direct', 'passage', 'odyssey']) {
    const c = await browser({ intro: true });
    try {
      await c.evaluate(`document.querySelector('button[data-journey="${id}"]') ? 1 : 0`).then((n) => assert.equal(n, 1, 'journey choice is offered'));
      const t0 = Date.now();
      await click(c, `button[data-journey="${id}"]`);
      let state;
      let nudged = 0;
      let lastTime = NaN;
      let stalled = 0;
      const playback = new Set();
      for (let i = 0; i < 480; i++) {
        state = await c.evaluate(`window.__creation ? window.__creation.state() : { active: false }`);
        if (!state.active) break;
        playback.add(state.playbackState);
        // The opening may wait on a frame for the visitor's gesture: one wheel tick, only once
        // its clock has stood still for a second (never while it plays, so the page that is
        // released near the end is not scrolled by the harness)
        stalled = state.time === lastTime ? stalled + 1 : 0;
        lastTime = state.time;
        if (stalled >= 4 && nudged < 12) { await c.evaluate(`window.__creation.playForward()`); nudged++; stalled = 0; }
        await sleep(250);
      }
      assert.equal(state.active, false, `${id} did not finish: ${JSON.stringify(state)}`);
      const seconds = (Date.now() - t0) / 1000;
      await sleep(1200);
      const hero = await c.evaluate(`({ y: scrollY, scrollable: getComputedStyle(document.documentElement).overflowY, whales: !!document.querySelector('canvas[data-whale-renderer]'), cover: document.querySelector('.cover-title .sr-only').textContent, playback: ${JSON.stringify([...playback])} })`);
      assert.equal(hero.y, 0, 'the visitor arrives at the top of the cover');
      await jpg(c, `verify/journey-${id}-hero`);
      pass(`journey ${id} → Hero`, { seconds: Math.round(seconds * 10) / 10, nudged, hero, errors: c.errors });
    } finally { await c.close(); }
  }
  // Skip intro, from inside The Passage
  const c = await browser({ intro: true });
  try {
    await click(c, 'button[data-journey="passage"]');
    await sleep(2500);
    const before = await c.evaluate(`window.__creation.state()`);
    assert.equal(before.active, true);
    await c.evaluate(`[...document.querySelectorAll('.creation-actions button')].find(b => b.textContent.startsWith('Skip')).click()`);
    let state;
    for (let i = 0; i < 60; i++) { state = await c.evaluate(`window.__creation ? window.__creation.state() : { active: false }`); if (!state.active) break; await sleep(200); }
    assert.equal(state.active, false);
    await sleep(1500);
    const hero = await c.evaluate(`({ y: scrollY, controls: !!document.querySelector('.creation-controls') })`);
    assert.equal(hero.controls, false);
    await jpg(c, 'verify/skip-intro-hero');
    pass('Skip intro → Hero', { at: before.time, hero, errors: c.errors });
  } finally { await c.close(); }
}

async function globe() {
  const c = await browser({ path: '/?globeDebug' });
  try {
    const g = await c.evaluate(`({ journey: document.querySelector('#journey').getBoundingClientRect().top + scrollY, vh: innerHeight })`);
    // Hero: the headline breaks up and the name resolves into type
    await scrollRun(c, 0, g.journey - g.vh, 900); await sleep(700);
    const hero = await c.evaluate(`({ name: getComputedStyle(document.querySelector('[data-hero-name]')).opacity })`);
    assert.ok(Number(hero.name) > 0.9, 'the name resolved into type');
    await jpg(c, 'verify/hero-name');
    pass('Hero entry: the name resolves', hero);
    await c.evaluate(`scrollTo(0, ${g.journey})`); await sleep(1500);
    assert.equal(await city(c), 'Doha');
    await c.wheel(120);
    const forward = await follow(c, 'Shanghai', 16000);
    assert.deepEqual(forward, CITIES, 'forward through all seven cities');
    await jpg(c, 'verify/globe-shanghai');
    await sleep(2600);
    await c.wheel(-120);
    const back = await follow(c, 'Doha', 16000);
    assert.deepEqual(back, [...CITIES].reverse(), 'reverse through all seven cities');
    await sleep(1500);
    const diag = await c.evaluate(`(() => { const s = window.__globeDiagnostics?.at(-1); return s ? { ownership: s.ownership, playing: s.playing, rp: s.renderedProgress } : null; })()`);
    pass('Globe desktop: Doha → Shanghai → Doha', { forward, back, diag });
    // The cover holds the headline and nothing else
    await c.evaluate(`scrollTo(0, 0)`); await sleep(900);
    const cover = await c.evaluate(`({ stage: [...document.querySelector('[data-hero-stage]').children].map(e => e.className.split(' ')[0]), corner: document.querySelector('.fixed-top-controls').children.length })`);
    assert.deepEqual(cover.stage, ['minimal-hero', 'hero-name']);
    assert.equal(cover.corner, 2, 'the corner holds sound and CV only');
    await jpg(c, 'verify/cover');
    pass('Cover: headline only', { cover, errors: c.errors });
  } finally { await c.close(); }
}

async function mobile() {
  const c = await browser({ width: 390, height: 844, touch: true, dsf: 2, path: '/?globeDebug' });
  try {
    const g = await c.evaluate(`({ journey: document.querySelector('#journey').getBoundingClientRect().top + scrollY, vh: innerHeight })`);
    await c.evaluate(`scrollTo(0, ${g.journey})`); await sleep(1600);
    assert.equal(await city(c), 'Doha');
    await c.swipe(260, { ms: 140 });
    const forward = await follow(c, 'Shanghai', 18000);
    assert.deepEqual(forward, CITIES);
    await sleep(2600);
    const after = await c.evaluate(`(() => { const s = window.__globeDiagnostics?.at(-1); return { y: Math.round(scrollY), rp: s?.renderedProgress, ownership: s?.ownership }; })()`);
    await c.swipe(-260, { y0: 300, ms: 140 });
    const back = await follow(c, 'Doha', 18000);
    assert.deepEqual(back, [...CITIES].reverse());
    await sleep(1800);
    const end = await c.evaluate(`(() => { const s = window.__globeDiagnostics?.at(-1); return { y: Math.round(scrollY), rp: s?.renderedProgress, ownership: s?.ownership, playing: s?.playing }; })()`);
    pass('Globe mobile-emulated touch: Doha → Shanghai → Doha', { forward, after, back, end });

    // After the Globe the page scrolls freely and the corner still holds two controls only
    await c.evaluate(`document.querySelector('#education').scrollIntoView()`); await sleep(900);
    const corner = await c.evaluate(`({ controls: [...document.querySelector('.fixed-top-controls').children].map(e => e.className.split(' ')[0]), lock: document.documentElement.dataset.globeScroll || null, gauge: getComputedStyle(document.querySelector('.depth-gauge')).display })`);
    assert.deepEqual(corner.controls, ['decode-sound-toggle', 'fixed-cv-link']);
    assert.equal(corner.lock, null);
    assert.equal(corner.gauge, 'none', 'no gauge on a phone');
    pass('Mobile corner: sound and CV only', { corner, errors: c.errors });
  } finally { await c.close(); }
}

/** What the minimalist CV does without: none of this may be on the page. */
const REMOVED = ['.itinerary', '.chapter-line', '.section-mark', '.index-toggle', '.index-sheet', '.reading-veil', '.hero-colophon', '.profile-shortcut', '.globe-note', '.exp-what', '.section-dek', '.section-aside', '[data-title-emergence]'];

/** Words standing in the reading zone that are not plainly set (still hidden or still in glyph cells). */
const unsetInReadingZone = (c) => c.evaluate(`(() => {
  const vh = innerHeight;
  return [...document.querySelectorAll('[data-editorial-section]:not(#home) .ascii-word')].filter(el => {
    const r = el.getBoundingClientRect();
    if (r.top < vh * 0.17 || r.top > vh * 0.8) return false;
    return el.style.opacity !== '1' || el.querySelector('.ascii-visual').firstElementChild !== null;
  }).length;
})()`);

/** Read the page top to bottom at each width: every line decodes out of the encrypted alphabet,
 * rests readable in the reading zone, scrambles out at the top and comes back on the way up. */
async function cv() {
  for (const v of [{ w: 1440, h: 900 }, { w: 1280, h: 800 }, { w: 768, h: 1024, touch: true }, { w: 390, h: 844, touch: true }, { w: 320, h: 740, touch: true }]) {
    const c = await browser({ width: v.w, height: v.h, touch: v.touch });
    try {
      const g = await c.evaluate(`({ intro: document.querySelector('#introduction').getBoundingClientRect().top + scrollY, experience: document.querySelector('#experience').getBoundingClientRect().top + scrollY, max: document.documentElement.scrollHeight - innerHeight })`);
      // While scrolling, sample every frame: titles, reading text and the mono labels all pass
      // through glyph cells on their way in
      await c.evaluate(`(() => {
        const words = [...document.querySelectorAll('[data-editorial-section]:not(#home) .ascii-word')].map(el => ({ visual: el.querySelector('.ascii-visual'), mono: /mono/i.test(getComputedStyle(el).fontFamily.split(',')[0]), title: !!el.closest('h2.ocean-h2') }));
        const s = window.__decode = { frames: 0, title: 0, reading: 0, mono: 0, stop: false };
        const tick = () => {
          s.frames++;
          for (const w of words) {
            if (w.visual.firstElementChild === null) continue;
            if (w.title) s.title++; else if (w.mono) s.mono++; else s.reading++;
          }
          if (!s.stop) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      })()`);
      await c.evaluate(`scrollTo(0, ${g.intro - v.h})`); await sleep(500);
      await scrollRun(c, g.intro - v.h, g.max, 700);
      await sleep(6000);
      const decode = await c.evaluate(`(window.__decode.stop = true, window.__decode)`);
      assert.ok(decode.title > 0, 'titles decode letter by letter');
      assert.ok(decode.reading > 0, 'reading text decodes letter by letter');
      assert.ok(decode.mono > 0, 'the mono labels decode letter by letter');
      // The last screen holds still, so everything on it reads
      const rest = await c.evaluate(`(() => {
        const words = [...document.querySelectorAll('[data-editorial-section]:not(#home) .ascii-word')];
        const visible = words.filter(el => { const r = el.getBoundingClientRect(); return r.top >= 0 && r.bottom <= innerHeight; });
        return {
          w: innerWidth, scrollWidth: document.documentElement.scrollWidth, words: words.length, visible: visible.length,
          unset: visible.filter(el => el.style.opacity !== '1' || el.querySelector('.ascii-visual').firstElementChild).length,
          present: ${JSON.stringify(REMOVED)}.filter(sel => document.querySelector(sel)),
          nodes: document.querySelectorAll('*').length
        };
      })()`);
      assert.ok(rest.visible > 0);
      assert.equal(rest.unset, 0, 'every word on the last screen is set');
      assert.deepEqual(rest.present, [], 'none of the removed elements is on the page');
      assert.ok(rest.scrollWidth <= v.w, 'no horizontal overflow');
      // Scroll-driven and reversible: a section read, left behind, and come back to
      const at = g.experience - v.h * 0.18;
      await c.evaluate(`scrollTo(0, ${at})`); await sleep(6000);
      const read = await unsetInReadingZone(c);
      const gone = await c.evaluate(`[...document.querySelectorAll('#introduction .ascii-word')].filter(el => el.getBoundingClientRect().top < innerHeight * 0.03 && el.style.opacity === '0').length`);
      await scrollRun(c, at, at + v.h * 1.4, 900); await sleep(400);
      const leaving = await c.evaluate(`[...document.querySelectorAll('#experience h2 .ascii-word')].every(el => el.style.opacity === '0')`);
      await c.evaluate(`scrollTo(0, ${at})`); await sleep(6000);
      const back = await unsetInReadingZone(c);
      assert.equal(read, 0, 'the reading zone is fully set');
      assert.ok(gone > 0, 'copy above the top of the screen has scrambled out');
      assert.equal(leaving, true, 'a title scrolled away is gone');
      assert.equal(back, 0, 'and it reads again on the way back');
      pass(`CV read through at ${v.w}px`, { decode, rest, read, gone, back, errors: c.errors });
      assert.deepEqual(c.errors, []);
    } finally { await c.close(); }
  }
}

async function reduced() {
  for (const v of [{ w: 1440, h: 900 }, { w: 390, h: 844, touch: true }]) {
    const c = await browser({ width: v.w, height: v.h, touch: v.touch, source: '' });
    try {
      await c.send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] });
      await c.goto((await c.evaluate('location.origin')) + '/');
      for (let i = 0; i < 80; i++) { if (await c.evaluate(`!!document.querySelector('#journey')`)) break; await sleep(250); }
      await c.evaluate('document.fonts.ready'); await sleep(2200);
      await c.evaluate(`document.querySelector('#experience').scrollIntoView()`); await sleep(700);
      const r = await c.evaluate(`(() => {
        const cs = (s, p) => getComputedStyle(document.querySelector(s))[p];
        const words = [...document.querySelectorAll('[data-editorial-section] .ascii-word')];
        return {
          runway: Math.round(document.querySelector('[data-journey-runway]').getBoundingClientRect().height), vh: innerHeight,
          datum: getComputedStyle(document.querySelector('.exp-entry'), '::before').animationName,
          hiddenWords: words.filter(el => getComputedStyle(el).opacity !== '1').length,
          cells: words.filter(el => el.querySelector('.ascii-visual').firstElementChild).length,
          title: cs('#experience h2 .ascii-source', 'opacity'), sound: cs('.decode-sound-toggle', 'display')
        };
      })()`);
      assert.equal(r.runway, r.vh); assert.equal(r.hiddenWords, 0); assert.equal(r.cells, 0); assert.equal(r.sound, 'none');
      await jpg(c, `verify/reduced-${v.w}`);
      pass(`reduced motion at ${v.w}px`, { ...r, errors: c.errors });
    } finally { await c.close(); }
  }
}

export default async function verify() {
  const only = (process.argv[3] || 'journeys,globe,mobile,cv,reduced').split(',');
  await server('after');
  const tasks = { journeys, globe, mobile, cv, reduced };
  try {
    for (const name of only) await tasks[name]();
  } finally {
    save('verify-' + only.join('-'), results);
  }
  console.log('VERIFY PASS', only.join(','));
}
