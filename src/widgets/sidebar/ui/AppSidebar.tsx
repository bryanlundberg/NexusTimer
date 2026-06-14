'use client'

import * as React from 'react'
import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { usePathname } from 'next/navigation'
import { useActiveIndicator } from '@/widgets/sidebar/model/useActiveIndicator'
import {
  BoxesIcon,
  Brain,
  ChartColumnIcon,
  Dumbbell,
  GithubIcon,
  HistoryIcon,
  LandPlot,
  MonitorDown,
  PlusIcon,
  ReplaceIcon,
  Settings,
  TableProperties,
  TimerIcon,
  UsersRound
} from 'lucide-react'
import { useCubeActions } from '@/features/manage-cubes/model/useCubeActions'

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  useSidebar
} from '@/components/ui/sidebar'
import { DiscordLogoIcon } from '@radix-ui/react-icons'
import { usePwaInstall } from '@/shared/model/usePwaInstall'
import Image from 'next/image'
import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { RotatingText } from '@/components/ui/shadcn-io/rotating-text'
import { NavMain } from '@/widgets/sidebar/ui/nav-main'
import { ALGORITHM_SETS } from '@/shared/const/algorithms-sets'
import { SidebarBgEffect } from '@/widgets/sidebar/ui/sidebar-bg-effect'
import { Nexi } from '@/shared/ui/nexi'

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { open, openMobile, setOpenMobile, isMobile, state } = useSidebar()
  const t = useTranslations('Index')
  const { isInstallable, install } = usePwaInstall()
  const { handleCreate } = useCubeActions()
  const pathname = usePathname() ?? ''
  const [hash, setHash] = useState<string>('')
  const { menuRef, indicator } = useActiveIndicator<HTMLDivElement>([pathname, hash, state])

  useEffect(() => {
    const updateHash = () => setHash(window.location.hash || '')
    updateHash()
    window.addEventListener('hashchange', updateHash)
    return () => window.removeEventListener('hashchange', updateHash)
  }, [])

  const data = useMemo(
    () => ({
      platform: [
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
          icon: BoxesIcon,
          action: {
            icon: PlusIcon,
            label: t('CubesPage.new-collection'),
            onClick: handleCreate
          }
        },
        {
          title: t('NavMain.transfer'),
          url: '/transfer-solves',
          icon: ReplaceIcon
        },
        {
          title: t('NavMain.settings'),
          url: '/options',
          icon: Settings
        }
      ],
      training: [
        {
          title: t('NavMain.trainer'),
          url: '/algorithms/trainer',
          icon: Dumbbell
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
        }
      ],
      community: [
        {
          title: t('NavMain.people'),
          url: '/people',
          icon: UsersRound
        },
        {
          title: t('NavMain.leaderboards'),
          url: '/leaderboards',
          icon: TableProperties,
          badge: 'New'
        }
      ],
      multiplayer: [
        {
          title: t('NavMain.free-play'),
          url: '/free-play',
          icon: LandPlot
        }
      ]
    }),
    [t, handleCreate]
  )

  return (
    <Sidebar collapsible={'icon'} {...props}>
      <SidebarBgEffect />
      <SidebarHeader className={'mt-2'}>
        <SidebarMenu>
          <SidebarMenuItem>
            <Link href={'/app'} className={`flex items-center gap-2`} onClick={() => isMobile && setOpenMobile(false)}>
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
      <SidebarContent className="group-data-[collapsible=icon]:overflow-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
        <div ref={menuRef} className="relative isolate">
          {!isMobile && indicator && (
            <motion.div
              className="absolute top-0 left-0 rounded-md bg-sidebar-accent pointer-events-none -z-10"
              style={{ width: indicator.width, height: indicator.height }}
              initial={false}
              animate={{ x: indicator.left, y: indicator.top }}
              transition={{ type: 'spring', stiffness: 500, damping: 40 }}
            />
          )}
          <NavMain items={data.platform} label={t('NavMain.platform')} />
          <NavMain items={data.training} label={t('NavMain.training')} />
          <NavMain items={data.community} label={t('NavMain.community')} />
          <NavMain items={data.multiplayer} label={t('NavMain.multiplayer')} />
        </div>
      </SidebarContent>
      <SidebarFooter className="group-data-[collapsible=icon]:hidden">
        {isInstallable && (
          <button
            type="button"
            onClick={install}
            className="flex items-center gap-2 rounded-md border bg-background/60 px-3 py-2 text-xs font-medium cursor-pointer hover:bg-accent transition-colors"
          >
            <MonitorDown className="size-4 text-primary" />
            <span>{t('NavMain.install-app')}</span>
          </button>
        )}
        <div className="rounded-lg border bg-linear-to-br from-sidebar-accent/40 via-sidebar-accent/10 to-transparent p-3 flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <Nexi state="idle" size={38} />
            <div className="min-w-0">
              <p className="text-xs font-semibold leading-tight truncate">Nexi</p>
              <p className="text-[10px] text-muted-foreground leading-tight">{t('NavMain.footer-tagline')}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-1.5">
            <a
              href="https://github.com/bryanlundberg/NexusTimer"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-1.5 rounded-md border bg-background/50 py-1.5 text-[11px] font-medium hover:bg-accent transition-colors"
            >
              <GithubIcon className="size-3.5" />
              GitHub
            </a>
            <a
              href="https://discord.gg/eCgTKcavec"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-1.5 rounded-md border bg-background/50 py-1.5 text-[11px] font-medium hover:bg-accent transition-colors"
            >
              <DiscordLogoIcon className="size-3.5" />
              Discord
            </a>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
