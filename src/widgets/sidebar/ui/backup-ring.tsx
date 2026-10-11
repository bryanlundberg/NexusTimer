import type { ReactNode } from 'react'
import { cn } from '@/shared/lib/utils'

const RADIUS = 16.5
const CIRCUMFERENCE = 2 * Math.PI * RADIUS

interface BackupRingProps {
  percent: number
  isLast: boolean
  strokeWidth?: number
  className?: string
  children: ReactNode
}

export function BackupRing({ percent, isLast, strokeWidth = 2, className, children }: BackupRingProps) {
  return (
    <span className={cn('relative grid shrink-0 place-items-center', className)}>
      <svg viewBox="0 0 36 36" className="absolute inset-0 size-full -rotate-90" aria-hidden>
        <circle cx="18" cy="18" r={RADIUS} fill="none" strokeWidth={strokeWidth} className="stroke-muted" />
        <circle
          cx="18"
          cy="18"
          r={RADIUS}
          fill="none"
          strokeWidth={strokeWidth}
          className={isLast ? 'stroke-cube-green' : 'stroke-primary'}
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={CIRCUMFERENCE * (1 - percent / 100)}
          style={{ transition: 'stroke-dashoffset 0.35s ease' }}
        />
      </svg>
      {children}
    </span>
  )
}
