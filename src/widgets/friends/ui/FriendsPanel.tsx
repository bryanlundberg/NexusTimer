'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { Check, Send, UserMinus, UserPlus, Users, X } from 'lucide-react'
import { Button, buttonVariants } from '@/components/ui/button'
import { Tabs, TabsContent } from '@/components/ui/tabs'
import { cn } from '@/shared/lib/utils'
import { Skeleton } from '@/components/ui/skeleton'
import ScrollableUnderlineTabs from '@/shared/ui/animated-tabs/ScrollableUnderlineTabs'
import { useFriends } from '@/entities/friendship/model/useFriends'
import type { FriendEntry, FriendUser } from '@/entities/friendship/model/types'
import { useFriendActions } from '@/features/friends/model/useFriendActions'
import { useFriendsTab } from '@/features/friends/model/useFriendsTab'
import { FriendActionDialog, type FriendAction } from '@/features/friends/ui/FriendActionDialog'
import { usePresenceList } from '@/features/presence/model/usePresence'
import { FriendsTabs } from '@/widgets/friends/model/types'
import { FriendRow } from '@/widgets/friends/ui/FriendRow'
import { MessageLink } from '@/features/chat/ui/MessageLink'

const TAB_ICONS = {
  [FriendsTabs.FRIENDS]: Users,
  [FriendsTabs.REQUESTS]: UserPlus,
  [FriendsTabs.SENT]: Send
} as const

function FriendTable({ children }: { children: React.ReactNode }) {
  return <section className="overflow-hidden border border-border/60 bg-card/40">{children}</section>
}

function EmptyTable({ message, children }: { message: string; children?: React.ReactNode }) {
  return (
    <FriendTable>
      <div className="flex flex-col items-center gap-3 py-12 text-center">
        <p className="text-sm text-muted-foreground">{message}</p>
        {children}
      </div>
    </FriendTable>
  )
}

export function FriendsPanel() {
  const t = useTranslations('Index.FriendsPage')
  const { data, isLoading } = useFriends()
  const { add, remove, pendingId } = useFriendActions()
  const { value: tab, set: setTab } = useFriendsTab()
  const [confirming, setConfirming] = useState<{ user: FriendUser; action: FriendAction } | null>(null)

  const friendIds = useMemo(() => (data?.friends ?? []).map((entry) => entry.user._id), [data?.friends])
  const presence = usePresenceList(friendIds)

  if (isLoading || !data) {
    return (
      <div className="flex flex-col gap-2">
        {Array.from({ length: 4 }, (_, i) => (
          <Skeleton key={i} className="h-20 w-full" />
        ))}
      </div>
    )
  }

  const renderRows = (
    entries: FriendEntry[],
    actions: (user: FriendUser) => React.ReactNode,
    options: { stackActions?: boolean; showSince?: boolean } = {}
  ) =>
    entries.map(({ user, since }) => (
      <FriendRow
        key={user._id}
        user={user}
        presence={presence[user._id]}
        friendsSince={options.showSince ? since : undefined}
        actions={actions(user)}
        stackActions={options.stackActions}
      />
    ))

  const counts: Record<FriendsTabs, number> = {
    [FriendsTabs.FRIENDS]: data.friends.length,
    [FriendsTabs.REQUESTS]: data.incoming.length,
    [FriendsTabs.SENT]: data.outgoing.length
  }

  const labels: Record<FriendsTabs, string> = {
    [FriendsTabs.FRIENDS]: t('title'),
    [FriendsTabs.REQUESTS]: t('requests'),
    [FriendsTabs.SENT]: t('sent')
  }

  return (
    <Tabs value={tab} onValueChange={(v) => setTab(v as FriendsTabs)} className="flex flex-col gap-4 w-full">
      <ScrollableUnderlineTabs
        items={Object.values(FriendsTabs).map((value) => ({
          value,
          icon: TAB_ICONS[value],
          label: (
            <span className="inline-flex items-center gap-1.5">
              {labels[value]}
              <span className="inline-flex items-center justify-center min-w-[1.125rem] h-[1.125rem] px-1 rounded-full bg-muted text-[10px] font-semibold tabular-nums leading-none text-muted-foreground transition-colors group-data-[state=active]:bg-primary/10 group-data-[state=active]:text-primary">
                {counts[value]}
              </span>
            </span>
          )
        }))}
        activeValue={tab}
        layoutId="friends-tab-indicator"
      />

      <TabsContent value={FriendsTabs.FRIENDS}>
        {data.friends.length === 0 ? (
          <EmptyTable message={t('empty')}>
            <Link
              href="/people"
              className={cn(buttonVariants({ variant: 'ghost', size: 'sm' }), 'btn-notch btn-notch-border')}
            >
              {t('find-cubers')}
            </Link>
          </EmptyTable>
        ) : (
          <FriendTable>
            {renderRows(
              data.friends,
              (user) => (
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
              ),
              { showSince: true }
            )}
          </FriendTable>
        )}
      </TabsContent>

      <TabsContent value={FriendsTabs.REQUESTS}>
        {data.incoming.length === 0 ? (
          <EmptyTable message={t('no-requests')} />
        ) : (
          <FriendTable>
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
              { stackActions: true }
            )}
          </FriendTable>
        )}
      </TabsContent>

      <TabsContent value={FriendsTabs.SENT}>
        {data.outgoing.length === 0 ? (
          <EmptyTable message={t('no-sent')} />
        ) : (
          <FriendTable>
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
              { stackActions: true }
            )}
          </FriendTable>
        )}
      </TabsContent>

      <FriendActionDialog
        friend={confirming?.user ?? null}
        action={confirming?.action ?? 'remove-friend'}
        onOpenChange={(open) => !open && setConfirming(null)}
        onConfirm={remove}
      />
    </Tabs>
  )
}
