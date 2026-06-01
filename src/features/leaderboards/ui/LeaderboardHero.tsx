'use client'

import PuzzleSwitch from '@/features/leaderboards/ui/PuzzleSwitch'

interface LeaderboardHeroProps {
  value: string
  onChange: (value: string) => void
}

export default function LeaderboardHero({ value, onChange }: LeaderboardHeroProps) {
  return (
    <div className="w-full px-4 md:px-6 py-4 border-b border-border/40 bg-muted/20">
      <div className="-mx-4 md:mx-0 px-4 md:px-0 overflow-x-auto">
        <div className="flex justify-start sm:justify-center">
          <PuzzleSwitch value={value} onChange={onChange} />
        </div>
      </div>
    </div>
  )
}
