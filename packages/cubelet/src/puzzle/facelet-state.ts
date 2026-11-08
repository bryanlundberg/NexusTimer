import type { FaceletSource } from './facelet-source'
import type { PuzzleState } from './puzzle-definition'

export interface FaceletPermutation<TTurn> {
  readonly turn: TTurn
  readonly targets: Uint16Array
  readonly sources: Uint16Array
}

export class FaceletState<TTurn> implements PuzzleState<FaceletPermutation<TTurn>>, FaceletSource {
  readonly #stickers: Uint16Array

  constructor(
    readonly puzzleId: string,
    readonly stickersPerFace: number,
    stickers: Uint16Array
  ) {
    this.#stickers = stickers
  }

  static solved<TTurn>(puzzleId: string, faceCount: number, stickersPerFace: number): FaceletState<TTurn> {
    const stickers = new Uint16Array(faceCount * stickersPerFace)
    for (let i = 0; i < stickers.length; i++) stickers[i] = i
    return new FaceletState(puzzleId, stickersPerFace, stickers)
  }

  get stickerCount(): number {
    return this.#stickers.length
  }

  stickerAt(position: number): number {
    return this.#stickers[position]!
  }

  colorAt(position: number): number {
    return Math.floor(this.#stickers[position]! / this.stickersPerFace)
  }

  apply(moves: readonly FaceletPermutation<TTurn>[]): FaceletState<TTurn> {
    let current = this.#stickers.slice()
    let next = new Uint16Array(current.length)
    for (const { targets, sources } of moves) {
      next.set(current)
      for (let k = 0; k < targets.length; k++) next[targets[k]!] = current[sources[k]!]!
      const swap = current
      current = next
      next = swap
    }
    return new FaceletState(this.puzzleId, this.stickersPerFace, current)
  }

  isSolved(): boolean {
    for (let start = 0; start < this.#stickers.length; start += this.stickersPerFace) {
      const color = this.colorAt(start)
      for (let i = start + 1; i < start + this.stickersPerFace; i++) if (this.colorAt(i) !== color) return false
    }
    return true
  }

  equals(other: PuzzleState<FaceletPermutation<TTurn>>): boolean {
    if (!(other instanceof FaceletState) || other.puzzleId !== this.puzzleId) return false
    if (other.#stickers.length !== this.#stickers.length) return false
    for (let i = 0; i < this.#stickers.length; i++) if (other.#stickers[i] !== this.#stickers[i]) return false
    return true
  }

  key(): string {
    return String.fromCharCode(...this.#stickers)
  }
}
