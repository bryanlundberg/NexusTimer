'use client'

import { useLocale, useTranslations } from 'next-intl'
import dayjs from '@/shared/lib/dayjs'
import { UserListRow } from '@/entities/user/ui/UserListRow'
import type { PresenceState } from '@/features/presence/model/usePresence'
import type { FriendUser } from '@/entities/friendship/model/types'

interface Props {
  user: FriendUser
  presence?: PresenceState
  friendsSince?: string
  actions: React.ReactNode
  stackActions?: boolean
}

export function FriendRow({ user, presence, friendsSince, actions, stackActions = false }: Props) {
  const t = useTranslations('Index.FriendsPage')
  const locale = useLocale()

  const since = friendsSince
    ? t('friends-since', { date: dayjs(friendsSince).locale(locale).format('MMM YYYY') })
    : null

  return <UserListRow user={user} presence={presence} meta={since} actions={actions} stackActions={stackActions} />
}
