import useSWR from 'swr';
import { fetcher } from '@/utils/fetcher';

export const useBackup = (userId: string) => {
  const { data, error, isLoading } = useSWR(`/api/v1/users/${userId}/backup`, fetcher)

  return {
    backup: data,
    isLoading,
    isError: error
  }
}
