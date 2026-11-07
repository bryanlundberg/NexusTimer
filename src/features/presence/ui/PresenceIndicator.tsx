'use client'

import { useTranslations } from 'next-intl'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { PresenceDot } from '@/features/presence/ui/PresenceDot'
import type { PresenceView } from '@/features/presence/model/usePresence'

interface Props {
  state: PresenceView
  className?: string
  dotClassName?: string
}

export function PresenceIndicator({ state, className, dotClassName }: Props) {
  const t = useTranslations('Index.Presence')
  const label = state === 'unknown' ? null : t(state)

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span role="img" aria-label={label ?? undefined} className={className}>
          <PresenceDot state={state} className={dotClassName} />
        </span>
      </TooltipTrigger>
      {label && <TooltipContent>{label}</TooltipContent>}
    </Tooltip>
  )
}
