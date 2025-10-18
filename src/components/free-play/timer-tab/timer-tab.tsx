import * as React from 'react'
import { useEffect } from 'react'
import useTimer from '@/hooks/useTimer'
import { useTimerStore } from '@/store/timerStore'
import { useSettingsModalStore } from '@/store/SettingsModalStore'
import useDeviceMatch from '@/hooks/useDeviceMatch'
import DisplayTime from '@/components/timer/display/display-time'
import { Cube } from '@/interfaces/Cube'
import useFreeMode from '@/hooks/useFreeMode'
import { useSession } from 'next-auth/react'
import { useParams } from 'next/navigation'
import { TimerStatus } from '@/enums/TimerStatus'

export default function TimerTab() {
  const { roomId } = useParams()
  const { updateUserPresenceStatus, addUserSolve, useRoomScramble } = useFreeMode()
  const scramble = useRoomScramble(roomId?.toString() || '')

  const { data: session } = useSession()
  const settings = useSettingsModalStore((store) => store.settings)
  const isSolving = useTimerStore((store) => store.isSolving)
  const lastSolve = useTimerStore((store) => store.lastSolve)
  const timerStatus = useTimerStore((store) => store.timerStatus)
  const solvingTime = useTimerStore((store) => store.solvingTime)
  const setTimerStatus = useTimerStore((store) => store.setTimerStatus)
  const setIsSolving = useTimerStore((store) => store.setIsSolving)
  const setSolvingTime = useTimerStore((store) => store.setSolvingTime)
  const timerMode = useTimerStore((store) => store.timerMode)

  const { device } = useDeviceMatch()

  const { inspectionTime } = useTimer({
    onFinishSolve: () =>
      addUserSolve(roomId?.toString() || '', session?.user?.id || '', {
        time: solvingTime,
        dnf: false,
        plus2: false
      }),
    isSolving,
    setTimerStatus,
    selectedCube: {} as Cube,
    inspectionRequired: false,
    setIsSolving,
    setSolvingTime,
    timerMode,
    settings: { timer: { startCue: false, holdToStart: false, inspectionTime: 15000 } }
  })

  useEffect(() => {
    if (!session?.user?.id) return
    if (!roomId) return
    updateUserPresenceStatus(roomId.toString(), session.user.id, {
      status: isSolving ? TimerStatus.SOLVING : TimerStatus.IDLE
    })
  }, [isSolving, session?.user?.id, roomId])

  return (
    <div className={'flex flex-col items-center justify-center h-max-content max-h-full flex-1'}>
      <div className={'text-center text-2xl mb-20'}>{scramble}</div>

      <div className={'grow my-auto'}>
        <DisplayTime
          isSolving={isSolving}
          timerStatus={timerStatus}
          lastSolve={lastSolve}
          solvingTime={solvingTime}
          device={device}
          inspectionTime={inspectionTime}
          hideWhileSolving={settings.features.hideWhileSolving}
          className={'text-center'}
        />
      </div>
    </div>
  )
}
