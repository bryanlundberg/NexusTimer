export const SELECTED_CUBE_KEY = 'nexustimer_selected_cube'

export function getStoredSelectedCubeId(): string | null {
  if (typeof window === 'undefined') return null
  return localStorage.getItem(SELECTED_CUBE_KEY)
}

export function setStoredSelectedCubeId(cubeId: string | null) {
  if (typeof window === 'undefined') return
  if (cubeId) localStorage.setItem(SELECTED_CUBE_KEY, cubeId)
  else localStorage.removeItem(SELECTED_CUBE_KEY)
}
