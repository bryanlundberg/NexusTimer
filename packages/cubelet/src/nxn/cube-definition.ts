import type { Alg } from '../notation/ast'
import type { PuzzleDefinition } from '../puzzle/puzzle-definition'
import { cubeGeometry } from './cube-geometry'
import { CubeMoveCompiler } from './cube-move-compiler'
import { CubeState } from './cube-state'
import type { StickerPermutation } from './sticker-permutation'

export const MIN_CUBE_SIZE = 2
export const MAX_CUBE_SIZE = 20

export class CubeDefinition implements PuzzleDefinition<StickerPermutation, CubeState> {
  readonly id: string
  #compiler: CubeMoveCompiler | undefined
  #solved: CubeState | undefined

  constructor(readonly size: number) {
    if (!Number.isInteger(size) || size < MIN_CUBE_SIZE || size > MAX_CUBE_SIZE) {
      throw new RangeError(`Cube size must be an integer from ${MIN_CUBE_SIZE} to ${MAX_CUBE_SIZE}`)
    }
    this.id = `${size}x${size}x${size}`
  }

  solved(): CubeState {
    this.#solved ??= CubeState.solved(this.size)
    return this.#solved
  }

  compile(alg: string | Alg): readonly StickerPermutation[] {
    this.#compiler ??= new CubeMoveCompiler(this.id, cubeGeometry(this.size))
    return this.#compiler.compile(alg)
  }
}

const definitions = new Map<number, CubeDefinition>()

export function cube(size: number): CubeDefinition {
  let definition = definitions.get(size)
  if (!definition) {
    definition = new CubeDefinition(size)
    definitions.set(size, definition)
  }
  return definition
}
