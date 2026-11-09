import * as z from 'zod'
import { CUBE_CATEGORIES } from './cube-categories'
import { publicUserSchema } from './users'

export const FRIENDS_LEADERBOARD_METRICS = ['single', 'ao5'] as const

export type FriendsLeaderboardMetric = (typeof FRIENDS_LEADERBOARD_METRICS)[number]

export const friendsLeaderboardQuerySchema = z.object({
  category: z.enum(CUBE_CATEGORIES),
  metric: z.enum(FRIENDS_LEADERBOARD_METRICS).default('single')
})

export type FriendsLeaderboardQuery = z.infer<typeof friendsLeaderboardQuerySchema>

export const friendsLeaderboardRowSchema = z.object({
  user: publicUserSchema,
  time: z.number(),
  count: z.number(),
  achievedAt: z.string().nullable(),
  isSelf: z.boolean()
})

export type FriendsLeaderboardRow = z.infer<typeof friendsLeaderboardRowSchema>

export const friendsLeaderboardResponseSchema = z.object({
  rows: z.array(friendsLeaderboardRowSchema),
  categories: z.array(z.enum(CUBE_CATEGORIES)),
  friendCount: z.number()
})

export type FriendsLeaderboardResponse = z.infer<typeof friendsLeaderboardResponseSchema>
