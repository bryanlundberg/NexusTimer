'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { Check, UserMinus, X } from 'lucide-react'
import { Button, buttonVariants } from '@/components/ui/button'
import { cn } from '@/shared/lib/utils'
import { Skeleton } from '@/components/ui/skeleton'
import { useFriends } from '@/entities/friendship/model/useFriends'
import type { FriendEntry, FriendUser } from '@/entities/friendship/model/types'
import { useFriendActions } from '@/features/friends/model/useFriendActions'
import { FriendActionDialog, type FriendAction } from '@/features/friends/ui/FriendActionDialog'
import { usePresenceList } from '@/features/presence/model/usePresence'
import { FriendRow } from '@/widgets/friends/ui/FriendRow'
import { MessageLink } from '@/features/chat/ui/MessageLink'

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
  const [confirming, setConfirming] = useState<{ user: FriendUser; action: FriendAction } | null>(null)

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

  const renderRows = (entries: FriendEntry[], actions: (user: FriendUser) => React.ReactNode, stackActions = false) =>
    entries.map(({ user }) => (
      <FriendRow
        key={user._id}
        user={user}
        presence={presence[user._id]}
        actions={actions(user)}
        stackActions={stackActions}
      />
    ))

  return (
    <div className="flex flex-col gap-4">
      {data.incoming.length > 0 && (
        <Section title={t('requests')} count={data.incoming.length}>
          {renderRows(
            data.incoming,
            (user) => (
              <>
                <Button
                  size="sm"
                  className="gap-1.5 h-8 max-sm:flex-1"
                  disabled={pendingId === user._id}
                  onClick={() => add(user._id)}
                >
                  <Check className="size-3.5" />
                  {t('accept')}
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="gap-1.5 h-8 max-sm:flex-1"
                  disabled={pendingId === user._id}
                  onClick={() => setConfirming({ user, action: 'decline' })}
                >
                  <X className="size-3.5" />
                  {t('decline')}
                </Button>
              </>
            ),
            true
          )}
        </Section>
      )}

      <Section title={t('title')} count={data.friends.length}>
        {data.friends.length === 0 ? (
          <div className="flex flex-col items-center gap-3 py-12 text-center">
            <p className="text-sm text-muted-foreground">{t('empty')}</p>
            <Link
              href="/people"
              className={cn(buttonVariants({ variant: 'ghost', size: 'sm' }), 'btn-notch btn-notch-border')}
            >
              {t('find-cubers')}
            </Link>
          </div>
        ) : (
          renderRows(data.friends, (user) => (
            <>
              <MessageLink userId={user._id} className="h-8" />
              <Button
                size="sm"
                variant="ghost"
                className="gap-1.5 h-8 text-muted-foreground"
                disabled={pendingId === user._id}
                onClick={() => setConfirming({ user, action: 'remove-friend' })}
              >
                <UserMinus className="size-3.5" />
                <span className="hidden sm:inline">{t('remove-friend')}</span>
              </Button>
            </>
          ))
        )}
      </Section>

      {data.outgoing.length > 0 && (
        <Section title={t('sent')} count={data.outgoing.length}>
          {renderRows(
            data.outgoing,
            (user) => (
              <Button
                size="sm"
                variant="ghost"
                className="gap-1.5 h-8 text-muted-foreground max-sm:flex-1"
                disabled={pendingId === user._id}
                onClick={() => setConfirming({ user, action: 'cancel-request' })}
              >
                <X className="size-3.5" />
                {t('cancel-request')}
              </Button>
            ),
            true
          )}
        </Section>
      )}

      <FriendActionDialog
        friend={confirming?.user ?? null}
        action={confirming?.action ?? 'remove-friend'}
        onOpenChange={(open) => !open && setConfirming(null)}
        onConfirm={remove}
      />
    </div>
  )
}
