'use client'

import * as React from 'react'
import { GithubIcon, LandPlot, LayoutPanelLeft, LifeBuoy, Settings, UsersRound, } from 'lucide-react'

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
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardDescription, CardFooter as UICardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { usePathname } from 'next/navigation'

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
      items: [
        {
          title: 'Clash Mode',
          url: '/clash',
        }
      ]
    },
    {
      title: 'Settings',
      url: '/options',
      icon: Settings,
      items: [
        {
          title: 'Language',
          url: '/options#region'
        },
        {
          title: 'Features',
          url: '/options#timer'
        },
        {
          title: 'Sounds',
          url: '/options#sounds'
        },
        {
          title: 'Alerts',
          url: '/options#notifications'
        },
        {
          title: 'Appearance',
          url: '/options#appareance'
        }
      ]
    }
  ],
  navSecondary: [
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
  const pathname = usePathname() ?? ''
  const isHomeActive = pathname === '/app' || pathname.startsWith('/app/')
  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild isActive={isHomeActive}>
              <Link href={'/app'}>
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <Image src={'/logo.png'} alt={'logo'} width={32} height={32} className={`p-1.5 invert`}/>
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">Nexus Timer</span>
                  <span className="truncate text-xs">Welcome! </span>
                </div>
              </Link>
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
          <NavUser
            user={{
              name: session.user.name || 'User',
              email: session.user.email || '',
              avatar: session.user.image || '',
            }}
          />
        </SidebarFooter>
      ) : (
        <SidebarFooter>
          <Card className="py-4 bg-primary/50 text-primary-foreground">
            <CardHeader className="pb-0">
              <CardTitle className="text-base">Access</CardTitle>
              <CardDescription className={"text-xs text-primary-foreground"}>Keep sync your data across devices and access more features.</CardDescription>
            </CardHeader>
            <UICardFooter>
              <div className="w-full">
                <ButtonGoogle/>
              </div>
            </UICardFooter>
          </Card>
        </SidebarFooter>
      )}
    </Sidebar>
  )
}
