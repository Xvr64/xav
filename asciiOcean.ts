import { buildAtlas, link, type Atlas } from './GradientASCII';
import { globeScrollGeometry } from './abyssPalette';
import {
  applyWaterColor,
  depthAtDocument,
  depthAtScroll,
  glyphsAt,
  inkAt,
  waterAt,
  type OceanGeometry
} from './oceanWorld';

// ============================================================================
// ASCII OCEAN — GradientASCII's glyph pipeline, rendered in document space
// ============================================================================
// The canvas is only the size of the screen, but what it draws is the document's ocean
// (oceanWorld.ts) at the current scroll position: every glyph cell, every current and every
// colour belongs to a point of the page, so scrolling down travels through the water and
// scrolling up comes back through the same water. Two passes per frame:
//   1. CELLS — one texel per visible glyph cell (a ~170 × 70 texture): the currents' value,
//      the glyph chosen for the cell and its ink, from noise in page coordinates + time.
//   2. SCREEN — the water colour for the pixel's depth, lit softly by the currents, with the
//      cell's glyph from the GradientASCII atlas inked over it. Opaque: this is the water.
// Depth samples (colour, ink, glyph density) are evaluated in JS once per frame for a column of
// points down the screen, so the CSS water and the WebGL water come from the same numbers.

const SAMPLES = 24;
const CHARACTERS = ' .·:-~=+≈';
const FONT = "'IBM Plex Mono', ui-monospace, SFMono-Regular, Menlo, Consolas, monospace";
const IDLE_FPS = 30;
/** CSS px per unit of the currents' noise: the size of one swell. */
const WORLD_UNIT = 560;

const COMMON = `
float hash12(vec2 p) {
  vec3 q = fract(vec3(p.xyx) * 0.1031);
  q += dot(q, q.yzx + 33.33);
  return fract((q.x + q.y) * q.z);
}
vec2 hash22(vec2 p) {
  vec3 q = fract(vec3(p.xyx) * vec3(0.1031, 0.103, 0.0973));
  q += dot(q, q.yzx + 33.33);
  return fract((q.xx + q.yz) * q.zy) * 2.0 - 1.0;
}
float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * f * (f * (f * 6.0 - 15.0) + 10.0);
  float a = dot(hash22(i), f);
  float b = dot(hash22(i + vec2(1.0, 0.0)), f - vec2(1.0, 0.0));
  float c = dot(hash22(i + vec2(0.0, 1.0)), f - vec2(0.0, 1.0));
  float d = dot(hash22(i + vec2(1.0, 1.0)), f - vec2(1.0, 1.0));
  return 0.5 + 0.5 * mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
}
`;

const CELLS = `#version 300 es
precision highp float;
uniform vec2 uCellPx;
uniform float uOffsetX;
uniform float uScrollPx;
uniform float uFirstRow;
uniform float uViewH;
uniform float uUnit;
uniform float uTime;
uniform float uCount;
uniform vec4 uGlyph[${SAMPLES}];
out vec4 outCell;
${COMMON}
void main() {
  // The cell's place on the page: column, and row counted from the top of the document
  vec2 cell = vec2(floor(gl_FragCoord.x), uFirstRow + floor(gl_FragCoord.y));
  vec2 centre = vec2(uOffsetX + (cell.x + 0.5) * uCellPx.x, (cell.y + 0.5) * uCellPx.y);
  float s = clamp((centre.y - uScrollPx) / uViewH, 0.0, 1.0) * ${SAMPLES - 1}.0;
  int i = int(floor(s));
  vec4 g = mix(uGlyph[i], uGlyph[min(i + 1, ${SAMPLES - 1})], fract(s));

  // Currents: long swells near the surface (stretched sideways), rounder water in the deep,
  // warped by a slower flow so nothing repeats; all of it drifts on with time
  float t = uTime;
  vec2 q = centre / uUnit * vec2(1.0 / g.z, 1.0) * 1.7;
  vec2 warp = vec2(
    noise(q * 0.5 + vec2(t * 0.031, 1.7)),
    noise(q * 0.5 + vec2(5.2, -t * 0.027))
  ) - 0.5;
  q += warp * 1.7;
  float swell = noise(q + vec2(t * 0.085, -t * 0.018));
  float ripple = noise(q * 2.3 + vec2(-t * 0.14, t * 0.045));
  float field = clamp(swell * 0.68 + ripple * 0.32, 0.0, 1.0);

  float v = smoothstep(0.38, 0.72, field);
  float pick = hash12(cell + 0.37);
  float level = hash12(cell * 1.73 + 4.1);
  // Each cell retunes its glyph slowly, at its own moment: a shimmer, never a flicker
  float tick = floor(t * 1.6 + level * 7.0);
  float wobble = (hash12(cell * 2.31 + tick * 17.7) - 0.5) * 0.16;
  float tone = clamp(v + wobble, 0.0, 1.0);
  float index = clamp(floor(tone * (uCount - 1.0) + 0.5), 1.0, uCount - 1.0);
  float present = step(pick, g.x * (0.3 + v));
  float alpha = present * g.y * smoothstep(0.06, 0.42, v) * mix(0.5, 1.0, level);
  outCell = vec4(index / 255.0, alpha, field, 1.0);
}`;

const SCREEN = `#version 300 es
precision highp float;
uniform sampler2D uCells;
uniform sampler2D uAtlas;
uniform vec2 uCellPx;
uniform vec2 uCellsSize;
uniform float uOffsetX;
uniform float uScrollPx;
uniform float uFirstRow;
uniform float uViewH;
uniform vec2 uAtlasGrid;
uniform float uFrame;
uniform vec3 uWater[${SAMPLES}];
uniform vec3 uInk[${SAMPLES}];
out vec4 outColor;
${COMMON}
void main() {
  float yDown = uViewH - gl_FragCoord.y;
  float s = clamp(yDown / uViewH, 0.0, 1.0) * ${SAMPLES - 1}.0;
  int i = int(floor(s));
  int j = min(i + 1, ${SAMPLES - 1});
  vec3 water = mix(uWater[i], uWater[j], fract(s));
  vec3 ink = mix(uInk[i], uInk[j], fract(s));

  // Position in cells, on the page (rows count down from the first row on screen)
  vec2 coord = vec2((gl_FragCoord.x - uOffsetX) / uCellPx.x, (uScrollPx + yDown) / uCellPx.y - uFirstRow);

  // The currents light the water itself, smoothly between cells: brighter drifts tinted
  // towards the ink, slightly deeper troughs
  float field = texture(uCells, coord / uCellsSize).b;
  water = mix(water, ink, clamp((field - 0.44) * 0.75, 0.0, 0.2));
  water *= 1.0 - clamp((0.44 - field) * 0.3, 0.0, 0.05);

  vec2 cellIndex = floor(coord);
  vec4 cell = texelFetch(uCells, clamp(ivec2(cellIndex), ivec2(0), ivec2(uCellsSize) - 1), 0);
  vec2 local = coord - cellIndex;
  float index = floor(cell.r * 255.0 + 0.5);
  float column = mod(index, uAtlasGrid.x);
  float row = floor(index / uAtlasGrid.x);
  vec2 atlasUv = vec2((column + local.x) / uAtlasGrid.x, (row + local.y) / uAtlasGrid.y);
  vec2 continuous = coord / uAtlasGrid;
  float coverage = textureGrad(uAtlas, atlasUv, dFdx(continuous), dFdy(continuous)).a;

  vec3 color = mix(water, ink, cell.g * coverage);
  color += (hash12(gl_FragCoord.xy + uFrame * 13.7) - 0.5) / 255.0;
  outColor = vec4(clamp(color, 0.0, 1.0), 1.0);
}`;

export interface AsciiOcean {
  destroy: () => void;
}

/**
 * Starts the ocean on `canvas` (a fixed, screen-sized canvas under the page) and keeps the
 * page's CSS water in step with it. Without WebGL2 the CSS water still follows the descent.
 */
export function createAsciiOcean(canvas: HTMLCanvasElement): AsciiOcean {
  const gl = canvas.getContext('webgl2', {
    alpha: false,
    antialias: false,
    depth: false,
    stencil: false,
    premultipliedAlpha: true
  });
  const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  let reduce = motionQuery.matches;
  const geometry: OceanGeometry = { journeyStart: Infinity, journeyTravel: 1, maxScroll: 1, viewHeight: 1 };
  const view = { width: 1, height: 1, ratio: 1, cellCss: 14 };
  let glReady = false;
  let disposed = false;
  let raf = 0;
  let last = 0;
  let lastDraw = 0;
  let lastScroll = NaN;
  let time = 0;
  let frameSeed = 0;
  /** QA only: skip the WebGL passes, to measure the page without them. */
  let qaPaused = false;

  const water = new Float32Array(SAMPLES * 3);
  const ink = new Float32Array(SAMPLES * 3);
  const glyphs = new Float32Array(SAMPLES * 4);

  // --- WebGL resources ----------------------------------------------------------------------
  const cells = gl ? link(gl, CELLS) : null;
  const screen = gl ? link(gl, SCREEN) : null;
  let vao: WebGLVertexArrayObject | null = null;
  let cellTexture: WebGLTexture | null = null;
  let cellFramebuffer: WebGLFramebuffer | null = null;
  const cellGrid = { cols: 0, rows: 0 };
  let atlas: Atlas | null = null;

  if (gl && cells && screen) {
    vao = gl.createVertexArray();
    cellTexture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, cellTexture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    cellFramebuffer = gl.createFramebuffer();
    atlas = buildAtlas(gl, CHARACTERS, FONT);
    document.fonts?.load?.(`300 64px ${FONT}`, CHARACTERS).then(
      () => {
        if (disposed || !glReady) return;
        if (atlas) gl.deleteTexture(atlas.texture);
        atlas = buildAtlas(gl, CHARACTERS, FONT);
        lastScroll = NaN;
        schedule();
      },
      () => {}
    );
    glReady = true;
  }

  const onContextLost = (event: Event) => {
    event.preventDefault();
    glReady = false;
  };
  canvas.addEventListener('webglcontextlost', onContextLost);

  const measure = () => {
    geometry.journeyStart = globeScrollGeometry.start;
    geometry.journeyTravel = globeScrollGeometry.travel;
  };

  const resize = () => {
    view.width = Math.max(1, canvas.clientWidth);
    view.height = Math.max(1, canvas.clientHeight);
    const narrow = view.width < 768;
    view.ratio = Math.min(window.devicePixelRatio || 1, narrow ? 1.25 : 1.5);
    view.cellCss = narrow ? 12 : 14;
    geometry.viewHeight = window.innerHeight;
    geometry.maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    canvas.width = Math.max(1, Math.round(view.width * view.ratio));
    canvas.height = Math.max(1, Math.round(view.height * view.ratio));
    if (gl && glReady) {
      const cellH = view.cellCss * view.ratio;
      const cellW = cellH * 0.6;
      cellGrid.cols = Math.ceil(canvas.width / cellW) + 1;
      cellGrid.rows = Math.ceil(canvas.height / cellH) + 2;
      gl.bindTexture(gl.TEXTURE_2D, cellTexture);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA8, cellGrid.cols, cellGrid.rows, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
      gl.bindFramebuffer(gl.FRAMEBUFFER, cellFramebuffer);
      gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, cellTexture, 0);
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    }
    lastScroll = NaN;
    schedule();
  };

  /** Depth samples for a column of points down the screen, at this scroll position. */
  const sampleDepths = (scroll: number) => {
    for (let i = 0; i < SAMPLES; i++) {
      const depth = depthAtDocument(scroll + (i / (SAMPLES - 1)) * view.height, geometry);
      water.set(waterAt(depth), i * 3);
      ink.set(inkAt(depth), i * 3);
      const g = glyphsAt(depth);
      glyphs.set([g.density, g.strength, g.stretch, depth], i * 4);
    }
  };

  const draw = (scroll: number) => {
    if (!gl || !glReady || !cells || !screen || !atlas) return;
    sampleDepths(scroll);
    const cellH = view.cellCss * view.ratio;
    const cellW = cellH * 0.6;
    const scrollPx = scroll * view.ratio;
    const firstRow = Math.floor(scrollPx / cellH);
    const offsetX = (canvas.width - cellGrid.cols * cellW) / 2;

    gl.bindVertexArray(vao);
    gl.disable(gl.BLEND);

    gl.bindFramebuffer(gl.FRAMEBUFFER, cellFramebuffer);
    gl.viewport(0, 0, cellGrid.cols, cellGrid.rows);
    gl.useProgram(cells.program);
    const cu = cells.uniforms;
    gl.uniform2f(cu.uCellPx, cellW, cellH);
    gl.uniform1f(cu.uOffsetX, offsetX);
    gl.uniform1f(cu.uScrollPx, scrollPx);
    gl.uniform1f(cu.uFirstRow, firstRow);
    gl.uniform1f(cu.uViewH, canvas.height);
    gl.uniform1f(cu.uUnit, WORLD_UNIT * view.ratio);
    gl.uniform1f(cu.uTime, time);
    gl.uniform1f(cu.uCount, atlas.count);
    gl.uniform4fv(cu.uGlyph, glyphs);
    gl.drawArrays(gl.TRIANGLES, 0, 3);

    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.useProgram(screen.program);
    const su = screen.uniforms;
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, cellTexture);
    gl.uniform1i(su.uCells, 0);
    gl.activeTexture(gl.TEXTURE1);
    gl.bindTexture(gl.TEXTURE_2D, atlas.texture);
    gl.uniform1i(su.uAtlas, 1);
    gl.uniform2f(su.uCellPx, cellW, cellH);
    gl.uniform2f(su.uCellsSize, cellGrid.cols, cellGrid.rows);
    gl.uniform1f(su.uOffsetX, offsetX);
    gl.uniform1f(su.uScrollPx, scrollPx);
    gl.uniform1f(su.uFirstRow, firstRow);
    gl.uniform1f(su.uViewH, canvas.height);
    gl.uniform2f(su.uAtlasGrid, atlas.grid[0], atlas.grid[1]);
    gl.uniform1f(su.uFrame, frameSeed);
    gl.uniform3fv(su.uWater, water);
    gl.uniform3fv(su.uInk, ink);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  };

  const frame = (now: number) => {
    raf = 0;
    if (disposed || document.hidden) return;
    const dt = last ? Math.min(0.1, (now - last) / 1000) : 0;
    last = now;
    if (!reduce) time += dt;
    const scroll = window.scrollY;
    const moved = scroll !== lastScroll;
    // Scrolling redraws on every frame so the water moves with the page; at rest the
    // currents only need 30 fps
    if (moved || (!reduce && now - lastDraw >= 1000 / IDLE_FPS - 2)) {
      measure();
      applyWaterColor(depthAtScroll(scroll, geometry), depthAtDocument(scroll + 0.8 * geometry.viewHeight, geometry));
      if (!qaPaused) draw(scroll);
      lastDraw = now;
      lastScroll = scroll;
      frameSeed = (frameSeed + 1) % 97;
    }
    // Under reduced motion the water holds still and only scrolling or resizing redraws it
    if (!reduce) raf = requestAnimationFrame(frame);
    else last = 0;
  };

  function schedule() {
    if (!raf && !disposed && !document.hidden) raf = requestAnimationFrame(frame);
  }

  const onVisibility = () => {
    last = 0;
    schedule();
  };
  const onMotion = () => {
    reduce = motionQuery.matches;
    schedule();
  };
  const resizeObserver = new ResizeObserver(resize);
  resizeObserver.observe(canvas);
  // The document grows and shrinks as sections lay out: keep the depth scale on its real length
  const pageObserver = new ResizeObserver(() => {
    geometry.maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    lastScroll = NaN;
    schedule();
  });
  pageObserver.observe(document.body);
  window.addEventListener('scroll', schedule, { passive: true });
  // QA hook, like __ambientWhales: draw a chosen moment now and read the frame back in the same
  // task (the drawing buffer is not preserved), and report what the water is doing
  (window as unknown as { __asciiOcean?: unknown }).__asciiOcean = {
    render: (atTime?: number) => {
      if (atTime !== undefined) time = atTime;
      measure();
      const t0 = performance.now();
      applyWaterColor(depthAtScroll(window.scrollY, geometry), depthAtDocument(window.scrollY + 0.8 * geometry.viewHeight, geometry));
      draw(window.scrollY);
      gl?.finish();
      return { ms: performance.now() - t0, image: canvas.toDataURL('image/jpeg', 0.85) };
    },
    pause: (paused: boolean) => {
      qaPaused = paused;
    },
    state: () => ({
      time,
      reduce,
      glReady,
      scroll: window.scrollY,
      depth: depthAtScroll(window.scrollY, geometry),
      geometry: { ...geometry },
      canvas: [canvas.width, canvas.height],
      cells: { ...cellGrid }
    })
  };
  document.addEventListener('visibilitychange', onVisibility);
  motionQuery.addEventListener('change', onMotion);
  resize();

  return {
    destroy: () => {
      disposed = true;
      cancelAnimationFrame(raf);
      resizeObserver.disconnect();
      pageObserver.disconnect();
      window.removeEventListener('scroll', schedule);
      document.removeEventListener('visibilitychange', onVisibility);
      motionQuery.removeEventListener('change', onMotion);
      canvas.removeEventListener('webglcontextlost', onContextLost);
      if (gl) {
        if (atlas) gl.deleteTexture(atlas.texture);
        gl.deleteTexture(cellTexture);
        gl.deleteFramebuffer(cellFramebuffer);
        gl.deleteVertexArray(vao);
        if (cells) gl.deleteProgram(cells.program);
        if (screen) gl.deleteProgram(screen.program);
      }
      glReady = false;
    }
  };
}
