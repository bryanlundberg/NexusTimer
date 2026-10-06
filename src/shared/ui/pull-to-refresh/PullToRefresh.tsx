'use client'
import type * as React from 'react'
import { cn } from '@/shared/lib/utils'
import { PULL_TRIGGER_OFFSET, usePullToRefresh } from '@/shared/model/usePullToRefresh'

const BADGE_SIZE = 40
const ARC_PATH = 'M18.93 9A8 8 0 1 1 12 5'
const ARROW_PATH = 'M9.53 2.53 12 5 9.53 7.47'
const HIDDEN_DASH_OFFSET = 1.5

interface PullToRefreshProps {
  scrollerRef: React.RefObject<HTMLElement | null>
  onRefresh: () => unknown
}

export function PullToRefresh({ scrollerRef, onRefresh }: PullToRefreshProps) {
  const { offset, dragging, refreshing } = usePullToRefresh(scrollerRef, onRefresh)
  const progress = Math.min(offset / PULL_TRIGGER_OFFSET, 1)
  const armed = progress >= 1

  return (
    <div aria-hidden className="pointer-events-none relative z-40 h-0">
      <div
        className={cn(
          'btn-notch btn-notch-border absolute top-0 left-1/2 isolate grid size-10 place-items-center',
          !dragging && 'transition-[transform,opacity] duration-300 ease-out'
        )}
        style={
          {
            transform: `translate(-50%, ${offset - BADGE_SIZE}px)`,
            opacity: Math.min(progress * 1.5, 1),
            '--btn-border-color': armed ? 'var(--primary)' : undefined
          } as React.CSSProperties
        }
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          className={cn(
            'size-5 transition-colors',
            armed ? 'text-primary' : 'text-muted-foreground',
            refreshing && 'animate-spin'
          )}
        >
          <path
            d={ARC_PATH}
            pathLength={1}
            strokeDasharray="1 2"
            strokeDashoffset={1 - progress}
            className={cn(!dragging && 'transition-[stroke-dashoffset] duration-300 ease-out')}
          />
          <path
            d={ARROW_PATH}
            pathLength={1}
            strokeDasharray="1 2"
            strokeDashoffset={armed ? 0 : HIDDEN_DASH_OFFSET}
            className="transition-[stroke-dashoffset] duration-200 ease-out"
          />
        </svg>
      </div>
    </div>
  )
}
