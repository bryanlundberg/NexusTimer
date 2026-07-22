'use client'
import { Fragment, ReactNode, ElementType, useCallback, useEffect, useRef, useState } from 'react'
import { motion } from 'motion/react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { TabsList, TabsTrigger } from '@/components/ui/tabs'
import { cn } from '@/shared/lib/utils'
import { INDICATOR_SPRING } from '@/shared/lib/motion'

export interface ScrollableTabItem {
  value: string
  label: ReactNode
  icon?: ElementType
  disabled?: boolean
}

interface ScrollableUnderlineTabsProps {
  items: ScrollableTabItem[]
  activeValue: string
  layoutId: string
  className?: string
}

export default function ScrollableUnderlineTabs({
  items,
  activeValue,
  layoutId,
  className
}: ScrollableUnderlineTabsProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(false)

  const updateArrows = useCallback(() => {
    const el = scrollRef.current
    if (!el) return
    const { scrollLeft, scrollWidth, clientWidth } = el
    setCanScrollLeft(scrollLeft > 1)
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 1)
  }, [])

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    updateArrows()
    el.addEventListener('scroll', updateArrows, { passive: true })
    const observer = new ResizeObserver(updateArrows)
    observer.observe(el)
    return () => {
      el.removeEventListener('scroll', updateArrows)
      observer.disconnect()
    }
  }, [updateArrows, items.length])

  const scrollByStep = (direction: -1 | 1) => {
    const el = scrollRef.current
    if (!el) return
    el.scrollBy({ left: direction * Math.max(el.clientWidth * 0.6, 120), behavior: 'smooth' })
  }

  return (
    <div className={cn('relative flex w-full items-center', className)}>
      {canScrollLeft && (
        <button
          type="button"
          aria-label="Scroll tabs left"
          onClick={() => scrollByStep(-1)}
          className="absolute inset-y-0 left-0 z-20 flex w-9 items-center justify-center border-b border-r border-border bg-background text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <ChevronLeft className="size-4" />
        </button>
      )}

      <div ref={scrollRef} className="w-full overflow-x-auto overflow-y-hidden scrollbar-hide border-b border-border">
        <TabsList className="flex h-auto w-max min-w-full items-stretch justify-start gap-0 rounded-none bg-transparent p-0 text-muted-foreground">
          {items.map((item, index) => {
            const isActive = item.value === activeValue
            const Icon = item.icon
            return (
              <Fragment key={item.value}>
                <TabsTrigger
                  value={item.value}
                  disabled={item.disabled}
                  className="group relative h-auto flex-none shrink-0 gap-1.5 whitespace-nowrap rounded-none border-0 bg-transparent px-4 py-2.5 text-sm font-medium text-muted-foreground hover:text-foreground data-[state=active]:bg-transparent data-[state=active]:text-primary data-[state=active]:shadow-none disabled:pointer-events-none disabled:opacity-40 dark:text-muted-foreground dark:data-[state=active]:bg-transparent dark:data-[state=active]:text-primary"
                >
                  {Icon && <Icon className="size-4" />}
                  {item.label}
                  {isActive && (
                    <motion.span
                      layoutId={layoutId}
                      transition={INDICATOR_SPRING}
                      className="absolute inset-x-0 bottom-0 h-0.5 rounded-full bg-primary"
                    />
                  )}
                </TabsTrigger>
                {index < items.length - 1 && (
                  <span aria-hidden className="flex select-none items-center text-border">
                    |
                  </span>
                )}
              </Fragment>
            )
          })}
        </TabsList>
      </div>

      {canScrollRight && (
        <button
          type="button"
          aria-label="Scroll tabs right"
          onClick={() => scrollByStep(1)}
          className="absolute inset-y-0 right-0 z-20 flex w-9 items-center justify-center border-b border-l border-border bg-background text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <ChevronRight className="size-4" />
        </button>
      )}
    </div>
  )
}
