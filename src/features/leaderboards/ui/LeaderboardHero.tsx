'use client'

import PuzzleSwitch from '@/features/leaderboards/ui/PuzzleSwitch'

interface LeaderboardHeroProps {
  puzzle: string
  setPuzzle: (value: string) => void
}

export default function LeaderboardHero({ puzzle, setPuzzle }: LeaderboardHeroProps) {
  return (
    <div className="w-full px-4 md:px-6 py-4 border-b border-border/40 bg-muted/20">
      <div className="flex flex-row items-center justify-center gap-2">
        <PuzzleSwitch value={puzzle} onChange={setPuzzle} />
      </div>
    </div>
  )
}
