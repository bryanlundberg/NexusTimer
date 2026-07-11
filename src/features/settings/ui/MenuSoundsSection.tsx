import { useTranslations } from 'next-intl'
import { SpeakerLoudIcon } from '@radix-ui/react-icons'
import { MenuSection } from './MenuSection'
import { MenuOption } from './MenuOption'
import MenuSelectVoiceGender from './MenuSelectVoiceGender'
import { SECTION_ACCENTS } from '../lib/settingsSections'

export default function MenuSoundsSection({ control }: { control: any }) {
  const t = useTranslations('Index')

  return (
    <MenuSection
      id="sounds"
      accent={SECTION_ACCENTS['sounds']}
      icon={<SpeakerLoudIcon />}
      title={t('Settings-menu.sounds')}
    >
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
        name={'sounds.favorite'}
        label={t('Settings-menu.favorite-sound')}
        control={control}
        description={t('Settings-descriptions.favorite-sound')}
      />
      <MenuOption
        name={'sounds.trash'}
        label={t('Settings-menu.trash-sound')}
        control={control}
        description={t('Settings-descriptions.trash-sound')}
      />
      <MenuSelectVoiceGender />
    </MenuSection>
  )
}
