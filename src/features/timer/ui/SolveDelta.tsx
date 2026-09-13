import { useMemo } from 'react'
import { motion } from 'motion/react'
import { cn } from '@/shared/lib/utils'
import formatTime from '@/shared/lib/formatTime'
import { useTimerStore } from '@/shared/model/timer/useTimerStore'
import { useSettingsStore } from '@/shared/model/settings/useSettingsStore'
import { Solve } from '@/entities/solve/model/types'

export default function SolveDelta({ className }: { className?: string }) {
  const lastSolve = useTimerStore((store) => store.lastSolve)
  const selectedCube = useTimerStore((store) => store.selectedCube)
  const decimals = useSettingsStore((store) => store.settings.timer.decimals)

  const delta = useMemo(() => {
    if (!lastSolve || lastSolve.dnf || !selectedCube) return null
    const previous = selectedCube.solves.session.reduce<Solve | null>(
      (latest, solve) =>
        solve.id !== lastSolve.id &&
        !solve.isDeleted &&
        solve.endTime < lastSolve.endTime &&
        (!latest || solve.endTime > latest.endTime)
          ? solve
          : latest,
      null
    )
    if (!previous || previous.dnf) return null
    return lastSolve.time - previous.time
  }, [lastSolve, selectedCube])

  if (delta === null || !lastSolve) return null

  const tone =
    delta < 0
      ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400'
      : delta > 0
        ? 'bg-destructive/10 text-destructive'
        : 'bg-muted text-muted-foreground'

  return (
    <motion.div
      key={lastSolve.id}
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className={cn(
        'chip-notch w-fit px-2.5 py-1 font-mono text-xs font-semibold tabular-nums sm:text-sm',
        tone,
        className
      )}
      data-testid="solve-delta"
    >
      ({delta < 0 ? '−' : '+'}
      {formatTime(Math.abs(delta), decimals)})
    </motion.div>
  )
}
