'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { Check, ChevronDown, Clock, UserCheck, UserMinus, UserPlus, UserRoundPlus, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import type { RelationshipStatus } from '@/entities/friendship/model/types'
import { useFriendActions } from '@/features/friends/model/useFriendActions'
import { FriendActionDialog } from '@/features/friends/ui/FriendActionDialog'

interface Props {
  userId: string
  name: string
  status: RelationshipStatus
}

export function FriendButton({ userId, name, status }: Props) {
  const t = useTranslations('Index.FriendsPage')
  const { add, remove, pendingId } = useFriendActions()
  const [confirming, setConfirming] = useState(false)
  const busy = pendingId === userId

  if (status === 'pending_in') {
    return (
      <>
        <div className="panel-notch-bl-tr flex w-full flex-col gap-3 p-3.5 sm:w-auto sm:max-w-xs">
          <div className="flex items-center gap-2.5">
            <UserRoundPlus className="size-5 shrink-0" />
            <div className="flex min-w-0 flex-col gap-1">
              <span className="font-display text-[10px] font-semibold tracking-[0.14em] text-muted-foreground uppercase">
                {t('request-label')}
              </span>
              <p className="text-sm leading-snug">{t('request-received', { name })}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              className="btn-notch btn-notch-border flex-1 gap-1.5"
              disabled={busy}
              onClick={() => setConfirming(true)}
            >
              <X className="size-4" />
              {t('decline')}
            </Button>
            <Button size="sm" className="btn-notch flex-1 gap-1.5" disabled={busy} onClick={() => add(userId)}>
              <Check className="size-4" />
              {t('accept')}
            </Button>
          </div>
        </div>

        <FriendActionDialog
          friend={confirming ? { _id: userId, name } : null}
          action="decline"
          onOpenChange={setConfirming}
          onConfirm={remove}
        />
      </>
    )
  }

  if (status === 'none') {
    return (
      <Button size="sm" className="gap-1.5" disabled={busy} onClick={() => add(userId)}>
        <UserPlus className="size-4" />
        {t('add-friend')}
      </Button>
    )
  }

  const isFriend = status === 'friends'
  const action = isFriend ? 'remove-friend' : 'cancel-request'

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button size="sm" variant="secondary" className="gap-1.5" disabled={busy}>
            {isFriend ? <UserCheck className="size-4" /> : <Clock className="size-4" />}
            <span>{isFriend ? t('title') : t('request-sent')}</span>
            <ChevronDown className="size-3.5 opacity-60" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem variant="destructive" onSelect={() => setConfirming(true)}>
            {isFriend ? <UserMinus className="size-4" /> : <X className="size-4" />}
            {t(action)}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <FriendActionDialog
        friend={confirming ? { _id: userId, name } : null}
        action={action}
        onOpenChange={setConfirming}
        onConfirm={remove}
      />
    </>
  )
}
