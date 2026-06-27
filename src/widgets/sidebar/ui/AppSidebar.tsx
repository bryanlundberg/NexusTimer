'use client'

import * as React from 'react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { motion } from 'motion/react'
import { usePathname } from 'next/navigation'
import { useActiveIndicator } from '@/widgets/sidebar/model/useActiveIndicator'
import {
  BoxesIcon,
  Brain,
  ChartColumnIcon,
  ChevronDown,
  Dumbbell,
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
import GithubIcon from '@/components/ui/github-icon'
import DiscordIcon from '@/components/ui/discord-icon'
import { usePwaInstall } from '@/shared/model/usePwaInstall'
import Image from 'next/image'
import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { RotatingText } from '@/components/ui/shadcn-io/rotating-text'
import { NavMain } from '@/widgets/sidebar/ui/nav-main'
import { ALGORITHM_SETS } from '@/shared/const/algorithms-sets'
import { SidebarBgEffect } from '@/widgets/sidebar/ui/sidebar-bg-effect'
import { SidebarActivity } from '@/widgets/sidebar/ui/sidebar-activity'
import { useTimerStore } from '@/shared/model/timer/useTimerStore'
import { INDICATOR_SPRING } from '@/shared/lib/motion'

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { open, openMobile, setOpenMobile, isMobile, state } = useSidebar()
  const t = useTranslations('Index')
  const { isInstallable, install } = usePwaInstall()
  const { handleCreate } = useCubeActions()
  const pathname = usePathname() ?? ''
  const isSolving = useTimerStore((store) => store.isSolving)
  const [hash, setHash] = useState<string>('')
  const { menuRef, indicator } = useActiveIndicator<HTMLDivElement>([pathname, hash, state])

  const scrollRef = useRef<HTMLDivElement>(null)
  const [showScrollHint, setShowScrollHint] = useState(false)

  useEffect(() => {
    const updateHash = () => setHash(window.location.hash || '')
    updateHash()
    window.addEventListener('hashchange', updateHash)
    return () => window.removeEventListener('hashchange', updateHash)
  }, [])

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    const update = () => setShowScrollHint(el.scrollHeight - el.scrollTop - el.clientHeight > 8)
    update()
    el.addEventListener('scroll', update, { passive: true })
    const ro = new ResizeObserver(update)
    ro.observe(el)
    if (menuRef.current) ro.observe(menuRef.current)
    return () => {
      el.removeEventListener('scroll', update)
      ro.disconnect()
    }
  }, [menuRef])

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
                    paused={isSolving}
                    transition={{ duration: 0.2, ease: 'easeInOut' }}
                    className={'text-xs text-muted-foreground p-0'}
                  />
                </div>
              ) : null}
            </Link>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent
        ref={scrollRef}
        className="group-data-[collapsible=icon]:overflow-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
      >
        <div ref={menuRef} className="relative isolate">
          {!isMobile && indicator && (
            <motion.div
              className="absolute top-0 left-0 rounded-md bg-sidebar-accent pointer-events-none -z-10"
              style={{ width: indicator.width, height: indicator.height }}
              initial={false}
              animate={{ x: indicator.left, y: indicator.top }}
              transition={INDICATOR_SPRING}
            />
          )}
          <NavMain items={data.platform} label={t('NavMain.platform')} />
          <NavMain items={data.training} label={t('NavMain.training')} />
          <NavMain items={data.community} label={t('NavMain.community')} />
          <NavMain items={data.multiplayer} label={t('NavMain.multiplayer')} />
        </div>

        <div className="pointer-events-none sticky bottom-0 z-10 -mt-7 flex h-7 items-end justify-center group-data-[collapsible=icon]:hidden">
          <motion.span
            initial={false}
            animate={showScrollHint ? { opacity: [0.25, 0.85, 0.25], y: [0, 2, 0] } : { opacity: 0, y: 0 }}
            transition={showScrollHint ? { duration: 1.6, repeat: Infinity, ease: 'easeInOut' } : { duration: 0.2 }}
          >
            <ChevronDown className="size-4 text-muted-foreground" />
          </motion.span>
        </div>
      </SidebarContent>
      <SidebarFooter className="group-data-[collapsible=icon]:hidden">
        <SidebarActivity />
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
        <div className="flex items-center justify-center gap-1">
          <a
            href="https://github.com/bryanlundberg/NexusTimer"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
            className="flex size-7 items-center justify-center rounded-md text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
          >
            <GithubIcon size={16} />
          </a>
          <a
            href="https://discord.gg/eCgTKcavec"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Discord"
            className="flex size-7 items-center justify-center rounded-md text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
          >
            <DiscordIcon size={16} />
          </a>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
