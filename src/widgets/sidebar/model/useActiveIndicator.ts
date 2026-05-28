import { DependencyList, RefObject, useEffect, useRef, useState } from 'react'

type Indicator = { top: number; left: number; width: number; height: number } | null

export function useActiveIndicator(deps: DependencyList): {
  menuRef: RefObject<HTMLUListElement | null>
  indicator: Indicator
} {
  const menuRef = useRef<HTMLUListElement>(null)
  const [indicator, setIndicator] = useState<Indicator>(null)

  useEffect(() => {
    const menu = menuRef.current
    if (!menu) return

    const measure = () => {
      const active = menu.querySelector<HTMLElement>('[data-active-item="true"]')
      if (!active) {
        setIndicator(null)
        return
      }
      const menuRect = menu.getBoundingClientRect()
      const rect = active.getBoundingClientRect()
      setIndicator({
        top: rect.top - menuRect.top,
        left: rect.left - menuRect.left,
        width: rect.width,
        height: rect.height
      })
    }

    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(menu)
    return () => observer.disconnect()
  }, deps)

  return { menuRef, indicator }
}
