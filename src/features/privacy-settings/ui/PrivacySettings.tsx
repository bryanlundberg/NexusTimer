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
import { FormSection } from '@/features/account-form/ui/FormSection'
import { MenuRow } from '@/features/settings/ui/MenuRow'
import MenuSelectOption from '@/features/settings/ui/MenuSelectOption'
import { BlockedUsers } from '@/features/privacy-settings/ui/BlockedUsers'

type ToggleKey = Exclude<keyof Privacy, 'friendRequests' | 'statsVisibility'>

function Rows({ children }: { children: React.ReactNode }) {
  return <div className="divide-y divide-border/40 border border-border/60 bg-card/40">{children}</div>
}

export function PrivacySettings() {
  const t = useTranslations('Index.PrivacyPage')
  const { data: privacy, update } = usePrivacy()

  const save = (patch: Partial<Privacy>) => {
    update(patch).catch(() => toast.error(t('update-failed')))
  }

  const toggle = (key: ToggleKey) => (
    <MenuRow label={t(`${key}.label`)} description={t(`${key}.description`)}>
      <Switch checked={!!privacy?.[key]} disabled={!privacy} onCheckedChange={(checked) => save({ [key]: checked })} />
    </MenuRow>
  )

  return (
    <div className="space-y-8">
      <FormSection id="privacy-requests" title={t('requests-section')}>
        <Rows>
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
        </Rows>
      </FormSection>

      <FormSection id="privacy-messages" title={t('messages-section')}>
        <Rows>
          {toggle('readReceipts')}
          {toggle('typingIndicator')}
        </Rows>
      </FormSection>

      <FormSection id="privacy-profile" title={t('profile-section')}>
        <Rows>
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
        </Rows>
      </FormSection>

      <FormSection id="privacy-blocked" title={t('blocked-section')} description={t('blocked-description')}>
        <BlockedUsers />
      </FormSection>
    </div>
  )
}
