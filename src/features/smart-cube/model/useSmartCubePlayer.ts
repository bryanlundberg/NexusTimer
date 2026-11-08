import { useEffect, useMemo } from 'react'
import { useSmartSessionStore } from '@/features/smart-cube/model/useSmartSessionStore'
import type { Cube3dRequest } from '@/shared/lib/puzzle/cube3dRequest'
import { useCube3d } from '@/shared/ui/puzzle/useCube3d'

const SIZE_PX = 'min(180px, 38vw)'
const CANVAS_STYLE = { width: SIZE_PX, height: SIZE_PX, display: 'block' }

const trackedState = (): Cube3dRequest => ({
  size: 3,
  alg: useSmartSessionStore.getState().getTrackedMoves().join(' '),
  stickering: 'full',
  lastLayer: 'U'
})

// 3D mirror of the physical smart cube. The session store is the source of
// truth, so the view is seeded from its tracked move log: coming back from
// another route shows the cube as it really is, not solved.
export function useSmartCubePlayer() {
  const initial = useMemo(trackedState, [])
  const { canvasRef, handle } = useCube3d({ initial, tempoScale: 5, cameraDistance: 8, ownContext: true })

  useEffect(() => {
    if (!handle) return
    const reseed = () => handle.show(trackedState())
    reseed()
    // Same synchronous block as the seeding above, so no move can land between
    // reading the log and listening for the next one.
    return useSmartSessionStore.getState().addListener({
      onMove: (move) => handle.play(move),
      onResync: reseed
    })
  }, [handle])

  return { canvasRef, canvasStyle: CANVAS_STYLE, player: handle }
}
