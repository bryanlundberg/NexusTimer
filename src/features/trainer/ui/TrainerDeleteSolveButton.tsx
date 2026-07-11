'use client'

import { useRef } from 'react'
import { Button } from '@/components/ui/button'
import TrashIcon from '@/components/ui/trash-icon'
import type { AnimatedIconHandle } from '@/components/ui/types'

interface TrainerDeleteSolveButtonProps {
  label: string
  onClick: () => void
}

export default function TrainerDeleteSolveButton({ label, onClick }: TrainerDeleteSolveButtonProps) {
  const trashRef = useRef<AnimatedIconHandle>(null)

  return (
    <Button
      variant="ghost"
      size="icon"
      haptic
      className="h-6 w-6 shrink-0 text-muted-foreground hover:text-destructive"
      aria-label={label}
      title={label}
      onClick={onClick}
      onMouseEnter={() => trashRef.current?.startAnimation()}
      onMouseLeave={() => trashRef.current?.stopAnimation()}
    >
      <TrashIcon ref={trashRef} size={14} />
    </Button>
  )
}
