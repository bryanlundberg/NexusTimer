'use client'

import PreloadApp from '@/components/preload-app'
import { useEffect } from 'react'
import { useSettingsModalStore } from '@/store/SettingsModalStore'
import StatisticsProvider from '@/components/statistics-provider'
import useWebsiteColors from '@/shared/model/useWebsiteColors'

export default function Providers({ children }: { children: React.ReactNode; loaderProvider?: boolean }) {
  const settings = useSettingsModalStore((store) => store.settings)
  const { applyColorTheme } = useWebsiteColors()

  useEffect(() => {
    applyColorTheme(settings.preferences.colorTheme)
  }, [applyColorTheme, settings.preferences.colorTheme])

  return (
    <>
      <PreloadApp>
        <StatisticsProvider>{children}</StatisticsProvider>
      </PreloadApp>
    </>
  )
}
