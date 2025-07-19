import useSWR from 'swr';
import { fetcher } from '@/utils/fetcher';

export const useBackups = () => {
  const { data, error, isLoading } = useSWR(`/api/v1/backups`, fetcher)

  return {
    backups: data,
    isLoading,
    isError: error
  }
}
