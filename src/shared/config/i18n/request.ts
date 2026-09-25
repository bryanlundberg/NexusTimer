import * as rootParams from 'next/root-params'
import { notFound } from 'next/navigation'
import { getRequestConfig } from 'next-intl/server'
import { hasLocale } from 'next-intl'
import { toMerged } from 'es-toolkit'
import { routing } from '@/shared/config/i18n/routing'

export default getRequestConfig(async () => {
  const locale = await rootParams.locale()
  if (!hasLocale(routing.locales, locale)) notFound()

  const userMessages = (await import(`../../../../messages/${locale}.json`)).default
  const defaultMessages = (await import(`../../../../messages/en.json`)).default
  const messages = toMerged(defaultMessages, userMessages)

  return {
    locale,
    messages
  }
})
