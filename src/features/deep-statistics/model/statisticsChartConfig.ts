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

/**
 * Shared grid template so the header and every row stay perfectly aligned.
 * A row is 3 tracks: [metric label] [Personal group block] [Cube group block].
 * Each group block internally holds its 2 scope columns.
 */
export const ROW_GRID =
  'grid grid-cols-[minmax(0,1.05fr)_minmax(0,1.5fr)_minmax(0,1.5fr)] gap-1.5 sm:gap-2.5 items-stretch'

/** Inner grid for the 2 scope columns living inside a group block. */
export const GROUP_INNER_GRID = 'grid grid-cols-2'

/** Soft rounded background for each group block (no hard table borders). */
export const GROUP_BLOCK: Record<ColumnGroup, string> = {
  personal: 'rounded-xl bg-muted/40 dark:bg-muted/25',
  cube: 'rounded-xl bg-primary/[0.06] dark:bg-primary/[0.07] ring-1 ring-inset ring-primary/10'
}

/** Group chip styles used in the header. */
export const GROUP_CHIP: Record<ColumnGroup, string> = {
  personal: 'bg-muted text-muted-foreground',
  cube: 'bg-primary/15 text-primary'
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
