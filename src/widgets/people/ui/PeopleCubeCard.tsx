import { Card } from '@/components/ui/card'
import Image from 'next/image'
import { cubeCollection } from '@/shared/const/cube-collection'
import moment from 'moment'
import { Cube } from '@/entities/cube/model/types'
import { Separator } from '@/components/ui/separator'
import { useTranslations } from 'next-intl'
import formatTime from '@/shared/lib/formatTime'
import { Badge } from '@/components/ui/badge'
import { Trophy, History, CheckCircle2, AlertCircle, XCircle } from 'lucide-react'
import _ from 'lodash'

interface PeopleCubeCardProps {
  cube: Cube
}

export function PeopleCubeCard({ cube }: PeopleCubeCardProps) {
  const t = useTranslations('Index.CubesPage')
  const session = cube.solves.session || []
  const allSolves = [...(cube.solves.all || []), ...session].filter((s) => !s.isDeleted)

  const counts = session.reduce(
    (acc, s) => ({
      successCount: acc.successCount + (!s.dnf && !s.plus2 && !s.isDeleted ? 1 : 0),
      plus2Count: acc.plus2Count + (!s.dnf && s.plus2 && !s.isDeleted ? 1 : 0),
      dnfCount: acc.dnfCount + (s.dnf && !s.isDeleted ? 1 : 0)
    }),
    { successCount: 0, plus2Count: 0, dnfCount: 0 }
  )

  const { successCount, plus2Count, dnfCount } = counts
  const totalSession = successCount + plus2Count + dnfCount

  const validSolves = allSolves.filter((s) => !s.dnf)
  const pb = validSolves.length > 0 ? _.minBy(validSolves, (s) => s.time + (s.plus2 ? 2000 : 0)) : null
  const pbTime = pb ? pb.time + (pb.plus2 ? 2000 : 0) : null

  const successRate = totalSession > 0 ? (successCount / totalSession) * 100 : 0

  return (
    <Card
      key={cube.id}
      className={
        'group relative overflow-hidden flex flex-col p-5 transition-all duration-300 hover:shadow-lg border-muted/40 bg-card/50 backdrop-blur-sm'
      }
    >
      {/* Background Accent */}
      <div
        className={
          'absolute top-0 right-0 w-32 h-32 -mr-16 -mt-16 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-colors'
        }
      />

      <div className={'flex items-start justify-between mb-4'}>
        <div className={'flex items-center gap-4'}>
          <div className="relative">
            <div className="absolute inset-0 bg-primary/10 rounded-xl blur-sm group-hover:blur-md transition-all" />
            <Image
              unoptimized
              src={cubeCollection.find((item) => item.name === cube.category)?.src || ''}
              alt={cube.name}
              className={'relative object-scale-down rounded-xl p-2 bg-background border border-muted/50'}
              draggable={false}
              width={56}
              height={56}
            />
          </div>
          <div className={'flex flex-col'}>
            <div className={'text-lg font-bold tracking-tight'}>{cube.name}</div>
            <div className={'text-[10px] uppercase tracking-wider text-muted-foreground font-medium'}>
              {t('created')}: {moment(cube.createdAt).format('DD MMM YYYY')}
            </div>
          </div>
        </div>
        <Badge variant="secondary" className="font-mono text-xs">
          {cube.category}
        </Badge>
      </div>

      <div className={'grid grid-cols-2 gap-4 mb-4'}>
        <div className={'flex flex-col p-3 rounded-lg bg-muted/30 border border-muted/20'}>
          <div className="flex items-center gap-1.5 text-muted-foreground mb-1">
            <Trophy className="size-3.5 text-yellow-500" />
            <span className="text-[11px] font-semibold uppercase tracking-tight">Best Solve</span>
          </div>
          <div className="text-xl font-bold font-mono text-foreground">{pbTime ? formatTime(pbTime) : '--:--'}</div>
        </div>

        <div className={'flex flex-col p-3 rounded-lg bg-muted/30 border border-muted/20'}>
          <div className="flex items-center gap-1.5 text-muted-foreground mb-1">
            <History className="size-3.5 text-blue-500" />
            <span className="text-[11px] font-semibold uppercase tracking-tight">Session Solves</span>
          </div>
          <div className="text-xl font-bold font-mono text-foreground">{totalSession}</div>
        </div>
      </div>

      <Separator className="mb-4 opacity-50" />

      <div className={'flex items-center justify-between'}>
        <div className={'flex items-center gap-3'}>
          <div className="flex flex-col items-center">
            <div className="flex items-center gap-1 text-green-500 font-bold text-sm">
              <CheckCircle2 className="size-3" />
              {successCount}
            </div>
            <span className="text-[9px] text-muted-foreground uppercase font-bold">OK</span>
          </div>
          <Separator orientation="vertical" className="h-6" />
          <div className="flex flex-col items-center">
            <div className="flex items-center gap-1 text-yellow-500 font-bold text-sm">
              <AlertCircle className="size-3" />
              {plus2Count}
            </div>
            <span className="text-[9px] text-muted-foreground uppercase font-bold">+2</span>
          </div>
          <Separator orientation="vertical" className="h-6" />
          <div className="flex flex-col items-center">
            <div className="flex items-center gap-1 text-red-500 font-bold text-sm">
              <XCircle className="size-3" />
              {dnfCount}
            </div>
            <span className="text-[9px] text-muted-foreground uppercase font-bold">DNF</span>
          </div>
        </div>

        <div className="flex flex-col items-end">
          <div className="text-[10px] text-muted-foreground uppercase font-bold mb-0.5">Success Rate</div>
          <div className="flex items-center gap-2">
            <div className="w-16 h-1.5 bg-muted rounded-full overflow-hidden">
              <div className="h-full bg-green-500 transition-all duration-500" style={{ width: `${successRate}%` }} />
            </div>
            <span className="text-xs font-bold font-mono">{successRate.toFixed(0)}%</span>
          </div>
        </div>
      </div>
    </Card>
  )
}

export default PeopleCubeCard
