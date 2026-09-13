import { useSettingsStore } from '@/shared/model/settings/useSettingsStore'
import formatTime from '@/shared/lib/formatTime'
import { useTimerStore } from '@/shared/model/timer/useTimerStore'
import { motion } from 'motion/react'
import TimerStatTile from './TimerStatTile'

const AVERAGES = [
  { label: 'Ao5', key: 'ao5', testId: 'timer-session-ao5' },
  { label: 'Ao12', key: 'ao12', testId: 'timer-session-ao12' },
  { label: 'Ao50', key: 'ao50', testId: 'timer-session-ao50' },
  { label: 'Ao100', key: 'ao100', testId: 'timer-session-ao100' }
] as const

type AverageKey = (typeof AVERAGES)[number]['key']

export default function StatisticsPanel() {
  const settings = useSettingsStore((store) => store.settings)
  const timerStatistics = useTimerStore((store) => store.timerStatistics)

  const isRecord = (key: AverageKey) =>
    timerStatistics.global[key] !== 0 &&
    timerStatistics.global[key] === timerStatistics.session[key] &&
    settings.alerts.bestAverage

  const getValue = (key: AverageKey) =>
    timerStatistics.session[key] === 0
      ? timerStatistics.session.count >= Number(key.replace('ao', ''))
        ? 'DNF'
        : '--'
      : formatTime(timerStatistics.session[key])

  if (!settings.features.sessionStats) return null

  return (
    <motion.div
      className="flex flex-col gap-1 md:grid md:grid-cols-2 md:gap-1.5"
      variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.1 } } }}
      initial="hidden"
      animate="visible"
    >
      {AVERAGES.map(({ label, key, testId }) => (
        <TimerStatTile
          key={testId}
          label={label}
          value={getValue(key)}
          testId={testId}
          side="right"
          isRecord={isRecord(key)}
        />
      ))}
    </motion.div>
  )
}
