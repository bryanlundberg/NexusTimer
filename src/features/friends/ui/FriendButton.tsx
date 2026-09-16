'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { Check, ChevronDown, Clock, UserCheck, UserMinus, UserPlus, X } from 'lucide-react'
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
        <div className="flex w-full items-center gap-2 sm:w-auto">
          <Button size="sm" className="flex-1 gap-1.5 sm:flex-none" disabled={busy} onClick={() => add(userId)}>
            <Check className="size-4" />
            {t('accept')}
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="flex-1 gap-1.5 sm:flex-none"
            disabled={busy}
            onClick={() => setConfirming(true)}
          >
            <X className="size-4" />
            {t('decline')}
          </Button>
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
        <span className="hidden sm:inline">{t('add-friend')}</span>
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
            <span className="hidden sm:inline">{isFriend ? t('title') : t('request-sent')}</span>
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
