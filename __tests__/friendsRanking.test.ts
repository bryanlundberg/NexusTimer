const { userFind, statsFind, getFriendIds } = vi.hoisted(() => ({
  userFind: vi.fn(),
  statsFind: vi.fn(),
  getFriendIds: vi.fn()
}))

vi.mock('@/entities/user/model/user', () => ({ default: { find: userFind } }))
vi.mock('@/entities/user-stats/model/user-stats', () => ({ default: { find: statsFind } }))
vi.mock('@/entities/friendship/server/friends', () => ({
  FRIEND_USER_PROJECTION: 'name image country wcaId',
  getFriendIds,
  areFriends: vi.fn()
}))

import { getFriendsRanking } from '@/features/friends/server/friends-ranking'
import {
  OVERALL,
  rankedCategories,
  rankFriends,
  type FriendRankingCategory,
  type FriendRankingEntry
} from '@/features/friends/model/friends-ranking'
import { USER_STATS_VERSION } from '@/entities/user-stats/model/types'

const ME = 'a00000000000000000000001'
const ANA = 'a00000000000000000000002'
const LEO = 'a00000000000000000000003'
const EVA = 'a00000000000000000000004'

const category = (overrides: Partial<FriendRankingCategory> = {}): FriendRankingCategory => ({
  category: '3x3',
  count: 10,
  best: null,
  bestAo5: null,
  ...overrides
})

const entry = (name: string, overrides: Partial<FriendRankingEntry> = {}): FriendRankingEntry => ({
  user: { _id: name, name, image: '' },
  isSelf: false,
  updatedAt: 1,
  totalSolves: 0,
  timeSpent: 0,
  longestStreak: 0,
  categories: [],
  ...overrides
})

describe('rankFriends', () => {
  it('ranks times ascending and skips cubers without a value', () => {
    const entries = [
      entry('ana', { categories: [category({ best: 9000 })] }),
      entry('leo', { categories: [category({ best: 7000 })] }),
      entry('eva', { categories: [category({ best: null })] }),
      entry('max', { categories: [category({ category: '2x2', best: 2000 })] })
    ]

    const ranked = rankFriends(entries, { category: '3x3', metric: 'single' })

    expect(ranked.map(({ entry, rank, value }) => [entry.user.name, rank, value])).toEqual([
      ['leo', 1, 7000],
      ['ana', 2, 9000]
    ])
  })

  it('ranks counts descending and gives ties the same rank', () => {
    const entries = [
      entry('ana', { longestStreak: 4 }),
      entry('leo', { longestStreak: 9 }),
      entry('eva', { longestStreak: 4 }),
      entry('max', { longestStreak: 1 }),
      entry('zoe', { longestStreak: 0 })
    ]

    const ranked = rankFriends(entries, { category: OVERALL, metric: 'streak' })

    expect(ranked.map(({ entry, rank }) => [entry.user.name, rank])).toEqual([
      ['leo', 1],
      ['ana', 2],
      ['eva', 2],
      ['max', 4]
    ])
  })

  it('reads the per category solve count and the overall totals', () => {
    const entries = [
      entry('ana', { totalSolves: 50, timeSpent: 900, categories: [category({ count: 5 })] }),
      entry('leo', { totalSolves: 20, timeSpent: 1200, categories: [category({ count: 15 })] })
    ]

    const names = (selection: Parameters<typeof rankFriends>[1]) =>
      rankFriends(entries, selection).map(({ entry }) => entry.user.name)

    expect(names({ category: '3x3', metric: 'solves' })).toEqual(['leo', 'ana'])
    expect(names({ category: OVERALL, metric: 'solves' })).toEqual(['ana', 'leo'])
    expect(names({ category: OVERALL, metric: 'time' })).toEqual(['leo', 'ana'])
  })
})

describe('rankedCategories', () => {
  it('lists categories with solves in canonical order', () => {
    const entries = [
      entry('ana', { categories: [category({ category: 'Pyraminx' }), category({ category: '4x4', count: 0 })] }),
      entry('leo', { categories: [category({ category: '3x3' }), category({ category: '2x2' })] })
    ]

    expect(rankedCategories(entries)).toEqual(['2x2', '3x3', 'Pyraminx'])
  })
})

describe('getFriendsRanking', () => {
  const user = (id: string, statsVisibility: string, updatedAt: number | undefined) => ({
    _id: { toString: () => id },
    name: id,
    image: '',
    privacy: { statsVisibility },
    ...(updatedAt !== undefined && { backup: { updatedAt } })
  })

  const stats = (id: string, backupUpdatedAt: number) => ({
    user: { toString: () => id },
    backupUpdatedAt,
    summary: {
      totalSolves: 12,
      categories: [
        {
          category: '3x3',
          count: 12,
          best: { time: 8000, cubeName: 'Main', endTime: 1 },
          bestAo5: { time: 9500, cubeName: 'Main', endTime: 1, window: [] }
        }
      ],
      achievements: { solveStats: { totalTimeSpent: 120_000, longestDateStreak: 3 } }
    }
  })

  beforeEach(() => {
    getFriendIds.mockResolvedValue([ANA, LEO, EVA])
    userFind.mockReturnValue({
      select: () => ({
        lean: async () => [
          user(ME, 'nobody', 10),
          user(ANA, 'friends', 20),
          user(LEO, 'nobody', 30),
          user(EVA, 'everyone', 41)
        ]
      })
    })
    statsFind.mockReturnValue({
      lean: async () => [stats(ME, 10), stats(ANA, 20), stats(LEO, 30), stats(EVA, 40)]
    })
  })

  it('keeps visible friends with a current backup and always the viewer', async () => {
    const ranking = await getFriendsRanking(ME)

    expect(ranking.friendCount).toBe(3)
    expect(ranking.entries.map(({ user, isSelf }) => [user._id, isSelf])).toEqual([
      [ME, true],
      [ANA, false]
    ])
    expect(statsFind.mock.calls[0][0]).toEqual({ user: { $in: [ME, ANA, LEO, EVA] }, version: USER_STATS_VERSION })
  })

  it('trims the summary and never returns privacy or backup fields', async () => {
    const [, ana] = (await getFriendsRanking(ME)).entries

    expect(ana).toEqual({
      user: { _id: ANA, name: ANA, image: '' },
      isSelf: false,
      updatedAt: 20,
      totalSolves: 12,
      timeSpent: 120_000,
      longestStreak: 3,
      categories: [{ category: '3x3', count: 12, best: 8000, bestAo5: 9500 }]
    })
  })
})
