import useSWR from 'swr'
import { useSession } from 'next-auth/react'
import { fetcher } from '@/shared/lib/fetcher'
import type { FriendEntry } from '@/entities/friendship/model/types'

export const BLOCKS_KEY = '/api/v1/blocks'
export const blockKey = (userId: string) => `${BLOCKS_KEY}/${userId}`

export const useBlocks = () => {
  const { data: session } = useSession()
  const { data, error, isLoading, mutate } = useSWR<{ blocked: FriendEntry[] }>(
    session?.user?.id ? BLOCKS_KEY : null,
    fetcher
  )

  return { data, isLoading, isError: error, mutate }
}
