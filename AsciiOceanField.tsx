import React, { useEffect, useRef, useState } from 'react';
import GradientASCII from './GradientASCII';
import { onAbyssWash } from './abyssPalette';

// ============================================================================
// ASCII OCEAN FIELD — one shared GradientASCII layer under the whole page
// ============================================================================
// Fixed to the viewport beneath every other layer (hero current, whales, Globe, copy), so the
// portfolio sits inside a single slow ASCII water from the cover to the contact section. One
// composition throughout: the water rises from below the screen and thins out towards the top,
// leaving the reading height clear. It follows the same abyss value as the page water: sea-slate
// ink welling up from the depth on the white surface, faint sea-glass light from the abyss in
// the deep. The ink and light treatments can't blend into each other, so the layer fades out
// across the mid-tone where the page's own ink flips, swaps there and fades back in.

// The water level where the page ink turns light (the midpoint of inkMixFromAbyss)
const INK_FLIP = 0.54;

// Surface: pale water deepening to slate, read as ink on white
const SURFACE_COLORS = ['#E8EEEE', '#B7C8CA', '#7F9AA2', '#4E6B77', '#2F4858'];
// Deep: night water lifting to the site's sea-glass accent, read as faint light on black
const DEEP_COLORS = ['#0A1A22', '#24485A', '#4F7F8E', '#8FB4BE', '#D6E6EA'];

const smoothStep = (edge0: number, edge1: number, x: number) => {
  const t = Math.max(0, Math.min(1, (x - edge0) / (edge1 - edge0)));
  return t * t * (3 - 2 * t);
};

export const AsciiOceanField: React.FC = React.memo(() => {
  const layerRef = useRef<HTMLDivElement | null>(null);
  const [deep, setDeep] = useState(false);
  const [narrow] = useState(() => window.matchMedia('(max-width: 767px)').matches);

  useEffect(
    () =>
      onAbyssWash((abyss) => {
        // React skips the render when the side of the flip is unchanged
        setDeep(abyss >= INK_FLIP);
        const presence = smoothStep(0.02, 0.14, Math.abs(abyss - INK_FLIP));
        if (layerRef.current) layerRef.current.style.opacity = presence.toFixed(3);
      }),
    []
  );

  return (
    <div ref={layerRef} aria-hidden="true" className="fixed inset-0 z-0 pointer-events-none">
      <GradientASCII
        colors={deep ? DEEP_COLORS : SURFACE_COLORS}
        lightMode={!deep}
        shape="rise"
        characters=" .·:-~=+≈"
        fontFamily="'IBM Plex Mono', ui-monospace, SFMono-Regular, Menlo, Consolas, monospace"
        // Phones read in one column over the whole screen: a lower, thinner water there
        cellSize={narrow ? 12 : 14}
        density={narrow ? 0.45 : 0.55}
        glyphOpacity={deep ? 0.8 : 0.6}
        gradientOpacity={deep ? 0.14 : 0.08}
        glow={0}
        flicker={0.12}
        softness={0.7}
        scale={narrow ? 0.7 : 0.8}
        flow={0.9}
        speed={0.45}
        grain={0}
        mouseInteraction={false}
        clickEffect="none"
        dpr={Math.min(window.devicePixelRatio || 1, 1.5)}
        maxFps={30}
      />
    </div>
  );
});
