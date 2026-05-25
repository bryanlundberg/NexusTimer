import { apiPatch } from '@/shared/api/client'

export const patchTrainerTarget = (methodSlug: string, targetSeconds: number) =>
  apiPatch('/api/v1/trainer/stats', { method: methodSlug, targetSeconds })
