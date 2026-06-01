'use client'

import PuzzleSwitchTab from '@/features/leaderboards/ui/PuzzleSwitchTab'
import { LEADERBOARD_PUZZLE_OPTIONS } from '@/features/leaderboards/model/puzzle-options'

interface PuzzleSwitchProps {
  value: string
  onChange: (value: string) => void
}

const ACTIVE_LAYOUT_ID = 'leaderboard-puzzle-switch-active'

export default function PuzzleSwitch({ value, onChange }: PuzzleSwitchProps) {
  return (
    <div
      role="tablist"
      className="inline-flex w-fit shrink-0 items-center gap-1 p-1 rounded-lg border border-border/60 bg-background/60"
    >
      {LEADERBOARD_PUZZLE_OPTIONS.map((option) => (
        <PuzzleSwitchTab
          key={option.value}
          option={option}
          active={value === option.value}
          layoutId={ACTIVE_LAYOUT_ID}
          onSelect={onChange}
        />
      ))}
    </div>
  )
}
