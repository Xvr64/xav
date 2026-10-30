/**
 * A WebGL2 glyph batch: draws many atlas tiles (one glyph cell each) in a single instanced call.
 * The whale canvas sends its per-cell whale tiles and halos here instead of one Canvas 2D
 * drawImage per cell. Same atlas, same cell placement and per-cell alpha, so the output matches
 * the 2D path; when WebGL2 is unavailable or the context is lost, the caller keeps the 2D path.
 */

const VS = `#version 300 es
layout(location = 0) in vec2 aCorner;
layout(location = 1) in vec2 aDst;
layout(location = 2) in vec2 aTile;
layout(location = 3) in float aAlpha;
uniform vec2 uView;
uniform float uCell;
uniform vec2 uTileUV;
uniform float uInset;
out vec2 vUV;
out float vAlpha;
void main() {
  vec2 p = aDst + aCorner * uCell;
  gl_Position = vec4(p.x / uView.x * 2.0 - 1.0, 1.0 - p.y / uView.y * 2.0, 0.0, 1.0);
  vec2 corner = mix(vec2(uInset), vec2(1.0 - uInset), aCorner);
  vUV = (aTile + corner) * uTileUV;
  vAlpha = aAlpha;
}`;

const FS = `#version 300 es
precision mediump float;
uniform sampler2D uAtlas;
in vec2 vUV;
in float vAlpha;
out vec4 outColor;
void main() {
  outColor = texture(uAtlas, vUV) * vAlpha;
}`;

/** Floats per instance: dst x, dst y, tile col, tile row, alpha */
const STRIDE = 5;

export interface GlyphBatch {
  /** Size the drawing buffer like the 2D canvases (CSS px and the capped pixel ratio). */
  resize(cssW: number, cssH: number, dpr: number): void;
  /** Upload the glyph atlas (premultiplied), with its tile size in atlas pixels. */
  setAtlas(atlas: HTMLCanvasElement, tilePx: number): void;
  begin(): void;
  /** One tile from atlas column/row at the cell whose top-left is (x, y) CSS px. */
  push(col: number, row: number, x: number, y: number, alpha: number): void;
  /** Draws everything pushed since begin(), replacing the previous frame. */
  flush(): void;
  /** False once the context is lost: the caller returns to the 2D path. */
  readonly alive: boolean;
  destroy(): void;
}

function compile(gl: WebGL2RenderingContext, type: number, src: string) {
  const shader = gl.createShader(type)!;
  gl.shaderSource(shader, src);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    const log = gl.getShaderInfoLog(shader);
    gl.deleteShader(shader);
    throw new Error(`glyph batch shader: ${log}`);
  }
  return shader;
}

export function createGlyphBatchGL(canvas: HTMLCanvasElement, cellSize: number): GlyphBatch | null {
  const gl = canvas.getContext('webgl2', {
    alpha: true,
    premultipliedAlpha: true,
    antialias: false,
    depth: false,
    stencil: false,
    preserveDrawingBuffer: false
  });
  if (!gl) return null;

  let program: WebGLProgram;
  try {
    program = gl.createProgram()!;
    gl.attachShader(program, compile(gl, gl.VERTEX_SHADER, VS));
    gl.attachShader(program, compile(gl, gl.FRAGMENT_SHADER, FS));
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return null;
  } catch {
    return null;
  }

  const uView = gl.getUniformLocation(program, 'uView');
  const uCell = gl.getUniformLocation(program, 'uCell');
  const uTileUV = gl.getUniformLocation(program, 'uTileUV');
  const uInset = gl.getUniformLocation(program, 'uInset');
  const uAtlas = gl.getUniformLocation(program, 'uAtlas');

  const vao = gl.createVertexArray();
  gl.bindVertexArray(vao);
  // The unit quad, as a 4-vertex strip
  const quad = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, quad);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([0, 0, 1, 0, 0, 1, 1, 1]), gl.STATIC_DRAW);
  gl.enableVertexAttribArray(0);
  gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
  // Per-instance attributes
  const instances = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, instances);
  const bytes = STRIDE * 4;
  gl.enableVertexAttribArray(1);
  gl.vertexAttribPointer(1, 2, gl.FLOAT, false, bytes, 0);
  gl.vertexAttribDivisor(1, 1);
  gl.enableVertexAttribArray(2);
  gl.vertexAttribPointer(2, 2, gl.FLOAT, false, bytes, 8);
  gl.vertexAttribDivisor(2, 1);
  gl.enableVertexAttribArray(3);
  gl.vertexAttribPointer(3, 1, gl.FLOAT, false, bytes, 16);
  gl.vertexAttribDivisor(3, 1);
  gl.bindVertexArray(null);

  const texture = gl.createTexture();
  let data = new Float32Array(STRIDE * 4096);
  let count = 0;
  let capacityOnGpu = 0;
  let viewW = 1;
  let viewH = 1;
  let tileUVx = 1;
  let tileUVy = 1;
  let inset = 0;
  let alive = true;

  const onLost = (e: Event) => {
    e.preventDefault();
    alive = false;
  };
  canvas.addEventListener('webglcontextlost', onLost);

  return {
    get alive() {
      return alive;
    },
    resize(cssW, cssH, dpr) {
      viewW = Math.max(1, cssW);
      viewH = Math.max(1, cssH);
      canvas.width = Math.max(1, Math.round(cssW * dpr));
      canvas.height = Math.max(1, Math.round(cssH * dpr));
    },
    setAtlas(atlas, tilePx) {
      if (!alive) return;
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, atlas);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      tileUVx = tilePx / atlas.width;
      tileUVy = tilePx / atlas.height;
      // Sample half a texel inside each tile so neighbouring glyphs never bleed in
      inset = 0.5 / tilePx;
    },
    begin() {
      count = 0;
    },
    push(col, row, x, y, alpha) {
      if (count * STRIDE + STRIDE > data.length) {
        const grown = new Float32Array(data.length * 2);
        grown.set(data);
        data = grown;
      }
      const o = count * STRIDE;
      data[o] = x;
      data[o + 1] = y;
      data[o + 2] = col;
      data[o + 3] = row;
      data[o + 4] = alpha;
      count++;
    },
    flush() {
      if (!alive) return;
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      if (count === 0) return;
      gl.useProgram(program);
      gl.bindVertexArray(vao);
      gl.bindBuffer(gl.ARRAY_BUFFER, instances);
      if (data.length > capacityOnGpu) {
        gl.bufferData(gl.ARRAY_BUFFER, data.byteLength, gl.DYNAMIC_DRAW);
        capacityOnGpu = data.length;
      }
      gl.bufferSubData(gl.ARRAY_BUFFER, 0, data, 0, count * STRIDE);
      gl.enable(gl.BLEND);
      gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.uniform1i(uAtlas, 0);
      gl.uniform2f(uView, viewW, viewH);
      gl.uniform1f(uCell, cellSize);
      gl.uniform2f(uTileUV, tileUVx, tileUVy);
      gl.uniform1f(uInset, inset);
      gl.drawArraysInstanced(gl.TRIANGLE_STRIP, 0, 4, count);
      gl.bindVertexArray(null);
    },
    destroy() {
      canvas.removeEventListener('webglcontextlost', onLost);
      gl.deleteBuffer(quad);
      gl.deleteBuffer(instances);
      gl.deleteTexture(texture);
      gl.deleteVertexArray(vao);
      gl.deleteProgram(program);
    }
  };
}
