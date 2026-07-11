import { NextRequest } from 'next/server'
import { z } from 'zod'
import connectDB from '@/shared/config/mongodb/mongodb'
import Solve, { LEADERBOARD_PUZZLES, type LeaderboardPuzzle } from '@/entities/solve/model/solve'
import { parseSearchParams } from '@/shared/api/parse-query'
import { ok, serverError } from '@/shared/api/responses'

const leaderboardsQuerySchema = z.object({
  puzzle: z.enum(LEADERBOARD_PUZZLES).optional(),
  smart: z
    .enum(['true', 'false'])
    .transform((value) => value === 'true')
    .optional()
})

export async function GET(request: NextRequest) {
  try {
    const query = parseSearchParams(request, leaderboardsQuerySchema)
    if (query instanceof Response) return query

    await connectDB()

    const filter: { puzzle?: LeaderboardPuzzle; smart?: boolean } = {}
    if (query.puzzle) filter.puzzle = query.puzzle
    if (query.smart !== undefined) filter.smart = query.smart

    const leaderboards = await Solve.find(filter)
      .sort({ time: 1, createdAt: 1 })
      .limit(100)
      .populate('user', 'name image country pronoun goal')

    return ok(leaderboards)
  } catch (error) {
    return serverError('leaderboards:GET', error)
  }
}
