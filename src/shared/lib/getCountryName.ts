/**
 * Localized country name for an ISO 3166-1 alpha-2 code. Falls back to the
 * code itself if the locale data can't resolve it.
 */
export function getCountryName(code: string, locale: string): string {
  try {
    return new Intl.DisplayNames([locale], { type: 'region' }).of(code.toUpperCase()) || code.toUpperCase()
  } catch {
    return code.toUpperCase()
  }
}
