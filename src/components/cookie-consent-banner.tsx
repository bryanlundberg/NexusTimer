'use client'

import { CSSProperties, useEffect, useState } from 'react'
import { useTranslations } from 'next-intl'
import { Cookie } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { getStoredConsent, setAnalyticsConsent, updateGtagConsent } from '@/shared/lib/analyticsConsent'

const DOT_TEXTURE: CSSProperties = {
  backgroundImage: 'radial-gradient(rgba(128, 128, 128, 0.09) 1px, transparent 1px)',
  backgroundSize: '16px 16px'
}

export default function CookieConsentBanner() {
  const t = useTranslations('Cookies')
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const stored = getStoredConsent()
    if (!stored) {
      setVisible(true)
      return
    }
    // Re-apply persisted consent on every page load
    updateGtagConsent(stored)
  }, [])

  function handleAccept() {
    setAnalyticsConsent('granted')
    setVisible(false)
  }

  function handleReject() {
    setAnalyticsConsent('denied')
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div
      className="fixed inset-x-0 bottom-0 z-50 border-t bg-background shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-500"
      style={DOT_TEXTURE}
    >
      <div className="mx-auto flex max-w-5xl flex-col gap-3 p-4 sm:flex-row sm:items-center sm:gap-4">
        <div className="min-w-0">
          <p className="flex items-center gap-2 text-sm font-semibold">
            <Cookie className="size-4 shrink-0 text-muted-foreground" />
            {t('title')}
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            {t('description')}{' '}
            <a href="/privacy-policy" className="underline underline-offset-2 hover:text-foreground">
              {t('privacy-policy')}
            </a>
          </p>
        </div>
        <div className="flex shrink-0 justify-end gap-2 sm:ml-auto">
          <Button size="sm" variant="outline" onClick={handleReject}>
            {t('decline')}
          </Button>
          <Button size="sm" onClick={handleAccept}>
            {t('accept')}
          </Button>
        </div>
      </div>
    </div>
  )
}
