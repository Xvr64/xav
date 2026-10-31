/**
 * The convergence layer: the two 3D ASCII whales (whale3dRenderer.ts) posed by convergenceScene.ts,
 * and the glyphs that leave them to become the Earth.
 *
 * Every land dot of the Globe (the same dot-matrix JourneyGlobe draws, from glyphcssGlobe.ts) and
 * every graticule dot is one particle, born on a whale's skin: a point sampled from its surface
 * carrying the mesh's own skinning inputs, so on the GPU it sits exactly on the posed, swimming
 * body. It leaves when the whale's tail-first unravelling reaches it (the same key orders both),
 * is left behind in the wake, spirals forward around the orbit's axis onto the sphere and settles
 * as its dot, turning from a glyph into the Globe's square mark. Settled dots blend into the
 * Globe's orthographic projection, so the last frames match JourneyGlobe dot for dot and the
 * stage can hand over without a seam. All of it is a function of the progress uniform.
 */
import * as THREE from 'three';
import { SKIN_GLSL, WHALE_LOOK, WhaleAsciiRenderer, glyphIndex } from './whale3dRenderer.ts';
import { PART_FLUKE, mulberry32, sampleWhaleSurface } from './whale3dAnatomy.ts';
import { SKIN_ROWS } from './whale3dPose.ts';
import { PHASE, earthSpin, orbitNormal, orbitPosition, sampleConvergence, type ConvergenceView } from './convergenceScene.ts';
import { loadLandDots } from './glyphcssGlobe';
import { cameraBasis, lonLatToVec } from './JourneyGlobe';

const PARTICLE_VS = /* glsl */ `
${SKIN_GLSL}
in vec3 aGeo;
in vec4 aSkin;   // whale, spine, part, dissolve key
in vec3 aOff;
in vec4 aMeta;   // kind (0–2 land relief band, 3 graticule), seed, departure, travel time
uniform mat4 uModel[2];
uniform vec3 uAxis[2];
uniform float uP;
uniform float uOmega;
uniform mat3 uEarth;
uniform vec3 uCamPos;
uniform vec2 uCanvas;
uniform vec3 uGlobe;     // centre x, y and radius (CSS px)
uniform float uOrtho;
uniform float uOcc;
uniform float uDpr;
uniform vec2 uCellPx;    // glyph cell (CSS px)
uniform float uFlight[8];
uniform vec3 uInk;
uniform vec3 uBand[3];
uniform vec3 uGrat;
uniform float uDotScale;
out float vAlpha;
out vec3 vColor;
out float vGlyph;
out float vDot;
out float vBox;

vec3 rotAxis(vec3 v, vec3 k, float a) {
  return v * cos(a) + cross(k, v) * sin(a) + k * dot(k, v) * (1.0 - cos(a));
}

void main() {
  float age = uP - aMeta.z;
  if (age <= 0.0) { gl_Position = vec4(2.0, 2.0, 2.0, 1.0); gl_PointSize = 0.0; return; }
  float tau = clamp(age / aMeta.w, 0.0, 1.0);
  // Wake glyphs linger along the orbit (a trail behind the flukes) before they settle
  float hold = aMeta.x > 2.5 ? 0.4 : 0.0;
  float te = clamp((tau - hold) / (1.0 - hold), 0.0, 1.0);
  float e = te * te * (3.0 - 2.0 * te);
  int w = aSkin.x > 0.5 ? 1 : 0;
  vec3 axis = normalize(uAxis[w]);

  // Where it left the whale: the posed skin point, carried back along the orbit by the angle
  // the whale has swum since (so it hangs in the wake instead of riding along)
  vec3 p; vec3 n; vec3 tg;
  skinWhale(aSkin.y, aOff, vec3(0.0, 1.0, 0.0), aSkin.z, w * ${SKIN_ROWS}, p, n, tg);
  vec3 S = (uModel[w] * vec4(p, 1.0)).xyz;
  S = rotAxis(S, axis, -uOmega * age);

  // Where it settles: its dot on the turning Earth
  vec3 D = uEarth * aGeo;

  // The path spirals forward around the orbit's axis while it moves to the dot's latitude
  vec3 e1 = normalize(abs(axis.z) < 0.9 ? cross(axis, vec3(0.0, 0.0, 1.0)) : cross(axis, vec3(1.0, 0.0, 0.0)));
  vec3 e2 = cross(axis, e1);
  float rS = length(S);
  vec3 sS = S / max(rS, 1e-4);
  float phS = atan(dot(sS, e2), dot(sS, e1));
  float phD = atan(dot(D, e2), dot(D, e1));
  float laS = asin(clamp(dot(sS, axis), -1.0, 1.0));
  float laD = asin(clamp(dot(D, axis), -1.0, 1.0));
  float dph = mod(phD - phS, 6.2831853);
  float ph = phS + dph * e;
  float la = mix(laS, laD, smoothstep(0.0, 0.85, e));
  float r = mix(rS, 1.0, pow(e, 0.75));
  vec3 X = r * (cos(la) * (cos(ph) * e1 + sin(ph) * e2) + sin(la) * axis);

  vec4 clip = projectionMatrix * viewMatrix * vec4(X, 1.0);
  vec3 ndc = clip.xyz / clip.w;
  float settled = smoothstep(0.72, 1.0, tau);
  // Settled dots slide onto the Globe's orthographic framing (JourneyGlobe's projection)
  float k = uOrtho * settled;
  vec2 opx = uGlobe.xy + uGlobe.z * vec2(D.x, -D.y);
  vec2 ondc = vec2(opx.x / uCanvas.x * 2.0 - 1.0, 1.0 - opx.y / uCanvas.y * 2.0);
  gl_Position = vec4(mix(ndc.xy, ondc, k), 0.0, 1.0);

  // In flight: a glyph in whale ink, hidden while the forming sphere stands in front of it
  float occluded = 0.0;
  vec3 toX = X - uCamPos;
  float lx = length(toX);
  vec3 dir = toX / lx;
  float tc = dot(-uCamPos, dir);
  float h2 = dot(uCamPos, uCamPos) - tc * tc;
  if (h2 < 0.995 && tc - sqrt(0.995 - h2) < lx - 0.02) occluded = 1.0;
  float flight = 0.72 * (1.0 - uOcc * occluded);

  // Settled: the Globe's own dot — limb-faded alpha in its four buckets and relief colour
  float facing = mix(dot(normalize(D), normalize(uCamPos)), D.z, k);
  float rest = 0.0;
  float dotPx = 1.0;
  vec3 restCol = uGrat;
  if (aMeta.x < 2.5) {
    float limb = clamp((facing - 0.14) / 0.3, 0.0, 1.0);
    float al = (0.2 + facing * 0.65) * limb;
    int b = int(min(3.0, floor(al * 4.5)));
    rest = facing > 0.14 ? (b == 0 ? 0.13 : b == 1 ? 0.34 : b == 2 ? 0.56 : 0.78) : 0.0;
    dotPx = (0.75 + max(facing, 0.0)) * uDotScale;
    int band = int(aMeta.x + 0.5);
    restCol = band == 0 ? uBand[0] : band == 1 ? uBand[1] : uBand[2];
  } else {
    rest = facing > 0.0 ? mix(0.42, 0.16, uOrtho) * smoothstep(0.0, 0.25, facing) : 0.0;
    dotPx = 1.15;
  }
  vAlpha = mix(flight, rest, settled);
  vColor = mix(uInk, restCol, settled);
  vDot = settled;
  vGlyph = uFlight[int(floor(aMeta.y * 7.999))];
  vBox = uCellPx.x / uCellPx.y;
  gl_PointSize = max(1.0, mix(uCellPx.y, dotPx, settled) * uDpr);
}
`;

const PARTICLE_FS = /* glsl */ `
precision highp float;
uniform sampler2D uAtlas;
uniform vec2 uTile;
uniform float uAtlasCols;
uniform float uLayer;
in float vAlpha;
in vec3 vColor;
in float vGlyph;
in float vDot;
in float vBox;
out vec4 outColor;
void main() {
  vec2 pc = gl_PointCoord;
  float ga = 0.0;
  float u = (pc.x - 0.5) / vBox + 0.5;
  if (u >= 0.0 && u < 1.0) {
    vec2 tile = vec2(mod(vGlyph, uAtlasCols), floor(vGlyph / uAtlasCols));
    ga = texelFetch(uAtlas, ivec2((tile + vec2(u, pc.y)) * uTile), 0).a;
  }
  float a = mix(ga, 1.0, smoothstep(0.55, 1.0, vDot)) * vAlpha * uLayer;
  if (a < 0.004) discard;
  outColor = vec4(vColor * a, a);
}
`;

// The Earth's paper disc under the dots: JourneyGlobe's two-circle radial gradient, reproduced exactly
const DISC_VS = /* glsl */ `
void main() { gl_Position = vec4(position.xy, 0.0, 1.0); }
`;
const DISC_FS = /* glsl */ `
precision highp float;
uniform vec2 uCanvasDev;
uniform float uDpr;
uniform vec3 uDisc;      // centre x, y, radius (CSS px)
uniform float uAlpha;
out vec4 outColor;
void main() {
  vec2 P = vec2(gl_FragCoord.x, uCanvasDev.y - gl_FragCoord.y) / uDpr;
  vec2 c1 = uDisc.xy;
  float R = uDisc.z;
  float d = length(P - c1);
  if (d > R + 1.0) discard;
  vec2 c0 = c1 + vec2(-0.3, -0.35) * R;
  float r0 = 0.1 * R;
  vec2 cd = c1 - c0;
  float dr = R - r0;
  vec2 pd = P - c0;
  float a = dot(cd, cd) - dr * dr;
  float b = dot(pd, cd) + r0 * dr;
  float c = dot(pd, pd) - r0 * r0;
  float t = clamp((b + sqrt(max(0.0, b * b - a * c))) / a, 0.0, 1.0);
  vec4 col = mix(vec4(249.0, 248.0, 245.0, 0.95 * 255.0), vec4(231.0, 235.0, 236.0, 0.95 * 255.0), t) / 255.0;
  float fill = clamp(R - d + 0.5, 0.0, 1.0);
  // Hairline limb
  float ring = clamp(1.0 - abs(d - R) * uDpr, 0.0, 1.0);
  vec4 limb = vec4(31.0, 59.0, 87.0, 0.22 * 255.0) / 255.0;
  float af = col.a * fill;
  vec3 rgb = col.rgb * af;
  float al = af;
  float la = limb.a * ring;
  rgb = limb.rgb * la + rgb * (1.0 - la);
  al = la + al * (1.0 - la);
  outColor = vec4(rgb, al) * uAlpha;
}
`;

const FLIGHT_GLYPHS = ['·', '.', ':', '·', '+', "'", '-', '.'];
const BAND_RGB: [number, number, number][] = [
  [86, 99, 109],
  [60, 72, 82],
  [38, 49, 58]
];
const v3 = (c: [number, number, number]) => new THREE.Vector3(c[0] / 255, c[1] / 255, c[2] / 255);

export interface ConvergenceLayer {
  /** Stage size and where the Globe sits in it at the start of its journey (CSS px). */
  setView(view: ConvergenceView, dpr: number): void;
  /** Draw the scene at progress p (0 … 1); returns the frame's handoff values. */
  render(p: number): { globeReveal: number; layer: number };
  clear(): void;
  /** Development: wait for the GPU to finish the frames issued so far (for timing). */
  finish(): void;
  readonly lost: boolean;
  onContextLost: (() => void) | null;
  destroy(): void;
}

/** Geo frame → world at the end of the convergence: the first city faces the camera, north up. */
function earthBasis(lon: number, lat: number): THREE.Matrix3 {
  const view = lonLatToVec(lon, lat);
  const { east, north } = cameraBasis(view);
  // Rows: world x = geo·east, world y = geo·north, world z = geo·view
  return new THREE.Matrix3().set(east[0], east[1], east[2], north[0], north[1], north[2], view[0], view[1], view[2]);
}

export function createConvergenceLayer(canvas: HTMLCanvasElement, firstCity: { lon: number; lat: number }, shared?: WhaleAsciiRenderer): ConvergenceLayer {
  const ascii = shared ?? new WhaleAsciiRenderer(canvas, { maxWhales: 2, gbufferScale: 0.75 });
  let view: ConvergenceView = { width: 1, height: 1, globeX: 0, globeY: 0, globeR: 1 };
  let dpr = 1;
  const base = earthBasis(firstCity.lon, firstCity.lat);
  const spinM = new THREE.Matrix3();
  const earthM = new THREE.Matrix3();
  const tmpP = new THREE.Vector3();
  const tmpQ = new THREE.Quaternion();
  const tmpS = new THREE.Vector3();

  // ---- Disc ----
  const discMat = new THREE.ShaderMaterial({
    glslVersion: THREE.GLSL3,
    vertexShader: DISC_VS,
    fragmentShader: DISC_FS,
    transparent: true,
    blending: THREE.CustomBlending,
    blendSrc: THREE.OneFactor,
    blendDst: THREE.OneMinusSrcAlphaFactor,
    depthTest: false,
    depthWrite: false,
    uniforms: {
      uCanvasDev: { value: new THREE.Vector2() },
      uDpr: { value: 1 },
      uDisc: { value: new THREE.Vector3() },
      uAlpha: { value: 0 }
    }
  });
  const disc = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), discMat);
  disc.frustumCulled = false;
  ascii.underlay.add(disc);

  // ---- Particles ----
  const particleMat = new THREE.ShaderMaterial({
    glslVersion: THREE.GLSL3,
    vertexShader: PARTICLE_VS,
    fragmentShader: PARTICLE_FS,
    transparent: true,
    blending: THREE.CustomBlending,
    blendSrc: THREE.OneFactor,
    blendDst: THREE.OneMinusSrcAlphaFactor,
    depthTest: false,
    depthWrite: false,
    uniforms: {
      uSkin: { value: ascii.skinTexture },
      ...ascii.pivotUniforms,
      uModel: { value: [new THREE.Matrix4(), new THREE.Matrix4()] },
      uAxis: { value: [new THREE.Vector3(0, 1, 0), new THREE.Vector3(0, 1, 0)] },
      uP: { value: 0 },
      uOmega: { value: 0 },
      uEarth: { value: earthM },
      uCamPos: { value: new THREE.Vector3() },
      uCanvas: { value: new THREE.Vector2() },
      uGlobe: { value: new THREE.Vector3() },
      uOrtho: { value: 0 },
      uOcc: { value: 0 },
      uDpr: { value: 1 },
      uCellPx: { value: new THREE.Vector2(6, 10) },
      uFlight: { value: FLIGHT_GLYPHS.map(glyphIndex) },
      uInk: { value: v3([31, 59, 87]) },
      uBand: { value: BAND_RGB.map(v3) },
      uGrat: { value: v3([31, 59, 87]) },
      uDotScale: { value: 1 },
      uAtlas: { value: null },
      uTile: { value: new THREE.Vector2(1, 1) },
      uAtlasCols: { value: 8 },
      uLayer: { value: 1 }
    }
  });
  const particles = new THREE.Points(new THREE.BufferGeometry(), particleMat);
  particles.frustumCulled = false;
  ascii.overlay.add(particles);

  /** Build the particle set: graticule now, the land as soon as its dots have loaded. */
  const buildParticles = (land: Float32Array | null, bands: readonly number[] | null) => {
    const rnd = mulberry32(7);
    const geo: number[] = [];
    const kind: number[] = [];
    // Graticule dots every 3° along JourneyGlobe's lines (meridians every 30°, parallels ±60/30/0)
    const pushGeo = (lon: number, lat: number) => {
      const v = lonLatToVec(lon, lat);
      geo.push(v[0], v[1], v[2]);
      kind.push(3);
    };
    for (let lon = -180; lon < 180; lon += 30) for (let lat = -78; lat <= 78; lat += 3) pushGeo(lon, lat);
    for (let lat = -60; lat <= 60; lat += 30) for (let lon = -180; lon < 180; lon += 3) pushGeo(lon, lat);
    const gratCount = kind.length;
    if (land && bands) {
      for (let b = 0; b < 3; b++) {
        for (let d = bands[b]; d < bands[b + 1]; d++) {
          geo.push(land[d * 3], land[d * 3 + 1], land[d * 3 + 2]);
          kind.push(b);
        }
      }
    }
    const count = kind.length;
    const skin = sampleWhaleSurface(4096, 11);
    const flukes = sampleWhaleSurface(1024, 12, (info, v) => info[v * 4] === PART_FLUKE);
    const aGeo = new Float32Array(geo);
    const aSkin = new Float32Array(count * 4);
    const aOff = new Float32Array(count * 3);
    const aMeta = new Float32Array(count * 4);
    const e = base.elements; // column-major
    /** Forward arc (radians) around whale w's orbit from where it is at p to the dot's place on arrival. */
    const arcTo = (w: number, p: number, gi: number, arrive: number) => {
      const n = orbitNormal(w, p);
      const ax = Math.abs(n[2]) < 0.9 ? [n[1], -n[0], 0] : [0, n[2], -n[1]];
      const al = Math.hypot(ax[0], ax[1], ax[2]);
      const e1 = [ax[0] / al, ax[1] / al, ax[2] / al];
      const e2 = [n[1] * e1[2] - n[2] * e1[1], n[2] * e1[0] - n[0] * e1[2], n[0] * e1[1] - n[1] * e1[0]];
      const az = (v: number[]) => Math.atan2(v[0] * e2[0] + v[1] * e2[1] + v[2] * e2[2], v[0] * e1[0] + v[1] * e1[1] + v[2] * e1[2]);
      // Destination: geo turned by the spin left at arrival, then into the world (as the shader does)
      const sp = earthSpin(arrive);
      const gx = aGeo[gi * 3], gy = aGeo[gi * 3 + 1], gz = aGeo[gi * 3 + 2];
      const rx = Math.cos(sp) * gx - Math.sin(sp) * gy;
      const ry = Math.sin(sp) * gx + Math.cos(sp) * gy;
      const D = [e[0] * rx + e[3] * ry + e[6] * gz, e[1] * rx + e[4] * ry + e[7] * gz, e[2] * rx + e[5] * ry + e[8] * gz];
      const a = az(D) - az(orbitPosition(w, p));
      return ((a % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);
    };
    for (let i = 0; i < count; i++) {
      const seed = rnd();
      const grat = i < gratCount;
      // Graticule glyphs stream off the flukes first (the wake), the land leaves with the body
      const src = grat ? flukes : skin;
      const k = Math.floor(rnd() * src.count);
      const key = src.info[k * 4 + 3];
      const depart = grat
        ? PHASE.sphere + 0.02 + rnd() * (PHASE.dissolve - PHASE.sphere + 0.02)
        : PHASE.dissolve + (1 - Math.min(1, key)) * PHASE.dissolveSpan * 0.97 + (seed - 0.5) * 0.012;
      // Each glyph leaves the whale whose orbit leads to its place soonest, and travels for as
      // long as the winding takes: the streams stay ribbons that wrap the sphere as they deposit
      const guess = depart + 0.08;
      const arc0 = arcTo(0, depart, i, guess);
      const arc1 = arcTo(1, depart, i, guess);
      const whale = arc0 <= arc1 ? 0 : 1;
      const arc = Math.min(arc0, arc1);
      const travel = grat
        ? 0.1 + arc / 52 + 0.03 * rnd()
        : Math.min(0.955 - 0.012 - depart, 0.032 + arc / 44 + 0.012 * rnd());
      aSkin.set([whale, src.spine[k], src.info[k * 4], key], i * 4);
      aOff.set([src.offset[k * 3], src.offset[k * 3 + 1], src.offset[k * 3 + 2]], i * 3);
      aMeta.set([kind[i], seed, depart, Math.max(0.02, travel)], i * 4);
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(aGeo, 3));
    g.setAttribute('aGeo', new THREE.BufferAttribute(aGeo, 3));
    g.setAttribute('aSkin', new THREE.BufferAttribute(aSkin, 4));
    g.setAttribute('aOff', new THREE.BufferAttribute(aOff, 3));
    g.setAttribute('aMeta', new THREE.BufferAttribute(aMeta, 4));
    particles.geometry.dispose();
    particles.geometry = g;
  };
  buildParticles(null, null);
  let disposed = false;
  loadLandDots()
    .then((dots) => {
      if (!disposed) buildParticles(dots.xyz, dots.bands);
    })
    .catch(() => undefined);

  const layer: ConvergenceLayer = {
    setView(v, d) {
      view = v;
      dpr = d;
      ascii.resize(v.width, v.height, d);
      // The same 6 × 10 px cell as the page's ambient whale glyphs at every size
      ascii.setStyle({ mode: 'shape', cellW: 6, cellH: 10 });
    },
    render(p) {
      ascii.setReadingZones([], 0);
      ascii.setStyle({ ...WHALE_LOOK, invert: false, waterOpacity: 0 });
      const f = sampleConvergence(p, view);
      f.whales.forEach((w, i) =>
        ascii.setWhale(i, { visible: w.visible, position: w.position, quaternion: w.quaternion, scale: w.scale, articulation: w.articulation, dissolve: w.dissolve })
      );
      const cam = ascii.camera;
      cam.fov = f.camera.fov;
      cam.position.set(...f.camera.position);
      cam.up.set(...f.camera.up);
      cam.lookAt(0, 0, 0);
      const W = view.width;
      const H = view.height;
      cam.setViewOffset(W, H, W / 2 - f.camera.centerX, H / 2 - f.camera.centerY, W, H);
      cam.updateProjectionMatrix();
      ascii.setOccluder([0, 0, 0], 1, f.occlusion);
      ascii.setStyle({ opacity: f.layer });

      // Earth: the geo frame turned by the remaining spin about the pole, then into the world
      const c = Math.cos(f.spin);
      const s = Math.sin(f.spin);
      spinM.set(c, -s, 0, s, c, 0, 0, 0, 1);
      earthM.multiplyMatrices(base, spinM);

      const u = particleMat.uniforms;
      const glyphs = ascii.glyphs;
      u.uP.value = f.p;
      u.uOmega.value = f.omega;
      u.uCamPos.value.copy(cam.position);
      u.uCanvas.value.set(W, H);
      u.uGlobe.value.set(view.globeX, view.globeY, view.globeR);
      u.uOrtho.value = f.ortho;
      u.uOcc.value = f.occlusion;
      u.uDpr.value = dpr;
      u.uCellPx.value.set(ascii.style.cellW, ascii.style.cellH);
      u.uDotScale.value = Math.max(0.75, Math.min(1.6, view.globeR / 300));
      u.uAtlas.value = glyphs.texture;
      u.uTile.value.set(glyphs.tileW, glyphs.tileH);
      u.uAtlasCols.value = glyphs.cols;
      u.uLayer.value = f.layer;
      for (let i = 0; i < 2; i++) {
        const w = f.whales[i];
        u.uModel.value[i].compose(tmpP.set(...w.position), tmpQ.set(...w.quaternion), tmpS.setScalar(w.scale));
        u.uAxis.value[i].set(...f.orbitNormals[i]);
      }
      particles.visible = f.p > PHASE.sphere;

      const du = discMat.uniforms;
      const half = Math.tan((cam.fov / 2) * (Math.PI / 180));
      const d = cam.position.length();
      const rPersp = H / 2 / half / Math.sqrt(Math.max(1e-3, d * d - 1));
      du.uCanvasDev.value.set(Math.round(W * dpr), Math.round(H * dpr));
      du.uDpr.value = dpr;
      du.uDisc.value.set(f.camera.centerX, f.camera.centerY, rPersp + (view.globeR - rPersp) * f.ortho);
      du.uAlpha.value = f.disc * f.layer;
      disc.visible = f.disc > 0.001;

      ascii.render();
      return { globeReveal: f.globeReveal, layer: f.layer };
    },
    clear() {
      ascii.clear();
    },
    finish() {
      const gl = ascii.renderer.getContext();
      const px = new Uint8Array(4);
      gl.readPixels(0, 0, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, px);
    },
    get lost() {
      return ascii.lost;
    },
    onContextLost: null,
    destroy() {
      disposed = true;
      particles.geometry.dispose();
      particleMat.dispose();
      disc.geometry.dispose();
      discMat.dispose();
      ascii.overlay.remove(particles);
      ascii.underlay.remove(disc);
      if (!shared) ascii.dispose();
    }
  };
  if (!shared) ascii.onContextLost = () => layer.onContextLost?.();
  return layer;
}
