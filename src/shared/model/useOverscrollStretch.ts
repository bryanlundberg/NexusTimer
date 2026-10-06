import { type RefObject, useEffect } from 'react'

const MAX_STRETCH = 0.08
const RESISTANCE = 300
const RELEASE_TRANSITION = 'transform 450ms cubic-bezier(0.22, 1, 0.36, 1)'

export function useOverscrollStretch(
  scrollerRef: RefObject<HTMLElement | null>,
  contentRef: RefObject<HTMLElement | null>
) {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    let tracking = false
    let anchorY: number | null = null
    let stretched: HTMLElement | null = null

    const setScale = (content: HTMLElement, scale: number) => {
      content.style.transition = 'none'
      content.style.transformOrigin = 'top'
      content.style.transform = scale === 1 ? '' : `scaleY(${scale})`
      stretched = scale === 1 ? null : content
    }

    const release = () => {
      if (!stretched) return
      stretched.style.transition = RELEASE_TRANSITION
      stretched.style.transform = ''
      stretched = null
    }

    const onStart = (event: TouchEvent) => {
      const scroller = scrollerRef.current
      tracking = !!scroller?.contains(event.target as Node)
      anchorY = scroller && tracking && scroller.scrollTop <= 0 ? event.touches[0].clientY : null
    }

    const onMove = (event: TouchEvent) => {
      const scroller = scrollerRef.current
      const content = contentRef.current
      if (!tracking || !scroller || !content) return
      const y = event.touches[0].clientY
      if (scroller.scrollTop > 0) {
        anchorY = null
        if (stretched) setScale(content, 1)
        return
      }
      if (anchorY === null) {
        anchorY = y
        return
      }
      const pull = y - anchorY
      setScale(content, pull > 0 ? 1 + MAX_STRETCH * (1 - Math.exp(-pull / RESISTANCE)) : 1)
    }

    const onEnd = (event: TouchEvent) => {
      if (event.touches.length > 0) return
      tracking = false
      anchorY = null
      release()
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
  }, [scrollerRef, contentRef])
}
