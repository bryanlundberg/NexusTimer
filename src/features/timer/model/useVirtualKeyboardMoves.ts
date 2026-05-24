import { useEffect } from 'react'
import { CubeEngine } from 'cube-state-engine'
import type { TwistyPlayer } from 'cubing/twisty'
import { VIRTUAL_KEYMAP } from './virtualKeymap'

interface UseVirtualKeyboardMovesArgs {
  player: TwistyPlayer | null
  engine: CubeEngine | null | undefined
  is3x3: boolean
  isRunning: boolean
  isSolved: boolean
  isLocked: () => boolean
  onMove: () => void
  onSolved: () => void
  onCancel: () => void
}

export function useVirtualKeyboardMoves({
  player,
  engine,
  is3x3,
  isRunning,
  isSolved,
  isLocked,
  onMove,
  onSolved,
  onCancel
}: UseVirtualKeyboardMovesArgs) {
  useEffect(() => {
    if (!player || !engine) return

    const onKeyDown = (e: KeyboardEvent) => {
      if (!player || !engine || engine.isSolved()) return
      if (isLocked()) return

      if (e.key === 'Escape') {
        onCancel()
        return
      }

      const mapping = VIRTUAL_KEYMAP[e.key.toLowerCase()]
      if (!mapping) return
      if (mapping.require3x3 && !is3x3) return

      player.experimentalAddMove(mapping.move)
      mapping.apply(engine)

      if (!mapping.isRotation && !isRunning && !isSolved) {
        onMove()
      }

      if (engine.isSolved()) {
        onSolved()
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [player, engine, is3x3, isRunning, isSolved, isLocked, onMove, onSolved, onCancel])
}
