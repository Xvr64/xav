# ASCII art direction and professional UX — 12 November 2026

Local implementation only. No commit, push, merge or deployment. The current production Globe remains the default. All three creative experiments require explicit development-server flags.

## 1. Current technical and artistic assessment

The strongest established elements are the three entry routes, the Eye of Creation, the ocean/whale material, the oversized editorial typography and the shared elapsed-time journey. The principal artistic inconsistency is the Globe's smooth disc and dot geography beside character-based ocean imagery. Repeated text exit scrambling also gives ordinary CV facts the same theatrical emphasis as important headings.

The appropriate direction is a clearer reading hierarchy with selective character art. This pass adds a useful cover shortcut and a quiet international line, explores two visual ideas locally, and leaves the established cinematic direction intact.

Initial HEAD: `a44e0dd`. Existing dirty files were CreationIntro.tsx, DepthGauge.tsx, SectionIndex.tsx, ambientWhaleRuntime.ts, creationIntro.css, oceanDirection.ts and terminal.css; oceanDirection.test.mjs, rootScrollLock.ts and rootScrollLock.test.mjs were already untracked. That work is preserved. This pass adds CSS to terminal.css; it does not rewrite those other existing changes.

No changes were made to cvData.ts, cinematicScroll.ts, creationTimeline.ts, creationRenderer.ts, JourneyArrival.tsx, heroCurrent.ts or main.tsx. The production city sequence, camera mathematics, timings, captions and Globe entrance are unchanged. No whale convergence, orbit, morph or replacement transition has been introduced.

## 2. Mobile Globe stability findings

The Globe uses Canvas 2D, including a detached drawing buffer and one DOM-canvas blit. WebGL is used by surrounding scenes. This distinction matters when diagnosing a frozen city: a live document position paired with stale authoritative progress is different from context loss.

The earlier ownership correction remains intact: first-move cancellation, explicit document/ready/playing/draining ownership, clock-authoritative scroll progress, rendering during stale visibility observations, and final-position acknowledgement. Existing regression tests pass.

The pre-existing uncommitted `holdRootScroll` change prevents a second intro cleanup from overwriting a Globe `overflow-y` lock acquired after the Hero releases. Its regression tests also pass. I preserved that change rather than introducing a second ownership mechanism.

Small additional hardening:

- Observe the Globe's actual stage size, visual-viewport resize notifications and DPR media-query changes; remove all observers on teardown.
- Keep layout/sticky geometry authoritative. Visual viewport height is an invalidation signal, not a replacement timeline coordinate system.
- Extend local `?globeDebug` samples with layout height, visual height/scale, DPR and synchronous draw duration. Throttle diagnostic panel writes to four per second. No telemetry is sent.

The DPR subscription follows the re-armed resolution-query pattern described in [MDN's devicePixelRatio documentation](https://developer.mozilla.org/en-US/docs/Web/API/Window/devicePixelRatio). A separate visual viewport resize event is documented in [MDN's VisualViewport reference](https://developer.mozilla.org/en-US/docs/Web/API/VisualViewport/resize_event). These are targeted invalidation safeguards, not evidence that Safari's scrolling/compositor behavior is fixed.

Safari supports overscroll behavior, but reported WebKit edge cases reinforce the need for hardware tests rather than reliance on a CSS lock alone. See [Safari 16 features](https://webkit.org/blog/13152/webkit-features-in-safari-16-0/) and the [WebKit overscroll issue](https://bugs.webkit.org/show_bug.cgi?id=244232). Neither source proves that the user's particular failure occurs on a given current iOS version.

**The iPhone bug is not certified resolved.** No physical iPhone or successful browser touch-emulation session was available. Computer Use stopped when it could not determine Chrome's current URL reliably enough to enforce policy. No alternative browser automation was attempted after that stop.

## 3. Improvements implemented

- Cover-only `Profile ↓` anchor with a 44px minimum hit height, keyboard focus styling and mobile wrapping.
- Proper Profile h2 and a focusable, labelled destination section with a top landing margin.
- An accessible, wrapping seven-city editorial line sourced directly from CV_DATA; no new biographical claims.
- Hidden-tab suspension and teardown guards for the editorial decode scheduler.
- Supplemental Globe surface invalidation and richer opt-in diagnostics.
- Reversible local prototypes for ASCII geography, the seven-city constellation and entrance-only decryption.
- Removed the unimported archivedComponents.tsx, plus the unmounted MigrationRunway component and its unused CSS.

## 4. ASCII Globe prototype results

Preview with `npm run dev`, then `http://127.0.0.1:5173/?asciiGlobe=1&globeDebug#journey`. Compare with `http://127.0.0.1:5173/?globeDebug#journey`. Remove the flag to restore the normal renderer; no preference is stored. Production builds ignore the flags.

The sampler reuses the existing 14,336 ETOPO-derived land points and the current camera. A screen lattice limits overlap. Neighbour occupancy selects `-`, `|`, `/` or `\` at coastlines; `+`, `*` and `#` express interior relief. Depth controls ink and the limb. Sparse ocean glyphs describe the sphere without a filled gradient disc. Type is at least 8px on a narrow stage and 10px on desktop, with a bounded lattice below 15,000 cells even for very large spheres.

This is an **ASCII surface prototype with the existing vector routes and city markers retained**, not a claim that every mark has been converted to ASCII. Captions and all travel behavior stay shared with production. The integration harness verifies identical city/progress frames and successful reverse playback, but simulates canvas calls and does not rasterize them.

Reviewed offline plates: [desktop](artifacts/ascii-pass/globe-desktop.png) and [mobile geometry](artifacts/ascii-pass/globe-mobile.png). Africa, Europe and Asia remain recognizable; the lighter character surface belongs more naturally beside the ocean. Small islands lose definition, particularly on the phone-sized plate. The directional coast glyphs can become angular. The fixed screen lattice also requires a motion review for glyph changes during rotation.

These plates use the actual sampler and terrain. The baseline wash is illustrative; web fonts are substituted with Consolas. Routes, captions, live backgrounds and animation are omitted. **They are not browser screenshots or full-page visual acceptance.** Keep the prototype off by default until marker contrast, geographic detail and motion are assessed in-browser and on iPhone.

## 5. Seven-city constellation proposal

Preview `http://127.0.0.1:5173/?journeys&cityConstellation=1` on the local development server. [Offline composition study](artifacts/ascii-pass/constellation.png).

Seven faint stars represent Doha → Paris → Jakarta → Moscow → Singapore → Pau → Shanghai, joined by sparse directional ASCII traces. The layout is a composed constellation, not a geographical projection. It is cached at resize and inserted into the arrival field's existing lattice, palette, quiet-text mask, fade and scheduler. It creates no additional canvas, RAF loop, listener or WebGL context. It stays still under the field's existing reduced-motion handling and fades during handoff.

Recommendation: retain as an unlabelled, peripheral motif. Adding seven visible city labels to the cosmic choice screen would compete with the journeys. Whether the quiet mask obscures too much of the motif on real mobile layouts remains a visual acceptance question. It has no connection to the Globe entrance or whale movement.

## 6. Professional UX improvements

The cover's Profile anchor makes one native fragment jump beyond the entire Globe runway. It intentionally does not animate a scroll across cinematic thresholds. The existing anchor/hash navigation cancellation releases controller ownership before subsequent input. The destination is a labelled section that can receive focus. It preserves normal URL/history semantics and the ability to scroll back into the journey.

The new regression executes the actual Globe controller/renderer with desktop wheel and mobile touch input: jump out during playback, verify ownership release and a stable destination, then reverse back through the Globe to Doha. This establishes controller behavior in simulation. Browser focus placement, Back navigation, actual hit targets and final layout remain unverified.

The shortcut appears on the Hero after entry or Skip Intro; it is not persistent navigation and does not alter the cosmic route chooser. Existing depth-gauge navigation remains available in the CV. Profile now bridges the immersive journey and the professional facts with a plain, wrapping city line. Experience, Education, Skills, Languages, Interests and Contact retain their existing editorial layouts and original information. No generic cards or delayed-reading layers were added.

## 7. Typographic animation refinements

Preview `http://127.0.0.1:5173/?textMotion=entrance#introduction`.

The experiment retains the current entrance wave and its 600ms cap, but resolved lines stay readable through exits and reversal. A fast jump past a line resolves it instead of leaving it encrypted. Revealed state survives the existing layout cache. Reduced motion resolves immediately. The original reversible behavior remains the default.

This is a reading-rhythm comparison, not a redesign of the Hero or signature typography. A subsequent pass should compare entrance-only body copy with the strongest reveals reserved for section titles. Hidden-tab suspension is enabled independently of the experiment. No measured CV frame-time improvement is claimed without a browser trace.

## 8. Performance and regression-test results

| Check | Result / evidence boundary |
| --- | --- |
| Full Node suite | 199 passed, 0 failed; approximately 54.7s on this run |
| Final targeted checks after build-gating changes | 13 passed: Globe integration, flags, sampler, constellation and surface lifecycle |
| TypeScript | `npx tsc --noEmit` passed |
| Production build | Passed; output in ignored `node_modules/.cache/ascii-pass-build`, tracked dist untouched |
| Diff whitespace | `git diff --check` passed |
| Production flag/diagnostic strings | No matches for asciiGlobe, cityConstellation, textMotion, __globeDiagnostics or data-globe-diagnostics in final generated JS |
| Three journeys, Hero timing, fixed-speed/reverse, Skip Intro, reduced motion | Existing model/controller tests pass; complete browser flows not executed |
| Desktop/mobile visuals | Offline geography plates inspected; real page layouts unverified |
| iOS Safari | Not tested on hardware |

Offline CPU benchmark, Node v24.21.0 on AMD Ryzen 7 7735U; 60 warmup and 200 measured sampling iterations:

| Geometry | Median CPU sampling | p95 | Mean emitted glyphs |
| --- | ---: | ---: | ---: |
| 1000×800 desktop stage | 0.288ms | 0.378ms | 2,784 |
| 358×844 narrow stage | 0.207ms | 0.257ms | 1,285 |

Both rows ran on the same desktop CPU. The narrow row is **not a phone benchmark**. These measurements exclude canvas glyph rasterization, React, DOM, compositing and GPU completion. Existing land rendering uses at most twelve batched fill calls; the experiment emits many fillText calls. CPU geometry cost alone cannot justify promotion. [Raw metrics](artifacts/ascii-pass/metrics.json).

Reproduce geometry/benchmark plates with `node dev/portfolio-review.mjs` and `python dev/render-portfolio-review.py`. The Python helper requires Pillow and currently uses the Windows Consolas font path. Intermediate geometry is kept in ignored node_modules cache.

Final build sizes: portfolio JS 222.77kB / 84.21kB gzip, portfolio CSS 58.85kB / 12.10kB gzip, ambient whale chunk 520.76kB / 139.61kB gzip. These are final sizes, not an asserted before/after savings measurement. Existing warnings persist for the experimental Tailwind option, ignored use-client directives/sourcemap reporting in the demo dependencies, and the large whale chunk.

Cleanup audit: archivedComponents had no imports; MigrationRunway had no callers. Their removal reduces maintenance risk, not a claimed runtime gain from already-unmounted code. Liquid Glass is a configured, reachable secondary build entry, so it was retained. migrationScene still has live imports from AsciiWhaleBackground; full extraction would require a separate reachability/fallback audit. The main page has a single Google Fonts stylesheet and uses the different families for different roles; no safe duplicate font request was established.

## 9. Remaining risks and acceptance work

Real Safari still needs testing for native momentum/rubber-banding, root overflow behavior, non-cancelable events, toolbar collapse, rotation, background/foreground, navigation restoration and long-session rendering pressure. The new surface observers do not change scroll ownership or make these risks disappear.

The ambient whale renderer has context loss/restoration handling; the lower-level glyph batch has a context-loss/alive path. Actual context loss/recovery across the complete scene stack was not exercised. No new WebGL system was introduced.

Physical acceptance should cover all three routes, Skip Intro, the Profile link and reverse entry, repeated/violent swipes, a finger held through Shanghai, landscape changes at Doha and mid-journey, reduced motion, and Safari background/return. With local `?globeDebug`, compare timelineY/documentY, timelineProgress/renderedProgress and cityIndex. Record the iPhone model, iOS/Safari version and screen recording/trace. Any stale document/renderer disagreement is a failure even if city React state changes.

Browser QA is blocked by the Computer Use URL-policy determination failure. Offline images, mocked integration tests and desktop CPU timings are explicitly separate evidence. No pixel-perfect layout, contrast, FPS or iPhone-resolution claim is made.

## 10. Five strongest recommendations for the next pass

1. Obtain a physical iPhone Safari trace before changing the default Globe. Prioritize momentum, toolbar/rotation and intro-to-Globe ownership handoff.
2. Compare the two Globe renderers with their actual city labels, routes and ocean backgrounds. Improve small-island detail and prototype route contrast; consider an atlas only if fillText is measured as a bottleneck.
3. Trial entrance-only body text with a few stronger section-heading entrances. Measure DOM writes and p95 frame time while reading and reversing, then decide whether to promote it.
4. Visually validate the Profile shortcut at 320/390px, keyboard focus, reduced motion and Back navigation. Keep the city line as the editorial connection to the journey.
5. Review the constellation in the existing mobile starfield before promotion, then separately audit remaining migration/fallback code and optional demo packaging. Preserve the ambient whales and current cinematic entrance throughout.
