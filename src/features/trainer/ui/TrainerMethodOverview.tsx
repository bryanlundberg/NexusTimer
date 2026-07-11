'use client'

import { useMemo } from 'react'
import { useTranslations } from 'next-intl'
import { Hash, Timer, BookOpenCheck, Grid3x3, TrendingUp, TrendingDown, BarChart3 } from 'lucide-react'
import type { TrainerMethodStatsDoc } from '@/entities/trainer-stats/model/types'
import type { ALGORITHM_SET } from '@/shared/const/algorithms-sets'
import { computeMethodOverview } from '@/features/trainer/lib/methodOverview'
import { useTrainerLearned } from '@/features/trainer/model/useTrainerLearned'
import { formatMs } from '@/features/trainer/lib/trainerUtils'
import TrainerStatCard from './TrainerStatCard'
import TrainerCaseRow from './TrainerCaseRow'
import TrainerCasePaceChart from './TrainerCasePaceChart'

interface TrainerMethodOverviewProps {
  set: ALGORITHM_SET
  stats: TrainerMethodStatsDoc | null
  targetMs: number
  isLoading?: boolean
}

export default function TrainerMethodOverview({ set, stats, targetMs, isLoading }: TrainerMethodOverviewProps) {
  const t = useTranslations('Index.TrainerHistoryPage.overview')
  const tStats = useTranslations('Index.TrainerPage.stats')
  const { learnedIds } = useTrainerLearned(set.slug)

  const { totalSolves, avgMs, practicedCount, ranked, best, worst } = useMemo(
    () => computeMethodOverview(stats, set),
    [stats, set]
  )

  if (isLoading) {
    return <div className="h-24 rounded-lg bg-muted/30 animate-pulse" />
  }

  if (totalSolves === 0) {
    return (
      <div className="px-3 py-6 text-center">
        <p className="text-xs text-muted-foreground">{t('empty')}</p>
      </div>
    )
  }

  const vizDefaults = set.virtualization as Record<string, unknown>

  return (
    <div className="flex flex-col gap-2">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-4 gap-y-3 py-1">
        <TrainerStatCard icon={Hash} label={t('executions')} value={String(totalSolves)} accent="border-cube-blue/70" />
        <TrainerStatCard
          icon={Timer}
          label={t('average')}
          value={avgMs !== null ? `${formatMs(avgMs)}s` : '—'}
          accent="border-cube-yellow/70"
        />
        <TrainerStatCard
          icon={BookOpenCheck}
          label={tStats('algorithmsLearned')}
          value={`${learnedIds.length}/${set.algorithms.length}`}
          accent="border-cube-green/70"
        />
        <TrainerStatCard
          icon={Grid3x3}
          label={t('coverage')}
          value={`${practicedCount}/${set.algorithms.length}`}
          sub={`${Math.round((practicedCount / Math.max(set.algorithms.length, 1)) * 100)}%`}
          accent="border-cube-orange/70"
        />
      </div>

      {(best.length > 0 || worst.length > 0) && (
        <div className="grid sm:grid-cols-2 gap-x-6 gap-y-4 pt-2">
          {best.length > 0 && (
            <div className="flex flex-col gap-1">
              <span className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                <TrendingUp className="size-3" />
                {t('bestCase')}
              </span>
              <div className="flex flex-col divide-y divide-border/40">
                {best.map((r) => (
                  <TrainerCaseRow
                    key={r.algCase.id}
                    ranked={r}
                    puzzle={set.puzzle}
                    vizDefaults={vizDefaults}
                    targetMs={targetMs}
                  />
                ))}
              </div>
            </div>
          )}

          {worst.length > 0 && (
            <div className="flex flex-col gap-1">
              <span className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                <span className="h-3.5 w-1 rounded-full bg-cube-orange" aria-hidden />
                <TrendingDown className="size-3" />
                {t('focusCases')}
              </span>
              <div className="flex flex-col divide-y divide-border/40">
                {worst.map((r) => (
                  <TrainerCaseRow
                    key={r.algCase.id}
                    ranked={r}
                    puzzle={set.puzzle}
                    vizDefaults={vizDefaults}
                    targetMs={targetMs}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {ranked.length >= 2 && (
        <div className="flex flex-col gap-2 pt-3">
          <span className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            <span className="h-3.5 w-1 rounded-full bg-cube-yellow" aria-hidden />
            <BarChart3 className="size-3" />
            {t('coverage')}
          </span>
          <TrainerCasePaceChart ranked={ranked} puzzle={set.puzzle} vizDefaults={vizDefaults} />
        </div>
      )}
    </div>
  )
}
