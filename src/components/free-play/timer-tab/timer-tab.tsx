import * as React from 'react'
import { useEffect, useMemo, useState } from 'react'
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
import ConfirmSolveModal from '@/components/free-play/confirm-solve-modal/confirm-solve-modal'

export default function TimerTab() {
  const { roomId } = useParams()
  const { updateUserPresenceStatus, addUserSolve, useRoomScramble, useRoomSolves } = useFreeMode()
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
  const reset = useTimerStore((store) => store.reset)
  const solves = useRoomSolves(roomId?.toString() || '')

  const currentUserSolves = session?.user?.id
    ? solves[session.user.id]
      ? Object.values(solves[session.user.id]).sort((a, b) => a.createdAt - b.createdAt)
      : []
    : []

  const [modalOpen, setModalOpen] = useState(false)
  const [hasSolvedCurrentScramble, setHasSolvedCurrentScramble] = useState(false)

  const disableTimer = useMemo(() => {
    const alreadySolved = currentUserSolves.some((solve) => solve.scramble === scramble)
    return alreadySolved || hasSolvedCurrentScramble
  }, [currentUserSolves, scramble, hasSolvedCurrentScramble])

  const { device } = useDeviceMatch()

  const handleSubmitTime = async (dnf: boolean, plus2: boolean) => {
    setModalOpen(false)
    setHasSolvedCurrentScramble(true)
    if (!session?.user?.id) return
    if (!roomId) return
    if (!solvingTime) return

    await addUserSolve(roomId?.toString() || '', session?.user?.id || '', {
      time: solvingTime,
      dnf,
      plus2,
      scramble
    })
  }

  const { inspectionTime, resetAll } = useTimer({
    onFinishSolve: async () => setModalOpen(true),
    isSolving,
    setTimerStatus,
    selectedCube: disableTimer ? null : ({} as Cube),
    inspectionRequired: false,
    setIsSolving,
    setSolvingTime,
    timerMode,
    settings: { timer: { startCue: false, holdToStart: false, inspectionTime: 15000 } }
  })

  useEffect(() => {
    setHasSolvedCurrentScramble(false)
    setModalOpen(false)
    setSolvingTime(0)
    reset()
    resetAll()
  }, [scramble, reset, setSolvingTime, resetAll])

  useEffect(() => {
    if (!session?.user?.id) return
    if (!roomId) return
    updateUserPresenceStatus(roomId.toString(), session.user.id, {
      status: isSolving ? TimerStatus.SOLVING : TimerStatus.IDLE
    })
  }, [isSolving, session?.user?.id, roomId])

  return (
    <div className={'flex flex-col justify-center w-full items-center h-full p-4'}>
      <div className={'text-center text-2xl mb-20'}>{scramble}</div>

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

      {disableTimer && (
        <div className="text-red-500 text-center mt-4 w-3/4">
          You have already submitted a solve for this scramble. Wait for the next one!
        </div>
      )}

      <ConfirmSolveModal
        isOpen={modalOpen}
        onClose={setModalOpen}
        onChoose={({ dnf, plus2 }) => handleSubmitTime(dnf, plus2)}
      />
    </div>
  )
}
