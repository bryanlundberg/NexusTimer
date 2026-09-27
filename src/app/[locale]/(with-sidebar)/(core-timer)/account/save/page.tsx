'use client'
import { useLocale, useTranslations } from 'next-intl'
import { useEffect, useRef } from 'react'
import { Link, useRouter } from '@/shared/config/i18n/navigation'
import { Button, buttonVariants } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Skeleton } from '@/components/ui/skeleton'
import { CloudUpload, Loader2 } from 'lucide-react'
import { useSyncBackup } from '@/shared/model/backup/useSyncBackup'
import { useTimerStore } from '@/shared/model/timer/useTimerStore'
import { useBackups } from '@/entities/backup/model/useBackups'
import { MenuSection } from '@/features/settings/ui/MenuSection'
import { MenuRow } from '@/features/settings/ui/MenuRow'
import dayjs from '@/shared/lib/dayjs'
import { cn } from '@/shared/lib/utils'
import CoreHeader from '@/shared/ui/core-header/ui/CoreHeader'
import { PageBody } from '@/shared/ui/page-body/PageBody'

export default function AccountSavePage() {
  const t = useTranslations('Index')
  const locale = useLocale()
  const { handleUploadBackup, isUploading, uploadProgress } = useSyncBackup()
  const cubes = useTimerStore((state) => state.cubes)
  const { backups, isLoading: backupsLoading } = useBackups()
  const router = useRouter()
  const isMountedRef = useRef(false)

  useEffect(() => {
    isMountedRef.current = true
    return () => {
      isMountedRef.current = false
    }
  }, [])

  const handleSave = async () => {
    if ((await handleUploadBackup()) && isMountedRef.current) router.push('/account?tab=backups')
  }

  const activeCubes = cubes?.filter((cube) => !cube.isDeleted)
  const solveCount = activeCubes?.reduce(
    (total, cube) =>
      total +
      cube.solves.session.filter((solve) => !solve.isDeleted).length +
      cube.solves.all.filter((solve) => !solve.isDeleted).length,
    0
  )
  const latest = backups[0]
  const number = new Intl.NumberFormat(locale)
  const value = 'text-[15px] tabular-nums text-muted-foreground sm:text-sm'

  return (
    <>
      <CoreHeader
        breadcrumbs={[
          { label: t('SettingsPage.account'), href: '/account' },
          { label: t('SettingsPage.save-data-title'), href: '/account/save' }
        ]}
      />

      <PageBody variant="hero" className="mx-auto w-full max-w-2xl space-y-8 px-3 pb-8 sm:px-4" aria-busy={isUploading}>
        <p className="px-4 text-[15px] leading-snug text-muted-foreground sm:text-sm">
          {t('SettingsPage.save-data-description')}
        </p>

        <MenuSection title={t('SettingsPage.backup-device-section')} footer={t('SettingsPage.save-data-warning')}>
          <MenuRow label={t('SettingsPage.backup-cubes')}>
            {activeCubes ? (
              <span className={value}>{number.format(activeCubes.length)}</span>
            ) : (
              <Skeleton className="h-4 w-10" />
            )}
          </MenuRow>
          <MenuRow label={t('SettingsPage.backup-solves')}>
            {solveCount !== undefined ? (
              <span className={value}>{number.format(solveCount)}</span>
            ) : (
              <Skeleton className="h-4 w-10" />
            )}
          </MenuRow>
          <MenuRow label={t('SettingsPage.backup-latest')}>
            {backupsLoading ? (
              <Skeleton className="h-4 w-20" />
            ) : (
              <span className={value}>
                {latest ? dayjs(latest.createdAt).locale(locale).fromNow() : t('SettingsPage.no-backup-yet')}
              </span>
            )}
          </MenuRow>
          {isUploading && (
            <div className="flex items-center gap-3 px-4 py-3.5">
              <Progress value={uploadProgress} className="flex-1" />
              <span className="w-10 text-right font-mono text-xs tabular-nums text-muted-foreground">
                {uploadProgress}%
              </span>
            </div>
          )}
        </MenuSection>

        <div className="flex flex-col gap-2">
          <Button onClick={handleSave} disabled={isUploading} className="h-11 gap-2">
            {isUploading ? <Loader2 className="size-4 animate-spin" /> : <CloudUpload className="size-4" />}
            {t('SettingsPage.save-data-action')}
          </Button>
          <Link href="/account?tab=backups" className={cn(buttonVariants({ variant: 'ghost' }), 'h-11 w-full')}>
            {t('Inputs.back')}
          </Link>
        </div>
      </PageBody>
    </>
  )
}
