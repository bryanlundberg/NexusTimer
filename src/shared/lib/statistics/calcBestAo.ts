import { Solve } from '@/entities/solve/model/types'
import { calcAoFromWindow } from './getAoTolerance'

export default function calcBestAo(solves: Solve[], ao: number): number {
  if (!solves || solves.length < ao || ao < 3) {
    return 0
  }

  let bestAo = Infinity
  for (let i = 0; i + ao <= solves.length; i++) {
    const windowAo = calcAoFromWindow(solves.slice(i, i + ao), ao)
    if (windowAo > 0 && windowAo < bestAo) bestAo = windowAo
  }

  return bestAo
}
