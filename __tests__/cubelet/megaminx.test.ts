import { puzzles } from '@rednaxela101/cubing/puzzles'
import { UnsupportedMoveError } from '@nexustimer/cubelet'
import { MEGAMINX_FACE_NAMES, MEGAMINX_FACES, MEGAMINX_STICKERS_PER_FACE, megaminx } from '@nexustimer/cubelet/megaminx'
import { CubingOracle, datasetAlgs, expectSamePartition, seededRandom } from './cubing-oracle-helpers'
import { describePuzzleContract } from './puzzle-contract'

const face = (name: string) => MEGAMINX_FACE_NAMES.indexOf(name as never)
const stickersOf = (name: string) =>
  Array.from({ length: MEGAMINX_STICKERS_PER_FACE }, (_, i) => face(name) * MEGAMINX_STICKERS_PER_FACE + i)

const stateAfter = (alg: string) => megaminx.solved().apply(megaminx.compile(alg))

const WCA_SCRAMBLE = "R++ D-- R-- D++ R++ D++ R-- D-- R++ D-- U' R-- D++ R++ D-- R-- D-- R-- D++ R++ D-- U"

const TOKENS = [
  ...MEGAMINX_FACE_NAMES.flatMap((name) => [name, `${name}'`, `${name}2`, `${name}2'`]),
  ...['y', "y'", 'y2', 'Uv', "Fv'", 'R++', 'R--', 'D++', 'D--']
]

describePuzzleContract(megaminx, [WCA_SCRAMBLE, "R U R' U' F' BR L2 DL' y", "(R++ D--)2 U' B FR2'"])

describe('megaminx moves', () => {
  it('turns U clockwise seen from above, bringing the right face strip to the front', () => {
    const state = stateAfter('U')
    const front = MEGAMINX_FACES[face('F')]!
    expect(front.neighbors[0]).toBe(face('U'))
    const strip = [1, 2, 10].map((index) => face('F') * MEGAMINX_STICKERS_PER_FACE + index)
    expect(strip.map((position) => state.colorAt(position))).toEqual([face('R'), face('R'), face('R')])
    expect(stickersOf('D').every((position) => state.stickerAt(position) === position)).toBe(true)
  })

  it('rotates the whole puzzle with y', () => {
    const state = stateAfter('y')
    expect(stickersOf('F').map((position) => state.colorAt(position))).toEqual(Array(11).fill(face('R')))
    expect(state.isSolved()).toBe(true)
  })

  it('leaves the left layer in place on R++ and the top layer on D++', () => {
    const leftOnly = stateAfter('R++')
    expect(stickersOf('L').every((position) => leftOnly.stickerAt(position) === position)).toBe(true)
    expect(stickersOf('DR').some((position) => leftOnly.stickerAt(position) !== position)).toBe(true)
    const topOnly = stateAfter('D--')
    expect(stickersOf('U').every((position) => topOnly.stickerAt(position) === position)).toBe(true)
  })

  it('treats every move as a fifth of a turn and ++ as two fifths', () => {
    const solved = megaminx.solved()
    for (const family of ['U', 'BL', 'DR', 'y']) {
      expect(solved.apply(megaminx.compile(`${family}5`)).equals(solved)).toBe(true)
      expect(stateAfter(`${family}2`).key()).toBe(stateAfter(`${family} ${family}`).key())
    }
    expect(stateAfter('R++').key()).toBe(stateAfter('R++ R++ R++ R++ R++ R++').key())
    expect(stateAfter('D++ D++ D++ D++ D++').equals(solved)).toBe(true)
    expect(stateAfter('R++ R--').equals(solved)).toBe(true)
  })

  it('moves eleven stickers of a face and its neighbors strips on a face turn', () => {
    const state = stateAfter('F')
    const moved = Array.from({ length: state.stickerCount }, (_, i) => i).filter((i) => state.stickerAt(i) !== i)
    expect(moved).toHaveLength(10 + 5 * 3)
  })

  it('rejects cube-only notation', () => {
    for (const alg of ['M', 'x', '2R', 'Rw', 'r', 'U++'])
      expect(() => megaminx.compile(alg)).toThrow(UnsupportedMoveError)
  })
})

describe('megaminx matches cubing.js', () => {
  let oracle: CubingOracle

  beforeAll(async () => {
    oracle = new CubingOracle(await puzzles.megaminx!.kpuzzle())
  })

  const oursKey = (alg: string) => stateAfter(alg).key()

  it('accepts every move we test', () => {
    expect(TOKENS.filter((token) => !oracle.accepts(token))).toEqual([])
  })

  it('groups single moves, pairs, commutations and scrambles into the same states', () => {
    const random = seededRandom(12)
    const pick = () => TOKENS[Math.floor(random() * TOKENS.length)]!
    const words: string[][] = TOKENS.map((token) => [token])
    for (let i = 0; i < 2000; i++) words.push([pick(), pick()])
    for (let i = 0; i < 400; i++) {
      const a = [pick(), pick(), pick()]
      const b = [pick(), pick()]
      words.push([...a, ...b], [...b, ...a])
    }
    for (let i = 0; i < 300; i++) words.push(Array.from({ length: 12 }, pick))
    words.push(WCA_SCRAMBLE.split(' '))
    expectSamePartition(
      words.map((word) => ({ label: word.join(' '), ours: oursKey(word.join(' ')), theirs: oracle.key(word) }))
    )
  })

  it('groups the shipped algorithms into the same states', () => {
    const entries = datasetAlgs('megaminx').flatMap((alg) => {
      const theirs = oracle.keyOfAlg(alg)
      return theirs === null ? [] : [{ label: alg, ours: oursKey(alg), theirs }]
    })
    expect(entries.length).toBeGreaterThan(20)
    expectSamePartition(entries)
  })
})
