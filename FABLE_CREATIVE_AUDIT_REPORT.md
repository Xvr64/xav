# Fable creative audit — completed continuation

13 November 2026. Baseline: `9b1b8b8`. **Keep Fable's work.** It makes the professional material easier to navigate and connects the seven-city film to the CV without adding another cinematic scene. The remaining priority is frame pacing, followed by small-screen itinerary polish and quieter composition behind important facts.

This continuation preserves all nine pre-existing modified/untracked source and test files byte-for-byte. No product code, scroll controller, cinematic timing, route, professional fact, experiment flag, or tracked `dist` output was changed. New files contain the audit, evidence, and browser QA harness only. Nothing was committed, pushed, or deployed.

## 1. Work recovered and reviewed

| Recovered change | Implementation and assessment |
| --- | --- |
| Seven-city itinerary | `itinerary.ts` reads the existing periods in `CV_DATA`. `OceanEntry.tsx` replaces the wrapping city list with a dated chronology. Desktop uses proportional lengths; below 1280px it becomes a table. The unaccounted-for 2024–2026 interval remains an unlabelled gap; Shanghai is a point, not an invented residence duration. Keep. |
| Chapter markers | `sections.ts` is the shared source for all seven headings, the desktop depth gauge, and the small-screen index, including Interests. Marks run from `01 / 07` to `07 / 07`. They are plain, aria-hidden labels, excluded from word decryption. **The numbers themselves are static**, rather than independently animated; existing title motion and itinerary reveals supply the animation. Keep. |
| Reading veil | A fixed, pointer-transparent gradient protects the top controls from passing text. Intersection observers gate it to the CV and wait until the Globe runway clears the top band. Recovered transition screenshots show no new horizontal band cutting the departing Globe. Keep. |
| Mobile/tablet index | A disclosure below 1101px lists all seven chapters, highlights the current chapter, jumps directly, and focuses the destination. Escape returns focus; scrolling, outside taps, and widening dismiss it. It takes no root scroll lock. Keep. |

Existing files changed by Fable: `DepthGauge.tsx`, `OceanEntry.tsx`, `SectionIndex.tsx`, `terminal.css`, and `xavier_h_ry_editorial_portfolio.tsx`. New Fable files: `itinerary.ts`, `itinerary.test.mjs`, `sections.ts`, and `sections.test.mjs`. An exact starting backup and hash manifest are in `node_modules/.cache/fable-continuation/`.

## 2. Visual comparisons and responsive verification

The recovered comparisons are actual Chrome captures, not design mockups. They are similar views, not pixel-diff tests: whale poses and elapsed animation time vary. Some older full-section captures include the opt-in debug panel; the clean paired captures and new continuation captures do not.

| View | Before → after finding | Evidence |
| --- | --- | --- |
| Desktop Profile | Slash-separated destinations become an intelligible duration-based chronology. Dates, the 2024–2026 gap, and Shanghai's endpoint add meaning without cards. The right margin remains clear of the depth gauge. | [Before](artifacts/fable-audit/recovered/ba-before-d-profile.jpg), [after](artifacts/fable-audit/recovered/ba-after-d-profile.jpg) |
| Mobile Profile | The two-line list becomes seven aligned year/city rows. Much easier to scan, but occupies more vertical space and pushes the fact summary down. A worthwhile tradeoff. | [Before](artifacts/fable-audit/recovered/ba-before-m-profile.jpg), [after](artifacts/fable-audit/recovered/ba-after-m-profile.jpg) |
| Fixed controls | The previous Education text collides with sound/CV controls. Afterward, copy dissolves beneath a clear control area; the added Index stays readable. | [Before](artifacts/fable-audit/recovered/ba-before-m-collision.jpg), [after](artifacts/fable-audit/recovered/ba-after-m-collision.jpg) |
| Experience | `02 / 07` supplies a useful chapter cue above the serif heading. The established asymmetry, roles, dates, and bullet hierarchy survive. | [Before](artifacts/fable-audit/recovered/ba-before-d-experience.jpg), [after](artifacts/fable-audit/recovered/ba-after-d-experience.jpg) |
| Phone/tablet index | Seven large, legible entries with a quiet wave on the current chapter. At 844×390 the sheet scrolls internally instead of overflowing the viewport. | [390px](artifacts/fable-audit/index-390x844.png), [900px](artifacts/fable-audit/index-900x900.png), [landscape](artifacts/fable-audit/index-844x390.png) |
| Itinerary limits | At 1280px, Pau and Shanghai fit but feel crowded. At 320px, the longest wave rules are clipped at the screen edge; the city/date text still fits. | [1280px](artifacts/fable-audit/itinerary-1280.png), [320px](artifacts/fable-audit/itinerary-320.png) |

Fresh automated browser checks covered 320×740, 390×844, 768×1024, 900×900, 1100×900, 1101×900, 1180×900, 1280×900, 1440×900, and 844×390. Every size has all seven correct chapter marks. The index is available through 1100px and hidden from 1101px. There is no horizontal document scrolling.

All seven index destinations received keyboard focus, closed the sheet, and left Globe ownership unlocked. Profile lands at section top 0 with its chapter mark at 64px; the other sections land around 173px, clear of the controls. [Profile landing](artifacts/fable-audit/profile-index-landing.png). Escape focus return and closing at the desktop breakpoint passed. Reduced motion disables the itinerary animation, menu/item animations, and veil transition. Fable's recovered touch test was also rerun successfully: open/current chapter, Experience jump, scrolling dismissal, Escape, outside tap, and return above the CV. No browser exceptions were recorded in the new responsive checks.

## 3. Desktop/mobile performance and DOM cost

Values below are milliseconds. Means are the average of the two run means; p95 columns show the range across runs, not an averaged percentile.

| View / workload | Before mean | Final mean | Mean change | Before p95 | Final p95 |
| --- | ---: | ---: | ---: | ---: | ---: |
| Desktop CV scroll | 10.72 | 11.13 | +0.41 (+3.8%) | 16.9–25.0 | 25.0–25.1 |
| Desktop Hero scroll | 11.82 | 12.00 | +0.18 (+1.6%) | 17.0–17.1 | 25.0–25.1 |
| Desktop Globe | 14.66 | 15.37 | +0.71 (+4.8%) | 49.9–50.0 | 50.0–50.1 |
| Desktop idle CV | 8.36 | 8.35 | −0.02 | 8.5 | 8.5 |
| Mobile-emulated CV scroll | 10.14 | 10.37 | +0.24 (+2.3%) | 16.7 | 16.8 |
| Mobile-emulated Hero scroll | 11.00 | 10.94 | −0.06 | 16.8 | 16.7–16.9 |
| Mobile-emulated Globe | 11.85 | 12.12 | +0.27 (+2.3%) | 33.3–41.6 | 41.6–41.7 |
| Mobile-emulated idle CV | 8.35 | 8.35 | approximately 0 | 8.5–8.7 | 8.5–8.7 |

**Interpretation:** the final patch has a small measured average cost, not zero cost. Its idle behavior is unchanged. The desktop Hero tail increased in these runs despite a small mean difference, so it should remain on the regression watch list. The large periodic Globe spikes already exist in the baseline and dominate the cost of the added elements. These are whole-patch comparisons, not a causal per-element cost model.

Method: private headless Chrome using D3D11/GPU flags on this Windows machine; 1440×900/DPR 1 desktop and 390×844/DPR 2 Chrome touch emulation. Both versions use Vite development servers, the same font readiness/warmup, 900px/s CV scrolling, and a nine-second Globe sample. There are two trials per version/device, with reversed before/after order in the second trial. Runs are sequential, without simultaneous benchmark browsers. Diagnostics and rejected experiment flags are off. The roughly 8.3ms idle cadence is this machine's browser scheduling, not an iPhone refresh-rate measurement.

The benchmark verifies Shanghai after each Globe run. Mean frame intervals and p95 describe browser scheduling, not isolated Globe draw duration, GPU timings, production Core Web Vitals, or a controlled hardware lab. Two trials can reveal a consistent direction, but cannot establish statistical significance. CV duration also changes with the itinerary's added page height.

The final closed-page DOM adds **45 elements**: desktop 1654 → 1699 (+2.7%); mobile 1646 → 1691 (+2.7%). Fable's earlier intermediate benchmark added 212 elements, before the itinerary's labels were simplified to plain text. Those intermediate numbers must not be presented as the final patch's cost. The open menu is mounted only on demand. Chapter marks and itinerary labels avoid the decoder's per-word wrapper multiplication. No new permanent JavaScript animation loop is introduced.

Raw evidence: [performance.json](artifacts/fable-audit/performance.json). The recovered intermediate desktop comparison was 14.76 → 14.78ms mean Globe interval, p95 50 → 50ms; mobile was 11.68 → 12.59ms, p95 33.4 → 41.9ms. These explain Fable's concern, but the fresh final-code measurements above supersede them.

## 4. Periodic Globe spikes

**Finding: water CSS propagation is a major contributor to the periodic spikes.** Chrome traces and a temporary browser-only ablation agree. Each device was sampled normally, with the four water properties suppressed, then normally again. All six runs reached Shanghai with no browser exceptions. Tracing adds overhead; compare this table internally, not as another production benchmark.

| Trace experiment | Normal runs | Water writes suppressed | Result |
| --- | --- | --- | --- |
| Desktop Globe p95 | 50.0–50.1ms | 16.8ms | Substantial tail reduction |
| Desktop frames >34ms / 9s | 41–43 | 8 | Most periodic hitches removed; some long frames remain |
| Desktop total style recalculation | 1.476–1.548s | 0.437s | About 71% lower than mean normal cost |
| Desktop total layout | 0.461–0.498s | 0.190s | Layout cost also falls |
| Mobile-emulated Globe p95 | 41.8–50.0ms | 16.8ms | Same direction under touch emulation |
| Mobile-emulated frames >34ms / 9s | 43 | 8 | Not an iPhone measurement |
| Mobile-emulated total style recalculation | 1.425–1.451s | 0.433s | About 70% lower than mean normal cost |
| Mobile-emulated total layout | 0.454s | 0.141s | Same direction |

Normal traces contain 41–42 style updates longer than 10ms; suppression leaves 4–6. The water setters form 38–39 bursts with median spacing around 242–244ms, consistent with the 240ms publisher. Individual normal style events reach roughly 36–46ms. Suppression does **not** eliminate the worst individual frame (83–100ms in those diagnostic runs), so it does not establish that water updates are the only cause. [Raw metrics and style events](artifacts/fable-audit/hitches.json).

The pre-existing `oceanWorld.ts` publishes water CSS variables on the document root at most every **240ms**, with a trailing update. The opaque ocean canvas continues drawing its exact color each frame. `--abyss-wash`, `--abyss-halo`, and related inherited values affect a large subtree, including text shadows. `abyssPalette.ts` also publishes the ink transition near the dark/light crossover. Root inheritance and style work are plausible sources of periodic cost; neither code inspection nor setter duration alone proves causation.

The continuation therefore records Chrome style/layout metrics and timeline events, then repeats the film with only the four water CSS writes suppressed **inside a disposable browser session**, bracketed by normal runs. This is a diagnostic ablation, not an acceptable visual fix: freezing the variables changes halos/veils and would make them disagree with the ocean. No such suppression was written to the application.

Fable's earlier timing heuristic found 43 long frames and 41 root-write timestamps, but only 9 long frames within its ±40ms test. That heuristic was not conclusive attribution. The trace/ablation comparison here is stronger evidence, while still allowing other canvas, decode, palette, paint, and compositor costs.

Recommended future investigation: narrow the scope of frequently changing water properties to their actual consumers, avoid inheriting them through unrelated editorial descendants, and batch geometry reads before style writes. Validate matched screenshots across the ink crossover and Globe/Profile handoff before shipping anything. Do not alter the working mobile controller or stretch the 240ms interval blindly.

## 5. Confirmed defects and remaining risks

| Finding | Severity / disposition |
| --- | --- |
| 320px decorative rules extend past the viewport | Minor, confirmed. Jakarta ends at x326.8 and Singapore at x344.8 on a 320px viewport. Root clipping masks the overflow. Refine the narrow-table duration scale to fit its available column; preserve relative durations rather than simply truncating both longest bars to the same length. No source change in this continuation. |
| Periodic long Globe frames | Confirmed in baseline and final code. Investigate style propagation first; do not confuse these hitches with the previous ownership freeze. |
| Dense whale silhouettes behind facts | Artistic/readability risk, visible in Profile, Education, and Contact captures. Existing masking helps, but broad surfaces can still compete with metadata. Refine the existing negative-space masks; do not add creatures or redesign the Globe entrance. |
| Pau/Shanghai near the 1280px switch | Crowded but no confirmed label overlap. Refine label spacing or the table/line breakpoint after narrow-font and zoom checks. |
| Seven-city itinerary vs eight cities in Profile prose | Existing prose includes Bordeaux; the Globe data does not. The itinerary correctly follows the seven Globe stops and leaves 2024–2026 unassigned. Its title could clarify that scope. Do not infer missing residence dates or edit biography facts without evidence. |
| Real iOS acceptance | Fable's original brief records the user's successful real-phone confirmation of `9b1b8b8`. This continuation preserves that fix. No new physical-iPhone/Safari session occurred; Chrome emulation cannot recertify touch momentum, toolbar changes, or Safari compositing. |
| Accessibility beyond these checks | Semantic navigation, focus, reduced motion, and layout were checked. A full screen-reader audit, forced-colors/zoom sweep, and live Safari scroll-driven-animation comparison were not performed. Static fallback rules exist in the CSS. |
| Build warnings | Existing experimental Tailwind warning, ignored `use client`/sourcemap reporting warnings, and ~521kB ambient-whale chunk remain. Successful build does not remove that download/parse budget risk. |

The old source comment that the veil necessarily costs exactly one compositor layer is an implementation expectation, not a measured guarantee; this audit does not claim a layer count.

## 6. Tests and preservation

| Check | Result |
| --- | --- |
| Full unit suite | `node --test --test-reporter=spec *.test.mjs`: **212 passed, 0 failed, 0 skipped**, 62.5s. Includes all original mobile ownership, renderer synchronization, three-route, reversal, navigation, and new itinerary/section tests. [Log](artifacts/fable-audit/unit-tests.log) |
| TypeScript | `npx tsc --noEmit`: passed, exit 0. |
| Production build | Passed in 28.3s, 8357 modules transformed; written to `node_modules/.cache/fable-continuation/build`, leaving tracked `dist` untouched. [Log](artifacts/fable-audit/production-build.log) |
| Build gating / whitespace | `git diff --check` passed. Generated JavaScript contains no `asciiGlobe`, `cityConstellation`, `__globeDiagnostics`, or `data-globe-diagnostics` strings. |
| Responsive/navigation browser checks | Passed as described above. [Results](artifacts/fable-audit/verification.json) |
| Three entry journeys | Recovered Fable browser evidence: Direct 18.9s, Passage 24.6s, Odyssey 36.3s to completion, plus Skip Intro. These are observed harness wall times including polling, not revised cinematic constants. Not rerun unnecessarily. |
| Reverse/Globe/reduced motion | Recovered corrected browser checks pass desktop forward/reverse through all cities, Profile shortcut, mobile Direct entry, mobile forward/reverse, and desktop/mobile reduced motion. Fresh benchmarks also reach Shanghai. [Recovered log](artifacts/fable-audit/recovered/browser-results.txt) |
| Earlier browser harness failures | Preserved in the recovered log for honesty: an unset diagnostic-progress expectation and a swipe consumed by arrival at Doha initially failed. Fable corrected the harness/gesture staging and reproduced the successful behavior against both baseline and new code. They are not evidence of a newly introduced product freeze. |
| Source preservation | All nine recovered files compared against starting SHA-256 hashes. Protected controller, renderer, timelines, and experiment defaults match HEAD. No new animation or convergence code. |

Reproduction: `node dev/fable-audit.mjs verify`, `perf`, or `hitch`. `FABLE_BASE` selects an unchanged baseline checkout with installed dependencies; `CHROME_PATH` can override the Windows Chrome location. Browser profiles and full traces stay in the ignored cache. The harness starts and stops its own local servers; it does not deploy or change product source.

## 7. Completed creative assessment

These are the continuation's editorial judgments based on recovered browser evidence and the new comparisons, not recovered numerical scores attributed to Fable. **Overall: 77/100**, the rounded mean of these fifteen scores. A distinctive, coherent portfolio with real craft; frame pacing and reading clarity still separate it from an exceptional finished experience.

| Dimension | /10 | Reason |
| --- | ---: | --- |
| Artistic direction | 8 | Cosmic-to-ocean identity is coherent; the CV now shares its instrument language. |
| Originality | 8 | Whale material and geographic autobiography are distinctive. |
| ASCII quality | 8 | Recognizable, rich forms; dense silhouettes occasionally overwhelm hierarchy. |
| Cinematic quality | 7 | Strong scenes and preserved transitions; periodic hitches weaken polish. |
| Choreography/pacing | 7 | Three routes offer choice; professional reading needs more contrast with spectacle. |
| Typography | 9 | Serif display and restrained mono metadata form the strongest visual system. |
| Editorial layout | 8 | Asymmetric grid, role/date separation, and itinerary reward scanning. |
| Color continuity | 8 | Shared water/ink palette connects the descent and CV; propagation is expensive. |
| Ocean atmosphere | 8 | Depth and texture are convincing without extra scenery. |
| Whale presentation | 8 | Memorable scale and silhouette; some poses intrude into reading areas. |
| Globe | 7 | Geographic/caption clarity and fixed-speed progression work; material differs from the ASCII environment and pacing hitches remain. |
| Professional credibility | 8 | Facts are preserved and scannable; more substantiated work evidence would help. |
| UX/navigation | 8 | Hero shortcut, depth gauge, and new index cover complementary contexts. |
| Mobile responsiveness | 7 | Useful disclosure and readable table; 320px bars and hardware follow-up remain. |
| Performance/accessibility | 6 | Strong regression coverage and reduced motion; frame spikes and incomplete assistive-technology/device testing limit confidence. |

Five weakest aspects: (1) long-frame pacing; (2) whale/text competition; (3) similar reveal treatment across different kinds of content; (4) geographic scope ambiguity and limited proof beside skills/experience; (5) edge-width and assistive-technology acceptance gaps. Navigation was a major weakness before this pass and is materially improved.

## 8. Research recovered, rather than restarted

Fable's recorded browser/search actions and limited provenance notes are retained in [research-tools.json](artifacts/fable-audit/recovered/research-tools.json) and [research-excerpts.txt](artifacts/fable-audit/recovered/research-excerpts.txt). Research claims below concern the material actually recovered, not a fresh audit of those sites.

| Reference | Evidence level | Useful principle for this portfolio |
| --- | --- | --- |
| [Obys Grids](https://grids.obys.agency/) | Fable visited, scrolled, captured screenshots, and read page text. | Make chapter progression and negative space carry the composition. The recovered numbered headings are a good application without copying its identity. |
| [Alex Harri: ASCII characters are not pixels](https://alexharri.com/blog/ascii-rendering) | Article read and scrolled in-browser; no recorded manipulation of the demos. | Future whale-contour work should judge character shape and edge contrast, not just density. This does not justify reviving the rejected Globe. |
| [ertdfgcvb Play](https://play.ertdfgcvb.xyz/) | Visited and screenshot captured; no recorded code editing or exhaustive demo testing. | Treat characters as the material of the scene. Favor deliberate local glyph behavior over another particle overlay. |
| [Shape-aware ASCII in Three.js](https://tympanus.net/codrops/2026/09/04/beyond-the-luminance-ramp-a-shape-aware-ascii-renderer-in-three-js/) | Codrops article text researched; live performance not independently measured. | Evaluate a compact contour atlas in isolation before adding rendering complexity. |
| [Obys digital narratives](https://tympanus.net/codrops/2026/03/06/obys-the-small-studio-designing-big-digital-narratives/) | Article text researched. | Alternate dense imagery with calm reading space; do not lengthen the film to create distinction. |
| [Efecto ASCII/dithering](https://tympanus.net/codrops/2026/01/04/efecto-building-real-time-ascii-and-dithering-effects-with-webgl-shaders/) | Article text researched, not an interactive Efecto benchmark. | Compare texture/tonal treatments in the existing renderer, with a bounded palette and no extra fullscreen pass by default. |

The archive includes Awwwards-related searches, but does not establish broad interactive inspection of award winners or CSS Design Awards. No such coverage is claimed here.

## 9. Ranked opportunity register — completing the original 20-idea brief

This is a completed shortlist derived from Fable's recovered direction and the continuation findings; it is not a claim that Fable wrote these exact proposals. Only the four already-recovered components are implemented. Scores are subjective: artistic impact (A), originality (O), UX benefit (U), implementation complexity (C), and performance risk (P), all /10; lower C/P is preferable. Ranking emphasizes practical value over spectacle.

| Rank | Specific opportunity, experience, and fit | A | O | U | C | P | Likely systems / status |
| --- | --- | ---: | ---: | ---: | ---: | ---: | --- |
| 1 | Reduce periodic inherited palette work so the existing film feels continuous without changing its speed. | 8 | 3 | 10 | 7 | 6 | `oceanWorld`, `abyssPalette`, CSS; future investigation |
| 2 | Fit duration bars to the 320px table column while keeping their year ratios; prevents decorative clipping. | 6 | 4 | 9 | 2 | 1 | Itinerary CSS; refine |
| 3 | Make the seven-city chronology readable as years, places, and an honest gap; carries the film into professional biography. | 8 | 7 | 8 | 4 | 2 | `itinerary`, `OceanEntry`; recovered/keep |
| 4 | Provide the seven-chapter mobile index where the desktop gauge has no room; direct access without another scroll owner. | 7 | 5 | 10 | 4 | 2 | `SectionIndex`, `sections`; recovered/keep |
| 5 | Clear passing copy beneath fixed controls using the water's own color; fixes a visible collision. | 7 | 5 | 9 | 3 | 3 | Reading veil; recovered/keep |
| 6 | Tune the existing whale reading masks around dates, degrees, and the contact action; retain scale in the margins. | 8 | 6 | 9 | 5 | 3 | `whaleVeil`, `oceanDirection`, reading-zone tracker; future |
| 7 | Carry `01 / 07` chapter language through headings and navigation; bridges the film's count and CV structure. | 7 | 6 | 8 | 2 | 1 | Shared sections/markers; recovered/keep |
| 8 | Clarify that the itinerary covers the Globe's seven stops; keep Bordeaux in the prose without inventing dates. | 5 | 4 | 8 | 1 | 1 | `OceanEntry` copy; future editorial refinement |
| 9 | Give only major section-title entrances a distinct reveal rhythm; keep dates and body facts stable and immediately legible. | 8 | 7 | 7 | 5 | 4 | Existing editorial decoder; future isolated comparison, no timing changes now |
| 10 | Compare one restrained weight/spacing hierarchy for employer, role, date, and scope to reduce repeated visual emphasis. | 7 | 5 | 8 | 3 | 1 | Editorial CSS; future typography study |
| 11 | Add a small evidence link beside a relevant internship or skill when real work samples are supplied; no invented achievements. | 6 | 5 | 9 | 3 | 1 | `cvData`, Experience/Skills; content-dependent future |
| 12 | Make all index destinations share deliberate URL/history behavior with the existing Profile shortcut; preserve instant jumps. | 4 | 3 | 8 | 4 | 2 | `SectionIndex`, navigation regressions; future |
| 13 | Let short landscape screens reveal the last index entries with clearer overflow affordance and safe focus scrolling. | 5 | 4 | 8 | 3 | 1 | Index CSS/interaction; future refinement |
| 14 | Give the print/PDF reading order the same chapter/date hierarchy as the page; professional continuity outside the film. | 5 | 4 | 8 | 4 | 1 | Print CSS/PDF workflow; future |
| 15 | Refine Pau/Shanghai label placement at the desktop threshold without distorting the chronology's duration scale. | 6 | 5 | 7 | 3 | 1 | Itinerary layout; future |
| 16 | Rebalance existing near/far whale ink so silhouette depth remains clear while the main reading column stays calm. | 8 | 6 | 6 | 5 | 4 | Existing whale tone/palette controls; future art-direction study |
| 17 | Prototype temporal hysteresis for contour glyph selection: suppress unstable adjacent-glyph flicker without adding trail particles. | 8 | 8 | 5 | 8 | 6 | `whale3dRenderer`/glyph batching; ambitious, isolated only |
| 18 | Prototype a tighter directional glyph atlas for just the whale flank and fluke boundaries, preserving the existing rig and renderer. | 9 | 8 | 5 | 8 | 7 | Whale shape sampling; ambitious, isolated only |
| 19 | Prototype a short, bounded persistence treatment in the existing ocean field's wake samples, fading before any reading zone. | 8 | 8 | 4 | 8 | 7 | Existing ocean field; ambitious, isolated only |
| 20 | Compose Contact as the calmest point of the descent by tuning existing masks/density around the email and CV actions. | 8 | 6 | 7 | 4 | 3 | Contact composition, existing masks; future |

**Five strongest next steps:** scoped palette/style work (1), narrow itinerary fit (2), better negative space behind facts (6), a selective heading-only motion study (9), and evidence-backed professional content (11). For art direction specifically, prioritize 6, 9, 16, and 20 before the ambitious renderer experiments. None requires new scenes or altered cinematic durations.

**Three ambitious ideas:** 17–19, only as isolated visual/performance studies. None involves whale-to-Globe choreography, a constellation overlay, or enabling the rejected ASCII Globe.

**Three simplification candidates:** reduce repeated decorative scrambling on low-priority metadata if still distracting in a targeted reading test; reduce bright overlapping whale surfaces behind facts; exclude the unrelated Liquid Glass demo from a future portfolio-only build if it is confirmed unnecessary. Do not remove active functionality or weaken the signature Hero/entry motion as part of this continuation.

## 10. Keep, refine, or revert

- **Keep:** all four recovered improvements, shared section data, plain itinerary labels, existing motion fallbacks, current Globe entrance, and the proven mobile ownership correction.
- **Refine next:** 320px duration bars, Pau/Shanghai spacing, explicit seven-stop scope, dense whale/text overlaps, and the measured style propagation bottleneck. Gate further art experiments on stable frame pacing and a fresh physical-iPhone check.
- **Revert now:** none of Fable's work. There is no demonstrated regression severe enough to justify discarding it. Keep the rejected ASCII Globe and constellation disabled, and the removed whale-to-Globe convergence absent.

The strongest creative move in this pass is editorial continuity: the film's geography becomes a readable life chronology, and its count becomes a navigation system. Finish the remaining rendering and edge-layout polish before adding another visual effect.
