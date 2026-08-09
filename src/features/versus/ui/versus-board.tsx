'use client'
import { cn } from '@/shared/lib/utils'
import { VersusPlayerCount } from '@/features/versus/model/types'
import { useVersusStore } from '@/features/versus/model/useVersusStore'
import VersusLane from '@/features/versus/ui/versus-lane'
import VersusResults from '@/features/versus/ui/versus-results'

const GRID_BY_COUNT: Record<VersusPlayerCount, string> = {
  2: 'grid-cols-1 grid-rows-2',
  3: 'grid-cols-2 grid-rows-2',
  4: 'grid-cols-2 grid-rows-2'
}

function isRotated(index: number, playerCount: VersusPlayerCount) {
  if (playerCount === 2) return index === 0
  return index < 2
}

function laneSpan(index: number, playerCount: VersusPlayerCount) {
  return playerCount === 3 && index === 2 ? 'col-span-2' : undefined
}

export default function VersusBoard() {
  const players = useVersusStore((state) => state.players)
  const playerCount = useVersusStore((state) => state.playerCount)

  return (
    <div className="relative min-h-0 grow overscroll-contain">
      <div className={cn('grid h-full w-full gap-px bg-border', GRID_BY_COUNT[playerCount])}>
        {players.map((player, index) => (
          <VersusLane
            key={player.id}
            player={player}
            rotated={isRotated(index, playerCount)}
            className={laneSpan(index, playerCount)}
          />
        ))}
      </div>
      <VersusResults />
    </div>
  )
}
