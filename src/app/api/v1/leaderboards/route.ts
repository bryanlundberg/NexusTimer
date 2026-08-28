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
    .optional(),
  unique: z
    .enum(['true', 'false'])
    .transform((value) => value === 'true')
    .optional()
})

const USER_FIELDS = 'name image country pronoun goal'
const LIMIT = 100

export async function GET(request: NextRequest) {
  try {
    const query = parseSearchParams(request, leaderboardsQuerySchema)
    if (query instanceof Response) return query

    await connectDB()

    const filter: { puzzle?: LeaderboardPuzzle; smart?: boolean } = {}
    if (query.puzzle) filter.puzzle = query.puzzle
    if (query.smart !== undefined) filter.smart = query.smart

    if (query.unique) {
      const bestPerUser = await Solve.aggregate([
        { $match: filter },
        { $sort: { time: 1, createdAt: 1 } },
        { $group: { _id: '$user', solve: { $first: '$$ROOT' } } },
        { $replaceRoot: { newRoot: '$solve' } },
        { $sort: { time: 1, createdAt: 1 } },
        { $limit: LIMIT }
      ])

      return ok(await Solve.populate(bestPerUser, { path: 'user', select: USER_FIELDS }))
    }

    const leaderboards = await Solve.find(filter)
      .sort({ time: 1, createdAt: 1 })
      .limit(LIMIT)
      .populate('user', USER_FIELDS)

    return ok(leaderboards)
  } catch (error) {
    return serverError('leaderboards:GET', error)
  }
}
