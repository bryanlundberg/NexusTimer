import { axisTurnSystem } from '../geometry/axis-turn-system'
import { skewbCentroids } from './skewb-geometry'

const corner = (x: number, y: number, z: number) => ({ axis: [x, y, z], period: 3, above: 0 })
const rotation = (x: number, y: number, z: number) => ({ axis: [x, y, z], period: 4, above: -Infinity })

export const skewbTurns = axisTurnSystem(
  {
    R: corner(1, -1, -1),
    U: corner(-1, 1, -1),
    L: corner(-1, -1, 1),
    B: corner(-1, -1, -1),
    x: rotation(1, 0, 0),
    y: rotation(0, 1, 0),
    z: rotation(0, 0, 1)
  },
  skewbCentroids
)
