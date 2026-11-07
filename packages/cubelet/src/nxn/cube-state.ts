import type { PuzzleState } from '../puzzle/puzzle-definition'
import type { StickerPermutation } from './sticker-permutation'

export class CubeState implements PuzzleState<StickerPermutation> {
  readonly #stickers: Uint16Array

  constructor(
    readonly size: number,
    stickers: Uint16Array
  ) {
    this.#stickers = stickers
  }

  static solved(size: number): CubeState {
    const stickers = new Uint16Array(6 * size * size)
    for (let i = 0; i < stickers.length; i++) stickers[i] = i
    return new CubeState(size, stickers)
  }

  get stickerCount(): number {
    return this.#stickers.length
  }

  stickerAt(index: number): number {
    return this.#stickers[index]!
  }

  colorAt(index: number): number {
    return Math.floor(this.#stickers[index]! / (this.size * this.size))
  }

  apply(moves: readonly StickerPermutation[]): CubeState {
    let current = this.#stickers.slice()
    let next = new Uint16Array(current.length)
    for (const { targets, sources } of moves) {
      next.set(current)
      for (let k = 0; k < targets.length; k++) next[targets[k]!] = current[sources[k]!]!
      const swap = current
      current = next
      next = swap
    }
    return new CubeState(this.size, current)
  }

  isSolved(): boolean {
    const perFace = this.size * this.size
    for (let face = 0; face < 6; face++) {
      const start = face * perFace
      const color = this.colorAt(start)
      for (let i = start + 1; i < start + perFace; i++) if (this.colorAt(i) !== color) return false
    }
    return true
  }

  equals(other: PuzzleState<StickerPermutation>): boolean {
    if (!(other instanceof CubeState) || other.#stickers.length !== this.#stickers.length) return false
    for (let i = 0; i < this.#stickers.length; i++) if (other.#stickers[i] !== this.#stickers[i]) return false
    return true
  }

  key(): string {
    return String.fromCharCode(...this.#stickers)
  }
}
