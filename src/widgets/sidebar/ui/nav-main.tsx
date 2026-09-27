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
import React, { useEffect, useState } from 'react'
import { cn } from '@/shared/lib/utils'
import { LinkPendingHint } from '@/shared/ui/link-pending-hint/LinkPendingHint'
import { SIDEBAR_HINT_CLASS } from '@/widgets/sidebar/model/link-hint'
import type { SidebarNavItem } from '@/widgets/sidebar/model/useSidebarNav'
import { useTranslations } from 'next-intl'

export function NavMain({ items, label, accent }: { items: SidebarNavItem[]; label?: string; accent?: string }) {
  const t = useTranslations('Index.NavMain')
  const pathname = usePathname() ?? ''
  const [hash, setHash] = useState<string>('')
  const { setOpenMobile, isMobile } = useSidebar()

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
  const sectionActive = items.some(isItemActive)

  return (
    <SidebarGroup
      style={accent ? ({ ['--nav-accent']: accent } as React.CSSProperties) : undefined}
      className="group-data-[collapsible=icon]:mt-1 group-data-[collapsible=icon]:border-t group-data-[collapsible=icon]:border-sidebar-border/60 group-data-[collapsible=icon]:pt-2"
    >
      {label && (
        <SidebarGroupLabel className="gap-2 font-display text-[10px] font-semibold uppercase tracking-[0.14em]">
          {accent && (
            <span
              aria-hidden
              className="size-2 shrink-0 rounded-[2px] transition-shadow duration-300"
              style={{
                backgroundColor: 'var(--nav-accent)',
                boxShadow: sectionActive ? '0 0 0 3px color-mix(in oklch, var(--nav-accent) 22%, transparent)' : 'none'
              }}
            />
          )}
          <span
            className={cn(
              'truncate transition-colors duration-300',
              sectionActive ? 'text-sidebar-foreground' : 'text-sidebar-foreground/55'
            )}
          >
            {label}
          </span>
          <span
            aria-hidden
            className="h-px min-w-4 flex-1"
            style={{
              background: `linear-gradient(to right, ${
                sectionActive && accent
                  ? 'color-mix(in oklch, var(--nav-accent) 45%, transparent)'
                  : 'var(--sidebar-border)'
              }, transparent)`
            }}
          />
        </SidebarGroupLabel>
      )}
      <SidebarMenu>
        {items.map((item) => {
          const itemActive = isItemActive(item)

          return (
            <Collapsible key={`${item.title}-${itemActive}`} asChild defaultOpen={itemActive}>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  tooltip={item.badge ? `${item.title} (${item.badge})` : item.title}
                  isActive={itemActive}
                  data-active-item={itemActive ? 'true' : undefined}
                  className={cn(
                    'nav-notch transition-[width,height,padding,color] text-sidebar-foreground/75 hover:text-sidebar-foreground data-[active=true]:text-sidebar-foreground group-data-[collapsible=icon]:[&>svg]:opacity-90',
                    accent && '[&>svg]:text-(--nav-accent)',
                    isMobile && 'h-10'
                  )}
                >
                  <Link href={item.url} onClick={handleNavClick}>
                    <LinkPendingHint className={SIDEBAR_HINT_CLASS} />
                    {accent && itemActive && (
                      <span
                        aria-hidden
                        className="absolute left-0 top-1/2 h-4 w-0.5 -translate-y-1/2 md:hidden group-data-[collapsible=icon]:hidden"
                        style={{ backgroundColor: 'var(--nav-accent)' }}
                      />
                    )}
                    <item.icon />
                    <span className="motion-safe:transition-transform motion-safe:duration-200 motion-safe:ease-(--ease-snap) motion-safe:group-hover/menu-item:translate-x-0.5">
                      {item.title}
                    </span>
                    {item.badge && (
                      <>
                        <span className="ml-auto rounded-full bg-cube-red px-1.5 py-0.5 text-[10px] font-semibold leading-none text-white group-data-[collapsible=icon]:hidden">
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
                    className="motion-safe:[&>svg]:transition-transform motion-safe:[&>svg]:duration-200 motion-safe:[&>svg]:ease-(--ease-snap) hover:[&>svg]:rotate-90"
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
                              {accent && subIsActive && (
                                <span
                                  aria-hidden
                                  className="absolute top-1/2 -left-[11.5px] h-3.5 w-0.5 -translate-y-1/2"
                                  style={{ backgroundColor: 'var(--nav-accent)' }}
                                />
                              )}
                              <SidebarMenuSubButton
                                asChild
                                isActive={subIsActive}
                                className={cn(
                                  'nav-notch text-sidebar-foreground/70 hover:text-sidebar-foreground data-[active=true]:text-sidebar-foreground',
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
