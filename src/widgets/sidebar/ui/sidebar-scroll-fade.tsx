'use client'

import type { RefObject } from 'react'
import { cn } from '@/shared/lib/utils'
import { type ScrollEdge, useScrollEdge } from '@/widgets/sidebar/model/useScrollEdge'

type SidebarScrollFadeProps = {
  edge: ScrollEdge
  scrollRef: RefObject<HTMLElement | null>
  contentRef: RefObject<HTMLElement | null>
}

export function SidebarScrollFade({ edge, scrollRef, contentRef }: SidebarScrollFadeProps) {
  const visible = useScrollEdge(scrollRef, contentRef, edge)

  return (
    <div
      aria-hidden
      className={cn(
        'pointer-events-none absolute inset-x-0 z-10 h-5 from-sidebar/60 to-transparent transition-opacity duration-200',
        edge === 'top' ? 'top-full bg-linear-to-b' : 'bottom-full bg-linear-to-t',
        visible ? 'opacity-100' : 'opacity-0'
      )}
    />
  )
}
