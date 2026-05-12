import { create } from 'zustand'
import { ALGORITHM_SETS } from '@/shared/const/algorithms-sets'
import { TrainerCaseStats, TrainerRotationMode } from '@/features/trainer/model/types'
import type { TrainerMethodStatsDoc } from '@/entities/trainer-stats/model/types'

const DEFAULT_SLUG = 'oll'
export const DEFAULT_TARGET_SECONDS = 2
const DEFAULT_ROTATION_MODE: TrainerRotationMode = 'shuffle'

const initialPickedIds = (slug: string): Set<string> => {
  const set = ALGORITHM_SETS.find((s) => s.slug === slug)
  return new Set(set?.algorithms.map((a) => a.id) ?? [])
}

interface TrainerState {
  // Method / case selection
  methodSlug: string
  pickedIds: Set<string>
  caseIndex: number

  // Rotation
  rotationMode: TrainerRotationMode
  shuffleQueue: number[]

  // Target — per method slug
  targetByMethod: Record<string, number>

  // Per-case stats (in-memory; persistence comes later)
  caseStats: Record<string, TrainerCaseStats>

  // Selectors / setters
  setMethod: (slug: string) => void
  setPickedIds: (ids: Set<string>) => void
  setCaseIndex: (index: number) => void
  setRotationMode: (mode: TrainerRotationMode) => void
  advanceCase: (totalSessionCases: number) => void
  prevCase: (totalSessionCases: number) => void

  setTargetSeconds: (seconds: number) => void
  getTargetSeconds: () => number

  // Stats
  recordSolve: (caseId: string, timeMs: number) => void
  hydrateMethodStats: (methodSlug: string, methodStats: Partial<TrainerMethodStatsDoc> | null | undefined) => void

  reset: () => void
}

const RECENT_WINDOW = 12

const wcaAverage = (times: number[], n: number): number | null => {
  if (times.length < n) return null
  const window = times.slice(-n)
  const sorted = [...window].sort((a, b) => a - b)
  const trimmed = sorted.slice(1, -1)
  if (trimmed.length === 0) return null
  const sum = trimmed.reduce((acc, v) => acc + v, 0)
  return sum / trimmed.length
}

const shuffledRange = (total: number, exclude: number | null = null): number[] => {
  const arr = Array.from({ length: total }, (_, i) => i)
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  // Avoid starting on the case the user just solved.
  if (exclude !== null && arr.length > 1 && arr[0] === exclude) {
    ;[arr[0], arr[1]] = [arr[1], arr[0]]
  }
  return arr
}

export const useTrainerStore = create<TrainerState>((set, get) => ({
  methodSlug: DEFAULT_SLUG,
  pickedIds: initialPickedIds(DEFAULT_SLUG),
  caseIndex: 0,
  rotationMode: DEFAULT_ROTATION_MODE,
  shuffleQueue: [],
  targetByMethod: {},
  caseStats: {},

  setMethod: (slug) => {
    set({
      methodSlug: slug,
      pickedIds: initialPickedIds(slug),
      caseIndex: 0,
      shuffleQueue: []
    })
  },

  setPickedIds: (ids) => {
    set({
      pickedIds: new Set(ids),
      caseIndex: 0,
      shuffleQueue: []
    })
  },

  setCaseIndex: (index) => set({ caseIndex: Math.max(0, index) }),

  setRotationMode: (mode) => set({ rotationMode: mode, shuffleQueue: [] }),

  advanceCase: (totalSessionCases) => {
    if (totalSessionCases <= 0) return
    const { rotationMode, caseIndex, shuffleQueue } = get()

    if (totalSessionCases === 1) {
      set({ caseIndex: 0 })
      return
    }

    if (rotationMode === 'sequential') {
      set({ caseIndex: (caseIndex + 1) % totalSessionCases })
      return
    }

    if (rotationMode === 'random') {
      let next = Math.floor(Math.random() * totalSessionCases)
      if (next === caseIndex) next = (next + 1) % totalSessionCases
      set({ caseIndex: next })
      return
    }

    // shuffle: walk through a permutation, reshuffle when empty.
    let queue = shuffleQueue.filter((i) => i < totalSessionCases)
    if (queue.length === 0) {
      queue = shuffledRange(totalSessionCases, caseIndex)
    }
    const next = queue[0]
    set({ caseIndex: next, shuffleQueue: queue.slice(1) })
  },

  prevCase: (totalSessionCases) => {
    if (totalSessionCases <= 0) return
    set((state) => ({
      caseIndex: (state.caseIndex - 1 + totalSessionCases) % totalSessionCases
    }))
  },

  setTargetSeconds: (seconds) => {
    const { methodSlug } = get()
    set((state) => ({ targetByMethod: { ...state.targetByMethod, [methodSlug]: seconds } }))
  },

  getTargetSeconds: () => {
    const { methodSlug, targetByMethod } = get()
    return targetByMethod[methodSlug] ?? DEFAULT_TARGET_SECONDS
  },

  recordSolve: (caseId, timeMs) => {
    set((state) => {
      const prev = state.caseStats[caseId]
      const totalSolves = (prev?.totalSolves ?? 0) + 1
      const best = prev?.best == null ? timeMs : Math.min(prev.best, timeMs)
      const recentTimes = [...(prev?.recentTimes ?? []), timeMs].slice(-RECENT_WINDOW)
      const next: TrainerCaseStats = {
        caseId,
        totalSolves,
        best,
        last: timeMs,
        ao5: wcaAverage(recentTimes, 5),
        ao12: wcaAverage(recentTimes, 12),
        recentTimes
      }
      return { caseStats: { ...state.caseStats, [caseId]: next } }
    })
  },

  hydrateMethodStats: (methodSlug, methodStats) => {
    const set_ = ALGORITHM_SETS.find((s) => s.slug === methodSlug)
    if (!set_) return
    set((state) => {
      const next = { ...state.caseStats }
      const cases = methodStats?.cases ?? {}
      for (const alg of set_.algorithms) {
        const sc = cases[alg.id]
        if (!sc) {
          delete next[alg.id]
          continue
        }
        const recentTimes = sc.recentTimes ?? []
        next[alg.id] = {
          caseId: alg.id,
          totalSolves: sc.totalSolves ?? 0,
          best: sc.bestSingleMs ?? null,
          last: sc.lastSolveMs ?? null,
          ao5: wcaAverage(recentTimes, 5),
          ao12: wcaAverage(recentTimes, 12),
          recentTimes
        }
      }
      const nextTargetByMethod = { ...state.targetByMethod }
      if (methodStats?.targetSeconds != null) {
        nextTargetByMethod[methodSlug] = methodStats.targetSeconds
      }
      return { caseStats: next, targetByMethod: nextTargetByMethod }
    })
  },

  reset: () => {
    set({
      methodSlug: DEFAULT_SLUG,
      pickedIds: initialPickedIds(DEFAULT_SLUG),
      caseIndex: 0,
      rotationMode: DEFAULT_ROTATION_MODE,
      shuffleQueue: [],
      targetByMethod: {},
      caseStats: {}
    })
  }
}))
