'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { Ban, Ellipsis } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { useFriendActions } from '@/features/friends/model/useFriendActions'
import { FriendActionDialog } from '@/features/friends/ui/FriendActionDialog'

interface Props {
  userId: string
  name: string
}

export function BlockUserMenu({ userId, name }: Props) {
  const t = useTranslations('Index.FriendsPage')
  const { block, pendingId } = useFriendActions()
  const [confirming, setConfirming] = useState(false)

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            size="icon"
            variant="ghost"
            className="size-9"
            aria-label={t('more-actions')}
            disabled={pendingId === userId}
          >
            <Ellipsis className="size-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem variant="destructive" onSelect={() => setConfirming(true)}>
            <Ban className="size-4" />
            {t('block')}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <FriendActionDialog
        friend={confirming ? { _id: userId, name } : null}
        action="block"
        onOpenChange={setConfirming}
        onConfirm={block}
      />
    </>
  )
}
