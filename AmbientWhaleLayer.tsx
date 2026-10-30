import React, { useEffect, useRef } from 'react';

export const AmbientWhaleLayer = React.memo(() => {
  const host = useRef<HTMLDivElement>(null);
  useEffect(() => {
    let disposed = false;
    let destroy: (() => void) | undefined;
    import('./ambientWhaleRuntime').then(({ mountAmbientWhales }) => {
      if (!disposed && host.current) destroy = mountAmbientWhales(host.current);
    }).catch(() => undefined);
    return () => { disposed = true; destroy?.(); };
  }, []);
  return <div ref={host} data-ambient-whales aria-hidden="true" className="absolute inset-0 pointer-events-none" />;
});
