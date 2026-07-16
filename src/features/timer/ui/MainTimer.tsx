import dynamic from 'next/dynamic'
import { useEffect } from 'react'
import { useTimerStore } from '@/shared/model/timer/useTimerStore'
import { useSmartCubeStore } from '@/features/smart-cube/model/useSmartCubeStore'
import Timer from '@/features/timer/ui/Timer'
import ManualMode from '@/features/timer/ui/ManualMode'
import { TimerMode } from '@/features/timer/model/enums'

const Stackmat = dynamic(() => import('@/features/timer/ui/stackmat'), { ssr: false })
const TimerVirtual = dynamic(() => import('@/features/timer/ui/TimerVirtual'), { ssr: false })
const NXConnect = dynamic(() => import('@/features/nexus-connect/ui/NXConnect'), { ssr: false })
const SmartCube = dynamic(() => import('@/features/smart-cube/ui/SmartCube'), { ssr: false })

export function MainTimer() {
  const timerMode = useTimerStore((store) => store.timerMode)
  const event = useTimerStore((store) => store.event)
  const smartConnected = useSmartCubeStore((store) => store.status === 'connected')
  const disconnectSmart = useSmartCubeStore((store) => store.disconnect)

  // The smart cube is 3x3 only. Selecting a non-3x3 event disconnects it.
  useEffect(() => {
    if (event !== '333' && smartConnected) disconnectSmart()
  }, [event, smartConnected, disconnectSmart])

  return (
    <>
      {timerMode === TimerMode.NORMAL && <Timer />}

      {timerMode === TimerMode.KEYBOARD_STACKMAT && <Timer />}

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

      {timerMode === TimerMode.SMART_CUBE && event === '333' && <SmartCube />}
    </>
  )
}
