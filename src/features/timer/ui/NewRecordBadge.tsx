import { motion } from 'motion/react'
import { useTranslations } from 'next-intl'
import { Nexi } from '@/shared/ui/nexi'
import formatTime from '@/shared/lib/formatTime'

interface NewRecordBadgeProps {
  time: number
}

export default function NewRecordBadge({ time }: NewRecordBadgeProps) {
  const t = useTranslations('Index.HomePage')

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="flex items-center gap-3 rounded-2xl px-4 py-2.5 text-primary"
      role="status"
    >
      <Nexi state="pb" size={32} aria-hidden />
      <div className="flex flex-col text-left">
        <span className="text-sm font-semibold">{t('congratulations', { time: formatTime(time) })}</span>
        <span className="text-xs text-muted-foreground">{t('personal_best')}</span>
      </div>
    </motion.div>
  )
}
