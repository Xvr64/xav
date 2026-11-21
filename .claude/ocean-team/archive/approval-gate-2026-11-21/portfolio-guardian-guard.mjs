#!/usr/bin/env node
// PreToolUse guard shared by the read-only portfolio agents in .claude/agents/
// (portfolio-guardian, visual-director, motion-engineer), as subagents or agent-team teammates.
// It runs only while one of those agents is active and enforces the audit contract:
//
//   * Tools: an allow-list. Anything else (Edit, Write, PowerShell, preview_stop, ...) is refused,
//     so a mistake in the agent's `tools:` list cannot silently widen what it may do.
//   * Browser: navigation and preview_start by URL only to local dev hosts.
//   * Bash: a quote-aware parser splits the command into simple commands; each one must match a
//     rule below. Command/process substitution, subshells and heredocs are refused outright.
//   * Writes: only inside the validation root, a directory OUTSIDE the repository in the OS temp
//     dir (`/tmp/portfolio-guardian/...`; on Windows Git Bash /tmp is %TEMP%). Nothing written
//     there can be committed, and the tracked dist/ and artifacts/ stay untouched.
//
// Exit code 2 blocks the tool call and shows the reason to the subagent.
// `node .claude/hooks/portfolio-guardian-guard.mjs --self-test` checks the rules (no side effects).

import { appendFileSync, mkdirSync, readFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const WIN = process.platform === 'win32';
const ROOT_NAME = 'portfolio-guardian';

// ---- Tool allow-list ---------------------------------------------------------------------------
const BROWSER_READ_ONLY = new Set([
  'preview_start', 'preview_list', 'preview_logs', 'navigate', 'resize_window', 'computer',
  'read_page', 'get_page_text', 'find', 'javascript_tool', 'read_console_messages',
  'read_network_requests', 'tabs_context', 'tabs_create', 'tabs_select'
]);
const CORE_TOOLS = new Set(['Read', 'Grep', 'Glob', 'Bash']);
// Agent plumbing: handing the report back, team messages and the shared task list change no files
// in the repository. Blocking SubagentHandback would stop the agent from delivering its report.
const TEAM_TOOLS = new Set(['SubagentHandback', 'SendMessage', 'TaskCreate', 'TaskGet', 'TaskList', 'TaskUpdate']);
const IMPLEMENTER_EDIT_TOOLS = new Set(['Edit', 'Write', 'MultiEdit']);

// ---- Validation root ---------------------------------------------------------------------------
const validationRoots = () => {
  const roots = [path.join(tmpdir(), ROOT_NAME)];
  if (!WIN) roots.push(`/tmp/${ROOT_NAME}`, `/private/tmp/${ROOT_NAME}`);
  return roots.map((r) => path.resolve(r));
};
const norm = (p) => (WIN ? p.toLowerCase() : p);
const inside = (child, parent) => {
  const rel = path.relative(norm(parent), norm(child));
  return rel === '' || (!rel.startsWith('..') && !path.isAbsolute(rel));
};

/** Returns an error string, or '' when `p` is an absolute path inside the validation root. */
export function checkValidationPath(p, projectDir) {
  if (!p) return 'a path is required.';
  if (/[$~*?[\]{}]/.test(p)) return `"${p}" uses variables, ~ or globs; give a literal path.`;
  if (p.split(/[\\/]+/).includes('..')) return `"${p}" contains "..".`;
  let q = p;
  if (WIN) {
    if (/^\/tmp(\/|$)/i.test(q)) q = tmpdir() + q.slice(4);           // Git Bash /tmp -> %TEMP%
    else if (/^\/[a-z](\/|$)/i.test(q)) q = `${q[1]}:${q.slice(2) || '/'}`; // /c/Users -> c:/Users
    if (!/^[a-z]:[\\/]/i.test(q)) return `"${p}" must be an absolute path such as /tmp/${ROOT_NAME}/<run>.`;
  } else if (!q.startsWith('/')) return `"${p}" must be an absolute path such as /tmp/${ROOT_NAME}/<run>.`;
  const abs = path.resolve(q);
  if (projectDir && inside(abs, path.resolve(projectDir))) return `"${p}" is inside the repository.`;
  if (!validationRoots().some((r) => inside(abs, r))) {
    return `"${p}" is outside the validation root (/tmp/${ROOT_NAME}/...).`;
  }
  return '';
}

// ---- Shell parsing -----------------------------------------------------------------------------
/**
 * Splits a bash command into simple commands: [{ words: string[], redirects: [{op, target}] }].
 * Throws on constructs the guard refuses to reason about.
 */
export function parseShell(src) {
  const cmds = [];
  let words = [], redirects = [], word = '', inWord = false, pendingRedirect = null;
  const endWord = () => {
    if (!inWord) return;
    if (pendingRedirect) { redirects.push({ op: pendingRedirect, target: word }); pendingRedirect = null; }
    else words.push(word);
    word = ''; inWord = false;
  };
  const endCmd = () => {
    endWord();
    if (pendingRedirect) throw new Error('a redirection has no target.');
    if (words.length || redirects.length) cmds.push({ words, redirects });
    words = []; redirects = [];
  };
  for (let i = 0; i < src.length; i++) {
    const c = src[i];
    if (c === "'") {
      const j = src.indexOf("'", i + 1);
      if (j < 0) throw new Error('unterminated quote.');
      word += src.slice(i + 1, j); inWord = true; i = j; continue;
    }
    if (c === '"') {
      let j = i + 1;
      for (; j < src.length && src[j] !== '"'; j++) {
        if (src[j] === '\\' && j + 1 < src.length) { j++; word += src[j]; continue; }
        if (src[j] === '`' || (src[j] === '$' && src[j + 1] === '(')) throw new Error('command substitution is not allowed.');
        word += src[j];
      }
      if (j >= src.length) throw new Error('unterminated quote.');
      inWord = true; i = j; continue;
    }
    if (c === '\\') {
      if (src[i + 1] === '\n') { i++; continue; }
      word += src[i + 1] ?? ''; inWord = true; i++; continue;
    }
    if (c === '`' || (c === '$' && src[i + 1] === '(')) throw new Error('command substitution is not allowed.');
    if (c === '(' || c === ')' || c === '{' && !inWord && /[\s;&|]|^$/.test(src[i + 1] ?? '')) {
      throw new Error('subshells and command groups are not allowed.');
    }
    if (c === '>' || c === '<') {
      if (src[i + 1] === '(') throw new Error('process substitution is not allowed.');
      if (c === '<' && src[i + 1] === '<') throw new Error('heredocs and here-strings are not allowed.');
      // A word made only of digits right before the operator is a file descriptor (2>...).
      let fd = '';
      if (inWord && /^\d+$/.test(word)) { fd = word; word = ''; inWord = false; }
      endWord();
      let op = c;
      if (src[i + 1] === '>' && c === '>') { op = '>>'; i++; }
      if (src[i + 1] === '&') { // 2>&1, >&2, <&0
        let j = i + 2; let dup = '';
        while (/\d|-/.test(src[j] ?? '')) dup += src[j++];
        if (!dup) throw new Error(`unsupported redirection "${op}&".`);
        redirects.push({ op: `${fd}${op}&`, target: dup }); i = j - 1; continue;
      }
      if (c === '>' && src[i + 1] === '|') i++;
      pendingRedirect = fd + op; continue;
    }
    if (c === ';' || c === '|' || c === '&' || c === '\n') {
      if (c === '&' && src[i + 1] === '>') throw new Error('"&>" redirection is not allowed; use > and 2>&1.');
      endCmd();
      if ((c === '|' || c === '&') && src[i + 1] === c) i++;
      continue;
    }
    if (/\s/.test(c)) { endWord(); continue; }
    if (c === '#' && !inWord) { const j = src.indexOf('\n', i); i = j < 0 ? src.length : j - 1; continue; }
    word += c; inWord = true;
  }
  endCmd();
  return cmds;
}

// ---- Command rules -----------------------------------------------------------------------------
const SIMPLE = new Set([
  'ls', 'cat', 'head', 'tail', 'wc', 'grep', 'egrep', 'fgrep', 'rg', 'cut', 'tr', 'diff', 'cmp',
  'stat', 'du', 'pwd', 'echo', 'printf', 'true', 'false', 'test', '[', 'basename', 'dirname',
  'realpath', 'readlink', 'which', 'date', 'jq', 'cd', 'nl', 'column', 'sort', 'uniq', 'tree',
  'file', 'md5sum', 'sha1sum', 'sha256sum', 'od', 'xxd', 'hexdump', 'sleep', 'env', 'printenv'
]);
const READ_ONLY_GIT = new Set([
  'status', 'log', 'diff', 'show', 'branch', 'ls-files', 'ls-tree', 'blame', 'rev-parse', 'grep',
  'shortlog', 'describe', 'cat-file', 'merge-base', 'name-rev', 'reflog', 'rev-list', 'stash',
  'config', 'remote', 'tag', 'for-each-ref', 'show-ref', 'whatchanged', 'range-diff', 'worktree'
]);
const SAFE_ENV = new Set(['PHASE2_OUT', 'PHASE2_OCEAN', 'NODE_ENV', 'CI', 'FORCE_COLOR', 'NO_COLOR', 'LC_ALL', 'LANG', 'TZ']);
const HARNESS = new Map([
  ['dev/phase2.mjs', /^(shots|whales|perf|verify)$/],
  ['dev/record-magnetic-cv.mjs', null]
]);
const TEST_FLAGS_WITH_VALUE = new Set(['--test-name-pattern', '--test-skip-pattern', '--test-reporter', '--test-concurrency', '--test-timeout', '--test-shard']);
const TEST_FLAGS = new Set(['--test', '--test-only', '--experimental-test-coverage', '--no-warnings', '--experimental-strip-types', '--test-force-exit', ...TEST_FLAGS_WITH_VALUE]);

function checkCommand({ words, redirects }, ctx) {
  // Redirections: stdin from anywhere, fd duplication, /dev/null, or a file in the validation root.
  for (const { op, target } of redirects) {
    if (/&$/.test(op) || op.startsWith('<') || /^\d*<$/.test(op)) continue;
    if (target === '/dev/null' || /^nul$/i.test(target)) continue;
    const err = checkValidationPath(target, ctx.projectDir);
    if (err) return `output redirection ${err}`;
  }

  const w = [...words];
  const env = {};
  while (w.length && /^[A-Za-z_][A-Za-z0-9_]*=/.test(w[0])) {
    const [name, ...v] = w.shift().split('=');
    if (!SAFE_ENV.has(name)) return `setting ${name} is not allowed.`;
    env[name] = v.join('=');
  }
  if (!w.length) return '';
  const [cmd, ...args] = w;
  const has = (re) => args.some((a) => re.test(a));
  const positionals = args.filter((a) => !a.startsWith('-'));

  if (env.PHASE2_OUT !== undefined && !(cmd === 'node' && HARNESS.has(args[0]))) {
    return 'PHASE2_OUT only applies to the dev/ harness scripts.';
  }

  switch (cmd) {
    case 'git': {
      let a = [...args];
      while (a[0] === '--no-pager' || a[0] === '-P' || a[0] === '-C') a.splice(0, a[0] === '-C' ? 2 : 1);
      const [sub, ...rest] = a;
      if (!READ_ONLY_GIT.has(sub)) return `"git ${sub ?? ''}" changes the repository or the network; only read-only git is allowed.`;
      if (rest.some((x) => /^(--output|--ext-diff|-O|--open-files-in-pager)(=|$)/.test(x))) return 'git output files, pagers and external diff tools are not allowed.';
      const pos = rest.filter((x) => !x.startsWith('-'));
      if (sub === 'branch' || sub === 'tag') {
        const listing = rest.some((x) => /^(-l|--list|-a|-r|-v|-vv|--all|--remotes|--show-current|--contains|--no-contains|--merged|--no-merged|--points-at|--sort|--format|--column|--no-column|-n\d*)(=|$)/.test(x));
        if (rest.some((x) => /^(-[dDmMcCfuse]|--delete|--move|--copy|--force|--set-upstream|--set-upstream-to|--unset-upstream|--edit-description|--track|--annotate|--sign|--message|-m)(=|$)/.test(x))) return `git ${sub} may only list.`;
        if (pos.length && !listing) return `git ${sub} with a name would create one; only listing is allowed.`;
      }
      if (sub === 'stash' && !['list', 'show'].includes(rest[0])) return 'git stash may only list or show.';
      if (sub === 'worktree' && rest[0] !== 'list') return 'git worktree may only list.';
      if (sub === 'reflog' && rest[0] && !rest[0].startsWith('-') && rest[0] !== 'show') return 'git reflog may only show.';
      if (sub === 'remote' && rest.some((x) => !/^(-v|--verbose|show|get-url)$/.test(x) && !x.startsWith('origin'))) return 'git remote may only list.';
      if (sub === 'config' && !rest.some((x) => /^(--get|--get-all|--get-regexp|--list|-l|--show-origin)$/.test(x))) return 'git config may only read (--get / --list).';
      return '';
    }
    case 'find':
      if (has(/^-(delete|exec|execdir|ok|okdir|fprint|fprint0|fprintf|fls)$/)) return 'find may only list files.';
      return '';
    case 'sort':
      if (has(/^(-o|--output)(=|$)|^-[a-zA-Z]*o/)) return 'sort -o writes a file.';
      return '';
    case 'uniq':
      if (positionals.length > 1) return 'uniq with an output file is not allowed.';
      return '';
    case 'tree':
      if (has(/^-o$/)) return 'tree -o writes a file.';
      return '';
    case 'rg':
      if (has(/^--pre(-glob)?(=|$)/)) return 'rg --pre runs other programs.';
      return '';
    case 'date':
      if (has(/^(-s|--set)(=|$)/)) return 'date may not set the clock.';
      return '';
    case 'file':
      if (has(/^(-C|--compile)$/)) return 'file -C writes a file.';
      return '';
    case 'env':
    case 'printenv':
      if (positionals.some((p) => !/^[A-Za-z_][A-Za-z0-9_]*$/.test(p)) || has(/^-/)) return `${cmd} may only print variables.`;
      return '';
    case 'mkdir':
    case 'rm': {
      const flags = args.filter((a) => a.startsWith('-'));
      const okFlags = cmd === 'mkdir' ? /^(-p|--parents|-v)$/ : /^(-r|-f|-rf|-fr|-R|-v|--recursive|--force)$/;
      if (flags.some((f) => !okFlags.test(f))) return `${cmd} flags are limited.`;
      if (!positionals.length) return `${cmd} needs a path.`;
      for (const p of positionals) {
        const err = checkValidationPath(p, ctx.projectDir);
        if (err) return `${cmd} is only allowed in the validation root: ${err}`;
      }
      return '';
    }
    case 'node': {
      if (args.length === 1 && /^(--version|-v)$/.test(args[0])) return '';
      if (HARNESS.has(args[0])) {
        const taskRe = HARNESS.get(args[0]);
        if (env.PHASE2_OUT === undefined) return `${args[0]} writes into the tracked artifacts/ unless PHASE2_OUT=/tmp/${ROOT_NAME}/<run> is set.`;
        const err = checkValidationPath(env.PHASE2_OUT, ctx.projectDir);
        if (err) return `PHASE2_OUT ${err}`;
        const extra = args.slice(1);
        if (taskRe && extra[0] && !taskRe.test(extra[0])) return `unknown ${args[0]} task "${extra[0]}".`;
        if (extra.some((x) => x.startsWith('-') && x !== '--pacing')) return 'harness flags are limited to --pacing.';
        return '';
      }
      if (args[0] !== '--test' && !args.includes('--test')) {
        return 'node may only run the unit tests (`node --test ...`) or the dev/phase2.mjs and dev/record-magnetic-cv.mjs harness with PHASE2_OUT.';
      }
      for (let i = 0; i < args.length; i++) {
        const a = args[i];
        if (a.startsWith('-')) {
          const name = a.split('=')[0];
          if (!TEST_FLAGS.has(name)) return `node flag ${name} is not allowed with --test.`;
          if (TEST_FLAGS_WITH_VALUE.has(name) && !a.includes('=')) i++;
          continue;
        }
        if (/(^|[\\/])dev[\\/]/.test(a) || !/\.test\.(mjs|js|ts|mts)$/.test(a)) return `"${a}" is not a unit test file (*.test.mjs).`;
      }
      return '';
    }
    case 'npx': {
      let a = [...args];
      while (a[0] === '--no-install' || a[0] === '--no') a.shift();
      const [bin, ...rest] = a;
      if (bin === 'tsc') {
        if (rest.length === 1 && /^(--version|-v)$/.test(rest[0])) return '';
        if (!rest.includes('--noEmit')) return 'tsc must run with --noEmit.';
        if (rest.some((x) => /^(--build|-b|--watch|-w|--outDir|--outFile|--declarationDir|--incremental|--tsBuildInfoFile|--generateTrace|--generateCpuProfile|--init)(=|$)/.test(x))) {
          return 'tsc may only type-check.';
        }
        return '';
      }
      if (bin === 'vite') {
        if (rest.length === 1 && /^(--version|-v)$/.test(rest[0])) return '';
        if (rest[0] !== 'build') return 'vite may only run `vite build --outDir /tmp/portfolio-guardian/<run>` (use preview_start for the dev server).';
        let outDir;
        for (let i = 1; i < rest.length; i++) {
          const [name, inline] = rest[i].split(/=(.*)/s);
          if (name === '--outDir') { outDir = inline ?? rest[++i]; continue; }
          if (/^(--emptyOutDir|--sourcemap|--minify|--logLevel|-l|--mode|-m|--clearScreen|--force)$/.test(name)) {
            if (inline === undefined && /^(--logLevel|-l|--mode|-m)$/.test(name)) i++;
            continue;
          }
          return `vite build option ${name} is not allowed (no --config, --watch or other roots).`;
        }
        if (outDir === undefined) return 'vite build must set --outDir inside the validation root; the default would overwrite the tracked dist/.';
        const err = checkValidationPath(outDir, ctx.projectDir);
        return err ? `vite build --outDir ${err}` : '';
      }
      return 'npx is limited to `tsc --noEmit` and `vite build --outDir /tmp/portfolio-guardian/<run>`.';
    }
    case 'npm':
      if (['ls', 'list', 'outdated', 'view', 'explain', 'why', '--version', '-v'].includes(args[0])) return '';
      return `"npm ${args[0] ?? ''}" is not allowed (no install, run, build, publish or deploy).`;
    case 'sed': case 'awk': case 'gawk': case 'perl': case 'python': case 'python3': case 'py':
    case 'bash': case 'sh': case 'zsh': case 'pwsh': case 'powershell': case 'cmd': case 'xargs':
    case 'eval': case 'exec': case 'source': case '.': case 'tee': case 'cp': case 'mv': case 'touch':
    case 'chmod': case 'ln': case 'curl': case 'wget': case 'wrangler': case 'vite': case 'tsc':
      return `${cmd} can write files, run other programs or reach the network; it is not available to the audit.`;
    default:
      return SIMPLE.has(cmd) ? '' : `"${cmd}" is not on the audit allow-list.`;
  }
}

/** Returns '' when allowed, otherwise the reason it is refused. */
export function evaluate(input, projectDir = process.env.CLAUDE_PROJECT_DIR || input.cwd || process.cwd(), profile = 'audit') {
  const tool = String(input.tool_name || '');
  const args = input.tool_input || {};
  const browser = tool.match(/^mcp__Claude_Browser__(.+)$/);

  if (browser) {
    const name = browser[1];
    if (!BROWSER_READ_ONLY.has(name)) return `the browser tool "${name}" is not available to the audit.`;
    if ((name === 'navigate' || name === 'preview_start') && args.url && !['back', 'forward'].includes(args.url)) {
      const url = String(args.url);
      const scheme = /^([a-z][a-z0-9+.-]*):\/\//i.exec(url)?.[1]?.toLowerCase()
        ?? /^(javascript|data|file|about|blob|chrome|view-source|mailto):/i.exec(url)?.[1]?.toLowerCase();
      if (scheme && !['http', 'https'].includes(scheme)) return `browser navigation must use http(s) (got "${scheme}:").`;
      let host = '';
      try { host = new URL(scheme ? url : `http://${url}`).hostname; } catch { /* refuse below */ }
      if (!/^(localhost|127\.0\.0\.1|\[::1\]|[a-z0-9-]+\.localhost)$/i.test(host)) return `browser navigation is limited to local dev servers (got "${host || args.url}").`;
    }
    return '';
  }
  if (TEAM_TOOLS.has(tool)) return '';
  // The implementer profile may edit; where and which files is decided by ocean-gate.mjs.
  if (profile === 'implementer' && IMPLEMENTER_EDIT_TOOLS.has(tool)) return '';
  if (!CORE_TOOLS.has(tool)) return `the tool "${tool}" is not available to the audit (it may change files or state).`;
  if (tool !== 'Bash') return '';
  if (args.run_in_background) return 'background commands are not allowed; long runs must finish inside the call.';

  const command = String(args.command || '').trim();
  if (!command) return 'empty command.';
  let cmds;
  try { cmds = parseShell(command); } catch (e) { return e.message; }
  for (const c of cmds) {
    const reason = checkCommand(c, { projectDir });
    if (reason) return reason;
  }
  return '';
}

// ---- Self-test ---------------------------------------------------------------------------------
function selfTest() {
  const P = WIN ? 'C:/repo' : '/repo';
  const T = '/tmp/portfolio-guardian';
  const allow = [
    'git status --short', 'git --no-pager log --oneline -20', 'git diff main...HEAD -- magneticCV.ts',
    'git branch', 'git branch -a', 'git branch --show-current', 'git branch --list "chore/*"',
    'git log -p -- magneticCV.ts | head -200', 'git show HEAD:magneticCV.ts | grep -n "TRANSITION"',
    'grep -n "a|b" magneticCV.ts', "grep -nE '=>|&&' magneticCV.ts", 'rg -n "visibilitychange" -g "*.ts"',
    'ls -la dist 2>/dev/null', 'cat package.json', 'find . -name "*.test.mjs" -not -path "./node_modules/*"',
    'node --test', 'node --test magneticCV.test.mjs', 'node --test --test-name-pattern "snap" magneticCV.test.mjs',
    'node --test magneticCV.test.mjs 2>&1 | tail -40', 'npx tsc --noEmit', 'npx tsc --noEmit -p tsconfig.json 2>&1 | head',
    `mkdir -p ${T}/run1`, `npx vite build --outDir ${T}/run1/dist --emptyOutDir`,
    `npx vite build --outDir=${T}/run1/dist --emptyOutDir --logLevel warn 2>&1 | tail -20`,
    `PHASE2_OUT=${T}/run1/shots node dev/phase2.mjs shots after 1440,390`,
    `PHASE2_OUT=${T}/run1/rec node dev/record-magnetic-cv.mjs --pacing`,
    `git diff --stat > ${T}/run1/diff.txt`, `rm -rf ${T}/run1`, `ls -la ${T}/run1/dist/assets | sort -k5 -n`,
    'cd "C:/Users/someone/Code Website" && git status', 'du -sh dist/assets/* | sort -h', 'git config --get user.name',
    'npm ls --depth=0', 'git stash list', 'date +%s', 'echo done # trailing comment'
  ];
  const deny = [
    'git commit -m x', 'git push', 'git add .', 'git checkout main', 'git branch new-branch', 'git branch -D x',
    'git reset --hard', 'git stash', 'git -C /x commit -m y','git tag v1', 'git config user.name x', 'git -c core.pager=sh log',
    'npm run build', 'npm install', 'npm ci', 'npx vite build', 'npx vite build --outDir dist',
    `npx vite build --outDir ${P}/dist`, 'npx vite build --outDir /tmp/other', `npx vite build --outDir ${T}/../x`,
    `npx vite build --config evil.mjs --outDir ${T}/a`, 'npx vite', 'npx wrangler deploy', 'wrangler deploy',
    'npx tsc', 'npx tsc --noEmit --build', 'node dev/phase2.mjs shots', 'node dev/magnetic-cv-validation.mjs',
    `PHASE2_OUT=artifacts/x node dev/phase2.mjs shots`, `PHASE2_OUT=${T}/a node dev/fable-audit.mjs`,
    `PHASE2_OUT=${T}/a node dev/phase2.mjs ../../evil`, 'node -e "require(\'fs\').writeFileSync(\'x\',\'y\')"',
    'node --test --import ./evil.mjs', 'node --test dev/x.test.mjs', 'node scripts/build.mjs',
    'echo hi > notes.txt', 'echo hi >> magneticCV.ts', 'echo hi &> x', 'cat a | tee b', 'cp a b', 'mv a b', 'touch x',
    'rm -rf dist', `rm -rf ${T}/*`, 'rm -rf /tmp', 'mkdir artifacts/new', 'sed -i s/a/b/ x.ts', 'awk 1 x',
    'python3 -c 1', 'bash -c "ls"', 'ls $(whoami)', 'ls `whoami`', 'diff <(ls) <(ls)', 'cat <<EOF\nx\nEOF',
    '(cd dist && ls)', 'find . -delete', 'find . -exec rm {} ;', 'sort -o out.txt in.txt', 'uniq in out',
    'rg --pre ./x foo', 'curl https://example.com', 'whoami', 'PATH=/x ls', 'NODE_OPTIONS=--require=x node --test',
    'GIT_EXTERNAL_DIFF=x git diff', 'xargs rm', 'grep "x', 'env FOO=1 node -e 1', 'npx --yes cowsay'
  ];
  const browserAllow = [
    { tool_name: 'mcp__Claude_Browser__navigate', tool_input: { url: 'http://localhost:5174/?magneticDebug=1' } },
    { tool_name: 'mcp__Claude_Browser__navigate', tool_input: { url: 'localhost:5174/#experience' } },
    { tool_name: 'mcp__Claude_Browser__navigate', tool_input: { url: 'back' } },
    { tool_name: 'mcp__Claude_Browser__preview_start', tool_input: { name: 'portfolio' } },
    { tool_name: 'mcp__Claude_Browser__javascript_tool', tool_input: { action: 'javascript_exec', text: 'document.title' } },
    { tool_name: 'mcp__Claude_Browser__computer', tool_input: { action: 'screenshot' } },
    { tool_name: 'Read', tool_input: { file_path: 'x' } }, { tool_name: 'Grep', tool_input: {} },
    { tool_name: 'SendMessage', tool_input: { to: 'motion', message: 'x' } }, { tool_name: 'TaskUpdate', tool_input: {} },
    { tool_name: 'TaskList', tool_input: {} }, { tool_name: 'SubagentHandback', tool_input: {} },
    { tool_name: 'Bash', tool_input: { command: 'git -C "/c/Users/someone/Code Website" status --short' } }
  ];
  const browserDeny = [
    { tool_name: 'mcp__Claude_Browser__navigate', tool_input: { url: 'https://xavierhery.com' } },
    { tool_name: 'mcp__Claude_Browser__navigate', tool_input: { url: 'file:///C:/Users' } },
    { tool_name: 'mcp__Claude_Browser__navigate', tool_input: { url: 'http://localhost.evil.com/' } },
    { tool_name: 'mcp__Claude_Browser__preview_start', tool_input: { url: 'https://dash.cloudflare.com' } },
    { tool_name: 'mcp__Claude_Browser__preview_stop', tool_input: { serverId: 'x' } },
    { tool_name: 'mcp__Claude_Browser__form_input', tool_input: {} },
    { tool_name: 'Edit', tool_input: {} }, { tool_name: 'Write', tool_input: {} }, { tool_name: 'PowerShell', tool_input: {} },
    { tool_name: 'NotebookEdit', tool_input: {} }, { tool_name: 'Agent', tool_input: {} },
    { tool_name: 'mcp__claude-in-chrome__navigate', tool_input: { url: 'http://localhost:5174' } },
    { tool_name: 'Bash', tool_input: { command: 'node --test', run_in_background: true } }
  ];
  let failed = 0;
  // Implementer profile: edit tools pass this guard (scope is ocean-gate's job); shell rules unchanged.
  for (const [input, expectAllow] of [
    [{ tool_name: 'Edit', tool_input: {} }, true], [{ tool_name: 'Write', tool_input: {} }, true],
    [{ tool_name: 'PowerShell', tool_input: {} }, false], [{ tool_name: 'Bash', tool_input: { command: 'git push' } }, false],
    [{ tool_name: 'Bash', tool_input: { command: 'sed -i s/a/b/ x.ts' } }, false]
  ]) {
    if (!!evaluate(input, P, 'implementer') === expectAllow) { failed++; console.log(`FAIL implementer profile: ${JSON.stringify(input)}`); }
  }
  if (!evaluate({ tool_name: 'Edit', tool_input: {} }, P, 'audit')) { failed++; console.log('FAIL audit profile allowed Edit'); }
  const run = (input, expectAllow) => {
    const reason = evaluate(input, P);
    if (!!reason === expectAllow) {
      failed++;
      console.log(`FAIL ${expectAllow ? 'should allow' : 'should block'}: ${JSON.stringify(input.tool_input?.command ?? input)}${reason ? ` -> ${reason}` : ''}`);
    }
  };
  allow.forEach((command) => run({ tool_name: 'Bash', tool_input: { command } }, true));
  deny.forEach((command) => run({ tool_name: 'Bash', tool_input: { command } }, false));
  browserAllow.forEach((i) => run(i, true));
  browserDeny.forEach((i) => run(i, false));
  const total = allow.length + deny.length + browserAllow.length + browserDeny.length;
  console.log(`${total - failed}/${total} guard cases passed`);
  process.exit(failed ? 1 : 0);
}

// ---- Entry point -------------------------------------------------------------------------------
const isMain = process.argv[1] && norm(path.resolve(process.argv[1])) === norm(fileURLToPath(import.meta.url));
if (isMain) {
  if (process.argv.includes('--self-test')) selfTest();
  let input;
  try { input = JSON.parse(readFileSync(0, 'utf8') || '{}'); } catch { input = null; }
  const profileArg = process.argv.indexOf('--profile');
  const profile = profileArg > 0 ? process.argv[profileArg + 1] : 'audit';
  const reason = input ? evaluate(input, undefined, profile) : 'the guard could not read the tool call, so it is refused by default.';
  // Audit trail outside the repository: proves the guard ran, for which agent, and what it decided.
  try {
    const dir = path.join(tmpdir(), ROOT_NAME);
    mkdirSync(dir, { recursive: true });
    appendFileSync(path.join(dir, 'guard-log.jsonl'), JSON.stringify({
      t: new Date().toISOString(), session: String(input?.session_id ?? '').slice(0, 8),
      agent_type: input?.agent_type ?? null, agent_id: input?.agent_id ?? null, tool: input?.tool_name ?? null,
      allowed: !reason, reason: reason || undefined,
      command: typeof input?.tool_input?.command === 'string' ? input.tool_input.command.slice(0, 160) : undefined
    }) + '\n');
  } catch { /* logging is best effort */ }
  if (reason) {
    process.stderr.write(`portfolio-guardian audit guard: ${reason}\n` +
      'Do not retry a variant. Record it under "Not checked" or propose the change in the report instead.\n');
    process.exit(2);
  }
  process.exit(0);
}
