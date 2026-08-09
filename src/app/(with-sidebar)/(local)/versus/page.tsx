'use client'
import { useEffect } from 'react'
import { useVersusStore } from '@/features/versus/model/useVersusStore'
import { useScreenWakeLock } from '@/shared/model/useScreenWakeLock'
import { LaneStatus } from '@/features/versus/model/types'
import VersusSetupBar from '@/features/versus/ui/versus-setup-bar'
import VersusBoard from '@/features/versus/ui/versus-board'

export default function VersusPage() {
  const scramble = useVersusStore((state) => state.scramble)
  const players = useVersusStore((state) => state.players)
  const resetMatch = useVersusStore((state) => state.resetMatch)

  useEffect(() => {
    if (scramble) return
    resetMatch()
  }, [scramble, resetMatch])

  useScreenWakeLock(players.some((player) => player.status !== LaneStatus.IDLE))

  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden">
      <VersusSetupBar />
      <VersusBoard />
    </div>
  )
}
