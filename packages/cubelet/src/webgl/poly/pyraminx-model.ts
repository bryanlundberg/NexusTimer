import type { Plane } from '../../geometry/convex-cells'
import { centroid } from '../../geometry/triangle-grid'
import { dot, normalize } from '../../geometry/vector'
import { pyraminx } from '../../pyraminx/pyraminx-definition'
import {
  PYRAMINX_FACES,
  PYRAMINX_LAYER_HEIGHT,
  PYRAMINX_VERTICES,
  pyraminxCentroids
} from '../../pyraminx/pyraminx-geometry'
import { pyraminxTurns } from '../../pyraminx/pyraminx-turn'
import { faceletModel3d } from './facelet-model'

const faces = (): Plane[] =>
  PYRAMINX_FACES.map(({ corners }) => {
    const points = corners.map((vertex) => PYRAMINX_VERTICES[vertex])
    const normal = normalize(centroid(points))
    return { normal, distance: dot(points[0]!, normal) }
  })

const cuts = (): Plane[] =>
  Object.values(PYRAMINX_VERTICES).flatMap((normal) => [
    { normal, distance: 1 - PYRAMINX_LAYER_HEIGHT },
    { normal, distance: 1 - 2 * PYRAMINX_LAYER_HEIGHT }
  ])

export const pyraminxModel3d = faceletModel3d({
  definition: pyraminx,
  turns: pyraminxTurns,
  centroids: pyraminxCentroids,
  faces,
  cuts
})
