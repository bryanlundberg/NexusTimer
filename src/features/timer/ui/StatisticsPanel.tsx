import { useSettingsStore } from '@/shared/model/settings/useSettingsStore'
import formatTime from '@/shared/lib/formatTime'
import { useTimerStore } from '@/store/timerStore'
import { motion } from 'framer-motion'

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

  const renderStatistic = (label: string, key: 'ao5' | 'ao12' | 'ao50' | 'ao100', testId: string) => (
    <motion.div className="flex justify-end w-full font-medium text-right" variants={itemVariants}>
      <div
        className={`w-fit px-[5px] rounded-md ${
          timerStatistics.global[key] !== 0 &&
          timerStatistics.global[key] === timerStatistics.session[key] &&
          settings.alerts.bestAverage
            ? bgRecord
            : ''
        }`}
      >
        {label}:{' '}
        <span data-testid={testId}>
          {timerStatistics.session[key] === 0
            ? timerStatistics.session.count >= Number(key.replace('ao', ''))
              ? 'DNF'
              : '--'
            : formatTime(timerStatistics.session[key])}
        </span>
      </div>
    </motion.div>
  )

  return (
    <>
      <motion.div
        className="flex flex-col justify-center h-full gap-1"
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
