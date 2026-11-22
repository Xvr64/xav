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
