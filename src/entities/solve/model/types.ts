import { z } from 'zod'
import { CUBE_CATEGORIES } from '@/shared/const/cube-categories'
import { userSchema } from '@/entities/user/model/types'

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
  user: userSchema,
  time: z.number(),
  scramble: z.string(),
  solution: z.string().optional(),
  puzzle: z.enum(CUBE_CATEGORIES),
  createdAt: z.string(),
  updatedAt: z.string().optional(),
  smart: z.boolean().optional()
})

export type SolveServer = z.infer<typeof SolveServerSchema>
