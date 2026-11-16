import { MAX_STUDIO_LIGHTS, type CubeMaterial } from './cube-material'

export const STUDIO_GLSL = `
#define LIGHTS ${MAX_STUDIO_LIGHTS}
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

vec3 studio(vec3 base, vec3 normal, vec3 toEye, float visibility) {
  float occlusion = mix(1.0, visibility, u_occlusionStrength);
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
    float geometry = 0.25 / ((normalDotLight * (1.0 - k) + k) * (normalDotEye * (1.0 - k) + k));
    float fresnel = u_reflectance + (1.0 - u_reflectance) * pow(1.0 - eyeDotHalf, 5.0);
    vec3 radiance = u_lightColor[i] * normalDotLight;
    diffuse += radiance * (1.0 - fresnel) * mix(1.0, occlusion, 0.6);
    specular += radiance * distribution * geometry * fresnel;
  }
  float rim = u_reflectance + (1.0 - u_reflectance) * pow(1.0 - normalDotEye, 5.0);
  vec3 reflected = reflect(-toEye, normal);
  vec3 environment = hemisphere(reflected.y) * rim * u_environment * (1.0 - u_roughness * 0.7) * occlusion;
  return base * diffuse + (specular + environment) * occlusion;
}

vec3 studioColor(vec3 color, vec3 normal, vec3 viewPosition, float visibility) {
  vec3 lit = studio(toLinear(color), normal, normalize(-viewPosition), visibility);
  return toDisplay(neutralToneMap(lit * u_exposure));
}
`

type Locate = (name: string) => WebGLUniformLocation | null

const normalize = ([x, y, z]: readonly number[]): number[] => {
  const length = Math.hypot(x!, y!, z!) || 1
  return [x! / length, y! / length, z! / length]
}

export function applyStudioMaterial(gl: WebGL2RenderingContext, locate: Locate, material: CubeMaterial | null): void {
  gl.uniform1i(locate('u_studio'), material ? 1 : 0)
  if (!material) return
  const directions = new Float32Array(MAX_STUDIO_LIGHTS * 3)
  const colors = new Float32Array(MAX_STUDIO_LIGHTS * 3)
  material.lights.slice(0, MAX_STUDIO_LIGHTS).forEach((light, index) => {
    directions.set(normalize(light.direction), index * 3)
    colors.set(
      light.color.map((channel) => channel * light.intensity),
      index * 3
    )
  })
  gl.uniform1f(locate('u_roughness'), material.roughness)
  gl.uniform1f(locate('u_reflectance'), material.reflectance)
  gl.uniform3fv(locate('u_sky'), material.sky)
  gl.uniform3fv(locate('u_ground'), material.ground)
  gl.uniform1f(locate('u_hemisphere'), material.ambient)
  gl.uniform1f(locate('u_environment'), material.environment)
  gl.uniform3fv(locate('u_lightDirection'), directions)
  gl.uniform3fv(locate('u_lightColor'), colors)
  gl.uniform1f(locate('u_occlusionStrength'), material.occlusion)
  gl.uniform1f(locate('u_exposure'), material.exposure)
}

export function uniformLocator(gl: WebGL2RenderingContext, program: WebGLProgram): Locate {
  const cache = new Map<string, WebGLUniformLocation | null>()
  return (name) => {
    if (!cache.has(name)) cache.set(name, gl.getUniformLocation(program, name))
    return cache.get(name)!
  }
}
