'use client'
import { useTranslations } from 'next-intl'
import CoreHeader from '@/shared/ui/core-header/ui/CoreHeader'
import { PageBody } from '@/shared/ui/page-body/PageBody'
import { AvatarBuilder } from '@/features/avatar-builder/ui/AvatarBuilder'

export default function AccountAvatarPage() {
  const t = useTranslations('Index')

  return (
    <>
      <CoreHeader
        breadcrumbs={[
          { label: t('SettingsPage.account'), href: '/account' },
          { label: t('AvatarBuilder.title'), href: '/account/avatar' }
        ]}
      />

      <PageBody variant="hero" className="mx-auto w-full max-w-5xl px-3 pb-10 sm:px-4">
        <AvatarBuilder />
      </PageBody>
    </>
  )
}
