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
import { useOverlayStore } from '@/shared/model/overlay-store/useOverlayStore'
import ConnectQR from '@/features/nexus-connect/ui/ConnectQR'
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
  const open = useOverlayStore((state) => state.open)
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

  const handleNexusConnectClick = async () => {
    const id = connectId || genId()
    if (!connectId) setConnectId(id)

    open({
      id: 'nexus-connect-info',
      component: <ConnectQR />,
      metadata: {}
    })
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
      <DropdownMenuContent align="end" className="w-72 p-0">
        <div className="px-3 pt-2.5 pb-2">
          <p className="text-sm font-semibold leading-none">{t('HomePage.mode')}</p>
          <p className="mt-1 text-xs text-muted-foreground">{t('HomePage.modes-subtitle')}</p>
        </div>
        <DropdownMenuSeparator className="my-0" />
        <DropdownMenuRadioGroup
          value={timerMode}
          onValueChange={(value) => setTimerMode(value as TimerMode)}
          className="p-1.5 flex flex-col gap-0.5"
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
                  'group/mode flex cursor-pointer items-start gap-3 rounded-md p-2 pl-2 pr-2.5 transition-colors [&>span]:hidden',
                  isActive && 'bg-accent/50'
                )}
              >
                <div
                  className={cn(
                    'flex size-9 shrink-0 items-center justify-center rounded-lg border transition-colors',
                    isActive ? 'border-primary/40 bg-primary/10' : 'border-border bg-muted/40 group-focus/mode:bg-muted'
                  )}
                >
                  <Icon className={cn('size-4', isActive ? 'text-primary' : 'text-muted-foreground')} />
                </div>
                <div className="flex min-w-0 grow flex-col gap-0.5">
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm font-medium leading-tight">{t(`HomePage.modes.${mode.tKey}`)}</span>
                    {(mode.badge || mode.requires) && (
                      <span className="rounded-sm border border-border bg-muted px-1 py-px font-mono text-[10px] font-medium leading-tight text-muted-foreground">
                        {mode.badge ?? mode.requires!.join(' · ')}
                      </span>
                    )}
                    {mode.comingSoon && (
                      <span className="rounded-sm border border-primary/40 bg-primary/10 px-1 py-px font-mono text-[10px] font-medium leading-tight text-primary">
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
