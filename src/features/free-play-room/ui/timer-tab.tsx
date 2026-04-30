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
import { cubesDB } from '@/entities/cube/api/indexdb'
import genId from '@/shared/lib/genId'
import { Solve } from '@/entities/solve/model/types'
import { useTranslations } from 'next-intl'
import ManualModeForm from '@/features/timer/ui/ManualModeForm'
import LivePlayersPanel from '@/features/free-play-room/ui/live-players-panel'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { AnimatePresence, motion } from 'motion/react'
import FreePlayStackmatListener from '@/features/free-play-room/ui/free-play-stackmat-listener'
import { MixIcon } from '@radix-ui/react-icons'
import { Eye, EyeOff } from 'lucide-react'

const FREE_PLAY_MODES = [
  { value: TimerMode.NORMAL, label: 'Normal' },
  { value: TimerMode.MANUAL, label: 'Manual' },
  { value: TimerMode.STACKMAT, label: 'Stackmat' }
]

interface TimerTabProps {
  maxRoundTime: number | null
  event: string
  onlineUsers: any[]
}

export default function TimerTab({ maxRoundTime, event, onlineUsers }: TimerTabProps) {
  const t = useTranslations('Multiplayer')
  const tIndex = useTranslations('Index')
  const { roomId } = useParams<{ roomId: string }>() ?? { roomId: null }
  const {
    updateUserPresenceStatus,
    addUserSolve,
    useRoomScramble,
    useRoomSolves,
    updateRoomScramble,
    updateRoomRoundLimit,
    useRoomCurrentRound,
    incrementRoomRound
  } = useFreeMode()
  const scramble = useRoomScramble(roomId?.toString() || '')
  const currentRound = useRoomCurrentRound(roomId?.toString() || '')
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
    reset,
    selectedCube,
    setSelectedCube,
    setCubes
  } = useTimerStore()
  const solves = useRoomSolves(roomId?.toString() || '')

  const [modalOpen, setModalOpen] = useState(false)
  const [hasSolvedCurrentScramble, setHasSolvedCurrentScramble] = useState(false)
  const [shouldPlaySound, setShouldPlaySound] = useState(false)
  const [inspectionEnabled, setInspectionEnabled] = useState(false)
  const previousScrambleRef = useRef<string>('')

  useAudioTrigger({
    audioSrc: '/sounds/new-round.mp3',
    trigger: shouldPlaySound,
    autoplay: true
  })

  const alreadySolvedInFirebase = useMemo(() => {
    if (!session?.user?.id || !solves[session.user.id]) return false
    return Object.values(solves[session.user.id]).some((solve: any) => solve.roundIndex === currentRound)
  }, [solves, session?.user?.id, currentRound])

  const disableTimer = useMemo(() => {
    return alreadySolvedInFirebase || hasSolvedCurrentScramble
  }, [alreadySolvedInFirebase, hasSolvedCurrentScramble])

  const { device } = useDeviceMatch()

  const handleSubmitTime = async (dnf: boolean, plus2: boolean, cubeId: string | null) => {
    setModalOpen(false)
    setHasSolvedCurrentScramble(true)
    if (!session?.user?.id) return
    if (!roomId) return
    if (!solvingTime) return

    await addUserSolve(roomId?.toString() || '', session?.user?.id || '', {
      time: solvingTime,
      dnf,
      plus2,
      scramble,
      roundIndex: currentRound
    })

    if (cubeId) {
      try {
        const cube = await cubesDB.getById(cubeId)
        const now = Date.now()
        const newSolve: Solve = {
          id: genId(),
          startTime: now - solvingTime,
          endTime: now,
          scramble,
          bookmark: false,
          time: solvingTime,
          dnf,
          plus2,
          rating: Math.floor(Math.random() * 20) + (scramble?.length || 0),
          cubeId: cube.id,
          comment: '',
          isDeleted: false,
          updatedAt: now
        }
        const updatedCube = {
          ...cube,
          solves: { ...cube.solves, session: [newSolve, ...cube.solves.session] }
        }
        await cubesDB.update(updatedCube)

        if (selectedCube?.id === updatedCube.id) {
          setSelectedCube(updatedCube)
        }
        const all = await cubesDB.getAll()
        setCubes(all)
      } catch (e) {
        console.error('Failed to save free-play solve to cube', e)
      }
    }
  }

  useEffect(() => {
    if (!session?.user?.id || !roomId || !event || !maxRoundTime || !scramble) return

    const onlineUserIds = Array.isArray(onlineUsers)
      ? onlineUsers.map((user) => user.id)
      : Object.values(onlineUsers || {}).map((user: any) => user.id)

    if (onlineUserIds.length === 0) return

    const usersThatSolved = onlineUserIds.filter((userId) => {
      const userSolves = solves[userId]
      return userSolves && Object.values(userSolves).some((solve: any) => solve.roundIndex === currentRound)
    })

    if (
      usersThatSolved.length === onlineUserIds.length &&
      usersThatSolved.includes(session.user.id) &&
      alreadySolvedInFirebase
    ) {
      const durationMs = maxRoundTime * 1000
      const newScramble = genScramble(event as CubeCategory)
      updateRoomScramble(roomId.toString(), newScramble)
      updateRoomRoundLimit(roomId.toString(), durationMs)
      incrementRoomRound(roomId.toString(), currentRound + 1)
    }
  }, [
    solves,
    scramble,
    onlineUsers,
    session?.user?.id,
    roomId,
    event,
    maxRoundTime,
    currentRound,
    alreadySolvedInFirebase,
    updateRoomScramble,
    updateRoomRoundLimit,
    incrementRoomRound
  ])

  const { inspectionTime, resetAll } = useTimer({
    onFinishSolve: async () => setModalOpen(true),
    isSolving,
    setTimerStatus,
    selectedCube: disableTimer || modalOpen ? null : ({} as Cube),
    inspectionRequired: inspectionEnabled,
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
    <div className="flex h-full" id="touch">
      {/* Timer area */}
      <div className="relative flex-1 flex flex-col justify-center items-center p-4 md:p-8 bg-background/50">
        {/* Inspection toggle — top left of timer area */}
        <motion.div
          className="absolute top-3 left-3 md:top-4 md:left-4"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.15, type: 'spring', stiffness: 300, damping: 25 }}
        >
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant={inspectionEnabled ? 'default' : 'ghost'}
                size="icon"
                className="size-9 rounded-lg"
                onClick={() => setInspectionEnabled((prev) => !prev)}
              >
                {inspectionEnabled ? <Eye className="size-4" /> : <EyeOff className="size-4" />}
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">{inspectionEnabled ? t('inspection-on') : t('inspection-off')}</TooltipContent>
          </Tooltip>
        </motion.div>

        {/* Mode toggle — top right of timer area */}
        <motion.div
          className="absolute top-3 right-3 md:top-4 md:right-4"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.15, type: 'spring', stiffness: 300, damping: 25 }}
        >
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                data-testid={'button-select-mode'}
                variant="ghost"
                className="py-0 px-3 [&>svg]:transition-transform [&>svg]:duration-300 [&:hover>svg]:rotate-180"
              >
                <MixIcon />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-fit">
              <DropdownMenuLabel>{tIndex('HomePage.mode')}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuRadioGroup value={timerMode} onValueChange={(e: any) => setTimerMode(e)}>
                <DropdownMenuRadioItem value={TimerMode.NORMAL} data-testid={'mode-normal'}>
                  {tIndex('HomePage.modes.normal')}
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value={TimerMode.MANUAL} data-testid={'mode-manual'}>
                  {tIndex('HomePage.modes.manual')}
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value={TimerMode.STACKMAT} data-testid={'mode-stackmat'}>
                  {tIndex('HomePage.modes.stackmat')}
                </DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
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
                inspectionRequired={inspectionEnabled}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {timerMode === TimerMode.STACKMAT && (
          <FreePlayStackmatListener onFinish={handleManualSubmit} disabled={disableTimer} />
        )}

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
      </div>

      {/* Players column — hidden on mobile */}
      <div className="hidden sm:block w-52 shrink-0 border-l border-border overflow-y-auto p-3 bg-sidebar">
        <LivePlayersPanel
          onlineUsers={onlineUsers}
          solves={solves}
          currentRound={currentRound}
          sessionUserId={session?.user?.id}
        />
      </div>

      <ConfirmSolveModal
        isOpen={modalOpen}
        onClose={setModalOpen}
        category={event}
        onChoose={({ dnf, plus2, cubeId }) => handleSubmitTime(dnf, plus2, cubeId)}
      />
    </div>
  )
}
