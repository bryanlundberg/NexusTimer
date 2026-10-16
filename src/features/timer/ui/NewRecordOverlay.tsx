import { createPortal } from 'react-dom'
import { motion } from 'motion/react'
import { cn } from '@/shared/lib/utils'
import { Solve } from '@/entities/solve/model/types'
import NewRecordBadge from '@/features/timer/ui/NewRecordBadge'

interface NewRecordOverlayProps {
  solve: Solve
  improvement: number | null
  hidden: boolean
  onDismiss: () => void
}

export default function NewRecordOverlay({ solve, improvement, hidden, onDismiss }: NewRecordOverlayProps) {
  return createPortal(
    <div className={cn('fixed inset-0 z-50 flex items-center justify-center p-4', hidden && 'invisible')}>
      <motion.div
        aria-hidden
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.2 }}
        className="absolute inset-0 bg-background/40 backdrop-blur-sm"
      />
      <div className="relative drop-shadow-lg">
        <NewRecordBadge solve={solve} improvement={improvement} onDismiss={onDismiss} />
      </div>
    </div>,
    document.body
  )
}
