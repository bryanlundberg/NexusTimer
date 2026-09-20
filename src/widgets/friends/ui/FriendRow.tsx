'use client'

import { useLocale, useTranslations } from 'next-intl'
import dayjs from '@/shared/lib/dayjs'
import { UserListRow } from '@/entities/user/ui/UserListRow'
import { usePresenceInView } from '@/features/presence/model/usePresenceInView'
import { usePresenceLabel } from '@/features/presence/model/usePresenceLabel'
import type { FriendUser } from '@/entities/friendship/model/types'

interface Props {
  user: FriendUser
  friendsSince?: string
  actions: React.ReactNode
  stackActions?: boolean
}

export function FriendRow({ user, friendsSince, actions, stackActions = false }: Props) {
  const t = useTranslations('Index.FriendsPage')
  const locale = useLocale()
  const { ref, presence } = usePresenceInView(user._id)
  const presenceLabel = usePresenceLabel(presence)

  const since = friendsSince
    ? t('friends-since', { date: dayjs(friendsSince).locale(locale).format('MMM YYYY') })
    : null
  const meta = [presenceLabel, since].filter(Boolean).join(' · ')

  return (
    <UserListRow
      user={user}
      presence={presence}
      rootRef={ref}
      meta={meta}
      actions={actions}
      stackActions={stackActions}
    />
  )
}
