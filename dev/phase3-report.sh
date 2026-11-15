#!/usr/bin/env bash
# Builds the Phase III report's comparison sheets from the harness's captures.
#   PHASE3_OUT=<captures> bash dev/phase3-report.sh        (after: node dev/phase3.mjs frames 1440,390 && node dev/phase3.mjs water 1440,390)
# Sheets go to artifacts/phase3/. "water" sheets are the ocean's own canvas with its contrast
# stretched, so the glyphs can be read in a still; "page" sheets are the page as it is seen.
set -euo pipefail
SRC="${PHASE3_OUT:-artifacts/phase3}"
OUT="artifacts/phase3"
F="$SRC/frames"
W="$SRC/water"
mkdir -p "$OUT"
sheet() { python dev/phase3-sheet.py "$@"; }

# 2 · Flow-aligned currents
sheet --enhance "$OUT/flow-water-cover.jpg" full 0.7 1 "cover-before=$W/1440-cover-a-before.jpg" "cover-flow=$W/1440-cover-b-flow.jpg"
sheet --enhance "$OUT/flow-water-interests.jpg" full 0.7 1 "interests-before=$W/1440-interests-a-before.jpg" "interests-flow=$W/1440-interests-b-flow.jpg"
sheet "$OUT/flow-page-experience.jpg" 380,20,1100,320 1.6 1 "page-before=$F/1440-experience-a-before.jpg" "page-flow=$F/1440-experience-b-flow.jpg"

# 4 · Sea states (with flow, which is how they read best), every section
sheet --enhance "$OUT/sea-water-sections.jpg" full 0.4 2 \
  "experience-before=$W/1440-experience-a-before.jpg" "experience-sea+flow=$W/1440-experience-d-flow-sea.jpg" \
  "skills-before=$W/1440-skills-a-before.jpg" "skills-sea+flow=$W/1440-skills-d-flow-sea.jpg" \
  "education-before=$W/1440-education-a-before.jpg" "education-sea+flow=$W/1440-education-d-flow-sea.jpg" \
  "languages-before=$W/1440-languages-a-before.jpg" "languages-sea+flow=$W/1440-languages-d-flow-sea.jpg" \
  "interests-before=$W/1440-interests-a-before.jpg" "interests-sea+flow=$W/1440-interests-d-flow-sea.jpg" \
  "contact-before=$W/1440-contact-a-before.jpg" "contact-sea+flow=$W/1440-contact-d-flow-sea.jpg"
sheet "$OUT/sea-page-sections.jpg" full 0.5 2 \
  "skills-before=$F/1440-sea-skills-a-before.jpg" "skills-sea+flow=$F/1440-sea-skills-c-sea-flow.jpg" \
  "languages-before=$F/1440-sea-languages-a-before.jpg" "languages-sea+flow=$F/1440-sea-languages-c-sea-flow.jpg" \
  "interests-before=$F/1440-sea-interests-a-before.jpg" "interests-sea+flow=$F/1440-sea-interests-c-sea-flow.jpg"

# 3 · Wake memory (yellow: the whales' spines; the dot is the snout)
sheet --enhance "$OUT/wake-water.jpg" full 0.5 2 \
  "1-without=$W/1440-wake-1-a-before.jpg" "1-wake=$W/1440-wake-1-b-wake.jpg" \
  "2-without=$W/1440-wake-2-a-before.jpg" "2-wake=$W/1440-wake-2-b-wake.jpg" \
  "3-without=$W/1440-wake-3-a-before.jpg" "3-wake=$W/1440-wake-3-b-wake.jpg"
sheet --enhance "$OUT/wake-water-after-scroll.jpg" full 0.7 1 "just-after-a-reading-scroll=$W/1440-wake-after-scroll.jpg"
sheet "$OUT/wake-page.jpg" full 0.5 2 \
  "experience-without=$F/1440-wake-experience-a-before.jpg" "experience-wake=$F/1440-wake-experience-b-wake.jpg" \
  "languages-without=$F/1440-wake-languages-a-before.jpg" "languages-wake=$F/1440-wake-languages-b-wake.jpg"

# Phone (390 px, Chrome touch emulation)
sheet "$OUT/phone-page.jpg" full 0.75 4 \
  "experience-before=$F/390-sea-experience-a-before.jpg" "experience-sea+flow=$F/390-sea-experience-c-sea-flow.jpg" \
  "interests-before=$F/390-sea-interests-a-before.jpg" "interests-sea+flow=$F/390-sea-interests-c-sea-flow.jpg"
sheet --enhance "$OUT/phone-water.jpg" full 0.75 4 \
  "cover-before=$W/390-cover-a-before.jpg" "cover-flow=$W/390-cover-b-flow.jpg" \
  "interests-before=$W/390-interests-a-before.jpg" "interests-sea+flow=$W/390-interests-d-flow-sea.jpg"
sheet --enhance "$OUT/phone-wake-water.jpg" full 0.75 4 \
  "1-without=$W/390-wake-1-a-before.jpg" "1-wake=$W/390-wake-1-b-wake.jpg" \
  "2-without=$W/390-wake-2-a-before.jpg" "2-wake=$W/390-wake-2-b-wake.jpg"

for name in smoke motion performance performance-extra identical; do
  [ -f "$SRC/$name.json" ] && cp "$SRC/$name.json" "$OUT/$name.json"
done
echo "sheets in $OUT"
