import { ChartPieIcon } from 'lucide-react'
import EmptyGraph from '@/shared/ui/empty-graph/EmptyGraph'
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent
} from '@/components/ui/chart'
import { Cell, Pie, PieChart } from 'recharts'
import formatTime from '@/shared/lib/formatTime'
import React, { useMemo } from 'react'
import { Cube } from '@/entities/cube/model/types'
import { CubeCategory } from '@/shared/const/cube-categories'
import { aggregateByCube } from '@/shared/lib/aggregateByCube'
import { COLORS } from '@/shared/const/graph-colors'
import { useTranslations } from 'next-intl'

interface PieGraphCategoryProps {
  cubes: Array<Cube>
  category?: CubeCategory
}

export default function PieGraphCategory({ cubes, category }: PieGraphCategoryProps) {
  const t = useTranslations('Index')
  const data = useMemo(() => {
    if (!category) return [] as ReturnType<typeof aggregateByCube>
    const safeCubes = cubes ?? []
    return aggregateByCube(safeCubes, category).filter((e) => e.solvesCount > 0 || e.totalTimeMs > 0)
  }, [cubes, category])

  const pieData = useMemo(() => {
    return data
      .filter((d) => d.totalTimeMs > 0)
      .map((d, i) => ({
        name: d.name,
        value: d.totalTimeMs,
        fill: COLORS[i % COLORS.length]
      }))
  }, [data])

  return (
    <div className="p-3 border rounded-md bg-background">
      <div className="flex items-center gap-2 mb-2 text-sm">
        <ChartPieIcon className={'size-4 text-muted-foreground'} />
        <span className="font-medium">{t('StatsPage.time-by-cube')}</span>
      </div>
      {pieData.length === 0 ? (
        <EmptyGraph />
      ) : (
        <ChartContainer
          className={'h-96'}
          config={pieData.reduce(
            (acc, it) => {
              acc[it.name] = { label: it.name, color: it.fill }
              return acc
            },
            {} as Record<string, { label: string; color: string }>
          )}
        >
          <PieChart>
            <Pie
              data={pieData}
              dataKey="value"
              nameKey="name"
              innerRadius={50}
              outerRadius={80}
              paddingAngle={2}
              strokeWidth={1}
            >
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Pie>
            <ChartTooltip
              cursor={{ fill: 'hsl(var(--muted))' }}
              content={
                <ChartTooltipContent
                  nameKey="name"
                  labelKey="name"
                  formatter={(value) => {
                    if (typeof value === 'number') {
                      return (
                        <>
                          <span className="text-gray-400">{t('SolvesPage.time')}</span>
                          <span className="ml-auto font-mono">{formatTime(value)}</span>
                        </>
                      )
                    }
                    return value as any
                  }}
                />
              }
            />
            <ChartLegend content={<ChartLegendContent nameKey="name" />} />
          </PieChart>
        </ChartContainer>
      )}
    </div>
  )
}
