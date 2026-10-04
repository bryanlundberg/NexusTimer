import { z } from 'zod'

export const solveReplaySchema = z.object({
  version: z.literal(1),
  puzzle: z.string(),
  scramble: z.string(),
  durationMs: z.number(),
  moves: z.array(z.object({ m: z.string(), t: z.number() }))
})

export type SolveReplayPayload = z.infer<typeof solveReplaySchema>
