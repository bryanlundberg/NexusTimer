import { requestTransition } from '@/shared/lib/timer/cubeSolverClient'
import { cleanMoves } from '@/features/trainer/lib/trainerUtils'

export function computeTransition(history: string, nextSetup: string, goal: string): Promise<string | null> {
  return requestTransition(cleanMoves(history), cleanMoves(nextSetup), goal)
}
