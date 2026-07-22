'use client'

import { ChevronRight, Globe, HardDriveDownload, HardDriveUpload, LogOut, Settings, UserRound } from 'lucide-react'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { useRouter } from 'next/navigation'
import useLogout from '@/features/logout/model/useLogout'
import { useTranslations } from 'next-intl'
import { Button } from '@/components/ui/button'
import { usePresenceStatus } from '@/features/presence/model/usePresenceStatus'
import { PresenceDot } from '@/features/presence/ui/PresenceDot'
import type { PresenceDisplay, PresenceStatus } from '@/features/presence/model/usePresence'
import { cn } from '@/shared/lib/utils'

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
  const { status, setStatus } = usePresenceStatus()
  const statusDisplay: PresenceDisplay = status === 'invisible' ? 'offline' : status

  const navItems = [
    { icon: Globe, label: t('NavMain.public-profile'), href: '/people/' + user.id },
    { icon: UserRound, label: t('NavMain.account'), href: '/account' },
    { icon: Settings, label: t('NavMain.adjust-app'), href: '/options' }
  ]

  const dataItems = [
    { icon: HardDriveUpload, label: t('NavMain.save-data'), href: '/account/save' },
    { icon: HardDriveDownload, label: t('NavMain.download-data'), href: '/account/load' }
  ]

  return (
    <DropdownMenu>
      <div className="relative inline-flex">
        <DropdownMenuTrigger asChild>
          <Button variant={'ghost'} size={'icon'} className={'rounded-full'}>
            <Avatar className="size-8 rounded-full">
              <AvatarImage className={'object-cover'} src={user.avatar} alt={user.name} />
              <AvatarFallback className="rounded-full">CN</AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <span className="pointer-events-none absolute bottom-1 right-1 z-10 rounded-full bg-background p-px">
          <PresenceDot state={statusDisplay} className="size-2" />
        </span>
      </div>
      <DropdownMenuContent
        className="w-64 overflow-hidden rounded-xl p-0 shadow-xl"
        side={'bottom'}
        align="end"
        sideOffset={8}
      >
        {/* Identity header */}
        <DropdownMenuItem
          onClick={() => router.push('/account')}
          className="group relative m-0 cursor-pointer gap-3 rounded-none bg-gradient-to-br from-primary/5 via-transparent to-transparent px-3 py-3 focus:bg-accent/60"
        >
          <div className="relative shrink-0">
            <Avatar className="size-10 rounded-full shadow-sm ring-1 ring-border/60">
              <AvatarImage className="object-cover" src={user.avatar} alt={user.name} />
              <AvatarFallback className="rounded-full">{user.name.substring(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <span className="absolute -bottom-1 -right-1 rounded-full bg-popover p-0.5">
              <PresenceDot state={statusDisplay} className="size-2.5" />
            </span>
          </div>
          <div className="grid min-w-0 flex-1 leading-tight">
            <span className="truncate text-sm font-semibold">{user.name}</span>
            <span className="truncate text-xs text-muted-foreground">{user.email}</span>
          </div>
          <ChevronRight className="size-4 shrink-0 text-muted-foreground opacity-0 transition-all duration-200 group-hover:translate-x-0.5 group-hover:opacity-100 group-focus:translate-x-0.5 group-focus:opacity-100" />
        </DropdownMenuItem>

        {/* Presence picker */}
        <div className="flex items-center justify-between gap-2 border-y border-border/50 bg-muted/40 px-3 py-2">
          <span className="truncate text-xs font-medium text-muted-foreground">{tp(status)}</span>
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
                  'flex size-7 items-center justify-center rounded-md transition-colors',
                  status === value ? 'bg-background shadow-sm ring-1 ring-border' : 'hover:bg-accent'
                )}
              >
                <PresenceDot state={display} className="size-3" />
              </button>
            ))}
          </div>
        </div>

        {/* Navigation */}
        <DropdownMenuGroup className="p-1.5">
          {navItems.map(({ icon: Icon, label, href }) => (
            <DropdownMenuItem
              key={href}
              onClick={() => router.push(href)}
              className="cursor-pointer gap-2.5 rounded-lg px-2 py-1.5"
            >
              <span className="flex size-6 shrink-0 items-center justify-center rounded-md bg-muted">
                <Icon className="size-3.5" />
              </span>
              {label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>

        <DropdownMenuGroup className="border-t border-border/50 p-1.5">
          {dataItems.map(({ icon: Icon, label, href }) => (
            <DropdownMenuItem
              key={href}
              onClick={() => router.push(href)}
              className="cursor-pointer gap-2.5 rounded-lg px-2 py-1.5"
            >
              <span className="flex size-6 shrink-0 items-center justify-center rounded-md bg-muted">
                <Icon className="size-3.5" />
              </span>
              {label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>

        {/* Log out */}
        <div className="border-t border-border/50 bg-muted/30 p-1.5">
          <DropdownMenuItem
            onClick={handleResetDeviceData}
            className="cursor-pointer gap-2.5 rounded-lg px-2 py-1.5 text-red-600 focus:bg-red-50 focus:text-red-600 dark:text-red-500 dark:focus:bg-red-950/40 dark:focus:text-red-500"
          >
            <span className="flex size-6 shrink-0 items-center justify-center rounded-md bg-red-500/10">
              <LogOut className="size-3.5 text-red-600 dark:text-red-500" />
            </span>
            {t('NavMain.log-out')}
          </DropdownMenuItem>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
