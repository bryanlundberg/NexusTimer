import { ReactNode } from 'react'
import { useTimerStore } from '@/shared/model/timer/useTimerStore'
import { TimerStatus } from '@/features/timer/model/enums'
import { cn } from '@/shared/lib/utils'

export default function TimerHeaderCollapse({ children }: { children: ReactNode }) {
  const isSolving = useTimerStore((store) => store.isSolving)
  const timerStatus = useTimerStore((store) => store.timerStatus)

  const isHidden = isSolving || timerStatus !== TimerStatus.IDLE

  return (
    <div
      data-testid="timer-header-collapse"
      className={cn(
        'grid grid-rows-[1fr] shrink-0 duration-200 ease-out max-md:transition-[grid-template-rows,opacity]',
        isHidden && 'opacity-0 pointer-events-none md:transition-opacity md:duration-150 max-md:grid-rows-[0fr]'
      )}
    >
      <div className="min-h-0 max-md:overflow-hidden">{children}</div>
    </div>
  )
}
