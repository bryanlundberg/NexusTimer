import { NextRequest } from 'next/server'
import { z } from 'zod'
import connectDB from '@/shared/config/mongodb/mongodb'
import Solve, { LEADERBOARD_PUZZLES, type LeaderboardPuzzle } from '@/entities/solve/model/solve'
import { leaderboardCache } from '@/entities/solve/model/leaderboard-cache'
import type { SolveServer } from '@/entities/solve/model/types'
import { parseSearchParams } from '@/shared/api/parse-query'
import { ok, serverError } from '@/shared/api/responses'
import { currentHourlyWindow } from '@/shared/lib/hourly-window'

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

type LeaderboardsQuery = z.infer<typeof leaderboardsQuerySchema>

const USER_FIELDS = 'name image country pronoun goal'
const LIMIT = 100

const cacheVariant = (query: LeaderboardsQuery) =>
  [
    query.puzzle ?? 'any',
    query.smart === undefined ? 'any' : String(query.smart),
    query.unique ? 'unique' : 'all'
  ].join(':')

async function readLeaderboards(query: LeaderboardsQuery): Promise<SolveServer[]> {
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

    return (await Solve.populate(bestPerUser, { path: 'user', select: USER_FIELDS })) as unknown as SolveServer[]
  }

  const leaderboards = await Solve.find(filter)
    .sort({ time: 1, createdAt: 1 })
    .limit(LIMIT)
    .populate('user', USER_FIELDS)

  return leaderboards as unknown as SolveServer[]
}

export async function GET(request: NextRequest) {
  try {
    const query = parseSearchParams(request, leaderboardsQuerySchema)
    if (query instanceof Response) return query

    const refreshWindow = currentHourlyWindow()
    const variant = cacheVariant(query)

    const cached = await leaderboardCache.get(refreshWindow.startedAt, variant)
    const solves = cached ?? (await readLeaderboards(query))

    if (!cached) {
      await leaderboardCache.set(refreshWindow.startedAt, variant, solves, refreshWindow.secondsUntilNextRefresh)
    }

    const response = ok({
      solves,
      nextRefreshAt: new Date(refreshWindow.nextRefreshAt).toISOString()
    })

    response.headers.set('Cache-Control', `public, max-age=0, s-maxage=${refreshWindow.secondsUntilNextRefresh}`)

    return response
  } catch (error) {
    return serverError('leaderboards:GET', error)
  }
}
