import { z } from 'zod'
import { CUBE_CATEGORIES } from '@/shared/config/cube-categories'

export type Solves = {
  session: Array<Solve>
  all: Array<Solve>
}

export type Solve = {
  id: string
  cubeId: string
  scramble: string
  startTime: number
  endTime: number
  bookmark: boolean
  time: number
  rating: number
  dnf: boolean
  plus2: boolean
  comment?: string
  isDeleted?: boolean
  updatedAt?: number
}

const SolveServerSchema = z.object({
  _id: z.string(),
  userId: z.any(),
  time: z.number(),
  scramble: z.string(),
  solution: z.string().optional(),
  puzzle: z.enum(CUBE_CATEGORIES),
  createdAt: z.string(),
  updatedAt: z.string().optional(),
  smart: z.boolean().optional()
})

export type SolveServer = z.infer<typeof SolveServerSchema>
