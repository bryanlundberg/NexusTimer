import * as z from 'zod'
import { replayInputSchema, SCRAMBLE_MAX_LENGTH, solveReplaySchema } from './solves'
import { publicUserSchema } from './users'

export const LEADERBOARD_PUZZLES = ['3x3x3', '2x2x2'] as const

export type LeaderboardPuzzle = (typeof LEADERBOARD_PUZZLES)[number]

export const LEADERBOARD_SIZE = 100

const booleanParam = z.enum(['true', 'false']).transform((value) => value === 'true')

export const leaderboardsQuerySchema = z.object({
  puzzle: z.enum(LEADERBOARD_PUZZLES).optional(),
  smart: booleanParam.optional(),
  unique: booleanParam.optional()
})

export type LeaderboardsQuery = z.infer<typeof leaderboardsQuerySchema>

export const leaderboardSolveSchema = z.object({
  _id: z.string(),
  user: publicUserSchema,
  time: z.number(),
  scramble: z.string(),
  solution: z.string().nullable().optional(),
  puzzle: z.enum(LEADERBOARD_PUZZLES),
  smart: z.boolean(),
  replay: solveReplaySchema.nullable().optional(),
  createdAt: z.string(),
  updatedAt: z.string()
})

export type LeaderboardSolve = z.infer<typeof leaderboardSolveSchema>

export const leaderboardsResponseSchema = z.object({
  solves: z.array(leaderboardSolveSchema),
  nextRefreshAt: z.string()
})

export type LeaderboardsResponse = z.infer<typeof leaderboardsResponseSchema>

export const HOUR_MS = 60 * 60 * 1000

export type HourlyWindow = {
  startedAt: number
  nextRefreshAt: number
  secondsUntilNextRefresh: number
}

export function currentHourlyWindow(now: number = Date.now()): HourlyWindow {
  const startedAt = Math.floor(now / HOUR_MS) * HOUR_MS
  const nextRefreshAt = startedAt + HOUR_MS

  return {
    startedAt,
    nextRefreshAt,
    secondsUntilNextRefresh: Math.max(1, Math.ceil((nextRefreshAt - now) / 1000))
  }
}

const SOLUTION_MAX_LENGTH = 5000

export const submitSolveSchema = z.object({
  time: z.number().finite().nonnegative(),
  scramble: z.string().trim().min(1).max(SCRAMBLE_MAX_LENGTH),
  puzzle: z.enum(LEADERBOARD_PUZZLES),
  smart: z.boolean().optional(),
  solution: z.string().max(SOLUTION_MAX_LENGTH).optional(),
  replay: replayInputSchema.optional()
})

export type SubmitSolveInput = z.infer<typeof submitSolveSchema>
