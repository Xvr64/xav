---
name: ocean-team
description: Lead the ocean agent team (visual-director, motion-engineer, portfolio-guardian, ocean-implementer) through research, a plan, autonomous implementation in an isolated worktree on a feature branch, independent review, and a Pull Request to main. Use only when the user runs /ocean-team.
disable-model-invocation: true
argument-hint: "<mission | continue <name>>"
---

# Ocean team: Team Lead protocol (autonomous mode)

You are the **Team Lead**. Mission: **$ARGUMENTS**

Since 2026-11-21 the team works **autonomously**: no approval gate and no per-stage approvals.
The owner's single review point is the **Pull Request** into `main`. The old approval gate and
the read-only guard hook are archived in `.claude/ocean-team/archive/approval-gate-2026-11-21/`.

`L` below means `node .claude/ocean-team/loop.mjs` (run from the main checkout; it finds the
mission worktree from `runs/<id>/worktree.json`).

## Fixed rules

- **Every mission runs in its own worktree and branch, named readably**: `.claude/worktrees/ocean-<id>/`
  on `ocean/<id>`, created by `npm run ocean -- <id>` (`.claude/ocean-team/new-mission.mjs`). Here
  `<id>` is the mission **name**: 2 to 4 kebab-case words chosen from the mission, such as
  `portfolio-v2` or `scroll-improvements` (the launcher slugifies whatever it is given and keeps a
  unique internal id in `runs/<id>/worktree.json`). Older missions are named by their date id. It
  links `node_modules`, opens `.claude/ocean-team/runs/<id>/` for the plan and reports, and makes the
  mission current for **Ocean Preview** (`npm run ocean:preview`, port 5181, the owner's preview).
  Agents preview on 5182 (`whales-3d`) or 5174, never 5181. Never rename or move a mission's
  worktree or branch while agents work in it.
- **Never modify or commit to `main`.** `.claude/hooks/protect-main.mjs` refuses commits, merges,
  pulls and rebases while on main, pushes that target main, force pushes, `gh pr merge` and
  deploys. The main checkout's uncommitted files belong to the owner and are never touched.
- **Never merge the PR or deploy.** Cloudflare deploys `main`; that happens only when the owner
  merges, after explicitly approving.
- Do not rebuild the tracked `dist/`. Build checks go to `/tmp/portfolio-guardian/<id>/dist`.
  Harness output goes under `PHASE2_OUT=/tmp/portfolio-guardian/<id>/...`, never `artifacts/`.

## How work is verified (read once)

A mission is a small graph of **units**, each improved inside a **loop**: produce, verify, correct,
re-verify. The deterministic parts are code, `node .claude/ocean-team/loop.mjs` (`L` below):

- **Unit** (`runs/<id>/units.json`): one owner, the files it may edit, the units it really needs
  (`after`), and acceptance criteria written **before** coding. Test every `after` edge: name what
  crosses it (a file, a harness, a measured number). If nothing does, drop the edge; the units run
  in parallel. Two units that can run at the same time never share a file (`L plan` refuses it).
- **Checks** run cheapest first and stop at the first failing tier: main/scope, then tsc + the unit's
  focused tests and commands, then the full suite + isolated build, then harness runs, then reviews.
- **Lanes** come from blast radius, not confidence. Lane 1 (contained): focused checks. Lane 2
  (Magnetic CV, cinematic scroll, Globe, whales, ocean, global CSS/layout, build or team config):
  adds the full suite, a build, and a `guardian` review of the exact code (a review of older code
  does not count). Lane 3 (merge, deploy, history rewrite, deleting data) never opens in a mission.
- **Not a check:** "looks good", an agent's confidence, "no errors were raised". A subjective
  visual criterion is a `review` by `director` with screenshot paths, recorded as judgement.

Schema (JSON; `id` short; `check` one of `tests`, `cmd`, `harness`, `review`):

```json
{ "units": [
  { "id": "A", "title": "Tab switch lands the transition", "owner": "builder", "after": ["S0"],
    "files": ["magneticCV.ts", "magneticCV.test.mjs"],
    "accept": [
      { "id": "A-1", "check": "tests", "files": ["magneticCV.test.mjs"], "criterion": "hidden mid-glide lands at its destination" },
      { "id": "A-2", "check": "harness", "args": ["verify", "cv"], "expect": "VERIFY PASS", "criterion": "every word on the last screen is set" },
      { "id": "A-3", "check": "cmd", "run": ["node", "dev/record-magnetic-cv.mjs", "--pacing"], "criterion": "pacing within 10% of baseline" },
      { "id": "A-4", "check": "review", "by": "guardian", "criterion": "back/forward and hash stay consistent" } ] } ],
  "allow": ["optional extra paths any unit may touch, e.g. a shared test helper"] }
```

## Phase 0: set up

1. Mission name: `continue <name>` reuses an existing run: run `npm run ocean -- <name>` (it reattaches
   the worktree if needed and makes it the current mission), then read its `plan.md`, `findings.md`,
   `team-messages.md` and do not redo finished planning. Otherwise pick a short readable name that is
   not taken (`npm run ocean -- --list`), run `npm run ocean -- <name>` and use the name it prints.
2. `L init <id>`: records the mission base, `main` and the main checkout's uncommitted files.
3. `L baseline <id> --shots`: tsc, full tests, isolated build and headless shots at 1440/390, run
   **once**. Advisers read `runs/<id>/ledger.json` / the logs instead of re-running them.
4. Read `.claude/ocean-team/lessons.md` (verified lessons from earlier missions).

## Phase 1: research and plan (skip when continuing a finished plan)

1. Spawn `director` (visual-director), `motion` (motion-engineer) and `guardian`
   (portfolio-guardian) **in parallel**, each with its own lens and the baseline paths. Each prompt has
   the mission, the id, the worktree path, the run folder and the other names. They are read-only
   advisers. `guardian` writes its risk map before reading the others' proposals. One round of
   challenge is required; further rounds only while an "unsafe" objection or a factual disagreement
   is open. Each sends the lead one final report.
2. Write `runs/<id>/findings.md` (final reports, disagreements and how they ended) and
   `runs/<id>/team-messages.md`.
3. Write `runs/<id>/plan.md` (Proposed changes frame by frame, Expected improvements, Regression
   risks, Complexity) and `runs/<id>/units.json` (files, owners, dependencies and acceptance
   criteria replace the prose "Files to modify" and "Testing strategy"). `L plan <id>` must say
   valid; it prints the parallel waves and warns about files another live mission also changed.
4. Ask the owner only about **taste decisions** that change what visitors see and that the team
   cannot settle from evidence (AskUserQuestion, few options). Record answers in `findings.md`.
   Then continue; do not wait for a plan approval.

## Phase 2: implementation loop

1. `L next <id>` lists units whose dependencies passed and whose files are free. For each, `L start
   <id> <unit>` and hand its owner `L brief <id> <unit>` (scope, criteria, relevant lessons). Spawn
   `builder`, `builder-2`, ... (ocean-implementer) for units that can run at the same time; do small
   units yourself. Implementers work only inside the worktree.
2. When an owner reports, **the lead** runs `L verify <id> <unit>`; the owner's own test run is not
   the check.
   - Exit 0: passed. Commit the unit on `ocean/<id>` (what the visitor gets, how it was verified)
     and start the next ready units. Passed units are never redone because another one failed.
   - Exit 1: send the printed **correction packet** unchanged to that unit's owner only (unit,
     failed criterion, evidence, location, scope, retries left). Scope failures go to you.
   - Exit 3: nothing changed since the last failure; nothing was re-run. Get a correction first.
   - Exit 4: three failed attempts. The fault is in the plan: replan the unit (split it, change the
     approach or the criteria) in `units.json`, then `L reset <id> <unit> --reason "..."`. A reset
     without a changed unit is refused. Ask the owner only if the replan changes what visitors see.
   - Exit 5: machine checks passed; `guardian` (or `director`) reviews the exact code and records it:
     `L review <id> <unit> --by guardian --pass|--fail --evidence "..." [--file f:line]`. A real
     finding is a `--fail`: it becomes a correction packet and uses the same retry budget.
3. `L status <id>` (also `runs/<id>/status.md`) shows owner, lane, state, attempts, blockers and
   the last failed checks. Do not send status pings between agents; read the status instead.
4. A plan change that alters what visitors see beyond the plan goes to the owner as one short
   question; ordinary engineering decisions do not.

## Phase 3: final verification

1. `L final <id>`: tsc, full tests, isolated build and every harness check the units declared, on
   the whole branch. A failure is routed to the unit whose own focused checks now fail (it re-enters
   its loop; the others stay passed); a failure no unit owns comes back to you to replan.
2. Visual evidence the scripts cannot judge: before/after screenshots from the baseline and the
   branch at 1440/1280/768/390/320 (`PHASE2_OUT` under `/tmp/portfolio-guardian/<id>/`), tab switch
   (simulated hide), reduced motion and back/forward, reviewed by `director` and `guardian`.
3. Learning edge: `L lessons --candidates <id>` lists units that failed and then passed. Promote a
   lesson to `.claude/ocean-team/lessons.md` only when its cause and fix are verified and it will
   matter again; merge or retire instead of duplicating. `L lessons --check` must pass.

## Phase 4: Pull Request (then stop)

1. `git -C .claude/worktrees/ocean-<id> push -u origin ocean/<id>` (only the feature branch).
2. Open the PR to `main` (`gh pr create` if `gh` is installed; otherwise give the owner the
   `https://github.com/<owner>/<repo>/compare/main...ocean/<id>?expand=1` link and the PR text).
3. Write `runs/<id>/report.md` and tell the owner: summary of changes, the unit status table, test
   and performance results, before/after screenshots, how to preview (`npm run ocean:preview` in the
   project folder; it opens Ocean Preview at http://localhost:5181), and that merging and deploying
   wait for their approval.
4. Shut the teammates down. After the owner merges, `git worktree remove .claude/worktrees/ocean-<id>`.
