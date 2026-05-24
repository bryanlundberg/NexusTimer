'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { getStoredConsent, setAnalyticsConsent, updateGtagConsent } from '@/shared/lib/analyticsConsent'

export default function CookieConsentBanner() {
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
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t bg-background p-4 shadow-lg md:bottom-4 md:left-4 md:right-auto md:max-w-sm md:rounded-lg md:border">
      <p className="mb-3 text-sm text-muted-foreground">
        We use cookies to analyze site usage and improve your experience. You can accept or decline analytics cookies.{' '}
        <a href="/privacy-policy" className="underline hover:text-foreground">
          Privacy Policy
        </a>
      </p>
      <div className="flex gap-2">
        <Button size="sm" onClick={handleAccept}>
          Accept
        </Button>
        <Button size="sm" variant="outline" onClick={handleReject}>
          Decline
        </Button>
      </div>
    </div>
  )
}
