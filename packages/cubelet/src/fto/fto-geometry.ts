import { stickerCentroids, type StickerCentroids } from '../geometry/rotation-permutation'
import { centroid, triangleGrid, type Point } from '../geometry/triangle-grid'
import { cross, dot, normalize, scale, subtract } from '../geometry/vector'

export type FtoFaceName = 'U' | 'F' | 'L' | 'R' | 'B' | 'BL' | 'BR' | 'D'

export interface FtoFace {
  readonly name: FtoFaceName
  readonly normal: Point
  readonly vertices: readonly Point[]
  readonly stickers: readonly (readonly Point[])[]
}

export const FTO_FACE_NAMES: readonly FtoFaceName[] = ['U', 'F', 'L', 'R', 'B', 'BL', 'BR', 'D']
export const FTO_ORDER = 3
export const FTO_STICKERS_PER_FACE = FTO_ORDER * FTO_ORDER
export const FTO_LAYER_CUT = 1 / (3 * Math.sqrt(3))

const SIGNS = [1, -1]
const UP = normalize([1, 1, 1])
const FRONT = (() => {
  const normal = normalize([-1, -1, 1])
  return normalize(subtract(normal, scale(UP, dot(normal, UP))))
})()
const RIGHT = cross(UP, FRONT)

const orient = (point: Point): Point => [dot(point, RIGHT), dot(point, UP), dot(point, FRONT)]

const nameOf = ([x, y, z]: Point): FtoFaceName => {
  if (y! > 0.9) return 'U'
  if (y! < -0.9) return 'D'
  const azimuth = Math.round((Math.atan2(x!, z!) * 180) / Math.PI)
  const ring: Record<number, FtoFaceName> =
    y! > 0 ? { [-60]: 'L', 60: 'R', 180: 'B', [-180]: 'B' } : { 0: 'F', 120: 'BR', [-120]: 'BL' }
  return ring[azimuth]!
}

const buildFaces = (): FtoFace[] => {
  const faces: FtoFace[] = []
  for (const sx of SIGNS) {
    for (const sy of SIGNS) {
      for (const sz of SIGNS) {
        const vertices = [orient([sx, 0, 0]), orient([0, sy, 0]), orient([0, 0, sz])]
        const normal = orient(normalize([sx, sy, sz]))
        const [a, b, c] = vertices as [Point, Point, Point]
        faces.push({ name: nameOf(normal), normal, vertices, stickers: triangleGrid(FTO_ORDER, a, b, c) })
      }
    }
  }
  return FTO_FACE_NAMES.map((name) => faces.find((face) => face.name === name)!)
}

export const FTO_FACES: readonly FtoFace[] = buildFaces()

let centroids: StickerCentroids | undefined

export function ftoCentroids(): StickerCentroids {
  centroids ??= stickerCentroids(FTO_FACES.flatMap((face) => face.stickers.map((sticker) => centroid(sticker))))
  return centroids
}
