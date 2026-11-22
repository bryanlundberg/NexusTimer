'use client'

import { X } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { cn } from '@/shared/lib/utils'
import { useFocusModeStore } from '@/features/focus-mode/model/useFocusModeStore'
import { useTimerStore } from '@/shared/model/timer/useTimerStore'
import { TimerStatus } from '@/features/timer/model/enums'
import { Kbd } from '@/components/ui/kbd'
import { useIsShortcutFree } from '@/features/timer/model/useIsShortcutFree'

export default function FocusModeExitButton() {
  const isFocusMode = useFocusModeStore((store) => store.isFocusMode)
  const exit = useFocusModeStore((store) => store.exit)
  const isSolving = useTimerStore((store) => store.isSolving)
  const timerStatus = useTimerStore((store) => store.timerStatus)
  const t = useTranslations('Index.HomePage')
  const isShortcutFree = useIsShortcutFree('KeyF')

  if (!isFocusMode) return null

  const isHidden = isSolving || timerStatus !== TimerStatus.IDLE

  return (
    <div
      className={cn(
        'fixed top-3 right-3 z-50 transition-opacity duration-150',
        isHidden ? 'opacity-0 pointer-events-none' : 'opacity-100'
      )}
    >
      <TooltipProvider delayDuration={250}>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="size-10 pointer-coarse:size-11"
              onClick={exit}
              aria-label={t('exit-focus-mode')}
              data-testid="focus-mode-exit"
            >
              <X className="size-5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p className="flex items-center gap-2">
              {t('exit-focus-mode')}
              {isShortcutFree && <Kbd>F</Kbd>}
            </p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  )
}
