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
 * On mobile only the active group is shown → 2 tracks: [metric label] [active group block].
 * From md+ both groups are shown → 3 tracks: [metric label] [Personal] [Cube].
 * Each group block internally holds its 2 scope columns.
 */
export const ROW_GRID =
  'grid grid-cols-[minmax(0,1.05fr)_minmax(0,3fr)] md:grid-cols-[minmax(0,1.05fr)_minmax(0,1.5fr)_minmax(0,1.5fr)] gap-1.5 sm:gap-2.5 items-stretch'

/**
 * Visibility helper: hide the non-active group on mobile, always show from md+.
 * The md display type must match the element's own layout — group blocks and
 * column labels are grids, so restoring `md:grid` (not `md:block`) keeps their
 * inner scope columns side by side instead of stacking into a vertical column.
 */
export function groupVisibility(
  group: ColumnGroup,
  activeGroup: ColumnGroup,
  mdDisplay: 'grid' | 'block' = 'grid'
): string {
  return group === activeGroup ? '' : `hidden md:${mdDisplay}`
}

/** Inner grid for the 2 scope columns living inside a group block. */
export const GROUP_INNER_GRID = 'grid grid-cols-2'

/**
 * Soft rounded background for a group block, with a dimmed opacity when inactive.
 */
const GROUP_BLOCK_BASE = 'rounded-sm bg-muted/70 dark:bg-muted/25'

export function groupBlockClass(group: ColumnGroup, activeGroup: ColumnGroup): string {
  return group === activeGroup ? GROUP_BLOCK_BASE : `${GROUP_BLOCK_BASE} opacity-35`
}

/** Group chip styles: neutral for both, inactive dimmed with opacity. */
const GROUP_CHIP_BASE = 'bg-muted text-muted-foreground'

export function groupChipClass(group: ColumnGroup, activeGroup: ColumnGroup): string {
  return group === activeGroup ? GROUP_CHIP_BASE : `${GROUP_CHIP_BASE} opacity-35`
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
