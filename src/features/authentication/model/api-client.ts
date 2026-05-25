export type ApiResult<T = unknown> = { ok: true; data: T } | { ok: false; message: string }

export async function postJSON<T = unknown>(url: string, body: unknown): Promise<ApiResult<T>> {
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    })
    const data = (await res.json().catch(() => ({}))) as { message?: string } & Record<string, unknown>

    if (!res.ok) {
      return { ok: false, message: data.message ?? 'Request failed' }
    }
    return { ok: true, data: data as T }
  } catch {
    return { ok: false, message: 'Network error' }
  }
}
