'use client'
import { useTranslations } from 'next-intl'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import Link from 'next/link'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'
import { useSyncBackup } from '@/shared/model/backup/useSyncBackup'
import { useUser } from '@/entities/user/model/useUser'
import { BackupLoadMode } from '@/entities/backup/model/enums'
import CoreHeader from '@/shared/ui/core-header/ui/CoreHeader'

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
      toast.success('Data loaded successfully')
    } catch (error) {
      setIsLoading(false)
    }
  }

  return (
    <>
      <CoreHeader
        breadcrumbPath={'/account'}
        breadcrumb={t('SettingsPage.account')}
        secondaryBreadcrumb={t('SettingsPage.load-data-title')}
        secondaryBreadcrumbPath={'/account/load'}
      />

      <div className="p-3 max-w-2xl mx-auto mt-5">
        <p>{t('SettingsPage.load-data-description')}</p>
        <p className="text-yellow-600">{t('SettingsPage.load-data-warning')}</p>

        <div className="flex gap-2 w-full justify-between mt-5 flex-col-reverse sm:flex-row">
          <Link href={'/account'} className="flex-1">
            <Button className="w-full" variant={'secondary'}>
              {t('Inputs.back')}
            </Button>
          </Link>

          <Button className="flex-1" onClick={handleDownloadDataWrapper} disabled={!user || isLoading}>
            {isLoading ? (
              <span className="inline-flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>{t('Inputs.continue')}</span>
              </span>
            ) : (
              t('Inputs.continue')
            )}
          </Button>
        </div>
      </div>
    </>
  )
}
