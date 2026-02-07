'use client'
import { useSession } from 'next-auth/react'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import AccountLastBackup from '@/features/account-last-backup/ui/AccountLastBackup'
import { AvatarUploader } from '@/features/update-user-avatar/ui/AvatarUploader'
import AccountInfoForm from '@/features/account-form/ui/AccountInfoForm'
import { useUser } from '@/entities/user/model/useUser'
import { SquareArrowOutUpRight, User } from 'lucide-react'
import CoreHeader from '@/shared/ui/core-header/ui/CoreHeader'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'

export default function AccountPage() {
  const { data: session } = useSession()
  const t = useTranslations('Index')
  const { data: user, mutate, isLoading: userLoading } = useUser(session!.user?.id || '')
  const tAccount = useTranslations('Index.AccountPage')

  return (
    <div className="flex flex-col gap-8 pb-10">
      <CoreHeader breadcrumbPath={'/account'} breadcrumb={t('SettingsPage.account')} />

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 max-w-6xl mx-auto w-full px-4">
        {/* Left Column: Profile Overview */}
        <div className="md:col-span-4 flex flex-col gap-6">
          <Card className="overflow-hidden border-none shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl flex items-center gap-2">
                <User className="size-5 text-primary" />
                {tAccount('profile')}
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center text-center gap-4">
              <AvatarUploader />

              <div className="space-y-1 mt-2">
                <h3 className="font-semibold text-lg">{session?.user?.name}</h3>
                <p className="text-sm text-muted-foreground line-clamp-1">{session?.user?.email}</p>
              </div>

              <Separator className="my-2" />

              <Link href={`/people/${session!.user?.id}`} className="w-full">
                <Button variant="outline" className="w-full group">
                  {tAccount('go-to-profile')} <SquareArrowOutUpRight className="ml-2 size-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          <AccountLastBackup session={session!} />
        </div>

        {/* Right Column: Personal Information Form */}
        <div className="md:col-span-8">
          <Card className="border-none shadow-md">
            <CardHeader>
              <CardTitle className="text-2xl">{tAccount('personal-info')}</CardTitle>
              <CardDescription>{tAccount('personal-info-description')}</CardDescription>
            </CardHeader>
            <CardContent>{!userLoading && <AccountInfoForm user={user} mutate={mutate} />}</CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
