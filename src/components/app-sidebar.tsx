'use client'

import * as React from 'react'
import { BookOpen, Bot, Command, GithubIcon, LandPlot, LayoutPanelLeft, LifeBuoy, UsersRound, } from 'lucide-react'

import { NavMain } from '@/components/nav-main'
import { NavSecondary } from '@/components/nav-secondary'
import { NavUser } from '@/components/nav-user'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'
import { DiscordLogoIcon } from '@radix-ui/react-icons'
import { useSession } from 'next-auth/react';
import ButtonGoogle from '@/components/buttons/button-google/button-google';

const data = {
  navMain: [
    {
      title: 'Application',
      url: '/app',
      icon: LayoutPanelLeft,
      isActive: true,
      items: [
        {
          title: 'Timer',
          url: '/app',
        },
        {
          title: 'Solves',
          url: '/solves',
        },
        {
          title: 'Statistics',
          url: '/stats',
        },
        {
          title: 'Cubes',
          url: '/cubes',
        },
        {
          title: 'Transfer',
          url: '/transfer-solves',
        },
        {
          title: 'Settings',
          url: '/options',
        }
      ],
    },
    {
      title: 'Community',
      url: '/people',
      icon: UsersRound,
    },
    {
      title: 'Multiplayer',
      url: '/clash',
      icon: LandPlot,
    },
  ],
  navSecondary: [
    {
      title: 'Support',
      url: 'https://github.com/bryanlundberg/NexusTimer/issues',
      icon: LifeBuoy,
    },
    {
      title: 'GitHub',
      url: 'https://github.com/bryanlundberg/NexusTimer',
      icon: GithubIcon,
    },
    {
      title: 'Discord',
      url: 'https://discord.gg/grenDQFw',
      icon: DiscordLogoIcon,
    }
  ]
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { data: session } = useSession()
  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <div className={"pointer-none select-none"}>
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <Command className="size-4"/>
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">Nexus Timer</span>
                  <span className="truncate text-xs">Welcome! </span>
                </div>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain}/>
        <NavSecondary items={data.navSecondary as any} className="mt-auto"/>
      </SidebarContent>

      {session?.user ? (
        <SidebarFooter>
          <NavUser user={{
            name: session.user.name || 'User',
            email: session.user.email || '',
            avatar: session.user.image || '',
          }}/>
        </SidebarFooter>
      ): (
        <ButtonGoogle/>
      )}
    </Sidebar>
  )
}
