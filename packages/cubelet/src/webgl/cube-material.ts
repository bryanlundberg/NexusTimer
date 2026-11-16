import type { Rgb } from './cube-frame'

export type Vec3 = readonly [x: number, y: number, z: number]

export interface StudioLight {
  readonly direction: Vec3
  readonly color: Rgb
  readonly intensity: number
}

export interface CubeMaterial {
  readonly roughness: number
  readonly reflectance: number
  readonly sky: Rgb
  readonly ground: Rgb
  readonly ambient: number
  readonly environment: number
  readonly lights: readonly StudioLight[]
  readonly occlusion: number
  readonly exposure: number
  readonly shadow: number
  readonly core?: Rgb
}

export const MAX_STUDIO_LIGHTS = 3

const STUDIO_LIGHTS: readonly StudioLight[] = [
  { direction: [0.8, 0.5, 0.4], color: [1, 0.97, 0.92], intensity: 0.75 },
  { direction: [-0.5, -0.3, 0.8], color: [0.9, 0.93, 1], intensity: 0.47 },
  { direction: [0.1, 0.35, -0.95], color: [1, 1, 1], intensity: 0.45 }
]

export const GLOSS_CUBE_MATERIAL: CubeMaterial = {
  roughness: 0.26,
  reflectance: 0.045,
  sky: [1, 1, 1],
  ground: [0.42, 0.42, 0.46],
  ambient: 0.55,
  environment: 0.55,
  lights: STUDIO_LIGHTS,
  occlusion: 0.85,
  exposure: 1,
  shadow: 0.32
}

export const MATTE_CUBE_MATERIAL: CubeMaterial = {
  ...GLOSS_CUBE_MATERIAL,
  roughness: 0.62,
  reflectance: 0.035,
  environment: 0.25
}

export const SPEEDCUBE_MATERIAL: CubeMaterial = {
  ...GLOSS_CUBE_MATERIAL,
  roughness: 0.46,
  reflectance: 0.04,
  environment: 0.35,
  occlusion: 0,
  core: [0.07, 0.07, 0.075]
}
