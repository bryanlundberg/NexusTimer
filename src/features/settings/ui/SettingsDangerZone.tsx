'use client'
import { useTranslations } from 'next-intl'
import { UpdateIcon } from '@radix-ui/react-icons'
import { Trash } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface SettingsDangerZoneProps {
  onResetSettings: () => void
  onDeleteAppData: () => void
}

export default function SettingsDangerZone({ onResetSettings, onDeleteAppData }: SettingsDangerZoneProps) {
  const t = useTranslations('Index')

  return (
    <div className="border-t border-border/60 pt-5 mb-10 px-3 flex flex-col sm:flex-row flex-wrap gap-2">
      <Button
        variant="outline"
        onClick={onResetSettings}
        className="flex items-center gap-2 border-destructive/40 text-destructive hover:bg-destructive/10 hover:text-destructive"
        data-testid="reset-settings-button"
      >
        <UpdateIcon className="size-4" />
        {t('SettingsPage.reset-settings')}
      </Button>
      <Button
        variant="outline"
        onClick={onDeleteAppData}
        className="flex items-center gap-2 border-destructive/40 text-destructive hover:bg-destructive/10 hover:text-destructive"
        data-testid="delete-app-data-button"
      >
        <Trash className="size-4" />
        {t('SettingsPage.delete-app-data')}
      </Button>
    </div>
  )
}
