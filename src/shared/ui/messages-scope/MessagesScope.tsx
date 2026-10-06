'use client'

import type { ReactNode } from 'react'
import { NextIntlClientProvider, useLocale, useMessages, type AbstractIntlMessages } from 'next-intl'
import { toMerged } from 'es-toolkit'

export function MessagesScope({ messages, children }: { messages: AbstractIntlMessages; children: ReactNode }) {
  const locale = useLocale()
  const parent = useMessages()

  return (
    <NextIntlClientProvider locale={locale} messages={toMerged(parent, messages)}>
      {children}
    </NextIntlClientProvider>
  )
}
