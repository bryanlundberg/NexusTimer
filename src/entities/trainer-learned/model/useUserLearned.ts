import useSWR from 'swr'
import { fetcher } from '@/shared/lib/fetcher'

export interface LearnedMethod {
  methodSlug: string
  count: number
  caseIds: string[]
}

export interface UserLearnedResponse {
  total: number
  methods: LearnedMethod[]
}

export const useUserLearned = (userId: string) => {
  const { data, error, isLoading, mutate } = useSWR<UserLearnedResponse>(
    userId ? `/api/v1/users/${userId}/learned` : null,
    fetcher
  )

  return {
    data,
    isLoading,
    isError: error,
    mutate
  }
}
