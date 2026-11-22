import { type RefObject, useEffect } from 'react'

const OVERLAY_SELECTOR = '[role="dialog"], [role="alertdialog"], [role="menu"], [role="listbox"]'

function isEditable(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) return false
  if (target.isContentEditable) return true
  return target.closest('input, textarea, select') !== null
}

export function useTypeToSearch(inputRef: RefObject<HTMLInputElement | null>) {
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const input = inputRef.current
      if (!input || event.defaultPrevented || event.isComposing) return
      if (event.ctrlKey || event.metaKey || event.altKey) return
      if (event.key.length !== 1 || event.key === ' ') return
      if (isEditable(event.target)) return
      if (document.querySelector(OVERLAY_SELECTOR)) return

      input.focus()
      const end = input.value.length
      input.setSelectionRange(end, end)
    }

    window.addEventListener('keydown', onKeyDown, { capture: true })
    return () => window.removeEventListener('keydown', onKeyDown, { capture: true })
  }, [inputRef])
}
