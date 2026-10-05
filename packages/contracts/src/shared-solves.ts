import { z } from 'zod'
import { CUBE_CATEGORIES, type CubeCategory } from './cube-categories'
import { MAX_SOLVE_TIME_MS, replayInputSchema, SCRAMBLE_MAX_LENGTH, type SolveReplayPayload } from './solves'

export const SHARED_SOLVES_PAGE_SIZE = 20
export const SHARED_SOLVE_SLUG_LENGTH = 10

const SLUG_PATTERN = /^[A-Za-z0-9]{10}$/

export function isValidSlug(value: unknown): value is string {
  return typeof value === 'string' && SLUG_PATTERN.test(value)
}

export const shareSolveSchema = z
  .object({
    localSolveId: z.string().min(1).max(64),
    puzzle: z.enum(CUBE_CATEGORIES),
    time: z.number().int().nonnegative().max(MAX_SOLVE_TIME_MS),
    plus2: z.boolean(),
    dnf: z.boolean(),
    scramble: z.string().trim().min(1).max(SCRAMBLE_MAX_LENGTH),
    solvedAt: z.number().int().positive(),
    replay: replayInputSchema.optional()
  })
  .strict()

export type ShareSolveInput = z.infer<typeof shareSolveSchema>

export type SharedSolveAuthor = { _id: string; name: string; image: string; country?: string }

export interface SharedSolveItem {
  slug: string
  puzzle: CubeCategory
  time: number
  plus2: boolean
  dnf: boolean
  scramble: string
  solvedAt: number
  hasReplay: boolean
  sharedAt: string
}

export interface SharedSolveDetail extends SharedSolveItem {
  author: SharedSolveAuthor
  replay?: SolveReplayPayload
  isOwner: boolean
}

export interface SharedSolvesPage {
  items: SharedSolveItem[]
  total: number
  nextCursor: string | null
}

export type MySharedIds = Record<string, string>

export type MySharedIdsResponse = { ids: MySharedIds }
export type ShareSolveResponse = { slug: string }
