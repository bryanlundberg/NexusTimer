'use client'
import { useEffect, useState } from 'react'
import { useTranslations } from 'next-intl'
import { Switch } from '@/components/ui/switch'
import { getStoredConsent, setAnalyticsConsent } from '@/shared/lib/analyticsConsent'
import { MenuRow } from './MenuRow'

export default function MenuToggleAnalytics() {
  const t = useTranslations('Index')
  const [enabled, setEnabled] = useState(false)

  useEffect(() => {
    setEnabled(getStoredConsent() === 'granted')
  }, [])

  const handleChange = (checked: boolean) => {
    setEnabled(checked)
    setAnalyticsConsent(checked ? 'granted' : 'denied')
  }

  return (
    <MenuRow label={t('Settings-menu.analytics')} description={t('Settings-descriptions.analytics')}>
      <Switch checked={enabled} onCheckedChange={handleChange} />
    </MenuRow>
  )
}
