// Live CDP browser capture & inspection harness for ABYSSAL CIPHER transitions.
// Records real 60fps Chrome screencast frames across all required forward & reverse transitions,
// computes real timing + frame pacing metrics, and builds 3x3 filmstrip sheets + animated WebPs via Python PIL.
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';

process.env.PHASE2_OUT ||= 'artifacts/abyssal-cipher';
const { server, browser, save, stats, stopServers, out } = await import('./phase2-lib.mjs');
const { sleep } = await import('./fable-cdp.mjs');

const FRAME_MARKS_MS = [0, 160, 320, 480, 640, 800, 960, 1120, 1340];

async function captureTransition(c, name, trigger, settleMs = 1580, isGlobe = false) {
  const frames = [];
  let recording = true;
  const onFrame = ({ data, metadata, sessionId }) => {
    if (!recording) return;
    c.send('Page.screencastFrameAck', { sessionId }).catch(() => {});
    frames.push({ ts: metadata.timestamp * 1000, jpeg: Buffer.from(data, 'base64') });
  };

  // Instrument live rAF pacing, duration & phase visibility during this single transition
  await c.evaluate(`(() => {
    window.__acMetrics = { intervals: [], began: 0, ended: 0, depthSilenceFrames: 0, dualReadableFrames: 0, veilActiveFrames: 0, activeFrames: 0 };
    let last = 0;
    let live = false;
    window.__acStop = false;
    const step = (now) => {
      if (window.__acStop) return;
      const from = document.querySelector('[data-cv-depart],[data-globe-depart]');
      const to = document.querySelector('[data-cv-arrive],[data-globe-arrive]');
      if (from && to) {
        if (!live) { live = true; window.__acMetrics.began = now; last = now; }
        else { window.__acMetrics.intervals.push(now - last); last = now; }
        window.__acMetrics.activeFrames++;
        const veil = document.querySelector('[data-magnetic-veil]');
        if (veil && getComputedStyle(veil).display !== 'none') window.__acMetrics.veilActiveFrames++;
        const outClip = from.style.clipPath === 'inset(50%)';
        const inClip = to.style.clipPath === 'inset(50%)';
        if (outClip && inClip) window.__acMetrics.depthSilenceFrames++;
        if (!outClip && !inClip) window.__acMetrics.dualReadableFrames++;
      } else if (live) {
        live = false;
        window.__acMetrics.ended = now;
      }
      requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  })()`);

  c.on('Page.screencastFrame', onFrame);
  await c.send('Page.startScreencast', { format: 'jpeg', quality: 88, everyNthFrame: 1 });
  await sleep(160);
  const triggerAt = performance.now();
  await trigger();
  await sleep(settleMs);
  recording = false;
  await c.send('Page.stopScreencast');
  await c.evaluate('window.__acStop = true');
  const metrics = await c.evaluate('window.__acMetrics');

  const dir = join(out, 'frames', name);
  rmSync(dir, { recursive: true, force: true });
  mkdirSync(dir, { recursive: true });

  // Align frame timestamps relative to first frame just before trigger (~120ms pre-roll)
  if (!frames.length) throw new Error(`No screencast frames captured for ${name}`);
  const t0 = frames[0].ts + 120;
  const manifest = [];
  for (let i = 0; i < frames.length; i++) {
    const relMs = Math.round(frames[i].ts - t0);
    const fname = `f_${String(i).padStart(4, '0')}.jpg`;
    writeFileSync(join(dir, fname), frames[i].jpeg);
    manifest.push({ file: fname, ms: relMs });
  }
  writeFileSync(join(dir, 'manifest.json'), JSON.stringify({ name, marks: FRAME_MARKS_MS, frames: manifest }, null, 2));

  const durationMs = metrics.ended && metrics.began ? Math.round(metrics.ended - metrics.began) : 0;
  const pacing = stats(metrics.intervals);
  const rest = await c.evaluate(`(() => {
    const els = [...document.querySelectorAll('#introduction, .cv-arch > section')];
    const visible = els.filter(el => !el.hasAttribute('data-cv-muted')).map(el => el.id);
    const globe = document.querySelector('[data-journey-runway] > div');
    const globeVisible = !!globe && !globe.hasAttribute('data-globe-muted');
    const city = document.querySelector('.globe-caption > div[aria-hidden="false"] .globe-city')?.textContent?.trim() ?? null;
    const veil = document.querySelector('[data-magnetic-veil]');
    const veilHidden = !veil || getComputedStyle(veil).display === 'none';
    const staged = els.some(el => el.style.translate || el.style.clipPath || el.querySelector('[data-cv-role]'));
    const cur = els.find(el => !el.hasAttribute('data-cv-muted'));
    const unread = cur ? [...cur.querySelectorAll('.ascii-word')].filter(w => {
      const r = w.getBoundingClientRect();
      if (r.bottom <= 1 || r.top >= innerHeight - 1) return false;
      const v = w.querySelector('.ascii-visual');
      return v.textContent !== w.querySelector('.ascii-source').textContent || v.style.visibility === 'hidden' || v.children.length > 0;
    }).length : 0;
    return { visible, globeVisible, city, veilHidden, staged, unread, y: Math.round(scrollY), snap: window.__magneticCV?.snapshot?.() ?? null };
  })()`);

  console.log(JSON.stringify({
    name,
    capturedFrames: frames.length,
    durationMs,
    activeFrames: metrics.activeFrames,
    depthSilenceFrames: metrics.depthSilenceFrames,
    dualReadableFrames: metrics.dualReadableFrames,
    veilActiveFrames: metrics.veilActiveFrames,
    pacing,
    rest: { visible: rest.visible, globeVisible: rest.globeVisible, city: rest.city, veilHidden: rest.veilHidden, staged: rest.staged, unread: rest.unread }
  }));

  return { name, capturedFrames: frames.length, durationMs, metrics: { ...metrics, intervals: undefined }, pacing, rest, isGlobe, triggerWallMs: Math.round(performance.now() - triggerAt) };
}

function buildVisuals(names) {
  const py = `
import json, os, sys
from PIL import Image, ImageDraw

out_dir = sys.argv[1]
names = sys.argv[2:]

for name in names:
    fdir = os.path.join(out_dir, 'frames', name)
    with open(os.path.join(fdir, 'manifest.json'), 'r') as f:
        data = json.load(f)
    frames = data['frames']
    marks = data['marks']
    if not frames:
        continue

    # 1. Build 3x3 high-res filmstrip sheet at exact timestamp marks
    picks = []
    for m in marks:
        best = min(frames, key=lambda x: abs(x['ms'] - m))
        picks.append((m, best))

    sample = Image.open(os.path.join(fdir, picks[0][1]['file']))
    tw = 640
    th = int(sample.height * tw / sample.width)
    pad = 8
    header = 28
    sheet = Image.new('RGB', (tw * 3 + pad * 4, (th + header) * 3 + pad * 4), (10, 14, 24))
    draw = ImageDraw.Draw(sheet)

    for idx, (target_ms, fr) in enumerate(picks[:9]):
        row, col = divmod(idx, 3)
        im = Image.open(os.path.join(fdir, fr['file'])).resize((tw, th), Image.Resampling.LANCZOS)
        x = pad + col * (tw + pad)
        y = pad + row * (th + header + pad)
        draw.rectangle([x, y, x + tw, y + header], fill=(16, 24, 40))
        draw.text((x + 10, y + 7), f"{name}  |  target {target_ms}ms  (actual {fr['ms']}ms)", fill=(210, 226, 245))
        sheet.paste(im, (x, y + header))

    sheet.save(os.path.join(out_dir, f"sheet-{name}.jpg"), quality=90)

    # 2. Build smooth animated WebP playback (scaled cleanly to 960px wide)
    anim = []
    durations = []
    last_ms = frames[0]['ms']
    for idx, fr in enumerate(frames):
        if idx > 0 and fr['ms'] - last_ms < 24:
            continue
        im = Image.open(os.path.join(fdir, fr['file']))
        aw = min(960, im.width)
        ah = int(im.height * aw / im.width)
        anim.append(im.resize((aw, ah), Image.Resampling.LANCZOS))
        dt = max(25, min(140, fr['ms'] - last_ms)) if idx > 0 else 45
        durations.append(dt)
        last_ms = fr['ms']
    if len(anim) > 2:
        anim[0].save(
            os.path.join(out_dir, f"{name}.webp"),
            save_all=True,
            append_images=anim[1:],
            duration=durations,
            loop=0,
            quality=80
        )
print("Built sheets and animated WebPs for", len(names), "transitions.")
`;
  execFileSync('python', ['-c', py, out, ...names], { stdio: 'inherit' });
}

const results = [];
try {
  await server('after');
  const c = await browser({ width: 1440, height: 900, path: '/' });
  try {
    // 1. Arrive at completed Shanghai Globe cleanly
    const shanghaiTop = await c.evaluate('window.__magneticCV.snapshot().chapters[0].top');
    const journeyTop = await c.evaluate(`Math.round(document.querySelector('#journey').getBoundingClientRect().top + scrollY)`);
    await c.evaluate(`scrollTo({ top: ${journeyTop}, behavior: 'instant' })`);
    await sleep(600);
    await c.wheel(120);
    for (let i = 0; i < 65; i++) {
      await sleep(250);
      const y = await c.evaluate('Math.round(scrollY)');
      const playing = await c.evaluate(`document.documentElement.hasAttribute('data-globe-scroll')`);
      if (Math.abs(y - shanghaiTop) <= 4 && !playing) break;
    }
    await sleep(900);

    // Capture 1: Shanghai -> Profile
    results.push(await captureTransition(c, '01-shanghai-to-profile', () => c.wheel(120), 1650, true));

    // Capture 2: Profile -> Experience
    results.push(await captureTransition(c, '02-profile-to-experience', () => c.wheel(120), 1580));

    // Advance to bottom of Experience if needed before Experience -> Education
    const expSpan = await c.evaluate(`(() => { const ch = window.__magneticCV.snapshot().chapters.find(x => x.id === 'experience'); return ch ? { top: ch.top, end: ch.end } : null; })()`);
    if (expSpan && expSpan.end > expSpan.top + 4) {
      await c.evaluate(`scrollTo({ top: ${expSpan.end}, behavior: 'instant' })`);
      await sleep(300);
    }

    // Capture 3: Experience -> Education
    results.push(await captureTransition(c, '03-experience-to-education', () => c.wheel(120), 1580));

    // Capture 4: Education -> Skills
    const eduSpan = await c.evaluate(`(() => { const ch = window.__magneticCV.snapshot().chapters.find(x => x.id === 'education'); return ch ? { top: ch.top, end: ch.end } : null; })()`);
    if (eduSpan && eduSpan.end > eduSpan.top + 4) {
      await c.evaluate(`scrollTo({ top: ${eduSpan.end}, behavior: 'instant' })`);
      await sleep(300);
    }
    results.push(await captureTransition(c, '04-education-to-skills', () => c.wheel(120), 1580));

    // Capture 5: Skills -> Languages
    results.push(await captureTransition(c, '05-skills-to-languages', () => c.wheel(120), 1580));

    // Capture 6: Languages -> Interests
    results.push(await captureTransition(c, '06-languages-to-interests', () => c.wheel(120), 1580));

    // Capture 7: Interests -> Contact
    results.push(await captureTransition(c, '07-interests-to-contact', () => c.wheel(120), 1580));

    // Capture 8: Contact -> Interests (Reverse revisit — verify zero .ascii-visual mutations!)
    await c.evaluate(`(() => {
      window.__revMutations = 0;
      new MutationObserver(rs => {
        for (const r of rs) {
          const el = r.target instanceof Element ? r.target : r.target.parentElement;
          if (el?.closest('.ascii-visual')) window.__revMutations++;
        }
      }).observe(document.querySelector('main'), { subtree: true, childList: true, characterData: true, attributes: true, attributeFilter: ['style', 'class'] });
    })()`);
    results.push(await captureTransition(c, '08-contact-to-interests', () => c.wheel(-120), 1580));
    const revMutations = await c.evaluate('window.__revMutations');
    console.log('Reverse revisit .ascii-visual mutations:', revMutations);
    assert.equal(revMutations, 0, 'completed decoded DOM must never be mutated on revisit');

    // Jump to Profile top and capture 9: Profile -> Shanghai (Reverse handoff!)
    const profTop = await c.evaluate(`window.__magneticCV.snapshot().chapters.find(x => x.id === 'introduction').top`);
    await c.evaluate(`location.hash = '#introduction'`);
    await sleep(600);
    await c.evaluate(`scrollTo({ top: ${profTop}, behavior: 'instant' })`);
    await sleep(400);
    results.push(await captureTransition(c, '09-profile-to-shanghai', () => c.wheel(-120), 1650, true));

    assert.deepEqual(c.errors, [], `Page errors: ${JSON.stringify(c.errors)}`);
  } finally {
    await c.close();
  }

  // Mobile (390x844 touch) capture of key transitions: Shanghai -> Profile, Profile -> Experience, Contact -> Interests
  const m = await browser({ width: 390, height: 844, touch: true, dsf: 2, path: '/#introduction' });
  try {
    const swipe = (dir) => m.swipe(dir * 220, { x: 195, y0: dir > 0 ? 600 : 280, steps: 6, ms: 100 });
    // Reverse to Shanghai first so we capture Shanghai -> Profile cleanly on mobile
    await swipe(-1);
    await sleep(1700);
    results.push(await captureTransition(m, '10-mobile-shanghai-to-profile', () => swipe(1), 1650, true));
    // Scroll to bottom of Profile if needed on mobile
    const profEnd = await m.evaluate(`window.__magneticCV.snapshot().chapters.find(x => x.id === 'introduction').end`);
    await m.evaluate(`scrollTo({ top: ${profEnd}, behavior: 'instant' })`);
    await sleep(300);
    results.push(await captureTransition(m, '11-mobile-profile-to-experience', () => swipe(1), 1600));
    assert.deepEqual(m.errors, [], `Mobile page errors: ${JSON.stringify(m.errors)}`);
  } finally {
    await m.close();
  }

  save('capture-summary', results);
  buildVisuals(results.map(r => r.name));
} finally {
  stopServers();
}
