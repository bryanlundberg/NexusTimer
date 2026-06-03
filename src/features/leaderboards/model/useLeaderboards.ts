import useSWR from 'swr'
import { fetcher } from '@/shared/lib/fetcher'

export const useLeaderboards = (puzzle?: string, smart?: boolean) => {
  const params = new URLSearchParams()
  if (puzzle) params.set('puzzle', puzzle)
  if (smart !== undefined) params.set('smart', String(smart))

  const query = params.toString()
  const url = query ? `/api/v1/leaderboards?${query}` : '/api/v1/leaderboards'

  const { data, error, isLoading, mutate } = useSWR(url, fetcher)

  return {
    data,
    isLoading,
    isError: error,
    mutate
  }
}
