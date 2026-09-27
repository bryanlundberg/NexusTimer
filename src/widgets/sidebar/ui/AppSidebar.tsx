'use client'

import * as React from 'react'
import { useEffect, useMemo, useRef, useState, useSyncExternalStore } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import { useActiveIndicator } from '@/widgets/sidebar/model/useActiveIndicator'
import { ChevronDown, MonitorDown } from 'lucide-react'
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
import { Link, usePathname } from '@/shared/config/i18n/navigation'
import { useTranslations } from 'next-intl'
import { RotatingText } from '@/components/ui/shadcn-io/rotating-text'
import { NavMain } from '@/widgets/sidebar/ui/nav-main'
import { SidebarBgEffect } from '@/widgets/sidebar/ui/sidebar-bg-effect'
import { SidebarActivity } from '@/widgets/sidebar/ui/sidebar-activity'
import { SmartCubeIndicator } from '@/features/smart-cube/ui/SmartCubeIndicator'
import { SmartCubeIndicatorCompact } from '@/features/smart-cube/ui/SmartCubeIndicatorCompact'
import { useTimerStore } from '@/shared/model/timer/useTimerStore'
import { useFocusModeStore } from '@/features/focus-mode/model/useFocusModeStore'
import { INDICATOR_SPRING } from '@/shared/lib/motion'
import { SECTION_ACCENT, SECTION_KEYS, useSidebarNav, type SectionKey } from '@/widgets/sidebar/model/useSidebarNav'

const subscribeNoop = () => () => {}
const getIsMac = () => /Mac|iPhone|iPad/.test(navigator.userAgent)
const getIsMacServer = () => false

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { open, openMobile, setOpenMobile, isMobile, state, toggleSidebar } = useSidebar()
  const isMac = useSyncExternalStore(subscribeNoop, getIsMac, getIsMacServer)
  const t = useTranslations('Index')
  const { isInstallable, install } = usePwaInstall()
  const pathname = usePathname() ?? ''
  const isSolving = useTimerStore((store) => store.isSolving)
  const isFocusMode = useFocusModeStore((store) => store.isFocusMode)
  const [hash, setHash] = useState<string>('')
  const { menuRef, indicator } = useActiveIndicator<HTMLDivElement>([pathname, hash, state])
  const sections = useSidebarNav()
  const reduceMotion = useReducedMotion()

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

  const activeSection = useMemo<SectionKey | null>(() => {
    const matches = (items: { url: string; items?: { url: string }[] }[]) =>
      items.some((it) => {
        const hit = (url: string) => !!url && (pathname === url || (url !== '/' && pathname.startsWith(url + '/')))
        return hit(it.url) || (it.items?.some((s) => hit(s.url.split('#')[0])) ?? false)
      })
    return sections.find((section) => matches(section.items))?.key ?? null
  }, [sections, pathname])
  const activeAccent = SECTION_ACCENT[activeSection ?? 'platform']

  if (isFocusMode) return null

  return (
    <Sidebar collapsible={'icon'} {...props}>
      <SidebarBgEffect accent={activeAccent} />
      <SidebarHeader className={'relative mt-2'}>
        <SidebarMenu>
          <SidebarMenuItem>
            <Link
              href={'/app'}
              className={`sidebar-glitch flex items-center gap-2`}
              onClick={() => isMobile && setOpenMobile(false)}
            >
              <div className="flex aspect-square size-8 items-center justify-center notch-tl-br [--ntlbr:8px] bg-sidebar-primary text-sidebar-primary-foreground">
                <Image src={'/logo.png'} alt={'logo'} width={32} height={32} className={`p-1.5 invert size-8`} />
              </div>
              {open || openMobile ? (
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="sidebar-glitch-text truncate font-brand text-base font-bold tracking-tight">
                    <span className="text-foreground">NEXUSTIMER</span>
                    <span className="text-muted-foreground">.COM</span>
                  </span>
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
                    paused={isSolving || !!reduceMotion}
                    transition={{ duration: 0.2, ease: 'easeInOut' }}
                    className={'text-xs text-muted-foreground p-0'}
                  />
                </div>
              ) : null}
            </Link>
          </SidebarMenuItem>
        </SidebarMenu>
        <div aria-hidden className="flex gap-1 px-1 pt-1 group-data-[collapsible=icon]:hidden">
          {SECTION_KEYS.map((key) => {
            const isActive = key === activeSection
            return (
              <span
                key={key}
                className="h-[3px] -skew-x-[35deg] transition-[flex-grow,opacity] duration-500 ease-(--ease-solve) motion-reduce:transition-none"
                style={{
                  backgroundColor: SECTION_ACCENT[key],
                  flexGrow: isActive ? 2.5 : 1,
                  opacity: isActive ? 1 : activeSection ? 0.25 : 0.45
                }}
              />
            )
          })}
        </div>
      </SidebarHeader>
      <SidebarContent
        ref={scrollRef}
        className="group-data-[collapsible=icon]:overflow-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
      >
        <div ref={menuRef} className="relative isolate">
          {!isMobile && indicator && (
            <motion.div
              className="nav-indicator pointer-events-none absolute top-0 left-0 -z-10"
              style={{
                width: indicator.width,
                height: indicator.height,
                backgroundColor: `color-mix(in oklch, ${activeAccent} 14%, var(--sidebar-accent))`
              }}
              initial={false}
              animate={{ x: indicator.left, y: indicator.top }}
              transition={INDICATOR_SPRING}
            >
              <span
                aria-hidden
                className="absolute top-1/2 left-0 h-4 w-0.5 -translate-y-1/2 transition-colors duration-300 group-data-[collapsible=icon]:hidden"
                style={{ backgroundColor: activeAccent }}
              />
            </motion.div>
          )}
          {sections.map((section) => (
            <NavMain key={section.key} items={section.items} label={section.label} accent={section.accent} />
          ))}
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
      <SidebarFooter className="relative">
        <div className="hidden group-data-[collapsible=icon]:block">
          <SmartCubeIndicatorCompact />
        </div>
        <div className="flex flex-col gap-2 group-data-[collapsible=icon]:hidden">
          <SmartCubeIndicator />
          <SidebarActivity />
          {isInstallable && (
            <button
              type="button"
              onClick={install}
              className="notch-bl-tr [--nblt:9px] group flex items-center gap-2 border bg-background/60 px-3 py-2 text-xs font-medium cursor-pointer transition-colors hover:border-primary hover:bg-accent"
            >
              <MonitorDown className="size-4 text-primary transition-transform group-hover:translate-y-0.5" />
              <span>{t('NavMain.install-app')}</span>
            </button>
          )}
          <div className="flex items-center justify-between gap-2 px-1">
            <div className="flex items-center gap-1">
              <a
                href="https://github.com/bryanlundberg/NexusTimer"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
                className="chip-notch chip-notch-sm flex size-7 items-center justify-center text-muted-foreground transition-colors hover:bg-sidebar-accent hover:text-foreground"
              >
                <GithubIcon size={16} />
              </a>
              <a
                href="https://discord.gg/eCgTKcavec"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Discord"
                className="chip-notch chip-notch-sm flex size-7 items-center justify-center text-muted-foreground transition-colors hover:bg-[#5865F2]/12 hover:text-[#5865F2]"
              >
                <DiscordIcon size={16} />
              </a>
            </div>
            {!isMobile && (
              <button
                type="button"
                onClick={toggleSidebar}
                aria-label={t('NavMain.toggle-sidebar')}
                aria-keyshortcuts={isMac ? 'Meta+B' : 'Control+B'}
                className="flex cursor-pointer items-center gap-1 text-muted-foreground transition-colors hover:text-foreground"
              >
                <kbd className="flex h-5 min-w-5 items-center justify-center rounded-[3px] border border-sidebar-border bg-background/50 px-1 font-mono text-[10px] leading-none">
                  {isMac ? '⌘' : 'Ctrl'}
                </kbd>
                <kbd className="flex h-5 min-w-5 items-center justify-center rounded-[3px] border border-sidebar-border bg-background/50 px-1 font-mono text-[10px] leading-none">
                  B
                </kbd>
              </button>
            )}
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
