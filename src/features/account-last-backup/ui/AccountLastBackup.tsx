'use client'
import { Session } from 'next-auth'
import { useLocale, useTranslations } from 'next-intl'
import moment from 'moment'
import { useUser } from '@/entities/user/model/useUser'
import { Clock, CheckCircle2, AlertCircle } from 'lucide-react'

export default function AccountLastBackup({ session }: { session: Session }) {
  const t = useTranslations('Index')
  const { data: user, isLoading } = useUser(session.user.id)
  const locale = useLocale()

  const hasBackup = user?.backup?.updatedAt
  const timeAgo = hasBackup ? moment(user.backup.updatedAt).locale(locale).fromNow() : null

  return (
    <div className="flex items-center gap-4 p-4 rounded-xl bg-muted/40 border border-border/40">
      <div className="shrink-0 flex items-center justify-center size-10 rounded-lg bg-background border border-border/60">
        <Clock className="size-5 text-muted-foreground" />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className="text-sm font-medium">{t('SettingsPage.last-backup')}</p>
          {!isLoading &&
            (hasBackup ? (
              <span className="inline-flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 className="size-3" />
                {t('SettingsPage.up-to-date')}
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-xs text-amber-600 dark:text-amber-400">
                <AlertCircle className="size-3" />
                {t('SettingsPage.no-backup')}
              </span>
            ))}
        </div>
        <p className="text-xs text-muted-foreground mt-0.5">
          {isLoading ? t('SettingsPage.fetching-last-backup') : timeAgo ? timeAgo : t('SettingsPage.no-backup-yet')}
        </p>
      </div>
    </div>
  )
}
