'use client'
import { useTranslations } from 'next-intl'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import Link from 'next/link'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { CloudDownload, Info, Loader2 } from 'lucide-react'
import { useSyncBackup } from '@/shared/model/backup/useSyncBackup'
import { useUser } from '@/entities/user/model/useUser'
import CoreHeader from '@/shared/ui/core-header/ui/CoreHeader'
import { PageBody } from '@/shared/ui/page-body/PageBody'

export default function AccountLoadPage() {
  const t = useTranslations('Index')
  const { handleDownloadData } = useSyncBackup()
  const { data: session } = useSession()
  const { data: user } = useUser(session?.user?.id!)
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

  return (
    <>
      <CoreHeader
        breadcrumbs={[
          { label: t('SettingsPage.account'), href: '/account' },
          { label: t('SettingsPage.load-data-title'), href: '/account/load' }
        ]}
      />

      <PageBody variant="hero" className="mx-auto w-full max-w-md px-4 pb-8" aria-busy={isLoading}>
        <div className="flex flex-col items-center pt-8 text-center">
          <CloudDownload className="size-8 text-muted-foreground" />
          <h1 className="mt-4 text-xl font-semibold tracking-tight">{t('SettingsPage.load-data-title')}</h1>
          <p className="mt-2 text-sm text-muted-foreground">{t('SettingsPage.load-data-description')}</p>
        </div>

        <div className="mt-6 flex items-start gap-3 rounded-xl border border-sky-500/20 bg-sky-500/5 p-3.5">
          <Info className="mt-0.5 size-4 shrink-0 text-sky-500" />
          <p className="text-xs leading-relaxed text-sky-600 dark:text-sky-400">
            {t('SettingsPage.load-data-warning')}
          </p>
        </div>

        <div className="mt-8 flex flex-col gap-2">
          <Button onClick={handleDownloadDataWrapper} disabled={!user || isLoading}>
            {isLoading ? (
              <span className="inline-flex items-center gap-2">
                <Loader2 className="size-4 animate-spin" />
                {t('SettingsPage.load-data-action')}
              </span>
            ) : (
              t('SettingsPage.load-data-action')
            )}
          </Button>

          <Link
            href="/account"
            aria-disabled={isLoading}
            onClick={(e) => {
              if (isLoading) e.preventDefault()
            }}
          >
            <Button variant="ghost" className="w-full" disabled={isLoading}>
              {t('Inputs.back')}
            </Button>
          </Link>
        </div>
      </PageBody>
    </>
  )
}
