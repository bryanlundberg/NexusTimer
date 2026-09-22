import useSWR from 'swr'
import type { SharedSolveDetail } from '@/entities/shared-solve/model/types'

const detailFetcher = async (url: string): Promise<SharedSolveDetail | null> => {
  const res = await fetch(url)
  if (res.status === 404) return null
  if (!res.ok) throw new Error(`Failed to load shared solve (${res.status})`)
  return res.json()
}

export const sharedSolveKey = (slug: string) => `/api/v1/shared-solves/${slug}`

export const useSharedSolve = (slug: string) => {
  const { data, error, isLoading, mutate } = useSWR<SharedSolveDetail | null>(
    slug ? sharedSolveKey(slug) : null,
    detailFetcher
  )

  return { data, isLoading, isError: error, mutate }
}
