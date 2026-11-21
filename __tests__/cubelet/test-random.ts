import { ALGORITHM_SET_DEFINITIONS } from '@nexustimer/algorithms'

export const seededRandom = (seed: number) => () => {
  seed = (seed + 0x6d2b79f5) | 0
  let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296
}

export const randomWord = (tokens: readonly string[], random: () => number, length: number): string =>
  Array.from({ length }, () => tokens[Math.floor(random() * tokens.length)]!).join(' ')

export const datasetAlgs = (puzzle: string): string[] =>
  ALGORITHM_SET_DEFINITIONS.filter((set) => set.puzzle === puzzle).flatMap((set) =>
    set.algorithms.flatMap((collection) => [
      ...collection.algs.map((alg) => alg.moves),
      ...(collection.setup ? [collection.setup] : [])
    ])
  )
