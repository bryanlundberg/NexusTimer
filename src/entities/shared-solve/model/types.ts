import { z } from 'zod'
import { CUBE_CATEGORIES, type CubeCategory } from '@/shared/const/cube-categories'
import type { SolveReplay } from '@/entities/replay/model/types'
import type { FriendUser } from '@/entities/friendship/model/types'

export const SHARED_SOLVES_PAGE_SIZE = 20
export const REPLAY_MAX_MOVES = 1000
const SCRAMBLE_MAX_LENGTH = 1000
const MAX_TIME_MS = 24 * 60 * 60 * 1000

const replaySchema = z.object({
  version: z.literal(1),
  puzzle: z.string().max(32),
  scramble: z.string().max(SCRAMBLE_MAX_LENGTH),
  durationMs: z.number().nonnegative().max(MAX_TIME_MS),
  moves: z.array(z.object({ m: z.string().max(8), t: z.number().nonnegative().max(MAX_TIME_MS) })).max(REPLAY_MAX_MOVES)
})

export const shareSolveSchema = z
  .object({
    localSolveId: z.string().min(1).max(64),
    puzzle: z.enum(CUBE_CATEGORIES),
    time: z.number().int().nonnegative().max(MAX_TIME_MS),
    plus2: z.boolean(),
    dnf: z.boolean(),
    scramble: z.string().trim().min(1).max(SCRAMBLE_MAX_LENGTH),
    solvedAt: z.number().int().positive(),
    replay: replaySchema.optional()
  })
  .strict()

export type ShareSolveInput = z.infer<typeof shareSolveSchema>

export type SharedSolveAuthor = Pick<FriendUser, '_id' | 'name' | 'image' | 'country'>

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
  replay?: SolveReplay
  isOwner: boolean
}

export interface SharedSolvesPage {
  items: SharedSolveItem[]
  total: number
  nextCursor: string | null
}

export type MySharedIds = Record<string, string>
