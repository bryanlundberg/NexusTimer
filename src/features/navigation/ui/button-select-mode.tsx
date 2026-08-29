'use client'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { useTimerStore } from '@/shared/model/timer/useTimerStore'
import { useTranslations } from 'next-intl'
import { useEffect, useRef } from 'react'
import type { AnimatedIconHandle } from '@/components/ui/types'
import { TimerMode } from '@/features/timer/model/enums'
import { useNexusConnectStore } from '@/features/nexus-connect/model/useNexusConnectStore'
import genId from '@/shared/lib/genId'
import LayoutDashboardIcon from '@/components/ui/layout-dashboard-icon'
import { cn } from '@/shared/lib/utils'
import { Bluetooth, Cable, Check, ChevronDown, Gamepad2, Keyboard, Smartphone, Timer } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

interface ModeConfig {
  value: TimerMode
  tKey: string
  testId: string
  icon: LucideIcon
  requires?: string[]
  badge?: string
  comingSoon?: boolean
}

const VIRTUAL_ONLY_CATEGORIES: string[] = ['2x2 Virtual', '3x3 Virtual']

const MODES: ModeConfig[] = [
  { value: TimerMode.NORMAL, tKey: 'normal', testId: 'mode-normal', icon: Timer },
  { value: TimerMode.MANUAL, tKey: 'manual', testId: 'mode-manual', icon: Keyboard },
  { value: TimerMode.STACKMAT, tKey: 'stackmat', testId: 'mode-stackmat', icon: Cable },
  {
    value: TimerMode.STACKMAT_BLUETOOTH,
    tKey: 'stackmat-bluetooth',
    testId: 'mode-stackmat-bluetooth',
    icon: Bluetooth,
    comingSoon: true
  },
  {
    value: TimerMode.KEYBOARD_STACKMAT,
    tKey: 'keyboard-stackmat',
    testId: 'mode-keyboard-stackmat',
    icon: Keyboard
  },
  {
    value: TimerMode.VIRTUAL,
    tKey: 'virtual',
    testId: 'mode-virtual',
    icon: Gamepad2,
    requires: VIRTUAL_ONLY_CATEGORIES,
    badge: '2x2 · 3x3 Virtual'
  },
  { value: TimerMode.SMART_CUBE, tKey: 'smart', testId: 'mode-smart', icon: Bluetooth, requires: ['3x3'] },
  { value: TimerMode.NEXUS_CONNECT, tKey: 'nexus-connect', testId: 'mode-nexus-connect', icon: Smartphone }
]

export default function ButtonSelectMode() {
  const timerMode = useTimerStore((state) => state.timerMode)
  const setTimerMode = useTimerStore((state) => state.setTimerMode)
  const selectedCube = useTimerStore((state) => state.selectedCube)
  const t = useTranslations('Index')
  const connectId = useNexusConnectStore((state) => state.nexusConnectId)
  const setConnectId = useNexusConnectStore((state) => state.setNexusConnectId)
  const iconRef = useRef<AnimatedIconHandle>(null)

  useEffect(() => {
    if (!selectedCube) return
    const isVirtualOnly = VIRTUAL_ONLY_CATEGORIES.includes(selectedCube.category)

    if (isVirtualOnly) {
      if (timerMode !== TimerMode.VIRTUAL) setTimerMode(TimerMode.VIRTUAL)
      return
    }

    if (timerMode === TimerMode.VIRTUAL) {
      setTimerMode(TimerMode.NORMAL)
    }
    if (selectedCube.category !== '3x3' && timerMode === TimerMode.SMART_CUBE) {
      setTimerMode(TimerMode.NORMAL)
    }
  }, [selectedCube, setTimerMode, timerMode])

  const handleNexusConnectClick = () => {
    if (!connectId) setConnectId(genId())
  }

  const isModeDisabled = (mode: ModeConfig) => {
    if (mode.comingSoon) return true
    if (selectedCube && VIRTUAL_ONLY_CATEGORIES.includes(selectedCube.category)) {
      return mode.value !== TimerMode.VIRTUAL
    }
    return !!mode.requires && (!selectedCube || !mode.requires.includes(selectedCube.category))
  }

  const activeMode = MODES.find((mode) => mode.value === timerMode) ?? MODES[0]

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          data-testid={'button-select-mode'}
          variant="ghost"
          className="group py-0 px-3 gap-2"
          disabled={!selectedCube}
          onMouseEnter={() => iconRef.current?.startAnimation()}
          onMouseLeave={() => iconRef.current?.stopAnimation()}
        >
          <LayoutDashboardIcon ref={iconRef} />
          <span className="hidden md:inline-block max-w-28 truncate text-sm font-medium">
            {t(`HomePage.modes.${activeMode.tKey}`)}
          </span>
          <ChevronDown className="hidden md:block size-3.5 opacity-60 transition-transform duration-200 group-data-[state=open]:rotate-180" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-72" innerClassName="p-px">
        <div className="px-3 pt-2.5 pb-2">
          <p className="text-xs font-semibold uppercase tracking-wider leading-none">{t('HomePage.mode')}</p>
          <p className="mt-1.5 text-xs text-muted-foreground">{t('HomePage.modes-subtitle')}</p>
        </div>
        <DropdownMenuSeparator className="mx-0 my-0" />
        <DropdownMenuRadioGroup
          value={timerMode}
          onValueChange={(value) => setTimerMode(value as TimerMode)}
          className="flex flex-col py-1"
        >
          {MODES.map((mode) => {
            const isActive = timerMode === mode.value
            const isDisabled = isModeDisabled(mode)
            const Icon = mode.icon

            return (
              <DropdownMenuRadioItem
                key={mode.value}
                value={mode.value}
                data-testid={mode.testId}
                disabled={isDisabled}
                onClick={mode.value === TimerMode.NEXUS_CONNECT ? handleNexusConnectClick : undefined}
                className={cn(
                  'group/mode flex cursor-pointer items-start gap-3 rounded-none px-3 py-2 transition-colors [&>span]:hidden',
                  isActive && 'bg-primary/10 shadow-[inset_2px_0_0_var(--primary)]'
                )}
              >
                <div
                  className={cn(
                    'chip-notch flex size-9 shrink-0 items-center justify-center transition-colors',
                    isActive
                      ? 'bg-primary/20 text-primary'
                      : 'bg-muted/60 text-muted-foreground group-focus/mode:bg-muted'
                  )}
                >
                  <Icon className="size-4" />
                </div>
                <div className="flex min-w-0 grow flex-col gap-0.5">
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm font-medium leading-tight">{t(`HomePage.modes.${mode.tKey}`)}</span>
                    {(mode.badge || mode.requires) && (
                      <span className="rounded-none border border-border bg-muted px-1 py-px font-mono text-[10px] font-medium leading-tight tracking-wide text-muted-foreground">
                        {mode.badge ?? mode.requires!.join(' · ')}
                      </span>
                    )}
                    {mode.comingSoon && (
                      <span className="rounded-none border border-primary/40 bg-primary/10 px-1 py-px font-mono text-[10px] font-medium leading-tight tracking-wide text-primary uppercase">
                        {t('HomePage.modes-soon')}
                      </span>
                    )}
                  </div>
                  <span className="text-xs leading-snug text-muted-foreground">
                    {t(`HomePage.modes-desc.${mode.tKey}`)}
                  </span>
                </div>
                <Check
                  className={cn(
                    'size-4 shrink-0 self-center text-primary transition-opacity duration-150',
                    isActive ? 'opacity-100' : 'opacity-0'
                  )}
                />
              </DropdownMenuRadioItem>
            )
          })}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
