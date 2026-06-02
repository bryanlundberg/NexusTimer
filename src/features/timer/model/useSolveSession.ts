import { useCallback, useEffect, useRef, useState } from 'react'
import type { TwistyPlayer } from 'cubing/twisty'
import { CubeEngine } from 'cube-state-engine'
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

export type SolvePhase = 'scrambling' | 'armed' | 'solving' | 'solved'
export type ScrambleMode = 'auto' | 'manual'

const POST_SOLVE_LOCK_MS = 2000
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
}

export function useSolveSession({
  player,
  engine,
  scramble,
  cubeSize,
  smart,
  scrambleMode,
  onAdvanceScramble,
  recreatePlayer
}: UseSolveSessionArgs) {
  const initialPhase: SolvePhase = scrambleMode === 'auto' ? 'armed' : 'scrambling'
  const [phase, setPhaseState] = useState<SolvePhase>(initialPhase)
  // Live guidance while applying a manual scramble (null in `auto` mode).
  const [guide, setGuide] = useState<ScrambleGuide | null>(null)

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
    recreatePlayer
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
    recreatePlayer
  }

  const setPhase = useCallback((next: SolvePhase) => {
    phaseRef.current = next
    setPhaseState(next)
  }, [])

  const finalize = useCallback(() => {
    if (processedSolveRef.current) return
    processedSolveRef.current = true

    const { clock, recorder, saveSolve, scramble, smart, onAdvanceScramble, recreatePlayer } = latest.current
    const finalTime = clock.stop()
    postSolveLockRef.current = Date.now() + POST_SOLVE_LOCK_MS
    setPhase('solved')

    try {
      saveSolve({ timeMs: finalTime, scramble: scramble ?? null, dnf: false, replayMoves: recorder.getMoves(), smart })
    } catch (e) {
      console.warn('saveSolve error (ignored):', e)
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
  }, [setPhase])

  const processMove = useCallback(
    (move: string, opts?: { isRotation?: boolean }) => {
      const { player, engine, clock, recorder } = latest.current
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
      if (!scrambling) recorder.record(move, phase === 'armed' && isRotation ? { t: 0 } : undefined)

      if (scrambling) {
        const parsed = isRotation ? null : parseMove(move)
        if (parsed) {
          guideStateRef.current = stepGuide(scrambleTokensRef.current, guideStateRef.current, parsed)
        }
        try {
          const stateJson = JSON.stringify(engine.state())
          if (targetStateRef.current && stateJson === targetStateRef.current) {
            setPhase('armed')
            setGuide(null)
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

      if (phase === 'armed' && !isRotation) {
        clock.start()
        setPhase('solving')
      }

      try {
        if (engine.isSolved()) finalize()
      } catch {}
    },
    [setPhase, finalize]
  )

  const cancel = useCallback(() => {
    const { clock, recorder, engine, scrambleMode, onAdvanceScramble, recreatePlayer } = latest.current
    clock.stop()
    clock.reset()
    recorder.reset()
    processedSolveRef.current = false
    postSolveLockRef.current = 0

    if (scrambleMode === 'auto') {
      try {
        onAdvanceScramble()
      } catch {}
      setPhase('armed')
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
  }, [setPhase])

  const resetClock = clock.reset
  const resetRecorder = recorder.reset
  useEffect(() => {
    if (!engine) return

    if (scrambleMode === 'manual' && scramble) {
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
    setPhase(scrambleMode === 'auto' ? 'armed' : 'scrambling')
  }, [scramble, engine, scrambleMode, cubeSize, resetClock, resetRecorder, setPhase])

  useEffect(
    () => () => {
      if (postSolveTimeoutRef.current != null) window.clearTimeout(postSolveTimeoutRef.current)
    },
    []
  )

  return {
    phase,
    isReady: phase === 'armed',
    isSolving: phase === 'solving',
    solvingTime: clock.solvingTime,
    guide,
    processMove,
    cancel
  }
}
