import { useCallback, useEffect, useRef, useState } from 'react'
import type { TwistyPlayer } from '@rednaxela101/cubing/twisty'
import { CubeEngine } from 'cube-state-engine'
import { useSolveClock } from '@/features/timer/model/useSolveClock'
import { useSolveReplayRecorder } from '@/features/timer/model/useSolveReplayRecorder'
import { useSaveVirtualSolve } from '@/features/timer/model/useSaveVirtualSolve'

export type SolvePhase = 'armed' | 'solving' | 'solved'

// Beat between finishing a solve and swapping in the next scramble, so the
// solved cube and the final time stay on screen for a moment. Input is ignored
// during it: the engine is about to be re-seeded with the next scramble.
const POST_SOLVE_LOCK_MS = 2000
const ROTATION_RE = /^[xyz]['2]?$/

interface UseSolveSessionArgs {
  player: TwistyPlayer | null
  engine: CubeEngine | null | undefined
  scramble: string | null
  onAdvanceScramble: () => void
  recreatePlayer: () => void
}

// Keyboard-driven solve session for the virtual cube. The smart cube has its
// own session in useSmartSessionStore, outside React, because it has to keep
// tracking a physical cube across navigation.
export function useSolveSession({ player, engine, scramble, onAdvanceScramble, recreatePlayer }: UseSolveSessionArgs) {
  const [phase, setPhaseState] = useState<SolvePhase>('armed')

  const clock = useSolveClock()
  const recorder = useSolveReplayRecorder()
  const saveSolve = useSaveVirtualSolve(engine)

  const phaseRef = useRef<SolvePhase>('armed')
  const processedSolveRef = useRef(false)
  const postSolveLockRef = useRef(0)
  const postSolveTimeoutRef = useRef<number | null>(null)

  // Latest values for the stable callbacks below, so they never read stale state.
  const latest = useRef({ player, engine, scramble, clock, recorder, saveSolve, onAdvanceScramble, recreatePlayer })
  latest.current = { player, engine, scramble, clock, recorder, saveSolve, onAdvanceScramble, recreatePlayer }

  const setPhase = useCallback((next: SolvePhase) => {
    phaseRef.current = next
    setPhaseState(next)
  }, [])

  const finalize = useCallback(() => {
    if (processedSolveRef.current) return
    processedSolveRef.current = true

    const { clock, recorder, saveSolve, scramble, onAdvanceScramble, recreatePlayer } = latest.current
    const finalTime = clock.stop()
    postSolveLockRef.current = Date.now() + POST_SOLVE_LOCK_MS
    setPhase('solved')

    try {
      saveSolve({ timeMs: finalTime, scramble: scramble ?? null, dnf: false, replayMoves: recorder.getMoves() })
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
      if (phaseRef.current === 'solved') return

      const isRotation = opts?.isRotation ?? ROTATION_RE.test(move)

      try {
        player.experimentalAddMove(move)
      } catch {}
      try {
        engine.applyMoves(move)
      } catch {}

      const armed = phaseRef.current === 'armed'
      recorder.record(move, armed && isRotation ? { t: 0 } : undefined)

      if (armed && !isRotation) {
        clock.start()
        setPhase('solving')
      }

      // Only tested once actually solving, so a cube already solved while armed
      // cannot finalize with a ~0 time.
      if (phaseRef.current !== 'solving') return
      try {
        if (engine.isSolved()) finalize()
      } catch {}
    },
    [setPhase, finalize]
  )

  const cancel = useCallback(() => {
    const { clock, recorder, onAdvanceScramble, recreatePlayer } = latest.current
    clock.stop()
    clock.reset()
    recorder.reset()
    processedSolveRef.current = false
    postSolveLockRef.current = 0

    try {
      onAdvanceScramble()
    } catch {}
    setPhase('armed')
    try {
      recreatePlayer()
    } catch {}
  }, [setPhase])

  const resetClock = clock.reset
  const resetRecorder = recorder.reset
  useEffect(() => {
    if (!engine) return
    processedSolveRef.current = false
    resetClock()
    resetRecorder()
    setPhase('armed')
  }, [scramble, engine, resetClock, resetRecorder, setPhase])

  useEffect(
    () => () => {
      if (postSolveTimeoutRef.current != null) window.clearTimeout(postSolveTimeoutRef.current)
    },
    []
  )

  return {
    phase,
    isSolving: phase === 'solving',
    solvingTime: clock.solvingTime,
    processMove,
    cancel
  }
}
