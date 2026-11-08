import type { PuzzleState } from '../puzzle/puzzle-definition'
import { UnsupportedMoveError } from '../puzzle/unsupported-move-error'
import { SQUARE1_SLOTS_PER_LAYER, SQUARE1_WEDGES, isCornerEnd } from './square1-pieces'

export type Square1Move =
  { readonly kind: 'turn'; readonly top: number; readonly bottom: number } | { readonly kind: 'slash' }

const SLICE_LENGTH = SQUARE1_SLOTS_PER_LAYER / 2
const BOTTOM = SQUARE1_SLOTS_PER_LAYER
const CUT_BOUNDARIES: ReadonlyArray<readonly [before: number, after: number]> = [
  [5, 6],
  [11, 0],
  [17, 18],
  [23, 12]
]

const rotateLayer = (from: Uint8Array, to: Uint8Array, start: number, amount: number) => {
  for (let slot = 0; slot < SQUARE1_SLOTS_PER_LAYER; slot++) {
    const source = (((slot - amount) % SQUARE1_SLOTS_PER_LAYER) + SQUARE1_SLOTS_PER_LAYER) % SQUARE1_SLOTS_PER_LAYER
    to[start + slot] = from[start + source]!
  }
}

export class Square1State implements PuzzleState<Square1Move> {
  readonly #wedges: Uint8Array

  constructor(
    wedges: Uint8Array,
    readonly middleFlipped: boolean
  ) {
    this.#wedges = wedges
  }

  static solved(): Square1State {
    return new Square1State(
      Uint8Array.from({ length: SQUARE1_WEDGES }, (_, i) => i),
      false
    )
  }

  wedgeAt(slot: number): number {
    return this.#wedges[slot]!
  }

  canSlash(): boolean {
    return CUT_BOUNDARIES.every(
      ([before, after]) => !isCornerEnd(this.#wedges[after]!) || this.#wedges[before] !== this.#wedges[after]! - 1
    )
  }

  apply(moves: readonly Square1Move[]): Square1State {
    let wedges = this.#wedges.slice()
    let flipped = this.middleFlipped
    for (const move of moves) {
      const next = new Uint8Array(SQUARE1_WEDGES)
      if (move.kind === 'turn') {
        rotateLayer(wedges, next, 0, move.top)
        rotateLayer(wedges, next, BOTTOM, move.bottom)
      } else {
        if (!new Square1State(wedges, flipped).canSlash()) throw new UnsupportedMoveError('square1', '/')
        next.set(wedges)
        for (let k = 0; k < SLICE_LENGTH; k++) {
          next[SLICE_LENGTH + k] = wedges[BOTTOM + k]!
          next[BOTTOM + k] = wedges[SLICE_LENGTH + k]!
        }
        flipped = !flipped
      }
      wedges = next
    }
    return new Square1State(wedges, flipped)
  }

  isSolved(): boolean {
    return !this.middleFlipped && this.#wedges.every((wedge, slot) => wedge === slot)
  }

  equals(other: PuzzleState<Square1Move>): boolean {
    return other instanceof Square1State && other.key() === this.key()
  }

  key(): string {
    return String.fromCharCode(...this.#wedges) + (this.middleFlipped ? '1' : '0')
  }
}
