# Ocean Team: verified lessons

Rules learned from real failures whose cause and fix were verified. The Team Lead reads this at the
start of a mission; `loop.mjs brief` hands each owner only the lessons whose "Applies to" matches the
unit's files ("all" goes to everyone; "team" lessons are about coordination and stay with the lead).

Promote a lesson only when a failure was resolved and verified (`loop.mjs lessons --candidates
<mission>` lists units that failed and then passed), and only when it will matter again. Retire or
merge a lesson instead of adding a near-duplicate. Format and cap (30 lessons, 700 characters
each) are checked by `node .claude/ocean-team/loop.mjs lessons --check` and by `loop.test.mjs`.
Performance rules already in the agent definitions (root restyles, rAF ownership) are not repeated here.

## L-001 A harness assertion fails: check whether the UI changed before calling it a regression
- Rule: When `dev/phase2.mjs verify` fails, look up the asserted element's history (`git log -S`) first. A stale assertion is fixed in the harness as its own unit before feature work, so it cannot hide or imitate real failures.
- Evidence: mission 2026-11-21-a3451d, `verify.log` to `verify4.log`: "corner holds 2 controls" had been 3 since fd80a51; verify stopped at the first failure, so it ran four times to reach the real one (18 unset words).
- Verified: 2026-11-21, the stale value traced to fd80a51; stage 0 of the mission fixed the assertion.
- Applies to: dev/, team

## L-002 Agent-team teammates may have no browser tools
- Rule: Before spawning teammates who judge visuals, run `loop.mjs baseline <mission> --shots` so headless frames exist in the validation root, and mark judgements from still frames as static. Do not assume `mcp__Claude_Browser__*` reaches a teammate.
- Evidence: mission 2026-11-21-a3451d findings.md "Guard canary": visual-director had only Read, Grep, Glob and SendMessage; no teammate had a browser tool.
- Verified: 2026-11-21, canary run by all three teammates.
- Applies to: team

## L-003 Tab-hide behaviour is proven with a simulated hide, not an in-app browser tab switch
- Rule: Test hide and return by overriding `document.hidden` / `visibilityState` and dispatching `visibilitychange` (and `pagehide` / `pageshow` for back-forward cache). An in-app browser tab switch does not fire `visibilitychange`.
- Evidence: mission 2026-11-21-a3451d plan.md, regression risk 2; stage 0 added a simulated hide-mid-transition check to `dev/phase2-verify.mjs`.
- Verified: 2026-11-21, observed while planning stage A.
- Applies to: magneticCV*, cinematicScroll*, JourneyGlobe*, ambientWhale*, asciiOcean*, dev/

## L-004 Edit files with the Edit tool, not inline Python or sed
- Rule: Multi-line source edits go through the Edit tool. Shell-quoted Python/sed/node patches break on quoting and on mixed CRLF/LF line endings and cost several retries each.
- Evidence: mission 2026-11-21-a3451d builder transcript, 16:33 to 16:40: five failed shell edits (unterminated quote, pattern not found) in `dev/phase2-verify.mjs` and `magneticCV.test.mjs`; git warns "LF will be replaced by CRLF" for `magneticCV.test.mjs`.
- Verified: 2026-11-21, the same patches applied cleanly afterwards; reproduced while building loop.mjs.
- Applies to: all

## L-005 A quality gate must never restrict where the lead writes
- Rule: Quality checks run as commands that can fail (`loop.mjs`); they never block tools or file paths. Permission rules stay limited to main, merges, deploys, force pushes and destructive git (protect-main, the settings deny list).
- Evidence: mission 2026-11-21-a3451d findings.md "Gate defect": the old ocean-gate denied the write to Claude Code's plan file, so ExitPlanMode saw an empty plan and refused it.
- Verified: 2026-11-21, the gate was retired (archive/approval-gate-2026-11-21) and plans now present normally.
- Applies to: .claude/, team

## L-006 Files agents write during a mission live outside `.claude/`
- Rule: Claude Code asks before every Write/Edit under `.claude/` (except `.claude/worktrees/`), even in acceptEdits, and no allow rule lifts it. Mission notes go in `.ocean/runs/<id>/`; never route around the prompt with shell redirects.
- Evidence: 2026-11-21 fresh `claude -p` sessions: Write to `.claude/ocean-team/runs/...` refused as "a sensitive file", also with `--allowedTools`; Write and Edit in `.ocean/runs/...` and `.claude/worktrees/...` succeeded. Docs: permission-modes, "Protected paths".
- Verified: 2026-11-21, reproduced in the project before and after moving the run folder.
- Applies to: .claude/, team

## L-007 Run one loop.mjs command at a time
- Rule: Never start `start`, `review`, `reset` or another `verify` while a `verify` or `final` is running. verify loads the ledger at its start and rewrites the whole file at its end, so anything recorded meanwhile is silently lost. Queue reviews and record them when the run ends.
- Evidence: mission stabilize-baseline findings.md: `start S5` was erased by a concurrent S2 verify (2026-11-21); reviews were deferred while later verify chains ran.
- Verified: 2026-11-22, reproduced once and avoided for every later unit.
- Applies to: team

## L-008 Each Vite server gets its own cacheDir and runs from its own tree
- Rule: When several agents serve trees that share `node_modules` through a junction, give every server a separate `cacheDir` (a `--config` file in the agent's output folder), `--strictPort`, and `hmr: false` for scripted runs; start it from its tree's folder, since Tailwind globs resolve from the cwd.
- Evidence: mission stabilize-baseline: a shared `node_modules/.vite` mixed two React copies ("Invalid hook call", blank page); builder-s2's pages full-reloaded mid-scenario when other builders edited the worktree.
- Verified: 2026-11-22, later reviewers ran in parallel without blank pages.
- Applies to: dev/, team

## L-009 Wall-clock budgets in unit tests take the best of several batches
- Rule: A test asserting "X runs in under N ms" times several short batches and asserts on the fastest, never a single mean: reviewers' headless browsers share the CPU during loop verify.
- Evidence: mission stabilize-baseline, S7 attempt 1: whaleVeil.test.mjs failed at 2.009 ms against 2 ms while three headless Chromes ran; real cost ~0.28 ms; passed 5/5 alone.
- Verified: 2026-11-22, best of five batches passed under the same load; a real regression still fails every batch.
- Applies to: *.test.mjs
