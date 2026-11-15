# Phase III — the living ocean

15 November 2026. Working tree only: nothing committed, pushed or deployed.

**Update, 15 November 2026:** all four behaviours are now on by default (`OCEAN_EFFECT_DEFAULTS` in `oceanExperiments.ts`) and the `?ocean=` parameter works on the live site too: `?ocean=original` shows the previous ocean, `?ocean=-wake` drops one behaviour, `?ocean=flow,sea` shows exactly those. The sections below describe the state when the effects were still off by default.

## Summary

Four behaviours were added to the ocean renderer, each behind its own development flag and **all off by default**. With no flag set the site draws exactly the ocean it drew before (measured, see section 7).

| # | Effect | State | Recommendation |
|---|---|---|---|
| 7 | Water inertia | Works, measured, tested | Ready to enable |
| 2 | Flow-aligned currents | Works, measured, tested | Ready to enable |
| 3 | A sea state per section | Works, measured, tested | Ready to enable, together with flow |
| 1 | Wake memory | Works, measured, tested | Look at it in motion before enabling |

None of the four costs anything measurable in frame pacing, main-thread time or memory, on desktop or in phone emulation.

Three limits on what "validated" means here:

- I judged motion from measurements and stills. I cannot watch the page move, so the last word on how the wake and the inertia *feel* is yours.
- The four were written together and then evaluated one at a time through the flags, in the order you gave. They were not built strictly one after the other.
- Phone results are Chrome touch emulation at 390 and 320 px. No physical iPhone was used.

To see them: `npm run dev`, then open `/?ocean=all` (or `inertia`, `flow`, `wake`, `sea`, any list such as `flow,sea`, or `none`). The production build ignores the address bar. To ship one, set it to `true` in `OCEAN_EFFECT_DEFAULTS` in `oceanExperiments.ts`.

## 1. The four effects

### Water inertia (#7)

The ocean's glyph lattice is a mass on a critically damped spring tied to the page, pushed by every change in scroll speed. Steady scrolling carries the water with the page; a stop lets it run on a few pixels and ease back. Only the lattice is offset: colours, the document scroll and the cinematic controllers never see it. It is off during the opening and under reduced motion.

Measured in the browser, scrolling at a steady speed then stopping dead:

| Scroll speed | Water runs on | Peak after stop | Back at rest |
|---|---|---|---|
| 600 px/s | 3.1 px | 0.24 s | 0.73 s |
| 1,500 px/s | 7.4 px | 0.23 s | 0.89 s |
| 3,000 px/s | 12.2 px | 0.24 s | 1.0 s |

It returns to exactly zero, never swings back past the page, and is capped at 16 px. The numbers are the same at 390 px.

One real bug was found by measuring: the first version treated slowing down and speeding up differently inside the spring, which turned uneven frame times into a steady 8–12 px push during ordinary scrolling. The spring is now symmetric and only the *displayed* lag at a start is reduced. A unit test covers it.

### Flow-aligned currents (#2)

A glyph now takes the direction of the water it sits in. The water runs sideways (as the swell already drifts) and the current field bends it, so most strokes lie level and a stroke leans only where the current really turns.

- Level flow: `-`, `~`, `≈` by weight.
- Leaning flow: `/` or `\`.
- Quiet water: `.`, `·`, `:` (unchanged below mid-tone, plus `:` where the water is slack).

`=` and `+` are no longer used when the flag is on. Palette, ink and the share of cells holding a glyph are unchanged (see the table in section 3).

The first version followed the field's contours directly and read as hatching, with vertical and diagonal strokes everywhere. It was reworked around the sideways current, and the vertical stroke was dropped.

### Wake memory (#1)

Each whale is read as four round bodies along the spine the whale layer already publishes. A third, very small GPU pass keeps a memory texture on the ocean's own glyph grid: where a body is, the water takes its flow; where it has been, the flow drifts on, spreads and fades.

What the visitor gets:

- Glyphs near a whale align with its heading.
- The currents are carried a little along its path, so they bend around the body.
- Moved water holds a few more glyphs, slightly heavier, in the same ink. Nothing glows.
- The disturbance is gone 1.5–2 s after the whale stops moving the water, and the texture returns to exact rest.
- Marine snow near a whale is carried up to 34 px with the flow and drifts back.

The whales' anatomy, choreography and number are untouched; the ocean only reads their published spines.

Two things were corrected after looking at captures:

- On a phone the wake barely registered, because strength was tied to pixels per second. It is now tied to the whale's own length.
- After a scroll the wake covered a third of the screen in chevrons, because a screen-wide whale "diving" with the page swept all the water it passed. The page's scroll now counts for 8% of a whale's motion, and the flow outside the body leans toward the whale's heading.

### A sea state per section (#3)

Each section has its own way of drawing the same currents. The two neighbouring waters are crossfaded over a long stretch (up to a third of a screen either side of a section's top), so there is no line. Everything above Experience keeps the ocean as it was.

| Section | Character | How |
|---|---|---|
| Experience | Long, gentle currents | Twice the sideways reach, slower, less ripple |
| Skills | Finer, more energetic | Finer grain, 1.6× pace, more ripple |
| Education | Broad, slow swells | Much broader grain, about half pace |
| Languages | Softly intersecting | A second set of currents crossing the first at the opposite lean |
| Interests | Slow eddies | Strong bending of the currents, slow |
| Contact | Nearly still | 12% pace, glyphs retune a third as often |

All values are in `seaState.ts`. With flow on, each state also sets how firmly the water keeps its sideways heading, which is what makes Interests turn and Experience lie level.

## 2. Before and after

The ocean's glyphs sit a few colour levels from the water by design, too little to read in a small still. So there are two kinds of sheet: **page** sheets show the site as it is seen; **water** sheets show the ocean's canvas alone with its contrast stretched. The stretch exaggerates the water's light and dark far beyond what is visible on the site.

| Effect | Page | Water (contrast stretched) |
|---|---|---|
| Flow | [flow-page-experience.jpg](artifacts/phase3/flow-page-experience.jpg) | [flow-water-cover.jpg](artifacts/phase3/flow-water-cover.jpg), [flow-water-interests.jpg](artifacts/phase3/flow-water-interests.jpg) |
| Sea states | [sea-page-sections.jpg](artifacts/phase3/sea-page-sections.jpg) | [sea-water-sections.jpg](artifacts/phase3/sea-water-sections.jpg) |
| Wake | [wake-page.jpg](artifacts/phase3/wake-page.jpg) | [wake-water.jpg](artifacts/phase3/wake-water.jpg), [wake-water-after-scroll.jpg](artifacts/phase3/wake-water-after-scroll.jpg) |
| Phone, 390 px | [phone-page.jpg](artifacts/phase3/phone-page.jpg) | [phone-water.jpg](artifacts/phase3/phone-water.jpg), [phone-wake-water.jpg](artifacts/phase3/phone-wake-water.jpg) |

In the wake sheets the yellow lines are the whales' spines (the dot is the snout). Each "without" frame is the same instant redrawn with the wake switched off.

Inertia cannot be shown in a still; its evidence is the table in section 1.

## 3. Measurements

Headless Chrome on this machine, Direct3D 11, a fresh browser profile per run (so every shader compile is cold), Vite dev server, configurations alternated. Two trials per configuration at 1440 and 390 px, one at 768 and 320 px. Frame intervals are in milliseconds; the display ran at about 120 Hz.

### Frame pacing

1440 px:

| Flags | CV read, mean / p95 / p99 | Frames over 34 ms | Globe film, mean / p95 / p99 | Over 34 ms | Idle, mean / p95 | Stop-and-go scroll, mean / p95 / p99 |
|---|---|---|---|---|---|---|
| none | 17.0 / 46.0 / 71.0 | 22 | 12.5 / 16.9 / 41.7 | 8.5 | 8.3 / 8.5 | 10.4 / 16.8 / 45.8 |
| inertia | 17.5 / 50.2 / 71.2 | 22 | 12.6 / 16.8 / 41.6 | 8.5 | 8.3 / 8.5 | 10.3 / 16.8 / 45.7 |
| flow | 17.9 / 50.2 / 75.2 | 24.5 | 12.6 / 16.8 / 41.7 | 8 | 8.3 / 8.5 | 10.4 / 16.8 / 50.0 |
| wake | 17.3 / 41.8 / 66.8 | 23 | 14.1 / 24.9 / 50.0 | 8.5 | 8.3 / 8.5 | 10.3 / 16.8 / 41.8 |
| sea | 17.4 / 45.8 / 70.9 | 24 | 12.8 / 16.8 / 45.9 | 8.5 | 8.3 / 8.5 | 10.3 / 16.8 / 41.7 |
| all | 16.6 / 41.8 / 66.8 | 22 | 13.2 / 17.1 / 41.8 | 8.5 | 8.3 / 8.5 | 10.4 / 16.8 / 50.0 |

390 px (touch emulation):

| Flags | CV read, mean / p95 / p99 | Frames over 34 ms | Globe film, mean / p95 / p99 | Over 34 ms | Idle, mean / p95 | Stop-and-go scroll, mean / p95 / p99 |
|---|---|---|---|---|---|---|
| none | 13.1 / 37.5 / 50.1 | 20 | 11.2 / 16.9 / 29.2 | 5.5 | 8.3 / 8.6 | 9.7 / 16.7 / 41.7 |
| inertia | 12.9 / 33.5 / 54.2 | 19.5 | 11.1 / 16.9 / 29.2 | 5 | 8.3 / 8.6 | 9.7 / 16.7 / 41.7 |
| flow | 13.5 / 33.6 / 66.8 | 18 | 10.3 / 16.7 / 29.3 | 6 | 8.3 / 8.5 | 9.6 / 16.7 / 41.7 |
| wake | 13.3 / 29.4 / 58.5 | 19 | 10.5 / 16.8 / 29.2 | 5.5 | 8.3 / 8.6 | 9.5 / 16.7 / 33.6 |
| sea | 13.6 / 33.3 / 66.7 | 18.5 | 11.8 / 16.9 / 37.5 | 7.5 | 8.3 / 8.6 | 9.6 / 16.7 / 37.5 |
| all | 13.2 / 29.3 / 58.3 | 19 | 11.2 / 16.9 / 33.2 | 6 | 8.3 / 8.6 | 9.7 / 16.7 / 41.9 |

768 and 320 px, one trial each:

| Width | Flags | CV read, mean / p95 / p99 | Over 34 ms | Globe film, mean / p95 / p99 | Idle, mean / p95 |
|---|---|---|---|---|---|
| 768 | none | 16.1 / 41.8 / 75.1 | 25 | 14.1 / 24.9 / 41.5 | 8.3 / 8.6 |
| 768 | all | 15.6 / 41.7 / 66.8 | 22 | 15.8 / 25.1 / 41.6 | 8.3 / 8.5 |
| 320 | none | 12.5 / 25.1 / 50.2 | 18 | 8.9 / 8.5 / 16.8 | 8.3 / 8.6 |
| 320 | all | 12.3 / 33.3 / 50.1 | 18 | 9.0 / 8.5 / 25.0 | 8.3 / 8.7 |

Every difference is inside the spread between trials of the same configuration. The one row that stands out, the Globe film with `wake` alone at 1440 px (p95 24.9), is noise: the whales are hidden during the film so the wake pass does not run, `all` (which includes the wake) reads 17.1, and the 768 px baseline shows the same 24.9 with nothing switched on.

### Cost

| Flags | Ocean draw, ms | Shader link, cold, ms | First draw, ms | Main thread, CV read / 4 s idle (1440) | Heap, MB (1440) |
|---|---|---|---|---|---|
| none | 0.10 | 2.7 | 0.6 | 5,516 / 2,034 | 16.5 |
| inertia | 0.10 | 2.8 | 0.5 | 5,641 / 2,000 | 16.2 |
| flow | 0.15 | 3.6 | 0.5 | 5,592 / 2,022 | 17.7 |
| wake | 0.15 | 4.8 | 0.8 | 5,640 / 2,092 | 20.3 |
| sea | 0.10 | 3.6 | 0.5 | 5,602 / 1,952 | 16.3 |
| all | 0.10 | 10.5 | 0.6 | 5,599 / 2,175 | 17.0 |

- **Ocean draw** is both passes (and the wake step when due) with the GPU drained. The timer's resolution is 0.1 ms, so these figures only say "at or below the resolution". Chrome exposes no GPU timer here, so there is no separate GPU figure.
- **Shader link** is the one-off cost at load: about 8 ms more with everything on, on a cold cache. No hang, no deferred compile at first draw. Largest at 390 px: 12 ms.
- **Memory**: the wake adds two textures the size of the glyph grid, about 93 kB of GPU memory at 1440 px. Heap differences are within run-to-run variation.

### Stability and density

Share of drawn cells whose glyph changes from one 30 Hz frame to the next, and share of cells that hold a glyph (averaged over 24 moments), at 1440 px:

| Where | Glyph changes per frame: none / flow / sea / flow+sea | Cells holding a glyph: none / sea |
|---|---|---|
| Cover | 3.8% / 3.0% / 3.8% / 3.0% | 22.6% / 22.6% |
| Experience | 3.6% / 3.2% / 3.3% / 2.6% | 25.5% / 25.2% |
| Skills | 3.4% / 3.0% / 4.1% / 3.5% | 24.2% / 23.9% |
| Education | 3.6% / 3.0% / 2.7% / 2.3% | 23.4% / 23.5% |
| Languages | 3.5% / 2.8% / 3.0% / 2.3% | 23.6% / 24.3% |
| Interests | 3.6% / 2.8% / 2.4% / 2.0% | 23.3% / 22.5% |
| Contact | 3.7% / 3.1% / 1.4% / 1.1% | 23.7% / 23.1% |

- Flow flickers less than the ocean does today everywhere, and leaves density and ink exactly as they were.
- Sea states keep density within one point at 1440 px (within two at 390 px). Skills retunes about 20% more often than today, on purpose; Contact about a third as often.
- Leaning strokes are rare accents: about 2% of drawn glyphs under Experience, 6.5% under Interests, none on the cover where the swells are longest.

### Wake

| | 1440 px | 390 px |
|---|---|---|
| Cells moved while the whales swim | 16.5% | 7.4% |
| Strongest flow | 0.62 | 0.46 |
| Cells moved just after a reading scroll | 41.6% (mean strength 0.05) | 37.4% (0.03) |
| Fade once the whales hold still | gone in 2.0 s | gone in 1.5 s |
| Back to exact rest | yes | yes |

## 4. Ready for production

- **Water inertia.** Behaves as designed at every speed and width, returns to exact rest, costs nothing. It is small by design (3 to 12 px); raise `share` in `waterInertia.ts` if you want to feel it more.
- **Flow-aligned currents.** Calmer than today's ocean, same density and palette, legible direction.
- **Sea states.** Density preserved, no boundary visible at real contrast. I recommend enabling it with flow: without flow the states differ only in the shape and pace of the currents, which is subtler.

## 5. Needs your eye, or further refinement

- **Wake memory.** It is correct, restrained and cheap, and you called it the most important one, so it deserves a look in motion before it ships. Things to judge:
  - Whether it is visible enough. Ocean glyphs are faint in deep water, so the wake is faint too. `WAKE_SHOW` in `asciiOcean.ts` sets how many glyphs it adds and how heavy.
  - Whether the fade (1.5–2 s) is long enough. `WAKE_KEEP.flow` sets it.
  - The moment after a scroll: about 40% of cells carry a faint trace for a second or two.
  - Extra glyphs also appear behind copy. The ocean has always drawn behind text at this contrast, but the wake adds to it.
- **Flow.** Leaning strokes are deliberately rare. If you want the currents to turn more visibly, lower `set` per state in `seaState.ts`; lowering it too far brings back the hatched look of the first version.
- **Skills.** It is the busiest state. If it reads as restless next to the tool list, lower its `pace` and `shimmer`.
- **Marine snow reaction.** Covered by unit tests only; I have no browser measurement of it.

## 6. Files

New:

- `oceanExperiments.ts` — the four flags and their defaults.
- `waterInertia.ts` — the spring.
- `seaState.ts` — the states, their layout along the document, packing for the shader.
- `oceanWake.ts` — bodies from the whales' spines, the flow around a body, the snow's drift.
- `livingOcean.test.mjs` — 18 tests for the four modules.
- `dev/phase3.mjs`, `dev/phase3-sheet.py`, `dev/phase3-diff.py`, `dev/phase3-summary.py`, `dev/phase3-report.sh` — harness and report tooling.
- `artifacts/phase3/` — comparison sheets and raw measurements (JSON).
- `PHASE3_LIVING_OCEAN_REPORT.md` — this report.

Modified:

- `asciiOcean.ts` — the living cell shader, the wake step, wiring, development hooks. The two original shaders are untouched and are what runs with no flag.
- `AsciiWhaleBackground.tsx` — marine snow reads the wake (21 lines; inert while the wake is off).
- `asciiOcean.test.mjs` — mocks for the new imports, 5 new tests.
- `dev/phase2-lib.mjs`, `dev/phase2-verify.mjs` — `PHASE2_OCEAN=all` runs the existing regression checks with the flags on.

Not touched: the whale renderer, anatomy and choreography, `cinematicScroll.ts`, the Globe, the opening, the Hero, the text decode, the CV layout and content.

## 7. Tests and remaining risks

Passed:

- Typecheck clean; 234 of 234 unit tests; production build succeeds (to a scratch folder; `dist/` untouched).
- Every flag combination links and draws at 1440, 768, 390 and 320 px with no console errors.
- **No flag set = today's ocean.** Frames from the committed tree and from this tree differ by a mean of 0.2–0.4 colour levels, which is exactly how much the committed tree differs from itself between two draws (the ocean dithers every frame). A unit test also asserts that only the two original shaders are linked.
- The existing regression harness, run twice (flags off, then all on), 16 checks each:
  - the text decode at five widths (every line still decodes letter by letter, reads, scrambles out and returns);
  - reduced motion at 1440 and 390 px;
  - the Hero name;
  - the Globe from Doha to Shanghai and back, on desktop wheel and emulated touch;
  - all three journeys and Skip intro.

Risks:

- **Physical phones are untested.** iOS Safari's scrolling (momentum, rubber-banding) will feed the inertia differently from Chrome's emulation. The effect only moves the ocean's glyphs, so the worst case is a wobble in the water, not in the page.
- **Other GPUs.** Shader compile was measured cold on this machine only. The living shader is small (8 ms here), and if it fails to link the ocean falls back to the original shaders.
- **Trial count.** Two trials per configuration is enough to show there is no large cost, not to resolve differences of a millisecond.
- **Motion quality** of the wake and inertia is judged from numbers and stills, as said above.
- Two older scripts in `dev/` (`fable-audit.mjs`, `final-polish.mjs`) were already stale before this phase and remain so.
