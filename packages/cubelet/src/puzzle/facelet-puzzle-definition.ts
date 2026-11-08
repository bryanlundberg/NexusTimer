import type { Alg } from '../notation/ast'
import { FaceletMoveCompiler, type FaceletTurnSystem } from './facelet-move-compiler'
import { FaceletState, type FaceletPermutation } from './facelet-state'
import type { PuzzleDefinition } from './puzzle-definition'

export class FaceletPuzzleDefinition<TTurn> implements PuzzleDefinition<
  FaceletPermutation<TTurn>,
  FaceletState<TTurn>
> {
  #compiler: FaceletMoveCompiler<TTurn> | undefined
  #solved: FaceletState<TTurn> | undefined

  constructor(
    readonly id: string,
    readonly faceCount: number,
    readonly stickersPerFace: number,
    private readonly turns: FaceletTurnSystem<TTurn>
  ) {}

  solved(): FaceletState<TTurn> {
    this.#solved ??= FaceletState.solved(this.id, this.faceCount, this.stickersPerFace)
    return this.#solved
  }

  compile(alg: string | Alg): readonly FaceletPermutation<TTurn>[] {
    this.#compiler ??= new FaceletMoveCompiler(this.id, this.turns)
    return this.#compiler.compile(alg)
  }
}
