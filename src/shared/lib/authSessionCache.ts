export const AUTH_SESSION_CACHE = 'auth-session'

export async function clearCachedSession() {
  if (typeof caches === 'undefined') return
  await caches.delete(AUTH_SESSION_CACHE)
}
