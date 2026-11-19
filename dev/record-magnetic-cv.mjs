// Record the complete forward and reverse walks. FFMPEG_PATH can point to a local binary.
// --pacing repeats the same walks with only rAF timestamps and the screencast disabled.
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { once } from 'node:events';
import { join } from 'node:path';
import { sleep } from './fable-cdp.mjs';

process.env.PHASE2_OUT ||= 'artifacts/magnetic-cv-v3';
const { browser, server, stopServers, out, save, stats } = await import('./phase2-lib.mjs');

const pacing = process.argv.includes('--pacing');
const measurements = [];

async function encode(frames, name) {
  const fps = 60;
  const encoder = spawn(process.env.FFMPEG_PATH || 'ffmpeg', [
    '-hide_banner', '-loglevel', 'error', '-y', '-f', 'image2pipe', '-framerate', String(fps),
    '-vcodec', 'mjpeg', '-i', '-', '-c:v', 'libx264', '-preset', 'fast', '-crf', '18',
    '-pix_fmt', 'yuv420p', '-movflags', '+faststart', join(out, name + '.mp4')
  ], { stdio: ['pipe', 'ignore', 'inherit'], windowsHide: true });
  const done = once(encoder, 'close');
  let index = 0;
  // CDP timestamps preserve real stalls and holds in the recording.
  for (let t = frames[0].time; t <= frames.at(-1).time; t += 1 / fps) {
    while (index + 1 < frames.length && frames[index + 1].time <= t) index++;
    if (!encoder.stdin.write(frames[index].jpeg)) await once(encoder.stdin, 'drain');
  }
  encoder.stdin.end();
  assert.equal((await done)[0], 0, 'encode completed');
}

async function record(width, height, touch) {
  const c = await browser({ width, height, touch, dsf: touch ? 2 : 1, path: '/?magneticCV=1#introduction' });
  const frames = [];
  let recording = false;
  let ackError;
  try {
    const chapters = await c.evaluate(`[...document.querySelectorAll('#introduction,.cv-arch > section')].map(el => el.id)`);
    if (pacing) {
      await c.evaluate(`(() => {
        window.cvFrameIntervals = [];
        let live = false, last = 0;
        new MutationObserver(changes => {
          for (const { target } of changes) {
            live = target.hasAttribute('data-cv-depart');
            if (live) cvFrameIntervals.push([]);
            last = 0;
          }
        }).observe(document.querySelector('main'), { subtree: true, attributes: true, attributeFilter: ['data-cv-depart'] });
        function sample(t) {
          if (live && last) cvFrameIntervals.at(-1).push(t - last);
          last = live ? t : 0;
          requestAnimationFrame(sample);
        }
        requestAnimationFrame(sample);
      })()`);
    } else {
      recording = true;
      c.on('Page.screencastFrame', ({ data, metadata, sessionId }) => {
        if (!recording) return;
        c.send('Page.screencastFrameAck', { sessionId }).catch(error => { if (recording) ackError = error; });
        frames.push({ time: metadata.timestamp, jpeg: Buffer.from(data, 'base64') });
      });
      await c.send('Page.startScreencast', { format: 'jpeg', quality: 90, everyNthFrame: 1 });
    }
    await sleep(450);
    for (const dir of [1, -1]) {
      const order = dir === 1 ? chapters : [...chapters].reverse();
      for (let i = 1; i < order.length; i++) {
        if (touch) await c.swipe(dir * 240, { x: width / 2, y0: height * .52, steps: 4, ms: 40 });
        else await c.wheel(dir * 120);
        await sleep(1360);
        assert.equal(await c.evaluate('location.hash'), '#' + order[i]);
      }
    }
    await sleep(250);
    if (pacing) {
      const intervals = await c.evaluate('cvFrameIntervals');
      assert.equal(intervals.length, 2 * (chapters.length - 1));
      assert.ok(intervals.every(samples => samples.length > 0));
      measurements.push({ width, height, touch, forward: stats(intervals.slice(0, 6).flat()),
        reverse: stats(intervals.slice(6).flat()), all: stats(intervals.flat()) });
      save('frame-pacing', measurements);
      return;
    }
    await c.send('Page.stopScreencast');
    if (ackError) throw ackError;
    assert.ok(frames.length > 24);
  } finally {
    recording = false;
    await c.close();
  }
  const name = touch ? 'mobile' : 'desktop';
  await encode(frames, name);
  console.log(name, frames.length, 'captured frames');
}

try {
  await server('after');
  await record(1440, 900, false);
  await record(390, 844, true);
} finally { stopServers(); }
