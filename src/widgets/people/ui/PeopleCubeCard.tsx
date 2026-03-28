import Image from 'next/image'
import { cubeCollection } from '@/shared/const/cube-collection'
import moment from 'moment'
import { Cube } from '@/entities/cube/model/types'
import { useLocale, useTranslations } from 'next-intl'
import formatTime from '@/shared/lib/formatTime'
import { Badge } from '@/components/ui/badge'
import { Trophy } from 'lucide-react'
import _ from 'lodash'
import { motion } from 'framer-motion'

interface PeopleCubeCardProps {
  cube: Cube
}

export function PeopleCubeCard({ cube }: PeopleCubeCardProps) {
  const locale = useLocale()
  const t = useTranslations('Index.CubesPage')
  const allSolves = [...(cube.solves.all || []), ...(cube.solves.session || [])].filter((s) => !s.isDeleted)

  const counts = allSolves.reduce(
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
  const rateColor = successRate >= 80 ? 'text-green-500' : successRate >= 50 ? 'text-yellow-500' : 'text-red-500'
  const rateBg = successRate >= 80 ? 'bg-green-500' : successRate >= 50 ? 'bg-yellow-500' : 'bg-red-500'

  return (
    <motion.div
      key={cube.id}
      className="group relative overflow-hidden flex flex-col rounded-2xl border border-border/60 bg-card transition-colors duration-300 hover:border-border"
      whileHover={{ y: -3 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
    >
      {/* Top section — cube hero */}
      <div className="flex items-center gap-4 p-5 pb-4">
        <motion.div
          className="shrink-0"
          whileHover={{ rotate: -8, scale: 1.05 }}
          transition={{ type: 'spring', stiffness: 300, damping: 15 }}
        >
          <Image
            unoptimized
            src={cubeCollection.find((item) => item.name === cube.category)?.src || ''}
            alt={cube.name}
            className="object-scale-down rounded-xl p-2 bg-muted/40 border border-border/40"
            draggable={false}
            width={52}
            height={52}
          />
        </motion.div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <h3 className="text-base font-bold tracking-tight truncate">{cube.name}</h3>
            <Badge variant="outline" className="font-mono text-[10px] px-1.5 py-0 h-4 shrink-0">
              {cube.category}
            </Badge>
          </div>
          <div className="text-[10px] text-muted-foreground">
            {t('created')}: {moment(cube.createdAt).locale(locale).format('LL')}
          </div>
        </div>
      </div>

      {/* PB + Solves row */}
      <div className="flex items-stretch mx-5 mb-4 rounded-lg border border-border/40 overflow-hidden">
        <div className="flex-1 p-3 flex flex-col">
          <div className="flex items-center gap-1.5 mb-1">
            <Trophy className="size-3 text-yellow-500" />
            <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Best</span>
          </div>
          <div className="text-lg font-black font-mono tabular-nums">{pbTime ? formatTime(pbTime) : '--:--'}</div>
        </div>
        <div className="w-px bg-border/40" />
        <div className="flex-1 p-3 flex flex-col">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-1">Solves</span>
          <div className="text-lg font-black tabular-nums">{totalSession}</div>
        </div>
      </div>

      {/* Bottom — status breakdown */}
      <div className="px-5 pb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="size-2 rounded-full bg-green-500" />
            <span className="text-xs font-bold tabular-nums">{successCount}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="size-2 rounded-full bg-yellow-500" />
            <span className="text-xs font-bold tabular-nums">{plus2Count}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="size-2 rounded-full bg-red-500" />
            <span className="text-xs font-bold tabular-nums">{dnfCount}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="w-12 h-1 bg-muted rounded-full overflow-hidden">
            <div className={`h-full ${rateBg} transition-all duration-500`} style={{ width: `${successRate}%` }} />
          </div>
          <span className={`text-xs font-black tabular-nums ${rateColor}`}>{successRate.toFixed(0)}%</span>
        </div>
      </div>
    </motion.div>
  )
}

export default PeopleCubeCard
