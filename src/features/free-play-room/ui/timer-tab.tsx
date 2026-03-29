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
import { AnimatePresence, motion } from 'motion/react'

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

  useEffect(() => {
    if (previousScrambleRef.current && previousScrambleRef.current !== scramble) {
      setShouldPlaySound(true)
      const timeout = setTimeout(() => setShouldPlaySound(false), 100)
      return () => clearTimeout(timeout)
    }
    previousScrambleRef.current = scramble
  }, [scramble])

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
    <div className="relative flex flex-col justify-center items-center h-full p-4 md:p-8" id="touch">
      {/* Mode toggle — top right */}
      <motion.div
        className="absolute top-3 right-3 md:top-4 md:right-4"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.15, type: 'spring', stiffness: 300, damping: 25 }}
      >
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant={timerMode === TimerMode.MANUAL ? 'default' : 'outline'}
              size="icon"
              className="size-9 rounded-lg"
              onClick={() => setTimerMode(timerMode === TimerMode.MANUAL ? TimerMode.NORMAL : TimerMode.MANUAL)}
            >
              <Keyboard className="size-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="left">
            <p>{timerMode === TimerMode.MANUAL ? 'Modo Normal' : 'Modo Manual'}</p>
          </TooltipContent>
        </Tooltip>
      </motion.div>

      {/* Scramble */}
      <AnimatePresence mode="wait">
        {!isSolving && !disableTimer && scramble && (
          <motion.div
            key={scramble}
            className="text-center text-base md:text-xl font-mono leading-relaxed text-muted-foreground px-4 mb-12 md:mb-16 max-w-2xl"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.25 }}
          >
            {scramble}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Timer / Manual input */}
      <AnimatePresence mode="wait">
        {timerMode === TimerMode.MANUAL && !disableTimer ? (
          <motion.div
            key="manual"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            <ManualModeForm onSubmit={handleManualSubmit} />
          </motion.div>
        ) : (
          <motion.div
            key="display"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <DisplayTime
              isSolving={isSolving}
              timerStatus={timerStatus}
              lastSolve={lastSolve}
              solvingTime={solvingTime}
              device={device}
              inspectionTime={inspectionTime}
              hideWhileSolving={settings.features.hideWhileSolving}
              className="text-center"
              inspectionRequired={true}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Already submitted message */}
      <AnimatePresence>
        {disableTimer && (
          <motion.div
            className="mt-6 px-4 py-2.5 rounded-lg bg-muted text-muted-foreground text-sm text-center max-w-xs"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.25 }}
          >
            {t('already-submitted')}
          </motion.div>
        )}
      </AnimatePresence>

      <ConfirmSolveModal
        isOpen={modalOpen}
        onClose={setModalOpen}
        onChoose={({ dnf, plus2 }) => handleSubmitTime(dnf, plus2)}
      />
    </div>
  )
}
