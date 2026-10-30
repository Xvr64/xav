import React, { useEffect, useRef } from 'react';
import { whaleStage } from './oceanDirection';

/** The cinematic stage borrows the ambient renderer's same canvas and two meshes. */
export const WhaleConvergence: React.FC<{ firstCity: { lon: number; lat: number } }> = React.memo(({ firstCity }) => {
  const host = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const element = host.current;
    whaleStage.host = element;
    whaleStage.firstCity = firstCity;
    whaleStage.refresh?.();
    return () => {
      if (whaleStage.host === element) {
        whaleStage.host = null;
        whaleStage.firstCity = null;
        whaleStage.refresh?.();
      }
    };
  }, [firstCity]);
  return <div ref={host} data-whale-stage aria-hidden="true" className="absolute inset-0 pointer-events-none" />;
});
