import { create } from 'zustand'
import { CubeEngine, simplifyMoves, type TimedMove } from 'cube-state-engine'
import { TimerMode } from '@/features/timer/model/enums'
import { useTimerStore } from '@/shared/model/timer/useTimerStore'
import { useSettingsStore } from '@/shared/model/settings/useSettingsStore'
import { useScrambleGuideStore } from '@/shared/model/timer/useScrambleGuideStore'
import { saveVirtualSolve } from '@/features/timer/lib/saveVirtualSolve'
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

export type SmartPhase = 'scrambling' | 'armed' | 'inspecting' | 'solving'

export interface SmartSolveStats {
  moveCount: number
  tps: number
}

export interface SmartSessionListeners {
  onMove?: (move: string) => void
  onResync?: () => void
}

const CUBE_SIZE = 3
const ROTATION_RE = /^[xyz]['2]?$/
const DEFAULT_INSPECTION_MS = 15000
// Past this the log is collapsed to an equivalent shorter sequence, so a cube
// played with outside the timer never makes seeding a player expensive.
const MAX_TRACKED_MOVES = 512

// The engine mirrors the physical cube from connect to disconnect. It lives
// outside React so a turn is tracked whatever page is mounted.

const engine = new CubeEngine('', { size: CUBE_SIZE })
// Every move since the cube was last known solved. Replayed to rebuild the
// guide on a scramble change, and to seed a freshly mounted 3D player.
let trackedMoves: string[] = []

let scrambleTokens: ScrambleMove[] = []
// Absolute cube state after each scramble prefix, used to reconcile the guide
// with the real cube: reaching any valid prefix clears accumulated corrections.
let prefixStates: string[] = []
let targetState: string | null = null
let primedScramble: string | null = null
let guideState: GuideState = initGuideState()

let solveMoves: TimedMove[] = []
let solveMovesStart: number | null = null

let solveStartedAt: number | null = null
let clockRaf: number | null = null
let inspectionIntervalId: number | null = null
let inspectionStartedAt: number | null = null

let running = false
let suspended = false
let active = false
let unsubscribeTimerStore: (() => void) | null = null
const listeners = new Set<SmartSessionListeners>()

interface SmartSessionState {
  phase: SmartPhase
  guide: ScrambleGuide | null
  solvingTime: number
  inspectionTime: number | null
  lastSolveTime: number | null
  solveStats: SmartSolveStats | null

  trackMove: (move: string) => void
  start: () => void
  shutdown: () => void
  resync: () => void
  // Held by the trainer while it drives the cube itself.
  setSuspended: (value: boolean) => void
  addListener: (value: SmartSessionListeners) => () => void
  getTrackedMoves: () => string[]
}

const initialState = {
  phase: 'scrambling' as SmartPhase,
  guide: null as ScrambleGuide | null,
  solvingTime: 0,
  inspectionTime: null as number | null,
  lastSolveTime: null as number | null,
  solveStats: null as SmartSolveStats | null
}

// Every write is guarded: the timer store also drives this session, so an
// unconditional write would feed straight back into our own listener.
const syncBridges = () => {
  const { phase, guide } = useSmartSessionStore.getState()
  const ready = phase === 'armed' || phase === 'inspecting'
  const guideStore = useScrambleGuideStore.getState()
  if (guideStore.guide !== guide) guideStore.setGuide(guide)
  if (guideStore.ready !== ready) guideStore.setReady(ready)
  const timerStore = useTimerStore.getState()
  if (timerStore.isSolving !== (phase === 'solving')) timerStore.setIsSolving(phase === 'solving')
}

const publish = (patch: Partial<SmartSessionState>) => {
  useSmartSessionStore.setState(patch)
  syncBridges()
}

const notifyMove = (move: string) => {
  for (const listener of listeners) {
    try {
      listener.onMove?.(move)
    } catch {}
  }
}

const notifyResync = () => {
  for (const listener of listeners) {
    try {
      listener.onResync?.()
    } catch {}
  }
}

const startClock = () => {
  if (clockRaf != null) cancelAnimationFrame(clockRaf)
  solveStartedAt = performance.now()
  useSmartSessionStore.setState({ solvingTime: 0 })
  const tick = () => {
    if (solveStartedAt == null) return
    useSmartSessionStore.setState({ solvingTime: performance.now() - solveStartedAt })
    clockRaf = requestAnimationFrame(tick)
  }
  clockRaf = requestAnimationFrame(tick)
}

const stopClock = (): number => {
  if (clockRaf != null) {
    cancelAnimationFrame(clockRaf)
    clockRaf = null
  }
  if (solveStartedAt == null) return 0
  const finalTime = performance.now() - solveStartedAt
  solveStartedAt = null
  useSmartSessionStore.setState({ solvingTime: finalTime })
  return finalTime
}

const stopInspection = () => {
  if (inspectionIntervalId != null) {
    window.clearInterval(inspectionIntervalId)
    inspectionIntervalId = null
  }
  inspectionStartedAt = null
  useSmartSessionStore.setState({ inspectionTime: null })
}

const startInspection = (durationMs: number) => {
  stopInspection()
  inspectionStartedAt = Date.now()
  useSmartSessionStore.setState({ inspectionTime: durationMs / 1000 })
  inspectionIntervalId = window.setInterval(() => {
    if (inspectionStartedAt == null) return
    const remaining = durationMs - (Date.now() - inspectionStartedAt)
    if (remaining <= 0) {
      finalize(true)
      return
    }
    useSmartSessionStore.setState({ inspectionTime: remaining / 1000 })
  }, 100)
}

const inspectionConfig = () => {
  const timer = useSettingsStore.getState().settings.timer
  return { enabled: timer.inspection, durationMs: timer.inspectionTime || DEFAULT_INSPECTION_MS }
}

const resetSolveMoves = () => {
  solveMoves = []
  solveMovesStart = null
}

const recordSolveMove = (move: string, atZero: boolean) => {
  const now = performance.now()
  if (solveMovesStart == null) solveMovesStart = now
  solveMoves.push({ m: move, t: atZero ? 0 : Math.round(now - solveMovesStart) })
}

const engineStateJson = (): string | null => {
  try {
    return JSON.stringify(engine.state())
  } catch {
    return null
  }
}

const isAtTarget = () => scrambleTokens.length > 0 && targetState != null && engineStateJson() === targetState

// Replays the whole tracked log against the current scramble, so turns made
// anywhere - another route, between solves, another timer mode - show up as
// guidance the moment the scramble is primed.
const rebuildGuideState = (): GuideState => {
  let state = initGuideState()
  for (const move of trackedMoves) {
    if (ROTATION_RE.test(move)) continue
    const parsed = parseMove(move)
    if (parsed) state = stepGuide(scrambleTokens, state, parsed)
  }
  return state
}

const reconcileWithEngine = () => {
  const stateJson = engineStateJson()
  if (stateJson == null) return
  const prefixIndex = prefixStates.lastIndexOf(stateJson)
  if (prefixIndex < 0) return
  if (guideState.index === prefixIndex && guideState.acc === 0 && guideState.errors.length === 0) return
  guideState = { index: prefixIndex, acc: 0, errors: [] }
}

const arm = () => {
  const { enabled, durationMs } = inspectionConfig()
  publish({ phase: enabled ? 'inspecting' : 'armed', guide: null })
  if (enabled) startInspection(durationMs)
}

const primeScramble = (scramble: string | null) => {
  primedScramble = scramble
  scrambleTokens = scramble ? tokenizeScramble(scramble) : []

  try {
    const probe = new CubeEngine('', { size: CUBE_SIZE })
    const states = [JSON.stringify(probe.state())]
    for (const token of scrambleTokens) {
      probe.applyMoves(formatMove(token), { record: false })
      states.push(JSON.stringify(probe.state()))
    }
    prefixStates = states
    targetState = states[states.length - 1] ?? null
  } catch {
    prefixStates = []
    targetState = null
  }

  stopInspection()
  stopClock()
  resetSolveMoves()

  guideState = rebuildGuideState()
  reconcileWithEngine()

  if (isAtTarget()) {
    arm()
    return
  }
  publish({ phase: 'scrambling', guide: guideFromState(scrambleTokens, guideState) })
}

const advanceScramble = () => {
  const { selectedCube, setNewScramble } = useTimerStore.getState()
  if (selectedCube) setNewScramble(selectedCube)
}

const finalize = (dnf = false) => {
  stopInspection()
  const finalTime = stopClock()
  const moves = solveMoves.slice()
  resetSolveMoves()
  const scramble = primedScramble

  if (dnf) {
    publish({ lastSolveTime: null, solveStats: null })
  } else {
    let stats: SmartSolveStats | null = null
    try {
      const moveCount = simplifyMoves(moves.map((move) => move.m)).length
      if (moveCount > 0) stats = { moveCount, tps: finalTime > 0 ? moveCount / (finalTime / 1000) : 0 }
    } catch {
      stats = null
    }
    publish({ lastSolveTime: finalTime, solveStats: stats })

    saveVirtualSolve({
      timeMs: finalTime,
      scramble,
      dnf: false,
      replayMoves: moves,
      smart: true,
      solution: moves.map((move) => move.m).join(' ')
    }).catch((e) => console.warn('saveVirtualSolve error (ignored):', e))

    // The cube is physically solved, so a fresh tracking epoch starts here. A
    // DNF leaves the log alone: the cube is still scrambled, and replaying that
    // log against the next scramble is what produces the corrections to undo it.
    engine.reset()
    trackedMoves = []
    notifyResync()
  }

  // Everything below runs inside the same Bluetooth event that finished the
  // solve, so the next scramble is primed before the next turn can arrive.
  // There is no cooldown and no window where a turn could be dropped.
  publish({ phase: 'scrambling', guide: null })
  advanceScramble()
  primeScramble(useTimerStore.getState().scramble)
}

const trackMove = (raw: string) => {
  const move = raw.trim()
  if (!move) return

  // Mirror the physical cube first and unconditionally: nothing below this line
  // is allowed to drop a turn.
  try {
    engine.applyMoves(move, { record: false })
  } catch {
    return
  }
  trackedMoves.push(move)
  if (trackedMoves.length > MAX_TRACKED_MOVES) {
    try {
      trackedMoves = simplifyMoves(trackedMoves)
    } catch {
      trackedMoves = trackedMoves.slice(-MAX_TRACKED_MOVES)
    }
  }
  notifyMove(move)

  if (!active) return

  const isRotation = ROTATION_RE.test(move)
  const phase = useSmartSessionStore.getState().phase

  if (phase === 'scrambling') {
    if (isRotation) {
      if (isAtTarget()) arm()
      return
    }
    const parsed = parseMove(move)
    if (parsed) guideState = stepGuide(scrambleTokens, guideState, parsed)
    if (isAtTarget()) {
      arm()
      return
    }
    reconcileWithEngine()
    publish({ guide: guideFromState(scrambleTokens, guideState) })
    return
  }

  const ready = phase === 'armed' || phase === 'inspecting'
  recordSolveMove(move, ready && isRotation)

  if (ready && !isRotation) {
    stopInspection()
    publish({ phase: 'solving', solveStats: null })
    startClock()
  }

  // Only checked once actually solving, so a cube already solved while armed
  // cannot finalize with a ~0 time.
  if (useSmartSessionStore.getState().phase !== 'solving') return
  try {
    if (engine.isSolved()) finalize()
  } catch {}
}

// The session only arms, times and saves while the smart-cube mode is selected
// and nothing else has claimed the cube. Tracking runs either way, so an idle
// session still knows the real cube state and rebuilds the guide from it.
const syncActivity = () => {
  const { scramble, selectedCube, timerMode } = useTimerStore.getState()
  const next = running && !suspended && timerMode === TimerMode.SMART_CUBE

  if (!next) {
    if (!active) return
    active = false
    stopClock()
    stopInspection()
    resetSolveMoves()
    publish({ phase: 'scrambling', guide: null })
    useScrambleGuideStore.getState().reset()
    return
  }

  if (!scramble && selectedCube) {
    advanceScramble()
    return
  }

  if (!active) {
    active = true
    primeScramble(scramble)
    return
  }
  if (scramble !== primedScramble) primeScramble(scramble)
}

export const useSmartSessionStore = create<SmartSessionState>(() => ({
  ...initialState,

  trackMove,

  start: () => {
    if (running) return
    running = true
    engine.reset()
    trackedMoves = []
    resetSolveMoves()
    stopClock()
    stopInspection()
    useSmartSessionStore.setState({ ...initialState })
    unsubscribeTimerStore = useTimerStore.subscribe(syncActivity)
    syncActivity()
    notifyResync()
  },

  shutdown: () => {
    running = false
    active = false
    unsubscribeTimerStore?.()
    unsubscribeTimerStore = null
    stopClock()
    stopInspection()
    resetSolveMoves()
    engine.reset()
    trackedMoves = []
    guideState = initGuideState()
    scrambleTokens = []
    prefixStates = []
    targetState = null
    primedScramble = null
    useSmartSessionStore.setState({ ...initialState })
    useScrambleGuideStore.getState().reset()
    syncBridges()
    notifyResync()
  },

  resync: () => {
    stopClock()
    stopInspection()
    resetSolveMoves()
    engine.reset()
    trackedMoves = []
    useSmartSessionStore.setState({ solveStats: null, solvingTime: 0 })
    primeScramble(useTimerStore.getState().scramble)
    notifyResync()
  },

  setSuspended: (value: boolean) => {
    if (suspended === value) return
    suspended = value
    syncActivity()
  },

  addListener: (value: SmartSessionListeners) => {
    listeners.add(value)
    return () => {
      listeners.delete(value)
    }
  },

  getTrackedMoves: () => trackedMoves.slice()
}))
