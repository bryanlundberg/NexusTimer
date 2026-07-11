'use client'

import { useMemo } from 'react'
import { useTranslations } from 'next-intl'
import AlgorithmRender from '@/shared/ui/twisty/AlgorithmRender'
import { buildVizConfig, formatMs } from '@/features/trainer/lib/trainerUtils'
import type { RankedCase } from '@/features/trainer/lib/methodOverview'
import { cn } from '@/shared/lib/utils'

interface TrainerCaseRowProps {
  ranked: RankedCase
  puzzle: string
  vizDefaults?: Record<string, unknown>
  targetMs: number
}

export default function TrainerCaseRow({ ranked, puzzle, vizDefaults, targetMs }: TrainerCaseRowProps) {
  const t = useTranslations('Index.TrainerHistoryPage.overview')
  const vizConfig = useMemo(
    () => buildVizConfig(puzzle, ranked.algCase.algs?.[0]?.moves ?? '', vizDefaults),
    [puzzle, ranked.algCase, vizDefaults]
  )
  const onTarget = ranked.avgMs <= targetMs

  return (
    <div className="flex items-center gap-2.5 py-1.5">
      <div className="size-8 rounded-sm overflow-hidden bg-muted/30 flex items-center justify-center shrink-0">
        <AlgorithmRender config={vizConfig} width={32} height={32} />
      </div>
      <div className="flex flex-col min-w-0 flex-1">
        <span className="text-xs font-medium truncate">{ranked.algCase.name}</span>
        <span className="text-[10px] text-muted-foreground tabular-nums">
          {ranked.attempts} {t('attempts')}
        </span>
      </div>
      <span
        className={cn('text-sm font-semibold tabular-nums shrink-0', onTarget ? 'text-cube-green' : 'text-cube-orange')}
      >
        {formatMs(ranked.avgMs)}s
      </span>
    </div>
  )
}
