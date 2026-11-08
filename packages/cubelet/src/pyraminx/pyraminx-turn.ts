import { axisTurnSystem, type AxisMove } from '../geometry/axis-turn-system'
import { PYRAMINX_LAYER_HEIGHT, PYRAMINX_VERTICES, pyraminxCentroids, type PyraminxVertex } from './pyraminx-geometry'

const VERTICES: readonly PyraminxVertex[] = ['U', 'L', 'R', 'B']

const families: Record<string, AxisMove> = {}
for (const vertex of VERTICES) {
  const axis = PYRAMINX_VERTICES[vertex]
  families[vertex.toLowerCase()] = { axis, period: 3, above: 1 - PYRAMINX_LAYER_HEIGHT }
  families[vertex] = { axis, period: 3, above: 1 - 2 * PYRAMINX_LAYER_HEIGHT }
  families[`${vertex}v`] = { axis, period: 3, above: -Infinity }
}

export const pyraminxTurns = axisTurnSystem(families, pyraminxCentroids)
