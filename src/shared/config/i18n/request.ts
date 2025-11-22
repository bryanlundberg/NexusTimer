import { getRequestConfig } from 'next-intl/server'
import { cookies } from 'next/headers'
import { merge } from 'ts-deepmerge'
import { defaultLocale } from '@/shared/config/i18n/locales'

export default getRequestConfig(async () => {
  const cookieStore = await cookies()
  const NEXT_LOCALE = cookieStore.get('NEXT_LOCALE')

  const locale = NEXT_LOCALE ? NEXT_LOCALE.value : defaultLocale

  const userMessages = (await import(`../../../../messages/${locale}.json`)).default
  const defaultMessages = (await import(`../../../../messages/en.json`)).default
  const messages = merge(defaultMessages, userMessages)

  return {
    locale,
    messages
  }
})
