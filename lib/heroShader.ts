// Shader adapted from the hero supplied by the owner.
// Original fragment shader by Matthias Hurrle (@atzedent).
const vertexSource = `#version 300 es
in vec2 position;
void main() { gl_Position = vec4(position, 0.0, 1.0); }
`;

const fragmentSource = `#version 300 es
precision highp float;
out vec4 O;
uniform vec2 resolution;
uniform vec2 pointer;
uniform float time;
#define FC gl_FragCoord.xy
#define T time
#define R resolution
#define MN min(R.x, R.y)
float rnd(vec2 p) {
  p = fract(p * vec2(12.9898, 78.233));
  p += dot(p, p + 34.56);
  return fract(p.x * p.y);
}
float noise(vec2 p) {
  vec2 i = floor(p), f = fract(p), u = f * f * (3.0 - 2.0 * f);
  float a = rnd(i), b = rnd(i + vec2(1, 0));
  float c = rnd(i + vec2(0, 1)), d = rnd(i + 1.0);
  return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
}
float fbm(vec2 p) {
  float t = 0.0, a = 1.0;
  mat2 m = mat2(1.0, -0.5, 0.2, 1.2);
  for (int i = 0; i < 5; i++) {
    t += a * noise(p);
    p *= 2.0 * m;
    a *= 0.5;
  }
  return t;
}
float clouds(vec2 p) {
  float d = 1.0, t = 0.0;
  for (float i = 0.0; i < 3.0; i++) {
    float a = d * fbm(i * 10.0 + p.x * 0.2 + 0.2 * (1.0 + i) * p.y + d + i * i + p);
    t = mix(t, d, a);
    d = a;
    p *= 2.0 / (i + 1.0);
  }
  return t;
}
void main() {
  vec2 uv = (FC - 0.5 * R) / MN + pointer * 0.035;
  vec2 st = uv * vec2(2, 1);
  vec3 col = vec3(0);
  float bg = clouds(vec2(st.x + T * 0.5, -st.y));
  uv *= 1.0 - 0.3 * (sin(T * 0.2) * 0.5 + 0.5);
  for (float i = 1.0; i < 12.0; i++) {
    uv += 0.1 * cos(i * vec2(0.1 + 0.01 * i, 0.8) + i * i + T * 0.5 + 0.1 * uv.x);
    vec2 p = uv;
    float d = length(p);
    col += 0.00125 / max(d, 0.0005) * (cos(sin(i) * vec3(1, 2, 3)) + 1.0);
    float b = noise(i + p + bg * 1.731);
    col += 0.002 * b / max(length(max(p, vec2(b * p.x * 0.02, p.y))), 0.0005);
    col = mix(col, vec3(bg * 0.25, bg * 0.137, bg * 0.05), clamp(d, 0.0, 1.0));
  }
  O = vec4(col, 1);
}
`;

export type HeroRenderer = {
  resize: (width: number, height: number, density: number) => void;
  render: (time: number, pointer: [number, number]) => void;
  dispose: () => void;
};

export function createHeroRenderer(canvas: HTMLCanvasElement): HeroRenderer | null {
  const gl = (() => {
    try {
      return canvas.getContext('webgl2', {
        alpha: false, antialias: false, depth: false, stencil: false,
        powerPreference: 'low-power',
      });
    } catch {
      return null;
    }
  })();
  if (!gl) return null;

  const shaders: WebGLShader[] = [];
  let program: WebGLProgram | null = null;
  let buffer: WebGLBuffer | null = null;
  const dispose = () => {
    if (buffer) gl.deleteBuffer(buffer);
    if (program) gl.deleteProgram(program);
    shaders.forEach(shader => gl.deleteShader(shader));
  };

  try {
    const compile = (type: number, source: string) => {
      const shader = gl.createShader(type);
      if (!shader) throw new Error('Shader allocation failed');
      shaders.push(shader);
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) throw new Error('Shader compilation failed');
      return shader;
    };
    const vertex = compile(gl.VERTEX_SHADER, vertexSource);
    const fragment = compile(gl.FRAGMENT_SHADER, fragmentSource);
    program = gl.createProgram();
    if (!program) throw new Error('Program allocation failed');
    gl.attachShader(program, vertex);
    gl.attachShader(program, fragment);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) throw new Error('Shader linking failed');

    buffer = gl.createBuffer();
    if (!buffer) throw new Error('Buffer allocation failed');
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, 1, -1, -1, 1, 1, 1, -1]), gl.STATIC_DRAW);
    const position = gl.getAttribLocation(program, 'position');
    gl.enableVertexAttribArray(position);
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);
    const uniforms = {
      resolution: gl.getUniformLocation(program, 'resolution'),
      time: gl.getUniformLocation(program, 'time'),
      pointer: gl.getUniformLocation(program, 'pointer'),
    };

    return {
      resize(width, height, density) {
        canvas.width = Math.max(1, Math.round(width * density));
        canvas.height = Math.max(1, Math.round(height * density));
        gl.viewport(0, 0, canvas.width, canvas.height);
      },
      render(time, pointer) {
        gl.useProgram(program);
        gl.uniform2f(uniforms.resolution, canvas.width, canvas.height);
        gl.uniform1f(uniforms.time, time);
        gl.uniform2f(uniforms.pointer, pointer[0], pointer[1]);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      },
      dispose,
    };
  } catch {
    dispose();
    return null;
  }
}
