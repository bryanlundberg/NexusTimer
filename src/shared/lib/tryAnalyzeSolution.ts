import { analyzeSolution } from 'cube-state-engine'
import type { ReplayMove } from '@/entities/replay/model/types'

export function tryAnalyzeSolution(moves: ReplayMove[]) {
  if (!moves.length) return null
  try {
    return analyzeSolution(moves)
  } catch {
    return null
  }
}
