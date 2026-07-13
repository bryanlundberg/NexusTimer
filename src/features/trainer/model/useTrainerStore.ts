import { create } from 'zustand'
import { ALGORITHM_SETS } from '@/shared/const/algorithms-sets'
import { TrainerCaseStats, TrainerRotationMode } from '@/features/trainer/model/types'
import type { TrainerMethodStatsDoc } from '@/entities/trainer-stats/model/types'
import {
  TRAINER_DEFAULT_SLUG,
  TRAINER_DEFAULT_TARGET_SECONDS,
  TRAINER_DEFAULT_ROTATION_MODE,
  TRAINER_RECENT_WINDOW
} from '@/features/trainer/lib/constants'
import { averageOfLastN, shuffledRange } from '@/features/trainer/lib/trainerUtils'

const initialPickedIds = (slug: string): Set<string> => {
  const set = ALGORITHM_SETS.find((s) => s.slug === slug)
  return new Set(set?.algorithms.map((a) => a.id) ?? [])
}

const initialCaseIndex = (pickedSize: number, mode: TrainerRotationMode): number =>
  mode !== 'sequential' && pickedSize > 1 ? Math.floor(Math.random() * pickedSize) : 0

interface TrainerLastSolve {
  caseId: string
  timeMs: number
  prevStats: TrainerCaseStats | null
  prevCaseIndex: number
  persistedId?: string
}

interface TrainerState {
  methodSlug: string
  pickedIds: Set<string>
  caseIndex: number

  rotationMode: TrainerRotationMode
  shuffleQueue: number[]

  targetByMethod: Record<string, number>
  caseStats: Record<string, TrainerCaseStats>
  lastSolve: TrainerLastSolve | null

  setMethod: (slug: string) => void
  setPickedIds: (ids: Set<string>) => void
  setCaseIndex: (index: number) => void
  setRotationMode: (mode: TrainerRotationMode) => void
  advanceCase: (totalSessionCases: number) => void
  prevCase: (totalSessionCases: number) => void

  setTargetSeconds: (seconds: number) => void
  getTargetSeconds: () => number

  recordSolve: (caseId: string, timeMs: number) => void
  attachLastSolveId: (persistedId: string) => void
  undoLastSolve: () => TrainerLastSolve | null
  hydrateMethodStats: (methodSlug: string, methodStats: Partial<TrainerMethodStatsDoc> | null | undefined) => void

  reset: () => void
}

export const useTrainerStore = create<TrainerState>((set, get) => ({
  methodSlug: TRAINER_DEFAULT_SLUG,
  pickedIds: initialPickedIds(TRAINER_DEFAULT_SLUG),
  caseIndex: 0,
  rotationMode: TRAINER_DEFAULT_ROTATION_MODE,
  shuffleQueue: [],
  targetByMethod: {},
  caseStats: {},
  lastSolve: null,

  setMethod: (slug) => {
    const picked = initialPickedIds(slug)
    set({
      methodSlug: slug,
      pickedIds: picked,
      caseIndex: initialCaseIndex(picked.size, get().rotationMode),
      shuffleQueue: [],
      lastSolve: null
    })
  },

  setPickedIds: (ids) => {
    const picked = new Set(ids)
    set({
      pickedIds: picked,
      caseIndex: initialCaseIndex(picked.size, get().rotationMode),
      shuffleQueue: [],
      lastSolve: null
    })
  },

  setCaseIndex: (index) => set({ caseIndex: Math.max(0, index) }),

  setRotationMode: (mode) => set({ rotationMode: mode, shuffleQueue: [], lastSolve: null }),

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

    // shuffle: walk through a permutation, reshuffle when exhausted.
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
    return targetByMethod[methodSlug] ?? TRAINER_DEFAULT_TARGET_SECONDS
  },

  recordSolve: (caseId, timeMs) => {
    set((state) => {
      const prev = state.caseStats[caseId]
      const totalSolves = (prev?.totalSolves ?? 0) + 1
      const best = prev?.best == null ? timeMs : Math.min(prev.best, timeMs)
      const recentTimes = [...(prev?.recentTimes ?? []), timeMs].slice(-TRAINER_RECENT_WINDOW)
      const next: TrainerCaseStats = {
        caseId,
        totalSolves,
        best,
        last: timeMs,
        ao5: averageOfLastN(recentTimes, 5),
        ao12: averageOfLastN(recentTimes, 12),
        recentTimes
      }
      return {
        caseStats: { ...state.caseStats, [caseId]: next },
        lastSolve: {
          caseId,
          timeMs,
          prevStats: prev ?? null,
          prevCaseIndex: state.caseIndex
        }
      }
    })
  },

  attachLastSolveId: (persistedId) => {
    set((state) => {
      if (!state.lastSolve) return state
      return { lastSolve: { ...state.lastSolve, persistedId } }
    })
  },

  undoLastSolve: () => {
    const { lastSolve } = get()
    if (!lastSolve) return null
    set((state) => {
      const nextStats = { ...state.caseStats }
      if (lastSolve.prevStats) {
        nextStats[lastSolve.caseId] = lastSolve.prevStats
      } else {
        delete nextStats[lastSolve.caseId]
      }
      return {
        caseStats: nextStats,
        caseIndex: lastSolve.prevCaseIndex,
        lastSolve: null
      }
    })
    return lastSolve
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
          ao5: averageOfLastN(recentTimes, 5),
          ao12: averageOfLastN(recentTimes, 12),
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
      methodSlug: TRAINER_DEFAULT_SLUG,
      pickedIds: initialPickedIds(TRAINER_DEFAULT_SLUG),
      caseIndex: 0,
      rotationMode: TRAINER_DEFAULT_ROTATION_MODE,
      shuffleQueue: [],
      targetByMethod: {},
      caseStats: {},
      lastSolve: null
    })
  }
}))
