'use client'

import { RefreshCw } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { cn } from '@/shared/lib/utils'

interface LeaderboardRefreshBadgeProps {
  remainingMs: number | null
}

const formatCountdown = (ms: number) => {
  const totalSeconds = Math.ceil(ms / 1000)
  return `${Math.floor(totalSeconds / 60)}:${String(totalSeconds % 60).padStart(2, '0')}`
}

export default function LeaderboardRefreshBadge({ remainingMs }: LeaderboardRefreshBadgeProps) {
  const t = useTranslations('Index.LeaderboardsPage')

  if (remainingMs === null) return null

  const isRefreshing = remainingMs === 0

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span className="inline-flex shrink-0 items-center gap-1.5 border border-border/60 bg-card/40 px-2 py-1 font-display text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
          <RefreshCw className={cn('size-3 shrink-0', isRefreshing && 'animate-spin')} aria-hidden />
          {isRefreshing ? (
            t('refreshing')
          ) : (
            <span className="tabular-nums">{t('next-refresh', { time: formatCountdown(remainingMs) })}</span>
          )}
        </span>
      </TooltipTrigger>
      <TooltipContent>{t('refresh-hint')}</TooltipContent>
    </Tooltip>
  )
}
