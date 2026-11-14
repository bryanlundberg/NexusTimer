'use client'

import { profilePath } from '@nexustimer/contracts'
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
import { useTranslations } from 'next-intl'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import useLogout from '@/features/logout/model/useLogout'
import type { PresenceView } from '@/features/presence/model/usePresence'
import { PresenceDot } from '@/features/presence/ui/PresenceDot'
import { useRouter } from '@/shared/config/i18n/navigation'
import { NavUserBackupRow } from '@/widgets/sidebar/ui/nav-user-backup-row'
import type { NavUserItemComponent } from '@/widgets/sidebar/ui/nav-user-item'
import { NavUserPresence } from '@/widgets/sidebar/ui/nav-user-presence'

interface NavUserContentProps {
  user: { id: string; name: string; email: string; avatar: string }
  Item: NavUserItemComponent
  presence: PresenceView
  percent: number
  remaining: number
  isLast: boolean
}

export function NavUserContent({ user, Item, presence, percent, remaining, isLast }: NavUserContentProps) {
  const router = useRouter()
  const { handleResetDeviceData } = useLogout()
  const t = useTranslations('Index')
  const initials = user.name.substring(0, 2).toUpperCase()

  const groups = [
    [
      { icon: Globe, label: t('NavMain.public-profile'), href: profilePath(user.id) },
      { icon: UserRound, label: t('NavMain.account'), href: '/account' },
      { icon: Settings, label: t('NavMain.adjust-app'), href: '/options' }
    ],
    [
      { icon: HardDriveUpload, label: t('NavMain.save-data'), href: '/account/save' },
      { icon: HardDriveDownload, label: t('NavMain.download-data'), href: '/account/load' },
      { icon: ArrowRightLeft, label: t('NavMain.transfer'), href: '/transfer-solves' }
    ]
  ]

  return (
    <div className="flex min-h-full flex-col">
      <Item
        onClick={() => router.push(profilePath(user.id))}
        className="group relative m-0 cursor-pointer gap-3 bg-muted/40 px-3 py-3"
      >
        <div className="relative shrink-0">
          <Avatar className="size-10 rounded-full ring-1 ring-border/60">
            <AvatarImage className="object-cover" src={user.avatar} alt={user.name} />
            <AvatarFallback className="rounded-full">{initials}</AvatarFallback>
          </Avatar>
          <span className="absolute -right-1 -bottom-1 rounded-full bg-popover p-0.5">
            <PresenceDot state={presence} className="size-2.5" />
          </span>
        </div>
        <div className="grid min-w-0 flex-1 leading-tight">
          <span className="truncate font-display text-[15px] font-semibold tracking-tight">{user.name}</span>
          {user.email && <span className="truncate text-xs text-muted-foreground">{user.email}</span>}
        </div>
        <ChevronRight className="size-4 shrink-0 text-muted-foreground opacity-0 transition-all duration-200 group-hover:translate-x-0.5 group-hover:opacity-100 group-focus:translate-x-0.5 group-focus:opacity-100 pointer-coarse:opacity-100" />
      </Item>

      <NavUserBackupRow Item={Item} percent={percent} remaining={remaining} isLast={isLast} />

      <NavUserPresence />

      {groups.map((items, index) => (
        <div key={index} role="group" className={index === 0 ? 'py-1' : 'border-t border-border py-1'}>
          {items.map(({ icon: Icon, label, href }) => (
            <Item key={href} onClick={() => router.push(href)} className="group/row cursor-pointer gap-3 px-3 py-1.5">
              <span className="flex size-7 shrink-0 items-center justify-center bg-muted/60 transition-colors group-focus/row:bg-background">
                <Icon className="size-4 transition-colors group-focus/row:text-foreground" />
              </span>
              {label}
            </Item>
          ))}
        </div>
      ))}

      <div className="mt-auto border-t border-border py-1">
        <Item variant="destructive" onClick={handleResetDeviceData} className="cursor-pointer gap-3 px-3 py-1.5">
          <span className="flex size-7 shrink-0 items-center justify-center bg-destructive/10">
            <LogOut className="size-4 text-destructive" />
          </span>
          {t('NavMain.log-out')}
        </Item>
      </div>
    </div>
  )
}
