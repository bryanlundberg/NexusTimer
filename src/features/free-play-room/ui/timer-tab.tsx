import { useEffect, useMemo, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useParams } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { AnimatePresence, motion } from 'motion/react'
import useTimer from '@/features/timer/model/useTimer'
import { useTimerStore } from '@/shared/model/timer/useTimerStore'
import { useSettingsStore } from '@/shared/model/settings/useSettingsStore'
import { useAudioTrigger } from '@/shared/model/useAudioTrigger'
import { useIsMobile } from '@/shared/model/use-mobile'
import { TimerMode } from '@/features/timer/model/enums'
import { Cube } from '@/entities/cube/model/types'
import useFreeMode from '@/features/free-play-room/model/useFreeMode'
import { useFreePlaySolveSubmit } from '@/features/free-play-room/model/useFreePlaySolveSubmit'
import { useAutoNextRound } from '@/features/free-play-room/model/useAutoNextRound'
import { useFreePlayPresence } from '@/features/free-play-room/model/useFreePlayPresence'
import { useScrambleSoundCue } from '@/features/free-play-room/model/useScrambleSoundCue'
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
  onlineUsers: any[]
}

export default function TimerTab({ maxRoundTime, event, onlineUsers }: TimerTabProps) {
  const t = useTranslations('Multiplayer')
  const { roomId: roomIdParam } = useParams<{ roomId: string }>() ?? { roomId: null }
  const roomId = roomIdParam?.toString() ?? null

  const { useRoomScramble, useRoomSolves, useRoomCurrentRound } = useFreeMode()
  const scramble = useRoomScramble(roomId ?? '')
  const currentRound = useRoomCurrentRound(roomId ?? '')
  const solves = useRoomSolves(roomId ?? '')
  const { data: session } = useSession()

  const { settings } = useSettingsStore()
  const isSolving = useTimerStore((state) => state.isSolving)
  const lastSolve = useTimerStore((state) => state.lastSolve)
  const timerStatus = useTimerStore((state) => state.timerStatus)
  const timerMode = useTimerStore((state) => state.timerMode)
  const { setTimerStatus, setIsSolving, setSolvingTime, setTimerMode, setLastSolve, reset } = useTimerStore.getState()

  const [modalOpen, setModalOpen] = useState(false)
  const [hasSolvedCurrentScramble, setHasSolvedCurrentScramble] = useState(false)
  const [inspectionEnabled, setInspectionEnabled] = useState(false)

  const isMobile = useIsMobile()
  const shouldPlaySound = useScrambleSoundCue(scramble)

  useAudioTrigger({
    audioSrc: '/sounds/new-round.mp3',
    trigger: shouldPlaySound && settings.sounds.newRound,
    autoplay: true
  })

  const alreadySolvedInFirebase = useMemo(() => {
    if (!session?.user?.id || !solves[session.user.id]) return false
    return Object.values(solves[session.user.id]).some((solve: any) => solve.roundIndex === currentRound)
  }, [solves, session?.user?.id, currentRound])

  const disableTimer = alreadySolvedInFirebase || hasSolvedCurrentScramble

  const { submit, submitManual } = useFreePlaySolveSubmit({ roomId, scramble, currentRound })

  const handleSubmitTime = async (args: { dnf: boolean; plus2: boolean; cubeId: string | null }) => {
    setModalOpen(false)
    setHasSolvedCurrentScramble(true)
    await submit(args)
  }

  const handleManualSubmit = (msTime: number) => {
    submitManual(msTime)
    setModalOpen(true)
  }

  useAutoNextRound({
    roomId,
    event,
    maxRoundTime,
    scramble,
    currentRound,
    alreadySolvedInFirebase,
    onlineUsers,
    solves
  })

  useFreePlayPresence({ roomId, timerStatus, disableTimer, isSolving })

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
    setHasSolvedCurrentScramble(false)
    setModalOpen(false)
    setSolvingTime(0)
    setLastSolve(null)
    reset()
    resetAll()
  }, [scramble, reset, setSolvingTime, setLastSolve, resetAll])

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
              {t('already-submitted')}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="hidden sm:block w-52 shrink-0 border-l border-border overflow-y-auto p-3 bg-sidebar">
        <LivePlayersPanel
          onlineUsers={onlineUsers}
          solves={solves}
          currentRound={currentRound}
          sessionUserId={session?.user?.id}
        />
      </div>

      <ConfirmSolveModal isOpen={modalOpen} onClose={setModalOpen} category={event} onChoose={handleSubmitTime} />
    </div>
  )
}
