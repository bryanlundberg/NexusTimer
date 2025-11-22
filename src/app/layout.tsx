import { Toaster } from '@/components/ui/sonner'
import './globals.css'
import { jakarta } from '@/shared/config/fonts'
import { NextIntlClientProvider } from 'next-intl'
import { getLocale, getMessages, getTranslations } from 'next-intl/server'
import { SessionProvider } from 'next-auth/react'
import { auth } from '@/auth'
import { NuqsAdapter } from 'nuqs/adapters/next/app'
import { locales } from '@/shared/config/i18n/locales'
import JsonLd from './jsonld'
import { ThemeProvider } from '@/components/theme-provider'
import { SidebarProvider } from '@/components/ui/sidebar'
import AlertProvider from '@/components/alert/AlertProvider'
import { Viewport } from 'next'
import { Overlay } from '@/shared/ui/overlay/overlay'

export async function generateMetadata() {
  const locale = await getLocale()
  const t = await getTranslations({ locale, namespace: 'Metadata' })
  const ogTitle = t('title')
  const ogDescription = t('description')
  const url = `https://nexustimer.com`

  return {
    title: t('title'),
    description: t('description'),
    keywords: [
      t('keywords.key1'),
      t('keywords.key2'),
      t('keywords.key3'),
      t('keywords.key4'),
      t('keywords.key5'),
      t('keywords.key6'),
      t('keywords.key7'),
      t('keywords.key8'),
      t('keywords.key9'),
      t('keywords.key10'),
      t('keywords.key11'),
      t('keywords.key12'),
      t('keywords.key13'),
      t('keywords.key14')
    ],
    metadataBase: new URL('https://nexustimer.com'),
    alternates: {
      canonical: `/`,
      languages: Object.fromEntries(locales.map((l) => [l, `/`]))
    },
    openGraph: {
      title: ogTitle,
      description: ogDescription,
      url: url,
      siteName: 'Nexus Timer',
      locale: locale,
      type: 'website'
    },
    twitter: {
      card: 'summary',
      title: ogTitle,
      description: ogDescription
    },
    formatDetection: {
      telephone: false
    },
    appleWebApp: {
      capable: true,
      statusBarStyle: 'default',
      title: t('title'),
      startupImage: ['/logo.png']
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-image-preview': 'large',
        'max-video-preview': -1,
        'max-snippet': -1
      }
    }
  }
}

export const viewport: Viewport = {
  themeColor: '#FFFFFF'
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const locale = await getLocale()
  const messages = await getMessages()
  const session = await auth()

  const t = await getTranslations({ locale, namespace: 'Metadata' })
  const title = t('title')
  const description = t('description')
  const url = `https://nexustimer.com`

  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        <JsonLd locale={locale} title={title} description={description} url={url} />
      </head>
      <body className={jakarta.className}>
        <NuqsAdapter>
          <SessionProvider session={session}>
            <NextIntlClientProvider messages={messages}>
              <ThemeProvider attribute="class" defaultTheme={'light'} enableSystem disableTransitionOnChange>
                <SidebarProvider>
                  <AlertProvider>
                    {children}
                    <Overlay />
                  </AlertProvider>
                </SidebarProvider>
              </ThemeProvider>
            </NextIntlClientProvider>
            <Toaster />
          </SessionProvider>
        </NuqsAdapter>
      </body>
    </html>
  )
}
