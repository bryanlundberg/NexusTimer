import { useTranslations } from 'next-intl'
import {
  BestTimeStatIcon,
  CounterStatIcon,
  DeviationStatIcon,
  MeanStatIcon,
  RollingAverageStatIcon,
  SuccessRateStatIcon,
  TimeSpentStatIcon
} from '@/components/ui/stats-icons'
import { DeepStatistics, StatisticScope } from '@/shared/types/statistics'
import formatTime from '@/shared/lib/formatTime'

export type ColumnGroup = 'personal' | 'cube'

export type CardComparison = 'record' | 'lower-better' | 'higher-better' | 'none'

export interface StatisticCardDef {
  key: string
  label: string
  icon: React.ComponentType<{ className?: string }>
  loadingKey: string
  comparison: CardComparison
  highlight?: boolean
  raw: (scope: StatisticScope) => number | null
  format: (scope: StatisticScope) => string
}

export interface StatisticCardGroup {
  key: string
  title: string
  cards: StatisticCardDef[]
}

export const GROUP_SCOPES: Record<ColumnGroup, { main: StatisticScope; session: StatisticScope }> = {
  personal: { main: 'global', session: 'session' },
  cube: { main: 'cubeAll', session: 'cubeSession' }
}

const AO_KEYS = ['ao5', 'ao12', 'ao50', 'ao100', 'ao1000'] as const

export function useStatisticCardGroups(statistics: DeepStatistics): StatisticCardGroup[] {
  const t = useTranslations('Index')
  const time = (value: number) => (value > 0 ? formatTime(value) : '--')
  const positive = (value: number) => (value > 0 ? value : null)
  const percent = (value: string) => (value === '' ? null : Number(value))

  return [
    {
      key: 'averages',
      title: t('StatsPage.group-averages'),
      cards: AO_KEYS.map((key) => ({
        key,
        label: `Ao${key.slice(2)}`,
        icon: RollingAverageStatIcon,
        loadingKey: 'stats',
        comparison: 'record',
        raw: (scope) => positive(statistics.stats[scope][key]),
        format: (scope) => time(statistics.stats[scope][key])
      }))
    },
    {
      key: 'times',
      title: t('StatsPage.group-times'),
      cards: [
        {
          key: 'best',
          label: t('StatsPage.best-time'),
          icon: BestTimeStatIcon,
          loadingKey: 'best',
          comparison: 'record',
          highlight: true,
          raw: (scope) => positive(statistics.best[scope]),
          format: (scope) => time(statistics.best[scope])
        },
        {
          key: 'average',
          label: t('StatsPage.average'),
          icon: MeanStatIcon,
          loadingKey: 'average',
          comparison: 'lower-better',
          raw: (scope) => positive(statistics.average[scope]),
          format: (scope) => time(statistics.average[scope])
        },
        {
          key: 'deviation',
          label: t('HomePage.deviation'),
          icon: DeviationStatIcon,
          loadingKey: 'deviation',
          comparison: 'lower-better',
          raw: (scope) => positive(statistics.deviation[scope]),
          format: (scope) => time(statistics.deviation[scope])
        }
      ]
    },
    {
      key: 'activity',
      title: t('StatsPage.group-activity'),
      cards: [
        {
          key: 'counter',
          label: t('StatsPage.counter'),
          icon: CounterStatIcon,
          loadingKey: 'counter',
          comparison: 'none',
          raw: (scope) => positive(statistics.counter[scope]),
          format: (scope) => (statistics.counter[scope] > 0 ? String(statistics.counter[scope]) : '--')
        },
        {
          key: 'time-spent',
          label: t('StatsPage.time-spent'),
          icon: TimeSpentStatIcon,
          loadingKey: 'timeSpent',
          comparison: 'none',
          raw: () => null,
          format: (scope) => statistics.timeSpent[scope] || '--'
        },
        {
          key: 'success-rate',
          label: t('StatsPage.success-rate'),
          icon: SuccessRateStatIcon,
          loadingKey: 'successRate',
          comparison: 'higher-better',
          raw: (scope) => percent(statistics.successRate[scope]),
          format: (scope) => (statistics.successRate[scope] === '' ? '--' : `${statistics.successRate[scope]}%`)
        }
      ]
    }
  ]
}
