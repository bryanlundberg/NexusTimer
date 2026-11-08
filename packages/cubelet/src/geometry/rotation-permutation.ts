import type { Point } from './triangle-grid'

export interface StickerCentroids {
  readonly count: number
  at(sticker: number): Point
  indexOf(point: Point): number
}

const TOLERANCE = 1e-6

export function stickerCentroids(points: readonly Point[]): StickerCentroids {
  return {
    count: points.length,
    at: (sticker) => points[sticker]!,
    indexOf: (point) => {
      for (let sticker = 0; sticker < points.length; sticker++) {
        const other = points[sticker]!
        if (Math.hypot(other[0]! - point[0]!, other[1]! - point[1]!, other[2]! - point[2]!) < TOLERANCE) return sticker
      }
      throw new Error(`No sticker at ${point.join(',')}`)
    }
  }
}

const rotate = (point: Point, axis: Point, angle: number): Point => {
  const cos = Math.cos(angle)
  const sin = Math.sin(angle)
  const [x, y, z] = point as [number, number, number]
  const [ax, ay, az] = axis as [number, number, number]
  const dot = x * ax + y * ay + z * az
  const crossX = ay * z - az * y
  const crossY = az * x - ax * z
  const crossZ = ax * y - ay * x
  return [
    x * cos + crossX * sin + ax * dot * (1 - cos),
    y * cos + crossY * sin + ay * dot * (1 - cos),
    z * cos + crossZ * sin + az * dot * (1 - cos)
  ]
}

export interface RotationCut {
  readonly axis: Point
  readonly above: number
  readonly angle: number
}

export function rotationPermutation(
  centroids: StickerCentroids,
  { axis, above, angle }: RotationCut
): { targets: Uint16Array; sources: Uint16Array } {
  const targets: number[] = []
  const sources: number[] = []
  if (angle !== 0) {
    for (let sticker = 0; sticker < centroids.count; sticker++) {
      const point = centroids.at(sticker)
      if (point[0]! * axis[0]! + point[1]! * axis[1]! + point[2]! * axis[2]! <= above) continue
      targets.push(centroids.indexOf(rotate(point, axis, angle)))
      sources.push(sticker)
    }
  }
  return { targets: Uint16Array.from(targets), sources: Uint16Array.from(sources) }
}
