'use client'
import { Session } from 'next-auth'
import { useTranslations } from 'next-intl'
import moment from 'moment'
import { useUser } from '@/entities/user/model/useUser'

export default function AccountLastBackup({ session }: { session: Session }) {
  const t = useTranslations('Index')
  const { data: user, isLoading } = useUser(session.user.id)

  return (
    <>
      <div>
        {!isLoading
          ? user?.backup?.updatedAt
            ? `${t('SettingsPage.last-backup')} ${moment(user.backup.updatedAt).format('DD/MMMM/YYYY HH:mm:ss')}`
            : 'There is no backup yet'
          : t('SettingsPage.fetching-last-backup')}
      </div>
    </>
  )
}
