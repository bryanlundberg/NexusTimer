import { puzzles } from '@rednaxela101/cubing/puzzles'
import { parseAlg } from '@nexustimer/cubelet'
import { cube } from '@nexustimer/cubelet/nxn'
import { measure } from './measure'

const SCRAMBLE_3 = "D2 F' U2 B' L2 F' R2 B U2 F2 R2 D' L' B L2 U2 R D' F' L'"
const SCRAMBLE_7 = Array.from({ length: 100 }, (_, i) => ['3Rw', 'U', "2F'", 'Lw2', "3Dw'", 'B'][i % 6]).join(' ')

const cubing3 = await puzzles['3x3x3']!.kpuzzle()
const cubing7 = await puzzles['7x7x7']!.kpuzzle()
const precompiled3 = cube(3).compile(SCRAMBLE_3)
const precompiled7 = cube(7).compile(SCRAMBLE_7)

let unique = 0

measure('parseAlg, 21 moves, uncached', () => parseAlg(`${SCRAMBLE_3} U${unique++}`))

measure('3x3x3 cubelet apply, precompiled', () => cube(3).solved().apply(precompiled3))
measure('3x3x3 cubelet compile + apply, cached', () => cube(3).solved().apply(cube(3).compile(SCRAMBLE_3)))
measure('3x3x3 cubing.js applyAlg', () => cubing3.defaultPattern().applyAlg(SCRAMBLE_3))

measure('7x7x7 100 moves cubelet apply, precompiled', () => cube(7).solved().apply(precompiled7))
measure('7x7x7 100 moves cubing.js applyAlg', () => cubing7.defaultPattern().applyAlg(SCRAMBLE_7))
