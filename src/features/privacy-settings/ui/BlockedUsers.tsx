'use client'

import { useLocale, useTranslations } from 'next-intl'
import { UserX } from 'lucide-react'
import dayjs from '@/shared/lib/dayjs'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { useBlocks } from '@/entities/block/model/useBlocks'
import { UserListRow } from '@/entities/user/ui/UserListRow'
import { useFriendActions } from '@/features/friends/model/useFriendActions'

export function BlockedUsers() {
  const t = useTranslations('Index.PrivacyPage')
  const tFriends = useTranslations('Index.FriendsPage')
  const locale = useLocale()
  const { data, isLoading } = useBlocks()
  const { unblock, pendingId } = useFriendActions()

  if (isLoading || !data) return <Skeleton className="h-16 w-full" />

  if (data.blocked.length === 0) {
    return (
      <div className="border border-border/60 bg-card/40 px-4 py-8 text-center text-sm text-muted-foreground">
        {t('no-blocked')}
      </div>
    )
  }

  return (
    <section className="overflow-hidden border border-border/60 bg-card/40">
      {data.blocked.map(({ user, since }) => (
        <UserListRow
          key={user._id}
          user={user}
          meta={t('blocked-since', { date: dayjs(since).locale(locale).format('D MMM YYYY') })}
          actions={
            <Button
              size="sm"
              variant="ghost"
              className="h-8 gap-1.5 text-muted-foreground"
              disabled={pendingId === user._id}
              onClick={() => unblock(user._id)}
            >
              <UserX className="size-3.5" />
              {tFriends('unblock')}
            </Button>
          }
        />
      ))}
    </section>
  )
}
