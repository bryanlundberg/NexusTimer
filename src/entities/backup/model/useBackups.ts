import useSWR from 'swr'
import { fetcher } from '@/shared/lib/fetcher'
import { BackupFile } from './types'

export const useBackups = () => {
  const { data, error, isLoading, mutate } = useSWR<BackupFile[]>('/api/v1/backups', fetcher)

  return {
    backups: data ?? [],
    isLoading,
    isError: error,
    mutate
  }
}
