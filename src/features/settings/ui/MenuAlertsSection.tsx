import { useTranslations } from 'next-intl'
import { MenuSection } from './MenuSection'
import { MenuOption } from './MenuOption'

export default function MenuAlertsSection({ control }: { control: any }) {
  const t = useTranslations('Index')

  return (
    <MenuSection id="alerts" title={t('Settings-menu.alerts')}>
      <MenuOption
        name={'alerts.bestTime'}
        label={t('Settings-menu.best-time')}
        control={control}
        description={t('Settings-descriptions.best-time-alert')}
      />
      <MenuOption
        name={'alerts.bestAverage'}
        label={t('Settings-menu.best-average')}
        control={control}
        description={t('Settings-descriptions.best-average-alert')}
      />
      <MenuOption
        name={'alerts.worstTime'}
        label={t('Settings-menu.worst-time')}
        control={control}
        description={t('Settings-descriptions.worst-time-alert')}
      />
      <MenuOption
        name={'alerts.solveDelta'}
        label={t('Settings-menu.solve-delta')}
        control={control}
        description={t('Settings-descriptions.solve-delta')}
      />
    </MenuSection>
  )
}
