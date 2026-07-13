'use client'

import { AnimatePresence, motion } from 'motion/react'
import { cn } from '@/shared/lib/utils'
import { truncateGuide, type ScrambleGuide, type ScrambleGuideItem } from '@/shared/lib/timer/scrambleGuide'
import { SCRAMBLE_GUIDE_MAX_MOVES } from '@/features/timer/model/const'

const renderGuideMove = (
  item: ScrambleGuideItem,
  { isCorrection, isNext }: { isCorrection: boolean; isNext: boolean }
) => (
  <motion.span
    key={item.key}
    layout
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0, transition: { duration: 0.1, ease: 'easeIn' } }}
    transition={{ duration: 0.45, ease: 'easeOut' }}
    className={cn(
      'leading-none',
      isNext
        ? cn(
            'inline-flex items-center justify-center size-[2.1em] rounded-full border-2 font-semibold',
            isCorrection ? 'border-destructive bg-destructive/10 text-destructive' : 'border-primary bg-primary/10'
          )
        : isCorrection && 'text-destructive font-medium'
    )}
  >
    {item.move}
  </motion.span>
)

interface ScrambleGuideMovesProps {
  guide: ScrambleGuide | null
  max?: number
  className?: string
}

export function ScrambleGuideMoves({ guide, max = SCRAMBLE_GUIDE_MAX_MOVES, className }: ScrambleGuideMovesProps) {
  if (!guide) return null
  const show = guide.corrections.length > 0 || guide.pending.length > 0
  if (!show) return null

  const visible = truncateGuide(guide, max)

  return (
    <p className={cn('flex flex-wrap items-center justify-center gap-x-2 gap-y-2', className)}>
      <AnimatePresence initial={false} mode="popLayout">
        {visible.corrections.map((item, i) => renderGuideMove(item, { isCorrection: true, isNext: i === 0 }))}
        {visible.pending.map((item, i) =>
          renderGuideMove(item, { isCorrection: false, isNext: visible.corrections.length === 0 && i === 0 })
        )}
        {visible.hiddenCount > 0 && (
          <motion.span
            key="guide-overflow"
            layout
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.1, ease: 'easeIn' } }}
            transition={{ duration: 0.45, ease: 'easeOut' }}
            className="leading-none text-muted-foreground font-medium select-none tabular-nums"
          >
            …
          </motion.span>
        )}
      </AnimatePresence>
    </p>
  )
}
