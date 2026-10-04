export const MIGRATED_API_PREFIXES = ['/api/health'] as const

export function isMigratedApiPath(pathname: string) {
  return MIGRATED_API_PREFIXES.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`))
}
