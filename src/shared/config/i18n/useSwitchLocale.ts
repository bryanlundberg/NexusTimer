'use client'

import { useState } from 'react'
import { useLocale } from 'next-intl'
import { getPathname, usePathname } from '@/shared/config/i18n/navigation'
import { localeCookie } from '@/shared/config/i18n/routing'

export function useSwitchLocale() {
  const locale = useLocale()
  const pathname = usePathname()
  const [isPending, setIsPending] = useState(false)

  const switchLocale = (next: string) => {
    if (next === locale) return
    setIsPending(true)
    const { name, maxAge, sameSite } = localeCookie
    document.cookie = `${name}=${next}; path=/; max-age=${maxAge}; samesite=${sameSite}`
    window.location.assign(`${getPathname({ href: pathname, locale: next })}${window.location.search}`)
  }

  return { locale, switchLocale, isPending }
}
