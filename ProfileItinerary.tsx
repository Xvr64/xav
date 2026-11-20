import React, { type CSSProperties, type ReactNode } from 'react';
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

export type PlateMotif = 'contour' | 'ascii-weave' | 'strata' | 'stipple';

export type PlateTextAlign =
  | 'bottom-left'
  | 'center-right'
  | 'top-left'
  | 'center-poised'
  | 'bottom-right'
  | 'top-right';

export type PlateFrameStyle = 'brackets' | 'offset-double' | 'open-horizon' | 'crosshair';

export type PlateLane = 'a' | 'b';

/**
 * Per-city art-directed editorial placement and placeholder craft.
 * Every value is deliberate — organic oceanic swell pairing left typography
 * with an interleaved vertical sequence of square photographic plates.
 */
export interface ProfileCityComposition {
  /** Alternating horizontal gallery lane on wide viewports so square plates stay generous without crowding. */
  readonly lane: PlateLane;
  /** Organic horizontal tidal swell for the city name (in cqw % of the itinerary canvas). */
  readonly cityIndent: number;
  /** Subtle vertical editorial poise of the city name relative to its plate (px). */
  readonly cityY: number;
  /** Plate size scale relative to the base square module (0.90..1.0). */
  readonly plateScale: number;
  /** Whisper-subtle horizontal counterpoint shift inside the plate's lane (px). */
  readonly plateX: number;
  /** Whisper-subtle handcrafted inclination in degrees (static, never exaggerated). */
  readonly tiltDeg: number;
  /** Offset of the translucent paper-mat ghost plane behind the plate (px). */
  readonly ghostX: number;
  readonly ghostY: number;
  /** Refined static surface texture inside the en travaux plate. */
  readonly motif: PlateMotif;
  readonly motifVariant: 0 | 1;
  /** Composed internal positioning of EN TRAVAUX within the square plate. */
  readonly align: PlateTextAlign;
  /** Subtle frame treatment variation across plates. */
  readonly frameStyle: PlateFrameStyle;
  /** Diagonal light angle (deg) for the translucent ocean-vellum wash. */
  readonly washAngle: number;
  /** Outer registration mark corner around the plate. */
  readonly outerMark: 'top-left' | 'bottom-right' | 'top-right' | 'bottom-left';
  /** Opposing corner for the micro archival plate numeral inside the square aperture. */
  readonly codeCorner: 'top-right' | 'bottom-left' | 'bottom-right' | 'top-left';
}

/**
 * Reusable media descriptor for one city slot in Profile's eight-city editorial itinerary.
 * Structure prepared to receive real square photography and optional overlay treatments
 * with zero layout shift once imagery is supplied.
 */
export interface ProfileCitySlot {
  readonly id: ProfileCityId;
  readonly city: string;
  readonly plateNumber: string;
  /** Accessible description for the photograph (or its en travaux placeholder). */
  readonly alt: string;
  /** Curated editorial layout, framing, and static surface texture parameters. */
  readonly composition: ProfileCityComposition;
  /** Future city photograph source (intentionally unset while en travaux). */
  readonly photoSrc?: string;
  /** Future focal crop position (CSS object-position, defaults to "50% 50%"). */
  readonly objectPosition?: string;
  /** Optional future visual layer rendered inside the stable square aperture. */
  readonly overlay?: ReactNode;
}

/** Exact eight-city international itinerary in chronological order for the Profile section. */
export const PROFILE_ITINERARY_CITIES: readonly ProfileCitySlot[] = [
  {
    id: 'doha',
    city: 'Doha',
    plateNumber: '01',
    alt: 'Doha photograph — en travaux',
    composition: {
      lane: 'a',
      cityIndent: 7.2,
      cityY: -3,
      plateScale: 0.98,
      plateX: -4,
      tiltDeg: -0.65,
      ghostX: 5,
      ghostY: 4,
      motif: 'contour',
      motifVariant: 0,
      align: 'bottom-left',
      frameStyle: 'brackets',
      washAngle: 132,
      outerMark: 'top-left',
      codeCorner: 'top-right'
    }
  },
  {
    id: 'paris',
    city: 'Paris',
    plateNumber: '02',
    alt: 'Paris photograph — en travaux',
    composition: {
      lane: 'b',
      cityIndent: 14.2,
      cityY: 2,
      plateScale: 0.93,
      plateX: 4,
      tiltDeg: 0.7,
      ghostX: -5,
      ghostY: 5,
      motif: 'ascii-weave',
      motifVariant: 0,
      align: 'bottom-right',
      frameStyle: 'offset-double',
      washAngle: 215,
      outerMark: 'bottom-right',
      codeCorner: 'top-left'
    }
  },
  {
    id: 'jakarta',
    city: 'Jakarta',
    plateNumber: '03',
    alt: 'Jakarta photograph — en travaux',
    composition: {
      lane: 'a',
      cityIndent: 3.2,
      cityY: -2,
      plateScale: 1.0,
      plateX: 3,
      tiltDeg: -0.5,
      ghostX: 5,
      ghostY: -4,
      motif: 'strata',
      motifVariant: 0,
      align: 'top-left',
      frameStyle: 'open-horizon',
      washAngle: 152,
      outerMark: 'top-right',
      codeCorner: 'bottom-right'
    }
  },
  {
    id: 'moscow',
    city: 'Moscow',
    plateNumber: '04',
    alt: 'Moscow photograph — en travaux',
    composition: {
      lane: 'b',
      cityIndent: 10.6,
      cityY: 3,
      plateScale: 0.91,
      plateX: -3,
      tiltDeg: 0.75,
      ghostX: 5,
      ghostY: 5,
      motif: 'stipple',
      motifVariant: 0,
      align: 'center-poised',
      frameStyle: 'crosshair',
      washAngle: 118,
      outerMark: 'bottom-left',
      codeCorner: 'top-right'
    }
  },
  {
    id: 'singapore',
    city: 'Singapore',
    plateNumber: '05',
    alt: 'Singapore photograph — en travaux',
    composition: {
      lane: 'a',
      cityIndent: 0,
      cityY: -2,
      plateScale: 0.97,
      plateX: -3,
      tiltDeg: -0.65,
      ghostX: -5,
      ghostY: -4,
      motif: 'contour',
      motifVariant: 1,
      align: 'bottom-right',
      frameStyle: 'brackets',
      washAngle: 238,
      outerMark: 'top-right',
      codeCorner: 'top-left'
    }
  },
  {
    id: 'pau',
    city: 'Pau',
    plateNumber: '06',
    alt: 'Pau photograph — en travaux',
    composition: {
      lane: 'b',
      cityIndent: 18.2,
      cityY: -2,
      plateScale: 0.9,
      plateX: 4,
      tiltDeg: 0.7,
      ghostX: 5,
      ghostY: 4,
      motif: 'ascii-weave',
      motifVariant: 1,
      align: 'top-right',
      frameStyle: 'offset-double',
      washAngle: 142,
      outerMark: 'bottom-left',
      codeCorner: 'bottom-left'
    }
  },
  {
    id: 'bordeaux',
    city: 'Bordeaux',
    plateNumber: '07',
    alt: 'Bordeaux photograph — en travaux',
    composition: {
      lane: 'a',
      cityIndent: 2.6,
      cityY: 2,
      plateScale: 0.94,
      plateX: 4,
      tiltDeg: -0.55,
      ghostX: -5,
      ghostY: 4,
      motif: 'stipple',
      motifVariant: 1,
      align: 'bottom-left',
      frameStyle: 'crosshair',
      washAngle: 196,
      outerMark: 'top-left',
      codeCorner: 'top-right'
    }
  },
  {
    id: 'shanghai',
    city: 'Shanghai',
    plateNumber: '08',
    alt: 'Shanghai photograph — en travaux',
    composition: {
      lane: 'b',
      cityIndent: 8.8,
      cityY: -1,
      plateScale: 1.0,
      plateX: -2,
      tiltDeg: 0.4,
      ghostX: 5,
      ghostY: -4,
      motif: 'strata',
      motifVariant: 1,
      align: 'center-poised',
      frameStyle: 'open-horizon',
      washAngle: 126,
      outerMark: 'bottom-right',
      codeCorner: 'top-left'
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

/** Clear-zone coordinates inside the 200x200 square viewBox so texture softens gracefully around EN TRAVAUX. */
const CLEAR_ZONE_BY_ALIGN: Record<PlateTextAlign, { cx: string; cy: string; rx: string; ry: string }> = {
  'bottom-left': { cx: '42%', cy: '78%', rx: '46%', ry: '26%' },
  'center-right': { cx: '58%', cy: '52%', rx: '46%', ry: '28%' },
  'top-left': { cx: '42%', cy: '24%', rx: '46%', ry: '26%' },
  'center-poised': { cx: '50%', cy: '51%', rx: '48%', ry: '26%' },
  'bottom-right': { cx: '58%', cy: '78%', rx: '46%', ry: '26%' },
  'top-right': { cx: '58%', cy: '24%', rx: '46%', ry: '26%' }
};

/** Deterministic sparse ocean-current ASCII weave proportioned natively for a 200x200 square plate. */
function buildAsciiWeaveLines(variant: 0 | 1): { y: number; text: string; opacity: number }[] {
  const rows = 12;
  const cols = 20;
  const lines: { y: number; text: string; opacity: number }[] = [];
  const phase = variant === 0 ? 0.45 : 2.3;
  const dir = variant === 0 ? 1 : -1;

  for (let r = 0; r < rows; r++) {
    const v = r / (rows - 1);
    let line = '';
    for (let c = 0; c < cols; c++) {
      const u = c / (cols - 1);
      const swell =
        0.52 +
        0.34 * Math.sin(u * 4.0 * dir + v * 3.1 + phase) +
        0.2 * Math.cos(u * 2.5 - v * 4.4 * dir - phase * 0.65);
      const ridge = Math.max(0, Math.min(1, swell));
      const edgeBias = variant === 0 ? 0.36 + 0.64 * (1 - u * 0.36) : 0.36 + 0.64 * (0.62 + u * 0.38);
      const density = ridge * edgeBias;

      if (density < 0.32) {
        line += ' ';
      } else if (density < 0.46) {
        line += (r + c) % 2 === 0 ? '·' : ' ';
      } else if (density < 0.6) {
        line += (r * 3 + c) % 2 === 0 ? '.' : '·';
      } else if (density < 0.74) {
        line += (r + c) % 2 === 0 ? ':' : '-';
      } else if (density < 0.86) {
        line += (r + c) % 3 === 0 ? '~' : '-';
      } else {
        line += (r + c) % 4 === 0 ? '+' : variant === 0 ? '/' : '~';
      }
    }
    const rowOpacity = 0.28 + 0.22 * Math.sin(v * Math.PI);
    lines.push({ y: 20 + r * 14.8, text: line, opacity: Number(rowOpacity.toFixed(2)) });
  }
  return lines;
}

const ASCII_WEAVE_0 = buildAsciiWeaveLines(0);
const ASCII_WEAVE_1 = buildAsciiWeaveLines(1);

function buildStippleDots(variant: 0 | 1): { cx: number; cy: number; r: number; o: number; cross?: boolean }[] {
  const dots: { cx: number; cy: number; r: number; o: number; cross?: boolean }[] = [];
  const cols = 12;
  const rows = 12;
  const shift = variant === 0 ? 0.65 : 2.35;

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const u = col / (cols - 1);
      const v = row / (rows - 1);
      const wave =
        0.52 +
        0.34 * Math.sin(u * 4.1 + v * 3.2 + shift) +
        0.2 * Math.cos(u * 5.2 - v * 2.5 - shift);
      if (wave < 0.28) continue;
      const cx = 16 + col * 15.2;
      const cy = 16 + row * 15.2;
      const isCross =
        (variant === 0 && ((row === 2 && col === 3) || (row === 9 && col === 9))) ||
        (variant === 1 && ((row === 2 && col === 8) || (row === 7 && col === 3)));
      dots.push({
        cx: Number(cx.toFixed(1)),
        cy: Number(cy.toFixed(1)),
        r: Number((0.6 + wave * 0.8).toFixed(2)),
        o: Number((0.18 + wave * 0.28).toFixed(2)),
        cross: isCross
      });
    }
  }
  return dots;
}

const STIPPLE_0 = buildStippleDots(0);
const STIPPLE_1 = buildStippleDots(1);

const CODE_CLEAR_ZONE: Record<ProfileCityComposition['codeCorner'], { cx: string; cy: string }> = {
  'top-left': { cx: '18%', cy: '15%' },
  'top-right': { cx: '82%', cy: '15%' },
  'bottom-left': { cx: '18%', cy: '85%' },
  'bottom-right': { cx: '82%', cy: '85%' }
};

interface PlateTextureProps {
  id: ProfileCityId;
  motif: PlateMotif;
  variant: 0 | 1;
  align: PlateTextAlign;
  codeCorner: ProfileCityComposition['codeCorner'];
}

/**
 * Restrained, ocean-compatible static SVG surface texture composed natively for a 200x200 square plate.
 * Uses soft radial clear-zone masks so texture frames EN TRAVAUX and the micro plate number cleanly.
 */
const PlateTexture: React.FC<PlateTextureProps> = React.memo(({ id, motif, variant, align, codeCorner }) => {
  const maskId = `plate-clear-${id}`;
  const gradId = `plate-clear-grad-${id}`;
  const clear = CLEAR_ZONE_BY_ALIGN[align];
  const codeClear = CODE_CLEAR_ZONE[codeCorner];

  return (
    <svg
      className={`profile-city-texture profile-city-texture--${motif}`}
      viewBox="0 0 200 200"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <radialGradient id={gradId} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#000" stopOpacity="0.94" />
          <stop offset="58%" stopColor="#000" stopOpacity="0.54" />
          <stop offset="100%" stopColor="#000" stopOpacity="0" />
        </radialGradient>
        <mask id={maskId}>
          <rect x="0" y="0" width="200" height="200" fill="#fff" />
          <ellipse cx={clear.cx} cy={clear.cy} rx={clear.rx} ry={clear.ry} fill={`url(#${gradId})`} />
          <ellipse cx={codeClear.cx} cy={codeClear.cy} rx="18%" ry="14%" fill={`url(#${gradId})`} />
        </mask>
      </defs>

      <g mask={`url(#${maskId})`} fill="none" stroke="currentColor">
        {motif === 'contour' && (
          <>
            {Array.from({ length: 9 }, (_, i) => {
              const t = i / 8;
              const yStart = variant === 0 ? -14 + t * 148 : 214 - t * 148;
              const yCtrl1 =
                variant === 0
                  ? 14 + t * 124 - Math.sin(t * 2.6) * 24
                  : 186 - t * 124 + Math.sin(t * 2.6) * 24;
              const yCtrl2 =
                variant === 0
                  ? 46 + t * 142 + Math.cos(t * 2.3) * 20
                  : 154 - t * 142 - Math.cos(t * 2.3) * 20;
              const yEnd = variant === 0 ? 34 + t * 176 : 166 - t * 176;
              const opacity = 0.18 + 0.24 * Math.sin(t * Math.PI);
              return (
                <path
                  key={i}
                  d={`M -12 ${yStart.toFixed(1)} C 62 ${yCtrl1.toFixed(1)}, 138 ${yCtrl2.toFixed(1)}, 212 ${yEnd.toFixed(1)}`}
                  strokeWidth={i % 3 === 0 ? 0.9 : 0.6}
                  strokeOpacity={opacity.toFixed(2)}
                />
              );
            })}
            <path
              d={
                variant === 0
                  ? 'M 148 44 h 8 M 152 40 v 8 M 44 46 h 6 M 47 43 v 6'
                  : 'M 44 44 h 8 M 48 40 v 8 M 152 146 h 6 M 155 143 v 6'
              }
              strokeWidth="0.75"
              strokeOpacity="0.4"
            />
          </>
        )}

        {motif === 'ascii-weave' && (
          <g stroke="none" fill="currentColor" className="profile-city-ascii-field">
            {(variant === 0 ? ASCII_WEAVE_0 : ASCII_WEAVE_1).map((line, i) => (
              <text key={i} x="11" y={line.y} fillOpacity={line.opacity} xmlSpace="preserve">
                {line.text}
              </text>
            ))}
          </g>
        )}

        {motif === 'strata' && (
          <>
            {Array.from({ length: 11 }, (_, i) => {
              const t = i / 10;
              const y =
                variant === 0
                  ? 18 + Math.pow(t, 1.15) * 164
                  : 16 +
                    (t < 0.5
                      ? Math.pow(t * 2, 1.2) * 58
                      : 168 - Math.pow((1 - t) * 2, 1.2) * 58);
              const dash = i % 3 === 0 ? '26 7 4 7' : i % 2 === 0 ? '14 6 2 6' : '38 10';
              const opacity = 0.16 + 0.22 * (variant === 0 ? t : Math.abs(t - 0.5) * 1.9);
              return (
                <line
                  key={i}
                  x1="14"
                  y1={y.toFixed(1)}
                  x2="186"
                  y2={y.toFixed(1)}
                  strokeWidth={i % 4 === 0 ? 0.85 : 0.6}
                  strokeDasharray={dash}
                  strokeOpacity={Math.min(0.4, opacity).toFixed(2)}
                />
              );
            })}
            <path
              d={
                variant === 0
                  ? 'M 142 20 v 160 M 138 56 h 8 M 138 134 h 8'
                  : 'M 58 20 v 160 M 54 46 h 8 M 54 152 h 8'
              }
              strokeWidth="0.65"
              strokeOpacity="0.28"
            />
          </>
        )}

        {motif === 'stipple' && (
          <>
            <line
              x1={variant === 0 ? '20' : '180'}
              y1="18"
              x2={variant === 0 ? '180' : '20'}
              y2="182"
              strokeWidth="0.6"
              strokeOpacity="0.2"
              strokeDasharray="3 7"
            />
            {(variant === 0 ? STIPPLE_0 : STIPPLE_1).map((dot, i) =>
              dot.cross ? (
                <path
                  key={i}
                  d={`M ${dot.cx - 3.4} ${dot.cy} h 6.8 M ${dot.cx} ${dot.cy - 3.4} v 6.8`}
                  strokeWidth="0.75"
                  strokeOpacity="0.44"
                />
              ) : (
                <circle
                  key={i}
                  cx={dot.cx}
                  cy={dot.cy}
                  r={dot.r}
                  stroke="none"
                  fill="currentColor"
                  fillOpacity={dot.o}
                />
              )
            )}
          </>
        )}
      </g>
    </svg>
  );
});

export interface ProfileCityFrameProps {
  slot: ProfileCitySlot;
}

/**
 * Individual art-directed square photographic plate paired with one city.
 * Aspect ratio and aperture geometry stay strictly locked whether displaying
 * the textured "EN TRAVAUX" plate or a future photograph.
 */
export const ProfileCityFrame: React.FC<ProfileCityFrameProps> = React.memo(({ slot }) => {
  const hasPhoto = Boolean(slot.photoSrc);
  const { composition } = slot;
  const frameStyle = {
    '--plate-scale': composition.plateScale,
    '--plate-x': `${composition.plateX}px`,
    '--plate-rot': `${composition.tiltDeg}deg`,
    '--ghost-x': `${composition.ghostX}px`,
    '--ghost-y': `${composition.ghostY}px`,
    '--wash-angle': `${composition.washAngle}deg`
  } as CSSProperties;

  const apertureStyle = {
    '--city-crop': slot.objectPosition ?? '50% 50%'
  } as CSSProperties;

  return (
    <figure
      className={`profile-city-frame profile-city-frame--${composition.align} profile-city-frame--${composition.frameStyle}`}
      data-city-slot={slot.id}
      data-media-state={hasPhoto ? 'ready' : 'placeholder'}
      data-ascii-preserve
      style={frameStyle}
    >
      <span className="profile-city-ghost" aria-hidden="true" />
      <span
        className={`profile-city-outer-mark profile-city-outer-mark--${composition.outerMark}`}
        aria-hidden="true"
      />
      <div className="profile-city-aperture" style={apertureStyle}>
        {hasPhoto && (
          <div className="profile-city-photo-layer">
            <img src={slot.photoSrc} alt={slot.alt} decoding="async" />
          </div>
        )}

        {slot.overlay && (
          <div className="profile-city-overlay-layer" aria-hidden="true">
            {slot.overlay}
          </div>
        )}

        {!hasPhoto && (
          <div className="profile-city-placeholder" role="img" aria-label={slot.alt}>
            <PlateTexture
              id={slot.id}
              motif={composition.motif}
              variant={composition.motifVariant}
              align={composition.align}
              codeCorner={composition.codeCorner}
            />
            <span className="profile-city-inner-frame" aria-hidden="true" />
            <span className="profile-city-corners" aria-hidden="true" />
            <span
              className={`profile-city-plate-code profile-city-plate-code--${composition.codeCorner}`}
              aria-hidden="true"
            >
              {slot.plateNumber}
            </span>
            <div className="profile-city-status-wrap">
              <span className="profile-city-status" lang="fr">
                EN TRAVAUX
              </span>
            </div>
          </div>
        )}
      </div>
    </figure>
  );
});

export interface ProfileItineraryProps {
  /** Optional per-city photographic overrides mapped cleanly by city id for future imagery. */
  slots?: ProfileCitySlotOverrides;
}

/**
 * Single-screen eight-city editorial photo composition for Profile (#introduction).
 * Left: organically placed city typography in an oceanic swell.
 * Right: interleaved vertical sequence of square photographic plates revealed top-to-bottom on one scroll.
 */
export const ProfileItinerary: React.FC<ProfileItineraryProps> = React.memo(({ slots }) => (
  <div className="profile-itinerary">
    <div className="profile-itinerary-track" role="list" aria-label="Eight-city international itinerary">
      {PROFILE_ITINERARY_CITIES.map((baseSlot, index) => {
        const override = slots?.[baseSlot.id];
        const slot: ProfileCitySlot = override ? { ...baseSlot, ...override } : baseSlot;
        const rowStyle = {
          '--plate-index': index,
          '--city-indent': slot.composition.cityIndent,
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
            <ProfileCityFrame slot={slot} />
          </div>
        );
      })}
    </div>
  </div>
));
