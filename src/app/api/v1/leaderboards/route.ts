import { NextRequest } from 'next/server'
import { z } from 'zod'
import connectDB from '@/shared/config/mongodb/mongodb'
import Solve, { LEADERBOARD_PUZZLES } from '@/entities/solve/model/solve'
import { parseSearchParams } from '@/shared/api/parse-query'
import { ok, serverError } from '@/shared/api/responses'

const leaderboardsQuerySchema = z.object({
  puzzle: z.enum(LEADERBOARD_PUZZLES).optional()
})

export async function GET(request: NextRequest) {
  try {
    const query = parseSearchParams(request, leaderboardsQuerySchema)
    if (query instanceof Response) return query

    await connectDB()

    const filter: Record<string, string> = {}
    if (query.puzzle) filter.puzzle = query.puzzle

    const leaderboards = await Solve.find(filter).sort({ time: 1, createdAt: 1 }).limit(100).populate('user')

    return ok(leaderboards)
  } catch (error) {
    return serverError('leaderboards:GET', error)
  }
}
