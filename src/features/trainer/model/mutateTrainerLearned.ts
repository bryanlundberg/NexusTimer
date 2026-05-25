interface SetLearnedPayload {
  methodSlug: string
  caseId: string
  learned: boolean
}

export const setTrainerLearned = async (payload: SetLearnedPayload) => {
  const res = await fetch('/api/v1/trainer/learned', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  })
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}))
    throw new Error(errorData?.message ?? `Failed to update learned (${res.status})`)
  }
  return res.json()
}
