import { type RefObject, useEffect } from 'react'
import { isScrolledWithin } from '@/shared/lib/isScrolledWithin'

const MAX_STRETCH = 0.08
export const LIGHT_STRETCH = 0.03
const RESISTANCE = 300
const DIRECTION_SLOP = 8
const RELEASE_TRANSITION = 'transform 450ms cubic-bezier(0.22, 1, 0.36, 1)'

interface OverscrollStretchOptions {
  maxStretch?: number
  enabled?: boolean
  bottom?: boolean
}

const isAtBottom = (scroller: HTMLElement) => scroller.scrollTop + scroller.clientHeight >= scroller.scrollHeight - 1

export function useOverscrollStretch(
  scrollerRef: RefObject<HTMLElement | null>,
  contentRef: RefObject<HTMLElement | null>,
  { maxStretch = MAX_STRETCH, enabled = true, bottom = false }: OverscrollStretchOptions = {}
) {
  useEffect(() => {
    if (!enabled || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    let target: Node | null = null
    let startX = 0
    let startY = 0
    let locked = false
    let anchorY: number | null = null
    let stretched: HTMLElement | null = null

    const atEdge = (node: Node, scroller: HTMLElement) =>
      !isScrolledWithin(node, scroller) || (bottom && isAtBottom(scroller))

    const setScale = (content: HTMLElement, scale: number, origin: 'top' | 'bottom' = 'top') => {
      content.style.transition = 'none'
      content.style.transformOrigin = origin
      content.style.transform = scale === 1 ? '' : `scaleY(${scale})`
      stretched = scale === 1 ? null : content
    }

    const release = () => {
      if (!stretched) return
      stretched.style.transition = RELEASE_TRANSITION
      stretched.style.transform = ''
      stretched = null
    }

    const cancel = () => {
      target = null
      anchorY = null
      release()
    }

    const onStart = (event: TouchEvent) => {
      const scroller = scrollerRef.current
      const node = event.target as Node
      if (event.touches.length > 1 || event.defaultPrevented || !scroller?.contains(node)) {
        cancel()
        return
      }
      target = node
      startX = event.touches[0].clientX
      startY = event.touches[0].clientY
      locked = false
      anchorY = atEdge(node, scroller) ? startY : null
    }

    const onMove = (event: TouchEvent) => {
      const scroller = scrollerRef.current
      const content = contentRef.current
      if (!target || !scroller || !content) return
      if (event.touches.length > 1 || event.defaultPrevented) {
        cancel()
        return
      }
      const { clientX: x, clientY: y } = event.touches[0]
      if (!locked) {
        const dx = Math.abs(x - startX)
        const dy = Math.abs(y - startY)
        if (dx < DIRECTION_SLOP && dy < DIRECTION_SLOP) return
        if (dx > dy) {
          cancel()
          return
        }
        locked = true
      }
      if (!atEdge(target, scroller)) {
        anchorY = null
        if (stretched) setScale(content, 1)
        return
      }
      if (anchorY === null) {
        anchorY = y
        return
      }
      const pull = y - anchorY
      const stretch = (distance: number) => 1 + maxStretch * (1 - Math.exp(-distance / RESISTANCE))
      if (pull > 0 && !isScrolledWithin(target, scroller)) setScale(content, stretch(pull), 'top')
      else if (pull < 0 && bottom && isAtBottom(scroller)) setScale(content, stretch(-pull), 'bottom')
      else setScale(content, 1)
    }

    const onEnd = (event: TouchEvent) => {
      if (event.touches.length > 0) return
      cancel()
    }

    document.addEventListener('touchstart', onStart, { passive: true })
    document.addEventListener('touchmove', onMove, { passive: true })
    document.addEventListener('touchend', onEnd, { passive: true })
    document.addEventListener('touchcancel', onEnd, { passive: true })

    return () => {
      document.removeEventListener('touchstart', onStart)
      document.removeEventListener('touchmove', onMove)
      document.removeEventListener('touchend', onEnd)
      document.removeEventListener('touchcancel', onEnd)
      release()
    }
  }, [scrollerRef, contentRef, maxStretch, enabled, bottom])
}
