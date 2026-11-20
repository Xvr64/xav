#!/usr/bin/env node
// Ocean team approval gate. Wired in .claude/settings.json (UserPromptSubmit, PreToolUse,
// PostToolUse) and in the ocean-implementer agent's frontmatter.
//
// Lifecycle of a mission (one per Team Lead session):
//   1. `/ocean-team <mission>` opens a mission bound to that session (UserPromptSubmit).
//      From then on that session and everything it spawns is read-only: no source edits, and Bash
//      limited to the audit rules of portfolio-guardian-guard.mjs. Plans go to the runs folder.
//   2. The lead presents the plan with ExitPlanMode while in plan mode. Claude Code shows the plan
//      to the human in its approval dialog; only the human can accept it (teammates cannot).
//      PostToolUse(ExitPlanMode) in the lead session records the approval with the plan's hash and
//      its "Files to modify" list. Nothing else can create an approval: the state folder is
//      write-protected for every tool call.
//   3. Only the `ocean-implementer` agent may then edit, only inside the mission's worktree
//      `.claude/worktrees/ocean-<id>/`, and only the approved files. Anything else is refused and
//      must go back to the human as a revised plan.
// Sessions without a mission are not affected (except: nobody may write the state folder).
//
// `node .claude/hooks/ocean-gate.mjs --self-test` runs the rules against a temporary project.

import { createHash, randomBytes } from 'node:crypto';
import { existsSync, mkdirSync, mkdtempSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { evaluate as auditEvaluate, parseShell } from './portfolio-guardian-guard.mjs';

const WIN = process.platform === 'win32';
const norm = (p) => path.resolve(p).replace(/\\/g, '/').replace(/\/+$/, '');
const cmp = (p) => (WIN ? norm(p).toLowerCase() : norm(p));
const inside = (child, parent) => cmp(child) === cmp(parent) || cmp(child).startsWith(cmp(parent) + '/');

const READ_ONLY_AGENTS = new Set(['portfolio-guardian', 'visual-director', 'motion-engineer']);
const IMPLEMENTER = 'ocean-implementer';
const EDIT_TOOLS = new Set(['Edit', 'Write', 'MultiEdit', 'NotebookEdit']);
const REQUIRED_SECTIONS = ['Proposed changes', 'Files to modify', 'Expected improvements', 'Regression risks', 'Testing strategy', 'Complexity'];

/** The main checkout, also when called from inside .claude/worktrees/<name>/. */
export function mainRoot(dir) {
  const d = norm(dir);
  const i = d.toLowerCase().indexOf('/.claude/worktrees/');
  return i >= 0 ? d.slice(0, i) : d;
}

const paths = (root) => {
  const base = path.join(root, '.claude', 'ocean-team');
  return {
    state: path.join(base, 'state'),
    missions: path.join(base, 'state', 'missions'),
    pending: path.join(base, 'state', 'pending'),
    approvals: path.join(base, 'state', 'approvals'),
    runs: path.join(base, 'runs'),
    worktrees: path.join(root, '.claude', 'worktrees')
  };
};
const readJson = (f) => { try { return JSON.parse(readFileSync(f, 'utf8')); } catch { return null; } };
const writeJson = (f, v) => { mkdirSync(path.dirname(f), { recursive: true }); writeFileSync(f, JSON.stringify(v, null, 2) + '\n'); };
const safeId = (s) => String(s || '').replace(/[^A-Za-z0-9_-]/g, '').slice(0, 80);
const sha = (s) => createHash('sha256').update(String(s)).digest('hex');

/** Paths in the "Files to modify" section, as repo-relative forward-slash strings. */
export function planFiles(plan) {
  const m = String(plan).match(/^#{2,3}\s*Files to modify[^\n]*\n([\s\S]*?)(?=^#{1,3}\s|\s*$(?![\s\S]))/m);
  if (!m) return [];
  const files = new Set();
  for (const line of m[1].split('\n')) {
    if (!/^\s*[-*]/.test(line)) continue;
    const tick = line.match(/`([^`]+)`/);
    if (!tick) continue;
    const f = tick[1].trim().replace(/\\/g, '/').replace(/^\.\//, '');
    if (f && !f.includes('..') && !/^[a-z]:|^\//i.test(f) && !/[*?]/.test(f)) files.add(f);
  }
  return [...files];
}
export const missingSections = (plan) => REQUIRED_SECTIONS.filter((s) => !new RegExp(`^#{1,3}\\s*${s}`, 'im').test(String(plan)));

const deny = (reason) => ({ deny: reason });
const allow = () => ({});

/** Core decision. Returns { deny?: string, context?: string, writes?: [[file, json]] }. */
export function decide(input, root) {
  const P = paths(root);
  const event = input.hook_event_name;
  const session = safeId(input.session_id);
  const agentType = input.agent_type || null;
  const isAgent = !!input.agent_id;
  const mission = session ? readJson(path.join(P.missions, `${session}.json`)) : null;

  // ---- UserPromptSubmit: open a mission -----------------------------------------------------
  if (event === 'UserPromptSubmit') {
    const prompt = String(input.prompt || '');
    if (!/^\s*\/ocean-team\b/.test(prompt) && !prompt.includes('<!-- ocean-team-mission -->')) return allow();
    if (mission) return { context: `Ocean mission ${mission.id} is already open in this session (Team Lead). Source edits stay locked until the human approves a plan in the ExitPlanMode dialog.` };
    const d = new Date();
    const id = `${d.toISOString().slice(0, 10)}-${randomBytes(3).toString('hex')}`;
    const record = { id, session, openedAt: d.toISOString(), mission: prompt.replace(/^\s*\/ocean-team\s*/, '').slice(0, 500) };
    return {
      writes: [[path.join(P.missions, `${session}.json`), record], [path.join(P.runs, id, 'mission.json'), record]],
      context: `Ocean mission ${id} opened by the approval gate. This session is the Team Lead and is now read-only: ` +
        `no source edits, Bash limited to the audit rules. Write reports and the plan under .claude/ocean-team/runs/${id}/. ` +
        `Present the final plan with ExitPlanMode while in plan mode; only the human's approval there unlocks implementation, ` +
        `and only for the ocean-implementer agent in .claude/worktrees/ocean-${id}/.`
    };
  }

  const tool = String(input.tool_name || '');
  const ti = input.tool_input || {};

  // ---- PostToolUse(ExitPlanMode): the human accepted the plan ----------------------------------
  if (event === 'PostToolUse') {
    if (tool !== 'ExitPlanMode' || isAgent || !mission) return allow();
    if (input.permission_mode === 'plan') return allow(); // still planning: not an approval
    const plan = String(ti.plan || '');
    const pending = readJson(path.join(P.pending, `${session}.json`));
    if (!pending || pending.planSha !== sha(plan)) {
      return { context: 'Ocean gate: the plan that was accepted does not match the one checked before the dialog; no approval recorded. Present it again.' };
    }
    const approval = {
      missionId: mission.id, session, planSha: pending.planSha, files: pending.files,
      approvedAt: new Date().toISOString(), modeAfterApproval: input.permission_mode ?? null,
      worktree: `.claude/worktrees/ocean-${mission.id}`, branch: `ocean/${mission.id}`
    };
    return {
      writes: [[path.join(P.approvals, `${mission.id}.json`), approval], [path.join(P.runs, mission.id, 'approval.json'), approval]],
      context: `Human approval recorded for mission ${mission.id} (plan sha256 ${pending.planSha.slice(0, 12)}). ` +
        `Create the worktree with: git worktree add .claude/worktrees/ocean-${mission.id} -b ocean/${mission.id}. ` +
        `Only ocean-implementer teammates may edit, only there, only these files: ${pending.files.join(', ')}. ` +
        `Edits outside that list are refused: bring them back to the human as a revised plan.`
    };
  }

  if (event !== 'PreToolUse') return allow();

  // ---- Everyone, always: the state folder is written by this hook only --------------------------
  if (EDIT_TOOLS.has(tool) && ti.file_path && inside(path.resolve(input.cwd || root, ti.file_path), P.state)) {
    return deny('the ocean-team approval state is written only by the approval gate.');
  }
  if (tool === 'Bash' && /ocean-team[\\/]+state/i.test(String(ti.command || ''))) {
    return deny('commands that touch the ocean-team approval state are not allowed (read it with the Read tool).');
  }

  // ---- Implementer: approved files inside the mission worktree only -----------------------------
  if (agentType === IMPLEMENTER) {
    if (EDIT_TOOLS.has(tool)) {
      const target = norm(path.resolve(input.cwd || root, String(ti.file_path || ti.notebook_path || '')));
      const m = target.match(/\/\.claude\/worktrees\/ocean-([A-Za-z0-9-]+)\/(.+)$/i);
      if (!m) return deny(`edits are only allowed inside an approved mission worktree (.claude/worktrees/ocean-<id>/), not ${target}.`);
      const approval = readJson(path.join(P.approvals, `${safeId(m[1])}.json`));
      if (!approval) return deny(`mission ${m[1]} has no human-approved plan.`);
      const rel = m[2];
      const ok = approval.files.some((f) => (WIN ? f.toLowerCase() === rel.toLowerCase() : f === rel));
      if (!ok) return deny(`"${rel}" is not in the approved "Files to modify" list (${approval.files.join(', ')}). Stop and ask the Team Lead to bring a revised plan to the human.`);
      return allow();
    }
    if (tool === 'Bash') return gitWriteCheck(ti.command) ?? auditCheck(input, root);
    if (tool === 'ExitPlanMode') return deny('only the Team Lead presents plans to the human.');
    return allow();
  }

  // ---- Read-only specialists: same rules as their own guard (in case frontmatter hooks are absent)
  if (READ_ONLY_AGENTS.has(agentType)) {
    if (tool === 'ExitPlanMode') return deny('only the Team Lead presents plans to the human.');
    return auditCheck(input, root);
  }

  // ---- Not part of a mission: unaffected --------------------------------------------------------
  if (!mission) return allow();

  // ---- Team Lead session (and anything else running in it) --------------------------------------
  if (tool === 'ExitPlanMode') {
    if (isAgent) return deny('only the Team Lead presents plans to the human.');
    if (input.permission_mode !== 'plan') return deny('enter plan mode (EnterPlanMode) first, so the plan goes through the human approval dialog.');
    const plan = String(ti.plan || '');
    const missing = missingSections(plan);
    if (missing.length) return deny(`the plan is missing sections: ${missing.join(', ')}.`);
    const files = planFiles(plan);
    if (!files.length) return deny('the "Files to modify" section must list each file as a bullet with the path in backticks.');
    return {
      writes: [[path.join(P.pending, `${session}.json`), { missionId: mission.id, planSha: sha(plan), files, at: new Date().toISOString() }],
        [path.join(P.runs, mission.id, 'plan-pending.md'), plan]]
    };
  }
  if (EDIT_TOOLS.has(tool)) {
    const target = path.resolve(input.cwd || root, String(ti.file_path || ti.notebook_path || ''));
    if (inside(target, path.join(P.runs, mission.id))) return allow();
    return deny(`ocean mission ${mission.id}: the Team Lead and its read-only teammates do not edit files. Write notes under .claude/ocean-team/runs/${mission.id}/; implementation is done by ocean-implementer after human approval.`);
  }
  if (tool === 'Bash') {
    const cmd = String(ti.command || '').trim();
    const wt = cmd.match(/^git worktree add (\S+) -b (\S+)(?: HEAD)?$/);
    if (wt) {
      const approval = readJson(path.join(P.approvals, `${mission.id}.json`));
      if (!approval) return deny('no human-approved plan yet; the worktree is created only after approval.');
      if (wt[1].replace(/\\/g, '/').replace(/^\.\//, '') !== approval.worktree || wt[2] !== approval.branch) {
        return deny(`use exactly: git worktree add ${approval.worktree} -b ${approval.branch}`);
      }
      return allow();
    }
    return gitWriteCheck(cmd) ?? auditCheck(input, root);
  }
  if (/^mcp__Claude_Browser__(navigate|preview_start)$/.test(tool)) return auditCheck(input, root);
  return allow();
}

function auditCheck(input, root) {
  const reason = auditEvaluate({ ...input, tool_name: input.tool_name }, root);
  return reason ? deny(reason) : allow();
}
function gitWriteCheck(command) {
  try {
    for (const { words } of parseShell(String(command || ''))) {
      const w = words.filter((x) => !/^[A-Za-z_][A-Za-z0-9_]*=/.test(x));
      if (w[0] !== 'git') continue;
      let i = 1;
      while (['--no-pager', '-P', '-C'].includes(w[i])) i += w[i] === '-C' ? 2 : 1;
      if (/^(push|merge|rebase|reset|checkout|switch|commit|cherry-pick|revert|am|apply|clean|restore|rm|mv|pull|fetch|worktree|tag|stash|update-ref|filter-branch|gc)$/.test(w[i] || '')) {
        if (w[i] === 'worktree' && w[i + 1] === 'list') continue;
        return deny(`"git ${w[i]}" is not allowed during an ocean mission; committing, merging, pushing and deploying need the human's separate authorisation.`);
      }
    }
  } catch { /* the audit check will refuse it */ }
  return null;
}

// ---- Self-test --------------------------------------------------------------------------------
function selfTest() {
  const root = norm(mkdtempSync(path.join(tmpdir(), 'ocean-gate-test-')));
  let failed = 0, total = 0;
  const apply = (r) => { for (const [f, v] of r.writes || []) typeof v === 'string' ? (mkdirSync(path.dirname(f), { recursive: true }), writeFileSync(f, v)) : writeJson(f, v); return r; };
  const check = (name, input, expectDeny) => {
    total++;
    const r = apply(decide({ cwd: root, ...input }, root));
    if (!!r.deny !== expectDeny) { failed++; console.log(`FAIL ${name}: ${r.deny ? 'denied: ' + r.deny : 'allowed'}`); }
    return r;
  };
  const lead = { session_id: 'lead1' };
  const other = { session_id: 'other9' };
  const pre = (extra) => ({ hook_event_name: 'PreToolUse', ...extra });
  const plan = ['# Plan', '## Proposed changes', 'x', '## Files to modify', '- `profileMemories.ts`', '- `profileItinerary.css` (styles)', '## Expected improvements', 'x', '## Regression risks', 'x', '## Testing strategy', 'x', '## Complexity', 'Medium', '', 'Do you approve this implementation plan?'].join('\n');

  check('no mission: lead may edit (unaffected)', pre({ ...lead, tool_name: 'Edit', tool_input: { file_path: `${root}/magneticCV.ts` } }), false);
  check('anyone: state folder is write-protected', pre({ ...other, tool_name: 'Write', tool_input: { file_path: `${root}/.claude/ocean-team/state/approvals/x.json` } }), true);
  check('anyone: bash on state folder refused', pre({ ...other, tool_name: 'Bash', tool_input: { command: 'echo {} > .claude/ocean-team/state/approvals/x.json' } }), true);
  const opened = check('mission opens on /ocean-team', { ...lead, hook_event_name: 'UserPromptSubmit', prompt: '/ocean-team Improve the Profile reveal' }, false);
  const id = readJson(path.join(paths(root).missions, 'lead1.json'))?.id;
  if (!id || !opened.context?.includes(id)) { failed++; console.log('FAIL mission record not written'); }
  check('other prompt: no mission', { ...other, hook_event_name: 'UserPromptSubmit', prompt: 'hello' }, false);
  check('lead edit of source refused', pre({ ...lead, tool_name: 'Edit', tool_input: { file_path: `${root}/profileMemories.ts` } }), true);
  check('lead write in runs folder allowed', pre({ ...lead, tool_name: 'Write', tool_input: { file_path: `${root}/.claude/ocean-team/runs/${id}/notes.md` } }), false);
  check('lead read-only bash allowed', pre({ ...lead, tool_name: 'Bash', tool_input: { command: 'git log --oneline -5 && node --test profileItinerary.test.mjs' } }), false);
  check('lead sed -i refused', pre({ ...lead, tool_name: 'Bash', tool_input: { command: 'sed -i s/a/b/ profileMemories.ts' } }), true);
  check('lead git commit refused', pre({ ...lead, tool_name: 'Bash', tool_input: { command: 'git commit -am x' } }), true);
  check('lead git push refused', pre({ ...lead, tool_name: 'Bash', tool_input: { command: 'git push origin HEAD' } }), true);
  check('other session unaffected', pre({ ...other, tool_name: 'Edit', tool_input: { file_path: `${root}/profileMemories.ts` } }), false);
  check('worktree before approval refused', pre({ ...lead, tool_name: 'Bash', tool_input: { command: `git worktree add .claude/worktrees/ocean-${id} -b ocean/${id}` } }), true);
  check('ExitPlanMode outside plan mode refused', pre({ ...lead, tool_name: 'ExitPlanMode', permission_mode: 'default', tool_input: { plan } }), true);
  check('ExitPlanMode with missing sections refused', pre({ ...lead, tool_name: 'ExitPlanMode', permission_mode: 'plan', tool_input: { plan: '# Plan\n## Proposed changes\nx' } }), true);
  check('teammate ExitPlanMode refused', pre({ ...lead, agent_id: 'a1', agent_type: 'visual-director', tool_name: 'ExitPlanMode', permission_mode: 'plan', tool_input: { plan } }), true);
  check('implementer edit before approval refused', pre({ ...lead, agent_id: 'b1', agent_type: IMPLEMENTER, tool_name: 'Edit', tool_input: { file_path: `${root}/.claude/worktrees/ocean-${id}/profileMemories.ts` } }), true);
  check('lead ExitPlanMode in plan mode passes to the human dialog', pre({ ...lead, tool_name: 'ExitPlanMode', permission_mode: 'plan', tool_input: { plan } }), false);
  check('dialog rejected / still plan mode: no approval', { ...lead, hook_event_name: 'PostToolUse', tool_name: 'ExitPlanMode', permission_mode: 'plan', tool_input: { plan } }, false);
  if (existsSync(path.join(paths(root).approvals, `${id}.json`))) { failed++; console.log('FAIL approval recorded while still in plan mode'); }
  check('teammate PostToolUse does not approve', { ...lead, agent_id: 'a1', agent_type: 'motion-engineer', hook_event_name: 'PostToolUse', tool_name: 'ExitPlanMode', permission_mode: 'default', tool_input: { plan } }, false);
  if (existsSync(path.join(paths(root).approvals, `${id}.json`))) { failed++; console.log('FAIL teammate created an approval'); }
  check('tampered plan does not approve', { ...lead, hook_event_name: 'PostToolUse', tool_name: 'ExitPlanMode', permission_mode: 'default', tool_input: { plan: plan + '\n- `magneticCV.ts`' } }, false);
  if (existsSync(path.join(paths(root).approvals, `${id}.json`))) { failed++; console.log('FAIL tampered plan approved'); }
  check('human accepts: approval recorded', { ...lead, hook_event_name: 'PostToolUse', tool_name: 'ExitPlanMode', permission_mode: 'acceptEdits', tool_input: { plan } }, false);
  const approval = readJson(path.join(paths(root).approvals, `${id}.json`));
  if (!approval || approval.files.join() !== 'profileMemories.ts,profileItinerary.css') { failed++; console.log('FAIL approval content', approval); }
  check('worktree with exact command allowed', pre({ ...lead, tool_name: 'Bash', tool_input: { command: `git worktree add .claude/worktrees/ocean-${id} -b ocean/${id}` } }), false);
  check('worktree elsewhere refused', pre({ ...lead, tool_name: 'Bash', tool_input: { command: `git worktree add ../x -b ocean/${id}` } }), true);
  check('lead still cannot edit source after approval', pre({ ...lead, tool_name: 'Edit', tool_input: { file_path: `${root}/profileMemories.ts` } }), true);
  const imp = { ...lead, agent_id: 'b1', agent_type: IMPLEMENTER };
  check('implementer edits approved file in worktree', pre({ ...imp, tool_name: 'Edit', tool_input: { file_path: `${root}/.claude/worktrees/ocean-${id}/profileMemories.ts` } }), false);
  check('implementer edits unapproved file refused', pre({ ...imp, tool_name: 'Edit', tool_input: { file_path: `${root}/.claude/worktrees/ocean-${id}/magneticCV.ts` } }), true);
  check('implementer edits main checkout refused', pre({ ...imp, tool_name: 'Write', tool_input: { file_path: `${root}/profileMemories.ts` } }), true);
  check('implementer other worktree refused', pre({ ...imp, tool_name: 'Edit', tool_input: { file_path: `${root}/.claude/worktrees/ocean-zzz/profileMemories.ts` } }), true);
  check('implementer runs tests', pre({ ...imp, tool_name: 'Bash', tool_input: { command: `cd .claude/worktrees/ocean-${id} && node --test profileItinerary.test.mjs` } }), false);
  check('implementer git commit refused', pre({ ...imp, tool_name: 'Bash', tool_input: { command: 'git -C x commit -m y' } }), true);
  check('implementer sed refused', pre({ ...imp, tool_name: 'Bash', tool_input: { command: 'sed -i s/a/b/ profileMemories.ts' } }), true);
  check('guardian guarded by gate too', pre({ ...other, agent_id: 'c1', agent_type: 'portfolio-guardian', tool_name: 'Bash', tool_input: { command: 'whoami' } }), true);
  check('guardian external navigation refused', pre({ ...other, agent_id: 'c1', agent_type: 'portfolio-guardian', tool_name: 'mcp__Claude_Browser__navigate', tool_input: { url: 'https://example.com' } }), true);
  check('mainRoot from worktree', {}, false);
  if (mainRoot(`${root}/.claude/worktrees/ocean-x/sub`) !== root) { failed++; console.log('FAIL mainRoot'); }
  if (planFiles(plan).join() !== 'profileMemories.ts,profileItinerary.css') { failed++; console.log('FAIL planFiles', planFiles(plan)); }
  rmSync(root, { recursive: true, force: true });
  console.log(`${total - failed}/${total} gate cases passed`);
  process.exit(failed ? 1 : 0);
}

// ---- Entry point -------------------------------------------------------------------------------
const isMain = process.argv[1] && cmp(process.argv[1]) === cmp(fileURLToPath(import.meta.url));
if (isMain) {
  if (process.argv.includes('--self-test')) selfTest();
  let input = null;
  try { input = JSON.parse(readFileSync(0, 'utf8') || '{}'); } catch { /* refused below */ }
  if (!input) { process.stderr.write('ocean gate: could not read the hook input; refused by default.\n'); process.exit(2); }
  const root = mainRoot(process.env.CLAUDE_PROJECT_DIR || input.cwd || process.cwd());
  let result;
  try { result = decide(input, root); } catch (e) { process.stderr.write(`ocean gate error (refused by default): ${e.message}\n`); process.exit(2); }
  for (const [f, v] of result.writes || []) typeof v === 'string' ? (mkdirSync(path.dirname(f), { recursive: true }), writeFileSync(f, v)) : writeJson(f, v);
  if (result.deny) {
    process.stderr.write(`ocean approval gate: ${result.deny}\n`);
    process.exit(2);
  }
  if (result.context) {
    process.stdout.write(JSON.stringify({ hookSpecificOutput: { hookEventName: input.hook_event_name, additionalContext: result.context } }));
  }
  process.exit(0);
}
