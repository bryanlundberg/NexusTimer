import type { PuzzleState } from '../puzzle/puzzle-definition'

export const CLOCK_DIALS_PER_FACE = 9
export const CLOCK_HOURS = 12

export type ClockPin = 'UR' | 'DR' | 'DL' | 'UL' | 'U' | 'R' | 'D' | 'L' | 'ALL'

const FRONT = (...dials: number[]) => dials
const BACK = (...dials: number[]) => dials.map((dial) => CLOCK_DIALS_PER_FACE + dial)

const QUADRANTS: Readonly<Record<'UR' | 'DR' | 'DL' | 'UL', { front: number[]; back: number }>> = {
  UL: { front: FRONT(0, 1, 3, 4), back: BACK(2)[0]! },
  UR: { front: FRONT(1, 2, 4, 5), back: BACK(0)[0]! },
  DL: { front: FRONT(3, 4, 6, 7), back: BACK(8)[0]! },
  DR: { front: FRONT(4, 5, 7, 8), back: BACK(6)[0]! }
}

const PIN_QUADRANTS: Readonly<Record<ClockPin, ReadonlyArray<keyof typeof QUADRANTS>>> = {
  UR: ['UR'],
  DR: ['DR'],
  DL: ['DL'],
  UL: ['UL'],
  U: ['UL', 'UR'],
  R: ['UR', 'DR'],
  D: ['DL', 'DR'],
  L: ['UL', 'DL'],
  ALL: ['UL', 'UR', 'DL', 'DR']
}

export const CLOCK_PINS = Object.keys(PIN_QUADRANTS) as ClockPin[]

const STEPS: Readonly<Record<ClockPin, Int8Array>> = Object.fromEntries(
  CLOCK_PINS.map((pin) => {
    const steps = new Int8Array(2 * CLOCK_DIALS_PER_FACE)
    for (const quadrant of PIN_QUADRANTS[pin]) {
      for (const dial of QUADRANTS[quadrant].front) steps[dial] = 1
      steps[QUADRANTS[quadrant].back] = -1
    }
    return [pin, steps]
  })
) as Record<ClockPin, Int8Array>

export type ClockMove =
  { readonly kind: 'turn'; readonly pin: ClockPin; readonly amount: number } | { readonly kind: 'flip' }

export class ClockState implements PuzzleState<ClockMove> {
  readonly #dials: Uint8Array

  constructor(
    dials: Uint8Array,
    readonly flipped: boolean
  ) {
    this.#dials = dials
  }

  static solved(): ClockState {
    return new ClockState(new Uint8Array(2 * CLOCK_DIALS_PER_FACE), false)
  }

  dialAt(index: number): number {
    return this.#dials[index]!
  }

  apply(moves: readonly ClockMove[]): ClockState {
    const dials = this.#dials.slice()
    let flipped = this.flipped
    for (const move of moves) {
      if (move.kind === 'flip') {
        const front = dials.slice(0, CLOCK_DIALS_PER_FACE)
        dials.copyWithin(0, CLOCK_DIALS_PER_FACE)
        dials.set(front, CLOCK_DIALS_PER_FACE)
        flipped = !flipped
        continue
      }
      const steps = STEPS[move.pin]
      for (let dial = 0; dial < dials.length; dial++) {
        dials[dial] = (((dials[dial]! + move.amount * steps[dial]!) % CLOCK_HOURS) + CLOCK_HOURS) % CLOCK_HOURS
      }
    }
    return new ClockState(dials, flipped)
  }

  isSolved(): boolean {
    return this.#dials.every((dial) => dial === 0)
  }

  equals(other: PuzzleState<ClockMove>): boolean {
    return other instanceof ClockState && other.key() === this.key()
  }

  key(): string {
    return String.fromCharCode(...this.#dials) + (this.flipped ? '1' : '0')
  }
}
