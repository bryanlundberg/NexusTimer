import { getRequestConfig } from 'next-intl/server'
import { cookies, headers } from 'next/headers'
import { toMerged } from 'es-toolkit'
import { defaultLocale, isLocale, LOCALE_COOKIE, LOCALE_HEADER } from '@/shared/config/i18n/locales'

export default getRequestConfig(async () => {
  const fromPath = (await headers()).get(LOCALE_HEADER)
  const stored = (await cookies()).get(LOCALE_COOKIE)?.value

  const locale = fromPath && isLocale(fromPath) ? fromPath : stored && isLocale(stored) ? stored : defaultLocale

  const userMessages = (await import(`../../../../messages/${locale}.json`)).default
  const defaultMessages = (await import(`../../../../messages/en.json`)).default
  const messages = toMerged(defaultMessages, userMessages)

  return {
    locale,
    messages
  }
})
