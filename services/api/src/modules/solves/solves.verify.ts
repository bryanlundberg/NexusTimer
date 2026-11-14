import type { SubmitSolveInput } from '@nexustimer/contracts'
import { CubeEngine, type CubeSize } from 'cube-state-engine'

export const PLUS_TWO_MS = 2000
export const CLOCK_TOLERANCE_MS = 1000

const SIZES: Record<SubmitSolveInput['puzzle'], CubeSize> = { '3x3x3': 3, '2x2x2': 2 }

export function verifyLeaderboardSolve({ time, scramble, puzzle, replay }: SubmitSolveInput): boolean {
  if (!replay || replay.moves.length === 0) return false
  if (replay.puzzle !== puzzle || replay.scramble.trim() !== scramble.trim()) return false
  if (time !== replay.durationMs && time !== replay.durationMs + PLUS_TWO_MS) return false

  let previous = 0
  for (const { t } of replay.moves) {
    if (t < previous) return false
    previous = t
  }
  if (Math.abs(replay.durationMs - previous) > CLOCK_TOLERANCE_MS) return false

  const engine = new CubeEngine('', { size: SIZES[puzzle] })
  engine.applyMoves(scramble, { record: false })
  if (engine.isSolved()) return false
  engine.applyMoves(replay.moves.map(({ m }) => m).join(' '), { record: false })
  return engine.isSolved()
}
