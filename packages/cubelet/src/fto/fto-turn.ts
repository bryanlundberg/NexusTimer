import { axisTurnSystem, type AxisMove } from '../geometry/axis-turn-system'
import { FTO_FACES, FTO_LAYER_CUT, ftoCentroids } from './fto-geometry'

const families: Record<string, AxisMove> = {}
for (const { name, normal } of FTO_FACES) {
  families[name] = { axis: normal, period: 3, above: FTO_LAYER_CUT }
  families[`${name}v`] = { axis: normal, period: 3, above: -Infinity }
}

export const ftoTurns = axisTurnSystem(families, ftoCentroids)
