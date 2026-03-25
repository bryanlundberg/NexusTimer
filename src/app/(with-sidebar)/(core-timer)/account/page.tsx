'use client'
import { useSession } from 'next-auth/react'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import AccountLastBackup from '@/features/account-last-backup/ui/AccountLastBackup'
import { AvatarUploader } from '@/features/update-user-avatar/ui/AvatarUploader'
import AccountInfoForm from '@/features/account-form/ui/AccountInfoForm'
import { useUser } from '@/entities/user/model/useUser'
import { SquareArrowOutUpRight, CloudUpload, CloudDownload, ChevronRight, Mail } from 'lucide-react'
import CoreHeader from '@/shared/ui/core-header/ui/CoreHeader'
import { Separator } from '@/components/ui/separator'

export default function AccountPage() {
  const { data: session } = useSession()
  const t = useTranslations('Index')
  const { data: user, mutate, isLoading: userLoading } = useUser(session!.user?.id || '')
  const tAccount = useTranslations('Index.AccountPage')

  return (
    <div className="flex flex-col pb-10">
      <CoreHeader breadcrumbPath={'/account'} breadcrumb={t('SettingsPage.account')} />

      <div className="max-w-3xl mx-auto w-full px-4 mt-6 space-y-10">
        {/* Profile Hero Section */}
        <section className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
          <AvatarUploader />

          <div className="flex flex-col items-center sm:items-start gap-2 min-w-0 flex-1">
            <h1 className="text-2xl font-bold tracking-tight truncate">{session?.user?.name}</h1>

            <div className="flex items-center gap-2 text-muted-foreground text-sm">
              <Mail className="size-3.5" />
              <span className="truncate">{session?.user?.email}</span>
            </div>

            {user?.bio && <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{user.bio}</p>}

            <div className="flex items-center gap-2 mt-3">
              <Link href={`/people/${session!.user?.id}`}>
                <Button variant="outline" size="sm" className="gap-2">
                  {tAccount('go-to-profile')}
                  <SquareArrowOutUpRight className="size-3.5" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        <Separator />

        {/* Personal Information Form */}
        <section className="space-y-6">
          <div>
            <h2 className="text-lg font-semibold tracking-tight">{tAccount('personal-info')}</h2>
            <p className="text-sm text-muted-foreground mt-1">{tAccount('personal-info-description')}</p>
          </div>

          {!userLoading && <AccountInfoForm user={user} mutate={mutate} />}
        </section>

        <Separator />

        {/* Data & Backup Section */}
        <section className="space-y-5">
          <div>
            <h2 className="text-lg font-semibold tracking-tight">{t('SettingsPage.cloud-sync')}</h2>
            <p className="text-sm text-muted-foreground mt-1">{t('SettingsPage.backup-tip')}</p>
          </div>

          <AccountLastBackup session={session!} />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Link href="/account/save" className="group">
              <div className="flex items-center gap-4 p-4 rounded-xl border border-border/60 hover:border-primary/30 hover:bg-accent/50 transition-all">
                <div className="shrink-0 flex items-center justify-center size-10 rounded-lg bg-primary/10 text-primary">
                  <CloudUpload className="size-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">{t('SettingsPage.save-data-title')}</p>
                  <p className="text-xs text-muted-foreground truncate">{t('SettingsPage.save-data-description')}</p>
                </div>
                <ChevronRight className="size-4 text-muted-foreground group-hover:text-primary transition-colors" />
              </div>
            </Link>

            <Link href="/account/load" className="group">
              <div className="flex items-center gap-4 p-4 rounded-xl border border-border/60 hover:border-primary/30 hover:bg-accent/50 transition-all">
                <div className="shrink-0 flex items-center justify-center size-10 rounded-lg bg-primary/10 text-primary">
                  <CloudDownload className="size-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">{t('SettingsPage.load-data-title')}</p>
                  <p className="text-xs text-muted-foreground truncate">{t('SettingsPage.load-data-description')}</p>
                </div>
                <ChevronRight className="size-4 text-muted-foreground group-hover:text-primary transition-colors" />
              </div>
            </Link>
          </div>
        </section>
      </div>
    </div>
  )
}
