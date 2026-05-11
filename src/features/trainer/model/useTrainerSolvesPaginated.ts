'use client'

import useSWRInfinite from 'swr/infinite'
import { fetcher } from '@/shared/lib/fetcher'
import type { TrainerSolveListItem } from '@/features/trainer/model/useTrainerSolves'

interface ListResponse {
  solves: TrainerSolveListItem[]
}

const PAGE_SIZE = 25

export const useTrainerSolvesPaginated = (
  methodSlug: string | null | undefined,
  caseId: string | null | undefined,
  enabled = true
) => {
  const getKey = (pageIndex: number, previousPageData: ListResponse | null) => {
    if (!enabled || !methodSlug) return null
    if (previousPageData && previousPageData.solves.length < PAGE_SIZE) return null

    const params = new URLSearchParams()
    params.set('methodSlug', methodSlug)
    if (caseId) params.set('caseId', caseId)
    params.set('limit', String(PAGE_SIZE))

    if (pageIndex > 0 && previousPageData) {
      const last = previousPageData.solves[previousPageData.solves.length - 1]
      if (!last) return null
      params.set('before', last._id)
    }

    return `/api/v1/trainer/solves?${params.toString()}`
  }

  const { data, error, isLoading, isValidating, size, setSize, mutate } = useSWRInfinite<ListResponse>(
    getKey,
    fetcher,
    { revalidateFirstPage: true }
  )

  const solves = data ? data.flatMap((p) => p.solves) : []
  const lastPage = data?.[data.length - 1]
  const reachedEnd = !!lastPage && lastPage.solves.length < PAGE_SIZE
  const isLoadingMore = isValidating && size > (data?.length ?? 0)

  return {
    solves,
    isLoading,
    isLoadingMore,
    isError: error,
    reachedEnd,
    loadMore: () => setSize(size + 1),
    mutate
  }
}
