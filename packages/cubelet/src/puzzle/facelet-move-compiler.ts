import type { Alg, MoveNode } from '../notation/ast'
import { expandAlg } from '../notation/expand'
import { formatMove } from '../notation/format'
import { parseAlg } from '../notation/parse'
import { BoundedCache } from '../shared/bounded-cache'
import type { FaceletPermutation } from './facelet-state'
import { UnsupportedMoveError } from './unsupported-move-error'

export interface FaceletTurnSystem<TTurn> {
  resolve(move: MoveNode): TTurn | null
  key(turn: TTurn): string
  permutation(turn: TTurn): FaceletPermutation<TTurn>
}

export class FaceletMoveCompiler<TTurn> {
  readonly #permutations = new Map<string, FaceletPermutation<TTurn>>()
  readonly #compiledAlgs = new BoundedCache<string, readonly FaceletPermutation<TTurn>[]>(256)

  constructor(
    private readonly puzzleId: string,
    private readonly turns: FaceletTurnSystem<TTurn>
  ) {}

  compile(alg: string | Alg): readonly FaceletPermutation<TTurn>[] {
    if (typeof alg !== 'string') return this.#compileNodes(alg)
    const cached = this.#compiledAlgs.get(alg)
    if (cached) return cached
    const compiled = this.#compileNodes(parseAlg(alg))
    this.#compiledAlgs.set(alg, compiled)
    return compiled
  }

  #compileNodes(alg: Alg): readonly FaceletPermutation<TTurn>[] {
    return expandAlg(alg).map((node) => {
      if (node.kind !== 'move') throw new UnsupportedMoveError(this.puzzleId, node.kind === 'slash' ? '/' : '(x, y)')
      const turn = this.turns.resolve(node)
      if (!turn) throw new UnsupportedMoveError(this.puzzleId, formatMove(node))
      return this.#permutation(turn)
    })
  }

  #permutation(turn: TTurn): FaceletPermutation<TTurn> {
    const key = this.turns.key(turn)
    let permutation = this.#permutations.get(key)
    if (!permutation) {
      permutation = this.turns.permutation(turn)
      this.#permutations.set(key, permutation)
    }
    return permutation
  }
}
