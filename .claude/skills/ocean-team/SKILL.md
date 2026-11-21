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

## Phase 0: set up

1. Mission name: `continue <name>` reuses an existing run: run `npm run ocean -- <name>` (it reattaches
   the worktree if needed and makes it the current mission), then read its `plan.md`, `findings.md`,
   `team-messages.md` and do not redo finished planning. Otherwise pick a short readable name that is
   not taken (`npm run ocean -- --list`), run `npm run ocean -- <name>` and use the name it prints.
2. Record `git status --short` of the main checkout; it must be unchanged at the end.
3. Baseline in the worktree: `npx tsc --noEmit`, `node --test` (from the worktree root),
   isolated build. Note the numbers in `runs/<id>/report.md`.

## Phase 1: research and plan (skip when continuing a finished plan)

1. Spawn `director` (visual-director), `motion` (motion-engineer) and `guardian`
   (portfolio-guardian). Each prompt has the mission, the id, the worktree path, the run folder and
   the other names. They are read-only advisers: they inspect, measure and propose, talk directly to
   each other (at least one full round of challenge), and send the lead a final report.
2. Write `runs/<id>/findings.md` (final reports, disagreements and how they ended) and
   `runs/<id>/team-messages.md`.
3. Write `runs/<id>/plan.md` with: Proposed changes (frame by frame), Files to modify, Expected
   improvements, Regression risks, Testing strategy, Complexity and file ownership.
4. Ask the owner only about **taste decisions** that change what visitors see and that the team
   cannot settle from evidence (AskUserQuestion, few options). Record answers in `findings.md`.
   Then continue; do not wait for a plan approval.

## Phase 2: implementation

1. Work stage by stage in the plan's order. Spawn `builder` (ocean-implementer), and `builder-2`
   etc. for disjoint file sets, with a brief naming the stage, the files and the gates; or implement
   directly when a stage is small. Implementers work only inside the worktree.
2. Each stage passes its gates before the next starts: `npx tsc --noEmit`, the full `node --test`,
   and the stage's harness checks. Then commit it on `ocean/<id>` with a message that says what the
   visitor gets and how it was verified.
3. `guardian` reviews each stage independently (diff, tests, harness). Its findings are advice to
   the lead: fix what is real, record what is deferred. It never blocks or approves by itself.
4. A plan change that alters what visitors see beyond the plan goes to the owner as one short
   question; ordinary engineering decisions do not.

## Phase 3: validation

In the worktree: tsc, full tests, isolated build with a chunk-size diff against the baseline,
`node dev/phase2.mjs shots|verify|perf` and `node dev/record-magnetic-cv.mjs --pacing` with
`PHASE2_OUT` under `/tmp/portfolio-guardian/<id>/`, at 1440/1280/768/390/320, plus tab switch,
reduced motion and back/forward. Before/after screenshots from the baseline and the branch.

## Phase 4: Pull Request (then stop)

1. `git -C .claude/worktrees/ocean-<id> push -u origin ocean/<id>` (only the feature branch).
2. Open the PR to `main` (`gh pr create` if `gh` is installed; otherwise give the owner the
   `https://github.com/<owner>/<repo>/compare/main...ocean/<id>?expand=1` link and the PR text).
3. Write `runs/<id>/report.md` and tell the owner: summary of changes, test and performance
   results, before/after screenshots, how to preview (`npm run ocean:preview` in the project folder; it opens Ocean
   Preview at http://localhost:5181), and that merging and deploying wait for their approval.
4. Shut the teammates down. After the owner merges, `git worktree remove .claude/worktrees/ocean-<id>`.
