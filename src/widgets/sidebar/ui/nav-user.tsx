'use client'

import { HardDriveDownload, HardDriveUpload, LogOut, PencilIcon, RssIcon } from 'lucide-react'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { useRouter } from 'next/navigation'
import useLogout from '@/features/logout/model/useLogout'
import { useTranslations } from 'next-intl'
import { GearIcon } from '@radix-ui/react-icons'
import { Button } from '@/components/ui/button'
import { usePresenceStatus } from '@/features/presence/model/usePresenceStatus'
import { PresenceDot } from '@/features/presence/ui/PresenceDot'

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
  const statusDisplay = status === 'invisible' ? 'offline' : status

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={'ghost'} size={'icon'} className={'rounded-full'}>
          <span className="relative">
            <Avatar className="size-8 rounded-lg">
              <AvatarImage className={'object-cover'} src={user.avatar} alt={user.name} />
              <AvatarFallback className="rounded-lg">CN</AvatarFallback>
            </Avatar>
            <span className="absolute -bottom-0.5 -right-0.5 rounded-full bg-background p-px">
              <PresenceDot state={statusDisplay} className="size-2" />
            </span>
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-[--radix-dropdown-menu-trigger-width] max-w-40 rounded-lg"
        side={'bottom'}
        align="end"
        sideOffset={4}
      >
        <DropdownMenuItem className="p-0 font-normal" onClick={() => router.push('/account')}>
          <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
            <Avatar className="h-8 w-8 rounded-lg">
              <AvatarImage className={'object-cover'} src={user.avatar} alt={user.name} />
              <AvatarFallback className="rounded-lg">CN</AvatarFallback>
            </Avatar>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-semibold">{user.name}</span>
              <span className="truncate text-xs">{user.email}</span>
            </div>
          </div>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>
            <PresenceDot state={statusDisplay} className="size-2.5 mr-2" />
            {tp(status)}
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent className="max-w-44">
            <DropdownMenuItem className="py-2 flex justify-items-center" onClick={() => setStatus('online')}>
              <PresenceDot state="online" className="size-3.5 m-auto" />
              <span className={'w-full'}>{tp('online')}</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="py-2" onClick={() => setStatus('away')}>
              <PresenceDot state="away" className="size-3.5 m-auto" />
              <span className={'w-full'}>{tp('away')}</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="items-start py-2" onClick={() => setStatus('busy')}>
              <PresenceDot state="busy" className="size-3.5 m-auto" />
              <div className="flex flex-col">
                <span>{tp('busy')}</span>
                <span className="text-xs text-muted-foreground">{tp('busy-desc')}</span>
              </div>
            </DropdownMenuItem>
            <DropdownMenuItem className="items-start py-2" onClick={() => setStatus('invisible')}>
              <PresenceDot state="offline" className="size-3.5 m-auto" />
              <div className="flex flex-col w-full">
                <span>{tp('invisible')}</span>
                <span className="text-xs text-muted-foreground">{tp('invisible-desc')}</span>
              </div>
            </DropdownMenuItem>
          </DropdownMenuSubContent>
        </DropdownMenuSub>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={() => router.push('/people/' + user.id)}>
            <RssIcon />
            {t('NavMain.public-profile')}
          </DropdownMenuItem>

          <DropdownMenuItem onClick={() => router.push('/account')}>
            <PencilIcon />
            {t('NavMain.account')}
          </DropdownMenuItem>

          <DropdownMenuItem onClick={() => router.push('/options')}>
            <GearIcon />
            {t('NavMain.adjust-app')}
          </DropdownMenuItem>
          <DropdownMenuSeparator />

          <DropdownMenuItem onClick={() => router.push('/account/save')}>
            <HardDriveUpload />
            {t('NavMain.save-data')}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => router.push('/account/load')}>
            <HardDriveDownload />
            {t('NavMain.download-data')}
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleResetDeviceData}>
          <LogOut />
          {t('NavMain.log-out')}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
