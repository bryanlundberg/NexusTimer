import dynamic from 'next/dynamic'
import { useTimerStore } from '@/shared/model/timer/useTimerStore'
import Timer from '@/features/timer/ui/Timer'
import ManualMode from '@/features/timer/ui/ManualMode'
import { TimerMode } from '@/features/timer/model/enums'

const Stackmat = dynamic(() => import('@/features/timer/ui/stackmat'), { ssr: false })
const TimerVirtual = dynamic(() => import('@/features/timer/ui/TimerVirtual'), { ssr: false })
const NXConnect = dynamic(() => import('@/features/nexus-connect/ui/NXConnect'), { ssr: false })

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

      {timerMode === TimerMode.NEXUS_CONNECT && (
        <Timer>
          <NXConnect />
        </Timer>
      )}

      {timerMode === TimerMode.VIRTUAL && (event === '333' || event === '222') && <TimerVirtual />}
    </>
  )
}
