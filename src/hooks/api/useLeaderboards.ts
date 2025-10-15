import useSWR from 'swr';
import { fetcher } from '@/utils/fetcher';

export const useLeaderboards = (puzzle?: string) => {
  const url = puzzle ? `/api/v1/leaderboards?puzzle=${encodeURIComponent(puzzle)}` : '/api/v1/leaderboards';

  const { data, error, isLoading, mutate } = useSWR(url, fetcher);

  return {
    data,
    isLoading,
    isError: error,
    mutate
  }
}
