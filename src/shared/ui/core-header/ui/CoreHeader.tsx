'use client'
import { SidebarTrigger } from '@/components/ui/sidebar'
import { Separator } from '@/components/ui/separator'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from '@/components/ui/breadcrumb'
import Link from 'next/link'
import { NavUser } from '@/widgets/sidebar/ui/nav-user'
import * as React from 'react'
import { useSession } from 'next-auth/react'
import { Button, buttonVariants } from '@/components/ui/button'
import { useTranslations } from 'next-intl'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { LogInIcon, SmilePlus } from 'lucide-react'
import { useOverlayStore } from '@/shared/model/overlay-store/useOverlayStore'
import FeedbackModal from '@/features/feedback/ui/FeedbackModal'

export interface BreadcrumbEntry {
  label: string
  href?: string
}

interface CoreHeaderProps {
  breadcrumbs: BreadcrumbEntry[]
  actions?: React.ReactNode
  accentStripe?: boolean
}

export default function CoreHeader({ breadcrumbs, actions, accentStripe = false }: CoreHeaderProps) {
  const { data: session } = useSession()
  const open = useOverlayStore((store) => store.open)
  const tAuth = useTranslations('Index.Auth')
  const tHeader = useTranslations('Index.CoreHeader')

  const handleOpenFeedback = () => {
    open({
      id: 'feedback',
      component: <FeedbackModal />
    })
  }

  return (
    <div className="w-full sticky top-0 z-50" data-testid="core-header">
      <div className="h-12 border-b px-2 flex justify-between items-center gap-2 bg-background/60 backdrop-blur-md">
        <div className="flex items-center gap-2 min-w-0">
          <SidebarTrigger className="size-8 shrink-0" />
          <Separator orientation="vertical" className="data-[orientation=vertical]:h-4" />
          <Breadcrumb className="min-w-0">
            <BreadcrumbList className="flex-nowrap">
              {breadcrumbs.map((crumb, index) => {
                const isLast = index === breadcrumbs.length - 1
                return (
                  <React.Fragment key={`${crumb.label}-${index}`}>
                    <BreadcrumbItem className="min-w-0">
                      {isLast || !crumb.href ? (
                        <BreadcrumbPage className="font-medium truncate">{crumb.label}</BreadcrumbPage>
                      ) : (
                        <BreadcrumbLink asChild>
                          <Link href={crumb.href} className="font-medium hover:text-primary transition-colors truncate">
                            {crumb.label}
                          </Link>
                        </BreadcrumbLink>
                      )}
                    </BreadcrumbItem>
                    {!isLast && <BreadcrumbSeparator />}
                  </React.Fragment>
                )
              })}
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          {actions}

          {session?.user ? (
            <>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-8"
                    onClick={handleOpenFeedback}
                    aria-label={tHeader('give-feedback')}
                    data-testid="header-feedback-button"
                  >
                    <SmilePlus className="size-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom">{tHeader('give-feedback')}</TooltipContent>
              </Tooltip>
              <NavUser
                user={{
                  id: session.user.id as string,
                  name: session?.user?.name || 'Guest',
                  email: session?.user?.email || '',
                  avatar: session?.user?.image || ''
                }}
              />
            </>
          ) : (
            <Link
              href="/sign-in"
              className={buttonVariants({
                variant: 'ghost',
                size: 'sm',
                className: 'h-8 gap-1.5 px-2 text-xs text-muted-foreground hover:text-foreground'
              })}
            >
              <LogInIcon className="size-3.5" />
              <span className="hidden sm:inline">{tAuth('sign-in')}</span>
            </Link>
          )}
        </div>
      </div>
      {accentStripe && (
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
