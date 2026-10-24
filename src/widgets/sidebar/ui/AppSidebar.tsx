'use client'

import * as React from 'react'
import { useRef, useSyncExternalStore } from 'react'
import { MonitorDown } from 'lucide-react'
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
import { Link } from '@/shared/config/i18n/navigation'
import { useTranslations } from 'next-intl'
import { NavMain } from '@/widgets/sidebar/ui/nav-main'
import { SidebarActivity } from '@/widgets/sidebar/ui/sidebar-activity'
import { SidebarScrollFade } from '@/widgets/sidebar/ui/sidebar-scroll-fade'
import { BrandMark } from '@/widgets/sidebar/ui/brand-mark'
import { SmartCubeIndicator } from '@/features/smart-cube/ui/SmartCubeIndicator'
import { SmartCubeIndicatorCompact } from '@/features/smart-cube/ui/SmartCubeIndicatorCompact'
import { useFocusModeStore } from '@/features/focus-mode/model/useFocusModeStore'
import { useOverscrollStretch } from '@/shared/model/useOverscrollStretch'
import { useSidebarNav } from '@/widgets/sidebar/model/useSidebarNav'

const subscribeNoop = () => () => {}
const getIsMac = () => /Mac|iPhone|iPad/.test(navigator.userAgent)
const getIsMacServer = () => false

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { open, openMobile, setOpenMobile, isMobile, toggleSidebar } = useSidebar()
  const isMac = useSyncExternalStore(subscribeNoop, getIsMac, getIsMacServer)
  const t = useTranslations('Index')
  const { isInstallable, install } = usePwaInstall()
  const isFocusMode = useFocusModeStore((store) => store.isFocusMode)
  const menuRef = useRef<HTMLDivElement>(null)
  const sections = useSidebarNav()

  const scrollRef = useRef<HTMLDivElement>(null)

  useOverscrollStretch(scrollRef, menuRef)

  if (isFocusMode) return null

  return (
    <Sidebar collapsible={'icon'} {...props}>
      <SidebarHeader className="relative h-14 shrink-0 justify-center border-b border-sidebar-border py-0">
        <SidebarMenu>
          <SidebarMenuItem>
            <Link href={'/app'} className="flex items-center gap-2" onClick={() => isMobile && setOpenMobile(false)}>
              <BrandMark />
              {open || openMobile ? (
                <span className="min-w-0 flex-1 truncate font-brand text-base leading-tight font-bold tracking-tight">
                  <span className="text-foreground">NEXUSTIMER</span>
                  <span className="text-muted-foreground">.COM</span>
                </span>
              ) : null}
            </Link>
          </SidebarMenuItem>
        </SidebarMenu>
        <SidebarScrollFade edge="top" scrollRef={scrollRef} contentRef={menuRef} />
      </SidebarHeader>
      <SidebarContent
        ref={scrollRef}
        className="group-data-[collapsible=icon]:overflow-auto pointer-coarse:overscroll-y-none [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
      >
        <div ref={menuRef} className="relative isolate">
          {sections.map((section) => (
            <NavMain key={section.key} items={section.items} label={section.label} />
          ))}
        </div>
      </SidebarContent>
      <SidebarFooter className="relative">
        <SidebarScrollFade edge="bottom" scrollRef={scrollRef} contentRef={menuRef} />
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
              className="group flex items-center gap-2 border bg-background/60 px-3 py-2 text-xs font-medium cursor-pointer transition-colors hover:border-primary hover:bg-accent"
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
                className="flex size-7 items-center justify-center text-muted-foreground transition-colors hover:bg-sidebar-accent hover:text-foreground"
              >
                <GithubIcon size={16} />
              </a>
              <a
                href="https://discord.gg/eCgTKcavec"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Discord"
                className="flex size-7 items-center justify-center text-muted-foreground transition-colors hover:bg-[#5865F2]/12 hover:text-[#5865F2]"
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
                <kbd className="flex h-5 min-w-5 items-center justify-center border border-sidebar-border bg-background/50 px-1 font-mono text-[10px] leading-none">
                  {isMac ? '⌘' : 'Ctrl'}
                </kbd>
                <kbd className="flex h-5 min-w-5 items-center justify-center border border-sidebar-border bg-background/50 px-1 font-mono text-[10px] leading-none">
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
