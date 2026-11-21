import { UnsupportedMoveError, formatAlg, invertAlg, parseAlg } from '@nexustimer/cubelet'
import { Square1Color, sideColorOf, square1, type Square1State } from '@nexustimer/cubelet/square1'
import { ALGORITHM_SET_DEFINITIONS } from '@nexustimer/algorithms'
import { describeMoveLaws } from './move-laws'
import { seededRandom } from './test-random'
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
    expect(SHIPPED_CASES.filter((alg) => !square1Accepts(alg))).toEqual([])
  })
})

describeMoveLaws(square1, {
  tokens: ['(1,0)', '(0,1)', '(-1,0)', '(0,-1)', '(3,3)', '(2,-1)', '(6,0)'],
  seed: 1,
  sameAxis: [
    ['(1,0)', '(0,1)'],
    ['(2,-1)', '(-3,4)']
  ],
  orders: [
    ['(1,0)', 12],
    ['(0,1)', 12],
    ['(6,0)', 2],
    ['/', 2]
  ]
})

describe('square-1 legal sequences', () => {
  it('return to solved after random legal sequences and their inverses', () => {
    const random = seededRandom(1)
    for (let i = 0; i < 300; i++) {
      const alg = randomLegalAlg(random, 1 + Math.floor(random() * 12))
      const restored = stateAfter(alg).apply(square1.compile(formatAlg(invertAlg(parseAlg(alg)))))
      expect([alg, restored.equals(square1.solved())]).toEqual([alg, true])
    }
  })

  it('add tuples that come one after the other', () => {
    expect(stateAfter('(1,0) (2,3)').key()).toBe(stateAfter('(3,3)').key())
    expect(stateAfter('(5,-2) (1,2)').key()).toBe(stateAfter('(6,0)').key())
  })
})
