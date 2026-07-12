import { useCallback, useEffect, useRef, useState } from 'react'
import type { TwistyPlayer } from 'cubing/twisty'
import { CubeEngine, simplifyMoves } from 'cube-state-engine'
import { useSolveClock } from '@/features/timer/model/useSolveClock'
import { useSolveReplayRecorder } from '@/features/timer/model/useSolveReplayRecorder'
import { useSaveVirtualSolve } from '@/features/timer/model/useSaveVirtualSolve'
import {
  formatMove,
  guideFromState,
  initGuideState,
  parseMove,
  stepGuide,
  tokenizeScramble,
  type GuideState,
  type ScrambleGuide,
  type ScrambleMove
} from '@/shared/lib/timer/scrambleGuide'

export type SolvePhase = 'scrambling' | 'armed' | 'inspecting' | 'solving' | 'solved'
export type ScrambleMode = 'auto' | 'manual'

export interface SolveStats {
  moveCount: number
  tps: number
}

export interface InspectionConfig {
  enabled: boolean
  durationMs: number
}

const POST_SOLVE_LOCK_MS = 2000
const DEFAULT_INSPECTION_MS = 15000
const ROTATION_RE = /^[xyz]['2]?$/

interface UseSolveSessionArgs {
  player: TwistyPlayer | null
  engine: CubeEngine | null | undefined
  scramble: string | null
  cubeSize: number
  smart: boolean
  // `auto`: engine arrives scrambled, session starts `armed` (keyboard).
  // `manual`: engine starts solved, user reaches the scrambled state to arm (smart).
  scrambleMode: ScrambleMode
  onAdvanceScramble: () => void
  recreatePlayer: () => void
  inspection?: InspectionConfig
  goalPredicate?: (engine: CubeEngine) => boolean
}

export function useSolveSession({
  player,
  engine,
  scramble,
  cubeSize,
  smart,
  scrambleMode,
  onAdvanceScramble,
  recreatePlayer,
  inspection = { enabled: false, durationMs: DEFAULT_INSPECTION_MS },
  goalPredicate
}: UseSolveSessionArgs) {
  const isGoalMet = goalPredicate ?? ((eng: CubeEngine) => eng.isSolved())
  const inspectionEnabled = inspection.enabled
  const inspectionDuration = inspection.durationMs || DEFAULT_INSPECTION_MS
  const armedPhase: SolvePhase = inspectionEnabled ? 'inspecting' : 'armed'
  const initialPhase: SolvePhase = scrambleMode === 'auto' ? armedPhase : 'scrambling'
  const [phase, setPhaseState] = useState<SolvePhase>(initialPhase)
  // Live guidance while applying a manual scramble (null in `auto` mode).
  const [guide, setGuide] = useState<ScrambleGuide | null>(null)
  const [inspectionTime, setInspectionTime] = useState<number | null>(null)
  const [solveStats, setSolveStats] = useState<SolveStats | null>(null)

  const clock = useSolveClock()
  const recorder = useSolveReplayRecorder()
  const saveSolve = useSaveVirtualSolve(engine)

  const phaseRef = useRef<SolvePhase>(initialPhase)
  const targetStateRef = useRef<string | null>(null)
  // Cube state after each scramble prefix, used to reconcile guidance with the
  // real cube: returning to any valid prefix clears accumulated corrections.
  const prefixStatesRef = useRef<string[]>([])
  const scrambleTokensRef = useRef<ScrambleMove[]>([])
  const guideStateRef = useRef<GuideState>(initGuideState())
  const processedSolveRef = useRef(false)
  const postSolveLockRef = useRef(0)
  const postSolveTimeoutRef = useRef<number | null>(null)
  const inspectionIdRef = useRef<number | null>(null)
  const inspectionStartRef = useRef<number | null>(null)

  // Latest values for the stable callbacks below, so they never read stale state.
  const latest = useRef({
    player,
    engine,
    scramble,
    smart,
    scrambleMode,
    clock,
    recorder,
    saveSolve,
    onAdvanceScramble,
    recreatePlayer,
    inspectionEnabled,
    inspectionDuration,
    armedPhase,
    isGoalMet
  })
  latest.current = {
    player,
    engine,
    scramble,
    smart,
    scrambleMode,
    clock,
    recorder,
    saveSolve,
    onAdvanceScramble,
    recreatePlayer,
    inspectionEnabled,
    inspectionDuration,
    armedPhase,
    isGoalMet
  }

  const setPhase = useCallback((next: SolvePhase) => {
    phaseRef.current = next
    setPhaseState(next)
  }, [])

  const stopInspection = useCallback(() => {
    if (inspectionIdRef.current != null) {
      window.clearInterval(inspectionIdRef.current)
      inspectionIdRef.current = null
    }
    inspectionStartRef.current = null
    setInspectionTime(null)
  }, [])

  const finalize = useCallback(
    (dnf = false) => {
      if (processedSolveRef.current) return
      processedSolveRef.current = true

      const { clock, recorder, saveSolve, engine, scramble, smart, onAdvanceScramble, recreatePlayer } = latest.current
      stopInspection()
      const finalTime = clock.stop()
      postSolveLockRef.current = Date.now() + POST_SOLVE_LOCK_MS
      setPhase('solved')

      if (!dnf) {
        try {
          const simplified = simplifyMoves(engine?.getMoves(false) ?? []) as string[]
          const moveCount = simplified.length
          const tps = finalTime > 0 ? moveCount / (finalTime / 1000) : 0
          setSolveStats(moveCount > 0 ? { moveCount, tps } : null)
        } catch {
          setSolveStats(null)
        }
        try {
          saveSolve({ timeMs: finalTime, scramble: scramble ?? null, dnf, replayMoves: recorder.getMoves(), smart })
        } catch (e) {
          console.warn('saveSolve error (ignored):', e)
        }
      }

      if (postSolveTimeoutRef.current != null) window.clearTimeout(postSolveTimeoutRef.current)
      postSolveTimeoutRef.current = window.setTimeout(() => {
        postSolveTimeoutRef.current = null
        postSolveLockRef.current = 0
        try {
          onAdvanceScramble()
        } catch (e) {
          console.warn('onAdvanceScramble error (ignored):', e)
        }
        try {
          recreatePlayer()
        } catch (e) {
          console.warn('recreatePlayer error (ignored):', e)
        }
      }, POST_SOLVE_LOCK_MS)
    },
    [setPhase, stopInspection]
  )

  const startInspection = useCallback(() => {
    const { inspectionDuration } = latest.current
    if (inspectionIdRef.current != null) window.clearInterval(inspectionIdRef.current)
    inspectionStartRef.current = Date.now()
    setInspectionTime(inspectionDuration / 1000)
    inspectionIdRef.current = window.setInterval(() => {
      if (inspectionStartRef.current == null) return
      const remaining = inspectionDuration - (Date.now() - inspectionStartRef.current)
      if (remaining <= 0) {
        finalize(true)
        return
      }
      setInspectionTime(remaining / 1000)
    }, 100)
  }, [finalize])

  // Transition into the post-scramble ready state, starting inspection if enabled.
  const arm = useCallback(() => {
    const { armedPhase, inspectionEnabled } = latest.current
    setGuide(null)
    setPhase(armedPhase)
    if (inspectionEnabled) startInspection()
  }, [setPhase, startInspection])

  const processMove = useCallback(
    (move: string, opts?: { isRotation?: boolean }) => {
      const { player, engine, clock, recorder, isGoalMet } = latest.current
      if (!player || !engine) return
      if (Date.now() < postSolveLockRef.current) return

      const phase = phaseRef.current
      if (phase === 'solved') return

      const isRotation = opts?.isRotation ?? ROTATION_RE.test(move)
      const scrambling = phase === 'scrambling'

      try {
        player.experimentalAddMove(move)
      } catch {}
      try {
        engine.applyMoves(move, { record: !scrambling })
      } catch {}
      const ready = phase === 'armed' || phase === 'inspecting'
      if (!scrambling) recorder.record(move, ready && isRotation ? { t: 0 } : undefined)

      if (scrambling) {
        const parsed = isRotation ? null : parseMove(move)
        if (parsed) {
          guideStateRef.current = stepGuide(scrambleTokensRef.current, guideStateRef.current, parsed)
        }
        try {
          const stateJson = JSON.stringify(engine.state())
          if (targetStateRef.current && stateJson === targetStateRef.current) {
            arm()
            return
          }
          if (parsed) {
            const prefixIndex = prefixStatesRef.current.lastIndexOf(stateJson)
            const gs = guideStateRef.current
            if (prefixIndex >= 0 && (gs.index !== prefixIndex || gs.acc !== 0 || gs.errors.length > 0)) {
              guideStateRef.current = { index: prefixIndex, acc: 0, errors: [] }
            }
          }
        } catch {}
        if (parsed) setGuide(guideFromState(scrambleTokensRef.current, guideStateRef.current))
        return
      }

      if (ready && !isRotation) {
        stopInspection()
        clock.start()
        setSolveStats(null)
        setPhase('solving')
      }

      // Only test the terminal goal once actually solving, so a goal already
      // satisfied at the armed/case state cannot finalize with ~0 time.
      if (phaseRef.current === 'solving') {
        try {
          if (isGoalMet(engine)) finalize()
        } catch {}
      }
    },
    [setPhase, finalize, arm, stopInspection]
  )

  const cancel = useCallback(() => {
    const { clock, recorder, engine, scrambleMode, armedPhase, inspectionEnabled, onAdvanceScramble, recreatePlayer } =
      latest.current
    clock.stop()
    clock.reset()
    recorder.reset()
    stopInspection()
    setSolveStats(null)
    processedSolveRef.current = false
    postSolveLockRef.current = 0

    if (scrambleMode === 'auto') {
      try {
        onAdvanceScramble()
      } catch {}
      setPhase(armedPhase)
      if (inspectionEnabled) startInspection()
    } else {
      try {
        engine?.reset()
      } catch {}
      guideStateRef.current = initGuideState()
      setGuide(guideFromState(scrambleTokensRef.current, guideStateRef.current))
      setPhase('scrambling')
    }

    try {
      recreatePlayer()
    } catch {}
  }, [setPhase, stopInspection, startInspection])

  const resetState = useCallback(() => {
    const { engine, scrambleMode, clock, recorder, armedPhase, inspectionEnabled, recreatePlayer } = latest.current
    clock.stop()
    clock.reset()
    recorder.reset()
    stopInspection()
    setSolveStats(null)
    processedSolveRef.current = false
    postSolveLockRef.current = 0
    try {
      engine?.reset()
    } catch {}
    guideStateRef.current = initGuideState()

    if (scrambleMode === 'manual') {
      setGuide(guideFromState(scrambleTokensRef.current, guideStateRef.current))
      setPhase('scrambling')
    } else {
      setGuide(null)
      setPhase(armedPhase)
      if (inspectionEnabled) startInspection()
    }

    try {
      recreatePlayer()
    } catch {}
  }, [setPhase, stopInspection, startInspection])

  const resetClock = clock.reset
  const resetRecorder = recorder.reset
  useEffect(() => {
    if (!engine) return
    stopInspection()

    if (scrambleMode === 'manual' && scramble) {
      try {
        engine.reset()
      } catch {}
      const tokens = tokenizeScramble(scramble)
      scrambleTokensRef.current = tokens
      guideStateRef.current = initGuideState()
      setGuide(guideFromState(tokens, guideStateRef.current))
      try {
        const probe = new CubeEngine('', { size: cubeSize })
        const states = [JSON.stringify(probe.state())]
        for (const token of tokens) {
          probe.applyMoves(formatMove(token), { record: false })
          states.push(JSON.stringify(probe.state()))
        }
        prefixStatesRef.current = states
        targetStateRef.current = states[states.length - 1]
      } catch {
        prefixStatesRef.current = []
        targetStateRef.current = null
      }
    } else {
      targetStateRef.current = null
      prefixStatesRef.current = []
      scrambleTokensRef.current = []
      guideStateRef.current = initGuideState()
      setGuide(null)
    }

    processedSolveRef.current = false
    resetClock()
    resetRecorder()
    if (scrambleMode === 'auto') {
      setPhase(armedPhase)
      if (inspectionEnabled) startInspection()
    } else {
      setPhase('scrambling')
    }
  }, [
    scramble,
    engine,
    scrambleMode,
    cubeSize,
    armedPhase,
    inspectionEnabled,
    resetClock,
    resetRecorder,
    setPhase,
    stopInspection,
    startInspection
  ])

  useEffect(
    () => () => {
      if (postSolveTimeoutRef.current != null) window.clearTimeout(postSolveTimeoutRef.current)
      if (inspectionIdRef.current != null) window.clearInterval(inspectionIdRef.current)
    },
    []
  )

  return {
    phase,
    isReady: phase === 'armed' || phase === 'inspecting',
    isInspecting: phase === 'inspecting',
    isSolving: phase === 'solving',
    solvingTime: clock.solvingTime,
    inspectionTime,
    guide,
    solveStats,
    processMove,
    cancel,
    resetState
  }
}
