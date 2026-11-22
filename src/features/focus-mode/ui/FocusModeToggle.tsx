'use client'

import { Focus } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { useFocusModeStore } from '@/features/focus-mode/model/useFocusModeStore'
import { Kbd } from '@/components/ui/kbd'
import { useIsShortcutFree } from '@/features/timer/model/useIsShortcutFree'

export default function FocusModeToggle() {
  const enter = useFocusModeStore((store) => store.enter)
  const t = useTranslations('Index.HomePage')
  const isShortcutFree = useIsShortcutFree('KeyF')

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="size-10 pointer-coarse:size-11"
          onClick={enter}
          aria-label={t('focus-mode')}
          data-testid="focus-mode-toggle"
        >
          <Focus className="size-5" />
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <p className="flex items-center gap-2">
          {t('focus-mode')}
          {isShortcutFree && <Kbd>F</Kbd>}
        </p>
      </TooltipContent>
    </Tooltip>
  )
}
