import useSWR from 'swr'
import { fetcher } from '@/shared/lib/fetcher'
import type { UserStatsSummary } from '@/entities/user-stats/model/types'

export interface UserStatsResponse {
  stats: UserStatsSummary | null
  hidden?: boolean
}

const statsUrl = (userId: string) => `/api/v1/users/${userId}/stats`

export const useUserStats = (userId: string | undefined) => {
  const { data, error, isLoading } = useSWR<UserStatsResponse>(userId ? statsUrl(userId) : null, fetcher)

  return {
    stats: data?.stats ?? null,
    isLoading,
    isError: error
  }
}

async function fetchManyStats([, ...userIds]: string[]): Promise<Record<string, UserStatsSummary | null>> {
  const entries = await Promise.all(
    userIds.map(async (userId) => {
      try {
        const response: UserStatsResponse = await fetcher(statsUrl(userId))
        return [userId, response.stats ?? null] as const
      } catch {
        return [userId, null] as const
      }
    })
  )
  return Object.fromEntries(entries)
}

export const useManyUserStats = (userIds: string[]) => {
  const { data, isLoading } = useSWR(userIds.length ? ['user-stats', ...userIds] : null, fetchManyStats)

  return {
    statsByUser: data ?? {},
    isLoading
  }
}
