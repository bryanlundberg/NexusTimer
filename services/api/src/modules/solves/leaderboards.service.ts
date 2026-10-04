import {
  currentHourlyWindow,
  LEADERBOARD_SIZE,
  type LeaderboardSolve,
  type LeaderboardsQuery,
  type PublicUser
} from '@nexustimer/contracts'
import type { UsersService } from '../users/users.service'
import type { LeaderboardCache } from './leaderboards.cache'
import type { SolveFilter, SolvesRepository, StoredSolve } from './solves.repository'

export type LeaderboardsResult = {
  solves: LeaderboardSolve[]
  nextRefreshAt: string
  secondsUntilNextRefresh: number
}

export type LeaderboardsService = {
  get(query: LeaderboardsQuery): Promise<LeaderboardsResult>
}

type LeaderboardsDeps = {
  solves: Pick<SolvesRepository, 'fastest' | 'fastestPerUser'>
  users: Pick<UsersService, 'publicProfiles'>
  cache: LeaderboardCache
  now?: () => number
}

export function cacheVariant(query: LeaderboardsQuery) {
  return [
    query.puzzle ?? 'any',
    query.smart === undefined ? 'any' : String(query.smart),
    query.unique ? 'unique' : 'all'
  ].join(':')
}

function toLeaderboardSolve(solve: StoredSolve, user: PublicUser): LeaderboardSolve {
  return {
    _id: solve.id,
    user,
    time: solve.time,
    scramble: solve.scramble,
    ...(solve.solution !== undefined ? { solution: solve.solution } : {}),
    puzzle: solve.puzzle,
    smart: solve.smart,
    ...(solve.replay !== undefined ? { replay: solve.replay } : {}),
    createdAt: solve.createdAt.toISOString(),
    updatedAt: solve.updatedAt.toISOString()
  }
}

export function createLeaderboardsService({
  solves,
  users,
  cache,
  now = Date.now
}: LeaderboardsDeps): LeaderboardsService {
  async function read(query: LeaderboardsQuery) {
    const filter: SolveFilter = {}
    if (query.puzzle) filter.puzzle = query.puzzle
    if (query.smart !== undefined) filter.smart = query.smart

    const stored = query.unique
      ? await solves.fastestPerUser(filter, LEADERBOARD_SIZE)
      : await solves.fastest(filter, LEADERBOARD_SIZE)
    const profiles = await users.publicProfiles(stored.map((solve) => solve.userId))

    return stored.flatMap((solve) => {
      const user = profiles.get(solve.userId)
      return user ? [toLeaderboardSolve(solve, user)] : []
    })
  }

  return {
    async get(query) {
      const window = currentHourlyWindow(now())
      const variant = cacheVariant(query)

      const cached = await cache.get(window.startedAt, variant)
      const result = cached ?? (await read(query))
      if (!cached) await cache.set(window.startedAt, variant, result, window.secondsUntilNextRefresh)

      return {
        solves: result,
        nextRefreshAt: new Date(window.nextRefreshAt).toISOString(),
        secondsUntilNextRefresh: window.secondsUntilNextRefresh
      }
    }
  }
}
