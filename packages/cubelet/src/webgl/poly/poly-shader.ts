export const POLY_ATTRIBUTE = { position: 0, normal: 1, center: 2, color: 3 } as const

export const MAX_MOTIONS = 2

const VERTEX_SHADER = `#version 300 es
layout(location = 0) in vec3 a_position;
layout(location = 1) in vec3 a_normal;
layout(location = 2) in vec3 a_center;
layout(location = 3) in vec3 a_color;
uniform mat4 u_projection;
uniform mat4 u_view;
uniform float u_scale;
uniform int u_motionCount;
uniform vec3 u_axis[${MAX_MOTIONS}];
uniform float u_above[${MAX_MOTIONS}];
uniform float u_angle[${MAX_MOTIONS}];
out vec3 v_color;
out vec3 v_normal;

vec3 rotate(vec3 p, vec3 k, float angle) {
  float c = cos(angle);
  float s = sin(angle);
  return p * c + cross(k, p) * s + k * dot(k, p) * (1.0 - c);
}

void main() {
  vec3 position = a_position;
  vec3 normal = a_normal;
  for (int i = 0; i < ${MAX_MOTIONS}; i++) {
    if (i < u_motionCount && dot(a_center, u_axis[i]) > u_above[i]) {
      position = rotate(position, u_axis[i], u_angle[i]);
      normal = rotate(normal, u_axis[i], u_angle[i]);
    }
  }
  v_color = a_color;
  v_normal = mat3(u_view) * normal;
  gl_Position = u_projection * u_view * vec4(position * u_scale, 1.0);
}
`

const FRAGMENT_SHADER = `#version 300 es
precision mediump float;
in vec3 v_color;
in vec3 v_normal;
uniform float u_ambient;
out vec4 outColor;

void main() {
  vec3 light = normalize(vec3(0.35, 0.6, 1.0));
  float shade = u_ambient + (1.0 - u_ambient) * max(dot(normalize(v_normal), light), 0.0);
  outColor = vec4(v_color * shade, 1.0);
}
`

const compile = (gl: WebGL2RenderingContext, type: number, source: string): WebGLShader => {
  const shader = gl.createShader(type)!
  gl.shaderSource(shader, source)
  gl.compileShader(shader)
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(shader) ?? 'Shader error')
  return shader
}

export function createPolyProgram(gl: WebGL2RenderingContext): WebGLProgram {
  const program = gl.createProgram()!
  gl.attachShader(program, compile(gl, gl.VERTEX_SHADER, VERTEX_SHADER))
  gl.attachShader(program, compile(gl, gl.FRAGMENT_SHADER, FRAGMENT_SHADER))
  gl.linkProgram(program)
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(program) ?? 'Link error')
  return program
}
