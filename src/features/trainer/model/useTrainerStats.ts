'use client'

import useSWR from 'swr'
import { fetcher } from '@/shared/lib/fetcher'
import type { TrainerMethodStatsDoc } from '@/entities/trainer-stats/model/types'

interface TrainerStatsResponse {
  method: string
  stats: TrainerMethodStatsDoc | null
}

export const useTrainerStats = (methodSlug: string | null | undefined, enabled = true) => {
  const url = enabled && methodSlug ? `/api/v1/trainer/stats?method=${encodeURIComponent(methodSlug)}` : null

  const { data, error, isLoading, mutate } = useSWR<TrainerStatsResponse>(url, fetcher)

  return {
    stats: data?.stats ?? null,
    isLoading,
    isError: error,
    mutate
  }
}
