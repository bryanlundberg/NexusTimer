import formatTime from '@/lib/formatTime';
import { useTimerStore } from '@/store/timerStore';
import { useTranslations } from 'next-intl';
import { useMemo } from 'react';
import { motion } from 'framer-motion';

export default function OverviewPanel() {
  const timerStatistics = useTimerStore(store => store.timerStatistics);
  const t = useTranslations('Index');

  const stats = useMemo(() => {
    return [
      {
        label: t('HomePage.deviation'),
        value: formatTime(timerStatistics.session.deviation),
        testId: 'timer-session-deviation',
      },
      {
        label: t('HomePage.average'),
        value: formatTime(timerStatistics.session.mean),
        testId: 'timer-session-mean',
      },
      {
        label: t('HomePage.best'),
        value: formatTime(timerStatistics.session.best),
        testId: 'timer-session-best',
      },
      {
        label: t('HomePage.counter'),
        value: timerStatistics.session.count.toString(),
        testId: 'timer-session-count',
      },
    ]
  }, [timerStatistics.session, t]);

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { x: -20, opacity: 0 },
    visible: { x: 0, opacity: 1, transition: { duration: 0.2 } }
  };

  return (
    <motion.div
      className="flex flex-col justify-center h-full gap-1"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {stats.map(({ label, value, testId }) => (
        <motion.div
          className="font-medium"
          key={testId}
          variants={itemVariants}
        >
          {label}
          {': '}
          <span data-testid={testId}>{value}</span>
        </motion.div>
      ))}
    </motion.div>
  );
}
