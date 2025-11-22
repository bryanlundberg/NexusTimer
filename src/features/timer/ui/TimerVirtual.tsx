'use client'
import React from 'react'
import { TwistyPlayer } from 'cubing/twisty'
import { useTimerStore } from '@/shared/model/timer/useTimerStore'
import { CubeEngine } from 'cube-state-engine'
import formatTime from '@/shared/lib/formatTime'
import genId from '@/shared/lib/genId'
import { useNXData } from '@/hooks/useNXData'
import { sendSolveToServer } from '@/shared/lib/actions'
import { useSession } from 'next-auth/react'
import { useSettingsStore } from '@/shared/model/settings/useSettingsStore'
import { Solve } from '@/entities/solve/model/types'

export default function TimerVirtual() {
  const containerRef = React.useRef<HTMLDivElement | null>(null)
  const [player, setPlayer] = React.useState<TwistyPlayer | null>(null)
  const scramble = useTimerStore((store) => store.scramble)
  const selectedCube = useTimerStore((store) => store.selectedCube)
  const setNewScramble = useTimerStore((store) => store.setNewScramble)
  const [engine, setEngine] = React.useState<CubeEngine | null>()
  const [moves, setMoves] = React.useState<string[]>()
  const [isSolved, setIsSolved] = React.useState(false)
  const [solvingTime, setSolvingTime] = React.useState<number | null>(null)
  const processedSolveRef = React.useRef(false)
  const { data: session } = useSession()
  const updateSetting = useSettingsStore((state) => state.updateSetting)
  const solvesSinceLastSync = useSettingsStore((state) => state.settings.sync.totalSolves)
  const cubeSize = selectedCube?.category === '2x2' ? 2 : 3
  const is3x3 = cubeSize === 3

  // Lock window after a solve to avoid key handling and cascaded saves
  const postSolveLockRef = React.useRef<number>(0)
  const postSolveTimeoutRef = React.useRef<number | null>(null)
  const isRunning = useTimerStore((store) => store.isSolving)
  const setIsRunning = useTimerStore((store) => store.setIsSolving)
  const { saveCube } = useNXData()
  const setSelectedCube = useTimerStore((store) => store.setSelectedCube)
  const setLastSolve = useTimerStore((store) => store.setLastSolve)

  const saveSolvePlaceholder = (_payload: {
    timeMs: number
    scramble: string | null
    moves: string[]
    dnf: boolean
  }) => {
    if (!selectedCube || !scramble) return

    const now = Date.now()
    const newSolve: Solve = {
      id: genId(),
      startTime: now - _payload.timeMs,
      endTime: Date.now(),
      scramble: scramble,
      bookmark: false,
      time: _payload.timeMs,
      dnf: _payload.dnf,
      plus2: false,
      rating: Math.floor(Math.random() * 20) + scramble.length,
      cubeId: selectedCube.id,
      comment: '',
      isDeleted: false,
      updatedAt: now
    }

    sendSolveToServer({
      solve: newSolve,
      userId: session?.user?.id ?? undefined,
      solution: engine?.getMoves(true),
      puzzle: selectedCube.category === '2x2' ? '2x2x2' : '3x3x3',
      smart: false
    }).catch((e) => {
      console.warn('sendSolveToServer error (ignored):', e)
    })

    const updatedCube = {
      ...selectedCube,
      solves: {
        ...selectedCube.solves,
        session: [newSolve, ...selectedCube.solves.session]
      }
    }

    saveCube(updatedCube)
    setSelectedCube(updatedCube)
    setLastSolve({ ...newSolve })
    updateSetting('sync.totalSolves', 1 + solvesSinceLastSync)
    // Do not request a new scramble here; it will be triggered after a 2s pause post-solve
  }

  const startTimeRef = React.useRef<number | null>(null)
  const performanceStartRef = React.useRef<number | null>(null)
  const intervalRef = React.useRef<number | null>(null)

  const startTimer = () => {
    if (isRunning) return
    // Clear any post-solve lock or pending timeout when starting a new attempt
    postSolveLockRef.current = 0
    if (postSolveTimeoutRef.current != null) {
      window.clearTimeout(postSolveTimeoutRef.current)
      postSolveTimeoutRef.current = null
    }
    processedSolveRef.current = false
    setIsRunning(true)
    // Store both real timestamp and performance timestamp
    startTimeRef.current = Date.now()
    performanceStartRef.current = performance.now()
    setSolvingTime(0)
    intervalRef.current = window.setInterval(() => {
      if (performanceStartRef.current != null) {
        setSolvingTime(performance.now() - performanceStartRef.current)
      }
    }, 10)
  }

  const stopTimer = () => {
    if (intervalRef.current != null) {
      window.clearInterval(intervalRef.current)
      intervalRef.current = null
    }
    setIsRunning(false)
    if (performanceStartRef.current != null) {
      setSolvingTime(performance.now() - performanceStartRef.current)
    }
    performanceStartRef.current = null
  }

  const resetTimer = () => {
    if (intervalRef.current != null) {
      window.clearInterval(intervalRef.current)
      intervalRef.current = null
    }
    setIsRunning(false)
    startTimeRef.current = null
    performanceStartRef.current = null
    setSolvingTime(0)
  }

  React.useEffect(() => {
    if (!containerRef.current) return

    // Clean up any existing player before creating a new one
    try {
      if (player) {
        player.remove()
      }
    } catch {}

    const newEngine = new CubeEngine('', { size: cubeSize })
    const newPlayer = new TwistyPlayer({
      puzzle: cubeSize === 2 ? '2x2x2' : '3x3x3',
      controlPanel: 'none',
      tempoScale: 3,
      background: 'none'
    })

    setPlayer(newPlayer)
    setEngine(newEngine)

    newPlayer.style.width = '320px'
    newPlayer.style.height = '320px'

    containerRef.current.appendChild(newPlayer)

    // Apply current scramble if present
    if (scramble) {
      try {
        newPlayer.experimentalSetupAlg = scramble
        newEngine.reset()
        newEngine.applyMoves(scramble)
      } catch {}
    }

    return () => {
      try {
        if (intervalRef.current != null) {
          window.clearInterval(intervalRef.current)
          intervalRef.current = null
        }
        if (postSolveTimeoutRef.current != null) {
          window.clearTimeout(postSolveTimeoutRef.current)
          postSolveTimeoutRef.current = null
        }
        if (newPlayer) newPlayer.remove()
      } catch {}
    }
  }, [cubeSize])

  React.useEffect(() => {
    if (!player || !engine) return
    if (scramble) {
      player.experimentalSetupAlg = scramble
      engine.reset()
      engine.applyMoves(scramble)
      setIsSolved(false)
      setMoves([])
      if (intervalRef.current != null) {
        window.clearInterval(intervalRef.current)
        intervalRef.current = null
      }
      setIsRunning(false)
      startTimeRef.current = null
    }
  }, [engine, player, scramble, setIsRunning])

  const recreateTwistyPlayer = () => {
    if (!containerRef.current) return
    try {
      if (player) {
        player.remove()
      }
    } catch {}
    const newPlayer = new TwistyPlayer({
      puzzle: cubeSize === 2 ? '2x2x2' : '3x3x3',
      controlPanel: 'none',
      tempoScale: 3,
      background: 'none'
    })
    // Apply current scramble to the new player if available
    if (scramble) {
      try {
        newPlayer.experimentalSetupAlg = scramble
      } catch {}
    }
    newPlayer.style.width = '320px'
    newPlayer.style.height = '320px'
    containerRef.current.appendChild(newPlayer)
    setPlayer(newPlayer)
  }

  // Stop the timer when the cube is solved
  React.useEffect(() => {
    if (isSolved) {
      // Immediately stop the timer
      if (isRunning) {
        stopTimer()
      }
      // Guard against duplicate processing
      if (!processedSolveRef.current) {
        processedSolveRef.current = true
        // Lock keyboard input for 2 seconds to avoid cascaded moves/saves
        const now = Date.now()
        postSolveLockRef.current = now + 2000
        // Compute final time robustly using performance.now() for precision
        const finalTime =
          performanceStartRef.current != null ? performance.now() - performanceStartRef.current : (solvingTime ?? 0)
        try {
          saveSolvePlaceholder({
            timeMs: finalTime,
            scramble: scramble ?? null,
            moves: moves ?? [],
            dnf: false
          })
        } catch (e) {
          console.warn('saveSolvePlaceholder error (ignored):', e)
        }
        // After 2 seconds, generate next scramble and clear lock
        if (postSolveTimeoutRef.current != null) {
          window.clearTimeout(postSolveTimeoutRef.current)
        }
        postSolveTimeoutRef.current = window.setTimeout(() => {
          postSolveTimeoutRef.current = null
          postSolveLockRef.current = 0
          if (selectedCube) {
            setNewScramble(selectedCube)
          }
          try {
            recreateTwistyPlayer()
          } catch (e) {
            console.warn('recreateTwistyPlayer error (ignored):', e)
          }
        }, 2000)
      }
    }
  }, [
    isSolved,
    isRunning,
    stopTimer,
    solvingTime,
    scramble,
    moves,
    selectedCube,
    setNewScramble,
    recreateTwistyPlayer,
    saveSolvePlaceholder
  ])

  React.useEffect(() => {
    if (!player || !engine) return
    const onKeyDown = (e: KeyboardEvent) => {
      if (!player || !engine || engine.isSolved()) return
      // Ignore all input during post-solve lock period
      if (Date.now() < postSolveLockRef.current) return

      // ESC cancels and resets
      if (e.key === 'Escape') {
        stopTimer()
        resetTimer()
        // Generate a brand-new scramble on cancel
        if (selectedCube) {
          try {
            setNewScramble(selectedCube)
          } catch {}
        }
        // Reset engine state (will be overwritten by new scramble effect)
        if (scramble) {
          engine.reset()
          engine.applyMoves(scramble)
        } else {
          engine.reset()
        }
        setIsSolved(false)
        setMoves([])
        // Recreate TwistyPlayer to ensure a full visual reset
        try {
          recreateTwistyPlayer()
        } catch {}
        return
      }

      let didMove = false
      let isRotationMove = false

      if (e.key.toLowerCase() === 'h') {
        player.experimentalAddMove('F')
        engine.rotateF(true)
        didMove = true
      }

      if (e.key.toLowerCase() === 'j') {
        player.experimentalAddMove('U')
        engine.rotateU(true)
        didMove = true
      }

      if (e.key.toLowerCase() === 'k') {
        player.experimentalAddMove("R'")
        engine.rotateR(false)
        didMove = true
      }

      if (e.key.toLowerCase() === 'l') {
        player.experimentalAddMove("D'")
        engine.rotateD(false)
        didMove = true
      }

      if (e.key.toLowerCase() === 'y') {
        player.experimentalAddMove('x')
        engine.rotateX(true)
        didMove = true
        isRotationMove = true
      }

      if (is3x3 && e.key.toLowerCase() === ',') {
        player.experimentalAddMove('Uw')
        engine.rotateUw(true)
        didMove = true
      }

      if (is3x3 && e.key.toLowerCase() === '.') {
        player.experimentalAddMove("M'")
        engine.rotateM(false)
        didMove = true
      }

      if (is3x3 && (e.key.toLowerCase() === '-' || e.key.toLowerCase() === '/')) {
        player.experimentalAddMove("Dw'")
        engine.rotateDw(false)
        didMove = true
      }

      if (is3x3 && e.key.toLowerCase() === 'u') {
        player.experimentalAddMove('Rw')
        engine.rotateRw(true)
        didMove = true
      }

      if (is3x3 && (e.key.toLowerCase() === '5' || e.key.toLowerCase() === '6')) {
        player.experimentalAddMove('M')
        engine.rotateM(true)
        didMove = true
      }

      if (e.key.toLowerCase() === 'i') {
        player.experimentalAddMove('R')
        engine.rotateR(true)
        didMove = true
      }
      if (e.key.toLowerCase() === 'o') {
        player.experimentalAddMove("B'")
        engine.rotateB(false)
        didMove = true
      }
      if (e.key.toLowerCase() === 'p') {
        player.experimentalAddMove('z')
        engine.rotateZ(true)
        didMove = true
        isRotationMove = true
      }
      if (e.key.toLowerCase() === 'n') {
        player.experimentalAddMove("x'")
        engine.rotateX(false)
        didMove = true
        isRotationMove = true
      }
      if (is3x3 && e.key.toLowerCase() === 'm') {
        player.experimentalAddMove("Rw'")
        engine.rotateRw(false)
        didMove = true
      }

      if (e.key.toLowerCase() === 'q') {
        player.experimentalAddMove("z'")
        engine.rotateZ(false)
        didMove = true
        isRotationMove = true
      }

      if (e.key.toLowerCase() === 'w') {
        player.experimentalAddMove('B')
        engine.rotateB(true)
        didMove = true
      }

      if (e.key.toLowerCase() === 'e') {
        player.experimentalAddMove("L'")
        engine.rotateL(false)
        didMove = true
      }
      if (e.key.toLowerCase() === 'r') {
        player.experimentalAddMove("Lw'")
        engine.rotateLw(false)
        didMove = true
      }

      if (e.key.toLowerCase() === 't') {
        player.experimentalAddMove('x')
        engine.rotateX(true)
        didMove = true
        isRotationMove = true
      }

      if (e.key.toLowerCase() === 'ñ' || e.key.toLowerCase() === ';') {
        player.experimentalAddMove('y')
        engine.rotateY(true)
        didMove = true
        isRotationMove = true
      }

      if (e.key.toLowerCase() === 'a') {
        player.experimentalAddMove("y'")
        engine.rotateY(false)
        didMove = true
        isRotationMove = true
      }

      if (e.key.toLowerCase() === 's') {
        player.experimentalAddMove('D')
        engine.rotateD(true)
        didMove = true
      }
      if (e.key.toLowerCase() === 'd') {
        player.experimentalAddMove('L')
        engine.rotateL(true)
        didMove = true
      }

      if (e.key.toLowerCase() === 'f') {
        player.experimentalAddMove("U'")
        engine.rotateU(false)
        didMove = true
      }

      if (e.key.toLowerCase() === 'g') {
        player.experimentalAddMove("F'")
        engine.rotateF(false)
        didMove = true
      }

      if (is3x3 && e.key.toLowerCase() === 'z') {
        player.experimentalAddMove('Dw')
        engine.rotateDw(true)
        didMove = true
      }

      if (is3x3 && e.key.toLowerCase() === 'x') {
        player.experimentalAddMove("M'")
        engine.rotateM(false)
        didMove = true
      }

      if (is3x3 && e.key.toLowerCase() === 'c') {
        player.experimentalAddMove("Uw'")
        engine.rotateUw(false)
        didMove = true
      }

      if (is3x3 && e.key.toLowerCase() === 'v') {
        player.experimentalAddMove('Lw')
        engine.rotateLw(true)
        didMove = true
      }

      if (e.key.toLowerCase() === 'b') {
        player.experimentalAddMove("x'")
        engine.rotateX(false)
        didMove = true
        isRotationMove = true
      }

      if (didMove && !isRotationMove && !isRunning && !isSolved) {
        startTimer()
      }

      if (engine?.isSolved()) {
        console.log('Solved!')
        setIsSolved(true)
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => {
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [
    engine,
    player,
    scramble,
    isRunning,
    isSolved,
    startTimer,
    resetTimer,
    stopTimer,
    recreateTwistyPlayer,
    selectedCube,
    setNewScramble
  ])

  return (
    <div className={'grow flex justify-center items-center flex-col gap-4'}>
      <div ref={containerRef} />
      <div className={'text-3xl'}>{formatTime(solvingTime || 0)}</div>
    </div>
  )
}
