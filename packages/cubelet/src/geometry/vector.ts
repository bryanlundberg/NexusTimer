import type { Point } from './triangle-grid'

export const add = (a: Point, b: Point): Point => a.map((value, i) => value + b[i]!)

export const subtract = (a: Point, b: Point): Point => a.map((value, i) => value - b[i]!)

export const scale = (a: Point, factor: number): Point => a.map((value) => value * factor)

export const dot = (a: Point, b: Point): number => a.reduce((sum, value, i) => sum + value * b[i]!, 0)

export const cross = (a: Point, b: Point): Point => [
  a[1]! * b[2]! - a[2]! * b[1]!,
  a[2]! * b[0]! - a[0]! * b[2]!,
  a[0]! * b[1]! - a[1]! * b[0]!
]

export const normalize = (a: Point): Point => scale(a, 1 / Math.hypot(...a))

export const lerp = (a: Point, b: Point, t: number): Point => a.map((value, i) => value + (b[i]! - value) * t)

export const planesMeet = (normals: readonly [Point, Point, Point], distance: number): Point => {
  const [a, b, c] = normals
  const bc = cross(b, c)
  const ca = cross(c, a)
  const ab = cross(a, b)
  return scale(add(add(bc, ca), ab), distance / dot(a, bc))
}
