'use client'
import { useTranslations } from 'next-intl'
import { Button } from '@/components/ui/button'
import CustomAveragesModal from '@/features/deep-statistics/ui/CustomAveragesModal'
import {
  DEFAULT_RAIL_AVERAGES,
  DEFAULT_TIMER_AVERAGES,
  DESKTOP_MIN_WIDTH,
  resolveAverages
} from '@/shared/lib/statistics/averageSizes'
import { useMinWidth } from '@/shared/model/use-min-width'
import { useOverlayStore } from '@/shared/model/overlay-store/useOverlayStore'
import { useSettingsStore } from '@/shared/model/settings/useSettingsStore'
import { MenuRow } from './MenuRow'

export default function MenuTimerAverages() {
  const t = useTranslations('Index')
  const open = useOverlayStore((store) => store.open)
  const isDesktop = useMinWidth(DESKTOP_MIN_WIDTH)
  const stored = useSettingsStore((store) =>
    isDesktop ? store.settings.features.railAverages : store.settings.features.timerAverages
  )
  const label = t('Settings-menu.timer-averages')
  const summary = resolveAverages(stored, isDesktop ? DEFAULT_RAIL_AVERAGES : DEFAULT_TIMER_AVERAGES)
    .map((size) => `Ao${size}`)
    .join(' · ')

  return (
    <MenuRow label={label} description={t('Settings-descriptions.timer-averages')} stack>
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() =>
          open({ id: 'custom-averages', component: <CustomAveragesModal target={isDesktop ? 'rail' : 'timer'} /> })
        }
        aria-label={`${label}: ${summary}`}
        className="h-auto min-h-9 whitespace-normal py-1.5 font-mono text-xs tabular-nums sm:max-w-64"
      >
        {summary}
      </Button>
    </MenuRow>
  )
}
