export const ATTRIBUTE = { position: 0, slot: 1, normal: 2, color: 3, alpha: 4 } as const

export const VERTEX_SHADER = `#version 300 es
layout(location = 0) in vec3 a_position;
layout(location = 1) in vec3 a_slot;
layout(location = 2) in vec3 a_normal;
layout(location = 3) in vec3 a_color;
layout(location = 4) in float a_alpha;
uniform mat4 u_projection;
uniform mat4 u_view;
uniform float u_scale;
uniform int u_turnAxis;
uniform vec2 u_turnRange;
uniform float u_turnAngle;
uniform float u_outlineWidth;
out vec3 v_color;
out vec3 v_normal;
out float v_alpha;

vec3 turn(vec3 p) {
  float c = cos(u_turnAngle);
  float s = sin(u_turnAngle);
  if (u_turnAxis == 0) return vec3(p.x, c * p.y - s * p.z, s * p.y + c * p.z);
  if (u_turnAxis == 1) return vec3(c * p.x + s * p.z, p.y, -s * p.x + c * p.z);
  return vec3(c * p.x - s * p.y, s * p.x + c * p.y, p.z);
}

void main() {
  vec3 position = a_position + a_normal * u_outlineWidth;
  vec3 normal = a_normal;
  if (u_turnAxis >= 0) {
    float layer = a_slot[u_turnAxis];
    if (layer >= u_turnRange.x - 0.5 && layer <= u_turnRange.y + 0.5) {
      position = turn(position);
      normal = turn(normal);
    }
  }
  v_color = a_color;
  v_alpha = a_alpha;
  v_normal = mat3(u_view) * normal;
  gl_Position = u_projection * u_view * vec4(position * u_scale, 1.0);
  if (u_outlineWidth > 0.0) gl_Position.z = gl_Position.w;
}
`

export const FRAGMENT_SHADER = `#version 300 es
precision mediump float;
in vec3 v_color;
in vec3 v_normal;
in float v_alpha;
uniform float u_ambient;
uniform float u_outlineAlpha;
out vec4 outColor;

void main() {
  if (u_outlineAlpha > 0.0) {
    outColor = vec4(0.0, 0.0, 0.0, u_outlineAlpha);
    return;
  }
  vec3 light = normalize(vec3(0.35, 0.6, 1.0));
  float shade = u_ambient + (1.0 - u_ambient) * max(dot(normalize(v_normal), light), 0.0);
  outColor = vec4(v_color * shade * v_alpha, v_alpha);
}
`

function compile(gl: WebGL2RenderingContext, type: number, source: string): WebGLShader {
  const shader = gl.createShader(type)!
  gl.shaderSource(shader, source)
  gl.compileShader(shader)
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(shader) ?? 'Shader error')
  return shader
}

export function createCubeProgram(gl: WebGL2RenderingContext): WebGLProgram {
  const program = gl.createProgram()!
  gl.attachShader(program, compile(gl, gl.VERTEX_SHADER, VERTEX_SHADER))
  gl.attachShader(program, compile(gl, gl.FRAGMENT_SHADER, FRAGMENT_SHADER))
  gl.linkProgram(program)
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(program) ?? 'Link error')
  return program
}
