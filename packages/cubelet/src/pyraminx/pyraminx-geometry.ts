import { centroid, triangleGrid, type Point } from '../geometry/triangle-grid'
import { stickerCentroids, type StickerCentroids } from '../geometry/rotation-permutation'

export type PyraminxVertex = 'U' | 'L' | 'R' | 'B'

export type PyraminxFaceName = 'F' | 'L' | 'R' | 'D'

export interface PyraminxFace {
  readonly name: PyraminxFaceName
  readonly corners: readonly [PyraminxVertex, PyraminxVertex, PyraminxVertex]
}

export const PYRAMINX_ORDER = 3
export const PYRAMINX_STICKERS_PER_FACE = PYRAMINX_ORDER * PYRAMINX_ORDER

export const PYRAMINX_FACES: readonly PyraminxFace[] = [
  { name: 'F', corners: ['U', 'L', 'R'] },
  { name: 'L', corners: ['U', 'L', 'B'] },
  { name: 'R', corners: ['U', 'R', 'B'] },
  { name: 'D', corners: ['L', 'R', 'B'] }
]

const SIDE = Math.sqrt(2 / 3)

export const PYRAMINX_VERTICES: Readonly<Record<PyraminxVertex, Point>> = {
  U: [0, 1, 0],
  L: [-SIDE, -1 / 3, Math.SQRT2 / 3],
  R: [SIDE, -1 / 3, Math.SQRT2 / 3],
  B: [0, -1 / 3, (-2 * Math.SQRT2) / 3]
}

export const PYRAMINX_LAYER_HEIGHT = 4 / (3 * PYRAMINX_ORDER)

let centroids: StickerCentroids | undefined

export function pyraminxCentroids(): StickerCentroids {
  centroids ??= stickerCentroids(
    PYRAMINX_FACES.flatMap(({ corners }) =>
      triangleGrid(
        PYRAMINX_ORDER,
        ...(corners.map((vertex) => PYRAMINX_VERTICES[vertex]) as [Point, Point, Point])
      ).map(centroid)
    )
  )
  return centroids
}
