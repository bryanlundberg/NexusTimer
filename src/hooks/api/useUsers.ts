import { fetcher } from '@/utils/fetcher';
import useSWR from 'swr';

export const useUsers = () => {
  const { data, error, isLoading } = useSWR(`/api/v1/users`, fetcher)

  return {
    data,
    isLoading,
    isError: error
  }
}
