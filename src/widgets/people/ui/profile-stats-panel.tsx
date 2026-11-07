import { useLocale, useTranslations } from 'next-intl'
import { formatDurationClock } from '@/shared/lib/formatDuration'
import type { UserStatsSummary } from '@/entities/user-stats/model/types'
import { CategoryCardStat } from '@/widgets/people/ui/category-card-stat'

interface ProfileStatsPanelProps {
  stats: UserStatsSummary | null
  algorithmsLearned?: number
}

export function ProfileStatsPanel({ stats, algorithmsLearned = 0 }: ProfileStatsPanelProps) {
  const t = useTranslations('Index.PeoplePage.stats')
  const locale = useLocale()

  const totalSolves = stats?.totalSolves ?? 0
  const totalTime = stats?.cubes.reduce((sum, cube) => sum + cube.totalTime, 0) ?? 0
  const favorite = stats?.categories.reduce<(typeof stats.categories)[number] | null>(
    (top, category) => (!top || category.count > top.count ? category : top),
    null
  )

  const items = [
    { label: t('total-solves'), value: totalSolves > 0 ? totalSolves.toLocaleString(locale) : '--' },
    { label: t('time-on-timer'), value: totalTime > 0 ? formatDurationClock(totalTime) : '--' },
    { label: t('favorite'), value: favorite?.category ?? '--' },
    { label: t('algorithms'), value: algorithmsLearned > 0 ? algorithmsLearned.toLocaleString(locale) : '--' }
  ]

  return (
    <section className="grid grid-cols-2 gap-x-4 gap-y-4">
      {items.map((item) => (
        <CategoryCardStat key={item.label} label={item.label}>
          <span className="truncate text-xl font-bold tabular-nums">{item.value}</span>
        </CategoryCardStat>
      ))}
    </section>
  )
}
