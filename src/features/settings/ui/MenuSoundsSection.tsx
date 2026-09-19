import { useTranslations } from 'next-intl'
import { SoundsIcon } from '@/components/ui/settings-icons'
import { MenuSection } from './MenuSection'
import { MenuOption } from './MenuOption'
import MenuSelectVoiceGender from './MenuSelectVoiceGender'
import { SECTION_ACCENTS } from '../lib/settingsSections'

export default function MenuSoundsSection({ control }: { control: any }) {
  const t = useTranslations('Index')

  return (
    <MenuSection id="sounds" accent={SECTION_ACCENTS['sounds']} icon={<SoundsIcon />} title={t('Settings-menu.sounds')}>
      <MenuOption
        name={'sounds.newPersonalBest'}
        label={t('Settings-menu.newPersonalBest')}
        control={control}
        description={t('Settings-descriptions.new-personal-best-sound')}
      />
      <MenuOption
        name={'sounds.inspection'}
        label={t('Settings-menu.inspection-sound')}
        control={control}
        description={t('Settings-descriptions.inspection-sound')}
      />
      <MenuOption
        name={'sounds.newRound'}
        label={t('Settings-menu.new-round-sound')}
        control={control}
        description={t('Settings-descriptions.new-round-sound')}
      />
      <MenuOption
        name={'sounds.messageReceived'}
        label={t('Settings-menu.message-received-sound')}
        control={control}
        description={t('Settings-descriptions.message-received-sound')}
      />
      <MenuOption
        name={'sounds.messageSent'}
        label={t('Settings-menu.message-sent-sound')}
        control={control}
        description={t('Settings-descriptions.message-sent-sound')}
      />
      <MenuOption
        name={'sounds.newFriend'}
        label={t('Settings-menu.new-friend-sound')}
        control={control}
        description={t('Settings-descriptions.new-friend-sound')}
      />
      <MenuSelectVoiceGender />
    </MenuSection>
  )
}
