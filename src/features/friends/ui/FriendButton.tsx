'use client'

import { useTranslations } from 'next-intl'
import { Check, ChevronDown, Clock, UserCheck, UserMinus, UserPlus, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import type { RelationshipStatus } from '@/entities/friendship/model/types'
import { useFriendActions } from '@/features/friends/model/useFriendActions'

interface Props {
  userId: string
  status: RelationshipStatus
}

export function FriendButton({ userId, status }: Props) {
  const t = useTranslations('Index.FriendsPage')
  const { add, remove, pendingId } = useFriendActions()
  const busy = pendingId === userId

  if (status === 'pending_in') {
    return (
      <div className="flex items-center gap-2">
        <Button size="sm" className="gap-1.5" disabled={busy} onClick={() => add(userId)}>
          <Check className="size-4" />
          <span className="hidden sm:inline">{t('accept')}</span>
        </Button>
        <Button size="sm" variant="outline" className="gap-1.5" disabled={busy} onClick={() => remove(userId)}>
          <X className="size-4" />
          <span className="hidden sm:inline">{t('decline')}</span>
        </Button>
      </div>
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

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size="sm" variant="secondary" className="gap-1.5" disabled={busy}>
          {isFriend ? <UserCheck className="size-4" /> : <Clock className="size-4" />}
          <span className="hidden sm:inline">{isFriend ? t('title') : t('request-sent')}</span>
          <ChevronDown className="size-3.5 opacity-60" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem variant="destructive" onClick={() => remove(userId)}>
          {isFriend ? <UserMinus className="size-4" /> : <X className="size-4" />}
          {isFriend ? t('remove-friend') : t('cancel-request')}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
