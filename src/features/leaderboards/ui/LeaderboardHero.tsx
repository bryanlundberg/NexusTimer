'use client'

import { Tabs } from '@/components/ui/tabs'
import ScrollableUnderlineTabs from '@/shared/ui/animated-tabs/ScrollableUnderlineTabs'
import { LEADERBOARD_PUZZLE_OPTIONS } from '@/features/leaderboards/model/puzzle-options'

interface LeaderboardHeroProps {
  value: string
  onChange: (value: string) => void
}

export default function LeaderboardHero({ value, onChange }: LeaderboardHeroProps) {
  const items = LEADERBOARD_PUZZLE_OPTIONS.map((option) => ({
    value: option.value,
    label: (
      <span className="flex items-center gap-2">
        <img src={option.src} alt="" className="size-5 shrink-0" />
        <span className="font-mono">{option.label}</span>
        <span className="text-[9px] font-medium uppercase tracking-wider opacity-70">{option.mode}</span>
      </span>
    )
  }))

  return (
    <div className="mx-auto w-full max-w-4xl px-3 pt-3 md:px-6">
      <Tabs value={value} onValueChange={onChange} className="w-full">
        <ScrollableUnderlineTabs items={items} activeValue={value} layoutId="leaderboard-puzzle-tabs" />
      </Tabs>
    </div>
  )
}
