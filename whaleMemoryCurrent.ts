import * as THREE from 'three';
import { DOHA_RELEASE_EXP, FLIGHT_SPAN, RELEASE_SPAN, memoryWater } from './profileMemoryTimeline.ts';

/**
 * Organic current-carved cluster key shared across all three GPU passes:
 * - Pass 2 (CELL_FS): freezes departed cells at their exact last attached whale glyph.
 * - Pass 3 (COMPOSITE_FS): hides consumed whale cells so real voids open in the silhouettes.
 * - Pass 4 (WhaleMemoryCurrent): launches those exact cells along curved underwater trajectories.
 *
 * Neighbouring cells share warped ~5x3 organic pockets so characters detach in graceful schools
 * and tidal ribbons rather than uniform pixel noise, while evenly consuming both whales across
 * all eight destinations from Doha (0) through Shanghai (7).
 */
export const MEMORY_CELL_KEY = /* glsl */ `
float memoryHash(ivec2 c) {
  uint n = uint(c.x) * 1597334677u ^ uint(c.y) * 3812015801u;
  n ^= n >> 16u;
  n *= 2246822519u;
  return float(n >> 8u) / 16777216.0;
}

float memoryKey(ivec2 c) {
  vec2 p = vec2(c);
  // Dual-frequency organic current warp so voids carve graceful oceanic slivers, never rectangles.
  vec2 warp = vec2(
    3.6 * sin(p.y * 0.21 + p.x * 0.048) + 1.7 * cos(p.y * 0.43 - p.x * 0.11),
    2.7 * cos(p.x * 0.14 - p.y * 0.088) + 1.3 * sin(p.x * 0.31 + p.y * 0.19)
  );
  vec2 q = p + warp;
  float rowStagger = mod(floor(q.y / 3.0), 3.0) * 1.65;
  ivec2 cluster = ivec2(floor((q + vec2(rowStagger, 0.0)) / vec2(5.0, 3.0)));
  float gHash = memoryHash(cluster + ivec2(47, 123));
  float flowWave = 0.5 + 0.5 * sin(q.x * 0.038 + q.y * 0.064 + gHash * 4.2);
  float cityBucket = floor(clamp(fract(gHash * 1.37 + flowWave * 0.22) * 8.0, 0.0, 7.9999));
  // Within a pocket, cells peel sequentially along the cluster's flow edge so ~10-15 related
  // glyphs lift together and travel as one delicate school.
  vec2 inCluster = fract((q + vec2(rowStagger, 0.0)) / vec2(5.0, 3.0));
  float clusterMoment = fract(gHash * 31.73);
  float localPeel = (inCluster.x * 0.54 + inCluster.y * 0.46) * 0.16 + memoryHash(c) * 0.08;
  float arrival = clamp(clusterMoment * 0.76 + localPeel, 0.0, 0.9995);
  return cityBucket + arrival;
}
`;

/**
 * One instanced quad per source cell of the whale glyph grid.
 * Empty water, still-attached cells, and already-landed glyphs clip out in the vertex shader.
 * Uses the exact same JetBrains Mono glyph atlas as the whales, with clamped 2x2 bilinear
 * sampling so thin 1px ASCII strokes remain sharp and luminous throughout their curved flight.
 */
export class WhaleMemoryCurrent {
  private readonly scene = new THREE.Scene();
  private readonly geometry = new THREE.InstancedBufferGeometry();
  private readonly landings: THREE.DataTexture;
  private readonly material: THREE.ShaderMaterial;

  constructor(sites: Uint8Array<ArrayBuffer>) {
    this.landings = new THREE.DataTexture(sites, sites.length / 4, 1);
    this.landings.minFilter = THREE.NearestFilter;
    this.landings.magFilter = THREE.NearestFilter;
    this.landings.needsUpdate = true;
    const quad = new THREE.PlaneGeometry(1, 1);
    this.geometry.setIndex(quad.index);
    this.geometry.setAttribute('position', quad.attributes.position);
    this.geometry.setAttribute('uv', quad.attributes.uv);
    this.material = new THREE.ShaderMaterial({
      glslVersion: THREE.GLSL3,
      transparent: true,
      premultipliedAlpha: true,
      blending: THREE.CustomBlending,
      blendSrc: THREE.OneFactor,
      blendDst: THREE.OneMinusSrcAlphaFactor,
      depthTest: false,
      depthWrite: false,
      uniforms: {
        uCells: { value: null },
        uAtlas: { value: null },
        uLandings: { value: this.landings },
        uViewport: { value: new THREE.Vector2() },
        uCell: { value: new THREE.Vector2() },
        uTarget: { value: new THREE.Vector4() },
        uCity: { value: 0 },
        uPhase: { value: 0 },
        uInk: { value: new THREE.Vector3() },
        uFar: { value: new THREE.Vector3() },
        uStrength: { value: 1 },
        uStride: { value: 1 }
      },
      vertexShader: /* glsl */ `
        uniform sampler2D uCells, uLandings;
        uniform vec2 uViewport, uCell;
        uniform vec4 uTarget;
        uniform float uCity, uPhase, uStride;
        out vec2 vTileUv;
        flat out vec4 vCell;
        ${MEMORY_CELL_KEY}
        void main() {
          ivec2 grid = textureSize(uCells, 0);
          ivec2 cell = ivec2(gl_InstanceID % grid.x, gl_InstanceID / grid.x);
          vec4 ink = texelFetch(uCells, cell, 0);
          float key = memoryKey(cell);
          float arrival = fract(key);
          float releaseT = (uCity < 0.5 ? pow(max(0.0, arrival), ${DOHA_RELEASE_EXP}) : arrival) * ${RELEASE_SPAN};
          float rawT = (uPhase - releaseT) / ${FLIGHT_SPAN};
          gl_Position = vec4(2.0, 2.0, 0.0, 1.0);
          if (ink.r < 0.001 || ink.g <= 0.0 || floor(key) != uCity ||
              rawT <= 0.0 || rawT >= 1.0 || mod(float(gl_InstanceID), uStride) != 0.0) return;

          vec2 source = (vec2(cell) + 0.5) * uCell;
          int siteCount = textureSize(uLandings, 0).x;
          int site = clamp(int(arrival * float(siteCount)), 0, siteCount - 1);
          vec2 landing = uTarget.xy + uTarget.zw * texelFetch(uLandings, ivec2(site, 0), 0).rg;
          vec2 targetCenter = uTarget.xy + uTarget.zw * 0.5;
          vec2 delta = landing - source;
          float dist = max(1.0, length(delta));

          // Cluster-coherent depth & buoyancy so related glyphs ride the same underwater ribbon.
          ivec2 clusterId = cell / ivec2(5, 3);
          float cDepth = memoryHash(clusterId + ivec2(13, 71));
          float cPhase = memoryHash(clusterId + ivec2(89, 17)) * 6.2831853;
          float cellJitter = (memoryHash(cell + ivec2(3, 19)) - 0.5) * 10.0;

          // Subtle speed variation: some clusters glide briskly ahead, others linger briefly in the current.
          float shaped = clamp(pow(rawT, mix(0.86, 1.14, cDepth)), 0.0, 1.0);
          float t = mix(shaped, shaped * shaped * (3.0 - 2.0 * shaped), 0.68);
          float arc = sin(3.14159265 * t);

          // Control point A: gentle buoyant lift off the whale silhouette.
          float lift = min(uViewport.y * 0.16, 26.0 + dist * 0.17);
          vec2 a = source + vec2(delta.x * 0.15 + (cDepth - 0.5) * 24.0, -lift * (0.52 + cDepth * 0.52));

          // Control point B: cohesive curved underwater channel funnelling smoothly into the active plate.
          vec2 approachDir = normalize(vec2(
            source.x <= targetCenter.x ? -1.0 : 1.0,
            clamp((source.y - targetCenter.y) / max(180.0, uViewport.y * 0.48), -0.72, 0.72)
          ));
          float funnel = min(uViewport.x * 0.24, 72.0 + dist * 0.24);
          vec2 spread = vec2((cDepth - 0.5) * 24.0 + cellJitter * 0.7, sin(cPhase) * 18.0 + cellJitter * 0.5);
          vec2 b = targetCenter + approachDir * funnel + spread;

          float s = 1.0 - t;
          vec2 p = s*s*s*source + 3.0*s*s*t*a + 3.0*s*t*t*b + t*t*t*landing;
          // Tangent velocity along the cubic Bezier for gentle flow-aligned buoyancy.
          vec2 vel = 3.0*s*s*(a - source) + 6.0*s*t*(b - a) + 3.0*t*t*(landing - b);
          vec2 perp = vec2(-delta.y, delta.x) / dist;
          p += perp * sin(t * 7.2 + cPhase) * arc * min(15.0, dist * 0.03);

          // Subtle underwater drift tilt mid-flight, settling cleanly upright on arrival.
          float tilt = clamp(atan(vel.y, max(12.0, abs(vel.x))) * 0.16, -0.22, 0.22) * arc;
          float ct = cos(tilt), st = sin(tilt);
          // Stay clearly legible throughout flight: subtle depth lift mid-arc, settling to plate glyph scale.
          float scale = mix(1.0, 0.84, t * t) + 0.15 * (0.35 + cDepth * 0.65) * arc;
          vec2 local = position.xy * uCell * scale;
          vec2 rot = vec2(local.x * ct - local.y * st, local.x * st + local.y * ct);
          vec2 screen = (p + rot * vec2(1.0, -1.0)) / uViewport;
          gl_Position = vec4(screen * vec2(2.0, -2.0) + vec2(-1.0, 1.0), 0.0, 1.0);
          vTileUv = vec2(uv.x, 1.0 - uv.y);
          vCell = vec4(floor(ink.r * 255.0 + 0.5), ink.g, ink.b, rawT);
        }
      `,
      fragmentShader: /* glsl */ `
        uniform sampler2D uAtlas;
        uniform vec3 uInk, uFar;
        uniform float uStrength;
        in vec2 vTileUv;
        flat in vec4 vCell;
        out vec4 outColor;
        void main() {
          vec2 tile = vec2(textureSize(uAtlas, 0)) / vec2(8.0, 4.0);
          vec2 origin = vec2(mod(vCell.x, 8.0), floor(vCell.x / 8.0)) * tile;
          // Clamped 2x2 bilinear sample strictly inside the character tile so thin strokes never drop out.
          vec2 f = clamp(vTileUv * tile - 0.5, vec2(0.0), tile - 1.001);
          ivec2 i0 = ivec2(floor(f));
          ivec2 i1 = min(ivec2(tile) - 1, i0 + 1);
          vec2 w = fract(f);
          ivec2 o = ivec2(origin);
          float a00 = texelFetch(uAtlas, o + i0, 0).a;
          float a10 = texelFetch(uAtlas, o + ivec2(i1.x, i0.y), 0).a;
          float a01 = texelFetch(uAtlas, o + ivec2(i0.x, i1.y), 0).a;
          float a11 = texelFetch(uAtlas, o + i1, 0).a;
          float rawA = mix(mix(a00, a10, w.x), mix(a01, a11, w.x), w.y);
          float glyphA = smoothstep(0.05, 0.62, rawA);
          if (glyphA <= 0.01) discard;

          float flight = vCell.w;
          float arc = sin(3.14159265 * flight);
          // Hand off softly to the settling plate glyph over the final 10% of touchdown.
          float settle = 1.0 - smoothstep(0.90, 1.0, flight);
          vec3 baseCol = mix(uInk, uFar, vCell.z);
          // Subtle luminous pale sea-glass lift mid-current (delicate, never neon).
          vec3 col = mix(baseCol, vec3(0.85, 0.93, 0.98), 0.34 * arc);
          float alpha = glyphA * (0.68 + 0.32 * vCell.y) * uStrength * settle;
          outColor = vec4(col * alpha, alpha);
        }
      `
    });
    const mesh = new THREE.Mesh(this.geometry, this.material);
    mesh.frustumCulled = false;
    this.scene.add(mesh);
  }

  /**
   * Start linking this current's program without waiting for it: with KHR_parallel_shader_compile
   * the driver links it off the main thread. Call with the canvas bound (render target null), as
   * where the current is drawn, so the program is the one warm() and draw() will look up. Draws nothing.
   */
  prepare(renderer: THREE.WebGLRenderer, camera: THREE.Camera) {
    renderer.compile(this.scene, camera);
  }

  /**
   * Whether the program prepare() started has linked: a status query that never waits (no timer
   * either, unlike compileAsync, whose poll never ends on a lost context). Without the extension
   * three reports every program ready at once, so warm() then links it on the spot, as before.
   */
  prepared(renderer: THREE.WebGLRenderer): boolean {
    const program = (renderer.properties.get(this.material) as { currentProgram?: { isReady(): boolean } }).currentProgram;
    return program?.isReady() === true;
  }

  /** Pre-compile the instanced GLSL3 shader and upload the landing table with zero visible fragments. */
  warm(
    renderer: THREE.WebGLRenderer,
    camera: THREE.Camera,
    cells: THREE.WebGLRenderTarget,
    atlas: THREE.Texture
  ) {
    const u = this.material.uniforms;
    u.uCells.value = cells.texture;
    u.uAtlas.value = atlas;
    u.uViewport.value.set(Math.max(1, innerWidth), Math.max(1, innerHeight));
    u.uCell.value.set(6, 10);
    u.uCity.value = 0;
    u.uPhase.value = -1;
    u.uTarget.value.set(0, 0, 1, 1);
    u.uStrength.value = 0;
    u.uStride.value = 1;
    this.geometry.instanceCount = 1;
    renderer.render(this.scene, camera);
  }

  draw(
    renderer: THREE.WebGLRenderer,
    camera: THREE.Camera,
    cells: THREE.WebGLRenderTarget,
    atlas: THREE.Texture,
    cellW: number,
    cellH: number,
    ink: THREE.Vector3,
    far: THREE.Vector3,
    strength: number
  ) {
    const u = this.material.uniforms;
    const box = memoryWater.target;
    u.uCells.value = cells.texture;
    u.uAtlas.value = atlas;
    u.uViewport.value.set(innerWidth, innerHeight);
    u.uCell.value.set(cellW, cellH);
    u.uCity.value = memoryWater.city;
    u.uPhase.value = memoryWater.phase;
    u.uTarget.value.set(box.x, box.y, box.width, box.height);
    u.uInk.value.copy(ink);
    u.uFar.value.copy(far);
    u.uStrength.value = Math.min(0.98, strength * 1.28 + 0.22);
    // Reduce particle density gracefully on modest mobile hardware while keeping the current unmistakable.
    u.uStride.value = innerWidth < 600 && (navigator.hardwareConcurrency || 4) <= 4 ? 2 : 1;
    this.geometry.instanceCount = cells.width * cells.height;
    renderer.render(this.scene, camera);
  }

  dispose() {
    this.geometry.dispose();
    this.landings.dispose();
    this.material.dispose();
  }
}
