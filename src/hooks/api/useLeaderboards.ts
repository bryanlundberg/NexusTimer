import useSWR from 'swr';
import { fetcher } from '@/utils/fetcher';

export const useLeaderboards = () => {
  const url = '/api/v1/leaderboards';

  const { data, error, isLoading, mutate } = useSWR(url, fetcher);

  return {
    data,
    isLoading,
    isError: error,
    mutate
  }
}
