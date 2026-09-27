import { useTranslations } from 'next-intl'
import { MenuSection } from './MenuSection'
import { MenuOption } from './MenuOption'
import MenuInputOption from './MenuInputOption'
import MenuSegmentedOption from './MenuSegmentedOption'
import MenuSelectActivationKey from './MenuSelectActivationKey'

export default function MenuTimerSection({ control }: { control: any }) {
  const t = useTranslations('Index')

  return (
    <MenuSection id="timer" title={t('Settings-menu.timer')}>
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
        min={5000}
        max={60000}
        step={1000}
        scale={1000}
        unit="s"
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
        min={300}
        max={1000}
        step={100}
        unit="ms"
        description={t('Settings-descriptions.hold-to-start-time')}
      />
      <MenuSegmentedOption
        name={'timer.decimals'}
        label={t('Settings-menu.decimal-places')}
        control={control}
        options={[1, 2, 3]}
        description={t('Settings-descriptions.decimal-places')}
      />
    </MenuSection>
  )
}
