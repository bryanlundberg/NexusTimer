import { dot } from '../../geometry/vector'
import { fto } from '../../fto/fto-definition'
import { FTO_FACES, FTO_LAYER_CUT, ftoCentroids } from '../../fto/fto-geometry'
import { ftoTurns } from '../../fto/fto-turn'
import { faceletModel3d } from './facelet-model'

export const ftoModel3d = faceletModel3d({
  definition: fto,
  turns: ftoTurns,
  centroids: ftoCentroids,
  faces: () => FTO_FACES.map(({ normal, vertices }) => ({ normal, distance: dot(vertices[0]!, normal) })),
  cuts: () => FTO_FACES.map(({ normal }) => ({ normal, distance: FTO_LAYER_CUT }))
})
