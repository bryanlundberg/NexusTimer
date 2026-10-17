import type { TimedMove } from 'cube-state-engine'

const ROTATION_RE = /^[xyz]['2]?$/

export function isRotation(move: string): boolean {
  return ROTATION_RE.test(move)
}

export function countTurns(moves: Array<string | TimedMove>): number {
  let count = 0
  for (const move of moves) {
    if (!isRotation(typeof move === 'string' ? move : move.m)) count++
  }
  return count
}

// Recordings made before the fix started their clock on the first inspection
// rotation, so the first turn sits at the inspection length instead of at 0.
// Those rotations are always at t=0, unlike an algorithm replay opening with one.
export function normalizeReplayMoves(moves: TimedMove[]): TimedMove[] {
  const firstTurn = moves.findIndex((move) => !isRotation(move.m))
  if (firstTurn <= 0) return moves

  const offset = moves[firstTurn].t
  if (offset <= 0) return moves
  for (let i = 0; i < firstTurn; i++) {
    if (moves[i].t !== 0) return moves
  }

  return moves.map((move, i) => (i < firstTurn ? move : { m: move.m, t: Math.max(0, move.t - offset) }))
}
