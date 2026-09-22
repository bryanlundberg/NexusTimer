import { getRequestConfig } from 'next-intl/server'
import { cookies } from 'next/headers'
import { toMerged } from 'es-toolkit'
import { defaultLocale, isLocale, LOCALE_COOKIE } from '@/shared/config/i18n/locales'

export default getRequestConfig(async () => {
  const cookieStore = await cookies()
  const stored = cookieStore.get(LOCALE_COOKIE)?.value

  const locale = stored && isLocale(stored) ? stored : defaultLocale

  const userMessages = (await import(`../../../../messages/${locale}.json`)).default
  const defaultMessages = (await import(`../../../../messages/en.json`)).default
  const messages = toMerged(defaultMessages, userMessages)

  return {
    locale,
    messages
  }
})
