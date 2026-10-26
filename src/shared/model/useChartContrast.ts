import { useSettingsStore } from '@/shared/model/settings/useSettingsStore'
import { CHART_CONTRAST, DEFAULT_CHART_CONTRAST, type ChartContrast } from '@/shared/lib/chartContrastColor'
import { supportsVivid } from '@/shared/lib/vividColorScheme'

/** The fixed complements are tuned for neutral surfaces; on a vivid one the generated ramp already clears 3:1. */
const VIVID_CHART_CONTRAST: ChartContrast = { bg: 'bg-chart-2', stroke: 'stroke-chart-2', hex: 'var(--chart-2)' }

export function useChartContrast(): ChartContrast {
  const colorTheme = useSettingsStore((store) => store.settings.preferences.colorTheme)
  const vivid = useSettingsStore((store) => store.settings.preferences.vivid)

  if (vivid && supportsVivid(colorTheme)) return VIVID_CHART_CONTRAST
  return CHART_CONTRAST[colorTheme] ?? DEFAULT_CHART_CONTRAST
}
