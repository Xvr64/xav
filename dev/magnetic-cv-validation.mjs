// Validation for the ?magneticCV=1 preview (magneticCV.ts). Private headless Chrome over CDP.
//   node dev/magnetic-cv-validation.mjs            all checks
//   node dev/magnetic-cv-validation.mjs --quick    one desktop + one mobile viewport, no Globe comparison
import assert from 'node:assert/strict';
process.env.PHASE2_OUT ||= 'artifacts/magnetic-cv';
const { server, browser, png, save, stats, stopServers } = await import('./phase2-lib.mjs');
const { sleep } = await import('./fable-cdp.mjs');
const quick = process.argv.includes('--quick');
const FLAG = '/?magneticCV=1';
const SETTLE = 1350; // one passage (960ms) plus decoding and a frame of margin
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
      passage: !!document.querySelector('[data-cv-depart],[data-cv-arrive]') };
  };
  window.geometry = () => chapterEls().map(el => {
    const r = el.getBoundingClientRect(), top = Math.round(r.top + scrollY), bottom = r.bottom + scrollY;
    const pad = parseFloat(getComputedStyle(el).paddingBottom) || 0;
    const rawEnd = Math.round(Math.min(bottom, bottom - pad + 16) - innerHeight);
    return { id: el.id, top, end: rawEnd - top < 24 ? top : rawEnd, h: Math.round(r.height) };
  });
  window.seenReadable = new Set();
  window.noteReadable = () => { const v = chapterEls().find(el => !el.hasAttribute('data-cv-muted')); if (v) wordsOf(v).filter(inView).filter(isReadable).forEach(w => seenReadable.add(w)); };
  window.allWords = () => chapterEls().flatMap(wordsOf);
  window.watched = new Set(); window.mutations = 0;
  new MutationObserver(rs => { for (const r of rs) { const el = r.target instanceof Element ? r.target : r.target.parentElement; if (el?.closest('.ascii-visual') && watched.has(el?.closest('.ascii-word'))) mutations++; } })
    .observe(document.querySelector('main'), { subtree: true, childList: true, characterData: true, attributes: true, attributeFilter: ['style', 'class'] });
  window.passages = 0;
  new MutationObserver(rs => { for (const r of rs) if (r.attributeName === 'data-cv-depart' && r.target.hasAttribute('data-cv-depart')) passages++; })
    .observe(document.querySelector('main'), { subtree: true, attributes: true, attributeFilter: ['data-cv-depart'] });
  window.frameLog = null;
  window.recordFrames = ms => new Promise(resolve => { const d = []; let last = 0, drift = 0, decoding = 0, depart = false, arrive = false; const t0 = performance.now();
    const f = t => {
      if (last) d.push(t - last); last = t;
      if (document.querySelector('[data-cv-depart]')) { depart = true; drift = Math.max(drift, document.querySelectorAll('[data-cv-depart] [data-drift]').length); }
      if (document.querySelector('[data-cv-arrive]')) { arrive = true; decoding = Math.max(decoding, document.querySelectorAll('[data-cv-arrive] .ascii-cell').length); }
      if (t - t0 > ms) resolve({ frames: d, midDepart: { depart, drift }, midArrive: { arrive, decoding } });
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
    await c.wheel(dir * Math.max(1, Math.round(start * 0.94 ** i)));
    await sleep(14);
  }
}
const index = (geo, id) => geo.findIndex(g => g.id === id);

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
    assert.equal(s.passage, false, `${label}: passage cleaned up`);
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
  const c = await browser({ width, height, touch, dsf, path: FLAG });
  const row = { width, height, touch };
  try {
    const geo = await c.evaluate(setup);
    row.geometry = geo;
    row.longChapters = geo.filter(g => g.end > g.top).map(g => g.id);
    assert.equal(await c.evaluate(`!!document.querySelector('.terminal-portfolio.magnetic-cv')`), true, 'flag on');

    // 1. Downward through every chapter, one gesture at a time, capturing the first passage mid-flight.
    await c.evaluate(`jumpTo(${geo[0].top})`);
    await sleep(500);
    await c.evaluate('noteReadable()');
    const first = await state(c);
    assert.deepEqual(first.visible, ['introduction']);
    const isLongIntro = row.longChapters.includes('introduction');
    if (!isLongIntro) {
      await c.evaluate('(window.frameLog = recordFrames(1150), 0)');
      const t0 = Date.now();
      await gesture(c, 1, touch, width, height);
      await sleep(Math.max(20, 220 - (Date.now() - t0)));
      await png(c, `${width}-passage-depart`);
      await sleep(Math.max(20, 680 - (Date.now() - t0)));
      await png(c, `${width}-passage-arrive`);
      await sleep(Math.max(100, SETTLE - (Date.now() - t0)));
      const rec = await c.evaluate('frameLog');
      row.midDepart = rec.midDepart;
      row.midArrive = rec.midArrive;
      row.passageFrames = stats(rec.frames);
      const s = await state(c);
      assert.deepEqual(s.visible, ['experience'], 'first passage lands on Experience');
      assert.ok(row.midDepart.depart && row.midDepart.drift > 0, 'the departing chapter lifts into the current');
      assert.ok(row.midArrive.arrive && row.midArrive.decoding > 0, 'the arriving chapter decodes during the passage');
      await c.evaluate('noteReadable()');
    }
    await walk(c, geo, 1, touch, width, height, 'down', row);
    await png(c, `${width}-contact`);

    // 2. Back up: completed ASCII reveals are never replayed or re-scrambled.
    await c.evaluate(`allWords().filter(isReadable).forEach(w => watched.add(w)); mutations = 0`);
    await walk(c, geo, -1, touch, width, height, 'up', row);
    row.upwardMutations = await c.evaluate('mutations');
    assert.equal(row.upwardMutations, 0, 'completed reveals untouched on the way up');
    row.readCoverage = await c.evaluate(`({ total: allWords().length, read: allWords().filter(w => seenReadable.has(w)).length,
      missed: allWords().filter(w => !seenReadable.has(w)).map(w => w.querySelector('.ascii-source').textContent).slice(0, 12) })`);
    assert.equal(row.readCoverage.read, row.readCoverage.total, 'every CV word was on screen and readable at a resting point');

    // 3. Trackpad inertia: one flick and its momentum tail make exactly one passage.
    if (!touch) {
      const exp = geo[index(geo, 'experience')];
      await c.evaluate(`jumpTo(${exp.top})`); await sleep(400);
      const flicks = [];
      for (const dir of [1, 1, -1, -1]) {
        const before = await state(c);
        const p0 = await c.evaluate('passages');
        await trackpad(c, dir);
        await sleep(SETTLE);
        const after = await state(c);
        const moved = index(geo, after.visible[0]) - index(geo, before.visible[0]);
        flicks.push({ dir, from: before.visible[0], to: after.visible[0], y: after.y, passages: await c.evaluate('passages') - p0 });
        assert.ok(flicks.at(-1).passages <= 1 && Math.abs(moved) <= 1, `trackpad flick ${JSON.stringify(flicks.at(-1))}`);
        assert.deepEqual(after.overlap, []);
      }
      row.trackpad = flicks;
      assert.ok(flicks.some(f => f.passages === 1), 'a trackpad flick can start a passage');
    } else {
      // A fast flick (the platform may add fling momentum): still at most one chapter.
      const exp = geo[index(geo, 'experience')];
      await c.evaluate(`jumpTo(${exp.top})`); await sleep(400);
      const before = await state(c);
      const span = Math.min(420, Math.round(height * .62));
      await c.swipe(span, { x: width / 2, y0: Math.round(height * .82), steps: 4, ms: 50 });
      await sleep(SETTLE + 400);
      const after = await state(c);
      row.fling = { from: before.visible[0], to: after.visible[0], y: after.y };
      assert.ok(index(geo, after.visible[0]) - index(geo, before.visible[0]) <= 1, 'a fling moves at most one chapter');
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
    assert.notEqual(row.carriedIn.visible[0], 'education', 'carried-in momentum never skips chapters');
    assert.ok(['introduction'].includes(row.carriedIn.visible[0]) || row.carriedIn.y < geo[0].top, `carried-in momentum settles on the Profile ${JSON.stringify(row.carriedIn)}`);
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

    // 6. Reduced motion: the same one-gesture steps, landing instantly with no passage.
    await c.send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] });
    await sleep(500);
    const reduced = await c.evaluate('setup = 1; geometry()');
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
    console.log(JSON.stringify({ width, height, pass: row.pass, error: row.error, longChapters: row.longChapters, coverage: row.readCoverage, trackpad: row.trackpad, fling: row.fling, carriedIn: row.carriedIn && { visible: row.carriedIn.visible, y: row.carriedIn.y } }));
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
    : [{ width: 1440, height: 900 }, { width: 1280, height: 600 }, { width: 390, height: 844, touch: true, dsf: 2 }, { width: 320, height: 568, touch: true, dsf: 2 }];
  for (const size of sizes) await viewport(size);
  if (!quick) for (const size of [{ width: 1440, height: 900 }, { width: 390, height: 844, touch: true, dsf: 2 }]) await globe(size);
  save('validation', report);
  console.log(report.failures.length ? 'FAILURES:\n' + report.failures.join('\n') : 'ALL MAGNETIC CV CHECKS PASSED');
  process.exitCode = report.failures.length ? 1 : 0;
} finally { stopServers(); }
