'use client'

import * as React from 'react'
import { useMemo } from 'react'
import {
  BoxesIcon,
  Brain,
  ChartColumnIcon,
  GithubIcon,
  HistoryIcon,
  LandPlot,
  Maximize2,
  Minimize2,
  ReplaceIcon,
  Settings,
  TimerIcon,
  UsersRound
} from 'lucide-react'

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem
} from '@/components/ui/sidebar'
import { DiscordLogoIcon } from '@radix-ui/react-icons'
import { useSession } from 'next-auth/react'
import Image from 'next/image'
import Link from 'next/link'
import { Card, CardDescription, CardFooter as UICardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { useTranslations } from 'next-intl'
import { ALGORITHM_SETS } from '@/constants/algorithms-sets'
import GoogleButton from '@/features/authentication/ui/GoogleButton'
import { RotatingText } from '@/components/ui/shadcn-io/rotating-text'
import { GitHubStarsButton } from '@/components/ui/shadcn-io/github-stars-button'
import { NavUser } from '@/widgets/sidebar/ui/nav-user'
import { NavMain } from '@/widgets/sidebar/ui/nav-main'
import { NavSecondary } from '@/widgets/sidebar/ui/nav-secondary'

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { data: session } = useSession()
  const pathname = usePathname() ?? ''
  const isHomeActive = pathname === '/app' || pathname.startsWith('/app/')

  const t = useTranslations('Index')

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

  const data = useMemo(
    () => ({
      navMain: [
        {
          title: t('NavMain.timer'),
          url: '/app',
          icon: TimerIcon
        },
        {
          title: t('NavMain.solves'),
          url: '/solves',
          icon: HistoryIcon
        },
        {
          title: t('NavMain.statistics'),
          url: '/stats',
          icon: ChartColumnIcon
        },
        {
          title: t('NavMain.cubes'),
          url: '/cubes',
          icon: BoxesIcon
        },
        {
          title: t('NavMain.transfer'),
          url: '/transfer-solves',
          icon: ReplaceIcon
        },
        {
          title: t('NavMain.community'),
          url: '/people',
          icon: UsersRound,
          items: [
            {
              title: 'People',
              url: '/people'
            },
            {
              title: 'Leaderboards',
              url: '/leaderboards'
            }
          ]
        },
        {
          title: t('NavMain.multiplayer'),
          url: '/free-play',
          icon: LandPlot,
          items: [
            {
              title: 'Free Play',
              url: '/free-play'
            }
          ]
        },
        {
          title: 'Algorithms',
          url: '/algorithms',
          icon: Brain,
          items: [
            ...ALGORITHM_SETS.map((set) => ({
              title: set.title.toUpperCase(),
              url: `/algorithms/${set.slug.toLowerCase()}`
            }))
          ]
        },
        {
          title: t('NavMain.settings'),
          url: '/options',
          icon: Settings
        }
      ],
      navSecondary: [
        {
          title: 'GitHub',
          url: 'https://github.com/bryanlundberg/NexusTimer',
          icon: GithubIcon
        },
        {
          title: 'Discord',
          url: 'https://discord.gg/eCgTKcavec',
          icon: DiscordLogoIcon
        }
      ]
    }),
    [t]
  )

  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild isActive={isHomeActive}>
              <Link href={'/app'}>
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <Image src={'/logo.png'} alt={'logo'} width={32} height={32} className={`p-1.5 invert`} />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">Nexus Timer</span>
                  <RotatingText
                    text={[
                      'Ready to solve?',
                      'Break your record',
                      'Speedcubing time',
                      "Let's cube!",
                      'Push your limits',
                      'Break your own time',
                      'Cube like a pro',
                      'One more solve',
                      'Go for the PB',
                      'Keep cubing!',
                      'Master the cube',
                      'Every second counts'
                    ]}
                    duration={10000}
                    transition={{ duration: 0.2, ease: 'easeInOut' }}
                    className={'text-xs text-muted-foreground p-0'}
                  />
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavSecondary items={data.navSecondary as any} className="mt-auto" />
        <div className="my-2 px-4">
          <GitHubStarsButton username="bryanlundberg" repo="nexustimer" formatted={true} />
        </div>
        <Button
          variant="ghost"
          className="w-full justify-start"
          onClick={toggleFullscreen}
          title={isFullscreen ? 'Salir de pantalla completa' : 'Ir a pantalla completa'}
        >
          {isFullscreen ? <Minimize2 className="mr-2 h-4 w-4" /> : <Maximize2 className="mr-2 h-4 w-4" />}
          <span>{isFullscreen ? t('Inputs.exit-fullscreen') : t('Inputs.fullscreen')}</span>
        </Button>
      </SidebarContent>

      {session?.user ? (
        <SidebarFooter>
          <NavUser
            user={{
              name: session.user.name || 'User',
              email: session.user.email || '',
              avatar: session.user.image || ''
            }}
          />
        </SidebarFooter>
      ) : (
        <SidebarFooter>
          <Card className="py-4 bg-background text-background-foreground">
            <CardHeader className="pb-0">
              <CardTitle className="text-base">{t('AccessCard.title')}</CardTitle>
              <CardDescription className={'text-xs text-background-foreground'}>
                {t('AccessCard.description')}
              </CardDescription>
            </CardHeader>
            <UICardFooter>
              <div className="w-full">
                <GoogleButton />
              </div>
            </UICardFooter>
          </Card>
        </SidebarFooter>
      )}
    </Sidebar>
  )
}
