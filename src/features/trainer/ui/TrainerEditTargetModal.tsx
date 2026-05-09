'use client'

import { useState } from 'react'
import { DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { useOverlayStore } from '@/shared/model/overlay-store/useOverlayStore'
import { cn } from '@/shared/lib/utils'

const TARGET_OPTIONS = [1, 2, 3, 4, 5] as const

interface TrainerEditTargetModalProps {
  initial: number
  onApply: (next: number) => void
}

export default function TrainerEditTargetModal({ initial, onApply }: TrainerEditTargetModalProps) {
  const [value, setValue] = useState<number>(initial)
  const { close } = useOverlayStore()

  const handleApply = () => {
    onApply(value)
    close()
  }

  return (
    <DialogContent className="sm:max-w-md">
      <DialogHeader>
        <DialogTitle>Edit target time</DialogTitle>
        <DialogDescription>A case is considered "passed" when you finish below the selected time.</DialogDescription>
      </DialogHeader>

      <div className="grid grid-cols-5 gap-2">
        {TARGET_OPTIONS.map((seconds) => {
          const active = value === seconds
          return (
            <button
              key={seconds}
              type="button"
              onClick={() => setValue(seconds)}
              className={cn(
                'flex flex-col items-center justify-center gap-0.5 rounded-lg border p-3 transition-colors cursor-pointer',
                active ? 'border-primary bg-primary/10 text-primary' : 'border-input hover:bg-muted/50'
              )}
            >
              <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">Under</span>
              <span className="font-mono font-bold text-lg tabular-nums">&lt;{seconds}s</span>
            </button>
          )
        })}
      </div>

      <DialogFooter>
        <Button type="button" variant="outline" onClick={close}>
          Cancel
        </Button>
        <Button type="button" onClick={handleApply}>
          Apply
        </Button>
      </DialogFooter>
    </DialogContent>
  )
}
