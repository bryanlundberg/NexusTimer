import type { SubmitSolveInput } from '@nexustimer/contracts'
import type { SolveLimits } from './solves.limits'
import type { SolvesRepository } from './solves.repository'
import { verifyLeaderboardSolve } from './solves.verify'

const ROTATIONS = new Set(['x', "x'", 'y', "y'", 'z', "z'"])

export function cleanRotations(alg: string): string {
  const result: string[] = []
  let seenNormalMove = false

  for (const move of alg.trim().split(/\s+/)) {
    if (ROTATIONS.has(move)) {
      if (seenNormalMove) result.push(move)
    } else {
      result.push(move)
      seenNormalMove = true
    }
  }

  return result.join(' ')
}

export type SubmitSolveResult = 'stored' | 'rejected' | 'rate-limited'

export type SolvesService = {
  submit(userId: string, input: SubmitSolveInput): Promise<SubmitSolveResult>
}

type SolvesDeps = {
  repository: Pick<SolvesRepository, 'insert'>
  limits: SolveLimits
}

export function createSolvesService({ repository, limits }: SolvesDeps): SolvesService {
  return {
    async submit(userId, input) {
      if (!(await limits.consume(userId))) return 'rate-limited'
      if (!verifyLeaderboardSolve(input)) return 'rejected'

      const { time, scramble, puzzle, smart, solution, replay } = input
      await repository.insert({
        userId,
        time,
        scramble,
        solution: solution ? cleanRotations(solution) : null,
        puzzle,
        smart: smart ?? false,
        replay
      })
      return 'stored'
    }
  }
}
