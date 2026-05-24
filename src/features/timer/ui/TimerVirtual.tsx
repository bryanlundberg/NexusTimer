'use client'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useTimerStore } from '@/shared/model/timer/useTimerStore'
import formatTime from '@/shared/lib/formatTime'
import { useSolveClock } from '@/features/timer/model/useSolveClock'
import { useVirtualCube } from '@/features/timer/model/useVirtualCube'
import { useVirtualKeyboardMoves } from '@/features/timer/model/useVirtualKeyboardMoves'
import { useSaveVirtualSolve } from '@/features/timer/model/useSaveVirtualSolve'

const POST_SOLVE_LOCK_MS = 2000

export default function TimerVirtual() {
  const scramble = useTimerStore((store) => store.scramble)
  const selectedCube = useTimerStore((store) => store.selectedCube)
  const setNewScramble = useTimerStore((store) => store.setNewScramble)
  const setIsSolvingStore = useTimerStore((store) => store.setIsSolving)

  const cubeSize = selectedCube?.category === '2x2' ? 2 : 3
  const is3x3 = cubeSize === 3

  const [isSolved, setIsSolved] = useState(false)
  const processedSolveRef = useRef(false)
  const postSolveLockRef = useRef<number>(0)
  const postSolveTimeoutRef = useRef<number | null>(null)

  const { containerRef, player, engine, recreatePlayer } = useVirtualCube({ cubeSize, scramble })
  const { solvingTime, isRunning, start, stop, reset } = useSolveClock()
  const saveSolve = useSaveVirtualSolve(engine)

  useEffect(() => {
    setIsSolvingStore(isRunning)
  }, [isRunning, setIsSolvingStore])

  useEffect(() => {
    if (!scramble) return
    setIsSolved(false)
    reset()
  }, [scramble, reset])

  useEffect(() => {
    if (!isSolved) return
    if (isRunning) stop()
    if (processedSolveRef.current) return

    processedSolveRef.current = true
    postSolveLockRef.current = Date.now() + POST_SOLVE_LOCK_MS

    const finalTime = stop()
    try {
      saveSolve({ timeMs: finalTime, scramble: scramble ?? null, dnf: false })
    } catch (e) {
      console.warn('saveSolve error (ignored):', e)
    }

    if (postSolveTimeoutRef.current != null) {
      window.clearTimeout(postSolveTimeoutRef.current)
    }
    postSolveTimeoutRef.current = window.setTimeout(() => {
      postSolveTimeoutRef.current = null
      postSolveLockRef.current = 0
      if (selectedCube) setNewScramble(selectedCube)
      try {
        recreatePlayer()
      } catch (e) {
        console.warn('recreatePlayer error (ignored):', e)
      }
      processedSolveRef.current = false
    }, POST_SOLVE_LOCK_MS)
  }, [isSolved, isRunning, stop, saveSolve, scramble, selectedCube, setNewScramble, recreatePlayer])

  useEffect(() => {
    return () => {
      if (postSolveTimeoutRef.current != null) {
        window.clearTimeout(postSolveTimeoutRef.current)
        postSolveTimeoutRef.current = null
      }
    }
  }, [])

  const handleCancel = useCallback(() => {
    stop()
    reset()
    if (selectedCube) {
      try {
        setNewScramble(selectedCube)
      } catch {}
    }
    if (engine) {
      try {
        engine.reset()
        if (scramble) engine.applyMoves(scramble)
      } catch {}
    }
    setIsSolved(false)
    try {
      recreatePlayer()
    } catch {}
  }, [stop, reset, selectedCube, setNewScramble, engine, scramble, recreatePlayer])

  useVirtualKeyboardMoves({
    player,
    engine,
    is3x3,
    isRunning,
    isSolved,
    isLocked: useCallback(() => Date.now() < postSolveLockRef.current, []),
    onMove: start,
    onSolved: useCallback(() => setIsSolved(true), []),
    onCancel: handleCancel
  })

  return (
    <div className="grow flex justify-center items-center flex-col gap-4">
      <div ref={containerRef} />
      <div className="text-3xl">{formatTime(solvingTime || 0)}</div>
    </div>
  )
}
