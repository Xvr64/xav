import React, { useEffect, useRef, useState, type ReactNode } from 'react';
import './editorialMedia.css';

type Study = 'profile' | 'experience' | 'education' | 'interests';

// The photographic essay has its own cut, independent of the Globe itinerary.
export const PROFILE_CITIES = ['Doha', 'Paris', 'Jakarta', 'Moscow', 'Singapore', 'Bordeaux', 'Shanghai'] as const;

type MediaStageProps = {
  study: Study;
  caption?: ReactNode;
  photo?: { src: string; alt: string };
  ascii?: ReactNode;
  /** The player owns its clock and controls. This signal only permits automatic playback. */
  renderPlayer?: (mayAutoplay: boolean) => ReactNode;
};

function ActivePlayer({ render }: { render: NonNullable<MediaStageProps['renderPlayer']> }) {
  const host = useRef<HTMLDivElement>(null);
  const [mayAutoplay, setMayAutoplay] = useState(false);
  useEffect(() => {
    const el = host.current!;
    const chapter = el.closest('[data-editorial-section]');
    const motion = matchMedia('(prefers-reduced-motion: reduce)');
    let visible = false;
    const update = () => setMayAutoplay(visible && !document.hidden && !motion.matches &&
      !chapter?.matches('[data-cv-muted], [data-cv-depart], [data-cv-arrive]'));
    const viewport = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      update();
    });
    viewport.observe(el);
    const chapterState = new MutationObserver(update);
    if (chapter) chapterState.observe(chapter, { attributeFilter: ['data-cv-muted', 'data-cv-depart', 'data-cv-arrive'] });
    document.addEventListener('visibilitychange', update);
    motion.addEventListener('change', update);
    return () => {
      viewport.disconnect();
      chapterState.disconnect();
      document.removeEventListener('visibilitychange', update);
      motion.removeEventListener('change', update);
    };
  }, []);
  return <div ref={host} className="media-original">{render(mayAutoplay)}</div>;
}

export function EditorialMedia({ study, caption, photo, ascii, renderPlayer }: MediaStageProps) {
  const [loadedSrc, setLoadedSrc] = useState<string>();
  const ready = Boolean(renderPlayer || (photo && photo.src === loadedSrc));
  return (
    <figure className={`editorial-media editorial-media--${study}`} data-ascii-preserve>
      <div className="media-aperture">
        {photo && <img key={photo.src} className="media-original" src={photo.src} alt={photo.alt}
          decoding="async" hidden={!ready} onLoad={() => setLoadedSrc(photo.src)} onError={() => setLoadedSrc(undefined)} />}
        {renderPlayer && <ActivePlayer render={renderPlayer} />}
        {ascii && <div className="media-ascii" aria-hidden="true">{ascii}</div>}
        {!ready && <div className="media-proof">
          <div className="media-contours" aria-hidden="true" />
          <span className="media-status" lang="fr">EN TRAVAUX</span>
          {study === 'profile' && <div className="media-city-proof">
            <span>{PROFILE_CITIES[0]}</span>
            <small aria-label="First city of seven">01 / 07</small>
          </div>}
        </div>}
      </div>
      {caption && <figcaption>{caption}</figcaption>}
    </figure>
  );
}

export function JourneyMedia() {
  return <EditorialMedia study="profile" caption={
    <ol className="media-itinerary" aria-label="Photographic itinerary">
      {PROFILE_CITIES.map(city => <li key={city}>{city}</li>)}
    </ol>
  } />;
}
