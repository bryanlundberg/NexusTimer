import * as React from 'react'
import { useEffect, useMemo, useRef, useState } from 'react'
import useTimer from '@/features/timer/model/useTimer'
import { useTimerStore } from '@/store/timerStore'
import { useSettingsModalStore } from '@/store/SettingsModalStore'
import { Cube } from '@/interfaces/Cube'
import useFreeMode from '@/hooks/useFreeMode'
import { useSession } from 'next-auth/react'
import { useParams } from 'next/navigation'
import { TimerStatus } from '@/enums/TimerStatus'
import genScramble from '@/lib/timer/genScramble'
import { Categories } from '@/interfaces/Categories'
import DisplayTime from '@/features/timer/ui/display-time'
import ConfirmSolveModal from '@/features/free-play-room/ui/confirm-solve-modal'
import { useAudioTrigger } from '@/shared/model/useAudioTrigger'
import useDeviceMatch from '@/shared/model/useDeviceMatch'

interface TimerTabProps {
  maxRoundTime: number | null
  event: string
  onlineUsers: any[]
}

export default function TimerTab({ maxRoundTime, event, onlineUsers }: TimerTabProps) {
  const { roomId } = useParams<{ roomId: string }>() ?? { roomId: null }
  const {
    updateUserPresenceStatus,
    addUserSolve,
    useRoomScramble,
    useRoomSolves,
    updateRoomScramble,
    updateRoomRoundLimit
  } = useFreeMode()
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
  const [shouldPlaySound, setShouldPlaySound] = useState(false)
  const previousScrambleRef = useRef<string>('')

  useAudioTrigger({
    audioSrc: '/sounds/new-round.mp3',
    trigger: shouldPlaySound,
    autoplay: true
  })

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

  /* Handle automatic scramble and round time update when all users have solved the current scramble */
  useEffect(() => {
    if (!session?.user?.id || !roomId || !event || !maxRoundTime) return
    if (!scramble) return

    const onlineUserIds = Array.isArray(onlineUsers)
      ? onlineUsers.map((user) => user.id)
      : Object.values(onlineUsers || {}).map((user: any) => user.id)

    if (onlineUserIds.length === 0) return

    const usersThatSolved = onlineUserIds.filter((userId) => {
      const userSolves = solves[userId]
      if (!userSolves) return false

      return Object.values(userSolves).some((solve: any) => solve.scramble === scramble)
    })

    if (usersThatSolved.length === onlineUserIds.length && onlineUserIds.length > 0) {
      const currentUserSolved = usersThatSolved.includes(session.user.id)
      const isLastToSolve = currentUserSolved && hasSolvedCurrentScramble

      if (isLastToSolve) {
        const durationMs = maxRoundTime * 1000
        const newScramble = genScramble(event as Categories)
        updateRoomScramble(roomId.toString(), newScramble)
        updateRoomRoundLimit(roomId.toString(), durationMs)
      }
    }
  }, [
    solves,
    scramble,
    onlineUsers,
    session?.user?.id,
    roomId,
    event,
    maxRoundTime,
    hasSolvedCurrentScramble,
    updateRoomScramble,
    updateRoomRoundLimit
  ])

  const { inspectionTime, resetAll } = useTimer({
    onFinishSolve: async () => setModalOpen(true),
    isSolving,
    setTimerStatus,
    selectedCube: disableTimer ? null : ({} as Cube),
    inspectionRequired: true,
    setIsSolving,
    setSolvingTime,
    timerMode,
    settings: { timer: { startCue: false, holdToStart: false, inspectionTime: 15000 } }
  })

  /* Play sound on new scramble */
  useEffect(() => {
    if (previousScrambleRef.current && previousScrambleRef.current !== scramble) {
      setShouldPlaySound(true)
      const timeout = setTimeout(() => setShouldPlaySound(false), 100)
      return () => clearTimeout(timeout)
    }
    previousScrambleRef.current = scramble
  }, [scramble])

  /* Reset timer on new scramble */
  useEffect(() => {
    setHasSolvedCurrentScramble(false)
    setModalOpen(false)
    setSolvingTime(0)
    reset()
    resetAll()
  }, [scramble, reset, setSolvingTime, resetAll])

  /* Update user presence status */
  useEffect(() => {
    if (!session?.user?.id) return
    if (!roomId) return

    let currentStatus = timerStatus

    if (disableTimer && !isSolving) {
      currentStatus = TimerStatus.WAITING_NEXT_ROUND
    }

    updateUserPresenceStatus(roomId.toString(), session.user.id, {
      status: currentStatus
    })
  }, [timerStatus, disableTimer, isSolving, session?.user?.id, roomId])

  return (
    <div className={'flex flex-col justify-center w-full items-center h-full p-4'} id={'touch'}>
      {!isSolving && !disableTimer && <div className={'text-center text-2xl mb-20'}>{scramble}</div>}

      <DisplayTime
        isSolving={isSolving}
        timerStatus={timerStatus}
        lastSolve={lastSolve}
        solvingTime={solvingTime}
        device={device}
        inspectionTime={inspectionTime}
        hideWhileSolving={settings.features.hideWhileSolving}
        className={'text-center'}
        inspectionRequired={true}
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
