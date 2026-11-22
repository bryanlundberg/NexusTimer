import type { ReactNode } from 'react'
import { motion } from 'motion/react'
import { Button } from '@/components/ui/button'
import { QaDeleteIcon } from '@/components/ui/quick-action-icons'

interface DeleteSolveToastProps {
  title: ReactNode
  hint: ReactNode
  actionLabel: string
  durationMs: number
  onConfirm: () => void
}

export default function DeleteSolveToast({ title, hint, actionLabel, durationMs, onConfirm }: DeleteSolveToastProps) {
  return (
    <div
      role="alert"
      className="menu-panel relative flex w-[var(--width)] max-w-full items-center gap-3 overflow-hidden border-destructive/50 p-3"
    >
      <span className="flex size-8 shrink-0 items-center justify-center bg-destructive/15 text-destructive">
        <QaDeleteIcon className="size-4" />
      </span>

      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <p className="truncate text-sm font-semibold">{title}</p>
        <p className="text-xs text-muted-foreground">{hint}</p>
      </div>

      <Button variant="destructive" size="sm" className="h-8" onClick={onConfirm}>
        {actionLabel}
      </Button>

      <motion.span
        aria-hidden
        className="absolute inset-x-0 bottom-0 h-0.5 origin-left bg-destructive"
        initial={{ scaleX: 1 }}
        animate={{ scaleX: 0 }}
        transition={{ duration: durationMs / 1000, ease: 'linear' }}
      />
    </div>
  )
}
