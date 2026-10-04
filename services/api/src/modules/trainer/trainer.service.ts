import {
  type LearnedSummary,
  TRAINER_PAGE_SIZE,
  TRAINER_RECENT_TIMES_WINDOW,
  type TrainerCaseStatsDoc,
  type TrainerLearnedInput,
  type TrainerMethodStatsDoc,
  type TrainerSolveInput,
  type TrainerSolveItem,
  type TrainerSolvesQuery,
  type TrainerTargetInput
} from '@nexustimer/contracts'
import type { LearnedCache, SolvesCache } from './trainer.cache'
import type { TrainerRepository } from './trainer.repository'

export type TrainerService = {
  learned(userId: string, methodSlug: string): Promise<string[]>
  learnedSummary(userId: string): Promise<LearnedSummary>
  setLearned(userId: string, input: TrainerLearnedInput): Promise<void>
  solves(userId: string, query: TrainerSolvesQuery): Promise<TrainerSolveItem[]>
  recordSolve(userId: string, input: TrainerSolveInput): Promise<TrainerSolveItem>
  deleteSolve(userId: string, solveId: string): Promise<boolean>
  stats(userId: string): Promise<Record<string, TrainerMethodStatsDoc>>
  setTarget(userId: string, input: TrainerTargetInput): Promise<void>
}

type TrainerDeps = {
  repository: TrainerRepository
  learnedCache: LearnedCache
  solvesCache: SolvesCache
}

export function caseStatsFrom(solves: { timeMs: number; createdAtMs: number }[]): TrainerCaseStatsDoc | null {
  const last = solves[solves.length - 1]
  if (!last) return null

  const times = solves.map((solve) => solve.timeMs)
  return {
    totalSolves: solves.length,
    totalTimeMs: times.reduce((sum, time) => sum + time, 0),
    bestSingleMs: Math.min(...times),
    lastSolveMs: last.timeMs,
    lastSolveAt: last.createdAtMs,
    recentTimes: times.slice(-TRAINER_RECENT_TIMES_WINDOW)
  }
}

export function createTrainerService({ repository, learnedCache, solvesCache }: TrainerDeps): TrainerService {
  async function recompute(userId: string, methodSlug: string, caseId: string) {
    const caseSolves = await repository.caseSolvesOldestFirst(userId, methodSlug, caseId)
    await repository.setCaseStats(userId, methodSlug, caseId, caseStatsFrom(caseSolves))
    await repository.setMethodTotals(userId, methodSlug, await repository.methodTotals(userId, methodSlug))
  }

  return {
    async learned(userId, methodSlug) {
      const cached = await learnedCache.get(userId, methodSlug)
      if (cached) return cached

      const caseIds = await repository.learnedCaseIds(userId, methodSlug)
      await learnedCache.prime(userId, methodSlug, caseIds)
      return caseIds
    },

    async learnedSummary(userId) {
      const cached = await learnedCache.getSummary(userId)
      if (cached) return cached

      const methods = await repository.learnedByMethod(userId)
      const summary = { total: methods.reduce((sum, method) => sum + method.count, 0), methods }
      await learnedCache.primeSummary(userId, summary)
      return summary
    },

    async setLearned(userId, { methodSlug, caseId, learned }) {
      if (learned) await repository.markLearned(userId, methodSlug, caseId)
      else await repository.unmarkLearned(userId, methodSlug, caseId)

      await Promise.all([
        learnedCache.setLearned(userId, methodSlug, caseId, learned),
        learnedCache.invalidateSummary(userId)
      ])
    },

    async solves(userId, { methodSlug, caseId, limit, before }) {
      const isFirstPage = !caseId && !before
      if (!isFirstPage) return repository.listSolves({ userId, methodSlug, caseId, before }, limit)

      const cached = await solvesCache.getFirstPage(userId, methodSlug, limit)
      if (cached) return cached

      const solves = await repository.listSolves({ userId, methodSlug }, Math.max(limit, TRAINER_PAGE_SIZE))
      await solvesCache.prime(userId, methodSlug, solves, solves.length < TRAINER_PAGE_SIZE)
      return solves.slice(0, limit)
    },

    async recordSolve(userId, { methodSlug, caseId, timeMs }) {
      const { createdAtMs, ...solve } = await repository.createSolve({ userId, methodSlug, caseId, timeMs })
      await repository.recordSolveStats(userId, { methodSlug, caseId, timeMs, atMs: createdAtMs })
      await solvesCache.push(userId, methodSlug, solve)
      return solve
    },

    async deleteSolve(userId, solveId) {
      const deleted = await repository.deleteSolve(userId, solveId)
      if (!deleted) return false

      await recompute(userId, deleted.methodSlug, deleted.caseId)
      await solvesCache.invalidate(userId, deleted.methodSlug)
      return true
    },

    stats(userId) {
      return repository.findStats(userId)
    },

    async setTarget(userId, { method, targetSeconds }) {
      await repository.setTarget(userId, method, targetSeconds)
    }
  }
}
