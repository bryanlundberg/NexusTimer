import { ChartBarDecreasingIcon } from 'lucide-react'
import EmptyGraph from '@/shared/ui/empty-graph/EmptyGraph'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'
import { Bar, BarChart, CartesianGrid, Cell, LabelList, XAxis, YAxis } from 'recharts'
import { BarsGraphCategoryProps } from '@/features/bars-chart-categories/model/types'
import useGraphCategories from '@/features/bars-chart-categories/model/useGraphCategories'

export default function BarsGraphCategories({ cubes, category }: BarsGraphCategoryProps) {
  const { data } = useGraphCategories({ cubes, category })
  return (
    <div className="p-3 border rounded-md bg-background min-h-[384px]">
      <div className="flex items-center gap-2 mb-2 text-sm">
        <ChartBarDecreasingIcon className={'size-4 text-muted-foreground'} />
        <span className="font-medium">Solves by Cube</span>
      </div>
      {data.length === 0 ? (
        <EmptyGraph />
      ) : (
        <ChartContainer
          className={'h-96'}
          config={data.reduce(
            (acc, it) => {
              acc[it.name] = { label: it.name, color: it.fill }
              return acc
            },
            {} as Record<string, { label: string; color: string }>
          )}
        >
          <BarChart data={data} layout="vertical" margin={{ left: 12, right: 8 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis type="number" tickLine={false} axisLine={false} />
            <YAxis dataKey="name" type="category" width={0} tickLine={false} axisLine={false} hide />
            <ChartTooltip
              cursor={{ fill: 'hsl(var(--muted))' }}
              content={
                <ChartTooltipContent
                  nameKey="name"
                  formatter={(value, name) => (
                    <>
                      <span className="text-gray-400">Solves</span>
                      <span className="ml-auto font-mono">{value as number}</span>
                    </>
                  )}
                />
              }
            />
            <Bar dataKey="solves" radius={3}>
              <LabelList dataKey="name" position="outside" offset={8} fill="#fff" />
              {data.map((entry, index) => (
                <Cell key={`bar-cell-${index}`} fill={entry.fill} />
              ))}
            </Bar>
          </BarChart>
        </ChartContainer>
      )}
    </div>
  )
}
