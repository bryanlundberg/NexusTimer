'use client'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslations } from 'next-intl'
import { toast } from 'sonner'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useSettingsStore } from '@/shared/model/settings/useSettingsStore'
import { defaultSettings } from '@/shared/model/settings/defaultSettings'
import useWebsiteColors from '@/shared/model/useWebsiteColors'
import { useTimerStore } from '@/shared/model/timer/useTimerStore'
import useAlert from '@/shared/model/useAlert'
import { cubesDB } from '@/entities/cube/api/indexdb'
import CoreHeader from '@/shared/ui/core-header/ui/CoreHeader'
import { PageBody } from '@/shared/ui/page-body/PageBody'
import SettingsSectionsNav from '@/features/settings/ui/SettingsSectionsNav'
import SettingsDangerZone from '@/features/settings/ui/SettingsDangerZone'
import MenuSelectLanguage from '@/features/settings/ui/MenuSelectLanguage'
import MenuTimerSection from '@/features/settings/ui/MenuTimerSection'
import MenuFeaturesSection from '@/features/settings/ui/MenuFeaturesSection'
import MenuAlertsSection from '@/features/settings/ui/MenuAlertsSection'
import MenuSoundsSection from '@/features/settings/ui/MenuSoundsSection'
import MenuThemeSection from '@/features/settings/ui/MenuThemeSection'
import MenuPreferencesSection from '@/features/settings/ui/MenuPreferencesSection'
import MenuPrivacySection from '@/features/settings/ui/MenuPrivacySection'
import MenuDataSection from '@/features/settings/ui/MenuDataSection'

export default function OptionsPage() {
  const { settings, setSettings } = useSettingsStore()
  const t = useTranslations('Index')
  const { control, reset } = useForm({ defaultValues: settings })
  const { applyColorTheme } = useWebsiteColors()
  const setCubes = useTimerStore((state) => state.setCubes)
  const setSelectedCube = useTimerStore((state) => state.setSelectedCube)
  const alert = useAlert()
  const [formKey, setFormKey] = useState(0)

  useEffect(() => {
    reset(settings)
  }, [settings, reset])

  const handleResetSettings = () => {
    reset(defaultSettings)
    setSettings(defaultSettings)
    applyColorTheme(defaultSettings.preferences.colorTheme)
    setFormKey((k) => k + 1)
    toast.success(t('SettingsPage.reset-settings-success'))
  }

  const handleDeleteAppData = async () => {
    const confirmed = await alert({
      title: t('SettingsPage.delete-app-data-title'),
      subtitle: t('SettingsPage.delete-app-data-subtitle'),
      confirmText: t('Inputs.delete'),
      cancelText: t('Inputs.cancel')
    })
    if (!confirmed) return

    await cubesDB.clear()
    setCubes([])
    setSelectedCube(null)
    toast.success(t('SettingsPage.delete-app-data-success'))
  }

  return (
    <ScrollArea className={'max-h-dvh overflow-auto'}>
      <CoreHeader breadcrumbs={[{ label: t('SettingsPage.options'), href: '/options' }]} />
      <PageBody variant="hero" className="w-full max-w-6xl mx-auto px-3 sm:px-6 pb-4">
        <div className="flex items-start gap-10">
          <SettingsSectionsNav observeKey={formKey} />
          <div key={formKey} className="flex-1 min-w-0 max-w-2xl mx-auto lg:mx-0 flex flex-col gap-7">
            <MenuSelectLanguage />
            <MenuTimerSection control={control} />
            <MenuFeaturesSection control={control} />
            <MenuAlertsSection control={control} />
            <MenuSoundsSection control={control} />
            <MenuThemeSection />
            <MenuPreferencesSection />
            <MenuPrivacySection />
            <MenuDataSection />
            <SettingsDangerZone onResetSettings={handleResetSettings} onDeleteAppData={handleDeleteAppData} />
          </div>
        </div>
      </PageBody>
    </ScrollArea>
  )
}
