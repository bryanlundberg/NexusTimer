'use client'

import { Tabs } from '@/components/ui/tabs'
import ScrollableUnderlineTabs from '@/shared/ui/animated-tabs/ScrollableUnderlineTabs'
import { LEADERBOARD_PUZZLE_OPTIONS } from '@/features/leaderboards/model/puzzle-options'
import type { LeaderboardView } from '@/features/leaderboards/model/leaderboard-view'
import { CubeCategoryIcon } from '@/shared/ui/cube-category-icon/CubeCategoryIcon'
import Segmented from '@/shared/ui/segmented/Segmented'
import { useTranslations } from 'next-intl'

interface LeaderboardHeroProps {
  value: string
  onChange: (value: string) => void
  view: LeaderboardView
  onViewChange: (view: LeaderboardView) => void
}

export default function LeaderboardHero({ value, onChange, view, onViewChange }: LeaderboardHeroProps) {
  const t = useTranslations('Index.LeaderboardsPage')

  const items = LEADERBOARD_PUZZLE_OPTIONS.map((option) => ({
    value: option.value,
    label: (
      <span className="flex items-center gap-2">
        <span className="size-5 shrink-0">
          <CubeCategoryIcon category={option.label} />
        </span>
        <span className="font-mono">{option.label}</span>
        <span className="text-[9px] font-medium uppercase tracking-wider opacity-70">{option.mode}</span>
      </span>
    )
  }))

  const viewOptions = [
    { value: 'all' as const, label: t('view-all') },
    { value: 'persons' as const, label: t('view-persons') }
  ]

  return (
    <div className="mx-auto w-full max-w-4xl px-3 pt-3">
      <div className="flex items-center gap-3">
        <Tabs value={value} onValueChange={onChange} className="min-w-0 flex-1">
          <ScrollableUnderlineTabs items={items} activeValue={value} layoutId="leaderboard-puzzle-tabs" />
        </Tabs>

        <Segmented
          value={view}
          onChange={onViewChange}
          options={viewOptions}
          layoutId="leaderboard-view"
          aria-label={t('view-label')}
        />
      </div>
    </div>
  )
}
