import { cn } from '@/shared/lib/utils'
import type { PresenceDisplay } from '@/features/presence/model/usePresence'

const OUTER = 'M8 0 A8 8 0 1 0 8 16 A8 8 0 1 0 8 0 Z'
const RING_HOLE = 'M8 4 A4 4 0 1 0 8 12 A4 4 0 1 0 8 4 Z' // -> hollow ring (offline/invisible)
const MOON_BITE = 'M4.5 -2 A6.5 6.5 0 1 0 4.5 11 A6.5 6.5 0 1 0 4.5 -2 Z' // -> crescent (away)
const DND_BAR = 'M4 6.5 H12 A1.5 1.5 0 0 1 12 9.5 H4 A1.5 1.5 0 0 1 4 6.5 Z' // -> circle w/ bar (busy)

const SHAPES: Record<PresenceDisplay, string> = {
  online: OUTER,
  away: `${OUTER} ${MOON_BITE}`,
  busy: `${OUTER} ${DND_BAR}`,
  offline: `${OUTER} ${RING_HOLE}`
}

const COLORS: Record<PresenceDisplay, string> = {
  online: 'text-emerald-500',
  away: 'text-amber-400',
  busy: 'text-red-500',
  offline: 'text-zinc-400 dark:text-zinc-500'
}

interface Props {
  state: PresenceDisplay
  className?: string
}

export function PresenceDot({ state, className }: Props) {
  return (
    <svg viewBox="0 0 16 16" fill="currentColor" aria-hidden className={cn('shrink-0', COLORS[state], className)}>
      <path fillRule="evenodd" clipRule="evenodd" d={SHAPES[state]} />
    </svg>
  )
}

export default PresenceDot
