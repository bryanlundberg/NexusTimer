import { useTranslations } from 'next-intl'
import { useSettingsStore } from '@/shared/model/settings/useSettingsStore'
import { useTimerStore } from '@/shared/model/timer/useTimerStore'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

export default function MenuSelectDefaultStartCube() {
  const { settings } = useSettingsStore()
  const t = useTranslations('Index')
  const cubes = useTimerStore((state) => state.cubes)
  const updateSetting = useSettingsStore((state) => state.updateSetting)

  const handleCubeSelect = (cubeId: string) => {
    const defaultCubeKey = 'preferences.defaultCube'
    const newValue = cubeId === 'none' ? '' : cubes?.find((cube) => cube.id === cubeId)?.id

    if (newValue === undefined) return

    updateSetting(defaultCubeKey, newValue)
  }

  const defaultCube = settings.preferences.defaultCube

  return (
    <div className="px-3 py-2 transition-colors hover:bg-muted/30">
      <div className="flex justify-between items-center gap-3">
        <div className="flex flex-col gap-0.5 min-w-0">
          <span className="text-sm font-medium leading-tight">{t('Settings-menu.auto-select')}</span>
          <span className="text-xs text-muted-foreground leading-snug">
            {t('Settings-descriptions.auto-select-description')}
          </span>
        </div>
        <Select defaultValue={defaultCube || 'none'} value={defaultCube || 'none'} onValueChange={handleCubeSelect}>
          <SelectTrigger className="w-[140px] sm:w-[180px] shrink-0 bg-background">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">{t('Inputs.none')}</SelectItem>
            {cubes?.map((cube) => {
              return (
                <SelectItem value={cube.id} key={cube.id}>
                  {cube.name}
                </SelectItem>
              )
            })}
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}
