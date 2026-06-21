import { CONSENT_KEY, getStoredConsent, setAnalyticsConsent, updateGtagConsent } from '@/shared/lib/analyticsConsent'

describe('analyticsConsent', () => {
  beforeEach(() => {
    localStorage.clear()
    delete (window as unknown as { gtag?: unknown }).gtag
  })

  describe('getStoredConsent', () => {
    it('returns null when nothing is stored', () => {
      expect(getStoredConsent()).toBeNull()
    })

    it('returns "granted" when the stored value is "granted"', () => {
      localStorage.setItem(CONSENT_KEY, 'granted')
      expect(getStoredConsent()).toBe('granted')
    })

    it('returns "denied" when the stored value is "denied"', () => {
      localStorage.setItem(CONSENT_KEY, 'denied')
      expect(getStoredConsent()).toBe('denied')
    })

    it('returns null for any unrecognised stored value', () => {
      localStorage.setItem(CONSENT_KEY, 'maybe')
      expect(getStoredConsent()).toBeNull()
    })
  })

  describe('setAnalyticsConsent', () => {
    it('persists the value in localStorage', () => {
      setAnalyticsConsent('granted')
      expect(localStorage.getItem(CONSENT_KEY)).toBe('granted')
    })

    it('forwards the consent value to gtag when available', () => {
      const gtag = vi.fn()
      ;(window as unknown as { gtag: typeof gtag }).gtag = gtag
      setAnalyticsConsent('denied')
      expect(gtag).toHaveBeenCalledWith('consent', 'update', {
        analytics_storage: 'denied',
        functionality_storage: 'granted',
        security_storage: 'granted'
      })
    })

    it('does not throw when gtag is missing', () => {
      expect(() => setAnalyticsConsent('granted')).not.toThrow()
    })
  })

  describe('updateGtagConsent', () => {
    it('is a no-op when gtag is not defined', () => {
      expect(() => updateGtagConsent('granted')).not.toThrow()
    })

    it('calls gtag with the consent update payload', () => {
      const gtag = vi.fn()
      ;(window as unknown as { gtag: typeof gtag }).gtag = gtag
      updateGtagConsent('granted')
      expect(gtag).toHaveBeenCalledTimes(1)
      expect(gtag).toHaveBeenCalledWith('consent', 'update', {
        analytics_storage: 'granted',
        functionality_storage: 'granted',
        security_storage: 'granted'
      })
    })
  })
})
