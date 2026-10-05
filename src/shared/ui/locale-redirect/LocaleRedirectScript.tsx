'use client'

import { useRef } from 'react'
import { useServerInsertedHTML } from 'next/navigation'
import { applySavedLocale, type SavedLocaleConfig } from '@/shared/config/i18n/applySavedLocale'
import { defaultLocale, locales } from '@/shared/config/i18n/locales'
import { localeCookie } from '@/shared/config/i18n/routing'

const config: SavedLocaleConfig = { locales, defaultLocale, cookie: localeCookie }

const script = `try{(${applySavedLocale.toString()})(location,document,navigator.languages||[navigator.language],${JSON.stringify(config)})}catch(e){}`

export function LocaleRedirectScript() {
  const inserted = useRef(false)

  useServerInsertedHTML(() => {
    if (inserted.current) return null
    inserted.current = true
    return <script dangerouslySetInnerHTML={{ __html: script }} />
  })

  return null
}
