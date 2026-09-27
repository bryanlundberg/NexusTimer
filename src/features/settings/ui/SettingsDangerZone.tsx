'use client'
import { useTranslations } from 'next-intl'
import { UpdateIcon } from '@radix-ui/react-icons'
import { Trash } from 'lucide-react'
import { MenuSection } from './MenuSection'
import { MenuActionRow } from './MenuActionRow'

interface SettingsDangerZoneProps {
  onResetSettings: () => void
  onDeleteAppData: () => void
}

export default function SettingsDangerZone({ onResetSettings, onDeleteAppData }: SettingsDangerZoneProps) {
  const t = useTranslations('Index')

  return (
    <MenuSection title={t('SettingsPage.danger-zone')} tone="destructive" className="mb-10">
      <MenuActionRow
        tone="destructive"
        icon={<UpdateIcon />}
        label={t('SettingsPage.reset-settings')}
        onClick={onResetSettings}
        data-testid="reset-settings-button"
      />
      <MenuActionRow
        tone="destructive"
        icon={<Trash />}
        label={t('SettingsPage.delete-app-data')}
        onClick={onDeleteAppData}
        data-testid="delete-app-data-button"
      />
    </MenuSection>
  )
}
