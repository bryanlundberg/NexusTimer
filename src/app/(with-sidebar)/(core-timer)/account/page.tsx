'use client'
import { useSession } from 'next-auth/react'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import AccountLastBackup from '@/features/account-last-backup/ui/AccountLastBackup'
import AccountHeader from '@/features/account/ui/account-header'
import AccountNotAuth from '@/features/account/ui/account-not-auth'
import { AvatarUploader } from '@/features/update-user-avatar/ui/AvatarUploader'

export default function AccountPage() {
  const { data: session } = useSession()
  const t = useTranslations('Index')

  if (!session) return <AccountNotAuth />

  return (
    <>
      <AccountHeader back="/app" label={t('SettingsPage.account')} />
      <div className="flex flex-col gap-3 justify-center items-center">
        <AvatarUploader />
        <div className="font-mono">{session.user?.email}</div>
        <Link href={`/people/${session.user?.id}`} className="w-full">
          <Button className="w-full">Open Profile</Button>
        </Link>
        <Link href={'/account/save'} className="w-full">
          <Button className="w-full" variant={'secondary'}>
            Save
          </Button>
        </Link>
        <Link href={'/account/load'} className="w-full">
          <Button className="w-full" variant={'secondary'}>
            Load
          </Button>
        </Link>
        <AccountLastBackup session={session} />
      </div>
    </>
  )
}
