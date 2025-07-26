import { fetcher } from '@/utils/fetcher';
import useSWR from 'swr';

export const useUser = (userId: string) => {
  const { data, error, isLoading } = useSWR(`/api/v1/users/${userId}`, fetcher)

  return {
    data,
    isLoading,
    isError: error
  }
}
