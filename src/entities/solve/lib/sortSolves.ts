import { orderBy } from 'es-toolkit'
import { Solve } from '@/entities/solve/model/types'

export function sortSolvesNewestFirst<T extends Solve>(solves: T[]): T[] {
  return orderBy(solves, ['endTime', 'startTime'], ['desc', 'desc'])
}
