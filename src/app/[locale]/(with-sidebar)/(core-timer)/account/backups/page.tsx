'use client'
import { useTranslations } from 'next-intl'
import { Link } from '@/shared/config/i18n/navigation'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/shared/lib/utils'
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

      <PageBody variant="hero" className="mx-auto w-full max-w-2xl space-y-8 px-3 pb-10 sm:px-4">
        <BackupsList />

        <Link href="/account?tab=backups" className={cn(buttonVariants({ variant: 'ghost' }), 'h-11 w-full')}>
          {t('Inputs.back')}
        </Link>
      </PageBody>
    </>
  )
}
