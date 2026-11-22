import { type KeyboardEvent as ReactKeyboardEvent, type RefObject, useCallback, useEffect } from 'react'

const ITEM_SELECTOR = '[data-cube-nav]'
const SEARCH_SELECTOR = 'input[type="search"]'
const OVERLAY_SELECTOR = '[role="dialog"], [role="alertdialog"], [role="menu"], [role="listbox"]'
const ARROWS = new Set(['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'])

function focusItem(item: HTMLElement | undefined) {
  if (!item) return
  item.focus({ preventScroll: true })
  item.scrollIntoView({ block: 'nearest' })
}

function columnCount(grid: HTMLElement) {
  return Math.max(1, getComputedStyle(grid).gridTemplateColumns.split(' ').filter(Boolean).length)
}

export function useCubeGridKeyboard(gridRef: RefObject<HTMLDivElement | null>) {
  const items = useCallback(
    () => Array.from(gridRef.current?.querySelectorAll<HTMLElement>(ITEM_SELECTOR) ?? []),
    [gridRef]
  )

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.defaultPrevented || event.ctrlKey || event.metaKey || event.altKey) return
      if (document.querySelector(OVERLAY_SELECTOR)) return
      const active = document.activeElement
      const fromBody = !active || active === document.body
      const fromSearch = active instanceof HTMLInputElement && active.matches(SEARCH_SELECTOR)
      if (fromSearch ? event.key !== 'ArrowDown' : !(fromBody && ARROWS.has(event.key))) return
      const first = items()[0]
      if (!first) return
      event.preventDefault()
      focusItem(first)
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [items])

  return useCallback(
    (event: ReactKeyboardEvent<HTMLDivElement>) => {
      const grid = gridRef.current
      const target = event.target as HTMLElement
      if (!grid || !ARROWS.has(event.key) || !target.matches(ITEM_SELECTOR)) return
      if (event.ctrlKey || event.metaKey || event.altKey) return

      const list = items()
      const index = list.indexOf(target)
      if (index === -1) return
      const columns = columnCount(grid)
      const step = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -columns, ArrowDown: columns }[event.key] ?? 0
      const next = index + step

      event.preventDefault()
      if (next < 0) {
        if (event.key === 'ArrowUp') document.querySelector<HTMLInputElement>(SEARCH_SELECTOR)?.focus()
        return
      }
      focusItem(list[Math.min(next, list.length - 1)])
    },
    [gridRef, items]
  )
}
