import { useCtrlPadsStore } from '@/features/timer/model/useCtrlPadsStore'
import { useTimerStore } from '@/shared/model/timer/useTimerStore'
import { TimerStatus } from '@/features/timer/model/enums'
import { cn } from '@/shared/lib/utils'

export default function CtrlPadsIndicator() {
  const left = useCtrlPadsStore((store) => store.left)
  const right = useCtrlPadsStore((store) => store.right)
  const timerStatus = useTimerStore((store) => store.timerStatus)
  const ready = left && right && timerStatus === TimerStatus.READY

  const padClass = (pressed: boolean) =>
    cn(
      'flex h-6 w-12 items-center justify-center border font-mono text-[10px] font-medium transition-colors duration-75',
      !pressed && 'border-border text-muted-foreground',
      pressed && !ready && 'border-foreground bg-foreground/10 text-foreground',
      pressed && ready && 'border-timer-ready bg-timer-ready/15 text-timer-ready'
    )

  return (
    <div aria-hidden className="mt-3 flex items-center gap-10 pointer-coarse:hidden" data-testid="ctrl-pads">
      <div className={padClass(left)} data-pressed={left}>
        Ctrl
      </div>
      <div className={padClass(right)} data-pressed={right}>
        Ctrl
      </div>
    </div>
  )
}
