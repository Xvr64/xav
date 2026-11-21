# Xavier Hery portfolio: working rules for Claude Code

## Git workflow (permanent)
- **Never modify or commit to `main`.** All work happens on a feature branch in its own worktree.
  `main` changes only when the owner merges a Pull Request; Cloudflare deploys `main`.
- Ocean Team missions have readable names: `npm run ocean -- <name>` (e.g. `scroll-improvements`)
  creates `.claude/worktrees/ocean-<name>/` on branch `ocean/<name>` (with `node_modules` linked) and
  makes it the current mission; a unique internal id stays in `runs/<name>/worktree.json`. Run
  `/ocean-team <mission>` or `/ocean-team continue <name>` from the main checkout; the playbook is
  `.claude/skills/ocean-team/SKILL.md`. Never rename or move a mission worktree while agents work in it.
- **Ocean Preview**: the owner types `npm run ocean:preview` in the main checkout to see the active
  mission at http://localhost:5181 (`.claude/ocean-team/preview.mjs` detects the worktree; `-- <name>`
  picks one). Port 5181 is reserved for Ocean Preview.
- Push only the feature branch, open a PR to `main`, and stop. Never merge, force-push or deploy
  without the owner's explicit approval. `.claude/hooks/protect-main.mjs` enforces the main-branch
  rules; `.claude/settings.json` denies force pushes, pushes to main, `gh pr merge` and wrangler deploys.
- The main checkout often holds the owner's uncommitted files (e.g. `artifacts/`): never stage,
  revert or clean them.

## Build and test
- `npx tsc --noEmit` and `node --test` (run from the worktree root). `node --test` skips `.claude/`:
  Ocean Team tooling is tested with `node --test ".claude/ocean-team/*.test.mjs"` and
  `node .claude/hooks/protect-main.mjs --self-test`.
- Ocean Team missions verify their work with `node .claude/ocean-team/loop.mjs` (units, checks,
  bounded retries; see the playbook). Verified lessons from past missions: `.claude/ocean-team/lessons.md`.
- Build checks: `npx vite build --outDir /tmp/portfolio-guardian/<id>/dist --emptyOutDir`. Do not
  rebuild the tracked `dist/`; Cloudflare builds it.
- Headless harness: `node dev/phase2.mjs shots|whales|verify|perf` and
  `node dev/record-magnetic-cv.mjs --pacing`, always with `PHASE2_OUT=/tmp/portfolio-guardian/...`
  (the default output is the tracked `artifacts/`).
- Dev server for agent previews: `npx vite --port 5182 --strictPort` (5181 is Ocean Preview; other
  ports may be stale servers).
