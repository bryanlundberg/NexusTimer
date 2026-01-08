'use client'
import { useSession } from 'next-auth/react'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import AccountLastBackup from '@/features/account-last-backup/ui/AccountLastBackup'
import AccountHeader from '@/features/account/ui/account-header'
import { AvatarUploader } from '@/features/update-user-avatar/ui/AvatarUploader'
import AccountInfoForm from '@/features/account-form/ui/AccountInfoForm'
import { useUser } from '@/entities/user/model/useUser'
import { SquareArrowOutUpRight } from 'lucide-react'

export default function AccountPage() {
  const { data: session } = useSession()
  const t = useTranslations('Index')
  const { data: user, mutate, isLoading: userLoading } = useUser(session!.user?.id || '')
  const tAccount = useTranslations('Index.AccountPage')

  return (
    <div className="flex flex-col gap-6 pb-10">
      <AccountHeader back="/app" label={t('SettingsPage.account')} />

      <div className="flex flex-col gap-3 justify-center">
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
