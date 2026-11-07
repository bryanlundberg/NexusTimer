import { useLocale, useTranslations } from 'next-intl'
import { cn } from '@/shared/lib/utils'
import { formatDurationClock } from '@/shared/lib/formatDuration'
import type { CubeStats, UserStatsSummary } from '@/entities/user-stats/model/types'
import { CategoryCardStat } from '@/widgets/people/ui/category-card-stat'

interface ProfileStatsPanelProps {
  stats: UserStatsSummary | null
  algorithmsLearned?: number
  className?: string
}

export function ProfileStatsPanel({ stats, algorithmsLearned = 0, className }: ProfileStatsPanelProps) {
  const t = useTranslations('Index.PeoplePage.stats')
  const locale = useLocale()

  const totalSolves = stats?.totalSolves ?? 0
  const totalTime = stats?.cubes.reduce((sum, cube) => sum + cube.totalTime, 0) ?? 0
  const favorite = favoriteByTime(stats?.cubes ?? [])

  const items = [
    { label: t('total-solves'), value: totalSolves > 0 ? totalSolves.toLocaleString(locale) : '--' },
    { label: t('time-on-timer'), value: totalTime > 0 ? formatDurationClock(totalTime) : '--' },
    { label: t('favorite'), value: favorite ?? '--' },
    { label: t('algorithms'), value: algorithmsLearned > 0 ? algorithmsLearned.toLocaleString(locale) : '--' }
  ]

  return (
    <section className={cn('grid grid-cols-2 gap-x-4 gap-y-4', className)}>
      {items.map((item) => (
        <CategoryCardStat key={item.label} label={item.label}>
          <span className="truncate text-xl font-bold tabular-nums">{item.value}</span>
        </CategoryCardStat>
      ))}
    </section>
  )
}

function favoriteByTime(cubes: CubeStats[]): string | null {
  const timeByCategory = new Map<string, number>()
  for (const cube of cubes) {
    timeByCategory.set(cube.category, (timeByCategory.get(cube.category) ?? 0) + cube.totalTime)
  }
  let favorite: string | null = null
  let most = 0
  for (const [category, time] of timeByCategory) {
    if (time > most) {
      favorite = category
      most = time
    }
  }
  return favorite
}
