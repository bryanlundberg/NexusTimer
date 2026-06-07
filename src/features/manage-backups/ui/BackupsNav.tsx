'use client'
import { Session } from 'next-auth'
import { useTranslations } from 'next-intl'
import { CloudUpload, CloudDownload, Database } from 'lucide-react'
import AccountLastBackup from '@/features/account-last-backup/ui/AccountLastBackup'
import NavLinkCard from '@/shared/ui/nav-link-card/NavLinkCard'

export default function BackupsNav({ session }: { session: Session }) {
  const t = useTranslations('Index')

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-lg font-semibold tracking-tight">{t('SettingsPage.cloud-sync')}</h2>
        <p className="text-sm text-muted-foreground mt-1">{t('SettingsPage.backup-tip')}</p>
      </div>

      <AccountLastBackup session={session} />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <NavLinkCard
          href="/account/save"
          icon={CloudUpload}
          title={t('SettingsPage.save-data-title')}
          description={t('SettingsPage.save-data-description')}
        />
        <NavLinkCard
          href="/account/load"
          icon={CloudDownload}
          title={t('SettingsPage.load-data-title')}
          description={t('SettingsPage.load-data-description')}
        />
        <NavLinkCard
          href="/account/backups"
          icon={Database}
          title={t('SettingsPage.manage-backups-title')}
          description={t('SettingsPage.manage-backups-description')}
          className="sm:col-span-2"
        />
      </div>
    </div>
  )
}
