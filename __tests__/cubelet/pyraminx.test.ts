import { puzzles } from '@rednaxela101/cubing/puzzles'
import { UnsupportedMoveError } from '@nexustimer/cubelet'
import { PYRAMINX_STICKERS_PER_FACE, pyraminx } from '@nexustimer/cubelet/pyraminx'
import { CubingOracle, datasetAlgs, expectSamePartition, seededRandom } from './cubing-oracle-helpers'
import { describePuzzleContract } from './puzzle-contract'

const F = 0
const L = 1
const R = 2
const D = 3
const TIP = [0]
const TWO_LAYERS = [0, 1, 2, 3]
const BASE = [4, 5, 6, 7, 8]

const colors = (alg: string) => {
  const state = pyraminx.solved().apply(pyraminx.compile(alg))
  return Array.from({ length: state.stickerCount }, (_, i) => state.colorAt(i))
}

const faceColors = (all: readonly number[], face: number, indices: readonly number[]) =>
  indices.map((index) => all[face * PYRAMINX_STICKERS_PER_FACE + index])

const WCA_TOKENS = ['U', 'L', 'R', 'B', 'u', 'l', 'r', 'b', 'Uv', 'Lv', 'Rv', 'Bv'].flatMap((family) => [
  family,
  `${family}'`,
  `${family}2`,
  `${family}2'`
])

describePuzzleContract(pyraminx, ["U L' R B' U' L R' u r' b", "R U R' U' l' b", "(R U R')2 Bv' L"])

describe('pyraminx moves', () => {
  it('turns U clockwise seen from the top vertex, bringing the right face to the front', () => {
    const turned = colors('U')
    expect(faceColors(turned, F, TWO_LAYERS)).toEqual([R, R, R, R])
    expect(faceColors(turned, L, TWO_LAYERS)).toEqual([F, F, F, F])
    expect(faceColors(turned, R, TWO_LAYERS)).toEqual([L, L, L, L])
    expect(faceColors(turned, F, BASE)).toEqual([F, F, F, F, F])
    expect(faceColors(turned, D, [...TWO_LAYERS, ...BASE])).toEqual(Array(9).fill(D))
  })

  it('turns only the tip with a lowercase move', () => {
    const turned = colors('u')
    expect(faceColors(turned, F, TIP)).toEqual([R])
    expect(faceColors(turned, F, [1, 2, 3, ...BASE])).toEqual(Array(8).fill(F))
  })

  it('rotates the whole puzzle with a v move', () => {
    const turned = colors('Uv')
    expect(faceColors(turned, F, [...TWO_LAYERS, ...BASE])).toEqual(Array(9).fill(R))
    const rotated = pyraminx.solved().apply(pyraminx.compile('Uv'))
    for (let position = 0; position < rotated.stickerCount; position++)
      expect(rotated.stickerAt(position)).not.toBe(position)
    expect(colors('Lv Lv Lv')).toEqual(colors(''))
    expect(pyraminx.solved().apply(pyraminx.compile('Uv')).isSolved()).toBe(true)
  })

  it('treats every move as a third of a turn', () => {
    const solved = pyraminx.solved()
    for (const family of ['U', 'L', 'R', 'B', 'u', 'b', 'Rv']) {
      expect(solved.apply(pyraminx.compile(`${family} ${family} ${family}`)).equals(solved)).toBe(true)
      expect(colors(`${family}2`)).toEqual(colors(`${family}'`))
      expect(colors(`${family}3`)).toEqual(colors(''))
    }
  })

  it('maps every vertex turn onto stickers of the same face count', () => {
    for (const token of WCA_TOKENS) {
      const counts = [0, 0, 0, 0]
      for (const color of colors(token)) counts[color]!++
      expect(counts).toEqual([9, 9, 9, 9])
    }
  })

  it('rejects cube moves and layer prefixes', () => {
    for (const alg of ['F', 'D', 'y', 'Rw', '2U', '1-2U', 'M']) {
      expect(() => pyraminx.compile(alg)).toThrow(UnsupportedMoveError)
    }
  })
})

describe('pyraminx matches cubing.js', () => {
  let oracle: CubingOracle

  beforeAll(async () => {
    oracle = new CubingOracle(await puzzles.pyraminx!.kpuzzle())
  })

  const oursKey = (alg: string) => pyraminx.solved().apply(pyraminx.compile(alg)).key()

  it('accepts every WCA move', () => {
    expect(WCA_TOKENS.filter((token) => !oracle.accepts(token))).toEqual([])
  })

  it('groups single moves, pairs and commutations into the same states', () => {
    const random = seededRandom(3)
    const pick = () => WCA_TOKENS[Math.floor(random() * WCA_TOKENS.length)]!
    const words: string[][] = WCA_TOKENS.map((token) => [token])
    for (let i = 0; i < 2000; i++) words.push([pick(), pick()])
    for (let i = 0; i < 400; i++) {
      const a = [pick(), pick(), pick()]
      const b = [pick(), pick()]
      words.push([...a, ...b], [...b, ...a])
    }
    for (let i = 0; i < 300; i++) words.push(Array.from({ length: 11 }, pick))
    expectSamePartition(
      words.map((word) => ({ label: word.join(' '), ours: oursKey(word.join(' ')), theirs: oracle.key(word) }))
    )
  })

  it('groups the shipped algorithms into the same states', () => {
    const entries = datasetAlgs('pyraminx').flatMap((alg) => {
      const theirs = oracle.keyOfAlg(alg)
      return theirs === null ? [] : [{ label: alg, ours: oursKey(alg), theirs }]
    })
    expect(entries.length).toBeGreaterThan(100)
    expectSamePartition(entries)
  })
})
