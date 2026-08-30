import { useEffect, useRef, useState } from 'react'
import { TwistyPlayer } from '@rednaxela101/cubing/twisty'
import { disposeTwistyPlayer } from '@/shared/lib/twisty/disposeTwistyPlayer'
import { useSmartSessionStore } from '@/features/smart-cube/model/useSmartSessionStore'

const SIZE_PX = 'min(180px, 38vw)'

// 3D mirror of the physical smart cube. The session store is the source of
// truth, so the player is seeded from its tracked move log: coming back from
// another route shows the cube as it really is, not solved.
export function useSmartCubePlayer() {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const [player, setPlayer] = useState<TwistyPlayer | null>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return
    let current: TwistyPlayer | null = null

    // Runs whenever a tracking epoch starts (a finished solve, a manual
    // resync), so it must never rebuild the WebGL context.
    const reseed = () => {
      if (!current) return
      try {
        current.alg = ''
        current.experimentalSetupAlg = useSmartSessionStore.getState().getTrackedMoves().join(' ')
      } catch {}
    }

    const next = new TwistyPlayer({
      puzzle: '3x3x3',
      controlPanel: 'none',
      tempoScale: 5,
      background: 'none',
      cameraDistance: 8,
      experimentalDragInput: 'auto'
    })
    next.style.width = SIZE_PX
    next.style.height = SIZE_PX
    current = next
    reseed()
    container.appendChild(next)
    setPlayer(next)

    // Same synchronous block as the seeding above, so no move can land between
    // reading the log and listening for the next one.
    const unsubscribe = useSmartSessionStore.getState().addListener({
      onMove: (move) => {
        try {
          current?.experimentalAddMove(move)
        } catch {}
      },
      onResync: reseed
    })

    return () => {
      unsubscribe()
      disposeTwistyPlayer(next)
    }
  }, [])

  return { containerRef, player }
}
