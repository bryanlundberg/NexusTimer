import { useState } from 'react'
import { useSWRConfig } from 'swr'
import { toast } from 'sonner'
import { useTranslations } from 'next-intl'
import { apiDelete, apiPost } from '@/shared/api/client'
import { playSound } from '@/shared/lib/play-sound'
import {
  FRIEND_REQUEST_ERRORS,
  type FriendRequestError,
  type RelationshipStatus
} from '@/entities/friendship/model/types'
import { FRIENDS_KEY, relationshipKey } from '@/entities/friendship/model/useFriends'
import { BLOCKS_KEY, blockKey } from '@/entities/block/model/useBlocks'

const requestErrorOf = (error: unknown): FriendRequestError | null => {
  const message = error instanceof Error ? error.message : ''
  return FRIEND_REQUEST_ERRORS.find((code) => code === message) ?? null
}

export function useFriendActions() {
  const t = useTranslations('Index.FriendsPage')
  const { mutate } = useSWRConfig()
  const [pendingId, setPendingId] = useState<string | null>(null)

  const run = async (userId: string, action: () => Promise<unknown>, extraKeys: string[] = []) => {
    setPendingId(userId)
    try {
      await action()
      return true
    } catch (error) {
      toast.error(t(requestErrorOf(error) ?? 'action-failed'))
      return false
    } finally {
      await Promise.all([FRIENDS_KEY, relationshipKey(userId), ...extraKeys].map((key) => mutate(key)))
      setPendingId(null)
    }
  }

  return {
    pendingId,
    add: (userId: string) =>
      run(userId, async () => {
        const { status } = await apiPost<{ status: RelationshipStatus }>(FRIENDS_KEY, { userId })
        if (status === 'friends') playSound('newFriend')
      }),
    remove: (userId: string) => run(userId, () => apiDelete(relationshipKey(userId))),
    block: (userId: string) => run(userId, () => apiPost(BLOCKS_KEY, { userId }), [BLOCKS_KEY]),
    unblock: (userId: string) => run(userId, () => apiDelete(blockKey(userId)), [BLOCKS_KEY])
  }
}
