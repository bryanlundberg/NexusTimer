import type { SubmitSolveInput } from '@nexustimer/contracts'
import type { SolvesRepository } from './solves.repository'

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

export type SolvesService = {
  submit(userId: string, input: SubmitSolveInput): Promise<void>
}

export function createSolvesService({ repository }: { repository: Pick<SolvesRepository, 'insert'> }): SolvesService {
  return {
    async submit(userId, { time, scramble, puzzle, smart, solution, replay }) {
      await repository.insert({
        userId,
        time,
        scramble,
        solution: solution ? cleanRotations(solution) : null,
        puzzle,
        smart: smart ?? false,
        replay: replay ?? null
      })
    }
  }
}
