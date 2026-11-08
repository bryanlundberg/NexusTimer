import { puzzles } from '@rednaxela101/cubing/puzzles'
import { UnsupportedMoveError } from '@nexustimer/cubelet'
import { SKEWB_STICKERS_PER_FACE, skewb } from '@nexustimer/cubelet/skewb'
import { CubingOracle, expectSamePartition, seededRandom } from './cubing-oracle-helpers'
import { describePuzzleContract } from './puzzle-contract'

const [U, R, F, D, L, B] = [0, 1, 2, 3, 4, 5]

const centers = (alg: string) => {
  const state = skewb.solved().apply(skewb.compile(alg))
  return [U, R, F, D, L, B].map((face) => state.colorAt(face * SKEWB_STICKERS_PER_FACE))
}

const moved = (alg: string) => {
  const state = skewb.solved().apply(skewb.compile(alg))
  return Array.from({ length: state.stickerCount }, (_, i) => i).filter((i) => state.stickerAt(i) !== i).length
}

const TOKENS = ['R', 'U', 'L', 'B', 'x', 'y', 'z'].flatMap((family) => [family, `${family}'`, `${family}2`])

describePuzzleContract(skewb, ["R U' L B' R' U L' B R", "R U R' U' x B y' L", "(R U')3 z L'"])

describe('skewb moves', () => {
  it.each([
    ['R', { [R]: D, [D]: B, [B]: R }],
    ['U', { [U]: B, [L]: U, [B]: L }],
    ['L', { [F]: L, [D]: F, [L]: D }],
    ['B', { [D]: L, [L]: B, [B]: D }],
    ['x', { [U]: F, [F]: D, [D]: B, [B]: U }],
    ['y', { [F]: R, [R]: B, [B]: L, [L]: F }],
    ['z', { [U]: L, [R]: U, [D]: R, [L]: D }]
  ])('%s turns clockwise seen from its corner or face', (alg, changes) => {
    const expected = [U, R, F, D, L, B].map((face) => (changes as Record<number, number>)[face] ?? face)
    expect(centers(alg)).toEqual(expected)
  })

  it('moves half of the puzzle on a corner turn and all but the two axis centers on a rotation', () => {
    for (const family of ['R', 'U', 'L', 'B']) expect(moved(family)).toBe(15)
    for (const family of ['x', 'y', 'z']) expect(moved(family)).toBe(28)
  })

  it('cycles corner turns in thirds and rotations in quarters', () => {
    const solved = skewb.solved()
    for (const family of ['R', 'U', 'L', 'B']) {
      expect(solved.apply(skewb.compile(`${family}3`)).equals(solved)).toBe(true)
      expect(centers(`${family}2`)).toEqual(centers(`${family}'`))
    }
    for (const family of ['x', 'y', 'z']) {
      expect(solved.apply(skewb.compile(`${family}4`)).equals(solved)).toBe(true)
      expect(solved.apply(skewb.compile(family)).isSolved()).toBe(true)
    }
  })

  it('rejects moves outside the WCA notation', () => {
    for (const alg of ['F', 'D', 'r', 'Rw', '2R', 'M', 'Rv'])
      expect(() => skewb.compile(alg)).toThrow(UnsupportedMoveError)
  })
})

describe('skewb matches cubing.js', () => {
  let oracle: CubingOracle

  beforeAll(async () => {
    oracle = new CubingOracle(await puzzles.skewb!.kpuzzle())
  })

  const oursKey = (alg: string) => skewb.solved().apply(skewb.compile(alg)).key()

  it('accepts every move we accept', () => {
    expect(TOKENS.filter((token) => !oracle.accepts(token))).toEqual([])
  })

  it('groups single moves, pairs, commutations and scrambles into the same states', () => {
    const random = seededRandom(5)
    const pick = () => TOKENS[Math.floor(random() * TOKENS.length)]!
    const words: string[][] = TOKENS.map((token) => [token])
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
})
