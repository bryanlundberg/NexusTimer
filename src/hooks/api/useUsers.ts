import useSWR from 'swr';
import { fetcher } from '@/utils/fetcher';

export const useUsers = () => {
  const { data, error, isLoading } = useSWR(`/api/v1/users`, fetcher)

  return {
    user: data,
    isLoading,
    isError: error
  }
}
