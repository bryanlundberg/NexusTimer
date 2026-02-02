'use client'
import { useSession } from 'next-auth/react'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import AccountLastBackup from '@/features/account-last-backup/ui/AccountLastBackup'
import { AvatarUploader } from '@/features/update-user-avatar/ui/AvatarUploader'
import AccountInfoForm from '@/features/account-form/ui/AccountInfoForm'
import { useUser } from '@/entities/user/model/useUser'
import { SquareArrowOutUpRight } from 'lucide-react'
import CoreHeader from '@/shared/ui/core-header/ui/CoreHeader'

export default function AccountPage() {
  const { data: session } = useSession()
  const t = useTranslations('Index')
  const { data: user, mutate, isLoading: userLoading } = useUser(session!.user?.id || '')
  const tAccount = useTranslations('Index.AccountPage')

  return (
    <div className="flex flex-col gap-6">
      <CoreHeader breadcrumbPath={'/account'} breadcrumb={t('SettingsPage.account')} />

      <div className="flex flex-col gap-3 justify-center max-w-5xl mx-auto">
        <AvatarUploader />
        <div className={'h-2'} />
        <AccountLastBackup session={session!} />

        <Link href={`/people/${session!.user?.id}`} className="w-full">
          <Button className="w-full">
            {tAccount('go-to-profile')} <SquareArrowOutUpRight />
          </Button>
        </Link>

        {!userLoading && <AccountInfoForm user={user} mutate={mutate} />}
      </div>
    </div>
  )
}
