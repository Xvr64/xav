import React, { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react';
import './editorialMedia.css';

/**
 * Only these three CV sections carry photographic stages.
 * Skills & Tools, Languages, Interests, and Contact intentionally stay typography-only.
 */
export type MediaSectionId = 'profile' | 'experience' | 'education';

/** Ordered seven-city photographic essay for Profile, independent of the Globe itinerary. */
export const PROFILE_JOURNEY_CITIES = [
  'Doha',
  'Paris',
  'Jakarta',
  'Moscow',
  'Singapore',
  'Bordeaux',
  'Shanghai'
] as const;

/** Future photographic, video, or ASCII-to-photo frame descriptor. */
export interface MediaFrameAsset {
  id: string;
  /** Real still photograph source. */
  photoSrc?: string;
  /** Short looping video source. */
  videoSrc?: string;
  /** Optional poster image shown before video frames decode. */
  posterSrc?: string;
  /** Accessible description for the photograph or footage. */
  alt: string;
  /** Focal crop position (CSS object-position, e.g. "50% 42%"). */
  objectPosition?: string;
  /** Optional caption for a frame (e.g. a city title in the future seven-city sequence). */
  caption?: string;
  /** Optional ASCII layer rendered above the photo/video and revealed via CSS masks. */
  asciiLayer?: ReactNode;
}

/** Configuration for an automatic multi-frame visual sequence (e.g. Profile's seven cities). */
export interface MediaSequenceConfig {
  frames: readonly MediaFrameAsset[];
  /** Automatic sequence runs on its own clock, independent of Magnetic CV scroll gestures. */
  autoplay?: boolean;
  /** Nominal dwell per frame in ms for future sequence orchestration. */
  intervalMs?: number;
}

export interface MediaStageConfig {
  section: MediaSectionId;
  ariaLabel: string;
  aspect: {
    desktop: string;
    tablet?: string;
    mobile: string;
  };
  objectPosition?: string;
  /** Very restrained compositional colophon shown only where it serves the section. */
  colophon?: string;
}

export const MEDIA_STAGE_CONFIG: Record<MediaSectionId, MediaStageConfig> = {
  profile: {
    section: 'profile',
    ariaLabel: 'Profile seven-city photographic stage — en travaux',
    aspect: { desktop: '1.85 / 1', tablet: '3 / 2', mobile: '16 / 10' },
    objectPosition: '50% 50%',
    colophon: PROFILE_JOURNEY_CITIES.join(' · ')
  },
  experience: {
    section: 'experience',
    ariaLabel: 'Experience photographic stage — en travaux',
    aspect: { desktop: '2.25 / 1', tablet: '2 / 1', mobile: '16 / 9' },
    objectPosition: '50% 50%'
  },
  education: {
    section: 'education',
    ariaLabel: 'Education photographic stage — en travaux',
    aspect: { desktop: '3 / 4', tablet: '3 / 4', mobile: '4 / 5' },
    objectPosition: '50% 45%'
  }
};

export interface MediaSequenceRenderContext {
  /** True only when the chapter is active, visible, unmuted, and reduced motion is off. */
  mayAutoplay: boolean;
  frames: readonly MediaFrameAsset[];
}

export interface EditorialMediaProps {
  section: MediaSectionId;
  /** Single still photograph or looping video asset (future drop-in). */
  asset?: MediaFrameAsset;
  /** Multi-frame sequence descriptor (e.g. Profile's seven-city visual essay). */
  sequence?: MediaSequenceConfig;
  /** Optional standalone ASCII layer (e.g. canvas or Asciify output) masked above the photo layer. */
  asciiLayer?: ReactNode;
  /** Optional progressive mask CSS value (e.g. linear-gradient or radial-gradient) bridging ASCII and photo layers. */
  revealMask?: string;
  /** Optional custom player for future automatic ASCII-to-photo sequences. */
  renderSequence?: (ctx: MediaSequenceRenderContext) => ReactNode;
  /** Override caption (defaults to the section's configured colophon, if any). */
  caption?: ReactNode;
}

/**
 * Observes viewport visibility, document visibility, reduced motion, and Magnetic CV chapter
 * state so future looping videos or automatic city sequences pause offscreen and never interfere
 * with scroll navigation. Mounted only when live playable media is attached.
 */
function StagePlaybackGate({
  frames,
  videoAsset,
  renderSequence
}: {
  frames: readonly MediaFrameAsset[];
  videoAsset?: MediaFrameAsset;
  renderSequence?: EditorialMediaProps['renderSequence'];
}) {
  const hostRef = useRef<HTMLDivElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [mayAutoplay, setMayAutoplay] = useState(false);

  useEffect(() => {
    const el = hostRef.current;
    if (!el) return;
    const chapter = el.closest('[data-editorial-section]');
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let inViewport = false;

    const sync = () => {
      const chapterActive = !chapter?.matches('[data-cv-muted], [data-cv-depart], [data-cv-arrive]');
      setMayAutoplay(inViewport && !document.hidden && !reducedMotion.matches && chapterActive);
    };

    const viewportObserver = new IntersectionObserver(([entry]) => {
      inViewport = entry.isIntersecting;
      sync();
    });
    viewportObserver.observe(el);

    const chapterObserver = new MutationObserver(sync);
    if (chapter) {
      chapterObserver.observe(chapter, {
        attributeFilter: ['data-cv-muted', 'data-cv-depart', 'data-cv-arrive']
      });
    }

    document.addEventListener('visibilitychange', sync);
    reducedMotion.addEventListener('change', sync);
    sync();

    return () => {
      viewportObserver.disconnect();
      chapterObserver.disconnect();
      document.removeEventListener('visibilitychange', sync);
      reducedMotion.removeEventListener('change', sync);
    };
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (mayAutoplay) {
      void video.play().catch(() => undefined);
    } else {
      video.pause();
    }
  }, [mayAutoplay]);

  return (
    <div ref={hostRef} className="media-stage__layer media-stage__layer--photo">
      {renderSequence ? (
        renderSequence({ mayAutoplay, frames })
      ) : videoAsset?.videoSrc ? (
        <video
          ref={videoRef}
          src={videoAsset.videoSrc}
          poster={videoAsset.posterSrc}
          aria-label={videoAsset.alt}
          muted
          loop
          playsInline
          preload="metadata"
        />
      ) : null}
    </div>
  );
}

/**
 * Reusable editorial photographic stage.
 * Renders a quiet, restrained "EN TRAVAUX" placeholder until real still photography, looping
 * footage, ASCII overlays, or an automatic visual sequence is provided.
 */
export const EditorialMedia: React.FC<EditorialMediaProps> = React.memo(({
  section,
  asset,
  sequence,
  asciiLayer,
  revealMask,
  renderSequence,
  caption
}) => {
  const config = MEDIA_STAGE_CONFIG[section];
  const activeAsset = asset ?? sequence?.frames[0];
  const [loadedPhotoSrc, setLoadedPhotoSrc] = useState<string | undefined>();

  const hasLiveSequence = Boolean(renderSequence);
  const hasLiveVideo = Boolean(activeAsset?.videoSrc);
  const hasLoadedPhoto = Boolean(activeAsset?.photoSrc && activeAsset.photoSrc === loadedPhotoSrc);
  const hasLiveMedia = hasLiveSequence || hasLiveVideo || hasLoadedPhoto;

  const activeAscii = asciiLayer ?? activeAsset?.asciiLayer;
  const resolvedCaption = caption !== undefined ? caption : (activeAsset?.caption ?? config.colophon);
  const crop = activeAsset?.objectPosition ?? config.objectPosition ?? '50% 50%';

  const apertureStyle = {
    '--media-crop': crop,
    ...(revealMask ? { '--media-reveal-mask': revealMask } : undefined)
  } as CSSProperties;

  return (
    <figure
      className={`media-stage media-stage--${section}`}
      data-media-section={section}
      data-media-state={hasLiveMedia ? 'ready' : 'placeholder'}
      data-ascii-preserve
    >
      <div className="media-stage__aperture" style={apertureStyle}>
        {activeAsset?.photoSrc && !hasLiveVideo && !hasLiveSequence && (
          <div className="media-stage__layer media-stage__layer--photo">
            <img
              key={activeAsset.photoSrc}
              src={activeAsset.photoSrc}
              alt={activeAsset.alt}
              decoding="async"
              hidden={!hasLoadedPhoto}
              onLoad={() => setLoadedPhotoSrc(activeAsset.photoSrc)}
              onError={() => setLoadedPhotoSrc(undefined)}
            />
          </div>
        )}

        {(hasLiveSequence || hasLiveVideo) && (
          <StagePlaybackGate
            frames={sequence?.frames ?? (activeAsset ? [activeAsset] : [])}
            videoAsset={hasLiveVideo ? activeAsset : undefined}
            renderSequence={renderSequence}
          />
        )}

        {activeAscii && (
          <div className="media-stage__layer media-stage__layer--ascii" aria-hidden="true">
            {activeAscii}
          </div>
        )}

        {!hasLiveMedia && (
          <div className="media-stage__placeholder" role="img" aria-label={config.ariaLabel}>
            <span className="media-stage__status" lang="fr">EN TRAVAUX</span>
          </div>
        )}
      </div>

      {resolvedCaption && (
        <figcaption className="media-stage__caption">
          <span>{resolvedCaption}</span>
        </figcaption>
      )}
    </figure>
  );
});
