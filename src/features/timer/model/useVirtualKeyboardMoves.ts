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
      const el = document.activeElement as HTMLElement | null
      const tag = el?.tagName.toLowerCase()
      if (tag === 'input' || tag === 'textarea' || tag === 'select' || el?.isContentEditable) return
      if (document.querySelector('[role="dialog"], [role="alertdialog"]')) return
      if (mapping.require3x3 && !is3x3) return

      e.preventDefault()
      processMove(mapping.move, { isRotation: mapping.isRotation })
    }

    window.addEventListener('keydown', onKeyDown, { capture: true })
    return () => window.removeEventListener('keydown', onKeyDown, { capture: true })
  }, [is3x3, processMove, cancel, resolvedKeymap, isEditorOpen])
}
