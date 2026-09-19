import { useMemo } from 'react'
import { CompareUser } from '@/features/compare-users/model/compare'
import { CUBE_CATEGORIES } from '@/shared/const/cube-categories'
import type { UserStatsSummary } from '@/entities/user-stats/model/types'

interface User {
  _id: string
}

export function useCompareUsersStats(users: User[], statsByUser: Record<string, UserStatsSummary | null>) {
  return useMemo<CompareUser[]>(
    () =>
      users.map((user) => {
        const categories = statsByUser[user._id]?.categories ?? []
        const byCategory = Object.fromEntries(
          CUBE_CATEGORIES.map((category) => {
            const stats = categories.find((entry) => entry.category === category)
            return [
              category,
              { single: stats?.best?.time ?? 0, average: stats?.bestAo5?.time ?? 0, count: stats?.count ?? 0 }
            ]
          })
        )
        return { _id: user._id, ...byCategory } as CompareUser
      }),
    [users, statsByUser]
  )
}
