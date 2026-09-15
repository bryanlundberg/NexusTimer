'use client'

import { useMemo } from 'react'
import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { Check, UserMinus, X } from 'lucide-react'
import { Button, buttonVariants } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { useFriends } from '@/entities/friendship/model/useFriends'
import type { FriendEntry } from '@/entities/friendship/model/types'
import { useFriendActions } from '@/features/friends/model/useFriendActions'
import { usePresenceList } from '@/features/presence/model/usePresence'
import { FriendRow } from '@/widgets/friends/ui/FriendRow'

function Section({ title, count, children }: { title: string; count: number; children: React.ReactNode }) {
  return (
    <section className="overflow-hidden border border-border/60 bg-card/40">
      <div className="flex items-center gap-2 px-3 py-2 border-b border-border/60 bg-muted/30">
        <span className="font-display text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
          {title}
        </span>
        <span className="inline-flex items-center justify-center min-w-[1.125rem] h-[1.125rem] px-1 rounded-full bg-muted text-[10px] font-semibold tabular-nums leading-none text-muted-foreground">
          {count}
        </span>
      </div>
      {children}
    </section>
  )
}

export function FriendsPanel() {
  const t = useTranslations('Index.FriendsPage')
  const { data, isLoading } = useFriends()
  const { add, remove, pendingId } = useFriendActions()

  const friendIds = useMemo(() => (data?.friends ?? []).map((entry) => entry.user._id), [data?.friends])
  const presence = usePresenceList(friendIds)

  if (isLoading || !data) {
    return (
      <div className="flex flex-col gap-2">
        {Array.from({ length: 4 }, (_, i) => (
          <Skeleton key={i} className="h-14 w-full" />
        ))}
      </div>
    )
  }

  const renderRows = (entries: FriendEntry[], actions: (userId: string) => React.ReactNode) =>
    entries.map(({ user }) => (
      <FriendRow key={user._id} user={user} presence={presence[user._id]} actions={actions(user._id)} />
    ))

  return (
    <div className="flex flex-col gap-4">
      {data.incoming.length > 0 && (
        <Section title={t('requests')} count={data.incoming.length}>
          {renderRows(data.incoming, (userId) => (
            <>
              <Button size="sm" className="gap-1.5 h-8" disabled={pendingId === userId} onClick={() => add(userId)}>
                <Check className="size-3.5" />
                <span className="hidden sm:inline">{t('accept')}</span>
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="gap-1.5 h-8"
                disabled={pendingId === userId}
                onClick={() => remove(userId)}
              >
                <X className="size-3.5" />
                <span className="hidden sm:inline">{t('decline')}</span>
              </Button>
            </>
          ))}
        </Section>
      )}

      <Section title={t('title')} count={data.friends.length}>
        {data.friends.length === 0 ? (
          <div className="flex flex-col items-center gap-3 py-12 text-center">
            <p className="text-sm text-muted-foreground">{t('empty')}</p>
            <Link href="/people" className={buttonVariants({ variant: 'outline', size: 'sm' })}>
              {t('find-cubers')}
            </Link>
          </div>
        ) : (
          renderRows(data.friends, (userId) => (
            <Button
              size="sm"
              variant="ghost"
              className="gap-1.5 h-8 text-muted-foreground"
              disabled={pendingId === userId}
              onClick={() => remove(userId)}
            >
              <UserMinus className="size-3.5" />
              <span className="hidden sm:inline">{t('remove-friend')}</span>
            </Button>
          ))
        )}
      </Section>

      {data.outgoing.length > 0 && (
        <Section title={t('sent')} count={data.outgoing.length}>
          {renderRows(data.outgoing, (userId) => (
            <Button
              size="sm"
              variant="ghost"
              className="gap-1.5 h-8 text-muted-foreground"
              disabled={pendingId === userId}
              onClick={() => remove(userId)}
            >
              <X className="size-3.5" />
              <span className="hidden sm:inline">{t('cancel-request')}</span>
            </Button>
          ))}
        </Section>
      )}
    </div>
  )
}
