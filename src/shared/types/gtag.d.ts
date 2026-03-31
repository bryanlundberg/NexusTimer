type GtagConsentValue = 'granted' | 'denied'

interface GtagConsentParams {
  analytics_storage?: GtagConsentValue
  functionality_storage?: GtagConsentValue
  security_storage?: GtagConsentValue
  ad_storage?: GtagConsentValue
  ad_user_data?: GtagConsentValue
  ad_personalization?: GtagConsentValue
  wait_for_update?: number
}

interface Window {
  gtag: (command: 'consent', action: 'default' | 'update', params: GtagConsentParams) => void
  dataLayer: unknown[]
}
