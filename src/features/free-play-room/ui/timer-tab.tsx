import * as React from 'react'
import { useEffect, useMemo, useRef, useState } from 'react'
import useTimer from '@/features/timer/model/useTimer'
import { useTimerStore } from '@/shared/model/timer/useTimerStore'
import { useSettingsStore } from '@/shared/model/settings/useSettingsStore'
import useFreeMode from '@/features/free-play-room/model/useFreeMode'
import { useSession } from 'next-auth/react'
import { useParams } from 'next/navigation'
import genScramble from '@/shared/lib/timer/genScramble'
import DisplayTime from '@/features/timer/ui/display-time'
import ConfirmSolveModal from '@/features/free-play-room/ui/confirm-solve-modal'
import { useAudioTrigger } from '@/shared/model/useAudioTrigger'
import useDeviceMatch from '@/shared/model/useDeviceMatch'
import { TimerMode, TimerStatus } from '@/features/timer/model/enums'
import { CubeCategory } from '@/shared/const/cube-categories'
import { Cube } from '@/entities/cube/model/types'
import { useTranslations } from 'next-intl'
import ManualModeForm from '@/features/timer/ui/ManualModeForm'
import { Keyboard } from 'lucide-react'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { Button } from '@/components/ui/button'

interface TimerTabProps {
  maxRoundTime: number | null
  event: string
  onlineUsers: any[]
}

export default function TimerTab({ maxRoundTime, event, onlineUsers }: TimerTabProps) {
  const t = useTranslations('Multiplayer')
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

  const { settings } = useSettingsStore()
  const {
    isSolving,
    lastSolve,
    timerStatus,
    solvingTime,
    timerMode,
    setTimerStatus,
    setIsSolving,
    setSolvingTime,
    setTimerMode,
    reset
  } = useTimerStore()
  const solves = useRoomSolves(roomId?.toString() || '')

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
    if (!session?.user?.id || !solves[session.user.id]) return hasSolvedCurrentScramble
    const currentUserSolves = Object.values(solves[session.user.id])
    const alreadySolved = currentUserSolves.some((solve: any) => solve.scramble === scramble)
    return alreadySolved || hasSolvedCurrentScramble
  }, [solves, session?.user?.id, scramble, hasSolvedCurrentScramble])

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
    if (!session?.user?.id || !roomId || !event || !maxRoundTime || !scramble) return

    const onlineUserIds = Array.isArray(onlineUsers)
      ? onlineUsers.map((user) => user.id)
      : Object.values(onlineUsers || {}).map((user: any) => user.id)

    if (onlineUserIds.length === 0) return

    const usersThatSolved = onlineUserIds.filter((userId) => {
      const userSolves = solves[userId]
      return userSolves && Object.values(userSolves).some((solve: any) => solve.scramble === scramble)
    })

    if (
      usersThatSolved.length === onlineUserIds.length &&
      usersThatSolved.includes(session.user.id) &&
      hasSolvedCurrentScramble
    ) {
      const durationMs = maxRoundTime * 1000
      const newScramble = genScramble(event as CubeCategory)
      updateRoomScramble(roomId.toString(), newScramble)
      updateRoomRoundLimit(roomId.toString(), durationMs)
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
    selectedCube: disableTimer || modalOpen ? null : ({} as Cube),
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

  const handleManualSubmit = (msTime: number) => {
    setSolvingTime(msTime)
    setModalOpen(true)
  }

  return (
    <div className={'flex flex-col justify-center w-full items-center h-full p-4 relative'} id={'touch'}>
      <div className="absolute top-4 right-4">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant={timerMode === TimerMode.MANUAL ? 'default' : 'outline'}
              size="icon"
              onClick={() => setTimerMode(timerMode === TimerMode.MANUAL ? TimerMode.NORMAL : TimerMode.MANUAL)}
            >
              <Keyboard className="size-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="left">
            <p>{timerMode === TimerMode.MANUAL ? 'Modo Normal' : 'Modo Manual'}</p>
          </TooltipContent>
        </Tooltip>
      </div>

      {!isSolving && !disableTimer && <div className={'text-center text-2xl mb-20'}>{scramble}</div>}

      {timerMode === TimerMode.MANUAL && !disableTimer ? (
        <ManualModeForm onSubmit={handleManualSubmit} />
      ) : (
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
      )}

      {disableTimer && <div className="text-red-500 text-center mt-4 w-3/4">{t('already-submitted')}</div>}

      <ConfirmSolveModal
        isOpen={modalOpen}
        onClose={setModalOpen}
        onChoose={({ dnf, plus2 }) => handleSubmitTime(dnf, plus2)}
      />
    </div>
  )
}
