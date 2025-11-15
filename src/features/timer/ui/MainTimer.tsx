import { useTimerStore } from '@/store/timerStore'
import { TimerMode } from '@/enums/TimerMode'
import Timer from '@/features/timer/ui/Timer'
import ManualMode from '@/features/timer/ui/ManualMode'
import Stackmat from '@/features/timer/ui/stackmat'
import TimerVirtual from '@/features/timer/ui/TimerVirtual'

export function MainTimer() {
  const timerMode = useTimerStore((store) => store.timerMode)
  const event = useTimerStore((store) => store.event)

  return (
    <>
      {timerMode === TimerMode.NORMAL && <Timer />}

      {timerMode === TimerMode.MANUAL && <ManualMode />}

      {timerMode === TimerMode.STACKMAT && (
        <Timer>
          <Stackmat />
        </Timer>
      )}

      {timerMode === TimerMode.VIRTUAL && (event === '333' || event === '222') && <TimerVirtual />}
    </>
  )
}
