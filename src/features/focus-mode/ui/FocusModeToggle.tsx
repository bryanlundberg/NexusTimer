'use client'

import { Focus } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { useFocusModeStore } from '@/features/focus-mode/model/useFocusModeStore'

export default function FocusModeToggle() {
  const enter = useFocusModeStore((store) => store.enter)
  const t = useTranslations('Index.HomePage')

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          onClick={enter}
          aria-label={t('focus-mode')}
          data-testid="focus-mode-toggle"
        >
          <Focus />
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>{t('focus-mode')}</p>
      </TooltipContent>
    </Tooltip>
  )
}
