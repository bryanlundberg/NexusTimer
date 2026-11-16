import { MAX_STUDIO_LIGHTS } from './cube-material'

export const ATTRIBUTE = { position: 0, slot: 1, normal: 2, color: 3, alpha: 4, occlusion: 5 } as const

export const VERTEX_SHADER = `#version 300 es
layout(location = 0) in vec3 a_position;
layout(location = 1) in vec3 a_slot;
layout(location = 2) in vec3 a_normal;
layout(location = 3) in vec3 a_color;
layout(location = 4) in float a_alpha;
layout(location = 5) in float a_occlusion;
uniform mat4 u_projection;
uniform mat4 u_view;
uniform float u_scale;
uniform int u_turnAxis;
uniform vec2 u_turnRange;
uniform float u_turnAngle;
uniform float u_outlineWidth;
out vec3 v_color;
out vec3 v_local;
flat out vec3 v_slot;
out vec3 v_normal;
out vec3 v_viewPosition;
out float v_alpha;
out float v_occlusion;

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
  v_local = a_position - a_slot;
  v_slot = a_slot;
  v_alpha = a_alpha;
  v_occlusion = a_occlusion;
  v_normal = mat3(u_view) * normal;
  vec4 viewPosition = u_view * vec4(position * u_scale, 1.0);
  v_viewPosition = viewPosition.xyz;
  gl_Position = u_projection * viewPosition;
  if (u_outlineWidth > 0.0) gl_Position.z = gl_Position.w;
}
`

export const FRAGMENT_SHADER = `#version 300 es
precision highp float;
#define LIGHTS ${MAX_STUDIO_LIGHTS}
in vec3 v_color;
in vec3 v_local;
flat in vec3 v_slot;
in vec3 v_normal;
in vec3 v_viewPosition;
in float v_alpha;
in float v_occlusion;
uniform float u_ambient;
uniform float u_outlineAlpha;
uniform bool u_studio;
uniform float u_roughness;
uniform float u_reflectance;
uniform vec3 u_sky;
uniform vec3 u_ground;
uniform float u_hemisphere;
uniform float u_environment;
uniform vec3 u_lightDirection[LIGHTS];
uniform vec3 u_lightColor[LIGHTS];
uniform float u_occlusionStrength;
uniform float u_exposure;
uniform float u_edge;
uniform float u_pieceHalfSize;
uniform float u_capDepth;
uniform vec3 u_core;
out vec4 outColor;

const float PI = 3.14159265;

vec3 toLinear(vec3 color) {
  return pow(color, vec3(2.2));
}

vec3 toDisplay(vec3 color) {
  return pow(clamp(color, 0.0, 1.0), vec3(1.0 / 2.2));
}

vec3 neutralToneMap(vec3 color) {
  const float start = 0.76;
  const float desaturation = 0.15;
  float low = min(color.r, min(color.g, color.b));
  float offset = low < 0.08 ? low - 6.25 * low * low : 0.04;
  color -= offset;
  float peak = max(color.r, max(color.g, color.b));
  if (peak < start) return color;
  const float d = 1.0 - start;
  float newPeak = 1.0 - d * d / (peak + d - start);
  color *= newPeak / peak;
  float g = 1.0 - 1.0 / (desaturation * (peak - newPeak) + 1.0);
  return mix(color, vec3(newPeak), g);
}

vec3 hemisphere(float up) {
  return mix(u_ground, u_sky, up * 0.5 + 0.5);
}

vec3 studio(vec3 base, vec3 normal, vec3 toEye) {
  float occlusion = mix(1.0, v_occlusion, u_occlusionStrength);
  float alpha = u_roughness * u_roughness;
  float alpha2 = alpha * alpha;
  float k = alpha * 0.5;
  float normalDotEye = max(dot(normal, toEye), 1e-4);
  vec3 diffuse = hemisphere(normal.y) * u_hemisphere * occlusion;
  vec3 specular = vec3(0.0);
  for (int i = 0; i < LIGHTS; i++) {
    vec3 toLight = u_lightDirection[i];
    float normalDotLight = max(dot(normal, toLight), 0.0);
    if (normalDotLight <= 0.0) continue;
    vec3 halfway = normalize(toLight + toEye);
    float normalDotHalf = max(dot(normal, halfway), 0.0);
    float eyeDotHalf = max(dot(toEye, halfway), 0.0);
    float denominator = normalDotHalf * normalDotHalf * (alpha2 - 1.0) + 1.0;
    float distribution = alpha2 / (PI * denominator * denominator);
    float visibility = 0.25 / ((normalDotLight * (1.0 - k) + k) * (normalDotEye * (1.0 - k) + k));
    float fresnel = u_reflectance + (1.0 - u_reflectance) * pow(1.0 - eyeDotHalf, 5.0);
    vec3 radiance = u_lightColor[i] * normalDotLight;
    diffuse += radiance * (1.0 - fresnel) * mix(1.0, occlusion, 0.6);
    specular += radiance * distribution * visibility * fresnel;
  }
  float rim = u_reflectance + (1.0 - u_reflectance) * pow(1.0 - normalDotEye, 5.0);
  vec3 reflected = reflect(-toEye, normal);
  vec3 environment = hemisphere(reflected.y) * rim * u_environment * (1.0 - u_roughness * 0.7) * occlusion;
  return base * diffuse + (specular + environment) * occlusion;
}

float coreAmount() {
  if (u_capDepth <= 0.0) return 0.0;
  float depth = 1e3;
  for (int axis = 0; axis < 3; axis++) {
    float slot = v_slot[axis];
    if (abs(slot) < u_edge - 0.5) continue;
    depth = min(depth, u_pieceHalfSize - sign(slot) * v_local[axis]);
  }
  float blur = max(fwidth(depth), 1e-4);
  return smoothstep(u_capDepth - blur, u_capDepth + blur, depth);
}

void main() {
  if (u_outlineAlpha > 0.0) {
    outColor = vec4(0.0, 0.0, 0.0, u_outlineAlpha);
    return;
  }
  vec3 normal = normalize(v_normal);
  if (!u_studio) {
    vec3 light = normalize(vec3(0.35, 0.6, 1.0));
    float shade = u_ambient + (1.0 - u_ambient) * max(dot(normal, light), 0.0);
    outColor = vec4(v_color * shade * v_alpha, v_alpha);
    return;
  }
  vec3 lit = studio(toLinear(v_color), normal, normalize(-v_viewPosition));
  vec3 color = mix(toDisplay(neutralToneMap(lit * u_exposure)), u_core, coreAmount());
  outColor = vec4(color * v_alpha, v_alpha);
}
`

export function compileShader(gl: WebGL2RenderingContext, type: number, source: string): WebGLShader {
  const shader = gl.createShader(type)!
  gl.shaderSource(shader, source)
  gl.compileShader(shader)
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(shader) ?? 'Shader error')
  return shader
}

export function linkProgram(gl: WebGL2RenderingContext, vertex: string, fragment: string): WebGLProgram {
  const program = gl.createProgram()!
  gl.attachShader(program, compileShader(gl, gl.VERTEX_SHADER, vertex))
  gl.attachShader(program, compileShader(gl, gl.FRAGMENT_SHADER, fragment))
  gl.linkProgram(program)
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(program) ?? 'Link error')
  return program
}

export function createCubeProgram(gl: WebGL2RenderingContext): WebGLProgram {
  return linkProgram(gl, VERTEX_SHADER, FRAGMENT_SHADER)
}
