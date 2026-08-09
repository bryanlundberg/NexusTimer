'use client'
import { useMemo } from 'react'
import { useTranslations } from 'next-intl'
import { AnimatePresence, motion } from 'motion/react'
import { Crown, RotateCcw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import formatTime from '@/shared/lib/formatTime'
import { cn } from '@/shared/lib/utils'
import { LaneStatus } from '@/features/versus/model/types'
import { useVersusStore } from '@/features/versus/model/useVersusStore'

const DISPLAY_PRECISION_MS = 10

function toDisplayed(timeMs: number) {
  return Math.floor(timeMs / DISPLAY_PRECISION_MS) * DISPLAY_PRECISION_MS
}

export default function VersusResults() {
  const t = useTranslations('VersusPage')
  const players = useVersusStore((state) => state.players)
  const nextRound = useVersusStore((state) => state.nextRound)
  const resetMatch = useVersusStore((state) => state.resetMatch)

  const isRoundOver = players.length > 0 && players.every((player) => player.status === LaneStatus.DONE)

  const standings = useMemo(() => {
    const ranked = [...players].sort((a, b) => (a.timeMs ?? Infinity) - (b.timeMs ?? Infinity))
    const winnerTime = ranked[0]?.timeMs ?? 0

    return ranked.map((player, index) => ({
      ...player,
      position: index + 1,
      gap: toDisplayed(player.timeMs ?? 0) - toDisplayed(winnerTime)
    }))
  }, [players])

  return (
    <AnimatePresence>
      {isRoundOver && (
        <motion.div
          key="versus-results"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          className="absolute inset-0 z-10 flex items-center justify-center bg-background/85 p-4 backdrop-blur-sm"
        >
          <motion.div
            initial={{ y: 12, scale: 0.98 }}
            animate={{ y: 0, scale: 1 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
            data-testid="versus-results"
            className="w-full max-w-sm rounded-lg border bg-card p-4 shadow-lg"
          >
            <p className="mb-3 text-sm font-semibold">{t('round-results')}</p>

            <ul className="mb-4 flex flex-col gap-1.5">
              {standings.map((player) => (
                <li
                  key={player.id}
                  className={cn(
                    'flex items-center gap-2 rounded-md px-2 py-1.5',
                    player.position === 1 ? 'bg-muted' : 'bg-transparent'
                  )}
                  style={{ '--lane': player.color } as React.CSSProperties}
                >
                  <span className="w-4 text-xs font-semibold tabular-nums text-muted-foreground">
                    {player.position}
                  </span>
                  {player.position === 1 && <Crown className="size-3.5 text-cube-yellow" />}
                  <span className="truncate text-sm font-medium" style={{ color: 'var(--lane)' }}>
                    {player.name || t('player', { number: player.id + 1 })}
                  </span>
                  <span className="ml-auto font-mono text-sm font-semibold tabular-nums">
                    {formatTime(player.timeMs ?? 0)}
                  </span>
                  <span className="w-14 text-right font-mono text-[11px] tabular-nums text-muted-foreground">
                    {player.position === 1 ? '—' : `+${formatTime(player.gap)}`}
                  </span>
                </li>
              ))}
            </ul>

            <div className="flex gap-2">
              <Button className="grow" data-testid="versus-next-round" onClick={nextRound}>
                {t('next-round')}
              </Button>
              <Button variant="outline" size="icon" onClick={resetMatch} aria-label={t('reset')}>
                <RotateCcw className="size-4" />
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
