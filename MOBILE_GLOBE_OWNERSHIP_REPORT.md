# Mobile Globe scroll ownership — 12 November 2026

Implemented locally; no commit, push, or deployment. All 185 tests, TypeScript checking, and the production build pass. Physical iPhone acceptance and browser-engine emulation remain unverified.

## Verified failure mechanism

Two new regression tests were run against the unchanged controller from `6a48841` before implementation. Both failed:

1. Enter Doha at document Y **2766**, then wait beyond `SETTLE_MS`. Deliver native touch scrolling to Y **3216**. The controller leaves its published renderer position at **2766**, with no playback RAF active. The document and renderer have different positions. `globeScrollProgress()` explicitly prefers this stale `controlledY` over `window.scrollY`, so the camera and city selection still resolve to Doha. This is a resting ownership failure, not evidence of a React state update failing to commit or a running seven-city timeline spontaneously completing.
2. Start a touch at Doha and move **2 px**. The first touchmove is not prevented. The old handler returns before claiming the interaction until vertical movement reaches 6 px. It also ignores initially horizontal movement. A browser can begin native panning before a later handler tries to cancel it.

The exact stale-lock branch is in `onScroll`: once the resting cooldown expires, a native position inside the runway neither snaps back nor releases the lock. `wheelLocked` also prevents the normal native-entry interception branch from running. That leaves the document free to advance while the renderer continues to consume Doha.

This reproduces the reported failure shape in executable simulations. It does **not** establish which native event ordering occurred on the user's physical iPhone; no device trace was obtained.

Additional architecture risks addressed: the old controller published an immediate `window.scrollY` readback instead of its calculated timeline output, and active rendering depended on `IntersectionObserver` reporting the runway visible. Delayed scroll readback and a stale invisible observation are now explicitly simulated in the production-controller/renderer integration test.

## Why 6a48841 did not solve it

That patch corrected the `earth === 0` entry no-op, separated entry from city playback, applied settling to touch, and prevented empty canvas resize frames. It did not give the mobile controller native scrolling ownership, fix the stale resting-lock branch, or compare the actual Globe draw state with the document position. Its tests delivered large cancelable touch moves and synchronous successful `scrollTo` calls. Those tests could pass while the uncaptured-first-move/stale-lock path remained.

## Implementation

Mobile ownership now has four explicit states:

| State | Owns native scrolling | Transition |
| --- | --- | --- |
| `document` | No | Entry into the runway or a deliberate gesture in it claims control. |
| `ready` | Yes | Doha waits with the existing hint; a new downward swipe starts playback, an outward reverse swipe releases to the Hero. |
| `playing` | Yes | The existing elapsed-time clock drives the whole journey; repeated forward swipes do nothing; reverse changes the existing eased playback direction. |
| `draining` | Yes | The journey has reached its endpoint; wait only for the final scroll position to be acknowledged and any already-active finger to lift, then release. |

No mobile transition depends on an arbitrary settling delay. The desktop wheel recognizer and its existing momentum-settling behavior remain.

While owned, root `overflow-y: hidden`, `touch-action: none`, and `overscroll-behavior: none` suppress native panning and scroll chaining. The document remains programmatically scrollable by the timeline, preserving the existing sticky runway and background descent. Body is not converted into a scrolling container or fixed/translated layer. The non-passive touchmove listener cancels the first move while owned, including movements below the deliberate gesture threshold. Root CSS is supplementary to first-move cancellation: changing touch-action after a gesture has begun cannot retroactively cancel that gesture. See the [Touch Events specification](https://www.w3.org/TR/touch-events/) and [touch-action documentation](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/touch-action).

Native scroll events during ownership, including large overshoots beyond the runway, are corrected to the clock's expected position and cannot cancel/accelerate the sequence. The renderer receives the calculated timeline position, not immediate browser readback. Playback schedules rendering even if visibility observation is stale. Geometry refreshes preserve time through viewport/font-layout changes. The final logical position stays owned until the browser acknowledges it, avoiding a last-frame regression during release.

Completion, skip, destruction, reduced motion, pagehide, hash navigation, links, Home/End/Tab, and scrollbar interaction have release paths. Inline values and CSS priorities, plus the prior `history.scrollRestoration`, are restored. A touch held across completion cannot queue another film or escape through its final movement.

The speed constant, durations, city order, camera paths, easing, drawing code, labels/captions, Hero, all three entry experiences, and whale/ocean implementations were not changed. The existing DPR cap, offscreen canvas, batched drawing, and idle visibility optimization remain. Normal production playback creates no diagnostic panel or sample buffer.

## Files changed

- `cinematicScroll.ts`: mobile ownership state, native scrolling suppression/restoration, first-move capture, authoritative progress publication, final-position acknowledgement, geometry refresh, diagnostics snapshot, lifecycle cleanup.
- `JourneyGlobe.tsx`: active playback rendering independent of visibility observation, geometry refresh synchronization, opt-in diagnostics wiring.
- `globeDiagnostics.ts` (new): development-only `?globeDebug` overlay and bounded in-memory samples comparing controller state/time, ownership, timeline progress, rendered progress, city index, and actual document Y.
- `cinematicScroll.test.mjs`: the two initially failing reproductions, browser surface support for real style ownership, and replacement of the old touch-cooldown expectation with immediate new-gesture behavior.
- `journeyMobile.test.mjs` (new): seven production controller/renderer integration tests.
- `MOBILE_GLOBE_OWNERSHIP_REPORT.md` (new): this report.

## Validation performed

- `node --test --test-reporter=spec *.test.mjs`: **185 passed, 0 failed**.
- `npx tsc --noEmit`: passed.
- `npm run build -- --outDir node_modules/.cache/mobile-globe-build`: passed. Output was deliberately written to an ignored cache directory, leaving tracked `dist` unchanged. Existing warnings remain for experimental Tailwind optimization, ignored `use client` directives/sourcemap locations, and the large ambient-whale chunk.
- Confirmed the production output does not contain `__globeDiagnostics` or `data-globe-diagnostics`.

The new integration harness executes the actual `cinematicScroll.ts`, `JourneyGlobe.tsx`, and `abyssPalette.ts` together. Browser layout/events, canvas calls, and React hooks are simulated. It checks canvas blits and city label draw calls as well as the requested React milestone updates; it does not validate browser rasterization, layout-engine sticky positioning, or React DOM commits.

Verified in simulation:

1. Single swipe: Doha → Paris → Jakarta → Moscow → Singapore → Pau → Shanghai; every city label reaches the canvas; endpoint releases native control.
2. Calm versus repeated 500 px swipes: identical renderer progress/city frames at identical elapsed times. Forced native overshoots are corrected.
3. Delayed scroll readback, absent scroll events, and stale invisible observation: renderer continues to Moscow and Shanghai; the final rendered progress reaches 1 before handoff completes.
4. Reverse from the current position, resume forward, complete, reverse through all seven cities to Doha, then leave toward the Hero.
5. 390×844 portrait / 844×390 landscape geometry changes at Doha and mid-play; current clock time is retained.
6. Finger held across completion is drained, with no queued playback, then styles unlock immediately.
7. Skip, destroy, pagehide, hashchange, Home, End, and Tab restore exact prior CSS values/priorities and scroll restoration, even with a finger down.

Existing tests also cover three forward/reverse touch replays, touch cancellation/multi-touch, desktop wheel/keyboard behavior, the three opening routes, Skip Intro reversal, and earlier cinematic reversal. The complete opening → Hero → Globe flow after each entry variation has **not** been executed in a browser this turn.

## Device limitation and remaining acceptance

No physical iPhone was connected. Chrome launched, but Computer Use then stopped with: “could not determine the current browser URL on Windows with enough confidence to enforce policy.” No further UI input was attempted. Therefore there is **no successful Chrome device-emulation or real Safari result** to claim; the closest completed tests are the instrumented Node simulations described above.

Remaining risk is browser-specific behavior: iOS asynchronous scrolling/rubber-banding, root overflow suppression, sticky compositing, toolbar/visual viewport changes, and the opening-to-Globe interaction on hardware. Simulation cannot certify their absence. A delayed final scroll acknowledgement keeps ownership until acknowledged; explicit navigation and lifecycle cleanup remain escape paths. Physical verification is still required before calling this iPhone-certified.

For local device diagnosis, run `npm run dev`, open the printed reachable network URL with `?globeDebug`, and perform the user's ten-step scenario on Safari after (a) fresh entry, (b) Skip Intro, and (c) reversing/replaying the earlier cinematic. The local-only overlay shows `ownership`, `playing`, `time`, `timelineY`, `documentY`, `timelineProgress`, `renderedProgress`, and `cityIndex`; up to 1200 samples are available in `window.__globeDiagnostics`. No diagnostics are uploaded. Confirm document Y follows only the clock while the stage remains pinned, all seven cities draw at the existing speed, and native scrolling resumes after Shanghai.
