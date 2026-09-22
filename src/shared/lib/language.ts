'use server'
import { cookies } from 'next/headers'
import { isLocale, LOCALE_COOKIE, localeCookieOptions } from '@/shared/config/i18n/locales'

export async function syncTranslations(locale: string) {
  if (!isLocale(locale)) return
  ;(await cookies()).set(LOCALE_COOKIE, locale, localeCookieOptions)
}
