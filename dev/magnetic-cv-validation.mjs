// Validation for the ?magneticCV=1 preview (magneticCV.ts). Private headless Chrome over CDP.
//   node dev/magnetic-cv-validation.mjs            all checks
//   node dev/magnetic-cv-validation.mjs --quick    one desktop + one mobile viewport, no Globe comparison
import assert from 'node:assert/strict';
process.env.PHASE2_OUT ||= 'artifacts/magnetic-cv-v2';
const { server, browser, png, save, stats, stopServers } = await import('./phase2-lib.mjs');
const { sleep } = await import('./fable-cdp.mjs');
const quick = process.argv.includes('--quick');
const FLAG = '/?magneticCV=1';
const SETTLE = 780; // Passage plus headless input/frame scheduling margin
const report = { viewports: [], globe: [], failures: [] };

const setup = `(() => {
  window.chapterEls = () => [...document.querySelectorAll('#introduction, .cv-arch > section')];
  window.wordsOf = el => [...el.querySelectorAll('.ascii-word')].filter(w => w.getClientRects().length && !w.closest('[data-ascii-preserve]'));
  window.isReadable = w => {
    const v = w.querySelector('.ascii-visual');
    return v.textContent === w.querySelector('.ascii-source').textContent && v.style.visibility !== 'hidden' && !v.children.length;
  };
  window.inView = w => { const r = w.getBoundingClientRect(); return r.bottom > 1 && r.top < innerHeight - 1; };
  window.cvState = () => {
    const els = chapterEls();
    const visible = els.filter(el => !el.hasAttribute('data-cv-muted'));
    // Any other chapter's words on screen with any ink at all count as overlap.
    const overlap = els.filter(el => !visible.includes(el) && wordsOf(el).some(inView) && +getComputedStyle(el).opacity > .01).map(el => el.id);
    const current = visible[0];
    const g = current ? geometry().find(x => x.id === current.id) : null;
    const atEdge = !g || scrollY <= g.top + 2 || scrollY >= g.end - 2;
    const words = current ? wordsOf(current).filter(inView) : [];
    const mustRead = atEdge ? words : words.filter(w => {
      const r = w.getBoundingClientRect();
      return r.top < innerHeight * .60 || Math.round(r.top + scrollY) < g.top + innerHeight;
    });
    return { y: Math.round(scrollY), hash: location.hash, visible: visible.map(el => el.id), overlap,
      inView: words.length, unreadable: mustRead.filter(w => !isReadable(w)).map(w => w.querySelector('.ascii-source').textContent),
      passage: !!document.querySelector('[data-cv-depart],[data-cv-arrive]'),
      staged: els.some(el => el.style.translate || el.style.clipPath || el.querySelector('[data-drift]')) };
  };
  window.geometry = () => chapterEls().map(el => {
    const r = el.getBoundingClientRect(), top = Math.round(r.top + scrollY), bottom = r.bottom + scrollY;
    const pad = parseFloat(getComputedStyle(el).paddingBottom) || 0;
    const rawEnd = Math.round(Math.min(bottom, bottom - pad + 16) - innerHeight);
    return { id: el.id, top, end: bottom - pad <= top + innerHeight ? top : rawEnd, h: Math.round(r.height) };
  });
  window.seenReadable = new Set();
  window.noteReadable = () => { const v = chapterEls().find(el => !el.hasAttribute('data-cv-muted')); if (v) wordsOf(v).filter(inView).filter(isReadable).forEach(w => seenReadable.add(w)); };
  window.allWords = () => chapterEls().flatMap(wordsOf);
  window.watched = new Set(); window.mutations = 0;
  new MutationObserver(rs => { for (const r of rs) { const el = r.target instanceof Element ? r.target : r.target.parentElement; if (el?.closest('.ascii-visual') && watched.has(el?.closest('.ascii-word'))) mutations++; } })
    .observe(document.querySelector('main'), { subtree: true, childList: true, characterData: true, attributes: true, attributeFilter: ['style', 'class'] });
  window.passages = 0; window.durations = []; let began = 0;
  new MutationObserver(rs => { for (const r of rs) {
    if (r.target.hasAttribute('data-cv-depart')) { passages++; began = performance.now(); }
    else if (began) { durations.push(performance.now() - began); began = 0; }
  } }).observe(document.querySelector('main'), { subtree: true, attributes: true, attributeFilter: ['data-cv-depart'] });
  window.frameLog = null;
  window.recordFrames = ms => new Promise(resolve => {
    const d = []; let last = 0, drift = 0, decoding = 0, maxScale = 1, minScale = 1, sharedCut = 0, maxSeamError = 0;
    const t0 = performance.now();
    const f = t => {
      const from = document.querySelector('[data-cv-depart]'), to = document.querySelector('[data-cv-arrive]');
      if (from && to) {
        if (last) d.push(t - last); last = t;
        drift = Math.max(drift, from.querySelectorAll('[data-drift]').length);
        decoding = Math.max(decoding, to.querySelectorAll('.ascii-cell').length);
        const edges = [from, to].map(el => {
          const poly = getComputedStyle(el).clipPath;
          if (!poly.startsWith('polygon(')) return null;
          const points = poly.slice(8, -1).split(',').map(p => parseFloat(p.trim().split(/ +/)[1]) + el.getBoundingClientRect().top);
          return points.slice(2);
        });
        if (edges.every(Boolean)) {
          sharedCut++;
          maxSeamError = Math.max(maxSeamError, ...edges[0].map((y, i) => Math.abs(y - edges[1][i])));
        }
        maxScale = Math.max(maxScale, new DOMMatrixReadOnly(getComputedStyle(from.firstElementChild).transform).a);
        if (+getComputedStyle(to.firstElementChild).opacity > 0) {
          minScale = Math.min(minScale, new DOMMatrixReadOnly(getComputedStyle(to.firstElementChild).transform).a);
        }
      }
      if (t - t0 > ms) resolve({ frames: d, drift, decoding, maxScale, minScale, sharedCut, maxSeamError });
      else requestAnimationFrame(f);
    }; requestAnimationFrame(f); });
  window.jumpTo = y => new Promise(r => { scrollTo({ top: y, behavior: 'instant' }); requestAnimationFrame(() => requestAnimationFrame(r)); });
  return geometry();
})()`;

const state = c => c.evaluate('cvState()');
/** One deliberate gesture: a mouse-wheel notch, or a short swipe. */
async function gesture(c, dir, touch, width, height = 844) {
  const y0 = dir > 0 ? Math.min(620, Math.round(height * .76)) : Math.max(200, Math.round(height * .32));
  if (touch) await c.swipe(dir * 170, { x: width / 2, y0, steps: 8, ms: 150 });
  else await c.wheel(dir * 120);
}
/** A trackpad flick: one hand stroke followed by a long decaying momentum tail (~1.3s). */
async function trackpad(c, dir, events = 80, start = 46) {
  for (let i = 0; i < events; i++) {
    await c.wheel(dir * Math.max(1, Math.round(start * 0.94 ** i)), 150, 190);
    await sleep(14);
  }
}
const index = (geo, id) => geo.findIndex(g => g.id === id);

// Each case starts at a measured reading edge. Count every passage, including a snap
// that could return to the expected section after a spurious reversal.
async function stressGestures(c, geo, { width, height, touch }, row) {
  const startAt = async id => {
    const g = geo.find(g => g.id === id);
    await c.evaluate(`jumpTo(${g.end})`);
    await sleep(400);
  };
  const exact = async (id, dir, input) => {
    const before = await c.evaluate('passages');
    await input();
    await sleep(SETTLE);
    const dest = geo[index(geo, id) + dir];
    const landed = await state(c);
    assert.deepEqual(landed.visible, [dest.id], `one gesture from ${id} must land on ${dest.id}`);
    assert.equal(await c.evaluate('passages') - before, 1, 'exactly one passage, including all momentum');
    assert.ok(Math.abs(landed.y - (dir > 0 ? dest.top : dest.end)) <= 2, 'momentum cannot move the landing');
  };
  await startAt('skills');
  if (touch) {
    await exact('skills', 1, async () => {
      const fling = () => c.swipe(height * .65, { x: width / 2, y0: height * .82, steps: 3, ms: 18 });
      await fling();
      // A second finger stroke beginning during the cut must never be queued.
      await fling();
    });
    await exact('languages', -1, () => c.swipe(-height * .65, { x: width / 2, y0: height * .16, steps: 3, ms: 18 }));
  } else {
    await exact('skills', 1, () => c.wheel(100000));
    await exact('languages', 1, async () => {
      // A flywheel coasts past the animation, slows down, then produces two coalesced spikes.
      // No quiet interval or new stroke occurs between these events.
      await trackpad(c, 1, 46, 180);
      await c.wheel(480);
      await trackpad(c, 1, 30, 40);
      await c.wheel(-80);
    });
    await exact('interests', -1, () => c.wheel(-100000));
    await exact('languages', -1, () => trackpad(c, -1));
  }
  row.stressGestures = 'passed';
}

async function desktopReading(c, width, height) {
  await c.desktop(width, 400);
  try {
    await sleep(400);
    const geo = await c.evaluate('geometry()');
    const chapter = geo.find(g => g.id === 'experience');
    assert.ok(chapter.end > chapter.top + 60, 'short desktop window has an actual reading span');
    await c.evaluate(`jumpTo(${chapter.top})`);
    await c.wheel(40, 150, 190);
    await sleep(450);
    const middle = await state(c);
    assert.ok(middle.y > chapter.top && middle.y < chapter.end, 'native wheel reads within the chapter');
    const before = await c.evaluate('passages');
    await c.wheel(100000, 150, 190);
    await trackpad(c, 1, 36);
    assert.deepEqual((await state(c)).visible, [chapter.id]);
    assert.equal((await state(c)).y, chapter.end);
    assert.equal(await c.evaluate('passages'), before, 'a reading gesture stops at the final line');
    await sleep(350);
    await c.wheel(120, 150, 190);
    await sleep(SETTLE);
    assert.deepEqual((await state(c)).visible, ['education'], 'a new gesture at that edge snaps');
  } finally {
    await c.desktop(width, height);
    await sleep(400);
  }
}

async function walk(c, geo, dir, touch, width, height, label, row) {
  const steps = [];
  let s = await state(c);
  const startId = s.visible[0];
  const goal = dir > 0 ? geo.at(-1).id : geo[0].id;
  const done = () => s.visible[0] === goal && (dir < 0 ? s.y <= geo[0].top + 2 : steps.at(-1)?.stuck);
  for (let i = 0; i < 40 && !done(); i++) {
    const before = s;
    await gesture(c, dir, touch, width, height);
    await sleep(SETTLE);
    s = await state(c);
    await c.evaluate('noteReadable()');
    const moved = index(geo, s.visible[0]) - index(geo, before.visible[0]);
    steps.push({ y: s.y, visible: s.visible, moved, stuck: s.y === before.y });
    assert.equal(s.visible.length, 1, `${label}: exactly one chapter shown ${JSON.stringify(s)}`);
    assert.deepEqual(s.overlap, [], `${label}: no other chapter's text on screen`);
    assert.deepEqual(s.unreadable, [], `${label}: every line on screen readable after the passage (${s.visible[0]})`);
    assert.ok(Math.abs(moved) <= 1 && moved * dir >= 0, `${label}: one gesture moves at most one chapter, in its direction`);
    const origin = geo[index(geo, before.visible[0])];
    const canSnap = dir > 0 ? before.y >= origin.end - 2 : before.y <= origin.top + 2;
    if (geo[index(geo, origin.id) + dir]) assert.equal(moved, canSnap ? dir : 0, 'only a gesture at a reading edge advances');
    if (moved) {
      const dest = geo[index(geo, s.visible[0])];
      assert.ok(Math.abs(s.y - (dir > 0 ? dest.top : dest.end)) <= 2, 'precise landing');
    }
    assert.equal(s.passage || s.staged, false, 'all mask, translation and glyph effects cleaned up at rest');
  }
  assert.equal(s.visible[0], goal, `${label}: reached ${goal}`);
  // Every chapter from the walk's start to the goal was visited in order.
  const order = [...new Set([startId, ...steps.map(x => x.visible[0])])];
  const all = (dir > 0 ? geo : [...geo].reverse()).map(g => g.id);
  const expected = all.slice(all.indexOf(startId));
  assert.deepEqual(order.filter(id => expected.includes(id)), expected, `${label}: every chapter in order`);
  row[label] = steps;
}

async function viewport({ width, height, touch, dsf }) {
  const c = await browser({ width, height, touch, dsf, path: FLAG + '#introduction' });
  const row = { width, height, touch };
  try {
    const geo = await c.evaluate(setup);
    row.geometry = geo;
    row.longChapters = geo.filter(g => g.end > g.top).map(g => g.id);
    assert.equal(await c.evaluate(`!!document.querySelector('.terminal-portfolio.magnetic-cv')`), true, 'flag on');

    assert.ok(Math.abs((await state(c)).y - geo[0].top) <= 2, 'cold fragment lands on Profile after fonts load');

    if (process.argv.includes('--gestures-only')) {
      await stressGestures(c, geo, { width, height, touch }, row);
      row.pass = true;
      return;
    }
    // 1. Downward through every chapter, one gesture at a time, capturing the first passage mid-flight.
    await c.evaluate(`jumpTo(${geo[0].top})`);
    await sleep(500);
    await c.evaluate('noteReadable()');
    const first = await state(c);
    assert.deepEqual(first.visible, ['introduction']);
    await c.evaluate(`jumpTo(${geo[0].end})`);
    await c.evaluate('(window.frameLog = recordFrames(1000), 0)');
    await gesture(c, 1, touch, width, height);
    const { frames, ...motion } = await c.evaluate('frameLog');
    row.motion = motion;
    row.passageFrames = stats(frames);
    row.duration = await c.evaluate('durations.at(-1)');
    assert.ok(row.duration >= 550 && row.duration <= 700, `passage duration ${row.duration}ms`);
    assert.ok(motion.sharedCut >= 3 && motion.maxSeamError <= 2, 'both viewport masks meet on the same edge');
    assert.ok(motion.maxScale > 1 && motion.minScale < 1, 'both depth transforms played');
    assert.ok(motion.drift > 0 && motion.decoding > 0, 'local dissolution and incoming decryption played');
    assert.deepEqual((await state(c)).visible, ['experience'], 'first passage lands on Experience');
    await c.evaluate('noteReadable()');
    await walk(c, geo, 1, touch, width, height, 'down', row);
    await png(c, `${width}-contact`);

    // 2. Back up: completed ASCII reveals are never replayed or re-scrambled.
    await c.evaluate(`allWords().filter(isReadable).forEach(w => watched.add(w)); mutations = 0`);
    await walk(c, geo, -1, touch, width, height, 'up', row);
    row.walkDurations = await c.evaluate('durations.slice()');
    assert.equal(row.walkDurations.length, 12, 'six forward and six reverse passages');
    assert.ok(row.walkDurations.every(ms => ms >= 550 && ms <= 700), `walk timing: ${row.walkDurations}`);
    row.upwardMutations = await c.evaluate('mutations');
    assert.equal(row.upwardMutations, 0, 'completed reveals untouched on the way up');
    row.readCoverage = await c.evaluate(`({ total: allWords().length, read: allWords().filter(w => seenReadable.has(w)).length,
      missed: allWords().filter(w => !seenReadable.has(w)).map(w => w.querySelector('.ascii-source').textContent).slice(0, 12) })`);
    assert.equal(row.readCoverage.read, row.readCoverage.total, 'every CV word was on screen and readable at a resting point');

    await stressGestures(c, geo, { width, height, touch }, row);

    if (width === 1440 && !touch) {
      await desktopReading(c, width, height);
      row.longDesktopReading = true;
    }

    // 4. Momentum carried in from the Globe's runway settles on the Profile.
    await c.evaluate(`jumpTo(${geo[0].top - Math.round(height * .45)})`); await sleep(700);
    if (touch) {
      const span = Math.min(520, Math.round(height * .72));
      await c.swipe(span, { x: width / 2, y0: Math.round(height * .88), steps: 5, ms: 60 });
    }
    else await trackpad(c, 1, 70, 60);
    await sleep(SETTLE + 600);
    row.carriedIn = await state(c);
    assert.deepEqual(row.carriedIn.visible, ['introduction'], 'carried-in momentum settles on the Profile');
    assert.ok(Math.abs(row.carriedIn.y - geo[0].top) <= 2, 'the Profile handoff lands at its heading');
    assert.deepEqual(row.carriedIn.overlap, []);

    // 5. Direct navigation: hash, history, gauge, header link, focus.
    const at = async id => { const s = await state(c); return { id: s.visible[0], y: s.y, top: geo[index(geo, id)].top, overlap: s.overlap }; };
    const nav = {};
    await c.evaluate(`location.hash = '#languages'`); await sleep(600);
    nav.hash = await at('languages');
    await c.evaluate(`location.hash = '#experience'`); await sleep(600);
    await c.evaluate(`history.back()`); await sleep(800);
    nav.back = await at('languages');
    await c.evaluate(`document.querySelector('.depth-gauge a[href="#skills"]').click()`); await sleep(700);
    nav.gauge = await at('skills');
    await c.evaluate(`document.querySelector('#contact a[href*="linkedin"]').focus()`); await sleep(500);
    nav.focus = await at('contact');
    await c.evaluate(`document.querySelector('.fixed-cv-link[href="#contact"]').click()`); await sleep(700);
    nav.headerContact = await at('contact');
    for (const [name, n] of Object.entries(nav)) {
      const want = { hash: 'languages', back: 'languages', headerContact: 'contact', gauge: 'skills', focus: 'contact' }[name];
      assert.equal(n.id, want, `navigation ${name}`);
      assert.deepEqual(n.overlap, [], `navigation ${name} overlap`);
      if (name !== 'focus') assert.ok(Math.abs(n.y - n.top) <= 2, `navigation ${name} lands on the chapter top ${JSON.stringify(n)}`);
    }
    row.navigation = nav;
    // Then a gesture from a navigated chapter top still makes one passage.
    await gesture(c, -1, touch, width, height); await sleep(SETTLE);
    const fromNav = await state(c);
    assert.equal(fromNav.visible[0], geo[index(geo, 'contact') - 1].id, 'gesture after navigation');

    // A real keypress moves focus and scroll together; a held key cannot chain snaps.
    const key = (type, autoRepeat = false) => c.send('Input.dispatchKeyEvent', {
      type, key: 'PageDown', code: 'PageDown', windowsVirtualKeyCode: 34, autoRepeat
    });
    await c.evaluate(`jumpTo(${geo[0].end})`);
    await key('keyDown');
    await sleep(SETTLE);
    await key('keyDown', true);
    await key('keyUp');
    await sleep(SETTLE);
    assert.deepEqual((await state(c)).visible, ['experience'], 'one keypress moves one chapter');
    assert.equal(await c.evaluate('document.activeElement.id'), 'experience', 'keyboard focus follows the snap');

    // 6. Reduced motion: the same one-gesture steps, landing instantly with no passage.
    await c.send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] });
    await sleep(500);
    const reduced = await c.evaluate('geometry()');
    const exp = reduced[index(reduced, 'experience')];
    await c.evaluate(`jumpTo(${exp.end})`); await sleep(400);
    const p0 = await c.evaluate('passages');
    await gesture(c, 1, touch, width, height); await sleep(250);
    const r1 = await state(c);
    await gesture(c, -1, touch, width, height); await sleep(250);
    const r2 = await state(c);
    row.reduced = { down: r1, up: r2, passages: await c.evaluate('passages') - p0 };
    assert.equal(r1.visible[0], 'education', 'reduced motion: one gesture, one chapter');
    assert.equal(r2.visible[0], 'experience', 'reduced motion: and back');
    assert.equal(row.reduced.passages, 0, 'reduced motion never plays the current');
    assert.deepEqual(r1.unreadable, []);
    await c.send('Emulation.setEmulatedMedia', { features: [] });

    row.errors = c.errors;
    assert.deepEqual(c.errors, [], 'no page errors');
    row.overflowX = await c.evaluate('document.documentElement.scrollWidth > innerWidth');
    assert.equal(row.overflowX, false);
    row.pass = true;
  } catch (error) {
    row.pass = false; row.error = String(error.message || error);
    report.failures.push(`${width}x${height}: ${row.error}`);
    await png(c, `${width}-failure`).catch(() => {});
  } finally {
    report.viewports.push(row); save('validation', report);
    console.log(JSON.stringify({ width, height, pass: row.pass, error: row.error, longChapters: row.longChapters, coverage: row.readCoverage, stressGestures: row.stressGestures, carriedIn: row.carriedIn && { visible: row.carriedIn.visible, y: row.carriedIn.y } }));
    await c.close();
  }
}

/** The Globe's own controllers must behave the same with and without the flag. */
async function globe({ width, height, touch, dsf }) {
  const runs = {};
  for (const path of ['/', FLAG]) {
    const c = await browser({ width, height, touch, dsf, path });
    try {
      const geo = await c.evaluate(setup);
      const journey = await c.evaluate(`Math.round(document.querySelector('#journey').getBoundingClientRect().top + scrollY)`);
      const ys = [];
      await c.evaluate(`jumpTo(${journey - Math.round(height * .2)})`); await sleep(900);
      for (let i = 0; i < 4; i++) { await gesture(c, 1, touch, width); await sleep(2600); ys.push(await c.evaluate('Math.round(scrollY)')); }
      // Reverse playback: up from the Profile back into the Globe.
      await c.evaluate(`jumpTo(${geo[0].top})`); await sleep(900);
      const back = [];
      for (let i = 0; i < 3; i++) { await gesture(c, -1, touch, width); await sleep(2600); back.push(await c.evaluate('Math.round(scrollY)')); }
      runs[path] = { ys, back, errors: c.errors, passages: await c.evaluate('passages'),
        globeAttr: await c.evaluate(`document.documentElement.getAttribute('data-globe-scroll')`) };
      if (path === '/') runs[path].order = await c.evaluate(`[...document.querySelectorAll('.cv-arch > section')].map(s => s.id)`);
    } finally { await c.close(); }
  }
  const off = runs['/'], on = runs[FLAG];
  const row = { width, touch, off, on };
  try {
    assert.deepEqual(off.errors, []); assert.deepEqual(on.errors, []);
    assert.deepEqual(off.order, ['experience', 'skills', 'education', 'languages', 'interests', 'contact'], 'flag off: original order');
    assert.equal(on.passages, 0, 'no CV passage plays inside the Globe');
    // Both runs sample the continuous Globe film at the same elapsed times (~150-200ms of headless Chrome frame scheduling tolerance).
    const tol = Math.round(height * .25);
    on.ys.forEach((y, i) => assert.ok(Math.abs(y - off.ys[i]) <= tol, `Globe forward stop ${i}: ${y} vs ${off.ys[i]}`));
    on.back.forEach((y, i) => assert.ok(Math.abs(y - off.back[i]) <= tol, `Globe reverse stop ${i}: ${y} vs ${off.back[i]}`));
    row.pass = true;
  } catch (error) { row.pass = false; row.error = String(error.message); report.failures.push(`globe ${width}: ${row.error}`); }
  report.globe.push(row); save('validation', report);
  console.log(JSON.stringify({ globe: width, pass: row.pass, error: row.error, off: { ys: off.ys, back: off.back }, on: { ys: on.ys, back: on.back } }));
}

try {
  await server('after');
  const sizes = quick
    ? [{ width: 1440, height: 900 }, { width: 390, height: 844, touch: true, dsf: 2 }]
    : [{ width: 1440, height: 900 }, { width: 768, height: 900 }, { width: 390, height: 844, touch: true, dsf: 2 }, { width: 320, height: 568, touch: true, dsf: 2 }];
  for (const size of sizes) await viewport(size);
  if (!quick) for (const size of [{ width: 1440, height: 900 }, { width: 390, height: 844, touch: true, dsf: 2 }]) await globe(size);
  save('validation', report);
  console.log(report.failures.length ? 'FAILURES:\n' + report.failures.join('\n') : 'ALL MAGNETIC CV CHECKS PASSED');
  process.exitCode = report.failures.length ? 1 : 0;
} finally { stopServers(); }
