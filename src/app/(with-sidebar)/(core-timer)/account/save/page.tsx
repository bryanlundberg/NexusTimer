'use client'
import { useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { toast } from 'sonner'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { CloudUpload, Info, Loader2 } from 'lucide-react'
import { useSyncBackup } from '@/shared/model/backup/useSyncBackup'
import CoreHeader from '@/shared/ui/core-header/ui/CoreHeader'
import { PageBody } from '@/shared/ui/page-body/PageBody'

export default function AccountSavePage() {
  const t = useTranslations('Index')
  const { handleUploadBackup, isUploading, uploadProgress, uploadCompleted } = useSyncBackup()
  const router = useRouter()

  useEffect(() => {
    if (uploadCompleted) {
      router.push('/account')
      toast.success(t('SettingsPage.save-data-toast'))
    }
  }, [router, uploadCompleted, t])

  return (
    <>
      <CoreHeader
        breadcrumbs={[
          { label: t('SettingsPage.account'), href: '/account' },
          { label: t('SettingsPage.save-data-title'), href: '/account/save' }
        ]}
      />

      <PageBody variant="hero" className="mx-auto w-full max-w-md px-4 pb-8" aria-busy={isUploading}>
        <div className="flex flex-col items-center pt-8 text-center">
          <CloudUpload className="size-8 text-muted-foreground" />
          <h1 className="mt-4 text-xl font-semibold tracking-tight">{t('SettingsPage.save-data-title')}</h1>
          <p className="mt-2 text-sm text-muted-foreground">{t('SettingsPage.save-data-description')}</p>
        </div>

        <div className="mt-6 flex items-start gap-3 rounded-xl border border-sky-500/20 bg-sky-500/5 p-3.5">
          <Info className="mt-0.5 size-4 shrink-0 text-sky-500" />
          <p className="text-xs leading-relaxed text-sky-600 dark:text-sky-400">
            {t('SettingsPage.save-data-warning')}
          </p>
        </div>

        {isUploading && (
          <div className="mt-6 space-y-2">
            <Progress value={uploadProgress} />
            <p className="text-right font-mono text-xs tabular-nums text-muted-foreground">{uploadProgress}%</p>
          </div>
        )}

        <div className="mt-8 flex flex-col gap-2">
          <Button onClick={handleUploadBackup} disabled={isUploading}>
            {isUploading ? (
              <span className="inline-flex items-center gap-2">
                <Loader2 className="size-4 animate-spin" />
                {t('SettingsPage.save-data-action')}
              </span>
            ) : (
              t('SettingsPage.save-data-action')
            )}
          </Button>

          <Link
            href="/account"
            aria-disabled={isUploading}
            onClick={(e) => {
              if (isUploading) e.preventDefault()
            }}
          >
            <Button variant="ghost" className="w-full" disabled={isUploading}>
              {t('Inputs.back')}
            </Button>
          </Link>
        </div>
      </PageBody>
    </>
  )
}
