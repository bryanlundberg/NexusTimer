import { AlgorithmCollection, Alg } from '@/features/algorithms-list/model/types'
import { ALG_BY_ID, COLLECTION_BY_ID, COLLECTIONS_BY_METHOD, ALL_ALGS } from '@/shared/data/algs/index'

export function findAlgById(id: string): { alg: Alg; collection: AlgorithmCollection } | undefined {
  return ALG_BY_ID.get(id)
}

export function findCollectionById(id: string): AlgorithmCollection | undefined {
  return COLLECTION_BY_ID.get(id)
}

export function getByMethod(idMethod: string): AlgorithmCollection[] {
  return COLLECTIONS_BY_METHOD[idMethod] ?? []
}

export function getByPuzzle(puzzle: string): AlgorithmCollection[] {
  return ALL_ALGS.filter((c) => c.puzzle === puzzle)
}

export function getByGroup(group: string): AlgorithmCollection[] {
  return ALL_ALGS.filter((c) => c.group === group)
}

export function getByTag(tag: string): AlgorithmCollection[] {
  return ALL_ALGS.filter((c) => c.tags?.includes(tag))
}
