import { type RefObject, useEffect, useState } from 'react'

export type ScrollEdge = 'top' | 'bottom'

export function useScrollEdge(
  scrollRef: RefObject<HTMLElement | null>,
  contentRef: RefObject<HTMLElement | null>,
  edge: ScrollEdge
): boolean {
  const [hasHidden, setHasHidden] = useState(false)

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    const update = () =>
      setHasHidden(edge === 'top' ? el.scrollTop > 1 : el.scrollHeight - el.scrollTop - el.clientHeight > 1)
    update()
    el.addEventListener('scroll', update, { passive: true })
    const observer = new ResizeObserver(update)
    observer.observe(el)
    if (contentRef.current) observer.observe(contentRef.current)
    return () => {
      el.removeEventListener('scroll', update)
      observer.disconnect()
    }
  }, [scrollRef, contentRef, edge])

  return hasHidden
}
