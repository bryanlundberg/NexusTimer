'use client'

import useSWRInfinite from 'swr/infinite'
import { fetcher } from '@/shared/lib/fetcher'
import type { SharedSolvesPage } from '@/entities/shared-solve/model/types'

export const userSharedSolvesKeyPrefix = (userId: string) => `/api/v1/users/${userId}/shared-solves`

export const useUserSharedSolves = (userId: string | null | undefined) => {
  const getKey = (pageIndex: number, previousPageData: SharedSolvesPage | null) => {
    if (!userId) return null
    const base = userSharedSolvesKeyPrefix(userId)
    if (pageIndex === 0) return base
    if (!previousPageData?.nextCursor) return null
    return `${base}?cursor=${previousPageData.nextCursor}`
  }

  const { data, error, isLoading, isValidating, size, setSize, mutate } = useSWRInfinite<SharedSolvesPage>(
    getKey,
    fetcher,
    { revalidateFirstPage: true }
  )

  const items = data ? data.flatMap((page) => page.items ?? []) : []
  const lastPage = data?.[data.length - 1]
  const reachedEnd = !!lastPage && !lastPage.nextCursor
  const isLoadingMore = isValidating && size > (data?.length ?? 0)

  return {
    items,
    total: data?.[0]?.total ?? 0,
    isLoading,
    isLoadingMore,
    isError: error,
    reachedEnd,
    loadMore: () => setSize(size + 1),
    mutate
  }
}
