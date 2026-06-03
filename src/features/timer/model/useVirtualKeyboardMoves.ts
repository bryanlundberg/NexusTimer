import { useEffect } from 'react'
import { VIRTUAL_KEYMAP } from './virtualKeymap'

interface UseVirtualKeyboardMovesArgs {
  is3x3: boolean
  processMove: (move: string, opts?: { isRotation?: boolean }) => void
  cancel: () => void
}

export function useVirtualKeyboardMoves({ is3x3, processMove, cancel }: UseVirtualKeyboardMovesArgs) {
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        cancel()
        return
      }

      const mapping = VIRTUAL_KEYMAP[e.key.toLowerCase()]
      if (!mapping) return
      if (mapping.require3x3 && !is3x3) return

      processMove(mapping.move, { isRotation: mapping.isRotation })
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [is3x3, processMove, cancel])
}
