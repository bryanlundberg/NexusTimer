'use client'
import { useLocale, useTranslations } from 'next-intl'
import { useSession } from '@/shared/model/useSession'
import { toast } from 'sonner'
import { Link, useRouter } from '@/shared/config/i18n/navigation'
import { useState } from 'react'
import { Button, buttonVariants } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { CloudDownload, Loader2 } from 'lucide-react'
import { useSyncBackup } from '@/shared/model/backup/useSyncBackup'
import { useUser } from '@/entities/user/model/useUser'
import { useBackups } from '@/entities/backup/model/useBackups'
import { MenuSection } from '@/features/settings/ui/MenuSection'
import { MenuRow } from '@/features/settings/ui/MenuRow'
import dayjs from '@/shared/lib/dayjs'
import { formatBytes } from '@/shared/lib/format-bytes'
import { cn } from '@/shared/lib/utils'
import CoreHeader from '@/shared/ui/core-header/ui/CoreHeader'
import { PageBody } from '@/shared/ui/page-body/PageBody'

export default function AccountLoadPage() {
  const t = useTranslations('Index')
  const locale = useLocale()
  const { handleDownloadData } = useSyncBackup()
  const { data: session } = useSession()
  const { data: user } = useUser(session?.user?.id!)
  const { backups, isLoading: backupsLoading } = useBackups()
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleDownloadDataWrapper = async () => {
    if (!user || isLoading) return
    setIsLoading(true)
    try {
      await handleDownloadData({ user })
      router.push('/app')
      toast.success(t('SettingsPage.load-data-toast'))
    } catch (error) {
      setIsLoading(false)
    }
  }

  const latest = backups[0]
  const created = latest ? dayjs(latest.createdAt).locale(locale) : null
  const value = 'text-[15px] tabular-nums text-muted-foreground sm:text-sm'

  return (
    <>
      <CoreHeader
        breadcrumbs={[
          { label: t('SettingsPage.account'), href: '/account' },
          { label: t('SettingsPage.load-data-title'), href: '/account/load' }
        ]}
      />

      <PageBody variant="hero" className="mx-auto w-full max-w-2xl space-y-8 px-3 pb-8 sm:px-4" aria-busy={isLoading}>
        <p className="px-4 text-[15px] leading-snug text-muted-foreground sm:text-sm">
          {t('SettingsPage.load-data-description')}
        </p>

        <MenuSection title={t('SettingsPage.backup-cloud-section')} footer={t('SettingsPage.load-data-warning')}>
          <MenuRow label={t('SettingsPage.backup-latest')}>
            {backupsLoading ? (
              <Skeleton className="h-4 w-20" />
            ) : (
              <span className={value} title={created?.format('LLL')}>
                {created ? created.fromNow() : t('SettingsPage.no-backup-yet')}
              </span>
            )}
          </MenuRow>
          {latest && (
            <MenuRow label={t('SettingsPage.backup-size')}>
              <span className={value}>{formatBytes(latest.size)}</span>
            </MenuRow>
          )}
        </MenuSection>

        <div className="flex flex-col gap-2">
          <Button onClick={handleDownloadDataWrapper} disabled={!user || isLoading} className="h-11 gap-2">
            {isLoading ? <Loader2 className="size-4 animate-spin" /> : <CloudDownload className="size-4" />}
            {t('SettingsPage.load-data-action')}
          </Button>
          <Link
            href="/account?tab=backups"
            aria-disabled={isLoading}
            onClick={(e) => {
              if (isLoading) e.preventDefault()
            }}
            className={cn(
              buttonVariants({ variant: 'ghost' }),
              'h-11 w-full',
              isLoading && 'pointer-events-none opacity-50'
            )}
          >
            {t('Inputs.back')}
          </Link>
        </div>
      </PageBody>
    </>
  )
}
