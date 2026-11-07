import type { Alg } from '../notation/ast'
import { expandAlg } from '../notation/expand'
import { formatMove } from '../notation/format'
import { parseAlg } from '../notation/parse'
import { UnsupportedMoveError } from '../puzzle/unsupported-move-error'
import { BoundedCache } from '../shared/bounded-cache'
import type { CubeGeometry } from './cube-geometry'
import { resolveLayerTurn, type LayerTurn } from './layer-turn'
import { buildStickerPermutation, type StickerPermutation } from './sticker-permutation'

const turnKey = ({ axis, from, to, animationQuarterTurns }: LayerTurn): string =>
  `${axis}:${from}:${to}:${animationQuarterTurns}`

export class CubeMoveCompiler {
  readonly #permutations = new Map<string, StickerPermutation>()
  readonly #compiledAlgs = new BoundedCache<string, readonly StickerPermutation[]>(256)

  constructor(
    private readonly puzzleId: string,
    private readonly geometry: CubeGeometry
  ) {}

  compile(alg: string | Alg): readonly StickerPermutation[] {
    if (typeof alg !== 'string') return this.#compileNodes(alg)
    const cached = this.#compiledAlgs.get(alg)
    if (cached) return cached
    const compiled = this.#compileNodes(parseAlg(alg))
    this.#compiledAlgs.set(alg, compiled)
    return compiled
  }

  #compileNodes(alg: Alg): readonly StickerPermutation[] {
    return expandAlg(alg).map((node) => {
      if (node.kind !== 'move') throw new UnsupportedMoveError(this.puzzleId, node.kind === 'slash' ? '/' : '(x, y)')
      const turn = resolveLayerTurn(node, this.geometry.size)
      if (!turn) throw new UnsupportedMoveError(this.puzzleId, formatMove(node))
      return this.#permutation(turn)
    })
  }

  #permutation(turn: LayerTurn): StickerPermutation {
    const key = turnKey(turn)
    let permutation = this.#permutations.get(key)
    if (!permutation) {
      permutation = buildStickerPermutation(this.geometry, turn)
      this.#permutations.set(key, permutation)
    }
    return permutation
  }
}
