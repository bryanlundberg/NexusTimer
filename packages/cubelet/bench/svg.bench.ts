import { cube, cubeStickering } from '@nexustimer/cubelet/nxn'
import { FaceletSvgRenderer, WCA_CUBE_PALETTE, cubeLastLayerLayout, cubeNetLayout } from '@nexustimer/cubelet/svg'
import { measure } from './measure'

const solvedThenApply = (alg: string) => cube(3).solved().apply(cube(3).compile(alg))
const states3 = ['R', 'U', 'F', 'L', 'D', 'B'].map((move) => solvedThenApply(`${move} R U`))
const states7 = ["3Rw U 2F' Lw2 3Dw' B", "2R 3Uw' F2 l"].map((alg) => cube(7).solved().apply(cube(7).compile(alg)))
const oll = cubeStickering(3, 'OLL', { lastLayer: 'D' })
const uncached = new FaceletSvgRenderer(WCA_CUBE_PALETTE, 1)
const cached = new FaceletSvgRenderer(WCA_CUBE_PALETTE)

let next = 0
const anyState3 = () => states3[next++ % states3.length]!

measure('3x3x3 net SVG, uncached', () => uncached.render(anyState3(), cubeNetLayout(3)))
measure('3x3x3 last layer OLL SVG, uncached', () => uncached.render(anyState3(), cubeLastLayerLayout(3), oll))
measure('3x3x3 last layer OLL SVG, cached', () => cached.render(states3[0]!, cubeLastLayerLayout(3), oll))
measure('7x7x7 net SVG, uncached', () => uncached.render(states7[next++ % 2]!, cubeNetLayout(7)))
