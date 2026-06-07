import { useCallback, useRef } from 'react'

interface UseLongPressOptions {
  onLongPress: () => void
  threshold?: number
  moveTolerance?: number
  suppressWindow?: number
}

/**
 * Detects a prolonged touch (long press) without interfering with scrolling.
 */
export function useLongPress({
  onLongPress,
  threshold = 450,
  moveTolerance = 10,
  suppressWindow = 700
}: UseLongPressOptions) {
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const start = useRef<{ x: number; y: number } | null>(null)
  const suppressUntil = useRef(0)

  const clear = useCallback(() => {
    if (timer.current) {
      clearTimeout(timer.current)
      timer.current = null
    }
  }, [])

  const onTouchStart = useCallback(
    (e: React.TouchEvent) => {
      const touch = e.touches[0]
      start.current = { x: touch.clientX, y: touch.clientY }
      clear()
      timer.current = setTimeout(() => {
        suppressUntil.current = Date.now() + suppressWindow
        if (typeof navigator !== 'undefined' && navigator.vibrate) navigator.vibrate(15)
        onLongPress()
      }, threshold)
    },
    [clear, onLongPress, threshold, suppressWindow]
  )

  const onTouchMove = useCallback(
    (e: React.TouchEvent) => {
      if (!start.current) return
      const touch = e.touches[0]
      const dx = Math.abs(touch.clientX - start.current.x)
      const dy = Math.abs(touch.clientY - start.current.y)
      if (dx > moveTolerance || dy > moveTolerance) clear()
    },
    [clear, moveTolerance]
  )

  const onTouchEnd = useCallback(() => clear(), [clear])

  const isSuppressed = useCallback(() => Date.now() < suppressUntil.current, [])

  return {
    isSuppressed,
    handlers: { onTouchStart, onTouchMove, onTouchEnd }
  }
}
