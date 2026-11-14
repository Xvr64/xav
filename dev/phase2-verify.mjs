// Phase II acceptance in a real browser: the cinematic experience is intact and the CV reads.
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
      const hero = await c.evaluate(`({ y: scrollY, colophon: getComputedStyle(document.querySelector('[data-hero-colophon]')).opacity, scrollable: getComputedStyle(document.documentElement).overflowY, whales: !!document.querySelector('canvas[data-whale-renderer]'), cover: document.querySelector('.cover-title .sr-only').textContent, playback: ${JSON.stringify([...playback])} })`);
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
    const hero = await c.evaluate(`({ y: scrollY, colophon: getComputedStyle(document.querySelector('[data-hero-colophon]')).opacity, controls: !!document.querySelector('.creation-controls') })`);
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
    // The profile shortcut on the cover
    await c.evaluate(`scrollTo(0, 0)`); await sleep(900);
    await click(c, '.profile-shortcut'); await sleep(1600);
    const landing = await c.evaluate(`({ top: Math.round(document.querySelector('#introduction').getBoundingClientRect().top), lock: document.documentElement.dataset.globeScroll || null, mark: Math.round(document.querySelector('#introduction .section-mark').getBoundingClientRect().top) })`);
    assert.ok(Math.abs(landing.top) <= 2, JSON.stringify(landing));
    assert.equal(landing.lock, null);
    await sleep(900);
    await jpg(c, 'verify/profile-landing');
    pass('Profile shortcut lands on the profile', { landing, errors: c.errors });
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

    // The small-screen index: seven chapters, each a direct jump that focuses its section
    await c.evaluate(`document.querySelector('#education').scrollIntoView()`); await sleep(900);
    await click(c, '.index-toggle');
    assert.equal(await c.evaluate(`document.querySelectorAll('.index-sheet a').length`), 7);
    await jpg(c, 'verify/index-390');
    const current = await c.evaluate(`document.querySelector('.index-sheet a[aria-current]')?.getAttribute('href')`);
    const jumps = [];
    await click(c, '.index-sheet a[href="#experience"]');
    for (const id of ['experience', 'introduction', 'skills', 'education', 'languages', 'interests', 'contact']) {
      if (id !== 'experience') { await click(c, '.index-toggle'); await click(c, `.index-sheet a[href="#${id}"]`); }
      const r = await c.evaluate(`({ id: '${id}', focus: document.activeElement.id, open: !!document.querySelector('.index-sheet'), lock: document.documentElement.dataset.globeScroll || null, top: Math.round(document.querySelector('#${id}').getBoundingClientRect().top) })`);
      assert.equal(r.focus, id); assert.equal(r.open, false); assert.equal(r.lock, null);
      jumps.push(r);
    }
    pass('Mobile section index', { current, jumps, errors: c.errors });
  } finally { await c.close(); }
}

/** Read the page top to bottom at each width; everything must end fully set and undecorated. */
async function cv() {
  for (const v of [{ w: 1440, h: 900 }, { w: 1280, h: 800 }, { w: 768, h: 1024, touch: true }, { w: 390, h: 844, touch: true }, { w: 320, h: 740, touch: true }]) {
    const c = await browser({ width: v.w, height: v.h, touch: v.touch });
    try {
      const g = await c.evaluate(`({ intro: document.querySelector('#introduction').getBoundingClientRect().top + scrollY, max: document.documentElement.scrollHeight - innerHeight })`);
      // While scrolling, sample every frame: reading text must never show a substitute character
      await c.evaluate(`(() => {
        const words = [...document.querySelectorAll('[data-editorial-section]:not(#home) .ascii-word')].map(el => ({ el, visual: el.querySelector('.ascii-visual'), word: el.querySelector('.ascii-visual').dataset.word, mono: /mono/i.test(getComputedStyle(el).fontFamily.split(',')[0]), title: !!el.closest('h2.ocean-h2') }));
        const s = window.__voices = { frames: 0, readingScrambled: 0, titleScrambled: 0, instrumentCells: 0, canvases: 0, maxCanvases: 0, partial: 0, stop: false };
        const tick = () => {
          s.frames++;
          for (const w of words) {
            const cells = w.visual.firstElementChild !== null;
            if (cells && w.title) s.titleScrambled++;
            else if (cells && !w.mono) s.readingScrambled++;
            else if (cells) s.instrumentCells++;
            if (!cells && w.visual.textContent !== w.word) s.readingScrambled++;
          }
          const n = document.querySelectorAll('[data-title-emergence]').length;
          if (n) s.canvases++;
          s.maxCanvases = Math.max(s.maxCanvases, n);
          if (!s.stop) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      })()`);
      await c.evaluate(`scrollTo(0, ${g.intro - v.h})`); await sleep(500);
      await scrollRun(c, g.intro - v.h, g.max, 700);
      await sleep(1600);
      const voices = await c.evaluate(`(window.__voices.stop = true, window.__voices)`);
      assert.equal(voices.readingScrambled, 0, 'reading text never shows substitute characters');
      assert.equal(voices.titleScrambled, 0, 'titles are never letter-scrambled');
      assert.ok(voices.instrumentCells > 0, 'the instrument settles through figures');
      assert.ok(voices.canvases > 0 && voices.maxCanvases <= 2, 'titles emerge, one or two at a time');
      const rest = await c.evaluate(`(() => {
        const words = [...document.querySelectorAll('[data-editorial-section]:not(#home) .ascii-word')];
        const share = (el) => { const a = el.querySelector('.chapter-rule-reached'), b = el.querySelector('.chapter-rule-ahead'); const wa = a.getBoundingClientRect().width, wb = b ? b.getBoundingClientRect().width : 0; return Math.round(100 * wa / (wa + wb)); };
        return {
          w: innerWidth, scrollWidth: document.documentElement.scrollWidth,
          words: words.length,
          unset: words.filter(el => el.style.opacity !== '1' || el.style.transform || el.querySelector('.ascii-visual').firstElementChild).length,
          canvases: document.querySelectorAll('[data-title-emergence]').length,
          marks: [...document.querySelectorAll('.section-mark')].map(e => e.textContent),
          shares: [...document.querySelectorAll('.chapter-line')].map(share),
          ruleRight: Math.max(...[...document.querySelectorAll('.chapter-rule')].map(e => Math.round(e.getBoundingClientRect().right))),
          nodes: document.querySelectorAll('*').length
        };
      })()`);
      assert.equal(rest.unset, 0, 'every word ends fully set');
      assert.equal(rest.canvases, 0, 'no emergence canvas outlives its title');
      assert.deepEqual(rest.marks, ['01 / 07', '02 / 07', '03 / 07', '04 / 07', '05 / 07', '06 / 07', '07 / 07']);
      assert.deepEqual(rest.shares, [14, 29, 43, 57, 71, 86, 100]);
      assert.ok(rest.scrollWidth <= v.w, 'no horizontal overflow');
      assert.ok(rest.ruleRight <= v.w, 'chapter rules end inside the screen');
      // The profile's facts stay clear of the depth gauge's names
      const clash = await c.evaluate(`(() => {
        scrollTo(0, ${g.intro});
        const gauge = document.querySelector('.depth-gauge');
        if (!gauge || getComputedStyle(gauge).display === 'none') return null;
        const labels = [...gauge.querySelectorAll('.depth-gauge-label')].map(e => e.getBoundingClientRect());
        const facts = [...document.querySelectorAll('.intro-facts dd .ascii-word')].map(e => e.getBoundingClientRect());
        return { labelLeft: Math.round(Math.min(...labels.map(r => r.left))), factsRight: Math.round(Math.max(...facts.map(r => r.right))) };
      })()`);
      if (clash) assert.ok(clash.factsRight < clash.labelLeft, `facts clear of the gauge: ${JSON.stringify(clash)}`);
      pass(`CV read through at ${v.w}px`, { voices, rest, clash, errors: c.errors });
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
          rule: cs('.chapter-rule', 'animationName'), datum: getComputedStyle(document.querySelector('.exp-entry'), '::before').animationName,
          hiddenWords: words.filter(el => getComputedStyle(el).opacity !== '1').length,
          movedWords: words.filter(el => el.style.transform).length,
          canvases: document.querySelectorAll('[data-title-emergence]').length,
          title: cs('#experience h2 .ascii-source', 'opacity'), sound: cs('.decode-sound-toggle', 'display'),
          marks: document.querySelectorAll('.section-mark').length
        };
      })()`);
      assert.equal(r.runway, r.vh); assert.equal(r.rule, 'none'); assert.equal(r.hiddenWords, 0); assert.equal(r.movedWords, 0); assert.equal(r.canvases, 0); assert.equal(r.marks, 7);
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
