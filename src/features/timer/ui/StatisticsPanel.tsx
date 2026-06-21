import { useSettingsStore } from '@/shared/model/settings/useSettingsStore'
import formatTime from '@/shared/lib/formatTime'
import { useTimerStore } from '@/shared/model/timer/useTimerStore'
import { motion } from 'motion/react'

export default function StatisticsPanel() {
  const settings = useSettingsStore((store) => store.settings)
  const timerStatistics = useTimerStore((store) => store.timerStatistics)
  const bgRecord = 'bg-yellow-500'

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { x: 20, opacity: 0 },
    visible: { x: 0, opacity: 1, transition: { duration: 0.2 } }
  }

  const isRecord = (key: 'ao5' | 'ao12' | 'ao50' | 'ao100') =>
    timerStatistics.global[key] !== 0 &&
    timerStatistics.global[key] === timerStatistics.session[key] &&
    settings.alerts.bestAverage

  const getValue = (key: 'ao5' | 'ao12' | 'ao50' | 'ao100') =>
    timerStatistics.session[key] === 0
      ? timerStatistics.session.count >= Number(key.replace('ao', ''))
        ? 'DNF'
        : '--'
      : formatTime(timerStatistics.session[key])

  const renderStatistic = (label: string, key: 'ao5' | 'ao12' | 'ao50' | 'ao100', testId: string) => (
    <motion.div
      className={`font-medium text-right md:text-left md:flex md:flex-col md:justify-center md:rounded-md md:py-2 md:px-3 ${isRecord(key) ? `${bgRecord} md:px-3 rounded-md px-1` : 'md:bg-card/40'}`}
      variants={itemVariants}
    >
      <span className="md:text-[8px] md:uppercase md:opacity-70">
        {label}
        {': '}
      </span>
      <span className="md:text-lg md:font-semibold md:text-foreground md:leading-none" data-testid={testId}>
        {getValue(key)}
      </span>
    </motion.div>
  )

  return (
    <>
      <motion.div
        className="flex flex-col gap-1 md:grid md:grid-cols-2 md:gap-1.5"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {settings.features.sessionStats && (
          <>
            {renderStatistic('Ao5', 'ao5', 'timer-session-ao5')}
            {renderStatistic('Ao12', 'ao12', 'timer-session-ao12')}
            {renderStatistic('Ao50', 'ao50', 'timer-session-ao50')}
            {renderStatistic('Ao100', 'ao100', 'timer-session-ao100')}
          </>
        )}
      </motion.div>
    </>
  )
}
