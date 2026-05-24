'use client'
import { useEffect, useState } from 'react'
import { useTranslations } from 'next-intl'
import { Switch } from '@/components/ui/switch'
import { getStoredConsent, setAnalyticsConsent } from '@/shared/lib/analyticsConsent'

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
    <div className="px-3 py-2 transition-colors hover:bg-muted/30">
      <div className="flex items-center justify-between gap-3">
        <div className="flex flex-col gap-0.5 min-w-0">
          <span className="text-sm font-medium leading-tight">{t('Settings-menu.analytics')}</span>
          <span className="text-xs text-muted-foreground leading-snug">{t('Settings-descriptions.analytics')}</span>
        </div>
        <Switch checked={enabled} onCheckedChange={handleChange} />
      </div>
    </div>
  )
}
