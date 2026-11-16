# Ocean refinement — 16 November 2026

The default ocean now keeps the original water texture and gentle Water Inertia, with a local wake driven by the two existing whales. Only `asciiOcean.ts`, `oceanWake.ts`, and `oceanExperiments.ts` contain production changes. Validation was completed locally before the subsequent request to commit and push.

## Cause and changes

| Effect | What caused the unwanted appearance | Final behavior |
|---|---|---|
| Flow-aligned Currents | `stream()` creates elongated noise bands across the document. The FLOW branch selects `-`, `~`, `≈`, and directional strokes, raises occupancy toward 0.9, lifts ink, and reduces the ordinary bed to 74% density and a dot-only ramp. This is the direct source of the long horizontal clusters. | Off by default. The original glyph ramp and bed density return. Still available explicitly for comparison. |
| Sea State per Section | Changes grain, reach, pace, crossing direction, and the length/spacing of FLOW bands. It amplifies and varies the global pattern rather than originating the horizontal strokes itself. | Off by default to restore the original field throughout the CV. |
| Wake Memory | Previously raised occupancy to 0.66, ink to 1.3, lifted color by 0.34, brightened the field, and retained a visible trail for about eight seconds. It used body-axis direction, included scroll in speed, and suppressed shedding during faster scrolling. | Existing glyphs bend and align locally, using normal ocean ink. No extra occupancy, light, or palette lift. Measured projected velocity drives the wake. Visible decay is approximately 1–3 seconds. |
| Water Inertia | Offsets the water lattice after scrolling; it does not generate stroke bands. | Preserved. |

The original `CELLS` and `SCREEN` shaders remain available through `?ocean=original`. The normal ocean was not darkened to conceal clutter.

## How the wake works

The existing `ambientWhaleRuntime.ts` already publishes 48 points from each skinned whale spine through the actual render camera into `ambientWhalesLive.spines` in `oceanDirection.ts`. Those modules were inspected and needed no changes. Four points per whale drive the existing eight-body disturbance field. Their CSS-pixel displacement divided by elapsed time supplies strength and direction, including turns and tail motion. Scrolling alone cannot emit a wake; real whale movement continues to emit during scrolling.

The existing pair of cell-sized RGBA8 feedback textures retains displaced water. It stays in document coordinates and is reprojected by the change in lattice rows. Decay, transport, and uptake now follow elapsed seconds. The cell pass warps the original current field and aligns existing marks; the screen pass bends the existing glyph grid by at most 1.8 cell heights. Neither pass adds a particle layer or a glowing outline. After the last emission, remaining memory is cleared at three simulation seconds and the feedback pass stops.

Actual viewport/DPR changes clear the old projection and velocity history, preventing resize motion from becoming a false wake. This intentionally resets a short-lived trail on resize. No additional WebGL context, animation loop, dependency, or full-resolution feedback texture was introduced.

## Comparisons and controls

Open `review.html` in this folder for original / before / refined screenshots at matched scroll positions, plus playback and scrubbing of actual captured motion frames. Raw PNGs retain the page's original contrast. `*-water.jpg` captures isolate the ocean without the overlaid CV and creatures.

The before images were captured before editing with `?ocean=all`. Original images use `?ocean=original`. Refined images use the new default. All stills use ocean time 40, whale seek time 24 after six seconds of swimming, and the same section offset (15% of viewport height). The live wake is time-dependent, so emission history and unrelated ambient creatures are not pixel-identical between separate runs.

The pasted attachment contained text only. The available `.task-reference/ocean-refinement.png` shows the introductory white scene, not the described horizontal clutter. The captured `before-*` browser frames directly document that clutter instead.

| URL query | Behavior |
|---|---|
| None | Refined wake + Water Inertia |
| `?ocean=original` | All four additions off |
| `?ocean=wake` | Refined wake alone |
| `?ocean=-wake` | Water Inertia alone |
| `?ocean=all` | All switches on, including experimental global bands; uses the revised wake |

The historical performance baseline uses the untouched versions of the three production files from commit `d66d05be151e7df0b664d533942a6e93ff4cae79`, served through a read-only Vite loader; it does not approximate the old implementation by toggling today's switches. The benchmark pins this reference so it remains reproducible after committing the refinement.

## Verification

- All 236 unit tests in the 25 root test files passed. After the final screen-warp change, the 31 affected ocean tests passed again.
- `npx tsc --noEmit` passed.
- The final `npm run build` passed. Existing warnings concern `use client` directives/sourcemaps, Tailwind's experimental setting, and the large whale bundle. See `build.txt`.
- Real GPU-enabled Chromium: 1440×900 at DPR 1, touch-emulated 390×844 at DPR 2, and 320×740 at DPR 3. Ocean backing-resolution caps remain unchanged.
- All three sizes: no browser errors, no horizontal overflow, and unchanged quiet-water alpha/density and field values versus the original ocean.
- Original character-frequency differences were at most 0.14%, 0.15%, and 0.61% of grid cells respectively; no directional glyphs appeared in undisturbed water. Individual shimmer glyph choices are not byte-identical between compiled shader variants.
- Removing the wake memory in the same shader produced **zero changed cells outside the disturbed area**, at all three sizes.

| Viewport width | Prominent wake below threshold after stopping | Entire memory at rest by sampled frame | Memory shift for a one-row downward scroll |
|---|---:|---:|---:|
| 1440 | 1.99 s | 3.21 s | −1.06 rows |
| 390 | 1.61 s | 2.94 s | −1.08 rows |
| 320 | 1.77 s | 3.26 s | −1.05 rows |

Decay measurements sample about every 0.25–0.33 seconds; small timing differences also include the last projected motion after freezing the whale seek. “Prominent” uses the existing diagnostic threshold of 36/255 in the disturbance channel, not a claim about an exact human visibility cutoff. The residual 0.05–0.08 row shift includes diffusion/decay between measurements. The stored wake travels with the document, not the screen. See `wake-validation.json` for trajectories, field measurements, fade samples, and reprojection results.

The CV, reversible text animation, two whale models and paths, ocean palette/depth transitions, all three cinematic routes, Globe/mobile scroll code, and previous performance budgets were not edited. The deleted whale-to-Globe convergence was not restored.

## Performance and limits

Final serial measurements are recorded in `performance-serial.json`. Each configuration has two 2-second idle samples and two 3-second scrolls at 200 CSS px/s through the same section, followed by 20 synchronous ocean draws. Modes run sequentially, with separate dependency caches and no concurrent tests/builds. Earlier single-run timings in `before.json`, `original.json`, and `refined.json` are exploratory captures and are not this controlled comparison.

| Width | Version | Idle mean | Scroll mean | Scroll p95 | Synchronous ocean draw mean |
|---|---|---:|---:|---:|---:|
| 1440 | before | 8.35 ms | 10.82 ms | 16.80 ms | 0.15 ms |
| 1440 | refined | 8.35 ms | 11.23 ms | 16.80 ms | 0.17 ms |
| 1440 | original | 8.35 ms | 11.65 ms | 17.10 ms | 0.18 ms |
| 390 | before | 9.32 ms | 17.29 ms | 50.10 ms | 0.16 ms |
| 390 | refined | 8.82 ms | 16.95 ms | 58.40 ms | 0.16 ms |
| 390 | original | 8.96 ms | 14.98 ms | 50.10 ms | 0.16 ms |
| 320 | before | 8.36 ms | 11.58 ms | 16.90 ms | 0.20 ms |
| 320 | refined | 8.35 ms | 9.93 ms | 16.70 ms | 0.14 ms |
| 320 | original | 8.35 ms | 10.53 ms | 16.80 ms | 0.14 ms |

Desktop scrolling p95 was unchanged (16.8 ms); 320px improved slightly (16.9 → 16.7 ms). At 390px, average scrolling was slightly better (17.29 → 16.95 ms), but p95 was worse by one refresh interval (50.1 → 58.4 ms), with a 200.5 ms worst frame. There is no consistent increase in average frame or ocean draw cost, but scroll-tail variability remains and these short trials do not establish physical-device performance. The draw probe drains GL but is not a GPU timer query; its tight synchronous loop mostly measures the two regular passes, while the RAF runs include the live feedback pass, whales, layout, and other page work.

Hardware: Windows Chromium, ANGLE D3D11 on AMD Radeon Graphics (0x1681), with a roughly 120 Hz RAF cadence. Mobile sizes are browser emulation on that GPU, not physical iOS/Android measurements. Ocean idle rendering remains capped at 30 Hz; RAF cadence is not ocean render FPS. Wake memory covers the visible lattice, so a trail that scrolls out of the retained viewport is discarded. A physical-device Safari check remains outside this verification.

Build output changes were restored after validation so the review contains the source change and evidence, rather than regenerated distribution assets.
