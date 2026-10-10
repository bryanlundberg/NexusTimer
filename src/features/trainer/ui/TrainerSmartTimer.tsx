'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useTranslations } from 'next-intl'
import { RotateCcw } from 'lucide-react'
import { CubeEngine } from 'cube-state-engine'
import type { SmartCubeConnection } from 'smartcube-web-bluetooth'
import { Button } from '@/components/ui/button'
import { cn } from '@/shared/lib/utils'
import { useSession } from '@/shared/model/useSession'
import AlgorithmRender from '@/shared/ui/twisty/AlgorithmRender'
import { ScrambleGuideMoves } from '@/features/timer/ui/ScrambleGuideMoves'
import { SolveClockText } from '@/features/timer/ui/SolveClockText'
import { useVirtualCube } from '@/features/timer/model/useVirtualCube'
import { useTrainerSession } from '@/features/trainer/model/useTrainerSession'
import { useTrainerStore } from '@/features/trainer/model/useTrainerStore'
import { useTrainerSmartSession } from '@/features/trainer/model/useTrainerSmartSession'
import { computeTransition } from '@/features/trainer/lib/computeTransition'
import { postTrainerSolve } from '@/features/trainer/model/postTrainerSolve'
import { buildVizConfig, cleanMoves, formatMs } from '@/features/trainer/lib/trainerUtils'

const CUBE_SIZE = 3

const stateJson = (moves: string): string | null => {
  try {
    const probe = new CubeEngine('', { size: CUBE_SIZE })
    if (moves.trim()) probe.applyMoves(moves)
    return JSON.stringify(probe.state())
  } catch {
    return null
  }
}

const targetAfter = (history: string, setup: string, transition: string | null) =>
  transition === null
    ? { scramble: setup, json: stateJson(setup) }
    : { scramble: transition, json: stateJson(`${history} ${transition}`) }

interface TrainerSmartTimerProps {
  connection: SmartCubeConnection
}

export default function TrainerSmartTimer({ connection }: TrainerSmartTimerProps) {
  const t = useTranslations('Index.TrainerPage')
  const { set, sessionCases, currentCase, currentAlg, setup } = useTrainerSession()
  const methodSlug = set.slug
  const goal = set.goal

  const advanceCase = useTrainerStore((s) => s.advanceCase)
  const recordSolve = useTrainerStore((s) => s.recordSolve)
  const attachLastSolveId = useTrainerStore((s) => s.attachLastSolveId)

  const { data: session } = useSession()
  const isAuthed = !!session?.user?.id

  const vizConfig = useMemo(
    () => buildVizConfig(set.puzzle, currentAlg?.moves ?? '', set.virtualization as Record<string, unknown>),
    [set, currentAlg]
  )

  const { containerRef, player, engine, recreatePlayer } = useVirtualCube({
    cubeSize: CUBE_SIZE,
    scramble: null,
    seed: false,
    tempoScale: 5,
    dragInput: 'none',
    sizePx: 'min(150px, 32vw)',
    cameraDistance: 8
  })

  const [target, setTarget] = useState<{ scramble: string; json: string | null }>({ scramble: '', json: null })

  const currentCaseRef = useRef(currentCase)
  currentCaseRef.current = currentCase
  const sessionLenRef = useRef(sessionCases.length)
  sessionLenRef.current = sessionCases.length
  const historyRef = useRef<string>('')

  const handleSolved = useCallback(
    (timeMs: number, history: string) => {
      const solved = currentCaseRef.current
      historyRef.current = history
      if (solved) {
        const ms = Math.round(timeMs)
        if (ms > 0) {
          recordSolve(solved.id, ms)
          if (isAuthed) {
            postTrainerSolve({ methodSlug, caseId: solved.id, timeMs: ms })
              .then((res) => {
                if (res?.solve?._id) attachLastSolveId(res.solve._id)
              })
              .catch((err) => console.error('Failed to persist trainer solve:', err))
          }
        }
      }
      advanceCase(sessionLenRef.current)
    },
    [advanceCase, recordSolve, attachLastSolveId, isAuthed, methodSlug]
  )

  const { phase, clock, guide, resync } = useTrainerSmartSession({
    engine,
    player,
    connection,
    goal,
    targetScramble: target.scramble,
    targetStateJson: target.json,
    onSolved: handleSolved,
    recreatePlayer
  })

  useEffect(() => {
    if (!currentCase) return
    let cancelled = false
    const history = historyRef.current
    const nextSetup = cleanMoves(setup)

    computeTransition(history, nextSetup, goal).then((transition) => {
      if (!cancelled) setTarget(targetAfter(history, nextSetup, transition))
    })
    return () => {
      cancelled = true
    }
  }, [currentCase?.id])

  const handleResync = useCallback(() => {
    historyRef.current = ''
    if (connection.capabilities.reset) {
      connection.sendCommand({ type: 'REQUEST_RESET' }).catch(() => {})
    }
    resync()
    const nextSetup = cleanMoves(setup)
    computeTransition('', nextSetup, goal).then((transition) => setTarget(targetAfter('', nextSetup, transition)))
  }, [connection, resync, setup, goal])

  const statusLabel = useMemo(() => {
    switch (phase) {
      case 'guiding':
        return t('smart.applySetup')
      case 'ready':
        return t('smart.ready')
      case 'solving':
        return t('smart.solving')
      case 'solved':
        return t('smart.solved')
    }
  }, [phase, t])

  const timeColorClass = phase === 'ready' ? 'text-green-500' : phase === 'solved' ? 'text-primary' : 'text-foreground'

  return (
    <div className="grow flex flex-col items-center justify-center gap-3 w-full px-2">
      <div className="flex items-center justify-center gap-4 flex-wrap">
        <div className="size-32 sm:size-40">
          <AlgorithmRender config={vizConfig} width="100%" height="100%" className="size-full" />
        </div>
        {/* Live physical cube tracking. */}
        <div ref={containerRef} className="rounded-md overflow-hidden" />
      </div>

      <div className="flex items-center gap-2">
        <div
          className={cn(
            'inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium',
            phase === 'ready'
              ? 'bg-green-500/15 text-green-600'
              : phase === 'solving'
                ? 'bg-primary/15 text-primary'
                : 'bg-muted text-muted-foreground'
          )}
        >
          <span
            className={cn(
              'size-1.5 rounded-full',
              phase === 'ready' ? 'bg-green-500' : phase === 'solving' ? 'bg-primary' : 'bg-muted-foreground/50'
            )}
          />
          {statusLabel}
        </div>

        <Button
          type="button"
          size="sm"
          variant="ghost"
          onClick={handleResync}
          className="h-6 px-2 gap-1 text-xs text-muted-foreground hover:text-foreground"
        >
          <RotateCcw className="size-3" />
          {t('smart.resync')}
        </Button>
      </div>

      <div className={cn('text-4xl sm:text-6xl tabular-nums font-semibold', timeColorClass)}>
        {phase === 'ready' ? '0.00' : <SolveClockText clock={clock} format={formatMs} />}
      </div>

      {phase === 'guiding' && (
        <div className="min-h-8 flex items-center text-xl sm:text-2xl">
          <ScrambleGuideMoves guide={guide} />
        </div>
      )}
    </div>
  )
}
