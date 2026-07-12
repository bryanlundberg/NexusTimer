import { useCallback, useEffect, useRef, useState } from 'react'
import type { TwistyPlayer } from 'cubing/twisty'
import { CubeEngine, matchesGoal } from 'cube-state-engine'
import type { SmartCubeConnection } from 'smartcube-web-bluetooth'
import { useSolveClock } from '@/features/timer/model/useSolveClock'
import { useSmartCubeMoves } from '@/features/smart-cube/model/useSmartCubeMoves'
import {
  guideFromState,
  initGuideState,
  isComplete,
  parseMove,
  stepGuide,
  tokenizeScramble,
  type GuideState,
  type ScrambleGuide,
  type ScrambleMove
} from '@/shared/lib/timer/scrambleGuide'

export type SmartTrainerPhase = 'guiding' | 'ready' | 'solving' | 'solved'

const ROTATION_RE = /^[xyz]['2]?$/
const POST_SOLVE_LOCK_MS = 1200

interface UseTrainerSmartSessionArgs {
  engine: CubeEngine | null
  player: TwistyPlayer | null
  connection: SmartCubeConnection | null
  goal: string
  targetScramble: string
  targetStateJson: string | null
  onSolved: (timeMs: number, historyFromSolved: string) => void
}

/**
 * Smart-cube session for the algorithm trainer. Unlike the main timer's
 * useSolveSession, the engine is NEVER reset between cases: with goals like
 * 'oll' the physical cube is not solved after a case, so the engine must keep
 * tracking the real state. Arming happens when the tracked engine state matches
 * the case state; the solve ends when `matchesGoal` is satisfied.
 */
export function useTrainerSmartSession({
  engine,
  player,
  connection,
  goal,
  targetScramble,
  targetStateJson,
  onSolved
}: UseTrainerSmartSessionArgs) {
  const [phase, setPhaseState] = useState<SmartTrainerPhase>('guiding')
  const [guide, setGuide] = useState<ScrambleGuide | null>(null)

  const clock = useSolveClock()

  const phaseRef = useRef<SmartTrainerPhase>('guiding')
  const tokensRef = useRef<ScrambleMove[]>([])
  const guideStateRef = useRef<GuideState>(initGuideState())
  const targetJsonRef = useRef<string | null>(null)
  const moveLogRef = useRef<string>('')
  const processedRef = useRef(false)
  const lockRef = useRef(0)

  // Stable refs so the move handler never reads stale values.
  const latest = useRef({ engine, player, goal, onSolved, clock })
  latest.current = { engine, player, goal, onSolved, clock }

  const setPhase = useCallback((next: SmartTrainerPhase) => {
    phaseRef.current = next
    setPhaseState(next)
  }, [])

  const finalize = useCallback(() => {
    if (processedRef.current) return
    processedRef.current = true
    const { clock, onSolved } = latest.current
    const time = clock.stop()
    lockRef.current = Date.now() + POST_SOLVE_LOCK_MS
    setPhase('solved')
    try {
      onSolved(time, moveLogRef.current)
    } catch (e) {
      console.warn('trainer onSolved error (ignored):', e)
    }
  }, [setPhase])

  const processMove = useCallback(
    (move: string) => {
      const { engine, player, goal, clock } = latest.current
      if (!engine) return
      if (Date.now() < lockRef.current) return
      if (phaseRef.current === 'solved') return

      const isRotation = ROTATION_RE.test(move)

      try {
        player?.experimentalAddMove(move)
      } catch {}
      try {
        engine.applyMoves(move, { record: false })
      } catch {}
      moveLogRef.current = moveLogRef.current ? `${moveLogRef.current} ${move}` : move

      if (phaseRef.current === 'guiding') {
        const parsed = isRotation ? null : parseMove(move)
        if (parsed) {
          guideStateRef.current = stepGuide(tokensRef.current, guideStateRef.current, parsed)
          setGuide(guideFromState(tokensRef.current, guideStateRef.current))
        }
        // Arm when the tracked cube reaches the case state (primary), or when the
        // guide has been fully applied without pending corrections (fallback, in
        // case of any notation edge the exact-state check would miss).
        let reached = false
        try {
          reached = !!targetJsonRef.current && JSON.stringify(engine.state()) === targetJsonRef.current
        } catch {}
        if (!reached && tokensRef.current.length > 0) {
          reached = isComplete(tokensRef.current, guideStateRef.current)
        }
        if (reached) {
          setGuide({ corrections: [], pending: [] })
          setPhase('ready')
        }
        return
      }

      if (phaseRef.current === 'ready' && !isRotation) {
        clock.start()
        setPhase('solving')
      }

      if (phaseRef.current === 'solving') {
        try {
          if (matchesGoal(engine, goal)) finalize()
        } catch {}
      }
    },
    [finalize, setPhase]
  )

  useSmartCubeMoves({ connection, onMove: processMove })

  // A new case (or a recomputed transition) arrives: refresh the guide and
  // arming target WITHOUT touching the engine or the move log.
  useEffect(() => {
    tokensRef.current = tokenizeScramble(targetScramble)
    guideStateRef.current = initGuideState()
    targetJsonRef.current = targetStateJson
    processedRef.current = false
    clock.reset()
    setGuide(guideFromState(tokensRef.current, guideStateRef.current))
    setPhase('guiding')
  }, [targetScramble, targetStateJson])

  // Re-align the engine to a solved physical cube
  const resync = useCallback(() => {
    const { engine } = latest.current
    try {
      engine?.reset()
    } catch {}
    moveLogRef.current = ''
    guideStateRef.current = initGuideState()
    processedRef.current = false
    lockRef.current = 0
    clock.reset()
    setGuide(guideFromState(tokensRef.current, guideStateRef.current))
    setPhase('guiding')
  }, [clock, setPhase])

  return {
    phase,
    isSolving: phase === 'solving',
    solvingTime: clock.solvingTime,
    guide,
    resync,
    getHistory: () => moveLogRef.current
  }
}
