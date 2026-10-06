import { type RefObject, useEffect, useRef, useState } from 'react'
import { triggerHaptic } from '@/shared/model/useHaptics'
import { isScrolledWithin } from '@/shared/lib/isScrolledWithin'

export const PULL_TRIGGER_OFFSET = 64
const MAX_OFFSET = 96
const RESISTANCE = 110
const DIRECTION_SLOP = 8
const MIN_REFRESH_MS = 600

export interface PullToRefreshState {
  offset: number
  dragging: boolean
  refreshing: boolean
}

const IDLE: PullToRefreshState = { offset: 0, dragging: false, refreshing: false }

export function usePullToRefresh(scrollerRef: RefObject<HTMLElement | null>, onRefresh: () => unknown) {
  const [state, setState] = useState<PullToRefreshState>(IDLE)
  const onRefreshRef = useRef(onRefresh)

  useEffect(() => {
    onRefreshRef.current = onRefresh
  })

  useEffect(() => {
    let active = true
    let target: Node | null = null
    let startX = 0
    let startY = 0
    let locked = false
    let anchorY: number | null = null
    let offset = 0
    let refreshing = false

    const show = (next: number, dragging: boolean) => {
      if (next === offset && dragging) return
      if (offset < PULL_TRIGGER_OFFSET && next >= PULL_TRIGGER_OFFSET) triggerHaptic()
      offset = next
      setState({ offset: next, dragging, refreshing: false })
    }

    const reset = () => {
      target = null
      anchorY = null
      if (refreshing || offset === 0) return
      offset = 0
      setState(IDLE)
    }

    const refresh = async () => {
      refreshing = true
      offset = PULL_TRIGGER_OFFSET
      setState({ offset: PULL_TRIGGER_OFFSET, dragging: false, refreshing: true })
      await Promise.all([
        Promise.resolve()
          .then(() => onRefreshRef.current())
          .catch(() => undefined),
        new Promise((resolve) => setTimeout(resolve, MIN_REFRESH_MS))
      ])
      if (!active) return
      refreshing = false
      offset = 0
      setState(IDLE)
    }

    const onStart = (event: TouchEvent) => {
      if (refreshing) return
      const scroller = scrollerRef.current
      const node = event.target as Node
      if (event.touches.length > 1 || event.defaultPrevented || !scroller?.contains(node)) {
        reset()
        return
      }
      target = node
      startX = event.touches[0].clientX
      startY = event.touches[0].clientY
      locked = false
      anchorY = isScrolledWithin(node, scroller) ? null : startY
    }

    const onMove = (event: TouchEvent) => {
      const scroller = scrollerRef.current
      if (!target || !scroller) return
      if (event.touches.length > 1 || event.defaultPrevented) {
        reset()
        return
      }
      const { clientX: x, clientY: y } = event.touches[0]
      if (!locked) {
        const dx = Math.abs(x - startX)
        const dy = Math.abs(y - startY)
        if (dx < DIRECTION_SLOP && dy < DIRECTION_SLOP) return
        if (dx > dy) {
          reset()
          return
        }
        locked = true
      }
      if (isScrolledWithin(target, scroller)) {
        anchorY = null
        if (offset > 0) show(0, false)
        return
      }
      if (anchorY === null) {
        anchorY = y
        return
      }
      const pull = Math.max(0, y - anchorY)
      show(MAX_OFFSET * (1 - Math.exp(-pull / RESISTANCE)), true)
    }

    const onEnd = (event: TouchEvent) => {
      if (!target || event.touches.length > 0) return
      if (offset < PULL_TRIGGER_OFFSET) {
        reset()
        return
      }
      target = null
      anchorY = null
      void refresh()
    }

    document.addEventListener('touchstart', onStart, { passive: true })
    document.addEventListener('touchmove', onMove, { passive: true })
    document.addEventListener('touchend', onEnd, { passive: true })
    document.addEventListener('touchcancel', reset, { passive: true })

    return () => {
      active = false
      document.removeEventListener('touchstart', onStart)
      document.removeEventListener('touchmove', onMove)
      document.removeEventListener('touchend', onEnd)
      document.removeEventListener('touchcancel', reset)
    }
  }, [scrollerRef])

  return state
}
