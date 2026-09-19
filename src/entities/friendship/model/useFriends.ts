import useSWR from 'swr'
import { useSession } from 'next-auth/react'
import { fetcher } from '@/shared/lib/fetcher'
import type { FriendsResponse, RelationshipResponse } from '@/entities/friendship/model/types'

export const FRIENDS_KEY = '/api/v1/friends'
export const relationshipKey = (userId: string) => `/api/v1/friends/${userId}`

export const useFriends = () => {
  const { data: session } = useSession()
  const { data, error, isLoading, mutate } = useSWR<FriendsResponse>(session?.user?.id ? FRIENDS_KEY : null, fetcher)

  return { data, isLoading, isError: error, mutate }
}

export const useRelationship = (userId: string) => {
  const { data: session } = useSession()
  const myId = session?.user?.id
  const enabled = !!myId && !!userId && myId !== userId

  const { data, error, isLoading, mutate } = useSWR<RelationshipResponse>(
    enabled ? relationshipKey(userId) : null,
    fetcher
  )

  return { data, isLoading, isError: error, mutate }
}
