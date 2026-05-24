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
import { Button, buttonVariants } from '@/components/ui/button'
import { useTranslations } from 'next-intl'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { Ellipsis, LogInIcon, SmilePlus } from 'lucide-react'
import { useOverlayStore } from '@/shared/model/overlay-store/useOverlayStore'
import FeedbackModal from '@/features/feedback/ui/FeedbackModal'
import { usePathname } from 'next/navigation'

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
  const pathname = usePathname()
  const showColorStripe = /\/(trainer|people)(\/.*)?$/.test(pathname)
  const tAuth = useTranslations('Index.Auth')
  const tHeader = useTranslations('Index.CoreHeader')

  const handleOpenFeedback = () => {
    open({
      id: 'feedback',
      component: <FeedbackModal />
    })
  }

  return (
    <div className="w-full sticky top-0 z-50 mb-2">
      <div className="border-b px-2 py-1 flex justify-between items-center bg-background/60 backdrop-blur-md">
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
            <Link
              href="/sign-in"
              className={buttonVariants({
                variant: 'ghost',
                size: 'sm',
                className: 'h-7 gap-1.5 px-2 text-xs text-muted-foreground hover:text-foreground'
              })}
            >
              <LogInIcon className="size-3.5" />
              <span className="hidden sm:inline">{tAuth('sign-in')}</span>
            </Link>
          )}
        </div>
      </div>
      {showColorStripe && (
        <div className="flex w-full h-0.75">
          <div className="flex-1 bg-white" />
          <div className="flex-1 bg-yellow-500" />
          <div className="flex-1 bg-red-500" />
          <div className="flex-1 bg-orange-500" />
          <div className="flex-1 bg-blue-900" />
          <div className="flex-1 bg-green-500" />
        </div>
      )}
    </div>
  )
}
