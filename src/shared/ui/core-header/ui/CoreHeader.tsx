'use client'
import { SidebarTrigger } from '@/components/ui/sidebar'
import { Separator } from '@/components/ui/separator'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator
} from '@/components/ui/breadcrumb'
import Link from 'next/link'
import { NavUser } from '@/widgets/sidebar/ui/nav-user'
import * as React from 'react'
import { useSession } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { useTranslations } from 'next-intl'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import DiscordButton from '@/features/authentication/ui/DiscordButton'
import GoogleButton from '@/features/authentication/ui/GoogleButton'
import { Ellipsis, LogInIcon, SmilePlus } from 'lucide-react'
import { useOverlayStore } from '@/shared/model/overlay-store/useOverlayStore'
import FeedbackModal from '@/features/feedback/ui/FeedbackModal'

interface CoreHeaderProps {
  breadcrumbPath: string
  breadcrumb: string

  secondaryBreadcrumbPath?: string
  secondaryBreadcrumb?: string
}

export default function CoreHeader({
  breadcrumb,
  breadcrumbPath,
  secondaryBreadcrumbPath,
  secondaryBreadcrumb
}: CoreHeaderProps) {
  const { data: session } = useSession()
  const { open } = useOverlayStore()
  const tAuth = useTranslations('Index.Auth')
  const tHeader = useTranslations('Index.CoreHeader')

  const handleOpenFeedback = () => {
    open({
      id: 'feedback',
      component: <FeedbackModal />
    })
  }

  return (
    <div className="w-full border-b p-2 flex justify-between items-center mb-2 bg-background/60 backdrop-blur-md sticky top-0 z-50">
      <div className="flex items-center gap-4">
        <SidebarTrigger className="h-8 w-8" />
        <Separator orientation="vertical" className="mr-2 data-[orientation=vertical]:h-4" />
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href={breadcrumbPath} className="font-medium hover:text-primary transition-colors">
                  {breadcrumb}
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            {secondaryBreadcrumb && secondaryBreadcrumbPath && (
              <>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link href={secondaryBreadcrumbPath} className="font-medium hover:text-primary transition-colors">
                      {secondaryBreadcrumb}
                    </Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
              </>
            )}
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <div className="flex items-center gap-4">
        <div className="hidden md:flex items-center bg-muted/30 border px-3 py-1 rounded-full gap-2 text-xs text-muted-foreground">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
          </span>
          {tHeader('server-online')}
        </div>
        {session?.user ? (
          <div className={'flex items-center gap-2'}>
            <NavUser
              user={{
                id: session.user.id as string,
                name: session?.user?.name || 'Guest',
                email: session?.user?.email || '',
                avatar: session?.user?.image || ''
              }}
            />

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 px-3 rounded-md">
                  <Ellipsis />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuGroup>
                  <DropdownMenuItem asChild>
                    <Button variant={'ghost'} className={'w-full flex justify-between'} onClick={handleOpenFeedback}>
                      {tHeader('give-feedback')} <SmilePlus />
                    </Button>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ) : (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="flex items-center gap-2 px-4 py-2 h-9 rounded-md font-medium transition-all hover:bg-accent"
              >
                <LogInIcon className="h-4 w-4" />
                {tAuth('sign-in')}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64 p-4">
              <div className="flex flex-col gap-2 mb-4">
                <DropdownMenuLabel className="p-0 font-bold text-lg leading-none">
                  {tAuth('nexus-community')}
                </DropdownMenuLabel>
                <p className="text-sm text-muted-foreground leading-snug">{tAuth('login-description')}</p>
              </div>
              <DropdownMenuSeparator className="mb-4" />
              <DropdownMenuGroup className="flex flex-col gap-2">
                <DiscordButton />
                <GoogleButton />
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </div>
  )
}
