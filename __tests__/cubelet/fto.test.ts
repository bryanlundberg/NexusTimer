import { puzzles } from '@rednaxela101/cubing/puzzles'
import { UnsupportedMoveError } from '@nexustimer/cubelet'
import {
  FTO_FACE_NAMES,
  FTO_FACES,
  FTO_LAYER_CUT,
  FTO_STICKERS_PER_FACE,
  fto,
  ftoCentroids
} from '@nexustimer/cubelet/fto'
import { CubingOracle, expectSamePartition, seededRandom } from './cubing-oracle-helpers'
import { describePuzzleContract } from './puzzle-contract'

const face = (name: string) => FTO_FACE_NAMES.indexOf(name as never)
const stateAfter = (alg: string) => fto.solved().apply(fto.compile(alg))

const layerStickersOn = (onFace: string, layer: string) => {
  const normal = FTO_FACES[face(layer)]!.normal
  return Array.from({ length: FTO_STICKERS_PER_FACE }, (_, i) => face(onFace) * FTO_STICKERS_PER_FACE + i).filter(
    (sticker) =>
      ftoCentroids()
        .at(sticker)
        .reduce((sum, value, axis) => sum + value * normal[axis]!, 0) > FTO_LAYER_CUT
  )
}

const MOVES = ['U', 'F', 'L', 'R', 'B', 'BL', 'BR', 'D']
const TOKENS = [...MOVES.flatMap((name) => [name, `${name}'`]), 'Uv', "Rv'", 'Fv', 'BLv']

describePuzzleContract(fto, ["R' L B' U' D F' BR' BL R U' L'", "U F R' BL BR' D L B'", "(R U R' U')2 Fv"])

describe('fto moves', () => {
  it('names the faces from the puzzle held with U on top and F in front', () => {
    const [x, y, z] = FTO_FACES[face('F')]!.normal
    expect([Math.round(x! * 100), Math.sign(y!), Math.sign(z!)]).toEqual([0, -1, 1])
    expect(FTO_FACES[face('U')]!.normal[1]).toBeCloseTo(1)
    expect(FTO_FACES[face('R')]!.normal[0]).toBeGreaterThan(0)
    expect(FTO_FACES[face('L')]!.normal[0]).toBeLessThan(0)
  })

  it('turns U clockwise seen from above, bringing the right face strip to the left face', () => {
    const state = stateAfter('U')
    const strip = layerStickersOn('L', 'U')
    expect(strip).toHaveLength(5)
    expect(strip.map((sticker) => state.colorAt(sticker))).toEqual(Array(5).fill(face('R')))
    expect(layerStickersOn('F', 'U')).toHaveLength(1)
  })

  it('moves the face, three strips and three tips', () => {
    const state = stateAfter('U')
    const moved = Array.from({ length: state.stickerCount }, (_, i) => i).filter((i) => state.stickerAt(i) !== i)
    expect(moved).toHaveLength(9 + 3 * 5 + 3)
  })

  it('treats every move as a third of a turn', () => {
    const solved = fto.solved()
    for (const name of [...MOVES, 'Uv', 'BRv']) {
      expect(solved.apply(fto.compile(`${name}3`)).equals(solved)).toBe(true)
      expect(stateAfter(`${name}2`).key()).toBe(stateAfter(`${name}'`).key())
    }
    expect(stateAfter('Rv').isSolved()).toBe(true)
  })

  it('rejects notation from other puzzles', () => {
    for (const alg of ['R++', 'x', 'M', '2U', 'u', 'DR']) expect(() => fto.compile(alg)).toThrow(UnsupportedMoveError)
  })
})

describe('fto matches cubing.js', () => {
  let oracle: CubingOracle

  beforeAll(async () => {
    oracle = new CubingOracle(await puzzles.fto!.kpuzzle())
  })

  it('accepts every move we test', () => {
    expect(TOKENS.filter((token) => !oracle.accepts(token))).toEqual([])
  })

  it('groups single moves, pairs, commutations and scrambles into the same states', () => {
    const random = seededRandom(8)
    const pick = () => TOKENS[Math.floor(random() * TOKENS.length)]!
    const words: string[][] = TOKENS.map((token) => [token])
    for (let i = 0; i < 2000; i++) words.push([pick(), pick()])
    for (let i = 0; i < 400; i++) {
      const a = [pick(), pick(), pick()]
      const b = [pick(), pick()]
      words.push([...a, ...b], [...b, ...a])
    }
    for (let i = 0; i < 300; i++) words.push(Array.from({ length: 12 }, pick))
    expectSamePartition(
      words.map((word) => ({ label: word.join(' '), ours: stateAfter(word.join(' ')).key(), theirs: oracle.key(word) }))
    )
  })
})
