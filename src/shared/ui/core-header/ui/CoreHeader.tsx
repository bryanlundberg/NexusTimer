'use client'
import { SidebarTrigger } from '@/components/ui/sidebar'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from '@/components/ui/breadcrumb'
import { Link } from '@/shared/config/i18n/navigation'
import { NavUser } from '@/widgets/sidebar/ui/nav-user'
import * as React from 'react'
import { useSession } from '@/shared/model/useSession'
import { Button, buttonVariants } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { useTranslations } from 'next-intl'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { LogInIcon, SmilePlus } from 'lucide-react'
import { useOverlayStore } from '@/shared/model/overlay-store/useOverlayStore'
import FeedbackModal from '@/features/feedback/ui/FeedbackModal'
import { MessagesMenu } from '@/widgets/chat/ui/MessagesMenu'
import { cn } from '@/shared/lib/utils'

export interface BreadcrumbEntry {
  label: string
  href?: string
}

interface CoreHeaderProps {
  breadcrumbs: BreadcrumbEntry[]
  actions?: React.ReactNode
}

export default function CoreHeader({ breadcrumbs, actions }: CoreHeaderProps) {
  const { data: session, status } = useSession()
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
      <div className="@container/header h-14 border-b px-3 flex justify-between items-center gap-2 bg-background/60 backdrop-blur-md backdrop-surface">
        <div className="flex items-center gap-3 min-w-0">
          <SidebarTrigger className="size-9 shrink-0 pointer-coarse:size-10 [&_svg]:size-5" />
          <Breadcrumb className="min-w-0">
            <BreadcrumbList className="flex-nowrap gap-1.5 sm:gap-2">
              {breadcrumbs.map((crumb, index) => {
                const isLast = index === breadcrumbs.length - 1
                const isSingle = breadcrumbs.length === 1
                return (
                  <React.Fragment key={`${crumb.label}-${index}`}>
                    <BreadcrumbItem className="min-w-0">
                      {isLast || !crumb.href ? (
                        <BreadcrumbPage
                          className={cn(
                            'leading-none truncate min-w-0',
                            isSingle
                              ? 'text-sm font-medium text-muted-foreground'
                              : 'text-base font-medium text-foreground'
                          )}
                        >
                          {crumb.label}
                        </BreadcrumbPage>
                      ) : (
                        <BreadcrumbLink asChild>
                          <Link
                            href={crumb.href}
                            className="text-sm text-muted-foreground hover:text-primary transition-colors truncate min-w-0"
                          >
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

        <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
          {actions}

          {status === 'loading' ? (
            <Skeleton className="h-9 w-24" />
          ) : session?.user ? (
            <>
              <MessagesMenu />
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-9 min-w-9 gap-1.5 px-2 pointer-coarse:h-10 pointer-coarse:min-w-10 sm:px-3"
                    onClick={handleOpenFeedback}
                    aria-label={tHeader('give-feedback')}
                    data-testid="header-feedback-button"
                  >
                    <SmilePlus className="size-4" />
                    <span className="hidden sm:inline text-sm font-medium">{tHeader('give-feedback')}</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="sm:hidden">
                  {tHeader('give-feedback')}
                </TooltipContent>
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
            <Link href="/sign-in" prefetch={false} className={buttonVariants({ size: 'sm' })}>
              <LogInIcon className="size-4" />
              <span>{tAuth('sign-in')}</span>
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}
