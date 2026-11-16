import { STUDIO_GLSL } from '../studio-lighting'

export const POLY_ATTRIBUTE = { position: 0, normal: 1, center: 2, color: 3, core: 4 } as const

export const MAX_MOTIONS = 2

const VERTEX_SHADER = `#version 300 es
layout(location = 0) in vec3 a_position;
layout(location = 1) in vec3 a_normal;
layout(location = 2) in vec3 a_center;
layout(location = 3) in vec3 a_color;
layout(location = 4) in float a_core;
uniform mat4 u_projection;
uniform mat4 u_view;
uniform float u_scale;
uniform int u_motionCount;
uniform vec3 u_axis[${MAX_MOTIONS}];
uniform float u_above[${MAX_MOTIONS}];
uniform float u_angle[${MAX_MOTIONS}];
out vec3 v_color;
out vec3 v_normal;
out vec3 v_viewPosition;
out float v_core;

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
  v_core = a_core;
  v_normal = mat3(u_view) * normal;
  vec4 viewPosition = u_view * vec4(position * u_scale, 1.0);
  v_viewPosition = viewPosition.xyz;
  gl_Position = u_projection * viewPosition;
}
`

const FRAGMENT_SHADER = `#version 300 es
precision highp float;
in vec3 v_color;
in vec3 v_normal;
in vec3 v_viewPosition;
in float v_core;
uniform float u_ambient;
uniform vec3 u_core;
uniform float u_coreStrength;
out vec4 outColor;

${STUDIO_GLSL}

void main() {
  vec3 normal = normalize(v_normal);
  if (!u_studio) {
    vec3 light = normalize(vec3(0.35, 0.6, 1.0));
    float shade = u_ambient + (1.0 - u_ambient) * max(dot(normal, light), 0.0);
    outColor = vec4(v_color * shade, 1.0);
    return;
  }
  vec3 lit = studioColor(v_color, normal, v_viewPosition, 1.0);
  outColor = vec4(mix(lit, u_core, v_core * u_coreStrength), 1.0);
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
