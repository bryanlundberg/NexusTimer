'use client'

import Segmented from '@/shared/ui/segmented/Segmented'
import { LEADERBOARD_PUZZLE_OPTIONS } from '@/features/leaderboards/model/puzzle-options'
import { CubeCategoryIcon } from '@/shared/ui/cube-category-icon/CubeCategoryIcon'

interface PuzzleSwitchProps {
  value: string
  onChange: (value: string) => void
}

export default function PuzzleSwitch({ value, onChange }: PuzzleSwitchProps) {
  return (
    <Segmented
      value={value}
      onChange={onChange}
      layoutId="leaderboard-puzzle-switch-active"
      aria-label="Puzzle"
      options={LEADERBOARD_PUZZLE_OPTIONS.map((option) => ({
        value: option.value,
        label: <span className="font-mono">{option.label}</span>,
        sublabel: option.mode,
        icon: (
          <span className="size-6">
            <CubeCategoryIcon category={option.label} />
          </span>
        )
      }))}
    />
  )
}
