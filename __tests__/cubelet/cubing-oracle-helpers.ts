import type { KPattern, KPuzzle, KTransformation } from '@rednaxela101/cubing/kpuzzle'
import { ALGORITHM_SET_DEFINITIONS } from '@nexustimer/algorithms'

export const seededRandom = (seed: number) => () => {
  seed = (seed + 0x6d2b79f5) | 0
  let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296
}

const patternKey = (pattern: KPattern): string =>
  JSON.stringify(
    Object.entries(pattern.patternData)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([orbit, data]) => [orbit, data.pieces, orbit.includes('CENTER') ? null : data.orientation])
  )

export class CubingOracle {
  readonly #transformations = new Map<string, KTransformation | null>()

  constructor(private readonly kpuzzle: KPuzzle) {}

  accepts(token: string): boolean {
    return this.#transformation(token) !== null
  }

  key(word: readonly string[]): string {
    let transformation = this.kpuzzle.identityTransformation()
    for (const token of word) transformation = transformation.applyTransformation(this.#transformation(token)!)
    return patternKey(this.kpuzzle.defaultPattern().applyTransformation(transformation))
  }

  keyOfAlg(alg: string): string | null {
    try {
      return patternKey(this.kpuzzle.defaultPattern().applyAlg(alg))
    } catch {
      return null
    }
  }

  #transformation(token: string): KTransformation | null {
    if (!this.#transformations.has(token)) {
      try {
        this.#transformations.set(token, this.kpuzzle.algToTransformation(token))
      } catch {
        this.#transformations.set(token, null)
      }
    }
    return this.#transformations.get(token)!
  }
}

export interface Classified {
  readonly label: string
  readonly ours: string
  readonly theirs: string
}

export const expectSamePartition = (entries: readonly Classified[]) => {
  const forward = new Map<string, Classified>()
  const backward = new Map<string, Classified>()
  const conflicts: string[] = []
  for (const entry of entries) {
    const sameOurs = forward.get(entry.ours)
    const sameTheirs = backward.get(entry.theirs)
    if (sameOurs && sameOurs.theirs !== entry.theirs) conflicts.push(`${entry.label} vs ${sameOurs.label}`)
    if (sameTheirs && sameTheirs.ours !== entry.ours) conflicts.push(`${entry.label} vs ${sameTheirs.label}`)
    forward.set(entry.ours, entry)
    backward.set(entry.theirs, entry)
  }
  expect(conflicts).toEqual([])
}

export const datasetAlgs = (puzzle: string): string[] =>
  ALGORITHM_SET_DEFINITIONS.filter((set) => set.puzzle === puzzle).flatMap((set) =>
    set.algorithms.flatMap((collection) => [
      ...collection.algs.map((alg) => alg.moves),
      ...(collection.setup ? [collection.setup] : [])
    ])
  )
