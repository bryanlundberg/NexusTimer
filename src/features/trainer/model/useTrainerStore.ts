import { create } from 'zustand'
import { ALGORITHM_SETS } from '@/shared/const/algorithms-sets'
import { TrainerCaseStats, TrainerStatus } from '@/features/trainer/model/types'

const DEFAULT_SLUG = 'oll'
const DEFAULT_TARGET_SECONDS = 2

const initialPickedIds = (slug: string): Set<string> => {
  const set = ALGORITHM_SETS.find((s) => s.slug === slug)
  return new Set(set?.algorithms.map((a) => a.id) ?? [])
}

interface TrainerState {
  // Method / case selection
  methodSlug: string
  pickedIds: Set<string>
  caseIndex: number

  // Target
  targetSeconds: number

  // Chronometer
  status: TrainerStatus
  startedAt: number | null
  elapsedMs: number

  // Per-case stats (in-memory; persistence comes later)
  caseStats: Record<string, TrainerCaseStats>

  // Selectors / setters
  setMethod: (slug: string) => void
  setPickedIds: (ids: Set<string>) => void
  setCaseIndex: (index: number) => void
  nextCase: (totalSessionCases: number) => void
  prevCase: (totalSessionCases: number) => void

  setTargetSeconds: (seconds: number) => void

  // Chronometer actions
  startTimer: () => void
  stopTimer: () => number | null
  resetTimer: () => void
  tick: () => void

  // Stats
  recordSolve: (caseId: string, timeMs: number) => void
  toggleLearned: (caseId: string) => void

  reset: () => void
}

const initialChronometerState = {
  status: TrainerStatus.IDLE,
  startedAt: null as number | null,
  elapsedMs: 0
}

export const useTrainerStore = create<TrainerState>((set, get) => ({
  methodSlug: DEFAULT_SLUG,
  pickedIds: initialPickedIds(DEFAULT_SLUG),
  caseIndex: 0,
  targetSeconds: DEFAULT_TARGET_SECONDS,
  caseStats: {},
  ...initialChronometerState,

  setMethod: (slug) => {
    set({
      methodSlug: slug,
      pickedIds: initialPickedIds(slug),
      caseIndex: 0,
      ...initialChronometerState
    })
  },

  setPickedIds: (ids) => {
    set({
      pickedIds: new Set(ids),
      caseIndex: 0,
      ...initialChronometerState
    })
  },

  setCaseIndex: (index) => set({ caseIndex: Math.max(0, index), ...initialChronometerState }),

  nextCase: (totalSessionCases) => {
    if (totalSessionCases <= 0) return
    set((state) => ({
      caseIndex: (state.caseIndex + 1) % totalSessionCases,
      ...initialChronometerState
    }))
  },

  prevCase: (totalSessionCases) => {
    if (totalSessionCases <= 0) return
    set((state) => ({
      caseIndex: (state.caseIndex - 1 + totalSessionCases) % totalSessionCases,
      ...initialChronometerState
    }))
  },

  setTargetSeconds: (seconds) => set({ targetSeconds: seconds }),

  startTimer: () => {
    set({ status: TrainerStatus.SOLVING, startedAt: performance.now(), elapsedMs: 0 })
  },

  stopTimer: () => {
    const { startedAt } = get()
    if (startedAt === null) return null
    const elapsed = performance.now() - startedAt
    set({ status: TrainerStatus.IDLE, startedAt: null, elapsedMs: elapsed })
    return elapsed
  },

  resetTimer: () => set({ ...initialChronometerState }),

  tick: () => {
    const { startedAt, status } = get()
    if (status !== TrainerStatus.SOLVING || startedAt === null) return
    set({ elapsedMs: performance.now() - startedAt })
  },

  recordSolve: (caseId, timeMs) => {
    set((state) => {
      const prev = state.caseStats[caseId]
      const totalSolves = (prev?.totalSolves ?? 0) + 1
      const best = prev?.best == null ? timeMs : Math.min(prev.best, timeMs)
      const next: TrainerCaseStats = {
        caseId,
        totalSolves,
        best,
        last: timeMs,
        ao5: prev?.ao5 ?? null,
        ao12: prev?.ao12 ?? null,
        learned: prev?.learned ?? false
      }
      return { caseStats: { ...state.caseStats, [caseId]: next } }
    })
  },

  toggleLearned: (caseId) => {
    set((state) => {
      const prev = state.caseStats[caseId]
      const next: TrainerCaseStats = {
        caseId,
        totalSolves: prev?.totalSolves ?? 0,
        best: prev?.best ?? null,
        last: prev?.last ?? null,
        ao5: prev?.ao5 ?? null,
        ao12: prev?.ao12 ?? null,
        learned: !(prev?.learned ?? false)
      }
      return { caseStats: { ...state.caseStats, [caseId]: next } }
    })
  },

  reset: () => {
    set({
      methodSlug: DEFAULT_SLUG,
      pickedIds: initialPickedIds(DEFAULT_SLUG),
      caseIndex: 0,
      targetSeconds: DEFAULT_TARGET_SECONDS,
      caseStats: {},
      ...initialChronometerState
    })
  }
}))
