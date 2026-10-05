export type SavedLocaleConfig = {
  locales: readonly string[]
  defaultLocale: string
  cookie: { name: string; maxAge: number; sameSite: string }
}

export function applySavedLocale(
  location: Pick<Location, 'pathname' | 'search' | 'hash' | 'replace'>,
  document: { cookie: string },
  languages: readonly string[],
  config: SavedLocaleConfig
) {
  const { locales, defaultLocale, cookie } = config
  const prefix = location.pathname.split('/')[1]
  const urlLocale = locales.includes(prefix) ? prefix : null

  const saved = document.cookie
    .split(';')
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${cookie.name}=`))
    ?.slice(cookie.name.length + 1)
  const savedLocale = saved && locales.includes(saved) ? saved : null
  const browserLocale = languages
    .flatMap((tag) => [tag.toLowerCase(), tag.toLowerCase().split('-')[0]])
    .find((tag) => locales.includes(tag))

  const locale = urlLocale ?? savedLocale ?? browserLocale ?? defaultLocale
  if (locale !== saved) {
    document.cookie = `${cookie.name}=${locale}; path=/; max-age=${cookie.maxAge}; samesite=${cookie.sameSite}`
  }
  if (urlLocale || locale === defaultLocale) return

  const path = location.pathname === '/' ? '' : location.pathname
  location.replace(`/${locale}${path}${location.search}${location.hash}`)
}
