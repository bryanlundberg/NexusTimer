export async function apiRequest<T = unknown>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, init)
  if (!res.ok) {
    const data = (await res.json().catch(() => null)) as { message?: string } | null
    throw new Error(data?.message ?? `${init?.method ?? 'GET'} ${url} failed (${res.status})`)
  }
  return res.json() as Promise<T>
}

const jsonInit = (method: string, body: unknown): RequestInit => ({
  method,
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(body)
})

export const apiPost = <T = unknown>(url: string, body: unknown) => apiRequest<T>(url, jsonInit('POST', body))
export const apiPatch = <T = unknown>(url: string, body: unknown) => apiRequest<T>(url, jsonInit('PATCH', body))
export const apiDelete = <T = unknown>(url: string) => apiRequest<T>(url, { method: 'DELETE' })
