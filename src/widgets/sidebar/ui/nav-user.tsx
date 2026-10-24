'use client'

import {
  ArrowRightLeft,
  ChevronRight,
  Globe,
  HardDriveDownload,
  HardDriveUpload,
  LogOut,
  Settings,
  UserRound
} from 'lucide-react'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { useRouter } from '@/shared/config/i18n/navigation'
import useLogout from '@/features/logout/model/useLogout'
import { useTranslations } from 'next-intl'
import { usePresenceStatus } from '@/features/presence/model/usePresenceStatus'
import { PresenceDot } from '@/features/presence/ui/PresenceDot'
import { resolvePresenceDisplay, usePresence } from '@/features/presence/model/usePresence'
import type { PresenceDisplay, PresenceStatus } from '@/features/presence/model/usePresence'
import { cn } from '@/shared/lib/utils'
import { useBackupProgress } from '@/shared/model/backup/useBackupProgress'
import { NavUserAvatar } from '@/widgets/sidebar/ui/nav-user-avatar'
import { NavUserBackupRow } from '@/widgets/sidebar/ui/nav-user-backup-row'

const PRESENCE_OPTIONS: { value: PresenceStatus; display: PresenceDisplay }[] = [
  { value: 'online', display: 'online' },
  { value: 'away', display: 'away' },
  { value: 'busy', display: 'busy' },
  { value: 'invisible', display: 'offline' }
]

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
  const router = useRouter()
  const { handleResetDeviceData } = useLogout()
  const t = useTranslations('Index')
  const tp = useTranslations('Index.Presence')
  const tSync = useTranslations('Index.SyncProgress')
  const { percent, remaining, isLast } = useBackupProgress()
  const { status, setStatus } = usePresenceStatus()
  const statusDisplay = resolvePresenceDisplay(usePresence(user.id))
  const initials = user.name.substring(0, 2).toUpperCase()

  const navItems = [
    { icon: Globe, label: t('NavMain.public-profile'), href: '/people/' + user.id },
    { icon: UserRound, label: t('NavMain.account'), href: '/account' },
    { icon: Settings, label: t('NavMain.adjust-app'), href: '/options' }
  ]

  const dataItems = [
    { icon: HardDriveUpload, label: t('NavMain.save-data'), href: '/account/save' },
    { icon: HardDriveDownload, label: t('NavMain.download-data'), href: '/account/load' },
    { icon: ArrowRightLeft, label: t('NavMain.transfer'), href: '/transfer-solves' }
  ]

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
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
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-64" innerClassName="p-px" side={'bottom'} align="end" sideOffset={8}>
        {/* Identity header */}
        <DropdownMenuItem
          onClick={() => router.push('/account')}
          className="group relative m-0 cursor-pointer gap-3 px-3 py-3"
        >
          <div className="relative shrink-0">
            <Avatar className="size-10 rounded-full ring-1 ring-border/60">
              <AvatarImage className="object-cover" src={user.avatar} alt={user.name} />
              <AvatarFallback className="rounded-full">{initials}</AvatarFallback>
            </Avatar>
            <span className="absolute -bottom-1 -right-1 rounded-full bg-popover p-0.5">
              <PresenceDot state={statusDisplay} className="size-2.5" />
            </span>
          </div>
          <div className="grid min-w-0 flex-1 leading-tight">
            <span className="truncate text-sm font-semibold">{user.name}</span>
            {user.email && <span className="truncate text-xs text-muted-foreground">{user.email}</span>}
          </div>
          <ChevronRight className="size-4 shrink-0 text-muted-foreground opacity-0 transition-all duration-200 group-hover:translate-x-0.5 group-hover:opacity-100 group-focus:translate-x-0.5 group-focus:opacity-100" />
        </DropdownMenuItem>

        <NavUserBackupRow percent={percent} remaining={remaining} isLast={isLast} />

        {/* Presence picker */}
        <div className="flex items-center justify-between gap-2 border-y border-primary/20 bg-muted/40 px-3 py-2">
          <span className="truncate text-xs font-medium uppercase tracking-wider text-muted-foreground">
            {tp(status)}
          </span>
          <div className="flex shrink-0 gap-1">
            {PRESENCE_OPTIONS.map(({ value, display }) => (
              <button
                key={value}
                type="button"
                title={tp(value)}
                aria-label={tp(value)}
                aria-pressed={status === value}
                onClick={() => setStatus(value)}
                className={cn(
                  'flex size-7 cursor-pointer items-center justify-center transition-colors',
                  status === value ? 'bg-primary/20' : 'hover:bg-accent'
                )}
              >
                <PresenceDot state={display} className="size-3" />
              </button>
            ))}
          </div>
        </div>

        {/* Navigation */}
        <DropdownMenuGroup className="py-1">
          {navItems.map(({ icon: Icon, label, href }) => (
            <DropdownMenuItem
              key={href}
              onClick={() => router.push(href)}
              className="cursor-pointer gap-2.5 px-3 py-1.5"
            >
              <span className="flex size-6 shrink-0 items-center justify-center bg-muted">
                <Icon className="size-3.5" />
              </span>
              {label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>

        <DropdownMenuGroup className="border-t border-primary/20 py-1">
          {dataItems.map(({ icon: Icon, label, href }) => (
            <DropdownMenuItem
              key={href}
              onClick={() => router.push(href)}
              className="cursor-pointer gap-2.5 px-3 py-1.5"
            >
              <span className="flex size-6 shrink-0 items-center justify-center bg-muted">
                <Icon className="size-3.5" />
              </span>
              {label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>

        {/* Log out */}
        <div className="border-t border-primary/20 bg-muted/30 py-1">
          <DropdownMenuItem
            variant="destructive"
            onClick={handleResetDeviceData}
            className="cursor-pointer gap-2.5 px-3 py-1.5"
          >
            <span className="flex size-6 shrink-0 items-center justify-center bg-destructive/10">
              <LogOut className="size-3.5 text-destructive" />
            </span>
            {t('NavMain.log-out')}
          </DropdownMenuItem>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
