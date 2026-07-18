'use client'

import { useTranslations } from 'next-intl'
import type { Solve } from '@/entities/solve/model/types'
import StatisticsMessage from '@/features/deep-statistics/ui/StatisticsMessage'
import { computeSmartCubeStats } from '@/features/smart-cube-stats/lib/computeSmartCubeStats'
import SmartStatCards from './SmartStatCards'
import PhaseLayersLineChart from './PhaseLayersLineChart'

interface SmartCubeViewProps {
  solves: Solve[] | undefined
}

export default function SmartCubeView({ solves }: SmartCubeViewProps) {
  const t = useTranslations('Index.StatsPage')
  const stats = computeSmartCubeStats(solves)

  if (stats.count === 0) {
    return <StatisticsMessage title={t('smart-empty')} description={t('smart-empty-description')} />
  }

  const hasPhases = stats.phases.length > 0 && stats.series.length > 0

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-4">
      <SmartStatCards stats={stats} />
      {hasPhases && <PhaseLayersLineChart series={stats.series} phases={stats.phases} />}
    </div>
  )
}
