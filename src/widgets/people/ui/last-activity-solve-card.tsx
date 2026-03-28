import Image from 'next/image'
import { cubeCollection } from '@/shared/const/cube-collection'
import moment from 'moment'
import formatTime from '@/shared/lib/formatTime'
import { Badge } from '@/components/ui/badge'
import ScrambleDisplay from '@/shared/ui/scramble-display/ui/ScrambleDisplay'
import { CubeCategory } from '@/shared/const/cube-categories'
import { useLocale } from 'next-intl'
import { motion } from 'framer-motion'
import { cn } from '@/shared/lib/utils'

interface LastActivitySolveCardProps {
  solve: {
    id: string
    time: number
    startTime: number
    endTime: number
    scramble: string
    dnf?: boolean
    plus2?: boolean
    category: CubeCategory
    cubeName: string
  }
  index: number
}

export function LastActivitySolveCard({ solve, index }: LastActivitySolveCardProps) {
  const cubeInfo = cubeCollection.find((item) => item.name === solve.category)
  const locale = useLocale()

  const statusColor = solve.dnf ? 'bg-red-500' : solve.plus2 ? 'bg-yellow-500' : 'bg-green-500'

  return (
    <motion.div
      className="group relative overflow-hidden flex flex-col rounded-2xl border border-border/60 bg-card transition-colors duration-300 hover:border-border"
      whileHover={{ y: -3 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
    >
      {/* Status accent bar */}
      <div className={cn('absolute left-0 top-0 bottom-0 w-1 rounded-l-2xl', statusColor)} />

      <div className="pl-5 pr-4 pt-4 pb-3">
        {/* Header: cube + meta */}
        <div className="flex items-center gap-3 mb-3">
          <Image
            unoptimized
            src={cubeInfo?.src || ''}
            alt={solve.category}
            className="object-scale-down rounded-lg p-1 bg-muted/40 border border-border/40"
            draggable={false}
            width={36}
            height={36}
          />
          <div className="flex-1 min-w-0">
            <div className="text-sm font-bold tracking-tight truncate">{solve.cubeName}</div>
            <div className="text-[10px] text-muted-foreground">
              {moment(solve.startTime).locale(locale).format('LLL')}
            </div>
          </div>
          <div className="flex flex-col items-end gap-1 shrink-0">
            <Badge variant="outline" className="text-[9px] font-mono px-1.5 py-0 h-4">
              {solve.category}
            </Badge>
            <span className="text-[10px] font-mono text-muted-foreground/50">#{index}</span>
          </div>
        </div>

        {/* Time + Scramble visual side by side */}
        <div className="flex items-center gap-3">
          <div className="flex-1">
            <div className="flex items-baseline gap-1.5">
              <span className="text-3xl font-black font-mono tracking-tighter tabular-nums">
                {formatTime(solve.time)}
              </span>
              {solve.dnf && <span className="text-xs font-bold text-red-500">DNF</span>}
              {solve.plus2 && <span className="text-xs font-bold text-yellow-500">+2</span>}
            </div>
          </div>

          <motion.div
            className="relative size-16 shrink-0 bg-muted/30 rounded-lg border border-border/30 flex items-center justify-center overflow-hidden"
            whileHover={{ scale: 1.1 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          >
            <ScrambleDisplay className="size-full p-0.5" show scramble={solve.scramble} event={solve.category} />
          </motion.div>
        </div>
      </div>

      {/* Scramble text — collapsible feel */}
      <div className="px-5 pb-3">
        <div className="text-[11px] font-mono leading-relaxed break-all text-muted-foreground/70 line-clamp-2 group-hover:text-muted-foreground transition-colors">
          {solve.scramble}
        </div>
      </div>
    </motion.div>
  )
}
