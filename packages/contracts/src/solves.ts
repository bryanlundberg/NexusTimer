import { z } from 'zod'

export const solveReplaySchema = z.object({
  version: z.literal(1),
  puzzle: z.string(),
  scramble: z.string(),
  durationMs: z.number(),
  moves: z.array(z.object({ m: z.string(), t: z.number() }))
})

export type SolveReplayPayload = z.infer<typeof solveReplaySchema>

export const REPLAY_MAX_MOVES = 1000
export const SCRAMBLE_MAX_LENGTH = 1000
export const MAX_SOLVE_TIME_MS = 24 * 60 * 60 * 1000

export const replayInputSchema = z.object({
  version: z.literal(1),
  puzzle: z.string().max(32),
  scramble: z.string().max(SCRAMBLE_MAX_LENGTH),
  durationMs: z.number().nonnegative().max(MAX_SOLVE_TIME_MS),
  moves: z
    .array(z.object({ m: z.string().max(8), t: z.number().nonnegative().max(MAX_SOLVE_TIME_MS) }))
    .max(REPLAY_MAX_MOVES)
})
