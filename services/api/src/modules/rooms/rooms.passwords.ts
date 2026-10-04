const REQUEST_TIMEOUT_MS = 5000

export type RoomPasswords = { passwordHash(roomId: string): Promise<{ hash: string | null } | null> }

export function createRoomPasswords(databaseUrl: string | undefined, request: typeof fetch = fetch): RoomPasswords {
  const base = databaseUrl?.replace(/\/+$/, '')

  return {
    async passwordHash(roomId) {
      if (!base) throw new Error('FIREBASE_DATABASE_URL is not configured')

      const res = await request(`${base}/rooms/${encodeURIComponent(roomId)}/passwordHash.json`, {
        signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS)
      })
      if (!res.ok) return null

      const hash = (await res.json()) as string | null
      return { hash: hash || null }
    }
  }
}
