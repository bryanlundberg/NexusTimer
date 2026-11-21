import { ALGORITHM_SET_DEFINITIONS } from '@nexustimer/algorithms'
import { formatAlg, invertAlg, parseAlg, type AnyPuzzleDefinition } from '@nexustimer/cubelet'
import { megaminx } from '@nexustimer/cubelet/megaminx'
import { cube, type CubeState } from '@nexustimer/cubelet/nxn'
import { pyraminx } from '@nexustimer/cubelet/pyraminx'
import { datasetAlgs } from './test-random'

const DEFINITIONS: Readonly<Record<string, AnyPuzzleDefinition>> = {
  '2x2x2': cube(2),
  '3x3x3': cube(3),
  '4x4x4': cube(4),
  '5x5x5': cube(5),
  megaminx,
  pyraminx
}

const [U, R, F, D, L, B] = [0, 1, 2, 3, 4, 5]
const SIDES = [R, F, L, B]

const normalize = (moves: string) => moves.replace(/[()]/g, ' ').replace(/\s+/g, ' ').trim()
const inverse = (moves: string) => formatAlg(invertAlg(parseAlg(moves)))

const algsOf = (slug: string) =>
  ALGORITHM_SET_DEFINITIONS.find((set) => set.slug === slug)!.algorithms.flatMap((collection) =>
    collection.algs.map((alg) => normalize(alg.moves))
  )

const ROTATIONS = ['', 'x', 'x2', "x'", 'z', "z'"].flatMap((tilt) =>
  ['', 'y', 'y2', "y'"].map((turn) => `${tilt} ${turn}`.trim())
)

const sticker3 = (face: number, row: number, col: number) => face * 9 + row * 3 + col
const center3 = (state: CubeState, face: number) => state.colorAt(sticker3(face, 1, 1))

const cube3 = (alg: string): CubeState => {
  const solved = cube(3).solved()
  const state = solved.apply(cube(3).compile(alg))
  const upright = ROTATIONS.map((rotation) => state.apply(cube(3).compile(rotation))).find((candidate) =>
    [U, R, F, D, L, B].every((face) => center3(candidate, face) === center3(solved, face))
  )
  return upright!
}

const keepsF2L = (state: CubeState) =>
  [D, ...SIDES].every((face) =>
    [0, 1, 2].every((row) =>
      [0, 1, 2].every(
        (col) => (face !== D && row === 0) || state.colorAt(sticker3(face, row, col)) === center3(state, face)
      )
    )
  )

const keepsTopEdgesOriented = (state: CubeState) =>
  [
    [0, 1],
    [1, 0],
    [1, 2],
    [2, 1]
  ].every(([row, col]) => state.colorAt(sticker3(U, row!, col!)) === center3(state, U))

const keepsTopOriented = (state: CubeState) =>
  Array.from({ length: 9 }, (_, i) => state.colorAt(U * 9 + i)).every((color) => color === center3(state, U))

const bottomLayerSolved2 = (state: CubeState) => {
  const color = (face: number, row: number, col: number) => state.colorAt(face * 4 + row * 2 + col)
  const bottomFace = [0, 1, 2, 3].map((i) => state.colorAt(D * 4 + i))
  return (
    bottomFace.every((value) => value === bottomFace[0]) &&
    SIDES.every((face) => color(face, 1, 0) === color(face, 1, 1))
  )
}

const keepsBottomLayer2 = (alg: string) => {
  const state = cube(2).solved().apply(cube(2).compile(alg))
  return ROTATIONS.some((rotation) => bottomLayerSolved2(state.apply(cube(2).compile(rotation))))
}

describe.each(Object.keys(DEFINITIONS))('shipped %s algorithms', (puzzle) => {
  const definition = DEFINITIONS[puzzle]!
  const algs = datasetAlgs(puzzle).map(normalize)

  it('all compile', () => {
    expect(algs.length).toBeGreaterThan(0)
    const rejected = algs.filter((alg) => {
      try {
        definition.compile(alg)
        return false
      } catch {
        return true
      }
    })
    expect(rejected).toEqual([])
  })

  it('return to solved when followed by their inverse', () => {
    const solved = definition.solved()
    const broken = algs.filter((alg) => !solved.apply(definition.compile(`${alg} ${inverse(alg)}`)).equals(solved))
    expect(broken).toEqual([])
  })
})

describe('shipped algorithm notation', () => {
  const allAlgs = [...new Set(ALGORITHM_SET_DEFINITIONS.map((set) => set.puzzle))].flatMap(datasetAlgs)

  it('formats every algorithm to text that formats the same way again', () => {
    const unstable = allAlgs.filter((alg) => {
      const once = formatAlg(parseAlg(alg))
      return formatAlg(parseAlg(once)) !== once
    })
    expect(unstable).toEqual([])
  })

  it('gets every algorithm back when it inverts it twice', () => {
    const mismatches = allAlgs.filter((alg) => {
      const formatted = formatAlg(parseAlg(alg))
      return inverse(inverse(formatted)) !== formatted
    })
    expect(mismatches).toEqual([])
  })
})

describe('shipped 3x3x3 algorithms keep what their step does not touch', () => {
  it.each(['oll', 'oll-oh', 'pll', 'coll', 'zbll-s', 'zbll-as', 'zbll-u', 'zbll-t', 'zbll-pi', 'zbll-l', 'zbll-h'])(
    '%s keeps the first two layers',
    (slug) => {
      expect(algsOf(slug).filter((alg) => !keepsF2L(cube3(alg)))).toEqual([])
    }
  )

  it.each(['coll', 'zbll-s', 'zbll-as', 'zbll-u', 'zbll-t', 'zbll-pi', 'zbll-l', 'zbll-h'])(
    '%s keeps the last-layer edges oriented',
    (slug) => {
      expect(algsOf(slug).filter((alg) => !keepsTopEdgesOriented(cube3(alg)))).toEqual([])
    }
  )

  it('pll keeps the whole last layer oriented', () => {
    expect(algsOf('pll').filter((alg) => !keepsTopOriented(cube3(alg)))).toEqual([])
  })
})

describe('shipped 2x2x2 algorithms keep the bottom layer', () => {
  it.each(['ocll', 'cll'])('%s', (slug) => {
    expect(algsOf(slug).filter((alg) => !keepsBottomLayer2(alg))).toEqual([])
  })
})
