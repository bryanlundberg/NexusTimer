import type { TrainerSolveInput } from '@/entities/trainer-solve/model/schema'

export const postTrainerSolve = async (payload: TrainerSolveInput) => {
  const res = await fetch('/api/v1/trainer/solves', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  })
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}))
    throw new Error(errorData?.error ?? `Failed to record solve (${res.status})`)
  }
  return res.json()
}
