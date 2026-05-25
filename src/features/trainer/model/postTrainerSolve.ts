import type { TrainerSolveInput } from '@/entities/trainer-solve/model/schema'
import { apiPost } from '@/shared/api/client'

export type PostTrainerSolveResponse = {
  solve: { _id: string }
}

export const postTrainerSolve = (payload: TrainerSolveInput) =>
  apiPost<PostTrainerSolveResponse>('/api/v1/trainer/solves', payload)
