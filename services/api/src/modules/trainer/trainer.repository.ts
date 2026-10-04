import {
  type LearnedMethodSummary,
  TRAINER_RECENT_TIMES_WINDOW,
  type TrainerCaseStatsDoc,
  type TrainerMethodStatsDoc,
  type TrainerSolveItem
} from '@nexustimer/contracts'
import { Types } from 'mongoose'
import { TrainerLearnedModel, TrainerSolveModel, TrainerStatsModel } from './trainer.model'

export type SolveListFilter = { userId: string; methodSlug: string; caseId?: string; before?: string }
export type StoredTrainerSolve = TrainerSolveItem & { createdAtMs: number }
export type MethodTotals = { totalSolves: number; totalTimeMs: number; bestSingleMs: number | null }

export type TrainerRepository = {
  learnedCaseIds(userId: string, methodSlug: string): Promise<string[]>
  learnedByMethod(userId: string): Promise<LearnedMethodSummary[]>
  markLearned(userId: string, methodSlug: string, caseId: string): Promise<void>
  unmarkLearned(userId: string, methodSlug: string, caseId: string): Promise<void>
  listSolves(filter: SolveListFilter, limit: number): Promise<TrainerSolveItem[]>
  createSolve(input: {
    userId: string
    methodSlug: string
    caseId: string
    timeMs: number
  }): Promise<StoredTrainerSolve>
  deleteSolve(userId: string, solveId: string): Promise<{ methodSlug: string; caseId: string } | null>
  caseSolvesOldestFirst(
    userId: string,
    methodSlug: string,
    caseId: string
  ): Promise<{ timeMs: number; createdAtMs: number }[]>
  methodTotals(userId: string, methodSlug: string): Promise<MethodTotals>
  recordSolveStats(
    userId: string,
    solve: { methodSlug: string; caseId: string; timeMs: number; atMs: number }
  ): Promise<void>
  setCaseStats(userId: string, methodSlug: string, caseId: string, stats: TrainerCaseStatsDoc | null): Promise<void>
  setMethodTotals(userId: string, methodSlug: string, totals: MethodTotals): Promise<void>
  findStats(userId: string): Promise<Record<string, TrainerMethodStatsDoc>>
  setTarget(userId: string, methodSlug: string, targetSeconds: number): Promise<void>
}

type RawSolve = {
  _id: Types.ObjectId
  user: Types.ObjectId
  methodSlug: string
  caseId: string
  timeMs: number
  createdAt: Date
  updatedAt: Date
}

function toSolveItem(doc: RawSolve): TrainerSolveItem {
  return {
    _id: String(doc._id),
    user: String(doc.user),
    methodSlug: doc.methodSlug,
    caseId: doc.caseId,
    timeMs: doc.timeMs,
    createdAt: doc.createdAt.toISOString(),
    updatedAt: doc.updatedAt.toISOString()
  }
}

const NEWEST_FIRST = { _id: -1 } as const

export const trainerRepository: TrainerRepository = {
  async learnedCaseIds(userId, methodSlug) {
    const docs = await TrainerLearnedModel.find({ user: userId, methodSlug })
      .select({ caseId: 1, _id: 0 })
      .lean<{ caseId: string }[]>()
    return docs.map((doc) => doc.caseId)
  },

  async learnedByMethod(userId) {
    const grouped = await TrainerLearnedModel.aggregate<{ _id: string; count: number; caseIds: string[] }>([
      { $match: { user: new Types.ObjectId(userId) } },
      { $group: { _id: '$methodSlug', count: { $sum: 1 }, caseIds: { $push: '$caseId' } } }
    ])
    return grouped.map((group) => ({ methodSlug: group._id, count: group.count, caseIds: group.caseIds }))
  },

  async markLearned(userId, methodSlug, caseId) {
    const filter = { user: userId, methodSlug, caseId }
    await TrainerLearnedModel.updateOne(filter, { $setOnInsert: filter }, { upsert: true })
  },

  async unmarkLearned(userId, methodSlug, caseId) {
    await TrainerLearnedModel.deleteOne({ user: userId, methodSlug, caseId })
  },

  async listSolves({ userId, methodSlug, caseId, before }, limit) {
    const filter: Record<string, unknown> = { user: userId, methodSlug }
    if (caseId) filter.caseId = caseId
    if (before) filter._id = { $lt: new Types.ObjectId(before) }

    const docs = await TrainerSolveModel.find(filter).sort(NEWEST_FIRST).limit(limit).lean<RawSolve[]>()
    return docs.map(toSolveItem)
  },

  async createSolve({ userId, methodSlug, caseId, timeMs }) {
    const doc = await TrainerSolveModel.create({ user: userId, methodSlug, caseId, timeMs })
    const raw = doc.toObject() as RawSolve
    return { ...toSolveItem(raw), createdAtMs: raw.createdAt.getTime() }
  },

  async deleteSolve(userId, solveId) {
    if (!Types.ObjectId.isValid(solveId)) return null
    const doc = await TrainerSolveModel.findOneAndDelete({ _id: solveId, user: userId }).lean<RawSolve>()
    return doc ? { methodSlug: doc.methodSlug, caseId: doc.caseId } : null
  },

  async caseSolvesOldestFirst(userId, methodSlug, caseId) {
    const docs = await TrainerSolveModel.find({ user: userId, methodSlug, caseId })
      .sort({ _id: 1 })
      .select({ timeMs: 1, createdAt: 1 })
      .lean<{ timeMs: number; createdAt: Date }[]>()
    return docs.map((doc) => ({ timeMs: doc.timeMs, createdAtMs: doc.createdAt.getTime() }))
  },

  async methodTotals(userId, methodSlug) {
    const [totals] = await TrainerSolveModel.aggregate<MethodTotals>([
      { $match: { user: new Types.ObjectId(userId), methodSlug } },
      {
        $group: {
          _id: null,
          totalSolves: { $sum: 1 },
          totalTimeMs: { $sum: '$timeMs' },
          bestSingleMs: { $min: '$timeMs' }
        }
      }
    ])
    return {
      totalSolves: totals?.totalSolves ?? 0,
      totalTimeMs: totals?.totalTimeMs ?? 0,
      bestSingleMs: totals?.bestSingleMs ?? null
    }
  },

  async recordSolveStats(userId, { methodSlug, caseId, timeMs, atMs }) {
    const methodPath = `methods.${methodSlug}`
    const casePath = `${methodPath}.cases.${caseId}`

    await TrainerStatsModel.findOneAndUpdate(
      { user: userId },
      {
        $set: { [`${casePath}.lastSolveMs`]: timeMs, [`${casePath}.lastSolveAt`]: atMs },
        $inc: {
          [`${methodPath}.totalSolves`]: 1,
          [`${methodPath}.totalTimeMs`]: timeMs,
          [`${casePath}.totalSolves`]: 1,
          [`${casePath}.totalTimeMs`]: timeMs
        },
        $min: { [`${methodPath}.bestSingleMs`]: timeMs, [`${casePath}.bestSingleMs`]: timeMs },
        $push: { [`${casePath}.recentTimes`]: { $each: [timeMs], $slice: -TRAINER_RECENT_TIMES_WINDOW } }
      },
      { upsert: true, setDefaultsOnInsert: true }
    )
  },

  async setCaseStats(userId, methodSlug, caseId, stats) {
    const casePath = `methods.${methodSlug}.cases.${caseId}`
    if (stats) {
      await TrainerStatsModel.updateOne({ user: userId }, { $set: { [casePath]: stats } }, { upsert: true })
    } else {
      await TrainerStatsModel.updateOne({ user: userId }, { $unset: { [casePath]: '' } })
    }
  },

  async setMethodTotals(userId, methodSlug, { totalSolves, totalTimeMs, bestSingleMs }) {
    const methodPath = `methods.${methodSlug}`
    await TrainerStatsModel.updateOne(
      { user: userId },
      {
        $set: {
          [`${methodPath}.totalSolves`]: totalSolves,
          [`${methodPath}.totalTimeMs`]: totalTimeMs,
          [`${methodPath}.bestSingleMs`]: bestSingleMs
        }
      },
      { upsert: true }
    )
  },

  async findStats(userId) {
    const doc = await TrainerStatsModel.findOne({ user: userId }).lean<{
      methods?: Record<string, TrainerMethodStatsDoc>
    }>()
    return doc?.methods ?? {}
  },

  async setTarget(userId, methodSlug, targetSeconds) {
    await TrainerStatsModel.findOneAndUpdate(
      { user: userId },
      { $set: { [`methods.${methodSlug}.targetSeconds`]: targetSeconds } },
      { upsert: true }
    )
  }
}
