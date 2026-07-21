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
import Link from 'next/link'
import { NavUser } from '@/widgets/sidebar/ui/nav-user'
import * as React from 'react'
import { useSession } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { useTranslations } from 'next-intl'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { LogInIcon, SmilePlus } from 'lucide-react'
import { useOverlayStore } from '@/shared/model/overlay-store/useOverlayStore'
import FeedbackModal from '@/features/feedback/ui/FeedbackModal'
import SyncProgress from '@/shared/ui/core-header/ui/SyncProgress'
import { cn } from '@/shared/lib/utils'

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
      <div className="h-14 border-b px-3 flex justify-between items-center gap-2 bg-background/60 backdrop-blur-md">
        <div className="flex items-center gap-3 min-w-0">
          <SidebarTrigger className="size-9 rounded-lg border bg-muted/40 hover:bg-muted shrink-0 [&_svg]:size-5" />
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

        <div className="flex items-center gap-2 shrink-0">
          {actions}

          {session?.user ? (
            <>
              <SyncProgress />
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-9 gap-1.5 px-2.5 sm:px-3"
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
            <Link
              href="/sign-in"
              className="header-signin group relative inline-flex h-9 items-center gap-1.5 overflow-hidden rounded-lg px-4 text-sm font-medium text-primary-foreground shadow-sm transition-transform duration-200 hover:scale-[1.04] active:scale-95"
            >
              <LogInIcon className="relative z-[2] size-4 transition-transform duration-200 group-hover:-translate-x-0.5 group-hover:rotate-[-8deg]" />
              <span className="relative z-[2]">{tAuth('sign-in')}</span>
            </Link>
          )}
        </div>
      </div>
      {accentStripe && (
        <div className="flex w-full h-0.75" aria-hidden>
          <div className="flex-1 bg-cube-white" />
          <div className="flex-1 bg-cube-yellow" />
          <div className="flex-1 bg-cube-red" />
          <div className="flex-1 bg-cube-orange" />
          <div className="flex-1 bg-cube-blue" />
          <div className="flex-1 bg-cube-green" />
        </div>
      )}
    </div>
  )
}
