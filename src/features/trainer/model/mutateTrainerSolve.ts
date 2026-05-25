import type { TrainerPenalty } from '@/entities/trainer-solve/model/constants'
import { apiDelete, apiPatch } from '@/shared/api/client'

export const patchTrainerSolve = (id: string, penalty: TrainerPenalty) =>
  apiPatch(`/api/v1/trainer/solves/${id}`, { penalty })

export const deleteTrainerSolve = (id: string) => apiDelete(`/api/v1/trainer/solves/${id}`)
