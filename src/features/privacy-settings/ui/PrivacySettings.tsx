'use client'

import { useTranslations } from 'next-intl'
import { toast } from 'sonner'
import { Skeleton } from '@/components/ui/skeleton'
import { Switch } from '@/components/ui/switch'
import {
  FRIEND_REQUEST_POLICIES,
  STATS_VISIBILITIES,
  type PrivacySettings as Privacy
} from '@/entities/privacy/model/types'
import { usePrivacy } from '@/entities/privacy/model/usePrivacy'
import { triggerHaptic } from '@/shared/model/useHaptics'
import { MenuRow } from '@/features/settings/ui/MenuRow'
import { MenuSection } from '@/features/settings/ui/MenuSection'
import MenuSelectOption from '@/features/settings/ui/MenuSelectOption'
import { BlockedUsers } from '@/features/privacy-settings/ui/BlockedUsers'

type ToggleKey = Exclude<keyof Privacy, 'friendRequests' | 'statsVisibility'>

export function PrivacySettings() {
  const t = useTranslations('Index.PrivacyPage')
  const { data: privacy, update } = usePrivacy()

  const save = (patch: Partial<Privacy>) => {
    update(patch).catch(() => toast.error(t('update-failed')))
  }

  const toggle = (key: ToggleKey) => (
    <MenuRow label={t(`${key}.label`)} description={t(`${key}.description`)} htmlFor={`privacy-${key}`}>
      <Switch
        id={`privacy-${key}`}
        checked={!!privacy?.[key]}
        disabled={!privacy}
        onCheckedChange={(checked) => {
          save({ [key]: checked })
          triggerHaptic()
        }}
      />
    </MenuRow>
  )

  return (
    <div className="space-y-8">
      <MenuSection id="privacy-requests" title={t('requests-section')}>
        {privacy ? (
          <MenuSelectOption
            label={t('friendRequests.label')}
            description={t('friendRequests.description')}
            value={privacy.friendRequests}
            onValueChange={(value) => save({ friendRequests: value as Privacy['friendRequests'] })}
            options={FRIEND_REQUEST_POLICIES.map((policy) => ({
              value: policy,
              label: t(`friendRequests.${policy}`)
            }))}
          />
        ) : (
          <Skeleton className="h-16 w-full" />
        )}
        {toggle('friendRequestEmails')}
      </MenuSection>

      <MenuSection id="privacy-messages" title={t('messages-section')}>
        {toggle('readReceipts')}
        {toggle('typingIndicator')}
      </MenuSection>

      <MenuSection id="privacy-profile" title={t('profile-section')}>
        {privacy ? (
          <MenuSelectOption
            label={t('statsVisibility.label')}
            description={t('statsVisibility.description')}
            value={privacy.statsVisibility}
            onValueChange={(value) => save({ statsVisibility: value as Privacy['statsVisibility'] })}
            options={STATS_VISIBILITIES.map((visibility) => ({
              value: visibility,
              label: t(`statsVisibility.${visibility}`)
            }))}
          />
        ) : (
          <Skeleton className="h-16 w-full" />
        )}
      </MenuSection>

      <MenuSection
        id="privacy-blocked"
        title={t('blocked-section')}
        footer={t('blocked-description')}
        separators={false}
      >
        <BlockedUsers />
      </MenuSection>
    </div>
  )
}
