'use client'
import { useEffect, useState } from 'react'
import { useTranslations } from 'next-intl'
import { useSettingsStore } from '@/shared/model/settings/useSettingsStore'
import { useIsFinePointer } from '@/shared/model/use-fine-pointer'
import { Button } from '@/components/ui/button'
import { MenuRow } from './MenuRow'
import { formatKeyCode } from '@/shared/lib/formatKeyCode'

export default function MenuSelectActivationKey() {
  const activationKey = useSettingsStore((state) => state.settings.timer.activationKey) || 'Space'
  const updateSetting = useSettingsStore((state) => state.updateSetting)
  const t = useTranslations('Index')
  const isFinePointer = useIsFinePointer()
  const [recording, setRecording] = useState(false)

  useEffect(() => {
    if (!recording) return

    const handleKeyDown = (event: KeyboardEvent) => {
      event.preventDefault()
      event.stopPropagation()

      if (event.code !== 'Escape') {
        updateSetting('timer.activationKey', event.code)
      }
      setRecording(false)
    }

    window.addEventListener('keydown', handleKeyDown, { capture: true })
    return () => window.removeEventListener('keydown', handleKeyDown, { capture: true })
  }, [recording, updateSetting])

  // Hide the setting on touch-only devices.
  if (!isFinePointer) return null

  return (
    <MenuRow label={t('Settings-menu.activation-key')} description={t('Settings-descriptions.activation-key')}>
      <Button
        variant="outline"
        onClick={() => setRecording((value) => !value)}
        className="w-35 sm:w-45 shrink-0 bg-background font-mono"
      >
        {recording ? t('Settings-menu.activation-key-listening') : formatKeyCode(activationKey)}
      </Button>
    </MenuRow>
  )
}
