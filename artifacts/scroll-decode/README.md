# One-time CV scroll decoding — validation

Validated 18 November 2026. Local source only; no commit, push, or deployment.

## Behavior

- Each actual rendered line has independent progress across the wider 95%–62% viewport entrance band already present in the local edits. Its vertical placement creates the cascade; no timed queue delays long paragraphs.
- Characters lock from left to right using the existing alphabet, font, and measured character geometry. The visual duplicate moves at most 2 px; source text retains exact layout and accessibility.
- Completed lines leave the update queue. Upward scrolling never re-scrambles them. Reversing during a partial reveal immediately settles that line to readable text.
- Fast jumps settle all passed lines immediately. Bottom-of-page lines use the existing adjusted entrance boundary.
- Future/offscreen and paused lines skip word traversal when progress is unchanged. Adjusted bottom-of-page entrances never build or update glyph cells below the viewport.
- Scrolling is observed passively, independent of wheel/trackpad/touch input. There is no decoding timer or continuous glyph-flipping loop. Hidden tabs suspend scheduling.
- Resize/font remeasurement retains completed words. Focused control labels and reduced motion settle immediately; turning motion back on does not replay text.
- CV text no longer responds to whale pressure, so completed letters cannot distort or keep consuming animation work. Whale animation, ASCII wakes, ocean rendering/colors, all three journeys, the Globe controller/mobile fixes, and hero choreography are unchanged. Content, typography, and composition are unchanged.

## Checks

- Full Node test suite: 241 passed, 0 failed (`node --test *.test.mjs`).
- Regression coverage includes the wider entrance boundary, permanent completion, interrupted reversal, and adjusted bottom-of-page lines staying idle offscreen.
- TypeScript: passed (`npx tsc --noEmit`).
- Production build: passed (`npm run build`). Vite reported non-blocking dependency `use client`/sourcemap, Tailwind experimental-option, and chunk-size warnings. The newly generated production build is retained locally in `dist`, so local production previews use the current reveal controller.
- Browser validation: headless Chrome on Windows, with the normal ocean/Globe renderers running. Desktop 1440×900 at DPR 1; mobile emulation 390×900 and 320×900 at DPR 2.
- All sections: Profile/introduction, Experience, Skills, Education, Languages, Interests, Contact, plus headings and metadata. DOM coverage audit found no unhandled CV copy.
- Slow downward scroll: wrapped lines have independent intermediate ASCII states and all text in the reading region is readable.
- Exhaustive entrance sweep at 1440px and 390px: all 271 words passed through ASCII cells, then resolved; zero missed words and zero unresolved words.
- Production preview verified against the newly generated `portfolio-SsNdHXab.js` bundle (no development client): all 271 words animated and resolved at both 1440px and 390px. Results are in `production/every-line.json`.
- Fast section jumps and bottom-of-page jumps: every CV word resolves.
- Three upward/downward revisits: zero DOM mutations to completed words; zero unreadable words.
- Paused partial reveals: zero text mutations over 250 ms. Reversing interrupted entrances settled 52/41/34 partially decoded words at desktop/390px/320px respectively; subsequent motion caused zero replay mutations.
- Desktop small pixel wheel input (trackpad-like): 48px of actual scrolling; mouse wheel step: 120px. Mobile CDP touch gestures: 165px of actual scrolling.
- Resizing completed copy: zero text mutations or replay. Reduced motion from page load and toggled during an incomplete entrance: all text settled, with no replay when motion was restored.
- No browser exceptions or horizontal overflow in the tested sizes.

## Controller timing

The browser harness wraps only the editorial controller's requestAnimationFrame callback. These are callback durations, not whole-page frame times or an FPS claim. The separate `scrollStepTimes` values in the JSON include two animation frames and test assertions and must not be interpreted as frame-time measurements.

| Viewport | Samples | Mean | p95 | Maximum |
| --- | ---: | ---: | ---: | ---: |
| 1440×900, DPR 1 | 441 | 0.52 ms | 1.50 ms | 3.60 ms |
| 390×900, DPR 2 | 442 | 0.47 ms | 1.10 ms | 2.80 ms |
| 320×900, DPR 2 | 445 | 0.47 ms | 1.20 ms | 3.30 ms |

Physical trackpad hardware, iOS Safari, and Android hardware were not available. Wheel/touch checks use Chrome's input protocol and mobile emulation.

## Reproduce

- `node --test *.test.mjs`
- `npx tsc --noEmit`
- `npm run build`
- `node dev/scroll-decode-validation.mjs`
- Optional focused exhaustive pass: `node dev/scroll-decode-validation.mjs --lines-only`

The browser harness uses the repository's existing private Chrome/CDP tooling. It starts a local Vite server if needed and closes owned browser/server processes afterward. Raw results are in `validation.json` and `every-line.json`; full test/build output is in `unit-tests.txt` and `build.txt`; profile screenshots are saved alongside this report.
