import { type RefObject, useEffect, useRef } from 'react'

const DIRECTION_SLOP = 8
const CLOSE_RATIO = 0.4
const FLICK_VELOCITY = 0.5
const VELOCITY_WINDOW_MS = 100
const CLOSE_MS = 300
const MIN_CLOSE_MS = 120
const SETTLE = '300ms cubic-bezier(0.22, 1, 0.36, 1)'

interface SwipeToCloseOptions {
  side?: 'left' | 'right'
  enabled?: boolean
}

export function useSwipeToClose(
  contentRef: RefObject<HTMLElement | null>,
  overlayRef: RefObject<HTMLElement | null>,
  onClose: () => void,
  { side = 'left', enabled = true }: SwipeToCloseOptions = {}
) {
  const onCloseRef = useRef(onClose)

  useEffect(() => {
    onCloseRef.current = onClose
  })

  useEffect(() => {
    if (!enabled) return

    const direction = side === 'left' ? -1 : 1
    let tracking = false
    let locked = false
    let startX = 0
    let startY = 0
    let width = 0
    let offset = 0
    let lastX = 0
    let lastTime = 0
    let velocity = 0

    const paint = (content: HTMLElement) => {
      content.style.transition = 'none'
      content.style.transform = `translate3d(${offset}px, 0, 0)`
      const overlay = overlayRef.current
      if (!overlay) return
      overlay.style.transition = 'none'
      overlay.style.opacity = String(1 - Math.abs(offset) / width)
    }

    const settle = () => {
      const content = contentRef.current
      const overlay = overlayRef.current
      if (content) {
        content.style.transition = `transform ${SETTLE}`
        content.style.transform = ''
      }
      if (overlay) {
        overlay.style.transition = `opacity ${SETTLE}`
        overlay.style.opacity = ''
      }
    }

    const close = () => {
      const duration = `${Math.max(MIN_CLOSE_MS, Math.round(CLOSE_MS * (1 - Math.abs(offset) / width)))}ms`
      for (const element of [contentRef.current, overlayRef.current]) {
        if (!element) continue
        element.style.animationDuration = duration
        element.style.animationTimingFunction = 'ease-out'
      }
      onCloseRef.current()
    }

    const cancel = () => {
      if (locked) settle()
      tracking = false
      locked = false
    }

    const onStart = (event: TouchEvent) => {
      const content = contentRef.current
      const node = event.target as Node
      const inside = !!content?.contains(node) || !!overlayRef.current?.contains(node)
      if (event.touches.length > 1 || event.defaultPrevented || !inside) {
        cancel()
        return
      }
      tracking = true
      locked = false
      startX = lastX = event.touches[0].clientX
      startY = event.touches[0].clientY
      lastTime = event.timeStamp
      velocity = 0
    }

    const onMove = (event: TouchEvent) => {
      const content = contentRef.current
      if (!tracking || !content) return
      if (event.touches.length > 1) {
        cancel()
        return
      }
      const { clientX: x, clientY: y } = event.touches[0]
      if (!locked) {
        const dx = x - startX
        const dy = Math.abs(y - startY)
        if (Math.abs(dx) < DIRECTION_SLOP && dy < DIRECTION_SLOP) return
        width = content.offsetWidth
        if (Math.abs(dx) <= dy || Math.sign(dx) !== direction || !width) {
          tracking = false
          return
        }
        locked = true
      }
      const elapsed = event.timeStamp - lastTime
      if (elapsed > 0) velocity = (x - lastX) / elapsed
      lastX = x
      lastTime = event.timeStamp
      offset = direction < 0 ? Math.max(-width, Math.min(0, x - startX)) : Math.min(width, Math.max(0, x - startX))
      paint(content)
    }

    const onEnd = (event: TouchEvent) => {
      if (!tracking || event.touches.length > 0) return
      tracking = false
      if (!locked) return
      locked = false
      if (event.timeStamp - lastTime > VELOCITY_WINDOW_MS) velocity = 0
      const towardClose = velocity * direction
      const shouldClose =
        towardClose >= FLICK_VELOCITY || (towardClose > -FLICK_VELOCITY && Math.abs(offset) > width * CLOSE_RATIO)
      if (shouldClose) close()
      else settle()
    }

    document.addEventListener('touchstart', onStart, { passive: true })
    document.addEventListener('touchmove', onMove, { passive: true })
    document.addEventListener('touchend', onEnd, { passive: true })
    document.addEventListener('touchcancel', cancel, { passive: true })

    return () => {
      document.removeEventListener('touchstart', onStart)
      document.removeEventListener('touchmove', onMove)
      document.removeEventListener('touchend', onEnd)
      document.removeEventListener('touchcancel', cancel)
    }
  }, [contentRef, overlayRef, side, enabled])
}
