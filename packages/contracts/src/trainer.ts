import { z } from 'zod'
import { objectIdSchema } from './common'

export const TRAINER_TARGET_OPTIONS = [1, 2, 3, 4, 5] as const
export const TRAINER_RECENT_TIMES_WINDOW = 12
export const TRAINER_PAGE_SIZE = 25
export const TRAINER_DEFAULT_LIMIT = 12

const TRAINER_TARGETS: ReadonlySet<number> = new Set(TRAINER_TARGET_OPTIONS)

export const trainerSolveInputSchema = z.object({
  methodSlug: z.string().min(1),
  caseId: z.string().min(1),
  timeMs: z.number().finite().nonnegative()
})

export const trainerLearnedInputSchema = z.object({
  methodSlug: z.string().min(1),
  caseId: z.string().min(1),
  learned: z.boolean()
})

export const trainerLearnedQuerySchema = z.object({
  methodSlug: z.string().min(1)
})

export const trainerSolvesQuerySchema = z.object({
  methodSlug: z.string().min(1),
  caseId: z.string().min(1).optional(),
  limit: z.coerce.number().int().min(1).max(100).default(TRAINER_DEFAULT_LIMIT),
  before: objectIdSchema.optional()
})

export const trainerTargetInputSchema = z.object({
  method: z.string().min(1),
  targetSeconds: z.number().refine((n) => TRAINER_TARGETS.has(n), 'targetSeconds must be 1–5')
})

export type TrainerSolveInput = z.infer<typeof trainerSolveInputSchema>
export type TrainerLearnedInput = z.infer<typeof trainerLearnedInputSchema>
export type TrainerSolvesQuery = z.infer<typeof trainerSolvesQuerySchema>
export type TrainerTargetInput = z.infer<typeof trainerTargetInputSchema>

export type TrainerSolveItem = {
  _id: string
  user: string
  methodSlug: string
  caseId: string
  timeMs: number
  createdAt: string
  updatedAt: string
}

export interface TrainerCaseStatsDoc {
  totalSolves: number
  totalTimeMs: number
  bestSingleMs: number | null
  lastSolveMs: number | null
  lastSolveAt: number | null
  recentTimes: number[]
}

export interface TrainerMethodStatsDoc {
  totalSolves: number
  totalTimeMs: number
  bestSingleMs: number | null
  targetSeconds?: number
  cases: Record<string, TrainerCaseStatsDoc>
}

export type TrainerSolvesResponse = { solves: TrainerSolveItem[] }
export type TrainerSolveCreatedResponse = { solve: TrainerSolveItem }
export type TrainerLearnedResponse = { caseIds: string[] }
export type TrainerLearnedUpdateResponse = { ok: true; learned: boolean }
export type TrainerMethodStatsResponse = { method: string; stats: TrainerMethodStatsDoc | null }
export type TrainerAllStatsResponse = { methods: Record<string, TrainerMethodStatsDoc> }
