import { useEffect } from 'react'
import type { SmartCubeConnection, SmartCubeEvent } from 'smartcube-web-bluetooth'

interface UseSmartCubeMovesArgs {
  connection: SmartCubeConnection | null
  onMove: (move: string) => void
}

export function useSmartCubeMoves({ connection, onMove }: UseSmartCubeMovesArgs) {
  useEffect(() => {
    if (!connection) return
    const subscription = connection.events$.subscribe((event: SmartCubeEvent) => {
      if (event.type !== 'MOVE') return
      const move = event.move.trim()
      if (move) onMove(move)
    })
    return () => subscription.unsubscribe()
  }, [connection, onMove])
}
