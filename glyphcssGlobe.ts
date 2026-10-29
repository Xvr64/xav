import {
  glyphMapDecodeGeoTileInt16,
  glyphMapDecodeVectorTile,
  glyphMapVectorTileBounds,
  type GlyphMapAttribution,
  type GlyphMapBounds,
  type GlyphMapGeoTile,
  type GlyphMapProvider,
  type GlyphMapProviderZoomLevel,
  type GlyphMapVectorProvider,
  type GlyphMapVectorTile,
  type GlyphMapVectorWireTile
} from '@glyphcss/maps';

interface GeoTilesManifest {
  readonly version: number;
  readonly format: string;
  readonly byteOrder: string;
  readonly zooms: readonly GlyphMapProviderZoomLevel[];
  readonly source: string;
  readonly sampler: string;
  readonly attribution?: readonly GlyphMapAttribution[];
}

interface VectorTilesManifest {
  readonly zooms: readonly GlyphMapProviderZoomLevel[];
  readonly source: string;
  readonly simplify: string;
  readonly attribution?: readonly GlyphMapAttribution[];
}

function computeTileBounds(level: GlyphMapProviderZoomLevel, x: number, y: number): GlyphMapBounds {
  const lonMin = -180 + x * level.tileLonSpan;
  const latMax = 90 - y * level.tileLatSpan;
  return {
    west: lonMin,
    east: lonMin + level.tileLonSpan,
    south: latMax - level.tileLatSpan,
    north: latMax
  };
}

function shareProviderTiles<T extends GlyphMapProvider | GlyphMapVectorProvider>(provider: T): T {
  const inFlight = new Map<string, ReturnType<T['loadTile']>>();
  const resolved = new Map<string, Awaited<ReturnType<T['loadTile']>>>();
  return {
    ...provider,
    loadTile(z: number, x: number, y: number) {
      const key = `${z}/${x}/${y}`;
      const hit = resolved.get(key);
      if (hit !== undefined) {
        return Promise.resolve(hit) as ReturnType<T['loadTile']>;
      }
      let pending = inFlight.get(key);
      if (!pending) {
        pending = provider
          .loadTile(z, x, y)
          .then((tile) => {
            resolved.set(key, tile as Awaited<ReturnType<T['loadTile']>>);
            return tile;
          })
          .finally(() => {
            inFlight.delete(key);
          }) as ReturnType<T['loadTile']>;
        inFlight.set(key, pending);
      }
      return pending;
    }
  };
}

async function createLocalGeoTilesProvider(baseUrl = '/data/geo-tiles'): Promise<GlyphMapProvider> {
  const res = await fetch(`${baseUrl}/manifest.json`);
  if (!res.ok) {
    throw new Error(`Failed to load geo-tiles manifest (${res.status})`);
  }
  const manifest = (await res.json()) as GeoTilesManifest;
  const allowedZooms = manifest.zooms.filter((z) => z.z <= 2);
  const zoomByZ = new Map(allowedZooms.map((z) => [z.z, z] as const));

  const provider: GlyphMapProvider = {
    id: `local-geo-tiles:${baseUrl}`,
    zooms: allowedZooms,
    attribution: manifest.attribution,
    bounds(z, x, y) {
      const level = zoomByZ.get(z);
      if (!level) throw new RangeError(`No geo-tiles zoom level ${z}`);
      return computeTileBounds(level, x, y);
    },
    async loadTile(z, x, y): Promise<GlyphMapGeoTile> {
      const level = zoomByZ.get(z);
      if (!level) throw new RangeError(`No geo-tiles zoom level ${z}`);
      const tileRes = await fetch(`${baseUrl}/${z}/${x}_${y}.bin`);
      if (!tileRes.ok) {
        throw new Error(`Failed to fetch geo-tile ${z}/${x}_${y} (${tileRes.status})`);
      }
      const bytes = await tileRes.arrayBuffer();
      return glyphMapDecodeGeoTileInt16(bytes, {
        bounds: computeTileBounds(level, x, y),
        cols: level.tileCols,
        rows: level.tileRows,
        source: manifest.source,
        sampler: manifest.sampler
      });
    }
  };

  return shareProviderTiles(provider);
}

async function createLocalVectorTilesProvider(baseUrl = '/data/vector-tiles'): Promise<GlyphMapVectorProvider> {
  const res = await fetch(`${baseUrl}/manifest.json`);
  if (!res.ok) {
    throw new Error(`Failed to load vector-tiles manifest (${res.status})`);
  }
  const manifest = (await res.json()) as VectorTilesManifest;

  const allowedZooms = manifest.zooms.filter((z) => z.z <= 2);

  const provider: GlyphMapVectorProvider = {
    id: `local-vector-tiles:${baseUrl}`,
    zooms: allowedZooms,
    attribution: manifest.attribution,
    bounds: (z, x, y) => glyphMapVectorTileBounds(z, x, y),
    async loadTile(z, x, y): Promise<GlyphMapVectorTile> {
      const tileRes = await fetch(`${baseUrl}/${z}/${x}_${y}.json`);
      if (!tileRes.ok) {
        return {
          z,
          x,
          y,
          bounds: glyphMapVectorTileBounds(z, x, y),
          layers: {},
          source: manifest.source,
          simplify: manifest.simplify
        };
      }
      const wire = (await tileRes.json()) as GlyphMapVectorWireTile;
      return glyphMapDecodeVectorTile(wire);
    }
  };

  return shareProviderTiles(provider);
}

let cachedProvidersPromise: Promise<{
  terrain: GlyphMapProvider;
  borders: GlyphMapVectorProvider;
}> | null = null;

export function loadGlyphGlobeProviders(): Promise<{
  terrain: GlyphMapProvider;
  borders: GlyphMapVectorProvider;
}> {
  if (!cachedProvidersPromise) {
    cachedProvidersPromise = Promise.all([
      createLocalGeoTilesProvider('/data/geo-tiles'),
      createLocalVectorTilesProvider('/data/vector-tiles')
    ])
      .then(([terrain, borders]) => ({ terrain, borders }))
      .catch((err) => {
        cachedProvidersPromise = null;
        throw err;
      });
  }
  return cachedProvidersPromise;
}

/**
 * Monochrome White-Paper & Black-Ink palettes for `GlyphMapClassifiers.etopo1V1`
 * (band 0: ocean < 0m; bands 1..8: land 0..250..800..1600..2600..3600..4600..5600+ m).
 *
 * Designed specifically for a pure #FFFFFF background with crisp #000000
 * coastlines, national borders, and spherical limb definition.
 */
export const GLYPH_GLOBE_PALETTE_INK_RELIEF: readonly string[] = [
  '#F5F3EE', // Ocean (< 0m): matches the warm off-white page so the globe sits on the paper with no frame
  '#6b6b74', // Coastal plains (0–250m)
  '#56565e', // Lowlands (250–800m)
  '#42424a', // Foothills (800–1600m)
  '#32323a', // Uplands (1600–2600m)
  '#222228', // High plateaus (2600–3600m)
  '#151518', // Alpine ridges (3600–4600m)
  '#0a0a0c', // High peaks (4600–5600m)
  '#000000'  // Summits (> 5600m)
];

export const GLYPH_GLOBE_PALETTE_PURE_INK: readonly string[] = [
  '#f6f6f8', // Ocean (< 0m)
  '#ececf0', // Land (0–250m)
  '#e4e4ea', // Land (250–800m)
  '#dcdce2', // Land (800–1600m)
  '#d2d2da', // Land (1600–2600m)
  '#c6c6cf', // Land (2600–3600m)
  '#babac4', // Land (3600–4600m)
  '#aeaeb8', // Land (4600–5600m)
  '#9e9ea8'  // Summits (> 5600m)
];

/**
 * Land dot-matrix for the journey globe, sampled from the bundled ETOPO1 geo-tiles
 * (zoom 2: 4×4 tiles of 181×91 int16 vertices, 0.5° resolution, row 0 = north edge).
 *
 * Points are spread evenly over the sphere (constant arc spacing), kept where the
 * elevation is above sea level, and returned as unit vectors sorted by relief band
 * (0: lowland, 1: upland, 2: mountains) so the renderer can batch fill colours.
 */
export interface LandDots {
  /** x, y, z unit vectors, 3 floats per dot */
  readonly xyz: Float32Array;
  /** [start, end) dot index of each relief band */
  readonly bands: readonly [number, number, number, number];
}

let cachedLandDots: Promise<LandDots> | null = null;

export function loadLandDots(spacingDeg = 0.9, baseUrl = '/data/geo-tiles'): Promise<LandDots> {
  if (cachedLandDots) return cachedLandDots;
  const Z = 2;
  const TILES = 4;
  const TILE_COLS = 180;
  const TILE_ROWS = 90;
  const LON_SPAN = 90;
  const LAT_SPAN = 45;
  const tileUrls: string[] = [];
  for (let y = 0; y < TILES; y++) {
    for (let x = 0; x < TILES; x++) tileUrls.push(`${baseUrl}/${Z}/${x}_${y}.bin`);
  }
  cachedLandDots = Promise.all(
    tileUrls.map((url) =>
      fetch(url).then((res) => {
        if (!res.ok) throw new Error(`Failed to fetch ${url} (${res.status})`);
        return res.arrayBuffer();
      })
    )
  )
    .then((buffers) => {
      const grids = buffers.map((b) => new Int16Array(b));
      const elevationAt = (lon: number, lat: number): number => {
        const tx = Math.min(TILES - 1, Math.max(0, Math.floor((lon + 180) / LON_SPAN)));
        const ty = Math.min(TILES - 1, Math.max(0, Math.floor((90 - lat) / LAT_SPAN)));
        const grid = grids[ty * TILES + tx];
        const col = Math.round(((lon - (-180 + tx * LON_SPAN)) / LON_SPAN) * TILE_COLS);
        const row = Math.round((((90 - ty * LAT_SPAN) - lat) / LAT_SPAN) * TILE_ROWS);
        return grid[row * (TILE_COLS + 1) + col] ?? -1;
      };

      const byBand: number[][] = [[], [], []];
      const toRad = Math.PI / 180;
      let rowIdx = 0;
      for (let lat = -79; lat <= 83; lat += spacingDeg, rowIdx++) {
        const cosLat = Math.cos(lat * toRad);
        const n = Math.max(1, Math.round((360 * cosLat) / spacingDeg));
        const offset = rowIdx % 2 === 0 ? 0.25 : 0.75; // stagger rows: no visible grid pattern
        for (let i = 0; i < n; i++) {
          const lon = -180 + ((i + offset) * 360) / n;
          const e = elevationAt(lon, lat);
          if (e <= 0) continue;
          const band = e < 450 ? 0 : e < 1600 ? 1 : 2;
          byBand[band].push(
            cosLat * Math.cos(lon * toRad),
            cosLat * Math.sin(lon * toRad),
            Math.sin(lat * toRad)
          );
        }
      }
      const total = byBand[0].length + byBand[1].length + byBand[2].length;
      const xyz = new Float32Array(total);
      xyz.set(byBand[0], 0);
      xyz.set(byBand[1], byBand[0].length);
      xyz.set(byBand[2], byBand[0].length + byBand[1].length);
      const n0 = byBand[0].length / 3;
      const n1 = byBand[1].length / 3;
      const n2 = byBand[2].length / 3;
      return { xyz, bands: [0, n0, n0 + n1, n0 + n1 + n2] as const };
    })
    .catch((err) => {
      cachedLandDots = null;
      throw err;
    });
  return cachedLandDots;
}
