'use client'

import { useMemo } from 'react'
import { motion } from 'motion/react'
import AlgorithmRender from '@/shared/ui/twisty/AlgorithmRender'
import { buildVizConfig, formatMs } from '@/features/trainer/lib/trainerUtils'
import type { RankedCase } from '@/features/trainer/lib/methodOverview'
import { useSettingsStore } from '@/shared/model/settings/useSettingsStore'
import { CHART_CONTRAST, DEFAULT_CHART_CONTRAST } from '@/shared/lib/chartContrastColor'
import { cn } from '@/shared/lib/utils'

interface TrainerCasePaceChartProps {
  ranked: RankedCase[]
  puzzle: string
  vizDefaults?: Record<string, unknown>
}

export default function TrainerCasePaceChart({ ranked, puzzle, vizDefaults }: TrainerCasePaceChartProps) {
  const colorTheme = useSettingsStore((store) => store.settings.preferences.colorTheme)
  const contrast = CHART_CONTRAST[colorTheme] ?? DEFAULT_CHART_CONTRAST

  const vizByCaseId = useMemo(() => {
    const map = new Map<string, ReturnType<typeof buildVizConfig>>()
    for (const r of ranked) {
      map.set(r.algCase.id, buildVizConfig(puzzle, r.algCase.algs?.[0]?.moves ?? '', vizDefaults))
    }
    return map
  }, [ranked, puzzle, vizDefaults])

  if (ranked.length < 2) return null

  const fastest = ranked[0].avgMs
  const slowest = ranked[ranked.length - 1].avgMs

  return (
    <div className="flex flex-col gap-1">
      {ranked.map((r, i) => {
        const isFastest = i === 0
        const widthPct = Math.max((r.avgMs / slowest) * 100, 6)
        const slowerPct = Math.round((r.avgMs / fastest - 1) * 100)
        const vizConfig = vizByCaseId.get(r.algCase.id)
        return (
          <div key={r.algCase.id} className="flex items-center gap-2" title={r.algCase.name}>
            <div className="size-7 rounded-sm overflow-hidden bg-muted/30 flex items-center justify-center shrink-0">
              {vizConfig ? <AlgorithmRender config={vizConfig} width={28} height={28} /> : null}
            </div>
            <div className="flex-1 min-w-0">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${widthPct}%` }}
                transition={{ duration: 0.4, ease: 'easeOut', delay: i * 0.03 }}
                className={cn('h-4 rounded-r-sm opacity-80', contrast.bg)}
              />
            </div>
            <div className="w-24 shrink-0 flex items-baseline justify-end gap-1.5 tabular-nums">
              <span className="text-xs font-semibold">{formatMs(r.avgMs)}s</span>
              <span className="text-[10px] text-muted-foreground">{isFastest ? '±0%' : `+${slowerPct}%`}</span>
            </div>
          </div>
        )
      })}
    </div>
  )
}
