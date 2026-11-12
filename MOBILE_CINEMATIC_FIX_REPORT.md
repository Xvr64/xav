# Mobile cinematic fixes

Implemented locally. No commit, push, or deployment. Browser/device acceptance remains outstanding.

## Globe entry

The active checkout has a direct Hero-to-Doha entrance. Commit `447676d` explicitly removed the whale-to-Earth convergence and its camera handoff; the remaining migration code is archived/inactive. Restoring it would change the current desktop choreography, so this fix does not reinstate it.

The confirmed controller defect was a mismatch between touch and wheel entry. Production `CinematicStops.earth` is zero. A swipe captured just above the runway called `step(1)` then `goTo(0)`, which returned immediately because the start and target times were equal. Native movement had already been prevented, leaving the page stuck above Doha. Conversely, when native scrolling crossed the boundary during a finger gesture, `onScroll` pinned Doha, but lifting that same finger could call `step(1)` again and immediately start the cities. Touch also bypassed the settling interval used by wheel input.

The shared entry function now explicitly lands on the first stop. Touch remembers where its gesture began and whether it began during settling/playback. An entry gesture cannot also start the city film; a later deliberate swipe starts the existing elapsed-time controller. Multi-touch/cancelled gestures cannot launch playback. No durations, camera formulas, city order, captions, or speed constants changed.

The mismatch predates the latest performance audit. Commits `8b052cd` and `0c9e24a` added/updated wheel/native entry protection without equivalent touch handling. Tests reproduce three failures against the original touch controller.

## Hero black frame

The Hero glyphs use a transparent 2D canvas; the full-screen ocean beneath them uses an opaque (`alpha: false`) WebGL canvas. The ocean's `ResizeObserver` synchronously assigned canvas width/height and reallocated its cell texture, then scheduled drawing for a later RAF. Observer delivery after RAF and before paint could therefore present the cleared opaque buffer as black. Mobile viewport changes during toolbar collapse/expansion make this path relevant during scrolling. Even a same-size resize notification cleared the buffer unnecessarily.

Ocean resize notifications now mark work pending. Backing-buffer changes, any necessary texture allocation, and the complete two-pass redraw happen together in the next RAF, preserving the prior image until then. Unchanged dimensions/grid sizes do not reallocate. Window resize also invalidates sizing for DPR changes. The same empty-frame ordering was removed from the Globe's transparent canvas and Hero's typography remeasurement.

Git blame traces the ocean resize code to `88bc7ce`, before the latest `586f396` performance audit. Five new render-lifecycle tests fail against the original ocean source and pass against the fix. This confirms the cleared-buffer defect; its exact correspondence to every flicker seen on a physical phone has not been independently verified.

## Reproduction and acceptance steps

Executable reproductions use the production listeners/render scheduler with simulated browser events and GL calls:

1. Controller: start at scroll Y 2666, 100 px before the test runway's Doha stop at 2766. Dispatch a single-finger upward swipe of 160 px. Originally the page stayed at 2666; now it rests at 2766 with no playback queued.
2. Controller: start the same swipe above Doha, deliver a native scroll across the boundary, then lift after one second. Originally the same gesture started the city film; now Doha remains the waiting state.
3. Controller: land at Doha, immediately send another downward swipe during `SETTLE_MS`. It is consumed. A deliberate swipe after settling starts the unchanged film.
4. Renderer: draw an ocean frame, then deliver a resize observer notification before the simulated paint. Originally canvas dimension setters cleared the visible buffer before the next draw. Now it remains painted until allocation and replacement rendering occur together.

Physical-browser acceptance still needs to be run:

1. Use iPhone Safari at approximately 390×844, Android Chrome at 412×915, and desktop Chrome at 1440×900. Select a journey or Skip Intro and reach the Hero.
2. Slowly scroll through the headline-to-ASCII-name transformation. Repeat with fast swipes, reverse through it, and replay at least three times. Record the screen to inspect individual frames.
3. Collapse/expand browser chrome during the transformation; rotate portrait/landscape and back. Verify uninterrupted water and glyph layers.
4. Enter the Globe with both a short swipe and a long swipe that begins above its runway. Verify it lands on Doha, waits, and starts all seven cities only after the next deliberate gesture.
5. Compare playback duration under one swipe versus repeated aggressive swipes; reverse mid-film and replay three times. Rotate during playback and confirm the clock and city state continue correctly.
6. Capture console/WebGL errors and p95 frame timings on the same hardware/settings as the earlier benchmarks.

## Validation performed

- Original baseline: 164 tests passed.
- Final suite: 176 tests passed (`node --test --test-reporter=dot *.test.mjs`).
- Type checking: `npx tsc --noEmit` passed.
- Production build: `npm run build` passed. Existing build warnings concern Tailwind's experimental optimization, ignored `use client` directives/sourcemap locations, and a large chunk. Generated `dist` changes were restored after validation.
- New coverage: boundary entry, native crossing within one touch, settling, fast repeated swipes, three forward/reverse replays, viewport geometry changes during playback, cancellation/multi-touch, resize/draw ordering, unchanged-size allocation avoidance, hidden/reduced-motion recovery, and forward/reverse ocean draws.
- Simulated renderer dimensions: 390×844 at DPR 3, 412×915 at DPR 2.625, and 1440×900 at DPR 1, including landscape and changing heights. These are Node tests with mocked browser/GL surfaces, **not browser emulation**.

No mobile or desktop browser was successfully tested. The browser inventory exposed no connected browser; creating a Chrome tab returned “Browser is not available,” and native Chrome launch approval timed out. Accordingly, zero physical-device flickers, Safari compositing, absence of runtime WebGL errors, and p95 frame-time parity are not certified by this report.

The existing DPR caps, 30 fps idle ocean cadence, batched Globe drawing, offscreen drawing buffer, CSS water-write throttling, and Tailwind optimization are retained. Normal ocean draws still use two passes and do not allocate. No new per-frame buffers, shaders, or visual effects were introduced. The reported 8.5 ms Globe / 25 ms CV p95 figures were not remeasured.

## Files changed

- `cinematicScroll.ts`: shared entry handling and touch gesture ownership/settling.
- `asciiOcean.ts`: atomic resize/redraw and conditional buffer/texture allocation.
- `JourneyGlobe.tsx`: resize backing buffers only within the draw task.
- `heroCurrent.ts`: redraw synchronously after typography remeasurement; avoid redundant size assignments.
- `cinematicScroll.test.mjs`: six new mobile controller regressions; existing touch test now waits through the shared settling interval.
- `asciiOcean.test.mjs`: six production-scheduler regression tests using mocked browser/GL surfaces.
- `MOBILE_CINEMATIC_FIX_REPORT.md`: findings, reproduction, validation, and remaining acceptance work.
