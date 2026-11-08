import type { Alg } from '../notation/ast'
import { expandAlg } from '../notation/expand'
import { formatMove } from '../notation/format'
import { parseAlg } from '../notation/parse'
import type { PuzzleDefinition } from '../puzzle/puzzle-definition'
import { UnsupportedMoveError } from '../puzzle/unsupported-move-error'
import { Square1State, type Square1Move } from './square1-state'

const SLASH: Square1Move = Object.freeze({ kind: 'slash' })

class Square1Definition implements PuzzleDefinition<Square1Move, Square1State> {
  readonly id = 'square1'
  readonly #solved = Square1State.solved()

  solved(): Square1State {
    return this.#solved
  }

  compile(alg: string | Alg): readonly Square1Move[] {
    return expandAlg(typeof alg === 'string' ? parseAlg(alg) : alg).map((node): Square1Move => {
      if (node.kind === 'slash') return SLASH
      if (node.kind === 'tuple') return { kind: 'turn', top: node.first, bottom: node.second }
      throw new UnsupportedMoveError(this.id, formatMove(node))
    })
  }
}

export const square1: PuzzleDefinition<Square1Move, Square1State> = new Square1Definition()
