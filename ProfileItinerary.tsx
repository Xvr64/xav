import React, { useCallback, useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { CV_DATA } from './cvData';
import { syncProfilePhotoSizes } from './profileMemoryPlate';
import { MEMORY_INSPECT_QUERY, nextMemoryInspection } from './profileMemoryTimeline';
import './profileItinerary.css';

export type ProfileCityId =
  | 'doha'
  | 'paris'
  | 'jakarta'
  | 'moscow'
  | 'singapore'
  | 'pau'
  | 'bordeaux'
  | 'shanghai';

export type PlateLane = 'a' | 'b';

/**
 * Per-city art-directed editorial placement.
 * Pairs organic oceanic typography with alternating non-overlapping photographic anchors
 * that adapt cleanly to each photograph's exact intrinsic aspect ratio.
 */
export interface ProfileCityComposition {
  /** Alternating horizontal gallery lane on wide viewports so photographs breathe without ever colliding. */
  readonly lane: PlateLane;
  /** Editorial horizontal pull from the city column's inner edge (in cqw %) creating an organic oceanic swell. */
  readonly cityPull: number;
  /** Subtle vertical editorial poise of the city name relative to its photograph (px). */
  readonly cityY: number;
  /** Gentle editorial scale rhythm relative to the safe slot envelope (0.93..1.0). */
  readonly plateScale: number;
  /** Whisper-subtle horizontal counterpoint shift inside the photograph's lane (px). */
  readonly plateX: number;
  /** Whisper-subtle handcrafted inclination in degrees (static, never exaggerated). */
  readonly tiltDeg: number;
}

/**
 * Media descriptor for one city slot in Profile's eight-city editorial composition.
 * Photographs are always displayed in their entirety at their intrinsic aspect ratio.
 */
export interface ProfileCitySlot {
  readonly id: ProfileCityId;
  readonly city: string;
  readonly plateNumber: string;
  /** Accessible description for the photograph. */
  readonly alt: string;
  /** Curated editorial layout and poise parameters. */
  readonly composition: ProfileCityComposition;
  /** Source for the natural-proportion photograph. */
  readonly photoSrc?: string;
  /** Optional visual layer rendered inside the photograph's tight natural-aspect box. */
  readonly overlay?: ReactNode;
}

/** Exact eight-city international itinerary in chronological order for the Profile section. */
export const PROFILE_ITINERARY_CITIES: readonly ProfileCitySlot[] = [
  {
    id: 'doha',
    city: 'Doha',
    plateNumber: '01',
    photoSrc: '/profile-memories/doha.webp',
    alt: 'Doha’s West Bay skyline at dusk, with illuminated glass towers reflected in a calm plaza pool.',
    composition: {
      lane: 'a',
      cityPull: 3.4,
      cityY: -2,
      plateScale: 0.99,
      plateX: -3,
      tiltDeg: -0.55
    }
  },
  {
    id: 'paris',
    city: 'Paris',
    plateNumber: '02',
    photoSrc: '/profile-memories/paris.webp',
    alt: 'Palm trees framing the gilded dome and stone facade of the Petit Palais in Paris against a clear blue sky.',
    composition: {
      lane: 'b',
      cityPull: 0.4,
      cityY: 2,
      plateScale: 0.95,
      plateX: 3,
      tiltDeg: 0.6
    }
  },
  {
    id: 'jakarta',
    city: 'Jakarta',
    plateNumber: '03',
    photoSrc: '/profile-memories/jakarta.webp',
    alt: 'A sunlit tropical courtyard garden, frangipani tree, and swimming pool beyond white veranda columns in Jakarta.',
    composition: {
      lane: 'a',
      cityPull: 4.1,
      cityY: -2,
      plateScale: 1.0,
      plateX: 3,
      tiltDeg: -0.45
    }
  },
  {
    id: 'moscow',
    city: 'Moscow',
    plateNumber: '04',
    photoSrc: '/profile-memories/moscow.webp',
    alt: 'Snow-covered Red Square winter market in Moscow beneath ornamented bare branches, with Saint Basil’s Cathedral beyond.',
    composition: {
      lane: 'b',
      cityPull: 0.2,
      cityY: 2,
      plateScale: 0.94,
      plateX: -3,
      tiltDeg: 0.65
    }
  },
  {
    id: 'singapore',
    city: 'Singapore',
    plateNumber: '05',
    photoSrc: '/profile-memories/singapore.webp',
    alt: 'Palm fronds frame the blue-lit towers of Marina Bay Sands and Singapore’s nighttime skyline.',
    composition: {
      lane: 'a',
      cityPull: 2.0,
      cityY: -2,
      plateScale: 0.98,
      plateX: -3,
      tiltDeg: -0.55
    }
  },
  {
    id: 'pau',
    city: 'Pau',
    plateNumber: '06',
    photoSrc: '/profile-memories/pau.webp',
    alt: 'A sunlit Pyrenean mountain vista near Pau, with golden autumn slopes and layered ridges beneath drifting clouds.',
    composition: {
      lane: 'b',
      cityPull: 0.0,
      cityY: -1,
      plateScale: 0.93,
      plateX: 3,
      tiltDeg: 0.6
    }
  },
  {
    id: 'bordeaux',
    city: 'Bordeaux',
    plateNumber: '07',
    photoSrc: '/profile-memories/bordeaux.webp',
    alt: 'Fiery orange sunset clouds, spire, and historic waterfront facades reflected in the Miroir d’eau in Bordeaux.',
    composition: {
      lane: 'a',
      cityPull: 2.6,
      cityY: 2,
      plateScale: 0.96,
      plateX: 3,
      tiltDeg: -0.5
    }
  },
  {
    id: 'shanghai',
    city: 'Shanghai',
    plateNumber: '08',
    photoSrc: '/profile-memories/shanghai.webp',
    alt: 'Crimson-lit traditional pavilions with upturned tiled roofs along the Yuyuan waterfront in Shanghai at night.',
    composition: {
      lane: 'b',
      cityPull: 0.6,
      cityY: -1,
      plateScale: 1.0,
      plateX: -2,
      tiltDeg: 0.4
    }
  }
] as const;

/** Direct internal lookup between each city identifier and its default media slot. */
export const PROFILE_CITY_SLOT_MAP: Readonly<Record<ProfileCityId, ProfileCitySlot>> =
  Object.freeze(
    PROFILE_ITINERARY_CITIES.reduce(
      (acc, slot) => {
        acc[slot.id] = slot;
        return acc;
      },
      {} as Record<ProfileCityId, ProfileCitySlot>
    )
  );

export type ProfileCitySlotOverrides = Partial<
  Record<ProfileCityId, Partial<Omit<ProfileCitySlot, 'id' | 'city'>>>
>;

export { syncProfilePhotoSizes };

export interface ProfileCityFrameProps {
  slot: ProfileCitySlot;
  onImageLoad?: () => void;
}

/**
 * Invisible photographic layout anchor paired with one city.
 * Completely invisible before Wave 1 begins; dynamically fits the supplied image's
 * exact intrinsic proportions without borders, placeholders, or cropping.
 */
export const ProfileCityFrame: React.FC<ProfileCityFrameProps> = React.memo(({ slot, onImageLoad }) => {
  const hasPhoto = Boolean(slot.photoSrc);
  const { composition } = slot;
  const frameStyle = {
    '--plate-scale': composition.plateScale,
    '--plate-x': `${composition.plateX}px`,
    '--plate-rot': `${composition.tiltDeg}deg`
  } as CSSProperties;

  return (
    <div className="profile-city-slot-anchor" data-plate-lane={composition.lane}>
      <figure
        className="profile-city-frame"
        data-city-slot={slot.id}
        data-media-state={hasPhoto ? 'ready' : 'empty'}
        data-plate-scale={composition.plateScale}
        data-plate-x={composition.plateX}
        data-plate-rot={composition.tiltDeg}
        data-ascii-preserve
        style={frameStyle}
      >
        <div className="profile-city-aperture">
          {hasPhoto && (
            <div className="profile-city-photo-layer">
              <img
                src={slot.photoSrc}
                alt={slot.alt}
                decoding="async"
                onLoad={onImageLoad}
              />
              <canvas className="profile-memory-etching" aria-hidden="true" />
            </div>
          )}

          {slot.overlay && (
            <div className="profile-city-overlay-layer" aria-hidden="true">
              {slot.overlay}
            </div>
          )}
        </div>
      </figure>
    </div>
  );
});

export interface ProfileItineraryProps {
  /** Optional per-city photographic overrides mapped cleanly by city id. */
  slots?: ProfileCitySlotOverrides;
}

/** The years each city was lived in, read straight from the CV data. */
const CITY_PERIOD: Readonly<Record<string, string>> = Object.fromEntries(
  CV_DATA.locations.map((location) => [location.id, location.period])
);

interface MemoryInspectionProps {
  slot: ProfileCitySlot;
  /** restoreFocus=false when the page moved under the dialog (history) or the row is hidden (widening) */
  onClose: (restoreFocus?: boolean) => void;
}

/**
 * Narrow screens, after the reveal: one photograph read uncropped at full width, centred in
 * deeper water with its city and years beneath it. No frame and no controls: a tap anywhere,
 * Escape, or the screen widening closes it. Its touches never reach the Magnetic CV (the
 * controller ignores input while an aria-modal dialog is shown, and nothing bubbles past it).
 */
const MemoryInspection: React.FC<MemoryInspectionProps> = ({ slot, onClose }) => {
  const layerRef = useRef<HTMLDivElement | null>(null);
  const dismissRef = useRef<HTMLButtonElement | null>(null);
  const period = CITY_PERIOD[slot.id];

  useEffect(() => {
    const layer = layerRef.current;
    if (!layer) return;
    dismissRef.current?.focus({ preventScroll: true });

    const contain = (e: Event) => e.stopPropagation();
    const still = (e: Event) => {
      e.stopPropagation();
      if (e.cancelable) e.preventDefault();
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      } else if (e.key === 'Tab') {
        // The dismiss control is the only stop inside: focus stays with the photograph
        e.preventDefault();
        dismissRef.current?.focus({ preventScroll: true });
      }
    };
    const narrow = matchMedia(MEMORY_INSPECT_QUERY);
    // The row is display:none once wide, so there is nowhere to hand focus back
    const onWiden = () => {
      if (!narrow.matches) onClose(false);
    };
    // Back/forward or a hash change moves the Magnetic CV under the dialog: close it and leave
    // focus alone, or focusing the Profile row would pull the page back and undo the navigation.
    const onHistory = () => onClose(false);

    layer.addEventListener('touchstart', contain, { passive: true });
    layer.addEventListener('touchend', contain, { passive: true });
    layer.addEventListener('touchcancel', contain, { passive: true });
    layer.addEventListener('touchmove', still, { passive: false });
    layer.addEventListener('wheel', still, { passive: false });
    document.addEventListener('keydown', onKey);
    narrow.addEventListener('change', onWiden);
    window.addEventListener('popstate', onHistory);
    window.addEventListener('hashchange', onHistory);
    return () => {
      window.removeEventListener('popstate', onHistory);
      window.removeEventListener('hashchange', onHistory);
      layer.removeEventListener('touchstart', contain);
      layer.removeEventListener('touchend', contain);
      layer.removeEventListener('touchcancel', contain);
      layer.removeEventListener('touchmove', still);
      layer.removeEventListener('wheel', still);
      document.removeEventListener('keydown', onKey);
      narrow.removeEventListener('change', onWiden);
    };
  }, [onClose]);

  return (
    <div
      ref={layerRef}
      className="profile-memory-inspect"
      role="dialog"
      aria-modal="true"
      aria-label={period ? `${slot.city}, ${period}` : slot.city}
    >
      <button
        ref={dismissRef}
        type="button"
        className="profile-memory-inspect-dismiss"
        aria-label={`Close the ${slot.city} photograph`}
        onClick={() => onClose()}
      />
      <figure className="profile-memory-inspect-plate">
        <img src={slot.photoSrc} alt={slot.alt} decoding="async" />
        <figcaption>
          <span className="profile-memory-inspect-city">{slot.city}</span>
          {period && <span className="meta">{period}</span>}
        </figcaption>
      </figure>
    </div>
  );
};

/**
 * Single-screen eight-city editorial photo composition for Profile (#introduction).
 * Left: organically placed city typography in an oceanic swell, free of connecting lines.
 * Right: invisible non-overlapping alternating photographic anchors that materialize
 * out of open ocean via two sequential waves (all 8 ASCII -> brief hold -> all 8 real photos).
 */
export const ProfileItinerary: React.FC<ProfileItineraryProps> = React.memo(({ slots }) => {
  const itineraryRef = useRef<HTMLDivElement | null>(null);
  const [inspecting, setInspecting] = useState<ProfileCityId | null>(null);
  const returnFocusRef = useRef<HTMLElement | null>(null);

  const handleSizeSync = useCallback(() => {
    if (itineraryRef.current) syncProfilePhotoSizes(itineraryRef.current);
  }, []);

  const openInspection = useCallback((id: ProfileCityId, trigger: HTMLElement) => {
    const next = nextMemoryInspection(null, {
      type: 'open',
      id,
      plates: itineraryRef.current?.dataset.plates,
      narrow: matchMedia(MEMORY_INSPECT_QUERY).matches
    });
    if (!next) return;
    returnFocusRef.current = trigger;
    setInspecting(next as ProfileCityId);
  }, []);

  const closeInspection = useCallback((restoreFocus = true) => {
    setInspecting((current) => nextMemoryInspection(current, { type: 'close' }) as ProfileCityId | null);
    const trigger = returnFocusRef.current;
    returnFocusRef.current = null;
    // Back to the city that was opened, without moving the pinned page
    if (restoreFocus && trigger?.isConnected) requestAnimationFrame(() => trigger.focus({ preventScroll: true }));
  }, []);

  useEffect(() => {
    const el = itineraryRef.current;
    if (!el) return;
    syncProfilePhotoSizes(el);

    const ro = new ResizeObserver(() => syncProfilePhotoSizes(el));
    ro.observe(el);
    window.addEventListener('resize', handleSizeSync);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', handleSizeSync);
    };
  }, [handleSizeSync, slots]);

  const inspected = inspecting ? PROFILE_ITINERARY_CITIES.find((slot) => slot.id === inspecting) : undefined;
  const inspectedSlot = inspected && slots?.[inspected.id] ? { ...inspected, ...slots[inspected.id] } : inspected;
  const portalHost = itineraryRef.current?.closest<HTMLElement>('.terminal-portfolio') ?? document.body;

  return (
    <>
    <div className="profile-itinerary" ref={itineraryRef}>
      <div className="profile-itinerary-track" role="list" aria-label="Eight-city international itinerary">
        {PROFILE_ITINERARY_CITIES.map((baseSlot, index) => {
          const override = slots?.[baseSlot.id];
          const slot: ProfileCitySlot = override ? { ...baseSlot, ...override } : baseSlot;
          const rowStyle = {
            '--plate-index': index,
            '--city-pull': slot.composition.cityPull,
            '--city-y': `${slot.composition.cityY}px`
          } as CSSProperties;

          return (
            <div
              key={slot.id}
              className="profile-itinerary-row"
              role="listitem"
              data-city-id={slot.id}
              data-plate-lane={slot.composition.lane}
              style={rowStyle}
            >
              <h3 className="profile-city-name" data-ascii-preserve>
                <span className="profile-city-plate-index" aria-hidden="true">{slot.plateNumber}</span>
                <span>{slot.city}</span>
              </h3>
              <ProfileCityFrame slot={slot} onImageLoad={handleSizeSync} />
              {slot.photoSrc && (
                <button
                  type="button"
                  className="profile-city-inspect"
                  aria-label={`View the ${slot.city} photograph`}
                  aria-haspopup="dialog"
                  onClick={(e) => openInspection(slot.id, e.currentTarget)}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
    {/* The step-0 cue: shown by profileItinerary.css only while the plates wait for the first gesture */}
    <p className="profile-memory-cue meta" aria-hidden="true">Scroll once to surface memories</p>
    {inspectedSlot?.photoSrc && createPortal(
      <MemoryInspection slot={inspectedSlot} onClose={closeInspection} />,
      portalHost
    )}
    </>
  );
});
