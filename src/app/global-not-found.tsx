import './globals.css'
import type { Metadata } from 'next'
import { NextIntlClientProvider } from 'next-intl'
import { spaceGrotesk, chakraPetch } from '@/shared/config/fonts'
import { routing } from '@/shared/config/i18n/routing'
import { NotFoundView } from '@/shared/ui/not-found/NotFoundView'

export const metadata: Metadata = {
  metadataBase: new URL('https://nexustimer.com'),
  title: 'Page not found - Nexus Timer'
}

export default function GlobalNotFound() {
  return (
    <html lang={routing.defaultLocale}>
      <body className={`font-sans ${spaceGrotesk.variable} ${chakraPetch.variable}`}>
        {/* Every prop is explicit: there is no locale root param here, so the request config must not run. */}
        <NextIntlClientProvider
          locale={routing.defaultLocale}
          messages={{}}
          formats={{}}
          timeZone="UTC"
          now={new Date()}
        >
          <NotFoundView />
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
