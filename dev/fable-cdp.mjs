// Minimal CDP driver: launches a private headless Chrome and exposes helpers.
import { spawn } from 'node:child_process';
import { mkdirSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';

const CHROME = process.env.CHROME_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe';
export const SCRATCH = resolve('node_modules/.cache/fable-continuation');
export const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

export async function launch({ port = 9333, width = 1440, height = 900, profile = 'profile', fresh = false } = {}) {
  const dir = join(SCRATCH, profile);
  // Unique continuation profiles: preserve existing browser artifacts.
  mkdirSync(dir, { recursive: true });
  const proc = spawn(CHROME, [
    '--headless=new', '--use-angle=d3d11', '--enable-gpu', `--remote-debugging-port=${port}`,
    `--user-data-dir=${dir}`, `--window-size=${width},${height}`, '--hide-scrollbars',
    '--no-first-run', '--no-default-browser-check', '--disable-background-timer-throttling',
    '--disable-renderer-backgrounding', '--disable-backgrounding-occluded-windows', 'about:blank'
  ], { stdio: 'ignore', windowsHide: true });
  let targets;
  for (let i = 0; i < 60; i++) {
    try {
      targets = await (await fetch(`http://127.0.0.1:${port}/json`)).json();
      if (targets.some((t) => t.type === 'page')) break;
    } catch { /* not up yet */ }
    await sleep(250);
  }
  if (!targets?.some(t => t.type === 'page')) { proc.kill(); throw Error('Private Chrome debugging connection unavailable'); }
  const page = targets.find((t) => t.type === 'page');
  const ws = new WebSocket(page.webSocketDebuggerUrl);
  await new Promise((res, rej) => { ws.onopen = res; ws.onerror = rej; });
  let id = 0;
  const pending = new Map();
  const handlers = new Map();
  ws.onmessage = (ev) => {
    const msg = JSON.parse(ev.data);
    if (msg.id && pending.has(msg.id)) {
      const { res, rej } = pending.get(msg.id);
      pending.delete(msg.id);
      msg.error ? rej(new Error(JSON.stringify(msg.error))) : res(msg.result);
    } else if (msg.method) (handlers.get(msg.method) || []).forEach((fn) => fn(msg.params));
  };
  const send = (method, params = {}) => new Promise((res, rej) => { pending.set(++id, { res, rej }); ws.send(JSON.stringify({ id, method, params })); });
  const on = (method, fn) => { handlers.set(method, [...(handlers.get(method) || []), fn]); };
  await send('Page.enable');
  await send('Runtime.enable');
  const errors = [];
  on('Runtime.exceptionThrown', (p) => errors.push(p.exceptionDetails?.exception?.description || p.exceptionDetails?.text));
  on('Runtime.consoleAPICalled', (p) => { if (p.type === 'error') errors.push('console.error: ' + p.args.map((a) => a.value ?? a.description).join(' ')); });
  const evaluate = async (expression) => {
    const r = await send('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true });
    if (r.exceptionDetails) throw new Error(r.exceptionDetails.exception?.description || r.exceptionDetails.text);
    return r.result.value;
  };
  const shot = async (name, opts = {}) => {
    const r = await send('Page.captureScreenshot', { format: 'jpeg', quality: 82, ...opts });
    const file = join(SCRATCH, 'shots', name + '.jpg');
    mkdirSync(join(SCRATCH, 'shots'), { recursive: true });
    writeFileSync(file, Buffer.from(r.data, 'base64'));
    return file;
  };
  const goto = async (url) => {
    const loaded = new Promise((res) => on('Page.loadEventFired', res));
    await send('Page.navigate', { url });
    await loaded;
  };
  const mobile = async (w = 390, h = 844, dsf = 3) => {
    await send('Emulation.setDeviceMetricsOverride', { width: w, height: h, deviceScaleFactor: dsf, mobile: true });
    await send('Emulation.setTouchEmulationEnabled', { enabled: true, maxTouchPoints: 5 });
    await send('Emulation.setUserAgentOverride', { userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1' });
  };
  const desktop = async (w = 1440, h = 900, dsf = 1) => {
    await send('Emulation.setDeviceMetricsOverride', { width: w, height: h, deviceScaleFactor: dsf, mobile: false });
  };
  const wheel = async (deltaY, x = 700, y = 450) => send('Input.dispatchMouseEvent', { type: 'mouseWheel', x, y, deltaX: 0, deltaY });
  const swipe = async (dy, { x = 195, y0 = 600, steps = 8, ms = 160 } = {}) => {
    await send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x, y: y0 }] });
    for (let i = 1; i <= steps; i++) {
      await send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x, y: y0 - (dy * i) / steps }] });
      await sleep(ms / steps);
    }
    await send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
  };
  const close = async () => { try { await send('Browser.close'); } catch { /* gone */ } proc.kill(); };
  return { send, on, evaluate, shot, goto, mobile, desktop, wheel, swipe, close, errors, proc };
}
