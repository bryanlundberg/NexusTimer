'use client'
import { useTranslations } from 'next-intl'
import { UpdateIcon } from '@radix-ui/react-icons'
import { Trash, TriangleAlert } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface SettingsDangerZoneProps {
  onResetSettings: () => void
  onDeleteAppData: () => void
}

export default function SettingsDangerZone({ onResetSettings, onDeleteAppData }: SettingsDangerZoneProps) {
  const t = useTranslations('Index')

  return (
    <section className="notch-bl-tr [--nblt:12px] mb-10 border border-destructive/30 bg-destructive/[0.04] p-4">
      <div className="flex items-center gap-2 pb-3">
        <TriangleAlert className="size-4 text-destructive" aria-hidden />
        <span className="text-xs font-semibold tracking-widest uppercase text-destructive">
          {t('SettingsPage.danger-zone')}
        </span>
      </div>
      <div className="flex flex-col sm:flex-row flex-wrap gap-2">
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
    </section>
  )
}
