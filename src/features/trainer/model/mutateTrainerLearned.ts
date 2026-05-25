import { apiPost } from '@/shared/api/client'

interface SetLearnedPayload {
  methodSlug: string
  caseId: string
  learned: boolean
}

export const setTrainerLearned = (payload: SetLearnedPayload) => apiPost('/api/v1/trainer/learned', payload)
