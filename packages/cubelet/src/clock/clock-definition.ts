import type { Alg } from '../notation/ast'
import { expandAlg } from '../notation/expand'
import { formatMove } from '../notation/format'
import { parseAlg } from '../notation/parse'
import type { PuzzleDefinition } from '../puzzle/puzzle-definition'
import { UnsupportedMoveError } from '../puzzle/unsupported-move-error'
import { CLOCK_PINS, ClockState, type ClockMove, type ClockPin } from './clock-state'

const FLIP: ClockMove = Object.freeze({ kind: 'flip' })
const PINS = new Set<string>(CLOCK_PINS)
const PIN_STATES = new Set(['UR', 'DR', 'DL', 'UL'])

class ClockDefinition implements PuzzleDefinition<ClockMove, ClockState> {
  readonly id = 'clock'
  readonly #solved = ClockState.solved()

  solved(): ClockState {
    return this.#solved
  }

  compile(alg: string | Alg): readonly ClockMove[] {
    const moves: ClockMove[] = []
    for (const node of expandAlg(typeof alg === 'string' ? parseAlg(alg) : alg)) {
      if (node.kind !== 'move' || node.innerLayer !== undefined || node.outerLayer !== undefined) {
        throw new UnsupportedMoveError(this.id, node.kind === 'move' ? formatMove(node) : node.kind)
      }
      const pin = node.family.endsWith('+') ? node.family.slice(0, -1) : null
      if (pin !== null && PINS.has(pin)) moves.push({ kind: 'turn', pin: pin as ClockPin, amount: node.amount })
      else if (node.family === 'y' && Math.abs(node.amount) % 4 === 2) moves.push(FLIP)
      else if (!(PIN_STATES.has(node.family) && node.amount === 1))
        throw new UnsupportedMoveError(this.id, formatMove(node))
    }
    return moves
  }
}

export const clock: PuzzleDefinition<ClockMove, ClockState> = new ClockDefinition()
