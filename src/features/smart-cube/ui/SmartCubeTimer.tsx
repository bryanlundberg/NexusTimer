'use client'

import { useCallback, type ReactNode } from 'react'
import type { SmartCubeConnection } from 'smartcube-web-bluetooth'
import { useSmartSessionStore } from '@/features/smart-cube/model/useSmartSessionStore'
import { useSmartCubePlayer } from '@/features/smart-cube/model/useSmartCubePlayer'
import { useSmartCubeGyro } from '@/features/smart-cube/model/useSmartCubeGyro'
import { SolvingTime } from '@/features/smart-cube/ui/SolvingTime'

interface SmartCubeTimerProps {
  connection: SmartCubeConnection
  secondaryActions?: (onSync: () => void, gyroActive: boolean, onReset: () => void) => ReactNode
}

// View over the smart-cube session. The session runs in a module-level store
// fed by the Bluetooth subscription, so mounting or unmounting this component
// never starts, stops or interrupts tracking.
export function SmartCubeTimer({ connection, secondaryActions }: SmartCubeTimerProps) {
  const phase = useSmartSessionStore((store) => store.phase)
  const solvingTime = useSmartSessionStore((store) => store.solvingTime)
  const lastSolveTime = useSmartSessionStore((store) => store.lastSolveTime)
  const inspectionTime = useSmartSessionStore((store) => store.inspectionTime)
  const solveStats = useSmartSessionStore((store) => store.solveStats)
  const resync = useSmartSessionStore((store) => store.resync)

  const { containerRef, player } = useSmartCubePlayer()
  const { active: gyroActive, resetOrientation } = useSmartCubeGyro({ player, connection })

  const syncSolved = useCallback(() => {
    resync()
    if (connection.capabilities.reset) {
      connection.sendCommand({ type: 'REQUEST_RESET' }).catch(() => {})
    }
  }, [resync, connection])

  // The last time stays on screen while the next scramble is applied.
  const displayTime = phase === 'solving' ? solvingTime : (lastSolveTime ?? solvingTime)

  return (
    <div className="grow flex flex-col items-center justify-center gap-1.5 sm:gap-3">
      <div ref={containerRef} className="rounded-md overflow-hidden" />

      {phase === 'inspecting' && inspectionTime != null ? (
        <div className="text-5xl sm:text-7xl tabular-nums font-semibold text-orange-500">
          {Math.max(0, Math.trunc(inspectionTime))}
        </div>
      ) : (
        <SolvingTime ms={displayTime || 0} />
      )}

      {solveStats && (
        <div className="flex flex-col items-center gap-1 w-full max-w-56">
          <div className="flex items-center gap-2 text-xs sm:text-sm tabular-nums text-muted-foreground">
            <span>
              <span className="font-semibold text-foreground">{solveStats.moveCount}</span> moves
            </span>
            <span className="text-muted-foreground/50">·</span>
            <span>
              <span className="font-semibold text-foreground">{solveStats.tps.toFixed(2)}</span> TPS
            </span>
            {solveStats.method && (
              <>
                <span className="text-muted-foreground/50">·</span>
                <span className="font-semibold text-foreground">{solveStats.method}</span>
              </>
            )}
          </div>

          {solveStats.segments && (
            <div className="flex h-1.5 w-full overflow-hidden rounded-full">
              {solveStats.segments.map((segment) => (
                <div key={segment.key} className={segment.bgClass} style={{ width: `${segment.pct}%` }} />
              ))}
            </div>
          )}
        </div>
      )}

      {secondaryActions?.(syncSolved, gyroActive, resetOrientation)}
    </div>
  )
}
