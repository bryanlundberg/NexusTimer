import useSWR from 'swr'
import { fetcher } from '@/shared/lib/fetcher'

export const useUser = (userId: string) => {
  const { data, error, isLoading, mutate } = useSWR(`/api/v1/users/${userId ? userId : ''}`, fetcher)

  return {
    data,
    isLoading,
    isError: error,
    mutate
  }
}
