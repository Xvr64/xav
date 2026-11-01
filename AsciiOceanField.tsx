import React, { useEffect, useRef } from 'react';
import { createAsciiOcean } from './asciiOcean';

// ============================================================================
// ASCII OCEAN FIELD — the water the whole document sits in
// ============================================================================
// One screen-sized canvas beneath every other layer (hero current, whales, Globe, copy). It
// draws the document's ocean at the current scroll position (asciiOcean.ts), so the page
// travels through one continuous ASCII water from the sky-blue surface of the cover to the
// near-black abyss under the contact section, and it keeps the page's CSS water in the same
// colour. First in the stacking order, so it sits beneath the hero current.

export const AsciiOceanField: React.FC = React.memo(() => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ocean = createAsciiOcean(canvas);
    return () => ocean.destroy();
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      data-ascii-ocean
      className="fixed inset-0 z-0 pointer-events-none w-full h-full block"
    />
  );
});
