import { Solve } from '@/entities/solve/model/types'
import { calcAoFromWindow } from './getAoTolerance'

// Consecutive window of `ao` solves that produced the best (lowest) trimmed
// mean, in the same order they appear in `solves`. Null when no window qualifies.
export function findBestAoWindow<T extends Solve>(solves: T[], ao: number): T[] | null {
  if (!solves || solves.length < ao || ao < 3) return null

  let bestAo = Infinity
  let bestWindow: T[] | null = null
  for (let i = 0; i + ao <= solves.length; i++) {
    const window = solves.slice(i, i + ao)
    const windowAo = calcAoFromWindow(window, ao)
    if (windowAo > 0 && windowAo < bestAo) {
      bestAo = windowAo
      bestWindow = window
    }
  }

  return bestWindow
}

export default function calcBestAo(solves: Solve[], ao: number): number {
  if (!solves || solves.length < ao || ao < 3) {
    return 0
  }

  const bestWindow = findBestAoWindow(solves, ao)
  return bestWindow ? calcAoFromWindow(bestWindow, ao) : Infinity
}
