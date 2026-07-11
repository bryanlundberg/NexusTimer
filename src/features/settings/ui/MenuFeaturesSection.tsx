import { useTranslations } from 'next-intl'
import { MagicWandIcon } from '@radix-ui/react-icons'
import { MenuSection } from './MenuSection'
import { MenuOption } from './MenuOption'
import MenuSelectScrambleSize from './MenuSelectScrambleSize'
import { SECTION_ACCENTS } from '../lib/settingsSections'

export default function MenuFeaturesSection({ control }: { control: any }) {
  const t = useTranslations('Index')

  return (
    <MenuSection
      id="features"
      accent={SECTION_ACCENTS['features']}
      icon={<MagicWandIcon />}
      title={t('Settings-menu.features')}
    >
      <MenuOption
        name={'features.scrambleImage'}
        label={t('Settings-menu.scramble-image')}
        control={control}
        description={t('Settings-descriptions.scramble-image')}
      />
      <MenuOption
        name={'features.sessionStats'}
        label={t('Settings-menu.session-stats')}
        control={control}
        description={t('Settings-descriptions.session-stats')}
      />
      <MenuOption
        name={'features.quickActionButtons'}
        label={t('Settings-menu.quick-action-buttons')}
        control={control}
        description={t('Settings-descriptions.quick-action-buttons')}
      />
      <MenuOption
        name={'features.hideWhileSolving'}
        label={t('Settings-menu.hide-while-solving')}
        control={control}
        description={t('Settings-descriptions.hide-while-solving')}
      />
      <MenuOption
        name={'features.scrambleBackground'}
        label={t('Settings-menu.scramble-background')}
        control={control}
        description={t('Settings-descriptions.scramble-background')}
      />
      <MenuSelectScrambleSize />
      <MenuOption
        name={'features.haptics'}
        label={t('Settings-menu.haptics')}
        control={control}
        description={t('Settings-descriptions.haptics')}
      />
    </MenuSection>
  )
}
