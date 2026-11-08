import { normalize } from '../../geometry/vector'
import { skewb } from '../../skewb/skewb-definition'
import { SKEWB_FACES, skewbCentroids } from '../../skewb/skewb-geometry'
import { skewbTurns } from '../../skewb/skewb-turn'
import { faceletModel3d } from './facelet-model'

const DIAGONALS = [
  [1, -1, -1],
  [-1, 1, -1],
  [-1, -1, 1],
  [-1, -1, -1]
]

export const skewbModel3d = faceletModel3d({
  definition: skewb,
  turns: skewbTurns,
  centroids: skewbCentroids,
  faces: () => SKEWB_FACES.map(({ normal }) => ({ normal, distance: 1 })),
  cuts: () => DIAGONALS.map((diagonal) => ({ normal: normalize(diagonal), distance: 0 }))
})
