import { Card } from '@/components/ui/card'
import Image from 'next/image'
import { cubeCollection } from '@/shared/const/cube-collection'
import moment from 'moment'
import { Cube } from '@/entities/cube/model/types'
import { Label, Pie, PieChart } from 'recharts'
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'
import { Separator } from '@/components/ui/separator'

interface PeopleCubeCardProps {
  cube: Cube
}

export function PeopleCubeCard({ cube }: PeopleCubeCardProps) {
  const session = cube.solves.session || []
  const counts = session.reduce(
    (acc, s) => ({
      successCount: acc.successCount + (!s.dnf && !s.plus2 && !s.isDeleted ? 1 : 0),
      plus2Count: acc.plus2Count + (!s.dnf && s.plus2 && !s.isDeleted ? 1 : 0),
      dnfCount: acc.dnfCount + (s.dnf && !s.isDeleted ? 1 : 0)
    }),
    { successCount: 0, plus2Count: 0, dnfCount: 0 }
  )

  const { successCount, plus2Count, dnfCount } = counts
  const total = successCount + plus2Count + dnfCount

  const p1 = total > 0 ? (successCount / total) * 100 : 0

  const chartData = [
    { type: 'ok', value: successCount, fill: '#22c55e' },
    { type: '+2', value: plus2Count, fill: '#f59e0b' },
    { type: 'dnf', value: dnfCount, fill: '#ef4444' }
  ]
  const pieData = total > 0 ? chartData : [{ type: 'empty', value: 1, fill: '#e5e7eb' }]

  const chartConfig = {
    ok: {
      label: 'OK',
      color: 'var(--chart-1)'
    },
    '+2': {
      label: '+2',
      color: 'var(--chart-2)'
    },
    dnf: {
      label: 'DNF',
      color: 'var(--chart-3)'
    }
  } satisfies ChartConfig

  return (
    <Card key={cube.id} className={'flex gap-4 items-center justify-between p-4 flex-row @container'}>
      <div className={'flex items-center gap-4 grow'}>
        <Image
          unoptimized
          src={cubeCollection.find((item) => item.name === cube.category)?.src || ''}
          alt={cube.name}
          className={'object-scale-down rounded p-1'}
          draggable={false}
          width={64}
          height={64}
        />
        <div className={'flex flex-col space-y-1'}>
          <div className={'text-lg font-semibold'}>{cube.name}</div>
          <div className={'text-xs text-muted-foreground'}>Created: {moment(cube.createdAt).format('DD/MM/YYYY')}</div>
          <div className={'text-xs text-muted-foreground flex items-center gap-2'}>
            <div className="flex items-center gap-1 text-green-400">{successCount}</div>
            <Separator orientation="vertical" className="mr-2 data-[orientation=vertical]:h-4" />
            <div className="flex items-center gap-1 text-yellow-400">{plus2Count}</div>
            <Separator orientation="vertical" className="mr-2 data-[orientation=vertical]:h-4" />
            <div className="flex items-center gap-1 text-red-400">{dnfCount}</div>
          </div>
        </div>
      </div>

      <ChartContainer config={chartConfig} className="mx-auto h-24 w-24 shrink-0 hidden @xs:block">
        <PieChart width={96} height={96}>
          {total > 0 && <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />}
          <Pie data={pieData} dataKey="value" nameKey="type" innerRadius={28} outerRadius={32} strokeWidth={1}>
            <Label
              value={`${p1 === 100 ? '100' : p1.toFixed(1)}%`}
              position="center"
              fontSize={12}
              fontWeight={600}
              className={'fill-card-foreground'}
            />
          </Pie>
        </PieChart>
      </ChartContainer>
    </Card>
  )
}

export default PeopleCubeCard
