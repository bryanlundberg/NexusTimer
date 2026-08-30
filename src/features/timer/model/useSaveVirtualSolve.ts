import { useCallback } from 'react'
import { CubeEngine } from 'cube-state-engine'
import { saveVirtualSolve, type SaveVirtualSolvePayload } from '@/features/timer/lib/saveVirtualSolve'

export function useSaveVirtualSolve(engine: CubeEngine | null | undefined) {
  return useCallback(
    (payload: Omit<SaveVirtualSolvePayload, 'solution'>) =>
      saveVirtualSolve({ ...payload, solution: engine?.getMoves(true) }),
    [engine]
  )
}
