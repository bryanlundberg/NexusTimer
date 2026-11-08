import type { Alg } from '../notation/ast'

export interface PuzzleState<TMove> {
  apply(moves: readonly TMove[]): PuzzleState<TMove>
  isSolved(): boolean
  equals(other: PuzzleState<TMove>): boolean
  key(): string
}

export interface PuzzleDefinition<TMove, TState extends PuzzleState<TMove> = PuzzleState<TMove>> {
  readonly id: string
  solved(): TState
  compile(alg: string | Alg): readonly TMove[]
}

export type AnyPuzzleDefinition = PuzzleDefinition<unknown>
