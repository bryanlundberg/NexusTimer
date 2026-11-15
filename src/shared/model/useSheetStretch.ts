import { useCallback, type PointerEvent as ReactPointerEvent } from 'react'

const STRETCH_LIMIT = 120
const START_THRESHOLD = 6
const RELEASE_MS = 320
const RELEASE_EASING = 'cubic-bezier(0.16, 1, 0.3, 1)'
const BLOCKING_TARGETS = 'input, textarea, select, [contenteditable="true"], [data-vaul-no-drag]'

function rubberBand(distance: number) {
  return (1 - 1 / ((distance * 0.55) / STRETCH_LIMIT + 1)) * STRETCH_LIMIT
}

function prefersReducedMotion() {
  return typeof window.matchMedia === 'function' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

function canScrollFurther(element: HTMLElement) {
  const { overflowY } = getComputedStyle(element)
  if (overflowY !== 'auto' && overflowY !== 'scroll') return false
  return element.scrollTop + element.clientHeight < element.scrollHeight - 1
}

function canStretchFrom(target: EventTarget | null, sheet: HTMLElement) {
  if (!(target instanceof Element) || target.closest(BLOCKING_TARGETS)) return false
  for (let el: Element | null = target; el && el !== sheet; el = el.parentElement) {
    if (el instanceof HTMLElement && canScrollFurther(el)) return false
  }
  return true
}

export function useSheetStretch() {
  return useCallback((event: ReactPointerEvent<HTMLElement>) => {
    const sheet = event.currentTarget
    if (event.pointerType === 'mouse' && event.button !== 0) return
    if (sheet.dataset.vaulDrawerDirection && sheet.dataset.vaulDrawerDirection !== 'bottom') return
    if (prefersReducedMotion() || !canStretchFrom(event.target, sheet)) return

    const { pointerId, clientY: startY } = event
    let decided = false
    let offset = 0

    const stop = () => {
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerup', release)
      window.removeEventListener('pointercancel', release)
    }

    function move(e: PointerEvent) {
      if (e.pointerId !== pointerId) return
      const lifted = startY - e.clientY
      if (!decided) {
        if (Math.abs(lifted) < START_THRESHOLD) return
        decided = true
        if (lifted < 0) return stop()
      }
      offset = lifted > 0 ? rubberBand(lifted) : 0
      sheet.style.translate = `0 ${-offset}px`
    }

    function release(e: PointerEvent) {
      if (e.pointerId !== pointerId) return
      stop()
      if (offset === 0) return
      sheet.style.translate = ''
      sheet.animate([{ translate: `0 ${-offset}px` }, { translate: '0 0' }], {
        duration: RELEASE_MS,
        easing: RELEASE_EASING
      })
    }

    window.addEventListener('pointermove', move)
    window.addEventListener('pointerup', release)
    window.addEventListener('pointercancel', release)
  }, [])
}
