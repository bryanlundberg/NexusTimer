import { axisTurnSystem, type AxisMove } from '../geometry/axis-turn-system'
import { MEGAMINX_FACES, megaminxCentroids, megaminxLayerCut, type MegaminxFaceName } from './megaminx-geometry'

const normalOf = (name: MegaminxFaceName) => MEGAMINX_FACES.find((face) => face.name === name)!.normal

const families: Record<string, AxisMove> = {
  y: { axis: normalOf('U'), period: 5, above: -Infinity },
  'R++': { axis: normalOf('DR'), period: 5, above: -megaminxLayerCut, step: 2 },
  'D++': { axis: normalOf('D'), period: 5, above: -megaminxLayerCut, step: 2 }
}
for (const { name, normal } of MEGAMINX_FACES) {
  families[name] = { axis: normal, period: 5, above: megaminxLayerCut }
  families[`${name}v`] = { axis: normal, period: 5, above: -Infinity }
}

export const megaminxTurns = axisTurnSystem(families, megaminxCentroids)
