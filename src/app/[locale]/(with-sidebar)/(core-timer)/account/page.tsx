'use client'
import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { useTranslations } from 'next-intl'
import { useQueryState } from 'nuqs'
import { Tabs, TabsContent } from '@/components/ui/tabs'
import AccountInfoForm from '@/features/account-form/ui/AccountInfoForm'
import type { ProfilePreview } from '@/features/account-form/model/types'
import ProfileHero from '@/features/account-profile/ui/ProfileHero'
import BackupsNav from '@/features/manage-backups/ui/BackupsNav'
import { PrivacySettings } from '@/features/privacy-settings/ui/PrivacySettings'
import { useUser } from '@/entities/user/model/useUser'
import CoreHeader from '@/shared/ui/core-header/ui/CoreHeader'
import { PageBody } from '@/shared/ui/page-body/PageBody'
import ScrollableUnderlineTabs from '@/shared/ui/animated-tabs/ScrollableUnderlineTabs'

export default function AccountPage() {
  const { data: session } = useSession()
  const t = useTranslations('Index')
  const { data: user, mutate, isLoading: userLoading } = useUser(session?.user?.id)
  const [tab, setTab] = useQueryState('tab', { defaultValue: 'account' })
  const [preview, setPreview] = useState<ProfilePreview | null>(null)

  const tabs = [
    { value: 'account', label: t('SettingsPage.account') },
    { value: 'privacy', label: t('PrivacyPage.tab') },
    { value: 'backups', label: t('SettingsPage.backups-tab') }
  ]

  const hero = preview ?? user
  const header = <CoreHeader breadcrumbs={[{ label: t('SettingsPage.account'), href: '/account' }]} />

  if (!session) return <div className="flex flex-col pb-10">{header}</div>

  return (
    <div className="flex flex-col pb-10">
      {header}

      <PageBody variant="hero" className="max-w-3xl mx-auto w-full px-4 space-y-8">
        <ProfileHero
          session={session}
          name={hero?.name}
          isPreview={!!preview}
          bio={hero?.bio}
          wcaId={user?.wcaId}
          country={hero?.country}
          method={hero?.method}
          mainColors={hero?.mainColors}
          links={hero?.links}
          mutate={mutate}
        />

        <Tabs value={tab} onValueChange={setTab} className="gap-8">
          <ScrollableUnderlineTabs
            items={tabs}
            activeValue={tab}
            layoutId="account-tab-indicator"
            className="max-w-sm"
          />

          <TabsContent value="account" forceMount className="data-[state=inactive]:hidden">
            {!userLoading && <AccountInfoForm user={user} mutate={mutate} onPreviewChange={setPreview} />}
          </TabsContent>

          <TabsContent value="privacy">
            <PrivacySettings />
          </TabsContent>

          <TabsContent value="backups">
            <BackupsNav />
          </TabsContent>
        </Tabs>
      </PageBody>
    </div>
  )
}
