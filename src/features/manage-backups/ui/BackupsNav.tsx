'use client'
import { useTranslations } from 'next-intl'
import { MenuSection } from '@/features/settings/ui/MenuSection'
import { MenuLinkRow } from '@/features/settings/ui/MenuLinkRow'

export default function BackupsNav() {
  const t = useTranslations('Index')

  return (
    <MenuSection id="cloud-sync" title={t('SettingsPage.cloud-sync')} footer={t('SettingsPage.backup-tip')}>
      <MenuLinkRow
        href="/account/save"
        label={t('SettingsPage.save-data-title')}
        description={t('SettingsPage.save-data-description')}
      />
      <MenuLinkRow
        href="/account/load"
        label={t('SettingsPage.load-data-title')}
        description={t('SettingsPage.load-data-description')}
      />
      <MenuLinkRow
        href="/account/backups"
        label={t('SettingsPage.manage-backups-title')}
        description={t('SettingsPage.manage-backups-description')}
      />
    </MenuSection>
  )
}
