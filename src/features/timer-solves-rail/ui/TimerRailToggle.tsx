'use client'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { PanelRightClose, PanelRightOpen } from 'lucide-react'
import { useTimerRailStore } from '@/features/timer-solves-rail/model/useTimerRailStore'
import { useTranslations } from 'next-intl'
import { Kbd } from '@/components/ui/kbd'
import { useIsShortcutFree } from '@/features/timer/model/useIsShortcutFree'

export default function TimerRailToggle() {
  const isOpen = useTimerRailStore((state) => state.isOpen)
  const toggle = useTimerRailStore((state) => state.toggle)
  const t = useTranslations('Index.SolvesRail')
  const isShortcutFree = useIsShortcutFree('KeyH')

  return (
    <TooltipProvider delayDuration={100}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            data-testid="timer-rail-toggle"
            variant="ghost"
            className="hidden size-9 pointer-coarse:size-10 md:inline-flex ms-auto"
            onClick={toggle}
            aria-pressed={isOpen}
            aria-label={isOpen ? t('hide') : t('show')}
          >
            {isOpen ? <PanelRightClose size={16} /> : <PanelRightOpen size={16} />}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p className="flex items-center gap-2">
            {isOpen ? t('hide') : t('show')}
            {isShortcutFree && <Kbd>H</Kbd>}
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
