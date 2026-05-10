import type { TrainerPenalty } from '@/entities/trainer-solve/model/constants'

export const patchTrainerSolve = async (id: string, penalty: TrainerPenalty) => {
  const res = await fetch(`/api/v1/trainer/solves/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ penalty })
  })
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}))
    throw new Error(errorData?.error ?? `Failed to update solve (${res.status})`)
  }
  return res.json()
}

export const deleteTrainerSolve = async (id: string) => {
  const res = await fetch(`/api/v1/trainer/solves/${id}`, { method: 'DELETE' })
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}))
    throw new Error(errorData?.error ?? `Failed to delete solve (${res.status})`)
  }
  return res.json()
}
