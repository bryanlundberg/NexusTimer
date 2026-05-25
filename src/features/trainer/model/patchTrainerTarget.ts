export const patchTrainerTarget = async (methodSlug: string, targetSeconds: number) => {
  const res = await fetch('/api/v1/trainer/stats', {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ method: methodSlug, targetSeconds })
  })
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}))
    throw new Error(errorData?.message ?? `Failed to update target (${res.status})`)
  }
  return res.json()
}
