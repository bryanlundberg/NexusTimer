'use client'

import { useEffect } from 'react'
import type Lenis from 'lenis'
import type { RefObject } from 'react'

/**
 * Drives Lenis smooth-scroll on the landing's custom scroll container.
 *
 * The landing scrolls inside an `overflow-y-auto` element (not the window), so
 * Lenis is bound to that wrapper/content pair. Lenis interpolates the native
 * `scrollTop`, which means `motion/react`'s `useScroll({ container })` and the
 * sticky header keep working off real scroll events — no extra wiring needed.
 *
 * Honors `prefers-reduced-motion`: when reduced motion is requested we skip
 * Lenis entirely and let the browser scroll natively.
 */
export function useLenis(wrapperRef: RefObject<HTMLElement | null>, contentRef: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const wrapper = wrapperRef.current
    const content = contentRef.current
    if (!wrapper || !content) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    let lenis: Lenis | undefined
    let frame = 0
    let cancelled = false

    import('lenis').then(({ default: Lenis }) => {
      if (cancelled) return
      lenis = new Lenis({
        wrapper,
        content,
        lerp: 0.075,
        smoothWheel: true,
        wheelMultiplier: 0.95,
        touchMultiplier: 1.5
      })

      const raf = (time: number) => {
        lenis?.raf(time)
        frame = requestAnimationFrame(raf)
      }
      frame = requestAnimationFrame(raf)
    })

    return () => {
      cancelled = true
      cancelAnimationFrame(frame)
      lenis?.destroy()
    }
  }, [wrapperRef, contentRef])
}
