import { useSettingsStore } from '@/shared/model/settings/useSettingsStore'
import formatTime from '@/shared/lib/formatTime'
import { DEFAULT_TIMER_AVERAGES, DESKTOP_MIN_WIDTH, resolveAverages } from '@/shared/lib/statistics/averageSizes'
import { useMinWidth } from '@/shared/model/use-min-width'
import { useTimerStore } from '@/shared/model/timer/useTimerStore'
import { motion } from 'motion/react'
import TimerStatTile from './TimerStatTile'

export default function StatisticsPanel() {
  const settings = useSettingsStore((store) => store.settings)
  const timerStatistics = useTimerStore((store) => store.timerStatistics)
  const showsTiles = useMinWidth(DESKTOP_MIN_WIDTH)

  const isRecord = (size: number) => {
    const best = timerStatistics.global[`ao${size}`]
    return Boolean(best) && best === timerStatistics.session[`ao${size}`] && settings.alerts.bestAverage
  }

  const getValue = (size: number) => {
    const value = timerStatistics.session[`ao${size}`]
    if (value === undefined) return '--'
    return value === 0 ? (timerStatistics.session.count >= size ? 'DNF' : '--') : formatTime(value)
  }

  if (!settings.features.sessionStats) return null

  const sizes = showsTiles
    ? DEFAULT_TIMER_AVERAGES
    : resolveAverages(settings.features.timerAverages, DEFAULT_TIMER_AVERAGES)

  return (
    <motion.div
      className="flex flex-col gap-1 md:grid md:grid-cols-2 md:gap-1.5"
      variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.1 } } }}
      initial="hidden"
      animate="visible"
    >
      {sizes.map((size) => (
        <TimerStatTile
          key={size}
          label={`Ao${size}`}
          value={getValue(size)}
          testId={`timer-session-ao${size}`}
          side="right"
          isRecord={isRecord(size)}
        />
      ))}
    </motion.div>
  )
}
