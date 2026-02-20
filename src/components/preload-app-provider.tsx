'use client'
import { useAppInit } from '@/shared/model/app-init/useAppInit'
import { useSettingsStore } from '@/shared/model/settings/useSettingsStore'
import useWebsiteColors from '@/shared/model/useWebsiteColors'
import clarity from '@microsoft/clarity'
import { useEffect } from 'react'
import { useSession } from 'next-auth/react'

export default function PreloadAppProvider({ children }: { children: React.ReactNode }) {
  const { isAppReady } = useAppInit()
  const settings = useSettingsStore((store) => store.settings)
  const { applyColorTheme } = useWebsiteColors()
  const { data: session } = useSession()

  useEffect(() => {
    const clarityId = process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID
    if (clarityId) {
      clarity.init(clarityId)
      session?.user?.id && clarity.identify(session?.user?.id)
    }
  }, [session?.user?.id])

  useEffect(() => {
    applyColorTheme(settings.preferences.colorTheme)
  }, [applyColorTheme, settings.preferences.colorTheme])

  return <>{isAppReady ? children : null}</>
}
