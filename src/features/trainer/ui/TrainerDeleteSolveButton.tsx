'use client'

import { useRef } from 'react'
import { Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import TrashIcon from '@/components/ui/trash-icon'
import type { AnimatedIconHandle } from '@/components/ui/types'

interface TrainerDeleteSolveButtonProps {
  label: string
  onClick: () => void
  pending?: boolean
}

export default function TrainerDeleteSolveButton({ label, onClick, pending = false }: TrainerDeleteSolveButtonProps) {
  const trashRef = useRef<AnimatedIconHandle>(null)

  return (
    <Button
      variant="ghost"
      size="icon"
      haptic
      disabled={pending}
      className="h-6 w-6 shrink-0 text-muted-foreground hover:text-destructive"
      aria-label={label}
      title={label}
      onClick={onClick}
      onMouseEnter={() => trashRef.current?.startAnimation()}
      onMouseLeave={() => trashRef.current?.stopAnimation()}
    >
      {pending ? <Loader2 className="size-3.5 animate-spin" /> : <TrashIcon ref={trashRef} size={14} />}
    </Button>
  )
}
