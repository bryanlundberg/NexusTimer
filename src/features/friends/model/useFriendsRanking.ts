import useSWR from 'swr'
import { useSession } from 'next-auth/react'
import { fetcher } from '@/shared/lib/fetcher'
import type { FriendsRankingResponse } from '@/features/friends/model/friends-ranking'

export const FRIENDS_RANKING_KEY = '/api/v1/friends/ranking'

export const useFriendsRanking = () => {
  const { data: session } = useSession()
  const { data, error, isLoading } = useSWR<FriendsRankingResponse>(
    session?.user?.id ? FRIENDS_RANKING_KEY : null,
    fetcher
  )

  return { data, isLoading, isError: error }
}
