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
  SidebarMenuSubItem
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
    items?: {
      title: string
      url: string
    }[]
  }[]
  label?: string
}) {
  const pathname = usePathname() ?? ''
  const [hash, setHash] = useState<string>('')

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
                  <Link href={item.url}>
                    <item.icon />
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
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
                                <Link href={subItem.url}>
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
