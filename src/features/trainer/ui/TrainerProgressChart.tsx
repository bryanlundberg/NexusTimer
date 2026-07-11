'use client'

import { useMemo } from 'react'
import { Area, AreaChart, CartesianGrid, ReferenceLine, XAxis, YAxis } from 'recharts'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'
import type { ChartConfig } from '@/components/ui/chart'
import type { TrainerSolveListItem } from '@/features/trainer/model/types'

interface TrainerProgressChartProps {
  solves: TrainerSolveListItem[]
  targetMs?: number
  label: string
}

export default function TrainerProgressChart({ solves, targetMs, label }: TrainerProgressChartProps) {
  // Solves arrive newest-first; the chart reads left to right chronologically.
  const data = useMemo(
    () =>
      [...solves]
        .reverse()
        .filter((s) => s.penalty !== 'DNF')
        .map((s, i) => ({ index: i + 1, seconds: +(s.timeMs / 1000).toFixed(2) })),
    [solves]
  )

  const config = {
    seconds: { label, color: 'var(--cube-blue)' }
  } satisfies ChartConfig

  if (data.length < 2) return null

  return (
    <ChartContainer config={config} className="h-32 w-full">
      <AreaChart data={data} margin={{ top: 4, right: 4, left: 4, bottom: 0 }}>
        <CartesianGrid vertical={false} strokeDasharray="3 3" />
        <XAxis dataKey="index" hide />
        <YAxis hide domain={['auto', 'auto']} />
        <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
        {targetMs != null && (
          <ReferenceLine y={targetMs / 1000} stroke="var(--cube-green)" strokeDasharray="4 4" strokeOpacity={0.7} />
        )}
        <Area
          dataKey="seconds"
          type="monotone"
          stroke="var(--color-seconds)"
          fill="var(--color-seconds)"
          fillOpacity={0.12}
          strokeWidth={2}
          dot={false}
          isAnimationActive={false}
        />
      </AreaChart>
    </ChartContainer>
  )
}
