export const LEADERBOARD_VIEWS = ['all', 'persons'] as const

export type LeaderboardView = (typeof LEADERBOARD_VIEWS)[number]
