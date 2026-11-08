import { puzzles } from '@rednaxela101/cubing/puzzles'
import type { KPuzzle } from '@rednaxela101/cubing/kpuzzle'
import { UnsupportedMoveError } from '@nexustimer/cubelet'
import { CLOCK_PINS, clock, type ClockState } from '@nexustimer/cubelet/clock'
import { seededRandom } from './cubing-oracle-helpers'
import { describePuzzleContract } from './puzzle-contract'

const stateAfter = (alg: string) => clock.solved().apply(clock.compile(alg))
const dials = (state: ClockState) => Array.from({ length: 18 }, (_, i) => state.dialAt(i))

const turn = (pin: string, amount: number) => `${pin}${Math.abs(amount)}${amount < 0 ? '-' : '+'}`

const wcaScramble = (random: () => number, withPins: boolean) => {
  const amount = () => Math.floor(random() * 12) - 5
  const front = CLOCK_PINS.map((pin) => turn(pin, amount()))
  const back = CLOCK_PINS.slice(4).map((pin) => turn(pin, amount()))
  return [...front, 'y2', ...back, ...(withPins ? ['UR', 'DL'] : [])].join(' ')
}

describePuzzleContract(clock, [
  'UR3+ DR0+ DL5- UL1+ U2- R4+ D3+ L0+ ALL6+ y2 U1+ R2- D3+ L4- ALL5-',
  'ALL1+ y2 UR4-',
  '(U2+ R1-)3'
])

describe('clock moves', () => {
  it('turns the front quadrant clockwise and the linked back corner the other way', () => {
    expect(dials(stateAfter('UR3+'))).toEqual([0, 3, 3, 0, 3, 3, 0, 0, 0, 9, 0, 0, 0, 0, 0, 0, 0, 0])
  })

  it('turns every front dial with ALL and only the back corners', () => {
    expect(dials(stateAfter('ALL1-'))).toEqual([11, 11, 11, 11, 11, 11, 11, 11, 11, 1, 0, 1, 0, 0, 0, 1, 0, 1])
  })

  it('swaps the faces and remembers the flip on y2', () => {
    const state = stateAfter('UR3+ y2')
    expect(state.flipped).toBe(true)
    expect(dials(state).slice(9, 13)).toEqual([0, 3, 3, 0])
    expect(stateAfter('y2 y2').equals(clock.solved())).toBe(true)
  })

  it('ignores the pin states older scrambles end with', () => {
    expect(stateAfter('UR DL UL').isSolved()).toBe(true)
  })

  it('rejects moves from other puzzles', () => {
    for (const alg of ['R', 'UR2', 'X3+', 'y', "R'", '/', 'R++'])
      expect(() => clock.compile(alg)).toThrow(UnsupportedMoveError)
  })
})

describe('clock matches cubing.js dial for dial', () => {
  let kpuzzle: KPuzzle

  beforeAll(async () => {
    kpuzzle = await puzzles.clock!.kpuzzle()
  })

  it('on WCA scrambles, with and without trailing pins', () => {
    const random = seededRandom(4)
    for (let i = 0; i < 300; i++) {
      const scramble = wcaScramble(random, i % 2 === 0)
      const theirs = kpuzzle.defaultPattern().applyAlg(scramble).patternData
      const ours = stateAfter(scramble)
      expect([scramble, dials(ours)]).toEqual([scramble, theirs.DIALS!.orientation])
      expect([scramble, ours.flipped]).toEqual([scramble, theirs.FRAME!.orientation[0] === 1])
    }
  })
})
