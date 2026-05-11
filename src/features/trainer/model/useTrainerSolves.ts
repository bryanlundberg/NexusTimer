'use client'

import useSWR from 'swr'
import { fetcher } from '@/shared/lib/fetcher'
import type { TrainerPenalty } from '@/entities/trainer-solve/model/constants'

export interface TrainerSolveListItem {
  _id: string
  methodSlug: string
  caseId: string
  timeMs: number
  penalty: TrainerPenalty
  createdAt: string
}

interface ListResponse {
  solves: TrainerSolveListItem[]
}

export const useTrainerSolves = (
  methodSlug: string | null | undefined,
  caseId: string | null | undefined,
  enabled = true,
  limit = 12
) => {
  const params = new URLSearchParams()
  if (methodSlug) params.set('methodSlug', methodSlug)
  if (caseId) params.set('caseId', caseId)
  params.set('limit', String(limit))

  const url = enabled && methodSlug ? `/api/v1/trainer/solves?${params.toString()}` : null

  const { data, error, isLoading, mutate } = useSWR<ListResponse>(url, fetcher)

  return {
    solves: data?.solves ?? [],
    isLoading,
    isError: error,
    mutate
  }
}
