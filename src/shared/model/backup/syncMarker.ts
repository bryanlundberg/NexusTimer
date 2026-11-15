const PREFIX = 'nx-sync:'

export async function readSyncMarker(userId: string): Promise<string | null> {
  try {
    return localStorage.getItem(PREFIX + userId)
  } catch {
    return null
  }
}

export async function writeSyncMarker(userId: string, fragment: string): Promise<void> {
  try {
    localStorage.setItem(PREFIX + userId, fragment)
  } catch (error) {
    console.error(error)
  }
}

export async function clearSyncMarkers(): Promise<void> {
  try {
    const keys = Array.from({ length: localStorage.length }, (_, index) => localStorage.key(index))
    for (const key of keys) if (key?.startsWith(PREFIX)) localStorage.removeItem(key)
  } catch (error) {
    console.error(error)
  }
}
