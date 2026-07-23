import formatTime from '@/shared/lib/formatTime'
import { useTimerStore } from '@/shared/model/timer/useTimerStore'
import { useTranslations } from 'next-intl'
import { motion } from 'motion/react'

export default function OverviewPanel() {
  const timerStatistics = useTimerStore((store) => store.timerStatistics)
  const t = useTranslations('Index')

  const stats = [
    {
      label: t('HomePage.deviation'),
      value: timerStatistics.session.deviation === 0 ? '--' : formatTime(timerStatistics.session.deviation),
      testId: 'timer-session-deviation'
    },
    {
      label: t('HomePage.average'),
      value: timerStatistics.session.mean === 0 ? '--' : formatTime(timerStatistics.session.mean),
      testId: 'timer-session-mean'
    },
    {
      label: t('HomePage.best'),
      value: timerStatistics.session.best === 0 ? '--' : formatTime(timerStatistics.session.best),
      testId: 'timer-session-best'
    },
    {
      label: t('HomePage.counter'),
      value: timerStatistics.session.count === 0 ? '--' : timerStatistics.session.count.toString(),
      testId: 'timer-session-count'
    }
  ]

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { x: -20, opacity: 0 },
    visible: { x: 0, opacity: 1, transition: { duration: 0.2 } }
  }

  return (
    <motion.div
      className="flex flex-col gap-1 md:grid md:grid-cols-2 md:gap-1.5"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {stats.map(({ label, value, testId }) => (
        <motion.div
          key={testId}
          className="stat-notch font-medium md:flex md:flex-col md:justify-center md:bg-primary/10 md:py-2 md:px-3"
          variants={itemVariants}
        >
          <span className="md:text-[8px] md:uppercase md:opacity-70">
            {label}
            {': '}
          </span>
          <span className="md:text-lg md:font-semibold md:text-foreground md:leading-none" data-testid={testId}>
            {value}
          </span>
        </motion.div>
      ))}
    </motion.div>
  )
}
