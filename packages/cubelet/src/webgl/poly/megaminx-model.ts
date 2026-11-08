import { megaminx } from '../../megaminx/megaminx-definition'
import { MEGAMINX_FACES, megaminxCentroids, megaminxLayerCut } from '../../megaminx/megaminx-geometry'
import { megaminxTurns } from '../../megaminx/megaminx-turn'
import { faceletModel3d } from './facelet-model'

export const megaminxModel3d = faceletModel3d({
  definition: megaminx,
  turns: megaminxTurns,
  centroids: megaminxCentroids,
  faces: () => MEGAMINX_FACES.map(({ normal }) => ({ normal, distance: 1 })),
  cuts: () => MEGAMINX_FACES.map(({ normal }) => ({ normal, distance: megaminxLayerCut }))
})
