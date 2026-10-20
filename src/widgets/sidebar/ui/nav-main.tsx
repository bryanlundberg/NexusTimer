'use client'

import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar
} from '@/components/ui/sidebar'
import { ChevronRightIcon } from '@radix-ui/react-icons'
import { Link, usePathname } from '@/shared/config/i18n/navigation'
import { useEffect, useState } from 'react'
import { cn } from '@/shared/lib/utils'
import { LinkPendingHint } from '@/shared/ui/link-pending-hint/LinkPendingHint'
import { SIDEBAR_HINT_CLASS } from '@/widgets/sidebar/model/link-hint'
import type { SidebarNavItem } from '@/widgets/sidebar/model/useSidebarNav'
import { useTranslations } from 'next-intl'

export function NavMain({ items, label }: { items: SidebarNavItem[]; label?: string }) {
  const t = useTranslations('Index.NavMain')
  const pathname = usePathname() ?? ''
  const [hash, setHash] = useState<string>('')
  const [openOverrides, setOpenOverrides] = useState<Record<string, boolean>>({})
  const { setOpenMobile, isMobile } = useSidebar()

  useEffect(() => {
    setOpenOverrides({})
  }, [pathname])

  const handleNavClick = () => {
    if (isMobile) setOpenMobile(false)
  }

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const updateHash = () => setHash(window.location.hash || '')
      updateHash()
      window.addEventListener('hashchange', updateHash)
      return () => window.removeEventListener('hashchange', updateHash)
    }
  }, [])

  const isPathActive = (targetUrl: string): boolean => {
    const [base, anchor] = targetUrl.split('#')
    if (anchor) {
      return pathname === base && hash === `#${anchor}`
    }
    if (!base) return false
    return pathname === base || (pathname.startsWith(base + '/') && base !== '/')
  }

  const isItemActive = (item: (typeof items)[number]) =>
    item.items?.length ? pathname === item.url || item.items.some((s) => isPathActive(s.url)) : isPathActive(item.url)

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:mt-1 group-data-[collapsible=icon]:border-t group-data-[collapsible=icon]:border-sidebar-border/60 group-data-[collapsible=icon]:pt-2 group-data-[collapsible=icon]:first:mt-0 group-data-[collapsible=icon]:first:border-t-0">
      {label && (
        <SidebarGroupLabel className="font-display text-[10px] font-semibold uppercase tracking-[0.14em] text-sidebar-foreground/40">
          <span className="truncate">{label}</span>
        </SidebarGroupLabel>
      )}
      <SidebarMenu>
        {items.map((item) => {
          const itemActive = isItemActive(item)

          return (
            <Collapsible
              key={item.title}
              asChild
              open={openOverrides[item.title] ?? itemActive}
              onOpenChange={(open) => setOpenOverrides((prev) => ({ ...prev, [item.title]: open }))}
            >
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  tooltip={item.badge ? `${item.title} (${item.badge})` : item.title}
                  isActive={itemActive}
                  className={cn(
                    'nav-item transition-[width,height,padding,color] text-sidebar-foreground hover:text-sidebar-foreground data-[active=true]:text-sidebar-foreground [&>svg]:text-sidebar-foreground/50 data-[active=true]:font-normal',
                    isMobile && 'h-10'
                  )}
                >
                  <Link href={item.url} onClick={handleNavClick}>
                    <LinkPendingHint className={SIDEBAR_HINT_CLASS} />
                    <item.icon />
                    <span>{item.title}</span>
                    {item.badge && (
                      <>
                        <span className="ml-auto bg-cube-red px-1.5 py-0.5 text-[10px] font-semibold leading-none text-white group-data-[collapsible=icon]:hidden">
                          {item.badge}
                        </span>
                        <span
                          aria-hidden
                          className="absolute top-1 right-1 hidden size-2 rounded-full bg-cube-red ring-2 ring-sidebar group-data-[collapsible=icon]:block"
                        />
                      </>
                    )}
                  </Link>
                </SidebarMenuButton>
                {item.action && !item.items?.length ? (
                  <SidebarMenuAction
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      item.action!.onClick()
                      if (isMobile) setOpenMobile(false)
                    }}
                  >
                    <item.action.icon />
                    <span className="sr-only">{item.action.label}</span>
                  </SidebarMenuAction>
                ) : null}
                {item.items?.length ? (
                  <>
                    <CollapsibleTrigger asChild>
                      <SidebarMenuAction className="data-[state=open]:rotate-90">
                        <ChevronRightIcon />
                        <span className="sr-only">{t('toggle-section', { title: item.title })}</span>
                      </SidebarMenuAction>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <SidebarMenuSub>
                        {item.items?.map((subItem) => {
                          const subIsActive = isPathActive(subItem.url)
                          return (
                            <SidebarMenuSubItem key={subItem.url}>
                              <SidebarMenuSubButton
                                asChild
                                isActive={subIsActive}
                                className={cn(
                                  'nav-item text-sidebar-foreground hover:text-sidebar-foreground data-[active=true]:text-sidebar-foreground',
                                  isMobile && 'h-9'
                                )}
                              >
                                <Link href={subItem.url} onClick={handleNavClick}>
                                  <LinkPendingHint className={SIDEBAR_HINT_CLASS} />
                                  <span>{subItem.title}</span>
                                </Link>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                          )
                        })}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  </>
                ) : null}
              </SidebarMenuItem>
            </Collapsible>
          )
        })}
      </SidebarMenu>
    </SidebarGroup>
  )
}
