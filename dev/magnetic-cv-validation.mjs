// Validation for Abyssal Snap V3 (default on `/`, fallback off with `/?magneticCV=0`). Private headless Chrome over CDP.
//   node dev/magnetic-cv-validation.mjs            full matrix (1440, 1280, 768, 390, 320 + Stationary Mouse + Globe + Shanghai handoff)
//   node dev/magnetic-cv-validation.mjs --quick    1440 + 390 quick pass
import assert from 'node:assert/strict';
process.env.PHASE2_OUT ||= 'artifacts/magnetic-cv-v3';
const { server, browser, png, save, stats, stopServers } = await import('./phase2-lib.mjs');
const { sleep } = await import('./fable-cdp.mjs');
const quick = process.argv.includes('--quick');
const FLAG = '/';
const FALLBACK_OFF = '/?magneticCV=0';
const SETTLE = 1580; // 1240–1300ms Abyssal Cipher CV passage + headless Chrome frame scheduling margin
const GLOBE_SETTLE = 1660; // 1360ms Shanghai <-> Profile passage + scheduling margin
const report = { viewports: [], stationaryMouse: null, shanghaiHandoff: [], globe: [], failures: [] };

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
    const globeStage = document.querySelector('[data-journey-runway] > div');
    const globeVisible = !!globeStage && !globeStage.hasAttribute('data-globe-muted') && +getComputedStyle(globeStage).opacity > 0.01;
    // Any other CV chapter's words on screen with any ink at all count as overlap.
    const overlap = els.filter(el => !visible.includes(el) && wordsOf(el).some(inView) && +getComputedStyle(el).opacity > .01).map(el => el.id);
    const current = visible[0];
    const g = current ? geometry().find(x => x.id === current.id) : null;
    const atEdge = !g || scrollY <= g.top + 2 || scrollY >= g.end - 2;
    const words = current ? wordsOf(current).filter(inView) : [];
    const mustRead = atEdge ? words : words.filter(w => {
      const r = w.getBoundingClientRect();
      return r.top < innerHeight * .60 || Math.round(r.top + scrollY) < g.top + innerHeight;
    });
    const veil = document.querySelector('[data-magnetic-veil]');
    const veilHidden = !veil || getComputedStyle(veil).display === 'none';
    return {
      y: Math.round(scrollY),
      hash: location.hash,
      visible: visible.map(el => el.id),
      globeVisible,
      overlap,
      inView: words.length,
      unreadable: mustRead.filter(w => !isReadable(w)).map(w => w.querySelector('.ascii-source').textContent),
      passage: !!document.querySelector('[data-cv-depart],[data-cv-arrive],[data-globe-depart],[data-globe-arrive]'),
      staged: els.some(el => el.style.translate || el.style.clipPath || el.querySelector('[data-cv-role]')),
      veilHidden,
      snap: window.__magneticCV?.snapshot?.() ?? null
    };
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
    if (r.target.hasAttribute('data-cv-depart') || r.target.hasAttribute('data-globe-depart')) { passages++; began = performance.now(); }
    else if (began && !document.querySelector('[data-cv-depart],[data-globe-depart]')) { durations.push(Math.round(performance.now() - began)); began = 0; }
  } }).observe(document.querySelector('main'), { subtree: true, attributes: true, attributeFilter: ['data-cv-depart', 'data-globe-depart'] });
  window.frameLog = null;
  window.recordFrames = ms => new Promise(resolve => {
    const d = [];
    let last = 0, decoding = 0, maxHeroOutScale = 1, minBodyOutScale = 1, minHeroInScale = 1;
    let veilActiveFrames = 0, curvedClipSeen = false, depthSilenceFrames = 0, dualReadableFrames = 0;
    const t0 = performance.now();
    const f = t => {
      const from = document.querySelector('[data-cv-depart],[data-globe-depart]');
      const to = document.querySelector('[data-cv-arrive],[data-globe-arrive]');
      if (from && to) {
        if (last) d.push(t - last); last = t;
        decoding = Math.max(decoding, to.querySelectorAll('.ascii-cell').length);
        const veil = document.querySelector('[data-magnetic-veil]');
        if (veil && getComputedStyle(veil).display !== 'none') veilActiveFrames++;
        const poly = getComputedStyle(from).clipPath;
        if (poly.startsWith('polygon(') && poly.split(',').length >= 8) curvedClipSeen = true;

        const outClip = from.style.clipPath === 'inset(50%)';
        const inClip = to.style.clipPath === 'inset(50%)';
        if (outClip && inClip) depthSilenceFrames++;
        if (!outClip && !inClip && from.hasAttribute('data-cv-depart') && to.hasAttribute('data-cv-arrive')) {
          dualReadableFrames++;
        }

        const heroOut = from.querySelector('[data-cv-role="hero"]');
        if (heroOut) {
          const m = new DOMMatrixReadOnly(getComputedStyle(heroOut).transform);
          if (Number.isFinite(m.a)) maxHeroOutScale = Math.max(maxHeroOutScale, m.a);
        }
        const itemOut = from.querySelector('[data-cv-role="item"]');
        if (itemOut) {
          const m = new DOMMatrixReadOnly(getComputedStyle(itemOut).transform);
          if (Number.isFinite(m.a)) minBodyOutScale = Math.min(minBodyOutScale, m.a);
        }
        const heroIn = to.querySelector('[data-cv-role="hero"]');
        if (heroIn && +getComputedStyle(heroIn).opacity > 0.02) {
          const m = new DOMMatrixReadOnly(getComputedStyle(heroIn).transform);
          if (Number.isFinite(m.a)) minHeroInScale = Math.min(minHeroInScale, m.a);
        }
      }
      if (t - t0 > ms) {
        resolve({
          frames: d,
          decoding,
          maxHeroOutScale: +maxHeroOutScale.toFixed(3),
          minBodyOutScale: +minBodyOutScale.toFixed(3),
          minHeroInScale: +minHeroInScale.toFixed(3),
          veilActiveFrames,
          curvedClipSeen,
          depthSilenceFrames,
          dualReadableFrames
        });
      } else {
        requestAnimationFrame(f);
      }
    };
    requestAnimationFrame(f);
  });
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

async function settlePhotoSequence(c) {
  for (let attempt = 0; attempt < 110; attempt++) {
    const playing = await c.evaluate("['revealing','restoring'].includes(document.querySelector('.profile-itinerary')?.dataset.plates)");
    if (!playing) { await sleep(280); return; }
    await sleep(100);
  }
  throw new Error('Profile photographic sequence did not settle');
}

async function traverseProfile(c, dir, touch, width, height) {
  const cityOrder = ['doha', 'paris', 'jakarta', 'moscow', 'singapore', 'pau', 'bordeaux', 'shanghai'];
  const { profileStep, profileStopCount } = (await state(c)).snap;
  assert.ok(profileStopCount >= 2);
  for (let i = profileStep + dir; i >= 0 && i < profileStopCount; i += dir) {
    const checkPin = i <= 1 && i - dir <= 1;
    if (checkPin) {
      const cities = await c.evaluate(`[...document.querySelectorAll('[data-city-id]')].map(row => {
        const title = row.querySelector('.profile-city-name span:last-child').getBoundingClientRect();
        const fig = row.querySelector('.profile-city-frame');
        const plate = fig.getBoundingClientRect();
        const img = row.querySelector('img');
        const natAr = img && img.naturalHeight ? img.naturalWidth / img.naturalHeight : 1;
        const cs = getComputedStyle(fig);
        const dispAr = parseFloat(cs.height) > 0 ? parseFloat(cs.width) / parseFloat(cs.height) : 1;
        return { id: row.dataset.cityId, fits: title.left >= 0 && title.top >= 0 && title.bottom <= innerHeight &&
          title.right < plate.left && plate.top >= 0 && plate.right <= innerWidth + 1 && plate.bottom <= innerHeight + 1 &&
          Math.abs(dispAr - natAr) < 0.05 };
      })`);
      assert.deepEqual(cities.map(c => c.id), cityOrder);
      assert.ok(cities.every(c => c.fits), 'all city names and natural-aspect photo anchors fit before the gesture');
      await c.evaluate(`window.cityAnchor = scrollY; window.cityDrift = 0;
        window.measureCityPin = () => { cityDrift = Math.max(cityDrift, Math.abs(scrollY - cityAnchor)); };
        addEventListener('scroll', measureCityPin)`);
    }
    if (touch) await gesture(c, dir, touch, width, height);
    else await c.wheel(dir * 120, width / 2, height / 2);
    if (checkPin) await settlePhotoSequence(c);
    else await sleep(820);
    const landed = await state(c);
    assert.deepEqual(landed.visible, ['introduction']);
    assert.equal(landed.snap.profileStep, i);
    if (checkPin) {
      assert.equal(await c.evaluate("removeEventListener('scroll', measureCityPin); cityDrift"), 0);
      const phases = await c.evaluate(`[...document.querySelectorAll('[data-city-slot]')].map(el => el.dataset.memoryPhase)`);
      assert.deepEqual(phases, Array(8).fill(i === 1 ? 'photo' : 'empty'));
    }
    await c.evaluate('window.scrollBy(0, 9)');
    await sleep(120);
    assert.equal((await state(c)).y, landed.y, 'the city holds its landing between gestures');
    await c.evaluate('noteReadable()');
  }
}
/** A trackpad flick: one hand stroke followed by a long decaying momentum tail (~1.8s). */
async function trackpad(c, dir, events = 110, start = 52) {
  for (let i = 0; i < events; i++) {
    await c.wheel(dir * Math.max(1, Math.round(start * 0.955 ** i)), 150, 190);
    await sleep(14);
  }
}
const index = (geo, id) => geo.findIndex(g => g.id === id);

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
      // Repeated fast touch strokes during the active 1.2s cut must never queue a second section.
      await fling();
    });
    await exact('languages', -1, () => c.swipe(-height * .65, { x: width / 2, y0: height * .16, steps: 3, ms: 18 }));
  } else {
    // 1. Massive single wheel delta
    await exact('skills', 1, () => c.wheel(100000));
    // 2. Repeated rapid gestures fired DURING active transition (must never queue!)
    await exact('languages', 1, async () => {
      await c.wheel(140);
      await sleep(80);
      await c.wheel(240);
      await sleep(80);
      await c.wheel(320);
      await sleep(80);
      await c.wheel(280);
    });
    // 3. Long flywheel coasting past transition end + coalesced spike + sign bounce
    await exact('interests', -1, async () => {
      await trackpad(c, -1, 90, 180);
      await c.wheel(-480);
      await trackpad(c, -1, 30, 40);
      await c.wheel(80);
    });
    // 4. Reverse massive single wheel delta
    await exact('languages', -1, () => c.wheel(-100000));
  }
  row.stressGestures = 'passed';
}

async function desktopReading(c, width, height) {
  await c.desktop(width, 400);
  try {
    await sleep(450);
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
    await sleep(500);
    await c.wheel(120, 150, 190);
    await sleep(SETTLE);
    assert.deepEqual((await state(c)).visible, ['education'], 'a new gesture at that edge snaps');
  } finally {
    await c.desktop(width, height);
    await sleep(450);
  }
}

async function walk(c, geo, dir, touch, width, height, label, row) {
  const steps = [];
  let s = await state(c);
  const startId = s.visible[0];
  const goal = dir > 0 ? geo.at(-1).id : geo[0].id;
  const done = () => s.visible[0] === goal && (dir < 0 ? s.snap.profileStep === 0 : steps.at(-1)?.stuck);
  for (let i = 0; i < 40 && !done(); i++) {
    const before = s;
    await gesture(c, dir, touch, width, height);
    await sleep(SETTLE);
    if (before.visible[0] === 'introduction') await settlePhotoSequence(c);
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
    const insideProfile = origin.id === 'introduction' && before.snap.profileStep + dir >= 0 &&
      before.snap.profileStep + dir < before.snap.profileStopCount;
    if (geo[index(geo, origin.id) + dir]) assert.equal(moved, canSnap && !insideProfile ? dir : 0, 'only a gesture at a reading edge advances');
    if (moved) {
      const dest = geo[index(geo, s.visible[0])];
      assert.ok(Math.abs(s.y - (dir > 0 ? dest.top : dest.end)) <= 2, 'precise landing');
    }
    assert.equal(s.passage || s.staged, false, 'all mask, role, translation and glyph effects cleaned up at rest');
    assert.equal(s.veilHidden, true, 'ephemeral veil canvas is hidden at rest');
  }
  assert.equal(s.visible[0], goal, `${label}: reached ${goal}`);
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
    assert.ok(Math.abs((await state(c)).y - geo[0].top) <= 2, 'cold fragment lands pixel-perfectly on Profile');

    // 1. Downward through every chapter, recording full 5-phase choreography metrics on Profile -> Experience.
    await c.evaluate('noteReadable()');
    const first = await state(c);
    assert.deepEqual(first.visible, ['introduction']);
    await traverseProfile(c, 1, touch, width, height);
    await c.evaluate('(window.frameLog = recordFrames(1800), 0)');
    await gesture(c, 1, touch, width, height);
    const { frames, ...motion } = await c.evaluate('frameLog');
    row.motion = motion;
    row.passageFrames = stats(frames);
    row.duration = await c.evaluate('durations.at(-1)');
    assert.ok(row.duration >= 1180 && row.duration <= 1650, `CV passage duration ${row.duration}ms`);
    assert.ok(motion.maxHeroOutScale > 1.05, `Phase 1 hero camera push-in (${motion.maxHeroOutScale})`);
    assert.ok(motion.minBodyOutScale < 0.97, `Phase 1 body depth separation (${motion.minBodyOutScale})`);
    assert.ok(motion.curvedClipSeen, 'Phase 2 curved oceanic clip polygon played');
    assert.ok(motion.veilActiveFrames >= 3, 'Abyssal Cipher ASCII presentation canvas active during transition');
    assert.ok(motion.depthSilenceFrames >= 3, `Phase 3 open-ocean Abyssal Current passage observed (${motion.depthSilenceFrames} frames)`);
    assert.equal(motion.dualReadableFrames, 0, 'Phase 2->4 handoff guarantees outgoing and incoming CV text never overlap');
    assert.ok(motion.minHeroInScale < 0.96, `Phase 4 incoming hero depth arrival (${motion.minHeroInScale})`);
    assert.ok(motion.decoding > 0, 'Phase 4 incoming ASCII decryption played');
    assert.deepEqual((await state(c)).visible, ['experience'], 'first passage lands on Experience');
    await c.evaluate('noteReadable()');
    await walk(c, geo, 1, touch, width, height, 'down', row);
    await png(c, `${width}-contact`);

    // 2. Reverse walk upward: Contact -> Interests -> ... -> Profile. Zero re-scrambling on completed text!
    await c.evaluate(`allWords().filter(isReadable).forEach(w => watched.add(w)); mutations = 0`);
    await walk(c, geo, -1, touch, width, height, 'up', row);
    row.walkDurations = await c.evaluate('durations.slice()');
    assert.equal(row.walkDurations.length, 12, 'six forward and six reverse CV passages');
    assert.ok(row.walkDurations.every(ms => ms >= 1180 && ms <= 1650), `walk timing: ${row.walkDurations}`);
    row.upwardMutations = await c.evaluate('mutations');
    assert.equal(row.upwardMutations, 0, 'completed reveals strictly untouched on upward return');
    row.readCoverage = await c.evaluate(`({ total: allWords().length, read: allWords().filter(w => seenReadable.has(w)).length,
      missed: allWords().filter(w => !seenReadable.has(w)).map(w => w.querySelector('.ascii-source').textContent).slice(0, 12) })`);
    assert.equal(row.readCoverage.read, row.readCoverage.total, 'every CV word was on screen and readable at rest');

    // 3. Profile -> Shanghai -> Profile magnetic handoff on EVERY viewport!
    const shanghaiTop = await c.evaluate('window.__magneticCV.snapshot().chapters[0].top');
    const beforeSh = await c.evaluate('passages');
    await gesture(c, -1, touch, width, height);
    await sleep(GLOBE_SETTLE);
    const atSh = await state(c);
    assert.deepEqual(atSh.visible, [], 'at Shanghai, ALL CV chapters are muted');
    assert.equal(atSh.globeVisible, true, 'Shanghai Globe is visible');
    assert.ok(Math.abs(atSh.y - shanghaiTop) <= 2, `Profile -> Shanghai lands exactly on shanghaiTop (${atSh.y} vs ${shanghaiTop})`);
    assert.equal(await c.evaluate('passages') - beforeSh, 1, 'Profile -> Shanghai ran one magnetic passage');
    const shCity = await c.evaluate(`document.querySelector('.globe-caption > div[aria-hidden="false"] .globe-city')?.textContent?.trim()`);
    assert.equal(shCity, 'Shanghai', 'returning upward from Profile restores completed Shanghai (never Doha)');

    // One deliberate downward gesture from Shanghai -> Profile (must never chain into Experience!)
    const beforeProf = await c.evaluate('passages');
    if (touch) {
      await c.swipe(height * .55, { x: width / 2, y0: height * .80, steps: 5, ms: 40 });
    } else {
      await trackpad(c, 1, 80, 65);
    }
    await sleep(GLOBE_SETTLE);
    const backProf = await state(c);
    assert.deepEqual(backProf.visible, ['introduction'], 'Shanghai -> Profile lands strictly on Profile (never skips to Experience)');
    assert.ok(Math.abs(backProf.y - geo[0].top) <= 2, 'Shanghai -> Profile lands at Profile top');
    assert.equal(await c.evaluate('passages') - beforeProf, 1, 'Shanghai -> Profile consumed all momentum in 1 passage');
    row.shanghaiRoundtripDuration = await c.evaluate('durations.slice(-2)');

    // 4. Aggressive wheel, trackpad momentum, and repeated rapid gesture stress tests
    await stressGestures(c, geo, { width, height, touch }, row);

    if (width === 1440 && !touch) {
      await desktopReading(c, width, height);
      row.longDesktopReading = true;
    }

    // 5. Direct navigation: hash, history, gauge, header link, focus.
    const at = async id => { const s = await state(c); return { id: s.visible[0], y: s.y, top: geo[index(geo, id)].top, overlap: s.overlap }; };
    const nav = {};
    await c.evaluate(`location.hash = '#languages'`); await sleep(500);
    nav.hash = await at('languages');
    await c.evaluate(`location.hash = '#experience'`); await sleep(500);
    await c.evaluate(`history.back()`); await sleep(650);
    nav.back = await at('languages');
    await c.evaluate(`document.querySelector('.depth-gauge a[href="#skills"]').click()`); await sleep(550);
    nav.gauge = await at('skills');
    await c.evaluate(`document.querySelector('#contact a[href*="linkedin"]').focus()`); await sleep(450);
    nav.focus = await at('contact');
    await c.evaluate(`document.querySelector('.fixed-cv-link[href="#contact"]').click()`); await sleep(550);
    nav.headerContact = await at('contact');
    for (const [name, n] of Object.entries(nav)) {
      const want = { hash: 'languages', back: 'languages', headerContact: 'contact', gauge: 'skills', focus: 'contact' }[name];
      assert.equal(n.id, want, `navigation ${name}`);
      assert.deepEqual(n.overlap, [], `navigation ${name} overlap`);
      if (name !== 'focus') assert.ok(Math.abs(n.y - n.top) <= 2, `navigation ${name} lands on chapter top ${JSON.stringify(n)}`);
    }
    row.navigation = nav;
    await gesture(c, -1, touch, width, height); await sleep(SETTLE);
    assert.equal((await state(c)).visible[0], geo[index(geo, 'contact') - 1].id, 'gesture after direct link');

    // 6. Keyboard navigation: one keypress = one chapter, held repeat never chains.
    const key = (type, autoRepeat = false) => c.send('Input.dispatchKeyEvent', {
      type, key: 'PageDown', code: 'PageDown', windowsVirtualKeyCode: 34, autoRepeat
    });
    await c.evaluate(`jumpTo(${geo[0].end})`);
    await sleep(300);
    await traverseProfile(c, 1, touch, width, height);
    await key('keyDown');
    await sleep(SETTLE);
    await key('keyDown', true);
    await key('keyUp');
    await sleep(400);
    assert.deepEqual((await state(c)).visible, ['experience'], 'one keypress moves one chapter');
    assert.equal(await c.evaluate('document.activeElement.id'), 'experience', 'keyboard focus follows the snap');

    // 7. Reduced motion: one gesture = one instant step with zero passage animation.
    await c.send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] });
    await sleep(450);
    const reduced = await c.evaluate('geometry()');
    const exp = reduced[index(reduced, 'experience')];
    await c.evaluate(`jumpTo(${exp.end})`); await sleep(350);
    const p0 = await c.evaluate('passages');
    await gesture(c, 1, touch, width, height); await sleep(250);
    const r1 = await state(c);
    await gesture(c, -1, touch, width, height); await sleep(250);
    const r2 = await state(c);
    row.reduced = { down: r1.visible, up: r2.visible, passages: await c.evaluate('passages') - p0 };
    assert.equal(r1.visible[0], 'education', 'reduced motion: one gesture, one chapter');
    assert.equal(r2.visible[0], 'experience', 'reduced motion: and back');
    assert.equal(row.reduced.passages, 0, 'reduced motion never runs cinematic passage');
    assert.deepEqual(r1.unreadable, []);
    await c.send('Emulation.setEmulatedMedia', { features: [] });

    row.errors = c.errors;
    assert.deepEqual(c.errors, [], 'no page errors');
    row.overflowX = await c.evaluate('document.documentElement.scrollWidth > innerWidth');
    assert.equal(row.overflowX, false, 'zero horizontal overflow');
    row.pass = true;
  } catch (error) {
    row.pass = false; row.error = String(error.message || error);
    report.failures.push(`${width}x${height}: ${row.error}`);
    await png(c, `${width}-failure`).catch(() => {});
  } finally {
    report.viewports.push(row); save('validation', report);
    console.log(JSON.stringify({
      width, height, pass: row.pass, error: row.error,
      duration: row.duration,
      shanghaiDur: row.shanghaiRoundtripDuration,
      frames: row.passageFrames,
      motion: row.motion,
      upwardMutations: row.upwardMutations,
      overflowX: row.overflowX
    }));
    await c.close();
  }
}

/** Full real Globe Doha -> Shanghai playback -> hold at Shanghai -> one gesture -> Profile -> one gesture up -> Shanghai -> one gesture up -> Globe reverse! */
async function fullShanghaiHandoff({ width, height, touch, dsf }) {
  const c = await browser({ width, height, touch, dsf, path: FLAG });
  const row = { width, height, touch };
  try {
    const geo = await c.evaluate(setup);
    const journeyTop = await c.evaluate(`Math.round(document.querySelector('#journey').getBoundingClientRect().top + scrollY)`);
    const shanghaiTop = await c.evaluate('window.__magneticCV.snapshot().chapters[0].top');

    // Step 1: Enter Doha on the Globe runway
    await c.evaluate(`jumpTo(${journeyTop})`);
    await sleep(900);
    // Step 2: Play Globe Doha -> Shanghai (single deliberate downward gesture)
    await gesture(c, 1, touch, width, height);
    // Wait until Globe film finishes at Shanghai (polls playing flag up to 16s)
    for (let i = 0; i < 65; i++) {
      await sleep(250);
      const y = await c.evaluate('Math.round(scrollY)');
      const playing = await c.evaluate(`document.documentElement.hasAttribute('data-globe-scroll')`);
      if (Math.abs(y - shanghaiTop) <= 4 && !playing) break;
    }
    await sleep(900); // Settle window at completed Shanghai
    const atShanghai = await state(c);
    row.atShanghai = { y: atShanghai.y, shanghaiTop, visible: atShanghai.visible, globeVisible: atShanghai.globeVisible };
    assert.ok(Math.abs(atShanghai.y - shanghaiTop) <= 4, `Globe film completes at Shanghai (${atShanghai.y} vs ${shanghaiTop})`);
    assert.deepEqual(atShanghai.visible, [], 'Profile text never appears prematurely at Shanghai');
    assert.equal(atShanghai.globeVisible, true);

    // Step 3: One deliberate downward gesture from Shanghai -> Profile (with first-visit ASCII decode!)
    await gesture(c, 1, touch, width, height);
    await sleep(GLOBE_SETTLE);
    const atProfile = await state(c);
    row.atProfile = { y: atProfile.y, top: geo[0].top, visible: atProfile.visible, unreadable: atProfile.unreadable.length };
    assert.deepEqual(atProfile.visible, ['introduction'], 'Shanghai -> Profile lands cleanly on Profile');
    assert.ok(Math.abs(atProfile.y - geo[0].top) <= 2);
    assert.deepEqual(atProfile.unreadable, [], 'Profile fully decoded and readable after Shanghai handoff');

    // Step 4: One upward gesture from Profile -> restores completed Shanghai (NOT Doha!)
    await gesture(c, -1, touch, width, height);
    await sleep(GLOBE_SETTLE);
    const restoredSh = await state(c);
    const activeCity = await c.evaluate(`document.querySelector('.globe-caption > div[aria-hidden="false"] .globe-city')?.textContent?.trim()`);
    row.restoredShanghai = { y: restoredSh.y, activeCity, visible: restoredSh.visible };
    assert.ok(Math.abs(restoredSh.y - shanghaiTop) <= 2, 'Profile -> Shanghai lands back at Shanghai');
    assert.equal(activeCity, 'Shanghai', 'must not restart Globe from Doha');
    assert.deepEqual(restoredSh.visible, []);

    // Step 5: A NEW upward gesture at Shanghai hands back to Globe reverse playback!
    await sleep(300);
    await gesture(c, -1, touch, width, height);
    await sleep(1600);
    const reversingY = await c.evaluate('Math.round(scrollY)');
    row.globeReverseY = reversingY;
    assert.ok(reversingY < shanghaiTop - 200, `new upward gesture at Shanghai reverses Globe cleanly (${reversingY} < ${shanghaiTop})`);
    assert.deepEqual(c.errors, []);
    row.pass = true;
  } catch (error) {
    row.pass = false; row.error = String(error.message || error);
    report.failures.push(`shanghaiHandoff ${width}: ${row.error}`);
  } finally {
    report.shanghaiHandoff.push(row); save('validation', report);
    console.log(JSON.stringify({ shanghaiHandoff: width, pass: row.pass, error: row.error, atShanghai: row.atShanghai, atProfile: row.atProfile, restoredShanghai: row.restoredShanghai, globeReverseY: row.globeReverseY }));
    await c.close();
  }
}

/** The Globe's own controllers must behave identically on default `/` (magnetic CV on) and `/?magneticCV=0` (fallback off). */
async function globeParity({ width, height, touch, dsf }) {
  const runs = {};
  for (const path of [FALLBACK_OFF, FLAG]) {
    const c = await browser({ width, height, touch, dsf, path });
    try {
      const journey = await c.evaluate(`Math.round(document.querySelector('#journey').getBoundingClientRect().top + scrollY)`);
      const ys = [];
      await c.evaluate(`scrollTo({ top: ${journey - Math.round(height * .2)}, behavior: 'instant' })`);
      await sleep(900);
      for (let i = 0; i < 4; i++) { await gesture(c, 1, touch, width, height); await sleep(2600); ys.push(await c.evaluate('Math.round(scrollY)')); }
      runs[path] = { ys, errors: c.errors };
      if (path === FALLBACK_OFF) {
        runs[path].order = await c.evaluate(`[...document.querySelectorAll('.cv-arch > section')].map(s => s.id)`);
        runs[path].hasMagneticClass = await c.evaluate(`!!document.querySelector('.terminal-portfolio.magnetic-cv')`);
      }
    } finally { await c.close(); }
  }
  const off = runs[FALLBACK_OFF], on = runs[FLAG];
  const row = { width, touch, off, on };
  try {
    assert.deepEqual(off.errors, []); assert.deepEqual(on.errors, []);
    assert.equal(off.hasMagneticClass, false, '?magneticCV=0 disables magnetic CV');
    assert.deepEqual(off.order, ['experience', 'skills', 'education', 'languages', 'interests', 'contact'], '?magneticCV=0 keeps original fallback order');
    const tol = Math.round(height * .28);
    // First 2 forward stops cover Globe Doha -> Shanghai playback parity
    for (let i = 0; i < 2; i++) {
      assert.ok(Math.abs(on.ys[i] - off.ys[i]) <= tol, `Globe forward stop ${i}: ${on.ys[i]} vs ${off.ys[i]}`);
    }
    row.pass = true;
  } catch (error) { row.pass = false; row.error = String(error.message); report.failures.push(`globe ${width}: ${row.error}`); }
  report.globe.push(row); save('validation', report);
  console.log(JSON.stringify({ globeParity: width, pass: row.pass, error: row.error, off: off.ys, on: on.ys }));
}

/** Mandatory stationary-mouse zero-click test: mouse placed once at center, NEVER moved or clicked. */
async function stationaryMouseTest() {
  const width = 1440, height = 900;
  const cx = width / 2, cy = height / 2;
  const c = await browser({ width, height, path: FLAG + '#introduction' });
  const row = { width, height, discreteForward: [], discreteReverse: [], smoothWheel: [], trackpadAfterTail: [] };
  try {
    await c.evaluate(setup);
    // Position mouse ONCE at viewport center; monitor that ZERO mousemove/click occur afterward.
    await c.send('Input.dispatchMouseEvent', { type: 'mouseMoved', x: cx, y: cy });
    await sleep(200);
    await c.evaluate(`(() => {
      window.__pointerMoves = 0; window.__clicks = 0; window.__focusIns = 0;
      window.addEventListener('pointermove', () => window.__pointerMoves++, { passive: true });
      window.addEventListener('mousemove', () => window.__pointerMoves++, { passive: true });
      window.addEventListener('click', () => window.__clicks++, { passive: true });
      document.addEventListener('focusin', () => window.__focusIns++, { passive: true });
    })()`);

    // 1. Discrete stationary wheel: Profile -> Contact -> Shanghai (zero mouse move, zero clicks, zero focus)
    const expectedForward = ['experience', 'education', 'skills', 'languages', 'interests', 'contact'];
    await traverseProfile(c, 1, false, width, height);
    for (const want of expectedForward) {
      await c.wheel(120, cx, cy);
      await sleep(SETTLE);
      const s = await state(c);
      row.discreteForward.push({ want, got: s.visible[0], st: s.snap?.gestureState });
      assert.deepEqual(s.visible, [want], `stationary forward wheel must land on ${want}`);
      assert.equal(s.snap?.gestureState, 'idle', `state re-arms to idle after ${want}`);
    }
    const expectedReverse = ['interests', 'languages', 'skills', 'education', 'experience', 'introduction', 'journey'];
    for (const want of expectedReverse) {
      if (want === 'journey') await traverseProfile(c, -1, false, width, height);
      await c.wheel(-120, cx, cy);
      await sleep(want === 'journey' ? GLOBE_SETTLE : SETTLE);
      const s = await state(c);
      const got = want === 'journey' ? (s.visible.length === 0 && s.globeVisible ? 'journey' : s.visible[0]) : s.visible[0];
      row.discreteReverse.push({ want, got, st: s.snap?.gestureState });
      assert.equal(got, want, `stationary reverse wheel must land on ${want}`);
      assert.equal(s.snap?.gestureState, 'idle', `state re-arms to idle after reverse to ${want}`);
    }

    // 2. Real Chromium compositor smooth-wheel (synthesizeScrollGesture) Shanghai -> Profile -> Experience
    for (const want of ['introduction', 'experience']) {
      if (want === 'experience') await traverseProfile(c, 1, false, width, height);
      await c.send('Input.synthesizeScrollGesture', {
        x: cx, y: cy, yDistance: -120, gestureSourceType: 'mouse', speed: 850, preventFling: false
      });
      await sleep(want === 'introduction' ? GLOBE_SETTLE : SETTLE);
      const s = await state(c);
      row.smoothWheel.push({ want, got: s.visible[0], st: s.snap?.gestureState });
      assert.deepEqual(s.visible, [want], `stationary compositor smooth-wheel must advance to ${want}`);
    }

    // 3. Real trackpad coalesced gentle stroke [13,11,10..1] (formerly wiped by isDecayingCrumb!)
    for (const dy of [13, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1]) {
      await c.wheel(dy, cx, cy);
      await sleep(16);
    }
    await sleep(SETTLE);
    const landedEdu = await state(c);
    assert.deepEqual(landedEdu.visible, ['education'], 'coalesced gentle trackpad stroke must advance cleanly to education');

    // 4. Flat-start gentle trackpad stroke [8,8,7,6,5,4,3] right after landing
    for (const dy of [8, 8, 7, 6, 5, 4, 3]) {
      await c.wheel(dy, cx, cy);
      await sleep(16);
    }
    await sleep(SETTLE);
    const landedSkills = await state(c);
    assert.deepEqual(landedSkills.visible, ['skills'], 'flat-start gentle trackpad stroke must advance cleanly to skills');

    // 5. Long trackpad momentum tail outlasting transition down to 1px + short 60ms pause (still in draining!) + fresh trackpad ramp
    for (let i = 0; i < 88; i++) {
      const dy = i < 4 ? Math.round(28 * ((i + 1) / 4)) : Math.max(1, Math.round(28 * 0.92 ** (i - 3)));
      await c.wheel(dy, cx, cy);
      await sleep(16);
    }
    const afterTail = await state(c);
    assert.deepEqual(afterTail.visible, ['languages'], 'long trackpad tail advances strictly 1 section to languages');
    await sleep(60); // intentionally < 200ms while still draining on 1px tail!
    for (const dy of [6, 16, 26, 34, 28, 18, 10, 5, 2]) {
      await c.wheel(dy, cx, cy);
      await sleep(16);
    }
    await sleep(SETTLE);
    const landedInterests = await state(c);
    row.trackpadAfterTail.push({
      coalesced: landedEdu.visible[0],
      flatStart: landedSkills.visible[0],
      afterTail: afterTail.visible[0],
      freshRampOnTail: landedInterests.visible[0]
    });
    assert.deepEqual(landedInterests.visible, ['interests'], 'fresh trackpad ramp 60ms after 1px tail unlocks draining cleanly to interests');

    const moved = await c.evaluate('window.__pointerMoves');
    const clicks = await c.evaluate('window.__clicks');
    const focusIns = await c.evaluate('window.__focusIns');
    assert.equal(moved, 0, 'zero pointer/mouse movement during entire stationary-mouse test');
    assert.equal(clicks, 0, 'zero clicks during entire stationary-mouse test');
    assert.equal(focusIns, 0, 'zero focus changes during entire stationary-mouse test');
    assert.deepEqual(c.errors, []);
    row.pass = true;
  } catch (error) {
    row.pass = false;
    row.error = String(error.message || error);
    report.failures.push(`stationaryMouse: ${row.error}`);
  } finally {
    report.stationaryMouse = row;
    save('validation', report);
    console.log(JSON.stringify({ stationaryMouse: row.pass, error: row.error, smoothWheel: row.smoothWheel, trackpadAfterTail: row.trackpadAfterTail }));
    await c.close();
  }
}

try {
  await server('after');
  await stationaryMouseTest();
  const sizes = quick
    ? [{ width: 1440, height: 900 }, { width: 390, height: 844, touch: true, dsf: 2 }]
    : [
        { width: 1440, height: 900 },
        { width: 1280, height: 800 },
        { width: 768, height: 900 },
        { width: 390, height: 844, touch: true, dsf: 2 },
        { width: 320, height: 568, touch: true, dsf: 2 }
      ];
  for (const size of sizes) await viewport(size);
  if (!quick) {
    for (const size of [{ width: 1440, height: 900 }, { width: 390, height: 844, touch: true, dsf: 2 }]) {
      await fullShanghaiHandoff(size);
      await globeParity(size);
    }
  }
  save('validation', report);
  console.log(report.failures.length ? 'FAILURES:\n' + report.failures.join('\n') : 'ALL ABYSSAL SNAP V3 CHECKS PASSED');
  process.exitCode = report.failures.length ? 1 : 0;
} finally { stopServers(); }
