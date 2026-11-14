'use client'

import { useTranslations } from 'next-intl'

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { resolvePresenceDisplay, usePresence } from '@/features/presence/model/usePresence'
import { useBackupProgress } from '@/shared/model/backup/useBackupProgress'
import { useIsMobile } from '@/shared/model/use-mobile'
import { NavUserAvatar } from '@/widgets/sidebar/ui/nav-user-avatar'
import { NavUserContent } from '@/widgets/sidebar/ui/nav-user-content'
import { NavUserSheet } from '@/widgets/sidebar/ui/nav-user-sheet'
import { NavUserSheetItem } from '@/widgets/sidebar/ui/nav-user-sheet-item'

export function NavUser({
  user
}: {
  user: {
    id: string
    name: string
    email: string
    avatar: string
  }
}) {
  const tSync = useTranslations('Index.SyncProgress')
  const { percent, remaining, isLast } = useBackupProgress()
  const statusDisplay = resolvePresenceDisplay(usePresence(user.id))
  const isMobile = useIsMobile()
  const initials = user.name.substring(0, 2).toUpperCase()

  const trigger = (
    <button
      type="button"
      aria-label={`${user.name}. ${isLast ? tSync('tooltip-last') : tSync('tooltip', { count: remaining })}`}
      data-testid="header-user-menu"
      className="group relative flex shrink-0 cursor-pointer items-center justify-center rounded-full outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
    >
      <NavUserAvatar
        image={user.avatar}
        initials={initials}
        presence={statusDisplay}
        percent={percent}
        isLast={isLast}
      />
    </button>
  )

  if (isMobile) {
    return (
      <NavUserSheet trigger={trigger} title={user.name}>
        <NavUserContent
          user={user}
          Item={NavUserSheetItem}
          presence={statusDisplay}
          percent={percent}
          remaining={remaining}
          isLast={isLast}
        />
      </NavUserSheet>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>{trigger}</DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-72 max-w-[calc(100vw-1rem)]"
        innerClassName="p-0"
        side={'bottom'}
        align="end"
        sideOffset={8}
      >
        <NavUserContent
          user={user}
          Item={DropdownMenuItem}
          presence={statusDisplay}
          percent={percent}
          remaining={remaining}
          isLast={isLast}
        />
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
