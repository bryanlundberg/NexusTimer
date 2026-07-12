'use client'

import { type LucideIcon } from 'lucide-react'

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
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React, { useEffect, useState } from 'react'

export function NavMain({
  items,
  label,
  accent
}: {
  items: {
    title: string
    url: string
    icon: LucideIcon
    isActive?: boolean
    badge?: string
    action?: {
      icon: LucideIcon
      label: string
      onClick: () => void
    }
    items?: {
      title: string
      url: string
    }[]
  }[]
  label?: string
  accent?: string
}) {
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

  return (
    <SidebarGroup
      style={accent ? ({ ['--nav-accent']: accent } as React.CSSProperties) : undefined}
      className="group-data-[collapsible=icon]:mt-1 group-data-[collapsible=icon]:border-t group-data-[collapsible=icon]:border-sidebar-border/60 group-data-[collapsible=icon]:pt-2"
    >
      {label && (
        <SidebarGroupLabel>
          {accent && (
            <span
              aria-hidden
              className="mr-1.5 inline-block size-1.5 rounded-[2px]"
              style={{ backgroundColor: 'var(--nav-accent)' }}
            />
          )}
          {label}
        </SidebarGroupLabel>
      )}
      <SidebarMenu>
        {items.map((item) => {
          const subActive = item.items?.some((s) => isPathActive(s.url)) ?? false
          const itemActive = isPathActive(item.url) || subActive
          const isOpen = item.isActive

          return (
            <Collapsible key={item.title} asChild defaultOpen={isOpen}>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  tooltip={item.title}
                  isActive={itemActive}
                  data-active-item={itemActive ? 'true' : undefined}
                  className={`relative md:data-[active=true]:bg-transparent group-data-[collapsible=icon]:[&>svg]:opacity-90 ${
                    accent ? '[&>svg]:text-[color:var(--nav-accent)]' : ''
                  }`}
                >
                  <Link href={item.url} onClick={handleNavClick}>
                    {accent && itemActive && (
                      <span
                        aria-hidden
                        className="absolute left-0 top-1/2 h-4 w-0.5 -translate-y-1/2 rounded-full group-data-[collapsible=icon]:hidden"
                        style={{ backgroundColor: 'var(--nav-accent)' }}
                      />
                    )}
                    <item.icon />
                    <span>{item.title}</span>
                    {item.badge && (
                      <span className="ml-auto rounded-full bg-cube-red px-1.5 py-0.5 text-[10px] font-semibold leading-none text-white group-data-[collapsible=icon]:hidden">
                        {item.badge}
                      </span>
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
                        <span className="sr-only">Toggle</span>
                      </SidebarMenuAction>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <SidebarMenuSub>
                        {item.items?.map((subItem) => {
                          const subIsActive = isPathActive(subItem.url)
                          return (
                            <SidebarMenuSubItem key={subItem.title}>
                              <SidebarMenuSubButton asChild isActive={subIsActive}>
                                <Link href={subItem.url} onClick={handleNavClick}>
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
