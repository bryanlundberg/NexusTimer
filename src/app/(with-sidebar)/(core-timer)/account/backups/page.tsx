'use client'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import CoreHeader from '@/shared/ui/core-header/ui/CoreHeader'
import { PageBody } from '@/shared/ui/page-body/PageBody'
import BackupsList from '@/features/manage-backups/ui/BackupsList'

export default function AccountBackupsPage() {
  const t = useTranslations('Index')

  return (
    <>
      <CoreHeader
        breadcrumbs={[
          { label: t('SettingsPage.account'), href: '/account' },
          { label: t('SettingsPage.manage-backups-title'), href: '/account/backups' }
        ]}
      />

      <PageBody variant="hero" className="px-3 pb-10 max-w-2xl mx-auto w-full space-y-5">
        <div>
          <h1 className="text-lg font-semibold tracking-tight">{t('SettingsPage.manage-backups-title')}</h1>
          <p className="text-sm text-muted-foreground mt-1">{t('SettingsPage.manage-backups-description')}</p>
        </div>

        <BackupsList />

        <Link href={'/account?tab=backups'} className="block">
          <Button className="w-full" variant={'ghost'}>
            {t('Inputs.back')}
          </Button>
        </Link>
      </PageBody>
    </>
  )
}
