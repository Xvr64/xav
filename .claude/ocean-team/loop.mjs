#!/usr/bin/env node
// Ocean Team loop runner: the deterministic part of a mission (no model reasoning, no framework).
//
// A mission's plan is split into *units* in `runs/<mission>/units.json`. Each unit has one owner, the
// files it may edit, the units it really depends on (`after`), and acceptance criteria written
// before any code. This script is the check that can fail: it runs those criteria, keeps a ledger,
// returns only the failing unit to its owner with evidence, stops after three failed attempts, and
// never claims success from an agent's confidence.
//
//   node .claude/ocean-team/loop.mjs init      <mission> [--base <ref>]   ledger, main snapshot
//   node .claude/ocean-team/loop.mjs plan      <mission>                  validate units, print waves
//   node .claude/ocean-team/loop.mjs baseline  <mission> [--shots]        tsc + tests + build, once
//   node .claude/ocean-team/loop.mjs next      <mission>                  units ready to start
//   node .claude/ocean-team/loop.mjs start     <mission> <unit> [--owner <name>]
//   node .claude/ocean-team/loop.mjs brief     <mission> <unit>           brief for the owner
//   node .claude/ocean-team/loop.mjs verify    <mission> <unit>           run the unit's checks
//   node .claude/ocean-team/loop.mjs review    <mission> <unit> --by guardian --pass|--fail
//                                              [--criterion <id>] --evidence "<text>" [--file f:12]
//   node .claude/ocean-team/loop.mjs reset     <mission> <unit> --reason "<replan>"
//   node .claude/ocean-team/loop.mjs final     <mission>                  whole-branch verification
//   node .claude/ocean-team/loop.mjs status    <mission>                  table (also runs/<m>/status.md)
//   node .claude/ocean-team/loop.mjs lessons   [--check] [--for <file> ...] [--candidates <mission>]
//
// Exit codes: 0 passed / ok, 1 failed (correction packet printed), 2 blocked or invalid,
// 3 code unchanged since the last failed attempt (nothing re-verified, no attempt counted),
// 4 escalated to the lead (retry budget spent), 5 machine checks passed, review pending.
//
// Quality gates live here. Permission gates (main, merges, deploys, force pushes) stay in
// `.claude/hooks/protect-main.mjs` and the settings deny list; this script never relaxes them.

import { execFileSync, spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync, renameSync, writeFileSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { check as protectMain } from '../hooks/protect-main.mjs';
import { listMissions, repoRoot, runsDir } from './missions.mjs';

export const MAX_ATTEMPTS = 3;
export const REVIEWERS = ['guardian', 'director', 'motion', 'lead'];
const HERE = path.dirname(fileURLToPath(import.meta.url));
export const LESSONS_FILE = path.join(HERE, 'lessons.md');

// ---------------------------------------------------------------------------------------------
// Risk lanes (blast radius, not confidence). Lane 1: contained and reversible, focused checks.
// Lane 2: shared systems (scroll, navigation, ocean/whale/Globe rendering, global CSS and layout,
// build and team config): broader regression checks and an independent guardian review.
// Lane 3 (merge, deploy, history rewrite, deleting data) never opens inside a mission: it is the
// owner's, behind protect-main and the deny list.
export const SHARED = [
  /^magneticCV/, /^cinematicScroll/, /^rootScrollLock/, /^abyssalCipher/, /^ReadingZoneTracker/,
  /^JourneyGlobe/, /^asciiGlobe/, /^glyphcssGlobe/, /^globe/, /^abyssPalette/,
  /^ambientWhale/, /^AmbientWhale/, /^whale/, /^AsciiWhale/, /^asciiOcean/, /^ocean/, /^seaState/,
  /^waterInertia/, /^TerminalEditorial/, /^encryptedMotion/, /\.css$/,
  /^xavier_h_ry_editorial_portfolio\.tsx$/, /^index\.html$/, /^main\.tsx$/,
  /^package(-lock)?\.json$/, /^vite\.config/, /^tailwind/, /^tsconfig/, /^\.claude\//
];
export const laneOf = (unit) =>
  Math.max(Number(unit.lane) || 1, (unit.files || []).some((f) => SHARED.some((r) => r.test(norm(f)))) ? 2 : 1);

// Cheap checks first; a tier with a failure stops the run, so a type error never waits on a
// five-minute harness run.
const TIER = { main: 0, scope: 0, tsc: 1, tests: 1, cmd: 1, 'tests-all': 2, build: 2, harness: 3, review: 4 };
const KINDS = Object.keys(TIER);
const TIMEOUT = { tsc: 5, tests: 10, cmd: 10, 'tests-all': 15, build: 10, harness: 25 }; // minutes

const norm = (f) => String(f).replace(/\\/g, '/').replace(/^\.\//, '');
const sha1 = (s) => createHash('sha1').update(s).digest('hex').slice(0, 12);
const git = (cwd, args) => String(execFileSync('git', ['-C', cwd, ...args], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }) ?? '').trim();
const tryGit = (cwd, args) => { try { return git(cwd, args); } catch { return null; } };
const lines = (s) => String(s || '').split(/\r?\n/).filter(Boolean);
const readJson = (f) => JSON.parse(readFileSync(f, 'utf8'));
function writeJson(f, data) {
  mkdirSync(path.dirname(f), { recursive: true });
  const tmp = `${f}.${process.pid}.tmp`;
  writeFileSync(tmp, JSON.stringify(data, null, 2) + '\n');
  renameSync(tmp, f);
}

/** Simple globs for `allow` and lesson scopes: `dir/` prefix, `*` within a segment, `**` across. */
export function globMatch(pattern, file) {
  const p = norm(pattern), f = norm(file);
  if (p === 'all' || p === '**') return true;
  if (p.endsWith('/')) return f.startsWith(p);
  const re = new RegExp('^' + p.replace(/[.+^${}()|[\]\\]/g, '\\$&').replace(/\*\*/g, '\u0000').replace(/\*/g, '[^/]*').replace(/\u0000/g, '.*') + '$');
  return re.test(f) || (!p.includes('/') && re.test(f.split('/').pop()));
}

// ---------------------------------------------------------------------------------------------
// The graph: validate units, find real conflicts, compute parallel waves.

/** Every check a unit must pass: its own acceptance criteria plus the automatic ones of its lane. */
export function checksFor(unit) {
  const lane = laneOf(unit);
  const own = (unit.accept || []).map((c, i) => ({ ...c, id: c.id || `${unit.id}-${i + 1}` }));
  const auto = [
    { id: 'auto:main', check: 'main', criterion: 'main and the owner\'s checkout are untouched' },
    { id: 'auto:scope', check: 'scope', criterion: 'only files the plan assigns were changed' },
    { id: 'auto:tsc', check: 'tsc', criterion: 'TypeScript compiles (tsc --noEmit)' }
  ];
  if ((unit.files || []).some((f) => norm(f).startsWith('.claude/'))) {
    // `node --test` skips dot-folders, so the team's own tests and the main guard run explicitly.
    auto.push({ id: 'auto:team-tests', check: 'cmd', run: ['node', '--test', '.claude/ocean-team/*.test.mjs'], criterion: 'the Ocean Team\'s own tests pass' });
    auto.push({ id: 'auto:protect-main', check: 'cmd', run: ['node', '.claude/hooks/protect-main.mjs', '--self-test'], criterion: 'the main-branch guard still refuses what it must' });
  }
  if (lane >= 2) {
    auto.push({ id: 'auto:tests-all', check: 'tests-all', criterion: 'the full unit-test suite passes' });
    auto.push({ id: 'auto:build', check: 'build', criterion: 'an isolated production build succeeds' });
    if (!own.some((c) => c.check === 'review' && c.by === 'guardian')) {
      auto.push({ id: 'auto:review', check: 'review', by: 'guardian', criterion: 'independent guardian review of the current code' });
    }
  }
  return [...auto, ...own].sort((a, b) => TIER[a.check] - TIER[b.check]);
}

/** Validate units.json. Pure. Returns { errors, warnings, waves, lanes, ancestors }. */
export function validatePlan(plan) {
  const errors = [], warnings = [];
  const units = Array.isArray(plan?.units) ? plan.units : [];
  if (!units.length) errors.push('units.json has no units');
  const byId = new Map();
  for (const u of units) {
    if (!u.id || !/^[A-Za-z0-9][\w.-]*$/.test(u.id)) { errors.push(`unit id "${u.id}" is not a short identifier`); continue; }
    if (byId.has(u.id)) errors.push(`unit id ${u.id} is used twice`);
    byId.set(u.id, u);
  }
  for (const u of byId.values()) {
    if (!u.owner) errors.push(`${u.id}: no owner`);
    if (!u.files?.length) errors.push(`${u.id}: no files (a unit owns the files it may edit)`);
    if (Number(u.lane) >= 3) errors.push(`${u.id}: lane 3 (merge, deploy, history rewrite, deleting data) never runs inside a mission; it is the owner's`);
    if (!u.accept?.length) errors.push(`${u.id}: no acceptance criteria (write the check before the work)`);
    for (const c of u.accept || []) {
      const label = `${u.id} criterion ${c.id || '?'}`;
      if (!KINDS.includes(c.check)) errors.push(`${label}: unknown check "${c.check}" (use ${KINDS.join(', ')})`);
      if (!c.criterion) errors.push(`${label}: say in words what passing means ("criterion")`);
      if (c.check === 'tests' && !c.files?.length) errors.push(`${label}: a tests check names its test files`);
      if (c.check === 'harness' && !c.args?.length) errors.push(`${label}: a harness check names its dev/phase2.mjs arguments`);
      if (c.check === 'review' && !REVIEWERS.includes(c.by)) errors.push(`${label}: review "by" must be one of ${REVIEWERS.join(', ')}`);
      if (c.check === 'cmd') {
        if (!Array.isArray(c.run) || c.run[0] !== 'node') errors.push(`${label}: a cmd check is an argv array that starts with "node"`);
        else { const r = protectMain(c.run.join(' '), '.', () => ''); if (r) errors.push(`${label}: refused by protect-main: ${r}`); }
      }
    }
    for (const d of u.after || []) if (!byId.has(d)) errors.push(`${u.id}: depends on unknown unit ${d}`);
  }
  // Ancestors (transitive `after`), with cycle detection.
  const ancestors = new Map(), state = new Map();
  const visit = (id, trail) => {
    if (state.get(id) === 'done') return ancestors.get(id);
    if (state.get(id) === 'open') { errors.push(`dependency cycle: ${[...trail, id].join(' -> ')}`); return new Set(); }
    state.set(id, 'open');
    const set = new Set();
    for (const d of byId.get(id)?.after || []) if (byId.has(d)) { set.add(d); for (const a of visit(d, [...trail, id])) set.add(a); }
    state.set(id, 'done'); ancestors.set(id, set);
    return set;
  };
  for (const id of byId.keys()) visit(id, []);
  // Two units that may run at the same time must not share a file.
  const ids = [...byId.keys()];
  for (let i = 0; i < ids.length; i++) for (let j = i + 1; j < ids.length; j++) {
    const a = byId.get(ids[i]), b = byId.get(ids[j]);
    if (ancestors.get(a.id)?.has(b.id) || ancestors.get(b.id)?.has(a.id)) continue;
    const shared = (a.files || []).map(norm).filter((f) => (b.files || []).map(norm).includes(f));
    if (shared.length) errors.push(`${a.id} and ${b.id} can run at the same time but both edit ${shared.join(', ')}: add an "after" edge or give the file to one unit`);
  }
  // Waves: a unit starts one wave after its latest dependency.
  const level = new Map();
  const lv = (id) => { if (level.has(id)) return level.get(id); level.set(id, 0); const l = 1 + Math.max(0, ...(byId.get(id).after || []).filter((d) => byId.has(d)).map(lv)); level.set(id, l); return l; };
  const waves = [];
  if (!errors.some((e) => e.startsWith('dependency cycle'))) for (const id of ids) { const l = lv(id); (waves[l - 1] ||= []).push(id); }
  const lanes = Object.fromEntries(ids.map((id) => [id, laneOf(byId.get(id))]));
  for (const u of byId.values()) if (laneOf(u) > (Number(u.lane) || 1) && u.lane) warnings.push(`${u.id}: declared lane ${u.lane} but touches shared systems, so it runs as lane 2`);
  return { errors, warnings, waves, lanes, ancestors };
}

/** Files another live mission already changed that this plan also assigns (merge conflicts ahead). */
export function overlapWarnings(planFiles, others) {
  const mine = new Set(planFiles.map(norm));
  return others.flatMap((o) => {
    const both = o.files.map(norm).filter((f) => mine.has(f));
    return both.length ? [`mission ${o.name} has also changed ${both.join(', ')}; expect a merge conflict, coordinate before editing`] : [];
  });
}

// ---------------------------------------------------------------------------------------------
// Mission context, ledger and git facts.

function realExec(argv, { cwd, env, timeoutMs }) {
  const r = spawnSync(argv[0] === 'node' ? process.execPath : argv[0], argv.slice(1), {
    cwd, env: { ...process.env, ...env }, encoding: 'utf8', maxBuffer: 256 << 20, timeout: timeoutMs, windowsHide: true
  });
  const out = (r.stdout || '') + (r.stderr || '') + (r.error ? `\n${r.error.message}` : '');
  return { code: r.status ?? 1, out };
}

export function context({ mission, root = repoRoot(HERE), exec = realExec, validation, worktree } = {}) {
  if (!mission) throw usage('name the mission');
  const runs = runsDir(root, mission);
  let wt = worktree;
  if (!wt) {
    const meta = existsSync(path.join(runs, 'worktree.json')) ? readJson(path.join(runs, 'worktree.json')) : {};
    wt = path.resolve(root, meta.worktree || `.claude/worktrees/ocean-${mission}`);
  }
  return {
    mission, root, runs, worktree: wt, exec,
    unitsFile: path.join(runs, 'units.json'), ledgerFile: path.join(runs, 'ledger.json'),
    validation: validation || path.join(os.tmpdir(), 'portfolio-guardian', mission)
  };
}

function usage(msg) { const e = new Error(msg); e.code = 2; return e; }

export function loadPlan(ctx) {
  if (!existsSync(ctx.unitsFile)) throw usage(`no ${path.relative(ctx.root, ctx.unitsFile)} yet: write the units (see the ocean-team playbook)`);
  return readJson(ctx.unitsFile);
}
export function loadLedger(ctx) {
  if (!existsSync(ctx.ledgerFile)) throw usage(`mission ${ctx.mission} has no ledger: run "loop.mjs init ${ctx.mission}" first`);
  return readJson(ctx.ledgerFile);
}
const saveLedger = (ctx, l) => writeJson(ctx.ledgerFile, l);
const event = (l, unit, what, detail) => (l.events ||= []).push({ at: new Date().toISOString(), unit, what, ...(detail ? { detail } : {}) });

function statusPaths(dir) {
  // Not through git(): trimming would eat the leading space of the first " M path" line.
  let raw = '';
  try { raw = execFileSync('git', ['-C', dir, 'status', '--porcelain', '--untracked-files=all'], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }); } catch {}
  return lines(raw).map((l) => norm(l.slice(3).split(' -> ').pop().replace(/^"|"$/g, '')));
}
export function changedFiles(wt, base) {
  const tracked = lines(git(wt, ['diff', '--name-only', base]));
  const untracked = lines(git(wt, ['ls-files', '--others', '--exclude-standard']));
  return [...new Set([...tracked, ...untracked].map(norm))].sort();
}
export function fingerprint(wt, files) {
  return sha1([...files].map(norm).sort().map((f) => {
    const p = path.join(wt, f);
    return f + '\0' + (existsSync(p) ? readFileSync(p).toString('base64') : '<missing>');
  }).join('\n'));
}
const unitDefHash = (u) => sha1(JSON.stringify({ files: u.files, after: u.after || [], accept: u.accept, lane: u.lane || null }));

export function init(ctx, { base } = {}) {
  if (existsSync(ctx.ledgerFile)) return { code: 0, text: `ledger already exists: ${ctx.ledgerFile} (base ${loadLedger(ctx).base.slice(0, 8)})` };
  if (!existsSync(ctx.worktree)) throw usage(`mission worktree not found: ${ctx.worktree}`);
  const ledger = {
    mission: ctx.mission,
    createdAt: new Date().toISOString(),
    branch: tryGit(ctx.worktree, ['symbolic-ref', '--short', '-q', 'HEAD']) || '(detached)',
    base: git(ctx.worktree, ['rev-parse', base || 'HEAD']),
    main: { sha: tryGit(ctx.root, ['rev-parse', '--verify', '-q', 'refs/heads/main']) || null, dirty: statusPaths(ctx.root) },
    units: {}, events: []
  };
  event(ledger, null, 'init', `base ${ledger.base.slice(0, 8)}, main ${String(ledger.main.sha).slice(0, 8)}`);
  saveLedger(ctx, ledger);
  return { code: 0, text: `ledger created: ${ctx.ledgerFile}\n  branch ${ledger.branch}, base ${ledger.base.slice(0, 8)}, main ${String(ledger.main.sha).slice(0, 8)}, owner's checkout has ${ledger.main.dirty.length} uncommitted path(s) recorded` };
}

const OWNS_FILES = ['in_progress', 'failed', 'awaiting_review', 'escalated'];
const unitState = (ledger, id) => (ledger.units[id] ||= { state: 'pending', attempts: 0, runs: 0, revision: 1, history: [], reviews: [] });

// ---------------------------------------------------------------------------------------------
// Running checks.

function evidenceOf(out, { full = false } = {}) {
  const ls = lines(out);
  const hits = full ? ls.slice(0, 14) : ls.filter((l) => /✖|not ok|FAIL|AssertionError|Error\b|error TS\d+|expected|actual|unset|!==|refused/i.test(l)).slice(0, 14);
  const pick = (hits.length ? hits : ls.slice(-10)).map((l) => l.trim().slice(0, 240));
  const locations = [...new Set([...String(out).matchAll(/([\w./\\-]+\.(?:tsx?|mjs|js|css|json))(?::(\d+)|\((\d+),\d+\))/g)]
    .map((m) => `${norm(m[1]).split('/').filter(Boolean).slice(-2).join('/')}:${m[2] || m[3]}`)
    .filter((l) => !/node_modules|node:internal/.test(l)))].slice(0, 6);
  return { lines: pick, locations };
}
const signatureOf = (id, out) => sha1(id + '\n' + lines(out).filter((l) => !/duration_ms|^ℹ (duration|start)|\d{4}-\d\d-\d\dT/.test(l)).slice(-40).join('\n').replace(/\d+(\.\d+)?\s*ms\b/g, 'N ms'));

function runCheck(ctx, plan, ledger, unit, c, n) {
  const wt = ctx.worktree;
  const logDir = path.join(ctx.validation, 'units', unit?.id || 'final', `a${n}`);
  const logFile = path.join(logDir, `${c.id.replace(/[^\w.-]+/g, '_')}.log`);
  const done = (ok, out, extra = {}) => {
    mkdirSync(logDir, { recursive: true });
    writeFileSync(logFile, String(out));
    const full = c.check === 'main' || c.check === 'scope';
    return { id: c.id, check: c.check, criterion: c.criterion, ok, log: logFile, ...(ok ? {} : { evidence: evidenceOf(out, { full }), signature: signatureOf(c.id, out) }), ...extra };
  };
  const exec = (argv, env = {}) => ctx.exec(argv, { cwd: wt, env, timeoutMs: (TIMEOUT[c.check] || 10) * 60000 });

  switch (c.check) {
    case 'main': {
      const problems = [];
      const now = tryGit(ctx.root, ['rev-parse', '--verify', '-q', 'refs/heads/main']) || null;
      if (ledger.main.sha && now !== ledger.main.sha) problems.push(`refs/heads/main moved: ${ledger.main.sha.slice(0, 8)} -> ${String(now).slice(0, 8)}`);
      const br = tryGit(wt, ['symbolic-ref', '--short', '-q', 'HEAD']);
      if (br === 'main' || br === 'master') problems.push(`the mission worktree is on ${br}`);
      const planFiles = new Set(plan.units.flatMap((u) => u.files.map(norm)));
      if (path.resolve(ctx.root) !== path.resolve(wt)) {
        const before = new Set(ledger.main.dirty);
        const intoMain = statusPaths(ctx.root).filter((p) => !before.has(p) && planFiles.has(p));
        if (intoMain.length) problems.push(`mission files were edited in the owner's main checkout instead of the worktree: ${intoMain.join(', ')}`);
      }
      return done(!problems.length, problems.join('\n') || 'main unchanged; owner checkout clean of mission edits');
    }
    case 'scope': {
      const allowed = [...plan.units.flatMap((u) => u.files), ...(plan.allow || [])];
      const changed = changedFiles(wt, ledger.base);
      const stray = changed.filter((f) => !allowed.some((a) => globMatch(a, f)));
      return done(!stray.length, stray.length ? `FAIL files changed that no unit owns:\n${stray.map((f) => `  ${f}`).join('\n')}` : `changed files all owned: ${changed.join(', ') || '(none)'}`, stray.length ? { stray, route: 'lead' } : {});
    }
    case 'tsc': { const r = exec(['node', 'node_modules/typescript/bin/tsc', '--noEmit']); return done(r.code === 0, r.out || 'tsc: no output'); }
    case 'tests': { const r = exec(['node', '--test', ...c.files]); return done(r.code === 0, r.out); }
    case 'tests-all': { const r = exec(['node', '--test']); return done(r.code === 0, r.out); }
    case 'build': {
      const out = path.join(ctx.validation, 'units', unit?.id || 'final', 'dist');
      const r = exec(['node', 'node_modules/vite/bin/vite.js', 'build', '--outDir', out, '--emptyOutDir', '--logLevel', 'warn']);
      return done(r.code === 0, r.out || `built into ${out}`);
    }
    case 'harness': {
      const r = exec(['node', 'dev/phase2.mjs', ...c.args], { PHASE2_OUT: path.join(logDir, c.id.replace(/[^\w.-]+/g, '_')) });
      return done(r.code === 0 && (!c.expect || new RegExp(c.expect).test(r.out)), r.out);
    }
    case 'cmd': {
      const refused = c.run?.[0] !== 'node' ? 'cmd checks must start with node' : protectMain(c.run.join(' '), wt, () => '');
      if (refused) return done(false, `refused: ${refused}`);
      const r = exec(c.run);
      return done(r.code === 0 && (!c.expect || new RegExp(c.expect).test(r.out)), r.out);
    }
    case 'review': {
      const lu = unitState(ledger, unit.id);
      const fp = lu.pendingFingerprint;
      const rv = [...lu.reviews].reverse().find((r) => r.by === c.by && r.fingerprint === fp && (!r.criterion || r.criterion === c.id));
      if (!rv) return { id: c.id, check: 'review', criterion: c.criterion, ok: null, pending: c.by };
      return { id: c.id, check: 'review', criterion: c.criterion, ok: rv.pass, by: c.by, ...(rv.pass ? {} : { evidence: { lines: [rv.evidence], locations: rv.files || [] }, signature: sha1(rv.evidence) }) };
    }
    default: return done(false, `unknown check ${c.check}`);
  }
}

/** Run checks tier by tier; stop after the first tier with a failure. */
function runTiers(ctx, plan, ledger, unit, checks, n) {
  const results = [];
  for (const tier of [...new Set(checks.map((c) => TIER[c.check]))].sort()) {
    for (const c of checks.filter((x) => TIER[x.check] === tier)) results.push(runCheck(ctx, plan, ledger, unit, c, n));
    if (results.some((r) => r.ok === false)) break;
  }
  const skipped = checks.filter((c) => !results.some((r) => r.id === c.id)).map((c) => c.id);
  return { results, skipped };
}

// ---------------------------------------------------------------------------------------------
// Unit lifecycle.

function findUnit(plan, id) {
  const u = plan.units.find((x) => x.id === id);
  if (!u) throw usage(`no unit "${id}" in units.json (units: ${plan.units.map((x) => x.id).join(', ')})`);
  return u;
}
function blockers(plan, ledger, u) {
  return (u.after || []).filter((d) => ledger.units[d]?.state !== 'passed');
}
function validated(ctx) {
  const plan = loadPlan(ctx);
  const v = validatePlan(plan);
  if (v.errors.length) throw usage(`units.json is invalid:\n  - ${v.errors.join('\n  - ')}`);
  return { plan, v };
}

export function nextUnits(ctx) {
  const { plan } = validated(ctx);
  const ledger = loadLedger(ctx);
  const busy = plan.units.filter((u) => OWNS_FILES.includes(ledger.units[u.id]?.state));
  const busyFiles = new Set(busy.flatMap((u) => u.files.map(norm)));
  return plan.units.filter((u) => {
    const s = ledger.units[u.id]?.state || 'pending';
    return s === 'pending' && !blockers(plan, ledger, u).length && !u.files.some((f) => busyFiles.has(norm(f)));
  }).map((u) => u.id);
}

export function start(ctx, id, { owner } = {}) {
  const { plan } = validated(ctx);
  const ledger = loadLedger(ctx);
  const u = findUnit(plan, id);
  const b = blockers(plan, ledger, u);
  if (b.length) return { code: 2, text: `${id} is blocked by ${b.join(', ')} (not passed yet)` };
  const clash = plan.units.filter((o) => o.id !== id && OWNS_FILES.includes(ledger.units[o.id]?.state) && o.files.some((f) => u.files.map(norm).includes(norm(f))));
  if (clash.length) return { code: 2, text: `${id} would edit files that ${clash.map((c) => c.id).join(', ')} is still editing` };
  const lu = unitState(ledger, id);
  if (lu.state === 'passed') return { code: 0, text: `${id} already passed` };
  lu.state = lu.state === 'pending' ? 'in_progress' : lu.state;
  lu.owner = owner || u.owner;
  lu.defHash ||= unitDefHash(u);
  lu.startedAt ||= new Date().toISOString();
  event(ledger, id, 'start', lu.owner);
  saveLedger(ctx, ledger);
  return { code: 0, text: `${id} in progress, owner ${lu.owner}` };
}

function frozenFiles(plan, ledger, u) {
  return [...new Set(plan.units.filter((o) => o.id !== u.id && ledger.units[o.id]?.state === 'passed').flatMap((o) => o.files.map(norm)))].filter((f) => !u.files.map(norm).includes(f));
}

export function correctionPacket(ctx, plan, ledger, u, failed, { escalated = false } = {}) {
  const lu = ledger.units[u.id];
  const left = Math.max(0, MAX_ATTEMPTS - lu.attempts);
  const prev = lu.history.at(-2);
  const repeat = prev?.result === 'fail' && failed.some((f) => prev.failed?.some((p) => p.signature && p.signature === f.signature));
  const out = [];
  if (escalated) {
    out.push(`ESCALATE TO LEAD: mission ${ctx.mission}, unit ${u.id} "${u.title || ''}" failed ${lu.attempts} attempts (budget ${MAX_ATTEMPTS}).`);
    out.push('The loop cannot fix a fault in the plan that produced this unit. Replan it (split it, change its approach or its criteria), edit units.json, then:');
    out.push(`  node .claude/ocean-team/loop.mjs reset ${ctx.mission} ${u.id} --reason "<what changed in the plan>"`);
    out.push('History:');
    for (const h of lu.history.filter((x) => x.result === 'fail')) out.push(`  attempt ${h.attempt}: ${h.failed.map((f) => `[${f.id}] ${f.evidence?.lines?.[0] || ''}`).join(' | ')}`);
  } else {
    out.push(`CORRECTION: mission ${ctx.mission}, unit ${u.id} "${u.title || ''}", attempt ${lu.attempts} of ${MAX_ATTEMPTS} failed; ${left} correction(s) left.`);
    out.push(`Owner: ${lu.owner || u.owner}${failed.some((f) => f.route === 'lead') ? ' (scope failure: the lead decides who owns the stray files)' : ''}`);
  }
  out.push('Failed criteria:');
  for (const f of failed) {
    out.push(`  - [${f.id}] ${f.criterion} (check: ${f.check}${f.by ? `, by ${f.by}` : ''})`);
    for (const l of f.evidence?.lines || []) out.push(`      ${l}`);
    if (f.evidence?.locations?.length) out.push(`      at: ${f.evidence.locations.join(', ')}`);
    if (f.log) out.push(`      log: ${f.log}`);
  }
  if (!escalated) {
    out.push(`Scope: fix only the failed criteria, editing only ${u.files.join(', ')}.`);
    const frozen = frozenFiles(plan, ledger, u);
    if (frozen.length) out.push(`Do not touch passed units' files: ${frozen.join(', ')}.`);
    if (repeat) out.push('Note: the same failure as the previous attempt. Change the approach, not the parameters.');
    out.push(`When fixed: node .claude/ocean-team/loop.mjs verify ${ctx.mission} ${u.id}`);
  }
  return out.join('\n');
}

function recordFailure(ctx, plan, ledger, u, entry, failed) {
  const lu = ledger.units[u.id];
  lu.attempts += 1;
  entry.attempt = lu.attempts;
  entry.result = 'fail';
  entry.failed = failed.map((f) => ({ id: f.id, check: f.check, criterion: f.criterion, signature: f.signature, evidence: f.evidence, log: f.log, ...(f.by ? { by: f.by } : {}), ...(f.route ? { route: f.route } : {}) }));
  lu.history.push(entry);
  const escalated = lu.attempts >= MAX_ATTEMPTS;
  lu.state = escalated ? 'escalated' : 'failed';
  if (escalated) lu.escalatedDefHash = unitDefHash(u);
  event(ledger, u.id, escalated ? 'escalated' : 'failed', failed.map((f) => f.id).join(', '));
  return { code: escalated ? 4 : 1, text: correctionPacket(ctx, plan, ledger, u, entry.failed, { escalated }) };
}

export function verify(ctx, id) {
  const { plan } = validated(ctx);
  const ledger = loadLedger(ctx);
  const u = findUnit(plan, id);
  const lu = unitState(ledger, id);
  if (lu.state === 'escalated') return { code: 4, text: `${id} is escalated (${lu.attempts} failed attempts). Replan it, then "loop.mjs reset ${ctx.mission} ${id} --reason ...".` };
  const b = blockers(plan, ledger, u);
  if (b.length) return { code: 2, text: `${id} is blocked by ${b.join(', ')} (not passed yet); verify those first` };
  const fp = fingerprint(ctx.worktree, u.files);
  const last = lu.history.at(-1);
  if (lu.state === 'passed' && lu.fingerprint === fp) return { code: 0, text: `${id} already passed on this exact code (${fp})` };
  if (last?.result === 'fail' && last.fingerprint === fp) {
    return { code: 3, text: `${id}: its files are unchanged since failed attempt ${last.attempt}; nothing to re-verify and no attempt counted. Apply a correction first.` };
  }
  if (last?.result === 'awaiting_review' && last.fingerprint === fp) return { code: 5, text: `${id}: machine checks already passed on this code; waiting for review (see status)` };
  if (lu.state === 'pending') { lu.state = 'in_progress'; lu.owner ||= u.owner; }
  lu.defHash ||= unitDefHash(u);
  lu.runs += 1;
  lu.pendingFingerprint = fp;
  const checks = checksFor(u);
  const { results, skipped } = runTiers(ctx, plan, ledger, u, checks, lu.runs);
  const entry = { run: lu.runs, at: new Date().toISOString(), fingerprint: fp, results: results.map(({ evidence, ...r }) => r), skipped };
  const failed = results.filter((r) => r.ok === false);
  if (failed.length) { const res = recordFailure(ctx, plan, ledger, u, entry, failed); saveLedger(ctx, ledger); return res; }
  const pending = results.filter((r) => r.ok === null);
  if (pending.length) {
    lu.state = 'awaiting_review';
    entry.result = 'awaiting_review';
    lu.history.push(entry);
    event(ledger, id, 'awaiting_review', pending.map((p) => p.pending).join(', '));
    saveLedger(ctx, ledger);
    return { code: 5, text: `${id}: machine checks passed (${results.filter((r) => r.ok).map((r) => r.id).join(', ')}). Review pending from ${[...new Set(pending.map((p) => p.pending))].join(', ')} on fingerprint ${fp}:\n  node .claude/ocean-team/loop.mjs review ${ctx.mission} ${id} --by <who> --pass|--fail --evidence "..."` };
  }
  entry.result = 'pass';
  lu.history.push(entry);
  lu.state = 'passed';
  lu.fingerprint = fp;
  lu.commit = tryGit(ctx.worktree, ['rev-parse', 'HEAD']);
  lu.passedAt = entry.at;
  event(ledger, id, 'passed', `fingerprint ${fp}`);
  saveLedger(ctx, ledger);
  return { code: 0, text: `${id} PASSED: ${results.map((r) => r.id).join(', ')}${skipped.length ? ` (not run: ${skipped.join(', ')})` : ''}` };
}

export function review(ctx, id, { by, pass, criterion, evidence, files } = {}) {
  if (!REVIEWERS.includes(by)) throw usage(`--by must be one of ${REVIEWERS.join(', ')}`);
  if (typeof pass !== 'boolean') throw usage('say --pass or --fail');
  if (!evidence) throw usage('a review carries --evidence (what was checked, or what failed and where)');
  const { plan } = validated(ctx);
  const ledger = loadLedger(ctx);
  const u = findUnit(plan, id);
  const lu = unitState(ledger, id);
  if (lu.state === 'escalated') return { code: 4, text: `${id} is escalated; replan and reset it first` };
  const fp = fingerprint(ctx.worktree, u.files);
  lu.reviews.push({ by, pass, criterion: criterion || null, evidence, files: files || [], fingerprint: fp, at: new Date().toISOString() });
  event(ledger, id, pass ? 'review-pass' : 'review-fail', by);
  if (!pass) {
    const c = checksFor(u).find((x) => x.check === 'review' && x.by === by && (!criterion || x.id === criterion)) || { id: criterion || `review:${by}`, check: 'review', criterion: `review by ${by}` };
    const entry = { run: ++lu.runs, at: new Date().toISOString(), fingerprint: fp, results: [], skipped: [] };
    const res = recordFailure(ctx, plan, ledger, u, entry, [{ id: c.id, check: 'review', by, criterion: c.criterion, evidence: { lines: [evidence], locations: files || [] }, signature: sha1(by + evidence) }]);
    saveLedger(ctx, ledger);
    return res;
  }
  // A pass completes the unit only if the machine checks already passed on this same code.
  const machine = [...lu.history].reverse().find((h) => h.fingerprint === fp && h.result === 'awaiting_review');
  const required = checksFor(u).filter((c) => c.check === 'review');
  const missing = required.filter((c) => !lu.reviews.some((r) => r.by === c.by && r.pass && r.fingerprint === fp && (!r.criterion || r.criterion === c.id)));
  if (machine && !missing.length) {
    lu.state = 'passed'; lu.fingerprint = fp; lu.commit = tryGit(ctx.worktree, ['rev-parse', 'HEAD']); lu.passedAt = new Date().toISOString();
    machine.result = 'pass';
    event(ledger, id, 'passed', `fingerprint ${fp}`);
    saveLedger(ctx, ledger);
    return { code: 0, text: `${id} PASSED (machine checks and ${required.map((r) => r.by).join(', ')} review on fingerprint ${fp})` };
  }
  saveLedger(ctx, ledger);
  return { code: 5, text: `${id}: review recorded. ${machine ? `Still missing: ${missing.map((m) => m.by).join(', ')}` : 'Machine checks have not passed on this code yet: run verify.'}` };
}

export function reset(ctx, id, { reason } = {}) {
  if (!reason) throw usage('reset needs --reason (what changed in the plan)');
  const { plan } = validated(ctx);
  const ledger = loadLedger(ctx);
  const u = findUnit(plan, id);
  const lu = unitState(ledger, id);
  if (lu.state !== 'escalated') return { code: 2, text: `${id} is ${lu.state}; only an escalated unit is reset` };
  if (unitDefHash(u) === lu.escalatedDefHash) return { code: 2, text: `${id}: its definition in units.json is unchanged since it escalated. Replanning changes the unit (files, criteria, dependencies or a split); retrying the same plan is not allowed.` };
  lu.revision += 1; lu.attempts = 0; lu.state = 'in_progress'; lu.defHash = unitDefHash(u);
  lu.history.push({ at: new Date().toISOString(), result: 'reset', reason, revision: lu.revision });
  event(ledger, id, 'reset', reason);
  saveLedger(ctx, ledger);
  return { code: 0, text: `${id} replanned (revision ${lu.revision}); retry budget restored to ${MAX_ATTEMPTS}` };
}

/** Whole-branch verification before the PR. Failures are routed to the unit whose own focused tests fail. */
export function final(ctx) {
  const { plan } = validated(ctx);
  const ledger = loadLedger(ctx);
  const open = plan.units.filter((u) => ledger.units[u.id]?.state !== 'passed').map((u) => `${u.id} (${ledger.units[u.id]?.state || 'pending'})`);
  if (open.length) return { code: 2, text: `not every unit has passed: ${open.join(', ')}` };
  const harness = new Map();
  for (const u of plan.units) for (const c of checksFor(u)) if (c.check === 'harness') harness.set(c.args.join(' '), { ...c, id: `final:harness ${c.args.join(' ')}` });
  const checks = [
    { id: 'final:main', check: 'main', criterion: 'main and the owner\'s checkout are untouched' },
    { id: 'final:scope', check: 'scope', criterion: 'only planned files changed on the branch' },
    { id: 'final:tsc', check: 'tsc', criterion: 'TypeScript compiles' },
    { id: 'final:tests-all', check: 'tests-all', criterion: 'the full unit-test suite passes' },
    { id: 'final:build', check: 'build', criterion: 'an isolated production build succeeds' },
    ...harness.values()
  ];
  ledger.finalRuns = (ledger.finalRuns || 0) + 1;
  const { results, skipped } = runTiers(ctx, plan, ledger, null, checks, ledger.finalRuns);
  const failed = results.filter((r) => r.ok === false);
  const out = [];
  if (!failed.length) {
    ledger.final = { at: new Date().toISOString(), commit: tryGit(ctx.worktree, ['rev-parse', 'HEAD']), results: results.map(({ evidence, ...r }) => r) };
    event(ledger, null, 'final-pass');
    saveLedger(ctx, ledger);
    return { code: 0, text: `FINAL PASS: ${results.map((r) => r.id).join(', ')}. Ready for the Pull Request.` };
  }
  // Route: run each unit's own focused tests; reopen only the units whose tests fail now.
  const routed = [];
  if (failed.some((f) => f.check === 'tests-all' || f.check === 'tsc')) {
    for (const u of plan.units) {
      const own = checksFor(u).filter((c) => c.check === 'tests' || c.check === 'cmd');
      if (!own.length) continue;
      const lu = ledger.units[u.id];
      const rerun = own.map((c) => runCheck(ctx, plan, ledger, u, c, `final${ledger.finalRuns}`)).filter((r) => r.ok === false);
      if (rerun.length) {
        const entry = { run: ++lu.runs, at: new Date().toISOString(), fingerprint: fingerprint(ctx.worktree, u.files), results: [], skipped: [], stage: 'final' };
        const res = recordFailure(ctx, plan, ledger, u, entry, rerun);
        routed.push(u.id);
        out.push(res.text, '');
      }
    }
  }
  event(ledger, null, 'final-fail', failed.map((f) => f.id).join(', '));
  saveLedger(ctx, ledger);
  out.unshift(`FINAL FAIL: ${failed.map((f) => f.id).join(', ')}${skipped.length ? ` (not run: ${skipped.join(', ')})` : ''}`,
    routed.length ? `Returned to their owners: ${routed.join(', ')}. Every other unit stays passed.` : 'No unit\'s own checks fail on their own: the failure is in how units combine. The lead owns it (replan or add a unit).',
    ...failed.flatMap((f) => [`  - [${f.id}] ${f.criterion}`, ...(f.evidence?.lines || []).map((l) => `      ${l}`), `      log: ${f.log}`]), '');
  return { code: 1, text: out.join('\n') };
}

export function baseline(ctx, { shots = false } = {}) {
  const ledger = loadLedger(ctx);
  const checks = [
    { id: 'baseline:tsc', check: 'tsc', criterion: 'tsc' },
    { id: 'baseline:tests-all', check: 'tests-all', criterion: 'full tests' },
    { id: 'baseline:build', check: 'build', criterion: 'isolated build' },
    ...(shots ? [{ id: 'baseline:shots', check: 'harness', args: ['shots', 'after', '1440,390'], criterion: 'section screenshots' }] : [])
  ];
  const results = checks.map((c) => runCheck(ctx, { units: [] }, ledger, { id: 'baseline' }, c, 1));
  const summary = (r) => {
    const t = readFileSync(r.log, 'utf8');
    const m = ['tests', 'pass', 'fail'].map((k) => (t.match(new RegExp(`ℹ ${k} (\\d+)`)) || [])[1]).filter(Boolean);
    return m.length === 3 ? `${m[1]}/${m[0]} pass, ${m[2]} fail` : r.ok ? 'ok' : 'FAILED';
  };
  ledger.baseline = { at: new Date().toISOString(), commit: tryGit(ctx.worktree, ['rev-parse', 'HEAD']), results: results.map((r) => ({ id: r.id, ok: r.ok, summary: summary(r), log: r.log })) };
  saveLedger(ctx, ledger);
  return { code: results.every((r) => r.ok) ? 0 : 1, text: `Baseline at ${String(ledger.baseline.commit).slice(0, 8)} (read this instead of re-running it):\n` + ledger.baseline.results.map((r) => `  ${r.id}: ${r.summary}  (${r.log})`).join('\n') };
}

// ---------------------------------------------------------------------------------------------
// Observability.

export function status(ctx) {
  const plan = loadPlan(ctx);
  const ledger = loadLedger(ctx);
  const v = validatePlan(plan);
  const rows = plan.units.map((u) => {
    const lu = ledger.units[u.id] || { state: 'pending', attempts: 0, history: [] };
    const lastFail = [...(lu.history || [])].reverse().find((h) => h.result === 'fail');
    const lastRun = [...(lu.history || [])].reverse().find((h) => h.at);
    return `| ${u.id} | ${lu.owner || u.owner} | ${v.lanes[u.id]} | ${lu.state} | ${lu.attempts}/${MAX_ATTEMPTS} | ${blockers(plan, ledger, u).join(', ') || '-'} | ${lu.state === 'passed' ? '-' : lastFail ? lastFail.failed.map((f) => f.id).join(', ') : '-'} | ${lastRun ? lastRun.at.slice(11, 19) : '-'} |`;
  });
  const md = [
    `# Mission ${ctx.mission}: unit status`, '',
    `Branch ${ledger.branch}, base ${ledger.base.slice(0, 8)}. Waves: ${v.waves.map((w, i) => `${i + 1}: ${w.join(' ')}`).join(' / ')}`, '',
    '| Unit | Owner | Lane | State | Attempts | Blocked by | Last failed checks | Last run (UTC) |',
    '|---|---|---|---|---|---|---|---|', ...rows, '',
    ledger.baseline ? `Baseline: ${ledger.baseline.results.map((r) => `${r.id.replace('baseline:', '')} ${r.summary}`).join(', ')}` : 'Baseline: not recorded',
    ledger.final ? `Final verification: PASS at ${ledger.final.at}` : 'Final verification: not run',
    'Token and cost figures are not recorded here: the tools do not expose them reliably.'
  ].join('\n');
  writeFileSync(path.join(ctx.runs, 'status.md'), md + '\n');
  return { code: 0, text: md };
}

// ---------------------------------------------------------------------------------------------
// Learning edge: verified, reusable lessons (lessons.md), kept short and checked.

export const MAX_LESSONS = 30;
export const MAX_LESSON_CHARS = 700;
export function parseLessons(md) {
  return String(md).split(/^## /m).slice(1).map((block) => {
    const [head] = block.split(/\r?\n/);
    const m = head.match(/^(L-\d{3})\s+(.+)$/);
    const field = (k) => (block.match(new RegExp(`^- ${k}:\\s*(.+)$`, 'm')) || [])[1]?.trim() || null;
    return { id: m?.[1] || null, title: m?.[2]?.trim() || head.trim(), rule: field('Rule'), evidence: field('Evidence'), verified: field('Verified'), applies: (field('Applies to') || '').split(',').map((s) => s.trim()).filter(Boolean), size: block.length + 3 };
  });
}
export function lintLessons(md) {
  const ls = parseLessons(md), errors = [];
  if (ls.length > MAX_LESSONS) errors.push(`${ls.length} lessons; the cap is ${MAX_LESSONS}: merge or retire old ones before adding`);
  const seen = new Set();
  for (const l of ls) {
    const name = l.id || l.title;
    if (!l.id) errors.push(`"${l.title}": heading must be "## L-NNN <title>"`);
    if (l.id && seen.has(l.id)) errors.push(`${l.id} is used twice`);
    seen.add(l.id);
    for (const k of ['rule', 'evidence', 'verified']) if (!l[k]) errors.push(`${name}: missing "- ${k[0].toUpperCase() + k.slice(1)}:"`);
    if (!l.applies.length) errors.push(`${name}: missing "- Applies to:" (file patterns, "team" or "all")`);
    if (l.verified && !/\d{4}-\d\d-\d\d/.test(l.verified)) errors.push(`${name}: "Verified" needs the date and how it was verified`);
    if (l.size > MAX_LESSON_CHARS) errors.push(`${name}: ${l.size} characters; keep a lesson under ${MAX_LESSON_CHARS}`);
  }
  return { lessons: ls, errors };
}
/** Lessons for a set of files. "all" reaches everyone; "team" (coordination) reaches the lead only. */
export function lessonsFor(md, files, { lead = false } = {}) {
  return parseLessons(md).filter((l) => l.applies.some((a) => a === 'all' || (a === 'team' ? lead : files.some((f) => globMatch(a, f)))));
}
/** Units that failed and then passed: the only candidates for a lesson (cause and fix are verified). */
export function lessonCandidates(ctx) {
  const ledger = loadLedger(ctx);
  return Object.entries(ledger.units).filter(([, lu]) => lu.state === 'passed' && lu.history.some((h) => h.result === 'fail'))
    .map(([id, lu]) => ({ unit: id, attempts: lu.history.filter((h) => h.result === 'fail').map((h) => ({ attempt: h.attempt, failed: h.failed.map((f) => `[${f.id}] ${f.evidence?.lines?.[0] || ''}`) })), passedAt: lu.passedAt, commit: lu.commit }));
}

export function brief(ctx, id) {
  const { plan, v } = validated(ctx);
  const ledger = existsSync(ctx.ledgerFile) ? loadLedger(ctx) : { units: {} };
  const u = findUnit(plan, id);
  const lessons = existsSync(LESSONS_FILE) ? lessonsFor(readFileSync(LESSONS_FILE, 'utf8'), u.files) : [];
  const deps = (u.after || []).map((d) => `${d} (${ledger.units[d]?.state || 'pending'}${ledger.units[d]?.commit ? ` at ${ledger.units[d].commit.slice(0, 8)}` : ''})`);
  return { code: 0, text: [
    `Unit ${u.id}: ${u.title || ''}`,
    `Mission ${ctx.mission}; worktree ${ctx.worktree} (all edits here, absolute paths). Owner ${u.owner}; lane ${v.lanes[u.id]}.`,
    u.goal ? `Goal: ${u.goal}` : null,
    `Files you own (edit only these): ${u.files.join(', ')}`,
    deps.length ? `Builds on: ${deps.join(', ')}` : 'Depends on nothing.',
    'Acceptance criteria (the lead runs them with loop.mjs verify; your confidence is not a check):',
    ...checksFor(u).map((c) => `  - [${c.id}] ${c.criterion}`),
    lessons.length ? 'Verified lessons that apply:' : null,
    ...lessons.map((l) => `  - ${l.id} ${l.title}: ${l.rule}`),
    'Report: files changed, the focused checks you ran with their numbers, anything not done. Do not mark your unit passed yourself.'
  ].filter(Boolean).join('\n') };
}

// ---------------------------------------------------------------------------------------------
// CLI.

function parseArgs(argv) {
  const pos = [], flags = {};
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (!a.startsWith('--')) { pos.push(a); continue; }
    const k = a.slice(2);
    if (['pass', 'fail', 'check', 'shots'].includes(k)) flags[k] = true;
    else if (k === 'for' || k === 'file') { (flags[k] ||= []); while (argv[i + 1] && !argv[i + 1].startsWith('--')) flags[k].push(argv[++i]); }
    else flags[k] = argv[++i];
  }
  return { pos, flags };
}

export function main(argv) {
  const { pos, flags } = parseArgs(argv);
  const [cmd, mission, unit] = pos;
  if (cmd === 'lessons') {
    const md = existsSync(LESSONS_FILE) ? readFileSync(LESSONS_FILE, 'utf8') : '';
    if (flags.candidates) return { code: 0, text: JSON.stringify(lessonCandidates(context({ mission: flags.candidates })), null, 2) };
    if (flags.for) return { code: 0, text: lessonsFor(md, flags.for, { lead: true }).map((l) => `${l.id} ${l.title}\n  ${l.rule}`).join('\n') || '(no lesson applies)' };
    const { lessons, errors } = lintLessons(md);
    return errors.length ? { code: 1, text: `lessons.md has problems:\n  - ${errors.join('\n  - ')}` } : { code: 0, text: `${lessons.length} lessons, format ok (cap ${MAX_LESSONS})` };
  }
  const needUnit = ['start', 'brief', 'verify', 'review', 'reset'].includes(cmd);
  if (!cmd || !mission || (needUnit && !unit)) throw usage('usage: loop.mjs <init|plan|baseline|next|start|brief|verify|review|reset|final|status|lessons> <mission> [unit] (see the header of loop.mjs)');
  const ctx = context({ mission });
  switch (cmd) {
    case 'init': return init(ctx, { base: flags.base });
    case 'plan': {
      const plan = loadPlan(ctx);
      const v = validatePlan(plan);
      const others = listMissions(ctx.root).filter((m) => m.name !== mission).map((m) => {
        const mb = tryGit(m.worktree, ['merge-base', 'main', 'HEAD']);
        return { name: m.name, files: mb ? changedFiles(m.worktree, mb) : [] };
      });
      const warnings = [...v.warnings, ...overlapWarnings(plan.units.flatMap((u) => u.files), others)];
      const text = [
        v.errors.length ? `INVALID:\n  - ${v.errors.join('\n  - ')}` : 'units.json is valid.',
        ...(v.errors.length ? [] : v.waves.map((w, i) => `wave ${i + 1}: ${w.map((id) => `${id} (lane ${v.lanes[id]})`).join(', ')}`)),
        ...warnings.map((w) => `warning: ${w}`)
      ].join('\n');
      return { code: v.errors.length ? 2 : 0, text };
    }
    case 'baseline': return baseline(ctx, { shots: !!flags.shots });
    case 'next': { const n = nextUnits(ctx); return { code: 0, text: n.length ? `ready: ${n.join(', ')}` : 'nothing ready (see status)' }; }
    case 'start': return start(ctx, unit, { owner: flags.owner });
    case 'brief': return brief(ctx, unit);
    case 'verify': return verify(ctx, unit);
    case 'review': return review(ctx, unit, { by: flags.by, pass: flags.pass ? true : flags.fail ? false : undefined, criterion: flags.criterion, evidence: flags.evidence, files: flags.file });
    case 'reset': return reset(ctx, unit, { reason: flags.reason });
    case 'final': return final(ctx);
    case 'status': return status(ctx);
    default: throw usage(`unknown command ${cmd}`);
  }
}

const isMain = process.argv[1] && path.resolve(process.argv[1]).toLowerCase() === fileURLToPath(import.meta.url).toLowerCase();
if (isMain) {
  try {
    const r = main(process.argv.slice(2));
    console.log(r.text);
    process.exit(r.code);
  } catch (e) {
    console.error(e.code === 2 ? e.message : e.stack || String(e));
    process.exit(e.code === 2 ? 2 : 1);
  }
}
