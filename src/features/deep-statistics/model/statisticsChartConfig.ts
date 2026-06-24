import { useTranslations } from 'next-intl'
import { Activity, Clock, Hash, Percent, Sigma, Target, Trophy } from 'lucide-react'
import { DeepStatistics, StatisticScope } from '@/shared/types/statistics'
import formatTime from '@/shared/lib/formatTime'

export type ColumnGroup = 'personal' | 'cube'

export interface ColumnDef {
  key: string
  scope: StatisticScope
  label: string
  tooltip: string
  group: ColumnGroup
}

export interface RowDef {
  label: string
  loadingKey: string
  highlight?: boolean
  icon: React.ComponentType<{ className?: string }>
  getValue: (scope: StatisticScope) => string | number
}

export const STICKY_CELL_BASE = 'sticky left-0 z-10 bg-background border-r border-border'
export const GROUP_DIVIDER_LEFT = 'border-l border-border'
export const GROUP_BG: Record<ColumnGroup, string> = {
  personal: 'bg-muted/30 dark:bg-transparent',
  cube: 'bg-primary/[0.04] dark:bg-primary/[0.025]'
}
export const GROUP_HEADER_BG: Record<ColumnGroup, string> = {
  personal: 'bg-muted',
  cube: 'bg-primary/10 dark:bg-primary/15'
}

export function useStatisticsColumns(): ColumnDef[] {
  const t = useTranslations('Index')
  return [
    {
      key: 'global',
      scope: 'global',
      label: t('StatsPage.global'),
      tooltip: t('StatsPage.global-tooltip'),
      group: 'personal'
    },
    {
      key: 'sessions',
      scope: 'session',
      label: t('StatsPage.sessions'),
      tooltip: t('StatsPage.sessions-tooltip'),
      group: 'personal'
    },
    {
      key: 'cube-all',
      scope: 'cubeAll',
      label: t('StatsPage.cube-all'),
      tooltip: t('StatsPage.cube-all-tooltip'),
      group: 'cube'
    },
    {
      key: 'cube-session',
      scope: 'cubeSession',
      label: t('StatsPage.cube-session'),
      tooltip: t('StatsPage.cube-session-tooltip'),
      group: 'cube'
    }
  ]
}

export function useStatisticsRows(statistics: DeepStatistics): RowDef[] {
  const t = useTranslations('Index')
  return [
    {
      label: 'Ao5',
      loadingKey: 'stats',
      icon: Sigma,
      getValue: (scope) => (statistics.stats[scope].ao5 === 0 ? '--' : formatTime(statistics.stats[scope].ao5))
    },
    {
      label: 'Ao12',
      loadingKey: 'stats',
      icon: Sigma,
      getValue: (scope) => (statistics.stats[scope].ao12 === 0 ? '--' : formatTime(statistics.stats[scope].ao12))
    },
    {
      label: 'Ao50',
      loadingKey: 'stats',
      icon: Sigma,
      getValue: (scope) => (statistics.stats[scope].ao50 === 0 ? '--' : formatTime(statistics.stats[scope].ao50))
    },
    {
      label: 'Ao100',
      loadingKey: 'stats',
      icon: Sigma,
      getValue: (scope) => (statistics.stats[scope].ao100 === 0 ? '--' : formatTime(statistics.stats[scope].ao100))
    },
    {
      label: 'Ao1000',
      loadingKey: 'stats',
      icon: Sigma,
      getValue: (scope) => (statistics.stats[scope].ao1000 === 0 ? '--' : formatTime(statistics.stats[scope].ao1000))
    },
    {
      label: t('StatsPage.best-time'),
      loadingKey: 'best',
      icon: Trophy,
      getValue: (scope) => (statistics.best[scope] > 0 ? formatTime(statistics.best[scope]) : '--')
    },
    {
      label: t('StatsPage.average'),
      loadingKey: 'average',
      icon: Target,
      getValue: (scope) => (statistics.average[scope] === 0 ? '--' : formatTime(statistics.average[scope]))
    },
    {
      label: t('HomePage.deviation'),
      loadingKey: 'deviation',
      icon: Activity,
      getValue: (scope) => (statistics.deviation[scope] === 0 ? '--' : formatTime(statistics.deviation[scope]))
    },
    {
      label: t('StatsPage.time-spent'),
      loadingKey: 'timeSpent',
      icon: Clock,
      getValue: (scope) => statistics.timeSpent[scope]
    },
    {
      label: t('StatsPage.success-rate'),
      loadingKey: 'successRate',
      icon: Percent,
      getValue: (scope) => (statistics.successRate[scope] === '' ? '--' : statistics.successRate[scope] + '%')
    },
    {
      label: t('StatsPage.counter'),
      loadingKey: 'counter',
      icon: Hash,
      getValue: (scope) => (statistics.counter[scope] === 0 ? '--' : statistics.counter[scope])
    }
  ]
}
