import formatTime from '@/shared/lib/formatTime'
import { useTimerStore } from '@/shared/model/timer/useTimerStore'
import { useTranslations } from 'next-intl'
import { motion } from 'motion/react'
import TimerStatTile from './TimerStatTile'

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

  return (
    <motion.div
      className="flex flex-col gap-1 md:grid md:grid-cols-2 md:gap-1.5"
      variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.1 } } }}
      initial="hidden"
      animate="visible"
    >
      {stats.map(({ label, value, testId }) => (
        <TimerStatTile key={testId} label={label} value={value} testId={testId} side="left" />
      ))}
    </motion.div>
  )
}
