import { Alg } from 'cubing/alg'
import { solveTasks } from '@/shared/lib/timer/genSolution'
import { cleanMoves } from '@/features/trainer/lib/trainerUtils'

const invertMoves = (moves: string): string => {
  try {
    return new Alg(moves).invert().toString()
  } catch {
    return moves
  }
}

/**
 * Direct maneuver that takes the cube from its CURRENT state A (reached from
 * solved by `history`) straight to the NEXT case B (solved + `nextSetup`),
 * WITHOUT routing through the solved state.
 */
export async function computeTransition(history: string, nextSetup: string): Promise<string> {
  const hist = cleanMoves(history)
  const setup = cleanMoves(nextSetup)

  const relative = [hist ? invertMoves(hist) : '', setup].filter(Boolean).join(' ').trim()
  if (!relative) return ''

  const [solution] = await solveTasks([{ scramble: relative, type: 'kociemba' }])
  const u = (solution ?? '').trim()

  const t = u ? invertMoves(u) : ''
  return cleanMoves(t)
}
