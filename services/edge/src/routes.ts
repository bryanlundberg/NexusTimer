const API_PREFIX = '/api'

export function isApiPath(pathname: string) {
  return pathname === API_PREFIX || pathname.startsWith(`${API_PREFIX}/`)
}
