import { useEffect, useState } from 'react'

export interface ScrollEdges {
  start: boolean
  end: boolean
}

export function useScrollEdges<T extends HTMLElement>() {
  const [element, setElement] = useState<T | null>(null)
  const [edges, setEdges] = useState<ScrollEdges>({ start: false, end: false })

  useEffect(() => {
    if (!element) return
    const update = () => {
      const max = element.scrollWidth - element.clientWidth
      const start = element.scrollLeft > 1
      const end = element.scrollLeft < max - 1
      setEdges((prev) => (prev.start === start && prev.end === end ? prev : { start, end }))
    }
    update()
    element.addEventListener('scroll', update, { passive: true })
    const observer = new ResizeObserver(update)
    observer.observe(element)
    Array.from(element.children).forEach((child) => observer.observe(child))
    return () => {
      element.removeEventListener('scroll', update)
      observer.disconnect()
    }
  }, [element])

  return [setElement, edges] as const
}

export function scrollEdgesMask({ start, end }: ScrollEdges, fade = '2.5rem'): string | undefined {
  if (!start && !end) return undefined
  const from = start ? `transparent, black ${fade}` : 'black'
  const to = end ? `black calc(100% - ${fade}), transparent` : 'black'
  return `linear-gradient(to right, ${from}, ${to})`
}
