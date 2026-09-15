import { useState } from 'react'
import { useSWRConfig } from 'swr'
import { toast } from 'sonner'
import { useTranslations } from 'next-intl'
import { apiDelete, apiPost } from '@/shared/api/client'
import { FRIENDS_KEY, relationshipKey } from '@/entities/friendship/model/useFriends'

export function useFriendActions() {
  const t = useTranslations('Index.FriendsPage')
  const { mutate } = useSWRConfig()
  const [pendingId, setPendingId] = useState<string | null>(null)

  const run = async (userId: string, action: () => Promise<unknown>) => {
    setPendingId(userId)
    try {
      await action()
      await Promise.all([mutate(FRIENDS_KEY), mutate(relationshipKey(userId))])
    } catch {
      toast.error(t('action-failed'))
    } finally {
      setPendingId(null)
    }
  }

  return {
    pendingId,
    /** Sends a request, or accepts one the other user already sent. */
    add: (userId: string) => run(userId, () => apiPost(FRIENDS_KEY, { userId })),
    remove: (userId: string) => run(userId, () => apiDelete(relationshipKey(userId)))
  }
}
