'use client'
import { useSession } from 'next-auth/react'
import { useTranslations } from 'next-intl'
import { useQueryState } from 'nuqs'
import { Tabs, TabsContent } from '@/components/ui/tabs'
import AccountInfoForm from '@/features/account-form/ui/AccountInfoForm'
import ProfileHero from '@/features/account-profile/ui/ProfileHero'
import BackupsNav from '@/features/manage-backups/ui/BackupsNav'
import { useUser } from '@/entities/user/model/useUser'
import CoreHeader from '@/shared/ui/core-header/ui/CoreHeader'
import { PageBody } from '@/shared/ui/page-body/PageBody'
import ScrollableUnderlineTabs from '@/shared/ui/animated-tabs/ScrollableUnderlineTabs'

export default function AccountPage() {
  const { data: session } = useSession()
  const t = useTranslations('Index')
  const tAccount = useTranslations('Index.AccountPage')
  const { data: user, mutate, isLoading: userLoading } = useUser(session!.user?.id || '')
  const [tab, setTab] = useQueryState('tab', { defaultValue: 'account' })

  const tabs = [
    { value: 'account', label: t('SettingsPage.account') },
    { value: 'backups', label: t('SettingsPage.backups-tab') }
  ]

  return (
    <div className="flex flex-col pb-10">
      <CoreHeader breadcrumbs={[{ label: t('SettingsPage.account'), href: '/account' }]} />

      <PageBody variant="hero" className="max-w-3xl mx-auto w-full px-4 space-y-8">
        <ProfileHero session={session!} bio={user?.bio} wcaId={user?.wcaId} country={user?.country} mutate={mutate} />

        <Tabs value={tab} onValueChange={setTab} className="gap-8">
          <ScrollableUnderlineTabs
            items={tabs}
            activeValue={tab}
            layoutId="account-tab-indicator"
            className="max-w-sm"
          />

          <TabsContent value="account" className="space-y-6">
            <div>
              <h2 className="text-lg font-semibold tracking-tight">{tAccount('personal-info')}</h2>
              <p className="text-sm text-muted-foreground mt-1">{tAccount('personal-info-description')}</p>
            </div>

            {!userLoading && <AccountInfoForm user={user} mutate={mutate} />}
          </TabsContent>

          <TabsContent value="backups">
            <BackupsNav session={session!} />
          </TabsContent>
        </Tabs>
      </PageBody>
    </div>
  )
}
