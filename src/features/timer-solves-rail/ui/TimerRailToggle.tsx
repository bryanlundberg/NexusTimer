'use client'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { PanelRightClose, PanelRightOpen } from 'lucide-react'
import { useTimerRailStore } from '@/features/timer-solves-rail/model/useTimerRailStore'

export default function TimerRailToggle() {
  const isOpen = useTimerRailStore((state) => state.isOpen)
  const toggle = useTimerRailStore((state) => state.toggle)

  return (
    <TooltipProvider delayDuration={100}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            data-testid="timer-rail-toggle"
            variant="ghost"
            className="hidden md:inline-flex py-0 px-3 ms-auto"
            onClick={toggle}
            aria-pressed={isOpen}
            aria-label={isOpen ? 'Hide solves panel' : 'Show solves panel'}
          >
            {isOpen ? <PanelRightClose size={16} /> : <PanelRightOpen size={16} />}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{isOpen ? 'Hide solves' : 'Show solves'}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
