'use client'
import { Session } from 'next-auth'
import { useTranslations } from 'next-intl'
import moment from 'moment'
import { useUser } from '@/entities/user/model/useUser'
import { FilePlus } from 'lucide-react';

export default function AccountLastBackup({ session }: { session: Session }) {
  const t = useTranslations('Index')
  const { data: user, isLoading } = useUser(session.user.id)

  return (
    <section aria-label="Last backup" className="max-w-xl">
      <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white/70 dark:bg-zinc-900/60 p-4 shadow-sm backdrop-blur">
        <div className="flex items-start gap-3">
          {/* Icon */}
          <div className="mt-0.5 shrink-0 rounded-lg bg-gradient-to-br from-sky-500/15 to-blue-500/15 p-2 ring-1 ring-inset ring-sky-500/25 dark:from-sky-400/10 dark:to-blue-400/10 dark:ring-sky-400/25">
           <FilePlus className={"text-green-400"} />
          </div>

          <div className="flex-1">
            <div className="flex items-center justify-between gap-3">
              <h3 className="text-sm font-medium text-zinc-900 dark:text-zinc-100">{t('SettingsPage.last-backup')}</h3>
              {!isLoading ? (
                user?.backup?.updatedAt ? (
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-medium text-emerald-800 dark:bg-emerald-400/15 dark:text-emerald-300">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                    Up to date
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-medium text-amber-800 dark:bg-amber-400/15 dark:text-amber-300">
                    <span className="h-1.5 w-1.5 rounded-full bg-amber-500"></span>
                    No backup
                  </span>
                )
              ) : (
                <span className="inline-flex items-center gap-1 rounded-full bg-zinc-100 px-2.5 py-0.5 text-xs font-medium text-zinc-700 dark:bg-zinc-700/40 dark:text-zinc-300">
                  Loading…
                </span>
              )}
            </div>

            <p className="mt-1.5 text-sm text-zinc-700 dark:text-zinc-300">
              {!isLoading
                ? user?.backup?.updatedAt
                  ? `${moment(user.backup.updatedAt).fromNow()}`
                  : 'There is no backup yet'
                : t('SettingsPage.fetching-last-backup')}
            </p>

            <div className="mt-3 flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400">
              <span className="select-none">Tip:</span>
              <span>Keep your data safe by backing up regularly.</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
