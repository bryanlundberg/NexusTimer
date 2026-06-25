import { Solve } from '@/entities/solve/model/types'
import { calcAoFromWindow } from './getAoTolerance'

// Current AoX: trimmed mean of the most recent `ao` solves (0 when not enough
// solves or the window is a DNF).
export default function calcCurrentAo(solves: Solve[], ao: number): number {
  if (ao <= 2) return 0
  if (!solves || solves.length < ao) return 0

  return calcAoFromWindow(solves.slice(0, ao), ao)
}
