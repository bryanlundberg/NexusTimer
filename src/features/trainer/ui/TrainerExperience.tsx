'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { BarChart3, Bluetooth, Settings as SettingsIcon } from 'lucide-react'
import SmartCube from '@/features/smart-cube/ui/SmartCube'
import { CHART_CONTRAST, DEFAULT_CHART_CONTRAST } from '@/shared/lib/chartContrastColor'
import { Button } from '@/components/ui/button'
import TrainerSmartTimer from '@/features/trainer/ui/TrainerSmartTimer'
import TrainerCurrentCase from '@/features/trainer/ui/TrainerCurrentCase'
import TrainerMethodSelect from '@/features/trainer/ui/TrainerMethodSelect'
import TrainerEditTargetModal from '@/features/trainer/ui/TrainerEditTargetModal'
import TrainerPickCasesModal from '@/features/trainer/ui/TrainerPickCasesModal'
import TrainerSettingsModal from '@/features/trainer/ui/TrainerSettingsModal'
import { useTrainerLearned } from '@/features/trainer/model/useTrainerLearned'
import { useTrainerPrefsStore } from '@/features/trainer/model/useTrainerPrefsStore'
import { setTrainerLearned } from '@/features/trainer/model/mutateTrainerLearned'
import { useOverlayStore } from '@/shared/model/overlay-store/useOverlayStore'
import type { TwistyPlayer } from '@rednaxela101/cubing/twisty'
import { useTrainerStore } from '@/features/trainer/model/useTrainerStore'
import { useTrainerSession } from '@/features/trainer/model/useTrainerSession'
import { useSmartCubeStore } from '@/features/smart-cube/model/useSmartCubeStore'
import useTimer from '@/features/timer/model/useTimer'
import { TimerMode, TimerStatus } from '@/features/timer/model/enums'
import { useTimerStore } from '@/shared/model/timer/useTimerStore'
import { useSettingsStore } from '@/shared/model/settings/useSettingsStore'
import { Cube } from '@/entities/cube/model/types'
import { Settings } from '@/shared/types/Settings'
import { useTrainerStats } from '@/features/trainer/model/useTrainerStats'
import { useTrainerSolves } from '@/features/trainer/model/useTrainerSolves'
import { postTrainerSolve } from '@/features/trainer/model/postTrainerSolve'
import { deleteTrainerSolve } from '@/features/trainer/model/mutateTrainerSolve'
import { patchTrainerTarget } from '@/features/trainer/model/patchTrainerTarget'
import { TRAINER_DEFAULT_TARGET_SECONDS } from '@/features/trainer/lib/constants'
import { buildVizConfig, formatMs } from '@/features/trainer/lib/trainerUtils'
import { useSession } from 'next-auth/react'
import { cn } from '@/shared/lib/utils'

export default function TrainerExperience() {
  const t = useTranslations('Index.TrainerPage')
  const tSettings = useTranslations('Index.SettingsPage')
  const { set, sessionCases, currentCase, currentAlg, setup } = useTrainerSession()
  const methodSlug = set.slug
  const smartAvailable = set.puzzle === '3x3x3'
  const smartConnected = useSmartCubeStore((s) => s.status === 'connected')
  const disconnectSmart = useSmartCubeStore((s) => s.disconnect)
  const [smartMode, setSmartMode] = useState(false)

  // Leaving a non-3x3 method turns smart mode off,
  useEffect(() => {
    if (!smartAvailable) {
      if (smartMode) setSmartMode(false)
      if (smartConnected) disconnectSmart()
    }
  }, [smartAvailable, smartMode, smartConnected, disconnectSmart])

  // If a cube is already connected, enter smart mode automatically.
  useEffect(() => {
    if (smartConnected && smartAvailable) setSmartMode(true)
  }, [smartConnected, smartAvailable])

  const targetSeconds = useTrainerStore((s) => s.targetByMethod[s.methodSlug] ?? TRAINER_DEFAULT_TARGET_SECONDS)
  const caseStats = useTrainerStore((s) => s.caseStats)
  const setMethod = useTrainerStore((s) => s.setMethod)
  const setPickedIds = useTrainerStore((s) => s.setPickedIds)
  const setTargetSeconds = useTrainerStore((s) => s.setTargetSeconds)
  const advanceCase = useTrainerStore((s) => s.advanceCase)
  const recordSolve = useTrainerStore((s) => s.recordSolve)
  const attachLastSolveId = useTrainerStore((s) => s.attachLastSolveId)
  const undoLastSolve = useTrainerStore((s) => s.undoLastSolve)
  const lastSolve = useTrainerStore((s) => s.lastSolve)
  const hydrateMethodStats = useTrainerStore((s) => s.hydrateMethodStats)
  const setCaseIndex = useTrainerStore((s) => s.setCaseIndex)

  // On entering the trainer, start on a random case.
  const didRandomizeStartRef = useRef(false)
  useEffect(() => {
    if (didRandomizeStartRef.current || sessionCases.length === 0) return
    if (sessionCases.length > 1) {
      setCaseIndex(Math.floor(Math.random() * sessionCases.length))
    }
    didRandomizeStartRef.current = true
  }, [sessionCases.length, setCaseIndex])

  const timerStatus = useTimerStore((s) => s.timerStatus)
  const solvingTime = useTimerStore((s) => s.solvingTime)
  const isSolving = useTimerStore((s) => s.isSolving)
  const setTimerStatus = useTimerStore((s) => s.setTimerStatus)
  const setIsSolving = useTimerStore((s) => s.setIsSolving)
  const setSolvingTime = useTimerStore((s) => s.setSolvingTime)
  const settings = useSettingsStore((s) => s.settings)
  const contrast = CHART_CONTRAST[settings.preferences.colorTheme] ?? DEFAULT_CHART_CONTRAST

  const { data: session } = useSession()
  const isAuthed = !!session?.user?.id

  const { open } = useOverlayStore()
  const showSolveInfo = useTrainerPrefsStore((s) => s.showSolveInfo)

  const currentStats = currentCase ? caseStats[currentCase.id] : undefined

  const { stats: serverStats, mutate: mutateStats } = useTrainerStats(methodSlug, isAuthed)
  const { learnedIds, mutate: mutateLearned } = useTrainerLearned(methodSlug, isAuthed)
  const learnedSet = useMemo(() => new Set(learnedIds), [learnedIds])
  const { solves: methodSolves, mutate: mutateSolves } = useTrainerSolves(methodSlug, undefined, isAuthed, 25)

  useEffect(() => {
    if (!isAuthed) return
    hydrateMethodStats(methodSlug, serverStats)
  }, [isAuthed, methodSlug, serverStats, hydrateMethodStats])

  const vizConfig = useMemo(
    () => buildVizConfig(set.puzzle, currentAlg?.moves ?? '', set.virtualization as Record<string, unknown>),
    [set, currentAlg]
  )

  const trainerCubeStub = useMemo<Cube>(
    () => ({
      id: 'trainer',
      name: 'trainer',
      category: '3x3',
      solves: { session: [], all: [] },
      createdAt: 0,
      favorite: false
    }),
    []
  )

  const trainerSettings = useMemo<Settings>(
    () => ({ ...settings, timer: { ...settings.timer, inspection: false } }),
    [settings]
  )

  useTimer({
    isSolving,
    setTimerStatus,
    selectedCube: trainerCubeStub,
    inspectionRequired: false,
    setIsSolving,
    setSolvingTime,
    // In smart mode, use MANUAL so the keyboard (space) handlers are not bound
    // and can't interfere with cube-move driven timing.
    timerMode: smartMode ? TimerMode.MANUAL : TimerMode.NORMAL,
    settings: trainerSettings,
    onFinishSolve: () => {
      if (!currentCase) return
      const ms = useTimerStore.getState().solvingTime
      if (ms <= 0) return
      const roundedMs = Math.round(ms)
      recordSolve(currentCase.id, roundedMs)
      const solvedCaseId = currentCase.id
      advanceCase(sessionCases.length)
      if (!isAuthed) return
      postTrainerSolve({ methodSlug, caseId: solvedCaseId, timeMs: roundedMs })
        .then((res) => {
          if (res?.solve?._id) attachLastSolveId(res.solve._id)
          return Promise.all([mutateStats(), mutateSolves()])
        })
        .catch((err) => {
          console.error('Failed to persist trainer solve:', err)
        })
    }
  })

  const handleSkip = () => advanceCase(sessionCases.length)

  const handleUndoLast = () => {
    const undone = undoLastSolve()
    if (!undone) return
    if (isAuthed && undone.persistedId) {
      deleteTrainerSolve(undone.persistedId)
        .then(() => Promise.all([mutateStats(), mutateSolves()]))
        .catch((err) => {
          console.error('Failed to delete trainer solve:', err)
          mutateStats()
          mutateSolves()
        })
    }
  }

  const handleToggleLearned = async () => {
    if (!currentCase || !isAuthed) return
    const wasLearned = learnedSet.has(currentCase.id)
    const nextLearned = !wasLearned
    const optimistic = new Set(learnedIds)
    if (nextLearned) optimistic.add(currentCase.id)
    else optimistic.delete(currentCase.id)
    mutateLearned({ caseIds: Array.from(optimistic) }, { revalidate: false })
    try {
      await setTrainerLearned({ methodSlug, caseId: currentCase.id, learned: nextLearned })
      await mutateLearned()
    } catch (err) {
      console.error('Failed to update learned:', err)
      mutateLearned()
    }
  }

  const handleApplyTarget = (seconds: number) => {
    setTargetSeconds(seconds)
    if (isAuthed) {
      patchTrainerTarget(methodSlug, seconds).catch((err) => {
        console.error('Failed to persist trainer target:', err)
      })
    }
  }

  const handleOpenEditTarget = () => {
    const state = useTrainerStore.getState()
    const current = state.targetByMethod[state.methodSlug] ?? TRAINER_DEFAULT_TARGET_SECONDS
    open({
      id: 'trainer-edit-target',
      component: <TrainerEditTargetModal initial={current} onApply={handleApplyTarget} />
    })
  }

  const handleOpenPickCases = () => {
    open({
      id: 'trainer-pick-cases',
      component: (
        <TrainerPickCasesModal
          algorithms={set.algorithms}
          initialSelected={new Set(useTrainerStore.getState().pickedIds)}
          vizConfig={set.virtualization as unknown as Partial<TwistyPlayer>}
          puzzle={set.puzzle}
          onApply={setPickedIds}
        />
      )
    })
  }

  const handleOpenSettings = () => {
    open({
      id: 'trainer-settings',
      component: <TrainerSettingsModal onEditTarget={handleOpenEditTarget} onPickCases={handleOpenPickCases} />
    })
  }

  const timeColorClass =
    timerStatus === TimerStatus.HOLDING
      ? 'text-red-500'
      : timerStatus === TimerStatus.READY
        ? 'text-green-500'
        : 'text-foreground'

  const stageOverlayClass =
    timerStatus === TimerStatus.HOLDING
      ? 'bg-red-500/10'
      : timerStatus === TimerStatus.READY
        ? 'bg-primary/10'
        : 'bg-transparent'

  const displayedTime =
    timerStatus === TimerStatus.HOLDING || timerStatus === TimerStatus.READY ? '0.00' : formatMs(solvingTime)

  const currentIsLearned = !!currentCase && learnedSet.has(currentCase.id)

  return (
    <div id="touch" className="flex flex-col flex-1 relative">
      <div className={cn('absolute inset-0 pointer-events-none transition-colors duration-150', stageOverlayClass)} />
      <div className="flex flex-col gap-4 w-full max-w-5xl mx-auto px-4 py-6 flex-1 min-h-0">
        <div className="flex items-center justify-center gap-2 shrink-0">
          {smartAvailable && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSmartMode((v) => !v)}
              aria-pressed={smartMode}
              aria-label={t('smart.smartCube')}
              title={t('smart.smartCube')}
              className={cn(
                'btn-notch size-9 shrink-0',
                smartMode
                  ? 'bg-primary/10 text-primary hover:bg-primary/15 hover:text-primary'
                  : 'text-muted-foreground'
              )}
            >
              <Bluetooth className="size-4" />
            </Button>
          )}

          <div className="w-full min-w-0 max-w-xs">
            <TrainerMethodSelect value={set.slug} onChange={setMethod} />
          </div>

          <Button
            variant="ghost"
            size="icon"
            onClick={handleOpenSettings}
            aria-label={tSettings('title')}
            title={tSettings('title')}
            className="btn-notch size-9 shrink-0 text-muted-foreground"
          >
            <SettingsIcon className="size-4" />
          </Button>
        </div>

        <TrainerCurrentCase
          caseGroup={currentCase?.group ?? ''}
          caseName={currentCase?.name ?? ''}
          setup={setup}
          currentTime={displayedTime}
          timeColorClass={timeColorClass}
          vizConfig={vizConfig}
          isLearned={currentIsLearned}
          best={currentStats?.best != null ? formatMs(currentStats.best) : undefined}
          ao5={currentStats?.ao5 != null ? formatMs(currentStats.ao5) : undefined}
          onSkip={handleSkip}
          onUndoLast={
            lastSolve && timerStatus === TimerStatus.IDLE && (!isAuthed || !!lastSolve.persistedId)
              ? handleUndoLast
              : undefined
          }
          lastSolveTime={lastSolve ? formatMs(lastSolve.timeMs) : undefined}
          onToggleLearned={isAuthed ? handleToggleLearned : undefined}
          showSolveInfo={showSolveInfo}
          sparklineSlot={<MiniSparkline solves={methodSolves} targetMs={targetSeconds * 1000} />}
          statsSlot={
            isAuthed ? (
              <Link
                href="/algorithms/trainer/history"
                aria-label={t('methodStats')}
                title={t('methodStats')}
                className={cn(
                  'btn-notch inline-flex h-9 items-center justify-center gap-1.5 px-2.5 text-xs font-medium text-white transition-opacity hover:opacity-90',
                  contrast.bg
                )}
              >
                <BarChart3 className="size-4 shrink-0" />
                <span className="hidden lg:inline">{t('methodStats')}</span>
              </Link>
            ) : undefined
          }
          centerSlot={
            smartMode && smartAvailable ? (
              <div className="w-full flex-1 flex flex-col items-center justify-center">
                <SmartCube
                  renderConnected={(connection) => <TrainerSmartTimer connection={connection} />}
                  onCancel={() => setSmartMode(false)}
                  cancelLabel={t('smart.exit')}
                />
              </div>
            ) : undefined
          }
        />
      </div>
    </div>
  )
}

function MiniSparkline({ solves, targetMs }: { solves: { _id: string; timeMs: number }[]; targetMs: number }) {
  const ordered = [...solves].slice(0, 24).reverse()
  if (ordered.length === 0) return null

  const times = ordered.map((s) => s.timeMs)
  const max = times.length > 0 ? Math.max(...times) : 1
  const min = times.length > 0 ? Math.min(...times) : 0
  const range = Math.max(max - min, 1)
  const L = ordered.length

  const visibilityClass = (distanceFromNewest: number) => {
    if (distanceFromNewest < 6) return ''
    if (distanceFromNewest < 10) return 'hidden sm:block'
    if (distanceFromNewest < 16) return 'hidden md:block'
    return 'hidden lg:block'
  }

  return (
    <div className="flex items-end gap-0.5 h-7">
      {ordered.map((s, j) => {
        const distanceFromNewest = L - 1 - j
        const vis = visibilityClass(distanceFromNewest)
        const ratio = (s.timeMs - min) / range
        const heightPct = Math.max(20, Math.round(ratio * 80 + 20))
        const colorClass =
          s.timeMs <= targetMs ? 'bg-emerald-500' : s.timeMs <= targetMs * 1.25 ? 'bg-amber-500' : 'bg-red-500'
        return <div key={s._id} className={cn('w-1 rounded-sm', colorClass, vis)} style={{ height: `${heightPct}%` }} />
      })}
    </div>
  )
}
