'use client'
import { useTranslations } from 'next-intl'
import { useSession } from 'next-auth/react'
import { useUser } from '@/hooks/api/useUser'
import { useRouter } from 'next/navigation'
import { BackupLoadMode } from '@/enums/BackupLoadMode'
import { toast } from 'sonner'
import { Card } from '@/components/ui/card'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import AccountHeader from '@/features/account/ui/account-header'
import { useSyncBackup } from '@/shared/model/backup/useSyncBackup'

export default function AccountLoadPage() {
  const t = useTranslations('Index')
  const { handleDownloadData } = useSyncBackup()
  const { data: session } = useSession()
  const { data: user } = useUser(session?.user?.id!)
  const router = useRouter()

  const handleDownloadDataWrapper = async () => {
    if (!user) return
    await handleDownloadData({ user, mode: BackupLoadMode.MERGE })
    router.push('/account')
    toast.success('Data loaded successfully')
  }

  return (
    <>
      <AccountHeader back="/app" label={t('SettingsPage.load-data-title')} />

      <Card className="p-3 bg-secondary/10">
        <p>{t('SettingsPage.load-data-description')}</p>
        <p className="text-yellow-600">{t('SettingsPage.load-data-warning')}</p>

        <div className="flex gap-2 w-full justify-between mt-5 flex-col-reverse sm:flex-row">
          <Link href={'/account'} className="flex-1">
            <Button className="w-full" variant={'secondary'}>
              {t('Inputs.back')}
            </Button>
          </Link>

          <Button className="flex-1" onClick={handleDownloadDataWrapper} disabled={!user}>
            {t('Inputs.continue')}
          </Button>
        </div>
      </Card>
    </>
  )
}
