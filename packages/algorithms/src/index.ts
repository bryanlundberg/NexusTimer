import { ALGORITHM_SET_DEFINITIONS } from './definitions'

export * from './data/index'
export * from './definitions'
export * from './sets'
export type * from './types'

const CASES_BY_SET = new Map<string, ReadonlySet<string>>(
  ALGORITHM_SET_DEFINITIONS.map((set) => [set.slug, new Set(set.algorithms.map((collection) => collection.id))])
)

export function isAlgorithmSet(slug: string) {
  return CASES_BY_SET.has(slug)
}

export function isAlgorithmCase(slug: string, caseId: string) {
  return CASES_BY_SET.get(slug)?.has(caseId) ?? false
}
