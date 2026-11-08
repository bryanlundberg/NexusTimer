import { puzzles } from '@rednaxela101/cubing/puzzles'
import type { KPuzzle } from '@rednaxela101/cubing/kpuzzle'
import { UnsupportedMoveError, formatAlg, invertAlg, parseAlg } from '@nexustimer/cubelet'
import { Square1Color, sideColorOf, square1, type Square1State } from '@nexustimer/cubelet/square1'
import { ALGORITHM_SET_DEFINITIONS } from '@nexustimer/algorithms'
import { seededRandom } from './cubing-oracle-helpers'
import { describePuzzleContract } from './puzzle-contract'

const stateAfter = (alg: string) => square1.solved().apply(square1.compile(alg))
const square1Accepts = (alg: string) => {
  try {
    stateAfter(alg)
    return true
  } catch {
    return false
  }
}
const wedges = (state: Square1State) => Array.from({ length: 24 }, (_, slot) => state.wedgeAt(slot))

const randomLegalAlg = (random: () => number, slashes: number): string => {
  let state = square1.solved()
  const tokens: string[] = []
  for (let i = 0; i < slashes; i++) {
    const options: Array<[number, number]> = []
    for (let top = -5; top <= 6; top++) {
      for (let bottom = -5; bottom <= 6; bottom++) {
        if (state.apply(square1.compile(`(${top},${bottom})`)).canSlash()) options.push([top, bottom])
      }
    }
    const [top, bottom] = options[Math.floor(random() * options.length)]!
    const step = `(${top},${bottom}) /`
    tokens.push(step)
    state = state.apply(square1.compile(step))
  }
  return tokens.join(' ')
}

const SHIPPED_CASES = ALGORITHM_SET_DEFINITIONS.filter((set) => set.puzzle === 'square1').flatMap((set) =>
  set.algorithms.flatMap((collection) => collection.algs.map(({ moves }) => formatAlg(invertAlg(parseAlg(moves)))))
)

const ALGS_ILLEGAL_FROM_SOLVED = [
  '/ (3, 3) / (-1, -2) / (0, -2) / (0, 1) /',
  '(-1, 0) / (0, 3) / (0, 3) / (-1, 0)',
  '(-1, 0) / (1, 1) / (2, -4) / (1, 1) / (-1, 0)'
]

const SAMPLES = ['(1,0) / (-1,0)', '(1,0) / (3,0) / (-1,0)', '(0,-1) / (-3,0) / (3,3) / (0,1)']

describePuzzleContract(square1, SAMPLES)

describe('square-1 moves', () => {
  it('turns the top clockwise seen from above, moving the front edge to the left', () => {
    const state = stateAfter('(3,0)')
    expect(sideColorOf(state.wedgeAt(2))).toBe(Square1Color.Front)
    expect(sideColorOf(state.wedgeAt(11))).toBe(Square1Color.Right)
  })

  it('flips the right half and the middle layer with a slash', () => {
    const state = stateAfter('/')
    expect(state.middleFlipped).toBe(true)
    expect(wedges(state).slice(6, 12)).toEqual([12, 13, 14, 15, 16, 17])
    expect(stateAfter('/ /').isSolved()).toBe(true)
  })

  it('refuses a slash through a corner', () => {
    expect(() => stateAfter('(2,0) /')).toThrow(UnsupportedMoveError)
    expect(() => stateAfter('(1,0) /')).not.toThrow()
  })

  it('inverts tuples and slashes', () => {
    expect(formatAlg(invertAlg(parseAlg('(1,0) / (-3,2) /')))).toBe('/ (3, -2) / (-1, 0)')
  })

  it('rejects face moves', () => {
    expect(() => square1.compile('U')).toThrow(UnsupportedMoveError)
  })

  it('draws every shipped case, which is the inverse of its algorithm applied to a solved puzzle', () => {
    expect(SHIPPED_CASES.length).toBeGreaterThan(200)
    expect(SHIPPED_CASES.filter((alg) => !square1Accepts(alg))).toEqual(ALGS_ILLEGAL_FROM_SOLVED)
  })
})

describe('square-1 matches cubing.js wedge for wedge', () => {
  let kpuzzle: KPuzzle

  beforeAll(async () => {
    kpuzzle = await puzzles.square1!.kpuzzle()
  })

  const expectSame = (alg: string) => {
    const theirs = kpuzzle.defaultPattern().applyAlg(alg).patternData
    const ours = stateAfter(alg)
    expect([alg, wedges(ours)]).toEqual([alg, theirs.WEDGES!.pieces])
    expect([alg, ours.middleFlipped]).toEqual([alg, theirs.EQUATOR!.orientation[1] !== 0])
  }

  it('on random legal sequences', () => {
    const random = seededRandom(1)
    for (let i = 0; i < 300; i++) expectSame(randomLegalAlg(random, 1 + Math.floor(random() * 12)))
  })

  it('on the shipped cases', () => {
    for (const alg of SHIPPED_CASES.filter(square1Accepts)) expectSame(alg)
  })
})
