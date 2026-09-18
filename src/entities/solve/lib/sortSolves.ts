import { Solve } from '@/entities/solve/model/types'

export function compareNewestFirst(a: Solve, b: Solve): number {
  return b.endTime - a.endTime || b.startTime - a.startTime
}

export function isSortedNewestFirst(solves: Solve[]): boolean {
  for (let i = 1; i < solves.length; i++) {
    if (compareNewestFirst(solves[i - 1], solves[i]) > 0) return false
  }
  return true
}

export function sortSolvesNewestFirst<T extends Solve>(solves: T[]): T[] {
  return isSortedNewestFirst(solves) ? solves : [...solves].sort(compareNewestFirst)
}

function mergeTwo<T extends Solve>(a: T[], b: T[]): T[] {
  const out: T[] = new Array(a.length + b.length)
  let i = 0
  let j = 0
  let k = 0
  while (i < a.length && j < b.length) {
    out[k++] = compareNewestFirst(a[i], b[j]) <= 0 ? a[i++] : b[j++]
  }
  while (i < a.length) out[k++] = a[i++]
  while (j < b.length) out[k++] = b[j++]
  return out
}

export function mergeSolvesNewestFirst<T extends Solve>(lists: T[][]): T[] {
  let queue = lists.filter((list) => list.length > 0).map(sortSolvesNewestFirst)
  if (queue.length === 0) return []
  while (queue.length > 1) {
    const next: T[][] = []
    for (let i = 0; i < queue.length; i += 2) {
      next.push(i + 1 < queue.length ? mergeTwo(queue[i], queue[i + 1]) : queue[i])
    }
    queue = next
  }
  return queue[0]
}
