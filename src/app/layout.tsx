import { Toaster } from '@/components/ui/sonner'
import { spaceGrotesk } from '@/shared/config/fonts'
import './globals.css'
import { NextIntlClientProvider } from 'next-intl'
import { getLocale, getMessages, getTranslations } from 'next-intl/server'
import { locales } from '@/shared/config/i18n/locales'
import JsonLd from './jsonld'
import { ThemeProvider } from '@/components/theme-provider'
import { Metadata, Viewport } from 'next'
import Script from 'next/script'
import CookieConsentBanner from '@/components/cookie-consent-banner'
import { OfflineIndicator } from '@/shared/ui/offline-indicator/OfflineIndicator'

export async function generateMetadata(): Promise<Metadata> {
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
      type: 'website',
      images: [
        {
          url: '/opengraph-image.png',
          width: 1200,
          height: 630,
          alt: ogTitle
        }
      ]
    },
    twitter: {
      card: 'summary_large_image',
      title: ogTitle,
      description: ogDescription,
      images: ['/opengraph-image.png']
    },
    formatDetection: {
      telephone: false
    },
    icons: {
      icon: [{ url: '/favicon.ico' }],
      shortcut: ['/favicon.ico'],
      apple: [
        { url: '/ios/AppIcon.appiconset/Icon-App-60x60@2x.png', sizes: '120x120', type: 'image/png' },
        { url: '/ios/AppIcon.appiconset/Icon-App-60x60@3x.png', sizes: '180x180', type: 'image/png' },
        { url: '/ios/AppIcon.appiconset/Icon-App-76x76@2x.png', sizes: '152x152', type: 'image/png' },
        { url: '/ios/AppIcon.appiconset/Icon-App-83.5x83.5@2x.png', sizes: '167x167', type: 'image/png' }
      ]
    },
    appleWebApp: {
      capable: true,
      statusBarStyle: 'default',
      title: t('title'),
      startupImage: ['/ios/iTunesArtwork@2x.png']
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
  themeColor: '#000000'
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const locale = await getLocale()
  const messages = await getMessages()

  const t = await getTranslations({ locale, namespace: 'Metadata' })
  const title = t('title')
  const description = t('description')
  const url = `https://nexustimer.com`

  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://res.cloudinary.com" />
        <link rel="dns-prefetch" href="https://res.cloudinary.com" />
        <link rel="preconnect" href="https://cdn.jsdelivr.net" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://cdn.jsdelivr.net" />
        <link rel="preconnect" href="https://firebaseio.com" />
        <link rel="dns-prefetch" href="https://firebaseio.com" />
        <JsonLd locale={locale} title={title} description={description} url={url} />
        <script
          id="google-consent-default"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('consent', 'default', {
                analytics_storage: 'denied',
                functionality_storage: 'granted',
                security_storage: 'granted',
                wait_for_update: 500
              });
            `
          }}
        />
      </head>
      <body className={`font-sans ${spaceGrotesk.variable}`}>
        <Script src="https://www.googletagmanager.com/gtag/js?id=G-441RYCJK0K" strategy="lazyOnload" />
        <Script id="google-analytics" strategy="lazyOnload">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-441RYCJK0K');
          `}
        </Script>
        <NextIntlClientProvider messages={messages}>
          <ThemeProvider attribute="class" defaultTheme={'system'} enableSystem disableTransitionOnChange>
            <OfflineIndicator />
            {children}
            <CookieConsentBanner />
            <Toaster />
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
