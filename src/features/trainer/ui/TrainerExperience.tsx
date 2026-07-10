'use client'

import { useEffect, useMemo } from 'react'
import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { BarChart3 } from 'lucide-react'
import { buttonVariants } from '@/components/ui/button'
import TrainerCurrentCase from '@/features/trainer/ui/TrainerCurrentCase'
import TrainerMethodSelect from '@/features/trainer/ui/TrainerMethodSelect'
import TrainerEditTargetModal from '@/features/trainer/ui/TrainerEditTargetModal'
import TrainerPickCasesModal from '@/features/trainer/ui/TrainerPickCasesModal'
import TrainerAlgorithmsModal from '@/features/trainer/ui/TrainerAlgorithmsModal'
import { useTrainerLearned } from '@/features/trainer/model/useTrainerLearned'
import { useTrainerPrefsStore } from '@/features/trainer/model/useTrainerPrefsStore'
import { setTrainerLearned } from '@/features/trainer/model/mutateTrainerLearned'
import { useOverlayStore } from '@/shared/model/overlay-store/useOverlayStore'
import type { TwistyPlayer } from 'cubing/twisty'
import { useTrainerStore } from '@/features/trainer/model/useTrainerStore'
import { useTrainerSession } from '@/features/trainer/model/useTrainerSession'
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
  const { set, sessionCases, currentCase, currentAlg, setup } = useTrainerSession()
  const methodSlug = set.slug

  const targetSeconds = useTrainerStore((s) => s.targetByMethod[s.methodSlug] ?? TRAINER_DEFAULT_TARGET_SECONDS)
  const caseStats = useTrainerStore((s) => s.caseStats)
  const caseIndex = useTrainerStore((s) => s.caseIndex)
  const setMethod = useTrainerStore((s) => s.setMethod)
  const setPickedIds = useTrainerStore((s) => s.setPickedIds)
  const setTargetSeconds = useTrainerStore((s) => s.setTargetSeconds)
  const advanceCase = useTrainerStore((s) => s.advanceCase)
  const recordSolve = useTrainerStore((s) => s.recordSolve)
  const attachLastSolveId = useTrainerStore((s) => s.attachLastSolveId)
  const undoLastSolve = useTrainerStore((s) => s.undoLastSolve)
  const lastSolve = useTrainerStore((s) => s.lastSolve)
  const hydrateMethodStats = useTrainerStore((s) => s.hydrateMethodStats)

  const timerStatus = useTimerStore((s) => s.timerStatus)
  const solvingTime = useTimerStore((s) => s.solvingTime)
  const isSolving = useTimerStore((s) => s.isSolving)
  const setTimerStatus = useTimerStore((s) => s.setTimerStatus)
  const setIsSolving = useTimerStore((s) => s.setIsSolving)
  const setSolvingTime = useTimerStore((s) => s.setSolvingTime)
  const settings = useSettingsStore((s) => s.settings)

  const { data: session } = useSession()
  const isAuthed = !!session?.user?.id

  const { open } = useOverlayStore()
  const showSolveInfo = useTrainerPrefsStore((s) => s.showSolveInfo)
  const toggleShowSolveInfo = useTrainerPrefsStore((s) => s.toggleShowSolveInfo)

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
    timerMode: TimerMode.NORMAL,
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
      postTrainerSolve({ methodSlug, caseId: solvedCaseId, timeMs: roundedMs, penalty: 'OK' })
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
    open({
      id: 'trainer-edit-target',
      component: <TrainerEditTargetModal initial={targetSeconds} onApply={handleApplyTarget} />
    })
  }

  const handleOpenAlgorithms = () => {
    if (!currentCase) return
    open({
      id: 'trainer-algorithms',
      metadata: { caseName: currentCase.name, algs: currentCase.algs },
      component: <TrainerAlgorithmsModal />
    })
  }

  const handleOpenPickCases = () => {
    open({
      id: 'trainer-pick-cases',
      component: (
        <TrainerPickCasesModal
          algorithms={set.algorithms}
          initialSelected={new Set(sessionCases.map((c) => c.id))}
          vizConfig={set.virtualization as unknown as Partial<TwistyPlayer>}
          puzzle={set.puzzle}
          onApply={setPickedIds}
        />
      )
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

  const totalCases = sessionCases.length
  const totalSetCases = set.algorithms.length
  const currentIsLearned = !!currentCase && learnedSet.has(currentCase.id)
  const execIndex = totalCases > 0 ? (caseIndex % totalCases) + 1 : 0

  return (
    <div id="touch" className="flex flex-col flex-1 relative">
      <div className={cn('absolute inset-0 pointer-events-none transition-colors duration-150', stageOverlayClass)} />
      <div className="flex flex-col gap-4 w-full max-w-5xl mx-auto px-4 py-6 flex-1 min-h-0">
        <div className="flex items-center gap-2 flex-wrap shrink-0">
          <div className="flex-1 min-w-0 max-w-sm">
            <TrainerMethodSelect value={set.slug} onChange={setMethod} />
          </div>
          {isAuthed && (
            <Link
              href="/algorithms/trainer/history"
              aria-label={t('methodStats')}
              title={t('methodStats')}
              className={cn(buttonVariants({ variant: 'outline', size: 'sm' }), 'h-8 gap-2 ms-auto')}
            >
              <BarChart3 className="h-3.5 w-3.5" />
              <span>{t('methodStats')}</span>
            </Link>
          )}
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
          ao12={currentStats?.ao12 != null ? formatMs(currentStats.ao12) : undefined}
          execIndex={execIndex}
          execTotal={totalCases}
          onSkip={handleSkip}
          onUndoLast={
            lastSolve && timerStatus === TimerStatus.IDLE && (!isAuthed || !!lastSolve.persistedId)
              ? handleUndoLast
              : undefined
          }
          lastSolveTime={lastSolve ? formatMs(lastSolve.timeMs) : undefined}
          onToggleLearned={isAuthed ? handleToggleLearned : undefined}
          targetSeconds={targetSeconds}
          onEditTarget={handleOpenEditTarget}
          pickedCount={totalCases}
          totalCount={totalSetCases}
          onPickCases={handleOpenPickCases}
          showSolveInfo={showSolveInfo}
          onToggleSolveInfo={toggleShowSolveInfo}
          onViewAlgorithms={currentCase ? handleOpenAlgorithms : undefined}
          sparklineSlot={<MiniSparkline solves={methodSolves} targetMs={targetSeconds * 1000} />}
        />
      </div>
    </div>
  )
}

function MiniSparkline({
  solves,
  targetMs
}: {
  solves: { _id: string; timeMs: number; penalty: 'OK' | '+2' | 'DNF' }[]
  targetMs: number
}) {
  const ordered = [...solves].slice(0, 24).reverse()
  if (ordered.length === 0) return null

  const validTimes = ordered.filter((s) => s.penalty !== 'DNF').map((s) => s.timeMs + (s.penalty === '+2' ? 2000 : 0))
  const max = validTimes.length > 0 ? Math.max(...validTimes) : 1
  const min = validTimes.length > 0 ? Math.min(...validTimes) : 0
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
        if (s.penalty === 'DNF') {
          return <div key={s._id} className={cn('w-1 h-full rounded-sm bg-red-500/40', vis)} />
        }
        const adjusted = s.timeMs + (s.penalty === '+2' ? 2000 : 0)
        const ratio = (adjusted - min) / range
        const heightPct = Math.max(20, Math.round(ratio * 80 + 20))
        const colorClass =
          adjusted <= targetMs ? 'bg-emerald-500' : adjusted <= targetMs * 1.25 ? 'bg-amber-500' : 'bg-red-500'
        return <div key={s._id} className={cn('w-1 rounded-sm', colorClass, vis)} style={{ height: `${heightPct}%` }} />
      })}
    </div>
  )
}
