import { stickerCentroids, type StickerCentroids } from '../geometry/rotation-permutation'
import { centroid, type Point } from '../geometry/triangle-grid'

export type SkewbFaceName = 'U' | 'R' | 'F' | 'D' | 'L' | 'B'

export interface SkewbFace {
  readonly name: SkewbFaceName
  readonly normal: Point
  readonly right: Point
  readonly down: Point
}

export const SKEWB_FACES: readonly SkewbFace[] = [
  { name: 'U', normal: [0, 1, 0], right: [1, 0, 0], down: [0, 0, 1] },
  { name: 'R', normal: [1, 0, 0], right: [0, 0, -1], down: [0, -1, 0] },
  { name: 'F', normal: [0, 0, 1], right: [1, 0, 0], down: [0, -1, 0] },
  { name: 'D', normal: [0, -1, 0], right: [1, 0, 0], down: [0, 0, -1] },
  { name: 'L', normal: [-1, 0, 0], right: [0, 0, 1], down: [0, -1, 0] },
  { name: 'B', normal: [0, 0, -1], right: [-1, 0, 0], down: [0, -1, 0] }
]

export const SKEWB_STICKER_SHAPES: readonly (readonly Point[])[] = [
  [
    [0, -1],
    [1, 0],
    [0, 1],
    [-1, 0]
  ],
  [
    [-1, -1],
    [0, -1],
    [-1, 0]
  ],
  [
    [1, -1],
    [1, 0],
    [0, -1]
  ],
  [
    [1, 1],
    [0, 1],
    [1, 0]
  ],
  [
    [-1, 1],
    [-1, 0],
    [0, 1]
  ]
]

export const SKEWB_STICKERS_PER_FACE = SKEWB_STICKER_SHAPES.length

export const onSkewbFace = ({ normal, right, down }: SkewbFace, [u, v]: Point): Point =>
  normal.map((value, axis) => value + u! * right[axis]! + v! * down[axis]!)

let centroids: StickerCentroids | undefined

export function skewbCentroids(): StickerCentroids {
  centroids ??= stickerCentroids(
    SKEWB_FACES.flatMap((face) => SKEWB_STICKER_SHAPES.map((shape) => onSkewbFace(face, centroid(shape))))
  )
  return centroids
}
