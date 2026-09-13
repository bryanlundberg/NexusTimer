import { type ReactNode, useEffect, useRef, useState } from 'react'
import { motion } from 'motion/react'
import { cn } from '@/shared/lib/utils'

export interface FormSectionLink {
  id: string
  label: string
}

const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

function findScrollParent(element: HTMLElement): HTMLElement {
  for (let node = element.parentElement; node; node = node.parentElement) {
    const { overflowY } = getComputedStyle(node)
    if (/(auto|scroll)/.test(overflowY) && node.scrollHeight > node.clientHeight) return node
  }
  return document.scrollingElement as HTMLElement
}

export function FormSectionNav({
  sections,
  label,
  actions
}: {
  sections: FormSectionLink[]
  label: string
  actions?: ReactNode
}) {
  const [active, setActive] = useState(sections[0]?.id)
  const lockUntil = useRef(0)

  useEffect(() => {
    let frame = 0

    const update = () => {
      frame = 0
      if (Date.now() < lockUntil.current || !sections.length) return

      const viewport = window.innerHeight
      const elements = sections.map((section) => document.getElementById(section.id))
      let current = sections[0].id
      elements.forEach((element, i) => {
        if (element && element.getBoundingClientRect().top <= viewport * 0.5) current = sections[i].id
      })
      const scroller = elements[0] && findScrollParent(elements[0])
      if (
        scroller &&
        scroller.scrollTop > 0 &&
        scroller.scrollTop + scroller.clientHeight >= scroller.scrollHeight - 2
      ) {
        current = sections[sections.length - 1].id
      }

      setActive(current)
    }

    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }

    update()
    document.addEventListener('scroll', schedule, { capture: true, passive: true })
    window.addEventListener('resize', schedule)
    return () => {
      cancelAnimationFrame(frame)
      document.removeEventListener('scroll', schedule, { capture: true })
      window.removeEventListener('resize', schedule)
    }
  }, [sections])

  const scrollTo = (id: string, smooth = true) => {
    const element = document.getElementById(id)
    if (!element) return
    setActive(id)
    lockUntil.current = Date.now() + 800
    element.scrollIntoView({ behavior: smooth && !prefersReducedMotion() ? 'smooth' : 'auto', block: 'start' })
  }

  useEffect(() => {
    const id = window.location.hash.slice(1)
    if (!sections.some((section) => section.id === id)) return
    const frame = requestAnimationFrame(() => scrollTo(id, false))
    return () => cancelAnimationFrame(frame)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="sticky top-14 z-40 -mx-4 flex h-12 items-center gap-3 border-b border-border/40 bg-background/85 px-4 backdrop-blur-md">
      <nav aria-label={label} className="flex min-w-0 flex-1 gap-1 overflow-x-auto [scrollbar-width:none]">
        {sections.map((section) => {
          const isActive = active === section.id
          return (
            <a
              key={section.id}
              href={`#${section.id}`}
              aria-current={isActive ? 'true' : undefined}
              onClick={(event) => {
                event.preventDefault()
                scrollTo(section.id)
                history.replaceState(null, '', `#${section.id}`)
              }}
              className={cn(
                'relative isolate shrink-0 px-2.5 py-1 text-xs font-medium outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring/50',
                isActive ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'
              )}
            >
              {isActive && (
                <motion.span
                  layoutId="account-section-indicator"
                  aria-hidden
                  className="badge-notch absolute inset-0 -z-10 bg-primary/15 shadow-[inset_2px_0_0_var(--primary)]"
                  transition={{ type: 'spring', stiffness: 500, damping: 40 }}
                />
              )}
              {section.label}
            </a>
          )
        })}
      </nav>
      {actions}
    </div>
  )
}
