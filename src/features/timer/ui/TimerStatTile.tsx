import { motion } from 'motion/react'
import { Trophy } from 'lucide-react'
import { cn } from '@/shared/lib/utils'

interface TimerStatTileProps {
  label: string
  value: string
  testId: string
  side: 'left' | 'right'
  isRecord?: boolean
}

export default function TimerStatTile({ label, value, testId, side, isRecord = false }: TimerStatTileProps) {
  const isEmpty = value === '--'

  return (
    <motion.div
      variants={{
        hidden: { x: side === 'left' ? -20 : 20, opacity: 0 },
        visible: { x: 0, opacity: 1, transition: { duration: 0.2 } }
      }}
      className={cn(
        'font-medium transition-colors md:flex md:min-w-24 md:flex-col md:justify-center md:gap-1 md:px-3 md:py-2 md:text-left',
        side === 'left' ? 'stat-notch' : 'stat-notch-r text-right',
        isRecord ? 'text-amber-700 md:bg-amber-500/15 dark:text-amber-400' : 'md:bg-primary/[0.08]'
      )}
    >
      <span className="md:flex md:items-center md:gap-1 md:font-display md:text-[9px] md:font-semibold md:uppercase md:tracking-[0.14em] md:text-muted-foreground">
        {label}
        <span className="md:hidden">: </span>
        {isRecord && <Trophy aria-hidden className="hidden size-2.5 text-amber-500 md:inline" />}
      </span>
      <motion.span
        key={value}
        data-testid={testId}
        initial={{ opacity: 0, y: 3 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.18 }}
        className={cn(
          'inline-block font-mono tabular-nums md:text-lg md:font-semibold md:leading-none',
          isEmpty ? 'md:text-muted-foreground/50' : !isRecord && 'md:text-foreground'
        )}
      >
        {value}
      </motion.span>
    </motion.div>
  )
}
