import { type LeaderboardPuzzle, REPLAY_MAX_MOVES, type SubmitSolveInput } from '@nexustimer/contracts'
import type { Solve } from '@/entities/solve/model/types'

export const LEADERBOARD_SOLVES_URL = '/api/v1/solves'

interface SubmitLeaderboardSolveParams {
  solve: Solve
  puzzle: LeaderboardPuzzle
  smart: boolean
  solution?: string
}

/** Resolves false only when the server failed; a signed-out user has nothing to store. */
export async function submitLeaderboardSolve({
  solve,
  puzzle,
  smart,
  solution
}: SubmitLeaderboardSolveParams): Promise<boolean> {
  const replay = solve.replay && solve.replay.moves.length <= REPLAY_MAX_MOVES ? solve.replay : undefined
  const body: SubmitSolveInput = {
    time: solve.time,
    scramble: solve.scramble,
    puzzle,
    smart,
    ...(solution ? { solution } : {}),
    ...(replay ? { replay } : {})
  }

  const res = await fetch(LEADERBOARD_SOLVES_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  })
  return res.ok || res.status === 401
}
