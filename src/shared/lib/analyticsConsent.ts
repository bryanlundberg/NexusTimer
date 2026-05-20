export const CONSENT_KEY = 'nexustimer_cookie_consent'

export type ConsentValue = 'granted' | 'denied'

export function getStoredConsent(): ConsentValue | null {
  if (typeof window === 'undefined') return null
  const stored = localStorage.getItem(CONSENT_KEY)
  return stored === 'granted' || stored === 'denied' ? stored : null
}

export function updateGtagConsent(analytics: ConsentValue) {
  if (typeof window === 'undefined' || !window.gtag) return
  window.gtag('consent', 'update', {
    analytics_storage: analytics,
    functionality_storage: 'granted',
    security_storage: 'granted'
  })
}

export function setAnalyticsConsent(analytics: ConsentValue) {
  if (typeof window === 'undefined') return
  localStorage.setItem(CONSENT_KEY, analytics)
  updateGtagConsent(analytics)
}
