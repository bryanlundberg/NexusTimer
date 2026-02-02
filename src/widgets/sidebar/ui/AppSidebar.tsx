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
  ReplaceIcon,
  Settings,
  TableProperties,
  TimerIcon,
  UsersRound
} from 'lucide-react'

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  useSidebar
} from '@/components/ui/sidebar'
import { DiscordLogoIcon } from '@radix-ui/react-icons'
import Image from 'next/image'
import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { RotatingText } from '@/components/ui/shadcn-io/rotating-text'
import { NavMain } from '@/widgets/sidebar/ui/nav-main'
import { NavSecondary } from '@/widgets/sidebar/ui/nav-secondary'
import { ALGORITHM_SETS } from '@/shared/const/algorithms-sets'

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { open, openMobile } = useSidebar()
  const t = useTranslations('Index')

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
          title: t('NavMain.people'),
          url: '/people',
          icon: UsersRound
        },
        {
          title: t('NavMain.leaderboards'),
          url: '/leaderboards',
          icon: TableProperties
        },
        {
          title: t('NavMain.free-play'),
          url: '/free-play',
          icon: LandPlot
        },
        {
          title: t('AlgorithmsPage.title'),
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
    <Sidebar collapsible={'icon'} {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <Link href={'/app'} className={`flex items-center gap-2`}>
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                <Image src={'/logo.png'} alt={'logo'} width={32} height={32} className={`p-1.5 invert size-8`} />
              </div>
              {open || openMobile ? (
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">Nexus Timer</span>
                  <RotatingText
                    text={[
                      t('sidebar-rotating-text.text1'),
                      t('sidebar-rotating-text.text2'),
                      t('sidebar-rotating-text.text3'),
                      t('sidebar-rotating-text.text4'),
                      t('sidebar-rotating-text.text5'),
                      t('sidebar-rotating-text.text6'),
                      t('sidebar-rotating-text.text7'),
                      t('sidebar-rotating-text.text8'),
                      t('sidebar-rotating-text.text9'),
                      t('sidebar-rotating-text.text10'),
                      t('sidebar-rotating-text.text11'),
                      t('sidebar-rotating-text.text12'),
                      t('sidebar-rotating-text.text13'),
                      t('sidebar-rotating-text.text14'),
                      t('sidebar-rotating-text.text15'),
                      t('sidebar-rotating-text.text16'),
                      t('sidebar-rotating-text.text17'),
                      t('sidebar-rotating-text.text18'),
                      t('sidebar-rotating-text.text19'),
                      t('sidebar-rotating-text.text20')
                    ]}
                    duration={10000}
                    transition={{ duration: 0.2, ease: 'easeInOut' }}
                    className={'text-xs text-muted-foreground p-0'}
                  />
                </div>
              ) : null}
            </Link>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain.slice(0, 5)} label={t('NavMain.platform')} />
        <NavMain items={data.navMain.slice(5, 8)} label={t('NavMain.community')} />
        <NavMain items={data.navMain.slice(8)} />
        <NavSecondary items={data.navSecondary as any} className="mt-auto" />
      </SidebarContent>
    </Sidebar>
  )
}
