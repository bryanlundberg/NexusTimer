'use client'

import useSWR from 'swr'
import { fetcher } from '@/shared/lib/fetcher'

interface TrainerLearnedResponse {
  caseIds: string[]
}

export const useTrainerLearned = (methodSlug: string | null | undefined, enabled = true) => {
  const url = enabled && methodSlug ? `/api/v1/trainer/learned?methodSlug=${encodeURIComponent(methodSlug)}` : null

  const { data, error, isLoading, mutate } = useSWR<TrainerLearnedResponse>(url, fetcher)

  return {
    learnedIds: data?.caseIds ?? [],
    isLoading,
    isError: error,
    mutate
  }
}
