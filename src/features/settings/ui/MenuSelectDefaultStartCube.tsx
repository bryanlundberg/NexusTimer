import { useTranslations } from 'next-intl'
import { useSettingsStore } from '@/shared/model/settings/useSettingsStore'
import { useTimerStore } from '@/shared/model/timer/useTimerStore'
import MenuSelectOption from './MenuSelectOption'

const NONE_VALUE = 'none'

export default function MenuSelectDefaultStartCube() {
  const t = useTranslations('Index')
  const cubes = useTimerStore((state) => state.cubes)
  const defaultCube = useSettingsStore((state) => state.settings.preferences.defaultCube)
  const updateSetting = useSettingsStore((state) => state.updateSetting)

  const handleSelect = (cubeId: string) => {
    if (cubeId === NONE_VALUE) {
      updateSetting('preferences.defaultCube', '')
      return
    }
    const exists = cubes?.find((cube) => cube.id === cubeId)
    if (!exists) return
    updateSetting('preferences.defaultCube', exists.id)
  }

  return (
    <MenuSelectOption
      label={t('Settings-menu.auto-select')}
      description={t('Settings-descriptions.auto-select-description')}
      value={defaultCube || NONE_VALUE}
      onValueChange={handleSelect}
      options={[
        { value: NONE_VALUE, label: t('Inputs.none') },
        ...(cubes?.map((cube) => ({ value: cube.id, label: cube.name })) ?? [])
      ]}
    />
  )
}
