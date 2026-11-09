'use client'

import type { CubeCategory, FriendsLeaderboardMetric } from '@nexustimer/contracts'
import { useTranslations } from 'next-intl'
import Segmented from '@/shared/ui/segmented/Segmented'
import { PageHeader } from '@/shared/ui/page-header/PageHeader'
import FriendsCategoryChips from '@/features/friends-leaderboard/ui/FriendsCategoryChips'

interface FriendsLeaderboardHeroProps {
  categories: CubeCategory[]
  category: CubeCategory
  onCategoryChange: (category: CubeCategory) => void
  metric: FriendsLeaderboardMetric
  onMetricChange: (metric: FriendsLeaderboardMetric) => void
}

export default function FriendsLeaderboardHero({
  categories,
  category,
  onCategoryChange,
  metric,
  onMetricChange
}: FriendsLeaderboardHeroProps) {
  const t = useTranslations('Index.LeaderboardsPage.friends')

  const metricOptions = [
    { value: 'single' as const, label: t('single') },
    { value: 'ao5' as const, label: t('ao5') }
  ]

  return (
    <div className="mx-auto w-full max-w-4xl px-3 pt-4">
      <PageHeader
        title={t('title')}
        description={t('description')}
        actions={
          <Segmented
            value={metric}
            onChange={onMetricChange}
            options={metricOptions}
            layoutId="friends-leaderboard-metric"
            aria-label={t('metric-label')}
          />
        }
        className="mb-4"
      />

      {categories.length > 0 && (
        <FriendsCategoryChips
          categories={categories}
          selected={category}
          onSelect={onCategoryChange}
          label={t('categories-label')}
        />
      )}
    </div>
  )
}
