'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { UserBadgesResult } from '@/entities/achievement/model/useUserBadges'
import Segmented from '@/shared/ui/segmented/Segmented'
import { AchievementFamilyCard } from '@/widgets/people/ui/achievement-family-card'

interface Props {
  badges: UserBadgesResult
}

type Filter = 'unlocked' | 'locked'

export default function AchievementsTabContent({ badges }: Props) {
  const t = useTranslations('Index.PeoplePage.badges')
  const { unlockedFamilies, lockedFamilies, earnedTiers, totalTiers } = badges
  const [filter, setFilter] = useState<Filter>(unlockedFamilies.length > 0 ? 'unlocked' : 'locked')

  const families = filter === 'unlocked' ? unlockedFamilies : lockedFamilies
  const percent = totalTiers > 0 ? Math.round((earnedTiers / totalTiers) * 100) : 0

  const option = (value: Filter, label: string, count: number) => ({
    value,
    label: (
      <span className="flex items-center gap-1.5">
        {label}
        <span className="tabular-nums opacity-60">{count}</span>
      </span>
    )
  })

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 flex-col gap-1.5">
          <span className="text-[13px] text-muted-foreground tabular-nums sm:text-xs">
            {t('levels', { unlocked: earnedTiers, total: totalTiers })}
          </span>
          <div
            role="progressbar"
            aria-valuenow={percent}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={t('title')}
            className="h-1 w-full overflow-hidden bg-muted sm:w-56"
          >
            <div className="h-full bg-primary transition-[width] duration-500" style={{ width: `${percent}%` }} />
          </div>
        </div>

        <Segmented
          value={filter}
          onChange={setFilter}
          layoutId="achievements-filter"
          aria-label={t('title')}
          className="w-full sm:w-auto [&>button]:flex-1 [&>button]:justify-center sm:[&>button]:flex-none"
          options={[
            option('unlocked', t('filter-unlocked'), unlockedFamilies.length),
            option('locked', t('filter-locked'), lockedFamilies.length)
          ]}
        />
      </div>

      {families.length === 0 ? (
        <p className="py-8 text-center text-[15px] text-muted-foreground sm:text-sm">
          {filter === 'unlocked' ? t('empty') : t('all-unlocked')}
        </p>
      ) : (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-3">
          {families.map((family) => (
            <AchievementFamilyCard key={family.id} family={family} />
          ))}
        </div>
      )}
    </div>
  )
}
