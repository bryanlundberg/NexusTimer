'use client'

import ChipGroup from '@/shared/ui/chip-group/ChipGroup'
import { LEADERBOARD_PUZZLE_OPTIONS } from '@/features/leaderboards/model/puzzle-options'
import type { LeaderboardView } from '@/features/leaderboards/model/leaderboard-view'
import { CubeCategoryIcon } from '@/shared/ui/cube-category-icon/CubeCategoryIcon'
import Segmented from '@/shared/ui/segmented/Segmented'
import LeaderboardRefreshBadge from '@/features/leaderboards/ui/LeaderboardRefreshBadge'
import { useTranslations } from 'next-intl'
import { PageHeader } from '@/shared/ui/page-header/PageHeader'

interface LeaderboardHeroProps {
  value: string
  onChange: (value: string) => void
  view: LeaderboardView
  onViewChange: (view: LeaderboardView) => void
  remainingMs: number | null
}

export default function LeaderboardHero({ value, onChange, view, onViewChange, remainingMs }: LeaderboardHeroProps) {
  const t = useTranslations('Index.LeaderboardsPage')

  const items = LEADERBOARD_PUZZLE_OPTIONS.map((option) => ({
    value: option.value,
    label: (
      <>
        <span className="size-3.5 shrink-0">
          <CubeCategoryIcon category={option.label} />
        </span>
        <span className="font-mono">{option.label}</span>
        <span className="text-[9px] font-medium uppercase tracking-wider opacity-70">{option.mode}</span>
      </>
    )
  }))

  const viewOptions = [
    { value: 'all' as const, label: t('view-all') },
    { value: 'persons' as const, label: t('view-persons') }
  ]

  return (
    <div className="mx-auto w-full max-w-4xl px-3 pt-4">
      <PageHeader
        title={t('title')}
        description={t('description')}
        actions={<LeaderboardRefreshBadge remainingMs={remainingMs} />}
        className="mb-5"
      />

      <div className="flex flex-col gap-2 md:flex-row md:items-center md:gap-3">
        <ChipGroup
          value={value}
          onChange={onChange}
          options={items}
          label={t('table.category')}
          className="min-w-0 md:flex-1"
        />

        <Segmented
          value={view}
          onChange={onViewChange}
          options={viewOptions}
          layoutId="leaderboard-view"
          aria-label={t('view-label')}
          className="w-full [&>button]:flex-1 [&>button]:justify-center md:w-auto md:[&>button]:flex-none"
        />
      </div>
    </div>
  )
}
