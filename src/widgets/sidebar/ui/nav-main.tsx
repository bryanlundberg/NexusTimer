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
import { PlusIcon } from '@radix-ui/react-icons'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React, { useEffect, useState } from 'react'

export function NavMain({
  items,
  label
}: {
  items: {
    title: string
    url: string
    icon: LucideIcon
    isActive?: boolean
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
    <SidebarGroup>
      {label && <SidebarGroupLabel>{label}</SidebarGroupLabel>}
      <SidebarMenu>
        {items.map((item) => {
          const subActive = item.items?.some((s) => isPathActive(s.url)) ?? false
          const itemActive = isPathActive(item.url) || subActive
          const isOpen = item.isActive

          return (
            <Collapsible key={item.title} asChild defaultOpen={isOpen}>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip={item.title} isActive={itemActive}>
                  <Link href={item.url} onClick={handleNavClick}>
                    <item.icon />
                    <span>{item.title}</span>
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
                        <PlusIcon />
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
