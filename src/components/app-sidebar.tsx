'use client'

import * as React from 'react'
import { useMemo } from 'react'
import {
  BoxesIcon,
  ChartColumnIcon,
  GithubIcon,
  HistoryIcon,
  LandPlot,
  Maximize2,
  Minimize2, ReplaceIcon,
  Settings, TimerIcon,
  UsersRound
} from 'lucide-react'

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
import { Button } from '@/components/ui/button'
import { useTranslations } from 'next-intl';

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { data: session } = useSession()
  const pathname = usePathname() ?? ''
  const isHomeActive = pathname === '/app' || pathname.startsWith('/app/')

  const t = useTranslations('Index');

  const [isFullscreen, setIsFullscreen] = React.useState(false)
  React.useEffect(() => {
    if (typeof document === 'undefined') return
    const handleChange = () => setIsFullscreen(Boolean(document.fullscreenElement))
    handleChange()
    document.addEventListener('fullscreenchange', handleChange)
    return () => document.removeEventListener('fullscreenchange', handleChange)
  }, [])

  const toggleFullscreen = async () => {
    try {
      if (typeof document === 'undefined') return
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen()
      } else {
        await document.exitFullscreen()
      }
    } catch (e) {
      console.error('Fullscreen toggle failed:', e)
    }
  }

  const data = useMemo(() => ({
    navMain: [
      {
        title: t('NavMain.timer'),
        url: '/app',
        icon: TimerIcon,
      },
      {
        title: t('NavMain.solves'),
        url: '/solves',
        icon: HistoryIcon,
      },
      {
        title: t('NavMain.statistics'),
        url: '/stats',
        icon: ChartColumnIcon,
      },
      {
        title: t('NavMain.cubes'),
        url: '/cubes',
        icon: BoxesIcon,
      },
      {
        title: t('NavMain.transfer'),
        url: '/transfer-solves',
        icon: ReplaceIcon,
      },
      {
        title: t('NavMain.community'),
        url: '/people',
        icon: UsersRound,
      },
      {
        title: t('NavMain.multiplayer'),
        url: '/clash',
        icon: LandPlot,
        items: [
          {
            title: t('NavMain.clash-mode'),
            url: '/clash',
          }
        ]
      },
      {
        title: t('NavMain.settings'),
        url: '/options',
        icon: Settings,
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
  }), [t]);

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
        <Button
          variant="ghost"
          className="w-full justify-start"
          onClick={toggleFullscreen}
          title={isFullscreen ? 'Salir de pantalla completa' : 'Ir a pantalla completa'}
        >
          {isFullscreen ? <Minimize2 className="mr-2 h-4 w-4"/> : <Maximize2 className="mr-2 h-4 w-4"/>}
          <span>{isFullscreen ? t('Inputs.exit-fullscreen') : t('Inputs.fullscreen')}</span>
        </Button>
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
          <Card className="py-4 bg-background text-background-foreground">
            <CardHeader className="pb-0">
              <CardTitle className="text-base">{t('AccessCard.title')}</CardTitle>
              <CardDescription className={'text-xs text-background-foreground'}>{t('AccessCard.description')}</CardDescription>
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
