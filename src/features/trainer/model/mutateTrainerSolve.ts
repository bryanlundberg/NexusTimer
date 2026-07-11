import { apiDelete } from '@/shared/api/client'

export const deleteTrainerSolve = (id: string) => apiDelete(`/api/v1/trainer/solves/${id}`)
