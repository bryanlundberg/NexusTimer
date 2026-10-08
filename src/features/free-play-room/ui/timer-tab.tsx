import { useEffect, useMemo, useRef, useState } from 'react'
import { useSession } from '@/shared/model/useSession'
import { useTranslations } from 'next-intl'
import { AnimatePresence, motion } from 'motion/react'
import useTimer from '@/features/timer/model/useTimer'
import { useTimerStore } from '@/shared/model/timer/useTimerStore'
import { useSettingsStore } from '@/shared/model/settings/useSettingsStore'
import { useAudioTrigger } from '@/shared/model/useAudioTrigger'
import { useIsMobile } from '@/shared/model/use-mobile'
import { TimerMode, TimerStatus } from '@/features/timer/model/enums'
import { Cube } from '@/entities/cube/model/types'
import { type PendingSolve, useFreePlaySolveSubmit } from '@/features/free-play-room/model/useFreePlaySolveSubmit'
import { useScrambleSoundCue } from '@/features/free-play-room/model/useScrambleSoundCue'
import { useRoomStore } from '@/features/free-play-room/model/useRoomStore'
import { forgetReportedStatus, reportRoomStatus } from '@/features/free-play-room/model/room-actions'
import { type RoomPresence, toLocalTime, toSolvesByUser } from '@/features/free-play-room/model/room-view'
import DisplayTime from '@/features/timer/ui/display-time'
import ManualModeForm from '@/features/timer/ui/ManualModeForm'
import ConfirmSolveModal from '@/features/free-play-room/ui/confirm-solve-modal'
import LivePlayersPanel from '@/features/free-play-room/ui/live-players-panel'
import FreePlayStackmatListener from '@/features/free-play-room/ui/free-play-stackmat-listener'
import InspectionToggleButton from '@/features/free-play-room/ui/inspection-toggle-button'
import ModeDropdown from '@/features/free-play-room/ui/mode-dropdown'

interface TimerTabProps {
  maxRoundTime: number | null
  event: string
  onlineUsers: RoomPresence[]
}

export default function TimerTab({ event, onlineUsers }: TimerTabProps) {
  const t = useTranslations('Multiplayer')

  const room = useRoomStore((state) => state.room)
  const clockOffset = useRoomStore((state) => state.clockOffset)
  const knownPlayers = useRoomStore((state) => state.knownPlayers)
  const scramble = room?.round.scramble ?? ''
  const currentRound = room?.round.index ?? 0
  const solves = useMemo(() => toSolvesByUser(room, knownPlayers), [room, knownPlayers])
  const { data: session } = useSession()
  const userId = session?.user?.id

  const { settings } = useSettingsStore()
  const isSolving = useTimerStore((state) => state.isSolving)
  const lastSolve = useTimerStore((state) => state.lastSolve)
  const timerStatus = useTimerStore((state) => state.timerStatus)
  const timerMode = useTimerStore((state) => state.timerMode)
  const { setTimerStatus, setIsSolving, setSolvingTime, setTimerMode, setLastSolve, reset } = useTimerStore.getState()

  const [pending, setPending] = useState<PendingSolve | null>(null)
  const [hasSolvedCurrentScramble, setHasSolvedCurrentScramble] = useState(false)
  const [inspectionEnabled, setInspectionEnabled] = useState(false)

  const isMobile = useIsMobile()
  const shouldPlaySound = useScrambleSoundCue(scramble)

  useAudioTrigger({
    audioSrc: '/sounds/new-round.mp3',
    trigger: shouldPlaySound && settings.sounds.newRound,
    autoplay: true
  })

  const mySolve = room?.solves.find((solve) => solve.userId === userId && solve.round === currentRound) ?? null
  const pendingSolve = pending
    ? (room?.solves.find((solve) => solve.userId === userId && solve.round === pending.round) ?? null)
    : null
  const modalOpen = pending !== null && pending.round === currentRound && pendingSolve?.penalty == null
  const disableTimer = Boolean(mySolve) || hasSolvedCurrentScramble || !scramble

  const { sendTime, confirm, showResult, submitManual } = useFreePlaySolveSubmit()

  const finishSolve = () => {
    const time = sendTime(currentRound)
    if (time === null) return
    setHasSolvedCurrentScramble(true)
    setPending({ round: currentRound, time, scramble })
  }

  const handleSubmitTime = async (args: { dnf: boolean; plus2: boolean; cubeId: string | null }) => {
    if (!pending) return
    setPending(null)
    await confirm(args, pending)
  }

  const handleManualSubmit = (msTime: number) => {
    submitManual(msTime)
    finishSolve()
  }

  useEffect(() => {
    if (!pending) return
    if (pendingSolve?.penalty) {
      showResult({ dnf: pendingSolve.penalty === 'dnf', plus2: pendingSolve.penalty === 'plus2' }, pending)
      setPending(null)
    } else if (pending.round !== currentRound) {
      setPending(null)
    }
  }, [pending, pendingSolve?.penalty, currentRound, showResult])

  const previousStatus = useRef(timerStatus)
  useEffect(() => {
    const changed = previousStatus.current !== timerStatus
    previousStatus.current = timerStatus
    if (!changed || !scramble || disableTimer) return
    if (timerStatus === TimerStatus.INSPECTING) reportRoomStatus('inspecting')
    else if (timerStatus === TimerStatus.SOLVING) reportRoomStatus('solving')
    else if (timerStatus === TimerStatus.IDLE) reportRoomStatus('idle')
  }, [timerStatus, disableTimer, scramble])

  const { inspectionTime, resetAll, resumeSolve, resumeInspection } = useTimer({
    onFinishSolve: async () => finishSolve(),
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
    setHasSolvedCurrentScramble(false)
    forgetReportedStatus()
    setSolvingTime(0)
    setLastSolve(null)
    reset()
    resetAll()
  }, [scramble, reset, setSolvingTime, setLastSolve, resetAll])

  useEffect(
    () => () => {
      setSolvingTime(0)
      setLastSolve(null)
      reset()
    },
    [reset, setSolvingTime, setLastSolve]
  )

  const resumedRound = useRef<string | null>(null)
  useEffect(() => {
    if (!room || !userId || !scramble) return
    const key = `${room.roomId}:${currentRound}`
    if (resumedRound.current === key) return

    // Deferred a tick: in development React remounts once, and that cleanup resets the timer store.
    const timer = setTimeout(() => {
      resumedRound.current = key
      const latest = useRoomStore.getState()
      const solve = latest.room?.solves.find((s) => s.userId === userId && s.round === currentRound)
      if (solve) {
        if (solve.penalty === null) setPending({ round: solve.round, time: solve.time, scramble })
        return
      }
      const me = latest.room?.players.find((player) => player.userId === userId)
      const { isSolving: solving, timerStatus: status } = useTimerStore.getState()
      if (!me || !latest.room || me.statusAt < latest.room.round.startsAt) return
      if (solving || status !== TimerStatus.IDLE) return
      const elapsed = Math.max(0, Date.now() - (me.statusAt - latest.clockOffset))
      if (me.status === 'solving') resumeSolve(elapsed)
      else if (me.status === 'inspecting') {
        setInspectionEnabled(true)
        resumeInspection(elapsed)
      }
    }, 0)
    return () => clearTimeout(timer)
  }, [room, userId, scramble, currentRound, resumeSolve, resumeInspection])

  return (
    <div className="flex h-full" id="touch">
      <div className="relative flex-1 flex flex-col justify-center items-center p-4 md:p-8 bg-background/50">
        <InspectionToggleButton enabled={inspectionEnabled} onToggle={() => setInspectionEnabled((p) => !p)} />
        <ModeDropdown value={timerMode} onChange={setTimerMode} />

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
                isMobile={isMobile}
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

        <AnimatePresence>
          {disableTimer && (
            <motion.div
              className="mt-6 px-4 py-2.5 rounded-lg bg-muted text-muted-foreground text-sm text-center max-w-xs"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.25 }}
            >
              {scramble ? t('already-submitted') : t('waiting-scramble')}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="hidden sm:block w-52 shrink-0 border-l border-border overflow-y-auto p-3 bg-sidebar">
        <LivePlayersPanel
          onlineUsers={onlineUsers}
          solves={solves}
          currentRound={currentRound}
          sessionUserId={userId}
        />
      </div>

      <ConfirmSolveModal
        isOpen={modalOpen}
        onClose={() => {}}
        category={event}
        time={pending?.time}
        confirmBy={pendingSolve ? toLocalTime(pendingSolve.confirmBy, clockOffset) : undefined}
        onChoose={handleSubmitTime}
      />
    </div>
  )
}
