# Whale-driven ASCII cleanup

The page-wide glyph bed in both ocean shader paths is now silent. The separate ambient dot and marine-snow layers have been removed. The water colours and soft tonal currents remain.

Whale spine motion feeds the existing small wake textures. Only disturbed cells emit sparse directional strokes, which dissipate after the whale stops. No additional canvas, WebGL context, or animation loop was introduced.

Nearby resolved text uses the existing character controller: up to four words receive new pressure at once, individual letters move by at most 1.7 CSS pixels, and occasional faint ASCII wave accents follow the passage. Original letters, semantic text, layout, and the entry/exit decode remain intact. Focused controls and reduced-motion users are excluded. Geometry is cached until layout changes; listeners are removed on teardown.

## Verification

- 238 tests passed, including pressure locality, settling, existing whale/wake, Globe/mobile, journey, and reading-veil tests.
- `node node_modules/typescript/bin/tsc --noEmit` passed.
- `npm run build` passed. Vite reported non-fatal directive/sourcemap, experimental Tailwind, and chunk-size warnings.
- Real local Chromium rendering at 1440×900, 390×900, and 320×900; mobile widths used touch emulation and DPR 2. These are desktop-host measurements, not physical-phone measurements.
- All three sizes: no visible glyph cells outside whale wake memory; zero ocean glyphs after 3.8 seconds without whale movement; zero ocean glyphs under reduced motion; original affected letters retained; text returned to rest; no horizontal overflow or browser errors.
- Natural swimming visibly activated nearby text on every size. Controlled passage checks affected 1–4 words, with measured peak displacement between 1.21 and 1.37 CSS pixels.
- Three-second animation samples: p95 frame intervals of 8.4 ms desktop, 8.9 ms at 390px, and 8.5 ms at 320px. No sampled frame exceeded 34 ms.

`validation.json` contains the GPU cell counts, text assertions, and frame samples. `before-*`, `after-*`, and `rest-*` PNGs show the visual comparison. Only the text brief was attached, so the before images were captured from the unmodified checkout.

The CV layout, Hero, Globe, three journeys, whales, palette, reading veil, and navigation were preserved. Nothing was committed, pushed, or deployed.
