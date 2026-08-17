import { useEffect, useMemo } from 'react'
import { resolveVirtualKeymap } from './virtualKeymap'
import { useVirtualKeymapStore } from './useVirtualKeymapStore'

interface UseVirtualKeyboardMovesArgs {
  is3x3: boolean
  processMove: (move: string, opts?: { isRotation?: boolean }) => void
  cancel: () => void
}

export function useVirtualKeyboardMoves({ is3x3, processMove, cancel }: UseVirtualKeyboardMovesArgs) {
  const keymap = useVirtualKeymapStore((store) => store.keymap)
  const isEditorOpen = useVirtualKeymapStore((store) => store.isEditorOpen)

  const resolvedKeymap = useMemo(() => resolveVirtualKeymap(keymap), [keymap])

  useEffect(() => {
    if (isEditorOpen) return

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        cancel()
        return
      }

      const mapping = e.code ? resolvedKeymap[e.code] : undefined
      if (!mapping) return
      if (mapping.require3x3 && !is3x3) return

      processMove(mapping.move, { isRotation: mapping.isRotation })
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [is3x3, processMove, cancel, resolvedKeymap, isEditorOpen])
}
