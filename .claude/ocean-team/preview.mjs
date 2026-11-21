#!/usr/bin/env node
// Ocean Preview: serve the current Ocean Team mission at http://localhost:5181.
//
//   npm run ocean:preview                    preview the active mission (detected automatically)
//   npm run ocean:preview -- portfolio-v2    preview a specific mission (name, id or part of its title);
//                                            it becomes the current mission for later runs
//   npm run ocean:preview -- --no-open       do not open the browser
//   npm run ocean:preview -- --replace       stop whatever else holds port 5181 first
//   npm run ocean:preview -- --list          show the missions and which one would be previewed
//
// Which mission: the one named on the command line, else the only mission worktree, else the
// current mission (set by `npm run ocean`), else the one with the most recent activity.
// The preview serves the mission's worktree exactly as it is on disk, including the team's
// uncommitted edits, and reloads as they change. It only reads the worktree: nothing is moved,
// renamed, committed or built. Ctrl+C stops it.

import { execFileSync, spawn } from 'node:child_process';
import { existsSync, readFileSync, rmSync, symlinkSync, writeFileSync, mkdirSync } from 'node:fs';
import net from 'node:net';
import path from 'node:path';
import { listMissions, pickMission, PREVIEW_PORT, readCurrent, repoRoot, stateDir, writeCurrent } from './missions.mjs';

const PORT = PREVIEW_PORT;
const URL = `http://localhost:${PORT}/`;
const isWin = process.platform === 'win32';

const argv = process.argv.slice(2);
const flags = new Set(argv.filter((a) => a.startsWith('-')));
const selector = argv.filter((a) => !a.startsWith('-')).join(' ') || null;

const root = repoRoot();
const missions = listMissions(root);
const current = readCurrent(root);

if (flags.has('--list')) {
  const pick = pickMission(missions, { current });
  for (const m of missions) console.log(`${pick.mission === m ? '>' : ' '} ${m.name.padEnd(32)} ${m.branch.padEnd(40)} ${m.title || ''}`);
  if (pick.error) console.log(pick.error);
  process.exit(0);
}

const pick = pickMission(missions, { selector, current });
if (pick.error) { console.error(`Ocean Preview: ${pick.error}`); process.exit(1); }
const mission = pick.mission;
if (selector) writeCurrent(root, mission);

const statePath = path.join(stateDir(root), 'preview.json');
const readState = () => { try { return JSON.parse(readFileSync(statePath, 'utf8')); } catch { return null; } };
const sameDir = (a, b) => !!a && !!b && path.resolve(a).toLowerCase() === path.resolve(b).toLowerCase();

const alive = (pid) => { if (!pid) return false; try { process.kill(pid, 0); return true; } catch (e) { return e.code === 'EPERM'; } };

function probe(host) {
  return new Promise((resolve) => {
    const s = net.connect({ host, port: PORT });
    const done = (v) => { s.destroy(); resolve(v); };
    s.once('connect', () => done(true));
    s.once('error', () => done(false));
    s.setTimeout(800, () => done(false));
  });
}
const portBusy = async () => (await probe('127.0.0.1')) || (await probe('::1'));

/** PID listening on the port, or null. */
function portHolder() {
  try {
    if (isWin) {
      const out = execFileSync('netstat', ['-ano', '-p', 'tcp'], { encoding: 'utf8' }) + execFileSync('netstat', ['-ano', '-p', 'tcpv6'], { encoding: 'utf8' });
      for (const line of out.split(/\r?\n/)) {
        const c = line.trim().split(/\s+/);
        if (c[0] === 'TCP' && c[1]?.endsWith(`:${PORT}`) && c[3] === 'LISTENING') return Number(c[4]);
      }
    } else {
      const out = execFileSync('lsof', ['-nP', `-iTCP:${PORT}`, '-sTCP:LISTEN', '-t'], { encoding: 'utf8' });
      return Number(out.split('\n')[0]) || null;
    }
  } catch {}
  return null;
}

function describe(pid) {
  if (!pid) return 'an unknown program';
  try {
    if (isWin) {
      const csv = execFileSync('tasklist', ['/FI', `PID eq ${pid}`, '/FO', 'CSV', '/NH'], { encoding: 'utf8' }).trim();
      const image = csv.split('","')[0].replace(/^"/, '');
      return image ? `${image} (PID ${pid})` : `PID ${pid}`;
    }
  } catch {}
  return `PID ${pid}`;
}

function stop(pid) {
  try {
    if (isWin) execFileSync('taskkill', ['/PID', String(pid), '/T', '/F'], { stdio: 'ignore' });
    else process.kill(pid, 'SIGTERM');
  } catch {}
}

function openBrowser() {
  if (flags.has('--no-open')) return;
  try {
    if (isWin) spawn('cmd', ['/c', 'start', '', URL], { detached: true, stdio: 'ignore' }).unref();
    else spawn(process.platform === 'darwin' ? 'open' : 'xdg-open', [URL], { detached: true, stdio: 'ignore' }).unref();
  } catch {}
}

const label = mission.title ? `${mission.name}  (${mission.title})` : mission.name;

if (await portBusy()) {
  const state = readState();
  const holder = portHolder();
  const ours = !!state && alive(state.pid) && (!holder || holder === state.pid);
  if (ours && sameDir(state.worktree, mission.worktree)) {
    console.log(`Ocean Preview is already running for ${label}\n  ${URL}`);
    openBrowser();
    process.exit(0);
  }
  if (ours) {
    console.log(`Ocean Preview was showing "${state.name}"; switching to "${mission.name}".`);
    stop(state.pid);
  } else if (flags.has('--replace') && holder) {
    console.log(`Stopping ${describe(holder)}, which was holding port ${PORT}.`);
    stop(holder);
  } else {
    console.error(`Ocean Preview: port ${PORT} is already used by ${describe(holder)}, not by Ocean Preview.
  Close that program, or let Ocean Preview stop it:  npm run ocean:preview -- --replace`);
    process.exit(1);
  }
  for (let i = 0; i < 40 && await portBusy(); i++) await new Promise((r) => setTimeout(r, 150));
}

// The worktree normally has node_modules linked by the launcher; link it if it went missing.
const nm = path.join(mission.worktree, 'node_modules');
if (!existsSync(nm) && existsSync(path.join(root, 'node_modules'))) {
  symlinkSync(path.join(root, 'node_modules'), nm, isWin ? 'junction' : 'dir');
}
const viteBin = path.join(nm, 'vite', 'bin', 'vite.js');
if (!existsSync(viteBin)) { console.error(`Ocean Preview: Vite is not installed (${viteBin}). Run npm install in ${root}.`); process.exit(1); }

process.title = 'Ocean Preview';
console.log(`
  Ocean Preview
  mission   ${label}
  branch    ${mission.branch}   (${pick.why})
  folder    ${mission.worktree}
  open      ${URL}

  Shows the mission's files as they are now, including uncommitted edits; reloads as they change.
  Ctrl+C stops the preview.
`);

const args = [viteBin, '--port', String(PORT), '--strictPort'];
if (!flags.has('--no-open')) args.push('--open');
const child = spawn(process.execPath, args, { cwd: mission.worktree, stdio: 'inherit' });

mkdirSync(stateDir(root), { recursive: true });
writeFileSync(statePath, JSON.stringify({ pid: child.pid, name: mission.name, branch: mission.branch, worktree: mission.worktree, port: PORT, startedAt: new Date().toISOString() }, null, 2) + '\n');

const cleanup = () => { const s = readState(); if (s && s.pid === child.pid) rmSync(statePath, { force: true }); };
for (const sig of ['SIGINT', 'SIGTERM', 'SIGHUP']) process.on(sig, () => { child.kill(); });
child.on('exit', (code) => { cleanup(); process.exit(code ?? 0); });
