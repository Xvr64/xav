# Xavier Hery portfolio: working rules for Claude Code

## Git workflow (permanent)
- **Never modify or commit to `main`.** All work happens on a feature branch in its own worktree.
  `main` changes only when the owner merges a Pull Request; Cloudflare deploys `main`.
- Ocean Team missions: `npm run ocean -- [id]` creates `.claude/worktrees/ocean-<id>/` on branch
  `ocean/<id>` (with `node_modules` linked). Run `/ocean-team <mission>` or `/ocean-team continue <id>`
  from the main checkout; the playbook is `.claude/skills/ocean-team/SKILL.md`.
- Push only the feature branch, open a PR to `main`, and stop. Never merge, force-push or deploy
  without the owner's explicit approval. `.claude/hooks/protect-main.mjs` enforces the main-branch
  rules; `.claude/settings.json` denies force pushes, pushes to main, `gh pr merge` and wrangler deploys.
- The main checkout often holds the owner's uncommitted files (e.g. `artifacts/`): never stage,
  revert or clean them.

## Build and test
- `npx tsc --noEmit` and `node --test` (run from the worktree root).
- Build checks: `npx vite build --outDir /tmp/portfolio-guardian/<id>/dist --emptyOutDir`. Do not
  rebuild the tracked `dist/`; Cloudflare builds it.
- Headless harness: `node dev/phase2.mjs shots|whales|verify|perf` and
  `node dev/record-magnetic-cv.mjs --pacing`, always with `PHASE2_OUT=/tmp/portfolio-guardian/...`
  (the default output is the tracked `artifacts/`).
- Dev server for previews: `npx vite --port 5181 --strictPort` (other ports may be stale servers).
