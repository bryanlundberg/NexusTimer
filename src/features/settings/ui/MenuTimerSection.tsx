import { useTranslations } from 'next-intl'
import { LapTimerIcon } from '@radix-ui/react-icons'
import { MenuSection } from './MenuSection'
import { MenuOption } from './MenuOption'
import MenuInputOption from './MenuInputOption'
import MenuSelectActivationKey from './MenuSelectActivationKey'
import { SECTION_ACCENTS } from '../lib/settingsSections'

export default function MenuTimerSection({ control }: { control: any }) {
  const t = useTranslations('Index')

  return (
    <MenuSection id="timer" accent={SECTION_ACCENTS['timer']} icon={<LapTimerIcon />} title={t('Settings-menu.timer')}>
      <MenuSelectActivationKey />
      <MenuOption
        label={t('Settings-menu.inspection')}
        name={'timer.inspection'}
        control={control}
        description={t('Settings-descriptions.inspection')}
      />
      <MenuInputOption
        name={'timer.inspectionTime'}
        label={t('Settings-menu.inspection-time')}
        control={control}
        inputProps={{ min: 5000, max: 60000, step: 1000 }}
        description={t('Settings-descriptions.inspection-time')}
      />
      <MenuOption
        name={'timer.startCue'}
        label={t('Settings-menu.start-cue')}
        control={control}
        description={t('Settings-descriptions.start-cue')}
      />
      <MenuOption
        name={'timer.holdToStart'}
        label={t('Settings-menu.hold-to-start')}
        control={control}
        description={t('Settings-descriptions.hold-to-start')}
      />
      <MenuInputOption
        name={'timer.holdToStartTime'}
        label={t('Settings-menu.hold-to-start-time')}
        control={control}
        inputProps={{ min: 300, max: 1000, step: 100 }}
        description={t('Settings-descriptions.hold-to-start-time')}
      />
      <MenuInputOption
        name={'timer.decimals'}
        label={t('Settings-menu.decimal-places')}
        control={control}
        inputProps={{ max: 3, min: 1, step: 1 }}
        description={t('Settings-descriptions.decimal-places')}
      />
    </MenuSection>
  )
}
