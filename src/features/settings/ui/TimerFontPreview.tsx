'use client'
import { useSettingsStore } from '@/shared/model/settings/useSettingsStore'
import { getDecimalPart, getIntegerPart } from '@/shared/lib/formatTimeParts'
import { cn } from '@/shared/lib/utils'
import DigitCells from '@/shared/ui/digit-cells/DigitCells'
import { timerFontClass } from '@/features/timer/model/timerFonts'
import { timerScale } from '@/features/timer/model/timerSize'
import { useTimerFit } from '@/features/timer/model/useTimerFit'

const SAMPLE_TIME_MS = 83456
const ALL_DIGITS = '0123456789'
const FIT_TEXT = 'text-[length:calc(var(--t)*var(--timer-scale,1)*var(--timer-fit,1))]'

export default function TimerFontPreview() {
  const timerFont = useSettingsStore((state) => state.settings.features.timerFont)
  const timerSize = useSettingsStore((state) => state.settings.features.timerSize)
  const decimals = useSettingsStore((state) => state.settings.timer.decimals)
  const fitRef = useTimerFit()

  return (
    <div aria-hidden className="px-4 pb-4">
      <div
        style={{ '--timer-scale': timerScale(timerSize) } as React.CSSProperties}
        className={cn(
          'surface surface-well flex flex-col items-center gap-3 px-4 py-5 leading-none font-normal whitespace-nowrap',
          timerFontClass(timerFont)
        )}
      >
        <div ref={fitRef} className="flex w-full items-baseline justify-center">
          <span className={cn(FIT_TEXT, '[--t:3rem] sm:[--t:3.75rem]')}>
            <DigitCells text={getIntegerPart(SAMPLE_TIME_MS)} />
          </span>
          <span className={cn(FIT_TEXT, 'opacity-60 [--t:1.875rem] sm:[--t:2.25rem]')}>
            <DigitCells text={getDecimalPart(SAMPLE_TIME_MS, decimals)} />
          </span>
        </div>
        <span className="text-xl text-muted-foreground sm:text-2xl">
          <DigitCells text={ALL_DIGITS} />
        </span>
      </div>
    </div>
  )
}
