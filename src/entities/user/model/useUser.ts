import useSWR from 'swr'
import { fetcher } from '@/shared/lib/fetcher'

export const useUser = (userId: string | undefined) => {
  const { data, error, isLoading, mutate } = useSWR(userId ? `/api/v1/users/${userId}` : null, fetcher)

  return {
    data,
    isLoading,
    isError: error,
    mutate
  }
}
