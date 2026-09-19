'use client'

import { Tabs } from '@/components/ui/tabs'
import ScrollableUnderlineTabs from '@/shared/ui/animated-tabs/ScrollableUnderlineTabs'
import { LEADERBOARD_PUZZLE_OPTIONS } from '@/features/leaderboards/model/puzzle-options'
import type { LeaderboardView } from '@/features/leaderboards/model/leaderboard-view'
import { CubeCategoryIcon } from '@/shared/ui/cube-category-icon/CubeCategoryIcon'
import Segmented from '@/shared/ui/segmented/Segmented'
import LeaderboardRefreshBadge from '@/features/leaderboards/ui/LeaderboardRefreshBadge'
import { useTranslations } from 'next-intl'

interface LeaderboardHeroProps {
  value: string
  onChange: (value: string) => void
  view: LeaderboardView
  onViewChange: (view: LeaderboardView) => void
  remainingMs: number | null
}

export default function LeaderboardHero({ value, onChange, view, onViewChange, remainingMs }: LeaderboardHeroProps) {
  const t = useTranslations('Index.LeaderboardsPage')
  const tNav = useTranslations('Index.NavMain')

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
    <div className="mx-auto w-full max-w-4xl px-3 pt-4">
      <div className="mb-5 flex flex-col gap-1.5">
        <div className="flex items-center justify-between gap-3">
          <span className="flex items-center gap-2 font-display text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
            <span className="size-2 shrink-0 rounded-[2px] bg-cube-orange" aria-hidden />
            {tNav('leaderboards')}
          </span>
          <LeaderboardRefreshBadge remainingMs={remainingMs} />
        </div>
        <h1 className="font-display text-2xl font-bold leading-none tracking-tight sm:text-3xl md:text-4xl">
          {t('title')}
        </h1>
        <p className="max-w-xl text-xs text-muted-foreground text-pretty sm:text-sm">{t('description')}</p>
      </div>

      <div className="flex flex-col gap-2 md:flex-row md:items-center md:gap-3">
        <Tabs value={value} onValueChange={onChange} className="min-w-0 md:flex-1">
          <ScrollableUnderlineTabs
            items={items}
            activeValue={value}
            layoutId="leaderboard-puzzle-tabs"
            className="[&_[data-slot=tabs-trigger]]:grow md:[&_[data-slot=tabs-trigger]]:grow-0"
          />
        </Tabs>

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
