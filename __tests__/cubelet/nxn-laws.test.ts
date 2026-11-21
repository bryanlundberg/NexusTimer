import { cube, type CubeState } from '@nexustimer/cubelet/nxn'
import { describeMoveLaws, faceletColors } from './move-laws'

const SIZES = [2, 3, 4, 5, 6, 7] as const
const FACES = ['U', 'R', 'F', 'D', 'L', 'B'] as const
const SUPERFLIP = "U R2 F B R B2 R U2 L B2 R U' D' R2 F R' L B2 U2 F2"
const T_PERM = "R U R' U' R' F R2 U' R' U' R U R' F'"
const SUNE = "R U R' U R U2 R'"

const withAmounts = (families: readonly string[]) => families.flatMap((family) => [family, `${family}'`, `${family}2`])

const tokensFor = (size: number): string[] => {
  const families: string[] = [...FACES, 'x', 'y', 'z', ...FACES.map((face) => `${face}w`)]
  if (size % 2 === 1) families.push('M', 'E', 'S')
  for (let layer = 2; layer < size; layer++) families.push(...FACES.map((face) => `${layer}${face}`))
  if (size >= 5) families.push(...FACES.map((face) => `2-${size - 1}${face}w`))
  return withAmounts(families)
}

const innerLayers = (size: number, face: 'R' | 'U' | 'F', slice: 'M' | 'E' | 'S') => {
  if (size === 2) return ''
  if (size === 3) return slice === 'M' ? "M'" : slice === 'E' ? "E'" : 'S'
  return `2-${size - 1}${face}w`
}

const after = (size: number, alg: string): CubeState => cube(size).solved().apply(cube(size).compile(alg))

const at = (face: number, row: number, col: number) => face * 9 + row * 3 + col
const CORNERS = [
  [0, 0],
  [0, 2],
  [2, 0],
  [2, 2]
] as const
const EDGES = [
  [0, 1],
  [1, 0],
  [1, 2],
  [2, 1]
] as const

for (const size of SIZES) {
  const sameAxis: Array<[string, string]> = [
    ['R', 'L'],
    ['U', 'D'],
    ['F', 'B'],
    ['R', 'x'],
    ['U', 'y'],
    ['F', 'z'],
    ['Rw', 'L']
  ]
  if (size % 2 === 1) sameAxis.push(['R', 'M'], ['U', 'E'], ['F', 'S'])
  if (size >= 4) sameAxis.push(['R', '2R'], ['2U', 'D'], [`${size - 1}F`, 'F'])

  describeMoveLaws(cube(size), {
    tokens: tokensFor(size),
    seed: size,
    sameAxis,
    orders: [
      ['R', 4],
      ['R2', 2],
      ['x', 4],
      ['x y', 3],
      ['Rw', 4]
    ],
    colorsOf: faceletColors
  })

  describe(`${size}x${size}x${size} notation identities`, () => {
    it.each([
      ['x', ['R', innerLayers(size, 'R', 'M'), "L'"]],
      ['y', ['U', innerLayers(size, 'U', 'E'), "D'"]],
      ['z', ['F', innerLayers(size, 'F', 'S'), "B'"]]
    ])('%s turns every layer', (rotation, layers) => {
      const alg = layers.filter(Boolean).join(' ')
      expect(after(size, alg).key()).toBe(after(size, rotation).key())
    })

    if (size >= 3) {
      it('Rw turns the outer layer and the one next to it', () => {
        const second = size === 3 ? "M'" : '2R'
        expect(after(size, 'Rw').key()).toBe(after(size, `R ${second}`).key())
        expect(after(size, 'r').key()).toBe(after(size, 'Rw').key())
      })
    }
  })
}

describe('2x2x2 move orders', () => {
  it('repeats R U 15 times before it is solved again', () => {
    let state = after(2, 'R U')
    let count = 1
    while (!state.equals(cube(2).solved())) {
      state = state.apply(cube(2).compile('R U'))
      count++
    }
    expect(count).toBe(15)
  })
})

describeMoveLaws(cube(3), {
  tokens: tokensFor(3),
  seed: 33,
  orders: [
    ['R U', 105],
    ["R U R' U'", 6],
    [SUNE, 6],
    [T_PERM, 2],
    [SUPERFLIP, 2],
    ['M2 E2 S2', 2]
  ]
})

describe('3x3x3 patterns', () => {
  const centerOf = (state: CubeState, face: number) => state.colorAt(at(face, 1, 1))

  it('superflip keeps every corner in place and flips every edge', () => {
    const state = after(3, SUPERFLIP)
    for (let face = 0; face < 6; face++) {
      for (const [row, col] of CORNERS) expect(state.colorAt(at(face, row, col))).toBe(centerOf(state, face))
      for (const [row, col] of EDGES) expect(state.colorAt(at(face, row, col))).not.toBe(centerOf(state, face))
    }
  })

  it('M2 E2 S2 paints every face in a checkerboard of its color and the opposite one', () => {
    const state = after(3, 'M2 E2 S2')
    for (let face = 0; face < 6; face++) {
      const opposite = (face + 3) % 6
      for (const [row, col] of CORNERS) expect(state.colorAt(at(face, row, col))).toBe(centerOf(state, face))
      for (const [row, col] of EDGES) expect(state.colorAt(at(face, row, col))).toBe(centerOf(state, opposite))
    }
  })
})
