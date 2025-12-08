"use client"
import { useAppInit } from '@/shared/model/app-init/useAppInit';
import { useSettingsStore } from '@/shared/model/settings/useSettingsStore';
import useWebsiteColors from '@/shared/model/useWebsiteColors';
import { useEffect } from 'react';

export default function PreloadAppProvider({ children }: { children: React.ReactNode }) {
  const { isAppReady } = useAppInit()
  const settings = useSettingsStore((store) => store.settings)
  const { applyColorTheme } = useWebsiteColors()

  useEffect(() => {
    applyColorTheme(settings.preferences.colorTheme)
  }, [applyColorTheme, settings.preferences.colorTheme])

  return (
    <>
      {isAppReady ? (children) : null}
    </>
  )
}
