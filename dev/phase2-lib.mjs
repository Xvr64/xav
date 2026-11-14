// Phase II QA harness, shared helpers (see phase2.mjs). Private headless Chrome over CDP.
import { launch, sleep } from './fable-cdp.mjs';
import { spawn } from 'node:child_process';
import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import assert from 'node:assert/strict';

export const task = process.argv[2] || 'shots';
// PHASE2_OUT sends captures and reports somewhere else (artifacts/ is tracked)
export const out = resolve(process.env.PHASE2_OUT || 'artifacts/phase2');
mkdirSync(out, { recursive: true });
const baseRoot = process.env.PHASE2_BASE || resolve('.reference/phase2-before');
const origins = { before: 'http://127.0.0.1:5292', after: 'http://127.0.0.1:5282' };
const roots = { before: baseRoot, after: resolve('.') };
const servers = [];
let port = 9860 + Math.floor(Math.random() * 60);

export const save = (name, data) => writeFileSync(resolve(out, name + '.json'), JSON.stringify(data, null, 2));
export const stats = (d) => {
  if (!d.length) return null;
  const s = [...d].sort((a, b) => a - b);
  const r = (v) => Math.round(v * 100) / 100;
  return { frames: d.length, mean: r(d.reduce((a, b) => a + b, 0) / d.length), p50: r(s[Math.floor(s.length * 0.5)]), p95: r(s[Math.floor(s.length * 0.95)]), p99: r(s[Math.floor(s.length * 0.99)]), max: r(s.at(-1)), over34: d.filter((x) => x > 34).length };
};

export async function server(variant) {
  const url = origins[variant];
  try { if ((await fetch(url + '/')).ok) return; } catch { /* start one */ }
  const p = Number(new URL(url).port);
  const child = spawn(process.execPath, [resolve('node_modules/vite/bin/vite.js'), '--host', '127.0.0.1', '--port', String(p), '--strictPort'], { cwd: roots[variant], windowsHide: true, stdio: ['ignore', 'pipe', 'pipe'] });
  servers.push(child);
  let log = '';
  child.stdout.on('data', (d) => (log += d));
  child.stderr.on('data', (d) => (log += d));
  for (let i = 0; i < 150; i++) {
    try { if ((await fetch(url + '/')).ok) return; } catch { /* not yet */ }
    if (child.exitCode !== null) throw Error(log);
    await sleep(200);
  }
  throw Error('Local server failed: ' + log);
}
export const stopServers = () => servers.forEach((s) => s.kill());

/** A page past the opening (the visitor has "seen" it), fonts ready, loops warm. */
export async function browser({ variant = 'after', width = 1440, height = 900, touch = false, dsf = 1, intro = false, source = '', path = '/' } = {}) {
  const c = await launch({ port: port++, profile: `phase2-${task}-${Date.now()}-${port}` });
  if (touch) await c.mobile(width, height, dsf); else await c.desktop(width, height, dsf);
  await c.send('Page.addScriptToEvaluateOnNewDocument', { source: `${intro ? '' : "sessionStorage.setItem('xh-creation-seen-v1','1');"}${source}` });
  await c.goto(origins[variant] + path);
  for (let i = 0; i < 160; i++) {
    if (await c.evaluate(`!!document.querySelector('#journey')`)) break;
    await sleep(250);
  }
  assert.equal(await c.evaluate(`!!document.querySelector('#journey')`), true, JSON.stringify(c.errors));
  await c.evaluate('document.fonts.ready');
  await sleep(2500);
  return c;
}
export async function png(c, name, opts = {}) {
  const r = await c.send('Page.captureScreenshot', { format: 'png', ...opts });
  const file = resolve(out, name + '.png');
  mkdirSync(resolve(file, '..'), { recursive: true });
  writeFileSync(file, Buffer.from(r.data, 'base64'));
  return file;
}
export async function jpg(c, name, quality = 84) {
  const r = await c.send('Page.captureScreenshot', { format: 'jpeg', quality });
  const file = resolve(out, name + '.jpg');
  mkdirSync(resolve(file, '..'), { recursive: true });
  writeFileSync(file, Buffer.from(r.data, 'base64'));
  return file;
}
export const geometry = (c) => c.evaluate(`({vh:innerHeight,journey:document.querySelector('#journey').getBoundingClientRect().top+scrollY,intro:document.querySelector('#introduction').getBoundingClientRect().top+scrollY,max:document.documentElement.scrollHeight-innerHeight,nodes:document.querySelectorAll('*').length})`);
export const scrollRun = (c, y0, y1, speed) => c.evaluate(`new Promise(resolve=>{const d=[];let last=0;const t0=performance.now();scrollTo(0,${y0});function f(t){if(last)d.push(t-last);last=t;const y=${y0}+(t-t0)/1000*${speed};scrollTo(0,Math.min(y,${y1}));if(y>=${y1})resolve(d);else requestAnimationFrame(f)}requestAnimationFrame(f)})`);
export const sample = (c, ms) => c.evaluate(`new Promise(resolve=>{const d=[];let last=0;const t0=performance.now();function f(t){if(last)d.push(t-last);last=t;if(t-t0>${ms})resolve(d);else requestAnimationFrame(f)}requestAnimationFrame(f)})`);
export async function click(c, sel) {
  const p = await c.evaluate(`(()=>{const r=document.querySelector(${JSON.stringify(sel)}).getBoundingClientRect();return {x:r.x+r.width/2,y:r.y+r.height/2}})()`);
  await c.send('Input.dispatchMouseEvent', { type: 'mousePressed', button: 'left', clickCount: 1, ...p });
  await c.send('Input.dispatchMouseEvent', { type: 'mouseReleased', button: 'left', clickCount: 1, ...p });
  await sleep(500);
}

